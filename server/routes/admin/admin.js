const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const AdminService = require('../../src/services/admin/AdminService');

/**
 * 获取管理员列表
 * GET /api/admin/admin/list
 * 需要认证
 */
router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { username, name, role, status, page = 1, pageSize = 10 } = req.query;
    
    const result = await AdminService.getAdminList(
      { username, name, role, status },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(
      res,
      result.list,
      result.total,
      result.page,
      result.pageSize,
      '获取成功'
    );
  } catch (err) {
    logger.error(`获取管理员列表失败: ${err.message}`);
    return error(res, '获取管理员列表失败', 500);
  }
});

/**
 * 新增管理员
 * POST /api/admin/admin/create
 * 需要认证
 */
router.post('/create', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { username, password, name, role, status, remark } = req.body;
    
    // 参数验证
    if (!username || !password || !name || !role) {
      return error(res, '缺少必填参数', 400);
    }
    
    const result = await AdminService.createAdmin({
      username,
      password,
      name,
      role,
      status,
      remark
    });
    
    return success(res, result, '新增成功');
  } catch (err) {
    logger.error(`新增管理员失败: ${err.message}`);
    return error(res, err.message || '新增管理员失败', 500);
  }
});

/**
 * 编辑管理员
 * PUT /api/admin/admin/update/:id
 * 需要认证
 */
router.put('/update/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role, status, remark } = req.body;
    
    if (!id) {
      return error(res, '缺少管理员ID', 400);
    }
    
    await AdminService.updateAdmin(id, {
      name,
      password,
      role,
      status,
      remark
    });
    
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`编辑管理员失败: ${err.message}`);
    return error(res, err.message || '编辑管理员失败', 500);
  }
});

/**
 * 删除管理员
 * DELETE /api/admin/admin/delete/:id
 * 需要认证
 */
router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少管理员ID', 400);
    }
    
    await AdminService.deleteAdmin(id);
    
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除管理员失败: ${err.message}`);
    return error(res, err.message || '删除管理员失败', 500);
  }
});

module.exports = router;
