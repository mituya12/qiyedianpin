const { uploadFile } = require('../../../utils/qiniu');
const logger = require('../../../utils/logger');

class UploadService {
  async uploadImage(fileBuffer, fileName) {
    try {
      const url = await uploadFile(fileBuffer, fileName);
      logger.info(`图片上传成功: ${url}`);
      return { url };
    } catch (error) {
      logger.error(`图片上传失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UploadService();
