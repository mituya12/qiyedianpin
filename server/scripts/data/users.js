/**
 * 用户测试数据初始化
 */
const logger = require('../../utils/logger');
const { hashPassword } = require('../../utils/bcrypt');

/**
 * 初始化用户测试数据
 * @param {Function} query - 数据库查询函数
 * @returns {Promise<boolean>} - 是否成功
 */
const initUsersData = async (query) => {
  try {
    logger.info('开始初始化用户测试数据...');
    
    // 检查是否已有数据
    const existingUsers = await query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      logger.info('用户表已有数据，跳过初始化');
      return true;
    }
    
    // 获取角色ID
    const adminRole = await query('SELECT id FROM roles WHERE name = ?', ['admin']);
    const userRole = await query('SELECT id FROM roles WHERE name = ?', ['user']);
    
    if (!adminRole.length || !userRole.length) {
      throw new Error('角色数据不存在，请先初始化角色数据');
    }
    
    // 准备测试数据
    // 这里只是示例，实际开发时根据需求插入数据
    const usersData = [
      {
        username: 'admin',
        password: await hashPassword('admin123'),
        email: 'admin@example.com',
        mobile: '13800000000',
        role_id: adminRole[0].id
      },
      {
        username: 'user',
        password: await hashPassword('user123'),
        email: 'user@example.com',
        mobile: '13900000000',
        role_id: userRole[0].id
      }
    ];
    
    // 插入测试数据
    for (const user of usersData) {
      await query(
        'INSERT INTO users (username, password, email, mobile, role_id) VALUES (?, ?, ?, ?, ?)',
        [user.username, user.password, user.email, user.mobile, user.role_id]
      );
    }
    
    logger.info('用户测试数据初始化成功');
    return true;
  } catch (error) {
    logger.error(`用户测试数据初始化失败: ${error.message}`);
    throw error; // 向上抛出错误，让调用者处理
  }
};

module.exports = {
  initUsersData
}; 