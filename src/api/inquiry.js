import request from '@/utils/request'

const inquiryApi = {
  inquiry: '/inquiry',
  detail: '/inquiryDetail',
  delInquiry: '/delInquiry',
  inquiryRule: '/inquiryRule',
  recycleBin: '/inquiryRecycleBin',
  removeInquiry: '/removeInquiry',
  unremoveInquiry: '/unremoveInquiry'
}

// 获取询盘列表
export function inquiry(param) {
  return request({
    url: inquiryApi.inquiry,
    method: 'post',
    data: param
  })
}

// 获取询盘详情
export function inquiryDetail(param) {
  return request({
    url: inquiryApi.detail,
    method: 'post',
    data: param
  })
}

// 删除询盘
export function delInquiry(param) {
  return request({
    url: inquiryApi.delInquiry,
    method: 'post',
    data: param
  })
}

// 设置询盘规则
export function inquiryRule(param) {
  return request({
    url: inquiryApi.inquiryRule,
    method: 'post',
    data: param
  })
}

// 获取询盘回收站
export function getInquiryRecycleBin(param) {
  return request({
    url: inquiryApi.recycleBin,
    method: 'post',
    data: param
  })
}

// 彻底删除询盘
export function removeinquiry(param) {
  return request({
    url: inquiryApi.removeInquiry,
    method: 'post',
    data: param
  })
}

// 恢复已删除询盘
export function unremoveinquiry(param) {
  return request({
    url: inquiryApi.unremoveinquiry,
    method: 'post',
    data: param
  })
}
