const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');
const ContentSecurityService = require('../wechat/ContentSecurityService');

class ReplyService {
  /**
   * 发布回复
   * @param {String} userId - 用户ID
   * @param {Object} replyData - 回复数据
   */
  async createReply(userId, replyData) {
    try {
      const { reviewId, content } = replyData;
      
      // 检查评价是否存在
      const checkSql = 'SELECT id FROM reviews WHERE id = ?';
      const reviewCheckResult = await query(checkSql, [reviewId]);
      
      if (reviewCheckResult.length === 0) {
        throw new Error('评价不存在');
      }
      
      // 获取用户信息
      const userSql = 'SELECT name, avatar FROM users WHERE id = ?';
      const userResult = await query(userSql, [userId]);
      const user = userResult[0];
      
      // 调用微信API检测内容
      const securityCheckResult = await ContentSecurityService.checkContent(content);
      const auditStatus = ContentSecurityService.getAuditStatus(securityCheckResult);
      
      logger.info(`内容检测结果: isValid=${securityCheckResult.isValid}, auditStatus=${auditStatus}`);
      
      // 创建回复
      const insertSql = `
        INSERT INTO replies (
          review_id, user_id, author, author_avatar,
          content, is_official, date, audit_status
        ) VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, ?)
      `;
      
      const result = await query(insertSql, [
        reviewId,
        userId,
        user.name,
        user.avatar,
        content,
        auditStatus
      ]);
      
      const replyId = result.insertId;
      
      // 更新评价的回复数
      const updateSql = 'UPDATE reviews SET reply_count = reply_count + 1 WHERE id = ?';
      await query(updateSql, [reviewId]);
      
      logger.info(`发布回复成功: ${replyId}, 审核状态: ${auditStatus}`);
      return { replyId, auditStatus };
    } catch (error) {
      logger.error(`发布回复失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取我的回复列表
   * @param {String} userId - 用户ID
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   */
  async getMyReplyList(userId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      // 查询总数
      const countSql = 'SELECT COUNT(*) as total FROM replies WHERE user_id = ?';
      const countResult = await query(countSql, [userId]);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT 
          rp.id, rp.review_id as reviewId,
          r.company_name as companyName, r.company_alias as companyAlias,
          r.author_name as reviewAuthor,
          rp.content,
          DATE_FORMAT(rp.created_at, '%Y-%m-%d') as date
        FROM replies rp
        LEFT JOIN reviews r ON rp.review_id = r.id
        WHERE rp.user_id = ?
        ORDER BY rp.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [userId, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取我的回复列表失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReplyService();
