<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-card :bordered="false">
        <div slot="title">
          <a-button type="primary" icon="plus" @click="$router.push('/products/add-product')">
            新增产品
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" icon="plus" @click="visibleUploadXls = true">
            批量导入
          </a-button>
        </div>
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="搜索" :lable-col="{ span: 24, offset: 12 }">
                <a-input v-model="queryParam.keyword"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="上架状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">上架</a-select-option>
                  <a-select-option value="2">下架</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="产品分类">
                <a-select v-model="queryParam.type" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">abc</a-select-option>
                  <a-select-option value="2">efg</a-select-option>
                  <a-select-option value="3">hjk</a-select-option>
                  <a-select-option value="4">zxv</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="标签">
                <a-checkbox-group v-model="queryParam.tag" :options="tagOptions"> </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="handleQuery">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
        <div slot="actions" class="batch-action">
          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="上架">上架</a-menu-item>
              <a-menu-item key="下架">下架</a-menu-item>
              <a-menu-divider />
              <a-menu-item key="设为最新">设为最新</a-menu-item>
              <a-menu-item key="取消最新">取消最新</a-menu-item>
              <a-menu-item key="设为推荐">设为推荐</a-menu-item>
              <a-menu-item key="取消推荐">取消推荐</a-menu-item>
              <a-menu-item key="设为热销">设为热销</a-menu-item>
              <a-menu-item key="取消热销">取消热销</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量设置 <a-icon type="down" /> </a-button>
          </a-dropdown>
          <!--          <a-select-->
          <!--            placeholder="批量操作"-->
          <!--            style="width: 120px"-->
          <!--            @change="handleChange"-->
          <!--          >-->
          <!--            <a-select-option value="上架">-->
          <!--              上架-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="下架">-->
          <!--              下架-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="设为最新">-->
          <!--              设为最新-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="取消最新">-->
          <!--              取消最新-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="设为推荐">-->
          <!--              设为推荐-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="取消推荐">-->
          <!--              取消推荐-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="设为热销">-->
          <!--              设为热销-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="取消热销">-->
          <!--              取消热销-->
          <!--            </a-select-option>-->
          <!--          </a-select>-->
          <a-button @click="setCategory">
            移动到分类
          </a-button>
          <a-button @click="setCategory">
            添加到分类
          </a-button>
          <a-button @click="handleDel">
            删除
          </a-button>
          <a-button @click="handleDownload">
            下载产品链接二维码
          </a-button>
        </div>
      </a-card>
    </div>
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <div class="cover" slot="cover" slot-scope="img">
          <img :src="img" alt="" />
        </div>
        <div slot="status" slot-scope="status">
          <a-switch :checked="status === 0" :loading="switchLoading" @change="onSwitchChange" />
        </div>

        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === '热点产品' ? 'pink' : tag === '新产品' ? 'green' : 'orange'"
          >
            {{ tag }}
          </a-tag>
        </span>
        <div class="action" slot="action" slot-scope="text, record">
          <a-button type="primary" icon="edit" size="small" @click="edit(record.id)" />
          <a-button type="primary" icon="copy" size="small" @click="copy(id)" />
          <a-button type="danger" icon="delete" size="small" :loading="delLoading" @click="del(id)" />
          <a-button icon="share-alt" size="small" @click="share(id)" />
          <a-button icon="eye" size="small" @click="preview(record.link)" />
        </div>
      </s-table>
    </a-card>
    <a-modal v-model="visibleUploadXls" title="导入产品">
      <p>
        <b>产品信息</b><br />
        1. 下载模板文件，根据模板中的批注，填写产品信息。
        <a @click="downloadXls" target="_blank">下载文件</a>
        <br />
        2. 上传填写后的数据文件：
        <a-upload
          :file-list="fileList"
          :multiple="false"
          accept=".xls,.xlsx"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </p>
      <br />
      <p>
        <b>导入说明</b><br />
        1. 表格首行为字段名，不能删除、修改。<br />

        2. 表头字段标了“*”的为必填字段，请务必填写。<br />

        3. 一次最多提交1000条产品信息，且文件大小不能超过10M。<br />

        4. 仅支持.xls、.xlsx格式。
      </p>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleUpload" :disabled="fileList.length === 0">上 传</a-button>
        <a-button @click="visibleUploadXls = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="showCategory" title="请选择产品分类">
      <a-checkbox-group v-model="categoryCheckList" :options="category"></a-checkbox-group>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleSetCategory" :disabled="categoryCheckList.length === 0">确 定</a-button>
        <a-button @click="showCategory = false">取 消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import STable from '@/components/Table'
import { getProducts, getProductCategory, setCategory, delProduct, sellAction } from '@/api/products'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import qrcode from 'qrcode'

const tagOptions = ['热点产品', '新产品', '推荐产品']
const columns = [
  {
    title: '#',
    dataIndex: 'id'
  },
  {
    title: '产品图片',
    dataIndex: 'img',
    scopedSlots: {
      customRender: 'cover'
    }
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    sorter: true
  },
  {
    title: '型号',
    dataIndex: 'type'
  },
  {
    title: '产品分类',
    dataIndex: 'category'
  },
  {
    title: '更新时间',
    dataIndex: 'update',
    sorter: true
  },
  {
    title: '上架',
    dataIndex: 'status',
    sorter: true,
    scopedSlots: {
      customRender: 'status'
    }
  },
  {
    title: '标签',
    dataIndex: 'tags',
    scopedSlots: {
      customRender: 'tags'
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
  name: 'List',
  components: {
    STable
  },
  data() {
    this.columns = columns
    return {
      category: [],
      categoryCheckList: [],
      showCategory: false,
      queryParam: {},
      loadData: param => {
        param = Object.assign(param, this.queryParam)
        return getProducts(param).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      tagOptions,
      value: [],
      fileList: [],
      visibleUploadXls: false,
      batchValue: null,
      delLoading: false,
      switchLoading: false
    }
  },
  created() {
    getProductCategory().then(res => {
      this.category = res.result.data
    })
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
    downloadXls() {
      const host = window.location.host
      window.open(host + '/files/productTemplate.xls')
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
              id: index,
              name: item['* 产品名称'],
              category: item['* 产品分类'],
              keyword: item['产品关键词'],
              type: item['产品型号'],
              descTitle1: item['产品描述1 - 页签标题'],
              descContent1: item['产品描述1 - 页签内容'],
              descTitle2: item['产品描述2 - 页签标题'],
              descContent2: item['产品描述2 - 页签内容'],
              descTitle3: item['产品描述3 - 页签标题'],
              descContent3: item['产品描述3 - 页签内容'],
              descTitle4: item['产品描述4 - 页签标题'],
              descContent4: item['产品描述4 - 页签内容'],
              descTitle5: item['产品描述5 - 页签标题'],
              descContent5: item['产品描述5 - 页签内容'],
              status: item['产品状态（1表示上架，0表示下架）']
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 上下架操作
    onSwitchChange(result, id) {
      this.$confirm({
        content: result ? '你确定要上架该产品吗？' : '你确定要下架该产品吗？',
        onOk: () => {
          this.handelSellAction()
        }
      })
    },
    handelSellAction(id) {
      sellAction({ id }).then(res => {
        if (res.result.data === 'success') this.$message.success('操作成功')
        this.$refs.table.refresh()
      })
    },
    // 编辑文章
    edit(result) {
      console.log(result)
      this.$router.push('/products/add-product/' + result)
    },
    // 添加相似文章
    copy(result) {
      console.log(result)
    },
    // 删除文章
    del(result) {
      console.log(result)
      this.$confirm({
        content: '你确定要删除该产品吗？',
        onOk: () => {
          this.delLoading = true
          delProduct(result).then(res => {
            if (res.result.data === 'success') this.$message.success('操作成功')
            this.delLoading = false
            this.$refs.table.refresh()
          })
        }
      })
    },
    // 分享文章
    share(result) {
      console.log(result)
    },
    // 预览文章
    preview(link) {
      window.open(link)
    },
    // 批量操作
    handleMenuClick(value) {
      if (!this.checkSelected()) return
      console.log(this.batchValue, value)
      const ids = this.selectedRows.map(item => {
        return item.id
      })
      // TODO 接入批量操作
      switch (value.key) {
        case '上架':
          this.handelSellAction(ids)
          break
      }
    },
    // 查询
    handleQuery() {
      console.log(this.queryParam)
      this.$refs.table.refresh(true)
    },
    // 重置查询
    handleReset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    checkSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择至少一款产品')
        return false
      }
      return true
    },
    // 批量设置分类弹窗
    setCategory() {
      if (!this.checkSelected()) return
      this.showCategory = true
    },
    // 批量设置分类
    handleSetCategory() {
      // TODO 接入设置分类接口
      setCategory().then(res => {
        const result = res.result
        if (result.data === 'success') {
          this.$message.success('操作成功')
          this.showCategory = false
          this.category = []
        }
      })
    },
    // 批量删除
    handleDel() {
      if (!this.checkSelected()) return
      // TODO
      this.$confirm({
        content: '你确定要删除这些产品吗？',
        onOk: () => {
          delProduct().then(res => {
            if (res.result.data === 'success') this.$message.success('操作成功')
            this.$refs.table.refresh()
          })
        }
      })
    },
    // 批量下载二维码
    handleDownload() {
      if (!this.checkSelected()) return
      this.$confirm({
        title: '下载确认',
        content: '你确定要下载吗？',
        onOk: () => {
          const rows = this.selectedRows
          const zip = new JSZip()
          for (let i = 0; i < rows.length; i++) {
            qrcode.toDataURL(rows[i].link, (err, url) => {
              if (err) {
                this.$message.warning('生成二维码失败')
                return false
              }
              zip.file(rows[i].name + '.jpg', url.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true })
              console.log(zip, url)
            })
          }
          zip.generateAsync({ type: 'blob' }).then(function(content) {
            // see FileSaver.js
            saveAs(content, 'example.zip')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-page-search-wrapper {
  margin-bottom: 20px;
}
.batch-action {
  text-align: left;
  padding-left: 20px;
  button {
    margin-left: 8px;
  }
}
.cover {
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}
.action {
  button {
    margin-right: 5px;
  }
}
</style>
