import request from '@/utils/request'

const articlesApi = {
  articles: '/articles',
  addArticle: '/addArticle',
  delArticle: '/delArticle',
  updateArticleCategory: '/updateCategory',
  articleCategory: '/articleCategory',
  addArticleCategory: '/addArticleCategory',
  delArticleCategory: '/delArticleCategory'
}

// 获取文章列表
export function getArticles(param) {
  return request({
    url: articlesApi.articles,
    method: 'post',
    data: param
  })
}

// 新增文章
export function addArticle(param) {
  return request({
    url: articlesApi.addArticle,
    method: 'post',
    data: param
  })
}

// 删除文章
export function delArticle(param) {
  return request({
    url: articlesApi.delArticle,
    method: 'post',
    data: param
  })
}

// 修改文章的类型
export function updateArticleCategory(param) {
  return request({
    url: articlesApi.updateArticleCategory,
    method: 'post',
    data: param
  })
}

// 获取文章类型列表
export function articleCategory(param) {
  return request({
    url: articlesApi.articleCategory,
    method: 'post',
    data: param
  })
}

// 新增文章类型
export function addArticleCategory(param) {
  return request({
    url: articlesApi.addArticleCategory,
    method: 'post',
    data: param
  })
}

// 删除文章类型
export function delArticleCategory(param) {
  return request({
    url: articlesApi.delArticleCategory,
    method: 'post',
    data: param
  })
}

