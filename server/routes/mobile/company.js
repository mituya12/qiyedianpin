const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const CompanyService = require('../../src/services/mobile/CompanyService');

/**
 * 搜索企业
 * GET /api/c/company/search
 * 参数: keyword, page, pageSize
 */
router.get('/search', async (req, res) => {
  try {
    const { keyword = '', page = 1, pageSize = 10 } = req.query;
    
    const result = await CompanyService.searchCompanies(
      keyword,
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
    logger.error(`搜索企业失败: ${err.message}`);
    return error(res, '搜索企业失败', 500);
  }
});

/**
 * 获取企业详情
 * GET /api/c/company/detail/:id
 */
router.get('/detail/:id', async (req, res) => {
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
 * 获取热门企业列表
 * GET /api/c/company/trending
 * 参数: limit
 */
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const list = await CompanyService.getTrendingCompanies(parseInt(limit));
    
    return success(res, list, '获取成功');
  } catch (err) {
    logger.error(`获取热门企业失败: ${err.message}`);
    return error(res, '获取热门企业失败', 500);
  }
});

/**
 * 获取相似企业
 * GET /api/c/company/similar/:id
 * 参数: limit
 */
router.get('/similar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;
    
    if (!id) {
      return error(res, '缺少企业ID', 400);
    }
    
    const list = await CompanyService.getSimilarCompanies(id, parseInt(limit));
    
    return success(res, list, '获取成功');
  } catch (err) {
    logger.error(`获取相似企业失败: ${err.message}`);
    return error(res, '获取相似企业失败', 500);
  }
});

/**
 * 获取搜索建议
 * GET /api/c/company/suggestions
 * 参数: keyword, limit
 */
router.get('/suggestions', async (req, res) => {
  try {
    const { keyword = '', limit = 10 } = req.query;
    
    if (!keyword || keyword.trim() === '') {
      return success(res, [], '获取成功');
    }
    
    const list = await CompanyService.getCompanySuggestions(
      keyword.trim(),
      parseInt(limit)
    );
    
    return success(res, list, '获取成功');
  } catch (err) {
    logger.error(`获取搜索建议失败: ${err.message}`);
    return error(res, '获取搜索建议失败', 500);
  }
});

module.exports = router;
