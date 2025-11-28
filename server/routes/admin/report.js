const express = require('express');
const router = express.Router();
const { success, error, paginate } = require('../../utils/response');
const logger = require('../../utils/logger');
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const ReportService = require('../../src/services/admin/ReportService');

router.get('/list', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { reportId, userName, contentType, reason, status, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    
    const result = await ReportService.getReportList(
      { reportId, userName, contentType, reason, status, startDate, endDate },
      parseInt(page),
      parseInt(pageSize)
    );
    
    return paginate(res, result.list, result.total, result.page, result.pageSize, '获取成功');
  } catch (err) {
    logger.error(`获取举报列表失败: ${err.message}`);
    return error(res, '获取举报列表失败', 500);
  }
});

router.get('/detail/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ReportService.getReportDetail(id);
    
    if (!report) {
      return error(res, '举报不存在', 404);
    }
    
    return success(res, report, '获取成功');
  } catch (err) {
    logger.error(`获取举报详情失败: ${err.message}`);
    return error(res, '获取举报详情失败', 500);
  }
});

router.post('/handle/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, result } = req.body;
    
    await ReportService.handleReport(id, status, result);
    return success(res, null, '处理成功');
  } catch (err) {
    logger.error(`处理举报失败: ${err.message}`);
    return error(res, err.message || '处理举报失败', 500);
  }
});

router.delete('/delete/:id', authMiddleware(USER_TYPES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    await ReportService.deleteReport(id);
    return success(res, null, '删除成功');
  } catch (err) {
    logger.error(`删除举报失败: ${err.message}`);
    return error(res, err.message || '删除举报失败', 500);
  }
});

module.exports = router;
