import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  getBussiness: '/backend/brand/getBussiness',
  brandShow: '/backend/business/brandShow',
  deleteFile: '/backend/upload/deleteFile',
  brandSub: '/backend/business/brandSub',
  brandPreview: '/backend/business/brandPreview'
}

// 获取关联公司
export function getBussiness (parameter) {
  return axios({
    url: api.getBussiness,
    method: 'get',
    params: parameter
  })
}

export function brandShow (parameter) {
  return axios({
    url: api.brandShow,
    method: 'get',
    params: parameter
  })
}

export function brandSub (parameter) {
  return axios({
    url: api.brandSub,
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

export function brandPreview (parameter) {
  return axios({
    url: api.brandPreview,
    method: 'post',
    data: parameter
  })
}

export const uploadUrl = !isDev
  ? 'https://testbiz.aifound.cn/backend/upload/uploadFile'
  : 'https://biz.aifound.cn/backend/upload/uploadFile'

export const previewUrl = !isDev
  ? 'https://testfundnew.aifound.cn/brandData/#/brand-pay'
  : 'https://fundnew.aifound.cn/brandData/#/brand-pay'
