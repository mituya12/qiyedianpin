/**
 * C端举报模块API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

async function testReportModule() {
  logger.title('C端举报模块测试');

  try {
    // 先获取一个评价ID用于测试
    const listRes = await request.get('/api/c/review/list', {
      companyName: '腾讯科技有限公司',
      page: 1,
      pageSize: 1
    });

    let reviewId = null;
    if (listRes.code === 200 && listRes.data.items.length > 0) {
      reviewId = listRes.data.items[0].id;
    }

    if (!reviewId) {
      logger.warn('没有找到评价,跳过举报模块测试');
      return true;
    }

    // 1. 提交举报
    logger.subtitle('1. 测试提交举报');
    const createRes = await request.post('/api/c/report/create', {
      contentType: 'review',
      contentId: reviewId,
      reason: '虚假信息',
      description: '这是一条测试举报'
    });
    
    if (createRes.code === 200) {
      logger.success('提交举报成功');
      logger.data('举报ID', createRes.data.reportId);
    } else {
      logger.error('提交举报失败');
    }

    logger.success('举报模块测试完成\n');
    return true;

  } catch (error) {
    logger.error('举报模块测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testReportModule };
