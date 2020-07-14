<template>
	<div id="loginWrapper">
		<a-form id="formLogin"
			class="wrapper"
			ref="formLogin"
			:form="form"
			@submit="handleLoginSubmit">
			<section class="left">
				<div class="slide">
					<a-carousel autoplay
						dots>
						<div>
							<img src="./img/slide1.png">
						</div>
						<div>
							<img src="./img/slide2.png">
						</div>
						<div>
							<img src="./img/slide3.png">
						</div>
						<div>
							<img src="./img/slide4.png">
						</div>
						<div>
							<img src="./img/slide5.png">
						</div>
					</a-carousel>
				</div>
				<div class="tip">
					<p>
						投资者可通过机构专属页面一键连线理财师，
					</p>
					<p>
						拉近投资者与投资机构之间的距离，
					</p>
					<p>
						极大程度缩减企业推广与获客成本。
					</p>
				</div>
			</section>
			<section class="right">
				<div class="switch"
					@click="isStatusOne = !isStatusOne">
					<img src="./img/code.png"
						v-if="isStatusOne">
					<img src="./img/pc.png"
						v-else>
				</div>
				<div class="statusOne"
					v-if="isStatusOne">
					<div class="logo">
						<img src="./img/logo.png">
						<h1>财查到机构管理系统</h1>
					</div>
					<div class="pressin">
						<a-form-item>
							<a-input placeholder="输入账号"
								v-decorator="[
								'username',
								{rules: [{ required: true, message: '请输入账号' }], validateTrigger: 'change'}
							]">
								<a-icon slot="prefix"
									type="user" />
							</a-input>
						</a-form-item>
						<a-form-item>
							<a-input type="password"
								autocomplete="false"
								placeholder="输入密码"
								v-decorator="[
								'password',
								{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
							]">
								<a-icon slot="prefix"
									type="lock" />
							</a-input>
						</a-form-item>

						<a-checkbox v-model="isSave">记住用户名</a-checkbox>
					</div>
					<div class="submit">
						<a-button type="primary"
							htmlType="submit"
							:loading="state.loginBtn"
							:disabled="state.loginBtn">登录</a-button>
					</div>
				</div>
				<div class="statusTwo"
					v-else>
					<div class="title">
						<div>
							<h2>财查到</h2>
							<h1>AIFOUND</h1>
						</div>
						<p>金融产品鉴别 线上获客利器</p>
					</div>
					<div class="scancode">
						<div class="leftpart">
							<img src="./img/scancode.png">
						</div>
						<div class="rightpart">
							<img src="./img/ios.png">
							<img src="./img/android.png">
						</div>
					</div>
				</div>
			</section>
		</a-form>
	</div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      isStatusOne: true,
      state: {
        time: 60,
        loginBtn: false
      },
      isSave: false
    }
  },
  mounted () {
    const username = Vue.ls.get('LOGIN_USER_NAME')
    if (username) {
      this.isSave = true
      this.form.setFieldsValue({
        username
      })
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // 确定登录
    handleLoginSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this
      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      if (this.isSave) {
        const username = this.form.getFieldValue('username')
        Vue.ls.set('LOGIN_USER_NAME', username)
      } else {
        Vue.ls.remove('LOGIN_USER_NAME')
      }
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          Login(qs.stringify(loginParams))
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      this.$router.push({ name: 'brandselect' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description:
					((err.response || {}).data || {}).message ||
					err.msg ||
					'请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less">
#loginWrapper {
	width: 100%;
	height: 100%;
	.wrapper {
		display: flex;
		width: 60%;
		height: 70%;
		min-width: 1220px;
		min-height: 730px;
		background: #fff;
		background: linear-gradient(-135deg, transparent 91px, #fff 0),
			linear-gradient(135deg, transparent 15px, rgb(246, 246, 246) 0);
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0px 0px 120px rgba(0, 0, 0, 0.25);
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		.left {
			width: 40%;
			height: 100%;
			box-shadow: 24px 0px 40px rgba(0, 123, 255, 0.1);
			padding: 40px 0 0;
			.slide {
				margin: 30px auto 0;
				width: 286px;
				height: 480px;
				div {
					width: 100%;
					height: 480px;
					img {
						width: 100%;
					}
				}
				.ant-carousel .slick-dots {
					top: 500px;
					li {
						button {
							background: #e2e2e2;
						}
						&.slick-active {
							button {
								background: #5b5b5b;
							}
						}
					}
				}
			}
			.tip {
				margin-top: 40px;
				p {
					font-size: 18px;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 30px;
					color: #828282;
					margin: 0;
					text-align: center;
				}
			}
		}
		.right {
			width: 60%;
			height: 100%;
			position: relative;
			.switch {
				position: absolute;
				top: 10px;
				right: 10px;
				img {
					width: 110px;
					height: 110px;
				}
			}
			.statusOne {
				padding: 100px 150px 0 200px;
				.logo {
					text-align: start;
					img {
						width: 80px;
						height: 80px;
					}
					h1 {
						font-family: PingFang-bold;
						font-size: 42px;
						font-weight: bold;
						color: #18293b;
						margin: 0;
					}
				}
				.pressin {
					margin-top: 72px;
					.ant-input-affix-wrapper {
						&:nth-of-type(2) {
							margin-top: 30px;
						}
						.ant-input-prefix {
							left: 0;
							i {
								color: #007bff;
								font-size: 18px;
								margin-bottom: 5px;
							}
						}
						.ant-input {
							width: 80%;
							border-radius: 0;
							border: none;
							border-bottom: 2px solid #eeeeee;
							background-color: transparent !important;
							padding-bottom: 10px;
							&:-webkit-autofill {
								-webkit-transition: background-color 10000s
									cubic-bezier(1, -100, 1, -100) 0s;
							}
							&:focus {
								box-shadow: none;
							}
						}
					}
					.ant-checkbox-wrapper {
						// margin-top: 10px;
					}
				}
				.submit {
					margin-top: 60px;
					text-align: left;
					.ant-btn {
						width: 80%;
						height: 50px;
						background: #007bff;
						font-size: 20px;
						border-radius: 50px;
					}
				}
			}
			.statusTwo {
				padding-top: 220px;
				.title {
					text-align: center;
					div {
						position: relative;
						h1 {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							z-index: -1;
							font-size: 72px;
							font-family: PingFang-bold;
							font-weight: 800;
							line-height: 51px;
							color: rgba(242, 238, 234, 1);
							opacity: 0.4;
						}
						h2 {
							font-family: PingFang-bold;
							font-size: 38px;
							font-weight: bold;
							color: #18293b;
							margin: 0;
						}
					}
					p {
						font-size: 24px;
						color: #666666;
						margin-top: 10px;
						position: relative;
						&:before,
						&:after {
							content: '';
							position: absolute;
							top: 52%;
							background: #888;
							width: 9%;
							height: 2px;
						}
						&:before {
							left: 18%;
						}
						&:after {
							right: 18%;
						}
					}
				}
				.scancode {
					margin-top: 50px;
					display: flex;
					justify-content: center;
					.leftpart {
						margin-right: 20px;
						img {
							width: 118px;
							height: 118px;
						}
					}
					.rightpart {
						width: 182px;
						img {
							width: 182px;
							height: 50px;
							&:nth-of-type(2) {
								margin-top: 20px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
