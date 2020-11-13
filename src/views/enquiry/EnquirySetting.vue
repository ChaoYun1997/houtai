<template>
  <div>
    <a-card title="询盘设置" :body-style="{ padding: '0 32px 24px' }" :bordered="false">
      <h3>设置询盘收发规则</h3>
      <br />
      <a-checkbox :checked="isNoticeOpened" class="mb-10 d-block" @change="e => handleChange(e, 0)">发送新询盘提醒邮件</a-checkbox>
      <a-checkbox :checked="isNoticeSendTo" class="mb-10 d-block" style="margin-left:0" @change="e => handleChange(e, 1)" v-if="isNoticeOpened">
        是否将邮件抄送给指定邮箱
      </a-checkbox>
      <div class="mb-10 d-block">
        <a-input style="width:200px;" v-if="isNoticeSendTo" placeholder="请输入邮箱地址" v-model="email"></a-input>
        <a-alert style="width:200px;" type="error" message="请输入正确的邮箱地址" v-if="errEmail" banner />
      </div>
      <br />
      <a-button type="primary" @click="handleEnquirySetting" :disabled="!isNoticeOpened" :loading="loading">
        保存
      </a-button>
    </a-card>
  </div>
</template>

<script>
  import { saveEnquirySetting, getEnquirySetting } from '@/api/enquiry'
  export default {
    name: 'EnquirySetting',
    data() {
      return {
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
              console.log(typeof res.data.isNewRemind)
              this.isNoticeOpened = res.data.isNewRemind
              this.isNoticeSendTo = res.data.isCopyEmail
              this.email = res.data.copyEmail
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
          isNewRemind: this.isNoticeOpened,
          isCopyEmail: this.isNoticeSendTo,
          copyEmail: this.email
        }
        this.loading = true
        saveEnquirySetting(param)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
            } else {
              throw res
            }
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
  h3 {
    margin-top: 40px;
    font-weight: bold;
    &:before {
      display: inline;
      content: '';
      border-left: 5px solid @primary-color;
      padding-left: 10px;
      height: 24px;
    }
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
