const express = require('express');
const router = express.Router();
const { success, error } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { uploadSingle } = require('../../middlewares/upload');
const UploadService = require('../../src/services/admin/UploadService');

router.post('/image', authMiddleware(USER_TYPES.ADMIN), uploadSingle('file'), async (req, res) => {
  try {
    const file = req.file;
    const result = await UploadService.uploadImage(file.buffer, file.originalname);
    return success(res, result, '上传成功');
  } catch (err) {
    logger.error(`上传图片失败: ${err.message}`);
    return error(res, '上传图片失败', 500);
  }
});

module.exports = router;
