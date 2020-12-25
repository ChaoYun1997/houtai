<template>
  <div>
    <a-card :bordered="false">
      <h3 slot="title">询盘设置</h3>
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item labelAlign="left" :colon="false" label="询盘成功提示语">
          <a-input v-model="successTips"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" :colon="false" label="询盘成功失败语">
          <a-input v-model="failTips"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" :colon="false" label="域名过滤" placeholder="多个域名用英语逗号','隔开">
          <a-input v-model="domainFilter"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" :colon="false" label="关键词过滤">
          <a-input v-model="keywordFilter" placeholder="多个关键词用英语逗号','隔开"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" :colon="false" label="通知邮件编辑">
          <a-checkbox :checked="isNoticeOpened" class="mb-10 d-block" @change="e => handleChange(e, 0)">
            发送新询盘提醒邮件
          </a-checkbox>
          <a-checkbox
            :checked="isNoticeSendTo"
            class="mb-10 d-block"
            style="margin-left:0"
            @change="e => handleChange(e, 1)"
            v-if="isNoticeOpened"
          >
            是否将邮件抄送给指定邮箱
          </a-checkbox>
          <div class=" d-block">
            <a-input style="width:200px;" v-if="isNoticeSendTo" placeholder="请输入邮箱地址" v-model="email"></a-input>
            <a-alert style="width:200px;" type="error" message="请输入正确的邮箱地址" v-if="errEmail" banner />
          </div>
        </a-form-item>
        <a-form-item labelAlign="left" :colon="false">
          <div slot="label">
            <span>询盘成功</span>
            <span>跳转页面</span>
          </div>
          <a-select v-model="page" placeholder="请选择" style="width: 120px">
            <a-select-option value="all">请选择</a-select-option>
            <a-select-option v-for="item in list" :value="item.url" :key="item.name">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <br />
      <a-button type="primary" @click="handleEnquirySetting" :disabled="!isNoticeOpened" :loading="loading">
        保存
      </a-button>
    </a-card>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { saveEnquirySetting, getEnquirySetting } from '@/api/enquiry'

const pageList = [
  {
    name: 'home',
    url: '/index.html'
  },
  {
    name: 'about',
    url: '/about.html'
  }
]
export default {
  name: 'EnquirySetting',
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
      successTips: '',
      failTips: '',
      domainFilter: '',
      keywordFilter: '',
      page: 'all',
      list: pageList,
      isNoticeOpened: false,
      isNoticeSendTo: false,
      email: '',
      errEmail: false,
      loading: false
    }
  },
  created() {
    this.initEnquirySetting()
  },
  methods: {
    initEnquirySetting() {
      getEnquirySetting()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.isNoticeOpened = res.data.isNewEnquiryRemind
            this.isNoticeSendTo = res.data.isCopySendEmail
            this.email = res.data.copySendEmail
            this.failTips = res.data.enquiryErrorMsg
            this.successTips = res.data.enquirySuccessMsg
            this.domainFilter = res.data.enquiryUrlFilter
            this.keywordFilter = res.data.enquiryKeysfilter.join(' ')
            this.page = res.data.enquirySuccessUrl
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '获取规则失败')
        })
    },
    handleChange(e, index) {
      if (index === 0) {
        this.isNoticeOpened = e.target.checked
      } else {
        this.isNoticeSendTo = e.target.checked
      }
    },
    handleEnquirySetting() {
      if (this.isNoticeSendTo) {
        if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)) {
          this.errEmail = true
          return
        } else {
          this.errEmail = false
        }
      }
      const param = {
        enquiryErrorMsg: this.failTips,
        enquirySuccessMsg: this.successTips,
        enquirySuccessUrl: this.page,
        enquiryUrlFilter: this.domainFilter,
        enquiryKeysfilter: this.keywordFilter.split(','),
        isNewEnquiryRemind: this.isNoticeOpened,
        isCopySendEmail: this.isNoticeSendTo,
        copySendEmail: this.email
      }
      console.log(param)
      this.loading = true
      saveEnquirySetting(param)
        .then(res => {
          this.$message.success('保存成功')
        })
        .catch(err => {
          this.$message.error(err.msg || '保存失败')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/es/style/themes/default.less';

.d-block {
  display: block;
}

.mb-10 {
  margin-bottom: 10px;
}

.ant-card-actions {
  li {
    text-align: left !important;
  }
}

.kLayout {
  position: relative;
}

.fixeTab {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  background: white;
}
</style>
