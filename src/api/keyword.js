import request from '@/utils/request'

const keywordApi = {
  keyword: '/keyword',
  updateKeyword: '/updateKeyword',
  delKeyword: '/delKeyword',
  addKeywordTo: '/addKeywordTo',
  keywordSetting: '/keywordSetting'
}

// 获取关键词列表
export function getKeyword() {
  return request({
    url: keywordApi.keyword,
    method: 'get'
  })
}

// 更新、新增关键词
export function updateKeyword(param) {
  return request({
    url: keywordApi.updateKeyword,
    method: 'post',
    data: param
  })
}

// 删除关键词
export function delKeyword(param) {
  return request({
    url: keywordApi.delKeyword,
    method: 'post',
    data: param
  })
}

// 添加关键词到产品、文章
export function addKeywordTo(param) {
  return request({
    url: keywordApi.addKeywordTo,
    method: 'post',
    data: param
  })
}

// 关键词内链规则设置
export function keywordSetting(param) {
  return request({
    url: keywordApi.keywordSetting,
    method: 'post',
    data: param
  })
}
