<template>
  <div>
    <a-card style="margin-bottom: 10px" :bordered="false" title="基本信息">
      <div>
        <p>
          欢迎您，<b>{{ nick }}</b>
        </p>
        <h2>{{ websiteName }}</h2>
        <p>
          前台网址：
          <a :href="site" target="_blank">{{ website }}</a>
          <a-button style="margin-left: 10px;" type="link" icon="edit" size="small" @click="editWebsiteVisible = true">
            编辑域名
          </a-button>
        </p>
        <p>开通时间：{{ openDate }}</p>
        <p>过期时间：{{ expDate }}</p>
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
    </a-card>
    <a-card :bordered="false" title="网站数据"> </a-card>
  </div>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'
import { updateWebsite } from '../../api/user'
export default {
  name: 'Home',
  data() {
    return {
      editWebsiteVisible: false,
      siteUrl: '',
      siteName: '',
      isEditing: false
    }
  },
  computed: {
    ...mapState({
      nick: state => state.user.nick,
      websiteName: state => state.user.websiteName,
      openDate: state => state.user.openDate,
      expDate: state => state.user.expDate,
      website: state => state.user.website
    }),
    site() {
      return this.website.startsWith('http://') || this.website.startsWith('https://')
        ? this.website
        : `http://${this.website}`
    }
  },
  mounted() {
    this.siteUrl = this.website ? this.website : ''
    this.siteName = this.websiteName ? this.websiteName : ''
  },
  methods: {
    handleSiteChange() {
      this.isEditing = true
      const params = {
        webUrl: this.siteUrl,
        webName: this.siteName,
        isEditing: false
      }
      updateWebsite(params)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功')
            store.dispatch('GetInfo')
          } else throw res
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
