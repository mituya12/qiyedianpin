const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger');

// 配置multer使用内存存储
const storage = multer.memoryStorage();

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的图片格式
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持上传 jpg、png、gif、webp 格式的图片'), false);
  }
};

// 创建multer实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  }
});

// 单文件上传中间件
const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer错误
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            code: 400,
            message: '文件大小不能超过5MB',
            data: null
          });
        }
        logger.error(`文件上传错误: ${err.message}`);
        return res.status(400).json({
          code: 400,
          message: err.message,
          data: null
        });
      } else if (err) {
        // 其他错误
        logger.error(`文件上传错误: ${err.message}`);
        return res.status(400).json({
          code: 400,
          message: err.message,
          data: null
        });
      }
      
      // 检查是否有文件
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: '请选择要上传的文件',
          data: null
        });
      }
      
      next();
    });
  };
};

// 多文件上传中间件
const uploadMultiple = (fieldName = 'files', maxCount = 10) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            code: 400,
            message: '文件大小不能超过5MB',
            data: null
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            code: 400,
            message: `最多只能上传${maxCount}个文件`,
            data: null
          });
        }
        logger.error(`文件上传错误: ${err.message}`);
        return res.status(400).json({
          code: 400,
          message: err.message,
          data: null
        });
      } else if (err) {
        logger.error(`文件上传错误: ${err.message}`);
        return res.status(400).json({
          code: 400,
          message: err.message,
          data: null
        });
      }
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '请选择要上传的文件',
          data: null
        });
      }
      
      next();
    });
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple
};
