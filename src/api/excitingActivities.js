import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  showActivityInformation:
    '/backend/commercialTenantConfigure/showActivityInformation',
  removeActivityInformation:
    '/backend/commercialTenantConfigure/removeActivityInformation',
  readyAddActivityInformation:
    '/backend/commercialTenantConfigure/readyAddActivityInformation',
  showBespeak: '/backend/commercialTenantConfigure/showBespeak',
  removeActivityInformationPic:
    '/backend/commercialTenantConfigure/removeActivityInformationPic',
  eidtActivityInformation:
    '/backend/commercialTenantConfigure/eidtActivityInformation',
  eidtSequence: '/backend/commercialTenantConfigure/eidtSequence',
  showSingleActivityInformation:
    '/backend/commercialTenantConfigure/showSingleActivityInformation',
  previewButton: '/backend/commercialTenantConfigure/previewButton',
  getActivityInformationQrCode:
    '/backend/commercialTenantConfigure/getActivityInformationQrCode'
}

// 列表
export function showActivityInformation (parameter) {
  return axios({
    url: api.showActivityInformation,
    method: 'get',
    params: parameter
  })
}

// 展示
export function removeActivityInformation (parameter) {
  return axios({
    url: api.removeActivityInformation,
    method: 'post',
    params: parameter
  })
}

export function readyAddActivityInformation (parameter) {
  return axios({
    url: api.readyAddActivityInformation,
    method: 'post',
    params: parameter
  })
}

export function showBespeak (parameter) {
  return axios({
    url: api.showBespeak,
    method: 'get',
    params: parameter
  })
}

export function removeActivityInformationPic (parameter) {
  return axios({
    url: api.removeActivityInformationPic,
    method: 'post',
    params: parameter
  })
}

export function eidtSequence (parameter) {
  return axios({
    url: api.eidtSequence,
    method: 'post',
    params: parameter
  })
}
// 保存
export function eidtActivityInformation (parameter) {
  return axios({
    url: api.eidtActivityInformation,
    method: 'post',
    data: parameter
  })
}

// 单挑展示
export function showSingleActivityInformation (parameter) {
  return axios({
    url: api.showSingleActivityInformation,
    method: 'get',
    params: parameter
  })
}

export function previewButton (parameter) {
  return axios({
    url: api.previewButton,
    method: 'post',
    data: parameter
  })
}

export function getActivityInformationQrCode (parameter) {
  return axios({
    url: api.getActivityInformationQrCode,
    method: 'post',
    params: parameter
  })
}

export const uploadUrl = {
  upload: !isDev
    ? 'https://testbiz.aifound.cn/backend/commercialTenantConfigure/updateActivityInformationPic'
    : 'https://biz.aifound.cn/backend/commercialTenantConfigure/updateActivityInformationPic',
  code: !isDev
    ? 'https://testfundnew.aifound.cn/brandData/#/activity/'
    : 'https://fundnew.aifound.cn/brandData/#/activity/'
}
