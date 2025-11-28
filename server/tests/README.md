# API接口测试文档

## 目录结构

```
tests/
├── c-api/              # C端API测试
│   ├── user.test.js    # 用户模块
│   ├── company.test.js # 企业模块
│   ├── review.test.js  # 评价模块
│   ├── reply.test.js   # 回复模块
│   └── report.test.js  # 举报模块
├── b-api/              # B端API测试
│   ├── admin.test.js   # 管理员认证
│   ├── company.test.js # 企业管理
│   ├── review.test.js  # 评价管理
│   ├── reply.test.js   # 回复管理
│   ├── user.test.js    # 用户管理
│   └── report.test.js  # 举报管理
├── utils/              # 工具类
│   ├── logger.js       # 彩色日志
│   └── request.js      # HTTP请求
├── config.js           # 测试配置
├── index.js            # 测试入口
└── README.md           # 说明文档
```

## 使用方法

### 1. 安装依赖

```bash
npm install axios
```

### 2. 启动服务器

```bash
npm run dev
```

### 3. 执行测试

```bash
# 执行所有测试
npm test

# 或直接运行
node tests/index.js
```

## 测试说明

### C端API测试
- ✅ 用户模块: 微信登录、获取用户信息、更新用户信息
- ✅ 企业模块: 搜索企业、企业详情、热门企业、相似企业
- ✅ 评价模块: 评价列表、评价详情、发布评价、点赞、我的评价、删除评价
- ✅ 回复模块: 发布回复、我的回复列表
- ✅ 举报模块: 提交举报

### B端API测试
- ✅ 管理员认证: 登录、获取信息
- ✅ 企业管理: 列表、详情、新增、编辑、删除
- ✅ 评价管理: 列表、详情、编辑、审核
- ✅ 回复管理: 列表、详情、编辑、审核
- ✅ 用户管理: 列表、详情、编辑
- ✅ 举报管理: 列表、详情、处理

## 配置说明

修改 `config.js` 文件可以调整测试配置:

```javascript
{
  baseURL: 'http://localhost:3000',  // API地址
  timeout: 10000,                     // 请求超时
  testUser: { ... },                  // 测试用户
  testAdmin: { ... }                  // 测试管理员
}
```

## 注意事项

1. 测试前确保服务器已启动
2. 测试会创建真实数据,建议在开发环境执行
3. 微信登录使用模拟数据,不调用真实微信接口
4. 文件上传测试已跳过
5. 测试结果会以彩色日志输出,便于查看

## 测试结果

测试完成后会输出:
- ✓ 绿色: 测试通过
- ✗ 红色: 测试失败
- ⚠ 黄色: 警告信息
- ℹ 蓝色: 提示信息
