const express = require('express');
const router = express.Router();
const { mobileAuth } = require('../middleware/auth');
const Response = require('../utils/response');

// 测试路由
router.get('/test', (req, res) => {
  Response.success(res, { message: '移动端API测试成功' }, '移动端API测试成功');
});

// 需要认证的路由示例
router.get('/protected', mobileAuth, (req, res) => {
  Response.success(res, { user: req.user }, '认证成功');
});

module.exports = router; 