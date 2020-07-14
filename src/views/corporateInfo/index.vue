<template>
	<div class="corporateInfoWrapper">
		<div class="disableMask"
			v-if="!subBtnVisible"></div>
		<h1>基本信息<span v-if="!subBtnVisible"> - 此模块正在审核中，请耐心等待。。。</span></h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<h3 class="info"
				v-if="examineState === 3">驳回原因：{{rejectReason}}</h3>
			<a-form layout="horizontal"
				:form="form">
				<a-form-item :label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot='label'><em style="color:red;">*</em> 企业LOGO</span>
					<div style="display:flex;justify-content:flex-start;">
						<div>
							<single-img-upload title="本地上传"
								:actionUrl="`${uploadUrlS}?companyUrl=${companyUrl}`"
								:uploadInfo="uploadLogoInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'logo')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'logo')"
								@handleDeleteUpload="files => handleDeleteUpload(files,'logo')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：152*152</p>
						</div>
						<div>
							<single-img-upload title="上传背景图片"
								:actionUrl="`${uploadUrl}?dic=1`"
								:uploadInfo="uploadLocInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'loc')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'loc')"
								@handleDeleteUpload="files => handleDeleteUpload(files,'loc')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：750*532</p>
						</div>
					</div>
					<p style="color:red;margin:0;">图片格式：JPG,JPEG,PNG,GIF(图片大小不超过1MB)</p>
				</a-form-item>
				<a-form-item label="企业名称："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p style="margin:0;">{{companyName}}</p>
				</a-form-item>
				<a-form-item label="联系地址："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写联系地址"
						maxLength="100"
						v-decorator="['brandLoc',
						{rules: [{ required: true, message: '请填写联系地址!', trigger: 'change' }]}
					]" />
				</a-form-item>
				<a-form-item label="企业网址："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写企业网址"
						v-decorator="['brandWeb',
						{rules: [{ required: true, message: '请填写企业网址!', trigger: 'change' },{validator:checkUrl}]}
					]" />
				</a-form-item>
				<phone-arr-s labelTitle="联系电话"
					:isRequired="true"
					:mobileNumArr="mobileNumArr"
					:mobileNum="mobileNum"
					@handleAddPhone="handleAddPhone"
					@handleDelPhone="handleDelPhone">
				</phone-arr-s>
				<!-- <a-card title="账号权限共享："
					v-if="type">
					<a-form-item label="填写共享账号："
						:label-col="{ span: 2 }"
						:wrapper-col="{ span: 12 }">
						<a-input-search placeholder="请填写需要共享的用户ID"
							v-model="shareId"
							@search="handleCertainShare"
							@blur="handleCertainShare"
							enterButton="确认" />
					</a-form-item>
					<a-form-item label="分享权限设置："
						:label-col="{ span: 2 }"
						:wrapper-col="{ span: 12 }">
						<a-checkbox-group :options="plainOptions"
							v-decorator="['powerSee',{ initialValue: defaultPowerSee }]" />
					</a-form-item>
				</a-card> -->
			</a-form>
			<div class="btnWrapper">
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
import store from '@/store'
import { PreviewImgModal, SingleImgUpload, PhoneArrS } from '@/components'
import {
  uploadUrl,
  uploadUrlS,
  deleteFile,
  info,
  // auth,
  submit,
  validateShared
} from '@/api/corporateInfo'

export default {
  components: {
    SingleImgUpload,
    PreviewImgModal,
    PhoneArrS
  },
  data () {
    return {
      // plainOptions: [],
      // defaultPowerSee: [],
      form: this.$form.createForm(this),
      subBtnVisible: true,
      examineState: 1,
      rejectReason: '',
      id: '',
      uploadUrl: '',
      uploadUrlS: '',
      companyName: '',
      companyUrl: '',
      mobileNum: 0,
      mobileNumArr: [],
      // shareId: '',
      uploadLogoInfo: {
        fileList: [],
        showOffList: {}
      },
      uploadLocInfo: {
        fileList: [],
        showOffList: {}
      },
      modalInfo: {
        title: '查看大图',
        previewVisible: false,
        src: ''
      }
    }
  },
  created () {
    this.uploadUrl = uploadUrl
    this.uploadUrlS = uploadUrlS
    this.type = store.getters.currentCompany.bizType
    this.id = store.getters.currentCompany.bizId
    this.getInfo()
    // this.auth()
  },
  methods: {
    async getInfo () {
      let data = await info({ insId: this.id })

      const {
        rejectReason,
        examineState,
        companyName,
        companyUrl,
        address,
        website,
        tel,
        logoUrl,
        backgroundUrl
      } = data.data
      let requirePhone = []
      if (tel !== '') {
        requirePhone = tel.split(';')
      }
      this.companyName = companyName
      this.companyUrl = companyUrl
      if (data.code === 200) {
        this.form.setFieldsValue({
          brandLoc: address,
          brandWeb: website,
          consultantPhone: requirePhone[0]
        })
        this.subBtnVisible = examineState !== 1
        this.examineState = examineState
        this.rejectReason = rejectReason
        this.uploadLogoInfo.showOffList = this.backupSingleInfo(logoUrl)
        this.uploadLocInfo.showOffList = this.backupSingleInfo(backgroundUrl)
        this.mobileNumArr = this.backupPhoneArr(tel) || []
      }
    },
    // async auth () {
    //   try {
    //     const res = await auth({ insId: this.id })
    //     const { data, code } = res
    //     if (code === 200) {
    //       let plainOptions = []
    //       let checked = []
    //       data.forEach(item => {
    //         if (Number(item.checked)) {
    //           plainOptions.push({
    //             label: item.nodeName,
    //             value: item.resourceId
    //           })
    //         }
    //       })
    //       data.filter((item, index) => {
    //         if (Number(item.checked)) {
    //           checked.push(item.resourceId)
    //         }
    //       })
    //       this.plainOptions = plainOptions
    //       this.defaultPowerSee = checked
    //     } else {
    //       throw new Error(res.msg)
    //     }
    //   } catch ({ message }) {
    //     this.$notification.error({
    //       message: message || '网络故障，请重试！'
    //     })
    //   }
    // },
    backupSingleInfo (str) {
      const arr = str.split(';')
      return {
        winPath: arr[0],
        fileUrl: arr[1]
      }
    },
    backupPhoneArr (phone) {
      if (phone === '') return
      let arr = phone.split(';').slice(1)
      let result = []
      arr.forEach(item => {
        if (item !== '') {
          result.push({ num: item })
          this.mobileNum++
        }
      })
      return result
    },
    backupPowerSee (arr) {
      let result = []
      arr.filter((item, index) => {
        if (Number(item.checked)) {
          result.push(item.resourceId)
        }
      })
      return result
    },
    handleAddPhone () {
      const {
        form: { validateFields }
      } = this
      validateFields(['consultantPhone'], err => {
        if (!err) {
          if (
            this.mobileNum > 0 &&
						this.mobileNumArr[this.mobileNum - 1].num === ''
          ) {
            return
          }
          if (this.mobileNum > 1) return
          this.mobileNum++
          this.mobileNumArr.push({ num: '' })
        }
      })
    },
    handleDelPhone () {
      this.mobileNum--
      this.mobileNumArr.pop()
    },
    handlePreviewImg (file) {
      this.modalInfo = {
        title: '查看大图',
        src: file.url || file.thumbUrl || file.winPath || file,
        previewVisible: true
      }
    },
    // 图片 - 上传
    handleUploadChange ({ fileList }, type) {
      switch (type) {
        case 'logo':
          this.uploadLogoInfo.fileList = fileList
          break
        case 'loc':
          this.uploadLocInfo.fileList = fileList
          break
        default:
          break
      }
    },
    // 删除上传的图片
    async handleRemoveImg (fileUrl) {
      try {
        const res = await deleteFile({
          url: fileUrl
        })
        if (res.code === 200) {
          this.$notification.success({
            message: res.msg || '删除成功！'
          })
          return res
        } else {
          throw new Error(res.msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '删除失败，请重试！'
        })
      }
    },
    // 删除上传
    async handleRemoveUpload ({ response: { data } }, type) {
      const fileUrl = data.split(';')[1]
      const res = await this.handleRemoveImg(fileUrl)
      // if (res && res.code === 200) {
      //   switch (type) {
      //     case 'logo':
      //       this.uploadLogoInfo.fileList = []
      //       break
      //     case 'loc':
      //       this.uploadLocInfo.fileList = []
      //       break
      //     default:
      //       break
      //   }
      // }
    },
    // 删除已上传图片
    async handleDeleteUpload (item, type) {
      if (type === 'logo') {
        this.uploadLogoInfo.showOffList = {}
        return
      }
      const res = await this.handleRemoveImg(item)
      if (res && res.code === 200) {
        switch (type) {
          case 'loc':
            this.uploadLocInfo.showOffList = {}
            break
          default:
            break
        }
      }
    },
    // async handleCertainShare () {
    //   const { shareId } = this
    //   const param = {
    //     userShared: shareId,
    //     userNow: JSON.parse(Vue.ls.get('USERINFO')).username
    //   }
    //   try {
    //     let res = await validateShared(param)
    //     if (res.code === 200) {
    //       if (res.data === false) {
    //         this.shareId = ''
    //         throw new Error('提交失败，共享账号名称填写错误！')
    //       }
    //     } else {
    //       throw new Error(res.msg)
    //     }
    //   } catch ({ message }) {
    //     this.$notification.error({
    //       message: message || '提交失败，共享账号名称填写错误！'
    //     })
    //   }
    // },
    handleImgUrl () {
      const { uploadLogoInfo, uploadLocInfo } = this
      let logoUrl = ''
      let backgroundUrl = ''
      if (
        uploadLogoInfo.fileList.length &&
				uploadLogoInfo.fileList[0].response
      ) {
        logoUrl = `${uploadLogoInfo.fileList[0].response.data}`
      } else if (uploadLogoInfo.showOffList.winPath) {
        logoUrl = `${uploadLogoInfo.showOffList.winPath}`
      } else {
        logoUrl = ''
      }
      if (uploadLocInfo.fileList.length && uploadLocInfo.fileList[0].response) {
        backgroundUrl = `${uploadLocInfo.fileList[0].response.data}`
      } else if (uploadLocInfo.showOffList.winPath) {
        backgroundUrl = `${uploadLocInfo.showOffList.winPath};${uploadLocInfo.showOffList.fileUrl}`
      } else {
        backgroundUrl = ''
      }
      return { logoUrl, backgroundUrl }
    },
    // 手机 - 处理手机号
    handlePhoneArr () {
      let formObj = this.form.getFieldsValue(['consultantPhone'])
      let allPhone = [formObj.consultantPhone]
      this.mobileNumArr.map(item => {
        if (item !== '') {
          allPhone.push(item.num)
        }
      })
      return allPhone.join(';')
    },
    checkUrl (rule, value, callback) {
      let str = value
      // 判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
      // 下面的代码中应用了转义字符"\"输出一个字符"/"
      let Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
      let objExp = new RegExp(Expression)
      if (objExp.test(str) !== true) {
        // eslint-disable-next-line
				callback('请输入 http(s):// 开头的正确网址！')
      }
      callback()
    },
    handleSubmit () {
      const {
        uploadLogoInfo: { fileList, showOffList },
        form: { getFieldsValue, validateFields },
        companyName,
        mobileNumArr,
        // shareId,
        companyUrl,
        handlePhoneArr,
        handleCertainShare
      } = this
      const { brandLoc, brandWeb, consultantPhone } = getFieldsValue([
        'brandLoc',
        'brandWeb',
        'consultantPhone'
      ])
      if (!fileList.length && !showOffList.winPath) {
        this.$notification.error({
          message: '请上传企业LOGO！'
        })
        return
      }

      // if (shareId !== '' && !powerSee.length) {
      //   this.$notification.error({
      //     message: '请至少选中一项权限！'
      //   })
      //   return
      // }

      const { logoUrl, backgroundUrl } = this.handleImgUrl()
      let param = {
        id: this.id,
        activityId: 10,
        logoUrl: logoUrl,
        backgroundUrl: backgroundUrl,
        companyName: companyName,
        companyUrl: companyUrl,
        createBy: JSON.parse(Vue.ls.get('USERINFO')).username,
        address: brandLoc,
        website: brandWeb,
        tel: handlePhoneArr()
        // userShared: shareId,
        // resourceList: powerSee.join(',')
      }
      console.log(param)

      validateFields(
        ['brandName', 'brandLoc', 'brandWeb', 'consultantPhone'],
        async err => {
          if (!err) {
            try {
              const res = await submit(param)
              const { code, msg } = res
              if (code === 200) {
                this.$notification.success({
                  message: msg || '提交成功！'
                })
                this.subBtnVisible = false
              } else {
                throw new Error(msg)
              }
            } catch ({ message }) {
              this.$notification.error({
                message: message || '网络故障，请重试！'
              })
              this.subBtnVisible = true
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="less">
.corporateInfoWrapper {
	// min-width: 1200px;
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
		.info {
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
