/**
 * B端举报管理API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

async function testReportManagement() {
  logger.title('B端举报管理测试');

  try {
    let reportId = null;

    // 1. 获取举报列表
    logger.subtitle('1. 测试获取举报列表');
    const listRes = await request.get('/api/admin/report/list', {
      page: 1,
      pageSize: 10
    });
    
    if (listRes.code === 200) {
      logger.success('获取举报列表成功');
      logger.data('举报总数', listRes.data.pagination.total);
      if (listRes.data.items.length > 0) {
        reportId = listRes.data.items[0].id;
      }
    } else {
      logger.error('获取举报列表失败');
    }

    // 2. 获取举报详情
    if (reportId) {
      logger.subtitle('2. 测试获取举报详情');
      const detailRes = await request.get(`/api/admin/report/detail/${reportId}`);
      
      if (detailRes.code === 200) {
        logger.success('获取举报详情成功');
        logger.data('举报ID', reportId);
      } else {
        logger.error('获取举报详情失败');
      }
    }

    // 3. 处理举报
    if (reportId) {
      logger.subtitle('3. 测试处理举报');
      const handleRes = await request.post(`/api/admin/report/handle/${reportId}`, {
        status: 1,
        result: '已处理'
      });
      
      if (handleRes.code === 200) {
        logger.success('处理举报成功');
      } else {
        logger.warn('处理举报失败');
      }
    }

    logger.success('举报管理测试完成\n');
    return true;

  } catch (error) {
    logger.error('举报管理测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testReportManagement };
