const logger = require('../../utils/logger');

const createFeedbacksTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`feedbacks\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '反馈ID',
      \`user_id\` int(11) unsigned NOT NULL COMMENT '用户ID',
      \`user_name\` varchar(50) NOT NULL DEFAULT '' COMMENT '用户名',
      \`contact\` varchar(100) NOT NULL DEFAULT '' COMMENT '联系方式(邮箱/电话)',
      \`category\` varchar(50) NOT NULL DEFAULT '' COMMENT '反馈分类: feature/bug/content/other',
      \`content\` text NOT NULL COMMENT '反馈内容',
      \`status\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '处理状态: 0待处理 1已处理 2已关闭',
      \`reply\` text COMMENT '管理员回复',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      KEY \`idx_user_id\` (\`user_id\`),
      KEY \`idx_status\` (\`status\`),
      KEY \`idx_category\` (\`category\`),
      KEY \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';
  `;

  try {
    await connection.query(sql);
    logger.info('反馈表(feedbacks)创建成功');
    return true;
  } catch (error) {
    logger.error(`反馈表(feedbacks)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createFeedbacksTable;
