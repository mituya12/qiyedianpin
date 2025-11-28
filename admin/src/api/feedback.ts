import request from '@/utils/http'

/**
 * 获取反馈列表
 */
export function fetchFeedbackList(params: {
  feedbackId?: number
  userName?: string
  category?: string
  status?: number
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/feedback/list',
    params
  })
}

/**
 * 获取反馈详情
 */
export function fetchFeedbackDetail(id: number) {
  return request.get({
    url: `/api/admin/feedback/detail/${id}`
  })
}

/**
 * 处理反馈(回复)
 */
export function fetchHandleFeedback(id: number, params: {
  reply: string
  status?: number
}) {
  return request.post({
    url: `/api/admin/feedback/handle/${id}`,
    params
  })
}

/**
 * 更新反馈状态
 */
export function fetchUpdateFeedbackStatus(id: number, params: {
  status: number
}) {
  return request.put({
    url: `/api/admin/feedback/status/${id}`,
    params
  })
}

/**
 * 删除反馈
 */
export function fetchDeleteFeedback(id: number) {
  return request.del({
    url: `/api/admin/feedback/delete/${id}`
  })
}
