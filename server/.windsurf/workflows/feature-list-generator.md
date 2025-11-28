---
name: /feature-list
id: feature-list-generator
category: 文档生成
description: 功能清单生成器 - 以产品经理+全栈开发思维生成功能清单JSON文件
---

# 功能清单生成器

## 指令说明

以**产品经理 + 全栈开发**的思维方式，根据用户描述的业务需求，生成完整的功能清单JSON文件。

**核心能力**：
- 根据业务描述推导完整功能
- 不扫描代码，纯需求驱动
- 确保各端功能逻辑对应
- 输出规范的JSON格式

## 使用方式

用户需要提供以下信息：

1. **项目类型**：如"图书借阅小程序"、"外卖平台"、"商城系统"等
2. **包含哪些端**：用户端、商家端、管理端等
3. **业务流程**：核心业务流程描述

**示例输入**：
```
我需要一个图书借阅的小程序功能，只有用户端和后台管理端。

业务流程：
- 线下借书
- 线下办理会员卡
- 线上续借
- 线下归还
```

## 执行步骤

### 1. 理解业务需求（产品经理思维）

**仔细分析用户描述**，理解：
- 项目类型和业务场景
- 有哪些端（用户端、商家端、管理端）
- 核心业务流程
- 业务中的关键实体（用户、商品、订单等）

**从业务流程推导完整功能**：

**示例：图书借阅小程序**

业务流程：线下借书 → 线下办理会员卡 → 线上续借 → 线下归还

**推导思路**：

1. **用户端需要**：
   - 登录/注册（微信授权）
   - 会员卡展示（办卡后查看会员信息）
   - 借阅记录（查看当前借阅的书、历史记录）
   - 续借功能（对当前借阅的书进行续借）
   - 图书搜索（查找图书信息）
   - 个人中心（个人信息、设置）

2. **管理端需要**：
   - 用户管理（查看用户列表、用户详情）
   - 会员卡管理（办理会员卡、查看会员信息）
   - 图书管理（新增图书、编辑图书、库存管理）
   - 借阅管理（线下借书登记、归还登记、续借审核）
   - 统计报表（借阅统计、会员统计）

**确保逻辑对应**：
- 用户端有"会员卡展示" → 管理端必须有"会员卡管理（办理/查询）"
- 用户端有"借阅记录" → 管理端必须有"借阅管理（借书/归还登记）"
- 用户端有"续借功能" → 管理端必须有"续借审核"
- 管理端有"图书管理" → 用户端必须能"搜索图书"

### 2. 推导各端完整功能

**核心原则**：
1. **端之间逻辑对应**：用户端能做的操作，管理端必须有对应的管理功能
2. **业务闭环完整**：从用户操作到管理员处理，形成完整业务闭环
3. **功能细节完善**：每个模块要包含增删改查、搜索、筛选等完整功能

**功能推导示例**（图书借阅）：

| 业务环节 | 用户端功能 | 管理端功能 |
|---------|----------|----------|
| 用户认证 | 登录/注册（微信授权） | 用户管理（用户列表、详情、启用禁用） |
| 会员办理 | 会员卡展示、会员到期提醒 | 会员卡管理（办理会员、续费、查询） |
| 图书浏览 | 图书搜索、图书详情、分类浏览 | 图书管理（新增、编辑、删除、库存） |
| 借阅操作 | 借阅记录（当前借阅、历史记录） | 借阅管理（线下借书登记、扫码借书） |
| 续借操作 | 线上续借申请 | 续借审核（同意/拒绝） |
| 归还操作 | 归还提醒 | 归还登记（线下归还） |
| 统计数据 | 我的借阅统计 | 借阅统计、会员统计、图书统计 |

### 3. 生成JSON结构

**JSON格式要求**：

```json
{
  "title": "系统功能表",
  "version": "1.0",
  "updateDate": "YYYY-MM-DD",
  "data": [
    {
      "userType": "用户端类型",
      "projectModule": "项目模块（一级模块）",
      "functionModule": "功能模块（二级模块）",
      "functionDetail": "功能详情（具体功能点）",
      "functionDesc": "功能描述（详细说明）"
    }
  ]
}
```

**字段说明**：

- `userType`: 用户端类型
  - "用户端微信小程序" / "用户端H5" / "用户端App"
  - "商家端微信小程序" / "商家端Web"
  - "管理端（PC Web版）" / "管理端微信小程序"
  - "备注"（用于分隔不同端）

- `projectModule`: 项目模块（一级模块）
  - 根据业务场景命名，如：图书管理、借阅管理、会员管理等

- `functionModule`: 功能模块（二级模块）
  - 具体功能模块，如：图书列表、借阅记录、会员信息等

- `functionDetail`: 功能详情（三级，具体功能点）
  - 详细功能点，如：搜索、筛选、新增、编辑等

- `functionDesc`: 功能描述（详细说明实现细节）
  - 功能的具体实现描述

**层级规则**：
1. 第一条数据填写完整的5个字段
2. 同一 `userType` 下的后续数据，`userType` 填空字符串 `""`
3. 同一 `projectModule` 下的后续数据，`projectModule` 填空字符串 `""`
4. 同一 `functionModule` 下的后续数据，`functionModule` 填空字符串 `""`
5. 使用"备注"作为 `userType` 来分隔不同的端

### 4. 执行规范

**核心原则**：
1. **需求驱动** - 根据用户描述的业务需求推导功能，不扫描代码
2. **逻辑对应** - 确保各端功能逻辑对应，业务闭环完整
3. **产品思维** - 用产品经理视角补充完整的功能细节
4. **严格JSON格式** - 必须是合法的JSON，可以直接保存为.json文件
5. **不输出过程** - 不输出分析过程、思考过程，只输出JSON
6. **直接创建文件** - 生成JSON后立即写入文件

**执行流程**：

1. **理解需求**（内部完成，不输出）
   - 分析用户描述的项目类型
   - 识别包含哪些端
   - 理解核心业务流程

2. **推导功能**（内部完成，不输出）
   - 根据业务流程推导各端完整功能
   - 确保用户端和管理端逻辑对应
   - 补充完整的功能细节（增删改查、搜索、筛选等）

3. **生成JSON内容**（内部完成，不输出）
   - 按照JSON格式组织数据
   - 确保层级关系正确
   - 确保字段完整

4. **立即创建文件**（直接执行）
   ```bash
   mkdir -p docs
   ```
   
   然后立即使用 write 工具写入文件：
   - write('docs/system-functions.json', [完整JSON内容])

5. **告知用户**
   输出简洁的成功消息：
   ```
   ✓ 已生成功能清单文件：docs/system-functions.json
   
   统计信息：
   - 包含 X 个端（用户端/管理端等）
   - 生成 Y 个项目模块
   - 包含 Z 个功能点
   
   功能概览：
   - 用户端：登录、会员、借阅、续借等 XX 个功能
   - 管理端：用户管理、会员管理、图书管理、借阅管理等 XX 个功能
   ```

**重要禁止**：
- ❌ 禁止输出JSON内容到对话框
- ❌ 禁止展示分析过程
- ❌ 禁止等待用户确认
- ❌ 禁止遗漏对应的管理功能
- ✅ 直接理解、直接推导、直接生成、直接写入、告知完成

### 5. JSON内容示例

**完整示例：图书借阅小程序**

```json
{
  "title": "图书借阅系统功能表",
  "version": "1.0",
  "updateDate": "2025-01-06",
  "data": [
    {
      "userType": "用户端微信小程序",
      "projectModule": "登录认证",
      "functionModule": "登录",
      "functionDetail": "微信授权登录",
      "functionDesc": "使用微信快捷登录，获取用户基本信息"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "手机号绑定",
      "functionDesc": "绑定手机号，用于接收借阅通知"
    },
    {
      "userType": "",
      "projectModule": "会员中心",
      "functionModule": "会员卡",
      "functionDetail": "会员卡展示",
      "functionDesc": "显示会员卡号、到期时间、会员权益"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "到期提醒",
      "functionDesc": "会员到期前7天提醒用户续费"
    },
    {
      "userType": "",
      "projectModule": "图书浏览",
      "functionModule": "图书搜索",
      "functionDetail": "关键词搜索",
      "functionDesc": "输入书名、作者、ISBN搜索图书"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "图书详情",
      "functionDesc": "显示图书封面、简介、库存状态、借阅情况"
    },
    {
      "userType": "",
      "projectModule": "借阅管理",
      "functionModule": "借阅记录",
      "functionDetail": "当前借阅",
      "functionDesc": "显示当前借阅的图书列表、借阅时间、到期时间"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "历史记录",
      "functionDesc": "显示历史借阅记录、归还时间"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "续借",
      "functionDetail": "续借申请",
      "functionDesc": "对当前借阅的图书申请续借，每本书最多续借2次"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "续借状态",
      "functionDesc": "查看续借申请状态（待审核/已同意/已拒绝）"
    },
    {
      "userType": "",
      "projectModule": "个人中心",
      "functionModule": "个人信息",
      "functionDetail": "基本资料",
      "functionDesc": "头像、昵称、手机号、会员状态"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "设置",
      "functionDetail": "消息通知",
      "functionDesc": "开启/关闭借阅到期提醒、续借审核通知"
    },
    {
      "userType": "备注",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "",
      "functionDesc": ""
    },
    {
      "userType": "管理端（PC Web版）",
      "projectModule": "用户管理",
      "functionModule": "用户列表",
      "functionDetail": "搜索",
      "functionDesc": "按昵称、手机号搜索用户"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "列表信息",
      "functionDesc": "用户ID、昵称、手机号、会员状态、借阅次数、注册时间"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "操作",
      "functionDetail": "查看详情",
      "functionDesc": "查看用户详细信息、借阅历史"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "启用/禁用",
      "functionDesc": "禁用后用户无法借阅和续借"
    },
    {
      "userType": "",
      "projectModule": "会员管理",
      "functionModule": "会员办理",
      "functionDetail": "办理会员",
      "functionDesc": "线下办理会员卡，录入用户信息、会员期限"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "会员续费",
      "functionDesc": "为已到期或即将到期的会员续费"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "会员列表",
      "functionDetail": "搜索",
      "functionDesc": "按卡号、手机号搜索会员"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "列表信息",
      "functionDesc": "会员卡号、用户信息、办理时间、到期时间、状态"
    },
    {
      "userType": "",
      "projectModule": "图书管理",
      "functionModule": "图书列表",
      "functionDetail": "搜索",
      "functionDesc": "按书名、作者、ISBN搜索图书"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "列表信息",
      "functionDesc": "图书封面、书名、作者、ISBN、库存、在借数量"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "操作",
      "functionDetail": "新增图书",
      "functionDesc": "录入图书信息：书名、作者、ISBN、简介、库存数量"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "编辑图书",
      "functionDesc": "修改图书信息、增减库存"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "删除图书",
      "functionDesc": "删除无借阅记录的图书"
    },
    {
      "userType": "",
      "projectModule": "借阅管理",
      "functionModule": "借书登记",
      "functionDetail": "扫码借书",
      "functionDesc": "扫描用户会员卡和图书二维码完成借书登记"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "手动登记",
      "functionDesc": "输入会员卡号和图书编号完成借书登记"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "归还登记",
      "functionDetail": "扫码归还",
      "functionDesc": "扫描图书二维码完成归还登记"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "手动归还",
      "functionDesc": "输入图书编号完成归还登记"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "续借审核",
      "functionDetail": "续借列表",
      "functionDesc": "显示所有续借申请（待审核/已处理）"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "审核操作",
      "functionDesc": "同意或拒绝续借申请，填写审核备注"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "借阅记录",
      "functionDetail": "搜索",
      "functionDesc": "按用户、图书、时间段搜索借阅记录"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "列表信息",
      "functionDesc": "用户信息、图书信息、借阅时间、到期时间、归还时间、状态"
    },
    {
      "userType": "",
      "projectModule": "统计报表",
      "functionModule": "借阅统计",
      "functionDetail": "借阅趋势",
      "functionDesc": "按时间统计借阅数量、归还数量、续借数量"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "热门图书",
      "functionDesc": "统计借阅次数最多的图书"
    },
    {
      "userType": "",
      "projectModule": "",
      "functionModule": "会员统计",
      "functionDetail": "会员数量",
      "functionDesc": "统计总会员数、有效会员数、即将到期会员数"
    },
    {
      "userType": "备注",
      "projectModule": "",
      "functionModule": "",
      "functionDetail": "",
      "functionDesc": ""
    }
  ]
}
```

## 使用方法

### 步骤1：输入指令

在AI助手中输入：
```
/feature-list
```

### 步骤2：描述需求

AI会询问你的需求，你需要提供：

```
我需要一个图书借阅的小程序功能，只有用户端和后台管理端。

业务流程：
- 线下借书
- 线下办理会员卡
- 线上续借
- 线下归还
```

### 步骤3：AI自动生成

AI会：
1. **理解需求**：分析项目类型、端、业务流程
2. **推导功能**：根据业务流程推导各端完整功能
3. **生成JSON**：docs/system-functions.json
4. **立即写入文件**（不等待确认）

## 核心逻辑

**从需求到产品功能**：
- 业务流程"线下借书" → 推导出：用户端"借阅记录"、管理端"借书登记"
- 业务流程"线上续借" → 推导出：用户端"续借申请"、管理端"续借审核"
- 业务流程"会员办理" → 推导出：用户端"会员卡展示"、管理端"会员办理"

**层级组织**：
- userType（端）→ projectModule（一级模块）→ functionModule（二级模块）→ functionDetail（功能点）→ functionDesc（详细说明）
- 使用空字符串表示延续上一级分类

**完整性保证**：
- 用户端有的功能 → 管理端必须有对应的管理功能
- 业务流程完整 → 各端功能形成闭环
- 功能细节完善 → 包含增删改查、搜索、筛选等

## 注意事项

- **严格JSON格式**：必须是合法的JSON，双引号、逗号、括号都要正确
- **需求驱动**：根据用户描述的业务需求推导功能
- **逻辑对应**：确保用户端和管理端功能逻辑对应
- **层级关系清晰**：使用空字符串表示层级延续
- **分隔符使用**：用"备注"分隔不同的端
- **功能完整性**：每个业务环节都要有对应的前后端功能

