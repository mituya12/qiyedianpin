const app = require('./app');
const config = require('./config');

// 启动服务器
const server = app.listen(config.server.port, () => {
  console.log(`服务器运行在 http://localhost:${config.server.port}`);
  console.log(`当前环境: ${config.server.env}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM 信号收到，关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT 信号收到，关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
}); 