/**
 * API测试主入口
 * 执行所有测试用例
 */
const logger = require('./utils/logger');
const config = require('./config');

// C端测试模块
const { testUserModule } = require('./c-api/user.test');
const { testCompanyModule } = require('./c-api/company.test');
const { testReviewModule } = require('./c-api/review.test');
const { testReplyModule } = require('./c-api/reply.test');
const { testReportModule } = require('./c-api/report.test');

// B端测试模块
const { testAdminAuth } = require('./b-api/admin.test');
const { testCompanyManagement } = require('./b-api/company.test');
const { testReviewManagement } = require('./b-api/review.test');
const { testReplyManagement } = require('./b-api/reply.test');
const { testUserManagement } = require('./b-api/user.test');
const { testReportManagement } = require('./b-api/report.test');

async function runAllTests() {
  console.log('\n');
  logger.title('🚀 开始执行API接口测试');
  logger.info(`测试环境: ${config.baseURL}`);
  logger.info(`开始时间: ${new Date().toLocaleString()}`);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  try {
    // ========== C端API测试 ==========
    logger.title('📱 C端API测试');

    // 1. 用户模块
    results.total++;
    if (await testUserModule()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 2. 企业模块
    results.total++;
    if (await testCompanyModule()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 3. 评价模块
    results.total++;
    if (await testReviewModule()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 4. 回复模块
    results.total++;
    if (await testReplyModule()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 5. 举报模块
    results.total++;
    if (await testReportModule()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // ========== B端API测试 ==========
    logger.title('💼 B端API测试');

    // 1. 管理员认证
    results.total++;
    if (await testAdminAuth()) {
      results.passed++;
    } else {
      results.failed++;
      logger.error('管理员认证失败,跳过后续B端测试');
      throw new Error('管理员认证失败');
    }

    // 2. 企业管理
    results.total++;
    if (await testCompanyManagement()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 3. 评价管理
    results.total++;
    if (await testReviewManagement()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 4. 回复管理
    results.total++;
    if (await testReplyManagement()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 5. 用户管理
    results.total++;
    if (await testUserManagement()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 6. 举报管理
    results.total++;
    if (await testReportManagement()) {
      results.passed++;
    } else {
      results.failed++;
    }

  } catch (error) {
    logger.error('测试执行异常: ' + error.message);
  }

  // 输出测试结果
  logger.title('📊 测试结果统计');
  logger.info(`总模块数: ${results.total} (C端5个 + B端6个)`);
  logger.success(`通过模块: ${results.passed}`);
  if (results.failed > 0) {
    logger.error(`失败模块: ${results.failed}`);
  }
  logger.info(`成功率: ${((results.passed / results.total) * 100).toFixed(2)}%`);
  logger.info(`结束时间: ${new Date().toLocaleString()}`);
  
  console.log('\n');
  
  // 返回退出码
  process.exit(results.failed > 0 ? 1 : 0);
}

// 执行测试
runAllTests().catch(error => {
  logger.error('测试执行失败: ' + error.message);
  process.exit(1);
});
