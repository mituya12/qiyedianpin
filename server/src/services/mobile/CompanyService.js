const { query } = require('../../../utils/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../../utils/logger');

class CompanyService {
  /**
   * 搜索企业
   * @param {String} keyword - 搜索关键词
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   */
  async searchCompanies(keyword, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      // 构建查询条件
      let whereSql = 'WHERE 1=1';
      const params = [];
      
      if (keyword) {
        whereSql += ' AND (name LIKE ? OR alias LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      
      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM companies ${whereSql}`;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      // 查询列表
      const listSql = `
        SELECT id, name, alias, total_rating as totalRating, review_count as reviewCount
        FROM companies
        ${whereSql}
        ORDER BY review_count DESC, total_rating DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`搜索企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取企业详情
   * @param {String} id - 企业ID
   */
  async getCompanyDetail(id) {
    try {
      const sql = `
        SELECT 
          id, name, alias,
          total_rating as totalRating,
          review_count as reviewCount,
          created_at as createdAt
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
   * 获取热门企业列表
   * @param {Number} limit - 数量限制
   */
  async getTrendingCompanies(limit = 10) {
    try {
      const sql = `
        SELECT 
          id, name, alias,
          total_rating as totalRating,
          review_count as reviewCount,
          created_at as createdAt
        FROM companies
        ORDER BY created_at DESC, review_count DESC, total_rating DESC
        LIMIT ?
      `;
      const list = await query(sql, [limit]);
      return list;
    } catch (error) {
      logger.error(`获取热门企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取相似企业
   * @param {String} id - 企业ID
   * @param {Number} limit - 数量限制
   */
  async getSimilarCompanies(id, limit = 5) {
    try {
      // 先获取当前企业信息
      const currentCompany = await this.getCompanyDetail(id);
      if (!currentCompany) {
        return [];
      }
      
      // 简单实现: 返回评分相近的其他企业
      const sql = `
        SELECT 
          id, name, alias,
          total_rating as totalRating,
          review_count as reviewCount
        FROM companies
        WHERE id != ?
        ORDER BY ABS(total_rating - ?) ASC, review_count DESC
        LIMIT ?
      `;
      const list = await query(sql, [id, currentCompany.totalRating, limit]);
      return list;
    } catch (error) {
      logger.error(`获取相似企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 创建企业(发布评价时自动创建)
   * @param {Object} companyData - 企业数据
   */
  async createCompany(companyData) {
    try {
      const { companyName, alias } = companyData;
      
      // 检查企业是否已存在(通过企业名称)
      const existSql = 'SELECT id FROM companies WHERE name = ?';
      const existResult = await query(existSql, [companyName]);
      
      if (existResult.length > 0) {
        return existResult[0];
      }
      
      // 创建新企业(id自增)
      const insertSql = `
        INSERT INTO companies (name, alias)
        VALUES (?, ?)
      `;
      const result = await query(insertSql, [companyName, alias || '']);
      
      logger.info(`创建企业成功: ${companyName}`);
      return { id: result.insertId };
    } catch (error) {
      logger.error(`创建企业失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 更新企业评分和评价数
   * @param {String} companyName - 企业名称
   */
  async updateCompanyRating(companyName) {
    try {
      // 计算平均评分
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

  /**
   * 获取搜索建议
   * @param {String} keyword - 搜索关键词
   * @param {Number} limit - 返回数量限制
   */
  async getCompanySuggestions(keyword, limit = 10) {
    try {
      if (!keyword || keyword.trim() === '') {
        return [];
      }

      // 构建分散匹配条件(每个字都要在名称中出现)
      const chars = keyword.split('');
      let likeConditions = chars.map(() => 'name LIKE ?').join(' AND ');
      let aliasLikeConditions = chars.map(() => 'alias LIKE ?').join(' AND ');
      
      // 为每个字符构建LIKE参数
      const charParams = [];
      chars.forEach(char => {
        charParams.push(`%${char}%`);
      });

      const sql = `
        SELECT 
          id,
          name,
          alias,
          total_rating as totalRating,
          review_count as reviewCount,
          CASE 
            WHEN name = ? THEN 100
            WHEN alias = ? THEN 95
            WHEN name LIKE CONCAT(?, '%') THEN 90
            WHEN alias LIKE CONCAT(?, '%') THEN 85
            WHEN name LIKE CONCAT('%', ?, '%') THEN 80
            WHEN alias LIKE CONCAT('%', ?, '%') THEN 75
            WHEN ${likeConditions} THEN 65
            WHEN ${aliasLikeConditions} THEN 60
            ELSE 50
          END AS matchScore,
          CASE 
            WHEN name LIKE CONCAT('%', ?, '%') OR alias LIKE CONCAT('%', ?, '%') 
            THEN 'exact'
            ELSE 'related'
          END AS matchType
        FROM companies
        WHERE name LIKE CONCAT('%', ?, '%') 
           OR alias LIKE CONCAT('%', ?, '%')
           OR (${likeConditions})
           OR (${aliasLikeConditions})
        ORDER BY matchScore DESC, reviewCount DESC
        LIMIT ?
      `;
      
      const params = [
        keyword, keyword,  // 完全匹配
        keyword, keyword,  // 开头匹配
        keyword, keyword,  // 包含匹配
        ...charParams,     // 名称分散匹配
        ...charParams,     // 别名分散匹配
        keyword, keyword,  // matchType判断
        keyword, keyword,  // WHERE条件
        ...charParams,     // WHERE分散匹配(名称)
        ...charParams,     // WHERE分散匹配(别名)
        limit
      ];
      
      const results = await query(sql, params);
      return results;
    } catch (error) {
      logger.error(`获取搜索建议失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CompanyService();
