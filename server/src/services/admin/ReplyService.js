const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class ReplyService {
  async getReplyList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { replyId, author, reviewId, isOfficial, auditStatus, startDate, endDate } = filters;
      
      let whereClauses = [];
      let params = [];
      
      if (replyId) {
        whereClauses.push('rp.id = ?');
        params.push(replyId);
      }
      if (author) {
        whereClauses.push('rp.author LIKE ?');
        params.push(`%${author}%`);
      }
      if (reviewId) {
        whereClauses.push('rp.review_id = ?');
        params.push(reviewId);
      }
      if (isOfficial !== undefined && isOfficial !== '') {
        whereClauses.push('rp.is_official = ?');
        params.push(isOfficial);
      }
      if (auditStatus !== undefined && auditStatus !== '') {
        whereClauses.push('rp.audit_status = ?');
        params.push(auditStatus);
      }
      if (startDate) {
        whereClauses.push('DATE(rp.created_at) >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('DATE(rp.created_at) <= ?');
        params.push(endDate);
      }
      
      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
      
      const countSql = `
        SELECT COUNT(*) as total
        FROM replies rp
        ${whereSQL}
      `;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      const listSql = `
        SELECT 
          rp.id, rp.review_id as reviewId,
          r.company_name as companyName, r.author_name as reviewAuthor,
          rp.user_id as userId, rp.author,
          rp.content, rp.is_official as isOfficial,
          rp.audit_status as auditStatus,
          DATE_FORMAT(rp.created_at, '%Y-%m-%d %H:%i:%s') as date
        FROM replies rp
        LEFT JOIN reviews r ON rp.review_id = r.id
        ${whereSQL}
        ORDER BY rp.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取回复列表失败: ${error.message}`);
      throw error;
    }
  }

  async getReplyDetail(id) {
    try {
      const sql = `
        SELECT 
          rp.id, rp.review_id as reviewId,
          r.company_name as companyName, r.author_name as reviewAuthor,
          rp.user_id as userId, rp.author, rp.author_avatar as authorAvatar,
          rp.content, rp.is_official as isOfficial,
          rp.audit_status as auditStatus,
          DATE_FORMAT(rp.created_at, '%Y-%m-%d %H:%i:%s') as date,
          rp.created_at as createdAt,
          rp.updated_at as updatedAt
        FROM replies rp
        LEFT JOIN reviews r ON rp.review_id = r.id
        WHERE rp.id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取回复详情失败: ${error.message}`);
      throw error;
    }
  }

  async updateReply(id, replyData) {
    try {
      const { content, isOfficial, auditStatus } = replyData;
      
      const checkSql = 'SELECT id FROM replies WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('回复不存在');
      }
      
      const updates = [];
      const params = [];
      
      if (content !== undefined) {
        updates.push('content = ?');
        params.push(content);
      }
      if (isOfficial !== undefined) {
        updates.push('is_official = ?');
        params.push(isOfficial ? 1 : 0);
      }
      if (auditStatus !== undefined) {
        updates.push('audit_status = ?');
        params.push(auditStatus);
      }
      
      if (updates.length === 0) {
        return true;
      }
      
      params.push(id);
      const updateSql = `UPDATE replies SET ${updates.join(', ')} WHERE id = ?`;
      await query(updateSql, params);
      
      logger.info(`编辑回复成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`编辑回复失败: ${error.message}`);
      throw error;
    }
  }

  async deleteReply(id) {
    try {
      const checkSql = 'SELECT review_id FROM replies WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('回复不存在');
      }
      
      const reviewId = checkResult[0].review_id;
      
      await query('DELETE FROM replies WHERE id = ?', [id]);
      await query('UPDATE reviews SET reply_count = reply_count - 1 WHERE id = ? AND reply_count > 0', [reviewId]);
      
      logger.info(`删除回复成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除回复失败: ${error.message}`);
      throw error;
    }
  }

  async auditReply(id, auditStatus, remark) {
    try {
      const checkSql = 'SELECT id FROM replies WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('回复不存在');
      }
      
      const updateSql = 'UPDATE replies SET audit_status = ? WHERE id = ?';
      await query(updateSql, [auditStatus, id]);
      
      logger.info(`审核回复成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`审核回复失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReplyService();
