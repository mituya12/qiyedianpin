const express = require('express');
const router = express.Router();
const { success, error } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ReportService = require('../../src/services/mobile/ReportService');

/**
 * 提交举报
 * POST /api/c/report/create
 * 需要认证
 */
router.post('/create', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentType, contentId, reason, description } = req.body;
    
    // 参数验证
    if (!contentType || !contentId || !reason) {
      return error(res, '缺少必填参数', 400);
    }
    
    const result = await ReportService.createReport(userId, {
      contentType,
      contentId,
      reason,
      description
    });
    
    return success(res, result, '举报成功');
  } catch (err) {
    logger.error(`提交举报失败: ${err.message}`);
    return error(res, err.message || '提交举报失败', 500);
  }
});

module.exports = router;
