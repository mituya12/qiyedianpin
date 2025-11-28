/**
 * B端管理员认证API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');
const config = require('../config');

let adminToken = '';

async function testAdminAuth() {
  logger.title('B端管理员认证测试');

  try {
    // 1. 管理员登录
    logger.subtitle('1. 测试管理员登录');
    const loginRes = await request.post('/api/admin/auth/login', {
      username: config.testAdmin.username,
      password: config.testAdmin.password
    });
    
    if (loginRes.code === 200 && loginRes.data.token) {
      adminToken = loginRes.data.token;
      logger.success('管理员登录成功');
      logger.data('Token', adminToken.substring(0, 20) + '...');
      request.setToken(adminToken);
    } else {
      logger.error('管理员登录失败');
      return false;
    }

    // 2. 获取管理员信息
    logger.subtitle('2. 测试获取管理员信息');
    const infoRes = await request.get('/api/admin/auth/info');
    
    if (infoRes.code === 200) {
      logger.success('获取管理员信息成功');
      logger.data('管理员信息', infoRes.data);
    } else {
      logger.error('获取管理员信息失败');
    }

    logger.success('管理员认证测试完成\n');
    return true;

  } catch (error) {
    logger.error('管理员认证测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = {
  testAdminAuth,
  getAdminToken: () => adminToken
};
