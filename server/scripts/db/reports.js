const logger = require('../../utils/logger');

const createReportsTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`reports\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '举报ID',
      \`user_id\` int(11) unsigned NOT NULL COMMENT '举报人ID',
      \`content_type\` varchar(20) NOT NULL DEFAULT '' COMMENT '被举报内容类型：review/reply',
      \`content_id\` int(11) unsigned NOT NULL COMMENT '被举报内容ID',
      \`reason\` varchar(50) NOT NULL DEFAULT '' COMMENT '举报原因',
      \`description\` varchar(500) NOT NULL DEFAULT '' COMMENT '举报说明',
      \`status\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '处理状态：0待处理 1已处理 2已驳回',
      \`result\` varchar(500) NOT NULL DEFAULT '' COMMENT '处理结果',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '举报时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      KEY \`idx_user_id\` (\`user_id\`),
      KEY \`idx_content_type\` (\`content_type\`),
      KEY \`idx_content_id\` (\`content_id\`),
      KEY \`idx_status\` (\`status\`),
      KEY \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';
  `;

  try {
    await connection.query(sql);
    logger.info('举报表(reports)创建成功');
    return true;
  } catch (error) {
    logger.error(`举报表(reports)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createReportsTable;
