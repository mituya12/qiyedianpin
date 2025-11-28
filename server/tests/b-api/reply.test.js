/**
 * B端回复管理API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

async function testReplyManagement() {
  logger.title('B端回复管理测试');

  try {
    let replyId = null;

    // 1. 获取回复列表
    logger.subtitle('1. 测试获取回复列表');
    const listRes = await request.get('/api/admin/reply/list', {
      page: 1,
      pageSize: 10
    });
    
    if (listRes.code === 200) {
      logger.success('获取回复列表成功');
      logger.data('回复总数', listRes.data.pagination.total);
      if (listRes.data.items.length > 0) {
        replyId = listRes.data.items[0].id;
      }
    } else {
      logger.error('获取回复列表失败');
    }

    // 2. 获取回复详情
    if (replyId) {
      logger.subtitle('2. 测试获取回复详情');
      const detailRes = await request.get(`/api/admin/reply/detail/${replyId}`);
      
      if (detailRes.code === 200) {
        logger.success('获取回复详情成功');
        logger.data('回复ID', replyId);
      } else {
        logger.error('获取回复详情失败');
      }
    }

    // 3. 编辑回复
    if (replyId) {
      logger.subtitle('3. 测试编辑回复');
      const updateRes = await request.put(`/api/admin/reply/update/${replyId}`, {
        auditStatus: 1
      });
      
      if (updateRes.code === 200) {
        logger.success('编辑回复成功');
      } else {
        logger.error('编辑回复失败');
      }
    }

    // 4. 审核回复
    if (replyId) {
      logger.subtitle('4. 测试审核回复');
      const auditRes = await request.post(`/api/admin/reply/audit/${replyId}`, {
        auditStatus: 1,
        remark: '审核通过'
      });
      
      if (auditRes.code === 200) {
        logger.success('审核回复成功');
      } else {
        logger.warn('审核回复失败');
      }
    }

    logger.success('回复管理测试完成\n');
    return true;

  } catch (error) {
    logger.error('回复管理测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testReplyManagement };
