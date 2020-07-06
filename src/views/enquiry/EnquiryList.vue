<template>
  <page-header-wrapper>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="询盘来源">
              <a-select @change="handleSourceSelect" placeholder="请选择" default-value="0">
                <a-select-option value="0">Contact Us</a-select-option>
                <a-select-option value="1">Product Enquiry</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="来源终端">
              <a-select @change="handleDeviceSelect" placeholder="请选择" default-value="0">
                <a-select-option value="0">Android</a-select-option>
                <a-select-option value="1">Iphone/Ipad</a-select-option>
                <a-select-option value="2">PC</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="跟进状态">
              <a-select @change="handleStatusSelect" placeholder="请选择" default-value="0">
                <a-select-option value="0">待沟通</a-select-option>
                <a-select-option value="1">沟通中</a-select-option>
                <a-select-option value="2">放弃</a-select-option>
                <a-select-option value="3">成单</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="国家地区">
              <a-select placeholder="请选择" default-value="0" @change="handleCountrySelected">
                <a-select-option value="0">全部</a-select-option>
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
              <a-range-picker @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="handleQuery">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-card>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
      >
        <template slot="content" slot-scope="text, record">
          <a href="" @click.prevent="$router.push(`/enquiry/detail/${record.enquiryId}`)">{{ text }}</a>
        </template>
        <template slot="country" slot-scope="text">
          <img class="country-flag" :src="flags[text]" alt="" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="link" size="small">查看</a-button>
          <a-popconfirm title="确定要删除该数据吗?" @confirm="del(record.enquiryId)">
            <a-button type="link" size="small">删除</a-button>
          </a-popconfirm>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import STable from '@/components/Table'
import { country } from '@/utils/country'
import { getEnquiry } from '@/api/enquiry'
const columns = [
  {
    title: '询盘单号',
    dataIndex: 'enquiryId'
  },
  {
    title: '询盘内容',
    dataIndex: 'content',
    scopedSlots: {
      customRender: 'content'
    }
  },
  {
    title: '发送时间',
    dataIndex: 'time'
  },
  {
    title: '国家',
    dataIndex: 'region',
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
    del(id) {},
    handleQuery() {},
    handleReset() {},
    handleSourceSelect() {},
    handleDeviceSelect() {},
    handleStatusSelect() {},
    handleCountrySelected() {},
    onProductSelectChange() {},
    onChange(date, dateString) {
      console.log(date, dateString)
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';
.country-flag {
  width: 25px;
}
</style>
