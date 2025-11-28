const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class StatisticsService {
  async getOverview() {
    try {
      const sql = `
        SELECT 
          (SELECT COUNT(*) FROM companies) as totalCompanies,
          (SELECT COUNT(*) FROM users) as totalUsers,
          (SELECT COUNT(*) FROM reviews) as totalReviews,
          (SELECT COUNT(*) FROM replies) as totalReplies,
          (SELECT COUNT(*) FROM companies WHERE DATE(created_at) = CURDATE()) as todayCompanies,
          (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()) as todayUsers,
          (SELECT COUNT(*) FROM reviews WHERE DATE(created_at) = CURDATE()) as todayReviews,
          (SELECT COUNT(*) FROM replies WHERE DATE(created_at) = CURDATE()) as todayReplies,
          0 as pendingCompanies,
          (SELECT COUNT(*) FROM reviews WHERE audit_status = 0) as pendingReviews,
          (SELECT COUNT(*) FROM replies WHERE audit_status = 0) as pendingReplies,
          (SELECT COUNT(*) FROM reports WHERE status = 0) as pendingReports
      `;
      const result = await query(sql);
      return result[0];
    } catch (error) {
      logger.error(`获取数据概览失败: ${error.message}`);
      throw error;
    }
  }

  async getUserTrend(days = 30) {
    try {
      const sql = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      const result = await query(sql, [days]);
      return result;
    } catch (error) {
      logger.error(`获取用户注册趋势失败: ${error.message}`);
      throw error;
    }
  }

  async getReviewTrend(days = 30) {
    try {
      const sql = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM reviews
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      const result = await query(sql, [days]);
      return result;
    } catch (error) {
      logger.error(`获取评价发布趋势失败: ${error.message}`);
      throw error;
    }
  }

  async getRatingDistribution() {
    try {
      const sql = `
        SELECT 
          rating,
          COUNT(*) as count
        FROM reviews
        WHERE audit_status = 1
        GROUP BY rating
        ORDER BY rating DESC
      `;
      const result = await query(sql);
      return result;
    } catch (error) {
      logger.error(`获取评分分布失败: ${error.message}`);
      throw error;
    }
  }

  async getCompanyList(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const { companyName, startDate, endDate } = filters;
      
      let whereClauses = [];
      let params = [];
      
      if (companyName) {
        whereClauses.push('c.name LIKE ?');
        params.push(`%${companyName}%`);
      }
      if (startDate) {
        whereClauses.push('DATE(c.created_at) >= ?');
        params.push(startDate);
      }
      if (endDate) {
        whereClauses.push('DATE(c.created_at) <= ?');
        params.push(endDate);
      }
      
      const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
      
      const countSql = `SELECT COUNT(*) as total FROM companies c ${whereSQL}`;
      const countResult = await query(countSql, params);
      const total = countResult[0].total;
      
      const listSql = `
        SELECT 
          c.id as companyId,
          c.name as companyName,
          c.review_count as reviewCount,
          c.total_rating as avgRating,
          (SELECT COALESCE(SUM(likes), 0) FROM reviews WHERE company_name = c.name) as totalLikes,
          (SELECT COUNT(*) FROM replies rp JOIN reviews r ON rp.review_id = r.id WHERE r.company_name = c.name) as totalReplies,
          (SELECT MAX(DATE(created_at)) FROM reviews WHERE company_name = c.name) as lastReviewDate
        FROM companies c
        ${whereSQL}
        ORDER BY c.review_count DESC
        LIMIT ? OFFSET ?
      `;
      const list = await query(listSql, [...params, pageSize, offset]);
      
      return { list, total, page, pageSize };
    } catch (error) {
      logger.error(`获取企业统计列表失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new StatisticsService();
