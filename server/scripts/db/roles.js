/**
 * 角色表初始化
 */
const logger = require('../../utils/logger');

/**
 * 创建角色表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createRolesTable = async (connection) => {
  try {
    logger.info('开始创建角色表...');
    
    // 创建角色表SQL
    // 这里只是示例，实际开发时根据需求设计表结构
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(200),
        permissions JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.query(createTableSQL);
    logger.info('角色表创建成功');
    return true;
  } catch (error) {
    logger.error(`角色表创建失败: ${error.message}`);
    throw error; // 向上抛出错误，让调用者处理
  }
};

module.exports = {
  createRolesTable
}; 