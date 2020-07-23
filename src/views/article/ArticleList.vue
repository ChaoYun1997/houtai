<template>
  <div>
    <a-card :bordered="false">
      <div class="table-operator">
        <div slot="title">
          <a-button type="primary" icon="plus" @click="$router.push('/articles/add-article')">新增文章</a-button>
        </div>
      </div>

      <div class="table-page-search-wrapper" style="padding-bottom:20px;">
        <a-select placeholder="文章分类" v-model="cateParam" style="width: 160px; margin-right:8px">
          <a-select-option value="all">全部文章分类</a-select-option>
          <template v-for="(item, index) in category">
            <a-select-option :value="item.id" :key="index">{{ item.catName }}</a-select-option>
          </template>
        </a-select>
        <a-input
          v-model="queryParam.keyWords"
          placeholder="请输入文章标题"
          style="width: 160px; margin-right:10px;"
        ></a-input>

        <a-select placeholder="所有状态" v-model="statusParam" style="width: 160px;margin-right:20px;">
          <a-select-option value="all">全部状态</a-select-option>
          <a-select-option value="0">正常</a-select-option>
          <a-select-option value="1">草稿</a-select-option>
          <a-select-option value="2">定时发布</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleQuery">查询</a-button>
        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
      </div>
      <div>
        <a-button @click="handleDel">删除文章</a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleMoveTo">移动到</a-button>
      </div>
      <br />
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :getSortField="returnSortFile"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <!--        <a-button slot="title" slot-scope="text" type="link" size="small">{{ text }}</a-button>-->
        <a-checkbox
          slot="isTop"
          slot-scope="text, record"
          :default-checked="text"
          @change="handleChecked(record.id)"
        ></a-checkbox>
        <span slot="status" slot-scope="text">
          {{ text === 0 ? '正常' : text === 1 ? '草稿' : '定时发布' }}
        </span>
        <span slot="author" slot-scope="text">
          {{ text || '本站编辑' }}
        </span>
        <div class="action" slot="action" slot-scope="text, record">
          <a-button type="primary" icon="edit" size="small" @click="edit(record.id)" />
          <a-popconfirm title="你确定要删除该文章吗?" @confirm="del(record.id)">
            <a-button type="danger" icon="delete" size="small" />
          </a-popconfirm>
          <a-button icon="share-alt" size="small" @click="share(record.id)" />
          <a-button icon="eye" size="small" @click="preview(record.shopUrl)" />
        </div>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/Table'
import { getArticles, delArticle } from '@/api/article'
import { getArticleCate } from '@/api/category'

const columns = [
  {
    title: '标题',
    dataIndex: 'articleTitle',
    scopedSlots: {
      customRender: 'title'
    },
    sorter: true
  },
  {
    title: '置顶',
    dataIndex: 'isTop',
    scopedSlots: {
      customRender: 'isTop'
    },
    sorter: true
  },
  {
    title: '文章分类',
    dataIndex: 'catId',
    scopedSlots: {
      customRender: 'cate'
    },
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status'
    },
    sorter: true
  },
  {
    title: '发布人',
    dataIndex: 'articleAuthor',
    scopedSlots: {
      customRender: 'author'
    }
  },
  {
    title: '发布时间',
    dataIndex: 'releaseDate',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateDate',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'List',
  components: {
    STable
  },
  data() {
    this.columns = columns
    return {
      loadData: parameter => {
        return getArticles(Object.assign(parameter, this.queryParam))
      },
      category: [],
      selectedRowKeys: [],
      selectedRows: [],
      queryParam: {},
      cateParam: 'all',
      statusParam: 'all'
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    loadCateData() {
      const params = {
        pageIndex: 1,
        pageSize: 50
      }
      getArticleCate(params).then(res => {
        res.data.datas.forEach(item => {
          console.log(item)
          this.category.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
    },
    // 表格字段排序
    returnSortFile(columnKey) {
      const sortObj = {
        articleTitle: 1,
        isTop: 2,
        catId: 3,
        status: 4,
        releaseDate: 5,
        updateDate: 6
      }
      return sortObj[columnKey]
    },
    // 编辑文章
    edit(id) {
      console.log(id)
      this.$router.push('/articles/add-article/' + id)
    },
    // 删除文章
    del(id) {
      console.log(id)
      delArticle({ id: id }).then(res => {
        if (res.code === 200) this.$message.success('操作成功')
        this.$refs.table.refresh(true)
      })
    },
    // 预览文章
    preview(url) {
      const host = process.env.VUE_APP_WEBSITE
      window.open(`${host}/${url}`)
    },
    // 分享文章
    share(result) {
      console.log(result)
    },
    // 修改文章置顶
    handleChecked(id) {
      console.log(id)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 查询
    handleQuery() {
      if (this.statusParam !== 'all') {
        this.queryParam.status = Number(this.statusParam)
      } else {
        delete this.queryParam.status
      }
      if (this.cateParam !== 'all') {
        this.queryParam.catId = Number(this.cateParam)
      }
      console.log(this.queryParam)
      this.$refs.table.refresh(true)
    },
    // 重置查询
    handleReset() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getArticles()
    },
    // 切换查询状态
    handleStatusSelect(value) {
      this.queryParam.isShelve = parseInt(value) === 1
    },
    // 选择分类
    handleCateSelected(value) {
      console.log(value)
      this.queryParam.catId = value
    },
    handleDel() {
      if (!this.checkSelected()) return
      console.log('del')
    },
    handleMoveTo() {
      if (!this.checkSelected()) return
      console.log('move to')
    }
  }
}
</script>

<style scoped></style>
