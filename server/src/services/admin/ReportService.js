const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');
const CompanyService = require('./CompanyService');

class ReportService {
  async getReportList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { reportId, userName, contentType, reason, status, startDate, endDate } = filters;
      
      let whereClauses = [];
      let params = [];
      
      if (reportId) {
        whereClauses.push('r.id = ?');
        params.push(reportId);
      }
      if (userName) {
        whereClauses.push('u.name LIKE ?');
        params.push(`%${userName}%`);
      }
      if (contentType) {
        whereClauses.push('r.content_type = ?');
        params.push(contentType);
      }
      if (reason) {
        whereClauses.push('r.reason LIKE ?');
        params.push(`%${reason}%`);
      }
      if (status !== undefined && status !== '') {
        whereClauses.push('r.status = ?');
        params.push(status);
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
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        ${whereSQL}
      `;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      const listSql = `
        SELECT 
          r.id, r.user_id as userId, u.name as userName,
          r.content_type as contentType, r.content_id as contentId,
          r.reason, r.description, r.status,
          r.created_at as createdAt
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        ${whereSQL}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取举报列表失败: ${error.message}`);
      throw error;
    }
  }

  async getReportDetail(id) {
    try {
      const sql = `
        SELECT 
          r.id, r.user_id as userId, u.name as userName,
          r.content_type as contentType, r.content_id as contentId,
          r.reason, r.description, r.status, r.result,
          r.created_at as createdAt,
          r.updated_at as updatedAt
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取举报详情失败: ${error.message}`);
      throw error;
    }
  }

  async handleReport(id, status, result) {
    try {
      // 获取举报详情
      const checkSql = 'SELECT content_type, content_id FROM reports WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('举报不存在');
      }
      
      const report = checkResult[0];
      
      // 更新举报状态
      const updateSql = 'UPDATE reports SET status = ?, result = ? WHERE id = ?';
      await query(updateSql, [status, result || '', id]);
      
      // 如果举报成立(status=1),删除被举报的内容并更新企业评分
      if (status === 1) {
        if (report.content_type === 'review') {
          // 删除评价
          const reviewSql = 'SELECT company_name FROM reviews WHERE id = ?';
          const reviewResult = await query(reviewSql, [report.content_id]);
          
          if (reviewResult.length > 0) {
            const companyName = reviewResult[0].company_name;
            
            // 删除评价关联的所有回复
            await query('DELETE FROM replies WHERE review_id = ?', [report.content_id]);
            
            // 删除评价
            await query('DELETE FROM reviews WHERE id = ?', [report.content_id]);
            
            // 更新企业评分
            await CompanyService.updateCompanyRating(companyName);
            
            logger.info(`举报成立,已删除评价: ${report.content_id},更新企业评分: ${companyName}`);
          }
        } else if (report.content_type === 'reply') {
          // 删除回复
          const replySql = 'SELECT review_id FROM replies WHERE id = ?';
          const replyResult = await query(replySql, [report.content_id]);
          
          if (replyResult.length > 0) {
            const reviewId = replyResult[0].review_id;
            
            // 获取评价的企业名称
            const reviewSql = 'SELECT company_name FROM reviews WHERE id = ?';
            const reviewResult = await query(reviewSql, [reviewId]);
            
            if (reviewResult.length > 0) {
              const companyName = reviewResult[0].company_name;
              
              // 删除回复
              await query('DELETE FROM replies WHERE id = ?', [report.content_id]);
              
              // 更新评价的回复数
              await query('UPDATE reviews SET reply_count = reply_count - 1 WHERE id = ?', [reviewId]);
              
              // 更新企业评分
              await CompanyService.updateCompanyRating(companyName);
              
              logger.info(`举报成立,已删除回复: ${report.content_id},更新企业评分: ${companyName}`);
            }
          }
        }
      }
      
      logger.info(`处理举报成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`处理举报失败: ${error.message}`);
      throw error;
    }
  }

  async deleteReport(id) {
    try {
      const checkSql = 'SELECT id FROM reports WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('举报不存在');
      }
      
      await query('DELETE FROM reports WHERE id = ?', [id]);
      
      logger.info(`删除举报成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除举报失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReportService();
