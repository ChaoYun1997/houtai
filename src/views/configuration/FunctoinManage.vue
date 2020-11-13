<template>
  <div>
    <a-card class="card-box" style="margin-top: 10px" :bordered="false" title="功能列表">
      <a-row>
        <a-col :span="2">网站地图</a-col>
        <a-col :span="18">
          <a-textarea v-model="sitemap" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('sitemap')" :disabled="!sitemap">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">提交搜索引擎</a-col>
        <a-col :span="18">
          <a-textarea v-model="searchEngine" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('searchEngine')" :disabled="!searchEngine">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">Robots文件配置</a-col>
        <a-col :span="18">
          <a-textarea v-model="robots" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('robots')" :disabled="!robots">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">页面重定向</a-col>
        <a-col :span="18">
          <a-textarea v-model="redirect" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('redirect')" :disabled="!redirect">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">死链设置</a-col>
        <a-col :span="18">
          <a-textarea v-model="deadlink" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('deadlink')" :disabled="!deadlink">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">谷歌广告代码</a-col>
        <a-col :span="18">
          <a-textarea v-model="googleAds" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('googleAds')" :disabled="!googleAds">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">谷歌分析代码</a-col>
        <a-col :span="18">
          <a-textarea v-model="googleAnalysis" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('googleAnalysis')" :disabled="!googleAnalysis">提交</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">Facebook像素代码</a-col>
        <a-col :span="18">
          <a-textarea v-model="facebookCode" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3" style="margin-left: 10px">
          <a-button type="primary" @click="handleSubmit('facebookCode')" :disabled="!facebookCode">提交</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'FunctionManage',
  data() {
    return {
      sitemap: '',
      searchEngine: '',
      robots: '',
      redirect: '',
      deadlink: '',
      googleAds: '',
      googleAnalysis: '',
      facebookCode: ''
    }
  },
  methods: {
    handleSubmit(type) {
      console.log(type)
    }
  }
}
</script>

<style scoped lang="less">
  .card-box{
    .ant-row{
      margin-bottom: 10px;
    }
  }
</style>
