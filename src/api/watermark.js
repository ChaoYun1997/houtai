import request from '@/utils/request'

const watermarkApi = {
  SaveWatermark: '/watermark/saveWatermark', // 关键词列表
  Watermark: '/watermark/watermark', // 关键词分类
  SetStatus: '/watermark/setState' // 新增关键词
}

// 保存水印
export function saveWatermark(param) {
  return request({
    url: watermarkApi.SaveWatermark,
    method: 'post',
    data: param
  })
}

// 获取水印
export function getWatermark() {
  return request({
    url: watermarkApi.Watermark,
    method: 'get'
  })
}

/**
 * 设置水印状态
 * isOpen ： Boolean
 * @param param
 * @returns {AxiosPromise}
 */
export function setWatermarkStatus(param) {
  return request({
    url: watermarkApi.SetStatus,
    method: 'get',
    params: param
  })
}
