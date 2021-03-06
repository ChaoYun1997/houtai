const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  details: state => state.products.details,
  page: state => state.pages.page,
  picToken: state => state.user.qiniuPic.token,
  videoToken: state => state.user.qiniuVideo.token,
  website: state => state.user.website,
  websiteName: state => state.user.websiteName,
  phone: state => state.user.phone,
  openDate: state => state.user.openDate,
  expDate: state => state.user.expDate,
  nick: state => state.user.nick,
  userinfo: state => state.user.userinfo
}

export default getters
