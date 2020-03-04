import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta &&
    (typeof to.meta.title !== 'undefined' &&
      setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    if (to.path === '/user/login') {
      next({ path: '/brandselect' })
      NProgress.done()
    } else if (to.path === '/brandselect') {
      if (!store.getters.company.length) {
        const username = JSON.parse(Vue.ls.get('USERINFO')).username || ''
        store
          .dispatch('GetBackCompany', {
            username
          })
          .then(() => {
            next({ path: to.path })
          })
      } else {
        next()
      }
    } else {
      const rolesInfo = JSON.parse(Vue.ls.get('ROLESINFO'))
      if (rolesInfo.userId) {
        store.commit('SET_CURRENT_COMPANY', { ...rolesInfo })
      }

      const currentCompany = store.getters.currentCompany

      if (store.getters.roles.length === 0) {
        let dispatchName =
          currentCompany.bizType === '品牌' ? 'GetBrandMenus' : 'GetBackMenus'
        store
          .dispatch(dispatchName, currentCompany)
          .then(res => {
            const roles = res.data
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表,动态添加
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(
                from.query.redirect || to.path
              )

              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('LogOff').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // 跳转到品牌页而不是注销时页面
      next({ path: '/user/login', query: { redirect: '/brandselect' } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
