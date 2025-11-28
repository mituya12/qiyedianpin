import request from '@/utils/http'

// 企业管理相关接口
export function fetchEnterpriseList(params: any) {
  return request.get({
    url: '/api/enterprise/list',
    params
  })
}

export function addEnterprise(data: any) {
  return request.post({
    url: '/api/enterprise/add',
    data
  })
}

export function updateEnterprise(data: any) {
  return request.put({
    url: '/api/enterprise/update',
    data
  })
}

export function deleteEnterprise(id: number) {
  return request.del({
    url: `/api/enterprise/delete/${id}`
  })
}

// 评价管理相关接口
export function fetchReviewList(params: any) {
  return request.get({
    url: '/api/review/list',
    params
  })
}

export function addReview(data: any) {
  return request.post({
    url: '/api/review/add',
    data
  })
}

export function updateReview(data: any) {
  return request.put({
    url: '/api/review/update',
    data
  })
}

export function deleteReview(id: number) {
  return request.del({
    url: `/api/review/delete/${id}`
  })
}

// 回复管理相关接口
export function fetchReplyList(params: any) {
  return request.get({
    url: '/api/reply/list',
    params
  })
}

export function addReply(data: any) {
  return request.post({
    url: '/api/reply/add',
    data
  })
}

export function updateReply(data: any) {
  return request.put({
    url: '/api/reply/update',
    data
  })
}

export function deleteReply(id: number) {
  return request.del({
    url: `/api/reply/delete/${id}`
  })
}

// 举报管理相关接口
export function fetchReportList(params: any) {
  return request.get({
    url: '/api/report/list',
    params
  })
}

export function handleReport(data: any) {
  return request.put({
    url: '/api/report/handle',
    data
  })
}

export function deleteReport(id: number) {
  return request.del({
    url: `/api/report/delete/${id}`
  })
}

// 统计分析相关接口
export function fetchStatisticsOverview() {
  return request.get({
    url: '/api/statistics/overview'
  })
}

export function fetchEnterpriseStatistics(params: any) {
  return request.get({
    url: '/api/statistics/enterprise',
    params
  })
}

// 管理员管理相关接口
export function fetchAdminList(params: any) {
  return request.get({
    url: '/api/admin/list',
    params
  })
}

export function addAdmin(data: any) {
  return request.post({
    url: '/api/admin/add',
    data
  })
}

export function updateAdmin(data: any) {
  return request.put({
    url: '/api/admin/update',
    data
  })
}

export function deleteAdmin(id: number) {
  return request.del({
    url: `/api/admin/delete/${id}`
  })
}

// 系统配置相关接口
export function fetchSystemConfig() {
  return request.get({
    url: '/api/config/get'
  })
}

export function updateSystemConfig(data: any) {
  return request.put({
    url: '/api/config/update',
    data
  })
}
