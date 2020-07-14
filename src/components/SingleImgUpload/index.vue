<template>
	<div class="singleImgUploadWrapper">
		<div class="avatarWrapper"
			v-if="uploadInfo.showOffList.winPath">
			<img :src="uploadInfo.showOffList.winPath"
				alt="头像">
			<div class="mask">
				<a-icon type="eye"
					@click="handlePreviewImg(uploadInfo.showOffList)" />
				<a-icon type="delete"
					@click="handleDeleteUpload(uploadInfo.showOffList.fileUrl)" />
			</div>
		</div>
		<a-upload class="uploadWrapper"
			v-else
			name="multipartFile"
			listType="picture-card"
			:headers='myHeaders'
			:action="actionUrl"
			:beforeUpload="beforeUpload"
			:fileList="uploadInfo.fileList"
			@preview="files => handlePreviewImg(files)"
			@change="files => handleUploadChange(files)"
			:remove="files => handleRemoveUpload(files)">
			<div v-if="uploadInfo.fileList.length<1">
				<a-icon type="plus"></a-icon>
				<div className="ant-upload-text">{{title}}</div>
			</div>
		</a-upload>
	</div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  data () {
    return {
      myHeaders: { Authorization: Vue.ls.get(ACCESS_TOKEN) } // 上传图片用到
    }
  },
  props: ['title', 'actionUrl', 'uploadInfo'],
  methods: {
    beforeUpload (file) {
      const regp = /,|;/
      const bool = regp.test(file.name)
      if (bool) {
        this.$notification.error({
          message: '图片名称请不要带有 , 或者 ;特殊字符'
        })
        return false
      }
      const isJPG =
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/gif' ||
				file.type === 'image/jpg'
      if (!isJPG) {
        this.$notification.error({
          message: '只能上传 jpg/jpeg/png/gif 格式的图片'
        })
      }
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$notification.error({
          message: '图片必须小于1M'
        })
      }
      return isJPG && isLt1M
    },
    handleDeleteUpload (files) {
      this.$emit('handleDeleteUpload', files)
    },
    handlePreviewImg (files) {
      this.$emit('handlePreviewImg', files)
    },
    handleUploadChange (files) {
      this.$emit('handleUploadChange', files)
    },
    handleRemoveUpload (files) {
      this.$emit('handleRemoveUpload', files)
    }
  }
}
</script>

<style lang="less">
.singleImgUploadWrapper {
	.avatarWrapper {
		position: relative;
		margin-right: 10px;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		padding: 8px;
		display: inline-block;
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
	.ant-upload.ant-upload-select-picture-card {
		margin-bottom: 0;
	}
}
</style>
