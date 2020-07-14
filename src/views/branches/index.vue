<template>
	<div class="branchesWrapper">
		<h1>企业分支机构</h1>
		<a-card :bordered="false">
			<div class="addConsultWrapper">
				<a-button size="large"
					@click="handleAdd">添加机构</a-button>
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
				<span slot="phone"
					slot-scope="text, record">
					<p>电话：{{record.phone}}</p>
					<p v-if="record.faxNum">传真：{{record.faxNum}}</p>
				</span>
				<span slot="auditStatus"
					slot-scope="text"
					:style="{color: +text === 1 ? 'black': +text === 2 ? 'blue':'red'}">
					{{+text === 1 ? '待审核': +text === 2 ? '审核通过':'审核驳回'}}
				</span>
				<span slot="action"
					slot-scope="text, record">
					<a-button type="primary"
						@click="handleEdit(record)"
						v-if="record.auditStatus !== 1"
						style="margin-right:10px;">编辑</a-button>
					<a-button type="danger"
						@click="handleDel(record)">删除</a-button>
				</span>
			</s-table>
		</a-card>
	</div>
</template>

<script>
import Vue from 'vue'
import { STable } from '@/components'
import { showBranchOrganizations, eidtBranchOrganization } from '@/api/branches'

export default {
  name: 'branchesWrapper',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {
        startPage: 1,
        pageSize: 10,
        organizationName: '',
        companyUrl: ''
      },
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '地区',
          dataIndex: 'area',
          align: 'center'
        },
        {
          title: '企业名称',
          dataIndex: 'organizationName',
          align: 'center'
        },
        {
          title: '企业地址',
          dataIndex: 'detailedArea',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          align: 'center',
          scopedSlots: { customRender: 'phone' }
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
          dataIndex: 'auditStatus',
          align: 'center',
          scopedSlots: { customRender: 'auditStatus' }
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
        return showBranchOrganizations(this.queryParam).then(res => {
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
    async handleDel (record) {
      try {
        let param = {
          id: record.id,
          state: 1
        }
        const res = await eidtBranchOrganization(param)
        const { code, msg } = res
        if (code === 200) {
          this.$notification.success({
            message: msg || '删除成功！'
          })
          this.$refs.table.refresh(false)
        } else {
          throw new Error(msg)
        }
      } catch ({ message }) {
        this.$notification.error({
          message: message || '网络故障，请重试！'
        })
      }
    },
    handleAdd () {
      this.$router.push({
        name: 'addBranch'
      })
    },
    handleEdit (record) {
      this.$router.push({
        name: 'editBranch',
        query: { id: record.id }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.branchesWrapper {
	// // min-width: 1200px;
	h1 {
		font-size: 20px;
		font-weight: bold;
	}
	.addConsultWrapper {
		.ant-btn {
			background: rgba(166, 166, 166, 1);
			color: #fff;
			font-weight: bold;
			border-radius: 10px;
		}
	}
}
</style>
