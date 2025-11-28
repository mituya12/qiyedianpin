/**
 * 测试数据初始化索引文件
 * 集中管理所有测试数据的初始化
 */
const mysql = require('mysql2/promise');
const config = require('../../config');
const logger = require('../../utils/logger');
const initAdminsData = require('./admins');
const initSystemConfigData = require('./system_config');
const initCompaniesData = require('./companies');
const initTestUsersData = require('./test_users');
const initReviewsData = require('./reviews');
const initRepliesData = require('./replies');

/**
 * 初始化所有初始数据
 */
const initAllData = async () => {
  let connection;
  try {
    logger.info('开始初始化数据...');
    
    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });
    
    // 1. 初始化管理员和系统配置
    await initAdminsData(connection);
    await initSystemConfigData(connection);
    
    // 2. 初始化企业数据
    await initCompaniesData(connection);
    
    // 3. 初始化测试用户
    await initTestUsersData(connection);
    
    // 4. 初始化评价数据(会自动更新企业评分)
    await initReviewsData(connection);
    
    // 5. 初始化回复数据(会自动更新评价回复数)
    await initRepliesData(connection);
    
    logger.info('所有初始数据初始化完成');
    return true;
  } catch (error) {
    logger.error(`初始数据初始化失败: ${error.message}`);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  initAllData()
    .then(success => {
      if (success) {
        logger.info('初始数据脚本执行成功');
        process.exit(0);
      } else {
        logger.error('初始数据脚本执行失败');
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error(`初始数据脚本执行异常: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { initAllData }; 