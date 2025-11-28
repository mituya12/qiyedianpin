/**
 * C端评价模块API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

let reviewId = null;

async function testReviewModule() {
  logger.title('C端评价模块测试');

  try {
    // 1. 获取评价列表
    logger.subtitle('1. 测试获取评价列表');
    const listRes = await request.get('/api/c/review/list', {
      companyName: '腾讯科技有限公司',
      sortBy: 'newest',
      page: 1,
      pageSize: 10
    });
    
    if (listRes.code === 200) {
      logger.success('获取评价列表成功');
      logger.data('评价数量', listRes.data.pagination.total);
      if (listRes.data.items.length > 0) {
        reviewId = listRes.data.items[0].id;
      }
    } else {
      logger.error('获取评价列表失败');
    }

    // 2. 获取评价详情
    if (reviewId) {
      logger.subtitle('2. 测试获取评价详情');
      const detailRes = await request.get(`/api/c/review/detail/${reviewId}`);
      
      if (detailRes.code === 200) {
        logger.success('获取评价详情成功');
        logger.data('评价ID', reviewId);
      } else {
        logger.error('获取评价详情失败');
      }
    }

    // 3. 发布评价
    logger.subtitle('3. 测试发布评价');
    const createRes = await request.post('/api/c/review/create', {
      companyName: '测试企业' + Date.now(),
      companyAlias: '测试',
      status: '当前在职',
      department: '技术部',
      isBranch: false,
      rating: 5,
      content: '这是一条测试评价内容',
      salary: '10-15K',
      benefits: '五险一金'
    });
    
    if (createRes.code === 200) {
      logger.success('发布评价成功');
      logger.data('评价ID', createRes.data.reviewId);
      reviewId = createRes.data.reviewId;
    } else {
      logger.error('发布评价失败');
    }

    // 4. 点赞评价
    if (reviewId) {
      logger.subtitle('4. 测试点赞评价');
      const likeRes = await request.post(`/api/c/review/like/${reviewId}`);
      
      if (likeRes.code === 200) {
        logger.success('点赞评价成功');
      } else {
        logger.warn('点赞评价失败(可能已点赞)');
      }
    }

    // 5. 获取我的评价列表
    logger.subtitle('5. 测试获取我的评价列表');
    const myListRes = await request.get('/api/c/review/my-list', {
      page: 1,
      pageSize: 10
    });
    
    if (myListRes.code === 200) {
      logger.success('获取我的评价列表成功');
      logger.data('我的评价数量', myListRes.data.pagination.total);
    } else {
      logger.error('获取我的评价列表失败');
    }

    // 6. 删除评价
    if (reviewId) {
      logger.subtitle('6. 测试删除评价');
      const deleteRes = await request.delete(`/api/c/review/delete/${reviewId}`);
      
      if (deleteRes.code === 200) {
        logger.success('删除评价成功');
      } else {
        logger.warn('删除评价失败');
      }
    }

    logger.success('评价模块测试完成\n');
    return true;

  } catch (error) {
    logger.error('评价模块测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testReviewModule, getReviewId: () => reviewId };
