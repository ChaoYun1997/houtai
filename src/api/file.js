import request from '@/utils/request'

const fileApi = {
  Add: '/file/push',
  Del: '/file/deleteFile',
  List: '/file/list',
  Move: '/file/moveFile',
  UpdateName: '/file/updateFileName',
  SetDel: '/file/updateIsDelete'
}

const fileGroupApi = {
  Add: '/fileGroup/push',
  Update: '/fileGroup/updateGroup',
  List: '/fileGroup/list',
  Del: '/fileGroup/delGroup'
}

// 新增文件分组
export function addFileGroup(param) {
  return request({
    url: fileGroupApi.Add,
    method: 'post',
    params: param
  })
}
// 更新分组
export function updateFileGroup(param) {
  return request({
    url: fileGroupApi.Update,
    method: 'post',
    data: param
  })
}
// 获取分组列表
export function getFileGroupList(param) {
  return request({
    url: fileGroupApi.List,
    method: 'post',
    data: param
  })
}
// 删除分组
export function delFileGroup(param) {
  return request({
    url: fileGroupApi.Del,
    method: 'post',
    data: param
  })
}

// 新增文件
export function addFile(param) {
  return request({
    url: fileApi.Add,
    method: 'post',
    data: param
  })
}

// 永久移除文件
export function removeFile(params) {
  return request({
    url: fileApi.Del,
    method: 'post',
    data: params
  })
}

// 获取文件列表
export function getFileList(params) {
  return request({
    url: fileApi.List,
    method: 'post',
    data: params
  })
}

// 移动文件
export function moveFile(query, params) {
  return request({
    url: fileApi.Move,
    method: 'post',
    params: query,
    data: params
  })
}

// 更新文件名称
export function updateFileName(params) {
  return request({
    url: fileApi.UpdateName,
    method: 'post',
    params: params
  })
}

// 移到回收站
export function updateDelState(query, params) {
  return request({
    url: fileApi.SetDel,
    method: 'post',
    params: query,
    data: params
  })
}
