<template>
	<div class="specicalServiceWrapper">
		<div class="disableMask"
			v-if="!subBtnVisible">
		</div>
		<h1>企业特色服务<span v-if="!subBtnVisible"> - 此模块正在审核中，请耐心等待。。。</span></h1>
		<a-card :bordered="false">
			<h3 class="info"
				v-if="examineState === 3">驳回原因：{{rejectReason}}</h3>
			<a-row>
				<a-col :span="12">
					<h3>请填写企业主页特色服务项目：</h3>
					<a-input-group compact>
						<a-input v-for="(item, index) in existTag"
							maxLength="6"
							:key="index"
							v-model="existTag[index]"
							placeholder="请输入" />
					</a-input-group>
				</a-col>
				<a-col :span="12">
					<h3>预计效果：</h3>
					<img :src="imgUrl"
						alt="示例">
				</a-col>
			</a-row>
			<div>
				<a-popconfirm v-if="subBtnVisible"
					title="确认信息无误并提交?"
					@confirm="handleSubmit"
					okText="是"
					cancelText="再看看">
					<a-button>{{isNew?'提交':'更新'}}</a-button>
				</a-popconfirm>
			</div>
		</a-card>
	</div>
</template>

<script>
import Vue from 'vue'
import {
	showCompanyFeatures,
	addCompanyFeatures,
	editCompanyFeatures
} from '@/api/specicalService'
export default {
	name: 'specicalService',
	data() {
		return {
			examineState: 1,
			rejectReason: '',
			subBtnVisible: true,
			imgUrl: require('./img/special.png'),
			existTag: ['', '', '', '', '', '', '', '', ''],
			isNew: false,
			username: '',
			companyUrl: ''
		}
	},
	created() {
		this.username = JSON.parse(Vue.ls.get('USERINFO')).username
		this.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
		this.showCompanyFeatures()
	},
	methods: {
		async showCompanyFeatures() {
			try {
				const res = await showCompanyFeatures({
					companyUrl: this.companyUrl
				})
				const { code, data, msg } = res
				if (code === 200) {
					if (data) {
						this.isNew = false
						this.existTag = data.characteristicService
							? data.characteristicService.split(';')
							: []
						this.examineState = data.auditStatus
						this.rejectReason = data.rejectDescribe
						this.subBtnVisible = data.auditStatus !== 1
						let len = 9 - this.existTag.length
						if (len !== 0) {
							for (var i = 0; i < len; i++) {
								this.existTag.push('')
							}
						}
					}
				} else if (code === 70027) {
					this.isNew = true
				} else {
					throw new Error(msg)
				}
			} catch ({ message }) {
				this.$notification.error({
					message: message || '网络故障，请重试！'
				})
			}
		},
		async handleSubmit() {
			const arr = this.existTag.filter(item => item !== '')
			let characteristicService = arr.join(';')
			if (this.isNew) {
				try {
					let param = {
						companyUrl: this.companyUrl,
						characteristicService,
						creater: this.username
					}
					const res = await addCompanyFeatures(param)
					const { code, data, msg } = res
					if (code === 200) {
						this.$notification.success({
							message: msg || '提交成功！'
						})
						this.subBtnVisible = false
					} else {
						throw new Error(msg)
					}
				} catch ({ message }) {
					this.$notification.error({
						message: message || '网络故障，请重试！'
					})
					this.subBtnVisible = true
				}
			} else {
				let param = {
					companyUrl: this.companyUrl,
					characteristicService,
					creater: this.username
				}
				try {
					const res = await editCompanyFeatures(param)
					const { code, msg } = res
					if (code === 200) {
						this.$notification.success({
							message: msg || '更新成功！'
						})
						this.subBtnVisible = false
					} else {
						throw new Error(msg)
					}
				} catch ({ message }) {
					this.$notification.error({
						message: message || '网络故障，请重试！'
					})
					this.subBtnVisible = true
				}
			}
		}
	}
}
</script>

<style lang="less" scoped>
.specicalServiceWrapper {
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
	.info {
		color: red;
		padding: 8px;
		border: 1px solid red;
		word-break: break-all;
	}
	h1 {
		font-size: 20px;
		font-weight: bold;
		span {
			color: red;
		}
	}
	h3 {
		font-size: 14px;
	}
	.ant-input {
		width: 30%;
		margin-right: 10px;
		margin-top: 20px;
	}
	img {
		width: 70%;
		margin-top: 20px;
	}
}
</style>
