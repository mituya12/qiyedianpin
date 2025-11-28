const express = require('express');
const router = express.Router();
const { success, error } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ConfigService = require('../../src/services/admin/ConfigService');

router.get('/get', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const config = await ConfigService.getConfig();
    return success(res, config, '获取成功');
  } catch (err) {
    logger.error(`获取系统配置失败: ${err.message}`);
    return error(res, '获取系统配置失败', 500);
  }
});

router.post('/update', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    await ConfigService.updateConfig(req.body);
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`更新系统配置失败: ${err.message}`);
    return error(res, '更新系统配置失败', 500);
  }
});

module.exports = router;
