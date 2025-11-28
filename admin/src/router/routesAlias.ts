/**
 * 路由别名，方便快速找到页面，同时可以用作路由跳转
 */
export enum RoutesAlias {
  // 布局和认证
  Layout = '/index/index', // 布局容器
  Login = '/auth/login', // 登录
  Register = '/auth/register', // 注册
  ForgetPassword = '/auth/forget-password', // 忘记密码

  // 异常页面
  Exception403 = '/exception/403', // 403
  Exception404 = '/exception/404', // 404
  Exception500 = '/exception/500', // 500

  // 结果页面
  Success = '/result/success', // 成功
  Fail = '/result/fail', // 失败

  // 仪表板
  Dashboard = '/dashboard/console', // 工作台

  // 系统管理
  User = '/system/user', // 账户
  Role = '/system/role', // 角色
  UserCenter = '/system/user-center', // 用户中心
  Menu = '/system/menu', // 菜单

  // 平台管理
  PlatformUser = '/platform/user', // 用户管理

  // 企业管理
  EnterpriseList = '/enterprise/list', // 企业列表

  // 评价管理
  ReviewList = '/review/list', // 评价列表

  // 回复管理
  ReplyList = '/reply/list', // 回复列表

  // 举报管理
  ReportList = '/report/list', // 举报列表

  // 统计分析
  StatisticsOverview = '/statistics/overview', // 数据概览

  // 系统设置
  SettingsAdmin = '/settings/admin', // 管理员管理
  SettingsConfig = '/settings/config', // 系统配置
  SettingsFeedback = '/settings/feedback' // 用户反馈
}
