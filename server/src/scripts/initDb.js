/**
 * 数据库初始化脚本
 * 用于项目第一次运行时，创建必要的数据库表
 */
const { pool } = require('../config/db');

/**
 * 初始化数据库表
 */
async function initializeTables() {
  const connection = await pool.getConnection();
  try {
    console.log('开始初始化数据库表...');

    // 创建管理员表
   

    // 创建移动端用户表
    

    console.log('数据库表初始化完成！');
  } catch (error) {
    console.error('初始化数据库表失败:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 执行初始化
 */
async function run() {
  try {
    await initializeTables();
    console.log('数据库初始化成功！');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化脚本
run(); 