import request from '@/utils/http'

/**
 * 获取数据概览
 */
export function fetchStatisticsOverview() {
  return request.get({
    url: '/api/admin/statistics/overview'
  })
}

/**
 * 获取用户注册趋势
 */
export function fetchUserTrend(params?: {
  days?: number
}) {
  return request.get({
    url: '/api/admin/statistics/user-trend',
    params
  })
}

/**
 * 获取评价发布趋势
 */
export function fetchReviewTrend(params?: {
  days?: number
}) {
  return request.get({
    url: '/api/admin/statistics/review-trend',
    params
  })
}

/**
 * 获取评分分布
 */
export function fetchRatingDistribution() {
  return request.get({
    url: '/api/admin/statistics/rating-distribution'
  })
}

/**
 * 获取企业统计列表
 */
export function fetchCompanyStatisticsList(params: {
  companyName?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return request.get({
    url: '/api/admin/statistics/company-list',
    params
  })
}
