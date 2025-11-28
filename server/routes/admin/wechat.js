const express = require('express');
const router = express.Router();
const { success, error } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { uploadSingle } = require('../../middlewares/upload');
const WechatService = require('../../src/services/admin/WechatService');

router.post('/msg-sec-check', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return error(res, '缺少检测内容', 400);
    }
    
    const result = await WechatService.msgSecCheck(content);
    return success(res, result, '检测完成');
  } catch (err) {
    logger.error(`文本内容安全检测失败: ${err.message}`);
    return error(res, '文本内容安全检测失败', 500);
  }
});

router.post('/img-sec-check', authMiddleware(USER_TYPES.ADMIN), uploadSingle('media'), async (req, res) => {
  try {
    const file = req.file;
    const result = await WechatService.imgSecCheck(file.buffer);
    return success(res, result, '检测完成');
  } catch (err) {
    logger.error(`图片内容安全检测失败: ${err.message}`);
    return error(res, '图片内容安全检测失败', 500);
  }
});

module.exports = router;
