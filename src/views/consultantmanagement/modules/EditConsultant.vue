<template>
	<div class="EditConsultantWrapper">
		<div class="disableMask"
			v-if="!subBtnVisible"></div>
		<h1>顾问管理 - 编辑顾问<span v-if="!subBtnVisible"> - 此模块正在审核中，请耐心等待。。。</span></h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<h3 class="info"
				v-if="examineState === 3">驳回原因：{{rejectReason}}</h3>
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
								@handleRemoveUpload="files=>handleRemoveUpload(files,'avatar')"
								@handleDeleteUpload="files => handleDeleteUpload(files,'avatar')">
							</single-img-upload>
							<p style="color:red;margin:0;">图片尺寸：168*168</p>
						</div>
						<div>
							<single-img-upload title="上传背景图"
								:actionUrl="`${uploadUrl.bgUrl}?id=${consultantId}`"
								:uploadInfo="uploadBgInfo"
								@handlePreviewImg="handlePreviewImg"
								@handleUploadChange="files=>handleUploadChange(files,'bg')"
								@handleRemoveUpload="files=>handleRemoveUpload(files,'bg')"
								@handleDeleteUpload="files => handleDeleteUpload(files,'bg')">
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
						v-decorator="['consultantStartJobDate',{rules: [{ required: true, message: '请选择从业年份!' }]}]" />
				</a-form-item>
				<a-form-item label="顾问认证："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-radio-group v-decorator="[
          'consultantIsAuth', { initialValue: '0' },
          {rules: [{ required: true, message: '请选择是否已认证！', trigger: 'change' }]}
        ]">
						<a-radio :value="'0'">未认证</a-radio>
						<a-radio :value="'1'">已认证</a-radio>
					</a-radio-group>
				</a-form-item>
				<phone-arr-s labelTitle="顾问电话"
					:isRequired="true"
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
						@change="e=>handleIntroduceInput(e)" />
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
					<span style="margin-left:10px;">注：单个标签最多6个字哦</span>
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
					@handleJobRangeChange="handleJobRangeChange"
					@handleSaveJobExp="handleSaveJobExp"
					@handleAddConsultantCompanyExp="handleAddConsultantCompanyExp"
					@handleDelConsultantCompanyExp="handleDelConsultantCompanyExp"></job-exp>
				<a-card title="教育经历（最高学历）："
					style="margin-top:50px">
					<school-exp :schoolExpRange="schoolExpRange"
						@handleSchoolRangeChange="handleSchoolRangeChange"></school-exp>
				</a-card>
				<a-card title="风采展示（最多10个）："
					style="margin-top:50px">
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
							@handleRemoveUpload="files=>handleRemoveUpload(files,'life')"
							@handleDeleteUpload="files => handleDeleteUpload(files,'life')"></much-img-upload>
					</a-form-item>
				</a-card>
			</a-form>
			<div class="btnWrapper">
				<a-button @click="handleBack"
					style="position:relative;z-index:999;">返回</a-button>
				<a-button @click="handlePreviewAll"
					style="position:relative;z-index:999;">预览</a-button>
				<a-popconfirm v-if="subBtnVisible"
					title="确认信息无误并提交?"
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
			@handleUpload="handleUpload"></upload-modal>
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
  showWorkExperiences,
  showSingleCompanyAdviser,
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
      subBtnVisible: true,
      examineState: 1,
      rejectReason: '',
      consultantId: '',
      uploadUrl: '',
      consultantUploadModalTitle: '',
      hasInput: 0,
      tagVal: '',
      uploadType: 'cert',
      uploadVisible: false,
      uploading: false,

      mobileNum: 0,
      mobileNumArr: [],
      certList: [],
      consultantCompanyExpNum: 0,
      consultantCompanyExp: [
        {
          id: '',
          name: '',
          join: '',
          left: '',
          position: '',
          isNow: false,
          jobExpRange: []
        }
      ],
      uploadInfo: {
        fileList: [] // 上传的图片列表
      },
      uploadAvatarInfo: {
        fileList: [], // 上传的图片列表
        showOffList: [] // 展示的图片列表
      },
      uploadBgInfo: {
        fileList: [], // 上传的图片列表
        showOffList: [] // 展示的图片列表
      },
      uploadLifeInfo: {
        fileList: [], // 上传的图片列表
        showOffList: [] // 展示的图片列表
      },
      uploadCertInfo: {
        fileList: [], // 上传的图片列表
        showOffList: [] // 展示的图片列表
      },
      uploadHonorInfo: {
        fileList: [], // 上传的图片列表
        showOffList: [] // 展示的图片列表
      },
      modalInfo: {
        title: '查看大图',
        previewVisible: false,
        src: ''
      },
      queryParam: {
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
      },
      schoolExpRange: []
    }
  },
  created () {
    this.consultantId = this.$route.query.id
    this.uploadUrl = uploadUrl
    this.getInfo()
    this.getShowWorkExperiences()
  },
  methods: {
    async getInfo () {
      const {
        consultantId,
        form: { setFieldsValue },
        backupSchoolExp,
        backupPhoneArr,
        backupaAvatarInfo,
        backupaBgInfo,
        backupaLifeInfo,
        backupaCertInfo,
        backupaHonorInfo
      } = this
      try {
        const res = await showSingleCompanyAdviser({ id: consultantId })
        const { code, data, msg } = res
        if (res.code === 200) {
          setFieldsValue({
            consultantName: data.adviserName,
            consultantPosition: data.currentPosition,
            consultantStartJobDate: moment(data.yearOfEmployment),
            consultantIsAuth: data.adviserIdentification,
            consultantPhone: data.phone ? data.phone.split(';')[0] : '',
            consultantIntroduce: data.individualResume,
            consultantSchoolName: data.schoolName,
            consultantSchoolPro: data.professionalTitle,
            consultantSchoolTop: data.highestEducation
          })
          this.subBtnVisible = data.approve !== 1
          this.examineState = data.approve
          this.rejectReason = data.rejectDescribe
          this.hasInput = data.individualResume.length
          this.queryParam.consultantTag = data.personalLabel.split(';') || []
          this.queryParam.consultantCompany = data.belongToCompany
          this.schoolExpRange = backupSchoolExp(data)
          this.mobileNumArr = backupPhoneArr(data) || []
          this.uploadAvatarInfo.showOffList = backupaAvatarInfo(data)
          this.uploadBgInfo.showOffList = backupaBgInfo(data)
          this.uploadLifeInfo.showOffList = backupaLifeInfo(data)
          this.uploadCertInfo.showOffList = backupaCertInfo(data)
          this.uploadHonorInfo.showOffList = backupaHonorInfo(data)
        } else {
          throw new Error(msg)
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
        const { code, data, msg } = res
        if (code === 200) {
          this.certList = data
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 获取工作经历
    async getShowWorkExperiences () {
      try {
        const res = await showWorkExperiences({ adviserId: this.consultantId })
        const { code, data, msg } = res
        if (code === 200) {
          this.consultantCompanyExp = this.backupJobExp(data)
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    // 回绑头像
    backupaAvatarInfo ({ headUrl }) {
      if (headUrl) {
        let arr = headUrl.split(';')
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
    // 回绑背景
    backupaBgInfo ({ backgroundUrl }) {
      if (backgroundUrl) {
        let arr = backgroundUrl && backgroundUrl.split(';')
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
    // 回绑风采
    backupaLifeInfo ({ mienUrlList }) {
      if (mienUrlList) {
        mienUrlList.map(item => {
          item.fileUrl = item.filePath
        })
        return mienUrlList
      }
      return []
    },
    // 回绑证书
    backupaCertInfo ({ competenceUrlList }) {
      if (competenceUrlList) {
        competenceUrlList.map(item => {
          item.fileUrl = item.filePath
        })
        return competenceUrlList
      }
      return []
    },
    // 回绑荣誉
    backupaHonorInfo ({ honourUrlList }) {
      if (honourUrlList) {
        honourUrlList.map(item => {
          item.fileUrl = item.filePath
        })
        return honourUrlList
      }
      return []
    },
    // 回绑手机号
    backupPhoneArr ({ phone }) {
      if (!phone) return
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
    // 回绑工作经历
    backupJobExp (data) {
      if (!data.length) {
        this.consultantCompanyExpNum = data.length
        return [
          {
            id: '',
            name: '',
            join: '',
            left: '',
            position: '',
            isNow: false,
            jobExpRange: []
          }
        ]
      }
      this.consultantCompanyExpNum = data.length - 1
      data.map(item => {
        item.name = item.companyName
        item.join = item.startTime
        item.left = item.endTime
        item.position = item.positionName
        item.isNow = Boolean(item.upToNow)
        item.jobExpRange = [moment(item.startTime), moment(item.endTime)]
      })
      return data
    },
    // 回绑学校经历
    backupSchoolExp ({ startTime, endTime }) {
      if (startTime !== '') {
        this.queryParam.consultantJoinSchoolDate = startTime
        this.queryParam.consultantLeftSchoolDate = endTime
        return [moment(startTime), moment(endTime)]
      }
      return []
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
        this.$message.error('图片名称请不要带有 , 或者 ;特殊字符')
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
        uploadInfo: { fileList },
        $notification: { error }
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
          error({
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
          error({
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
      if (type === 'avatar') {
        let res = await removeSinglePic({
          fileUrl: item,
          id: this.consultantId,
          flag: 1
        })
        if (res.code === 200) {
          this.uploadAvatarInfo.showOffList = {}
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      } else if (type === 'bg') {
        let res = await removeSinglePic({
          fileUrl: item,
          id: this.consultantId,
          flag: 2
        })
        if (res.code === 200) {
          this.uploadBgInfo.showOffList = {}
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      } else if (type === 'life') {
        let res = await removeSingleMien({
          fileUrl: item.fileUrl,
          id: this.consultantId
        })
        if (res.code === 200) {
          this.uploadLifeInfo.showOffList = this.uploadLifeInfo.showOffList.filter(
            pic => pic.fileUrl !== item.fileUrl
          )
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      } else if (type === 'cert') {
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
    // 预览照片 - 关闭
    handlePreviewCancel () {
      this.modalInfo = {
        src: '',
        previewVisible: false
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
				obj.join === '' ||
				obj.left === '' ||
				obj.position === ''
      ) {
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
        join: '',
        left: '',
        position: '',
        isNow: false
      })
    },
    // 工作经历 - 保存/编辑
    async handleSaveJobExp (item) {
      if (
        item.name === '' ||
				item.join === '' ||
				item.left === '' ||
				item.position === ''
      ) {
        this.$notification.error({
          message: '单条工作经历请填写完整！'
        })
        return
      }
      if (item.id !== '') {
        let param = {
          id: item.id,
          companyName: item.name,
          startTime: item.join,
          endTime: item.left,
          positionName: item.position,
          upToNow: +item.isNow
        }
        try {
          const res = await editWorkExperience(param)
          const { code, data, msg } = res
          if (code === 200) {
            this.$notification.success({
              message: res.msg || '更新成功！'
            })
          } else {
            throw new Error(msg)
          }
        } catch ({ message }) {
          this.$notification.error({
            message: message || '网络故障，请重试！'
          })
        }
      } else {
        let param = {
          adviserId: this.consultantId,
          companyName: item.name,
          startTime: item.join,
          endTime: item.left,
          positionName: item.position,
          upToNow: +item.isNow
        }
        try {
          const res = await addWorkExperience(param)
          const { code, data, msg } = res
          if (code === 200) {
            item.id = res.data
            this.$notification.success({
              message: res.msg || '保存成功！'
            })
          } else {
            throw new Error(msg)
          }
        } catch ({ message }) {
          this.$notification.error({
            message: message || '网络故障，请重试！'
          })
        }
      }
    },
    // 工作经历 - 删除
    async handleDelConsultantCompanyExp () {
      let obj = this.consultantCompanyExp[this.consultantCompanyExpNum]
      if (obj.id !== '') {
        let res = await removeWorkExperiences({ id: obj.id, state: 1 })
        try {
          const res = await removeWorkExperiences({ id: obj.id, state: 1 })
          const { code, msg } = res
          if (code === 200) {
            this.consultantCompanyExpNum--
            this.consultantCompanyExp.pop()
          } else {
            throw new Error(msg)
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
    disabledDate (current) {
      return current && current > moment().endOf('day')
    },
    // 处理时间
    _handlePtime (value) {
      if (!value) return
      return moment(value).format('YYYY-MM-DD')
    },
    // 工作日期修改
    handleJobRangeChange (date, dateString, item) {
      item.join = dateString[0]
      item.left = dateString[1]
      item.jobExpRange = date
    },
    // 学校日期修改
    handleSchoolRangeChange (date, dateString) {
      this.queryParam.consultantJoinSchoolDate = dateString[0]
      this.queryParam.consultantLeftSchoolDate = dateString[1]
      this.schoolExpRange = date
    },
    handleImgUrl () {
      const { uploadAvatarInfo, uploadBgInfo } = this
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
        }
      }
      const { headUrl } = this.handleImgUrl()
      this.queryParam.id = this.consultantId
      this.queryParam.consultantName = formObj.consultantName || ''
      this.queryParam.consultantPosition = formObj.consultantPosition || ''
      this.queryParam.consultantIsAuth =
				formObj.consultantIsAuth.toString() || ''
      this.queryParam.consultantStartJobDate = formObj.consultantStartJobDate
      this.queryParam.consultantSchoolTop = formObj.consultantSchoolTop || ''
      this.queryParam.consultantSchoolName = formObj.consultantSchoolName || ''
      this.queryParam.consultantSchoolPro = formObj.consultantSchoolPro || ''
      this.queryParam.consultantIntroduce = formObj.consultantIntroduce || ''
      this.queryParam.consultantPhone = this.handlePhoneArr()
      this.queryParam.consultantCompanyExp = [...this.consultantCompanyExp]

      let param = {
        id: this.queryParam.id,
        headUrl: headUrl,
        adviserName: this.queryParam.consultantName,
        belongToCompany: this.queryParam.consultantCompany,
        currentPosition: this.queryParam.consultantPosition,
        yearOfEmployment: moment(this.queryParam.consultantStartJobDate).format(
          'YYYY-MM-DD'
        ),
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
              const res = await editCompanyAdviser(param)
              const { code, data, msg } = res
              if (code === 200) {
                success({
                  message: msg || '修改成功，等待平台审核！'
                })
                this.$router.push({
                  path: '/consultantmanagement'
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
      this.queryParam.consultantStartJobDate = formObj.consultantStartJobDate
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
        yearOfEmployment: moment(this.queryParam.consultantStartJobDate).format(
          'YYYY-MM-DD'
        ),
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
            const res = await previewAdviser(param)
            const { code, data, msg } = res
            if (code === 200) {
              handleGetCode()
            } else {
              throw new Error(msg)
            }
          } catch ({ message }) {
            error({
              message: message || '网络故障，请重试！'
            })
          }
        }
      })
    },
    // 按钮组 - 返回
    handleBack () {
      this.$router.push('/consultantmanagement')
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
				content: '：';
			}
		}
		.ant-input {
			max-width: 300px;
			min-width: 300px;
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
		.uploadSpecialWrapper {
			.ant-upload {
				width: 200px;
			}
		}
		.phoneWrapper {
			.anticon-plus-square,
			.anticon-minus-square {
				font-size: 20px;
				margin-left: 10px;
			}
		}
		.ant-input-affix-wrapper {
			width: 300px;
		}
		.lifeWrapper {
			margin: 0;
			padding: 0;
			display: inline-block;
			li {
				position: relative;
				list-style: none;
				margin: 0;
				padding: 0;
				float: left;
				margin-right: 10px;
				margin-bottom: 10px;
				border: 1px solid #d9d9d9;
				border-radius: 4px;
				padding: 8px;
				img {
					width: 86px;
					height: 86px;
				}
				.mask {
					position: absolute;
					top: 8px;
					left: 8px;
					right: 8px;
					bottom: 8px;
					background: rgba(0, 0, 0, 0.5);
					display: none;
					align-items: center;
					justify-content: center;
					i {
						font-size: 16px;
						color: #fff;
						margin: 0 3px;
					}
				}
				&:hover {
					.mask {
						display: flex;
					}
				}
			}
		}
		.avatarWrapper {
			position: relative;
			margin-right: 10px;
			border: 1px solid #d9d9d9;
			border-radius: 4px;
			padding: 8px;
			img {
				width: 86px;
				height: 86px;
			}
			.mask {
				position: absolute;
				top: 8px;
				left: 8px;
				right: 8px;
				bottom: 8px;
				background: rgba(0, 0, 0, 0.5);
				display: none;
				align-items: center;
				justify-content: center;
				i {
					font-size: 16px;
					color: #fff;
					margin: 0 3px;
				}
			}
			&:hover {
				.mask {
					display: flex;
				}
			}
		}
		.imgUpWrapper {
			margin: 0;
			padding: 0;
			li {
				position: relative;
				list-style: none;
				margin: 0;
				padding: 8px;
				float: left;
				margin-right: 10px;
				border: 1px solid #d9d9d9;
				border-radius: 4px;
				img {
					width: 184px;
					height: 86px;
				}
				.mask {
					position: absolute;
					top: 8px;
					left: 8px;
					right: 8px;
					bottom: 8px;
					background: rgba(0, 0, 0, 0.6);
					display: none;
					align-items: center;
					justify-content: center;
					i {
						font-size: 18px;
						color: #fff;
						margin: 0 3px;
					}
				}
				&:hover {
					.mask {
						display: flex;
					}
				}
				&.uploadBtnWrapper {
					width: 200px;
					height: 104px;
					display: table-cell;
					text-align: center;
					vertical-align: middle;
					padding: 8px;
					border: 1px dashed #d9d9d9;
					background-color: #fafafa;
					border-radius: 4px;
				}
			}
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
.consultantPreviewModal {
	.ant-modal-body {
		text-align: center;
		padding: 35px;
	}
}
</style>
