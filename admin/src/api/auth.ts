import request from '@/utils/http'

/**
 * 管理员登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/admin/auth/login',
    params
  })
}

/**
 * 获取管理员信息
 * @returns 管理员信息
 */
export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfo>({
    url: '/api/admin/auth/info'
  })
}

/**
 * 退出登录
 * @returns 退出响应
 */
export function fetchLogout() {
  return request.post({
    url: '/api/admin/auth/logout'
  })
}
