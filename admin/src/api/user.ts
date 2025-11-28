import request from '@/utils/http'

/**
 * 获取用户列表
 */
export function fetchUserList(params: {
  name?: string
  userId?: number
  status?: number
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/user/list',
    params
  })
}

/**
 * 获取用户详情
 */
export function fetchUserDetail(id: number) {
  return request.get({
    url: `/api/admin/user/detail/${id}`
  })
}

/**
 * 编辑用户
 */
export function fetchUpdateUser(id: number, params: {
  name?: string
  avatar?: string
  bio?: string
  status?: number
}) {
  return request.put({
    url: `/api/admin/user/update/${id}`,
    params
  })
}

/**
 * 删除用户
 */
export function fetchDeleteUser(id: number) {
  return request.del({
    url: `/api/admin/user/delete/${id}`
  })
}
