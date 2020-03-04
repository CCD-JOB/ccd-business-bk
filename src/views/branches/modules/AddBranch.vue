<template>
	<div class="AddConsultantWrapper">
		<h1>分支管理 - 添加分支机构</h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<a-form layout="horizontal"
				:form="form">
				<a-form-item label="机构名称："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写分支机构完整名称"
						maxLength="100"
						v-decorator="['branchName',
							{rules: [{ required: true, message: '请填写分支机构完整名称!', trigger: 'change' }]}
						]" />
				</a-form-item>
				<a-form-item :label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot='label'><em style="color:red;">*</em> 企业LOGO</span>
					<single-img-upload title="上传LOGO"
						:actionUrl="`${logoUrl}${id}`"
						:uploadInfo="uploadInfo"
						@handlePreviewImg="handlePreviewImg"
						@handleUploadChange="handleUploadChange"
						@handleRemoveUpload="handleRemoveUpload">
					</single-img-upload>
					<p style="color:red;margin:0;">图片尺寸：152*152</p>
					<p style="color:red;margin:0;">图片格式：JPG,JPEG,PNG,GIF(图片大小不超过1MB)</p>
				</a-form-item>
				<a-form-item label="地区选择："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<country-city ref="country"
						v-decorator="['branchArea',
							{rules: [{ required: true, message: '请选择地区!' }]}
						]"></country-city>
				</a-form-item>
				<a-form-item label="详细地址："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写分支机构详细联系地址"
						maxLength="100"
						v-decorator="['branchAddress',
						{rules: [{ required: true, message: '请填写分支机构详细联系地址!', trigger: 'change' }]}
					]" />
				</a-form-item>
				<a-form-item label="联系电话："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }"
					class="specialLabel">
					<a-input style="width: 30%;margin-right:10px;"
						placeholder="填写企业联系方式"
						v-decorator="['phone',
						{rules: [{ required: true, message: '请填写企业联系方式!', trigger: 'change' }]}
					]" />
				</a-form-item>
				<a-form-item label="传真号码："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }"
					class="specialLabel">
					<a-input style="width: 30%;margin-right:10px;"
						placeholder="填写企业传真号码"
						v-decorator="['fax']" />
				</a-form-item>
				<a-form-item label="Email："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写分支机构联系邮箱"
						maxLength="100"
						v-decorator="['branchEmail']" />
				</a-form-item>
				<a-form-item label="分支属性："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-select placeholder="请选择"
						v-decorator="['branchAttr',
						{rules: [{ required: true, message: '请选择分支属性!', trigger: 'change' }]}
					]"
						style="width:300px;">
						<a-select-option v-for="(item,index) in branchList"
							:key="index"
							:value="item.branchAttribute">{{item.branchAttribute}}</a-select-option>
					</a-select>
				</a-form-item>
			</a-form>
			<div class="btnWrapper">
				<a-button @click="handleBack">返回</a-button>
				<a-button @click="handleReset">重置</a-button>
				<a-popconfirm title="确认信息无误并提交?"
					@confirm="handleSubmit"
					okText="是"
					cancelText="再看看">
					<a-button>提交</a-button>
				</a-popconfirm>
			</div>
		</a-card>
		<preview-img-modal :modalInfo="modalInfo"
			@handlePreviewCancel="obj => modalInfo = obj"></preview-img-modal>
	</div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import {
  addBranchOrganization,
  showBranchAttributes,
  uploadUrl,
  removeBranchOrganizationHead,
  eidtBranchOrganization
} from '@/api/branches'
import { PreviewImgModal, SingleImgUpload } from '@/components'
import { CountryCity } from './../components'

export default {
  components: {
    SingleImgUpload,
    CountryCity,
    PreviewImgModal
  },
  data () {
    return {
      form: this.$form.createForm(this),
      id: '',
      companyUrl: '',
      logoUrl: '',
      branchList: [],
      modalInfo: {
        title: '查看大图',
        previewVisible: false,
        src: ''
      },
      uploadInfo: {
        fileList: [],
        showOffList: []
      },
      queryParam: {
        id: ''
      }
    }
  },
  created () {
    const { addBranchOrganization, showBranchAttributes } = this
    const { logoUrl } = uploadUrl
    this.logoUrl = logoUrl
    this.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
    addBranchOrganization()
    showBranchAttributes()
  },
  methods: {
    async addBranchOrganization () {
      try {
        let res = await addBranchOrganization({
          companyUrl: this.companyUrl
        })
        const { code, data, msg } = res
        if (code === 200) {
          const { id } = data
          this.id = data.id
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    async showBranchAttributes () {
      try {
        let res = await showBranchAttributes()
        const { code, data, msg } = res
        if (code === 200) {
          this.branchList = data
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 处理时间
    _handlePtime (value) {
      if (!value) return
      return moment(value).format('YYYY-MM-DD')
    },
    // 预览照片 - 打开
    handlePreviewImg (file) {
      this.modalInfo = {
        title: '查看大图',
        src: file.url || file.thumbUrl || file.winPath,
        previewVisible: true
      }
    },
    // 头像/背景 - 上传
    handleUploadChange ({ fileList }, type) {
      this.uploadInfo.fileList = fileList
    },
    // 头像/背景 - 移除
    async handleRemoveUpload (
      {
        response: {
          data: { fileUrl }
        }
      },
      type
    ) {
      let res = await removeBranchOrganizationHead({
        fileUrl,
        id: this.id
      })
      if (res.code === 200) {
        this.uploadInfo.fileList = []
        this.uploadInfo.showOffList = []
      } else {
        this.$notification.error({
          message: res.msg || '删除失败，请重试！'
        })
      }
    },
    // 按钮组 - 重置
    handleReset () {
      const {
        form: { setFieldsValue },
        uploadInfo: { fileList },
        $refs: {
          country: { handleResetCountry }
        }
      } = this
      if (fileList.length) this.handleRemoveUpload(fileList[0])
      handleResetCountry()
      setFieldsValue({
        branchName: undefined,
        branchAddress: undefined,
        phone: undefined,
        fax: undefined,
        branchEmail: undefined,
        branchAttr: undefined
      })
    },
    handleImgUrl () {
      const { uploadInfo } = this
      let organizationLogo = ''
      if (uploadInfo.fileList.length && uploadInfo.fileList[0].response) {
        organizationLogo = `${uploadInfo.fileList[0].response.data.winPath};${uploadInfo.fileList[0].response.data.fileUrl}`
      } else if (uploadInfo.showOffList.winPath) {
        organizationLogo = `${uploadInfo.showOffList.winPath};${uploadInfo.showOffList.fileUrl}`
      } else {
        organizationLogo = ''
      }
      return { organizationLogo }
    },
    // 按钮组 - 提交
    handleSubmit () {
      const {
        uploadInfo: { fileList },
        form: { getFieldsValue, validateFields },
        $refs: {
          country: { city, countryName }
        },
        $notification: { error, success }
      } = this

      const formObj = getFieldsValue([
        'branchName',
        'branchAddress',
        'phone',
        'fax',
        'branchEmail',
        'branchAttr'
      ])

      if (!countryName) {
        error({
          message: '请选择国家！'
        })
        return
      }
      if (countryName === '中国' && !city) {
        error({
          message: '请选择具体城市！'
        })
        return
      }
      let area = ''
      if (countryName !== '中国') {
        area = countryName
      } else {
        area = city === '' ? `${countryName}` : `${countryName}-${city}`
      }

      const { organizationLogo } = this.handleImgUrl()

      let param = {
        id: this.id,
        organizationLogo: organizationLogo,
        organizationName: formObj.branchName,
        area,
        detailedArea: formObj.branchAddress,
        phone: formObj.phone,
        faxNum: formObj.fax,
        email: formObj.branchEmail,
        branchType: formObj.branchAttr,
        creater: JSON.parse(Vue.ls.get('USERINFO')).username
      }
      console.log(param)
      validateFields(
        ['branchName', 'branchAddress', 'phone', 'branchAttr'],
        async err => {
          if (!err) {
            try {
              const res = await eidtBranchOrganization(param)
              const { code, data, msg } = res
              if (code === 200) {
                success({
                  message: msg || '提交成功!'
                })
                this.$router.push({
                  path: '/branches'
                })
              } else {
                throw new Error(msg)
              }
            } catch ({ message }) {
              error({
                message: message || '网络故障，请重试！'
              })
            }
          }
        }
      )
    },
    // 按钮组 - 返回
    handleBack () {
      this.$router.push('/branches')
    }
  }
}
</script>

<style lang="less">
.AddConsultantWrapper {
	min-width: 1200px;
	h1 {
		font-size: 20px;
		font-weight: bold;
	}
	.mainWrapper {
		.ant-form-item-label {
			text-align: center;
			p {
				font-size: 12px;
				margin: -20px 0 0 -10px;
			}
			label:after {
				content: '';
			}
		}
		.ant-input {
			width: 300px;
		}
		.specialLabel {
			.ant-input {
				width: 100%;
			}
		}
		.ant-input-affix-wrapper {
			width: 300px;
		}
		.btnWrapper {
			margin-top: 50px;
			.ant-btn {
				margin-right: 10px;
			}
		}
	}
}
</style>
