const jwt = require('jsonwebtoken');
const config = require('../config');
const { StatusCodes } = require('http-status-codes');

// 用户类型
const USER_TYPES = {
  MOBILE: 'mobile',
  ADMIN: 'admin'
};

/**
 * 生成JWT令牌
 * @param {Object} payload - 载荷数据
 * @param {String} type - 用户类型 (mobile/admin)
 * @returns {String} - JWT令牌
 */
const generateToken = (payload, type = USER_TYPES.MOBILE) => {
  const secret = type === USER_TYPES.MOBILE 
    ? config.jwt.mobileSecret 
    : config.jwt.adminSecret;
  
  return jwt.sign(
    { ...payload, type },
    secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * 验证JWT令牌
 * @param {String} token - JWT令牌
 * @param {String} type - 用户类型 (mobile/admin)
 * @returns {Object|Boolean} - 解码后的数据或false
 */
const verifyToken = (token, type = USER_TYPES.MOBILE) => {
  try {
    const secret = type === USER_TYPES.MOBILE 
      ? config.jwt.mobileSecret 
      : config.jwt.adminSecret;
    
    const decoded = jwt.verify(token, secret);
    
    // 验证令牌类型是否匹配
    if (decoded.type !== type) {
      return false;
    }
    
    return decoded;
  } catch (error) {
    return false;
  }
};

/**
 * 创建JWT中间件
 * @param {String} type - 用户类型 (mobile/admin)
 * @returns {Function} - Express中间件
 */
const authMiddleware = (type = USER_TYPES.MOBILE) => {
  return (req, res, next) => {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: StatusCodes.UNAUTHORIZED,
        message: '未提供授权令牌',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, type);

    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: StatusCodes.UNAUTHORIZED,
        message: '无效的授权令牌',
        data: null
      });
    }

    // 将解码后的用户信息添加到请求对象
    req.user = decoded;
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  USER_TYPES
}; 