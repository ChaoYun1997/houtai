import request from '@/utils/request'

const enquiryApi = {
  GetEnquiryCode: '/enquiry/getCode', // 获取询单发布验证码
  AddEnquiry: '/enquiry/push', // 发布询单
  Enquiries: '/enquiry/enquirys', // 询单列表
  Detail: '/enquiry/enquiry', // 询单详情
  DelEnquiry: '/enquiry/delEnquiry', // 删除询单
  DelEnquirys: '/enquiry/delEnquirys', // 批量删除询单
  SetRead: '/enquiry/setRead', // 设置已读状态
  Restore: '/enquiry/restore', // 恢复询单
  RestoreEnquirys: '/enquiry/restore', // 批量恢复询单
  AddEnquiryLog: '/enquirylog/push', // 新增询单日志
  GetEnquiryLog: '/enquirylog/getList' // 获取询单日志
}

// 新增询单日志
export function addEnquiryLog(param) {
  return request({
    url: enquiryApi.AddEnquiryLog,
    method: 'post',
    data: param
  })
}

// 获取询单日志
export function getEnquiryLog(param) {
  return request({
    url: enquiryApi.GetEnquiryLog,
    method: 'get',
    params: param
  })
}

// 获取询盘列表
export function getEnquiry(param) {
  return request({
    url: enquiryApi.Enquiries,
    method: 'post',
    data: param
  })
}

// 获取已删除询盘列表
export function getEnquiryRecycleBin(param) {
  return request({
    url: enquiryApi.Enquiries,
    method: 'post',
    data: {
      contactRegion: param.contactRegion,
      state: param.state,
      isDel: true,
      enquirySource: param.enquirySource,
      equipment: param.equipment,
      startDate: param.startDate,
      endDate: param.endDate,
      pageIndex: param.pageIndex,
      pageSize: param.pageSize
    }
  })
}

// 获取询盘详情
export function enquiryDetail(param) {
  return request({
    url: enquiryApi.Detail,
    method: 'get',
    params: param
  })
}

// 批量彻底删除询盘 id=1&isRemove=false  Remove true彻底删除 false回收站？
export function removeEnquirys(param) {
  return request({
    url: enquiryApi.DelEnquirys,
    method: 'post',
    params: {
      isRemove: true
    },
    data: param
  })
}
// 批量删除询盘 id=1&isRemove=false  Remove true彻底删除 false回收站？
export function delEnquirys(param) {
  return request({
    url: enquiryApi.DelEnquirys,
    method: 'post',
    params: {
      isRemove: false
    },
    data: param
  })
}
// 删除询盘 id=1&isRemove=false  Remove true彻底删除 false回收站？
export function delEnquiry(param) {
  return request({
    url: enquiryApi.DelEnquiry,
    method: 'post',
    params: {
      id: param.id,
      isRemove: false
    }
  })
}
// 彻底删除询盘 id=1&isRemove=false  Remove true彻底删除 false回收站？
export function removeEnquiry(param) {
  return request({
    url: enquiryApi.DelEnquiry,
    method: 'post',
    params: {
      id: param.id,
      isRemove: true
    }
  })
}

// 获取询单发布验证码
export function getEnquiryCode() {
  return request({
    url: enquiryApi.GetEnquiryCode,
    method: 'get'
  })
}

// 发布询单
export function addEnquiry(param) {
  return request({
    url: enquiryApi.AddEnquiry,
    method: 'post',
    data: param
  })
}

/** 设置已读状态
 * parameter: {
 *     id: 1
 *     isRead: boolean
 * }
 * @param parameter
 * @returns {*}
 */
export function setEnquiryIsReaded(param) {
  return request({
    url: enquiryApi.SetRead,
    method: 'post',
    params: param
  })
}

// 恢复询单 id
export function restoreEnquiry(param) {
  return request({
    url: enquiryApi.Restore,
    method: 'post',
    params: param
  })
}

// 批量恢复询单 id
export function restoreEnquirys(param) {
  return request({
    url: enquiryApi.RestoreEnquirys,
    method: 'post',
    params: param
  })
}