import { RoutesAlias } from '../routesAlias'
import { AppRouteRecord } from '@/types/router'

/**
 * 菜单列表、异步路由
 *
 * 支持两种模式:
 * 前端静态配置 - 直接使用本文件中定义的路由配置
 * 后端动态配置 - 后端返回菜单数据，前端解析生成路由
 *
 * 菜单标题（title）:
 * 可以是 i18n 的 key，也可以是字符串，比如：'用户列表'
 *
 * RoutesAlias.Layout 指向的是布局组件，后端返回的菜单数据中，component 字段需要指向 /index/index
 * 路由元数据（meta）：异步路由在 asyncRoutes 中配置，静态路由在 staticRoutes 中配置
 */
export const asyncRoutes: AppRouteRecord[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: RoutesAlias.Dashboard,
        meta: {
          title: 'menus.dashboard.console',
          keepAlive: false,
          fixedTab: true,
          isHide: true
        }
      },
      {
        path: 'overview',
        name: 'DashboardOverview',
        component: RoutesAlias.StatisticsOverview,
        meta: {
          title: '数据概览',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/platform',
    name: 'Platform',
    component: RoutesAlias.Layout,
    meta: {
      title: '平台管理',
      icon: '&#xe82a;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'user',
        name: 'PlatformUser',
        component: RoutesAlias.PlatformUser,
        meta: {
          title: '用户管理',
          keepAlive: true,
          roles: ['R_SUPER', 'R_ADMIN']
        }
      }
    ]
  },
  {
    path: '/result',
    name: 'Result',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.result.title',
      icon: '&#xe715;',
      isHide: true
    },
    children: [
      {
        path: 'success',
        name: 'ResultSuccess',
        component: RoutesAlias.Success,
        meta: {
          title: 'menus.result.success',
          keepAlive: true
        }
      },
      {
        path: 'fail',
        name: 'ResultFail',
        component: RoutesAlias.Fail,
        meta: {
          title: 'menus.result.fail',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/enterprise',
    name: 'Enterprise',
    component: RoutesAlias.Layout,
    meta: {
      title: '企业管理',
      icon: '&#xe873;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'list',
        name: 'EnterpriseList',
        component: RoutesAlias.EnterpriseList,
        meta: {
          title: '企业列表',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/review',
    name: 'Review',
    component: RoutesAlias.Layout,
    meta: {
      title: '评价管理',
      icon: '&#xe65e;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'list',
        name: 'ReviewList',
        component: RoutesAlias.ReviewList,
        meta: {
          title: '评价列表',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/reply',
    name: 'Reply',
    component: RoutesAlias.Layout,
    meta: {
      title: '回复管理',
      icon: '&#xe66a;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'list',
        name: 'ReplyList',
        component: RoutesAlias.ReplyList,
        meta: {
          title: '回复列表',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/report',
    name: 'Report',
    component: RoutesAlias.Layout,
    meta: {
      title: '内容管理',
      icon: '&#xe667;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'list',
        name: 'ReportList',
        component: RoutesAlias.ReportList,
        meta: {
          title: '举报管理',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: RoutesAlias.Layout,
    meta: {
      title: '系统设置',
      icon: '&#xe614;',
      roles: ['R_SUPER']
    },
    children: [
      {
        path: 'admin',
        name: 'SettingsAdmin',
        component: RoutesAlias.SettingsAdmin,
        meta: {
          title: '管理员管理',
          keepAlive: true
        }
      },
      {
        path: 'config',
        name: 'SettingsConfig',
        component: RoutesAlias.SettingsConfig,
        meta: {
          title: '系统配置',
          keepAlive: true,
          isHide: true
        }
      },
      {
        path: 'feedback',
        name: 'SettingsFeedback',
        component: RoutesAlias.SettingsFeedback,
        meta: {
          title: '用户反馈',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/exception',
    name: 'Exception',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.exception.title',
      icon: '&#xe820;',
      isHide: true
    },
    children: [
      {
        path: '403',
        name: '403',
        component: RoutesAlias.Exception403,
        meta: {
          title: 'menus.exception.forbidden',
          keepAlive: true,
          isFullPage: true
        }
      },
      {
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: 'menus.exception.notFound',
          keepAlive: true,
          isFullPage: true
        }
      },
      {
        path: '500',
        name: '500',
        component: RoutesAlias.Exception500,
        meta: {
          title: 'menus.exception.serverError',
          keepAlive: true,
          isFullPage: true
        }
      }
    ]
  }
]
