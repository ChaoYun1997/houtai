import request from '@/utils/request'

const configApi = {
  PageList: '/url/urls',
  UpdatePageList: '/url/updateUrl',
  AddPage: '/url/addUrl',
  DelPage: '/url/delUrl'
}

// 获取页面列表
export function getPageList(params) {
  return request({
    url: configApi.PageList,
    method: 'get',
    params: params
  })
}

// 获取页面详情
export function getPageDetails(params) {
  return request({
    url: configApi.UpdatePageList,
    method: 'get',
    params: params
  })
}

// 更新页面信息
export function updatePage(params) {
  return request({
    url: configApi.UpdatePageList,
    method: 'post',
    data: params
  })
}

// 新增页面信息
export function addPage(params) {
  return request({
    url: configApi.AddPage,
    method: 'post',
    data: params
  })
}

// 删除页面
export function delPage(params) {
  return request({
    url: configApi.DelPage,
    method: 'post',
    params: params
  })
}