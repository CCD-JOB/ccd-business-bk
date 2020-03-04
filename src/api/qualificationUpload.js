import { axios } from '@/utils/request'
const isDev = process.env.NODE_ENV === 'production'

const api = {
  showCompanyAptitudeType:
    '/backend/commercialTenantConfigure/showCompanyAptitudeType',
  showCompanyAptitudes:
    '/backend/commercialTenantConfigure/showCompanyAptitudes',
  showSingleCompanyAptitude:
    '/backend/commercialTenantConfigure/showSingleCompanyAptitude',
  removeCompanyAptitudePic:
    '/backend/commercialTenantConfigure/removeCompanyAptitudePic'
}

// 资质上传 - 资质类型下拉菜单
export function showCompanyAptitudeType (parameter) {
  return axios({
    url: api.showCompanyAptitudeType,
    method: 'get',
    params: parameter
  })
}

// 资质上传 - 企业资质分页查询
export function showCompanyAptitudes (parameter) {
  return axios({
    url: api.showCompanyAptitudes,
    method: 'get',
    params: parameter
  })
}

// 资质上传 - 企业资质证书查看接口
export function showSingleCompanyAptitude (parameter) {
  return axios({
    url: api.showSingleCompanyAptitude,
    method: 'post',
    params: parameter
  })
}

// 删除记录
export function removeCompanyAptitudePic (parameter) {
  return axios({
    url: api.removeCompanyAptitudePic,
    method: 'post',
    params: parameter
  })
}

export const uploadUrl = {
  logoUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyAptitude'
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyAptitude',
  previewUrl: !isDev
    ? 'https://testbiz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyAptitudeFirst?aptitudeName=""&companyUrl='
    : 'https://biz.aifound.cn/zuul/backend/commercialTenantConfigure/updateCompanyAptitudeFirst?aptitudeName=""&companyUrl='
}
