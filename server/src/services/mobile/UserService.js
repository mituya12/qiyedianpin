const { query } = require('../../../utils/db');
const logger = require('../../../utils/logger');
const axios = require('axios');
const config = require('../../../config');

class UserService {
  // 微信登录
  async login(code) {
    try {
      // 调用微信API获取openid和session_key
      const wxLoginUrl = 'https://api.weixin.qq.com/sns/jscode2session';
      const params = {
        appid: config.wechat.appId,
        secret: config.wechat.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      };
      
      const wxResponse = await axios.get(wxLoginUrl, { params });
      const { openid, session_key, unionid, errcode, errmsg } = wxResponse.data;
      
      // 检查微信接口返回
      if (errcode) {
        logger.error(`微信登录失败: ${errmsg}`);
        throw new Error(`微信登录失败: ${errmsg}`);
      }
      
      if (!openid) {
        throw new Error('获取openid失败');
      }
      
      // 查询用户是否存在
      const sql = 'SELECT * FROM users WHERE openid = ?';
      const users = await query(sql, [openid]);
      
      if (users.length > 0) {
        // 更新最后登录时间和unionid(如果有)
        const updateSql = unionid 
          ? 'UPDATE users SET last_login_at = NOW(), unionid = ? WHERE id = ?'
          : 'UPDATE users SET last_login_at = NOW() WHERE id = ?';
        const updateParams = unionid 
          ? [unionid, users[0].id]
          : [users[0].id];
        
        await query(updateSql, updateParams);
        
        // 返回更新后的用户信息
        const updatedUser = await query('SELECT * FROM users WHERE id = ?', [users[0].id]);
        return updatedUser[0];
      } else {
        // 创建新用户 - 生成默认名称: 编程两年半 + 随机六位数
        const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const defaultName = `编程两年半${randomNum}`;
        
        const insertSql = `
          INSERT INTO users (openid, unionid, name, avatar, bio, status, last_login_at)
          VALUES (?, ?, ?, '', '', 1, NOW())
        `;
        await query(insertSql, [openid, unionid || '', defaultName]);
        
        const newUser = await query('SELECT * FROM users WHERE openid = ?', [openid]);
        return newUser[0];
      }
    } catch (error) {
      logger.error(`用户登录失败: ${error.message}`);
      throw error;
    }
  }

  // 获取用户信息
  async getUserInfo(userId) {
    try {
      const sql = `
        SELECT 
          u.id, u.name, u.avatar, u.bio, u.status,
          (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as reviewCount,
          (SELECT COUNT(*) FROM replies WHERE user_id = u.id) as replyCount,
          CAST(COALESCE(SUM(r.likes), 0) AS UNSIGNED) as totalLikes
        FROM users u
        LEFT JOIN reviews r ON u.id = r.user_id
        WHERE u.id = ?
        GROUP BY u.id
      `;
      const users = await query(sql, [userId]);
      return users[0] || null;
    } catch (error) {
      logger.error(`获取用户信息失败: ${error.message}`);
      throw error;
    }
  }

  // 更新用户信息
  async updateUserInfo(userId, { name, avatar, bio }) {
    try {
      const updates = [];
      const params = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (avatar !== undefined) {
        updates.push('avatar = ?');
        params.push(avatar);
      }
      if (bio !== undefined) {
        updates.push('bio = ?');
        params.push(bio);
      }

      if (updates.length === 0) {
        return true;
      }

      params.push(userId);
      const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      await query(sql, params);
      return true;
    } catch (error) {
      logger.error(`更新用户信息失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserService();
