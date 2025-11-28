import request from '@/utils/http'

/**
 * 获取管理员列表
 */
export function fetchAdminList(params: {
  username?: string
  name?: string
  role?: string
  status?: number
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/admin/list',
    params
  })
}

/**
 * 新增管理员
 */
export function fetchCreateAdmin(params: {
  username: string
  password: string
  name: string
  role: string
  status?: number
  remark?: string
}) {
  return request.post({
    url: '/api/admin/admin/create',
    params
  })
}

/**
 * 编辑管理员
 */
export function fetchUpdateAdmin(id: number, params: {
  name?: string
  password?: string
  role?: string
  status?: number
  remark?: string
}) {
  return request.put({
    url: `/api/admin/admin/update/${id}`,
    params
  })
}

/**
 * 删除管理员
 */
export function fetchDeleteAdmin(id: number) {
  return request.del({
    url: `/api/admin/admin/delete/${id}`
  })
}
