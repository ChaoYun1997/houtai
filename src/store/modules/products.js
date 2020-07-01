import storage from 'store'

import { PRODUCT_DETAILS, PRODUCTS } from '@/store/mutation-types'

const products = {
  state: {
    details: {},
    products: []
  },
  mutations: {
    SET_DETAILS: (state, details) => {
      state.details = details
    },
    SET_PRODUCTS: (state, products) => {
      state.products = products
    }
  },
  actions: {
    // 保存产品
    SaveProducts({ commit }, produts) {
      return new Promise(resolve => {
        commit('SET_PRODUCTS', products)
        storage.set(PRODUCTS, produts)
        resolve()
      })
    },
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
