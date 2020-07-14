<template>
	<div class="modalImgUploadWrapper">
		<ul class="imgUpWrapper clearfix">
			<li v-for="item in uploadInfo.showOffList"
				:key="item.uuid">
				<img :src="item.winPath"
					alt="资质">
				<div class="name">{{item.name}}</div>
				<div class="mask">
					<a-icon type="eye"
						@click="handlePreviewImg(item)" />
					<a-icon type="delete"
						@click="handleDeleteUpload(item.fileUrl)" />
				</div>
			</li>
			<li class="uploadBtnWrapper"
				@click="handleShowUploadModal"
				v-if="uploadInfo.showOffList.length<10">
				<a-icon type="plus"></a-icon>
				<div className="ant-upload-text">{{title}}</div>
			</li>
		</ul>
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
  props: ['title', 'uploadInfo'],
  methods: {
    handlePreviewImg (files) {
      this.$emit('handlePreviewImg', files)
    },
    handleShowUploadModal () {
      this.$emit('handleShowUploadModal')
    },
    handleDeleteUpload (files) {
      this.$emit('handleDeleteUpload', files)
    }
  }
}
</script>

<style lang="less">
.modalImgUploadWrapper {
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
			width: 184px;
			img {
				width: 166px;
				height: 86px;
			}
			.name {
				position: absolute;
				bottom: 8px;
				left: 8px;
				right: 8px;
				height: 30px;
				line-height: 30px;
				background: rgba(0, 0, 0, 0.6);
				color: #fff;
				text-align: center;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
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
}
</style>
