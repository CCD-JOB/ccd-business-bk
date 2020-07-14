<template>
	<a-modal class="consultantUploadModal"
		:maskClosable="false"
		:footer="null"
		:title="consultantUploadModalTitle"
		:visible="uploadVisible"
		@cancel="handleUploadModalClose">
		<a-form layout="horizontal"
			:form="form">
			<div class="consultantFlex">
				<div>
					<div>
						<span>本地上传：</span>
						<a-upload :fileList="uploadInfo.fileList"
							:remove="handleRemove"
							:beforeUpload="beforeUpload"
							:disabled="uploadInfo.fileList.length !== 0">
							<a-button>
								<a-icon type="upload" />浏览
							</a-button>
						</a-upload>
					</div>
					<a-form-item label="证书类型："
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 15 }"
						style="margin-top:20px"
						v-if="uploadType==='cert'">
						<a-select style="width: 200px"
							placeholder="请选择"
							v-decorator="[
          'certInfo',
						{rules: [{ required: true, message: '请完善信息！', trigger: 'change' }]}
					]">
							<a-select-option v-for="item in list"
								:key="item.id"
								:value="item.competenceName">{{item.competenceName}}</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="证书名称："
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 15 }"
						style="margin-top:20px"
						v-else>
						<a-input type="text"
							placeholder='请填写证书完整名称，最多20个字'
							maxLength="20"
							style="width:200px;"
							v-decorator="[
          'honorInfo',
						{rules: [{ required: true, message: '请选择证书类型!', trigger: 'change' }]}
					]"></a-input>
					</a-form-item>
				</div>
			</div>
			<div class="btnFlex">
				<a-button type="primary"
					style="margin: 0 20px 0 0;"
					@click="handleUploadModalClose">
					取消
				</a-button>
				<a-button type="primary"
					@click="handleUpload"
					:loading="uploading"
					:disabled="uploadInfo.fileList.length === 0">
					{{uploading ? '上传中' : '提交' }}
				</a-button>
			</div>
		</a-form>
	</a-modal>
</template>

<script>
export default {
  props: [
    'consultantUploadModalTitle',
    'uploadVisible',
    'uploadInfo',
    'uploading',
    'uploadType',
    'list'
  ],
  data () {
    return {
      form: this.$form.createForm(this),
      info: ''
    }
  },
  methods: {
    // 上传弹框 - 浏览本地文本
    beforeUpload (file) {
      const regp = /,|;/
      const bool = regp.test(file.name)
      if (bool) {
        this.$notification.error({
          message: '图片名称请不要带有 , 或者 ;特殊字符'
        })
        return false
      }
      this.$emit('beforeUpload', [...this.uploadInfo.fileList, file])
      return false
    },
    handleRemove () {
      this.$emit('handleRemove')
    },
    handleUploadModalClose () {
      this.$emit('handleUploadModalClose')
    },
    handleUpload () {
      const {
        form: { validateFields }
      } = this
      validateFields(['honorInfo', 'certInfo'], (err, val) => {
        if (!err) {
          this.$emit('handleUpload', val)
        }
      })
    }
  }
}
</script>

<style lang="less">
.consultantUploadModal {
	.consultantFlex {
		display: flex;
		justify-content: space-around;
		align-items: center;
		img {
			width: 190px;
			height: 150px;
		}
	}
	.btnFlex {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}
}
</style>
