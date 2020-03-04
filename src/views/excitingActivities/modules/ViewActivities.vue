<template>
	<div class="checkExcitingActivityWrapper">
		<h1>精彩活动 - 查看精彩活动</h1>
		<a-card :bordered="false"
			class="mainWrapper">
			<h3 style="word-break:break-all;"
				v-if="activityInfo.approve === 3&&activityInfo.rejectDescribe">驳回原因：{{activityInfo.rejectDescribe}}</h3>
			<a-form layout="horizontal"
				:form="form">
				<a-form-item label="背景图片："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }"
					class="imgUploaderWrapper">
					<div style="display:flex;justify-content:flex-start;">
						<div class="avatarWrapper"
							v-if="activityInfo.titlePic !== ''"
							@click="handlePreviewImg(activityInfo.titlePic)">
							<img :src="activityInfo.titlePic"
								alt="LOGO">
							<div class="action">查看大图</div>
						</div>
					</div>
				</a-form-item>
				<a-form-item label="活动名称："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p>{{activityInfo.activityName}}</p>
				</a-form-item>
				<a-form-item label="活动时间："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p v-if="activityInfo.activityTime !== activityInfo.activityClosingTime">{{activityInfo.activityTime}} 至 {{activityInfo.activityClosingTime}}</p>
					<p v-else>{{activityInfo.activityTime}}</p>
				</a-form-item>
				<a-form-item label="活动地区："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p>{{activityInfo.activityArea}}</p>
				</a-form-item>
				<a-form-item label="活动地址："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p>{{activityInfo.activityAddress}}</p>
				</a-form-item>
				<a-form-item label="参与人数："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p>{{activityInfo.numberOfParticipants}}</p>
				</a-form-item>
				<a-form-item label="截止日期："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p>{{activityInfo.closingDate}}</p>
				</a-form-item>
				<a-form-item label="活动介绍："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<div class="introduceWrapper">
						<div v-html="activityInfo.activityIntroduce">
						</div>
					</div>
				</a-form-item>
				<a-form-item label="官方声明："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 12 }">
					<p class="officeWrapper">{{activityInfo.officialStatement}}</p>
				</a-form-item>
				<a-form-item label="操作："
					:label-col="{ span: 2 }"
					:wrapper-col="{ span: 22 }">
					<div class="btnWrapper">
						<a-button @click="handleBack">返回</a-button>
					</div>
				</a-form-item>
			</a-form>
		</a-card>
		<preview-img-modal :modalInfo="modalInfo"
			@handlePreviewCancel="obj => modalInfo = obj"></preview-img-modal>
	</div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { showSingleActivityInformation } from '@/api/excitingActivities'
import { mapState } from 'vuex'
import { PreviewImgModal } from '@/components/index'

export default {
  components: {
    PreviewImgModal
  },
  data () {
    return {
      id: '',
      userName: '',
      form: this.$form.createForm(this),
      activityInfo: {},
      checkRecord: {
        recordVisible: false,
        recordList: []
      },
      modalInfo: {
        title: '查看大图',
        previewVisible: false,
        src: ''
      },
      uploadInfo: {
        showOffList: []
      }
    }
  },
  created () {
    const { id } = this.$route.query
    this.id = id
    this.userName = JSON.parse(Vue.ls.get('USERINFO')).username
    this.getCheckInfo()
  },
  methods: {
    async getCheckInfo () {
      try {
        let res = await showSingleActivityInformation({ id: this.id })
        if (res.code === 200) {
          this.activityInfo = res.data
          const { titlePic } = this.activityInfo
          if (titlePic !== '') {
            this.activityInfo.titlePic = titlePic.split(';')[0]
          }
        } else {
          throw new Error(res.msg)
        }
      } catch (error) {
        this.$notification.error({
          message: error || '网络故障，请重试！'
        })
      }
    },
    // 预览照片 - 打开
    handlePreviewImg (file) {
      this.modalInfo = {
        title: file.name || '查看大图',
        src: file,
        previewVisible: true
      }
    },
    handleBack () {
      const {
        $route: {
          query: { type }
        }
      } = this
      this.$router.push({
        path: '/excitingActivities'
      })
    }
  }
}
</script>

<style lang="less">
.checkExcitingActivityWrapper {
	h1 {
		font-size: 20px;
		font-weight: bold;
	}
	.mainWrapper {
		.introduce {
			padding: 10px;
			border: 1px solid #ccc;
		}
		h3 {
			color: red;
			padding: 10px;
			border: 1px solid red;
		}
		.imgUploaderWrapper {
			.ant-form-item-label {
				margin-top: 35px;
			}
			.avatarWrapper {
				margin-right: 20px;
				position: relative;
				img {
					width: 104px;
					height: 104px;
				}
				.action {
					position: absolute;
					bottom: 0;
					right: 0;
					color: #fff;
					background: rgba(0, 0, 0, 0.7);
					font-size: 12px;
					padding: 2px 3px;
					line-height: 12px;
				}
			}
		}
		.introduceWrapper {
			width: 100%;
			height: 500px;
			padding: 10px;
			border: 1px solid #000;
			overflow-y: scroll;
			word-break: break-all;
		}
		.officeWrapper {
			word-break: break-all;
		}
		.certWrapper {
			margin: 0;
			padding: 0;
			li {
				list-style: none;
				margin: 0;
				float: left;
				margin-right: 20px;
				position: relative;
				img {
					width: 184px;
					height: 86px;
				}
				.name {
					margin-top: 10px;
					line-height: 16px;
					height: 30px;
					line-height: 30px;
					color: #000;
					text-align: center;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.action {
					position: absolute;
					bottom: 40px;
					right: 0;
					color: #fff;
					background: rgba(0, 0, 0, 0.7);
					font-size: 12px;
					padding: 2px 3px;
					line-height: 12px;
				}
			}
		}

		.workExpWrapper {
			p {
				span {
					margin-right: 20px;
				}
			}
		}

		.btnWrapper {
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
