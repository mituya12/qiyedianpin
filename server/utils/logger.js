const winston = require('winston');
const { format } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// 确保日志目录存在
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 创建不同类型的日志目录
const logTypes = ['error', 'info', 'warn', 'debug'];
logTypes.forEach(type => {
  const typeDir = path.join(logDir, type);
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir);
  }
});

// 日志格式
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = JSON.stringify(meta);
    }
    return `${timestamp} ${level}: ${message} ${metaStr}`;
  })
);

// 创建按日期和类型分类的日志转换器
const createFileTransport = (level) => {
  return new winston.transports.DailyRotateFile({
    dirname: path.join(logDir, level),
    filename: `%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    level,
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
    auditFile: path.join(logDir, level, `${level}-audit.json`),
    zippedArchive: true
  });
};

// 创建日志记录器
const logger = winston.createLogger({
  level: config.server.env === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    // 按类型和日期分类的日志文件
    createFileTransport('error'),
    createFileTransport('warn'),
    createFileTransport('info'),
    createFileTransport('debug'),
    // 综合日志文件（保留原有功能）
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
      zippedArchive: true
    })
  ],
  // 捕获未处理的异常和Promise拒绝
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      dirname: path.join(logDir, 'exceptions'),
      filename: `%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      format: logFormat
    })
  ],
  exitOnError: false
});

// 添加捕获未处理的Promise拒绝的能力
if (process.env.NODE_ENV !== 'test') {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`未处理的Promise拒绝: ${reason}`, { promise });
  });
}

module.exports = logger; 