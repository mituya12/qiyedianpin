const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const StatisticsService = require('../../src/services/admin/StatisticsService');

router.get('/overview', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const data = await StatisticsService.getOverview();
    return success(res, data, '获取成功');
  } catch (err) {
    logger.error(`获取数据概览失败: ${err.message}`);
    return error(res, '获取数据概览失败', 500);
  }
});

router.get('/user-trend', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const data = await StatisticsService.getUserTrend(parseInt(days));
    return success(res, data, '获取成功');
  } catch (err) {
    logger.error(`获取用户注册趋势失败: ${err.message}`);
    return error(res, '获取用户注册趋势失败', 500);
  }
});

router.get('/review-trend', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const data = await StatisticsService.getReviewTrend(parseInt(days));
    return success(res, data, '获取成功');
  } catch (err) {
    logger.error(`获取评价发布趋势失败: ${err.message}`);
    return error(res, '获取评价发布趋势失败', 500);
  }
});

router.get('/rating-distribution', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const data = await StatisticsService.getRatingDistribution();
    return success(res, data, '获取成功');
  } catch (err) {
    logger.error(`获取评分分布失败: ${err.message}`);
    return error(res, '获取评分分布失败', 500);
  }
});

router.get('/company-list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { companyName, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    
    const result = await StatisticsService.getCompanyList(
      { companyName, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取企业统计列表失败: ${err.message}`);
    return error(res, '获取企业统计列表失败', 500);
  }
});

module.exports = router;
