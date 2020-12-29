import request from '@/utils/request'

const articlesApi = {
  Articles: '/article/articles', // 获取所有文章
  AddArticle: '/article/push', // 发布文章
  UpdateArticle: '/article/updateArticle', // 更新文章
  ArticleDetail: '/article/article', // 文章详情
  GetArticleCate: '/article/getNames', // 获取文章分类列表
  UpdateArticleCategory: '/article/updateCatid', // 更新、移动文章分类
  DelArticle: '/article/delArticle', // 彻底删除文章
  DelArticles: '/article/delArticles', // 彻底删除文章
  UpdateSort: '/article/updateSort', // 更新文章排序
  RelativeProducts: '/article/articleItems', // 根据id获取相关联产品
  UpdateDel: '/article/updateIsDelete' // 移入/恢复回收站
}

// 移入/恢复回收站
export function updateDel(state, param) {
  return request({
    url: articlesApi.UpdateDel,
    method: 'post',
    params: {
      isDelete: state
    },
    data: param
  })
}

// 获取回收站列表
export function getRecycleBin(param) {
  return request({
    url: articlesApi.Articles,
    method: 'post',
    data: {
      pageIndex: param.pageIndex,
      pageSize: param.pageSize,
      catId: param.catId,
      isShelve: param.isShelve,
      updateDate: param.updateDate,
      keyWords: param.keyWords,
      status: param.status,
      isDel: true
    }
  })
}

// 根据id获取相关联产品
export function getRelativeProductsByAid(params) {
  return request({
    url: articlesApi.RelativeProducts,
    method: 'get',
    params: params
  })
}

// 更新文章排序
export function updateArticleSort(params) {
  return request({
    url: articlesApi.UpdateSort,
    method: 'post',
    data: params
  })
}

// 获取文章列表
export function getArticles(param) {
  return request({
    url: articlesApi.Articles,
    method: 'post',
    data: param
  })
}

// 新增文章
export function addArticle(param) {
  return request({
    url: articlesApi.AddArticle,
    method: 'post',
    data: param
  })
}

// 更新文章
export function updateArticle(param) {
  return request({
    url: articlesApi.UpdateArticle,
    method: 'post',
    data: param
  })
}

// 彻底删除文章
export function delArticle(param) {
  return request({
    url: articlesApi.DelArticle,
    method: 'get',
    params: param
  })
}

// 批量彻底删除文章
export function delArticles(param) {
  return request({
    url: articlesApi.DelArticles,
    method: 'post',
    data: param
  })
}

// 获取文章详情
export function getArticleDetail(param) {
  return request({
    url: articlesApi.ArticleDetail,
    method: 'get',
    params: param
  })
}

// 获取文章分类
export function articleCategory(param) {
  return request({
    url: articlesApi.GetArticleCate,
    method: 'get',
    params: param
  })
}

// 更新、移动文章分类
export function updateArticleCate(param) {
  return request({
    url: articlesApi.UpdateArticleCategory,
    method: 'post',
    params: param
  })
}
