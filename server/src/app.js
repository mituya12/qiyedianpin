const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const Response = require('./utils/response');

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 测试数据库连接
const testDbConnection = async () => {
  try {
    const { testConnection } = require('./config/db');
    await testConnection();
  } catch (error) {
    console.error('数据库连接测试失败:', error);
  }
};

// 测试Redis连接
const testRedisConnection = async () => {
  try {
    const { testConnection } = require('./config/redis');
    await testConnection();
  } catch (error) {
    console.error('Redis连接测试失败，但应用将继续运行:', error);
  }
};

// 启动时测试连接，但不阻止应用启动
(async () => {
  await testDbConnection();
  await testRedisConnection();
})();

// 默认路由
app.get('/', (req, res) => {
  Response.success(res, { message: 'API服务正常运行中' }, 'API服务正常运行中');
});

// 移动端API路由
app.use('/api/mobile', require('./routes/mobile'));

// 后台端API路由
app.use('/api/admin', require('./routes/admin'));

// 404处理
app.use((req, res) => {
  Response.notFound(res);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  Response.serverError(res, err.message || '服务器内部错误');
});

module.exports = app; 