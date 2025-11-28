require('dotenv').config();

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // Redis配置
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || '20250525',
    password: process.env.DB_PASSWORD || 'mD43JwxxDK8yDmmh',
    database: process.env.DB_NAME || '20250525'
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'mD43JwxxDK8yDmmh',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    types: {
      mobile: process.env.JWT_MOBILE_TYPE || 'mobile',
      admin: process.env.JWT_ADMIN_TYPE || 'admin'
    }
  }
}; 