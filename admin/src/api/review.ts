import request from '@/utils/http'

/**
 * 获取评价列表
 */
export function fetchReviewList(params: {
  reviewId?: string
  companyName?: string
  authorName?: string
  status?: string
  rating?: number
  isBranch?: number
  auditStatus?: number
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/review/list',
    params
  })
}

/**
 * 获取评价详情
 */
export function fetchReviewDetail(id: number) {
  return request.get({
    url: `/api/admin/review/detail/${id}`
  })
}

/**
 * 编辑评价
 */
export function fetchUpdateReview(id: number, params: {
  status?: string
  department?: string
  isBranch?: boolean
  rating?: number
  content?: string
  salary?: string
  benefits?: string
  auditStatus?: number
}) {
  return request.put({
    url: `/api/admin/review/update/${id}`,
    params
  })
}

/**
 * 删除评价
 */
export function fetchDeleteReview(id: number) {
  return request.del({
    url: `/api/admin/review/delete/${id}`
  })
}

/**
 * 审核评价
 */
export function fetchAuditReview(id: number, params: {
  auditStatus: number
  rejectReason?: string
}) {
  return request.post({
    url: `/api/admin/review/audit/${id}`,
    params
  })
}
