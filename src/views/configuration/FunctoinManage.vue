<template>
  <div>
    <a-card class="card-box" style="margin-top: 10px" :bordered="false">
      <h3 slot="title">功能列表</h3>
      <a-row style="margin-bottom: 45px">
        <a-col :span="2">网站地图</a-col>
        <a-col :span="18">
          <a-button v-if="!sitemapCreated" @click="createSitemap" :loading="creating">生成站点地图</a-button>
          <template v-else>
            <a :href="siteHtml" class="link-btn">html</a>
            <a :href="siteXml" class="link-btn left-split">Xml</a>
            <a-button style="margin-right: 10px" type="primary" @click="handleSubmitSitemap(1)">提交到谷歌</a-button>
            <a-button type="primary" @click="handleSubmitSitemap(2)">提交到必应</a-button>
          </template>

          <!--          <a-textarea v-model="sitemap" :auto-size="{ minRows: 3, maxRows: 5 }" />-->
        </a-col>
      </a-row>
      <!--      <a-row>-->
      <!--        <a-col :span="2">提交搜索引擎</a-col>-->
      <!--        <a-col :span="18">-->
      <!--          <a-textarea v-model="searchEngine" :auto-size="{ minRows: 3, maxRows: 5 }" />-->
      <!--        </a-col>-->
      <!--      </a-row>-->
      <a-row>
        <a-col :span="2">Robots文件配置</a-col>
        <a-col :span="18">
          <a-textarea v-model="robots" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">页面重定向</a-col>
        <a-col :span="18">
          <a-textarea v-model="redirect" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">死链设置</a-col>
        <a-col :span="18">
          <a-textarea v-model="deadlink" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">谷歌广告代码</a-col>
        <a-col :span="18">
          <a-textarea v-model="googleAds" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">谷歌分析代码</a-col>
        <a-col :span="18">
          <a-textarea v-model="googleAnalysis" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">Facebook像素代码</a-col>
        <a-col :span="18">
          <a-textarea v-model="facebookCode" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
      <a-button type="primary" @click="handleSubmit">提交</a-button>
    </a-card>
  </div>
</template>

<script>
import { getUserInfo, updateConfig } from '../../api/user'
import { getSitemap, submitSitemap } from '../../api/userset'

const langs = ['英语', '中文']
export default {
  name: 'FunctionManage',
  data() {
    this.langs = langs
    return {
      sitemap: '',
      searchEngine: '',
      robots: '',
      redirect: '',
      deadlink: '',
      googleAds: '',
      googleAnalysis: '',
      facebookCode: '',
      language: '',
      tongji: '',
      copyright: '',
      creating: false,
      sitemapCreated: false,
      siteHtml: '',
      siteXml: '',
      info: {}
    }
  },
  created() {
    this.fetchdata()
  },
  methods: {
    fetchdata() {
      getUserInfo()
        .then((res) => {
          const { data } = res
          this.info = data
          this.robots = data.robots
          this.redirect = data.urlRedirect
          this.language = data.language
          this.facebookCode = data.fbCode
          this.tongji = data.tongji
          this.copyright = data.copyright
          this.googleAnalysis = data.analytics
          this.googleAds = data.googleAd
          this.deadlink = data.dieChain
        })
        .catch((err) => {
          this.$message.error(err.msg)
        })
    },
    handleSubmitSitemap(type) {
      if (type === 1) {
        window.open('https://www.google.com/webmasters/tools/submit-url')
        return false
      }
      const params = {
        type: type
      }
      submitSitemap(params)
        .then((res) => {
          if (res.code !== 200) throw res
          this.$message.success('提交成功')
        })
        .catch((err) => {
          this.$message.error(err.msg || '提交失败')
        })
    },
    createSitemap() {
      this.creating = true
      getSitemap()
        .then((res) => {
          if (res.code !== 200) throw res
          this.$message.success(res.data.msg || '生成成功')
          this.sitemapCreated = true
          this.siteHtml = res.data.html
          this.siteXml = res.data.xml
        })
        .catch((err) => {
          console.log(JSON.stringify(err))
          this.$message.error(err.msg || '生成失败')
          this.sitemapCreated = false
        })
        .finally(() => {
          this.creating = false
        })
    },
    handleSubmit() {
      const params = this.info
      params.language = this.language
      params.robots = this.robots
      params.fbCode = this.facebookCode
      params.tongji = this.tongji
      params.copyright = this.copyright
      params.analytics = this.googleAnalysis
      params.googleAd = this.googleAds
      params.urlRedirect = this.redirect
      params.dieChain = this.deadlink
      console.log(params)
      updateConfig(params)
        .then((res) => {
          if (res.code !== 200) throw res
          this.$message.success('更新成功')
        })
        .catch((err) => {
          this.$message.error(err.msg || '更新失败')
        })
    }
  }
}
</script>

<style scoped lang="less">
.card-box {
  .ant-row {
    margin-bottom: 10px;
  }
}
</style>
