<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <h5>基本信息</h5>
        <a-form-model-item label="产品分类名称" prop="cate">
          <a-input v-model="form.name" />
          <p class="info negativeTop">-频繁修改产品名称直接影响SEO效果，请仔细斟酌后再提交。</p>
        </a-form-model-item>
        <a-form-model-item label="SEO">
          <div class="seo-box">
            <transition name="slideToggle">
              <div class="seo-input" v-show="showSeo">
                <ul ref="list" class="list">
                  <li v-for="(item, index) in form.keyword.words" :key="index">
                    <a-input v-model="item.keyword" style="width: 200px"></a-input>
                    <a-icon type="menu"></a-icon>
                  </li>
                </ul>
              </div>
            </transition>
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
          </div>
        </a-form-model-item>
        <a-form-model-item label="分类URL" class="url">
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
            - 频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </p>
        </a-form-model-item>
        <a-form-model-item label="选择分类位置" prop="productPosition">
          <a-tree @select="onSelect" default-expand-all :selectedKeys="selectedK">
            <a-icon slot="switcherIcon" type="down" />
            <a-tree-node key="0-0" title="所有分类">
              <template v-for="item in category">
                <a-tree-node :key="`0-0-${item.id}`" :title="item.name"></a-tree-node>
              </template>
            </a-tree-node>
          </a-tree>
        </a-form-model-item>
        <a-form-model-item label="产品分类图片">
          <div class="img-box">
            <a-upload class="btn" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
            <a-button
              class="btn"
              type="primary"
              :disabled="fileList.length === 0"
              :loading="uploading"
              @click="handleUpload"
            >
              {{ uploading ? '上传中' : '开始上传' }}
            </a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label="产品描述">
          <kind-editor ref="kindeditor" @input="getContent"></kind-editor>
        </a-form-model-item>
        <h5>指向页面</h5>
        <b>设置分类指向页面</b>
        <p>
          <a-select style="width: 120px" :default-value="form.catWebUrl" @change="handleCatePageChange">
            <template v-for="item in page">
              <a-select-option :value="item.path" :key="item.name">
                {{ item.name }}
              </a-select-option>
            </template>
          </a-select>
          <a-button style="margin-left: 10px;" @click="showAddNewPage = true">新建页面</a-button>
        </p>
        <b>设置详情指向页面</b>
        <p>
          <a-select style="width: 120px" :default-value="form.catDescUrl" @change="handleDetailPageChange">
            <template v-for="item in page">
              <a-select-option :value="item.path" :key="item.name">
                {{ item.name }}
              </a-select-option>
            </template>
          </a-select>
        </p>
        <a-form-model-item>
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </a-form-model-item>
      </a-form-model>
      <a-modal v-model="showAddNewPage" title="添加新页面">
        <a-row :gutter="[16, 24]">
          <a-col :span="4">页面名称</a-col>
          <a-col :span="20">
            <a-input v-model="newPageName" placeholder="请输入页面名称"></a-input>
          </a-col>
          <a-col :span="4">路径URL</a-col>
          <a-col :span="20">
            <a-input v-model="newPagePath" placeholder="请输入路径URL，例如'/abc'"></a-input>
          </a-col>
        </a-row>
        <div slot="footer">
          <a-button @click="showAddNewPage = false">取消</a-button>
          <a-button
            type="primary"
            style="margin-left: 10px;"
            @click="handleAddNewPage"
            :disabled="newPageName === '' || newPagePath === ''"
          >
            确定
          </a-button>
        </div>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import sortableJS from 'sortablejs'
import { getProductCate } from '@/api/category'
import KindEditor from '@/components/Kindeditor'

export default {
  name: 'CatetoryDetail',
  components: {
    KindEditor
  },
  data() {
    return {
      showAddNewPage: false,
      newPageName: '',
      newPagePath: '',
      fileList: [],
      uploading: false,

      queryParam: {},
      selectedK: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      showSeo: false,
      customUrl: '',
      category: [],
      content: '',
      form: {
        name: '',
        urlValue: 'a',
        keyword: {
          words: [
            { keyword: '' },
            { keyword: '' },
            { keyword: '' },
            { keyword: '' },
            { keyword: '' },
            { keyword: '' },
            { keyword: '' },
            { keyword: '' }
          ],
          pageTitle: '',
          pageKeyword: '',
          pageDesc: ''
        },
        catWebUrl: '',
        catDescUrl: ''
      },
      rules: {
        cate: [{ required: true, message: '请输入产品分类名称', trigger: 'blur' }],
        keyword: [{ required: true, message: '请输入分类关键词', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      page: state => state.pages.page
    })
  },
  created() {
    this.loadProductCate()
    console.log(`page: ${this.page}`)
  },
  mounted() {
    const that = this
    // eslint-disable-next-line no-unused-vars
    const sortable = sortableJS.create(this.$refs.list, {
      sort: true,
      animation: 300,
      onEnd: function(evt) {
        // 拖拽结束发生该事件
        that.form.keywords.splice(evt.newIndex, 0, that.form.keywords.splice(evt.oldIndex, 1)[0])
        var newArray = that.form.keywords.slice(0)
        that.form.keywords = []
        that.$nextTick(function() {
          that.form.keywords = newArray
          console.log(that.form.keywords)
        })
      }
    })
  },
  methods: {
    ...mapMutations(['SET_PAGE']),
    handleAddNewPage() {
      this.SET_PAGE({
        name: this.newPageName,
        path: this.newPagePath
      })
      this.showAddNewPage = false
    },
    loadProductCate() {
      getProductCate(this.queryParam).then(res => {
        this.category = res.data.datas.map(item => {
          return {
            name: item.catName,
            id: item.id
          }
        })
      })
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, info)
      this.selectedK = selectedKeys
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleUpload() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.uploading = true

      // You can use any AJAX library you like
      // TODO 上传图片
    },
    // 获取编辑器内容
    getContent(content) {
      console.log('content', content)
      this.content = content
    },
    handleCatePageChange(value) {
      console.log(`selected ${value}`)
      this.form.catWebUrl = value
    },
    handleDetailPageChange(value) {
      console.log(`selected ${value}`)
      this.form.catDescUrl = value
    },
    // 提交产品表单
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';

.seo-box {
  .list {
    li {
      width: 240px;
      margin: 10px 0;
      padding: 5px;
      background: @background-color-base;
      border-radius: @border-radius-base;
      input {
        margin-right: 10px;
      }
    }
  }
  .panel-box {
    background: #f3f5f7;
    padding: 10px;
  }
  .seo {
    .panel-box;
    .label {
      font-size: @font-size-sm;
    }
  }
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
.slideToggle-enter-active,
.slideToggle-leave-active {
  transition: opacity 0.5s;
}
.slideToggle-enter, .slideToggle-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
