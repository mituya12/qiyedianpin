/**
 * 统一响应格式
 */

/**
 * 格式化日期时间为北京时间
 * @param {Date} date 日期对象
 * @returns {String} 格式化后的日期时间字符串，格式：YYYY-MM-DD HH:mm:ss
 */
function formatDateTime(date) {
  // 转换为北京时间
  const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  
  const year = beijingDate.getUTCFullYear();
  const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(beijingDate.getUTCDate()).padStart(2, '0');
  const hours = String(beijingDate.getUTCHours()).padStart(2, '0');
  const minutes = String(beijingDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(beijingDate.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

class Response {
  // 成功响应
  static success(res, data = null, message = '操作成功', code = 200) {
    return res.status(code).json({
      success: true,
      code,
      message,
      data,
      timestamp: formatDateTime(new Date())
    });
  }

  // 失败响应
  static error(res, message = '操作失败', code = 400, data = null) {
    return res.status(code).json({
      success: false,
      code,
      message,
      data,
      timestamp: formatDateTime(new Date())
    });
  }

  // 服务器错误
  static serverError(res, message = '服务器内部错误', data = null) {
    return res.status(500).json({
      success: false,
      code: 500,
      message,
      data,
      timestamp: formatDateTime(new Date())
    });
  }

  // 未授权
  static unauthorized(res, message = '未授权访问', data = null) {
    return res.status(401).json({
      success: false,
      code: 401,
      message,
      data,
      timestamp: formatDateTime(new Date())
    });
  }

  // 禁止访问
  static forbidden(res, message = '禁止访问', data = null) {
    return res.status(403).json({
      success: false,
      code: 403,
      message,
      data,
      timestamp: formatDateTime(new Date())
    });
  }

  // 资源未找到
  static notFound(res, message = '资源未找到', data = null) {
    return res.status(404).json({
      success: false,
      code: 404,
      message,
      data,
      timestamp: formatDateTime(new Date())
    });
  }
}

module.exports = Response; 