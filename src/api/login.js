import { axios } from '@/utils/request'

const api = {
  Login: '/backend/business/login',
  GetBackCompany: '/backend/business/brand/info',
  GetBackMenus: '/backend/business/insPortal',
  GetBrandMenus: '/backend/business/authBrand',
  LogOff: '/backend/business/logOut',
  auth: '/backend/employeeLogin/answer'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
// 登录
export function login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}

// 获取菜单
export function getBackCompany (parameter) {
  return axios({
    url: api.GetBackCompany,
    method: 'get',
    params: parameter
  })
}

// 获取菜单
export function getBackMenus (parameter) {
  return axios({
    url: api.GetBackMenus,
    method: 'get',
    params: parameter
  })
}
export function getBrandMenus (parameter) {
  return axios({
    url: api.GetBrandMenus,
    method: 'get',
    params: parameter
  })
}

export function getAuth () {
  return axios({
    url: api.auth,
    method: 'get'
  })
}

// 登出
export function logOff () {
  return axios({
    url: api.LogOff,
    method: 'post'
  })
}
