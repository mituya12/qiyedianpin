const logger = require('../../utils/logger');

const initTestUsersData = async (connection) => {
  try {
    // 检查是否已有测试用户数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users WHERE openid LIKE "test_%"');
    if (rows[0].count > 0) {
      logger.info('测试用户数据已存在,跳过初始化');
      return true;
    }

    const sql = `
      INSERT INTO \`users\` (\`openid\`, \`unionid\`, \`name\`, \`avatar\`, \`bio\`, \`status\`) VALUES
      ('test_openid_001', 'test_unionid_001', '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132', '热爱分享的职场人', 1),
      ('test_openid_002', 'test_unionid_002', '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132', '互联网从业者', 1),
      ('test_openid_003', 'test_unionid_003', '王五', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132', '技术爱好者', 1),
      ('test_openid_004', 'test_unionid_004', '赵六', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132', '产品经理', 1),
      ('test_openid_005', 'test_unionid_005', '孙七', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132', '设计师', 1);
    `;

    await connection.query(sql);
    logger.info('测试用户初始数据插入成功');
    return true;
  } catch (error) {
    logger.error(`测试用户初始数据插入失败: ${error.message}`);
    throw error;
  }
};

module.exports = initTestUsersData;
