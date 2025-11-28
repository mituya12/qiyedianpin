const bcrypt = require('bcrypt');

/**
 * 密码工具类
 */
class PasswordUtil {
  /**
   * 生成密码哈希
   * @param {String} password 原始密码
   * @param {Number} saltRounds 盐轮数，默认为10
   * @returns {String} 密码哈希
   */
  static async hash(password, saltRounds = 10) {
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('密码加密失败');
    }
  }

  /**
   * 验证密码
   * @param {String} password 原始密码
   * @param {String} hash 密码哈希
   * @returns {Boolean} 是否匹配
   */
  static async compare(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('密码验证失败');
    }
  }
}

module.exports = PasswordUtil; 