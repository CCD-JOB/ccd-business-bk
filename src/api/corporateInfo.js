import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  info: '/backend/business/info',
  deleteFile: '/backend/upload/deleteFile',
  auth: '/backend/business/auth',
  validateShared: '/backend/business/validateShared'
}

export function info (parameter) {
  return axios({
    url: api.info,
    method: 'get',
    params: parameter
  })
}

export function auth (parameter) {
  return axios({
    url: api.auth,
    method: 'get',
    params: parameter
  })
}

export function submit (parameter) {
  return axios({
    url: api.auth,
    method: 'post',
    data: parameter
  })
}

export function deleteFile (parameter) {
  return axios({
    url: api.deleteFile,
    method: 'post',
    params: parameter
  })
}

export function validateShared (parameter) {
  return axios({
    url: api.validateShared,
    method: 'get',
    params: parameter
  })
}

export const uploadUrl = !isDev
  ? 'https://testbiz.aifound.cn/backend/upload/uploadFile'
  : 'https://biz.aifound.cn/backend/upload/uploadFile'

export const uploadUrlS = !isDev
  ? 'https://testbiz.aifound.cn/backend/upload/uploadCompanyLogo'
  : 'https://biz.aifound.cn/backend/upload/uploadCompanyLogo'
