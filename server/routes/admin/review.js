const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ReviewService = require('../../src/services/admin/ReviewService');

router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { reviewId, companyName, authorName, status, rating, isBranch, auditStatus, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    
    const result = await ReviewService.getReviewList(
      { reviewId, companyName, authorName, status, rating, isBranch, auditStatus, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取评价列表失败: ${err.message}`);
    return error(res, '获取评价列表失败', 500);
  }
});

router.get('/detail/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
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

router.put('/update/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, department, isBranch, rating, content, salary, benefits, auditStatus } = req.body;
    
    await ReviewService.updateReview(id, {
      status, department, isBranch, rating, content, salary, benefits, auditStatus
    });
    
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`编辑评价失败: ${err.message}`);
    return error(res, err.message || '编辑评价失败', 500);
  }
});

router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewService.deleteReview(id);
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除评价失败: ${err.message}`);
    return error(res, err.message || '删除评价失败', 500);
  }
});

router.post('/audit/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { auditStatus, remark } = req.body;
    
    await ReviewService.auditReview(id, auditStatus, remark);
    return success(res, null, '审核成功');
  } catch (err) {
    logger.error(`审核评价失败: ${err.message}`);
    return error(res, err.message || '审核评价失败', 500);
  }
});

module.exports = router;
