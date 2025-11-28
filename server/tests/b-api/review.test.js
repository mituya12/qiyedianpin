/**
 * B端评价管理API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

async function testReviewManagement() {
  logger.title('B端评价管理测试');

  try {
    let reviewId = null;

    // 1. 获取评价列表
    logger.subtitle('1. 测试获取评价列表');
    const listRes = await request.get('/api/admin/review/list', {
      page: 1,
      pageSize: 10
    });
    
    if (listRes.code === 200) {
      logger.success('获取评价列表成功');
      logger.data('评价总数', listRes.data.pagination.total);
      if (listRes.data.items.length > 0) {
        reviewId = listRes.data.items[0].id;
      }
    } else {
      logger.error('获取评价列表失败');
    }

    // 2. 获取评价详情
    if (reviewId) {
      logger.subtitle('2. 测试获取评价详情');
      const detailRes = await request.get(`/api/admin/review/detail/${reviewId}`);
      
      if (detailRes.code === 200) {
        logger.success('获取评价详情成功');
        logger.data('评价ID', reviewId);
      } else {
        logger.error('获取评价详情失败');
      }
    }

    // 3. 编辑评价
    if (reviewId) {
      logger.subtitle('3. 测试编辑评价');
      const updateRes = await request.put(`/api/admin/review/update/${reviewId}`, {
        auditStatus: 1
      });
      
      if (updateRes.code === 200) {
        logger.success('编辑评价成功');
      } else {
        logger.error('编辑评价失败');
      }
    }

    // 4. 审核评价
    if (reviewId) {
      logger.subtitle('4. 测试审核评价');
      const auditRes = await request.post(`/api/admin/review/audit/${reviewId}`, {
        auditStatus: 1,
        remark: '审核通过'
      });
      
      if (auditRes.code === 200) {
        logger.success('审核评价成功');
      } else {
        logger.warn('审核评价失败');
      }
    }

    logger.success('评价管理测试完成\n');
    return true;

  } catch (error) {
    logger.error('评价管理测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testReviewManagement };
