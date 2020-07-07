<template>
  <page-header-wrapper>
    <div class="table-page-search-wrapper">
      <a-input-search
        placeholder="请输入关键词"
        enter-button="搜索"
        style="width:320px;margin-left: 10px;"
        @search="onSearch"
      />
    </div>
    <a-card>
      <a-menu class="keyword-menu" theme="dark" mode="horizontal">
        <a-menu-item @click="showAddKeyword = true"> <a-icon type="plus" />添加关键词</a-menu-item>
        <a-sub-menu @click="handleSubMenuClick">
          <span slot="title" class="submenu-title-wrapper">关联产品数 {{ productMenu }}<a-icon type="down"/></span>
          <a-menu-item-group>
            <a-menu-item key="product:1">
              所有
            </a-menu-item>
            <a-menu-item key="product:2">
              小于5个
            </a-menu-item>
            <a-menu-item key="product:3">
              5~10个
            </a-menu-item>
            <a-menu-item key="product:4">
              11~20个
            </a-menu-item>
            <a-menu-item key="product:5">
              大于20个
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-sub-menu @click="handleSubMenuClick">
          <span slot="title" class="submenu-title-wrapper">关联文章数 {{ articleMenu }}<a-icon type="down"/></span>
          <a-menu-item-group>
            <a-menu-item key="article:1">
              所有
            </a-menu-item>
            <a-menu-item key="article:2">
              小于5个
            </a-menu-item>
            <a-menu-item key="article:3">
              5~10个
            </a-menu-item>
            <a-menu-item key="article:4">
              11~20个
            </a-menu-item>
            <a-menu-item key="article:5">
              大于20个
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-sub-menu @click="handleSubMenuClick">
          <span slot="title" class="submenu-title-wrapper">关联产品分类数 {{ cateMenu }}<a-icon type="down"/></span>
          <a-menu-item-group>
            <a-menu-item key="cate:1">
              所有
            </a-menu-item>
            <a-menu-item key="cate:2">
              小于5个
            </a-menu-item>
            <a-menu-item key="cate:3">
              5~10个
            </a-menu-item>
            <a-menu-item key="cate:4">
              11~20个
            </a-menu-item>
            <a-menu-item key="cate:5">
              大于20个
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
      </a-menu>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data="loadData"
        bordered
      >
        <template slot="keyword" slot-scope="text, record">
          <editable-cell :text="text" @change="edit(record.id)" @delete="del(record.id)" />
        </template>
        <!--        <div slot="keyword" slot-scope="text, record">-->
        <!--          <a-row type="flex" justify="space-between">-->
        <!--            <a-col :span="12">-->
        <!--              {{ text }}-->
        <!--            </a-col>-->
        <!--            <a-col :span="5">-->
        <!--              <a-button style="margin-right: 5px" type="primary" icon="edit" size="small" @click="edit(record.id)" />-->
        <!--              <a-button type="danger" icon="delete" size="small" @click="del(record.id)"  />-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </div>-->
        <div slot="action" slot-scope="text, record">
          <a-dropdown :trigger="['click']" style="margin-right: 10px;">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 添加到产品 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="appendToNew('product', record.keyWord)">
                新产品
              </a-menu-item>
              <a-menu-item key="1" @click="appendTo('product', record.keyWord)">
                已有产品
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown :trigger="['click']" style="margin-right: 10px;">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 添加到文章 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="appendToNew('article', record.keyWord)">
                新文章
              </a-menu-item>
              <a-menu-item key="1" @click="appendTo('article', record.keyWord)">
                已有文章
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown :trigger="['click']" style="margin-right: 10px;">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 添加到产品分类 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="appendToNew('cate', record.keyWord)">
                新产品分类
              </a-menu-item>
              <a-menu-item key="1" @click="appendTo('cate', record.keyWord)">
                已有产品分类
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </s-table>
    </a-card>
    <a-modal v-model="showAddKeyword" centered title="新增关键词">
      <p class="info">添加关键词多个关键词用回车、换行分隔，不要输入标点符号</p>
      <a-textarea v-model="keywords" :auto-size="{ minRows: 6 }" />
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAddKeyword" :disabled="!keywords">确 定</a-button>
        <a-button @click="showAddKeyword = false">取 消</a-button>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import STable from '@/components/Table'
import { getKeyword, addKeywords } from '@/api/keyword'
import EditableCell from '@/components/EditableCell'

const columns = [
  {
    title: '关键词',
    dataIndex: 'keyWord',
    scopedSlots: { customRender: 'keyword' },
    width: 320
  },
  {
    title: '更新时间',
    dataIndex: 'modifyDate'
  },

  {
    title: '关联产品',
    dataIndex: 'associatedItemCount',
    align: 'center'
  },

  {
    title: '关联文章',
    dataIndex: 'associatedArticleCount',
    align: 'center'
  },

  {
    title: '关联产品分类',
    dataIndex: 'associatedCatCount',
    align: 'center'
  },
  {
    title: '添加关键词',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'KeywordList',
  components: {
    STable,
    EditableCell
  },
  data() {
    this.columns = columns
    return {
      showAddKeyword: false,
      keywords: '',
      productMenu: '',
      articleMenu: '',
      cateMenu: '',
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      selectedRowKeys: [],
      selectedRows: [],
      loadData: param => {
        param = Object.assign(param, this.queryParam)
        return getKeyword(param)
      }
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSubMenuClick(item) {
      // const sort = new Map([
      //   ['product:1', ['productMenu', '']],
      //   ['product:2', ['productMenu', '']]
      // ])
      const itemName = item.domEvent.target.innerText
      console.log(item.key, itemName)
      if (item.key.indexOf('product') !== -1) {
        this.productMenu = itemName === '所有' ? '' : itemName
      } else if (item.key.indexOf('article') !== -1) {
        this.articleMenu = itemName === '所有' ? '' : itemName
      } else if (item.key.indexOf('cate') !== -1) {
        this.cateMenu = itemName === '所有' ? '' : itemName
      }
    },
    handleSort() {
      console.log('查询排序结果')
    },
    // 新增关键词
    handleAddKeyword() {
      const keywords = this.keywords
        .split(/\n/)
        .filter(item => {
          if (item.trim()) {
            return item
          }
        })
        .map(item => {
          return item.trim()
        })
      // const params = {}
      // TODO
      addKeywords(keywords)
        .then(res => {
          if (res.code === 200) {
            this.success()
          } else {
            throw res
          }
        })
        .catch(err => {
          this.fail(err)
        })
    },
    success() {
      this.$message.success('操作成功')
    },
    fail(err) {
      this.$message.error(err.msg)
    },
    onSearch(value) {
      console.log(value)
    },
    edit(value) {
      console.log(value)
    },
    del(value) {
      console.log(value)
    },
    appendToNew(type, keyword) {
      console.log(type, keyword)
    },
    appendTo(type, keyword) {
      console.log(type, keyword)
    }
  }
}
</script>

<style scoped>
.keyword-menu {
  .ant-menu.ant-menu-dark .ant-menu-item-selected {
    background: none;
  }
}
.table-page-search-wrapper {
  background: white;
  padding: 10px 0;
}
.ant-menu-horizontal > .ant-menu-item-selected {
  color: white;
}
.info {
  line-height: 24px;
  color: #aaa;
  font-size: @font-size-sm;
}
</style>
