# Demo Server

基于Node.js和Express的服务端框架

## 技术栈

- Node.js (>=16.0.0)
- Express
- MySQL
- Redis
- JWT
- bcrypt (密码加密)

## 项目结构

```
├── server.js           # 服务器入口文件
├── app.js              # Express应用配置
├── config/             # 配置文件
│   └── index.js        # 配置加载器
├── controllers/        # 控制器层
│   ├── admin/          # 后台控制器
│   └── mobile/         # 移动端控制器
├── services/           # 服务层
├── middlewares/        # 中间件
│   ├── index.js        # 中间件加载器
│   └── error.js        # 错误处理中间件
├── routes/             # 路由
│   ├── index.js        # 路由加载器
│   ├── admin/          # 后台路由
│   │   ├── index.js    # 后台路由聚合
│   │   ├── auth.js     # 后台认证路由
│   │   └── ...         # 其他后台路由
│   ├── mobile/         # 移动端路由
│   │   ├── index.js    # 移动端路由聚合
│   │   ├── auth.js     # 移动端认证路由
│   │   └── ...         # 其他移动端路由
│   └── middlewares/    # 路由中间件
│       ├── validate.js # 请求验证中间件
│       └── permission.js # 权限检查中间件
├── scripts/            # 脚本文件
│   ├── initDB.js       # 数据库初始化脚本
│   ├── initDbData.js   # 测试数据初始化脚本
│   ├── db/             # 数据库表结构
│   │   ├── index.js    # 表结构初始化索引
│   │   ├── users.js    # 用户表结构
│   │   └── roles.js    # 角色表结构
│   └── data/           # 测试数据
│       ├── index.js    # 测试数据初始化索引
│       ├── users.js    # 用户测试数据
│       └── roles.js    # 角色测试数据
└── utils/              # 工具函数
    ├── bcrypt.js       # 密码加密工具
    ├── db.js           # 数据库连接工具
    ├── jwt.js          # JWT工具
    ├── logger.js       # 日志工具
    ├── portCheck.js    # 端口检查工具
    ├── redis.js        # Redis连接工具
    └── response.js     # 统一响应工具
```

## 环境要求

- Node.js >= 16.0.0
- MySQL
- Redis

## 安装

1. 安装依赖

```bash
npm install
```

2. 初始化数据库

```bash
npm run init-db
```

3. 初始化测试数据（可选）

```bash
npm run init-data
```

## 运行

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
npm start
```

## API设计

### RESTful设计原则

- 资源命名：使用复数名词（如 `/users`、`/products`）
- HTTP方法：
  - GET：获取资源
  - POST：创建资源
  - PUT：完整更新资源
  - PATCH：部分更新资源
  - DELETE：删除资源

### 状态码规范

- 2xx（成功）
  - 200 OK：操作成功
  - 201 Created：创建成功
  - 204 No Content：操作成功，无返回内容

- 4xx（客户端错误）
  - 400 Bad Request：请求参数错误
  - 401 Unauthorized：未授权（未登录）
  - 403 Forbidden：权限不足
  - 404 Not Found：资源不存在
  - 409 Conflict：资源冲突（如重复数据）
  - 422 Unprocessable Entity：请求格式正确，但语义错误

- 5xx（服务器错误）
  - 500 Internal Server Error：服务器内部错误
  - 503 Service Unavailable：服务不可用

- 6xx（自定义业务状态码）
  - 600 Business Error：业务逻辑错误
  - 601 Validation Error：数据验证错误
  - 602 Database Error：数据库操作错误

### 统一响应格式

```javascript
// 成功响应
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "timestamp": "2025-05-25 00:00:00"
}

// 分页响应
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 100,
      "total_pages": 10,
      "current_page": 1,
      "page_size": 10,
      "has_previous": false,
      "has_next": true,
      "is_first_page": true,
      "is_last_page": false
    }
  },
  "timestamp": "2025-05-25 00:00:00"
}

// 错误响应
{
  "code": 400,
  "message": "参数错误",
  "data": null,
  "timestamp": "2025-05-25 00:00:00"
}
```

## 认证

系统采用JWT认证，分为两套隔离的认证机制：

- 移动端认证：用于移动应用
- 后台端认证：用于管理后台

每个端只能使用对应的token进行操作。

## 分层架构

项目采用分层架构设计，提高代码的可维护性和可测试性：

1. **路由层(Routes)**：
   - 定义API端点
   - 处理HTTP请求和响应
   - 参数验证和权限检查

2. **控制器层(Controllers)**：
   - 处理业务流程控制
   - 调用相应的服务
   - 处理异常情况

3. **服务层(Services)**：
   - 实现核心业务逻辑
   - 数据处理和转换
   - 事务控制

4. **数据访问层(DAL)**：
   - 与数据库交互
   - 执行CRUD操作
   - 封装SQL查询

这种分层架构有助于代码的解耦和单元测试，同时便于团队协作开发。