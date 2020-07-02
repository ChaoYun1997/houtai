import request from '@/utils/request'

const categoryApi = {
  Category: '/cat/cats',
  AddCate: '/cat/push',
  UpdateCate: '/cat/updateCat',
  CateDetial: '/cat/cat'
}

// 获取关键词列表
export function getCategory(params) {
  return request({
    url: categoryApi.Category,
    method: 'get',
    params: params
  })
}