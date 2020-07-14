<template>
	<div id="userLayout"
		class="user-layout-wrapper">
		<div class="container">
			<div class="containerTop">
				<route-view></route-view>
				<!-- <a-row>
					<a-col :xl="12"
						:lg="12"
						:md="12"
						:sm="0"
						:xs="0"
						class="loginLeft">
						<div>
							<img :src="logoUrl"
								class='logo'>
							<p class="title">财查到机构管理系统</p>
						</div>
					</a-col>
					<a-col :xl="12"
						:lg="12"
						:md="12"
						:sm="24"
						:xs="24"
						class="loginRight">
						<route-view></route-view>
					</a-col>
				</a-row> -->
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
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      logoUrl: require('./img/logo.png')
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
	height: 100%;
	.container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #f0f2f5 url('./img/bg.png') no-repeat 50%;
		background-size: cover;
		.containerTop {
			width: 100%;
			height: 90%;
			// padding: 290px 400px 144px;
			// .loginLeft {
			// 	margin-top: 80px;
			// 	.logo {
			// 		width: 90px;
			// 		height: 95px;
			// 		margin: 0 auto;
			// 		display: block;
			// 	}
			// 	.title {
			// 		font-size: 20px;
			// 		color: #fff;
			// 		font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
			// 		font-weight: 600;
			// 		text-align: center;
			// 		margin: 0;
			// 	}
			// }
			// .loginRight {
			// 	border-left: 1px solid rgba(210, 210, 210, 1);
			// }
		}
		.containerBottom {
			height: 10%;
			text-align: center;
			h1 {
				margin: 0;
				font-size: 18px;
				color: rgba(255, 255, 255, 0.3);
			}
			.copyright {
				color: rgba(255, 255, 255, 0.3);
				font-size: 14px;
			}
		}
	}
}
</style>
