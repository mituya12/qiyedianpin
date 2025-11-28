const express = require('express');
const router = express.Router();
const { success, error } = require('../../utils/response');
const logger = require('../../utils/logger');
const { generateToken, authMiddleware, USER_TYPES } = require('../../utils/jwt');
const AuthService = require('../../src/services/admin/AuthService');

/**
 * 管理员登录
 * POST /api/admin/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 参数验证
    if (!username || !password) {
      return error(res, '用户名和密码不能为空', 400);
    }
    
    const admin = await AuthService.login(username, password);
    const token = generateToken({ id: admin.id, username: admin.username }, USER_TYPES.ADMIN);
    
    return success(res, {
      token,
      adminInfo: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    }, '登录成功');
  } catch (err) {
    logger.error(`管理员登录失败: ${err.message}`);
    return error(res, err.message || '登录失败', 500);
  }
});

/**
 * 获取管理员信息
 * GET /api/admin/auth/info
 * 需要认证
 */
router.get('/info', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const adminId = req.user.id;
    const adminInfo = await AuthService.getAdminInfo(adminId);
    
    if (!adminInfo) {
      return error(res, '管理员不存在', 404);
    }
    
    return success(res, adminInfo, '获取成功');
  } catch (err) {
    logger.error(`获取管理员信息失败: ${err.message}`);
    return error(res, '获取管理员信息失败', 500);
  }
});

/**
 * 管理员退出登录
 * POST /api/admin/auth/logout
 * 需要认证
 */
router.post('/logout', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    // 退出登录(前端删除token即可)
    return success(res, null, '退出成功');
  } catch (err) {
    logger.error(`退出登录失败: ${err.message}`);
    return error(res, '退出登录失败', 500);
  }
});

module.exports = router;
