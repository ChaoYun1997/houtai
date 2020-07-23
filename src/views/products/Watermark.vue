<template>
  <div>
    <a-card>
      <div class="watermark-wrap">
        <a-row v-if="watermark.watermarkType" class="wrap-head" type="flex" justify="space-between" align="middle">
          <a-col :span="10" class="label-left">
            <span class="icon">
              <a-icon size="large" :type="watermark.isOpen ? 'unlock' : 'lock'"></a-icon>
            </span>
            <div class="title">
              <b>{{ watermark.isOpen ? '已开启水印' : '已关闭水印' }}</b>
              <span class="info">开启该功能后，可以给新上传的产品图片添加水印</span>
            </div>
          </a-col>
          <a-col>
            <a-button size="large" :type="watermark.isOpen ? 'danger' : 'primary'" @click="handleStatus">{{
              watermark.isOpen ? '关闭图片水印功能' : '开启图片水印功能'
            }}</a-button>
          </a-col>
        </a-row>
        <a-tabs
          class="wrap-content"
          :activeKey="defaultTabKey"
          @change="handleSwitchTab"
          v-show="!watermark.watermarkType || watermark.isOpen"
        >
          <a-tab-pane key="1" tab="图片水印">
            <a-row>
              <a-col class="preview-box" :span="10">
                <div
                  class="rt"
                  ref="previewBox1"
                  :style="`font-family:${fontFamily};font-size:${fontSize}px;color:${fontColor};${previewBg}`"
                >
                  <span class="watermark watermarkImg" ref="text">
                    <img :src="defaultImg" :style="`opacity:${picOpacity / 100};`" alt />
                  </span>
                </div>
              </a-col>
              <a-col class :span="14">
                <a-form-model :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                  <a-form-model-item label="水印图片">
                    <div v-if="uploadedName" class="uploaded-content">
                      <span>{{ uploadedName }}</span>
                      <a-icon style="margin-left: 20px" type="close" @click="handleRemoveImg"></a-icon>
                    </div>
                    <a-upload
                      v-else
                      name="file"
                      accept="image/*"
                      :showUploadList="false"
                      :custom-request="customRequest"
                    >
                      <a-button>
                        <a-icon :type="imgLoading ? 'loading' : `upload`" />
                        {{ imgLoading ? '上传中' : '上传图片' }}
                      </a-button>
                    </a-upload>
                  </a-form-model-item>
                  <a-form-model-item label="透明度">
                    <a-row :gutter="20">
                      <a-col :span="18">
                        <a-slider v-model="picOpacity" :min="1" :max="100" />
                      </a-col>
                      <a-col :span="4">
                        <a-input-number v-model="picOpacity" :min="1" :max="100" style="width: 70px;" />
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                  <a-form-model-item label="水印位置">
                    <a-radio-group :options="plainOptions" v-model="positionVal" @change="onPositionChange" />
                  </a-form-model-item>
                  <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
                    <a-button type="primary" @click="handlePicSubmit">
                      <template v-if="picLoading">
                        <a-icon type="loading"></a-icon>
                      </template>
                      <span v-else>提交</span>
                    </a-button>
                  </a-form-model-item>
                </a-form-model>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="文字水印" force-render>
            <a-row>
              <a-col class="preview-box" :span="10">
                <div
                  class="rt"
                  ref="previewBox"
                  :style="`font-family:${fontFamily};font-size:${fontSize}px;color:${fontColor};${previewBg}`"
                >
                  <span class="watermark" ref="text">{{ textWatermark }}</span>
                </div>
              </a-col>
              <a-col :span="14">
                <a-form-model layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                  <a-form-model-item label="水印文字">
                    <a-input style="width: 200px" v-model="textWatermark"></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="文字字体">
                    <a-select v-model="fontFamily" style="width: 120px">
                      <a-select-option value="SimSun">宋体</a-select-option>
                      <a-select-option value="SimHei">黑体</a-select-option>
                      <a-select-option value="Microsoft Yahei">微软雅黑</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="文字颜色">
                    <a-input ref="color" v-model="fontColor" class="color-picker" type="color"></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="文字字号">
                    <a-row :gutter="20">
                      <a-col :span="18">
                        <a-slider v-model="fontSize" :min="12" :max="72" />
                      </a-col>
                      <a-col :span="4">
                        <b>{{ fontSize }} px</b>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                  <a-form-model-item label="水印位置">
                    <a-radio-group :options="plainOptions" v-model="positionVal" @change="onPositionChange" />
                  </a-form-model-item>
                  <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
                    <a-button type="primary" @click="handleFontSubmit">
                      <template v-if="fontLoading">
                        <a-icon type="loading"></a-icon>
                      </template>
                      <span v-else>提交</span>
                    </a-button>
                  </a-form-model-item>
                </a-form-model>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getWatermark, setWatermarkStatus, saveWatermark } from '@/api/watermark'
import { getUploadSign } from '@/api/products'
import storage from 'store'
import { USERNAME, USERID } from '@/store/mutation-types'

const plainOptions = [
  { label: '左上角', value: 1, position: 'lt' },
  { label: '右上角', value: 2, position: 'rt' },
  { label: '中间', value: 3, position: 'center' },
  { label: '左下角', value: 4, position: 'lb' },
  { label: '右下角', value: 5, position: 'rb' }
]
export default {
  name: 'Watermark',
  data() {
    this.plainOptions = plainOptions
    return {
      fontLoading: false,
      picLoading: false,
      username: storage.get(USERNAME),
      uid: storage.get(USERID),
      status: true,
      defaultTabKey: '1',
      watermark: {},
      picOpacity: 70,
      fontSize: 32,
      textWatermark: '',
      fontFamily: 'SimHei',
      fontColor: '#ffffff',
      left: 'auto',
      right: 'auto',
      top: 'auto',
      bottom: 'auto',
      previewBg: `background: url("${require('@/assets/fruit.jpg')}")0 0 no-repeat;`,
      disabledUpload: false,
      imgLoading: false,
      uploadedName: '',
      defaultImg: require('@/assets/watermark.png'),
      uploadUrl: 'http://up-z0.qiniup.com',
      picToken: '',
      fileName: '',
      positionVal: 2
    }
  },
  watch: {
    fileList(val) {
      console.log(val)
    }
  },
  mounted() {
    this.loadWatermark()
  },
  methods: {
    watermarkImg() {
      if (this.watermark.imgUrl) {
        return this.watermark.imgUrl
      }
      return require('@/assets/watermark.png')
    },
    loadWatermark() {
      getWatermark().then(res => {
        if (res.code === 200) {
          this.watermark = res.data
          if (this.watermark.imgUrl) {
            this.defaultImg = this.watermark.imgUrl = process.env.VUE_APP_HOST + '/' + this.watermark.imgUrl
          }
          this.defaultTabKey = this.watermark.watermarkType ? this.watermark.watermarkType.toString() : '1'
          this.textWatermark = this.watermark.watemarkText
          this.fontFamily =
            this.watermark.fontFamily === 1 ? 'SimSun' : this.watermark.fontFamily === 2 ? 'SimHei' : 'Microsoft Yahei'
        }
      })
    },
    getUploadData(file) {
      return {
        token: this.picToken,
        key: this.fileName,
        file: file
      }
    },
    imgReader(src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = src
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          })
        }
        img.onerror = reject
      })
    },
    async getUploadToken(file) {
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
      return true
    },
    handleRemoveImg() {
      this.uploadedName = ''
      this.defaultImg = require('@/assets/watermark.png')
    },
    async customRequest(info) {
      const src = this.getObjectURL(info.file)
      const img = await this.imgReader(src)
      console.log(img)
      if (img.width > 150 || img.height > 80) {
        this.$message.error('水印图片尺寸不能大于150*80')
        return false
      }
      // 获取图片上传凭证
      const param = {
        type: 1
      }
      getUploadSign(param).then(res => {
        if (res.code === 200) {
          this.picToken = res.data.token
          this.fileName = res.data.fileName

          var fd = new FormData()
          fd.append('key', res.data.fileName)
          fd.append('token', res.data.token)
          fd.append('file', info.file)

          this.$http
            .post(this.uploadUrl, fd)
            .then(res => {
              console.log(res)
              this.imgLoading = false
              this.defaultImg = this.getObjectURL(info.file)
              this.uploadedName = res.name
              this.$message.success(`${info.file.name} 上传成功`)
            })
            .catch(err => {
              console.log(err)
              this.$message.error(`${info.file.name} 上传失败`)
            })
        }
      })
    },
    handleUploadChange(info) {
      if (info.file.status !== 'uploading') {
        this.imgLoading = true
      }
      if (info.file.status === 'done') {
        this.imgLoading = false
        this.defaultImg = this.getObjectURL(info.file.originFileObj)
        this.uploadedName = info.file.response.name
        this.$message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
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
    handleStatus() {
      this.status = false
      setWatermarkStatus({
        isOpen: !this.watermark.isOpen
      }).then(res => {
        console.log(res)
        this.$message.success('修改成功')
        this.watermark.isOpen = !this.watermark.isOpen
      })
    },
    onPositionChange(e) {
      console.log(this.positionVal)
      const position = plainOptions[e.target.value - 1].position.toString()
      this.$refs.previewBox.classList = this.$refs.previewBox1.classList = []
      this.$refs.previewBox.classList.add(position)
      this.$refs.previewBox1.classList.add(position)
    },
    handleOpacity(value) {
      console.log(value)
      this.picOpacity = value
    },
    handleFontChange(value) {
      this.fontFamily = value
    },
    submit(type) {
      const fonts = {
        SimSun: 1,
        SimHei: 2,
        'Microsoft Yahei': 3
      }
      const param = {
        isOpen: true,
        imgUrl: this.uploadedName,
        imgOpacity: this.picOpacity,
        imgPosition: this.positionVal,
        fontFamily: fonts[this.fontFamily],
        fontSize: this.fontSize,
        fontStyles: '',
        fontColor: this.fontColor,
        watermarkType: type === 'pic' ? 1 : 2,
        watemarkText: this.textWatermark
      }
      console.log(param)
      saveWatermark(param)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('更新成功')
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
        .finally(() => {
          this.fontLoading = false
          this.picLoading = false
        })
    },
    handlePicSubmit() {
      if (!this.uploadedName) {
        this.$message.error('请上传水印图片')
        return
      }
      this.submit('pic')
      this.picLoading = true
    },
    handleFontSubmit() {
      if (!this.textWatermark) {
        this.$message.error('请输入水印文字')
        return
      }
      this.submit('font')
      this.fontLoading = true
      console.log(this.$refs.color.value)
    },
    handleSwitchTab(key) {
      console.log(key)
      this.defaultTabKey = key
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default.less';

.info {
  color: #999;
}
.preview-box {
  & > div {
    display: flex;
    width: 320px;
    height: 320px;
    &.center {
      justify-content: center;
      align-items: center;
    }
    &.lt {
      justify-content: flex-start;
      align-items: flex-start;
    }
    &.lb {
      justify-content: flex-start;
      align-items: flex-end;
    }
    &.rt {
      justify-content: flex-end;
      align-items: flex-start;
    }
    &.rb {
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
  .watermark {
    margin: 20px;
  }
}
.color-picker {
  padding: 2px;
  width: 32px;
}
.label-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  b {
    display: block;
  }
  .icon {
    display: block;
    font-size: 32px;
    margin-right: 10px;
  }
}
.btn-box-right {
  display: flex;
  justify-content: flex-end;
}
.watermark-wrap {
  border: 1px solid @border-color-base;
  padding: 0;
}
.wrap-head {
  width: 100%;
  height: 84px;
  padding: 20px 20px;
  background: @background-color-base;
}
.wrap-content {
  padding: 20px;
}
</style>
