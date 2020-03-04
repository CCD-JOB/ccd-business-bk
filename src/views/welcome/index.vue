<template>
	<div class="welcome-wrapper">
		<!-- <div class="radio">
			<a-icon type="sound" />
			<span>系统消息： 财查到商家管理系统新版上线拉！</span>
		</div> -->
		<h1>欢迎登录</h1>
		<p>{{name}}</p>
	</div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      name: ''
    }
  },
  created () {
    this.name = JSON.parse(Vue.ls.get('ROLESINFO')).bizName
  }
}
</script>

<style lang="less" scoped>
.welcome-wrapper {
	min-width: 1200px;
	.radio {
		border: 1px solid red;
		padding: 10px;
		i {
			margin-right: 5px;
		}
		span {
			color: red;
		}
	}
	h1 {
		font-size: 20px;
		font-weight: bold;
		margin: 20px 0;
	}
	p {
		color: #000;
	}
}
</style>
