const net = require('net');
const { exec } = require('child_process');
const logger = require('./logger');
const config = require('../config');
const util = require('util');

const execPromise = util.promisify(exec);

/**
 * 检查端口是否被占用
 * @param {Number} port - 要检查的端口号
 * @returns {Promise<Boolean>} - 端口是否被占用
 */
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true); // 端口被占用
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        server.close();
        resolve(false); // 端口未被占用
      })
      .listen(port);
  });
};

/**
 * 查找占用端口的进程
 * @param {Number} port - 端口号
 * @returns {Promise<String|null>} - 进程ID或null
 */
const findProcessOnPort = async (port) => {
  try {
    let cmd = '';
    let processIdRegex = '';
    
    if (process.platform === 'win32') {
      cmd = `netstat -ano | findstr :${port}`;
      processIdRegex = /\s+(\d+)$/;
    } else {
      cmd = `lsof -i :${port} -t`;
      processIdRegex = /(\d+)/;
    }
    
    const { stdout } = await execPromise(cmd);
    if (!stdout) return null;
    
    const lines = stdout.split('\n').filter(Boolean);
    if (lines.length === 0) return null;
    
    const match = lines[0].match(processIdRegex);
    return match ? match[1] : null;
  } catch (error) {
    logger.error(`查找端口进程错误: ${error.message}`);
    return null;
  }
};

/**
 * 终止进程
 * @param {String} pid - 进程ID
 * @returns {Promise<Boolean>} - 是否成功终止
 */
const killProcess = async (pid) => {
  try {
    const cmd = process.platform === 'win32' 
      ? `taskkill /F /PID ${pid}`
      : `kill -9 ${pid}`;
    
    await execPromise(cmd);
    logger.info(`成功终止进程 PID: ${pid}`);
    return true;
  } catch (error) {
    logger.error(`终止进程错误: ${error.message}`);
    return false;
  }
};

/**
 * 检查并释放端口
 * @param {Number} port - 要检查的端口号
 * @returns {Promise<Boolean>} - 端口是否可用
 */
const checkAndReleasePort = async (port = config.server.port) => {
  try {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      logger.info(`端口 ${port} 可用`);
      return true;
    }
    
    logger.warn(`端口 ${port} 已被占用，尝试释放...`);
    const pid = await findProcessOnPort(port);
    
    if (!pid) {
      logger.error(`无法找到占用端口 ${port} 的进程`);
      return false;
    }
    
    const killed = await killProcess(pid);
    if (!killed) {
      logger.error(`无法终止占用端口 ${port} 的进程 PID: ${pid}`);
      return false;
    }
    
    // 再次检查端口是否可用
    const stillInUse = await isPortInUse(port);
    if (stillInUse) {
      logger.error(`端口 ${port} 仍被占用`);
      return false;
    }
    
    logger.info(`端口 ${port} 已成功释放`);
    return true;
  } catch (error) {
    logger.error(`检查端口错误: ${error.message}`);
    return false;
  }
};

module.exports = {
  isPortInUse,
  findProcessOnPort,
  killProcess,
  checkAndReleasePort
}; 