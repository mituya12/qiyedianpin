import request from '@/utils/http'

/**
 * 获取回复列表
 */
export function fetchReplyList(params: {
  replyId?: number
  author?: string
  reviewId?: number
  isOfficial?: number
  auditStatus?: number
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/reply/list',
    params
  })
}

/**
 * 获取回复详情
 */
export function fetchReplyDetail(id: number) {
  return request.get({
    url: `/api/admin/reply/detail/${id}`
  })
}

/**
 * 编辑回复
 */
export function fetchUpdateReply(id: number, params: {
  content?: string
  isOfficial?: boolean
  auditStatus?: number
}) {
  return request.put({
    url: `/api/admin/reply/update/${id}`,
    params
  })
}

/**
 * 删除回复
 */
export function fetchDeleteReply(id: number) {
  return request.del({
    url: `/api/admin/reply/delete/${id}`
  })
}

/**
 * 审核回复
 */
export function fetchAuditReply(id: number, params: {
  auditStatus: number
  rejectReason?: string
}) {
  return request.post({
    url: `/api/admin/reply/audit/${id}`,
    params
  })
}
