<template>
	<div class="jobExpWrapper">
		<a-card v-for="(item,index) in consultantCompanyExp"
			:key="index"
			style="margin-top:50px;width: 900px;">
			<template class="ant-card-actions"
				slot="title">
				<span style="color:red;margin-right:5px;"
					v-if="index===0">*</span>工作经历({{index+ 1}})
			</template>
			<a-form-item label="公司名称："
				:label-col="{ span: 2 }"
				:wrapper-col="{ span: 12 }">
				<a-input placeholder="请填写公司名称"
					maxLength="100"
					v-model="item.name" />
			</a-form-item>
			<a-form-item label="在职时间："
				:label-col="{ span: 2 }"
				:wrapper-col="{ span: 12 }">
				<a-range-picker v-model="item.jobExpRange"
					@change="(date, dateString)=>handleJobRangeChange(date, dateString, item)"
					style="margin-right:10px" />
				<a-checkbox :checked="item.isNow"
					@change="e=>item.isNow = e.target.checked">至今</a-checkbox>
			</a-form-item>
			<a-form-item label="职位名称："
				:label-col="{ span: 2 }"
				:wrapper-col="{ span: 12 }">
				<a-input placeholder="请填写职位名称"
					maxLength="50"
					v-model="item.position" />
			</a-form-item>
			<a-button @click="handleSaveJobExp(item)"
				style="margin-left:25px;">保存</a-button>
		</a-card>
		<a style="position:absolute;bottom:285px;right:50px;">
			<a-icon type="plus-square"
				@click="handleAddConsultantCompanyExp"
				style="font-size:20px;color:#000;"
				:hidden="consultantCompanyExpNum>3" />
			<a-icon type="minus-square"
				@click="handleDelConsultantCompanyExp"
				style="font-size:20px;color:#000;margin-left:10px;"
				v-if="consultantCompanyExpNum>0" />
		</a>
	</div>
</template>

<script>
export default {
  props: ['consultantCompanyExp', 'consultantCompanyExpNum'],
  methods: {
    handleJobRangeChange (date, dateString, item) {
      this.$emit('handleJobRangeChange', date, dateString, item)
    },
    handleSaveJobExp (item) {
      this.$emit('handleSaveJobExp', item)
    },
    handleAddConsultantCompanyExp () {
      this.$emit('handleAddConsultantCompanyExp')
    },
    handleDelConsultantCompanyExp () {
      this.$emit('handleDelConsultantCompanyExp')
    }
  }
}
</script>

<style lang="less">
.jobExpWrapper {
	position: relative;
	width: 900px;
}
</style>
