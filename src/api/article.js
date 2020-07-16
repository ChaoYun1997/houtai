import request from '@/utils/request'

const articlesApi = {
  Articles: '/article/articles', // 获取所有文章
  AddArticle: '/article/push', // 发布文章
  UpdateArticle: '/article/updateArticle', // 更新文章
  ArticleDetail: '/article/article', // 文章详情
  GetArticleCate: '/article/getNames', // 获取文章分类列表
  UpdateArticleCategory: '/article/updateCatid', // 更新、移动文章分类
  DelArticle: '/article/delArticle' // 彻底删除文章
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
