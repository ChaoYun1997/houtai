<template>
  <div>
    <a-card style="margin-bottom: 10px" :bordered="false">
      <h3 slot="title">基本信息</h3>
      <div>
        <p>
          欢迎您，<b>{{ nick }}</b>
        </p>
        <a-row style="margin-bottom: 10px">
          <a-col :span="8">
            <span class="field" style=" display:inline-block;width: 90px">公司中文名：</span>{{ websiteName }}
            <a-button style="margin-left: 10px;" type="link" icon="edit" size="small" @click="editInfoVisible = true">
              编辑
            </a-button>
          </a-col>
          <a-col :span="8">
            <span class="field" style=" display:inline-block;width: 90px">公司英文名：</span>
            {{ userinfo.siteEnglishName }}
            <a-button style="margin-left: 10px;" type="link" icon="edit" size="small" @click="editInfoVisible = true">
              编辑
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <span class="field" style=" display:inline-block;width: 90px">服务时间：</span>
            {{ `${openDate.toString().substring(0, 10)} - ${expDate.toString().substring(0, 10)}` }}
          </a-col>
          <a-col :span="8">
            <span class="field" style=" display:inline-block;width: 90px">前台网址：</span>
            <a :href="site" target="_blank">{{ website }}</a>
            <a-button
              style="margin-left: 10px;"
              type="link"
              icon="edit"
              size="small"
              @click="editWebsiteVisible = true"
            >
              编辑域名
            </a-button>
          </a-col>
        </a-row>
      </div>
      <a-modal v-model="editWebsiteVisible" title="编辑域名">
        <a-row :gutter="[16, 16]">
          <a-col :span="4">域名</a-col>
          <a-col :span="20"><a-input v-model="siteUrl" placeholder="请输入域名"></a-input></a-col>
          <a-col :span="4">名称</a-col>
          <a-col :span="20"><a-input v-model="siteName" placeholder="请输入域名名称"></a-input></a-col>
        </a-row>
        <div slot="footer">
          <a-button type="primary" @click="handleSiteChange" :loading="isEditing">提交</a-button>
          <a-button @click="editWebsiteVisible = false">取消</a-button>
        </div>
      </a-modal>
      <a-modal v-model="editInfoVisible" title="编辑">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">公司中文名</a-col>
          <a-col :span="18"><a-input v-model="cnName" placeholder="请输入公司中文名"></a-input></a-col>
          <a-col :span="6">公司英文名</a-col>
          <a-col :span="18"><a-input v-model="enName" placeholder="请输入公司英文名"></a-input></a-col>
        </a-row>
        <div slot="footer">
          <a-button type="primary" @click="handleInfoChange" :loading="isEditing">提交</a-button>
          <a-button @click="editInfoVisible = false">取消</a-button>
        </div>
      </a-modal>
    </a-card>
    <a-card style="margin-bottom: 10px" :bordered="false">
      <h3 slot="title">网站数据</h3>
      <a-row style="width: 100%">
        <a-col :span="5" class="text-center">
          <span>累计访客</span>
          <h2>{{ totalVisitors }}</h2>
        </a-col>
        <a-col :span="5" class="text-center">
          <span>今日访客</span>
          <h2>{{ totdayVisitors }}</h2>
        </a-col>
        <a-col :span="4" class="text-center">
          <span>累计询盘</span>
          <h2>{{ totalEnquiries }}</h2>
        </a-col>
        <a-col :span="5" class="text-center">
          <span>今日询盘</span>
          <h2>{{ totdayEnquiries }}</h2>
        </a-col>
        <a-col :span="5" class="text-center">
          <span>平台产品</span>
          <h2>{{ productQuantities }}</h2>
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false">
      <h3 slot="title">流量图表</h3>
      <a-row :gutter="[10, 10]">
        <a-col :span="12">
          <a-card :bordered="false" title="访问量" :style="{ height: '100%' }">
            <a-range-picker v-model="visitorsRange" :style="{ width: '256px' }" slot="extra" @change="fetchVisitorsData" />
            <div class="chart-box">
              <mini-smooth-area :style="{ height: '250px' }" :dataSource="visitorsData" :scale="visitorsScale" />
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card :bordered="false" title="网站询盘" :style="{ height: '100%' }">
            <div slot="extra">
              <a-button style="margin-right: 10px" @click="$router.push('/enquiry')">询盘管理</a-button>
              <a-range-picker v-model="enquiryRange" :style="{ width: '256px' }" @change="fetchEnquiriesData" />
            </div>
            <div class="chart-box">
              <smooth-line :style="{ height: '250px' }" :dataSource="enData" :scale="enquiriesScale" />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import store from '@/store'
import { mapState } from 'vuex'
import { getStatistics, updateConfig, updateWebsite } from '../../api/user'
import { MiniSmoothArea, ChartCard, Trend, SmoothLine } from '@/components'
import DataSet from '@antv/data-set'
import { getEnquiryDataByDay, getVisitorData } from '../../api/visitor'

export default {
  name: 'Home',
  components: {
    ChartCard,
    Trend,
    MiniSmoothArea,
    SmoothLine
  },
  data() {
    this.dateFormat = 'YYYY-MM-DD'
    return {
      visitorsData: [],
      visitorsScale: [],
      enData: [],
      enquiriesScale: [],
      cnName: '',
      enName: '',
      editWebsiteVisible: false,
      editInfoVisible: false,
      siteUrl: '',
      siteName: '',
      isEditing: false,
      totalVisitors: 0,
      totdayVisitors: 0,
      totalEnquiries: 0,
      totdayEnquiries: 0,
      productQuantities: 0,
      visitorsRange: [moment('2020-01-01', this.dateFormat), moment(new Date(), this.dateFormat)],
      enquiryRange: [moment('2020-01-01', this.dateFormat), moment(new Date(), this.dateFormat)]
      // info: {},
      // nick: '',
      // websiteName: '',
      // openDate: '',
      // expDate: '',
      // website: '',
      // userinfo: ''
    }
  },
  watch: {
    visitorsRange(val) {
      console.log(val)
    }
  },
  computed: {
    ...mapState({
      nick: state => state.user.nick,
      websiteName: state => state.user.websiteName,
      openDate: state => state.user.openDate,
      expDate: state => state.user.expDate,
      website: state => state.user.website,
      userinfo: state => state.user.userinfo
    }),
    site() {
      return this.website
        ? this.website.startsWith('http://') || this.website.startsWith('https://')
          ? this.website
          : `http://${this.website}`
        : ''
    }
  },
  created() {
    this.fetchStatistics()
    this.fetchVisitorsData()
    this.fetchEnquiriesData()
  },
  mounted() {
    this.siteUrl = this.website ? this.website : ''
    this.siteName = this.websiteName ? this.websiteName : ''
  },
  methods: {
    fetchEnquiriesData() {
      const enquiryParams = {
        startDate: this.enquiryRange[0],
        endDate: this.enquiryRange[1]
      }
      getEnquiryDataByDay(enquiryParams).then(res => {
        console.log(res)
        const { data } = res
        const enquiriesData = []
        let max = 0
        data.forEach(item => {
          max = item.totalEnquiries > max ? item.totalEnquiries + 20 : max
          const date = item.dateKey.split(' ')
          enquiriesData.push({
            x: date[0],
            总数: item.totalEnquiries,
            待沟通: item.beEnquiries,
            处理中: item.enquirieing,
            无效询盘: item.invalidEnquiries,
            成交: item.dealSuccess
          })
        })
        const dv = new DataSet.View().source(enquiriesData)
        dv.transform({
          type: 'fold',
          fields: ['总数', '待沟通', '处理中', '无效询盘', '成交'],
          key: 'amount',
          value: 'y'
        })
        this.enData = dv.rows
        this.enquiriesScale = [
          {
            dataKey: 'x',
            alias: '周期'
          },
          {
            dataKey: 'y',
            alias: '询盘数',
            min: 0,
            max: max
          }
        ]
      })
    },
    fetchVisitorsData() {
      const visitorParams = {
        startDate: this.visitorsRange[0],
        endDate: this.visitorsRange[1]
      }
      getVisitorData(visitorParams).then(res => {
        const { data } = res
        let max = 0
        for (let i = 0; i < data.length; i++) {
          const date = data[i].dateKey.split(' ')
          max = data[i].value > max ? data[i].value + 10 : max
          this.visitorsData.push({
            x: date[0],
            y: data[i].value
          })
        }
        this.visitorsScale = [
          {
            dataKey: 'x',
            alias: '时间'
          },
          {
            dataKey: 'y',
            alias: '用户数',
            min: 0,
            max: max
          }
        ]
      })
    },
    fetchStatistics() {
      getStatistics()
        .then(res => {
          const { data } = res
          this.totalVisitors = data.totalUv || 0
          this.totdayVisitors = data.todayUv || 0
          this.totalEnquiries = data.totalEnquiry || 0
          this.totdayEnquiries = data.todayEnquiry || 0
          this.productQuantities = data.itemCount || 0
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    handleInfoChange() {
      const params = this.userinfo
      params.siteName = this.cnName
      params.siteEnglishName = this.enName
      updateConfig(params)
        .then(res => {
          this.$message.success(res.msg || '更新成功')
          store.dispatch('GetInfo')
          this.editInfoVisible = false
        })
        .catch(err => {
          this.$message.error(err.msg || '更新失败')
        })
    },
    handleSiteChange() {
      this.isEditing = true
      const params = {
        webUrl: this.siteUrl,
        webName: this.siteName,
        isEditing: false
      }
      updateWebsite(params)
        .then(res => {
          this.$message.success('修改成功')
          store.dispatch('GetInfo')
        })
        .catch(err => {
          this.$message.error(err.msg || '修改失败')
        })
        .finally(() => {
          this.isEditing = false
          this.editWebsiteVisible = false
        })
    }
  }
}
</script>
<style scoped lang="less">
.field {
  margin-right: 10px;
  text-align: justify;
  text-justify: distribute-all-lines; /*ie6-8*/
  text-align-last: justify; /* ie9*/
  -moz-text-align-last: justify; /*ff*/
  -webkit-text-align-last: justify; /*chrome 20+*/
}
.chart-box {
  display: block;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
}
</style>
