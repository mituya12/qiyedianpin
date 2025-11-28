const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ReplyService = require('../../src/services/admin/ReplyService');

router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { replyId, author, reviewId, isOfficial, auditStatus, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    
    const result = await ReplyService.getReplyList(
      { replyId, author, reviewId, isOfficial, auditStatus, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取回复列表失败: ${err.message}`);
    return error(res, '获取回复列表失败', 500);
  }
});

router.get('/detail/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const reply = await ReplyService.getReplyDetail(id);
    
    if (!reply) {
      return error(res, '回复不存在', 404);
    }
    
    return success(res, reply, '获取成功');
  } catch (err) {
    logger.error(`获取回复详情失败: ${err.message}`);
    return error(res, '获取回复详情失败', 500);
  }
});

router.put('/update/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isOfficial, auditStatus } = req.body;
    
    await ReplyService.updateReply(id, { content, isOfficial, auditStatus });
    return success(res, null, '更新成功');
  } catch (err) {
    logger.error(`编辑回复失败: ${err.message}`);
    return error(res, err.message || '编辑回复失败', 500);
  }
});

router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    await ReplyService.deleteReply(id);
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除回复失败: ${err.message}`);
    return error(res, err.message || '删除回复失败', 500);
  }
});

router.post('/audit/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { auditStatus, remark } = req.body;
    
    await ReplyService.auditReply(id, auditStatus, remark);
    return success(res, null, '审核成功');
  } catch (err) {
    logger.error(`审核回复失败: ${err.message}`);
    return error(res, err.message || '审核回复失败', 500);
  }
});

module.exports = router;
