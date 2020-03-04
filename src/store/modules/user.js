import Vue from 'vue'
import {
  login,
  getBackCompany,
  getBackMenus,
  getBrandMenus,
  getAuth,
  logOff
} from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'

const user = {
  state: {
    token: '',
    name: '',
    roles: [],
    info: {},
    auth: {},
    company: [],
    currentCompany: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_AUTH: (state, auth) => {
      state.auth = auth
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_CURRENT_COMPANY: (state, company) => {
      state.currentCompany = company
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            if (response.code !== 200) reject(response)
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token) // 设置token

            commit('SET_NAME', result.username) // 设置昵称

            let userInfo = {
              username: result.username
            }
            Vue.ls.set('USERINFO', JSON.stringify(userInfo))

            commit('SET_INFO', result) // 设置用户信息

            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取公司列表
    GetBackCompany ({ commit }, { username }) {
      return new Promise((resolve, reject) => {
        getBackCompany({
          username: username
        })
          .then(response => {
            const result = response.data
            if (result.length) {
              commit('SET_COMPANY', result)
            } else {
              notification.error({
                message: '请更换账号',
                description:
                  '该账户名下暂无相关品牌或机构，如有疑问，请联系财查到客服人员！'
              })
              reject(new Error('该账户名下暂无关品牌或机构'))
            }
            resolve(response)
          })
          .catch(({ message }) => {
            reject(new Error(message))
            notification.error({
              message: '请更换账号',
              description: message
            })
          })
      })
    },
    // 获取机构/分享菜单
    GetBackMenus ({ commit }, companyInfo) {
      return new Promise((resolve, reject) => {
        getBackMenus(companyInfo)
          .then(response => {
            const result = {}
            result.resourceItems = response.data
            if (result && result.resourceItems.length > 0) {
              const role = result
              role.permissionList = role.resourceItems.map(permission => {
                return permission.id
              })
              commit('SET_ROLES', result.resourceItems)
            } else {
              reject(new Error('该用户对此公司暂无管理权限！'))
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取品牌菜单
    GetBrandMenus ({ commit }, companyInfo) {
      return new Promise((resolve, reject) => {
        getBrandMenus(companyInfo)
          .then(response => {
            const result = {}
            result.resourceItems = response.data
            if (result && result.resourceItems.length > 0) {
              const role = result
              role.permissionList = role.resourceItems.map(permission => {
                return permission.id
              })
              commit('SET_ROLES', result.resourceItems)
            } else {
              reject(new Error('该用户对此公司暂无管理权限！'))
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    LogOff ({ commit, state }) {
      return new Promise(resolve => {
        logOff(state.token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_INFO', {})
            Vue.ls.remove(ACCESS_TOKEN)
            Vue.ls.remove('USERINFO')
            Vue.ls.remove('ROLESINFO')
          })
      })
    }
  }
}

export default user
