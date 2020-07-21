<template>
  <page-header-wrapper>
    <a-card>
      <div slot="title">
        <a-button type="primary" @click="handleRestore">
          恢复产品
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleRemove">
          彻底删除
        </a-button>
      </div>
    </a-card>
    <a-card>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <div class="cover" slot="shopImg" slot-scope="shopImg">
          <template v-if="!shopImg">
            <a-icon type="picture" style="font-size:32px;opacity: .3;"></a-icon>
          </template>
          <img v-else :src="/^http/.test(shopImg) ? shopImg : getImg(shopImg)" alt />
        </div>

        <span slot="shopTags" slot-scope="shopTags">
          <a-tag
            v-for="tag in shopTags"
            :key="tag"
            :color="tag === '热点产品' ? 'pink' : tag === '新产品' ? 'green' : 'orange'"
          >
            {{ tag }}
          </a-tag>
        </span>
        <div class="action" slot="action" slot-scope="text, record">
          <a-button type="link" size="small" @click="restore(record.id)">恢复产品</a-button>
          <a-button type="link" size="small" @click="remove(record.id)">彻底删除</a-button>
        </div>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import STable from '@/components/Table'
// eslint-disable-next-line no-unused-vars
import { getRecycleBin, restoreProduct, removeProduct, removeProducts } from '@/api/products'
const columns = [
  {
    title: '#',
    dataIndex: 'id'
  },
  {
    title: '产品图片',
    dataIndex: 'shopImg',
    scopedSlots: {
      customRender: 'shopImg'
    }
  },
  {
    title: '产品名称',
    dataIndex: 'shopTitle',
    sorter: true
  },
  {
    title: '型号',
    dataIndex: 'shopModel'
  },
  {
    title: '产品分类',
    dataIndex: 'catName'
  },
  {
    title: '更新时间',
    dataIndex: 'updateDate',
    sorter: true
  },
  {
    title: '产品链接',
    dataIndex: 'shopUrl'
  },
  {
    title: '标签',
    dataIndex: 'shopTags',
    scopedSlots: {
      customRender: 'shopTags'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'RecycleBin',
  components: {
    STable
  },
  data() {
    this.columns = columns
    return {
      loadData: parameter => {
        return getRecycleBin(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    // 上下架操作
    onSwitchChange(checked, id) {
      this.$confirm({
        content: checked ? '你确定要上架该产品吗？' : '你确定要下架该产品吗？',
        onOk: () => {
          this.handleBatchAction('IsShelve', checked, [id])
        }
      })
    },
    checkIsShelve(shelve) {
      return shelve
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getImg(name) {
      console.log(name)
      return process.env.VUE_APP_HOST + '/' + name
    },
    restore(id) {
      this.$confirm({
        content: '你确定要恢复该产品吗？',
        onOk: () => {
          restoreProduct([id]).then(res => {
            if (res.data === 200) this.$message.success('操作成功')
            this.$refs.table.refresh()
          })
        }
      })
    },
    remove(id) {
      this.$confirm({
        content: '你确定要彻底删除该产品吗？',
        onOk: () => {
          removeProduct({ id: id })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.$refs.table.refresh(true)
              } else {
                throw res
              }
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        }
      })
    },
    checkSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择至少一款产品')
        return false
      }
      return true
    },
    handleRemove() {
      if (!this.checkSelected()) return
      console.log(this.selectedRowKeys)
      // TODO 接入批量删除接口
      this.$confirm({
        content: '你确定要删除这些产品吗？',
        onOk: () => {
          removeProducts(this.selectedRowKeys)
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.$refs.table.refresh()
              } else {
                throw res
              }
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        }
      })
    },
    handleRestore() {
      if (!this.checkSelected()) return
      console.log(this.selectedRowKeys)
      this.$confirm({
        content: '你确定要恢复这些产品吗？',
        onOk: () => {
          restoreProduct(this.selectedRowKeys).then(res => {
            if (res.data.msg === 'success') this.$message.success('操作成功')
            this.$refs.table.refresh()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.cover {
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}
</style>
