const mysql = require('mysql2/promise');
const config = require('../config');
const logger = require('../utils/logger');
const { initAllTables } = require('./db');

/**
 * 创建数据库
 */
const createDatabase = async () => {
  let connection;
  try {
    // 创建不带数据库名的连接
    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password
    });

    logger.info('MySQL连接成功');

    // 检查数据库是否存在
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [config.database.database]
    );

    if (rows.length === 0) {
      // 创建数据库
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      logger.info(`数据库 ${config.database.database} 创建成功`);
    } else {
      logger.info(`数据库 ${config.database.database} 已存在`);
    }

    // 关闭当前连接
    await connection.end();
    
    // 重新连接到指定数据库
    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });

    // 初始化所有表结构
    await initAllTables(connection);

    logger.info('数据库初始化完成');
    return true;
  } catch (error) {
    logger.error(`数据库初始化失败: ${error.message}`);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  createDatabase()
    .then(success => {
      if (success) {
        logger.info('数据库初始化脚本执行成功');
        process.exit(0);
      } else {
        logger.error('数据库初始化脚本执行失败');
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error(`数据库初始化脚本执行异常: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { createDatabase }; 