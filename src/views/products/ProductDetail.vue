<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="产品名称" prop="name">
          <a-input v-model="form.name" @change="handleNameChange" />
          <a-checkbox class="upper-checkbox" :checked="isUpperCase" @change="handleUpperCase">词首字母大写</a-checkbox>
          <p class="info negativeTop">-频繁修改产品名称直接影响SEO效果，请仔细斟酌后再提交。</p>
        </a-form-model-item>
        <a-form-model-item label="产品URL" class="url">
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
            v-model="form.productUrl"
            placeholder="请输入自定义URL"
          ></a-input>
          <p class="info" v-show="form.urlValue === 'b'">
            - URL必须以/开头，例如：/about-us.html <br />
            - 请勿使用以p+数字结尾结构的URL，跟系统分页规则冲突，例如：/prod-p2.html <br />
            - 频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </p>
        </a-form-model-item>
        <a-form-model-item label="产品关键词" prop="keyword" class="keyword-box">
          <a-row>
            <a-col :span="12">
              <div ref="list" class="list">
                <div class="list-group-item keyword-input" v-for="(item, index) in form.keyword.words" :key="index">
                  <a-input v-model="item.keyword" @change="handleNameChange" placeholder="请输入关键词" />
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
              <a-button icon="plus" v-show="form.keyword.words.length < 8" @click="handleAddKeyword">
                新增关键词
              </a-button>
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
                    <span slot="extra">{{ `(${item.associatedItemCount})` }}</span>
                  </a-list-item>
                </a-list>
                <span slot="actions">
                  <a-button type="link" @click="$router.push('/keyword/keyword-list')" size="small">
                    管理关键词
                  </a-button>
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
        <a-form-model-item ref="category" label="所属产品分类" prop="category">
          <span class="cate-item" v-if="form.category.length === 0">未分组</span>
          <template v-else>
            <template v-for="item in form.category">
              <span class="cate-item" :key="item">{{ categoryLabel(item) }}</span>
            </template>
          </template>
          <a-button @click="showCategoryModal = true">选择</a-button>
        </a-form-model-item>
        <a-form-model-item ref="img" label="产品图片" prop="cover" class="img-list">
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <ul ref="piclist" class="pic-list">
            <li v-for="(item, index) in picList" :key="index">
              <div class="operate">
                <a-icon type="eye" @click="handlePicPreview(item.path)"></a-icon>
                <a-icon type="delete" @click="handleDelPic(index)"></a-icon>
              </div>
              <img :src="item.path" alt="" />
            </li>
            <a-upload
              list-type="picture-card"
              class="img-uploader"
              :action="uploadUrl"
              :file-list="imgList"
              accept="image/*"
              :show-upload-list="false"
              :data="getUploadData"
              :before-upload="getUploadToken"
              @change="handleListUploadChange"
            >
              <div v-if="imgList.length < 8">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
          </ul>
        </a-form-model-item>
        <a-form-model-item ref="video" label="产品视频" prop="videoUrl">
          <a-input v-model="form.videoUrl" placeholder="请输入产品视频连接"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="intro" label="产品简介" prop="intro">
          <a-textarea v-model="form.intro" placeholder="请输入产品简介" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-form-model-item>
        <a-form-model-item ref="video" label="产品属性">
          <a-row class="panel-box">
            <a-col :span="4" :push="1">
              <span class="label">型号</span>
            </a-col>
            <a-col :span="19"><a-input v-model="form.attribute.model" placeholder="请输入产品型号"/></a-col>
            <a-col :span="4" :push="1">
              <span class="label">品牌</span>
            </a-col>
            <a-col :span="19"><a-input v-model="form.attribute.brand" placeholder="请输入产品品牌"/></a-col>
            <a-col :span="4" :push="1">
              <span class="label">编码</span>
            </a-col>
            <a-col :span="19"><a-input v-model="form.attribute.code" placeholder="请输入产品编码"/></a-col>
          </a-row>
        </a-form-model-item>
        <h3>产品描述</h3>
        <a-form-model-item label="产品描述">
          <kind-editor
            @uploadImg="handleEditorUploadPic"
            :content="form.desc"
            id="k-editor"
            ref="kindeditor"
          ></kind-editor>
        </a-form-model-item>
        <h3>产品状态</h3>
        <a-form-model-item label="产品状态">
          <a-radio-group v-model="form.shelved">
            <a-radio :value="1">上架</a-radio>
            <a-radio :value="0">下架(访客不可见)</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <h3>相关文章</h3>
        <a-alert message="选出5~20篇与该产品相关联的文章展示在前台产品详情。" banner closable />
        <a-card class="panel-box">
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
                style="width:220px;margin-left: 10px;"
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
                :rowSelection="articleRowSelection"
              >
              </s-table>
            </a-col>
            <a-col :span="12" class="article-list">
              <h5>已选择的相关文章</h5>
              <ul class="selected-articles">
                <template v-for="(item, index) in selectedArticles">
                  <li :key="index">
                    <span>{{ item.title }}</span>
                    <a-icon class="del-icon" type="close" @click="handleDelArticle(item.id)"></a-icon>
                  </li>
                </template>
              </ul>
            </a-col>
          </a-row>
        </a-card>

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
              <!--              <a-table-->
              <!--                class="article-table"-->
              <!--                size="small"-->
              <!--                row-key="id"-->
              <!--                :scroll="{ y: 380 }"-->
              <!--                :row-selection="{ selectedRowKeys: selectedProductRowKeys, onChange: onProductSelectChange }"-->
              <!--                :columns="productColumns"-->
              <!--                :data-source="productData"-->
              <!--              >-->
              <!--              </a-table>-->
              <s-table
                class="article-table"
                size="small"
                ref="productTable"
                :rowKey="record => record.id"
                :scroll="{ y: 380 }"
                :columns="productColumns"
                :data="loadProductData"
                :rowSelection="productRowSelection"
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
    <a-modal v-model="showCategoryModal" title="请选择产品分类">
      <a-checkbox-group :default-value="form.category" @change="onCategoryChange">
        <a-row>
          <template v-for="item in categoryOptions">
            <a-col :key="item.label">
              <a-checkbox :value="item.id" :disabled="item.id === 'all'">{{ item.label }}</a-checkbox>
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
// eslint-disable-next-line no-unused-vars
import { getProducts, getUploadSign, addProduct, getProductDetail, updateProduct } from '@/api/products'
import { getProductCate, getArticleCate } from '@/api/category'
import { getKeyword } from '@/api/keyword'
import { getArticles } from '@/api/article'
import sortableJS from 'sortablejs'
import KindEditor from '@/components/Kindeditor'
import STable from '@/components/Table'
import moment from 'moment'

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
    KindEditor
    // VNodes: {
    //   functional: true,
    //   render: (h, ctx) => ctx.props.vnodes
    // }
  },
  data() {
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    return {
      queryArticle: {},
      queryArticleCate: {},
      loadArticleData: parameter => {
        parameter = Object.assign(parameter, this.queryArticle)
        return getArticles(parameter)
      },
      queryProduct: {},
      queryProductCate: {},
      loadProductData: parameter => {
        parameter = Object.assign(parameter, this.queryProduct)
        return getProducts(parameter)
      },
      articleData: [], // 文章数据
      productData: [], // 产品数据
      pagination: {
        size: 'small'
      },
      articleCate: [], // 文章分类
      selectedArticles: [], // 已关联文章列表
      selectedProducts: [], // 已关联产品列表
      selectedArticleRowKeys: [], // 已选择文章
      selectedProductRowKeys: [], // 已选择产品

      content: '',

      uploadUrl: 'http://up-z0.qiniup.com',
      picToken: '',
      fileName: '',
      coverImg: [],
      imageUrl: '',
      showImage: false,
      coverLoading: false,
      previewCover: '',
      imgList: [],
      picList: [],
      coverList: [],
      coverVisible: false,
      previewImage: [],
      previewVisible: false,

      enabled: true, // 关键词拖动排序开关
      dragging: false, // 关键词拖动

      keywordList: [], // 关键词列表
      keywordListLoading: true, // 关键词列表加载动画

      showSeo: true,
      showCategoryModal: false, // 显示选择分类
      categoryLoading: true,
      selectedCate: [],
      categoryOptions: [
        {
          label: '全部',
          value: 'all',
          id: 'all'
        }
      ], // 产品分类

      showAddSku: false,
      newSku: '',
      skuColumns: [],
      skuDatas: [],

      productId: this.$route.params.id,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      isUpperCase: false,
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
        category: [],
        shopImg: '', // 产品主图
        shopImgList: [], // 产品图片列表
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
        desc: '',
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
        linkProducts: [],
        shelved: 1,
        tags: []
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        keyword: [{ required: true, message: '请输入产品关键词', trigger: 'blur' }]
      }
    }
  },
  computed: {
    productRowSelection() {
      return {
        selectedRowKeys: this.selectedProductRowKeys,
        onChange: this.onProductSelectChange
      }
    },
    articleRowSelection() {
      return {
        selectedRowKeys: this.selectedArticleRowKeys,
        onChange: this.onArticleSelectChange
      }
    }
  },
  created() {
    const { id } = this.$route.params
    const { copy } = this.$route.query
    if (id || copy) {
      this.loadProductDetail(id || copy)
    }

    this.loadKeyword()
    // this.loadSku()
    // this.loadArticles()
    // this.loadProducts()
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

    // eslint-disable-next-line no-unused-vars
    const sortablePic = sortableJS.create(this.$refs.piclist, {
      sort: true,
      animation: 300,
      onEnd: function(evt) {
        // 拖拽结束发生该事件
        that.picList.splice(evt.newIndex, 0, that.picList.splice(evt.oldIndex, 1)[0])
        const newArray = that.picList.slice(0)
        that.picList = []
        that.$nextTick(function() {
          that.picList = newArray
          console.log(that.picList)
        })
      }
    })
  },
  methods: {
    loadProductDetail(id) {
      getProductDetail({ id }).then(res => {
        const { form } = this
        const { data } = res
        form.name = data.shopTitle // 产品标题
        console.log(data.shopTitle)
        form.productUrl = data.shopUrl ? data.shopUrl : '' // 产品url
        form.keyword.words = data.shopKeyWords.map(item => {
          // 关键词
          return { keyword: item }
        })
        form.keyword.pageTitle = data.seoTitle // seo标题
        form.keyword.pageKeyword = data.seoKeyWord // seo关键词
        form.keyword.pageDesc = data.seoDescription // seo描述
        const host = process.env.VUE_APP_HOST
        this.picList = data.shopImgList.map(item => {
          // 产品图片
          const name = item.split('/')
          return {
            path: host + '/' + item,
            name: name[name.length - 1]
          }
        })
        // form.shopImg = data.shopImg
        form.videoUrl = data.shopVideoUrl
        form.intro = data.shopDesc
        form.attribute.brand = data.shopBrand
        form.attribute.code = data.shopNumber
        form.attribute.model = data.shopModel
        form.desc = data.shopDescribe
        this.selectedArticleRowKeys = data.relatedAids
        this.selectedProductRowKeys = data.relatedShopIds
        // 改为数组 TODO
        // form.category = data.catId
        form.shelved = data.isShelve ? 1 : 0
        form.tags = data.shopTags
      })
    },
    setDesc(desc) {
      console.log(this.$refs.kindeditor)
      // if (desc) {
      //   this.$refs.kindeditor.html(desc)
      // }
    },
    handleDelProduct(id) {
      this.selectedProductRowKeys.forEach((item, index) => {
        if (id === item) {
          this.selectedProductRowKeys.splice(index, 1)
          this.selectedProducts.splice(index, 1)
        }
      })
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
    },
    onArticleSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRows)
      this.selectedArticleRowKeys = selectedRowKeys
      this.selectedArticles = selectedRows
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedProductRowKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },
    loadArticleCate() {
      getArticleCate(this.queryArticleCate).then(res => {
        const result = res.data.datas
        console.log(`article cate: ${result}`)
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
    loadProducts() {
      getProducts().then(res => {
        this.productData = res.result.data
      })
    },
    handleArticleCateChange(value) {
      this.queryArticle.catId = value
      this.$refs.articleTable.refresh(true)
    },
    handleProductCateChange(value) {
      this.queryProduct.catId = value
      this.$refs.productTable.refresh(true)
    },
    onArticleSearch(value) {
      this.queryArticle.keyWords = value
      this.$refs.articleTable.refresh(true)
    },
    onProductSearch(value) {
      this.queryProduct.keyWords = value
      this.$refs.productTable.refresh(true)
    },
    // 获取编辑器内容
    getContent(content) {
      console.log('content', content)
      this.form.desc = content
    },
    // 编辑器上传图片
    async handleEditorUploadPic(file) {
      console.log(file)
      const size = file.size / 1024 / 1024
      if (size > 2) {
        this.$message.warning('图片不能大于2MB')
        return
      }
      const paramUploadSign = {
        type: 1
      }
      const { data } = await getUploadSign(paramUploadSign)
      const formData = new FormData()
      formData.append('token', data.token)
      formData.append('key', data.fileName)
      formData.append('file', file)
      const d = await this.$http.post(this.uploadUrl, formData)
      let imgUrl = process.env.VUE_APP_HOST
      if (d.name) {
        imgUrl = imgUrl + '/' + d.name
      } else {
        this.$message.error('上传图片出错')
      }
      const img = new Image()
      img.src = imgUrl
      this.$refs.kindeditor.editor.appendHtml(`<img style="max-width:100%;" src="${imgUrl}">`)
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
      getProductCate(this.queryArticleCate).then(res => {
        res.data.datas.forEach(item => {
          this.categoryOptions.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
      console.log(this.categoryOptions)
      this.loadArticleCate()
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
      if (length >= 8) return false
      if (this.form.keyword.words[length - 1].keyword !== '') {
        this.form.keyword.words.push({ keyword: keyword })
        return
      }
      this.form.keyword.words[length - 1].keyword = keyword
    },
    handleNameChange() {
      if (this.isUpperCase) {
        const name = this.form.name.trim()
        this.setFirstCharToUpperCase(name)
      }
    },
    handleUpperCase(e) {
      this.isUpperCase = !this.isUpperCase
      if (!this.form.name) return
      if (e.target.checked) {
        const name = this.form.name.trim()
        this.setFirstCharToUpperCase(name)
      }
    },
    setFirstCharToUpperCase(name) {
      let firstChar = name.substring(0, 1)
      if (/[a-z]/.test(firstChar)) {
        firstChar = firstChar.toUpperCase()
        this.form.name = firstChar + name.substring(1, name.length)
        return this.form.name
      }
    },
    // 产品主图
    uploadCover(info) {
      this.coverLoading = true
      this.imageUrl = this.getObjectURL(info.file)
      const fd = new FormData()
      fd.append('key', this.fileName)
      fd.append('token', this.picToken)
      fd.append('file', info.file)
      this.$http.post(this.uploadUrl, fd).then(res => {
        this.form.shopImg = res.name
        this.showImage = true
        this.coverLoading = false
        console.log(res.name)
      })
    },
    async getUploadToken() {
      // 获取图片上传凭证
      const param = {
        type: 1
      }
      await getUploadSign(param)
        .then(res => {
          if (res.code === 200) {
            this.picToken = res.data.token
            this.fileName = res.data.fileName
          } else {
            throw res
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    getObjectURL(file) {
      console.log(file)
      var url = null
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    beforeCoverChange(file, fileList) {
      this.coverImg = fileList
      return false
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePicPreview(url) {
      this.previewImage = url
      this.previewVisible = true
    },
    handleDelPic(index) {
      this.picList.splice(index, 1)
    },
    handleCoverPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = this.getObjectURL(file.originFileObj)
      }
      this.imageUrl = file.url || file.preview
      this.coverVisible = true
    },
    handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = this.getObjectURL(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    getUploadData(file) {
      return {
        token: this.picToken,
        key: this.fileName,
        file: file
      }
    },
    handleCoverUploadChange(info) {
      this.coverList = info.fileList
      if (info.file.status === 'done') {
        this.form.shopImg = info.file.response.name
      }
    },
    handleListUploadChange(info) {
      this.imgList = info.fileList
      if (info.file.status === 'done') {
        console.log(info.file.response.name)
        console.log(this.picList)
        this.picList.push({
          name: info.file.response.name,
          path: this.getObjectURL(info.file.originFileObj)
        })
      }
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
      const { form, picList } = this
      const piclist = picList.map(item => item.name)
      const keyword = form.keyword.words.map(item => item.keyword)
      const titleArr = form.name.split(' ')
      const titleId = titleArr.reduce((acc, cur) => `${acc}-${cur}`)
      let params = {}
      params = {
        shopTitle: form.name, // 产品标题
        shopUrl: form.urlValue === 'a' ? `/${titleId}-${new Date().valueOf()}.html` : form.productUrl, // 产品URL
        shopKeyWords: keyword, // 产品关键词
        seoTitle: form.keyword.pageTitle, // SEO 标题
        seoKeyWord: form.keyword.pageKeyword, // SEO 关键词
        seoDescription: form.keyword.pageDesc, // SEO 描述
        shopImgList: piclist, // 产品图片
        shopVideoUrl: form.videoUrl, // 产品视频链接
        shopDesc: form.intro, // 产品简介
        shopBrand: form.attribute.brand, // 产品品牌
        shopNumber: form.attribute.code, // 产品编码
        shopModel: form.attribute.model, // 产品型号
        shopDescribe: this.$refs.kindeditor.outContent, // 产品描述
        relatedAids: this.selectedArticleRowKeys, // 关联文章ID
        relatedShopIds: this.selectedProductRowKeys, // 关联产品ID
        shopImg: piclist[0], // 产品主图
        catId: form.category, // 分类ID
        updateDate: moment(new Date()).format(), // 更新时间
        isShelve: form.shelved === 1, // 是否上架
        shopTags: form.tags // 产品标签
      }
      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(params)
          let res
          if (params.id) {
            res = await updateProduct(params)
          } else {
            res = await addProduct(params)
          }
          if (res.code === 200) {
            this.$message.success('操作成功')
            console.log(res)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCategoryChange(value) {
      console.log(value)
      this.selectedCate = value
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
.pic-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0;
  .operate {
    position: absolute;
    left: 8px;
    top: 8px;
    display: none;
    width: 82px;
    height: 82px;
    line-height: 84px;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    .anticon {
      margin: 0 4px;
    }
  }
  li {
    position: relative;
    display: block;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    margin-right: 10px;
    padding: 8px;
    &:first-child {
      &:before {
        position: absolute;
        content: '封面';
        padding: 2px 5px;
        height: 24px;
        line-height: 24px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
      }
    }
    &:hover {
      .operate {
        display: block;
      }
    }
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}
.img-uploader {
  width: 100px;
  height: 100px;
}
</style>
