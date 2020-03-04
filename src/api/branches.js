import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  showBranchOrganizations:
    '/backend/commercialTenantConfigure/showBranchOrganizations',
  showSingleBranchOrganization:
    '/backend/commercialTenantConfigure/showSingleBranchOrganization',
  addBranchOrganization:
    '/backend/commercialTenantConfigure/addBranchOrganization',
  showBranchAttributes:
    '/backend/commercialTenantConfigure/showBranchAttributes',
  removeBranchOrganizationHead:
    '/backend/commercialTenantConfigure/removeBranchOrganizationHead',
  eidtBranchOrganization:
    '/backend/commercialTenantConfigure/eidtBranchOrganization'
}

// 分支机构 - 列表
export function showBranchOrganizations (parameter) {
  return axios({
    url: api.showBranchOrganizations,
    method: 'get',
    params: parameter
  })
}

// 分支机构 - 预创建id
export function addBranchOrganization (parameter) {
  return axios({
    url: api.addBranchOrganization,
    method: 'post',
    params: parameter
  })
}

// 分支机构 - 分支属性
export function showBranchAttributes (parameter) {
  return axios({
    url: api.showBranchAttributes,
    method: 'get',
    params: parameter
  })
}

// 分支机构 - logo删除
export function removeBranchOrganizationHead (parameter) {
  return axios({
    url: api.removeBranchOrganizationHead,
    method: 'post',
    params: parameter
  })
}

// 分支机构 - 详情
export function showSingleBranchOrganization (parameter) {
  return axios({
    url: api.showSingleBranchOrganization,
    method: 'get',
    params: parameter
  })
}

// 分支机构 - 新增保存/编辑保存
export function eidtBranchOrganization (parameter) {
  return axios({
    url: api.eidtBranchOrganization,
    method: 'post',
    params: parameter
  })
}

export const uploadUrl = {
  logoUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateBranchOrganizationHead?id='
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateBranchOrganizationHead?id='
}
