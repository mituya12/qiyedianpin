/**
 * 后台路由索引文件
 * 集中管理所有后台API路由
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success } = require('../../utils/response');

// 示例路由 - 不需要认证
router.get('/public', (req, res) => {
  success(res, { message: '这是一个公开的后台API' });
});

// 示例路由 - 需要后台认证
router.get('/protected', authMiddleware(USER_TYPES.ADMIN), (req, res) => {
  success(res, { 
    message: '这是一个受保护的后台API',
    user: req.user
  });
});

// 注册子路由模块
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const companyRoutes = require('./company');
const userRoutes = require('./user');
const reviewRoutes = require('./review');
const replyRoutes = require('./reply');
const reportRoutes = require('./report');
const feedbackRoutes = require('./feedback');
const statisticsRoutes = require('./statistics');
const configRoutes = require('./config');
const uploadRoutes = require('./upload');
const wechatRoutes = require('./wechat');

// 认证相关路由
router.use('/auth', authRoutes);

// 管理员管理路由
router.use('/admin', adminRoutes);

// 企业管理路由
router.use('/company', companyRoutes);

// 用户管理路由
router.use('/user', userRoutes);

// 评价管理路由
router.use('/review', reviewRoutes);

// 回复管理路由
router.use('/reply', replyRoutes);

// 举报管理路由
router.use('/report', reportRoutes);

// 反馈管理路由
router.use('/feedback', feedbackRoutes);

// 统计分析路由
router.use('/statistics', statisticsRoutes);

// 系统配置路由
router.use('/config', configRoutes);

// 文件上传路由
router.use('/upload', uploadRoutes);

// 微信内容安全路由
router.use('/wechat', wechatRoutes);

module.exports = router; 