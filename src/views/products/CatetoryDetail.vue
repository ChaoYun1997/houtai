<template>
  <div>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :hideRequiredMark="true"
    >
      <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <h3 slot="title">分类管理</h3>
        <a-form-model-item labelAlign="left" :colon="false" label="选择分类位置" prop="productPosition">
          <a-icon v-if="treeLoading" type="loading" />
          <a-tree
            v-else
            show-line
            :autoExpandParent="true"
            :tree-data="cateTree"
            show-icon
            :selectedKeys.sync="selectedK"
          >
          </a-tree>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="分类名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="分类描述">
          <a-textarea v-model="form.pageDesc" placeholder="请输入简要描述" :auto-size="{ minRows: 3, maxRows: 5 }" />

          <!--          <kind-editor ref="kindeditor" @input="getContent"></kind-editor>-->
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="分类图片">
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <p>
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
          <ul ref="piclist" class="pic-list">
            <li v-for="(item, index) in picList" :key="index">
              <div class="operate">
                <a-icon type="eye" @click="handlePicPreview(item)"></a-icon>
                <a-icon type="delete" @click="handleDelPic(index)"></a-icon>
              </div>
              <img :src="getRealPic(item)" alt />
            </li>

            <!--            <a-upload-->
            <!--              list-type="picture-card"-->
            <!--              class="img-uploader"-->
            <!--              :action="uploadUrl"-->
            <!--              :file-list="imgList"-->
            <!--              accept="image/*"-->
            <!--              :show-upload-list="false"-->
            <!--              :data="getUploadData"-->
            <!--              :before-upload="getUploadToken"-->
            <!--              @change="handleListUploadChange"-->
            <!--            >-->
            <!--              <div v-if="imgList.length < 8">-->
            <!--                <a-icon type="plus"/>-->
            <!--                <div class="ant-upload-text">上传</div>-->
            <!--              </div>-->
            <!--            </a-upload>-->
          </ul>
        </a-form-model-item>
      </a-card>
      <a-card :bordered="false" style="margin-top: 10px">
        <h3 slot="title">SEO设置</h3>
        <a-form-model-item labelAlign="left" :colon="false" class="url">

          <span slot="label">自定义URL</span>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.catUrl" placeholder="请输入自定义URL"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="handleRecommand">系统推荐</a-button>
            </a-col>
          </a-row>
          <!--          <p slot="extra">-->
          <!--            - URL必须以/开头，例如：/about-us.html-->
          <!--            <br />- 请勿使用以p+数字结尾结构的URL，跟系统分页规则冲突，例如：/prod-p2.html <br />- -->
          <!--            频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。-->
          <!--          </p>-->
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false" label="标题 Title">
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.keyword.pageTitle" placeholder="请输入页面标题" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item class="label-col" :colon="false" labelAlign="left">
          <div slot="label" class=" pt3">
            <span class="">关键词 Keyword</span>
          </div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.keyword.pageKeyword" placeholder="请输入页面关键词" />
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="handleAddKeyword">系统添加</a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item class="label-col2" :colon="false" labelAlign="left">
          <div slot="label" class="pt3">
            <span>描述 Description</span>
          </div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-textarea v-model="form.keyword.pageDesc" placeholder="请输入页面描述" :auto-size="{ minRows: 2, maxRows: 2 }" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <!--        <a-form-model-item labelAlign="left" :colon="false" label="SEO关键词">-->
        <!--          <div class="seo-box">-->
        <!--            <transition name="slideToggle">-->
        <!--              <div class="seo-input" v-show="showSeo">-->
        <!--                <ul ref="list" class="list">-->
        <!--                  <li v-for="(item, index) in form.keyword.words" :key="index">-->
        <!--                    <a-input v-model="item.keyword" style="width: 200px"></a-input>-->
        <!--                    <a-icon type="menu"></a-icon>-->
        <!--                  </li>-->
        <!--                </ul>-->
        <!--              </div>-->
        <!--            </transition>-->
        <!--          </div>-->
        <!--        </a-form-model-item>-->
        <a-form-model-item>
          <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
        </a-form-model-item>
      </a-card>
    </a-form-model>
    <a-modal v-model="visibleFileBank" title="文件银行" :width="1000" centered @cancel="hideFileBank">
      <iframe :src="src" ref="iframe" width="950" height="600"></iframe>
      <div slot="footer">
        <a-button type="primary" @click="addFilesTo">确 定</a-button>
        <a-button @click="hideFileBank">取 消</a-button>
      </div>
    </a-modal>
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
// import sortableJS from 'sortablejs'
import { getUploadSign } from '@/api/products'
// eslint-disable-next-line no-unused-vars
import { addCate, updateCate, getProductCate, getCateDetail } from '@/api/category'
import KindEditor from '@/components/Kindeditor'
// eslint-disable-next-line no-unused-vars
const cateTree = [
  {
    title: '所有分类',
    key: '0-0',
    children: []
  }
]
export default {
  name: 'CatetoryDetail',
  components: {
    KindEditor
  },
  data() {
    this.cateTree = cateTree
    return {
      src: '',
      iframeWin: {},
      queryType: null,
      visibleFileBank: false,
      coverImg: '',

      submitLoading: false,
      type: null,
      showAddNewPage: false,
      newPageName: '',
      newPagePath: '',
      fileList: [],
      imgList: [],
      picList: [],
      previewImage: [],
      previewVisible: false,
      uploading: false,
      uploadUrl: process.env.VUE_APP_QINIU_HOST,
      picToken: '',
      fileName: '',
      pages: [],

      queryParam: {
        pageIndex: 1,
        pageSize: 100
      },
      selectedK: [],
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
      showSeo: true,
      customUrl: '',
      treeLoading: true,
      category: [],
      content: '',
      form: {
        name: '',
        urlValue: 'a',
        catUrl: '',
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
        coverName: '',
        catPid: '',
        catWebUrl: '',
        catDescUrl: ''
      },
      rules: {
        name: [{ required: true, message: '请输入产品分类名称', trigger: 'blur' }],
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
    this.pages = this.page
    const { id } = this.$route.params
    if (!isNaN(id)) {
      this.loadCateDetail(id)
    }
    const { parent } = this.$route.query
    if (parent) {
      console.log(parent)
    }
    const { keyword } = this.$route.query
    if (keyword) {
      this.showSeo = true
      this.form.keyword.words[0] = { keyword: keyword }
    }
    this.loadProductCate()
  },
  mounted() {
    this.$nextTick(() => {
      // 在外部 Vue 的 window 上添加 postMessage 的监听，并且绑定处理函数 handleMessage
      window.addEventListener('message', this.handleMessage)
    })
    // const that = this
    // const sortable = sortableJS.create(this.$refs.list, {
    //   sort: true,
    //   animation: 300,
    //   onEnd: function(evt) {
    //     // 拖拽结束发生该事件
    //     that.form.keyword.words.splice(evt.newIndex, 0, that.form.keyword.words.splice(evt.oldIndex, 1)[0])
    //     var newArray = that.form.keyword.words.slice(0)
    //     that.form.keyword.words = []
    //     that.$nextTick(function() {
    //       that.form.keyword.words = newArray
    //       console.log(that.form.keyword.words)
    //     })
    //   }
    // })
  },
  methods: {
    ...mapMutations(['SET_PAGE']),
    handleAddKeyword() {
      if (!this.form.name || !this.form.keyword.pageTitle) {
        this.$message.error('内容根据名称、标题等生成，请先填写')
        return
      }
      this.form.keyword.pageKeyword = this.form.name + ' ' + this.form.keyword.pageTitle
    },
    handleRecommand() {
      if (!this.form.name) {
        this.$message.error('内容根据名称生成，请先填写名称')
        return
      }
      this.form.catUrl = '/' + this.form.name
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
    treeTransfer(data, id) {
      function tree(pid) {
        const arr = []
        data
          .filter(item => item.catPid === pid)
          .forEach(item => {
            const obj = {
              title: item.catName,
              key: `0-${pid}-${item.id}`,
              slots: { icon: 'file' }
            }
            const child = tree(item.id)
            if (child.length) {
              obj.children = child
            }
            arr.push(obj)
          })
        return arr
      }

      return tree(id)
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
    handleListUploadChange(info) {
      this.imgList = info.fileList
      if (info.file.status === 'done') {
        this.picList.push(info.file.response.name)
        console.log(this.picList)
      }
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
    getUploadData(file) {
      return {
        token: this.picToken,
        key: this.fileName,
        file: file
      }
    },
    getRealPic(name) {
      return process.env.VUE_APP_HOST + '/' + name
    },
    handlePicPreview(name) {
      this.previewImage = process.env.VUE_APP_HOST + '/' + name
      this.previewVisible = true
    },
    handleDelPic(index) {
      this.picList.splice(index, 1)
    },
    handleCancel() {
      this.previewVisible = false
    },
    handleAddNewPage() {
      this.SET_PAGE({
        name: this.newPageName,
        path: this.newPagePath
      })
      this.showAddNewPage = false
    },
    loadCateDetail(id) {
      getCateDetail({ id: id }).then(res => {
        if (res.code === 200) {
          const { data } = res
          const { form } = this
          const host = process.env.VUE_APP_HOST
          console.log(data)
          form.name = data.catName
          form.catUrl = data.catUrl ? data.catUrl : '' // 产品url
          form.urlValue = data.catUrl ? 'b' : 'a'
          // const keyword = data.catKeyWords.map(item => {
          //   return {
          //     keyword: item
          //   }
          // })
          // form.keyword.words = Object.assign(form.keyword.words, keyword)
          form.keyword.pageKeyword = data.seoKeyWord
          form.keyword.pageTitle = data.seoTitle
          form.keyword.pageDesc = data.seoDescription
          const pid = Number(data.catPid)
          this.selectedK = pid ? [`0-0-${pid}`] : []
          this.form.coverName = data.catImgList ? data.catImgList[0] : ''
          this.coverImg = data.catImgList.length ? host + '/' + data.catImgList[0] : ''
          this.content = data.catDescription
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
    loadProductCate() {
      this.treeLoading = true
      getProductCate(this.queryParam)
        .then(res => {
          if (res.code !== 200) throw res
          const { datas } = res.data
          this.category = datas.map(item => {
            return {
              name: item.catName,
              id: item.id
            }
          })
          const cateData = datas.map(item => {
            item.catPid = !item.catPid ? 0 : item.catPid
            return item
          })
          console.log(cateData)
          const cates = this.treeTransfer(cateData, 0)
          this.cateTree[0].children = cates
          this.treeLoading = false
          // const cate = []
          // for (let i = 0; i < datas.length; i++) {
          //   const item = datas[i]
          //   if (item.id === 0) {
          //     cate.push({
          //       name: item.catName,
          //       key: `0-0-${item.id}`
          //     })
          //     for (let j = 0; j < datas.length; j++) {
          //       const second = datas[j]
          //       if (item.id === second.id) {
          //         cate[i].children = []
          //         cate[i].children.push({
          //           name: second.catName,
          //           key: `0-0-${item.id}-${second.id}`
          //         })
          //       }
          //     }
          //   }
          // }
          // this.category = cate
        })
        .catch(err => {
          this.$message.error(err.msg || '获取分类失败')
        })
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
    onCatWebUrlChange(val) {
      console.log(val)
      this.form.catWebUrl = val
    },
    onCatDescUrlChange(val) {
      console.log(val)
      this.form.catDescUrl = val
    },
    // 提交产品表单
    handleSubmit() {
      const { form } = this
      const titleArr = form.name.split(' ')
      const titleId = titleArr.reduce((acc, cur) => `${acc}-${cur}`)
      const selectedKey = this.selectedK.length ? this.selectedK[0].split('-') : 0
      let params = {}
      params = {
        itemCount: 0,
        catName: form.name,
        // catKeyWords: form.keyword.words.map(item => item.keyword),
        seoKeyWords: form.keyword.pageKeyword,
        seoTitle: form.keyword.pageTitle,
        seoDescription: form.keyword.pageDesc,
        catUrl: form.urlValue === 'a' ? `/${titleId}-${new Date().valueOf()}.html` : form.catUrl, // 产品分类URL
        catPid: selectedKey.length ? selectedKey[selectedKey.length - 1] : 0,
        catImgList: [form.coverName],
        catDescription: this.content,
        catWebUrl: form.catWebUrl,
        catDescUrl: form.catDescUrl,
        catType: 0
      }

      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(params)
          this.submitLoading = true
          let res
          if (params.id) {
            res = await updateCate(params)
          } else {
            res = await addCate(params)
          }
          this.submitLoading = false
          if (res.code === 200) {
            this.$message.success('操作成功')
            console.log(res)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          this.submitLoading = false
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

.seo-box {
  .list {
    padding-left: 0;

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

.input-md {
  width: 160px;
}

.input-lg {
  width: 420px;
}

.right-padd {
  padding-right: 40px !important;
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
.label-col2 {
  height: 55px !important;
  overflow: hidden;
}
.label-text {
  width: 72px;
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
}
</style>
