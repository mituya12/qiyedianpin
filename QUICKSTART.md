# 快速开始指南

5分钟快速启动企业点评系统的本地开发环境。

## 📦 前置要求

确保已安装以下软件：

- **Node.js** >= 16.0.0 ([下载](https://nodejs.org))
- **MySQL** >= 5.7 ([下载](https://www.mysql.com/downloads/))
- **Redis** >= 5.0 ([下载](https://redis.io/download))

验证安装：

```bash
node --version      # 应显示 v16.0.0 或更高
npm --version       # 应显示 8.0.0 或更高
mysql --version     # 应显示 mysql Ver 5.7 或更高
redis-cli --version # 应显示 Redis version 5.0 或更高
```

## 🚀 快速启动（3步）

### 第1步：启动基础服务

**启动MySQL：**

```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

**启动Redis：**

```bash
# Windows - 在Redis安装目录运行
redis-server.exe

# macOS
brew services start redis

# Linux
sudo systemctl start redis-server
```

### 第2步：配置后端服务

```bash
# 进入server目录
cd server

# 安装依赖
npm install

# 编辑 .env 文件，配置数据库信息
# 重要：修改以下内容
# DB_USER=你的MySQL用户名
# DB_PASSWORD=你的MySQL密码
# DB_NAME=你的数据库名称

# 初始化数据库
npm run init-db

# 启动开发服务器
npm run dev
```

服务器应该在 `http://localhost:3000` 启动。

### 第3步：启动前端项目

**启动后台管理系统：**

```bash
# 新开一个终端窗口
cd admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173` 查看后台管理系统。

**启动小程序端（可选）：**

```bash
# 新开一个终端窗口
cd cool-unix-main

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## ✅ 验证安装

### 检查后端服务

```bash
# 在浏览器中访问或使用curl
curl http://localhost:3000/api/health

# 应该返回类似的响应
# {"code":200,"message":"服务正常","timestamp":"2025-11-28 10:00:00"}
```

### 检查前端应用

- 后台管理系统：http://localhost:5173
- 小程序端：http://localhost:5174 (或其他端口)

## 📝 环境变量配置

### Server (.env)

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# Redis配置
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# 数据库配置 - 必须修改
DB_HOST=localhost
DB_PORT=3306
DB_USER=root              # 改为你的MySQL用户名
DB_PASSWORD=password      # 改为你的MySQL密码
DB_NAME=qiyedianpin       # 改为你的数据库名称

# JWT配置 - 建议修改为强密钥
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
JWT_MOBILE_SECRET=mobile_secret
JWT_ADMIN_SECRET=admin_secret

# 微信小程序配置 - 可选
WECHAT_APPID=your_appid
WECHAT_APPSECRET=your_appsecret

# 七牛云配置 - 可选
QINIU_ACCESS_KEY=your_access_key
QINIU_SECRET_KEY=your_secret_key
QINIU_BUCKET=your_bucket
QINIU_DOMAIN=your_domain
```

### Admin (.env)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=企业点评系统
```

## 🔧 常见问题

### Q: 端口已被占用

**错误信息：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案：**

```bash
# Windows - 查找占用3000端口的进程
netstat -ano | findstr :3000

# 杀死进程（替换PID）
taskkill /PID <PID> /F

# 或修改 .env 中的PORT
PORT=3001
```

### Q: 数据库连接失败

**错误信息：** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**解决方案：**

1. 检查MySQL是否运行：
   ```bash
   # Windows
   tasklist | findstr mysql
   
   # macOS/Linux
   ps aux | grep mysql
   ```

2. 检查 `.env` 中的数据库配置是否正确

3. 尝试手动连接：
   ```bash
   mysql -h localhost -u root -p
   ```

### Q: 找不到模块

**错误信息：** `Cannot find module 'xxx'`

**解决方案：**

```bash
# 删除node_modules和lock文件
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install

# 或使用pnpm
pnpm install
```

### Q: Redis连接失败

**错误信息：** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**解决方案：**

1. 检查Redis是否运行
2. 检查Redis配置中的HOST和PORT是否正确
3. 如果不需要Redis，可以在代码中注释掉Redis相关代码

### Q: npm install 很慢

**解决方案：**

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用pnpm（更快）
npm install -g pnpm
pnpm install
```

## 📚 项目结构速览

```
qiyedianpin/
├── admin/                 # 后台管理系统
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 可复用组件
│   │   ├── stores/       # Pinia状态管理
│   │   ├── api/          # API接口
│   │   └── router/       # 路由配置
│   └── package.json
│
├── cool-unix-main/        # 小程序端
│   ├── pages/            # 页面
│   ├── components/       # 组件
│   ├── config/           # 配置
│   └── package.json
│
├── server/               # 后端服务
│   ├── src/
│   │   ├── routes/       # 路由
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   └── middlewares/  # 中间件
│   ├── config/           # 配置
│   ├── scripts/          # 初始化脚本
│   ├── server.js         # 入口文件
│   ├── .env              # 环境变量
│   └── package.json
│
└── README.md             # 项目说明
```

## 🎯 下一步

1. **了解项目架构**
   - 阅读 [README.md](./README.md)
   - 查看各模块的文档

2. **学习开发规范**
   - 代码风格：ESLint + Prettier
   - Git提交：使用commitizen

3. **开始开发**
   - 在 `admin/src/pages` 中创建新页面
   - 在 `server/src/routes` 中添加新API
   - 在 `cool-unix-main/pages` 中创建小程序页面

4. **部署到生产**
   - 参考 [DEPLOYMENT.md](./DEPLOYMENT.md)
   - 在宝塔面板中部署

## 💡 开发技巧

### 热更新

所有项目都支持热更新，修改代码后会自动刷新：

```bash
# Admin - 修改 src 下的文件会自动刷新
npm run dev

# Server - 使用nodemon自动重启
npm run dev

# Cool-Unix-Main - 修改代码会自动刷新
npm run dev
```

### 调试

**后端调试：**

```bash
# 在 server.js 中添加调试代码
console.log('Debug info:', data);

# 查看日志
npm run dev
```

**前端调试：**

- 打开浏览器开发者工具（F12）
- 在Sources标签中设置断点
- 使用Vue DevTools浏览器扩展

### API测试

使用Postman或curl测试API：

```bash
# 获取企业列表
curl http://localhost:3000/api/companies

# 创建评价
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"companyId":1,"rating":5,"content":"很好"}'
```

## 📞 获取帮助

- 📖 查看 [README.md](./README.md) 了解项目概况
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署方式
- 🐛 提交Issue报告问题
- 💬 在Discussions中讨论

## 🎉 成功标志

当你看到以下内容时，说明安装成功：

✅ 后端服务在 `http://localhost:3000` 运行
✅ 后台管理系统在 `http://localhost:5173` 运行
✅ 数据库表已创建
✅ 可以访问API端点

---

**祝你开发愉快！** 🚀

如有问题，请查看 [README.md](./README.md) 或提交Issue。
