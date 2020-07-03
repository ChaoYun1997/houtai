import request from '@/utils/request'

const categoryApi = {
  Category: '/cat/cats', // 获取文章或产品分类列表
  AddCate: '/cat/push', // 新增文章或产品分类
  UpdateCate: '/cat/updateCat', // 更新分类信息
  CateDetial: '/cat/cat', // 获取分类详情
  DelCate: '/cat/delCat', // 删除分类
  UpdateSort: '/cat/updateSort', // 更新分类排序
  UpdatePage: '/cat/updatePage' // 更新分类指向页面
}

/**
 * 获取关键词列表
 * parameter: {
 *     pageIndex: 1
 *     pageSize: 10
 *     type: 1  0产品 1文章
 * }
 * @param parameter
 * @returns {*}
 */
// 产品分类列表
export function getProductCate(params) {
  return request({
    url: categoryApi.Category,
    method: 'get',
    params: {
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      type: 0
    }
  })
}
// 文章分类列表
export function getArticleCate(params) {
  return request({
    url: categoryApi.Category,
    method: 'get',
    params: {
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      type: 1
    }
  })
}

/**
 * 新增分类
 * parameter: {
 *     "id": 0,
      "catName": "string",
      "catKeyWords": [
        "string"
      ],
      "seoKeyWord": "string",
      "seoTitle": "string",
      "seoDescription": "string",
      "catUrl": "string",
      "catPid": 0,
      "catImgList": [
        "string"
      ],
      "catDescription": "string",
      "catWebUrl": "string",
      "catDescUrl": "string",
      "catType": 0
 * }
 * @param parameter
 * @returns {*}
 */
export function addCate(params) {
  return request({
    url: categoryApi.AddCate,
    method: 'post',
    data: params
  })
}

/**
 * 更新分类
 * parameter: {
 *   "id": 0,
     "catName": "string",
     "catKeyWords": [
     "string"
     ],
     "seoKeyWord": "string",
     "seoTitle": "string",
     "seoDescription": "string",
     "catUrl": "string",
     "catPid": 0,
     "catImgList": [
     "string"
     ],
     "catDescription": "string",
     "catWebUrl": "string",
     "catDescUrl": "string",
     "catType": 0
 * }
 * @param parameter
 * @returns {*}
 */
export function updateCate(params) {
  return request({
    url: categoryApi.UpdateCate,
    method: 'post',
    data: params
  })
}

/**
 * 获取分类详情
 * parameter: {
 *     id: integer
 * }
 * @param parameter
 * @returns {*}
 */
export function getCateDetail(params) {
  return request({
    url: categoryApi.CateDetial,
    method: 'get',
    params: params
  })
}

/**
 * 删除分类
 * parameter: {
 *     id: integer
 * }
 * @param parameter
 * @returns {*}
 */
export function delCate(params) {
  return request({
    url: categoryApi.DelCate,
    method: 'get',
    params: params
  })
}

/**
 * 更新分类排序
 * parameter: [
 *   {
 *     "id": 0,
 *     "sort": 0
 *   }
 * ]
 * @param parameter
 * @returns {*}
 */
export function updateCateSort(params) {
  return request({
    url: categoryApi.UpdateSort,
    method: 'post',
    data: params
  })
}

/**
 * 更新分类指向页面信息
 * parameter: {
 * "catList": [
 *   0
 * ],
 *   "catWebUrl": "string",
 *   "catDescUrl": "string"
 * }
 * @param parameter
 * @returns {*}
 */
export function updateCatePage(params) {
  return request({
    url: categoryApi.UpdatePage,
    method: 'post',
    data: params
  })
}