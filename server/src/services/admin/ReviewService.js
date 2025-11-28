const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');
const CompanyService = require('./CompanyService');

class ReviewService {
  async getReviewList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { reviewId, companyName, authorName, status, rating, isBranch, auditStatus, startDate, endDate } = filters;
      
      let whereClauses = [];
      let params = [];
      
      if (reviewId) {
        whereClauses.push('r.id = ?');
        params.push(reviewId);
      }
      if (companyName) {
        whereClauses.push('r.company_name LIKE ?');
        params.push(`%${companyName}%`);
      }
      if (authorName) {
        whereClauses.push('r.author_name LIKE ?');
        params.push(`%${authorName}%`);
      }
      if (status) {
        whereClauses.push('r.status = ?');
        params.push(status);
      }
      if (rating) {
        whereClauses.push('r.rating = ?');
        params.push(rating);
      }
      if (isBranch !== undefined && isBranch !== '') {
        whereClauses.push('r.is_branch = ?');
        params.push(isBranch);
      }
      if (auditStatus !== undefined && auditStatus !== '') {
        whereClauses.push('r.audit_status = ?');
        params.push(auditStatus);
      }
      if (startDate) {
        whereClauses.push('DATE(r.created_at) >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('DATE(r.created_at) <= ?');
        params.push(endDate);
      }
      
      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
      
      const countSql = `
        SELECT COUNT(*) as total
        FROM reviews r
        ${whereSQL}
      `;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      const listSql = `
        SELECT 
          r.id, r.company_name as companyName, r.company_alias as companyAlias,
          r.user_id as userId, r.author_name as authorName,
          r.status, r.department, r.is_branch as isBranch,
          r.rating, r.content, r.likes, r.reply_count as replyCount,
          r.audit_status as auditStatus,
          DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as date
        FROM reviews r
        ${whereSQL}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取评价列表失败: ${error.message}`);
      throw error;
    }
  }

  async getReviewDetail(id) {
    try {
      const sql = `
        SELECT 
          r.id, r.company_name as companyName, r.company_alias as companyAlias,
          r.user_id as userId, r.author_name as authorName,
          r.author_avatar as authorAvatar,
          r.status, r.department, r.is_branch as isBranch,
          r.rating, r.content, r.salary, r.benefits,
          r.likes, r.reply_count as replyCount,
          r.audit_status as auditStatus,
          DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as date,
          r.created_at as createdAt,
          r.updated_at as updatedAt
        FROM reviews r
        WHERE r.id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取评价详情失败: ${error.message}`);
      throw error;
    }
  }

  async updateReview(id, reviewData) {
    try {
      const { status, department, isBranch, rating, content, salary, benefits, auditStatus } = reviewData;
      
      const checkSql = 'SELECT company_name FROM reviews WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('评价不存在');
      }
      
      const updates = [];
      const params = [];
      
      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }
      if (department !== undefined) {
        updates.push('department = ?');
        params.push(department);
      }
      if (isBranch !== undefined) {
        updates.push('is_branch = ?');
        params.push(isBranch ? 1 : 0);
      }
      if (rating !== undefined) {
        updates.push('rating = ?');
        params.push(rating);
      }
      if (content !== undefined) {
        updates.push('content = ?');
        params.push(content);
      }
      if (salary !== undefined) {
        updates.push('salary = ?');
        params.push(salary);
      }
      if (benefits !== undefined) {
        updates.push('benefits = ?');
        params.push(benefits);
      }
      if (auditStatus !== undefined) {
        updates.push('audit_status = ?');
        params.push(auditStatus);
      }
      
      if (updates.length === 0) {
        return true;
      }
      
      params.push(id);
      const updateSql = `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`;
      await query(updateSql, params);
      
      if (rating !== undefined || auditStatus !== undefined) {
        const companyName = checkResult[0].company_name;
        await CompanyService.updateCompanyRating(companyName);
      }
      
      logger.info(`编辑评价成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`编辑评价失败: ${error.message}`);
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      const checkSql = 'SELECT company_name FROM reviews WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('评价不存在');
      }
      
      const companyName = checkResult[0].company_name;
      
      await query('DELETE FROM replies WHERE review_id = ?', [id]);
      await query('DELETE FROM reviews WHERE id = ?', [id]);
      
      await CompanyService.updateCompanyRating(companyName);
      
      logger.info(`删除评价成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除评价失败: ${error.message}`);
      throw error;
    }
  }

  async auditReview(id, auditStatus, remark) {
    try {
      const checkSql = 'SELECT company_name FROM reviews WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('评价不存在');
      }
      
      const updateSql = 'UPDATE reviews SET audit_status = ? WHERE id = ?';
      await query(updateSql, [auditStatus, id]);
      
      if (auditStatus === 1) {
        const companyName = checkResult[0].company_name;
        await CompanyService.updateCompanyRating(companyName);
      }
      
      logger.info(`审核评价成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`审核评价失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReviewService();
