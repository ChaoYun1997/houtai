import KindEditor from '../components/KindEditor'
const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('k-editor', KindEditor)
}

export default install