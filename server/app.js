const express = require('express');
const config = require('./config');
const registerRoutes = require('./routes');
const { registerMiddlewares, registerErrorHandlers } = require('./middlewares');

// 创建Express应用
const app = express();

// 注册中间件
registerMiddlewares(app);

// 注册路由
registerRoutes(app);

// 注册错误处理
registerErrorHandlers(app);

module.exports = app; 