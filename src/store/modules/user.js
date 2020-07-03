import storage from 'store'
// import { login, getInfo, logout } from '@/api/login'
import { login, logout, updatePwd } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    uid: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    }
  },

  actions: {
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
            commit('SET_TOKEN', result.token)
            commit('SET_INFO', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.log(state.name)
        if (!state.name) {
          commit('SET_NAME', { name: state.info.userName, welcome: welcome() })
          commit('SET_UID', state.info.uid)
          resolve()
        } else {
          reject(new Error('fail'))
        }
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
    //         console.log(response)
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
            resolve()
          })
          .catch(() => {
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', '')
            commit('SET_INFO', {})
            commit('SET_NAME', '')
            commit('SET_UID', '')
            // commit('SET_ROLES', [])
            storage.remove(ACCESS_TOKEN)
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
