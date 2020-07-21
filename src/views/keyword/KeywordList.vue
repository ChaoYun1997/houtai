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
          <editable-cell :text="text" @change="val => edit(val, record.id)" @delete="del(record.id)" />
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
              <a-menu-item key="0" @click="appendToNew('product', record.keyWord, record.id)">
                新产品
              </a-menu-item>
              <a-menu-item key="1" @click="appendTo('product', record.id)">
                已有产品
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown :trigger="['click']" style="margin-right: 10px;">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 添加到文章 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="appendToNew('article', record.keyWord, record.id)">
                新文章
              </a-menu-item>
              <a-menu-item key="1" @click="appendTo('article', record.id)">
                已有文章
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown :trigger="['click']" style="margin-right: 10px;">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 添加到产品分类 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="appendToNew('cate', record.keyWord, record.id)">
                新产品分类
              </a-menu-item>
              <a-menu-item key="1" @click="appendTo('cate', record.id)">
                已有产品分类
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </s-table>
    </a-card>
    <a-modal width="620" v-model="showAddKeyword" centered title="新增关键词">
      <p class="info">添加关键词多个关键词用回车、换行分隔，不要输入标点符号</p>
      <a-textarea v-model="keywords" :auto-size="{ minRows: 6 }" />
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAddKeyword" :disabled="!keywords">确 定</a-button>
        <a-button @click="showAddKeyword = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal :width="320" v-model="cateVisible" centered title="选择产品分类" @cancel="closeAppend">
      <a-checkbox-group @change="onCategoryChange">
        <a-row>
          <template v-for="item in categoryOptions">
            <a-col :key="item.label">
              <a-checkbox :value="item.id" :disabled="item.id === 'all'">{{ item.label }}</a-checkbox>
            </a-col>
          </template>
        </a-row>
      </a-checkbox-group>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAppendTo" :disabled="!currentSelectedRowKeys.length">确 定</a-button>
        <a-button @click="closeAppend">取 消</a-button>
      </div>
    </a-modal>
    <a-modal :width="820" v-model="productVisible" centered title="选择产品" @cancel="closeAppend">
      <a-row :gutter="10">
        <a-col :span="12">
          <a-select
            placeholder="请选择产品分类"
            :options="categoryOptions"
            style="width: 160px"
            @change="handleProductCateChange"
          >
          </a-select>
          <a-input-search
            placeholder="请输入产品标题"
            enter-button="搜索"
            style="width:200px;margin-left: 10px;"
            @search="onProductSearch"
          />
          <s-table
            class="article-table"
            size="small"
            ref="productTable"
            :rowKey="record => record.id"
            :scroll="{ y: 380 }"
            :columns="productColumns"
            :data="loadProductData"
            :rowSelection="currentRowSelection"
          >
          </s-table>
        </a-col>
        <a-col :span="12" class="article-list">
          <h5>已选择的相关产品</h5>
          <ul class="selected-articles">
            <template v-for="(item, index) in currentSelected">
              <li :key="index">
                <span>{{ item.shopTitle }}</span>
                <a-icon class="del-icon" type="close" @click="handleDelCurrent(item.id)"></a-icon>
              </li>
            </template>
          </ul>
        </a-col>
      </a-row>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAppendTo" :disabled="!currentSelectedRowKeys.length">确 定</a-button>
        <a-button @click="closeAppend">取 消</a-button>
      </div>
    </a-modal>
    <a-modal :width="820" v-model="articleVisible" centered title="选择文章" @click="closeAppend">
      <a-row :gutter="10">
        <a-col :span="12">
          <a-select
            placeholder="全部分类"
            :options="articleCate"
            style="width: 160px"
            @change="handleArticleCateChange"
          >
          </a-select>
          <a-input-search
            placeholder="请输入文章标题"
            enter-button="搜索"
            style="width:200px;margin-left: 10px;"
            @search="onArticleSearch"
          />
          <s-table
            class="article-table"
            size="small"
            ref="articleTable"
            :rowKey="record => record.id"
            :scroll="{ y: 380 }"
            :columns="articleColumns"
            :data="loadArticleData"
            :rowSelection="currentRowSelection"
          >
          </s-table>
        </a-col>
        <a-col :span="12" class="article-list">
          <h5>已选择的相关文章</h5>
          <ul class="selected-articles">
            <template v-for="(item, index) in currentSelected">
              <li :key="index">
                <span>{{ item.title }}</span>
                <a-icon class="del-icon" type="close" @click="handleDelCurrent(item.id)"></a-icon>
              </li>
            </template>
          </ul>
        </a-col>
      </a-row>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAppendTo" :disabled="!currentSelectedRowKeys.length">确 定</a-button>
        <a-button @click="closeAppend">取 消</a-button>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import STable from '@/components/Table'
// eslint-disable-next-line no-unused-vars
import { getKeyword, addKeywords, appendKeywordTo, delKeyword, updateKeyword } from '@/api/keyword'
import EditableCell from '@/components/EditableCell'
import { getProducts } from '@/api/products'
import { getArticles } from '@/api/article'
import { getProductCate, getArticleCate } from '@/api/category'

const articleColumns = [
  {
    title: '',
    dataIndex: 'title',
    scopedSlots: { customRender: 'title' }
  }
]
const productColumns = [
  {
    title: '',
    dataIndex: 'shopTitle',
    scopedSlots: { customRender: 'title' }
  }
]
const columns = [
  {
    title: '#',
    dataIndex: 'id'
  },
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
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    this.columns = columns
    return {
      categoryOptions: [
        {
          label: '全部',
          value: 'all',
          id: 'all'
        }
      ], // 产品分类
      category: [],

      showAddKeyword: false,
      keywords: '',
      productMenu: '',
      articleMenu: '',
      cateMenu: '',
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      loadData: param => {
        param = Object.assign(param, this.queryParam)
        return getKeyword(param)
      },

      queryArticleCate: {},
      queryProductCate: {},
      selectedArticles: [], // 已关联文章列表
      selectedProducts: [], // 已关联产品列表
      selectedCate: [], // 已选择产品分类
      cateVisible: false,
      selectedCateRowKeys: [],
      selectedCateRows: [],
      productVisible: false,
      selectedProductRowKeys: [],
      selectedProductRows: [],
      loadProductData: param => {
        param = Object.assign(param, this.queryParam)
        return getProducts(param)
      },
      articleVisible: false,
      selectedArticleRowKeys: [],
      selectedArticleRows: [],
      articleCate: [], // 文章分类
      loadArticleData: param => {
        param = Object.assign(param, this.queryParam)
        return getArticles(param)
      },
      currentOfAppend: {},
      currentSelected: [],
      currentSelectedRowKeys: []
    }
  },
  computed: {
    currentRowSelection() {
      return {
        selectedRowKeys: this.currentSelectedRowKeys,
        onChange: this.onCurrentSelectChange
      }
    }
  },
  created() {
    this.loadCategory()
  },
  methods: {
    // 加载分类数据
    loadCategory() {
      getProductCate(this.queryArticleCate).then(res => {
        res.data.datas.forEach(item => {
          this.categoryOptions.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
      getArticleCate(this.queryArticleCate).then(res => {
        const result = res.data.datas
        if (result.length > 0) {
          result.forEach(item => {
            this.articleCate.push({
              value: item.id,
              label: item.catName,
              id: item.id
            })
          })
        }
      })
    },
    onArticleSearch(value) {
      this.queryArticle.keyWords = value
      this.$refs.articleTable.refresh(true)
    },
    onArticleSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRows)
      this.selectedArticleRowKeys = selectedRowKeys
      this.selectedArticles = selectedRows
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.currentSelectedRowKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },
    onCurrentSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.currentSelectedRowKeys = selectedRowKeys
      this.currentSelected = selectedRows
    },
    onProductSearch(value) {
      this.queryProduct.keyWords = value
      this.$refs.productTable.refresh(true)
    },
    handleProductCateChange(value) {
      this.queryProduct.catId = value
      this.$refs.productTable.refresh(true)
    },
    handleArticleCateChange(value) {
      this.queryArticle.catId = value
      this.$refs.articleTable.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleDelCurrent(id) {
      this.currentSelectedRowKeys.forEach((item, index) => {
        if (id === item) {
          this.currentSelectedRowKeys.splice(index, 1)
          this.currentSelected.splice(index, 1)
        }
      })
    },
    onCategoryChange(value) {
      console.log(value)
      this.currentSelectedRowKeys = value
    },
    handleSubMenuClick(item) {
      const sort = new Map([
        ['product:1', ['productMenu', 'ShopCount', '', '']],
        ['product:2', ['productMenu', 'ShopCount', 0, 5]],
        ['product:3', ['productMenu', 'ShopCount', 5, 10]],
        ['product:4', ['productMenu', 'ShopCount', 11, 20]],
        ['product:5', ['productMenu', 'ShopCount', 20, '']],
        ['article:1', ['articleMenu', 'ArticleCount', '', '']],
        ['article:2', ['articleMenu', 'ArticleCount', 0, 5]],
        ['article:3', ['articleMenu', 'ArticleCount', 5, 10]],
        ['article:4', ['articleMenu', 'ArticleCount', 11, 20]],
        ['article:5', ['articleMenu', 'ArticleCount', 20, '']],
        ['cate:1', ['cateMenu', 'CatCount', '', '']],
        ['cate:2', ['cateMenu', 'CatCount', 0, 5]],
        ['cate:3', ['cateMenu', 'CatCount', 5, 10]],
        ['cate:4', ['cateMenu', 'CatCount', 11, 20]],
        ['cate:5', ['cateMenu', 'CatCount', 20, '']]
      ])
      const itemName = item.domEvent.target.innerText
      // console.log(item.key, itemName)
      const menuName = sort.get(item.key)
      this[menuName[0]] = itemName === '所有' ? '' : itemName
      const min = menuName[2]
      const max = menuName[3]
      const countName = menuName[1]
      if (min !== '') {
        this.queryParam[`min${countName}`] = min
      } else delete this.queryParam[`min${countName}`]
      if (max !== '') {
        this.queryParam[`max${countName}`] = max
      } else delete this.queryParam[`max${countName}`]

      console.log(this.queryParam)
      this.$refs.table.refresh(true)
      // if (item.key.indexOf('product') !== -1) {
      //   this.productMenu = itemName === '所有' ? '' : itemName
      // } else if (item.key.indexOf('article') !== -1) {
      //   this.articleMenu = itemName === '所有' ? '' : itemName
      // } else if (item.key.indexOf('cate') !== -1) {
      //   this.cateMenu = itemName === '所有' ? '' : itemName
      // }
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
        .finally(() => {
          this.showAddKeyword = false
          this.$refs.table.refresh(true)
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
      this.queryParam.KeywordName = value
      this.$refs.table.refresh(true)
    },
    edit(val, id) {
      console.log(val, id)
      if (this.text === val) return
      const params = {
        id,
        keyword: val
      }
      updateKeyword(params)
        .then(res => {
          if (res.code === 200) {
            this.success()
            this.$refs.table.refresh()
          } else {
            throw res
          }
        })
        .catch(err => {
          this.fail(err)
        })
    },
    del(id) {
      delKeyword({ id })
        .then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.success()
            this.$refs.table.refresh()
          } else {
            throw res
          }
        })
        .catch(err => {
          this.fail(err)
        })
    },
    appendToNew(type, keyword, id) {
      if (type === 'product') {
        this.$router.push({ path: '/products/add-product', query: { keyword: keyword } })
      } else if (type === 'article') {
        this.$router.push({ path: '/articles/add-article', query: { keyword: keyword } })
      } else {
        this.$router.push({ path: '/products/add-category', query: { keyword: keyword } })
      }
    },
    closeAppend() {
      console.log('close')
      this.productVisible = false
      this.articleVisible = false
      this.cateVisible = false

      this.currentOfAppend = {}
      this.currentSelectedRowKeys = []
      this.currentSelected = []
    },
    handleAppendTo(type) {
      const types = {
        product: 1,
        article: 2,
        cate: 3
      }
      const params = {
        id: this.currentOfAppend.id,
        type: types[this.currentOfAppend.type]
      }
      const IDs = this.currentSelectedRowKeys
      console.log(params, IDs)
      appendKeywordTo(params, IDs)
        .then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.success()
          } else {
            throw res
          }
        })
        .catch(err => {
          this.fail(err)
        })
        .finally(() => {
          this.closeAppend()
          this.$refs.table.refresh()
        })
    },
    appendTo(type, id) {
      this.currentOfAppend = {
        type,
        id
      }
      const visible = {
        product: 'productVisible',
        article: 'articleVisible',
        cate: 'cateVisible'
      }
      this[visible[type]] = true
      this.currentSelectedRowKeys = []
      this.currentSelected = []
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/es/style/themes/default.less';

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
.article-table {
  margin-top: 10px;
  background: white;
}
.article-list {
  h5 {
    padding: 10px;
  }
}
.selected-articles {
  background: white;
  min-height: 475px;
  max-height: 475px;
  overflow-y: auto;
  border: 1px solid @border-color-base;
  padding: 20px 20px 20px 40px;
  list-style-type: decimal;
  li {
    position: relative;
    line-height: 32px;
    list-style-position: outside;
    .del-icon {
      position: absolute;
      right: 0;
      top: 10px;
      font-weight: bold;
      color: @red-8;
    }
  }
}
</style>
