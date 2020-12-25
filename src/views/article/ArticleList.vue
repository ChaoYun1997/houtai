<template>
  <div>
    <a-card :bordered="false" class="margin-bottom">
      <h3 slot="title">文章查询</h3>
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="文章分类" v-model="cateParam" style="width: 160px; margin-right:8px">
            <a-select-option value="all">全部文章分类</a-select-option>
            <template v-for="(item, index) in category">
              <a-select-option :value="item.id" :key="index">{{ item.label }}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="所有状态" v-model="statusParam" style="width: 160px;margin-right:10px;">
            <a-select-option value="all">全部状态</a-select-option>
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">草稿</a-select-option>
            <a-select-option value="2">定时发布</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="queryParam.keyWords"
            placeholder="请输入文章标题"
            style="width: 160px; margin-right:10px;"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <h3 slot="title">文章列表</h3>
      <!--      <div class="table-operator">-->
      <!--        <a-button type="primary" @click="$router.push('/articles/add-article')">新增</a-button>-->
      <!--        <a-button @click="handleDel" type="danger">删除</a-button>-->
      <!--      </div>-->
      <div class="list">
        <s-table
          ref="table"
          size="default"
          :rowKey="record => record.id"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :getSortField="returnSortFile"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <!--        <a-button slot="title" slot-scope="text" type="link" size="small">{{ text }}</a-button>-->
          <div class="cover" slot="articleImg" slot-scope="text">
            <template v-if="!text">
              <a-icon type="picture" style="font-size:32px;opacity: .3;"></a-icon>
            </template>
            <img v-else :src="/^http/.test(text) ? text : getImg(text)" alt />
          </div>
          <div slot="cate" slot-scope="text">
            {{ getCateName(text) }}
          </div>
          <a-checkbox
            slot="isTop"
            slot-scope="text, record"
            :default-checked="text"
            @change="handleChecked(record.id)"
          ></a-checkbox>
          <div slot="sort" slot-scope="text, record">
            <a-input type="number" v-model="record.sort" size="small" style="width: 60px;text-align: center"></a-input>
          </div>
          <span slot="status" slot-scope="text">{{ text === 0 ? '正常' : text === 1 ? '草稿' : '定时发布' }}</span>
          <span slot="author" slot-scope="text">{{ text || '本站编辑' }}</span>
          <div class="action" slot="action" slot-scope="text, record">
            <span class="link-btn right-split" @click="edit(record.id)">编辑</span>
            <span class="link-btn right-split" @click="handleShare(record)">分享</span>
            <a-popconfirm title="你确定要删除该文章吗?" @confirm="del(record.id)">
              <span class="link-btn right-split red-text">删除</span>
            </a-popconfirm>
            <span class="link-btn" @click="preview(record.id)">预览</span>
          </div>
        </s-table>
        <div class="table-operator list-footer">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="handleSelectedAll">全选</a-checkbox>
          <a-button type="primary" @click="$router.push('/articles/add-article')">新增</a-button>
          <a-button type="primary" @click="handleSort">排序</a-button>
          <a-button @click="handleDel" type="danger">删除</a-button>
          <!--          <a-button @click="handleMoveTo">移动到</a-button>-->
        </div>
      </div>
    </a-card>

    <a-modal v-model="visibleShare" title="分享">
      <a-row :gutter="[10, 20]">
        <a-col :span="4">产品名称</a-col>
        <a-col :span="20">{{ share.name }}</a-col>
        <a-col :span="4">产品链接</a-col>
        <a-col :span="20">{{ share.link }}</a-col>
        <a-col :span="4">产品二维码</a-col>
        <a-col :span="20">
          <img :src="share.linkBase64" alt />
        </a-col>
        <a-col :span="4">分享到</a-col>
        <a-col :span="20">
          <share-this :shareThisEmbedUrl="shareUrl" :url="share.link"></share-this>
        </a-col>
      </a-row>
      <div slot="footer" class="model-footer">
        <a-button @click="hideShare">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import STable from '@/components/Table'
import { getArticles, delArticle } from '@/api/article'
import { getArticleCate } from '@/api/category'
import { mapState } from 'vuex'
import ShareThis from '@/components/ShareThis'
import qrcode from 'qrcode'
import { delArticles, updateArticleSort } from '../../api/article'

const columns = [
  {
    title: '排序',
    dataIndex: 'sort',
    scopedSlots: {
      customRender: 'sort'
    },
    align: 'center'
  },
  {
    title: '图片展示',
    dataIndex: 'articleImg',
    scopedSlots: {
      customRender: 'image'
    },
    align: 'center'
  },
  {
    title: '文章名称',
    dataIndex: 'articleTitle',
    scopedSlots: {
      customRender: 'title'
    },
    sorter: true,
    align: 'center'
  },
  {
    title: '所属类目',
    dataIndex: 'catId',
    scopedSlots: {
      customRender: 'cate'
    },
    sorter: true,
    align: 'center'
  },
  {
    title: '发布时间',
    dataIndex: 'releaseDate',
    sorter: true,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status'
    },
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
  name: 'List',
  components: {
    STable,
    ShareThis
  },
  data() {
    this.columns = columns
    return {
      shareUrl: process.env.VUE_APP_SHARE_THIS,
      visibleShare: false,
      share: {
        name: '',
        link: '',
        linkBase64: ''
      },
      queryParam: {},
      loadData: parameter => {
        return getArticles(Object.assign(parameter, this.queryParam))
      },
      category: [],
      selectedRowKeys: [],
      selectedRows: [],
      checkAll: false,
      indeterminate: false,
      cateParam: 'all',
      statusParam: 'all'
    }
  },
  computed: {
    ...mapState({
      website: state => {
        return /^http/.test(state.user.website)
          ? state.user.website
          : process.env.VUE_APP_PROTOCAL_HEAD + state.user.website
      }
    }),
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

    getCateName(cate) {
      if (!cate) return ''
      const name = this.category.find(i => i.id === cate)
      if (!name) return ''
      return name.label
    },
    getImg(name) {
      return name ? process.env.VUE_APP_HOST + '/' + name : ''
    },
    handleSelectedAll(e) {
      const items = this.$refs.table.localDataSource
      this.selectedRows = e.target.checked ? items : []
      this.$refs.table.selectedRows = e.target.checked ? items : []
      this.selectedRowKeys = e.target.checked ? items.map(item => item.id) : []
      this.$refs.table.selectedRowKeys = e.target.checked ? items.map(item => item.id) : []
      this.indeterminate = false
      this.checkAll = e.target.checked
    },
    loadCateData() {
      const params = {
        pageIndex: 1,
        pageSize: 50
      }
      getArticleCate(params).then(res => {
        res.data.datas.forEach(item => {
          console.log(item)
          this.category.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
    },
    // 表格字段排序
    returnSortFile(columnKey) {
      const sortObj = {
        articleTitle: 1,
        isTop: 2,
        catId: 3,
        status: 4,
        releaseDate: 5,
        updateDate: 6
      }
      return sortObj[columnKey]
    },
    // 编辑文章
    edit(id) {
      console.log(id)
      this.$router.push('/articles/add-article/' + id)
    },
    // 删除文章
    del(id) {
      delArticle({ id: id })
        .then(res => {
          if (res.code === 200) this.$message.success('操作成功')
          this.$refs.table.refresh(true)
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    // 预览文章
    preview(id) {
      const link = this.website + '/NewsDetails/' + id
      window.open(link, '_blank')
    },
    // 分享文章
    async handleShare(result) {
      this.share.name = result.articleTitle
      this.share.link = this.website + '/NewsDetails/' + result.id
      this.share.linkBase64 = await this.getLinkQrcode(this.share.link)
      this.visibleShare = true
    },
    hideShare() {
      this.share.name = ''
      this.share.link = ''
      this.share.linkBase64 = ''
      this.visibleShare = false
    },
    getLinkQrcode(link) {
      return new Promise((resolve, reject) => {
        qrcode.toDataURL(link, (err, url) => {
          if (err) {
            reject(err)
            return false
          }
          resolve(url)
        })
      })
    },
    // 修改文章置顶
    handleChecked(id) {
      console.log(id)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      const items = this.$refs.table.localDataSource
      this.checkAll = items.length === this.selectedRowKeys.length
      this.indeterminate = !!this.selectedRowKeys.length && this.selectedRowKeys.length < items.length
    },
    // 查询
    handleQuery() {
      if (this.statusParam !== 'all') {
        this.queryParam.status = Number(this.statusParam)
      } else {
        delete this.queryParam.status
      }
      if (this.cateParam !== 'all') {
        this.queryParam.catId = Number(this.cateParam)
      }
      console.log(this.queryParam)
      this.$refs.table.refresh(true)
    },
    // 重置查询
    handleReset() {
      this.queryParam = {}
      this.cateParam = 'all'
      this.statusParam = 'all'
      this.$refs.table.refresh(true)
    },
    // 切换查询状态
    handleStatusSelect(value) {
      this.queryParam.isShelve = parseInt(value) === 1
    },
    // 选择分类
    handleCateSelected(value) {
      console.log(value)
      this.queryParam.catId = value
    },
    handleSort() {
      const items = this.$refs.table.localDataSource
      const params = items.map(item => {
        return {
          id: item.id,
          sort: item.sort
        }
      })
      updateArticleSort(params)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
          } else throw res
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleDel() {
      if (!this.checkSelected()) return
      this.$confirm({
        content: '你确定要删除这些文章吗？',
        onOk: () => {
          const params = this.selectedRowKeys
          delArticles(params)
            .then(res => {
              if (res.code === 200) this.$message.success('操作成功')
              this.$refs.table.refresh()
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        }
      })
    },
    checkSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择至少一篇文章')
        return false
      }
      return true
    },
    handleMoveTo() {
      if (!this.checkSelected()) return
      console.log('move to')
    }
  }
}
</script>

<style scoped lang="less">
.list {
  position: relative;

  .list-footer {
    position: absolute;
    margin-left: 25px;
    bottom: 0px;
    left: 0px;
    z-index: 10;
  }
}
</style>
