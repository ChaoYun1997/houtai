<template>
  <div>
    <a-card :bordered="false">
      <div slot="title">
        <a-button type="primary" icon="plus" @click="$router.push('/articles/add-category')">
          新增文章分类
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
        :columns="columns"
        :data="loadCateData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <a slot="catname" slot-scope="text">{{ text }}</a>
        <div class="action" slot="action" slot-scope="text, record">
          <a-button type="primary" icon="edit" size="small" @click="edit(record.id)" />

          <a-popconfirm title="确定删除该条数据吗？" @confirm="del(record.id)">
            <a-button type="danger" icon="delete" size="small" />
          </a-popconfirm>
          <a-button icon="eye" size="small" @click="preview(record.catUrl)" />
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
  </div>
</template>

<script>
import STable from '@/components/Table'

import { getArticleCate, delCate } from '@/api/category'
import * as XLSX from 'xlsx'
const columns = [
  {
    title: '文章分类名称',
    dataIndex: 'catName',
    scopedSlots: {
      customRender: 'catname'
    }
  },
  {
    title: '文章数量',
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
    this.columns = columns
    return {
      visibleUploadXls: false,
      fileList: [],
      selectedRowKeys: [],
      loadCateData: parameter => {
        return getArticleCate(Object.assign(parameter, this.queryParam))
      },
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      pagination: {
        size: 'small'
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
    onSelectChange() {},
    edit(id) {
      this.$router.push(`/articles/add-category/${id}`)
    },
    del(id) {
      delCate({ id: id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        }
      })
    },
    preview(url) {
      const host = process.env.VUE_APP_WEBSITE
      window.open(`${host}/${url}`)
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
