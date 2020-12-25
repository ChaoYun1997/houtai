<template>
  <div>
    <a-card :bordered="false" >
      <h3 slot="title">页面列表</h3>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :alert="true"
      >
        <span slot="type" slot-scope="text">{{ text === 0 ? '系统默认' : '自定义页面' }}</span>
        <div class="action" slot="action" slot-scope="text, record">
          <span @click="preview(record.pageUrl)" class="link-btn right-split">预览</span>
          <span @click="$router.push('/configuration/pageDetails/'+record.id)" class="link-btn">编辑</span>
          <template v-if="record.pageType !== 0">
            <a-popconfirm title="你确定要删除该数据吗?" @confirm="del(record.id)">
              <span class="link-btn left-split">删除</span>
            </a-popconfirm>
          </template>
        </div>
      </s-table>

      <div class="table-operator">
        <div slot="title">
          <a-button type="primary" @click="$router.push('/configuration/pageDetails')">新增</a-button>
          <a-popconfirm title="你确定要重置所有页面吗?" @confirm="resetPage">
<!--            <a-button type="primary">重置默认页面</a-button>-->
          </a-popconfirm>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  import STable from '@/components/Table'
  import { delPage, getPageList } from '../../api/configuration'
  import { mapState } from 'vuex'

  const columns = [
    {
      title: '页面类型',
      dataIndex: 'pageType',
      scopedSlots: {
        customRender: 'type'
      },
      align: 'center'
    },
    {
      title: '页面名称',
      dataIndex: 'pageName',
      align: 'center'
    },
    {
      title: '网页title',
      dataIndex: 'pageTitle',
      align: 'center'
    },
    {
      title: 'URL',
      dataIndex: 'pageUrl',
      align: 'center'
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
  export default {
    name: 'PageManage',
    components: {
      STable
    },
    data() {
      return {
        columns,
        queryParam: {},
        loadData: parameter => {
          return getPageList(Object.assign(parameter, this.queryParam))
        }
      }
    },
    computed: {
      ...mapState({
        website: (state) => {
          return /^http/.test(state.user.website)
            ? state.user.website
            : process.env.VUE_APP_PROTOCAL_HEAD + state.user.website
        }
      })
    },
    methods: {
      resetPage() {
      },
      // 预览
      preview(path) {
        const link = this.website + path
        window.open(link, '_blank')
      },
      // 删除
      del(id) {
        delPage({ id: id }).then((res) => {
          if (res.code === 200) this.$message.success('操作成功')
          this.$refs.table.refresh(true)
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~ant-design-vue/lib/style/themes/default.less';
</style>
