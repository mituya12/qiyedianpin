const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class UserService {
  /**
   * 获取用户列表
   */
  async getUserList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { name, userId, status, startDate, endDate } = filters;
      
      // 构建查询条件
      let whereClauses = [];
      let params = [];
      
      if (name) {
        whereClauses.push('u.name LIKE ?');
        params.push(`%${name}%`);
      }
      if (userId) {
        whereClauses.push('u.id = ?');
        params.push(userId);
      }
      if (status !== undefined && status !== '') {
        whereClauses.push('u.status = ?');
        params.push(status);
      }
      if (startDate) {
        whereClauses.push('DATE(u.created_at) >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('DATE(u.created_at) <= ?');
        params.push(endDate);
      }
      
      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
      
      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM users u ${whereSQL}`;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT 
          u.id, u.name, u.avatar, u.bio, u.status,
          (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as reviewCount,
          (SELECT COUNT(*) FROM replies WHERE user_id = u.id) as replyCount,
          (SELECT COALESCE(SUM(likes), 0) FROM reviews WHERE user_id = u.id) as totalLikes,
          u.created_at as createdAt,
          u.last_login_at as lastLoginAt
        FROM users u
        ${whereSQL}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取用户列表失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(id) {
    try {
      const sql = `
        SELECT 
          u.id, u.name, u.avatar, u.bio, u.status,
          (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as reviewCount,
          (SELECT COUNT(*) FROM replies WHERE user_id = u.id) as replyCount,
          (SELECT COALESCE(SUM(likes), 0) FROM reviews WHERE user_id = u.id) as totalLikes,
          u.created_at as createdAt,
          u.updated_at as updatedAt,
          u.last_login_at as lastLoginAt
        FROM users u
        WHERE u.id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取用户详情失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 编辑用户
   */
  async updateUser(id, userData) {
    try {
      const { name, avatar, bio, status } = userData;
      
      // 检查用户是否存在
      const checkSql = 'SELECT id FROM users WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('用户不存在');
      }
      
      // 构建更新字段
      const updates = [];
      const params = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (avatar !== undefined) {
        updates.push('avatar = ?');
        params.push(avatar);
      }
      if (bio !== undefined) {
        updates.push('bio = ?');
        params.push(bio);
      }
      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }
      
      if (updates.length === 0) {
        return true;
      }
      
      params.push(id);
      const updateSql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      await query(updateSql, params);
      
      logger.info(`编辑用户成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`编辑用户失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id) {
    try {
      // 检查用户是否存在
      const checkSql = 'SELECT id FROM users WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('用户不存在');
      }
      
      // 删除用户相关的评价和回复
      const reviewsSql = 'SELECT id FROM reviews WHERE user_id = ?';
      const reviews = await query(reviewsSql, [id]);
      
      for (const review of reviews) {
        await query('DELETE FROM replies WHERE review_id = ?', [review.id]);
      }
      
      await query('DELETE FROM reviews WHERE user_id = ?', [id]);
      await query('DELETE FROM replies WHERE user_id = ?', [id]);
      await query('DELETE FROM reports WHERE user_id = ?', [id]);
      
      // 删除用户
      const deleteSql = 'DELETE FROM users WHERE id = ?';
      await query(deleteSql, [id]);
      
      logger.info(`删除用户成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除用户失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserService();
