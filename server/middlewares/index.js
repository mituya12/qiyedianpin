const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./error');
const logger = require('../utils/logger');

/**
 * 注册所有中间件
 * @param {Express.Application} app - Express应用实例
 */
const registerMiddlewares = (app) => {
  // 安全中间件
  app.use(helmet());
  
  // 跨域中间件
  app.use(cors());
  
  // 请求体解析中间件
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // 日志中间件
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
  
  return app;
};

/**
 * 注册错误处理中间件
 * @param {Express.Application} app - Express应用实例
 */
const registerErrorHandlers = (app) => {
  // 404处理
  app.use(notFoundHandler);
  
  // 错误处理
  app.use(errorHandler);
  
  return app;
};

module.exports = {
  registerMiddlewares,
  registerErrorHandlers
}; 