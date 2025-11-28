/**
 * 数据库表初始化索引文件
 * 集中管理所有表的初始化
 */
const logger = require('../../utils/logger');
const { createUsersTable } = require('./users');
const { createRolesTable } = require('./roles');
const createCompaniesTable = require('./companies');
const createReviewsTable = require('./reviews');
const createRepliesTable = require('./replies');
const createReportsTable = require('./reports');
const createAdminsTable = require('./admins');
const createSystemConfigTable = require('./system_config');
const createFeedbacksTable = require('./feedbacks');

const createTables = async (connection) => {
  await createUsersTable(connection);
  await createRolesTable(connection);
  await createCompaniesTable(connection);
  await createReviewsTable(connection);
  await createRepliesTable(connection);
  await createReportsTable(connection);
  await createAdminsTable(connection);
  await createSystemConfigTable(connection);
};

/**
 * 初始化所有数据库表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const initAllTables = async (connection) => {
  try {
    logger.info('开始初始化所有数据库表...');
    
    // 按照依赖关系顺序初始化表
    await createRolesTable(connection);
    await createUsersTable(connection);
    await createCompaniesTable(connection);
    await createReviewsTable(connection);
    await createRepliesTable(connection);
    await createReportsTable(connection);
    await createFeedbacksTable(connection);
    await createAdminsTable(connection);
    await createSystemConfigTable(connection);
    
    logger.info('所有数据库表初始化完成');
    return true;
  } catch (error) {
    logger.error(`数据库表初始化失败: ${error.message}`);
    return false;
  }
};

module.exports = {
  initAllTables
}; 