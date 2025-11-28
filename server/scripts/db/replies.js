const logger = require('../../utils/logger');

const createRepliesTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`replies\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '回复ID',
      \`review_id\` int(11) unsigned NOT NULL COMMENT '评价ID',
      \`user_id\` int(11) unsigned DEFAULT NULL COMMENT '用户ID',
      \`author\` varchar(50) NOT NULL DEFAULT '' COMMENT '回复人姓名',
      \`author_avatar\` varchar(500) NOT NULL DEFAULT '' COMMENT '回复人头像',
      \`content\` varchar(500) NOT NULL DEFAULT '' COMMENT '回复内容',
      \`is_official\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否官方回复：1是 0否',
      \`audit_status\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '审核状态：0待审核 1已通过 2已拒绝',
      \`date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '回复时间',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      KEY \`idx_review_id\` (\`review_id\`),
      KEY \`idx_user_id\` (\`user_id\`),
      KEY \`idx_is_official\` (\`is_official\`),
      KEY \`idx_audit_status\` (\`audit_status\`),
      KEY \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回复表';
  `;

  try {
    await connection.query(sql);
    logger.info('回复表(replies)创建成功');
    return true;
  } catch (error) {
    logger.error(`回复表(replies)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createRepliesTable;
