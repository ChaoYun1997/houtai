import request from '@/utils/request'

const keywordApi = {
  Keyword: '/keyword/keywords', // 关键词列表
  KeywordCate: '/keyword/getNames', // 关键词分类
  AddKeyword: '/keyword/addKeys', // 新增关键词
  AppendKeywordTo: '/keyword/appendKey', // 添加关键词到对象
  UpdateKeyword: '/keyword/updateKey', // 更新关键词
  DelKeyword: '/keyword/delKey' // 删除关键词 TODO
}

// 获取关键词列表
export function getKeyword(param) {
  return request({
    url: keywordApi.Keyword,
    method: 'post',
    data: param
  })
}

// 关键词分类
export function getKeywordCate(param) {
  return request({
    url: keywordApi.KeywordCate,
    method: 'get',
    params: param
  })
}

// 新增关键词
export function addKeywords(param) {
  return request({
    url: keywordApi.AddKeyword,
    method: 'post',
    data: param
  })
}

/**
 * 添加关键词到对象
 * @param param
 * id： 关键词ID
 * type： 1 产品 2文章 3分类
 * @param data 对象id数组
 * @returns {AxiosPromise}
 */
export function appendKeywordTo(param, data) {
  return request({
    url: keywordApi.AppendKeywordTo,
    method: 'post',
    params: param,
    data: data
  })
}

// 更新关键词
export function updateKeyword(param) {
  return request({
    url: keywordApi.UpdateKeyword,
    method: 'post',
    params: param
  })
}

// 删除关键词
export function delKeyword(param) {
  return request({
    url: keywordApi.DelKeyword,
    method: 'post',
    params: param
  })
}