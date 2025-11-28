const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const FeedbackService = require('../../src/services/admin/FeedbackService');

/**
 * 获取反馈列表
 * GET /api/admin/feedback/list
 */
router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { feedbackId, userName, category, status, startDate, endDate, page = 1, pageSize = 10 } = req.query;

    const result = await FeedbackService.getFeedbackList(
      { feedbackId, userName, category, status, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );

    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取反馈列表失败: ${err.message}`);
    return error(res, '获取反馈列表失败', 500);
  }
});

/**
 * 获取反馈详情
 * GET /api/admin/feedback/detail/:id
 */
router.get('/detail/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await FeedbackService.getFeedbackDetail(id);

    if (!feedback) {
      return error(res, '反馈不存在', 404);
    }

    return success(res, feedback, '获取成功');
  } catch (err) {
    logger.error(`获取反馈详情失败: ${err.message}`);
    return error(res, '获取反馈详情失败', 500);
  }
});

/**
 * 处理反馈(回复)
 * POST /api/admin/feedback/handle/:id
 */
router.post('/handle/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status = 1 } = req.body;

    if (!reply) {
      return error(res, '回复内容不能为空', 400);
    }

    await FeedbackService.handleFeedback(id, reply, status);
    return success(res, null, '处理成功');
  } catch (err) {
    logger.error(`处理反馈失败: ${err.message}`);
    return error(res, err.message || '处理反馈失败', 500);
  }
});

/**
 * 更新反馈状态
 * PUT /api/admin/feedback/status/:id
 */
router.put('/status/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === undefined || status === '') {
      return error(res, '状态不能为空', 400);
    }

    await FeedbackService.updateFeedbackStatus(id, status);
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`更新反馈状态失败: ${err.message}`);
    return error(res, err.message || '更新反馈状态失败', 500);
  }
});

/**
 * 删除反馈
 * DELETE /api/admin/feedback/delete/:id
 */
router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    await FeedbackService.deleteFeedback(id);
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除反馈失败: ${err.message}`);
    return error(res, err.message || '删除反馈失败', 500);
  }
});

module.exports = router;
