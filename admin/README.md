# Lnb Admin

一个基于 Vue 3 + TypeScript + Element Plus 的现代化管理后台系统，提供完整的企业级功能和优雅的用户体验。

## ✨ 特性

- 🚀 **现代技术栈**: Vue 3.5 + TypeScript 5.6 + Vite 6.1
- 🎨 **优雅设计**: 基于 Element Plus 的现代化 UI 设计
- 🌈 **主题系统**: 支持亮色/暗色/自动切换，多种主题预设
- 🔐 **权限管理**: 完整的 RBAC 权限控制系统
- 🌍 **国际化**: 内置中英文支持，易于扩展
- 📱 **响应式**: 完美适配桌面端、平板端、移动端
- ⚡ **性能优化**: 代码分割、懒加载、Tree Shaking
- 🛠️ **开发体验**: 热更新、TypeScript、ESLint、Prettier

## 🏗️ 技术架构

### 核心技术栈

| 技术 | 版本 | 描述 |
|------|------|------|
| Vue | 3.5.12 | 渐进式 JavaScript 框架 |
| TypeScript | 5.6.3 | JavaScript 的超集，提供静态类型检查 |
| Vite | 6.1.0 | 下一代前端构建工具 |
| Element Plus | 2.10.2 | 基于 Vue 3 的组件库 |
| Pinia | 3.0.2 | Vue 的状态管理库 |
| Vue Router | 4.4.2 | Vue 官方路由管理器 |

### 工具库

| 工具 | 版本 | 描述 |
|------|------|------|
| @vueuse/core | 11.0.0 | Vue 组合式工具库 |
| axios | 1.7.5 | HTTP 客户端 |
| echarts | 5.6.0 | 数据可视化图表库 |
| crypto-js | 4.2.0 | 加密工具库 |
| mitt | 3.0.1 | 事件总线 |

## 📦 安装使用

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐)

### 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd lnb-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm serve
```

### 开发命令

```bash
# 开发服务器
pnpm dev

# 类型检查
pnpm build

# 代码检查
pnpm lint

# 代码修复
pnpm fix

# 代码格式化
pnpm lint:prettier

# 样式检查
pnpm lint:stylelint

# 提交代码
pnpm commit
```

## 📁 项目结构

```
lnb-admin/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 资源文件
│   │   ├── icons/         # 图标
│   │   ├── img/           # 图片
│   │   ├── styles/        # 样式文件
│   │   └── svg/           # SVG 图标
│   ├── components/        # 组件库
│   │   ├── core/          # 核心组件
│   │   └── custom/        # 自定义组件
│   ├── composables/       # 组合式函数
│   ├── config/            # 配置文件
│   ├── directives/        # 自定义指令
│   ├── enums/             # 枚举定义
│   ├── locales/           # 国际化
│   ├── mock/              # 模拟数据
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── .eslintrc.js           # ESLint 配置
├── .prettierrc            # Prettier 配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── package.json           # 项目配置
```

## 🎨 主题系统

### 主题切换

系统支持三种主题模式：

- **亮色主题**: 适合日间使用的明亮界面
- **暗色主题**: 适合夜间使用的深色界面  
- **自动主题**: 根据系统设置自动切换

### 自定义主题

支持 7 种预设主色调：

- 蓝色 (#5D87FF)
- 紫色 (#B48DF3)
- 青色 (#1D84FF)
- 绿色 (#60C041)
- 天蓝 (#38C0FC)
- 橙色 (#F9901F)
- 粉色 (#FF80C8)

### 菜单布局

支持 4 种菜单布局：

- **左侧菜单**: 传统的左侧导航布局
- **顶部菜单**: 顶部水平导航布局
- **混合菜单**: 顶部 + 左侧混合布局
- **双栏菜单**: 双栏垂直导航布局

## 🔐 权限系统

### 权限控制

- **路由权限**: 基于角色的路由访问控制
- **菜单权限**: 动态菜单生成和显示控制
- **按钮权限**: 页面内按钮级别的权限控制
- **数据权限**: 基于用户角色的数据访问控制

### 权限配置

```typescript
// 路由权限配置
{
  path: '/user',
  name: 'User',
  component: () => import('@/views/user/index.vue'),
  meta: {
    title: 'user.title',
    requiresAuth: true,
    roles: ['admin', 'user-manager'],
    permissions: ['user:read']
  }
}

// 组件内权限检查
const hasPermission = (permission: string) => {
  return userStore.permissions.includes(permission)
}
```

## 🌍 国际化

### 语言支持

- 中文 (zh)
- English (en)

### 使用方式

```vue
<template>
  <!-- 模板中使用 -->
  <span>{{ $t('common.confirm') }}</span>
</template>

<script setup>
  // 脚本中使用
  import { $t } from '@/locales'
  
  const message = $t('user.login.success')
</script>
```

### 添加新语言

1. 在 `src/locales/langs/` 目录下添加语言文件
2. 在 `src/locales/index.ts` 中注册新语言
3. 在 `src/App.vue` 中添加 Element Plus 语言包

## 📊 状态管理

使用 Pinia 进行状态管理，采用 Composition API 风格：

```typescript
// 定义 Store
export const useUserStore = defineStore('userStore', () => {
  const userInfo = ref<UserInfo | null>(null)
  const isLogin = ref(false)
  
  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials)
    userInfo.value = response.userInfo
    isLogin.value = true
  }
  
  return {
    userInfo: readonly(userInfo),
    isLogin: readonly(isLogin),
    login
  }
}, {
  persist: true // 启用持久化
})

// 使用 Store
const userStore = useUserStore()
await userStore.login({ username, password })
```

## 🛠️ 开发指南

### 代码规范

项目使用 ESLint + Prettier + Stylelint 确保代码质量：

- **ESLint**: JavaScript/TypeScript 代码检查
- **Prettier**: 代码格式化
- **Stylelint**: CSS/SCSS 样式检查
- **Husky**: Git hooks 管理
- **lint-staged**: 暂存文件检查

### 提交规范

使用 Conventional Commits 规范：

```bash
# 功能开发
git commit -m "feat: 添加用户管理功能"

# 问题修复
git commit -m "fix: 修复登录页面样式问题"

# 文档更新
git commit -m "docs: 更新 README 文档"
```

### 组件开发

```vue
<template>
  <div class="my-component">
    <el-button @click="handleClick">{{ title }}</el-button>
  </div>
</template>

<script setup lang="ts">
  // 组件配置
  defineOptions({ name: 'MyComponent' })
  
  // Props 定义
  interface Props {
    title: string
  }
  const props = defineProps<Props>()
  
  // 事件定义
  const emit = defineEmits<{
    click: [value: string]
  }>()
  
  // 方法定义
  const handleClick = () => {
    emit('click', props.title)
  }
</script>

<style lang="scss" scoped>
  .my-component {
    // 使用 SCSS 和 CSS 变量
    color: var(--art-text-color);
  }
</style>
```

## 🚀 部署

### 构建

```bash
# 构建生产版本
pnpm build

# 构建后的文件在 dist 目录
```

### 环境变量

```bash
# .env.development (开发环境)
VITE_API_URL=http://localhost:3000/api
VITE_ACCESS_MODE=frontend

# .env.production (生产环境)
VITE_API_URL=https://api.example.com
VITE_ACCESS_MODE=backend
```

### 服务器配置

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 加入讨论群

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
