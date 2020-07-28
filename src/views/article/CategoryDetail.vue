<template>
  <div>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <h3 class="title">基本信息</h3>
        <a-divider style="margin: 4px 0 20px 0;" />
        <a-form-model-item label="文章分类名称" prop="cate">
          <a-input v-model="form.cate" />
          <p class="info negativeTop">-频繁修改文章名称直接影响SEO效果，请仔细斟酌后再提交。</p>
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
            v-model="form.catUrl"
            placeholder="请输入自定义URL"
          ></a-input>
          <p class="info" v-show="form.urlValue === 'b'">
            - URL必须以/开头，例如：/about-us.html <br />
            - 频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </p>
        </a-form-model-item>
        <a-form-model-item label="选择分类位置" prop="productPosition">
          <a-tree show-line default-expand-all :selectedKeys.sync="selectedK">
            <a-icon slot="switcherIcon" type="down" />
            <a-tree-node key="0-0" title="所有分类">
              <template v-for="item in category">
                <a-tree-node :key="`0-0-${item.id}`" :title="item.name"></a-tree-node>
              </template>
            </a-tree-node>
          </a-tree>
        </a-form-model-item>
        <a-form-model-item label="文章分类图片">
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
        <h3 class="title">指向页面</h3>
        <a-divider style="margin: 4px 0 20px 0;" />
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
        <h3 class="title">搜索引擎优化</h3>
        <a-divider style="margin: 4px 0 20px 0;" />
        <div class="seo">
          <a-row :gutter="[16, 20]">
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
        <a-form-model-item>
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>

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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getUploadSign } from '@/api/products'
import { getArticleCate, updateCate, addCate, getCateDetail } from '@/api/category'

export default {
  name: 'CatetoryDetail',
  data() {
    return {
      showAddNewPage: false,
      newPageName: '',
      newPagePath: '',
      coverImg: '',
      coverName: '',
      uploading: false,
      uploadUrl: 'http://up-z0.qiniup.com',

      selectedK: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      showSeo: false,
      customUrl: '',
      category: [],
      pages: [],
      form: {
        cate: '',
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
        }
      },
      rules: {
        cate: [{ required: true, message: '请输入文章分类名称', trigger: 'blur' }],
        keyword: [{ required: true, message: '请输入分类关键词', trigger: 'blur' }]
      },
      queryCate: {}
    }
  },
  computed: {
    ...mapState({
      page: state => state.pages.page
    })
  },
  created() {
    this.pages = this.page
    const { id } = this.$route.params
    if (!isNaN(id)) {
      this.loadCateDetail(id)
    }
    this.loadProductCate()
  },
  methods: {
    ...mapMutations(['SET_PAGE']),
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
    loadCateDetail(id) {
      getCateDetail({ id: id }).then(res => {
        if (res.code === 200) {
          const { data } = res
          const { form } = this
          console.log(data)
          form.cate = data.catName
          form.urlValue = data.catUrl ? 'b' : 'a'
          form.catUrl = data.catUrl // 产品url
          const keyword = data.catKeyWords.map(item => {
            return {
              keyword: item
            }
          })
          form.keyword.words = Object.assign(form.keyword.words, keyword)
          form.keyword.pageKeyword = data.seoKeyWords
          form.keyword.pageTitle = data.seoTitle
          form.keyword.pageDesc = data.seoDescription
          const pid = Number(data.catPid)
          // this.selectedK = ['0-0-9']
          this.selectedK = pid ? [`0-0-${pid}`] : []
          if (data.catWebUrl) {
            this.pages.push({ name: '自定义1', path: `${data.catWebUrl}` })
            form.catWebUrl = data.catWebUrl
          }
          if (data.catDescUrl) {
            if (data.catDescUrl !== data.catWebUrl) {
              this.pages.push({ name: '自定义2', path: `${data.catDescUrl}` })
              form.catDescUrl = data.catDescUrl
            } else {
              form.catDescUrl = data.catWebUrl
            }
          }
          if (form.keyword.pageDesc || form.keyword.pageKeyword || form.keyword.pageTitle) {
            this.showSeo = true
          }
        }
      })
    },
    handleAddNewPage() {
      this.SET_PAGE({
        name: this.newPageName,
        path: this.newPagePath
      })
      this.showAddNewPage = false
    },
    loadProductCate() {
      getArticleCate(this.queryCate).then(res => {
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
    // 获取编辑器内容
    getContent(content) {
      console.log('content', content)
      this.content = content
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    handleCatePageChange(value) {
      console.log(`selected ${value}`)
      this.form.catWebUrl = value
    },
    handleDetailPageChange(value) {
      console.log(`selected ${value}`)
      this.form.catDescUrl = value
    },
    // 提交文章分类表单
    handleSubmit() {
      const { form } = this
      const titleArr = form.cate.split(' ')
      const titleId = titleArr.reduce((acc, cur) => `${acc}-${cur}`)
      const selectedKey = this.selectedK.length ? this.selectedK[0].split('-') : 0
      let params = {}
      params = {
        itemCount: 0,
        catName: form.cate,
        seoKeyWords: form.keyword.pageKeyword,
        seoTitle: form.keyword.pageTitle,
        seoDescription: form.keyword.pageDesc,
        catUrl: form.urlValue === 'a' ? `/${titleId}-${new Date().valueOf()}.html` : form.catUrl, // 产品分类URL
        catPid: selectedKey.length ? selectedKey[selectedKey.length - 1] : 0,
        catImgList: [this.coverName],
        catWebUrl: form.catWebUrl,
        catDescUrl: form.catDescUrl,
        catType: 1
      }

      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(params)
          let res
          if (params.id) {
            res = await updateCate(params)
          } else {
            res = await addCate(params)
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
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';

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
