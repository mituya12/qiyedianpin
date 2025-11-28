# 部署指南

本文档详细说明如何在宝塔面板中部署企业点评系统。

## 📋 目录

- [前置准备](#前置准备)
- [宝塔面板安装](#宝塔面板安装)
- [后端服务部署](#后端服务部署)
- [前端项目部署](#前端项目部署)
- [数据库配置](#数据库配置)
- [常见问题](#常见问题)

## 前置准备

### 系统要求

- 操作系统：CentOS 7.x / Ubuntu 18.04+ / Debian 9+
- 内存：≥2GB
- 硬盘：≥20GB
- 带宽：≥1Mbps

### 需要安装的软件

- Node.js 16.0.0+
- MySQL 5.7+
- Redis 5.0+
- Nginx 1.15+

## 宝塔面板安装

### 1. 安装宝塔面板

访问 [宝塔官网](https://www.bt.cn) 获取安装命令。

**CentOS/RHEL:**
```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

**Ubuntu/Debian:**
```bash
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && bash install.sh
```

### 2. 登录宝塔面板

- 访问 `http://你的服务器IP:8888`
- 输入初始用户名和密码
- 首次登录会提示绑定宝塔账号

### 3. 安装必要的软件

在宝塔面板中：

1. 进入"应用商店"
2. 搜索并安装以下软件：
   - **Nginx** (推荐版本 1.20+)
   - **MySQL** (推荐版本 5.7 或 8.0)
   - **Redis** (推荐版本 6.0+)
   - **Node.js** (推荐版本 16.0+)
   - **PM2** (Node.js进程管理)

## 后端服务部署

### 1. 上传项目文件

**方式一：使用宝塔面板文件管理**

1. 在宝塔面板中进入"文件"
2. 进入 `/home/wwwroot` 目录
3. 上传server文件夹

**方式二：使用Git克隆**

```bash
cd /home/wwwroot
git clone https://github.com/yourusername/qiyedianpin.git
cd qiyedianpin/server
```

### 2. 配置环境变量

编辑 `.env` 文件：

```bash
# 在宝塔面板中打开文件编辑器，编辑 /home/wwwroot/qiyedianpin/server/.env
```

**必须修改的配置项：**

```env
# 数据库配置 - 使用你在宝塔面板创建的数据库信息
DB_HOST=localhost
DB_PORT=3306
DB_USER=你的数据库用户名
DB_PASSWORD=你的数据库密码
DB_NAME=你的数据库名称

# JWT密钥 - 建议使用强随机字符串
JWT_SECRET=生成一个随机字符串，如：abc123def456ghi789jkl
JWT_MOBILE_SECRET=生成另一个随机字符串
JWT_ADMIN_SECRET=生成第三个随机字符串

# 微信小程序配置
WECHAT_APPID=你的微信小程序AppID
WECHAT_APPSECRET=你的微信小程序AppSecret

# 七牛云配置（可选）
QINIU_ACCESS_KEY=你的七牛AccessKey
QINIU_SECRET_KEY=你的七牛SecretKey
QINIU_BUCKET=你的七牛Bucket
QINIU_DOMAIN=你的七牛域名
```

### 3. 创建数据库

**方式一：在宝塔面板中创建**

1. 进入"数据库"
2. 点击"添加数据库"
3. 输入数据库名称、用户名、密码
4. 记下这些信息，用于配置 `.env` 文件

**方式二：使用命令行**

```bash
mysql -u root -p

# 输入MySQL密码后执行：
CREATE DATABASE qiyedianpin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'qiyedianpin_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON qiyedianpin_db.* TO 'qiyedianpin_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. 初始化数据库

```bash
cd /home/wwwroot/qiyedianpin/server

# 安装依赖
npm install

# 初始化数据库表结构
npm run init-db

# 初始化测试数据（可选）
npm run init-data
```

### 5. 配置PM2启动

**方式一：使用宝塔面板**

1. 进入"应用商店" → 找到"PM2管理器"
2. 点击"添加项目"
3. 配置如下：
   - **项目名称**：qiyedianpin-server
   - **项目路径**：/home/wwwroot/qiyedianpin/server
   - **启动文件**：server.js
   - **Node版本**：选择已安装的Node.js版本
   - **自动启动**：勾选
   - **自动重启**：勾选

**方式二：使用命令行**

```bash
cd /home/wwwroot/qiyedianpin/server

# 启动服务
pm2 start server.js --name qiyedianpin-server

# 设置开机自启
pm2 startup
pm2 save

# 查看运行状态
pm2 status
pm2 logs qiyedianpin-server
```

### 6. 配置Nginx反向代理

在宝塔面板中：

1. 进入"网站"
2. 点击"添加站点"
3. 输入域名，选择"静态"
4. 创建后，点击"设置"
5. 进入"反向代理"标签
6. 添加反向代理规则：

```
代理名称：API
代理目录：/api
目标URL：http://127.0.0.1:3000
```

或者直接编辑Nginx配置文件：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 前端项目部署

### 1. 构建Admin项目

```bash
cd /home/wwwroot/qiyedianpin/admin

# 安装依赖
npm install

# 构建生产版本
npm run build

# 构建后的文件在 dist 目录中
```

### 2. 构建小程序项目

```bash
cd /home/wwwroot/qiyedianpin/cool-unix-main

# 安装依赖
npm install

# 构建生产版本
npm run build

# 构建后的文件在 dist 目录中
```

### 3. 在宝塔面板中部署Admin

1. 进入"网站"
2. 点击"添加站点"
3. 输入域名（如 admin.yourdomain.com）
4. 选择"静态"
5. 创建后，进入站点目录
6. 删除默认文件
7. 上传 `admin/dist` 目录下的所有文件

**配置SPA路由：**

编辑Nginx配置，在 `server` 块中添加：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 4. 在宝塔面板中部署小程序

小程序通常不需要在服务器部署，而是：

1. 使用HBuilderX打包
2. 上传到微信小程序后台
3. 或者部署到CDN

如果需要部署到服务器：

1. 进入"网站"
2. 点击"添加站点"
3. 输入域名（如 mini.yourdomain.com）
4. 上传 `cool-unix-main/dist` 目录下的文件

## 数据库配置

### 1. 创建数据库用户

```bash
mysql -u root -p

# 创建数据库
CREATE DATABASE qiyedianpin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户
CREATE USER 'qiyedianpin'@'localhost' IDENTIFIED BY 'strong_password_here';

# 授予权限
GRANT ALL PRIVILEGES ON qiyedianpin.* TO 'qiyedianpin'@'localhost';
FLUSH PRIVILEGES;

# 退出
EXIT;
```

### 2. 导入数据库表结构

```bash
cd /home/wwwroot/qiyedianpin/server
npm run init-db
```

### 3. 备份和恢复

**备份数据库：**

```bash
mysqldump -u qiyedianpin -p qiyedianpin > backup.sql
```

**恢复数据库：**

```bash
mysql -u qiyedianpin -p qiyedianpin < backup.sql
```

## SSL证书配置

### 1. 申请免费SSL证书

在宝塔面板中：

1. 进入"网站"
2. 点击要配置的站点
3. 进入"SSL"标签
4. 选择"Let's Encrypt"
5. 输入邮箱，点击"申请"

### 2. 配置HTTPS强制跳转

编辑Nginx配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ... 其他配置
}
```

## 性能优化

### 1. 启用Gzip压缩

在Nginx配置中添加：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_proxied any;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
```

### 2. 配置缓存

```nginx
# 静态文件缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 启用Redis缓存

确保Redis服务已启动：

```bash
# 在宝塔面板中检查Redis状态
# 或使用命令行
redis-cli ping
# 应该返回 PONG
```

## 监控和日志

### 1. 查看应用日志

```bash
# 查看PM2日志
pm2 logs qiyedianpin-server

# 查看Nginx日志
tail -f /www/wwwlogs/yourdomain.com.log

# 查看MySQL日志
tail -f /var/log/mysql/error.log
```

### 2. 监控系统资源

在宝塔面板中：

1. 进入"监控"
2. 查看CPU、内存、磁盘使用情况
3. 设置告警规则

### 3. 设置日志轮转

编辑 `/etc/logrotate.d/nginx`：

```
/www/wwwlogs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www www
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

## 常见问题

### Q1: 如何重启后端服务？

```bash
# 使用PM2
pm2 restart qiyedianpin-server

# 或在宝塔面板中点击"重启"按钮
```

### Q2: 如何查看服务是否正常运行？

```bash
# 检查PM2状态
pm2 status

# 检查端口是否监听
netstat -tlnp | grep 3000

# 测试API
curl http://localhost:3000/api/health
```

### Q3: 数据库连接失败怎么办？

1. 检查MySQL服务是否运行
2. 检查 `.env` 文件中的数据库配置
3. 检查数据库用户权限
4. 查看MySQL错误日志

### Q4: 如何更新项目代码？

```bash
cd /home/wwwroot/qiyedianpin

# 拉取最新代码
git pull origin main

# 重新安装依赖（如果有新依赖）
cd server && npm install
cd ../admin && npm install
cd ../cool-unix-main && npm install

# 重启服务
pm2 restart qiyedianpin-server
```

### Q5: 如何处理跨域问题？

在后端 `app.js` 中配置CORS：

```javascript
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
}));
```

### Q6: 如何配置自动备份？

在宝塔面板中：

1. 进入"计划任务"
2. 点击"添加任务"
3. 选择"备份数据库"
4. 设置执行周期（如每天凌晨2点）
5. 配置备份保留天数

## 安全建议

1. **修改默认端口**
   - 修改MySQL默认端口
   - 修改Redis默认端口

2. **设置防火墙规则**
   ```bash
   # 只允许必要的端口
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

3. **定期更新系统**
   ```bash
   apt update && apt upgrade -y
   ```

4. **启用SSH密钥认证**
   - 禁用密码认证
   - 使用SSH密钥登录

5. **配置WAF（Web应用防火墙）**
   - 在宝塔面板中启用WAF
   - 配置防护规则

## 故障排查

### 服务无法启动

```bash
# 1. 检查日志
pm2 logs qiyedianpin-server

# 2. 检查依赖是否完整
npm install

# 3. 检查端口是否被占用
lsof -i :3000

# 4. 检查环境变量
cat .env
```

### 数据库连接错误

```bash
# 1. 测试MySQL连接
mysql -h localhost -u qiyedianpin -p

# 2. 检查MySQL服务
systemctl status mysql

# 3. 查看MySQL错误日志
tail -f /var/log/mysql/error.log
```

### 前端页面加载失败

```bash
# 1. 检查Nginx配置
nginx -t

# 2. 重新加载Nginx
systemctl reload nginx

# 3. 查看Nginx错误日志
tail -f /var/log/nginx/error.log
```

---

**最后更新：** 2025年11月28日

如有问题，请提交Issue或联系技术支持。
