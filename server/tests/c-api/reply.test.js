/**
 * C端回复模块API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

async function testReplyModule() {
  logger.title('C端回复模块测试');

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
      logger.warn('没有找到评价,跳过回复模块测试');
      return true;
    }

    // 1. 发布回复
    logger.subtitle('1. 测试发布回复');
    const createRes = await request.post('/api/c/reply/create', {
      reviewId: reviewId,
      content: '这是一条测试回复内容'
    });
    
    if (createRes.code === 200) {
      logger.success('发布回复成功');
      logger.data('回复ID', createRes.data.replyId);
    } else {
      logger.error('发布回复失败');
    }

    // 2. 获取我的回复列表
    logger.subtitle('2. 测试获取我的回复列表');
    const myListRes = await request.get('/api/c/reply/my-list', {
      page: 1,
      pageSize: 10
    });
    
    if (myListRes.code === 200) {
      logger.success('获取我的回复列表成功');
      logger.data('我的回复数量', myListRes.data.pagination.total);
    } else {
      logger.error('获取我的回复列表失败');
    }

    logger.success('回复模块测试完成\n');
    return true;

  } catch (error) {
    logger.error('回复模块测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testReplyModule };
