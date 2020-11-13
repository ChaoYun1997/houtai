<template>
  <div>
    <a-card :bordered="false">
      <div slot="title">
        <a-button type="primary" icon="plus" @click="$router.push('/products/add-category')">
          新增产品分类
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" icon="plus" @click="visibleUploadXls = true">
          批量编辑TKD
        </a-button>
      </div>
      <div slot="action" class="batch-content">
        <a-button :disabled="selectedRowKeys.length === 0">设置指向页面</a-button>
      </div>
    </a-card>
    <a-card>
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="cateColumns"
        :data="loadCateData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
<!--        <div style="display:inline-block;" slot="sort" slot-scope="text, record">-->
<!--          &lt;!&ndash;          TODO id改为sort &ndash;&gt;-->
<!--          <a-input v-model="record.id" style="width: 60px"></a-input>-->
<!--        </div>-->
        <div slot="catname" slot-scope="text, record">
          <a @click="$router.push({ path: '/products/product-list', query: { catId: record.id } })">
            {{ text }}
          </a>
        </div>
        <span slot="catPid" slot-scope="text">
          {{ text ? '子类目' : '一级类目'}}
        </span>
        <div class="action" slot="action" slot-scope="text, record">
          <span class="link-btn " @click="addSub(record.id)">添加子分类</span>
          <span class="link-btn  left-split" @click="edit(record.id)">编辑</span>
          <span class="link-btn left-split" @click="preview(record.id)">预览</span>
          <span class="link-btn del left-split" @click="del(record.id)">删除</span>
        </div>
      </s-table>
    </a-card>
    <a-modal v-model="visibleUploadXls" title="导入产品">
      <p>
        <b>产品信息</b><br/>
        1. 下载模板文件，根据模板中的批注，填写产品信息。
        <a @click="downloadXls" target="_blank">下载文件</a>
        <br/>
        2. 上传填写后的数据文件：
        <a-upload
          :file-list="fileList"
          :multiple="false"
          accept=".xls,.xlsx"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button>
            <a-icon type="upload"/>
            选择文件
          </a-button>
        </a-upload>
      </p>
      <br/>
      <p>
        <b>导入说明</b><br/>
        1. 表格首行为字段名，不能删除、修改。<br/>

        2. 表头字段标了“*”的为必填字段，请务必填写。<br/>

        3. 一次最多提交1000条产品信息，且文件大小不能超过10M。<br/>

        4. 仅支持.xls、.xlsx格式。
      </p>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleUpload" :disabled="fileList.length === 0">上 传</a-button>
        <a-button @click="visibleUploadXls = false">取 消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import STable from '@/components/Table'
  // import { getProductCategory } from '@/api/products'
  import { getProductCate, delCate } from '@/api/category'
  import * as XLSX from 'xlsx'
  import { mapState } from 'vuex'

  const cateColumns = [
    // {
    //   title: '序号',
    //   dataIndex: 'sort',
    //   scopedSlots: {
    //     customRender: 'sort'
    //   },
    //   width: '150px',
    //   align: 'center'
    // },
    {
      title: '分类名称',
      dataIndex: 'catName',
      scopedSlots: {
        customRender: 'catname'
      }
    },
    {
      title: '类目属性',
      dataIndex: 'catPid',
      scopedSlots: {
        customRender: 'catPid'
      }
    },
    {
      title: '产品数',
      dataIndex: 'itemCount'
    },
    {
      title: '分类URL',
      dataIndex: 'catUrl'
    },
    {
      title: '分类指向页面',
      dataIndex: 'catWebUrl'
    },
    {
      title: '详情指向页面',
      dataIndex: 'catDescUrl'
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
    name: 'Category',
    components: {
      STable
    },
    data() {
      this.cateColumns = cateColumns
      return {
        visibleUploadXls: false,
        fileList: [],
        selectedRowKeys: [],
        category: [],
        queryParam: {
          pageIndex: 1,
          pageSize: 10
        },
        pagination: {
          size: 'small'
        }
      }
    },
    computed: {
      ...mapState({
        website: (state) => {
          return /^http/.test(state.user.website)
            ? state.user.website
            : process.env.VUE_APP_PROTOCAL_HEAD + state.user.website
        }
      })
    },
    methods: {
      loadCateData(parameter) {
        return this.fetchCate(parameter)
      },
      fetchCate(parameter) {
        return new Promise(async (resolve, reject) => {
          try {
            const cates = await getProductCate(Object.assign(parameter, this.queryParam))

            const data = cates.data.datas.map(item => {
              item.catPid = !item.catPid ? 0 : item.catPid
              return item
            })
            const result = {}
            result.data = {}
            result.data.datas = this.treeTransfer(data, 0)
            result.data.pageIndex = cates.data.pageIndex
            result.data.pageSize = cates.data.pageSize
            result.data.totalCount = cates.data.totalCount
            console.log(result)
            resolve(result)
          } catch (e) {
            reject(e)
          }
        })
      },
      treeTransfer(data, id) {
        function tree(pid) {
          const arr = []
          data
            .filter(item => {
              return item.catPid === pid
            })
            .forEach(item => {
              const child = tree(item.id)
              if (child.length) {
                item.children = child
              }
              arr.push(item)
            })
          return arr
        }

        return tree(id)
      },
      downloadXls() {
        if (!this.category.length) {
          this.$message.error('没有分类信息')
          return false
        }
        var data = this.category.map(item => {
          console.log(item)
          return {
            ID: item.id,
            产品分类名称: item.catName,
            '页面标题/Title': item.seoTitle,
            '页面关键词/Keywords': item.seoKeyWord,
            '页面描述/Description': item.seoDescription
          }
        })

        /* make the worksheet */
        var ws = XLSX.utils.json_to_sheet(data)

        /* add to workbook */
        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'sheet1')

        /* generate an XLSX file */
        XLSX.writeFile(wb, 'categoryTemplate.xlsx')
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      beforeUpload(file, fileList) {
        if (this.fileList.length === 1) {
          this.$message.warning('只能选择一个excle文件，如需修改请先删除下面的文件后重新选择文件')
          return false
        }
        this.fileList = fileList
        return false
      },
      handleUpload() {
        const files = this.fileList
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            let data = []
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              // esline-disable-next-line
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                // break; // 如果只取第一张表，就取消注释这行
              }
            }
            // 最终获取到并且格式化后的 json 数据
            const uploadData = data.map((item, index) => {
              return {
                catName: item['产品分类名称'],
                catTitle: item['页面标题/Title'],
                catKeyword: item['页面关键词/Keywords'],
                catDesc: item['页面描述/Description']
              }
            })
            // TODO 批量上传接入
            console.log(uploadData)
            this.$message.success('上传成功！')
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件类型不正确！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])
      },
      onSelectChange() {
      },
      edit(id) {
        this.$router.push(`/products/add-category/${id}`)
      },
      addSub(id) {
        this.$router.push({ path: '/products/add-category', query: { parent: id } })
      },
      del(id) {
        this.$confirm({
          content: '你确定要删除该分类吗？',
          centered: true,
          onOk: () => {
            const params = {
              id: id
            }
            delCate(params)
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('操作成功')
                  this.$refs.table.refresh(true)
                } else {
                  throw res
                }
              })
              .catch(err => {
                this.$message.error(err.msg || '操作失败')
              })
          }
        })
      },
      preview(id) {
        const link = this.website + '/Products/1/100/' + id
        window.open(link, '_blank')
      }
    }
  }
</script>

<style scoped lang="less">
  .action {
    button {
      margin-right: 5px;
    }
  }
</style>
