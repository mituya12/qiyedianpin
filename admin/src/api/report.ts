import request from '@/utils/http'

/**
 * 获取举报列表
 */
export function fetchReportList(params: {
  reportId?: number
  userName?: string
  contentType?: string
  reason?: string
  status?: number
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/report/list',
    params
  })
}

/**
 * 获取举报详情
 */
export function fetchReportDetail(id: number) {
  return request.get({
    url: `/api/admin/report/detail/${id}`
  })
}

/**
 * 处理举报
 */
export function fetchHandleReport(id: number, params: {
  status: number
  result?: string
}) {
  return request.post({
    url: `/api/admin/report/handle/${id}`,
    params
  })
}

/**
 * 删除举报
 */
export function fetchDeleteReport(id: number) {
  return request.del({
    url: `/api/admin/report/delete/${id}`
  })
}
