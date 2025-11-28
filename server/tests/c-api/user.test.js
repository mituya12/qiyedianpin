/**
 * C端用户模块API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');
const config = require('../config');

let userToken = '';
let userId = null;

async function testUserModule() {
  logger.title('C端用户模块测试');

  try {
    // 1. 微信登录
    logger.subtitle('1. 测试微信登录');
    const loginRes = await request.post('/api/c/user/login', {
      code: 'test_code_' + Date.now()
    });
    
    if (loginRes.code === 200 && loginRes.data.token) {
      userToken = loginRes.data.token;
      userId = loginRes.data.userInfo.id;
      logger.success('微信登录成功');
      logger.data('Token', userToken.substring(0, 20) + '...');
      logger.data('用户信息', loginRes.data.userInfo);
      request.setToken(userToken);
    } else {
      logger.error('微信登录失败');
      return false;
    }

    // 2. 获取用户信息
    logger.subtitle('2. 测试获取用户信息');
    const infoRes = await request.get('/api/c/user/info');
    
    if (infoRes.code === 200) {
      logger.success('获取用户信息成功');
      logger.data('用户信息', infoRes.data);
    } else {
      logger.error('获取用户信息失败');
    }

    // 3. 更新用户信息
    logger.subtitle('3. 测试更新用户信息');
    const updateRes = await request.put('/api/c/user/info', {
      bio: '测试更新个人简介 - ' + new Date().toLocaleString()
    });
    
    if (updateRes.code === 200) {
      logger.success('更新用户信息成功');
    } else {
      logger.error('更新用户信息失败');
    }

    logger.success('用户模块测试完成\n');
    return true;

  } catch (error) {
    logger.error('用户模块测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = {
  testUserModule,
  getUserToken: () => userToken,
  getUserId: () => userId
};
