import storage from 'store'
// import { login, getInfo, logout } from '@/api/login'
import { getUserInfo, login, logout, updatePwd } from '@/api/user'
import { getUploadSign } from '@/api/products'
import { ACCESS_TOKEN, USERNAME, USERID } from '@/store/mutation-types'
// import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    nick: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {
      uid: '',
      username: ''
    },
    uid: '',
    qiniuPic: {
      token: '',
      filename: ''
    },
    qiniuVideo: {
      token: '',
      filename: ''
    },
    website: '',
    websiteName: '',
    phone: '',
    openDate: '',
    expDate: '',
    userinfo: {}
  },

  mutations: {
    SET_USERINFO(state, userinfo) {
      state.userinfo = userinfo
    },
    SET_NICK(state, nick) {
      state.nick = nick
    },
    SET_OPENDATE(state, openDate) {
      state.openDate = openDate
    },
    SET_EXPDATE(state, expDate) {
      state.expDate = expDate
    },
    SET_WEBSITE(state, website) {
      state.website = website
    },
    SET_WEBSITE_NAME(state, name) {
      state.websiteName = name
    },
    SET_PHONE(state, phone) {
      state.phone = phone
    },
    SET_QINIUPIC: (state, qiniuPic) => {
      state.qiniuPic.token = qiniuPic.token
      state.qiniuPic.filename = qiniuPic.fileName
    },
    SET_QINIUV: (state, qiniuVideo) => {
      state.qiniuVideo.token = qiniuVideo.token
      state.qiniuVideo.filename = qiniuVideo.fileName
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info.uid = info.uid
      state.info.username = info.userName
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    }
  },

  actions: {
    // 获取七牛图片上传凭证
    GetPicUploadSign({ commit }) {
      return new Promise((resolve, reject) => {
        const param = {
          type: 1
        }
        getUploadSign(param)
          .then(res => {
            if (res.code !== 200) throw res
            commit('SET_QINIUPIC', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取七牛视频上传凭证
    GetVideoUploadSign({ commit }) {
      return new Promise((resolve, reject) => {
        const param = {
          type: 2
        }
        getUploadSign(param)
          .then(res => {
            commit('SET_QINIUV', res.data)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            if (response.code !== 200) {
              reject(response)
            }
            const result = response.data
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            storage.set(USERNAME, result.userName)
            storage.set(USERID, result.uid)
            commit('SET_TOKEN', result.token)
            commit('SET_INFO', result)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(res => {
            if (res.code !== 200) {
              reject(res)
            }
            const { data } = res
            commit('SET_USERINFO', data)
            commit('SET_NAME', data.userName)
            commit('SET_NICK', data.userNick)
            commit('SET_UID', data.id)
            commit('SET_WEBSITE', data.siteAddress)
            commit('SET_WEBSITE_NAME', data.siteName)
            commit('SET_OPENDATE', data.openDate)
            commit('SET_EXPDATE', data.expirationDate)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // Login ({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     login(userInfo).then(response => {
    //       const result = response.result
    //       storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
    //       commit('SET_TOKEN', result.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }

    // 获取用户信息
    // GetInfo({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo()
    //       .then(response => {
    //         const result = response.result
    //
    //         if (result.role && result.role.permissions.length > 0) {
    //           const role = result.role
    //           role.permissions = result.role.permissions
    //           role.permissions.map(per => {
    //             if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
    //               const action = per.actionEntitySet.map(action => {
    //                 return action.action
    //               })
    //               per.actionList = action
    //             }
    //           })
    //           role.permissionList = role.permissions.map(permission => {
    //             return permission.permissionId
    //           })
    //           commit('SET_ROLES', result.role)
    //           commit('SET_INFO', result)
    //         } else {
    //           reject(new Error('getInfo: roles must be a non-null array !'))
    //         }
    //
    //         commit('SET_NAME', { name: result.name, welcome: welcome() })
    //         commit('SET_AVATAR', result.avatar)
    //
    //         resolve(response)
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },

    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        logout(state.token)
          .then(() => {
            storage.remove(ACCESS_TOKEN)
            resolve()
          })
          .catch(() => {
            storage.remove(ACCESS_TOKEN)
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', '')
            commit('SET_INFO', {})
            commit('SET_NAME', '')
            commit('SET_UID', '')
            // commit('SET_ROLES', [])
            storage.remove(USERNAME)
            storage.remove(USERID)
          })
      })
    },

    // 修改用户密码
    UpdatePwd({ commit }, userPwd) {
      return new Promise((resolve, reject) => {
        updatePwd(userPwd)
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
