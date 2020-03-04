<template>
	<div class="logo">
		<router-link :to="{path:'/'}">
			<img :src="logoUrl">
			<h1 v-if="showTitle">{{ title }}</h1>
		</router-link>
	</div>
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      logoUrl: require('./img/logo.png')
    }
  },
  props: {
    title: {
      type: String,
      default: '财查到机构管理系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
