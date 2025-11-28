const { query } = require('../../../utils/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../../utils/logger');

class CompanyService {
  /**
   * 获取企业列表
   */
  async getCompanyList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { name, alias, startDate, endDate } = filters;
      
      // 构建查询条件
      let whereClauses = [];
      let params = [];
      
      if (name) {
        whereClauses.push('name LIKE ?');
        params.push(`%${name}%`);
      }
      if (alias) {
        whereClauses.push('alias LIKE ?');
        params.push(`%${alias}%`);
      }
      if (startDate) {
        whereClauses.push('DATE(created_at) >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('DATE(created_at) <= ?');
        params.push(endDate);
      }
      
      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
      
      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM companies ${whereSQL}`;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT 
          id, name, alias,
          total_rating as totalRating,
          review_count as reviewCount,
          created_at as createdAt
        FROM companies
        ${whereSQL}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取企业列表失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取企业详情
   */
  async getCompanyDetail(id) {
    try {
      const sql = `
        SELECT 
          id, name, alias,
          total_rating as totalRating,
          review_count as reviewCount,
          created_at as createdAt,
          updated_at as updatedAt
        FROM companies
        WHERE id = ?
      `;
      const result = await query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      logger.error(`获取企业详情失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 新增企业
   */
  async createCompany(companyData) {
    try {
      const { name, alias } = companyData;
      
      // 检查企业名称是否已存在
      const checkSql = 'SELECT id FROM companies WHERE name = ?';
      const checkResult = await query(checkSql, [name]);
      
      if (checkResult.length > 0) {
        throw new Error('企业名称已存在');
      }
      
      // 创建企业(id自增)
      const insertSql = `
        INSERT INTO companies (name, alias)
        VALUES (?, ?)
      `;
      const result = await query(insertSql, [
        name,
        alias || ''
      ]);
      
      logger.info(`新增企业成功: ${name}`);
      return { companyId: result.insertId };
    } catch (error) {
      logger.error(`新增企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 编辑企业
   */
  async updateCompany(id, companyData) {
    try {
      const { name, alias } = companyData;
      
      // 检查企业是否存在
      const checkSql = 'SELECT id FROM companies WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('企业不存在');
      }
      
      // 构建更新字段
      const updates = [];
      const params = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (alias !== undefined) {
        updates.push('alias = ?');
        params.push(alias);
      }
      
      if (updates.length === 0) {
        return true;
      }
      
      params.push(id);
      const updateSql = `UPDATE companies SET ${updates.join(', ')} WHERE id = ?`;
      await query(updateSql, params);
      
      logger.info(`编辑企业成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`编辑企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除企业
   */
  async deleteCompany(id) {
    try {
      // 检查企业是否存在
      const checkSql = 'SELECT id FROM companies WHERE id = ?';
      const checkResult = await query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        throw new Error('企业不存在');
      }
      
      // 获取企业名称
      const nameSql = 'SELECT name FROM companies WHERE id = ?';
      const nameResult = await query(nameSql, [id]);
      const companyName = nameResult[0].name;
      
      // 删除企业相关的评价和回复
      const reviewsSql = 'SELECT id FROM reviews WHERE company_name = ?';
      const reviews = await query(reviewsSql, [companyName]);
      
      for (const review of reviews) {
        await query('DELETE FROM replies WHERE review_id = ?', [review.id]);
      }
      
      await query('DELETE FROM reviews WHERE company_name = ?', [companyName]);
      
      // 删除企业
      const deleteSql = 'DELETE FROM companies WHERE id = ?';
      await query(deleteSql, [id]);
      
      logger.info(`删除企业成功: ${id}`);
      return true;
    } catch (error) {
      logger.error(`删除企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 更新企业评分和评价数
   */
  async updateCompanyRating(companyName) {
    try {
      const sql = `
        UPDATE companies c
        SET 
          total_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE company_name = c.name AND audit_status = 1
          ),
          review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE company_name = c.name AND audit_status = 1
          )
        WHERE c.name = ?
      `;
      await query(sql, [companyName]);
      logger.info(`更新企业评分成功: ${companyName}`);
    } catch (error) {
      logger.error(`更新企业评分失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CompanyService();
