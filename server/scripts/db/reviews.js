const logger = require('../../utils/logger');

const createReviewsTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`reviews\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '评价ID',
      \`user_id\` int(11) unsigned NOT NULL COMMENT '用户ID',
      \`author_name\` varchar(50) NOT NULL DEFAULT '' COMMENT '评价人姓名',
      \`author_avatar\` varchar(500) NOT NULL DEFAULT '' COMMENT '评价人头像',
      \`company_name\` varchar(100) NOT NULL DEFAULT '' COMMENT '企业名称',
      \`company_alias\` varchar(50) NOT NULL DEFAULT '' COMMENT '企业别名',
      \`status\` varchar(20) NOT NULL DEFAULT '' COMMENT '在职状态：当前在职/已离职',
      \`department\` varchar(50) NOT NULL DEFAULT '' COMMENT '所在部门',
      \`is_branch\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否分公司：1是 0否',
      \`rating\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '评分：1-5',
      \`content\` text NOT NULL COMMENT '详细点评内容',
      \`salary\` varchar(100) NOT NULL DEFAULT '' COMMENT '薪资待遇',
      \`benefits\` varchar(500) NOT NULL DEFAULT '' COMMENT '福利待遇',
      \`likes\` int(11) NOT NULL DEFAULT '0' COMMENT '点赞数',
      \`reply_count\` int(11) NOT NULL DEFAULT '0' COMMENT '回复数',
      \`audit_status\` tinyint(1) NOT NULL DEFAULT '0' COMMENT '审核状态：0待审核 1已通过 2已拒绝',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      KEY \`idx_user_id\` (\`user_id\`),
      KEY \`idx_company_name\` (\`company_name\`),
      KEY \`idx_rating\` (\`rating\`),
      KEY \`idx_audit_status\` (\`audit_status\`),
      KEY \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';
  `;

  try {
    await connection.query(sql);
    logger.info('评价表(reviews)创建成功');
    return true;
  } catch (error) {
    logger.error(`评价表(reviews)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createReviewsTable;
