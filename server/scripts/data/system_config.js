const logger = require('../../utils/logger');

const initSystemConfigData = async (connection) => {
  try {
    // 检查是否已有系统配置数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM system_config');
    if (rows[0].count > 0) {
      logger.info('系统配置数据已存在,跳过初始化');
      return true;
    }

    const sql = `
      INSERT INTO \`system_config\` (\`config_key\`, \`config_value\`, \`config_desc\`) VALUES
      ('platform_name', '企业点评平台', '平台名称'),
      ('review_audit', '1', '评价审核开关：1开启 0关闭'),
      ('reply_audit', '1', '回复审核开关：1开启 0关闭'),
      ('company_audit', '1', '企业审核开关：1开启 0关闭'),
      ('wechat_content_check', '1', '微信内容安全检测开关：1开启 0关闭');
    `;

    await connection.query(sql);
    logger.info('系统配置初始数据插入成功');
    return true;
  } catch (error) {
    logger.error(`系统配置初始数据插入失败: ${error.message}`);
    throw error;
  }
};

module.exports = initSystemConfigData;
