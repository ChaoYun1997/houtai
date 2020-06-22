import request from '@/utils/request'

const productsApi = {
  list: '/products',
  addProduct: '/addProduct',
  batchAddProduct: '/batchAddProduct',
  delProduct: '/delProduct',
  updateProduct: '/updateProduct',
  sellAction: '/sellAction',
  productCategory: '/productCategory',
  setCategory: '/setCategory',
  addProductCategory: '/addProductCategory',
  delProductCategory: '/delProductCategory',
  batchCategory: '/batchCategory',
  fieldManage: '/fieldManage',
  addFieldManage: '/addFieldManage',
  delFieldManage: '/delFieldManage',
  setWatermark: '/setWatermark',
  updateWatermark: '/updateWatermark',
  unremoveProducts: '/unremoveProducts',
  removeProducts: '/removeProducts'
}

// 获取产品列表
export function getProducts(param) {
  return request({
    url: productsApi.list,
    method: 'get',
    params: param
  })
}

// 新增产品
export function addProduct(param) {
  return request({
    url: productsApi.addProduct,
    method: 'post',
    data: param
  })
}

// 批量新增产品
export function batchAddProduct(param) {
  return request({
    url: productsApi.batchAddProduct,
    method: 'post',
    data: param
  })
}

// 删除产品
export function delProduct(param) {
  return request({
    url: productsApi.delProduct,
    method: 'post',
    data: param
  })
}

// 更新产品
export function updateProduct(param) {
  return request({
    url: productsApi.updateProduct,
    method: 'post',
    data: param
  })
}

// 上下架操作
export function sellAction(param) {
  return request({
    url: productsApi.sellAction,
    method: 'post',
    data: param
  })
}

// 设置产品分类
export function setCategory(params) {
  return request({
    url: productsApi.setCategory,
    method: 'post',
    data: params
  })
}

// 获取产品分类
export function getProductCategory() {
  return request({
    url: productsApi.productCategory,
    method: 'get'
  })
}

// 添加产品分类
export function addProductCategory(param) {
  return request({
    url: productsApi.addProductCategory,
    method: 'post',
    data: param
  })
}

// 删除产品分类
export function delProductCategory(param) {
  return request({
    url: productsApi.delProductCategory,
    method: 'post',
    data: param
  })
}

// 批量编辑产品分类
export function batchEditProductCategory(param) {
  return request({
    url: productsApi.batchCategory,
    method: 'post',
    data: param
  })
}

// 获取自定义字段
export function fieldManage() {
  return request({
    url: productsApi.fieldManage,
    method: 'get'
  })
}

// 新增自定义字段
export function addFieldManage(param) {
  return request({
    url: productsApi.addFieldManage,
    method: 'post',
    data: param
  })
}

// 删除自定义字段
export function delFieldManage(param) {
  return request({
    url: productsApi.delFieldManage,
    method: 'post',
    data: param
  })
}

// 水印开关
export function setWatermark(param) {
  return request({
    url: productsApi.setWatermark,
    method: 'post',
    data: param
  })
}

// 添加水印
export function updateWatermark(param) {
  return request({
    url: productsApi.updateWatermark,
    method: 'post',
    data: param
  })
}

// 获取产品回收站
export function getProductRecycleBin() {
  return request({
    url: productsApi.updateWatermark,
    method: 'get'
  })
}

// 恢复产品
export function unremoveProducts(param) {
  return request({
    url: productsApi.unremoveProducts,
    method: 'post',
    data: param
  })
}

// 彻底删除产品
export function removeProducts(param) {
  return request({
    url: productsApi.removeProducts,
    method: 'post',
    data: param
  })
}
