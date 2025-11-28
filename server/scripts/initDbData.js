const { query } = require('../utils/db');
const logger = require('../utils/logger');
const { initAllTestData } = require('./data');

/**
 * 初始化测试数据
 */
const initTestData = async () => {
  try {
    logger.info('开始初始化测试数据...');
    
    // 使用模块化的方式初始化所有测试数据
    await initAllTestData(query);
    
    logger.info('测试数据初始化完成');
    return true;
  } catch (error) {
    logger.error(`测试数据初始化失败: ${error.message}`);
    return false;
  }
};

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  initTestData()
    .then(success => {
      if (success) {
        logger.info('测试数据初始化脚本执行成功');
        process.exit(0);
      } else {
        logger.error('测试数据初始化脚本执行失败');
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error(`测试数据初始化脚本执行异常: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { initTestData }; 