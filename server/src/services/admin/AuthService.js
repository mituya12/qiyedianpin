const { query } = require('../../../utils/db');
const { md5 } = require('../../../utils/md5');
const logger = require('../../../utils/logger');

class AuthService {
  /**
   * 管理员登录
   * @param {String} username - 用户名
   * @param {String} password - 密码
   */
  async login(username, password) {
    try {
      // MD5加密密码
      const hashedPassword = md5(password);
      
      // 查询管理员
      const sql = `
        SELECT id, username, name, role, status
        FROM admins
        WHERE username = ? AND password = ?
      `;
      const result = await query(sql, [username, hashedPassword]);
      
      if (result.length === 0) {
        throw new Error('用户名或密码错误');
      }
      
      const admin = result[0];
      
      // 检查账号状态
      if (admin.status === 0) {
        throw new Error('账号已被禁用');
      }
      
      // 更新最后登录时间
      const updateSql = 'UPDATE admins SET last_login_at = NOW() WHERE id = ?';
      await query(updateSql, [admin.id]);
      
      logger.info(`管理员登录成功: ${username}`);
      return admin;
    } catch (error) {
      logger.error(`管理员登录失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取管理员信息
   * @param {Number} id - 管理员ID
   */
  async getAdminInfo(id) {
    try {
      const sql = `
        SELECT id, username, name, role, status
        FROM admins
        WHERE id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取管理员信息失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();
