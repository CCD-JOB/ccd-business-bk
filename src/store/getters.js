const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.name,
  company: state => state.user.company,
  currentCompany: state => state.user.currentCompany,
  roles: state => state.user.roles,
  auth: state => state.user.auth,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab
}

export default getters
