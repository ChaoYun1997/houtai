import storage from 'store'

import { PRODUCT_DETAILS } from '@/store/mutation-types'

const products = {
  state: {
    details: {}
  },
  mutations: {
    SET_DETAILS: (state, details) => {
      state.details = details
    }
  },
  actions: {
    // 保存产品详情信息
    SaveDetails({ commit }, details) {
      return new Promise(resolve => {
        commit('SET_DETAILS', details)
        storage.set(PRODUCT_DETAILS, details)
        resolve()
      })
    },
    // 清楚产品详情信息
    ClearDetails({ commit }) {
      return new Promise(resolve => {
        commit('SET_DETAILS', {})
        storage.set(PRODUCT_DETAILS, {})
        resolve()
      })
    }
  }
}

export default products
