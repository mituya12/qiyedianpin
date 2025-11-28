const logger = require('../../utils/logger');

const initReviewsData = async (connection) => {
  try {
    // 检查是否已有评价数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM reviews');
    if (rows[0].count > 0) {
      logger.info('评价数据已存在,跳过初始化');
      return true;
    }

    // 获取测试用户ID
    const [users] = await connection.query('SELECT id, name FROM users WHERE openid LIKE "test_%" ORDER BY id');
    if (users.length < 5) {
      logger.warn('测试用户数据不足,跳过评价数据初始化');
      return true;
    }

    const sql = `
      INSERT INTO \`reviews\` (
        \`user_id\`, \`author_name\`, \`author_avatar\`,
        \`company_name\`, \`company_alias\`,
        \`status\`, \`department\`, \`is_branch\`,
        \`rating\`, \`content\`, \`salary\`, \`benefits\`,
        \`likes\`, \`reply_count\`, \`audit_status\`
      ) VALUES
      (${users[0].id}, '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '腾讯科技有限公司', '腾讯', '当前在职', '技术部', 0,
       5, '公司氛围很好,技术栈先进,团队协作能力强。福利待遇优厚,加班不多,工作生活平衡做得不错。', '20-30K', '五险一金,年终奖,股票期权,免费三餐',
       15, 2, 1),
      
      (${users[1].id}, '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '腾讯科技有限公司', '腾讯', '已离职', '产品部', 0,
       4, '产品线丰富,学习机会多。不过加班比较多,压力较大。整体来说是个不错的平台。', '18-25K', '五险一金,年终奖,补充医疗',
       8, 1, 1),
      
      (${users[2].id}, '王五', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '阿里巴巴集团', '阿里', '当前在职', '技术部', 0,
       5, '技术氛围浓厚,大牛很多,能学到很多东西。公司文化独特,价值观很正。薪资福利都不错。', '25-35K', '五险一金,年终奖,RSU,免费健身房',
       20, 3, 1),
      
      (${users[3].id}, '赵六', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '字节跳动科技有限公司', '字节跳动', '当前在职', '研发部', 0,
       4, '节奏很快,能快速成长。扁平化管理,沟通效率高。加班文化比较重,需要有心理准备。', '22-32K', '五险一金,期权,免费三餐零食',
       12, 1, 1),
      
      (${users[4].id}, '孙七', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '百度在线网络技术有限公司', '百度', '已离职', '算法部', 0,
       4, 'AI技术领先,有很多前沿项目。团队氛围不错,导师制度完善。晋升通道相对清晰。', '20-28K', '五险一金,年终奖,补充商业保险',
       10, 2, 1),
      
      (${users[0].id}, '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '京东集团', '京东', '已离职', '运营部', 1,
       3, '分公司管理相对独立,资源有限。但是锻炼机会多,能接触到完整的业务流程。', '12-18K', '五险一金,年终奖',
       5, 0, 1),
      
      (${users[1].id}, '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '美团', '美团', '当前在职', '技术部', 0,
       4, '业务线广,技术挑战大。公司发展快,机会多。工作强度适中,性价比不错。', '18-26K', '五险一金,年终奖,员工优惠',
       9, 1, 1),
      
      (${users[2].id}, '王五', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '华为技术有限公司', '华为', '当前在职', '研发部', 0,
       5, '技术实力强,项目经验丰富。福利待遇好,培训体系完善。奋斗文化浓厚,适合想拼搏的人。', '22-35K', '五险一金,年终奖,股票,住房补贴',
       18, 2, 1),
      
      (${users[3].id}, '赵六', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '小米科技有限责任公司', '小米', '当前在职', '硬件部', 0,
       4, '产品导向,用户至上。团队年轻有活力,创新氛围好。薪资中等,但有期权激励。', '16-24K', '五险一金,年终奖,期权,员工内购',
       11, 1, 1),
      
      (${users[4].id}, '孙七', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '网易集团', '网易', '当前在职', '游戏部', 0,
       4, '游戏业务强,项目多样化。工作环境舒适,福利不错。加班相对少,工作生活平衡好。', '18-28K', '五险一金,年终奖,免费下午茶,健身房',
       13, 2, 1);
    `;

    await connection.query(sql);
    
    // 更新企业的评分和评价数量
    const updateSql = `
      UPDATE companies c
      SET 
        c.review_count = (SELECT COUNT(*) FROM reviews WHERE company_name = c.name AND audit_status = 1),
        c.total_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE company_name = c.name AND audit_status = 1)
      WHERE c.name IN (
        SELECT DISTINCT company_name FROM reviews
      );
    `;
    await connection.query(updateSql);
    
    logger.info('评价初始数据插入成功,企业评分已更新');
    return true;
  } catch (error) {
    logger.error(`评价初始数据插入失败: ${error.message}`);
    throw error;
  }
};

module.exports = initReviewsData;
