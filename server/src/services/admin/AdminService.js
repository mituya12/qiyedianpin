const { query } = require('../../../utils/db');
const { md5 } = require('../../../utils/md5');
const logger = require('../../../utils/logger');

class AdminService {
  /**
   * 获取管理员列表
   */
  async getAdminList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { username, name, role, status } = filters;
      
      // 构建查询条件
      let whereClauses = [];
      let params = [];
      
      if (username) {
        whereClauses.push('username LIKE ?');
        params.push(`%${username}%`);
      }
      if (name) {
        whereClauses.push('name LIKE ?');
        params.push(`%${name}%`);
      }
      if (role) {
        whereClauses.push('role = ?');
        params.push(role);
      }
      if (status !== undefined && status !== '') {
        whereClauses.push('status = ?');
        params.push(status);
      }
      
      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
      
      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM admins ${whereSQL}`;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT 
          id, username, name, role, status, remark,
          last_login_at as lastLoginAt,
          created_at as createdAt
        FROM admins
        ${whereSQL}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取管理员列表失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 新增管理员
   */
  async createAdmin(adminData) {
    try {
      const { username, password, name, role, status, remark } = adminData;
      
      // 检查用户名是否已存在
      const checkSql = 'SELECT id FROM admins WHERE username = ?';
      const checkResult = await query(checkSql, [username]);
      
      if (checkResult.length > 0) {
        throw new Error('用户名已存在');
      }
      
      // MD5加密密码
      const hashedPassword = md5(password);
      
      // 插入管理员
      const insertSql = `
        INSERT INTO admins (username, password, name, role, status, remark)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await query(insertSql, [
        username,
        hashedPassword,
        name,
        role,
        status !== undefined ? status : 1,
        remark || ''
      ]);
      
      logger.info(`新增管理员成功: ${username}`);
      return { adminId: result.insertId };
    } catch (error) {
      logger.error(`新增管理员失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 编辑管理员
   */
  async updateAdmin(id, adminData) {
    try {
      const { name, password, role, status, remark } = adminData;
      
      // 检查管理员是否存在
      const checkSql = 'SELECT id FROM admins WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('管理员不存在');
      }
      
      // 构建更新字段
      const updates = [];
      const params = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (password) {
        updates.push('password = ?');
        params.push(md5(password));
      }
      if (role !== undefined) {
        updates.push('role = ?');
        params.push(role);
      }
      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }
      if (remark !== undefined) {
        updates.push('remark = ?');
        params.push(remark);
      }
      
      if (updates.length === 0) {
        return true;
      }
      
      params.push(id);
      const updateSql = `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`;
      await query(updateSql, params);
      
      logger.info(`编辑管理员成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`编辑管理员失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除管理员
   */
  async deleteAdmin(id) {
    try {
      // 检查管理员是否存在
      const checkSql = 'SELECT id FROM admins WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('管理员不存在');
      }
      
      // 删除管理员
      const deleteSql = 'DELETE FROM admins WHERE id = ?';
      await query(deleteSql, [id]);
      
      logger.info(`删除管理员成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除管理员失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AdminService();
