<template>
  <page-header-wrapper>
    <a-card>
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item>
          <a-row slot="label" type="flex" justify="space-between">
            <a-col :span="10" class="label-left">
              <span class="icon">
                <a-icon size="large" :type="!!watermark.isOpen ? 'unlock' : 'lock'"></a-icon>
              </span>
              <div class="title">
                <b>{{ !!watermark.isOpen ? '已开启水印' : '已关闭水印' }}</b>
                <span class="info">开启该功能后，可以给新上传的产品图片添加水印</span>
              </div>
            </a-col>
            <a-col>
              <a-button size="large" :type="!!watermark.isOpen ? 'danger' : 'primary'" @click="handleStatus">
                {{ !!watermark.isOpen ? '关闭图片水印功能' : '开启图片水印功能' }}
              </a-button>
            </a-col>
          </a-row>

          <a-tabs default-active-key="1" @change="callback" v-show="!watermark.isOpen">
            <a-tab-pane key="1" tab="图片水印">
              <a-row>
                <a-col class="preview-box" :span="10">
                  <div
                    class="rt"
                    ref="previewBox1"
                    :style="`font-family:${fontFamily};font-size:${fontSize}px;color:${fontColor};${previewBg}`"
                  >
                    <span class="watermark watermarkImg" ref="text">
                      <img :src="watermarkImg()" :style="`opacity:${picOpacity/100};`" alt="" />
                    </span>
                  </div>
                </a-col>
                <a-col class="" :span="14">
                  <a-form
                    :form="form"
                    ref="form"
                    @submit="handlePicSubmit"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 20 }"
                  >
                    <a-form-item label="水印图片">
                      <a-upload
                        name="file"
                        :multiple="true"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        @change="handleUploadChange"
                      >
                        <a-button> <a-icon type="upload" /> 上传图片 </a-button>
                      </a-upload>
                    </a-form-item>
                    <a-form-item label="透明度">
                      <a-row :gutter="20">
                        <a-col :span="18">
                          <a-slider :default-value="picOpacity" @change="handleOpacity" />
                        </a-col>
                        <a-col :span="4">
                          <b>{{ picOpacity }}</b>
                        </a-col>
                      </a-row>
                    </a-form-item>
                    <a-form-item label="水印位置">
                      <a-radio-group :options="plainOptions" default-value="1" @change="onPositionChange" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
                      <a-button type="primary" html-type="submit">
                        提交
                      </a-button>
                    </a-form-item>
                  </a-form>
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
                    <span class="watermark" ref="text">
                      {{ textWatermark }}
                    </span>
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-form
                    layout="horizontal"
                    ref="formFont"
                    :form="formFont"
                    @submit="handleFontSubmit"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 20 }"
                  >
                    <a-form-item label="水印文字">
                      <a-input style="width: 200px" v-model="textWatermark"></a-input>
                    </a-form-item>
                    <a-form-item label="文字字体">
                      <a-select default-value="SimHei" style="width: 120px" @change="handleFontChange">
                        <a-select-option value="SimHei">
                          黑体
                        </a-select-option>
                        <a-select-option value="SimSun">
                          宋体
                        </a-select-option>
                        <a-select-option value="KaiTi">
                          楷体
                        </a-select-option>
                        <a-select-option value="arial">
                          Arial
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="文字颜色">
                      <a-input ref="color" v-model="fontColor" class="color-picker" type="color"></a-input>
                    </a-form-item>
                    <a-form-item label="文字字号">
                      <a-row :gutter="20">
                        <a-col :span="18">
                          <a-slider v-model="fontSize" :min="12" :max="72" />
                        </a-col>
                        <a-col :span="4">
                          <b>{{ fontSize }} px</b>
                        </a-col>
                      </a-row>
                    </a-form-item>
                    <a-form-item label="水印位置">
                      <a-radio-group :options="plainOptions" default-value="1" @change="onPositionChange" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
                      <a-button type="primary" html-type="submit">
                        提交
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getWatermark, setWatermarkStatus, saveWatermark } from '../../api/watermark'

const plainOptions = [
  { label: '左上角', value: '0', position: 'lt' },
  { label: '右上角', value: '1', position: 'rt' },
  { label: '右下角', value: '2', position: 'rb' },
  { label: '中间', value: '3', position: 'center' },
  { label: '左下角', value: '4', position: 'lt' }
]
export default {
  name: 'Watermark',
  data() {
    this.plainOptions = plainOptions
    return {
      status: true,
      form: this.$form.createForm(this),
      formFont: this.$form.createForm(this),
      watermark: {},
      picOpacity: 70,
      fontSize: 32,
      textWatermark: 'WATERMARK',
      fontFamily: 'SimHei',
      fontColor: '#ffffff',
      left: 'auto',
      right: 'auto',
      top: 'auto',
      bottom: 'auto',
      previewBg: `background: url("${require('@/assets/fruit.jpg')}")0 0 no-repeat;`
    }
  },
  created() {
    this.loadWatermark()
    console.log(this.watermark.isOpen)
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
          this.watermark = res.data.datas
        }
      })
    },
    handleUpdateWatermark() {
      const param = {
        createID: 0,
        creator: 'string',
        createDate: '2020-07-04T04:07:57.425Z',
        modifyID: 0,
        modifier: 'string',
        modifyDate: '2020-07-04T04:07:57.425Z',
        isOpen: true,
        userId: 0,
        imgUrl: 'string',
        imgOpacity: 0,
        imgPosition: 0,
        fontFamily: 0,
        fontSize: 0,
        fontStyles: 'string',
        fontColor: 'string',
        watermarkType: 0,
        watemarkText: 'string'
      }
      saveWatermark(param).then(res => {
        console.log(res)
        this.$message.success('更新成功')
      })
    },
    handleUploadChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    handleStatus() {
      this.status = false
      setWatermarkStatus({
        isOpen: !this.watermark.isOpen
      }).then(res => {
        console.log(res)
        this.$message.success('修改成功')
      })
    },
    onPositionChange(e) {
      console.log(plainOptions[e.target.value].position, this.$refs.previewBox)
      const position = plainOptions[e.target.value].position.toString()
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
    handlePicSubmit() {},
    handleFontSubmit() {
      console.log(this.$refs.color.value)
    },
    callback(key) {
      console.log(key)
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
