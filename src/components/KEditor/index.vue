<template>
  <div class="kindeditor">
    <textarea
      class="form-control"
      ref="kindeditor"
      v-model="localValue"
      name="content"
      v-loaded-callback="initKindeditor"
    ></textarea>
    <input @change="selectedFile" style="visibility: hidden;height:0;" type="file" name id="inputFile" />
  </div>
</template>

<script>
import 'kindeditor/themes/default/default.css'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/lang/zh-CN.js'
export default {
  name: 'KEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: '',
      editor: null
    }
  },
  watch: {
    localValue: 'updateValue',
    value: 'setDefault'
  },
  created() {
    this.setDefault()
  },
  mounted() {
    // 添加点击图片回调函数
    this.editor.clickToolbar('image', () => {
      // 禁用自带的图片弹窗
      this.editor.hideDialog()
      // 打开文件
      this.handleOpenFile()
    })
  },
  methods: {
    // 打开文件
    handleOpenFile() {
      const input = document.getElementById('inputFile')
      // 解决同一个文件不能监听的问题
      input.addEventListener(
        'click',
        function() {
          this.value = ''
        },
        false
      )
      // 点击input
      input.click()
    },
    // 选择好文件
    selectedFile($event) {
      const file = $event.target.files[0]
      // console.log(file)

      this.$emit('uploadImg', file)
      // 把图片上传到后端服务器 拿到url  uploadImage 是自己后端上传图片的接口
      // 调用appendHtml方法把图片追加到富文本

      // const url= await  uploadImage (file)
      //   this.editor.appendHtml(
      //           `<img style="max-width:100%;" src="https://${data.Location}">`
      //         );
    },
    initKindeditor() {
      var _this = this
      // 默认参数
      var options = {
        uploadJson: 'upload/image',
        width: '100%',
        afterChange() {
          _this.localValue = this.html()
        }
      }
      // 调用外部参数
      if (_this.options) {
        for (var i in _this.options) {
          options[i] = _this.options[i]
        }
      }
      this.editor = window.KindEditor.create(_this.$refs.kindeditor, options)
    },
    // 设置初始值
    setDefault(val) {
      console.log(val)
      this.localValue = this.value
    },
    // 修改父件的值
    updateValue() {
      this.$emit('input', this.localValue)
    }
  }
}
</script>
