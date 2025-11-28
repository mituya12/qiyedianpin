const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Response = require('../utils/response');

// 测试路由
router.get('/test', (req, res) => {
  Response.success(res, { message: '后台端API测试成功' }, '后台端API测试成功');
});

// 需要认证的路由示例
router.get('/protected', adminAuth, (req, res) => {
  Response.success(res, { user: req.user }, '认证成功');
});

module.exports = router; 