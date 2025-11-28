import request from '@/utils/http'

/**
 * 获取系统配置
 */
export function fetchGetConfig() {
  return request.get({
    url: '/api/admin/config/get'
  })
}

/**
 * 更新系统配置
 */
export function fetchUpdateConfig(params: {
  wechatAppid?: string
  wechatSecret?: string
  wechatToken?: string
  qiniuAccessKey?: string
  qiniuSecretKey?: string
  qiniuBucket?: string
  qiniuDomain?: string
}) {
  return request.post({
    url: '/api/admin/config/update',
    params
  })
}
