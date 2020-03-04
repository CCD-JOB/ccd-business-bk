<template>
	<div id="brandSelect"
		class="brand-select-wrapper">
		<div class="container">
			<div class="containerTop">
				<div class="brand">
					<a-row>
						<a-col :span="12"
							v-for="item in brandArr"
							:key="item.bizId">
							<a-card hoverable
								style="width: 300px"
								@click="handleGoBrand(item)">
								<a-card-meta :title="item.bizName"
									hoverable
									loading>
									<template slot="description">
										<p>项目品牌</p>
									</template>
									<template slot="description">
										<p>关联{{item.relatedCompanyNum}}家公司</p>
									</template>
									<a-avatar slot="avatar"
										:src="item.relatedCompanyLogo?item.relatedCompanyLogo.split(';')[0]:''" />
									<template slot="description"
										v-if="!item.inUse">
										<p class="mask">服务已到期</p>
									</template>
								</a-card-meta>
							</a-card>
						</a-col>
					</a-row>
				</div>
				<div class="relativeCompany">
					<h3>关联公司：</h3>
					<a-row>
						<a-col :span="12"
							v-for="item in insArr"
							:key="item.bizId">
							<a-card :class="!item.inUse?'notInUse':''"
								:title="item.bizName"
								:bordered="false"
								@click="handleGoBrand(item)">
								<a href="#"
									slot="extra">
									<a-icon type="right" />
								</a>
								<p class="mask"
									v-if="!item.inUse">服务已到期</p>
							</a-card>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12"
							v-for="item in shareArr"
							:key="item.bizId">
							<a-card :title="item.bizName"
								:bordered="false"
								@click="handleGoBrand(item)">
								<a href="#"
									slot="extra">
									<a-icon type="right" /></a>
							</a-card>
						</a-col>
					</a-row>
				</div>
			</div>
			<div class="containerBottom">
				<h1>上海才查到科技有限公司</h1>
				<div class="copyright">
					Copyright &copy; 2020 V1.0.0
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'brandselect',
  data () {
    return {
      brandArr: [],
      insArr: [],
      shareArr: []
    }
  },
  created () {
    this.brandArr = this.company.filter(item => item.bizType === '品牌')
    this.insArr = this.company.filter(item => item.bizType === '机构')
    this.shareArr = this.company.filter(item => item.bizType === '分享')
  },
  computed: {
    ...mapGetters(['company'])
  },
  methods: {
    ...mapActions(['GetBackMenus', 'LogOff']),
    handleGoBrand ({ userId, bizId, bizType, bizName, companyUrl, inUse }) {
      if (!inUse) {
        this.$notification.error({
          message: ' 服务已过期,请及时续费!'
        })
        return
      }
      let oldRoleInfo = JSON.parse(Vue.ls.get('ROLESINFO'))
      if ((oldRoleInfo && oldRoleInfo.bizId) !== bizId) {
        store.commit('SET_ROLES', [])
      }

      store.commit('SET_CURRENT_COMPANY', {
        userId,
        bizId,
        bizType,
        bizName,
        companyUrl
      })
      Vue.ls.set(
        'ROLESINFO',
        JSON.stringify({ userId, bizId, bizType, bizName, companyUrl })
      )
      this.$router.push({
        path: '/welcome',
        replace: true,
        query: { name: bizName }
      })
    }
  }
}
</script>

<style lang="less" >
#brandSelect.brand-select-wrapper {
	min-width: 1200px;
	height: 100%;
	.container {
		width: 100%;
		min-height: 100%;
		background: #f0f2f5 url('./img/bg.jpeg') no-repeat 50%;
		background-size: cover;
		position: relative;
		.containerTop {
			width: 700px;
			margin: 0 auto;
			padding: 218px 0 112px;
			.brand {
				.ant-card {
					border-radius: 25px;
					.ant-card-body {
						position: relative;
						padding: 30px;
						.ant-card-meta {
							.ant-avatar {
								width: 80px;
								height: 80px;
							}
						}
						.ant-card-meta-detail {
							.ant-card-meta-description {
								p {
									margin-bottom: 0;
									&:nth-of-type(1) {
										margin-bottom: 9px;
									}
								}
								.mask {
									position: absolute;
									bottom: 0;
									right: 0;
									left: 0;
									top: 80%;
									background: rgba(255, 0, 0, 0.4);
									color: #fff;
									text-align: center;
									margin: 0;
									border-bottom-left-radius: 25px;
									border-bottom-right-radius: 25px;
								}
							}
						}
					}
				}
			}
			.relativeCompany {
				margin-top: 30px;
				h3 {
					font-size: 18px;
					font-weight: bold;
					color: #fff;
				}
				.ant-col-12 {
					&:nth-of-type(odd) {
						padding-right: 40px;
					}
					&:nth-of-type(even) {
						padding-left: 40px;
					}
				}
				.ant-card {
					min-width: 200px;
					border-radius: 25px;
					margin-top: 36px;
					position: relative;
					.ant-card-head {
						border: none;
						.ant-card-head-wrapper {
							.ant-card-head-title {
								text-align: center;
								font-size: 14px;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
								cursor: pointer;
							}
							.ant-card-extra {
								i {
									color: #000;
								}
							}
						}
					}
					&.notInUse {
						.ant-card-head-wrapper {
							.ant-card-head-title {
								text-align: right;
								padding-right: 18px;
								padding-left: 50px;
							}
						}
					}
					.ant-card-body {
						padding: 0;
						.mask {
							border-top-left-radius: 25px;
							border-bottom-left-radius: 25px;
							background: rgba(255, 0, 0, 0.4);
							position: absolute;
							top: 0;
							left: 0;
							right: 80%;
							bottom: 0;
							margin: 0;
							text-align: center;
							padding: 5px;
							color: #fff;
						}
					}
				}
			}
		}
	}
}

.containerBottom {
	position: absolute;
	width: 100%;
	bottom: 0;
	margin: 48px 0 24px;
	text-align: center;
	h1 {
		font-size: 20px;
		font-weight: bold;
		color: rgba(210, 210, 210, 1);
	}
	.copyright {
		color: rgba(210, 210, 210, 1);
		font-size: 14px;
	}
}
</style>
