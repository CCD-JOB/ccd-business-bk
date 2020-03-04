import { axios } from '@/utils/request'

const api = {
  showCompanyFeatures: '/backend/commercialTenantConfigure/showCompanyFeatures',
  addCompanyFeatures: '/backend/commercialTenantConfigure/addCompanyFeatures',
  editCompanyFeatures: '/backend/commercialTenantConfigure/editCompanyFeatures'
}

// 特色服务 - 列表
export function showCompanyFeatures (parameter) {
  return axios({
    url: api.showCompanyFeatures,
    method: 'get',
    params: parameter
  })
}

// 特色服务 - 新建
export function addCompanyFeatures (parameter) {
  return axios({
    url: api.addCompanyFeatures,
    method: 'post',
    params: parameter
  })
}

// 特色服务 - 编辑
export function editCompanyFeatures (parameter) {
  return axios({
    url: api.editCompanyFeatures,
    method: 'post',
    params: parameter
  })
}
