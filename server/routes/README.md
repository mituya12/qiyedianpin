# 路由目录说明

此目录包含所有API路由定义，遵循模块化和RESTful设计原则。

## 目录结构

```
routes/
├── index.js                  # 路由注册入口
├── admin/                    # 后台管理API
│   ├── index.js              # 后台路由聚合
│   ├── auth.js               # 认证相关路由
│   ├── users.js              # 用户管理路由
│   ├── roles.js              # 角色管理路由
│   └── ...                   # 其他后台路由
├── mobile/                   # 移动端API
│   ├── index.js              # 移动端路由聚合
│   ├── auth.js               # 认证相关路由
│   ├── user.js               # 用户信息路由
│   ├── content.js            # 内容相关路由
│   └── ...                   # 其他移动端路由
└── middlewares/              # 路由中间件
    ├── validate.js           # 请求验证中间件
    ├── permission.js         # 权限检查中间件
    └── ...                   # 其他路由中间件
```

## 设计原则

1. **模块化**：按功能模块组织路由
2. **版本控制**：支持API版本管理
3. **认证隔离**：移动端和后台端使用不同的认证机制
4. **参数验证**：所有API入参都需要验证
5. **统一响应**：使用统一的响应格式

## 添加新功能模块的步骤

### 示例：添加商品管理功能

1. 创建路由文件：

```javascript
// routes/admin/products.js
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const { validateProduct } = require('../middlewares/validate');
const productController = require('../../controllers/admin/product');

// 中间件：认证
const auth = authMiddleware(USER_TYPES.ADMIN);

// 获取商品列表
router.get('/', auth, productController.getProducts);

// 获取单个商品
router.get('/:id', auth, productController.getProductById);

// 创建商品
router.post('/', auth, validateProduct, productController.createProduct);

// 更新商品
router.put('/:id', auth, validateProduct, productController.updateProduct);

// 删除商品
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
```

2. 在对应的路由索引文件中注册：

```javascript
// routes/admin/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const roleRoutes = require('./roles');
const productRoutes = require('./products'); // 新增商品路由

// 认证相关
router.use('/auth', authRoutes);

// 用户管理
router.use('/users', userRoutes);

// 角色管理
router.use('/roles', roleRoutes);

// 商品管理 - 新增
router.use('/products', productRoutes);

module.exports = router;
```

3. 创建控制器：

```javascript
// controllers/admin/product.js
const { success, error } = require('../../utils/response');
const { StatusCodes } = require('http-status-codes');
const productService = require('../../services/product');

// 获取商品列表
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword } = req.query;
    const products = await productService.getProducts(page, limit, keyword);
    
    success(res, products);
  } catch (err) {
    error(res, '获取商品列表失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// 获取单个商品
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return error(res, '商品不存在', StatusCodes.NOT_FOUND);
    }
    
    success(res, product);
  } catch (err) {
    error(res, '获取商品详情失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// 创建商品
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    success(res, product, '商品创建成功', StatusCodes.CREATED);
  } catch (err) {
    error(res, '创建商品失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// 更新商品
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await productService.updateProduct(id, req.body);
    
    if (!updated) {
      return error(res, '商品不存在', StatusCodes.NOT_FOUND);
    }
    
    success(res, updated, '商品更新成功');
  } catch (err) {
    error(res, '更新商品失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// 删除商品
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    
    if (!deleted) {
      return error(res, '商品不存在', StatusCodes.NOT_FOUND);
    }
    
    success(res, null, '商品删除成功');
  } catch (err) {
    error(res, '删除商品失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
```

4. 创建验证中间件：

```javascript
// routes/middlewares/validate.js
const { error } = require('../../utils/response');
const { StatusCodes } = require('http-status-codes');

// 商品验证中间件
const validateProduct = (req, res, next) => {
  const { name, price, description } = req.body;
  
  if (!name || name.trim() === '') {
    return error(res, '商品名称不能为空', StatusCodes.BAD_REQUEST);
  }
  
  if (!price || isNaN(price) || price <= 0) {
    return error(res, '商品价格必须大于0', StatusCodes.BAD_REQUEST);
  }
  
  next();
};

module.exports = {
  validateProduct
};
```

## 使用分层架构

建议采用以下分层架构：

1. **路由层(Routes)**：定义API端点，处理HTTP请求
2. **控制器层(Controllers)**：处理请求逻辑，调用服务
3. **服务层(Services)**：实现业务逻辑
4. **数据访问层(DAL)**：与数据库交互

## 注意事项

- 所有API都应使用`utils/response.js`中的`success`和`error`函数进行响应
- 移动端和后台端的认证必须使用不同的JWT密钥
- 对于敏感操作，添加额外的权限验证中间件
- 所有路由都应进行参数验证 