/**
 * 角色测试数据初始化
 */
const logger = require('../../utils/logger');

/**
 * 初始化角色测试数据
 * @param {Function} query - 数据库查询函数
 * @returns {Promise<boolean>} - 是否成功
 */
const initRolesData = async (query) => {
  try {
    logger.info('开始初始化角色测试数据...');
    
    // 检查是否已有数据
    const existingRoles = await query('SELECT COUNT(*) as count FROM roles');
    if (existingRoles[0].count > 0) {
      logger.info('角色表已有数据，跳过初始化');
      return true;
    }
    
    // 准备测试数据
    // 这里只是示例，实际开发时根据需求插入数据
    const rolesData = [
      {
        name: 'admin',
        description: '系统管理员',
        permissions: JSON.stringify({
          users: ['read', 'write', 'delete'],
          roles: ['read', 'write', 'delete'],
          settings: ['read', 'write']
        })
      },
      {
        name: 'user',
        description: '普通用户',
        permissions: JSON.stringify({
          users: ['read'],
          roles: ['read'],
          settings: ['read']
        })
      }
    ];
    
    // 插入测试数据
    for (const role of rolesData) {
      await query(
        'INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)',
        [role.name, role.description, role.permissions]
      );
    }
    
    logger.info('角色测试数据初始化成功');
    return true;
  } catch (error) {
    logger.error(`角色测试数据初始化失败: ${error.message}`);
    throw error; // 向上抛出错误，让调用者处理
  }
};

module.exports = {
  initRolesData
}; 