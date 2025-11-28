const jwt = require('jsonwebtoken');
const config = require('../config');

class JwtService {
  /**
   * 生成JWT令牌
   * @param {Object} payload - 负载数据
   * @param {String} type - 令牌类型 ('mobile' | 'admin')
   * @returns {String} JWT令牌
   */
  static generateToken(payload, type) {
    if (!type || (type !== config.jwt.types.mobile && type !== config.jwt.types.admin)) {
      throw new Error('无效的令牌类型，必须是 mobile 或 admin');
    }

    // 添加令牌类型到payload
    const tokenPayload = {
      ...payload,
      type
    };

    return jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  /**
   * 验证JWT令牌
   * @param {String} token - JWT令牌
   * @returns {Object} 解码后的负载数据
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('无效的令牌');
    }
  }

  /**
   * 生成移动端令牌
   * @param {Object} payload - 负载数据
   * @returns {String} JWT令牌
   */
  static generateMobileToken(payload) {
    return this.generateToken(payload, config.jwt.types.mobile);
  }

  /**
   * 生成后台端令牌
   * @param {Object} payload - 负载数据
   * @returns {String} JWT令牌
   */
  static generateAdminToken(payload) {
    return this.generateToken(payload, config.jwt.types.admin);
  }

  /**
   * 解码令牌
   * @param {String} token - JWT令牌
   * @returns {Object} 解码后的负载数据
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      throw new Error('解码令牌失败');
    }
  }
}

module.exports = JwtService; 