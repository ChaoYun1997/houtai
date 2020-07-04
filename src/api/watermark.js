import request from '@/utils/request'

const watermarkApi = {
  SaveWatermark: '/watermark/saveWatermark', // 保存水印信息
  Watermark: '/watermark/watermark', // 获取水印对象
  SetStatus: '/watermark/setState' // 设置水印开关
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
