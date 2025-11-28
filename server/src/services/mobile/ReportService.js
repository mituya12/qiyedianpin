const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class ReportService {
  /**
   * 提交举报
   * @param {String} userId - 用户ID
   * @param {Object} reportData - 举报数据
   */
  async createReport(userId, reportData) {
    try {
      const { contentType, contentId, reason, description } = reportData;
      
      // 验证contentType
      if (!['review', 'reply'].includes(contentType)) {
        throw new Error('举报类型错误');
      }
      
      // 检查被举报内容是否存在
      const tableName = contentType === 'review' ? 'reviews' : 'replies';
      const checkSql = `SELECT id FROM ${tableName} WHERE id = ?`;
      const checkResult = await query(checkSql, [contentId]);
      
      if (checkResult.length === 0) {
        throw new Error('被举报内容不存在');
      }
      
      // 检查是否已举报过
      const existSql = `
        SELECT id FROM reports
        WHERE user_id = ? AND content_type = ? AND content_id = ?
      `;
      const existResult = await query(existSql, [userId, contentType, contentId]);
      
      if (existResult.length > 0) {
        throw new Error('您已举报过该内容');
      }
      
      // 创建举报
      const insertSql = `
        INSERT INTO reports (
          user_id, content_type, content_id, reason, description, status
        ) VALUES (?, ?, ?, ?, ?, 0)
      `;
      
      const result = await query(insertSql, [
        userId,
        contentType,
        contentId,
        reason,
        description || ''
      ]);
      
      logger.info(`提交举报成功: ${result.insertId}`);
      return { reportId: result.insertId };
    } catch (error) {
      logger.error(`提交举报失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReportService();
