const { StatusCodes } = require('http-status-codes');
const moment = require('moment-timezone');
const logger = require('./logger');

/**
 * 自定义响应状态码
 * 遵循RESTful API设计原则
 */
const ResponseCode = {
  // 成功相关状态码 (2xx)
  SUCCESS: StatusCodes.OK,                    // 200: 操作成功
  CREATED: StatusCodes.CREATED,               // 201: 创建成功
  ACCEPTED: StatusCodes.ACCEPTED,             // 202: 请求已接受，但处理未完成
  NO_CONTENT: StatusCodes.NO_CONTENT,         // 204: 操作成功，但无返回内容
  
  // 客户端错误状态码 (4xx)
  BAD_REQUEST: StatusCodes.BAD_REQUEST,       // 400: 请求参数错误
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,     // 401: 未授权（未登录）
  PAYMENT_REQUIRED: StatusCodes.PAYMENT_REQUIRED, // 402: 需要付费
  FORBIDDEN: StatusCodes.FORBIDDEN,           // 403: 拒绝访问（权限不足）
  NOT_FOUND: StatusCodes.NOT_FOUND,           // 404: 资源不存在
  METHOD_NOT_ALLOWED: StatusCodes.METHOD_NOT_ALLOWED, // 405: 方法不允许
  CONFLICT: StatusCodes.CONFLICT,             // 409: 资源冲突（如重复数据）
  GONE: StatusCodes.GONE,                     // 410: 资源不再可用
  UNPROCESSABLE_ENTITY: StatusCodes.UNPROCESSABLE_ENTITY, // 422: 请求格式正确，但语义错误
  TOO_MANY_REQUESTS: StatusCodes.TOO_MANY_REQUESTS, // 429: 请求过多（限流）
  
  // 服务器错误状态码 (5xx)
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR, // 500: 服务器内部错误
  NOT_IMPLEMENTED: StatusCodes.NOT_IMPLEMENTED,       // 501: 功能未实现
  BAD_GATEWAY: StatusCodes.BAD_GATEWAY,               // 502: 网关错误
  SERVICE_UNAVAILABLE: StatusCodes.SERVICE_UNAVAILABLE, // 503: 服务不可用
  GATEWAY_TIMEOUT: StatusCodes.GATEWAY_TIMEOUT,       // 504: 网关超时
  
  // 自定义业务状态码 (6xx)
  BUSINESS_ERROR: 600,                        // 600: 业务逻辑错误
  VALIDATION_ERROR: 601,                      // 601: 数据验证错误
  DATABASE_ERROR: 602,                        // 602: 数据库操作错误
  THIRD_PARTY_ERROR: 603,                     // 603: 第三方服务错误
  RESOURCE_EXISTED: 604,                      // 604: 资源已存在
  RESOURCE_EXPIRED: 605,                      // 605: 资源已过期
  FILE_UPLOAD_ERROR: 606,                     // 606: 文件上传错误
  SMS_ERROR: 607,                             // 607: 短信发送错误
  EMAIL_ERROR: 608                            // 608: 邮件发送错误
};

/**
 * 格式化日期为北京时间
 * @param {Date|String} date - 日期对象或字符串
 * @returns {String} - 格式化后的日期字符串
 */
const formatDate = (date) => {
  return moment(date).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 检查字符串是否为有效的日期格式
 * @param {String} str - 字符串
 * @returns {Boolean} - 是否为日期格式
 */
const isDateString = (str) => {
  // 只处理ISO格式日期或YYYY-MM-DD HH:mm:ss格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}(\s\d{2}:\d{2}:\d{2})?$/;
  return dateRegex.test(str);
};

/**
 * 处理响应数据中的日期
 * @param {*} data - 响应数据
 * @returns {*} - 处理后的数据
 */
const processResponseData = (data) => {
  if (!data) return null;
  
  // 处理数组
  if (Array.isArray(data)) {
    return data.map(item => processResponseData(item));
  }
  
  // 处理对象
  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        
        // 处理日期字段 - 只处理Date对象或标准日期格式字符串
        if (value instanceof Date) {
          result[key] = formatDate(value);
        } else if (typeof value === 'string' && isDateString(value)) {
          result[key] = formatDate(value);
        } else if (typeof value === 'object' && value !== null) {
          result[key] = processResponseData(value);
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  }
  
  return data;
};

/**
 * 记录响应日志
 * @param {Object} req - Express请求对象
 * @param {Number} statusCode - HTTP状态码
 * @param {String} message - 响应消息
 * @param {*} data - 响应数据
 */
const logResponse = (req, statusCode, message, data) => {
  // 获取请求信息
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user ? req.user.id : 'anonymous'
  };

  // 判断日志级别
  if (statusCode >= 500) {
    // 服务器错误，使用error级别
    logger.error(`响应 [${statusCode}]: ${message}`, {
      request: requestInfo,
      response: { code: statusCode, message }
    });
  } else if (statusCode >= 400) {
    // 客户端错误，使用warn级别
    logger.warn(`响应 [${statusCode}]: ${message}`, {
      request: requestInfo,
      response: { code: statusCode, message }
    });
  } else {
    // 成功响应，使用info级别
    logger.info(`响应 [${statusCode}]: ${message}`, {
      request: requestInfo,
      response: { code: statusCode, message }
    });
  }
};

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {String} message - 响应消息
 * @param {Number} statusCode - HTTP状态码
 * @returns {Object} - 响应对象
 */
const success = (res, data = null, message = '操作成功', statusCode = ResponseCode.SUCCESS) => {
  // 记录响应日志
  logResponse(res.req, statusCode, message, data);
  
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: processResponseData(data),
    timestamp: formatDate(new Date())
  });
};

/**
 * 错误响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 错误消息
 * @param {Number} statusCode - HTTP状态码
 * @param {*} data - 响应数据
 * @returns {Object} - 响应对象
 */
const error = (res, message = '操作失败', statusCode = ResponseCode.BAD_REQUEST, data = null) => {
  // 记录响应日志
  logResponse(res.req, statusCode, message, data);
  
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: processResponseData(data),
    timestamp: formatDate(new Date())
  });
};

/**
 * 分页响应
 * @param {Object} res - Express响应对象
 * @param {Array} items - 分页数据项
 * @param {Number} total - 总记录数
 * @param {Number} page - 当前页码
 * @param {Number} limit - 每页记录数
 * @param {String} message - 响应消息
 * @param {Number} statusCode - HTTP状态码
 * @returns {Object} - 响应对象
 */
const paginate = (
  res, 
  items = [], 
  total = 0, 
  page = 1, 
  limit = 10, 
  message = '获取成功', 
  statusCode = ResponseCode.SUCCESS
) => {
  // 计算总页数
  const totalPages = Math.ceil(total / limit);
  
  // 处理页码边界
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  // 构造分页数据
  const paginationData = {
    items: processResponseData(items),
    pagination: {
      total,          // 总记录数
      total_pages: totalPages,  // 总页数
      current_page: currentPage, // 当前页码
      page_size: limit,          // 每页记录数
      has_previous: currentPage > 1,              // 是否有上一页
      has_next: currentPage < totalPages,         // 是否有下一页
      is_first_page: currentPage === 1,           // 是否是第一页
      is_last_page: currentPage === totalPages || totalPages === 0 // 是否是最后一页
    }
  };
  
  // 记录响应日志（只记录分页信息，不记录具体数据项）
  logResponse(res.req, statusCode, message, { pagination: paginationData.pagination });
  
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: paginationData,
    timestamp: formatDate(new Date())
  });
};

/**
 * 空响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 响应消息
 * @returns {Object} - 响应对象
 */
const noContent = (res, message = '操作成功') => {
  // 记录响应日志
  logResponse(res.req, ResponseCode.NO_CONTENT, message, null);
  
  return res.status(ResponseCode.NO_CONTENT).json({
    code: ResponseCode.NO_CONTENT,
    message,
    data: null,
    timestamp: formatDate(new Date())
  });
};

/**
 * 未授权响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 响应消息
 * @returns {Object} - 响应对象
 */
const unauthorized = (res, message = '未授权，请先登录') => {
  return error(res, message, ResponseCode.UNAUTHORIZED);
};

/**
 * 禁止访问响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 响应消息
 * @returns {Object} - 响应对象
 */
const forbidden = (res, message = '权限不足，禁止访问') => {
  return error(res, message, ResponseCode.FORBIDDEN);
};

/**
 * 资源不存在响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 响应消息
 * @returns {Object} - 响应对象
 */
const notFound = (res, message = '资源不存在') => {
  return error(res, message, ResponseCode.NOT_FOUND);
};

/**
 * 服务器错误响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 响应消息
 * @param {*} data - 错误详情（开发环境下使用）
 * @returns {Object} - 响应对象
 */
const serverError = (res, message = '服务器内部错误', data = null) => {
  return error(res, message, ResponseCode.INTERNAL_SERVER_ERROR, data);
};

module.exports = {
  ResponseCode,
  success,
  error,
  paginate,
  noContent,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  formatDate
}; 