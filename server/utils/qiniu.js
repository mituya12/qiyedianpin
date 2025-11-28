const qiniu = require('qiniu');
const config = require('../config');
const logger = require('./logger');

// 配置七牛云
const accessKey = config.qiniu.accessKey;
const secretKey = config.qiniu.secretKey;
const bucket = config.qiniu.bucket;
const domain = config.qiniu.domain;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
const uploadToken = putPolicy.uploadToken(mac);

const qiniuConfig = new qiniu.conf.Config();
qiniuConfig.zone = qiniu.zone.Zone_z2; // 华南区

/**
 * 生成上传凭证
 * @returns {String} - 上传凭证
 */
const getUploadToken = () => {
  const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
  return putPolicy.uploadToken(mac);
};

/**
 * 上传文件到七牛云
 * @param {Buffer} fileBuffer - 文件Buffer
 * @param {String} fileName - 文件名
 * @returns {Promise<String>} - 文件URL
 */
const uploadFile = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    const token = getUploadToken();

    // 生成唯一文件名
    const key = `${Date.now()}_${fileName}`;

    formUploader.put(token, key, fileBuffer, putExtra, (err, body, info) => {
      if (err) {
        logger.error(`七牛云上传失败: ${err.message}`);
        reject(err);
        return;
      }

      if (info.statusCode === 200) {
        const url = `https://${domain}/${body.key}`;
        logger.info(`文件上传成功: ${url}`);
        resolve(url);
      } else {
        logger.error(`七牛云上传失败: ${info.statusCode}`);
        reject(new Error('上传失败'));
      }
    });
  });
};

/**
 * 删除七牛云文件
 * @param {String} key - 文件key
 * @returns {Promise<Boolean>} - 是否成功
 */
const deleteFile = (key) => {
  return new Promise((resolve, reject) => {
    const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);
    
    bucketManager.delete(bucket, key, (err, respBody, respInfo) => {
      if (err) {
        logger.error(`七牛云删除文件失败: ${err.message}`);
        reject(err);
        return;
      }

      if (respInfo.statusCode === 200) {
        logger.info(`文件删除成功: ${key}`);
        resolve(true);
      } else {
        logger.error(`七牛云删除文件失败: ${respInfo.statusCode}`);
        reject(new Error('删除失败'));
      }
    });
  });
};

module.exports = {
  getUploadToken,
  uploadFile,
  deleteFile
};
