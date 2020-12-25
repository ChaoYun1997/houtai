<template>
  <div>
    <a-card style="margin-bottom: 10px" :bordered="false">
      <h3 slot="title">询盘查询</h3>
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="请选择" v-model="enquiryType" style="width: 180px">
            <a-select-option value="all">产品询盘/用户留言</a-select-option>
            <a-select-option value="0">产品询盘</a-select-option>
            <a-select-option value="1">用户留言</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="equipment" placeholder="请选择" style="width: 120px">
            <a-select-option value="all">来源终端</a-select-option>
            <a-select-option value="PC">电脑端</a-select-option>
            <a-select-option value="Android">移动端</a-select-option>
            <a-select-option value="Iphone/Ipad">平板端</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="state" style="width: 100px">
            <a-select-option value="all">跟进状态</a-select-option>
            <a-select-option value="0">待沟通</a-select-option>
            <a-select-option value="1">沟通中</a-select-option>
            <a-select-option value="2">放弃</a-select-option>
            <a-select-option value="3">成单</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="请选择" v-model="contactRegion" style="width: 160px">
            <a-select-option value="all">全部国家</a-select-option>
            <template v-for="(item, index) in country">
              <a-select-option :value="item" :key="index">
                {{ item }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker @change="onDateChange"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="list" :bordered="false">
      <h3 slot="title">询盘展示</h3>
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
        <template slot="country" slot-scope="text">
          <img class="country-flag" :src="flags[text]" alt=""/>
        </template>
        <template slot="enquiryType" slot-scope="text">
          <span>{{ text === 0 ? '产品询盘' : '用户留言' }}</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <span class="link-btn right-split" @click="$router.push(`/enquiry/detail/${record.id}`)">查看</span>
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
  import moment from 'moment'

  const columns = [
    {
      title: '询盘单号',
      dataIndex: 'orderNumber'
    },
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '询盘类型',
      dataIndex: 'enquiryType',
      scopedSlots: {
        customRender: 'enquiryType'
      }
    },
    {
      title: '来源国家',
      dataIndex: 'contactRegion',
      scopedSlots: {
        customRender: 'country'
      }
    },
    {
      title: '询盘时间',
      dataIndex: 'createDate'
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
        contactRegion: 'all',
        state: 'all',
        equipment: 'all',
        enquiryType: 'all',
        queryParam: {
          enquiryType: null
        },
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
        this.queryParam.enquiryType = this.enquiryType === 'all' ? null : this.enquiryType
        this.$refs.table.refresh(true)
      },
      handleReset() {
        this.queryParam = {}
        this.enquiryType = 'all'
        this.equipment = 'all'
        this.state = 'all'
        this.contactRegion = 'all'
        this.$refs.table.refresh(true)
      },
      onProductSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      onDateChange() {
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
