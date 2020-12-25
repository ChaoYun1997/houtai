<template>
  <div>
    <a-card :bordered="false">
      <h3 slot="title">页面编辑</h3>
      <a-row :gutter="[10, 10]" style="width: 1024px">
        <a-col :span="2">
          <span class="required">页面类型</span>
        </a-col>
        <a-col :span="8">
          <a-select :default-value="type" class="full-width" @change="handleTypeChange">
            <a-select-option value="0">
              系统默认
            </a-select-option>
            <a-select-option value="1">
              自定义
            </a-select-option>
          </a-select>
        </a-col>
        <a-col offset="1" :span="2">
          <span class="required">页面名称</span>
        </a-col>
        <a-col :span="8">
          <a-input v-model="pageName" placeholder="请输入页面名称" />
        </a-col>
      </a-row>
      <a-row :gutter="[10, 10]" style="width: 1024px">
        <a-col :span="2">
          <span class="required">简要描述</span>
        </a-col>
        <a-col :span="19">
          <a-textarea v-model="pageDesc" placeholder="请输入简要描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
      </a-row>
    </a-card>

    <a-card style="margin-top: 10px" :bordered="false">
      <h3 slot="title">SEO设置</h3>
      <a-row :gutter="[10, 10]" style="width: 1024px">
        <a-col :span="3">
          <span class="">自定义URL</span>
        </a-col>
        <a-col :span="16">
          <a-input v-model="seoUrl" placeholder="请输入自定义URL,例如 /contact" />
        </a-col>
        <a-col :span="3">
          <a-button block type="primary" @click="handleRecommand">系统推荐</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="[10, 10]" style="width: 1024px">
        <a-col :span="3">
          <span class="">标题 Title</span>
        </a-col>
        <a-col :span="19">
          <a-input v-model="seoTitle" placeholder="请输入标题Title" />
        </a-col>
      </a-row>
      <a-row :gutter="[10, 10]" style="width: 1024px">
        <a-col :span="3">
          <span class="">关键词 Keyword</span>
        </a-col>
        <a-col :span="16">
          <a-input v-model="seoKeyWords" placeholder="请输入关键词Keyword" />
        </a-col>
        <a-col :span="3">
          <a-button block type="primary" @click="handleAddKeyword">系统添加</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="[10, 10]" style="width: 1024px">
        <a-col :span="3">
          <span class="">描述 Description</span>
        </a-col>
        <a-col :span="19">
          <a-textarea v-model="seoDesc" placeholder="请输入描述Describe" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="19">
          <br />
          <a-button type="primary" @click="handleSubmit" :loading="loading">提交</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { updatePage, addPage, getPageList } from '../../api/configuration'

export default {
  name: 'PageDetails',
  data() {
    return {
      type: '0',
      pageDesc: '',
      pageName: '',
      loading: false,
      seoTitle: '',
      seoKeyWords: '',
      seoDesc: '',
      seoUrl: '',
      originUrl: ''
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.fetchDetails(id)
    }
  },
  methods: {
    handleAddKeyword() {
      if (!this.pageName || !this.seoTitle) {
        this.$message.error('内容根据名称、标题等生成，请先填写')
        return
      }
      this.seoKeyWords = this.pageName + ' ' + this.seoTitle
    },
    handleRecommand() {
      if (!this.pageName) {
        this.$message.error('内容根据名称生成，请先填写名称')
        return
      }
      this.seoUrl = '/' + this.pageName
    },
    fetchDetails(id) {
      getPageList()
        .then(res => {
          const target = res.data.datas.find(item => {
            return String(item.id) === id
          })
          console.log(id, target)
          this.pageName = target.pageName
          this.type = target.pageType
          this.pageDesc = target.pageDesc
          this.seoUrl = target.pageUrl
          this.originUrl = target.pageUrl
          this.seoKeyWords = target.pageKeywords
          this.seoTitle = target.pageTitle
          this.seoDesc = target.pageDescription
        })
        .catch(err => {
          this.$message.error(err.msg || '获取详情失败')
        })
    },
    handleTypeChange(type) {
      console.log(type)
      this.type = type
    },
    handleSubmit() {
      if (!this.pageName) {
        this.$message.error('请输入页面名称')
        return false
      }
      if (!this.pageDesc) {
        this.$message.error('请输入简要描述')
        return false
      }
      this.loading = true
      const { id } = this.$route.params
      const params = {
        pageName: this.pageName,
        pageType: this.type,
        pageDesc: this.pageDesc,
        pageTitle: this.seoTitle,
        pageUrl: this.seoUrl,
        pageDescription: this.seoDesc,
        pageKeywords: this.seoKeyWords
      }
      if (id) {
        params.id = id
        // if (this.originUrl === params.pageUrl) delete params.pageUrl
        updatePage(params)
          .then(res => {
            this.$message.success(res.msg || '提交成功')
          })
          .catch(err => {
            this.$message.error(err.msg || '提交失败')
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        addPage(params)
          .then(res => {
            this.$message.success('提交成功')
            this.$router.push('/configuration')
          })
          .catch(err => {
            this.$message.error(err.msg || '提交失败')
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';
.link-btn {
  display: inline-block;
  padding: 0 3px;
  color: @primary-color;
  cursor: pointer;
  line-height: 24px;
  height: 24px;
  &.right-split {
    border-right: 1px solid #999999;
  }
  &.left-split {
    border-left: 1px solid #999999;
  }
}
.full-width {
  width: 100%;
}
</style>
