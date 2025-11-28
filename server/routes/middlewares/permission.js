/**
 * 权限验证中间件
 */
const { error } = require('../../utils/response');
const { StatusCodes } = require('http-status-codes');

/**
 * 检查用户是否有指定权限
 * @param {String} resource - 资源名称
 * @param {String} action - 操作类型(read/write/delete)
 * @returns {Function} - Express中间件
 */
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    try {
      // 从JWT中获取用户信息
      const user = req.user;
      
      if (!user || !user.permissions) {
        return error(res, '无权限访问', StatusCodes.FORBIDDEN);
      }
      
      // 解析权限
      let permissions;
      try {
        permissions = typeof user.permissions === 'string' 
          ? JSON.parse(user.permissions) 
          : user.permissions;
      } catch (err) {
        return error(res, '权限格式错误', StatusCodes.FORBIDDEN);
      }
      
      // 检查是否有超级管理员权限
      if (permissions.admin === true) {
        return next();
      }
      
      // 检查特定资源权限
      if (
        permissions[resource] && 
        Array.isArray(permissions[resource]) && 
        permissions[resource].includes(action)
      ) {
        return next();
      }
      
      return error(res, '无权限执行此操作', StatusCodes.FORBIDDEN);
    } catch (err) {
      return error(res, '权限验证失败', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
};

/**
 * 检查用户是否为管理员
 */
const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return error(res, '无权限访问', StatusCodes.FORBIDDEN);
    }
    
    // 解析权限
    let permissions;
    try {
      permissions = typeof user.permissions === 'string' 
        ? JSON.parse(user.permissions) 
        : user.permissions;
    } catch (err) {
      return error(res, '权限格式错误', StatusCodes.FORBIDDEN);
    }
    
    // 检查是否有管理员权限
    if (permissions.admin === true) {
      return next();
    }
    
    return error(res, '需要管理员权限', StatusCodes.FORBIDDEN);
  } catch (err) {
    return error(res, '权限验证失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/**
 * 检查用户是否为资源所有者
 * @param {Function} getOwnerId - 从请求中获取资源所有者ID的函数
 * @returns {Function} - Express中间件
 */
const isResourceOwner = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user || !user.id) {
        return error(res, '无权限访问', StatusCodes.FORBIDDEN);
      }
      
      // 获取资源所有者ID
      const ownerId = await getOwnerId(req);
      
      if (ownerId === null) {
        return error(res, '资源不存在', StatusCodes.NOT_FOUND);
      }
      
      // 检查用户是否为资源所有者
      if (user.id === ownerId) {
        return next();
      }
      
      // 如果不是所有者，检查是否有管理员权限
      let permissions;
      try {
        permissions = typeof user.permissions === 'string' 
          ? JSON.parse(user.permissions) 
          : user.permissions;
      } catch (err) {
        return error(res, '权限格式错误', StatusCodes.FORBIDDEN);
      }
      
      if (permissions.admin === true) {
        return next();
      }
      
      return error(res, '无权限操作此资源', StatusCodes.FORBIDDEN);
    } catch (err) {
      return error(res, '权限验证失败', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
};

module.exports = {
  checkPermission,
  isAdmin,
  isResourceOwner
}; 