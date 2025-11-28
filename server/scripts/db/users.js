/**
 * 用户表初始化
 */
const logger = require('../../utils/logger');

/**
 * 创建用户表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createUsersTable = async (connection) => {
  try {
    logger.info('开始创建用户表...');
    
    // 创建用户表SQL
    // 这里只是示例，实际开发时根据需求设计表结构
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
        openid VARCHAR(100) NOT NULL DEFAULT '' COMMENT '微信openid',
        unionid VARCHAR(100) NOT NULL DEFAULT '' COMMENT '微信unionid',
        name VARCHAR(50) NOT NULL DEFAULT '' COMMENT '用户名',
        avatar VARCHAR(500) NOT NULL DEFAULT '' COMMENT '头像URL',
        bio VARCHAR(200) NOT NULL DEFAULT '' COMMENT '个人简介',
        status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '账号状态：1正常 0禁用',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        last_login_at DATETIME DEFAULT NULL COMMENT '最后登录时间',
        PRIMARY KEY (id),
        UNIQUE KEY uk_openid (openid),
        INDEX idx_unionid (unionid),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
    `;
    
    await connection.query(createTableSQL);
    logger.info('用户表创建成功');
    return true;
  } catch (error) {
    logger.error(`用户表创建失败: ${error.message}`);
    throw error; // 向上抛出错误，让调用者处理
  }
};

module.exports = {
  createUsersTable
}; 