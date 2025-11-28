const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const UserService = require('../../src/services/admin/UserService');

/**
 * 获取用户列表
 * GET /api/admin/user/list
 */
router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { name, userId, status, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    
    const result = await UserService.getUserList(
      { name, userId, status, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取用户列表失败: ${err.message}`);
    return error(res, '获取用户列表失败', 500);
  }
});

/**
 * 获取用户详情
 * GET /api/admin/user/detail/:id
 */
router.get('/detail/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少用户ID', 400);
    }
    
    const user = await UserService.getUserDetail(id);
    
    if (!user) {
      return error(res, '用户不存在', 404);
    }
    
    return success(res, user, '获取成功');
  } catch (err) {
    logger.error(`获取用户详情失败: ${err.message}`);
    return error(res, '获取用户详情失败', 500);
  }
});

/**
 * 编辑用户
 * PUT /api/admin/user/update/:id
 */
router.put('/update/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar, bio, status } = req.body;
    
    if (!id) {
      return error(res, '缺少用户ID', 400);
    }
    
    await UserService.updateUser(id, {
      name,
      avatar,
      bio,
      status
    });
    
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`编辑用户失败: ${err.message}`);
    return error(res, err.message || '编辑用户失败', 500);
  }
});

/**
 * 删除用户
 * DELETE /api/admin/user/delete/:id
 */
router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少用户ID', 400);
    }
    
    await UserService.deleteUser(id);
    
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除用户失败: ${err.message}`);
    return error(res, err.message || '删除用户失败', 500);
  }
});

module.exports = router;
