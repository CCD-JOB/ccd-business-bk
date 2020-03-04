<template>
	<div class="hugeEventWrapper"
		style="margin-top:-50px;">
		<a-card v-for="(item,index) in eventList"
			:key="index"
			style="margin-top:50px;">
			<a-form-item label="事件日期："
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 12 }">
				<a-month-picker placeholder="请选择事件发生日期"
					v-model="item.eventTime"
					@change="(date, dateString)=>onChange(date, dateString,item)" />
			</a-form-item>
			<a-form-item label="事件名称："
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 12 }">
				<a-input placeholder="请填写事件名称，例如：公司荣获XXX荣誉称号"
					maxLength="100"
					v-model="item.eventName"></a-input>
			</a-form-item>
			<a-form-item label="事件描述："
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 12 }">
				<a-textarea placeholder="请填写事件描述，例如：XX公司于XX年获得XX奖项，奖项意义及影响力等（非必填）"
					maxLength="300"
					autosize
					v-model="item.description" />
			</a-form-item>
		</a-card>
		<a>
			<a-icon type="plus-square"
				@click="handleAdd"
				style="font-size:20px;color:#000;"
				:hidden="eventNum>19" />
			<a-icon type="minus-square"
				@click="handleDel"
				style="font-size:20px;color:#000;margin-left:10px;"
				v-if="eventNum>1" />
		</a>
	</div>
</template>

<script>
export default {
  props: ['eventNum', 'eventList'],
  methods: {
    onChange (date, dateString, item) {
      this.$emit('timeChange', date, dateString, item)
    },
    handleAdd () {
      this.$emit('handleAdd')
    },
    handleDel () {
      this.$emit('handleDel')
    }
  }
}
</script>

<style lang="less">
.hugeEventWrapper {
	position: relative;
	.ant-form-item-control {
		.ant-form-item-children {
			textarea {
				width: 600px;
			}
		}
	}
	a {
		position: absolute;
		bottom: 50px;
		right: 200px;
		i {
			font-size: 30px;
		}
	}
}
</style>
