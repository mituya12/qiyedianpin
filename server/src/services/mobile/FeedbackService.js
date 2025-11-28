const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class FeedbackService {
  /**
   * 提交反馈
   * @param {Number} userId - 用户ID
   * @param {Object} feedbackData - 反馈数据
   */
  async createFeedback(userId, feedbackData) {
    try {
      const { category, content, contact } = feedbackData;

      logger.info(`接收到反馈数据: category=${category}, content=${content}, contact=${contact}`);

      // 参数验证
      if (!category || !content) {
        throw new Error('缺少必填参数');
      }

      // 获取用户信息
      const userSql = 'SELECT name FROM users WHERE id = ?';
      const userResult = await query(userSql, [userId]);
      if (userResult.length === 0) {
        throw new Error('用户不存在');
      }

      const userName = userResult[0].name;

      // 创建反馈
      const insertSql = `
        INSERT INTO feedbacks (
          user_id, user_name, contact, category, content, status
        ) VALUES (?, ?, ?, ?, ?, 0)
      `;

      const result = await query(insertSql, [
        userId,
        userName,
        contact || '',
        category,
        content
      ]);

      const feedbackId = result.insertId;
      logger.info(`提交反馈成功: ${feedbackId}`);
      return { feedbackId };
    } catch (error) {
      logger.error(`提交反馈失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取我的反馈列表
   * @param {Number} userId - 用户ID
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   */
  async getMyFeedbackList(userId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;

      // 查询总数
      const countSql = 'SELECT COUNT(*) as total FROM feedbacks WHERE user_id = ?';
      const countResult = await query(countSql, [userId]);
      const total = countResult[0].total;

      // 查询列表
      const listSql = `
        SELECT 
          id, category, CONCAT(content, '') as content, status,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
          DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt
        FROM feedbacks
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [userId, pageSize, offset]);

      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取我的反馈列表失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取反馈详情
   * @param {Number} feedbackId - 反馈ID
   * @param {Number} userId - 用户ID(用于权限验证)
   */
  async getFeedbackDetail(feedbackId, userId) {
    try {
      const sql = `
        SELECT 
          id, user_id as userId, user_name as userName, 
          CONCAT(contact, '') as contact,
          category, CONCAT(content, '') as content, status, 
          CONCAT(reply, '') as reply,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
          DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt
        FROM feedbacks
        WHERE id = ? AND user_id = ?
      `;
      const result = await query(sql, [feedbackId, userId]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取反馈详情失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new FeedbackService();
