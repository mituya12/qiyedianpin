const logger = require('../../utils/logger');

const initRepliesData = async (connection) => {
  try {
    // 检查是否已有回复数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM replies');
    if (rows[0].count > 0) {
      logger.info('回复数据已存在,跳过初始化');
      return true;
    }

    // 获取评价ID用于关联
    const [reviews] = await connection.query('SELECT id FROM reviews ORDER BY id LIMIT 10');
    
    if (reviews.length < 10) {
      logger.warn('评价数据不足,跳过回复数据初始化');
      return true;
    }

    // 获取测试用户ID
    const [users] = await connection.query('SELECT id, name FROM users WHERE openid LIKE "test_%" ORDER BY id');

    const sql = `
      INSERT INTO \`replies\` (
        \`review_id\`, \`user_id\`, \`author\`, \`author_avatar\`,
        \`content\`, \`is_official\`, \`date\`, \`audit_status\`
      ) VALUES
      (${reviews[0].id}, ${users[1].id}, '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '确实,腾讯的技术氛围很好,学到了很多东西!', 0, CURDATE(), 1),
      
      (${reviews[0].id}, NULL, '腾讯HR', '',
       '感谢您的评价!我们会继续努力为员工创造更好的工作环境。', 1, CURDATE(), 1),
      
      (${reviews[1].id}, ${users[3].id}, '赵六', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '同感,产品部门确实压力比较大,不过成长也快。', 0, CURDATE(), 1),
      
      (${reviews[2].id}, ${users[0].id}, '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '阿里的技术大牛确实多,每次分享会都能学到新东西。', 0, CURDATE(), 1),
      
      (${reviews[2].id}, NULL, '阿里HR', '',
       '感谢认可!我们致力于打造最好的技术团队。', 1, CURDATE(), 1),
      
      (${reviews[2].id}, ${users[4].id}, '孙七', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '阿里的价值观文化确实很有特色。', 0, CURDATE(), 1),
      
      (${reviews[3].id}, NULL, '字节HR', '',
       '感谢您的反馈,我们会持续优化工作节奏。', 1, CURDATE(), 1),
      
      (${reviews[4].id}, ${users[2].id}, '王五', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '百度的AI技术确实很强,有很多学习机会。', 0, CURDATE(), 1),
      
      (${reviews[4].id}, NULL, '百度HR', '',
       '感谢您对百度AI技术的认可!', 1, CURDATE(), 1),
      
      (${reviews[6].id}, ${users[1].id}, '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '美团的业务线确实很广,能接触到很多不同的场景。', 0, CURDATE(), 1),
      
      (${reviews[7].id}, NULL, '华为HR', '',
       '感谢您的评价!华为欢迎有梦想、愿奋斗的人才。', 1, CURDATE(), 1),
      
      (${reviews[7].id}, ${users[4].id}, '孙七', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '华为的培训体系确实很完善,新人成长很快。', 0, CURDATE(), 1),
      
      (${reviews[8].id}, NULL, '小米HR', '',
       '感谢支持!小米期权激励让每个人都是公司的主人。', 1, CURDATE(), 1),
      
      (${reviews[9].id}, ${users[0].id}, '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL1byctY955Kz1FHNjRlvqBPgKJWw/132',
       '网易的工作生活平衡确实做得不错。', 0, CURDATE(), 1),
      
      (${reviews[9].id}, NULL, '网易HR', '',
       '感谢认可!网易一直倡导快乐工作,认真生活。', 1, CURDATE(), 1);
    `;

    await connection.query(sql);
    
    // 更新评价的回复数量
    const updateSql = `
      UPDATE reviews r
      SET r.reply_count = (
        SELECT COUNT(*) FROM replies WHERE review_id = r.id AND audit_status = 1
      )
      WHERE r.id IN (SELECT DISTINCT review_id FROM replies);
    `;
    await connection.query(updateSql);
    
    logger.info('回复初始数据插入成功,评价回复数已更新');
    return true;
  } catch (error) {
    logger.error(`回复初始数据插入失败: ${error.message}`);
    throw error;
  }
};

module.exports = initRepliesData;
