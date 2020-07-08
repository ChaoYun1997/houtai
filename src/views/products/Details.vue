<template>
  <div>
    <ul ref="list" class="list">
      <li v-for="item in myArray" :key="item.id">{{ item.name }}</li>

      <a-upload
        name="avatar"
        class="img-uploader"
        :show-upload-list="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            Upload
          </div>
        </div>
      </a-upload>
    </ul>
  </div>
</template>

<script>
import sortableJS from 'sortablejs'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'Details',
  data() {
    return {
      loading: false,
      imageUrl: '',
      enabled: true,
      myArray: [
        { name: 'John', id: 0 },
        { name: 'Peter', id: 1 },
        { name: 'Steven', id: 2 },
        { name: 'p', id: 4 },
        { name: 'd', id: 5 },
        { name: 'w', id: 6 },
        { name: 'q', id: 7 },
        { name: 'c', id: 8 },
        { name: 'v', id: 9 },
        { name: 'g', id: 10 },
        { name: 'y', id: 11 },
        { name: 'v', id: 12 },
        { name: 'b', id: 13 },
        { name: 'n', id: 14 },
        { name: 'i', id: 15 }
      ],
      dragging: false
    }
  },
  mounted() {
    const that = this
    // eslint-disable-next-line no-unused-vars
    const sortable = sortableJS.create(this.$refs.list, {
      sort: true,
      animation: 300,
      onEnd: function(evt) {
        // 拖拽结束发生该事件
        that.myArray.splice(evt.newIndex, 0, that.myArray.splice(evt.oldIndex, 1)[0])
        var newArray = that.myArray.slice(0)
        that.myArray = []
        that.$nextTick(function() {
          that.myArray = newArray
          console.log(that.myArray)
        })
      }
    })
  },
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    checkMove: function(e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    }
  }
}
</script>

<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
ul {
  display: flex;
  justify-content: flex-start;
  height: 400px;
  flex-wrap: wrap;
}
li {
  display: block;
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  margin-right: 10px;
}
.img-uploader {
  width: 100px;
  height: 100px;
}
</style>
