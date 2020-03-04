<template>
	<a-modal class="consultantPreviewModal"
		:title="modalInfo.title"
		:visible="modalInfo.previewVisible"
		:footer="null"
		@cancel="handlePreviewCancel">
		<h3 v-if="modalInfo.rejectDescribe"
			style="color:red;padding:8px;border:1px solid red;word-break:break-all;">{{modalInfo.rejectDescribe}}</h3>
		<img :src="modalInfo.src"
			style="width:100%;">
	</a-modal>
</template>

<script>
export default {
  props: ['modalInfo', 'rejectDescribe'],
  methods: {
    handlePreviewCancel () {
      this.$emit('handlePreviewCancel', {
        rejectDescribe: '',
        title: '查看大图',
        src: '',
        previewVisible: false
      })
    }
  }
}
</script>

<style lang="less">
.consultantPreviewModal {
	.ant-modal-body {
		text-align: center;
		padding: 35px;
	}
}
</style>
