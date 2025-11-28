const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { generateToken } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const UserService = require('../../src/services/mobile/UserService');

// 微信登录
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return error(res, '缺少code参数', 400);
    }

    const user = await UserService.login(code);
    const token = generateToken({ id: user.id, name: user.name }, USER_TYPES.MOBILE);

    return success(res, {
      token,
      userInfo: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio
      }
    }, '登录成功');
  } catch (err) {
    return error(res, err.message, 500);
  }
});

// 获取用户信息
router.get('/info', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const userInfo = await UserService.getUserInfo(userId);
    
    if (!userInfo) {
      return error(res, '用户不存在', 404);
    }

    return success(res, userInfo, '获取成功');
  } catch (err) {
    return error(res, err.message, 500);
  }
});

// 更新用户信息
router.put('/info', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar, bio } = req.body;

    await UserService.updateUserInfo(userId, { name, avatar, bio });
    return success(res, null, '更新成功');
  } catch (err) {
    return error(res, err.message, 500);
  }
});

module.exports = router;
