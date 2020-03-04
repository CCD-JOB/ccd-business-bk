<template>
	<div class="muchImgUploadWrapper">
		<ul class="lifeWrapper clearfix">
			<li v-for="item in uploadInfo.showOffList"
				:key="item.id">
				<img :src="item.winPath"
					:alt="altTitle">
				<div class="mask">
					<a-icon type="eye"
						@click="handlePreviewImg(item)" />
					<a-icon type="delete"
						@click="handleDeleteUpload(item)" />
				</div>
			</li>
		</ul>
		<a-upload class="uploadSpecialWrapper"
			name="multipartFile"
			listType="picture-card"
			:headers='myHeaders'
			:action="actionUrl"
			:fileList="uploadInfo.fileList"
			:beforeUpload="beforeUpload"
			@preview="files => handlePreviewImg(files)"
			@change="files => handleUploadChange(files)"
			:remove="files => handleRemoveUpload(files)">
			<div v-if="addIconVisible">
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
  props: ['title', 'actionUrl', 'uploadInfo', 'altTitle', 'addNumLimit'],
  data () {
    return {
      myHeaders: { Authorization: Vue.ls.get(ACCESS_TOKEN) } // 上传图片用到
    }
  },
  computed: {
    addIconVisible () {
      const {
        uploadInfo: { showOffList, fileList }
      } = this
      return showOffList.length + fileList.length < this.addNumLimit
    }
  },
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
.muchImgUploadWrapper {
	line-height: 0;
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
	.uploadSpecialWrapper {
		// .ant-upload {
		// 	width: 200px;
		// }
		// .ant-upload-list-picture-card {
		// 	margin-bottom: 5px;
		// }
	}
}
</style>
