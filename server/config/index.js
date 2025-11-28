const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || '输入你的数据库用户名',
    password: process.env.DB_PASSWORD || '输入你的数据库密码',
    database: process.env.DB_NAME || '输入你的数据库名称',
  },
  
  // Redis配置
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || '输入你的JWT密钥_建议使用随机字符串',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    mobileSecret: process.env.JWT_MOBILE_SECRET || '输入你的移动端JWT密钥',
    adminSecret: process.env.JWT_ADMIN_SECRET || '输入你的后台JWT密钥',
  },
  
  // 微信小程序配置
  wechat: {
    appId: process.env.WECHAT_APPID || '输入你的微信小程序AppID',
    appSecret: process.env.WECHAT_APPSECRET || '输入你的微信小程序AppSecret',
  },
  
  // 七牛云配置
  qiniu: {
    accessKey: process.env.QINIU_ACCESS_KEY || '输入你的七牛AccessKey',
    secretKey: process.env.QINIU_SECRET_KEY || '输入你的七牛SecretKey',
    bucket: process.env.QINIU_BUCKET || '输入你的七牛Bucket名称',
    domain: process.env.QINIU_DOMAIN || '输入你的七牛域名',
  },
}; 