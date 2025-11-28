/**
 * 移动端认证路由
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES, generateToken } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const { validateLogin, validateRegister } = require('../middlewares/validate');
const { StatusCodes } = require('http-status-codes');
const { comparePassword, hashPassword } = require('../../utils/bcrypt');

// 假设这些是从控制器导入的函数
// const authController = require('../../controllers/mobile/auth');

/**
 * 用户登录
 * POST /api/v1/mobile/auth/login
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 这里应该从数据库查询用户
    // const user = await userService.findByUsername(username);
    
    // 示例：模拟用户查询
    const user = {
      id: 1,
      username: 'user',
      password: await hashPassword('user123'), // 实际项目中不应该在这里生成
      email: 'user@example.com',
      mobile: '13900000000',
      role_id: 2,
      permissions: JSON.stringify({
        users: ['read'],
        roles: ['read'],
        settings: ['read']
      })
    };
    
    // 检查用户是否存在
    if (!user) {
      return error(res, '用户名或密码错误', StatusCodes.UNAUTHORIZED);
    }
    
    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return error(res, '用户名或密码错误', StatusCodes.UNAUTHORIZED);
    }
    
    // 生成JWT令牌
    const token = generateToken({
      id: user.id,
      username: user.username,
      permissions: user.permissions
    }, USER_TYPES.MOBILE);
    
    // 返回用户信息和令牌
    success(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }
    }, '登录成功');
  } catch (err) {
    error(res, '登录失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 用户注册
 * POST /api/v1/mobile/auth/register
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, password, email, mobile } = req.body;
    
    // 这里应该检查用户是否已存在
    // const existingUser = await userService.findByUsername(username);
    // if (existingUser) {
    //   return error(res, '用户名已存在', StatusCodes.CONFLICT);
    // }
    
    // 哈希密码
    const hashedPassword = await hashPassword(password);
    
    // 创建用户
    // const newUser = await userService.createUser({
    //   username,
    //   password: hashedPassword,
    //   email,
    //   mobile,
    //   role_id: 2 // 普通用户角色ID
    // });
    
    // 示例：模拟用户创建
    const newUser = {
      id: 2,
      username,
      email,
      mobile
    };
    
    // 生成JWT令牌
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      permissions: JSON.stringify({
        users: ['read'],
        roles: ['read'],
        settings: ['read']
      })
    }, USER_TYPES.MOBILE);
    
    // 返回用户信息和令牌
    success(res, {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile
      }
    }, '注册成功', StatusCodes.CREATED);
  } catch (err) {
    error(res, '注册失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 获取当前用户信息
 * GET /api/v1/mobile/auth/me
 */
router.get('/me', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 这里应该从数据库查询用户
    // const user = await userService.findById(userId);
    
    // 示例：模拟用户查询
    const user = {
      id: userId,
      username: req.user.username,
      email: 'user@example.com',
      mobile: '13900000000'
    };
    
    if (!user) {
      return error(res, '用户不存在', StatusCodes.NOT_FOUND);
    }
    
    success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile
    });
  } catch (err) {
    error(res, '获取用户信息失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 退出登录
 * POST /api/v1/mobile/auth/logout
 */
router.post('/logout', authMiddleware(USER_TYPES.MOBILE), (req, res) => {
  // 在实际项目中，可能需要将令牌加入黑名单
  // 或者在Redis中删除会话信息
  
  success(res, null, '退出登录成功');
});

module.exports = router; 