<template>
	<div class="businessBrandWrapper">
		<div class="disableMask"
			v-if="!subBtnVisible"></div>
		<h1>企业品牌（品牌介绍）<span v-if="!subBtnVisible"> - 此模块正在审核中，请耐心等待。。。</span></h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<a-form layout="horizontal"
				:form="form">
				<h3 class="info"
					v-if="examineState === 3">驳回原因：{{rejectReason}}</h3>
				<a-form-item :label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot='label'><em style="color:red;">*</em> 企业LOGO</span>
					<div style="display:flex;justify-content:flex-start;">
						<div>
							<single-img-upload title="上传企业LOGO"
								:actionUrl="`${uploadUrl}?dic=1`"
								:uploadInfo="uploadLogoInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'logo')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'logo')"
								@handleDeleteUpload="files => handleDeleteUpload(files,'logo')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：152*152</p>
						</div>
						<div>
							<single-img-upload title="上传办公地点图片"
								:actionUrl="`${uploadUrl}?dic=1`"
								:uploadInfo="uploadLocInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'loc')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'loc')"
								@handleDeleteUpload="files => handleDeleteUpload(files,'loc')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：375*303</p>
						</div>
					</div>
					<p style="color:red;margin:0;">图片格式：JPG,JPEG,PNG,GIF(图片大小不超过1MB)</p>
				</a-form-item>
				<a-form-item label="品牌名称："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写品牌名称"
						maxLength="50"
						v-decorator="['brandName',
						{rules: [{ required: true, message: '请填写品牌名称!', trigger: 'change' }]}
					]" />
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
					:form="form"
					:isRequired="true"
					:mobileNumArr="mobileNumArr"
					:mobileNum="mobileNum"
					@handleAddPhone="handleAddPhone"
					@handleDelPhone="handleDelPhone">
				</phone-arr-s>
				<a-form-item label="品牌介绍："
					class="textareaWrapper specialLabel"
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-textarea placeholder="请填写企业品牌介绍描述，最多填写500字哦～"
						:autosize="{ minRows: 2, maxRows: 6 }"
						maxLength="500"
						v-decorator="[
						'brandIntroduce',
						{rules: [{ required: true, message: '请输入品牌介绍！', trigger: 'change' }]}
					]"
						@change="e => handleIntroduceInput(e)" />
					<p class="tip">已填写{{hasInput}} / 500 字</p>
				</a-form-item>
				<a-form-item label="公司环境："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<much-img-upload title="上传公司环境"
						altTitle="公司环境"
						:addNumLimit="10"
						:actionUrl="`${uploadUrl}?dic=1`"
						:uploadInfo="uploadEnvInfo"
						@handlePreviewImg="handlePreviewImg"
						@handleUploadChange="files=>handleUploadChange(files,'env')"
						@handleRemoveUpload="files=>handleRemoveUpload(files,'env')"
						@handleDeleteUpload="files => handleDeleteUpload(files,'env')"></much-img-upload>
				</a-form-item>
				<a-form-item label="大事记："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<huge-event :eventNum="eventNum"
						:eventList="eventList"
						@handleAdd="handleAddEvent"
						@handleDel="handleDelEvent"
						@timeChange="handleEventTimeChange"></huge-event>
				</a-form-item>
			</a-form>
			<div class="btnWrapper">
				<a-button class="preview"
					@click="handlePreviewAll">预览</a-button>
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
import {
  PreviewImgModal,
  SingleImgUpload,
  MuchImgUpload,
  PhoneArrS,
  HugeEvent
} from '@/components'
import {
  uploadUrl,
  deleteFile,
  brandShow,
  insBrandSub,
  insPreview,
  previewUrl
} from '@/api/businessBrand'

export default {
  components: {
    SingleImgUpload,
    MuchImgUpload,
    PreviewImgModal,
    PhoneArrS,
    HugeEvent
  },
  data () {
    return {
      form: this.$form.createForm(this),
      insId: '',
      id: null,
      uploadUrl: '',
      hasInput: 0,
      mobileNum: 0,
      mobileNumArr: [],
      eventNum: 0,
      examineState: 1,
      subBtnVisible: true,
      rejectReason: '',
      eventList: [
        {
          eventName: '',
          description: '',
          eventTime: undefined
        }
      ],
      uploadLogoInfo: {
        fileList: [],
        showOffList: {}
      },
      uploadLocInfo: {
        fileList: [],
        showOffList: {}
      },
      uploadEnvInfo: {
        fileList: [],
        showOffList: []
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
    this.insId = store.getters.currentCompany.bizId
    this.getInfo()
  },
  methods: {
    async getInfo () {
      const data = await brandShow({ insId: this.insId })
      const {
        form: { setFieldsValue },
        backupSingleInfo,
        backupaMuchInfo,
        backupPhoneArr,
        backupEventExp
      } = this
      const {
        id,
        rejectReason,
        examineState,
        brandName,
        address,
        net,
        description,
        eventList,
        logoUrl,
        officeUrl,
        environmentUrl,
        tel
      } = data.data

      let requirePhone = []
      if (tel) {
        requirePhone = tel.split(';') || ''
      }

      if (data.code === 200) {
        setFieldsValue({
          brandName: brandName,
          brandLoc: address,
          brandWeb: net,
          brandIntroduce: description,
          consultantPhone: requirePhone[0]
        })
        this.id = id
        this.subBtnVisible = examineState !== 1
        this.examineState = examineState
        this.rejectReason = rejectReason
        this.uploadLogoInfo.showOffList = this.backupSingleInfo(logoUrl)
        this.uploadLocInfo.showOffList = this.backupSingleInfo(officeUrl)
        this.uploadEnvInfo.showOffList = this.backupaMuchInfo(environmentUrl)

        this.mobileNumArr = this.backupPhoneArr(tel) || []
        this.eventList = this.backupEventExp(eventList)
      }
    },
    backupSingleInfo (str) {
      if (str) {
        let arr = str.split(';')
        return {
          winPath: arr[0],
          fileUrl: arr[1]
        }
      }
      return {
        winPath: '',
        fileUrl: ''
      }
    },
    backupaMuchInfo (str) {
      if (str) {
        const arr = str.split(',')
        const result = []
        arr.map(item => {
          if (item !== '') {
            result.push({
              winPath: item.split(';')[0],
              fileUrl: item.split(';')[1]
            })
          }
        })
        return result
      }
      return []
    },
    backupPhoneArr (phone) {
      if (!phone) return
      const arr = phone.split(';').slice(1)
      let result = []
      arr.forEach(item => {
        if (item !== '') {
          result.push({ num: item })
          this.mobileNum++
        }
      })
      return result
    },
    backupEventExp (eventList) {
      if (!eventList.length) {
        this.eventNum++
        return [{ eventName: '', eventTime: undefined, description: '' }]
      }
      eventList.map(item => {
        item.eventTime = moment(item.eventTime)
        this.eventNum++
      })
      return eventList
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
          if (this.mobileNum > 2) return
          this.mobileNum++
          this.mobileNumArr.push({ num: '' })
        }
      })
    },
    handleDelPhone () {
      this.mobileNum--
      this.mobileNumArr.pop()
    },
    handleAddEvent () {
      let obj = this.eventList[this.eventNum - 1]
      if (obj.eventName === '' || obj.eventTime === '') {
        this.$notification.error({
          message: '请先补全大事记！'
        })
        return
      }
      if (this.eventNum > 19) {
        this.$notification.error({
          message: '最多建立20个大事件！'
        })
        return
      }
      this.eventNum++
      this.eventList.push({
        eventName: '',
        eventTime: undefined,
        description: ''
      })
    },
    handleDelEvent () {
      this.eventNum--
      this.eventList.pop()
    },
    // 简介 - 添加
    handleIntroduceInput (e) {
      this.hasInput = e.target.value.length
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
        case 'env':
          this.uploadEnvInfo.fileList = fileList
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
      //     case 'env':
      //       this.uploadEnvInfo.fileList = []
      //       break
      //     default:
      //       break
      //   }
      // }
    },
    // 删除已上传图片
    async handleDeleteUpload (item, type) {
      let res
      if (type === 'env') {
        res = await this.handleRemoveImg(item.fileUrl)
      } else {
        res = await this.handleRemoveImg(item)
      }
      if (res && res.code === 200) {
        switch (type) {
          case 'logo':
            this.uploadLogoInfo.showOffList = {}
            break
          case 'loc':
            this.uploadLocInfo.showOffList = {}
            break
          case 'env':
            console.log(this.uploadEnvInfo.showOffList, item)
            this.uploadEnvInfo.showOffList = this.uploadEnvInfo.showOffList.filter(
              el => el.fileUrl !== item.fileUrl
            )
            break
          default:
            break
        }
      }
    },
    handleEventTimeChange (date, dateString, item) {
      item.eventTime = date || undefined
    },
    handleCheckHugeEvent () {
      const {
        eventNum,
        eventList,
        $notification: { error }
      } = this
      let canSubmit = true
      eventList.some(item => {
        if (Boolean(item.eventName) || Boolean(item.eventTime)) {
          if (
            Boolean(item.eventName) === false ||
						Boolean(item.eventTime) === false
          ) {
            error({
              message: '如填写大事记，请写完整'
            })
            canSubmit = false
            return canSubmit
          }
        }
      })
      return canSubmit
    },
    handleImgUrl () {
      const { uploadLogoInfo, uploadLocInfo, uploadEnvInfo } = this
      let logoUrl = ''
      let officeUrl = ''
      let environmentUrl = ''
      if (
        uploadLogoInfo.fileList.length &&
				uploadLogoInfo.fileList[0].response
      ) {
        logoUrl = `${uploadLogoInfo.fileList[0].response.data}`
      } else if (uploadLogoInfo.showOffList.winPath) {
        logoUrl = `${uploadLogoInfo.showOffList.winPath};${uploadLogoInfo.showOffList.fileUrl}`
      } else {
        logoUrl = ''
      }
      if (uploadLocInfo.fileList.length && uploadLocInfo.fileList[0].response) {
        officeUrl = `${uploadLocInfo.fileList[0].response.data}`
      } else if (uploadLocInfo.showOffList.winPath) {
        officeUrl = `${uploadLocInfo.showOffList.winPath};${uploadLocInfo.showOffList.fileUrl}`
      } else {
        officeUrl = ''
      }
      uploadEnvInfo.fileList.forEach(item => {
        environmentUrl += `${item.response.data},`
      })
      uploadEnvInfo.showOffList.forEach(item => {
        environmentUrl += `${item.winPath};${item.fileUrl},`
      })
      return { logoUrl, officeUrl, environmentUrl }
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
        callback('请输入 http(s):// 开头的正确网址！')
      }
      callback()
    },
    handleSubmit () {
      const {
        form: { getFieldsValue, validateFields },
        mobileNumArr,
        eventList,
        uploadLogoInfo: { fileList, showOffList },
        handlePhoneArr,
        $notification: { success, error }
      } = this
      const {
        brandName,
        brandLoc,
        brandWeb,
        brandIntroduce,
        consultantPhone
      } = getFieldsValue([
        'brandName',
        'brandLoc',
        'brandIntroduce',
        'brandWeb',
        'consultantPhone'
      ])

      const { logoUrl, officeUrl, environmentUrl } = this.handleImgUrl()

      if (!fileList.length && !showOffList.winPath) {
        error({
          message: '请上传企业LOGO！'
        })
        return
      }
      if (!this.handleCheckHugeEvent()) return
      let descList = []
      if (
        !eventList[0].eventName &&
				!eventList[0].eventTime &&
				!eventList[0].description
      ) {
        descList = []
      } else {
        let arr = eventList.filter(item => item.eventName !== '')
        descList = JSON.parse(JSON.stringify(arr))
        descList.map(
          item => (item.eventTime = moment(item.eventTime).format('YYYY-MM'))
        )
      }
      let param = {
        id: this.id,
        insId: this.insId, // bizid
        brandName: brandName,
        address: brandLoc,
        net: brandWeb,
        description: brandIntroduce,
        createBy: JSON.parse(Vue.ls.get('USERINFO')).username,
        tel: handlePhoneArr(),
        eventList: descList,
        logoUrl,
        officeUrl,
        environmentUrl
      }
      validateFields(
        [
          'brandName',
          'brandLoc',
          'brandWeb',
          'brandIntroduce',
          'consultantPhone'
        ],
        async err => {
          if (!err) {
            try {
              const res = await insBrandSub(param)
              const { code } = res
              if (code === 200) {
                success({
                  message: res.msg || '提交成功！'
                })
                this.subBtnVisible = false
              } else {
                throw new Error(res.msg)
              }
            } catch ({ message }) {
              error({
                message: message || '网络故障，请重试！'
              })
              this.subBtnVisible = true
            }
          }
        }
      )
    },
    async handlePreviewAll () {
      const {
        form: { getFieldsValue, validateFields },
        mobileNumArr,
        eventList,
        uploadLogoInfo: { fileList, showOffList },
        handlePhoneArr,
        handlePreviewImg,
        $notification: { error }
      } = this
      const {
        brandName,
        brandLoc,
        brandWeb,
        brandIntroduce,
        consultantPhone
      } = getFieldsValue([
        'brandName',
        'brandLoc',
        'brandIntroduce',
        'brandWeb',
        'consultantPhone'
      ])

      const { logoUrl, officeUrl, environmentUrl } = this.handleImgUrl()

      let descList = []
      if (
        !eventList[0].eventName &&
				!eventList[0].eventTime &&
				!eventList[0].description
      ) {
        descList = []
      } else {
        let arr = eventList.filter(item => item.eventName !== '')
        descList = JSON.parse(JSON.stringify(arr))
        descList.map(
          item => (item.eventTime = moment(item.eventTime).format('YYYY-MM'))
        )
      }
      let param = {
        id: this.id,
        insId: this.insId, // bizid
        brandName: brandName,
        address: brandLoc,
        net: brandWeb,
        description: brandIntroduce,
        createBy: JSON.parse(Vue.ls.get('USERINFO')).username,
        tel: handlePhoneArr(),
        eventList: descList,
        logoUrl,
        officeUrl,
        environmentUrl,
        url: `${previewUrl}`
      }
      validateFields(async err => {
        if (!err) {
          try {
            const res = await insPreview(param)
            const { code, data, msg } = res
            if (code === 200) {
              handlePreviewImg(data)
            } else {
              throw new Error(msg)
            }
          } catch ({ message }) {
            error({
              message: message || '网络故障，请重试！'
            })
            this.subBtnVisible = true
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.businessBrandWrapper {
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
		}
		.textareaWrapper {
			.ant-form-item-control {
				textarea {
					max-width: 600px;
				}
				.ant-form-item-children {
					position: relative;
				}
				.tip {
					margin: 0;
					position: absolute;
					right: 15px;
					bottom: -35px;
				}
			}
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
			.preview {
				position: relative;
				z-index: 999;
			}
		}
	}
}
</style>
