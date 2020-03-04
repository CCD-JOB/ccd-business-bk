<template>
	<div class="phoneWrapper">
		<a-form-item :label="`${labelTitle}：`"
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 9 }">
			<a-input-group compact>
				<a-input class="areaNum"
					style="width: 15%"
					addonBefore="+"
					placeholder="区号"
					:maxLength="10"
					v-decorator="[
          'contactPhonePrev',
          {rules: [{ required: true, message: '请输入区号!', trigger: 'change' }]}
        ]" />
				<a-input style="width: 30%"
					placeholder="请输入联系电话"
					:maxLength="50"
					v-decorator="[
          'contactPhone',
          {rules: [{ required: true, message: '请输入手机号!', trigger: 'change' }]}
        ]" />
			</a-input-group>
			<a-input-group compact
				v-for="(item,index) in mobileNumArr"
				:key="index">
				<a-input class="areaNum"
					style="width: 15%"
					addonBefore="+"
					v-model="item.prevNum" />
				<a-input style="width: 30%"
					placeholder="请输入联系电话"
					:maxLength="50"
					v-model="item.num" />
			</a-input-group>
			<div class="addMinusWrapper">
				<a-icon type="plus-square"
					@click="handleAddPhone" />
				<a-icon type="minus-square"
					@click="handleDelPhone"
					v-if="mobileNum>0" />
			</div>
		</a-form-item>
	</div>
</template>

<script>
export default {
  props: ['mobileNumArr', 'mobileNum', 'labelTitle'],
  methods: {
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
	position: relative;
	.areaNum {
		margin-top: 1px;
		border-right: none;
		.ant-input-wrapper.ant-input-group {
			input {
				width: 100%;
				margin-right: 0;
			}
		}
	}

	.addMinusWrapper {
		position: absolute;
		right: 0;
		top: 0;
		line-height: 1;
		.anticon-plus-square,
		.anticon-minus-square {
			font-size: 20px;
			margin-left: 10px;
		}
	}
}
</style>
