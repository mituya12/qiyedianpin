const JwtService = require('../utils/jwt');
const Response = require('../utils/response');
const config = require('../config');

/**
 * 从请求头中提取JWT令牌
 * @param {Object} req - 请求对象
 * @returns {String|null} JWT令牌
 */
function extractTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

/**
 * 通用身份验证中间件
 * @param {String} type - 令牌类型 ('mobile' | 'admin')
 */
function authMiddleware(type) {
  return (req, res, next) => {
    try {
      // 从请求头中提取令牌
      const token = extractTokenFromHeader(req);
      if (!token) {
        return Response.unauthorized(res, '未提供授权令牌');
      }

      // 验证令牌
      const decoded = JwtService.verifyToken(token);

      // 验证令牌类型
      if (decoded.type !== type) {
        return Response.forbidden(res, `当前接口仅支持${type === config.jwt.types.mobile ? '移动端' : '后台端'}访问`);
      }

      // 将用户信息附加到请求对象
      req.user = decoded;
      next();
    } catch (error) {
      return Response.unauthorized(res, error.message || '无效的授权令牌');
    }
  };
}

// 移动端授权中间件
const mobileAuth = authMiddleware(config.jwt.types.mobile);

// 后台端授权中间件
const adminAuth = authMiddleware(config.jwt.types.admin);

module.exports = {
  mobileAuth,
  adminAuth
}; 