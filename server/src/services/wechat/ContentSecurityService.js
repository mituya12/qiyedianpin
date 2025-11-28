const axios = require('axios');
const logger = require('../../../utils/logger');
const config = require('../../../config');

class ContentSecurityService {
  constructor() {
    this.apiUrl = 'https://api.weixin.qq.com/wxa/msg_sec_check';
    this.accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
    this.accessToken = null;
    this.tokenExpireTime = 0;
  }

  /**
   * 获取微信access_token
   */
  async getAccessToken() {
    try {
      // 检查token是否过期
      if (this.accessToken && Date.now() < this.tokenExpireTime) {
        return this.accessToken;
      }

      const response = await axios.get(this.accessTokenUrl, {
        params: {
          grant_type: 'client_credential',
          appid: config.wechat.appId,
          secret: config.wechat.appSecret
        }
      });

      if (response.data.errcode) {
        throw new Error(`获取access_token失败: ${response.data.errmsg}`);
      }

      this.accessToken = response.data.access_token;
      // token有效期为7200秒,提前100秒刷新
      this.tokenExpireTime = Date.now() + (response.data.expires_in - 100) * 1000;

      logger.info('微信access_token已更新');
      return this.accessToken;
    } catch (error) {
      logger.error(`获取微信access_token失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 检测文本内容是否违规
   * @param {String} content - 要检测的文本内容
   * @returns {Object} { isValid: boolean, errcode: number, errmsg: string }
   */
  async checkContent(content) {
    try {
      if (!content || content.trim() === '') {
        return { isValid: true, errcode: 0, errmsg: '内容为空' };
      }

      // 获取access_token
      const accessToken = await this.getAccessToken();

      // 调用微信API
      const response = await axios.post(
        `${this.apiUrl}?access_token=${accessToken}`,
        {
          content: content
        },
        {
          timeout: 5000
        }
      );

      const { errcode, errmsg } = response.data;

      // 0 = 内容正常
      // 87014 = 内容违规
      const isValid = errcode === 0;

      logger.info(`内容检测完成: errcode=${errcode}, isValid=${isValid}`);

      return {
        isValid,
        errcode,
        errmsg: errmsg || '检测成功'
      };
    } catch (error) {
      logger.error(`内容检测失败: ${error.message}`);
      // 如果API调用失败,返回需要人工审核
      return {
        isValid: null,
        errcode: -1,
        errmsg: `检测异常: ${error.message}`
      };
    }
  }

  /**
   * 根据检测结果返回审核状态
   * @param {Object} checkResult - 检测结果
   * @returns {Number} 审核状态: 0=待审核, 1=通过, 2=拒绝
   */
  getAuditStatus(checkResult) {
    const { isValid, errcode } = checkResult;

    if (isValid === true) {
      // 内容正常,直接通过
      return 1;
    } else if (isValid === false && errcode === 87014) {
      // 内容违规,拒绝
      return 2;
    } else {
      // 检测失败或异常,需要人工审核
      return 0;
    }
  }
}

module.exports = new ContentSecurityService();
