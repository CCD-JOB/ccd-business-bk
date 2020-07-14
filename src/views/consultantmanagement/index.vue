<template>
	<div class="consultantManagementWrapper">
		<h1>顾问管理</h1>
		<a-card :bordered="false">
			<div class="filterWrapper">
				<a-form layout="inline"
					:form="form">
					<a-form-item label="姓名">
						<a-input v-model="queryParam.adviserName"
							placeholder="请输入" />
					</a-form-item>
					<a-form-item label="职位">
						<a-input v-model="queryParam.currentPosition"
							placeholder="请输入" />
					</a-form-item>
					<a-button-group>
						<a-button @click="$refs.table.refresh(true)">搜索</a-button>
						<a-button @click="handleRestQueryParam()">重置</a-button>
					</a-button-group>
				</a-form>
			</div>
			<div class="addConsultWrapper">
				<a-button size="large"
					@click="handleAdd()">添加顾问</a-button>
			</div>
			<s-table ref="table"
				rowKey="id"
				:columns="columns"
				:data="loadData"
				:pagination="pagination"
				bordered
				style="margin-top:20px;">
				<span slot="serial"
					slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<span slot="yearOfEmployment"
					slot-scope="text">
					{{ handleYear(text) }}
				</span>
				<span slot="adviserIdentification"
					slot-scope="text">
					{{+text ? '是':'否'}}
				</span>
				<span slot="stick"
					slot-scope="text">
					{{+text ? '是':'否'}}
				</span>
				<span slot="approve"
					slot-scope="text"
					:style="{color: +text === 1 ? 'black;': +text === 2 ? 'blue':'red'}">
					{{+text === 1 ? '待审核': +text === 2 ? '审核通过':'审核驳回'}}
				</span>
				<span slot="action"
					slot-scope="text, record">
					<template>
						<a-popconfirm :title="`是否确定要${Number(record.stick)?'取消置顶':'置顶'}？`"
							@confirm="handleConfirmTop(record)"
							okText="确定"
							cancelText="取消">
							<a-button type="primary">{{+record.stick ? '取消置顶': '置顶'}}</a-button>
						</a-popconfirm>
						<a-divider type="vertical" />
						<a-button type="primary"
							@click="handleEdit(record)"
							v-if="record.approve !== 1">编辑</a-button>
						<a-divider type="vertical" />
						<a-button type="danger"
							@click="handleDel(record)">删除</a-button>
					</template>
				</span>
			</s-table>
		</a-card>
	</div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { STable } from '@/components'
import {
  getCompanyAdvisers,
  setAdviserStick,
  removeAdviserStick,
  removeCompanyAdviser
} from '@/api/consultantManagement.js'

export default {
  name: 'ConsultantManagement',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {
        startPage: 1,
        pageSize: 10,
        adviserName: '',
        currentPosition: '',
        companyUrl: ''
      },
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '姓名',
          dataIndex: 'adviserName',
          align: 'center'
        },
        {
          title: '公司',
          dataIndex: 'companyName',
          align: 'center'
        },
        {
          title: '职位',
          dataIndex: 'currentPosition',
          align: 'center'
        },
        {
          title: '从业年限',
          dataIndex: 'yearOfEmployment',
          align: 'center',
          scopedSlots: { customRender: 'yearOfEmployment' }
        },
        {
          title: '认证',
          dataIndex: 'adviserIdentification',
          align: 'center',
          scopedSlots: { customRender: 'adviserIdentification' }
        },
        {
          title: '置顶',
          dataIndex: 'stick',
          align: 'center',
          scopedSlots: { customRender: 'stick' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '创建人',
          dataIndex: 'creater',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'approve',
          align: 'center',
          scopedSlots: { customRender: 'approve' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onShowSizeChange: (current, pageSize) =>
          (this.queryParam.pageSize = pageSize),
        onChange: page => (this.queryParam.startPage = page),
        showQuickJumper: true
      },
      loadData: () => {
        return getCompanyAdvisers(this.queryParam).then(res => {
          if (res.code === 200 && res.data) {
            if (res.data.pageNum > res.data.navigateLastPage) {
              // 解决当点击的页码超过实际页数重复请求bug
              this.queryParam.startPage = res.data.navigateLastPage
            }
            res.data.data = res.data.list
            res.data.pageNo = res.data.pageNum
            res.data.totalPage = res.data.pages
            res.data.totalCount = res.data.total

            delete res.data.list
            delete res.data.pageNum
            delete res.data.pages
            delete res.data.total

            return res.data
          } else {
            res.data = {}
            res.data.data = []
            res.data.pageNo = 0
            res.data.totalPage = 0
            res.data.totalCount = 0
            return res.data
          }
        })
      }
    }
  },
  created () {
    this.queryParam.companyUrl = JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
  },
  methods: {
    // 从业时间处理
    handleYear (regTime) {
      let dateStart = new Date(regTime)
      let dateEnd = new Date(new Date().getTime())
      let difValue = (dateEnd - dateStart) / (1000 * 60 * 60 * 24)
      if (difValue < 365) {
        return '不足一年'
      } else if (difValue > 365) {
        let num = Math.floor(difValue / 365)
        return num
      } else {
        this.info.jobRange = '从业时间有误'
      }
    },
    handleRestQueryParam () {
      this.queryParam = {
        startPage: 1,
        pageSize: 10,
        adviserName: '',
        currentPosition: '',
        companyUrl: JSON.parse(Vue.ls.get('ROLESINFO')).companyUrl
      }
      this.$refs.table.refresh(true)
    },
    handleDel (record) {
      let param = {
        id: record.id
      }
      removeCompanyAdviser(param).then(res => {
        if (res.code === 200) {
          this.$notification.success({
            message: res.msg || '删除成功！'
          })
          this.$refs.table.refresh(false)
        } else {
          this.$notification.error({
            message: res.msg || '删除失败，请重试！'
          })
        }
      })
    },
    // 置顶/取消置顶
    handleConfirmTop (record) {
      let param = { id: record.id }
      if (!record.stick) {
        setAdviserStick(param).then(res => {
          if (res.code === 200) {
            record.stick = !Number(record.stick)
            this.$notification.success({
              message: res.msg || '置顶成功！'
            })
          } else {
            this.$notification.error({
              message: res.msg || '置顶失败，请重试！'
            })
          }
        })
      } else {
        removeAdviserStick(param).then(res => {
          if (res.code === 200) {
            record.stick = !Number(record.stick)
            this.$notification.success({
              message: res.msg || '取消置顶成功！'
            })
          } else {
            this.$notification.error({
              message: res.msg || '取消置顶失败，请重试！'
            })
          }
        })
      }
    },
    handleAdd () {
      this.$router.push({
        name: 'addConsultant'
      })
      // let newpage = this.$router.resolve({
      //   name: 'addConsultant'
      // })
      // window.open(newpage.href, '_blank')
    },
    handleEdit (record) {
      this.$router.push({
        name: 'editConsultant',
        query: {
          id: record.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.consultantManagementWrapper {
	// min-width: 1200px;
	h1 {
		font-size: 20px;
		font-weight: bold;
	}
	.filterWrapper {
		margin-top: 20px;
		.ant-btn-group {
			margin-top: 4px;
		}
	}
	.addConsultWrapper {
		margin-top: 30px;
		.ant-btn {
			background: rgba(166, 166, 166, 1);
			color: #fff;
			font-weight: bold;
			border-radius: 10px;
		}
	}
}
</style>
