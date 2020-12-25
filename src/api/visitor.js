import request from '@/utils/request'

const visitorApi = {
  Visitors: '/visitor/visitors',
  EnquiryByDay: '/visitor/enquirysForDay',
  EnquiryByWeek: '/visitor/enquirys'
}
// 获取访客数据
export function getVisitorData(params) {
  return request({
    url: visitorApi.Visitors,
    method: 'post',
    data: params
  })
}

// 按日获取询单数据
export function getEnquiryDataByDay(params) {
  return request({
    url: visitorApi.EnquiryByDay,
    method: 'post',
    data: params
  })
}

// 按周获取询单数据
export function getEnquiryDataByWeek(params) {
  return request({
    url: visitorApi.EnquiryByWeek,
    method: 'post',
    data: params
  })
}