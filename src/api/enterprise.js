import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  showCompanyHonors: '/backend/commercialTenantConfigure/showCompanyHonors',
  showSingleCompanyHonor:
    '/backend/commercialTenantConfigure/showSingleCompanyHonor',
  removeCompanyHonorPic:
    '/backend/commercialTenantConfigure/removeCompanyHonorPic'
}

// 荣誉上传 - 荣誉分页查询
export function showCompanyHonors (parameter) {
  return axios({
    url: api.showCompanyHonors,
    method: 'get',
    params: parameter
  })
}

// 荣誉上传 - 荣誉证书查看接口
export function showSingleCompanyHonor (parameter) {
  return axios({
    url: api.showSingleCompanyHonor,
    method: 'post',
    params: parameter
  })
}

// 荣誉 - 删除记录
export function removeCompanyHonorPic (parameter) {
  return axios({
    url: api.removeCompanyHonorPic,
    method: 'post',
    params: parameter
  })
}

export const uploadUrl = {
  logoUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyHonor'
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyHonor',
  previewUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyHonorFirst?honorName=""&companyUrl='
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyHonorFirst?honorName=""&companyUrl='
}
