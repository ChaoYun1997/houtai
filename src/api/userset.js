import request from '@/utils/request'

const userApi = {
  CreateSitemap: '/userset/createSiteMap',
  SubmitSitemap: '/userset/submitSitemap'
}
// 生成网站地图
export function getSitemap() {
  return request({
    url: userApi.CreateSitemap,
    method: 'get'
  })
}

// 提交网站地图刀搜索引擎
export function submitSitemap(params) {
  return request({
    url: userApi.SubmitSitemap,
    method: 'get',
    params: params
  })
}
