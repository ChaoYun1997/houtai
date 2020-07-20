<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="标题" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="文章URL" class="url">
          <a-radio-group v-model="form.urlValue">
            <a-radio value="a" class="url-radio">系统URL</a-radio>
            <a-radio value="b" class="url-radio">自定义URL</a-radio>
          </a-radio-group>
          <a-input
            class="url-input"
            v-show="form.urlValue === 'b'"
            v-model="form.articleUrl"
            placeholder="请输入自定义URL"
          ></a-input>
          <p class="info" v-show="form.urlValue === 'b'">
            - URL必须以/开头，例如：/about-us.html
            <br />- 请勿使用以p+数字结尾结构的URL，跟系统分页规则冲突，例如：/prod-p2.html <br />-
            频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </p>
        </a-form-model-item>
        <a-form-model-item ref="category" label="所属文章分类" prop="category">
          <span class="cate-item">{{ cateLabel }}</span>
          <a-button @click="showCategoryModal = true">选择</a-button>
        </a-form-model-item>
        <a-form-model-item label="文章关键词" class="keyword-box">
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
                    <span slot="extra">{{ `(${item.associatedArticleCount})` }}</span>
                  </a-list-item>
                </a-list>
                <span slot="actions">
                  <a-button type="link" @click="goToKeywords">管理关键词</a-button>
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
                <a-col :span="19">
                  <a-input v-model="form.keyword.pageTitle" placeholder="请输入页面标题" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="4" :push="1">
                  <span class="label">页面关键词</span>
                </a-col>
                <a-col :span="19">
                  <a-input v-model="form.keyword.pageKeyword" placeholder="请输入页面关键词" />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="4" :push="1">
                  <span class="label">页面描述</span>
                </a-col>
                <a-col :span="19">
                  <a-input v-model="form.keyword.pageDesc" placeholder="请输入页面描述" />
                </a-col>
              </a-row>
            </div>
          </transition>
        </a-form-model-item>
        <a-form-model-item label="文章状态">
          <a-radio-group v-model="form.status">
            <a-radio :value="0">正常</a-radio>
            <a-radio :value="1">草稿</a-radio>
            <a-radio :value="2">定时发布</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="是否置顶">
          <a-checkbox v-model="form.isTop"></a-checkbox>
        </a-form-model-item>
        <a-form-model-item label="发布时间">
          <a-date-picker v-model="form.releaseDate" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 220px" />
        </a-form-model-item>
        <a-form-model-item label="文章浏览次数">
          基数
          <a-input-number id="inputNumber1" v-model="form.readingBase" style="width: 100px;" />+ 实际浏览次数
          <a-input-number id="inputNumber2" v-model="form.realReading" :disabled="true" style="width: 100px;" />=
          前台显示浏览次数
          <a-input-number id="inputNumber3" v-model="reading" :disabled="true" style="width: 100px;" />
        </a-form-model-item>
        <a-form-model-item ref="cover" label="文章附图" prop="cover">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="cover-uploader"
            accept="image/*"
            :show-upload-list="false"
            :data="getUploadData"
            :action="uploadUrl"
            :before-upload="getUploadToken"
            @change="handleArticlePicUpload"
          >
            <img v-if="coverImg" :src="coverImg" alt="cover" />
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="文章内容">
          <!--          <k-editor v-model="form.desc"></k-editor>-->
          <kind-editor @uploadImg="handleEditorUploadPic" :content="form.desc" ref="kindeditor"></kind-editor>
        </a-form-model-item>
        <a-form-model-item ref="intro" label="文章摘要" prop="intro">
          <a-textarea v-model="form.intro" placeholder="请输入文章简介" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-form-model-item>
        <h3>高级</h3>
        <a-form-model-item label="作者" prop="author">
          <a-input v-model="form.info.author" />
        </a-form-model-item>
        <a-form-model-item label="来源" prop="source">
          <a-input v-model="form.info.source" />
        </a-form-model-item>
        <a-form-model-item label="网址" prop="website">
          <a-input v-model="form.info.website" />
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
              ></a-select>
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
              ></s-table>
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
      <a-radio-group v-model="selectedCate">
        <a-row>
          <template v-for="item in articleCate">
            <a-col :key="item.label">
              <a-radio :value="item.id" @change="handleArticleCateChange(item.label)">{{ item.label }}</a-radio>
            </a-col>
          </template>
          <a-radio :value="0" @change="handleArticleCateChange('未分组')">未分组</a-radio>
        </a-row>
      </a-radio-group>
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
import { getProducts, getUploadSign } from '@/api/products'
import { getProductCate, getArticleCate } from '@/api/category'
// eslint-disable-next-line no-unused-vars
import { addArticle, updateArticle, getArticleDetail } from '@/api/article'
import { getKeyword } from '@/api/keyword'
import sortableJS from 'sortablejs'
import KindEditor from '@/components/Kindeditor'
import KEditor from '../../components/KEditor'
import { STable } from '@/components'
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
    KindEditor,
    KEditor,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    return {
      loadProductData: parameter => {
        parameter = Object.assign(parameter, this.queryParam)
        return getProducts(parameter)
      },
      queryParam: {},
      queryProductCate: {},
      pagination: {
        size: 'small'
      },
      articleCate: [], // 文章分类
      selectedArticles: [], // 已关联文章列表
      selectedProducts: [], // 已关联产品列表
      selectedArticleRowKeys: [], // 已选择文章
      selectedProductRowKeys: [], // 已选择产品

      content: '',

      uploading: false,
      uploadUrl: 'http://up-z0.qiniup.com',
      picToken: '',
      fileName: '',
      coverImg: '',
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
      selectedCate: '',
      queryArticleCate: {},
      categoryOptions: [], // 产品分类
      articleCategoryOptions: [], // 文章分类分类
      cateLabel: '未分组',

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
      dateFormat: 'YY-MM-DD hh:mm:ss',
      // 产品表单
      form: {
        name: '',
        articleUrl: '',
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
        category: '',
        coverName: '',
        videoUrl: '',
        intro: '',
        info: {
          author: '',
          source: '',
          website: ''
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
        status: 0,
        articles: [],
        linkProducts: [],
        releaseDate: null
      },
      rules: {
        name: [{ required: true, message: '请输入文章标题', trigger: 'blur' }]
      }
    }
  },
  computed: {
    reading() {
      return Number(this.form.realReading) + Number(this.form.readingBase)
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedProductRowKeys,
        onChange: this.onProductSelectChange
      }
    }
  },
  async created() {
    await this.loadArticleCate()

    const { id } = this.$route.params
    if (!isNaN(id)) {
      this.loadDetail(id)
    }
    const { keyword } = this.$route.query
    if (keyword) {
      this.form.keyword.words[0] = { keyword: keyword }
    }
    this.loadCategory()
    this.loadKeyword()
  },
  mounted() {
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
  methods: {
    moment,
    loadDetail(id) {
      getArticleDetail({ id: id }).then(res => {
        if (res.code === 200) {
          const { form } = this
          const { data } = res
          form.name = data.articleTitle
          form.intro = data.articleAbstract
          form.info.author = data.articleAuthor
          // data.articleContent: "" // 富文本
          form.info.source = data.articleFrom
          form.coverName = data.articleImg
          form.keyword.words = data.articleKeys.map(item => {
            return {
              keyword: item
            }
          })
          if (data.articlaUrl) {
            form.articleUrl = data.articleUrl
            form.urlValue = 'b'
          } else {
            form.urlValue = 'a'
          }
          form.desc = data.articleContent
          form.info.website = data.articleWeb
          form.readingBase = data.baseBrowseCount
          form.realReading = data.browseCount
          const cateName = this.articleCate.find(item => {
            return item.id === data.catId
          })
          form.category = cateName.label
          form.isTop = data.isTop
          form.releaseDate = moment(data.releaseDate, this.dateFormat)
          form.keyword.pageDesc = data.seoDescription
          form.keyword.pageKeyword = data.seoKeywords
          form.keyword.pageTitle = data.seoTitle
          // data.someShopIdList
          form.status = data.status
        }
      })
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
    goToKeywords() {
      this.$confirm({
        content: '你确定要放弃当前内容前往关键词管理吗',
        onOk: () => {
          this.$router.push('/keyword')
        }
      })
    },
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
    loadArticleCate() {
      getArticleCate(this.queryArticleCate).then(res => {
        const result = res.data.datas
        if (result.length > 0) {
          result.forEach(item => {
            this.articleCate.push({
              value: item.catName,
              label: item.catName,
              id: item.id
            })
          })
        }
      })
    },
    handleArticleCateChange(value) {
      console.log(value)
      this.cateLabel = value
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
    handleArticlePicUpload(info) {
      if (info.file.status === 'uploading') {
        this.uploading = true
        return
      }
      if (info.file.status === 'done') {
        console.log(info.file.response.name)
        this.coverImg = this.getObjectURL(info.file.originFileObj)
        this.coverName = info.file.response.name
      }
    },
    async getUploadToken(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不能超过2MB!')
        return isLt2M
      }
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
    getUploadData(file) {
      return {
        token: this.picToken,
        key: this.fileName,
        file: file
      }
    },
    // 获取编辑器内容
    getContent(content) {
      console.log('content', content)
      this.content = content
    },
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
    // 加载关键词数据
    loadKeyword() {
      getKeyword().then(res => {
        this.keywordListLoading = false
        this.keywordList = res.data.datas
      })
    },
    // 加载分类数据
    loadCategory() {
      getProductCate(this.queryProductCate).then(res => {
        res.data.datas.forEach(item => {
          this.categoryOptions.push({
            label: item.catName,
            value: item.catName,
            id: item.id
          })
        })
      })
    },
    handleDelKeyword(index) {
      this.form.keyword.words.splice(index, 1)
    },
    handleSort() {
      console.log('del')
    },
    handleAddKeyword() {
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
    handleCoverRemove() {
      this.coverImg = ''
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
      const { form } = this
      const titleArr = form.name.split(' ')
      const titleId = titleArr.reduce((acc, cur) => `${acc}-${cur}`)
      const params = {
        articleUrl: form.urlValue === 'a' ? `/${titleId}-${new Date().valueOf()}.html` : form.articleUrl, // 产品分类URL
        articleKeys: form.keyword.words.map(item => item.keyword),
        seoKeyWords: form.keyword.pageKeyword,
        seoTitle: form.keyword.pageTitle,
        seoDescription: form.keyword.pageDesc,
        baseBrowseCount: form.readingBase,
        browseCount: form.realReading,
        articleImg: form.coverName,
        articleContent: this.$refs.kindeditor.outContent,
        articleAbstract: form.intro,
        articleAuthor: form.info.author,
        articleFrom: form.info.source,
        articleWeb: form.info.website,
        someShopIdList: this.selectedProductRowKeys,
        articleTitle: form.name,
        status: form.status,
        isTop: this.isTop,
        releaseDate: '2020-07-16T06:11:40.318Z'
      }
      if (this.selectedCate) {
        params.catId = this.selectedCate
      }
      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(params)
          let res
          if (params.id) {
            res = await updateArticle(params)
          } else {
            res = await addArticle(params)
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
    onChange(e) {
      console.log(e)
    },
    onCategoryChange(value) {
      this.selectedCate = value
      // TODO 更新产品分类数据
    },
    // 选择分类
    handleSelectCate() {
      console.log(this.selectedCate)
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

.cover-uploader {
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
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
