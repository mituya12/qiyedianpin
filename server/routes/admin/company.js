const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const CompanyService = require('../../src/services/admin/CompanyService');

/**
 * 获取企业列表
 * GET /api/admin/company/list
 */
router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { name, alias, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    
    const result = await CompanyService.getCompanyList(
      { name, alias, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取企业列表失败: ${err.message}`);
    return error(res, '获取企业列表失败', 500);
  }
});

/**
 * 获取企业详情
 * GET /api/admin/company/detail/:id
 */
router.get('/detail/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少企业ID', 400);
    }
    
    const company = await CompanyService.getCompanyDetail(id);
    
    if (!company) {
      return error(res, '企业不存在', 404);
    }
    
    return success(res, company, '获取成功');
  } catch (err) {
    logger.error(`获取企业详情失败: ${err.message}`);
    return error(res, '获取企业详情失败', 500);
  }
});

/**
 * 新增企业
 * POST /api/admin/company/create
 */
router.post('/create', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { name, alias } = req.body;
    
    if (!name) {
      return error(res, '企业名称不能为空', 400);
    }
    
    const result = await CompanyService.createCompany({
      name,
      alias
    });
    
    return success(res, result, '新增成功');
  } catch (err) {
    logger.error(`新增企业失败: ${err.message}`);
    return error(res, err.message || '新增企业失败', 500);
  }
});

/**
 * 编辑企业
 * PUT /api/admin/company/update/:id
 */
router.put('/update/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, alias } = req.body;
    
    if (!id) {
      return error(res, '缺少企业ID', 400);
    }
    
    await CompanyService.updateCompany(id, {
      name,
      alias
    });
    
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`编辑企业失败: ${err.message}`);
    return error(res, err.message || '编辑企业失败', 500);
  }
});

/**
 * 删除企业
 * DELETE /api/admin/company/delete/:id
 */
router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少企业ID', 400);
    }
    
    await CompanyService.deleteCompany(id);
    
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除企业失败: ${err.message}`);
    return error(res, err.message || '删除企业失败', 500);
  }
});

module.exports = router;
