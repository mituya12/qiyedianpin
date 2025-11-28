const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const FeedbackService = require('../../src/services/mobile/FeedbackService');

/**
 * 提交反馈
 * POST /api/c/feedback/create
 * 需要认证
 */
router.post('/create', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, content, contact } = req.body;

    logger.info(`路由接收到的body: ${JSON.stringify(req.body)}`);
    logger.info(`提取的参数: category=${category}, content=${content}, contact=${contact}`);

    // 参数验证
    if (!category || !content) {
      return error(res, '缺少必填参数', 400);
    }

    const result = await FeedbackService.createFeedback(userId, {
      category,
      content,
      contact
    });

    return success(res, result, '反馈提交成功');
  } catch (err) {
    logger.error(`提交反馈失败: ${err.message}`);
    return error(res, err.message || '提交反馈失败', 500);
  }
});

/**
 * 获取我的反馈列表
 * GET /api/c/feedback/list
 * 需要认证
 */
router.get('/list', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await FeedbackService.getMyFeedbackList(
      userId,
      parseInt(page),
      parseInt(pageSize)
    );

    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取我的反馈列表失败: ${err.message}`);
    return error(res, '获取我的反馈列表失败', 500);
  }
});

/**
 * 获取反馈详情
 * GET /api/c/feedback/detail/:id
 * 需要认证
 */
router.get('/detail/:id', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const feedback = await FeedbackService.getFeedbackDetail(id, userId);

    if (!feedback) {
      return error(res, '反馈不存在或无权访问', 404);
    }

    return success(res, feedback, '获取成功');
  } catch (err) {
    logger.error(`获取反馈详情失败: ${err.message}`);
    return error(res, '获取反馈详情失败', 500);
  }
});

module.exports = router;
