/**
 * C端企业模块API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');
const config = require('../config');

async function testCompanyModule() {
  logger.title('C端企业模块测试');

  try {
    // 1. 搜索企业
    logger.subtitle('1. 测试搜索企业');
    const searchRes = await request.get('/api/c/company/search', {
      keyword: '腾讯',
      page: 1,
      pageSize: 10
    });
    
    if (searchRes.code === 200) {
      logger.success('搜索企业成功');
      logger.data('搜索结果', {
        total: searchRes.data.pagination.total,
        count: searchRes.data.items.length
      });
    } else {
      logger.error('搜索企业失败');
    }

    // 2. 获取企业详情
    logger.subtitle('2. 测试获取企业详情');
    const detailRes = await request.get('/api/c/company/detail/1');
    
    if (detailRes.code === 200) {
      logger.success('获取企业详情成功');
      logger.data('企业信息', detailRes.data);
    } else {
      logger.error('获取企业详情失败');
    }

    // 3. 获取热门企业列表
    logger.subtitle('3. 测试获取热门企业列表');
    const trendingRes = await request.get('/api/c/company/trending', {
      limit: 10
    });
    
    if (trendingRes.code === 200) {
      logger.success('获取热门企业列表成功');
      logger.data('热门企业数量', trendingRes.data.length);
    } else {
      logger.error('获取热门企业列表失败');
    }

    // 4. 获取相似企业
    logger.subtitle('4. 测试获取相似企业');
    const similarRes = await request.get('/api/c/company/similar/1', {
      limit: 5
    });
    
    if (similarRes.code === 200) {
      logger.success('获取相似企业成功');
      logger.data('相似企业数量', similarRes.data.length);
    } else {
      logger.error('获取相似企业失败');
    }

    logger.success('企业模块测试完成\n');
    return true;

  } catch (error) {
    logger.error('企业模块测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testCompanyModule };
