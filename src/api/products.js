import request from '@/utils/request'

const productsApi = {
  List: '/shop/shops', // 产品列表
  AddProduct: '/shop/push', // 发布产品
  AppendToCate: '/shop/AppendToCat', // 添加到分类
  AppendToCates: '/shop/AppendToCats', // 批量添加到分类
  UpdateProduct: '/shop/updateShop', // 更新产品
  Detail: '/shop/shop', // 产品详情
  UpdateProperty: '/shop/updateProp', // 更新产品字段
  GetSortProducts: '/shop/sortShops', // 获取排序产品列表
  UpdateSort: '/shop/updateSort', // 更新产品排序
  RecoverSort: '/shop/setDefaultSort', // 恢复默认产品排序
  DelProduct: '/shop/delShop', // 彻底删除产品
  DelProducts: '/shop/delShops', // 批量彻底删除产品
  UpdateCate: '/shop/updateCatid', // 更新分类、移动分类
  GetUploadSign: '/shop/getUploadSign', // 获取七牛上传凭证
  GetProductCate: '/shop/getNames', // 获取产品分类列表
  ImportProducts: '/shop/ImportShops', // 批量导入产品
  RelativeArticles: '/shop/getSomeArticlesById', // 根据产品iD获取相关文章
  RelativeProducts: '/shop/getSomeShopsById' // 根据产品iD获取相关产品

}
// 根据产品iD获取相关产品
export function getRelativeProducts(param) {
  return request({
    url: productsApi.RelativeProducts,
    method: 'get',
    params: param
  })
}
// 根据产品iD获取相关文章
export function getRelativeArticles(param) {
  return request({
    url: productsApi.RelativeArticles,
    method: 'get',
    params: param
  })
}

// 获取产品列表
export function getProducts(param) {
  return request({
    url: productsApi.List,
    method: 'post',
    data: param
  })
}

// 获取回收站产品列表
export function getRecycleBin(param) {
  return request({
    url: productsApi.List,
    method: 'post',
    data: {
      pageIndex: param.pageIndex,
      pageSize: param.pageSize,
      catId: param.catId,
      isShelve: param.isShelve,
      updateDate: param.updateDate,
      keyWords: param.keyWords,
      isDel: true
    }
  })
}

// 新增产品
export function addProduct(param) {
  return request({
    url: productsApi.AddProduct,
    method: 'post',
    data: param
  })
}

// 添加到分类
export function appendToCate(param) {
  return request({
    url: productsApi.AppendToCate,
    method: 'post',
    params: param
  })
}

// 批量添加到分类
export function appendToCates(param) {
  return request({
    url: productsApi.AppendToCates,
    method: 'post',
    data: param
  })
}

// 更新产品
export function updateProduct(param) {
  return request({
    url: productsApi.UpdateProduct,
    method: 'post',
    data: param
  })
}

// 产品详情
export function getProductDetail(param) {
  return request({
    url: productsApi.Detail,
    method: 'get',
    params: param
  })
}

// 更新产品字段,IsHot:是否热销,IsNew:是否最新,IsDel:是否放入回收站,IsShelve:是否上架,ItemCatId:类目ID,IsRecommend:是否推荐
export function updateProp(param, id) {
  return request({
    url: productsApi.UpdateProperty,
    method: 'post',
    params: param,
    data: id
  })
}

// 获取产品排序
export function getSortProducts(param) {
  return request({
    url: productsApi.GetSortProducts,
    method: 'post',
    data: param
  })
}

// 更新产品排序
export function updateSort(param) {
  return request({
    url: productsApi.UpdateSort,
    method: 'post',
    data: param
  })
}

// 默认产品排序
export function recoverSort(param) {
  return request({
    url: productsApi.RecoverSort,
    method: 'get'
  })
}

/** 删除产品 IsDel:是否放入回收站
 * propName: IsDel
 * value: true
 * Data:[
 * id
 * ]
 * */
export function delProduct(param) {
  return request({
    url: productsApi.UpdateProperty,
    method: 'post',
    params: {
      propName: 'IsDel',
      value: true
    },
    data: param
  })
}

// 恢复产品
export function restoreProduct(param) {
  return request({
    url: productsApi.UpdateProperty,
    method: 'post',
    params: {
      propName: 'IsDel',
      value: false
    },
    data: param
  })
}

// 彻底删除产品
export function removeProduct(param) {
  return request({
    url: productsApi.DelProduct,
    method: 'get',
    params: param
  })
}

// 更新、移动分类
export function updateCate(param) {
  return request({
    url: productsApi.UpdateCate,
    method: 'post',
    data: param
  })
}

// 获取七牛上传凭证
export function getUploadSign(param) {
  return request({
    url: productsApi.GetUploadSign,
    method: 'get',
    params: param
  })
}

// 批量删除产品
export function removeProducts(param) {
  return request({
    url: productsApi.DelProducts,
    method: 'post',
    data: param
  })
}

// 获取产品分类
// export function getProductCategory(param) {
//   return request({
//     url: productsApi.GetProductCate,
//     method: 'get',
//     params: param
//   })
// }

// 批量导入产品
export function importProducts(params) {
  return request({
    url: productsApi.ImportProducts,
    method: 'post',
    data: params
  })
}
