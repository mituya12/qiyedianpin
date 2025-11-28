const logger = require('../../utils/logger');

const initCompaniesData = async (connection) => {
  try {
    // 检查是否已有企业数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM companies');
    if (rows[0].count > 0) {
      logger.info('企业数据已存在,跳过初始化');
      return true;
    }

    const sql = `
      INSERT INTO \`companies\` (\`name\`, \`alias\`, \`total_rating\`, \`review_count\`) VALUES
      ('腾讯科技有限公司', '腾讯', 4.5, 0),
      ('阿里巴巴集团', '阿里', 4.3, 0),
      ('字节跳动科技有限公司', '字节跳动', 4.4, 0),
      ('百度在线网络技术有限公司', '百度', 4.0, 0),
      ('京东集团', '京东', 4.2, 0),
      ('美团', '美团', 4.1, 0),
      ('拼多多', '拼多多', 3.9, 0),
      ('网易集团', '网易', 4.3, 0),
      ('小米科技有限责任公司', '小米', 4.2, 0),
      ('华为技术有限公司', '华为', 4.6, 0);
    `;

    await connection.query(sql);
    logger.info('企业初始数据插入成功');
    return true;
  } catch (error) {
    logger.error(`企业初始数据插入失败: ${error.message}`);
    throw error;
  }
};

module.exports = initCompaniesData;
