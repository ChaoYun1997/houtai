<template>
  <div>
    <a-card title="" class="list" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="询盘来源">
                <a-select placeholder="请选择" v-model="enquirySource">
                  <a-select-option value="all">请选择询盘来源</a-select-option>
                  <a-select-option value="Contact Us">Contact Us</a-select-option>
                  <a-select-option value="Product Enquiry">Product Enquiry</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="来源终端">
                <a-select v-model="equipment" placeholder="请选择">
                  <a-select-option value="all">请选择来源终端</a-select-option>
                  <a-select-option value="Android">Android</a-select-option>
                  <a-select-option value="Iphone/Ipad">Iphone/Ipad</a-select-option>
                  <a-select-option value="PC">PC</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="跟进状态">
                <a-select v-model="state" placeholder="请选择">
                  <a-select-option value="all">请选择询盘状态</a-select-option>
                  <a-select-option value="0">待沟通</a-select-option>
                  <a-select-option value="1">沟通中</a-select-option>
                  <a-select-option value="2">放弃</a-select-option>
                  <a-select-option value="3">成单</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="国家地区">
                <a-select placeholder="请选择" v-model="contactRegion">
                  <a-select-option value="all">全部</a-select-option>
                  <template v-for="(item, index) in country">
                    <a-select-option :value="item" :key="index">
                      {{ item }}
                    </a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-range-picker v-model="datePick" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="handleQuery">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button @click="handleDel" type="danger">删除</a-button>
        <a-button @click="handleReaded" type="primary">设为已读</a-button>
        <a-button @click="handleUnread" type="primary">设为未读</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
      >
        <template slot="content" slot-scope="text, record">
          <a href="" @click.prevent="$router.push(`/enquiry/detail/${record.id}`)">来自IP：{{ text }}的询盘</a>
        </template>
        <template slot="country" slot-scope="text">
          <img class="country-flag" :src="flags[text]" alt="" />
        </template>
        <template slot="action" slot-scope="text, record">
          <span class="link-btn" @click="$router.push(`/enquiry/detail/${record.id}`)">查看</span>
          <a-popconfirm title="确定要删除该数据吗?" @confirm="del(record.id)">
            <span class="link-btn red-text">删除</span>
          </a-popconfirm>
        </template>
      </s-table>
      <div class="table-operator list-footer">
        <a-button @click="handleDel" type="danger">删除</a-button>
        <a-button @click="handleReaded" type="primary">设为已读</a-button>
        <a-button @click="handleUnread" type="primary">设为未读</a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
import STable from '@/components/Table'
import { country } from '@/utils/country'
import { getEnquiry, delEnquiry, delEnquirys, setEnquirysIsReaded, setEnquirysIsUnRead } from '../../api/enquiry'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'

const columns = [
  {
    title: '询盘单号',
    dataIndex: 'orderNumber'
  },
  {
    title: '询盘内容',
    dataIndex: 'contactIP',
    scopedSlots: {
      customRender: 'content'
    }
  },
  {
    title: '发送时间',
    dataIndex: 'createDate'
  },
  {
    title: '国家',
    dataIndex: 'contactRegion',
    scopedSlots: {
      customRender: 'country'
    }
  },
  {
    title: '跟进状态',
    dataIndex: 'state'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {
      customRender: 'action'
    }
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
export default {
  name: 'EnquiryList',
  components: {
    STable
  },
  data() {
    this.country = country
    this.columns = columns
    this.flags = flags
    return {
        datePick: undefined,
      contactRegion: 'all',
      state: 'all',
      equipment: 'all',
      enquirySource: 'all',
      enquiryType: 'all',
      queryParam: {},
      selectedRowKeys: [],
      loadData: parameter => {
        parameter = Object.assign(parameter, this.queryParam)
        return getEnquiry(parameter)
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
    handleDel() {
      if (!this.checkSelected()) return
      this.$confirm({
        content: '确定要删除这些数据吗？',
        centered: true,
        onOk: () => {
          delEnquirys(this.selectedRowKeys)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.$refs.table.refresh()
              } else throw res
            })
            .catch(err => {
              this.$message.error(err.msg || '操作失败')
            })
        }
      })
      console.log(this.selectedRowKeys)
    },
    handleReaded() {
      if (!this.checkSelected()) return
      console.log(this.selectedRowKeys)
      setEnquirysIsReaded(this.selectedRowKeys)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleUnread() {
      if (!this.checkSelected()) return
      console.log(this.selectedRowKeys)
      setEnquirysIsUnRead(this.selectedRowKeys)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    checkSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择至少一款产品')
        return false
      }
      return true
    },
    del(id) {
      delEnquiry({ id: id })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          } else throw res
        })
        .catch(err => {
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
      if (this.enquirySource !== 'all') {
        this.queryParam.enquirySource = this.enquirySource
      } else delete this.queryParam.enquirySource
      if (this.datePick) {
        this.queryParam.startDate = moment(this.datePick[0]._d, 'YY-MM-DD hh:mm:ss').format()
        this.queryParam.endDate = moment(this.datePick[1]._d, 'YY-MM-DD hh:mm:ss').format()
      } else {
        delete this.queryParam.startDate
        delete this.queryParam.endDate
      }
      console.log(moment(this.datePick[0]._d, 'YY-MM-DD hh:mm:ss').format())
      this.$refs.table.refresh(true)
    },
    handleReset() {
      this.queryParam = {}
      this.enquirySource = 'all'
      this.equipment = 'all'
      this.state = 'all'
      this.contactRegion = 'all'
      this.datePick = undefined
      // this.$refs.datap.value = null
      this.$refs.table.refresh(true)
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onDateChange(date, dateString) {
      this.queryParam.startDate = dateString[0]
      this.queryParam.endDate = dateString[1]
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
