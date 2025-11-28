const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');

class ConfigService {
  async getConfig() {
    try {
      const sql = 'SELECT config_key, config_value FROM system_config';
      const result = await query(sql);
      
      const config = {};
      result.forEach(item => {
        const key = item.config_key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        config[key] = item.config_value;
      });
      
      return config;
    } catch (error) {
      logger.error(`获取系统配置失败: ${error.message}`);
      throw error;
    }
  }

  async updateConfig(configData) {
    try {
      for (const [key, value] of Object.entries(configData)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        
        const checkSql = 'SELECT id FROM system_config WHERE config_key = ?';
        const checkResult = await query(checkSql, [dbKey]);
        
        if (checkResult.length > 0) {
          const updateSql = 'UPDATE system_config SET config_value = ? WHERE config_key = ?';
          await query(updateSql, [value, dbKey]);
        } else {
          const insertSql = 'INSERT INTO system_config (config_key, config_value, config_desc) VALUES (?, ?, ?)';
          await query(insertSql, [dbKey, value, '']);
        }
      }
      
      logger.info('更新系统配置成功');
      return true;
    } catch (error) {
      logger.error(`更新系统配置失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ConfigService();
