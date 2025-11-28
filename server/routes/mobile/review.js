const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ReviewService = require('../../src/services/mobile/ReviewService');

/**
 * 获取企业评价列表
 * GET /api/c/review/list
 * 参数: companyName, sortBy, page, pageSize
 */
router.get('/list', async (req, res) => {
  try {
    const { companyName, sortBy = 'newest', page = 1, pageSize = 10 } = req.query;
    
    if (!companyName) {
      return error(res, '缺少企业名称', 400);
    }
    
    const result = await ReviewService.getReviewList(
      companyName,
      sortBy,
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
    logger.error(`获取评价列表失败: ${err.message}`);
    return error(res, '获取评价列表失败', 500);
  }
});

/**
 * 获取评价详情
 * GET /api/c/review/detail/:id
 */
router.get('/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少评价ID', 400);
    }
    
    const review = await ReviewService.getReviewDetail(id);
    
    if (!review) {
      return error(res, '评价不存在', 404);
    }
    
    return success(res, review, '获取成功');
  } catch (err) {
    logger.error(`获取评价详情失败: ${err.message}`);
    return error(res, '获取评价详情失败', 500);
  }
});

/**
 * 发布评价
 * POST /api/c/review/create
 * 需要认证
 */
router.post('/create', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      companyName,
      companyAlias,
      status,
      department,
      isBranch,
      rating,
      content,
      salary,
      benefits
    } = req.body;
    
    // 参数验证
    if (!companyName || !status || !department || !rating || !content) {
      return error(res, '缺少必填参数', 400);
    }
    
    if (rating < 1 || rating > 5) {
      return error(res, '评分必须在1-5之间', 400);
    }
    
    const result = await ReviewService.createReview(userId, {
      companyName,
      companyAlias,
      status,
      department,
      isBranch,
      rating,
      content,
      salary,
      benefits
    });
    
    return success(res, result, '发布成功');
  } catch (err) {
    logger.error(`发布评价失败: ${err.message}`);
    return error(res, err.message || '发布评价失败', 500);
  }
});

/**
 * 删除评价
 * DELETE /api/c/review/delete/:id
 * 需要认证
 */
router.delete('/delete/:id', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少评价ID', 400);
    }
    
    await ReviewService.deleteReview(id, userId);
    
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除评价失败: ${err.message}`);
    return error(res, err.message || '删除评价失败', 500);
  }
});

/**
 * 点赞评价
 * POST /api/c/review/like/:id
 * 需要认证
 */
router.post('/like/:id', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!id) {
      return error(res, '缺少评价ID', 400);
    }
    
    const result = await ReviewService.likeReview(id, userId);
    
    return success(res, result, '点赞成功');
  } catch (err) {
    logger.error(`点赞评价失败: ${err.message}`);
    return error(res, err.message || '点赞评价失败', 500);
  }
});

/**
 * 获取我的评价列表
 * GET /api/c/review/my-list
 * 需要认证
 */
router.get('/my-list', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10 } = req.query;
    
    const result = await ReviewService.getMyReviewList(
      userId,
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
    logger.error(`获取我的评价列表失败: ${err.message}`);
    return error(res, '获取我的评价列表失败', 500);
  }
});

module.exports = router;
