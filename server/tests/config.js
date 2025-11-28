/**
 * 测试配置文件
 */
module.exports = {
  // API基础URL
  baseURL: 'http://localhost:3000',
  
  // 测试用户信息
  testUser: {
    openid: 'test_openid_001',
    name: '张三'
  },
  
  // 测试管理员信息
  testAdmin: {
    username: 'admin',
    password: 'admin123'
  },
  
  // 测试企业信息
  testCompany: {
    name: '腾讯科技有限公司',
    alias: '腾讯'
  },
  
  // 超时设置
  timeout: 10000
};
