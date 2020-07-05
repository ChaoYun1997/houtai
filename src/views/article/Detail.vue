<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="标题" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="文章URL" class="url">
          <a-radio-group v-model="form.urlValue">
            <a-radio value="a" class="url-radio">
              系统URL
            </a-radio>
            <a-radio value="b" class="url-radio">
              自定义URL
            </a-radio>
          </a-radio-group>
          <a-input
            class="url-input"
            v-show="form.urlValue === 'b'"
            v-model="customUrl"
            placeholder="请输入自定义URL"
          ></a-input>
          <p class="info" v-show="form.urlValue === 'b'">
            - URL必须以/开头，例如：/about-us.html <br />
            - 请勿使用以p+数字结尾结构的URL，跟系统分页规则冲突，例如：/prod-p2.html <br />
            - 频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </p>
        </a-form-model-item>
        <a-form-model-item ref="category" label="所属文章分类" prop="category">
          <span class="cate-item" v-if="form.category.length === 0">未分组</span>
          <template v-else>
            <template v-for="item in form.category">
              <span class="cate-item" :key="item">{{ categoryLabel(item) }}</span>
            </template>
          </template>
          <a-button @click="showCategoryModal = true">选择</a-button>
        </a-form-model-item>
        <a-form-model-item label="文章关键词" prop="keyword" class="keyword-box">
          <a-row>
            <a-col :span="12">
              <div ref="list" class="list">
                <div class="list-group-item keyword-input" v-for="(item, index) in form.keyword.words" :key="index">
                  <a-input v-model="item.keyword" placeholder="请输入关键词" />
                  <a-icon
                    v-show="form.keyword.words.length > 1"
                    class="keyword-action sort"
                    slot="addonAfter"
                    type="menu"
                    @click="handleSort"
                  />
                  <a-icon
                    v-show="form.keyword.words.length > 1"
                    slot="addonAfter"
                    type="close"
                    @click="handleDelKeyword(index)"
                  />
                </div>
              </div>
              <a-button icon="plus" @click="handleAddKeyword">新增关键词</a-button>
            </a-col>
            <a-col :span="8">
              <a-card class="keyword-list" size="small">
                <span slot="title">关键词列表</span>
                <a-list
                  class="list-box"
                  item-layout="horizontal"
                  :data-source="keywordList"
                  :loading="keywordListLoading"
                >
                  <a-list-item
                    class="list-content"
                    slot="renderItem"
                    key="item.id"
                    slot-scope="item"
                    @click="handleKeywordList(item.keyWord)"
                  >
                    <a-list-item-meta>
                      <span slot="title">{{ item.keyWord }}</span>
                    </a-list-item-meta>
                    <span slot="extra">{{ `(${item.associatedArticleCount})` }}</span>
                  </a-list-item>
                </a-list>
                <span slot="actions">
                  <a-button type="link">管理关键词</a-button>
                </span>
              </a-card>
            </a-col>
          </a-row>
          <p class="info">
            -请填写3个以上的关键词，每个关键词的长度≤5个单词，长度不得超过100字符，单词之间不需要增加任何符号，直接空格表示。
          </p>
          <a-button :icon="showSeo ? 'caret-down' : 'caret-up'" type="link" :ghost="true" @click="showSeo = !showSeo">
            搜索引擎优化设置
          </a-button>
          <transition name="slideToggle">
            <div class="seo" v-show="showSeo">
              <a-row>
                <a-col :span="4" :push="1">
                  <span class="label">页面标题</span>
                </a-col>
                <a-col :span="19"><a-input v-model="form.keyword.pageTitle" placeholder="请输入页面标题"/></a-col>
                <a-col :span="4" :push="1">
                  <span class="label">页面关键词</span>
                </a-col>
                <a-col :span="19"><a-input v-model="form.keyword.pageKeyword" placeholder="请输入页面关键词"/></a-col>
                <a-col :span="4" :push="1">
                  <span class="label">页面描述</span>
                </a-col>
                <a-col :span="19"><a-input v-model="form.keyword.pageDesc" placeholder="请输入页面描述"/></a-col>
              </a-row>
            </div>
          </transition>
        </a-form-model-item>
        <a-form-model-item label="文章状态">
          <a-radio-group :default-value="0">
            <a-radio :value="0">正常</a-radio>
            <a-radio :value="1">草稿</a-radio>
            <a-radio :value="2">定时发布</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="是否置顶">
          <a-checkbox v-model="form.isTop"></a-checkbox>
        </a-form-model-item>
        <a-form-model-item label="发布时间">
          <a-date-picker @change="handleDate" :default-value="moment(new Date(),'YYYY-MM-DD HH:mm:ss')" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 220px" />
        </a-form-model-item>
        <a-form-model-item label="文章浏览次数" prop="name">
          基数 <a-input v-model="form.readingBase" style="width: 100px;" /> + 实际浏览次数
          <a-input v-model="form.realReading" :disabled="true" style="width: 100px;" /> = 前台显示浏览次数
          <a-input v-model="reading" :disabled="true" style="width: 100px;" />
        </a-form-model-item>
        <a-form-model-item ref="cover" label="文章附图" prop="cover">
          <a-upload :file-list="coverImg" :before-upload="beforeCoverChange" v-show="!previewCover">
            <div class="cover-button"><a-icon type="upload"></a-icon></div>
          </a-upload>
          <div class="cover-preview" v-show="previewCover">
            <img :src="previewCover" alt="" />
            <a-icon type="delete" class="del-btn" @click="handleCoverRemove"></a-icon>
          </div>
        </a-form-model-item>
        <a-form-model-item label="文章内容">
          <kind-editor ref="kindeditor" @input="getContent"></kind-editor>
        </a-form-model-item>
        <a-form-model-item ref="intro" label="文章摘要" prop="intro">
          <a-textarea v-model="form.intro" placeholder="请输入文章简介" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-form-model-item>
        <h3>高级</h3>
        <a-form-model-item label="作者" prop="author">
          <a-input v-model="form.author" />
        </a-form-model-item>
        <a-form-model-item label="来源" prop="name">
          <a-input v-model="form.author" />
        </a-form-model-item>
        <a-form-model-item label="网址" prop="name">
          <a-input v-model="form.author" />
        </a-form-model-item>
        <h3>相关产品</h3>
        <a-alert message="选出5~20篇与该产品相关联的产品展示在前台产品详情。" banner closable />
        <a-card class="panel-box">
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
                style="width:220px;margin-left: 10px;"
                @search="onProductSearch"
              />
              <s-table
                ref="table"
                size="default"
                :rowKey="record => record.id"
                :scroll="{ y: 380 }"
                :columns="productColumns"
                :data="loadProductData"
                :rowSelection="rowSelection"
              >
              </s-table>
            </a-col>
            <a-col :span="12" class="article-list">
              <h5>已选择的相关产品</h5>
              <ul class="selected-articles">
                <template v-for="(item, index) in selectedProducts">
                  <li :key="index">
                    <span>{{ item.shopTitle }}</span>
                    <a-icon class="del-icon" type="close" @click="handleDelProduct(item.id)"></a-icon>
                  </li>
                </template>
              </ul>
            </a-col>
          </a-row>
        </a-card>
        <br />
        <a-form-model-item>
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-modal v-model="showCategoryModal" title="请选择文章分类">
      <a-checkbox-group :default-value="form.category" @change="onCategoryChange">
        <a-row>
          <template v-for="item in articleCate">
            <a-col :key="item.label">
              <a-checkbox :value="item.id">{{ item.label }}</a-checkbox>
            </a-col>
          </template>
        </a-row>
      </a-checkbox-group>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleSelectCate" :disabled="selectedCate.length === 0">确 定</a-button>
        <a-button @click="showCategoryModal = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="showAddSku" title="添加SKU" centered>
      <a-input placeholder="请输入SKU名称" v-model="newSku"></a-input>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAddSku" :disabled="newSku === ''">确 定</a-button>
        <a-button @click="showAddSku = false">取 消</a-button>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { getProducts, getProductCategory } from '@/api/products'
import { getKeyword } from '@/api/keyword'
import { articleCategory } from '@/api/article'
import sortableJS from 'sortablejs'
import KindEditor from '@/components/Kindeditor'
import { STable } from '@/components'
import moment from 'moment'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

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
export default {
  name: 'Detail',
  components: {
    STable,
    KindEditor,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    return {
      productData: [], // 产品数据
      loadProductData: parameter => {
        parameter = Object.assign(parameter, this.queryParam)
        return getProducts(parameter)
      },
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      pagination: {
        size: 'small'
      },
      articleCate: [], // 文章分类
      selectedArticles: [], // 已关联文章列表
      selectedProducts: [], // 已关联产品列表
      selectedArticleRowKeys: [], // 已选择文章
      selectedProductRowKeys: [], // 已选择产品

      content: '',

      coverImg: [],
      previewCover: '',
      imgList: [],
      previewImage: [],

      enabled: true, // 关键词拖动排序开关
      dragging: false, // 关键词拖动

      keywordList: [], // 关键词列表
      keywordListLoading: true, // 关键词列表加载动画

      showSeo: true,
      showCategoryModal: false, // 显示选择分类
      categoryLoading: true,
      selectedCate: [],
      categoryOptions: [], // 产品分类
      articleCategoryOptions: [], // 文章分类分类

      showAddSku: false,
      newSku: '',
      skuColumns: [],
      skuDatas: [],

      productId: this.$route.params.id,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      customUrl: '',
      skuList: [],
      editorOptions: {
        width: '700px',
        height: '400px'
      },
      // 产品表单
      form: {
        name: '',
        productUrl: '',
        urlValue: 'a',
        keyword: {
          words: [{ keyword: '' }],
          pageTitle: '',
          pageKeyword: '',
          pageDesc: ''
        },
        isTop: false,
        realReading: 0,
        readingBase: 0,
        category: [],
        pics: [],
        videoUrl: '',
        intro: '',
        attribute: {
          model: '',
          brand: '',
          code: ''
        },
        customFields: [{ field: '' }],
        sku: {
          stock: 10,
          pic: '',
          attr: [
            {
              name: 'color',
              vals: [{ value: 'yellow' }, { value: 'white' }]
            }
          ]
        },
        // sku: [
        //   {
        //     name: 'color',
        //     vals: [
        //       { value: 'yellow', stock: 10, pic: '' },
        //       { value: 'white', stock: 10, pic: '' }
        //     ],
        //     pic: ''
        //   }
        // ],
        desc: [{ 'Product Description': '' }],
        status: {
          val: 1, // 默认1 上架状态
          tmallLink: '',
          jdLink: '',
          amazonLink: '',
          smtLink: '',
          dhwLink: '',
          wechatLink: ''
        },
        articles: [],
        linkProducts: []
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        keyword: [{ required: true, message: '请输入产品关键词', trigger: 'blur' }]
      }
    }
  },
  computed: {
    reading() {
      return Number(this.form.realReading) + Number(this.form.readingBase)
    },
    rowSelection () {
      return {
        selectedRowKeys: this.selectedProductRowKeys,
        onChange: this.onProductSelectChange
      }
    }
  },
  created() {
    this.loadKeyword()
    this.loadArticles()
    this.loadProducts()
  },
  mounted() {
    this.loadCategory()
    this.initSkuData()

    const that = this
    // eslint-disable-next-line no-unused-vars
    const sortable = sortableJS.create(this.$refs.list, {
      sort: true,
      animation: 300,
      onEnd: function(evt) {
        // 拖拽结束发生该事件
        that.form.keyword.words.splice(evt.newIndex, 0, that.form.keyword.words.splice(evt.oldIndex, 1)[0])
        var newArray = that.form.keyword.words.slice(0)
        that.form.keyword.words = []
        that.$nextTick(function() {
          that.form.keyword.words = newArray
          console.log(that.form.keyword.words)
        })
      }
    })
  },
  watch: {
    async coverImg(val) {
      if (val.length > 0) {
        this.previewCover = await getBase64(val[0])
      }
    },
    async imgList(val) {
      if (val.length > 0) {
        this.previewImage = await getBase64(val[0])
      }
    }
  },
  methods: {
    moment,
    handleDelProduct(id) {
      this.selectedProductRowKeys.forEach((item, index) => {
        if (id === item) {
          this.selectedProductRowKeys.splice(index, 1)
          this.selectedProducts.splice(index, 1)
        }
      })
      // TODO 提交产品关联统一放到提交Submit操作
    },
    // 文章相关
    handleDelArticle(id) {
      console.log(id, this.selectedArticleRowKeys)
      this.selectedArticleRowKeys.forEach((item, index) => {
        if (id === item) {
          this.selectedArticleRowKeys.splice(index, 1)
          this.selectedArticles.splice(index, 1)
        }
      })
      // TODO 提交文章关联统一放到提交Submit操作
    },
    onArticleSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRows)
      this.selectedArticleRowKeys = selectedRowKeys
      this.selectedArticles = selectedRows
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRows)
      this.selectedProductRowKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },
    loadArticles() {
      articleCategory().then(res => {
        const result = res.data.datas
        if (result.length > 0) {
          result.forEach(item => {
            this.articleCate.push({
              value: item.name,
              label: item.name
            })
          })
        }
      })
    },
    loadProducts() {
      getProducts(this.queryParam).then(res => {
        this.productData = res.data.datas
      })
    },
    handleArticleCateChange(value) {
      console.log(`selected ${value}`)
      // TODO 刷新数据
    },
    handleProductCateChange(value) {
      console.log(`selected ${value}`)
      // TODO 刷新数据
    },
    onArticleSearch(value) {
      console.log(value)
      // TODO 刷新数据
    },
    onProductSearch(value) {
      console.log(value)
      this.queryParam.keyWords = value
      // TODO 刷新数据
    },
    handleDate() {},
    // 获取编辑器内容
    getContent(content) {
      console.log('content', content)
      this.content = content
    },
    afterChange() {},
    initSkuData() {
      if (this.form.sku.attr.length > 0) {
        this.form.sku.attr.forEach(item => {
          const key = `${item.name}Stock`
          this.skuColumns.push({
            title: item.name,
            dataIndex: key
          })
          item.vals.forEach((item, index) => {
            this.skuDatas[index] = {}
            this.skuDatas[index][key] = item.value
            this.skuDatas[index].stock = item.stock
            this.skuDatas[index].pic = item.pic
          })
        })
      }
    },
    // loadSku() {
    //   getSku().then(res => {
    //     this.skuList = res.result.data
    //   })
    // },
    categoryLabel(id) {
      const cate = this.categoryOptions.find(item => {
        return item.id === id
      })
      return cate.label
    },
    // 加载关键词数据
    loadKeyword() {
      getKeyword().then(res => {
        this.keywordListLoading = false
        this.keywordList = res.data.datas
      })
    },
    // 加载分类数据
    loadCategory() {
      getProductCategory().then(res => {
        res.data.datas.forEach(item => {
          console.log(item)
          this.categoryOptions.push({
            label: item.name,
            value: item.name,
            id: item.id
          })
        })
      })
    },
    add() {},
    replace() {},
    checkMove(e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    handleDelKeyword(index) {
      this.form.keyword.words.splice(index, 1)
    },
    handleSort() {
      console.log('del')
    },
    handleAddKeyword() {
      console.log(this.form.keyword.words.length)
      this.form.keyword.words.push({ keyword: '' })
    },
    handleKeywordList(keyword) {
      const length = this.form.keyword.words.length
      if (this.form.keyword.words[length - 1].keyword !== '') {
        this.form.keyword.words.push({ keyword: keyword })
        return
      }
      this.form.keyword.words[length - 1].keyword = keyword
    },
    // 产品主图
    beforeCoverChange(file, fileList) {
      this.coverImg = fileList
      return false
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleCoverRemove() {
      this.coverImg = []
      this.previewCover = ''
    },
    handleImgRemove(index) {
      this.imgList.splice(index, 1)
      this.previewImage.splice(index, 1)
    },
    // sku 选择
    handleSkuChange(value, index) {
      const isKeyExisted = this.form.sku.attr.filter(item => {
        return item.name === value
      })
      console.log(isKeyExisted, index)
      if (isKeyExisted.length > 0) {
        this.$warning({
          content: '不能选择相同的规格'
        })
        this.form.sku.attr[index].name = ''
        return false
      }
      this.form.sku.attr[index].name = value
    },
    handleSkuFileChange(index) {
      console.log(`selected ${index}`)
    },
    handleAddSku() {
      console.log('add sku')
    },
    handleDelSku(index) {
      console.log('del sku')
      this.$confirm({
        content: '确定要删除该SKU吗',
        centered: true,
        onOk: () => {
          this.form.sku.attr.splice(index, 1)
        }
      })
    },
    handleDelSkuVal(sku, index) {
      console.log(`del val ${index}`)
      sku.vals.splice(index, 1)
    },
    handleAddSkuBox() {
      this.form.sku.attr.push({
        name: '',
        vals: []
      })
    },
    handleAddSkuValue(item) {
      console.log(item)
      item.push({
        value: '',
        stock: null,
        pic: ''
      })
    },
    isKeyExisted(key, obj) {
      return true
    },
    handleSkuInputBlur(item, val, index) {
      const isExist = item.vals.filter(i => {
        return i.value === val
      })
      console.log(isExist)
      if (isExist.length > 1) {
        this.$warning({
          content: '请不要输入已存在的值'
        })
        item.vals[index].value = ''
      }
    },
    getHtml(html) {
      console.log(html)
    },
    // 提交产品表单
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          // 图片 formdata格式
          const { imgList } = this
          const formData = new FormData()
          imgList.forEach(file => {
            formData.append('imgs[]', file)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onChange(e) {
      console.log(e)
    },
    onCategoryChange(value) {
      this.selectedCate = value
      // TODO 更新产品分类数据
    },
    // 选择分类
    handleSelectCate() {
      this.form.category = this.selectedCate
      this.showCategoryModal = false
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';

h3 {
  margin-top: 40px;
  font-weight: bold;
  &:before {
    display: inline;
    content: '';
    border-left: 5px solid @primary-color;
    padding-left: 10px;
    height: 24px;
  }
}
.info {
  line-height: 24px;
  color: #aaa;
  font-size: @font-size-sm;
}
.negativeTop {
  margin-top: -10px;
}
.keyword-input {
  input {
    max-width: 240px;
    margin-right: 10px;
  }
}
.keyword-action {
  padding-right: 5px;
  margin-right: 5px;
  border-right: 1px solid @border-color-base;
}
.url {
  display: block;
  .url-input {
    display: inline-block;
    width: 180px;
  }
  .url-radio {
    border: 1px solid @border-color-base;
    line-height: 22px;
    padding: 4px 10px;
    border-radius: @border-radius-base;
    &:nth-child(2).ant-radio-wrapper-checked {
      margin-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
}
div.ant-card-body {
  padding: 10px !important;
}

.list-box {
  max-height: 300px;
  min-height: 150px;
  overflow-y: auto;
}
.list-content {
  padding: 5px 0;
}
.seo {
  .panel-box;
  .label {
    font-size: @font-size-sm;
  }
}
.panel-box {
  background: #f3f5f7;
  padding: 10px;
}
.slideToggle-enter-active,
.slideToggle-leave-active {
  transition: opacity 0.5s;
}
.slideToggle-enter, .slideToggle-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.cate-content {
  padding-top: 10px;
}
.cate-item {
  display: block;
  line-height: 24px;
  &:first-child {
    margin-top: 10px;
  }
}

.cover-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.cover-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px dashed @border-color-base;
  border-radius: @border-radius-base;
}
.cover-preview {
  display: block;
  width: 100px;
  height: 100px;
  position: relative;
  border: 1px solid @border-color-base;
  border-radius: @border-radius-base;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .del-btn {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    margin-left: -12px;
    margin-top: -12px;
  }
  &:hover {
    img {
      opacity: 0.3;
    }
    .del-btn {
      display: block;
    }
  }
}
.img-list {
  min-height: 200px;
  width: 100%;
  overflow: hidden;
  .img-item {
    display: block;
    float: left;
    margin-right: 10px;
  }
}
.sku-box {
  position: relative;
  border-bottom: 1px solid @border-color-base;
  padding-bottom: 10px;
  .ant-row:nth-child(2n) {
    background: white;
  }
  .del-sku {
    position: absolute;
    right: -16px;
    top: -16px;
    z-index: 10;
    display: none;
  }
  &:hover {
    .del-sku {
      display: block;
    }
  }
}
.sku-box-footer {
  display: block;
  padding-top: 5px;
}
.sku-img {
  margin-left: 10px;
}
.input-box {
  position: relative;
  display: inline-block;
  &:hover {
    .del-sku-val {
      display: block;
    }
  }
  .del-sku-val {
    position: absolute;
    right: -2px;
    top: -8px;
    width: 24px;
    height: 24px;
    line-height: 26px;
    background: #999999;
    border-radius: 50%;
    color: white;
    display: none;
    z-index: 10;
  }
}
.inline-input {
  width: 120px;
  margin-right: 10px;
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
