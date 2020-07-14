<template>
	<div class="qualificationUploadWrapper">
		<h1>资质证书上传</h1>
		<a-card :bordered="false">
			<a-form layout="horizontal"
				:form="form">
				<a-form-item label="资质类型："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<a-select placeholder="请选择"
						v-decorator="['aptitudeName',
          {rules: [{ required: true, message: '请选择资质类型!', trigger: 'change' }]}
        ]"
						style="width:300px;">
						<a-select-option v-for="(item,index) in certTypeList"
							:key="index"
							:value="item.aptitudeType">{{item.aptitudeType}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<span slot='label'><em style="color:red;">*</em> 上传图片</span>
					<prev-img-upload uploadTitle="上传资质证书"
						:uploadInfo="uploadInfo"
						:beforeUpload="beforeUpload"
						@handlePreviewImg="handlePreviewImg"
						@handleDeleteUpload="handleDeleteUpload"
						@handleRemoveUpload="handleRemoveUpload"></prev-img-upload>
					<p style="color:red;margin:0;">图片尺寸：1080*1920(推荐)</p>
					<p style="color:red;margin:0;">图片格式：JPG,JPEG,PNG,GIF(图片大小不超过1MB)</p>
				</a-form-item>
			</a-form>
			<div class="btnWrapper">
				<a-button @click="handleReset">重置</a-button>
				<a-popconfirm title="确认信息无误并提交?"
					@confirm="handleSubmit"
					okText="是"
					cancelText="再看看">
					<a-button>提交</a-button>
				</a-popconfirm>
			</div>
			<s-table ref="table"
				rowKey="id"
				:columns="columns"
				:data="loadData"
				:pagination="pagination"
				bordered
				style="margin-top:20px;">
				<span slot="serial"
					slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<span slot="auditStatus"
					slot-scope="text"
					:style="{color: +text === 1 ? 'black;': +text === 2 ? 'blue':'red'}">
					{{+text === 1 ? '待审核': +text === 2 ? '审核通过':+text === 3 ?'审核驳回':'待上传'}}
				</span>
				<span slot="action"
					slot-scope="text, record">
					<template>
						<span style="margin-right:10px;"
							@click="handlePreviewImg(record)">查看</span>
						<a-popconfirm :title="`是否确定要删除？`"
							@confirm="handleDeleteUpload(record)"
							okText="确定"
							cancelText="取消">
							<span v-if="record.auditStatus === 2 || record.auditStatus === 3 ">删除</span>
						</a-popconfirm>
					</template>
				</span>
			</s-table>
		</a-card>
		<preview-img-modal :modalInfo="modalInfo"
			@handlePreviewCancel="obj => modalInfo = obj"></preview-img-modal>
	</div>
</template>

<script>
import Vue from 'vue'
import { STable, PrevImgUpload, PreviewImgModal } from '@/components'
import {
  uploadUrl,
  removeSingleCompanyAptitudePic,
  showCompanyAptitudeType,
  showCompanyAptitudes,
  removeCompanyAptitudePic
} from '@/api/qualificationUpload'
import { axios } from '@/utils/request'
export default {
  name: 'qualificationUpload',
  components: {
    STable,
    PrevImgUpload,
    PreviewImgModal
  },
  data () {
    return {
      form: this.$form.createForm(this),
      companyUrl: '',
      uploadUrl: '',
      uploadInfo: {
        fileList: [],
        showOffList: {}
      },
      aptitudeName: '',
      modalInfo: {
        rejectDescribe: '',
        title: '查看大图',
        previewVisible: false,
        src: ''
      },
      certTypeList: [],
      queryParam: {
        startPage: 1,
        pageSize: 10,
        companyUrl: ''
      },
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'aptitudeName',
          align: 'center'
        },
        {
          title: '上传日期',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '审核状态',
          dataIndex: 'auditStatus',
          align: 'center',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onShowSizeChange: (current, pageSize) =>
          (this.queryParam.pageSize = pageSize),
        onChange: page => (this.queryParam.startPage = page),
        showQuickJumper: true
      },
      loadData: () => {
        return showCompanyAptitudes(this.queryParam).then(res => {
          if (res.code === 200 && res.data) {
            if (res.data.pageNum > res.data.navigateLastPage) {
              // 解决当点击的页码超过实际页数重复请求bug
              this.queryParam.startPage = res.data.navigateLastPage
            }
            res.data.data = res.data.list
            res.data.pageNo = res.data.pageNum
            res.data.totalPage = res.data.pages
            res.data.totalCount = res.data.total

            delete res.data.list
            delete res.data.pageNum
            delete res.data.pages
            delete res.data.total

            return res.data
          } else {
            res.data = {}
            res.data.data = []
            res.data.pageNo = 0
            res.data.totalPage = 0
            res.data.totalCount = 0
            return res.data
          }
        })
      }
    }
  },
  created () {
    this.uploadUrl = uploadUrl
    this.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
    this.queryParam.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
    this.showCompanyAptitudeType()
  },
  methods: {
    async showCompanyAptitudeType () {
      try {
        let res = await showCompanyAptitudeType()
        const { code, data, msg } = res
        if (code === 200) {
          this.certTypeList = data
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    async handleGetPreviewUrl (file) {
      const {
        uploadUrl: { previewUrl }
      } = this
      const formData = new FormData()
      formData.append('files[]', file)
      try {
        const res = await await axios({
          url: `${previewUrl}${this.companyUrl}`,
          method: 'post',
          processData: false,
          data: formData
        })
        const { code, data, msg } = res
        if (code === 200) {
          this.uploadInfo.showOffList = data
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    beforeUpload (file) {
      const regp = /,|;/
      const bool = regp.test(file.name)
      if (bool) {
        this.$notification.error({
          message: '图片名称请不要带有 , 或者 ;特殊字符'
        })
        return false
      }
      this.uploadInfo.fileList = [...this.uploadInfo.fileList, file]
      this.handleGetPreviewUrl(file)
      return false
    },
    // 预览照片 - 打开
    handlePreviewImg (file) {
      this.modalInfo = {
        rejectDescribe: file.rejectDescribe,
        title: file.aptitudeName || '查看大图',
        src: file.winPath || file.aptitudeUrl.split(';')[0],
        previewVisible: true
      }
    },
    // 删除已上传
    async handleDeleteUpload (item) {
      try {
        let res = await removeCompanyAptitudePic({
          fileUrl: item.fileUrl || item.aptitudeUrl.split(';')[1],
          id: item.id
        })
        if (res.code === 200) {
          this.uploadInfo = {
            fileList: [],
            showOffList: {}
          }
          this.$refs.table.refresh(true)
        } else {
          throw new Error(res.msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '删除失败，请重试！'
        })
      }
    },
    handleRemoveUpload () {
      this.uploadInfo.fileList = []
    },
    handleReset () {
      const {
        form: { setFieldsValue },
        $refs: { table }
      } = this
      this.uploadInfo = {
        fileList: [],
        showOffList: {}
      }
      setFieldsValue({
        aptitudeName: undefined
      })
      table.refresh(true)
    },
    handleSubmit () {
      const {
        companyUrl,
        uploadInfo: { fileList },
        form: { validateFields, getFieldsValue, setFieldsValue },
        handleReset
      } = this
      const formData = new FormData()
      const aptitudeName = getFieldsValue(['aptitudeName']).aptitudeName
      if (!fileList.length) {
        this.$notification.error({
          message: '请上传证书！'
        })
        return
      }
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      validateFields(['aptitudeName'], async err => {
        if (!err) {
          try {
            this.uploading = true
            let param = `?aptitudeName=${aptitudeName}&companyUrl=${companyUrl}&creater=${
              JSON.parse(Vue.ls.get('USERINFO')).username
            }`
            const res = await axios({
              url: `${uploadUrl.logoUrl}${param}`,
              method: 'post',
              processData: false,
              data: formData
            })
            const { code, data, msg } = res

            if (code === 200) {
              this.uploading = false
              this.$notification.success({
                message: msg || '提交成功！'
              })
              handleReset()
            } else {
              this.uploading = false
              throw new Error(msg)
            }
          } catch ({ message }) {
            this.$notification.error({
              message: message || '提交失败，请重试!'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.qualificationUploadWrapper {
	// min-width: 1200px;
	h1 {
		font-size: 20px;
		font-weight: bold;
	}
	.btnWrapper {
		margin-top: 50px;
		.ant-btn {
			margin-right: 10px;
		}
	}
}
</style>
