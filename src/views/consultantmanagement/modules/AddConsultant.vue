<template>
	<div class="AddConsultantWrapper">
		<h1>顾问管理 - 添加顾问</h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<a-form layout="horizontal"
				:form="form">
				<a-form-item class="imgUploaderWrapper"
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot='label'><em style="color:red;">*</em> 上传图片</span>
					<div style="display:flex;justify-content:flex-start">
						<div>
							<single-img-upload title="上传头像"
								:actionUrl="`${uploadUrl.avatarUrl}?id=${consultantId}`"
								:uploadInfo="uploadAvatarInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'avatar')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'avatar')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：168*168</p>
						</div>
						<div>
							<single-img-upload title="上传背景图"
								:actionUrl="`${uploadUrl.bgUrl}?id=${consultantId}`"
								:uploadInfo="uploadBgInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'bg')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'bg')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：750*510</p>
						</div>
					</div>
					<p style="color:red;margin:0;">图片格式：JPG , JPEG , PNG , GIF（单张图片上传大小不超过1MB）</p>
				</a-form-item>
				<a-form-item label="顾问姓名："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder="请填写真实姓名"
						maxLength="10"
						v-decorator="[
          'consultantName',
          {rules: [{ required: true, message: '请填写真实姓名!', trigger: 'change' }]}
        ]" />
				</a-form-item>
				<a-form-item label="所属公司："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input :value="queryParam.consultantCompany"
						disabled />
				</a-form-item>
				<a-form-item label="当前职位："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-input placeholder=" 请填写职位名称"
						maxLength="16"
						v-decorator="[
          'consultantPosition',
          {rules: [{ required: true, message: '请填写职位名称!', trigger: 'change' }]}
        ]" />
				</a-form-item>
				<a-form-item label="从业年份："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-date-picker :disabledDate="disabledDate"
						v-decorator="[
          'consultantStartJobDate',{rules: [{ required: true, message: '请选择从业年份!' }]}]" />
				</a-form-item>
				<a-form-item label="顾问认证："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-radio-group v-decorator="['consultantIsAuth', { initialValue: '0' },
            {rules: [{ required: true, message: '请选择是否已认证！', trigger: 'change',  }]}
          ]">
						<a-radio :value="'0'">未认证</a-radio>
						<a-radio :value="'1'">已认证</a-radio>
					</a-radio-group>
				</a-form-item>
				<phone-arr-s labelTitle="顾问电话"
					:isRequired="false"
					:mobileNumArr="mobileNumArr"
					:mobileNum="mobileNum"
					@handleAddPhone="handleAddPhone"
					@handleDelPhone="handleDelPhone">
				</phone-arr-s>
				<a-form-item class="textareaWrapper specialLabel"
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot="label">
						个人简介：
						<p>最多300字</p>
					</span>
					<a-textarea placeholder=" 请填写个人介绍，最多300字哦～"
						:autosize="{ minRows: 2, maxRows: 6 }"
						maxLength="300"
						v-decorator="[
							'consultantIntroduce',
							{rules: [{ required: true, message: '请输入个人简介！', trigger: 'change' }]}
						]"
						@change="e => handleIntroduceInput(e)" />
					<p class="tip">已填写{{hasInput}} / 300 字</p>
				</a-form-item>
				<a-form-item class="specialLabel"
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<div slot="label">
						个人标签：
						<p>最多10个</p>
					</div>
					<a-input-search placeholder="填写印象墙标签，逐个添加"
						maxLength="10"
						@search="handleAddTag"
						enterButton="添加"
						v-model="tagVal" />
					<span style="margin-left:10px;">注：单个标签最多10个字哦</span>
					<ul class="tagWrapper clearfix"
						v-if="queryParam.consultantTag.length">
						<li v-for="(item,index) in queryParam.consultantTag"
							:key="index">{{item}}
							<a-icon type="close"
								@click="handleDelTag(item)" />
						</li>
					</ul>
				</a-form-item>
				<a-form-item class="specialLabel"
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 22 }">
					<div slot="label">
						资质证书：
						<p>最多10个</p>
					</div>
					<modal-img-upload title="上传资质证书"
						:uploadInfo="uploadCertInfo"
						@handlePreviewImg="handlePreviewImg"
						@handleDeleteUpload="files => handleDeleteUpload(files,'cert')"
						@handleShowUploadModal="handleShowUploadModal('cert')"></modal-img-upload>
				</a-form-item>
				<a-form-item class="specialLabel"
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 22 }">
					<div slot="label">
						荣誉证书：
						<p>最多10个</p>
					</div>
					<modal-img-upload title="上传荣誉证书"
						:uploadInfo="uploadHonorInfo"
						@handlePreviewImg="handlePreviewImg"
						@handleDeleteUpload="files=>handleDeleteUpload(files,'honor')"
						@handleShowUploadModal="handleShowUploadModal('honor')"></modal-img-upload>
				</a-form-item>
				<job-exp :consultantCompanyExpNum="consultantCompanyExpNum"
					:consultantCompanyExp="consultantCompanyExp"
					@handleSaveJobExp="handleSaveJobExp"
					@handleAddConsultantCompanyExp="handleAddConsultantCompanyExp"
					@handleDelConsultantCompanyExp="handleDelConsultantCompanyExp">
				</job-exp>
				<a-card title="教育经历（最高学历）："
					style="margin-top:50px;width:900px">
					<school-exp @handleSchoolRangeChange="handleSchoolRangeChange"></school-exp>
				</a-card>
				<a-card title="风采展示（最多10个）："
					style="margin-top:50px;width:900px;">
					<a-form-item label="照片："
						class="imgUploaderWrapper"
						:label-col="{ span: 2 }"
						:wrapper-col="{ span: 22 }">
						<much-img-upload title="上传生活照/风采照"
							altTitle="生活照"
							:addNumLimit="10"
							:actionUrl="`${uploadUrl.lifeUrl}${consultantId}`"
							:uploadInfo="uploadLifeInfo"
							@handlePreviewImg="handlePreviewImg"
							@handleUploadChange="files=>handleUploadChange(files,'life')"
							@handleRemoveUpload="files=>handleRemoveUpload(files,'life')"></much-img-upload>
					</a-form-item>
				</a-card>
			</a-form>
			<div class="btnWrapper">
				<a-button @click="handleBack">返回</a-button>
				<a-button @click="handlePreviewAll">预览</a-button>
				<a-popconfirm title="确认信息无误并提交?"
					@confirm="handleSubmit"
					okText="是"
					cancelText="再看看">
					<a-button>提交</a-button>
				</a-popconfirm>
			</div>
		</a-card>
		<upload-modal :list="certList"
			:consultantUploadModalTitle="consultantUploadModalTitle"
			:uploadVisible="uploadVisible"
			:uploadInfo="uploadInfo"
			:uploading="uploading"
			:uploadType="uploadType"
			@handleRemove="handleRemoveHasUpload"
			@handleUploadModalClose="handleUploadModalClose"
			@beforeUpload="beforeUpload"
			@handleUpload="handleUpload" />
		<preview-img-modal :modalInfo="modalInfo"
			@handlePreviewCancel="obj => modalInfo = obj"></preview-img-modal>
	</div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { axios } from '@/utils/request'
import {
  PreviewImgModal,
  SingleImgUpload,
  MuchImgUpload,
  muchImgUpload,
  PhoneArrS
} from '@/components'
import { UploadModal, modalImgUpload, schoolExp, jobExp } from './../components'
import {
  addCompanyAdviser,
  uploadUrl,
  showCompetences,
  removeSingleCompetence,
  removeSingleHonour,
  removeSingleMien,
  removeSinglePic,
  addWorkExperience,
  removeWorkExperiences,
  editWorkExperience,
  editCompanyAdviser,
  getInfomationQrCode,
  previewAdviser
} from '@/api/consultantManagement'

export default {
  components: {
    PhoneArrS,
    schoolExp,
    jobExp,
    modalImgUpload,
    MuchImgUpload,
    SingleImgUpload,
    UploadModal,
    PreviewImgModal
  },
  data () {
    return {
      form: this.$form.createForm(this),
      consultantId: '',
      uploadUrl: '',
      companyUrl: '',
      consultantUploadModalTitle: '',
      hasInput: 0,
      tagVal: '',
      uploadType: 'cert',
      uploadVisible: false,
      uploading: false,
      mobileNum: 0,
      mobileNumArr: [],
      consultantCompanyExpNum: 0,
      consultantCompanyExp: [
        {
          id: '',
          name: '',
          join: undefined,
          left: undefined,
          position: '',
          isNow: false
        }
      ], // 工作经历
      certList: [], // 证书列表
      uploadInfo: {
        fileList: []
      },
      uploadAvatarInfo: {
        fileList: [],
        showOffList: []
      },
      uploadBgInfo: {
        fileList: [],
        showOffList: []
      },
      uploadLifeInfo: {
        fileList: [],
        showOffList: []
      },
      uploadCertInfo: {
        fileList: [],
        showOffList: []
      },
      uploadHonorInfo: {
        fileList: [],
        showOffList: []
      },
      modalInfo: {
        title: '查看大图',
        previewVisible: false,
        src: ''
      },
      queryParam: {
        id: '',
        consultantName: '',
        consultantCompany: '',
        consultantPosition: '',
        consultantStartJobDate: '',
        consultantIsAuth: '0',
        consultantPhone: '',
        consultantIntroduce: '',
        consultantTag: [],
        consultantCompanyExp: [],
        consultantSchoolName: '',
        consultantSchoolPro: '',
        consultantSchoolTop: '',
        consultantJoinSchoolDate: '',
        consultantLeftSchoolDate: ''
      }
    }
  },
  created () {
    this.uploadUrl = uploadUrl
    this.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
    this.getAnId()
  },
  methods: {
    // 获取id
    async getAnId () {
      try {
        const res = await addCompanyAdviser({ companyUrl: this.companyUrl })
        const {
          code,
          data: { id, companyName }
        } = res
        if (res.code === 200) {
          this.consultantId = id
          this.queryParam.consultantCompany = companyName
        } else {
          throw new Error(res.msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 获取证书列表
    async getShowCompetences () {
      try {
        const res = await showCompetences()
        const { code, data } = res
        if (res.code === 200) {
          this.certList = res.data
        } else {
          throw new Error(res.msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 上传弹框 - 展示
    handleShowUploadModal (type) {
      this.uploadType = type
      this.uploadVisible = true
      if (type === 'cert') {
        this.getShowCompetences()
        this.consultantUploadModalTitle = '资质证书上传'
        this.uploadInfo = { ...this.uploadCertInfo }
      } else {
        this.consultantUploadModalTitle = '荣誉证书上传'
        this.uploadInfo = { ...this.uploadHonorInfo }
      }
    },
    beforeUpload (arr) {
      const regp = /,|;/
      const bool = regp.test(arr[0].name)
      if (bool) {
        this.$notification.error({
          message: '图片名称请不要带有 , 或者 ;特殊字符'
        })
        return false
      }
      this.uploadInfo.fileList = arr
      if (this.uploadType === 'cert') {
        this.uploadCertInfo = { ...this.uploadInfo }
      } else {
        this.uploadHonorInfo = { ...this.uploadInfo }
      }
    },
    // 上传弹框 - 上传
    async handleUpload (info) {
      const {
        uploadInfo: { fileList }
      } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.uploading = true

      if (this.uploadType === 'cert') {
        let res = await axios({
          url: `${uploadUrl.certUrl}?id=${this.consultantId}&competenceName=${info.certInfo}`,
          method: 'post',
          processData: false,
          data: formData
        })
        if (res.code === 200) {
          this.uploading = false
          this.uploadInfo.fileList = []
          this.uploadCertInfo = { ...this.uploadInfo }
          res.data.name = info.certInfo
          this.uploadCertInfo.showOffList.push(res.data)
          if (this.uploadCertInfo.showOffList.length >= 10) {
            this.uploadVisible = false
          }
        } else {
          this.uploading = false
          this.$notification.error({
            message: res.msg || '上传失败，请重试！'
          })
        }
      } else {
        let res = await axios({
          url: `${uploadUrl.honorUrl}?id=${this.consultantId}&honourName=${info.honorInfo}`,
          method: 'post',
          processData: false,
          data: formData
        })
        if (res.code === 200) {
          this.uploading = false
          this.uploadInfo.fileList = []
          this.uploadHonorInfo = { ...this.uploadInfo }
          res.data.name = info.honorInfo
          this.uploadHonorInfo.showOffList.push(res.data)
          if (this.uploadHonorInfo.showOffList.length >= 10) {
            this.uploadVisible = false
          }
        } else {
          this.uploading = false
          this.$notification.error({
            message: res.msg || '上传失败，请重试！'
          })
        }
      }
    },
    // 上传弹框 - 关闭
    handleUploadModalClose () {
      this.uploadVisible = false
      this.uploading = false
      this.uploadInfo = { fileList: [] }
    },
    // 删除已上传
    async handleDeleteUpload (item, type) {
      if (type === 'cert') {
        let res = await removeSingleCompetence({
          fileUrl: item,
          id: this.consultantId
        })
        if (res.code === 200) {
          this.uploadCertInfo.showOffList = this.uploadCertInfo.showOffList.filter(
            pic => pic.fileUrl !== item
          )
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      } else if (type === 'honor') {
        let res = await removeSingleHonour({
          fileUrl: item,
          id: this.consultantId
        })
        if (res.code === 200) {
          this.uploadHonorInfo.showOffList = this.uploadHonorInfo.showOffList.filter(
            pic => pic.fileUrl !== item
          )
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      }
    },
    // 预览照片 - 打开
    handlePreviewImg (file) {
      this.modalInfo = {
        title: '查看大图',
        src: file.url || file.thumbUrl || file.winPath || file,
        previewVisible: true
      }
    },
    // 头像/背景 - 上传
    handleUploadChange ({ fileList }, type) {
      if (type === 'avatar') {
        this.uploadAvatarInfo.fileList = fileList
      } else if (type === 'bg') {
        this.uploadBgInfo.fileList = fileList
      } else if (type === 'life') {
        this.uploadLifeInfo.fileList = fileList
      }
    },
    handleRemoveHasUpload () {
      this.uploadInfo.fileList = []
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
      if (type === 'avatar') {
        let res = await removeSinglePic({
          fileUrl,
          id: this.consultantId,
          flag: 1
        })
        if (res.code === 200) {
          this.uploadAvatarInfo.fileList = []
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      } else if (type === 'bg') {
        let res = await removeSinglePic({
          fileUrl,
          id: this.consultantId,
          flag: 2
        })
        if (res.code === 200) {
          this.uploadBgInfo.fileList = []
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      } else if (type === 'life') {
        let res = await removeSingleMien({ fileUrl, id: this.consultantId })
        if (res.code === 200) {
          // this.uploadLifeInfo.fileList = []
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      }
    },
    // 简介 - 添加
    handleIntroduceInput (e) {
      this.hasInput = e.target.value.length
    },
    // 标签添加
    handleAddTag (val) {
      let result = val.trim()
      if (result === '') return
      if (this.queryParam.consultantTag.length >= 10) return
      this.queryParam.consultantTag.push(result)
      this.tagVal = ''
    },
    handleDelTag (el) {
      this.queryParam.consultantTag = this.queryParam.consultantTag.filter(
        item => item !== el
      )
    },
    // 手机 - 添加
    handleAddPhone () {
      const {
        form: { validateFields }
      } = this
      validateFields(['consultantPhone'], (err, val) => {
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
    // 手机 - 移除
    handleDelPhone () {
      this.mobileNum--
      this.mobileNumArr.pop()
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
    // 工作经历 - 新增一条
    handleAddConsultantCompanyExp () {
      let obj = this.consultantCompanyExp[this.consultantCompanyExpNum]
      if (
        obj.name === '' ||
				obj.join === undefined ||
				obj.join === null ||
				obj.position === ''
      ) {
        this.$notification.error({
          message: '请先补全工作经历！'
        })
        return
      }
      if ((obj.left === undefined || obj.left === null) && !obj.isNow) {
        this.$notification.error({
          message: '请先补全工作经历！'
        })
        return
      }
      if (!this.consultantCompanyExp[this.consultantCompanyExpNum].id) {
        this.$notification.error({
          message: '请先保存！'
        })
        return
      }
      this.consultantCompanyExpNum++
      this.consultantCompanyExp.push({
        id: '',
        name: '',
        join: undefined,
        left: undefined,
        position: '',
        isNow: false
      })
    },
    // 工作经历 - 保存/编辑
    async handleSaveJobExp (item) {
      if (
        item.name === '' ||
				item.join === undefined ||
				item.join === null ||
				item.position === ''
      ) {
        this.$notification.error({
          message: '单条工作经历请填写完整！'
        })
        return
      }
      if ((item.left === undefined || item.left === null) && !item.isNow) {
        this.$notification.error({
          message: '单条工作经历请填写完整！'
        })
        return
      }
      let param = {
        companyName: item.name,
        startTime: moment(item.join).format('YYYY-MM-DD'),
        endTime: moment(item.left).format('YYYY-MM-DD'),
        positionName: item.position,
        upToNow: +item.isNow
      }
      try {
        let res
        if (item.id !== '') {
          param.id = item.id
          res = await editWorkExperience(param)
        } else {
          param.adviserId = this.consultantId
          res = await addWorkExperience(param)
        }
        const { code, data, msg } = res
        if (code === 200) {
          if (item.id === '') item.id = data
          this.$notification.success({
            message: msg || '保存成功！'
          })
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 工作经历 - 删除
    async handleDelConsultantCompanyExp () {
      let obj = this.consultantCompanyExp[this.consultantCompanyExpNum]
      if (obj.id !== '') {
        try {
          let res = await removeWorkExperiences({ id: obj.id, state: 1 })
          if (res.code === 200) {
            this.consultantCompanyExpNum--
            this.consultantCompanyExp.pop()
          } else {
            throw new Error(res.msg)
          }
        } catch ({ message }) {
          this.$notification.error({
            message: message || '网络故障，请重试！'
          })
        }
      } else {
        this.consultantCompanyExpNum--
        this.consultantCompanyExp.pop()
      }
    },
    // 学校日期修改
    handleSchoolRangeChange (date, dateString) {
      this.queryParam.consultantJoinSchoolDate = dateString[0]
      this.queryParam.consultantLeftSchoolDate = dateString[1]
    },
    disabledDate (current) {
      return current && current > moment().endOf('day')
    },
    // 处理时间
    _handlePtime (value) {
      if (!value) return
      return moment(value).format('YYYY-MM-DD')
    },
    handleImgUrl () {
      const {
        uploadAvatarInfo,
        uploadBgInfo,
        uploadLifeInfo,
        uploadCertInfo,
        uploadHonorInfo
      } = this
      let headUrl = ''
      let backgroundUrl = ''
      if (
        uploadAvatarInfo.fileList.length &&
				uploadAvatarInfo.fileList[0].response
      ) {
        headUrl = `${uploadAvatarInfo.fileList[0].response.data.winPath};${uploadAvatarInfo.fileList[0].response.data.fileUrl}`
      } else if (uploadAvatarInfo.showOffList.winPath) {
        headUrl = `${uploadAvatarInfo.showOffList.winPath};${uploadAvatarInfo.showOffList.fileUrl}`
      } else {
        headUrl = ''
      }
      if (uploadBgInfo.fileList.length && uploadBgInfo.fileList[0].response) {
        backgroundUrl = `${uploadBgInfo.fileList[0].response.data.winPath};${uploadBgInfo.fileList[0].response.data.fileUrl}`
      } else if (uploadBgInfo.showOffList.winPath) {
        backgroundUrl = `${uploadBgInfo.showOffList.winPath};${uploadBgInfo.showOffList.fileUrl}`
      } else {
        backgroundUrl = ''
      }
      return { headUrl, backgroundUrl }
    },
    // 按钮组 - 提交
    handleSubmit () {
      const {
        form: { getFieldsValue, validateFields },
        $notification: { error, success }
      } = this
      let formObj = getFieldsValue([
        'consultantName',
        'consultantPosition',
        'consultantStartJobDate',
        'consultantIsAuth',
        'consultantPhone',
        'consultantIntroduce',
        'consultantSchoolName',
        'consultantSchoolPro',
        'consultantSchoolTop'
      ])
      if (
        Boolean(formObj.consultantSchoolName) ||
				Boolean(formObj.consultantSchoolPro) ||
				Boolean(formObj.consultantSchoolTop) ||
				Boolean(this.queryParam.consultantJoinSchoolDate)
      ) {
        if (
          Boolean(formObj.consultantSchoolName) === false ||
					Boolean(formObj.consultantSchoolPro) === false ||
					Boolean(formObj.consultantSchoolTop) === false ||
					Boolean(this.queryParam.consultantJoinSchoolDate) === false
        ) {
          this.$notification.error({
            message: '如填写教育经历，请写完整'
          })
          return
        }
      }

      this.queryParam.id = this.consultantId
      this.queryParam.consultantName = formObj.consultantName || ''
      this.queryParam.consultantPosition = formObj.consultantPosition || ''
      this.queryParam.consultantIsAuth =
				formObj.consultantIsAuth.toString() || ''
      this.queryParam.consultantStartJobDate = this._handlePtime(
        formObj.consultantStartJobDate
      )
      this.queryParam.consultantSchoolTop = formObj.consultantSchoolTop || ''
      this.queryParam.consultantSchoolName = formObj.consultantSchoolName || ''
      this.queryParam.consultantSchoolPro = formObj.consultantSchoolPro || ''
      this.queryParam.consultantIntroduce = formObj.consultantIntroduce || ''
      this.queryParam.consultantPhone = this.handlePhoneArr()
      this.queryParam.consultantCompanyExp = [...this.consultantCompanyExp]

      const { headUrl } = this.handleImgUrl()

      let param = {
        id: this.queryParam.id,
        headUrl: headUrl,
        adviserName: this.queryParam.consultantName,
        belongToCompany: this.queryParam.consultantCompany,
        currentPosition: this.queryParam.consultantPosition,
        yearOfEmployment: this.queryParam.consultantStartJobDate,
        adviserIdentification: this.queryParam.consultantIsAuth,
        phone: this.queryParam.consultantPhone,
        individualResume: this.queryParam.consultantIntroduce,
        personalLabel: this.queryParam.consultantTag.join(';') || '',
        schoolName: this.queryParam.consultantSchoolName,
        professionalTitle: this.queryParam.consultantSchoolPro,
        highestEducation: this.queryParam.consultantSchoolTop,
        startTime: this.queryParam.consultantJoinSchoolDate,
        endTime: this.queryParam.consultantLeftSchoolDate,
        creater: JSON.parse(Vue.ls.get('USERINFO')).username
      }

      validateFields(
        [
          'consultantName',
          'consultantPosition',
          'consultantStartJobDate',
          'consultantIsAuth',
          'consultantPhone',
          'consultantIntroduce'
        ],
        async err => {
          if (!err) {
            try {
              let res = await editCompanyAdviser(param)
              if (res.code === 200) {
                success({
                  message: res.msg || '添加成功，等待平台审核！'
                })
                this.$router.push({
                  path: '/consultantmanagement'
                })
              } else {
                throw new Error(res.msg)
              }
            } catch ({ message }) {
              this.$notification.error({
                message: message || '网络故障，请重试！'
              })
            }
          }
        }
      )
    },
    // 按钮组 - 返回
    handleBack () {
      this.$router.push('/consultantmanagement')
    },
    async handleGetCode () {
      try {
        const param = {
          id: this.consultantId,
          url: `${uploadUrl.code}${this.consultantId}`
        }
        const res = await getInfomationQrCode(param)
        const { code, data, msg } = res
        if (code === 200) {
          this.handlePreviewImg(data)
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 按钮组 - 预览
    handlePreviewAll () {
      const {
        form: { getFieldsValue, validateFields },
        $notification: { error, success },
        handleGetCode
      } = this
      let formObj = getFieldsValue([
        'consultantName',
        'consultantPosition',
        'consultantStartJobDate',
        'consultantIsAuth',
        'consultantPhone',
        'consultantIntroduce',
        'consultantSchoolName',
        'consultantSchoolPro',
        'consultantSchoolTop'
      ])

      this.queryParam.id = this.consultantId
      this.queryParam.consultantName = formObj.consultantName || ''
      this.queryParam.consultantPosition = formObj.consultantPosition || ''
      this.queryParam.consultantIsAuth =
				formObj.consultantIsAuth.toString() || ''
      this.queryParam.consultantStartJobDate = this._handlePtime(
        formObj.consultantStartJobDate
      )
      this.queryParam.consultantSchoolTop = formObj.consultantSchoolTop || ''
      this.queryParam.consultantSchoolName = formObj.consultantSchoolName || ''
      this.queryParam.consultantSchoolPro = formObj.consultantSchoolPro || ''
      this.queryParam.consultantIntroduce = formObj.consultantIntroduce || ''
      this.queryParam.consultantPhone = this.handlePhoneArr()
      this.queryParam.consultantCompanyExp = [...this.consultantCompanyExp]

      const { headUrl, backgroundUrl } = this.handleImgUrl()

      let param = {
        id: this.queryParam.id,
        headUrl: headUrl,
        backgroundUrl: backgroundUrl,
        adviserName: this.queryParam.consultantName,
        belongToCompany: this.queryParam.consultantCompany,
        currentPosition: this.queryParam.consultantPosition,
        yearOfEmployment: this.queryParam.consultantStartJobDate,
        adviserIdentification: this.queryParam.consultantIsAuth,
        phone: this.queryParam.consultantPhone,
        individualResume: this.queryParam.consultantIntroduce,
        personalLabel: this.queryParam.consultantTag.join(';') || '',
        schoolName: this.queryParam.consultantSchoolName,
        professionalTitle: this.queryParam.consultantSchoolPro,
        highestEducation: this.queryParam.consultantSchoolTop,
        startTime: this.queryParam.consultantJoinSchoolDate,
        endTime: this.queryParam.consultantLeftSchoolDate,
        creater: JSON.parse(Vue.ls.get('USERINFO')).username
      }

      validateFields(async err => {
        if (!err) {
          try {
            let res = await previewAdviser(param)
            if (res.code === 200) {
              handleGetCode()
            } else {
              throw new Error(res.msg)
            }
          } catch ({ message }) {
            this.$notification.error({
              message: message || '网络故障，请重试！'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.AddConsultantWrapper {
	// min-width: 1200px;
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
			.ant-form-item-label {
				label:after {
					content: '';
				}
			}
			.tagWrapper {
				margin: 0;
				padding: 0;
				li {
					margin: 0 10px 0 0;
					padding: 0 8px;
					list-style: none;
					float: left;
					background: #f0f0f0;
					i {
						color: red;
					}
				}
			}
		}
		.ant-input-affix-wrapper {
			width: 300px;
		}
		.imgUploaderWrapper {
			.ant-form-item-label {
				margin-top: 30px;
				text-align: center;
			}
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
		.btnWrapper {
			margin-top: 50px;
			.ant-btn {
				margin-right: 10px;
			}
		}
	}
}
</style>
