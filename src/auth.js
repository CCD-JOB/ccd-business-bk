import Vue from 'vue'
import store from './store'

/** 权限指令**/
const directive = Vue.directive('auth', {
  inserted: function (el, binding, vnode) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false
  let authList = store.getters.auth
  if (authList) {
    let duty = authList.filter(item => item.dutyName === value)
    if (duty.length) return !duty[0].duty // 0:有权限 1：无权限
  }
  return isExist
}
export { directive }
