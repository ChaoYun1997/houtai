import request from '@/utils/request'

const keywordApi = {
  Keyword: '/keyword/keywords', // 关键词列表
  KeywordCate: '/keyword/getNames', // 关键词分类
  AddKeyword: '/keyword/addKeys', // 新增关键词
  AppendKeywordTo: '/keyword/appendKey', // 添加关键词到对象
  UpdateKeyword: '/keyword/updateKey', // 更新关键词
  DelKeyword: '/keyword/delKeyword' // 删除关键词 TODO
}

// 获取关键词列表
export function getKeyword(param) {
  return request({
    url: keywordApi.Keyword,
    method: 'post',
    params: param
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
    params: param
  })
}

/** 添加关键词到对象 TODO
 * id： 关键词ID
 * targerList： 对象id数组
 * type： 1 产品 2文章 3分类
 * @param param
 * @returns {AxiosPromise}
 */
export function appendKeywordTo(param) {
  return request({
    url: keywordApi.AppendKeywordTo,
    method: 'post',
    data: param
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
    method: 'get',
    params: param
  })
}