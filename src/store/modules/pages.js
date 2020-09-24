const findPage = (state, page) => {
  console.log(page)
  const result = state.page.findIndex(item => {
    return item.name === page.name
  })
  return result
}
const pages = {
  state: {
    page: [
      { name: '首页', path: '/Index' },
      { name: '产品', path: '/Products' },
      { name: '新闻', path: '/News' },
      { name: '关于', path: '/About' },
      { name: '联系', path: '/Contact' }
    ]
  },
  mutations: {
    SET_PAGE(state, page) {
      const index = findPage(state, page)
      if (index !== -1) {
        state.page.splice(index, 1, page)
      } else {
        state.page.push(page)
      }
    }
  },
  actions: {
    SetPage({ commit }, page) {
      return new Promise((resolve, reject) => {})
    }
  }
}
export default pages
