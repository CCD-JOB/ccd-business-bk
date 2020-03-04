<template>
	<div class="singleImgUploadNewWrapper">
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
		<a-upload class="uploadBtn"
			v-else
			name="multipartFile"
			listType="picture-card"
			:headers='myHeaders'
			:action="actionUrl"
			:fileList="uploadInfo.fileList"
			:beforeUpload="beforeUpload"
			@preview="files => handlePreviewImg(files)"
			@change="files => handleUploadChange(files)"
			:remove="files => handleRemoveUpload(files)">
			<div class="wrapper"
				v-if="uploadInfo.fileList.length<1">
				<a-icon type="plus"></a-icon>
				<p className="ant-upload-text">{{title}}</p>
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
        this.$message.error('图片名称请不要带有 , 或者 ;特殊字符')
        return false
      }
      const isJPG =
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/gif' ||
				file.type === 'image/jpg'
      if (!isJPG) {
        this.$message.error('只能上传 jpg/jpeg/png/gif 格式的图片')
      }
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片必须小于1M!')
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
.singleImgUploadNewWrapper {
	.uploadBtn {
		width: 180px;
		height: 114px;
		// background-color: rgba(229, 229, 229, 1);
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
		.ant-upload-list-picture-card .ant-upload-list-item-info:before {
			left: 0;
			top: 0;
		}
		.ant-upload,
		.ant-upload-list-item {
			margin: 0;
			width: 180px;
			height: 114px;
			.ant-upload-list-item-info {
				span {
					width: 100%;
					height: 100%;
				}
			}
		}
		.wrapper {
			i {
				font-size: 30px;
				font-weight: bold;
				padding-bottom: 20px;
				color: rgba(128, 128, 128, 1);
			}
			p {
				font-size: 14px;
				color: rgba(80, 80, 80, 1);
			}
		}
	}
	.avatarWrapper {
		position: relative;
		display: inline-block;
		margin-right: 10px;
		margin-top: 10px;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		padding: 8px;
		width: 180px;
		height: 114px;
		img {
			width: 100%;
			height: 100%;
		}
		.mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
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
</style>
