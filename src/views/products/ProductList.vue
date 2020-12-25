<template>
  <div>
    <a-card :bordered="false" class="margin-bottom">
      <h3 slot="title">产品查询</h3>
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="请选择" style="width: 260px;" v-model="cateParam">
            <a-select-option value="all">请选择产品分类</a-select-option>
            <template v-for="(item, index) in category">
              <a-select-option :value="item.id" :key="index">{{ item.label }}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="shelved" placeholder="请选择" style="width: 174px;">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="1">上架</a-select-option>
            <a-select-option value="2">下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            mode="multiple"
            placeholder="请选择产品标签"
            :default-value="shopTag"
            style="width: 300px"
            showArrow
            @change="handleTagSelect"
          >
            <a-select-option v-for="tag in tagOptions" :key="tag">
              {{ tag }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-date-picker v-model="queryParam.updateDate" style="width: 100%" placeholder="请输入更新日期"/>
        </a-form-item>
        <a-form-item :lable-col="{ span: 24, offset: 12 }">
          <a-input placeholder="请输入关键词" v-model="queryParam.keyWords"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="list" :bordered="false">
      <h3 slot="title">产品列表</h3>
      <!--      <div class="table-operator">-->
      <!--        <a-button type="primary" @click="$router.push('/products/add-product')">新增</a-button>-->
      <!--        <a-button @click="visibleUploadXls = true">批量导入</a-button>-->
      <!--        <a-button type="danger" @click="handleDel">删除</a-button>-->
      <!--        <a-button type="primary" @click="handleShelve(1)">上架</a-button>-->
      <!--        <a-button type="primary" @click="handleShelve(0)">下架</a-button>-->
      <!--        <a-dropdown>-->
      <!--          <a-menu slot="overlay" @click="handleMenuClick">-->
      <!--            &lt;!&ndash;            <a-menu-item key="上架">上架</a-menu-item>&ndash;&gt;-->
      <!--            &lt;!&ndash;            <a-menu-item key="下架">下架</a-menu-item>&ndash;&gt;-->
      <!--            &lt;!&ndash;            <a-menu-divider />&ndash;&gt;-->
      <!--            <a-menu-item key="设为最新">设为最新</a-menu-item>-->
      <!--            <a-menu-item key="取消最新">取消最新</a-menu-item>-->
      <!--            <a-menu-item key="设为推荐">设为推荐</a-menu-item>-->
      <!--            <a-menu-item key="取消推荐">取消推荐</a-menu-item>-->
      <!--            <a-menu-item key="设为热销">设为热销</a-menu-item>-->
      <!--            <a-menu-item key="取消热销">取消热销</a-menu-item>-->
      <!--          </a-menu>-->
      <!--          <a-button>-->
      <!--            批量设置-->
      <!--            <a-icon type="down"/>-->
      <!--          </a-button>-->
      <!--        </a-dropdown>-->
      <!--        <a-button @click="updateCategory">移动到</a-button>-->
      <!--        <a-button @click="setCategory">添加到</a-button>-->
      <!--        &lt;!&ndash;        <a-button @click="handleDownload">下载产品链接二维码</a-button>&ndash;&gt;-->
      <!--      </div>-->
      <s-table
        ref="table"
        size="default"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadListData"
        :alert="true"
        :getSortField="returnSortFile"
        :rowSelection="rowSelection"
      >
        <div slot="sort" slot-scope="text, record">
          <a-input type="number" v-model="record.sort" size="small" style="width: 60px;text-align: center"></a-input>
        </div>
        <div class="cover" slot="shopImg" slot-scope="shopImg">
          <template v-if="!shopImg">
            <a-icon type="picture" style="font-size:32px;opacity: .3;"></a-icon>
          </template>
          <img v-else :src="/^http/.test(shopImg) ? shopImg : getImg(shopImg)" alt/>
        </div>
        <div slot="shelve" slot-scope="text, record">
          <a-switch :checked="checkIsShelve(record.isShelve)" @change="checked => onSwitchChange(checked, record.id)"/>
        </div>
        <!--        <div slot="link" slot-scope="text, record">-->
        <!--          <a-button type="link">{{ website + '/Details/' + record.id }}</a-button>-->
        <!--        </div>-->
        <span slot="cate" slot-scope="catId">
          <template v-for="(item, index) in getCateName(catId)">
            <span :key="index">{{ item }}<br/></span>
          </template>
        </span>
        <span slot="shopTags" slot-scope="shopTags">
          <a-tag v-for="tag in shopTags" :key="tag" :color="tag === 'Hot' ? 'red' : tag === 'New' ? 'green' : 'orange'">
            {{ tags[tag] }}
          </a-tag>
        </span>
        <div class="action" slot="action" slot-scope="text, record">
          <span class="link-btn right-split" @click="preview(record.id)">预览</span>
          <span class="link-btn right-split" @click="copy(record.id)">复制</span>
          <span class="link-btn right-split" @click="edit(record.id)">编辑</span>
          <a-popconfirm title="你确定要删除该产品吗?" @confirm="del(record.id)">
            <span class="link-btn red-text">删除</span>
          </a-popconfirm>
          <!--          <a-button type="primary" icon="edit" size="small" @click="edit(record.id)" />-->
          <!--          <a-button type="primary" icon="copy" size="small" @click="copy(record.id)" />-->
          <!--          <a-popconfirm title="你确定要删除该产品吗?" @confirm="del(record.id)">-->
          <!--            <a-button type="danger" icon="delete" size="small" />-->
          <!--          </a-popconfirm>-->
          <!--          <a-button icon="share-alt" size="small" @click="handleShare(record)" />-->
          <!--          <a-button icon="eye" size="small" @click="preview(record.id)" />-->
        </div>
      </s-table>

      <div class="table-operator list-footer">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="handleSelectedAll">全选</a-checkbox>
        <a-button type="primary" @click="$router.push('/products/add-product')">新增</a-button>
        <a-button type="primary" @click="handleSort">排序</a-button>
        <!--        <a-button @click="visibleUploadXls = true">批量导入</a-button>-->
        <a-button type="danger" @click="handleDel">删除</a-button>
        <a-button type="primary" @click="handleShelve(1)">上架</a-button>
        <a-button type="primary" @click="handleShelve(0)">下架</a-button>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <!--            <a-menu-item key="上架">上架</a-menu-item>-->
            <!--            <a-menu-item key="下架">下架</a-menu-item>-->
            <!--            <a-menu-divider />-->
            <a-menu-item key="设为最新">设为最新</a-menu-item>
            <a-menu-item key="取消最新">取消最新</a-menu-item>
            <a-menu-item key="设为推荐">设为推荐</a-menu-item>
            <a-menu-item key="取消推荐">取消推荐</a-menu-item>
            <a-menu-item key="设为热销">设为热销</a-menu-item>
            <a-menu-item key="取消热销">取消热销</a-menu-item>
          </a-menu>
          <a-button>
            批量设置
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
        <a-dropdown v-model="cateDropdownVisible">
          <div slot="overlay" class="category-check">
            <ul>
              <li
                v-for="item in category"
                :class="{ checked: categoryCheckList.includes(item.id) }"
                :key="item.id"
                @click.stop="handleSelectedCate(item.id)"
              >
                {{ item.label }}
              </li>
            </ul>
            <div class="s-flex s-flex-end">
              <a-button @click.stop="updateCategory" style="margin-right: 10px" type="primary" size="small">确定
              </a-button>
              <a-button @click.stop="cancelUpdateCategory" size="small">取消</a-button>
            </div>
          </div>
          <a-button>移动到</a-button>
        </a-dropdown>
        <a-dropdown v-model="cateDropdownVisible2">
          <div slot="overlay" class="category-check">
            <ul>
              <li
                v-for="item in category"
                :class="{ checked: categoryCheckList.includes(item.id) }"
                :key="item.id"
                @click.stop="handleSelectedCate(item.id)"
              >
                {{ item.label }}
              </li>
            </ul>
            <div class="s-flex s-flex-end">
              <a-button @click.stop="setCategory" style="margin-right: 10px" type="primary" size="small">确定</a-button>
              <a-button @click.stop="cancelSetCategory" size="small">取消</a-button>
            </div>
          </div>
          <a-button>复制到</a-button>
        </a-dropdown>
        <!--        <a-button @click="setCategory">复制到</a-button>-->
        <!--        <a-button @click="handleDownload">下载产品链接二维码</a-button>-->
      </div>
    </a-card>
    <a-modal v-model="visibleShare" title="分享产品">
      <a-row :gutter="[10, 20]">
        <a-col :span="4">
          产品名称
        </a-col>
        <a-col :span="20">
          {{ share.name }}
        </a-col>
        <a-col :span="4">
          产品链接
        </a-col>
        <a-col :span="20">
          {{ share.link }}
        </a-col>
        <a-col :span="4">
          产品二维码
        </a-col>
        <a-col :span="20">
          <img :src="share.linkBase64" alt=""/>
        </a-col>
        <a-col :span="4">
          分享到
        </a-col>
        <a-col :span="20">
          <share-this :shareThisEmbedUrl="shareUrl" :url="share.link"></share-this>
        </a-col>
      </a-row>
      <div slot="footer" class="model-footer">
        <a-button @click="hideShare">关闭</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleUploadXls" title="导入产品">
      <p>
        <b>产品信息</b>
        <br/>1. 下载模板文件，根据模板中的批注，填写产品信息。
        <a @click="downloadXls" target="_blank">下载文件</a>
        <br/>2. 上传填写后的数据文件：
        <a-upload
          :file-list="fileList"
          :multiple="false"
          accept=".xls, .xlsx"
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
        <b>导入说明</b>
        <br/>1. 表格首行为字段名，不能删除、修改。 <br/>2. 表头字段标了“*”的为必填字段，请务必填写。 <br/>3.
        一次最多提交1000条产品信息，且文件大小不能超过10M。 <br/>4. 仅支持.xls、.xlsx格式。
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
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  import STable from '@/components/Table'
  import { mapState } from 'vuex'
  // eslint-disable-next-line no-unused-vars
  import { getProducts, delProduct, updateProp, importProducts, appendToCates, updateCate } from '@/api/products'
  import { getProductCate } from '@/api/category'
  import * as XLSX from 'xlsx'
  import JSZip from 'jszip'
  import { saveAs } from 'file-saver'
  import qrcode from 'qrcode'
  import ShareThis from '@/components/ShareThis'
  import { updateSort } from '../../api/products'

  const tagOptions = ['热销产品', '新产品', '推荐产品']
  const tags = {
    Hot: '热销产品',
    New: '新产品',
    Recommend: '推荐产品'
  }
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
      title: '主图展示',
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
      dataIndex: 'catId',
      scopedSlots: {
        customRender: 'cate'
      },
      align: 'center'
    },
    {
      title: '发布时间',
      dataIndex: 'updateDate',
      sorter: true,
      align: 'center'
    },
    {
      title: '上架',
      dataIndex: 'isShelve',
      sorter: true,
      scopedSlots: {
        customRender: 'shelve'
      },
      align: 'center'
    },
    // {
    //   title: '产品链接',
    //   dataIndex: 'shopUrl',
    //   scopedSlots: {
    //     customRender: 'link'
    //   }
    // },
    // {
    //   title: '标签',
    //   dataIndex: 'shopTags',
    //   scopedSlots: {
    //     customRender: 'shopTags'
    //   }
    // },
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
      this.tags = tags
      return {
        shareUrl: process.env.VUE_APP_SHARE_THIS,
        visibleShare: false,
        share: {
          name: '',
          link: '',
          linkBase64: ''
        },
        // 筛选
        updateDate: '',

        category: [],
        categoryCheckList: [],
        cateDropdownVisible: false,
        cateDropdownVisible2: false,
        isUpdateCate: false, // true 新增到分类  false 移动、更新分类
        showCategory: false,
        shelved: 'all',
        cateParam: 'all',
        queryParam: {},
        shopTag: [],
        loadData: parameter => {
          parameter = Object.assign(parameter, this.queryParam)
          return getProducts(parameter)
        },
        productList: [],
        listLoading: true,
        selectedRowKeys: [],
        selectedRows: [],
        checkAll: false,
        indeterminate: false,
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
      const { catId } = this.$route.query
      if (catId) {
        this.queryParam.catId = catId
        this.cateParam = catId
      }
      this.loadCateData()
      // this.loadProductData()
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
    methods: {
      moment,
      handleTagSelect(value) {
        this.shopTag = value
      },
      getImg(name) {
        return name ? process.env.VUE_APP_HOST + '/' + name : ''
      },
      returnSortFile(columnKey) {
        const sortObj = {
          shopTitle: 1,
          shopModel: 2,
          updateDate: 3,
          isShelve: 4
        }
        return sortObj[columnKey]
      },
      loadListData(parameter) {
        parameter = Object.assign(parameter, this.queryParam)
        return getProducts(parameter)
      },
      onSorterChange(sorter) {
        console.log(sorter)
        // this.loadListData({
        //   sortField: 1,
        //   sortType: 0
        // })
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
      checkIsShelve(shelve) {
        return shelve
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
      loadProductData() {
        this.listLoading = true
        getProducts(this.queryParam)
          .then(res => {
            this.productList = res.data.datas
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      downloadXls() {
        // const host = window.location.host
        window.open('/files/productTemplate.xls')
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
              const cates = item['产品分类']
                .toString()
                .split(',')
                .map(item => Number(item))
              const keywords = item['产品关键词'].toString()
              console.log()
              return {
                name: item['* 产品名称'],
                catId: cates,
                shopKeyWords: keywords.split(','),
                shopModel: item['产品型号'],
                shopBrand: item['品牌'],
                shopNumber: item['商品编码'],
                shopDesc: item['产品简介'],
                shopDescribe: item['产品描述'],
                isShelve: item['产品状态（1表示上架，0表示下架）'] !== 0
              }
            })
            // TODO 批量上传接入
            console.log(uploadData)
            importProducts(uploadData)
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('上传成功！')
                } else throw res
              })
              .catch(err => {
                this.$message.error(err.msg)
              })
          } catch (e) {
            console.log(e)
            // 这里可以抛出文件类型错误不正确的相关提示
            // this.$message.error('文件类型不正确！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        console.log(selectedRowKeys, selectedRows)
        const items = this.$refs.table.localDataSource
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        this.checkAll = items.length === this.selectedRowKeys.length
        this.indeterminate = !!this.selectedRowKeys.length && this.selectedRowKeys.length < items.length
      },
      // 上下架操作
      onSwitchChange(checked, id) {
        this.$confirm({
          content: checked ? '你确定要上架该产品吗？' : '你确定要下架该产品吗？',
          onOk: () => {
            this.handleBatchAction('IsShelve', checked, [id])
          }
        })
      },
      /**
       * 批量操作
       * @param prop
       * @param bool
       * @param id
       */
      handleBatchAction(prop, bool, id) {
        const params = {
          propName: prop,
          value: bool
        }
        updateProp(params, id)
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
      },
      // 编辑文章
      edit(id) {
        this.$router.push('/products/add-product/' + id)
      },
      // 添加相似文章
      copy(result) {
        console.log(result)
        this.$router.push({ path: '/products/add-product', query: { copy: result } })
      },
      // 删除文章
      del(id) {
        console.log(id)
        delProduct([id]).then(res => {
          if (res.code === 200) this.$message.success('操作成功')
          this.$refs.table.refresh(true)
        })
      },
      // 分享文章
      async handleShare(result) {
        this.share.name = result.shopTitle
        this.share.link = this.website + '/Details/' + result.id
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
      // 预览文章
      preview(id) {
        const link = this.website + '/Details/' + id
        window.open(link, '_blank')
      },
      clearTagParams() {
        const tagObj = {
          热销产品: 'isHot',
          新产品: 'isNew',
          推荐产品: 'isRecommend'
        }
        Object.keys(tagObj).forEach(k => {
          this.queryParam[tagObj[k]] = false
        })
      },
      handleTagFilter() {
        const tagObj = {
          热销产品: 'isHot',
          新产品: 'isNew',
          推荐产品: 'isRecommend'
        }
        this.clearTagParams()
        this.shopTag.forEach(item => {
          this.queryParam[tagObj[item]] = true
        })
      },
      handleShelve(type) {
        if (!this.checkSelected()) return

        this.$confirm({
          content: `你确定要${type === 1 ? '上架' : '下架'}该产品吗？`,
          onOk: () => {
            const IDs = this.selectedRows.map(item => {
              return item.id
            })
            this.handleBatchAction('isShelve', type === 1, IDs)
          }
        })
      },
      // 批量操作
      handleMenuClick(value) {
        if (!this.checkSelected()) return
        console.log(this.batchValue, value)
        this.$confirm({
          content: `你确定要${value.key}该产品吗？`,
          onOk: () => {
            const IDs = this.selectedRows.map(item => {
              return item.id
            })
            const actions = {
              上架: ['IsShelve', true],
              下架: ['IsShelve', false],
              设为最新: ['IsNew', true],
              取消最新: ['IsNew', false],
              设为推荐: ['IsRecommend', true],
              取消推荐: ['IsRecommend', false],
              设为热销: ['IsHot', true],
              取消热销: ['IsHot', false]
            }
            this.handleBatchAction(actions[value.key][0], actions[value.key][1], IDs)
          }
        })
      },
      // 选择分类
      handleCateSelected(value) {
        console.log(value)
        this.queryParam.catId = value
      },
      // 切换产品查询状态
      handleStatusSelect(value) {
        this.queryParam.isShelve = parseInt(value) === 1
      },
      handleDate(value) {
        if (value) {
          this.queryParam.updateDate = value.format()
        }
      },
      // 查询
      handleQuery() {
        if (this.shopTag.length) {
          this.handleTagFilter()
        } else {
          this.clearTagParams()
        }
        if (this.shelved !== 'all') {
          this.queryParam.isShelve = this.shelved === '1'
        }
        if (this.cateParam !== 'all') {
          this.queryParam.catId = this.cateParam
        }
        console.log(this.queryParam)
        // this.loadProductData()
        this.$refs.table.refresh(true)
      },
      // 重置查询
      handleReset() {
        this.queryParam = {}
        this.shopTag = []
        this.shelved = 'all'
        this.cateParam = 'all'
        // this.loadProductData()
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
        this.isUpdateCate = false
        this.handleSetCategory()
      },
      handleSelectedCate(id) {
        if (this.categoryCheckList.includes(id)) {
          this.categoryCheckList.splice(this.categoryCheckList.findIndex(item => item === id), 1)
        } else {
          this.categoryCheckList.push(id)
        }
      },
      updateCategory() {
        if (!this.checkSelected()) return
        this.isUpdateCate = true
        this.handleSetCategory()
      },
      cancelUpdateCategory() {
        this.categoryCheckList = []
        this.cateDropdownVisible = false
      },
      cancelSetCategory() {
        this.categoryCheckList = []
        this.cateDropdownVisible2 = false
      },
      // 批量设置分类
      handleSetCategory() {
        const IDs = this.selectedRows.map(item => {
          return item.id
        })
        console.log('ItemCatId', this.categoryCheckList, IDs)
        if (this.isUpdateCate) {
          this.updateProductsToCate(this.categoryCheckList, IDs)
        } else {
          this.appendProductsToCate(this.categoryCheckList, IDs)
        }
        // setCategory().then(res => {
        //   const result = res.result
        //   if (result.data === 'success') {
        //     this.$message.success('操作成功')
        //     this.showCategory = false
        //     this.category = []
        //   }
        // })
      },
      updateProductsToCate(cates, id) {
        const params = {
          idList: id,
          catIdList: cates
        }
        updateCate(params)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功')
              this.$refs.table.refresh()
            } else throw res
          })
          .catch(err => {
            this.$message.error(err.msg || '操作失败')
          })
          .finally(() => {
            this.showCategory = false
          })
      },
      appendProductsToCate(cates, id) {
        const params = {
          idList: id,
          catIdList: cates
        }
        appendToCates(params)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功')
              this.$refs.table.refresh()
            } else throw res
          })
          .catch(err => {
            this.$message.error(err.msg || '操作失败')
          })
          .finally(() => {
            this.showCategory = false
          })
      },
      handleSelectedAll(e) {
        const items = this.$refs.table.localDataSource
        this.selectedRows = e.target.checked ? items : []
        this.$refs.table.selectedRows = e.target.checked ? items : []
        this.selectedRowKeys = e.target.checked ? items.map(item => item.id) : []
        this.$refs.table.selectedRowKeys = e.target.checked ? items.map(item => item.id) : []
        this.indeterminate = false
        this.checkAll = e.target.checked
        // this.indeterminate = false
        // if (this.selectedRows.length === items.length) {
        //   this.$refs.table.selectedRows = this.selectedRows = []
        //   this.$refs.table.selectedRowKeys = this.selectedRowKeys = []
        //   return false
        // }
        // this.$refs.table.selectedRows = this.selectedRows = items
        // this.$refs.table.selectedRowKeys = this.selectedRowKeys = items.map(item => {
        //   return item.id
        // })
        // console.log(this.$refs.table.localDataSource)
      },
      handleSort() {
        const items = this.$refs.table.localDataSource
        const params = items.map(item => {
          return {
            id: item.id,
            sort: Number(item.sort)
          }
        })
        console.log(params)
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
      // 批量删除
      handleDel() {
        if (!this.checkSelected()) return

        // TODO
        this.$confirm({
          content: '你确定要删除这些产品吗？',
          onOk: () => {
            delProduct(this.selectedRowKeys).then(res => {
              if (res.code === 200) this.$message.success('操作成功')
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
  .category-check {
    background: white;
    padding: 5px;
    width: 160px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;

    ul,
    li {
      margin: 0;
      padding: 0;
    }

    li {
      display: flex;
      height: 24px;
      margin: 5px 0;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;

      &.checked {
        &:after {
          content: '✓';
          display: block;
        }
      }
    }
  }

  .table-page-search-wrapper {
    margin-bottom: 20px;
  }

  .batch-action {
    text-align: left;

    button {
      margin-left: 8px;
    }
  }

  .cover {
    text-align: center;

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
