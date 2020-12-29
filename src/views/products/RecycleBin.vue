<template>
  <div>
    <a-card :bordered="false" class="margin-bottom">
      <h3 slot="title">产品查询</h3>
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="请选择产品类目" style="width: 260px;" v-model="cateParam">
            <a-select-option value="all">请选择产品分类</a-select-option>
            <template v-for="(item, index) in category">
              <a-select-option :value="item.id" :key="index">{{ item.label }}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input style="width: 240px" placeholder="请输入关键词" v-model="queryParam.keyWords"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="list" >
      <h3 slot="title">产品列表</h3>
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
          <img v-else :src="/^http/.test(shopImg) ? shopImg : getImg(shopImg)" alt/>
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
          <span class="link-btn right-split" @click="restore(record.id)">恢复</span>
          <span class="link-btn" style="color: red" @click="remove(record.id)">彻底删除</span>
        </div>
      </s-table>
      <div class="table-operator list-footer">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="handleSelectedAll">全选</a-checkbox>
        <a-button :style="{ marginLeft: '8px' }" type="primary" @click="handleRestore">
          恢复产品
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleRemove" type="danger">
          彻底删除
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
  import STable from '@/components/Table'
  // eslint-disable-next-line no-unused-vars
  import { getRecycleBin, restoreProduct, removeProduct, removeProducts } from '@/api/products'
  import { getProductCate } from '../../api/category'

  const columns = [
    {
      title: '产品图片',
      dataIndex: 'shopImg',
      scopedSlots: {
        customRender: 'shopImg'
      },
      align: 'center'
    },
    {
      title: '产品名称',
      dataIndex: 'shopTitle',
      sorter: true,
      align: 'center'
    },
    {
      title: '产品型号',
      dataIndex: 'shopModel',
      align: 'center'
    },
    {
      title: '所属类目',
      dataIndex: 'catName',
      align: 'center'
    },
    {
      title: '删除时间',
      dataIndex: 'updateDate',
      sorter: true,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: {
        customRender: 'action'
      },
      align: 'center'
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
        checkAll: false,
        indeterminate: false,
        loadData: parameter => {
          return getRecycleBin(Object.assign(parameter, this.queryParam))
        },
        cateParam: 'all',
        category: [],
        selectedRowKeys: [],
        selectedRows: [],
        queryParam: {}
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
    created() {
      this.loadCateData()
    },
    methods: {
      handleSelectedAll(e) {
        const items = this.$refs.table.localDataSource
        this.selectedRows = e.target.checked ? items : []
        this.$refs.table.selectedRows = e.target.checked ? items : []
        this.selectedRowKeys = e.target.checked ? items.map(item => item.id) : []
        this.$refs.table.selectedRowKeys = e.target.checked ? items.map(item => item.id) : []
        this.indeterminate = false
        this.checkAll = e.target.checked
      },
      // 查询
      handleQuery() {
        if (this.cateParam !== 'all') {
          this.queryParam.catId = this.cateParam
        }
        this.$refs.table.refresh(true)
      },
      // 重置查询
      handleReset() {
        this.queryParam = {}
        this.cateParam = 'all'
        this.$refs.table.refresh(true)
      },
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
      getCateName(cate) {
        if (!cate.length) return false
        const name = []
        cate.forEach(item => {
          const target = this.category.find(i => i.id === item)
          if (!target) return
          name.push(target.label)
        })
        return name
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        const items = this.$refs.table.localDataSource
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        this.checkAll = items.length === this.selectedRowKeys.length
        this.indeterminate = !!this.selectedRowKeys.length && this.selectedRowKeys.length < items.length
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
        this.$confirm({
          content: '你确定要删除这些产品吗？',
          onOk: () => {
            removeProducts(this.selectedRowKeys)
              .then(res => {
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

  .list {
    position: relative;

    .list-footer {
      position: absolute;
      margin-left: 25px;
      bottom: 20px;
      left: 20px;
      z-index: 10;
    }
  }
</style>
