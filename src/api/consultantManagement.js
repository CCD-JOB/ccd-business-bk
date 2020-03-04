import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  companyAdvisers: '/backend/commercialTenantConfigure/showCompanyAdvisers',
  setAdviserStick: '/backend/commercialTenantConfigure/setAdviserStick',
  removeAdviserStick: '/backend/commercialTenantConfigure/removeAdviserStick',
  removeCompanyAdviser:
    '/backend/commercialTenantConfigure/removeCompanyAdviser',
  addCompanyAdviser: '/backend/commercialTenantConfigure/addCompanyAdviser',
  showCompetences: '/backend/commercialTenantConfigure/showCompetences',
  removeSingleCompetence:
    '/backend/commercialTenantConfigure/removeSingleCompetence',
  removeSingleHonour: '/backend/commercialTenantConfigure/removeSingleHonour',
  removeSingleMien: '/backend/commercialTenantConfigure/removeSingleMien',
  removeSinglePic: 'backend/commercialTenantConfigure/removeSinglePic',
  addWorkExperience: '/backend/commercialTenantConfigure/addWorkExperience',
  showWorkExperiences: '/backend/commercialTenantConfigure/showWorkExperiences',
  editWorkExperience: '/backend/commercialTenantConfigure/editWorkExperience',
  removeWorkExperiences:
    '/backend/commercialTenantConfigure/removeWorkExperiences',
  editCompanyAdviser: '/backend/commercialTenantConfigure/eidtCompanyAdviser',
  showSingleCompanyAdviser:
    '/backend/commercialTenantConfigure/showSingleCompanyAdviser',
  showAuditCount: '/merchantAudit/showAuditCount',
  getInfomationQrCode: '/backend/commercialTenantConfigure/getInfomationQrCode',
  previewAdviser: '/backend/commercialTenantConfigure/previewAdviser'
}

// 顾问列表 - 列表
export function getCompanyAdvisers (parameter) {
  return axios({
    url: api.companyAdvisers,
    method: 'get',
    params: parameter
  })
}

// 顾问列表 - 置顶
export function setAdviserStick (parameter) {
  return axios({
    url: api.setAdviserStick,
    method: 'post',
    params: parameter
  })
}

// 顾问列表 - 取消置顶
export function removeAdviserStick (parameter) {
  return axios({
    url: api.removeAdviserStick,
    method: 'post',
    params: parameter
  })
}

// 顾问列表 - 删除顾问
export function removeCompanyAdviser (parameter) {
  return axios({
    url: api.removeCompanyAdviser,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 得到id
export function addCompanyAdviser (parameter) {
  return axios({
    url: api.addCompanyAdviser,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 获取资质证书列表
export function showCompetences () {
  return axios({
    url: api.showCompetences,
    method: 'get'
  })
}

// 新增顾问 - 资质证书删除
export function removeSingleCompetence (parameter) {
  return axios({
    url: api.removeSingleCompetence,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 荣誉证书删除
export function removeSingleHonour (parameter) {
  return axios({
    url: api.removeSingleHonour,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 风采删除
export function removeSingleMien (parameter) {
  return axios({
    url: api.removeSingleMien,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 头像/背景删除
export function removeSinglePic (parameter) {
  return axios({
    url: api.removeSinglePic,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 工作经历 - 新增
export function addWorkExperience (parameter) {
  return axios({
    url: api.addWorkExperience,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 工作经历 - 展示
export function showWorkExperiences (parameter) {
  return axios({
    url: api.showWorkExperiences,
    method: 'get',
    params: parameter
  })
}

// 新增顾问 - 工作经历 - 编辑
export function editWorkExperience (parameter) {
  return axios({
    url: api.editWorkExperience,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 工作经历 - 删除
export function removeWorkExperiences (parameter) {
  return axios({
    url: api.removeWorkExperiences,
    method: 'post',
    params: parameter
  })
}

// 新增顾问 - 保存
export function editCompanyAdviser (parameter) {
  return axios({
    url: api.editCompanyAdviser,
    method: 'post',
    params: parameter
  })
}

// 详情
export function showSingleCompanyAdviser (parameter) {
  return axios({
    url: api.showSingleCompanyAdviser,
    method: 'get',
    params: parameter
  })
}

// 审核详情
export function showAuditCount (parameter) {
  return axios({
    url: api.showAuditCount,
    method: 'get',
    params: parameter
  })
}

export function getInfomationQrCode (parameter) {
  return axios({
    url: api.getInfomationQrCode,
    method: 'post',
    params: parameter
  })
}

// 预览提交
export function previewAdviser (parameter) {
  return axios({
    url: api.previewAdviser,
    method: 'post',
    params: parameter
  })
}

export const uploadUrl = {
  avatarUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateAdviserHead'
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateAdviserHead',
  bgUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateAdviserBackground'
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateAdviserBackground',
  certUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompetence'
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompetence',
  honorUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateHonour'
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateHonour',
  lifeUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateMien?id='
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateMien?id=',
  code: !isDev
    ? 'https://testfundnew.aifound.cn/brandData/#/counselor/'
    : 'https://fundnew.aifound.cn/brandData/#/counselor/'
}
