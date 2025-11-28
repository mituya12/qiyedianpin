const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class FeedbackService {
  /**
   * 获取反馈列表
   * @param {Object} filters - 过滤条件
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   */
  async getFeedbackList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { feedbackId, userName, category, status, startDate, endDate } = filters;

      let whereClauses = [];
      let params = [];

      if (feedbackId) {
        whereClauses.push('f.id = ?');
        params.push(feedbackId);
      }
      if (userName) {
        whereClauses.push('f.user_name LIKE ?');
        params.push(`%${userName}%`);
      }
      if (category) {
        whereClauses.push('f.category = ?');
        params.push(category);
      }
      if (status !== undefined && status !== '') {
        whereClauses.push('f.status = ?');
        params.push(status);
      }
      if (startDate) {
        whereClauses.push('DATE(f.created_at) >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('DATE(f.created_at) <= ?');
        params.push(endDate);
      }

      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

      const countSql = `
        SELECT COUNT(*) as total
        FROM feedbacks f
        ${whereSQL}
      `;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;

      const listSql = `
        SELECT 
          f.id, f.user_id as userId, f.user_name as userName, 
          CONCAT(f.contact, '') as contact,
          f.category, CONCAT(f.content, '') as content, f.status,
          DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
          DATE_FORMAT(f.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt
        FROM feedbacks f
        ${whereSQL}
        ORDER BY f.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);

      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取反馈列表失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取反馈详情
   * @param {Number} id - 反馈ID
   */
  async getFeedbackDetail(id) {
    try {
      const sql = `
        SELECT 
          f.id, f.user_id as userId, f.user_name as userName, 
          CONCAT(f.contact, '') as contact,
          f.category, CONCAT(f.content, '') as content, f.status, 
          CONCAT(f.reply, '') as reply,
          DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
          DATE_FORMAT(f.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt
        FROM feedbacks f
        WHERE f.id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取反馈详情失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 处理反馈(回复)
   * @param {Number} id - 反馈ID
   * @param {String} reply - 管理员回复
   * @param {Number} status - 处理状态
   */
  async handleFeedback(id, reply, status = 1) {
    try {
      const checkSql = 'SELECT id FROM feedbacks WHERE id = ?';
      const checkResult = await query(checkSql, [id]);

      if (checkResult.length === 0) {
        throw new Error('反馈不存在');
      }

      const updateSql = 'UPDATE feedbacks SET reply = ?, status = ? WHERE id = ?';
      await query(updateSql, [reply, status, id]);

      logger.info(`处理反馈成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`处理反馈失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 更新反馈状态
   * @param {Number} id - 反馈ID
   * @param {Number} status - 状态: 0待处理 1已处理 2已关闭
   */
  async updateFeedbackStatus(id, status) {
    try {
      const updateSql = 'UPDATE feedbacks SET status = ? WHERE id = ?';
      await query(updateSql, [status, id]);

      logger.info(`更新反馈状态成功: ${id}, 状态: ${status}`);
      return true;
    } catch (error) {
      logger.error(`更新反馈状态失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除反馈
   * @param {Number} id - 反馈ID
   */
  async deleteFeedback(id) {
    try {
      const checkSql = 'SELECT id FROM feedbacks WHERE id = ?';
      const checkResult = await query(checkSql, [id]);

      if (checkResult.length === 0) {
        throw new Error('反馈不存在');
      }

      await query('DELETE FROM feedbacks WHERE id = ?', [id]);

      logger.info(`删除反馈成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除反馈失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new FeedbackService();
