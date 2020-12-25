<template>
  <div>
    <a-card :body-style="{ padding: '0 32px 24px' }" :bordered="false">
      <h3 slot="title">选择关键词内链的生成规则</h3>
      <a-radio-group v-model="value">
        <a-radio :style="radioStyle" :value="0">每个关键词都生成关键词内链</a-radio>
        <a-radio :style="radioStyle" :value="1">只有当关联的产品/文章数大于3个才生成关键词内链</a-radio>
        <a-radio :style="radioStyle" :value="2">只有当关联的产品/文章数大于5个才生成关键词内链</a-radio>
        <a-radio :style="radioStyle" :value="3">只有当关联的产品/文章数大于8个才生成关键词内链</a-radio>
        <a-radio :style="radioStyle" :value="4">不生成内链</a-radio>
      </a-radio-group>
      <br />
      <a-button style="margin-top:10px" type="primary" @click="handleKeywordSetting" :loading="loading">保存</a-button>
    </a-card>
  </div>
</template>

<script>
import { saveKeywordSetting, getKeywordSetting } from '@/api/keyword'
export default {
  name: 'KeywordSetting',
  data() {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      value: null,
      loading: false
    }
  },
  created() {
    this.initKeywordSetting()
  },
  methods: {
    initKeywordSetting() {
      getKeywordSetting()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.value = res.data.ruleType
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '获取设置失败')
        })
    },
    handleKeywordSetting() {
      const param = {
        ruleType: this.value
      }
      this.loading = true
      saveKeywordSetting(param)
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
.kLayout {
  position: relative;
}
.fixeTab {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  background: white;
}
</style>
