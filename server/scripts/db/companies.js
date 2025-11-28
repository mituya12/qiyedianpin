const logger = require('../../utils/logger');

const createCompaniesTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`companies\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '企业ID',
      \`name\` varchar(100) NOT NULL DEFAULT '' COMMENT '企业名称',
      \`alias\` varchar(50) NOT NULL DEFAULT '' COMMENT '企业别名',
      \`total_rating\` decimal(3,2) NOT NULL DEFAULT '0.00' COMMENT '综合评分',
      \`review_count\` int(11) NOT NULL DEFAULT '0' COMMENT '评价数量',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`uk_name\` (\`name\`),
      KEY \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业表';
  `;

  try {
    await connection.query(sql);
    logger.info('企业表(companies)创建成功');
    return true;
  } catch (error) {
    logger.error(`企业表(companies)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createCompaniesTable;
