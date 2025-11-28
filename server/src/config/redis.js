const redis = require('redis');
const config = require('./index');
const { promisify } = require('util');

// 创建Redis客户端
const client = redis.createClient({
  url: `redis://:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
  legacyMode: false
});

// 将Redis命令转换为Promise
const getAsync = async (key) => client.get(key);
const setAsync = async (key, value, options) => client.set(key, value, options);
const delAsync = async (key) => client.del(key);
const expireAsync = async (key, seconds) => client.expire(key, seconds);

// 连接Redis
(async () => {
  try {
    await client.connect();
    console.log('Redis连接成功!');
  } catch (error) {
    console.error('Redis连接错误:', error);
  }
})();

// 错误处理
client.on('error', (err) => {
  console.error('Redis连接错误:', err);
});

// 测试连接
const testConnection = async () => {
  try {
    if (!client.isOpen) {
      console.log('Redis客户端未连接，尝试重新连接...');
      await client.connect();
    }
    const result = await client.ping();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync,
  expireAsync,
  testConnection
}; 