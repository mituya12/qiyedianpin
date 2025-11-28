const crypto = require('crypto');

/**
 * MD5加密
 * @param {String} str - 需要加密的字符串
 * @returns {String} - 加密后的字符串
 */
const md5 = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

module.exports = {
  md5
};
