/**
 * B端企业管理API测试
 */
const request = require('../utils/request');
const logger = require('../utils/logger');

let companyId = null;

async function testCompanyManagement() {
  logger.title('B端企业管理测试');

  try {
    // 1. 获取企业列表
    logger.subtitle('1. 测试获取企业列表');
    const listRes = await request.get('/api/admin/company/list', {
      page: 1,
      pageSize: 10
    });
    
    if (listRes.code === 200) {
      logger.success('获取企业列表成功');
      logger.data('企业总数', listRes.data.pagination.total);
      if (listRes.data.items.length > 0) {
        companyId = listRes.data.items[0].id;
      }
    } else {
      logger.error('获取企业列表失败');
    }

    // 2. 获取企业详情
    if (companyId) {
      logger.subtitle('2. 测试获取企业详情');
      const detailRes = await request.get(`/api/admin/company/detail/${companyId}`);
      
      if (detailRes.code === 200) {
        logger.success('获取企业详情成功');
        logger.data('企业信息', detailRes.data);
      } else {
        logger.error('获取企业详情失败');
      }
    }

    // 3. 新增企业
    logger.subtitle('3. 测试新增企业');
    const createRes = await request.post('/api/admin/company/create', {
      name: '测试企业B' + Date.now(),
      alias: '测试B'
    });
    
    if (createRes.code === 200) {
      logger.success('新增企业成功');
      logger.data('企业ID', createRes.data.companyId);
      companyId = createRes.data.companyId;
    } else {
      logger.error('新增企业失败');
    }

    // 4. 编辑企业
    if (companyId) {
      logger.subtitle('4. 测试编辑企业');
      const updateRes = await request.put(`/api/admin/company/update/${companyId}`, {
        alias: '测试B更新'
      });
      
      if (updateRes.code === 200) {
        logger.success('编辑企业成功');
      } else {
        logger.error('编辑企业失败');
      }
    }

    // 5. 删除企业
    if (companyId) {
      logger.subtitle('5. 测试删除企业');
      const deleteRes = await request.delete(`/api/admin/company/delete/${companyId}`);
      
      if (deleteRes.code === 200) {
        logger.success('删除企业成功');
      } else {
        logger.warn('删除企业失败');
      }
    }

    logger.success('企业管理测试完成\n');
    return true;

  } catch (error) {
    logger.error('企业管理测试失败: ' + (error.message || JSON.stringify(error)));
    return false;
  }
}

module.exports = { testCompanyManagement };
