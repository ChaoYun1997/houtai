<template>
  <div>
    <ul ref="list" class="list">
      <li v-for="item in myArray" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
import sortableJS from 'sortablejs'
export default {
  name: 'Details',
  data() {
    return {
      enabled: true,
      myArray: [
        { name: 'John', id: 0 },
        { name: 'Peter', id: 1 },
        { name: 'Steven', id: 2 }
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
</style>
