<template>
  <div>
    <a-card :bordered="false">
      <a-alert type="info" class="info">
        <template slot="message">
          您可以通过两种方法进行产品排序
          <br />
          1.手动拖拽：按住鼠标左键直接拖动产品进行排序；
          <br />
          2.设置序号：修改图片下方的序号值，回车或者点击输入框外确定，即可调整产品顺序：序号越小，展示越靠前。
        </template>
      </a-alert>
      <div class="table-page-search-wrapper">
        <a-row>
          <a-col :span="20">
            <a-select placeholder="请选择" v-model="cateParam" style="width: 500px" @change="handleQueryCate">
              <a-select-option value="all">全部</a-select-option>
              <template v-for="(item, index) in category">
                <a-select-option :value="item.id" :key="index">{{ item.label }}</a-select-option>
              </template>
            </a-select>
            <a-button @click="recoverDefaultSort" type="primary" style="margin-left:10px;">恢复默认排序</a-button>
          </a-col>
          <a-col :span="4" class="content-right">
            <a-select v-model="queryParam.pageSize" style="width: 120px" @change="handleQueryPageSize">
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="30">30</a-select-option>
              <a-select-option :value="50">50</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
      <ul class="sort-box" ref="list">
        <template v-for="(item, index) in products">
          <li :key="item.id">
            <template v-if="!item.shopImg">
              <a-icon class="img-box" type="picture" style="font-size:32px;opacity: .3;"></a-icon>
            </template>
            <img v-else :src="/^http/.test(item.shopImg) ? item.shopImg : getImg(item.shopImg)" alt />
            <p>
              {{ item.shopTitle }}
            </p>
            <a-input-number :value="item.sort" :min="0" @change="value => handleNumSort(index, value)"></a-input-number>
          </li>
        </template>
      </ul>
      <br />
      <div class="flex-between">
        <span>总共 {{ total }} 条记录</span>
        <a-pagination
          v-model="current"
          :pageSize="queryParam.pageSize"
          :total="total"
          show-less-items
          @change="handlePaginationChange"
        />
      </div>
      <p class="flex-right">
        <a-button type="primary" style="margin-top: 20px" @click="handleSaveSort">保存</a-button>
      </p>
    </a-card>
  </div>
</template>

<script>
import sortableJS from 'sortablejs'
import { getSortProducts, updateSort, recoverSort } from '../../api/products'
import { getProductCate } from '@/api/category'
export default {
  name: 'ProductSort',
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
    this.loadProducts()
    this.loadCateData()
  },
  mounted() {
    this.initSortable()
  },
  methods: {
    loadCateData() {
      const params = {
        pageIndex: 1,
        pageSize: 50
      }
      getProductCate(params).then(res => {
        res.data.datas.forEach(item => {
          this.category.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
    },
    getImg(name) {
      return name ? process.env.VUE_APP_HOST + '/' + name : ''
    },
    loadProducts() {
      getSortProducts(this.queryParam).then(res => {
        if (res.code === 200) {
          this.total = res.data.totalCount
          this.products = res.data.datas.map((item, index) => {
            return Object.assign(item, { sort: index })
          })
          console.log(this.products)
        }
      })
    },
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
    handlePaginationChange(page, pageSize) {
      this.queryParam.pageSize = pageSize
      this.queryParam.pageIndex = page
      this.loadProducts()
    },
    handleSaveSort() {
      const params = this.products.map(item => {
        return {
          id: item.id,
          sort: item.sort
        }
      })
      updateSort(params)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleQueryPageSize(value) {
      this.queryParam.pageIndex = 1
      this.queryParam.pageSize = value
      this.loadProducts()
    },
    handleQueryCate(value) {
      this.queryParam.pageIndex = 1
      this.queryParam.catId = value === 'all' ? '' : value
      this.loadProducts()
    },
    recoverDefaultSort() {
      this.$confirm({
        content: '你确认要恢复产品的默认排序吗?',
        onOk: () => {
          recoverSort()
            .then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.loadProducts()
              } else throw res
            })
            .catch(err => {
              this.$message.error(err.msg || '操作失败')
            })
        }
      })
    },
    handleNumSort(current, index) {
      const temp = this.products[current]
      const len = this.products.length
      this.products.splice(current, 1)
      if (index === 0) {
        this.products.unshift(temp)
      } else if (index >= len) {
        this.products.push(temp)
      } else {
        this.products.splice(index, 0, temp)
      }
      this.products = this.products.map((item, index) => {
        return Object.assign(item, { sort: index })
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
.sort-box {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -5px;
  padding: 0;
  li {
    display: flex;
    justify-content: center;
    align-content: space-between;
    flex-wrap: wrap;
    width: 120px;
    padding: 6px;
    margin: 5px;
    font-size: 12px;
    text-align: center;
    border: 1px solid @border-color-base;
    p {
      width: 100%;
      padding: 5px 0;
      margin-bottom: 5px;
    }
    img,
    .img-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 108px;
      height: 108px;
    }
  }
}
.table-page-search-wrapper {
  padding-bottom: 20px;
}
.info {
  font-size: 12px;
  margin-bottom: 20px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.flex-right {
  display: flex;
  justify-content: flex-end;
}
</style>
