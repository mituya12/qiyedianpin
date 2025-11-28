const mysql = require('mysql2/promise');
const config = require('../config');
const logger = require('./logger');

// 创建MySQL连接池
const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    logger.error(`数据库连接失败: ${error.message}`);
    return false;
  }
};

// 执行SQL查询
const query = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error(`SQL执行错误: ${error.message}`);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  testConnection
}; 