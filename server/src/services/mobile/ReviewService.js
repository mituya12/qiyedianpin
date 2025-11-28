const { query } = require('../../../utils/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../../utils/logger');
const { redisClient } = require('../../../utils/redis');
const CompanyService = require('./CompanyService');
const ContentSecurityService = require('../wechat/ContentSecurityService');

class ReviewService {
  /**
   * 获取企业评价列表
   * @param {String} companyName - 企业名称
   * @param {String} sortBy - 排序方式: newest/highest/lowest
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   */
  async getReviewList(companyName, sortBy = 'newest', page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      // 构建排序条件
      let orderBy = 'r.created_at DESC'; // 默认最新
      if (sortBy === 'highest') {
        orderBy = 'r.rating DESC, r.created_at DESC';
      } else if (sortBy === 'lowest') {
        orderBy = 'r.rating ASC, r.created_at DESC';
      }
      
      // 查询总数
      const countSql = `
        SELECT COUNT(*) as total
        FROM reviews r
        WHERE r.company_name = ? AND r.audit_status = 1
      `;
      const countResult = await query(countSql, [companyName]);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT 
          r.id, r.company_name as companyName, r.company_alias as companyAlias,
          r.user_id as userId, r.author_name as authorName, r.author_avatar as authorAvatar,
          r.status, r.department, r.is_branch as isBranch,
          r.rating, r.content, r.salary, r.benefits,
          r.likes, r.reply_count as replyCount,
          DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as date
        FROM reviews r
        WHERE r.company_name = ? AND r.audit_status = 1
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [companyName, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取评价列表失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取评价详情
   * @param {String} id - 评价ID
   */
  async getReviewDetail(id) {
    try {
      // 获取评价信息
      const reviewSql = `
        SELECT 
          r.id, r.company_name as companyName, r.company_alias as companyAlias,
          r.user_id as userId, r.author_name as authorName, r.author_avatar as authorAvatar,
          r.status, r.department, r.is_branch as isBranch,
          r.rating, r.content, r.salary, r.benefits,
          r.likes,
          DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as date
        FROM reviews r
        WHERE r.id = ?
      `;
      const reviewResult = await query(reviewSql, [id]);
      
      if (reviewResult.length === 0) {
        return null;
      }
      
      const review = reviewResult[0];
      
      // 获取回复列表
      const replySql = `
        SELECT 
          id, user_id as userId, author, author_avatar as authorAvatar,
          content, is_official as isOfficial,
          DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date
        FROM replies
        WHERE review_id = ? AND audit_status = 1
        ORDER BY created_at DESC
      `;
      const replies = await query(replySql, [id]);
      
      review.replies = replies;
      
      return review;
    } catch (error) {
      logger.error(`获取评价详情失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 发布评价
   * @param {String} userId - 用户ID
   * @param {Object} reviewData - 评价数据
   */
  async createReview(userId, reviewData) {
    try {
      const {
        companyName,
        companyAlias,
        status,
        department,
        isBranch,
        rating,
        content,
        salary,
        benefits
      } = reviewData;
      
      // 获取用户信息
      const userSql = 'SELECT name, avatar FROM users WHERE id = ?';
      const userResult = await query(userSql, [userId]);
      const user = userResult[0];
      
      // 确保企业存在
      await CompanyService.createCompany({ companyName, alias: companyAlias });
      
      // 调用微信API检测内容
      const checkResult = await ContentSecurityService.checkContent(content);
      const auditStatus = ContentSecurityService.getAuditStatus(checkResult);
      
      logger.info(`内容检测结果: isValid=${checkResult.isValid}, auditStatus=${auditStatus}`);
      
      // 创建评价
      const insertSql = `
        INSERT INTO reviews (
          user_id, author_name, author_avatar,
          company_name, company_alias,
          status, department, is_branch, rating, content,
          salary, benefits, audit_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const result = await query(insertSql, [
        userId,
        user.name,
        user.avatar,
        companyName,
        companyAlias || '',
        status,
        department,
        isBranch ? 1 : 0,
        rating,
        content,
        salary || '',
        benefits || '',
        auditStatus
      ]);
      
      const reviewId = result.insertId;
      
      // 如果审核通过,立即更新企业评分
      if (auditStatus === 1) {
        await CompanyService.updateCompanyRating(companyName);
        logger.info(`企业评分已更新: ${companyName}`);
      }
      
      logger.info(`发布评价成功: ${reviewId}, 审核状态: ${auditStatus}`);
      return { reviewId, auditStatus };
    } catch (error) {
      logger.error(`发布评价失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除评价
   * @param {String} id - 评价ID
   * @param {String} userId - 用户ID
   */
  async deleteReview(id, userId) {
    try {
      // 检查评价是否属于该用户
      const checkSql = 'SELECT user_id as userId, company_name as companyName FROM reviews WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('评价不存在');
      }
      
      if (checkResult[0].userId !== userId) {
        throw new Error('无权删除此评价');
      }
      
      const companyName = checkResult[0].companyName;
      
      // 删除评价
      const deleteSql = 'DELETE FROM reviews WHERE id = ?';
      await query(deleteSql, [id]);
      
      // 删除相关回复
      const deleteReplySql = 'DELETE FROM replies WHERE review_id = ?';
      await query(deleteReplySql, [id]);
      
      // 更新企业评分
      await CompanyService.updateCompanyRating(companyName);
      
      logger.info(`删除评价成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除评价失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 点赞评价
   * @param {String} id - 评价ID
   * @param {String} userId - 用户ID
   */
  async likeReview(id, userId) {
    try {
      // 检查评价是否存在
      const checkSql = 'SELECT id FROM reviews WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('评价不存在');
      }
      
      // 使用Redis检查是否已点赞
      const likeKey = `review:like:${id}:${userId}`;
      const hasLiked = await redisClient.exists(likeKey);
      
      if (hasLiked) {
        throw new Error('已经点赞过了');
      }
      
      // 记录点赞(设置过期时间为30天)
      await redisClient.setEx(likeKey, 30 * 24 * 60 * 60, '1');
      
      // 更新点赞数
      const updateSql = 'UPDATE reviews SET likes = likes + 1 WHERE id = ?';
      await query(updateSql, [id]);
      
      // 获取最新点赞数
      const likeSql = 'SELECT likes FROM reviews WHERE id = ?';
      const likeResult = await query(likeSql, [id]);
      
      logger.info(`点赞评价成功: ${id}`);
      return { likes: likeResult[0].likes };
    } catch (error) {
      logger.error(`点赞评价失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取我的评价列表
   * @param {String} userId - 用户ID
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   */
  async getMyReviewList(userId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      // 查询总数
      const countSql = 'SELECT COUNT(*) as total FROM reviews WHERE user_id = ?';
      const countResult = await query(countSql, [userId]);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT 
          r.id, r.company_name as companyName, r.company_alias as companyAlias,
          r.content, r.rating, r.likes, r.reply_count as replyCount,
          DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as date
        FROM reviews r
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [userId, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取我的评价列表失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReviewService();
