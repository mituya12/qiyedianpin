const { StatusCodes } = require('http-status-codes');
const { error } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 404错误处理中间件
 */
const notFoundHandler = (req, res, next) => {
  error(res, `找不到路径: ${req.originalUrl}`, StatusCodes.NOT_FOUND);
};

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`错误: ${err.message}`);
  logger.error(err.stack);
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || '服务器内部错误';
  
  error(res, message, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler
}; 