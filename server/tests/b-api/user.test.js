/**
 * B端用户管理API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

async function testUserManagement() {
  logger.title('B端用户管理测试');

  try {
    let userId = null;

    // 1. 获取用户列表
    logger.subtitle('1. 测试获取用户列表');
    const listRes = await request.get('/api/admin/user/list', {
      page: 1,
      pageSize: 10
    });
    
    if (listRes.code === 200) {
      logger.success('获取用户列表成功');
      logger.data('用户总数', listRes.data.pagination.total);
      if (listRes.data.items.length > 0) {
        userId = listRes.data.items[0].id;
      }
    } else {
      logger.error('获取用户列表失败');
    }

    // 2. 获取用户详情
    if (userId) {
      logger.subtitle('2. 测试获取用户详情');
      const detailRes = await request.get(`/api/admin/user/detail/${userId}`);
      
      if (detailRes.code === 200) {
        logger.success('获取用户详情成功');
        logger.data('用户ID', userId);
      } else {
        logger.error('获取用户详情失败');
      }
    }

    // 3. 编辑用户
    if (userId) {
      logger.subtitle('3. 测试编辑用户');
      const updateRes = await request.put(`/api/admin/user/update/${userId}`, {
        status: 1
      });
      
      if (updateRes.code === 200) {
        logger.success('编辑用户成功');
      } else {
        logger.error('编辑用户失败');
      }
    }

    logger.success('用户管理测试完成\n');
    return true;

  } catch (error) {
    logger.error('用户管理测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testUserManagement };
