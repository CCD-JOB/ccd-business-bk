<template>
	<div class="phoneWrapper">
		<a-form-item :label="`${labelTitle}：`"
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 7 }">
			<a-input placeholder="请输入联系电话"
				maxLength="50"
				v-decorator="[
          'consultantPhone',
          {rules: [{ required: isRequired, message: '请输入至少一个联系方式!', trigger: 'change' }]}
        ]" />
			<a-input placeholder="请输入联系电话"
				maxLength="50"
				v-for="(item,index) in mobileNumArr"
				v-model="item.num"
				:key="index" />
			<a-icon type="plus-square"
				@click="handleAddPhone" />
			<a-icon type="minus-square"
				@click="handleDelPhone"
				v-if="mobileNum>0" />
		</a-form-item>
	</div>
</template>

<script>
export default {
  props: ['mobileNumArr', 'mobileNum', 'labelTitle', 'isRequired', 'form'],
  methods: {
    // handleChange (e) {
    //   const {
    //     form: { setFieldsValue }
    //   } = this
    //   setFieldsValue({
    //     consultantPhone: e.target.value.replace(/[^0-9]/gi, '')
    //   })
    // },
    handleAddPhone () {
      this.$emit('handleAddPhone')
    },
    handleDelPhone () {
      this.$emit('handleDelPhone')
    }
  }
}
</script>

<style lang="less">
.phoneWrapper {
	.anticon-plus-square,
	.anticon-minus-square {
		font-size: 20px;
		margin-left: 10px;
	}
}
</style>
