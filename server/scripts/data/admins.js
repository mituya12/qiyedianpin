const { md5 } = require('../../utils/md5');
const logger = require('../../utils/logger');

const initAdminsData = async (connection) => {
  try {
    // 检查是否已有管理员数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM admins');
    if (rows[0].count > 0) {
      logger.info('管理员数据已存在,跳过初始化');
      return true;
    }

    // 使用MD5加密密码
    const hashedPassword = md5('admin123');

    const sql = `
      INSERT INTO \`admins\` (\`username\`, \`password\`, \`name\`, \`role\`, \`status\`, \`remark\`) 
      VALUES ('admin', ?, '超级管理员', 'R_SUPER', 1, '系统默认超级管理员');
    `;

    await connection.query(sql, [hashedPassword]);
    logger.info('管理员初始数据插入成功');
    return true;
  } catch (error) {
    logger.error(`管理员初始数据插入失败: ${error.message}`);
    throw error;
  }
};

module.exports = initAdminsData;
