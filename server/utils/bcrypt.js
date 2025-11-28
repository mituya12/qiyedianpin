const bcrypt = require('bcrypt');

/**
 * 加密密码
 * @param {String} password - 原始密码
 * @returns {String} - 加密后的密码
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * 验证密码
 * @param {String} password - 原始密码
 * @param {String} hash - 加密后的密码
 * @returns {Boolean} - 是否匹配
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
}; 