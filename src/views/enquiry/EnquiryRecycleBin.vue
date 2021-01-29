<template>
  <div>
    <a-card :bordered="false">
      <h3 slot="title">询盘查询</h3>
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="请选择" v-model="enquiryType" style="width: 160px">
            <a-select-option value="all">产品询盘/用户留言</a-select-option>
            <a-select-option value="0">产品询盘</a-select-option>
            <a-select-option value="1">用户留言</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="equipment" placeholder="请选择" style="width: 160px">
            <a-select-option value="all">请选择来源终端</a-select-option>
            <a-select-option value="Android">Android</a-select-option>
            <a-select-option value="Iphone/Ipad">Iphone/Ipad</a-select-option>
            <a-select-option value="PC">PC</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="state" placeholder="请选择" style="width: 160px">
            <a-select-option value="all">请选择询盘状态</a-select-option>
            <a-select-option value="0">待沟通</a-select-option>
            <a-select-option value="1">沟通中</a-select-option>
            <a-select-option value="2">放弃</a-select-option>
            <a-select-option value="3">成单</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="请选择" v-model="contactRegion" style="width: 120px">
            <a-select-option value="all">全部国家</a-select-option>
            <template v-for="(item, index) in country">
              <a-select-option :value="item" :key="index">
                {{ item }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker v-model="dates" ref="datap" @change="onDateChange" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="list" :bordered="false" style="margin-top: 10px">
      <h3 slot="title">询盘展示</h3>
      <!--      <div class="table-operator">-->
      <!--        <a-button @click="handleRestore" type="primary">恢复询盘</a-button>-->
      <!--        <a-button @click="handleRemove" type="danger">彻底删除</a-button>-->
      <!--      </div>-->
      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
      >
        <template slot="content" slot-scope="text, record">
          <a href="" @click.prevent="$router.push(`/enquiry/detail/${record.id}`)">来自IP：{{ text }}的询盘</a>
        </template>
        <template slot="enquiryType" slot-scope="text">
          <span>{{ text === 0 ? '产品询盘' : '用户留言' }}</span>
        </template>
        <template slot="country" slot-scope="text">
          <img class="country-flag" :src="flags[text]" alt="" />
        </template>
        <template slot="state" slot-scope="text">
          {{ status[text] }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="link" size="small" @click="restore(record.id)">恢复</a-button>
          <a-popconfirm title="确定要删除该数据吗?" @confirm="del(record.id)">
            <a-button type="link" size="small">彻底删除</a-button>
          </a-popconfirm>
        </template>
      </s-table>
      <div class="table-operator list-footer">
        <a-button @click="handleRestore" type="primary">恢复询盘</a-button>
        <a-button @click="handleRemove" type="danger">彻底删除</a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import STable from '@/components/Table'
import { country } from '@/utils/country'
import {
  getEnquiryRecycleBin,
  delEnquiry,
  removeEnquiry,
  restoreEnquiry,
  removeEnquirys,
  restoreEnquirys
} from '@/api/enquiry'

const columns = [
  {
    title: '询盘单号',
    dataIndex: 'orderNumber',
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center'
  },
  {
    title: '询盘类型',
    dataIndex: 'enquiryType',
    scopedSlots: {
      customRender: 'enquiryType'
    },
    align: 'center'
  },
  {
    title: '来源国家',
    dataIndex: 'contactRegion',
    scopedSlots: {
      customRender: 'country'
    },
    align: 'center'
  },
  {
    title: '询盘时间',
    dataIndex: 'createDate',
    align: 'center'
  },
  {
    title: '跟进状态',
    dataIndex: 'state',
    scopedSlots: {
      customRender: 'state'
    },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {
      customRender: 'action'
    },
    align: 'center'
  }
]
const flags = {
  china: require('@/assets/flags/CN.svg'),
  australia: require('@/assets/flags/AU.svg'),
  india: require('@/assets/flags/IN.svg'),
  myanmar: require('@/assets/flags/MM.svg'),
  nigeria: require('@/assets/flags/NG.svg'),
  nepal: require('@/assets/flags/NP.svg'),
  'united states': require('@/assets/flags/US.svg'),
  'south africa': require('@/assets/flags/ZA.svg')
}
const status = ['待沟通', '沟通中', '放弃', '成单']
export default {
  name: 'EnquiryRecycleBin',
  components: {
    STable
  },
  data() {
    this.country = country
    this.columns = columns
    this.flags = flags
    return {
      status,
      dates: null,
      contactRegion: 'all',
      state: 'all',
      equipment: 'all',
      enquiryType: 'all',
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      listLoading: true,
      loadData: (parameter) => {
        parameter = Object.assign(parameter, this.queryParam)
        return getEnquiryRecycleBin(parameter)
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onProductSelectChange
      }
    }
  },
  methods: {
    checkSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择至少一款产品')
        return false
      }
      return true
    },
    operateSuccess() {
      this.$message.success('操作成功')
    },
    operateFail(err) {
      this.$message.error(`操作失败:${err.msg}`)
    },
    // 批量移除
    handleRemove() {
      if (!this.checkSelected()) return
      console.log(this.selectedRowKeys)
      this.$confirm({
        content: '确定要彻底删除这些数据吗？',
        centered: true,
        onOk: () => {
          removeEnquirys(this.selectedRowKeys)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.$refs.table.refresh()
              } else throw res
            })
            .catch((err) => {
              this.$message.error(err.msg || '操作失败')
            })
        }
      })
    },
    // 批量恢复
    handleRestore() {
      if (!this.checkSelected()) return
      console.log(this.selectedRowKeys)
      this.$confirm({
        content: '确定要恢复这些数据吗？',
        centered: true,
        onOk: () => {
          restoreEnquirys(this.selectedRowKeys)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.$refs.table.refresh()
              } else throw res
            })
            .catch((err) => {
              this.$message.error(err.msg || '操作失败')
            })
        }
      })
    },
    del(id) {
      const param = {
        id: id,
        isRemove: true
      }
      delEnquiry(param).then((res) => {
        console.log(res)
        this.operateSuccess()
        this.$refs.table.refresh()
      })
    },
    remove(id) {
      const param = {
        id
      }
      removeEnquiry(param)
        .then((res) => {
          console.log(res)
          this.operateSuccess()
          this.$refs.table.refresh()
        })
        .catch((err) => {
          this.operateFail(err)
        })
    },
    restore(id) {
      const param = {
        id: id
      }
      console.log(param)
      restoreEnquiry(param)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          } else throw res
        })
        .catch((err) => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleQuery() {
      if (this.contactRegion !== 'all') {
        this.queryParam.contactRegion = this.contactRegion
      } else delete this.queryParam.contactRegion
      if (this.state !== 'all') {
        this.queryParam.state = this.state
      } else delete this.queryParam.state
      if (this.equipment !== 'all') {
        this.queryParam.equipment = this.equipment
      } else delete this.queryParam.equipment
      this.queryParam.enquiryType = this.enquiryType === 'all' ? 0 : this.enquiryType

      this.$refs.table.refresh(true)
    },
    handleReset() {
      this.queryParam = {}
      this.enquiryType = 'all'
      this.equipment = 'all'
      this.state = 'all'
      this.contactRegion = 'all'
      this.$refs.datap.value = null
      this.$refs.table.refresh(true)
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onDateChange() {
      console.log(this.$refs.datap)
      this.queryParam.startDate = moment(this.dates[0]._d, 'YY-MM-DD hh:mm:ss').format()
      this.queryParam.endDate = moment(this.dates[1]._d, 'YY-MM-DD hh:mm:ss').format()
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';

.country-flag {
  width: 25px;
}
.list {
  position: relative;

  .list-footer {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 10;
  }
}
</style>
