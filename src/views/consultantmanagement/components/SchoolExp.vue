<template>
	<div class="schoolExpWrapper">
		<a-form-item label="学校名称："
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 12 }">
			<a-input placeholder="请填写学校名称"
				maxLength="50"
				v-decorator="['consultantSchoolName']" />
		</a-form-item>
		<a-form-item label="专业名称："
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 12 }">
			<a-input placeholder="请填写专业名称"
				maxLength="50"
				v-decorator="['consultantSchoolPro']" />
		</a-form-item>
		<a-form-item label="最高学历："
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 12 }">
			<a-select style="width: 120px"
				placeholder="请选择"
				allowClear
				v-decorator="[
          'consultantSchoolTop']">
				<a-select-option value="大专以下">大专以下</a-select-option>
				<a-select-option value="本科">本科</a-select-option>
				<a-select-option value="硕士">硕士</a-select-option>
				<a-select-option value="博士">博士</a-select-option>
			</a-select>
		</a-form-item>
		<a-form-item label="就读时间："
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 12 }">
			<a-range-picker v-decorator="['schoolExpRange', { initialValue: schoolExpRange }]"
				@change="handleSchoolRangeChange" />
		</a-form-item>
	</div>
</template>

<script>
export default {
  props: ['schoolExpRange'],
  methods: {
    handleSchoolRangeChange (date, dateString) {
      this.$emit('handleSchoolRangeChange', date, dateString)
    }
  }
}
</script>

<style lang="less">
.schoolExpWrapper {
}
</style>
