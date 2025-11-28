const logger = require('../../utils/logger');

const createSystemConfigTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`system_config\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '配置ID',
      \`config_key\` varchar(50) NOT NULL DEFAULT '' COMMENT '配置键',
      \`config_value\` text NOT NULL COMMENT '配置值',
      \`config_desc\` varchar(200) NOT NULL DEFAULT '' COMMENT '配置描述',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`uk_config_key\` (\`config_key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
  `;

  try {
    await connection.query(sql);
    logger.info('系统配置表(system_config)创建成功');
    return true;
  } catch (error) {
    logger.error(`系统配置表(system_config)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createSystemConfigTable;
