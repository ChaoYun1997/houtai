<template>
  <div>
    <a-card :bordered="false">
      <div class="cate-sort">
        <ul ref="list" class="list">
          <li v-for="(item, index) in category" :key="index">
            <b>{{ item.label }}</b>
            <a-icon type="menu"></a-icon>
          </li>
        </ul>
      </div>
      <p class="flex-right">
        <a-button type="primary" style="margin-top: 20px" @click="handleSaveSort">保存</a-button>
      </p>
    </a-card>
  </div>
</template>

<script>
import sortableJS from 'sortablejs'
import { getArticleCate, updateCateSort } from '@/api/category'
export default {
  name: 'ArticleCateSort',
  data() {
    return {
      cateParam: 'all',
      category: [],
      queryParam: {
        pageSize: 20,
        pageIndex: 1
      },
      products: [],
      current: 1,
      total: 0
    }
  },
  created() {
    this.loadCateData()
  },
  mounted() {
    this.initSortable()
  },
  methods: {
    initSortable() {
      const that = this
      // eslint-disable-next-line no-unused-vars
      const sortable = sortableJS.create(this.$refs.list, {
        sort: true,
        animation: 300,
        onEnd: function(evt) {
          // 拖拽结束发生该事件
          that.products.splice(evt.newIndex, 0, that.products.splice(evt.oldIndex, 1)[0])
          var newArray = that.products.slice(0)
          that.products = []
          that.$nextTick(function() {
            this.products = newArray.map((item, index) => {
              return Object.assign(item, { sort: index })
            })
            console.log(that.products)
          })
        }
      })
    },
    loadCateData() {
      const params = {
        pageIndex: 1,
        pageSize: 50
      }
      getArticleCate(params).then(res => {
        res.data.datas.forEach((item, index) => {
          this.category.push({
            label: item.catName,
            sort: index,
            id: item.id
          })
        })
      })
    },
    handleSaveSort() {
      const params = this.category.map(item => {
        return {
          id: item.id,
          sort: item.sort
        }
      })
      updateCateSort(params)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    }
  }
}
</script>

<style scoped lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';
.content-right {
  display: flex;
  justify-content: flex-end;
}
.cate-sort {
  width: 320px;
  .list {
    padding: 0;
    li {
      display: flex;
      justify-content: space-between;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      padding: 5px;
      align-items: center;
      border-radius: 3px;
      i{
        cursor: move;
      }
    }
  }
}
</style>
