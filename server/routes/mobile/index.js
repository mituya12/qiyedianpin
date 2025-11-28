/**
 * 移动端路由索引文件
 * 集中管理所有移动端API路由
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success } = require('../../utils/response');

// 示例路由 - 不需要认证
router.get('/public', (req, res) => {
  success(res, { message: '这是一个公开的移动端API' });
});

// 示例路由 - 需要移动端认证
router.get('/protected', authMiddleware(USER_TYPES.MOBILE), (req, res) => {
  success(res, { 
    message: '这是一个受保护的移动端API',
    user: req.user
  });
});

// 注册子路由模块
const userRoutes = require('./user');
const companyRoutes = require('./company');
const reviewRoutes = require('./review');
const replyRoutes = require('./reply');
const reportRoutes = require('./report');
const feedbackRoutes = require('./feedback');
const uploadRoutes = require('./upload');

// 用户相关路由
router.use('/user', userRoutes);

// 企业相关路由
router.use('/company', companyRoutes);

// 评价相关路由
router.use('/review', reviewRoutes);

// 回复相关路由
router.use('/reply', replyRoutes);

// 举报相关路由
router.use('/report', reportRoutes);

// 反馈相关路由
router.use('/feedback', feedbackRoutes);

// 文件上传路由
router.use('/upload', uploadRoutes);

module.exports = router; 