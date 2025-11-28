const logger = require('../../utils/logger');

const createAdminsTable = async (connection) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`admins\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
      \`username\` varchar(50) NOT NULL DEFAULT '' COMMENT '管理员账号',
      \`password\` varchar(255) NOT NULL DEFAULT '' COMMENT '登录密码',
      \`name\` varchar(50) NOT NULL DEFAULT '' COMMENT '管理员姓名',
      \`role\` varchar(20) NOT NULL DEFAULT '' COMMENT '角色：R_SUPER/R_ADMIN/R_USER',
      \`status\` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1正常 0禁用',
      \`remark\` varchar(200) NOT NULL DEFAULT '' COMMENT '备注',
      \`last_login_at\` datetime DEFAULT NULL COMMENT '最后登录时间',
      \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`uk_username\` (\`username\`),
      KEY \`idx_status\` (\`status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';
  `;

  try {
    await connection.query(sql);
    logger.info('管理员表(admins)创建成功');
    return true;
  } catch (error) {
    logger.error(`管理员表(admins)创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = createAdminsTable;
