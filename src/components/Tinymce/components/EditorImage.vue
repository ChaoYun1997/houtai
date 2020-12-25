<template>
  <div class="upload-container">
    <a-button style="margin-top: 10px; margin-right: 5px" @click="visibleUploadFile = true" icon="picture">上传图片</a-button>

    <a-modal v-model="visibleUploadFile" centered title="上传文件">
      <a-upload
        name="file"
        ref="uploader"
        :action="uploadUrl"
        accept="image/*"
        :data="getUploadData"
        :before-upload="getUploadToken"
        @change="handleUploadChange"
      >
        <a-button>
          <a-icon type="upload" />
          选择文件
        </a-button>
      </a-upload>
      <template #footer>
        <a-button @click="handleSubmit" type="primary">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getUploadSign } from '../../../api/products'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_QINIU_HOST,
      visibleUploadFile: false,
      uploadToken: '',
      uploadFileName: '',
      picList: [],
      listObj: {},
      fileList: []
    }
  },
  methods: {
    getImageSize(path) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
          resolve({
            w: img.width,
            h: img.height
          })
        }
        img.onerror = err => reject(err)
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
    getUploadData(file) {
      return {
        token: this.uploadToken,
        key: this.uploadFileName,
        file: file
      }
    },
    async handleUploadChange(info) {
      if (info.file.status === 'done') {
        console.log(info)
        this.picList.push(process.env.VUE_APP_HOST + '/' + info.file.response.name)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败。`)
      }
    },
    async getUploadToken(info) {
      const param = {
        type: 1
      }
      await getUploadSign(param)
        .then(res => {
          if (res.code === 200) {
            this.uploadToken = res.data.token
            this.uploadFileName = res.data.fileName
          } else {
            throw res
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      // if (!this.checkAllSuccess()) {
      //   this.$message(
      //     'Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!'
      //   )
      //   return
      // }
      this.$emit('successCBK', this.picList)
      this.picList = []
      this.visibleUploadFile = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
