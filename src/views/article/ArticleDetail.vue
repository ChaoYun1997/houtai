<template>
  <div>
    <a-form-model
      ref="form"
      :hideRequiredMark="true"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-card :body-style="{ padding: '24px 32px', marginBottom: '10px' }" :bordered="false">
        <h3 slot="title">基本信息</h3>
        <a-form-model-item labelAlign="left" class="label-col" :colon="false" prop="name">
          <div slot="label" class="required">文章名称</div>
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" class="label-col" :colon="false" ref="category" prop="category">
          <div slot="label" class="required">文章分类</div>
          <!--          <span class="cate-item">{{ cateLabel }}</span>-->
          <!--          <a-button @click="showCategoryModal = true">选择</a-button>-->

          <a-select placeholder="请选择文章分类" v-model="form.category" style="width: 220px">
            <a-select-option v-for="item in articleCate" :value="item.id" :key="item.id">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="文章作者" prop="author">
          <a-input v-model="form.info.author" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" ref="intro" label="简要描述" prop="intro">
          <a-textarea v-model="form.intro" placeholder="请输入文章简要描述" :auto-size="{ minRows: 4, maxRows: 6 }" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="文章来源" prop="source">
          <a-input v-model="form.info.source" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="来源网址" prop="website">
          <a-input v-model="form.info.website" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="是否置顶">
          <a-select v-model="form.isTop" style="width: 220px;">
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="发布时间">
          <a-date-picker v-model="form.releaseDate" :show-time="{ format: 'HH:mm:ss' }" style="width: 220px" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="文章状态">
          <a-select v-model="form.status" style="width: 220px;">
            <a-select-option :value="0">正常</a-select-option>
            <a-select-option :value="1">草稿</a-select-option>
            <a-select-option :value="2">定时发布</a-select-option>
          </a-select>
          <!--          <a-radio-group v-model="form.status">-->
          <!--            <a-radio :value="0">正常</a-radio>-->
          <!--            <a-radio :value="1">草稿</a-radio>-->
          <!--            <a-radio :value="2">定时发布</a-radio>-->
          <!--          </a-radio-group>-->
        </a-form-model-item>
      </a-card>
      <a-card :bordered="false" :body-style="{ padding: '24px 32px' }">
        <h3 slot="title">详细信息</h3>
        <a-form-model-item labelAlign="left" :colon="false" ref="cover" label="文章主图" prop="cover">
          <p>
            <a-upload
              class="img-uploader"
              :action="uploadUrl"
              :file-list="imgList"
              accept="image/*"
              :show-upload-list="false"
              :data="getUploadData"
              :before-upload="getUploadToken"
              @change="handleArticlePicUpload"
            >
              <a-button shape="round" type="primary" :loading="isUploading">浏览</a-button>
            </a-upload>
            <span v-if="!coverImg" :class="{ 'link-btn': true }" @click="showFileBank(0)">
              从文件银行选取
            </span>
            <template v-if="coverImg">
              <span class="link-btn" @click="clearFile(0)">删除</span>
              <a-popconfirm placement="right">
                <template slot="title">
                  删除对象不会影响文件银行内容
                </template>
                <a-icon type="question-circle" />
              </a-popconfirm>
            </template>
          </p>
          <img v-if="coverImg" class="cover-preview" :src="coverImg" alt="cover" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="文章浏览次数">
          基数
          <a-input-number id="inputNumber1" v-model="form.readingBase" style="width: 100px;" />
          + 实际浏览次数
          <a-input-number id="inputNumber2" v-model="form.realReading" :disabled="true" style="width: 100px;" />
          = 前台显示浏览次数
          <a-input-number id="inputNumber3" v-model="reading" :disabled="true" style="width: 100px;" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="文章内容">
          <!--          <k-editor v-model="form.desc"></k-editor>-->
          <!--          <kind-editor-->
          <!--            @uploadImg="handleEditorUploadPic"-->
          <!--            :content="form.desc"-->
          <!--            :html="form.desc"-->
          <!--            ref="kindeditor"-->
          <!--          ></kind-editor>-->
          <tinymce ref="tinymce" v-model="form.desc"></tinymce>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px">
        <h3 slot="title">SEO设置</h3>
        <a-form-model-item labelAlign="left" :colon="false" label="自定义 URL" class="url">
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.articleUrl" placeholder="URL必须以/开头，例如：/about-us.html"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="handleRecommendUrl">系统推荐</a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="标题 Title">
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.keyword.pageTitle" placeholder="请输入页面标题" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item class="label-col" :colon="false" labelAlign="left">
          <div slot="label" class=" pt3">
            <span>关键词 Keywords</span>
          </div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.keyword.pageKeyword" placeholder="请输入页面关键词" />
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="handleAddPageTitle">系统添加</a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item class="" :colon="false" labelAlign="left">
          <div slot="label" class=" pt3">
            <span>描述 Description</span>
          </div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-textarea
                v-model="form.keyword.pageDesc"
                placeholder="请输入页面描述"
                :auto-size="{ minRows: 3, maxRows: 6 }"
              />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="文章关键词" class="keyword-box">
          <a-row>
            <a-col :span="12">
              <div ref="list" class="s-flex s-flex-start">
                <div>
                  <div class="list-group-item keyword-input" v-for="(item, index) in form.keyword.words" :key="index">
                    <a-input v-model="item.keyword" placeholder="请输入关键词" />
                    <a-icon
                      v-show="form.keyword.words.length > 1"
                      class="keyword-action sort"
                      slot="addonAfter"
                      type="menu"
                    />
                    <a-icon
                      v-show="form.keyword.words.length > 1"
                      slot="addonAfter"
                      type="close"
                      @click="handleDelKeyword(index)"
                    />
                  </div>
                </div>
                <a-button type="primary" class="keyword-btn" @click="handleKeywordChoose">系统选择</a-button>
              </div>
              <a-button icon="plus" v-show="form.keyword.words.length < 8" @click="handleAddKeyword">
                新增关键词
              </a-button>
            </a-col>
<!--            <a-col :span="8">-->
<!--              <a-card class="keyword-list" size="small">-->
<!--                <div-->
<!--                  style="cursor: pointer"-->
<!--                  class="s-flex s-flex-between s-flex-align-center"-->
<!--                  slot="title"-->
<!--                  @click="showKeyword = !showKeyword"-->
<!--                >-->
<!--                  关键词列表-->
<!--                  <a-icon v-if="showKeyword" type="eye"></a-icon>-->
<!--                  <a-icon v-else type="eye-invisible" />-->
<!--                </div>-->
<!--                <template v-if="showKeyword">-->
<!--                  <a-list-->
<!--                    class="list-box"-->
<!--                    item-layout="horizontal"-->
<!--                    :data-source="keywordList"-->
<!--                    :loading="keywordListLoading"-->
<!--                  >-->
<!--                    <a-list-item-->
<!--                      class="list-content"-->
<!--                      slot="renderItem"-->
<!--                      key="item.id"-->
<!--                      slot-scope="item"-->
<!--                      @click="handleKeywordList(item.keyWord)"-->
<!--                    >-->
<!--                      <a-list-item-meta>-->
<!--                        <span slot="title">{{ item.keyWord }}</span>-->
<!--                      </a-list-item-meta>-->
<!--                      <span slot="extra">{{ `(${item.associatedArticleCount})` }}</span>-->
<!--                    </a-list-item>-->
<!--                  </a-list>-->
<!--                  <span slot="actions">-->
<!--                    <a-button type="link" @click="goToKeywords">管理关键词</a-button>-->
<!--                  </span>-->
<!--                </template>-->
<!--              </a-card>-->
<!--            </a-col>-->
          </a-row>
          <p class="info">
            -请填写3个以上的关键词，每个关键词的长度≤5个单词，长度不得超过100字符，单词之间不需要增加任何符号，直接空格表示。
          </p>
        </a-form-model-item>
      </a-card>
      <a-card style="margin-top: 10px">
        <h3 slot="title">相关内容</h3>
        <h4>相关产品列表</h4>
        <a-alert message="选出5~20篇与该产品相关联的产品展示在前台产品详情。" banner closable />
        <a-table
          :columns="relativeProductColumns"
          :rowKey="record => record.id"
          :row-selection="relativeProductsSelection"
          :data-source="relativeProductsList"
        >
          <span slot="cate" slot-scope="text, record">
            <template v-for="(item, index) in record.catId">
              <span :key="index">{{ getCateName(item) }}<br /></span>
            </template>
          </span>
        </a-table>
        <div class="margin-top">
          <a-button type="primary" style="margin-right: 10px" @click="visibleProductRelative = true">新增</a-button>
          <a-button
            type="danger"
            v-if="relativeProductsList.length > 0"
            @click="cancelRelativeProducts"
            :disabled="relativeProductRowKeys.length === 0"
          >
            取消关联
          </a-button>
        </div>
      </a-card>
      <a-form-model-item>
        <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-modal v-model="visibleKeywordChoose" title="关键词库" :width="600" centered>
      <a-input v-model="keywordSearch" style="width: 260px; margin-right: 10px;margin-bottom: 10px"></a-input>
      <a-button @click="handleKeywordSearch" type="primary" style="margin-right: 10px">搜索</a-button>
      <a-button @click="handleResetKeywordSearch" type="">重置</a-button>
      <s-table
        class="keyword-table"
        size="small"
        ref="keywordTable"
        :rowKey="record => record.id"
        :columns="keywordColumns"
        :data="loadKeywordData"
        :rowSelection="keywordRowSelection"
      ></s-table>
      <div slot="footer">
        <a-button type="primary" @click="handleAppendKeyword" :disabled="!selectedKeywordRowKeys.length">
          添 加
        </a-button>
        <a-button @click="visibleKeywordChoose = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleFileBank" title="文件银行" :width="1000" centered @cancel="hideFileBank">
      <iframe :src="src" ref="iframe" width="950" height="600"></iframe>
      <div slot="footer">
        <a-button type="primary" @click="addFilesTo">确 定</a-button>
        <a-button @click="hideFileBank">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleProductRelative" title="选择关联产品" centered>
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
        style="margin-top: 10px;"
        size="small"
        :pageSize="100"
        :rowKey="record => record.id"
        :scroll="{ y: 380 }"
        :columns="productColumns"
        :data="loadProductData"
        :rowSelection="rowSelection"
      ></s-table>
      <div slot="footer">
        <a-button type="primary" @click="addRelativeProducts">确 定</a-button>
        <a-button @click="visibleProductRelative = false">取 消</a-button>
      </div>
    </a-modal>
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
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getProducts, getUploadSign } from '@/api/products'
import { getProductCate, getArticleCate } from '@/api/category'
// eslint-disable-next-line no-unused-vars
import { addArticle, updateArticle, getArticleDetail } from '@/api/article'
import { getKeyword } from '@/api/keyword'
import sortableJS from 'sortablejs'
import KindEditor from '@/components/Kindeditor'
import { STable } from '@/components'
import moment from 'moment'
import { getRelativeProductsByAid } from '../../api/article'
import { addFile } from '../../api/file'

const keywordColumns = [
  {
    title: '关键词',
    dataIndex: 'keyWord'
  }
]
const relativeProductColumns = [
  {
    title: '产品名称',
    dataIndex: 'shopTitle'
  },
  {
    title: '产品型号',
    dataIndex: 'shopModel'
  },
  {
    title: '所属类目',
    dataIndex: 'catId',
    scopedSlots: {
      customRender: 'cate'
    }
  },
  {
    title: '发布时间',
    dataIndex: 'updateDate'
  }
]
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
    Tinymce,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    this.relativeProductColumns = relativeProductColumns
    this.keywordColumns = keywordColumns
    return {
      visibleKeywordChoose: false,
      keywordSearch: '',
      keywordQuery: {},
      selectedKeywords: [],
      selectedKeywordRowKeys: [],
      loadKeywordData: parameter => {
        parameter = Object.assign(parameter, this.keywordQuery)
        return getKeyword(parameter)
      },

      src: '',
      iframeWin: {},
      queryType: null,
      visibleFileBank: false,
      recervingItems: [],

      submitLoading: false,
      loadProductData: parameter => {
        parameter = Object.assign(parameter, this.queryParam)
        return getProducts(parameter)
      },
      queryParam: {},
      queryProductCate: {
        pageIndex: 1,
        pageSize: 100
      },
      pagination: {
        size: 'small'
      },
      articleCate: [], // 文章分类
      selectedArticles: [], // 已关联文章列表
      selectedProducts: [], // 已关联产品列表
      selectedArticleRowKeys: [], // 已选择文章
      selectedProductRowKeys: [], // 已选择产品
      visibleProductRelative: false,
      relativeProductsList: [], // 已选择的关联产品列表
      relativeProducts: [], // 已选择的关联产品列表
      relativeProductRowKeys: [], // 已选择的关联产品id

      content: '',

      uploading: false,
      uploadUrl: process.env.VUE_APP_QINIU_HOST,
      isUploading: false,
      picToken: '',
      fileName: '',
      coverImg: '',
      previewCover: '',
      imgList: [],
      previewImage: [],

      enabled: true, // 关键词拖动排序开关
      dragging: false, // 关键词拖动

      showKeyword: false,
      keywordList: [], // 关键词列表
      keywordListLoading: true, // 关键词列表加载动画

      showSeo: true,
      showCategoryModal: false, // 显示选择分类
      categoryLoading: true,
      selectedCate: '',
      queryArticleCate: {
        pageIndex: 1,
        pageSize: 100
      },
      categoryOptions: [
        {
          label: '全部分类',
          value: 'all',
          id: null
        }
      ], // 产品分类
      articleCategoryOptions: [], // 文章分类分类
      cateLabel: '未分组',

      showAddSku: false,
      newSku: '',
      skuColumns: [],
      skuDatas: [],

      productId: this.$route.params.id,
      labelCol: { span: 2 },
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
        isTop: 0,
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
        contentimgs: [],
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
    // 已选择产品列表
    relativeProductsSelection() {
      return {
        selectedRowKeys: this.relativeProductRowKeys,
        onChange: this.onrelativeProductSelect
      }
    },
    reading() {
      return Number(this.form.realReading) + Number(this.form.readingBase)
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedProductRowKeys,
        onChange: this.onProductSelectChange
      }
    },
    // 关键词列表
    keywordRowSelection() {
      return {
        selectedRowKeys: this.selectedKeywordRowKeys,
        onChange: this.onKeywordSelectChange
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
  destroyed() {
    window.removeEventListener('message', this.handleMessage)
  },
  mounted() {
    this.initSkuData()

    this.$nextTick(() => {
      // 在外部 Vue 的 window 上添加 postMessage 的监听，并且绑定处理函数 handleMessage
      window.addEventListener('message', this.handleMessage)
    })
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
    handleKeywordChoose() {
      this.visibleKeywordChoose = true
    },
    handleAppendKeyword() {
      this.form.keyword.words = this.form.keyword.words.filter(item => item.keyword !== '')
      console.log(this.form.keyword.words)
      const length = this.form.keyword.words.length
      if (length >= 8) return false
      const limit = 8 - length
      this.selectedKeywords.forEach((item, index) => {
        if (index >= limit) return
        this.form.keyword.words.push({ keyword: item.keyWord })
      })
      this.visibleKeywordChoose = false
      this.selectedKeywords = []
      this.selectedKeywordRowKeys = []
    },
    handleKeywordSearch() {
      this.keywordQuery.KeywordName = this.keywordSearch
      this.$refs.keywordTable.refresh(true)
    },
    handleResetKeywordSearch() {
      this.keywordSearch = ''
      this.keywordQuery = {}
      this.$refs.keywordTable.refresh(true)
    },
    handleRecommendUrl() {
      if (!this.form.name) {
        this.$message.error('内容根据名称生成，请先填写名称')
        return
      }
      const nameArr = this.form.name.split(' ')
      this.form.articleUrl = nameArr.join('-') + '.html'
    },
    handleAddPageTitle() {
      if (!this.form.name || !this.form.keyword.pageTitle) {
        this.$message.error('内容根据名称、标题等生成，请先填写')
        return
      }
      this.form.keyword.pageKeyword = this.form.name + ' ' + this.form.keyword.pageTitle
    },
    hideFileBank() {
      this.src = ''
      this.visibleFileBank = false
    },
    addFilesTo() {
      console.log(this.recervingItems)
      this.visibleFileBank = false
      this.src = ''
      if (this.queryType === 0) {
        const host = process.env.VUE_APP_HOST
        this.coverImg = host + '/' + this.recervingItems[0].fileDownloadName
        this.form.coverName = this.recervingItems[0].fileDownloadName
      }
    },
    clearFile(type) {
      console.log(type)
      if (type === 0) {
        this.coverImg = ''
      }
    },
    showFileBank(type) {
      const files = ['img', 'video', 'pdf']
      this.src = '/fileBank/list/' + files[type]
      this.visibleFileBank = true
      this.queryType = type
      this.$nextTick(() => {
        this.sendMessage(type)
      })
    },
    sendMessage(type) {
      // 外部vue向iframe内部传数据
      console.log(this.$refs.iframe)
      this.iframeWin = this.$refs.iframe.contentWindow
      this.iframeWin.postMessage(
        {
          cmd: 'doSomething',
          params: {
            type: type
          }
        },
        '*'
      )
    },
    handleMessage(event) {
      // 根据上面制定的结构来解析 iframe 内部发回来的数据
      const data = event.data
      switch (data.cmd) {
        case 'ready-for-receiving':
          // 业务逻辑
          break
        case 'recerving-item':
          console.log(data.item)
          this.recervingItems = data.item
          break
      }
    },
    onrelativeProductSelect(selectedRowKeys, selectedRows) {
      this.relativeProductRowKeys = selectedRowKeys
      this.relativeProducts = selectedRows
    },
    getCateName(cate) {
      if (!cate.length) return ''
      const name = []
      cate.forEach(item => {
        const target = this.categoryOptions.find(i => i.id === item)
        if (!target) return
        name.push(target.label)
      })
      return name
    },
    addRelativeProducts() {
      this.relativeProductsList = this.selectedProducts
      this.visibleProductRelative = false
    },
    cancelRelativeProducts() {
      console.log(this.relativeProductRowKeys)
      this.relativeProductRowKeys.forEach(key => {
        this.selectedProductRowKeys = this.selectedProductRowKeys.filter(item => item !== key)
        this.relativeProductsList = this.relativeProductsList.filter(item => item.id !== key)
      })
      this.selectedProducts = this.relativeProductsList
    },
    fetchRelativeProducts(id) {
      getRelativeProductsByAid({ id })
        .then(res => {
          this.relativeProductsList = res.data
          this.selectedProductRowKeys = res.data.map(item => item.id)
        })
        .catch(err => {
          this.$message.error(err.msg || '获取相关联产品失败')
        })
    },
    loadDetail(id) {
      getArticleDetail({ id: id }).then(res => {
        if (res.code === 200) {
          const { form } = this
          const { data } = res
          // eslint-disable-next-line no-unused-vars
          const host = process.env.VUE_APP_HOST
          form.name = data.articleTitle
          form.intro = data.articleAbstract
          form.info.author = data.articleAuthor
          // data.articleContent: "" // 富文本
          form.info.source = data.articleFrom
          form.coverName = data.articleImg
          this.coverImg = data.articleImg ? host + '/' + data.articleImg : ''
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
          // const cateName = this.articleCate.find(item => {
          //   return item.id === data.catId
          // })
          form.category = data.catId
          form.isTop = data.isTop ? 1 : 0
          form.releaseDate = moment(data.releaseDate, this.dateFormat)
          form.keyword.pageDesc = data.seoDescription
          form.keyword.pageKeyword = data.seoKeywords
          form.keyword.pageTitle = data.seoTitle
          // data.someShopIdList
          form.status = data.status
          this.fetchRelativeProducts(id)
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
        this.form.contentimgs.push(d.name)
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
      console.log('selectedRowKeys changed: ', selectedRows)
      this.selectedProductRowKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },
    onKeywordSelectChange(selectedRowKeys, selectedRows) {
      this.selectedKeywordRowKeys = selectedRowKeys
      this.selectedKeywords = selectedRows
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
      if (value === 'all') {
        delete this.queryParam.catId
      } else {
        this.queryParam.catId = value
      }
      this.cateLabel = value
    },
    handleProductCateChange(value) {
      console.log(value)
      if (value === 'all') {
        delete this.queryParam.catId
      } else {
        this.queryParam.catId = value
      }
      this.$refs.table.refresh(true)
    },
    onProductSearch(value) {
      this.queryParam.keyWords = value
      this.$refs.table.refresh(true)
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
    async handleArticlePicUpload(info) {
      if (info.file.status === 'uploading') {
        this.uploading = true
        return
      }
      try {
        if (info.file.status === 'done') {
          console.log(info.file.response.name)
          const arr = info.file.originFileObj.name.split('.')
          const filePath = this.getObjectURL(info.file.originFileObj)
          const params = {
            fileGroupId: 0,
            fileType: 0,
            isFolder: false,
            fileName: arr[0],
            fileDownloadName: info.file.response.name,
            altValue: arr[0],
            fileSize: info.file.originFileObj.size / 1000000
          }
          const sizes = await this.getImageSize(filePath)
          params.fileWidth = sizes.w
          params.fileHeight = sizes.h
          console.log(sizes, params)

          const res = await addFile(params)
          if (res.code === 200) {
            this.$message.success(`${info.file.name} 文件上传成功！`)
          } else {
            this.$message.error(res.msg || '上传失败')
          }
          this.coverImg = this.getObjectURL(info.file.originFileObj)
          this.form.coverName = info.file.response.name
        }
        this.isUploading = false
      } catch (e) {
        this.isUploading = false
      }
    },
    async getUploadToken(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不能超过2MB!')
        return isLt2M
      }
      this.isUploading = true
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
          this.isUploading = false
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
      getKeyword({
        pageIndex: 1,
        pageSize: 100
      }).then(res => {
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
            value: item.id,
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
    // 提交表单
    handleSubmit() {
      const { form } = this
      const params = {
        articleUrl: form.articleUrl,
        articleKeys: form.keyword.words.map(item => item.keyword),
        seoKeyWords: form.keyword.pageKeyword,
        seoTitle: form.keyword.pageTitle,
        seoDescription: form.keyword.pageDesc,
        baseBrowseCount: form.readingBase,
        browseCount: form.realReading,
        articleImg: form.coverName,
        articleContent: form.desc,
        contentImgs: form.contentimgs,
        articleAbstract: form.intro,
        articleAuthor: form.info.author,
        articleFrom: form.info.source,
        articleWeb: form.info.website,
        someShopIdList: this.selectedProductRowKeys,
        articleTitle: form.name,
        status: form.status,
        isTop: form.isTop === 1,
        releaseDate: form.releaseDate
          ? moment(form.releaseDate._d)
              .utc()
              .format()
          : moment().format(),
        catId: form.category,
        sort: 0
      }
      if (this.$route.params.id) {
        params.id = Number(this.$route.params.id)
      }
      console.log(params)
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.submitLoading = true
            let res
            if (params.id) {
              res = await updateArticle(params)
            } else {
              res = await addArticle(params)
            }
            this.submitLoading = false
            if (res.code === 200) {
              this.$message.success('操作成功')
              console.log(res)
            } else {
              throw res
            }
          } catch (e) {
            this.$message.error(e.msg || '操作失败')
          }
        } else {
          this.submitLoading = false
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

.ant-btn-background-ghost.ant-btn-link {
  color: @primary-color;
}

.ant-form-item {
  margin-bottom: 20px !important;
}

.label-col {
  height: 40px !important;
  overflow: hidden;
}

.label-text {
  width: 72px;
  height: 40px;
  overflow: hidden;
  display: block;
  line-height: 16px;
  text-align: justify;
  white-space: normal;
  text-justify: inter-ideograph;
  text-align-last: justify; /* ie9*/
  -moz-text-align-last: justify; /*ff*/
  -webkit-text-align-last: justify; /*chrome 20+*/

  &.pt3 {
    padding-top: 3px;
  }

  &.pt10 {
    padding-top: 10px;
  }

  .en-text {
    letter-spacing: 0.1em;
  }
}

.list-group-item{
  width: 320px;
}
.keyword-btn{
  margin-top: 5px;
}
</style>
