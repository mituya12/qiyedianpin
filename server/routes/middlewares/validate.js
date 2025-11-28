/**
 * 请求参数验证中间件
 */
const { error } = require('../../utils/response');
const { StatusCodes } = require('http-status-codes');

/**
 * 用户登录参数验证
 */
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || username.trim() === '') {
    return error(res, '用户名不能为空', StatusCodes.BAD_REQUEST);
  }
  
  if (!password || password.trim() === '') {
    return error(res, '密码不能为空', StatusCodes.BAD_REQUEST);
  }
  
  next();
};

/**
 * 用户注册参数验证
 */
const validateRegister = (req, res, next) => {
  const { username, password, email, mobile } = req.body;
  
  if (!username || username.trim() === '') {
    return error(res, '用户名不能为空', StatusCodes.BAD_REQUEST);
  }
  
  if (!password || password.length < 6) {
    return error(res, '密码不能少于6个字符', StatusCodes.BAD_REQUEST);
  }
  
  if (email && !isValidEmail(email)) {
    return error(res, '邮箱格式不正确', StatusCodes.BAD_REQUEST);
  }
  
  if (mobile && !isValidMobile(mobile)) {
    return error(res, '手机号格式不正确', StatusCodes.BAD_REQUEST);
  }
  
  next();
};

/**
 * 验证邮箱格式
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式
 */
const isValidMobile = (mobile) => {
  const mobileRegex = /^1[3-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

module.exports = {
  validateLogin,
  validateRegister
}; 