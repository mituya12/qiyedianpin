const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ReplyService = require('../../src/services/mobile/ReplyService');

/**
 * 发布回复
 * POST /api/c/reply/create
 * 需要认证
 */
router.post('/create', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId, content } = req.body;
    
    // 参数验证
    if (!reviewId || !content) {
      return error(res, '缺少必填参数', 400);
    }
    
    if (content.length > 500) {
      return error(res, '回复内容不能超过500字', 400);
    }
    
    const result = await ReplyService.createReply(userId, {
      reviewId,
      content
    });
    
    return success(res, result, '发布成功');
  } catch (err) {
    logger.error(`发布回复失败: ${err.message}`);
    return error(res, err.message || '发布回复失败', 500);
  }
});

/**
 * 获取我的回复列表
 * GET /api/c/reply/my-list
 * 需要认证
 */
router.get('/my-list', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10 } = req.query;
    
    const result = await ReplyService.getMyReplyList(
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
    logger.error(`获取我的回复列表失败: ${err.message}`);
    return error(res, '获取我的回复列表失败', 500);
  }
});

module.exports = router;
