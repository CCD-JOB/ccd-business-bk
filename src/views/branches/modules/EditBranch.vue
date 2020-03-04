<template>
	<div class="EditConsultantWrapper">
		<div class="disableMask"
			v-if="!subBtnVisible"></div>
		<h1>分支管理 - 编辑分支机构<span v-if="!subBtnVisible"> - 此模块正在审核中，请耐心等待。。。</span></h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<h3 class="info"
				v-if="examineState === 3">驳回原因：{{rejectReason}}</h3>
			<a-form layout="horizontal"
				:form="form">
				<a-form-item label="机构名称："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写分支机构完整名称"
						maxLength="10"
						v-decorator="['branchName']" />
				</a-form-item>
				<a-form-item :label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot='label'><em style="color:red;">*</em> 企业LOGO</span>
					<div style="display:flex;justify-content:flex-start">
						<single-img-upload title="上传LOGO"
							:actionUrl="`${logoUrl}${id}`"
							:uploadInfo="uploadInfo"
							@handlePreviewImg="handlePreviewImg"
							@handleUploadChange="handleUploadChange"
							@handleRemoveUpload="handleRemoveUpload"
							@handleDeleteUpload="handleDeleteUpload">
						</single-img-upload>
					</div>
					<p style="color:red;margin:0;">图片尺寸：152*152</p>
					<p style="color:red;margin:0;">图片格式：JPG,JPEG,PNG,GIF(图片大小不超过1MB)</p>
				</a-form-item>
				<a-form-item label="地区选择："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<country-city ref="country"></country-city>
				</a-form-item>
				<a-form-item label="详细地址："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写分支机构详细联系地址"
						maxLength="100"
						v-decorator="['branchAddress']" />
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
						v-decorator="['branchAttr']"
						style="width:300px;">
						<a-select-option v-for="(item,index) in branchList"
							:key="index"
							:value="item.branchAttribute">{{item.branchAttribute}}</a-select-option>
					</a-select>
				</a-form-item>
			</a-form>
			<div class="btnWrapper">
				<a-button @click="handleBack"
					style="position:relative;z-index:999;">返回</a-button>
				<a-button @click="handleReset"
					v-if="subBtnVisible">重置</a-button>
				<a-popconfirm v-if="subBtnVisible"
					title="确认信息无误并提交?"
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
  eidtBranchOrganization,
  showSingleBranchOrganization
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
      subBtnVisible: true,
      id: '',
      companyUrl: '',
      examineState: 1,
      rejectReason: '',
      logoUrl: '',
      branchList: [],
      phone: [],
      fax: [],
      modalInfo: {
        title: '查看大图',
        previewVisible: false,
        src: ''
      },
      uploadInfo: {
        fileList: [],
        showOffList: {}
      },
      queryParam: {
        id: ''
      }
    }
  },
  created () {
    const { logoUrl } = uploadUrl
    const {
      $route: {
        query: { id }
      },
      showBranchAttributes,
      showSingleBranchOrganization
    } = this

    this.logoUrl = logoUrl
    this.id = id
    this.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
    showBranchAttributes()
    showSingleBranchOrganization()
  },
  methods: {
    async showSingleBranchOrganization () {
      try {
        const res = await showSingleBranchOrganization({
          id: this.id
        })
        const {
          form: { setFieldsValue },
          $refs: {
            country: { handleBackCity }
          }
        } = this
        const {
          code,
          data: {
            area,
            phone,
            faxNum,
            organizationLogo,
            organizationName,
            detailedArea,
            email,
            branchType,
            auditStatus,
            rejectDescribe
          }
        } = res
        if (code === 200) {
          this.uploadInfo.showOffList = this.backupImg(organizationLogo)
          this.subBtnVisible = auditStatus !== 1
          this.examineState = auditStatus
          this.rejectReason = rejectDescribe
          handleBackCity(area)

          setFieldsValue({
            branchName: organizationName,
            branchAddress: detailedArea,
            phone: phone,
            fax: faxNum,
            branchEmail: email,
            branchAttr: branchType
          })
        } else {
          throw new Error(res.msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    async showBranchAttributes () {
      try {
        const res = await showBranchAttributes()
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
    backupStr (str, type) {
      this[type] = str.split('-')
    },
    backupImg (url) {
      let arr = url.split(';')
      return {
        winPath: arr[0],
        fileUrl: arr[1]
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
    async handleDeleteUpload (item) {
      let res = await removeBranchOrganizationHead({
        fileUrl: item,
        id: this.id
      })
      if (res.code === 200) {
        this.uploadInfo.showOffList = {}
      } else {
        this.$notification.error({
          message: res.msg || '删除失败，请重试！'
        })
      }
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
        },
        handleRemoveUpload
      } = this
      if (fileList.length) handleRemoveUpload(fileList[0])
      handleResetCountry()
      setFieldsValue({
        branchName: undefined,
        branchAddress: undefined,
        phoneF: undefined,
        phoneS: undefined,
        phoneT: undefined,
        faxF: undefined,
        faxS: undefined,
        faxT: undefined,
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
        uploadInfo: { fileList, showOffList },
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

      // if (!fileList.length && !showOffList.winPath) {
      //   error({
      //     message: '请上传LOGO'
      //   })
      //   return
      // }
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
      validateFields(
        ['branchName', 'branchAddress', 'phone', 'branchAttr'],
        async err => {
          if (!err) {
            const res = await eidtBranchOrganization(param)
            const { code, data, msg } = res
            if (code === 200) {
              success({
                message: msg || '提交成功!'
              })
              this.$router.push('/branches')
            } else {
              error({
                message: msg || '提交失败，请重试'
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
.EditConsultantWrapper {
	min-width: 1200px;
	position: relative;
	.disableMask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 888;
	}
	h1 {
		font-size: 20px;
		font-weight: bold;
		span {
			color: red;
		}
	}
	.mainWrapper {
		h3.info {
			color: red;
			padding: 8px;
			border: 1px solid red;
			word-break: break-all;
		}
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
