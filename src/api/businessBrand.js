import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  brandShow: '/backend/business/insBrandShow',
  deleteFile: '/backend/upload/deleteFile',
  insBrandSub: '/backend/business/insBrandSub',
  insPreview: '/backend/business/insPreview'
}

export function brandShow (parameter) {
  return axios({
    url: api.brandShow,
    method: 'get',
    params: parameter
  })
}

export function deleteFile (parameter) {
  return axios({
    url: api.deleteFile,
    method: 'post',
    params: parameter
  })
}

export function insBrandSub (parameter) {
  return axios({
    url: api.insBrandSub,
    method: 'post',
    data: parameter
  })
}

export function insPreview (parameter) {
  return axios({
    url: api.insPreview,
    method: 'post',
    data: parameter
  })
}

export const uploadUrl = !isDev
  ? 'https://testbiz.aifound.cn/backend/upload/uploadFile'
  : 'https://biz.aifound.cn/backend/upload/uploadFile'

export const previewUrl = !isDev
  ? 'https://testfundnew.aifound.cn/brandData/#/brand-home'
  : 'https://fundnew.aifound.cn/brandData/#/brand-home'
