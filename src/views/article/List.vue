<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div slot="title">
        <a-button type="primary" @click="handleDel">
          删除文章
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleMoveTo">
          移动到
        </a-button>
      </div>
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col>
            <a-form-item>
              <a-select placeholder="文章分类" default-value="0" @change="handleCateSelected" style="width: 160px;">
                <a-select-option value="0">全部文章分类</a-select-option>
                <template v-for="(item, index) in category">
                  <a-select-option :value="item.id" :key="index">
                    {{ item.catName }}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
            <a-form-item :lable-col="{ span: 24, offset: 12 }">
              <a-input v-model="queryParam.keyWords" placeholder="请输入文章标题" style="width: 160px;"></a-input>
            </a-form-item>
            <a-form-item>
              <a-select @change="handleStatusSelect" placeholder="所有状态" default-value="0" style="width: 160px;">
                <a-select-option value="0">全部状态</a-select-option>
                <a-select-option value="1">上架</a-select-option>
                <a-select-option value="2">下架</a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" @click="handleQuery">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <br />
    <a-card>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <!--        <a-button slot="title" slot-scope="text" type="link" size="small">{{ text }}</a-button>-->
        <a-checkbox
          slot="isTop"
          slot-scope="text, record"
          :default-checked="text"
          @change="handleChecked(record.id)"
        ></a-checkbox>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import STable from '@/components/Table'
import { getArticles } from '@/api/article'

const columns = [
  {
    title: '标题',
    dataIndex: 'articleTitle',
    scopedSlots: {
      customRender: 'title'
    }
  },
  {
    title: '置顶',
    dataIndex: 'isTop',
    scopedSlots: {
      customRender: 'isTop'
    }
  },
  {
    title: '文章分类',
    dataIndex: 'catId',
    scopedSlots: {
      customRender: 'cate'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status'
    }
  },
  {
    title: '发布人',
    dataIndex: 'articleAuthor'
  },
  {
    title: '发布时间',
    dataIndex: 'releaseDate'
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
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      }
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
      console.log(this.queryParam)
      this.getArticles()
      // this.$refs.table.refresh(true)
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
