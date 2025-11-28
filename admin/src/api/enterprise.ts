import request from '@/utils/http'

/**
 * 获取企业列表
 */
export function fetchEnterpriseList(params: {
  name?: string
  alias?: string
  auditStatus?: number
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/company/list',
    params
  })
}

/**
 * 获取企业详情
 */
export function fetchEnterpriseDetail(id: number) {
  return request.get({
    url: `/api/admin/company/detail/${id}`
  })
}

/**
 * 新增企业
 */
export function fetchCreateEnterprise(params: {
  name: string
  alias?: string
}) {
  return request.post({
    url: '/api/admin/company/create',
    params
  })
}

/**
 * 编辑企业
 */
export function fetchUpdateEnterprise(id: number, params: {
  name?: string
  alias?: string
}) {
  return request.put({
    url: `/api/admin/company/update/${id}`,
    params
  })
}

/**
 * 删除企业
 */
export function fetchDeleteEnterprise(id: number) {
  return request.del({
    url: `/api/admin/company/delete/${id}`
  })
}
