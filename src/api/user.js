import request from '@/utils/request'

const userApi = {
  Login: '/user/login',
  Logout: '/user/out',
  GetCode: '/user/getCode',
  LoginStatus: '/user/check',
  Updatepwd: '/user/updatepwd',
  UserInfo: '/user/info',
  UpdateWebsite: '/user/updateWeb'
}

// 登陆
export function login(params) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: params
  })
}

// 退出
export function logout() {
  return request({
    url: userApi.Logout,
    method: 'get'
  })
}

// 修改密码
export function updatePwd(params) {
  return request({
    url: userApi.Updatepwd,
    method: 'post',
    data: params
  })
}

// 获取图片验证码
export function getCode() {
  return request({
    url: userApi.GetCode,
    method: 'get'
  })
}

// 检查用户登陆状态
export function loginStatus() {
  return request({
    url: userApi.LoginStatus,
    method: 'get'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: userApi.UserInfo,
    method: 'get'
  })
}

export function updateWebsite(param) {
return request({
  url: userApi.UpdateWebsite,
  method: 'post',
  data: param
})
}