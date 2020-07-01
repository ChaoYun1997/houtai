import request from '@/utils/request'

const categoryApi = {
  category: '/category'
}

// 获取关键词列表
export function getCategory() {
  return request({
    url: categoryApi.category,
    method: 'get'
  })
}