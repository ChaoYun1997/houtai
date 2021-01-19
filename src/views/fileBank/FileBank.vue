<template>
  <div class="bank" id="bankbox">
    <div style="padding: 20px;background: white;border-bottom: 1px solid #ccc">
      <h3>文件银行</h3>
    </div>
    <a-layout class="bank-layout">
      <a-layout-sider theme="light" class="side-menu" width="280">
        <a-tree
          @click="handleTreeClick"
          :tree-data="cateTree"
          class="fileTree"
          show-icon
          :selectedKeys="selectedTree"
          :autoExpandParent="true"
          :defaultExpandAll="true"
          :default-expanded-keys="['0-0']"
        >
          <div slot="custom" slot-scope="item" style="min-width: 180px">
            <div class="s-flex s-flex-between">
              <div @click="queryGroup(item.key)">
                <a-icon type="file" class="tree-icon"></a-icon>
                <span class="node-title" :title="item.title">
                  {{ item.title.length > 7 ? item.title.substring(0, 7) + '...' : item.title }}
                </span>
              </div>
              <div>
                <span class="icon-wrap">
                  <a-icon type="edit" @click="handleGroupRename(item)" />
                </span>
                <span class="icon-wrap">
                  <a-popconfirm title="你确定要删除该数据吗？" @confirm="handleDelTreeNode(item)">
                    <a-icon type="delete" />
                  </a-popconfirm>
                </span>
                <span class="icon-wrap" @click="addNewNode(item)">
                  <a-icon type="plus" />
                </span>
              </div>
            </div>
          </div>
        </a-tree>
        <div class="side-btn" @click="visibleAddGroup = true">
          <a-icon type="plus"></a-icon>
          添加分组
        </div>
        <div v-if="!queryType" :class="{ 'side-btn': true, active: visibleRecycleBin }" @click="showRecycleBin">
          <a-icon type="delete"></a-icon>
          文件回收
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-content class="layout-content">
          <a-card :bordered="false">
            <h3 slot="title">文件查询</h3>
            <a-row>
              <a-col :span="16">
                <a-form layout="inline">
                  <a-form-item>
                    <a-select placeholder="文件分组" v-model="selectedGroup" style="width: 160px;margin-right:10px;">
                      <a-select-option value="all">全部分组</a-select-option>
                      <a-select-option v-for="item in fileGroup" :key="item.id" :value="item.key">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="!queryType">
                    <a-select placeholder="文件分类" v-model="selectedCate" style="width: 160px;margin-right:10px;">
                      <a-select-option value="all">全部分类</a-select-option>
                      <a-select-option v-for="item in fileCate" :key="item.id" :value="item.key">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-input v-model="fileKeyword" placeholder="文件名搜索"></a-input>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="handleQuery">查询</a-button>
                    <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                  </a-form-item>
                </a-form>
              </a-col>
              <a-col v-if="!visibleRecycleBin" :span="8" class="s-flex s-flex-end">
                <a-row class="progress-bar" :gutter="10">
                  <a-col :span="12">
                    <p style="margin-bottom: 0;text-align: center">{{ `${usedSize}G/${totalSize}G` }}</p>
                    <a-progress :percent="(usedSize / totalSize) * 100" :show-info="false" />
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" @click="visibleUploadFile = true">上传文件</a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
          <div class="action-bar">
            <a-row>
              <a-col :span="18">
                <a-checkbox :indeterminate="indeterminate" :checked="selectedAll" @change="onCheckAllChange">
                  全选
                </a-checkbox>
                <div class="view-mode">
                  <span :class="{ active: mode === 0 }" @click="mode = 0">
                    <a-icon type="appstore" theme="filled" />
                  </span>
                  <span :class="{ active: mode === 1 }" @click="mode = 1">
                    <a-icon type="bars" />
                  </span>
                </div>
                <template v-if="!visibleRecycleBin">
                  <a-button class="action-btn" @click="visibleNewFolder = true" type="primary">
                    新建文件夹
                  </a-button>
                  <a-button class="action-btn" @click="doDelete" type="danger">
                    删除
                  </a-button>
                </template>
                <template v-else>
                  <a-button class="action-btn" type="primary" @click="doRecovery" shape="round">恢复文件</a-button>
                  <a-button class="action-btn" type="danger" @click="doRemove" shape="round">彻底删除</a-button>
                </template>
              </a-col>
              <a-col :span="6" class="s-flex s-flex-end">
                <span>数量：{{ total }}</span>
              </a-col>
            </a-row>
          </div>
          <a-card :bordered="false">
            <a-breadcrumb class="breadcrumb">
              <a-breadcrumb-item>
                <span class="link-btn" @click="queryGroup('0-0')">所有文件</span>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-for="(item, index) in folders" :key="item.id">
                <span class="link-btn" @click="queryFolder(item, index)">{{ item.name }}</span>
              </a-breadcrumb-item>
            </a-breadcrumb>
            <a-checkbox-group style="width: 100%" v-model="checkedList">
              <a-list
                :class="{ 'file-box': true, 'list-style': mode === 1 }"
                :grid="gridMode"
                :data-source="fileData"
                :loading="loading"
                :pagination="pagination"
              >
                <a-list-item slot="renderItem" slot-scope="item">
                  <div class="item">
                    <a-checkbox
                      :value="item.id"
                      @change="saveChecked(item)"
                      :class="{ 'item-checkbox': true, show: checkedList.includes(item.id) }"
                    >
                    </a-checkbox>

                    <div
                      v-if="item.isFolder"
                      class="file-img s-flex s-flex-center s-flex-align-center"
                      @click="queryFolder(item, -1)"
                    >
                      <a-icon class="file-folder" type="folder-open" />
                    </div>
                    <template v-else>
                      <img
                        v-if="item.fileType === 0"
                        class="item-img"
                        :src="host + '/' + item.fileDownloadName + '?imageView2/2/w/140/h/140/q/75'"
                        alt=""
                        @click="viewImage(item)"
                      />
                      <div class="video-box file-video" v-else-if="item.fileType === 1" @click="playVideo(item)">
                        <span class="play"></span>
                        <video width="140" height="140">
                          <source :src="item.fileName" />
                        </video>
                      </div>
                      <div v-else class="file-img s-flex s-flex-center s-flex-align-center">
                        <a-icon class="file-pdf" type="file-pdf" />
                      </div>
                    </template>
                    <div class="title-box s-flex s-flex-between">
                      <div :class="{ 'folder-name': item.isFolder }" :title="item.fileName">
                        {{
                          item.fileName.length > 6 && mode === 0 ? item.fileName.substring(0, 6) + '...' : item.fileName
                        }}
                      </div>
                      <span class="size" v-if="!item.isFolder && item.fileWidth">{{`${item.fileWidth}*${item.fileHeight}`}}</span>
                    </div>
                    <div v-if="!visibleRecycleBin" class="s-flex s-flex-end item-action">
                      <template v-if="!item.isFolder">
                        <a-icon type="download" @click="handleDownload(item.fileDownloadName)" />
                        <a-icon type="link" @click="handleCopyLink(item.fileDownloadName)" />
                        <a-icon type="export" @click="handleMoveFile(item.id)" />
                      </template>
                      <a-popconfirm title="你确定要删除该数据吗？" @confirm="handleDelFile(item.id)">
                        <a-icon class="icon-btn" type="delete" />
                      </a-popconfirm>
                    </div>
                  </div>
                </a-list-item>
              </a-list>
            </a-checkbox-group>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal v-model="visibleUploadFile" centered title="上传文件">
      <div class="s-flex s-flex-center">
        <a-upload
          name="file"
          ref="uploader"
          :action="uploadUrl"
          accept="image/*,video/*,.pdf"
          :data="getUploadData"
          :before-upload="getUploadToken"
          @change="handleUploadChange"
        >
          <a-button>
            <a-icon type="upload" />
            选择文件
          </a-button>
        </a-upload>
      </div>
      <template #footer>
        <a-button @click="hideUpload">关闭</a-button>
      </template>
    </a-modal>
    <a-modal v-model="visibleVideo" :centered="true" title="播放视频">
      <video id="videoPlayer" :src="currentVideo" controls width="470"></video>
      <template #footer>
        <a-button @click="hideVideo">关闭</a-button>
      </template>
    </a-modal>
    <a-modal v-model="visibleImg" :centered="true" :width="800" title="查看大图">
      <div class="preview-box"><img :src="currentImg" alt="" /></div>
      <template #footer>
        <a-button @click="hideImg">关闭</a-button>
      </template>
    </a-modal>
    <a-modal v-model="visibleNewFolder" :centered="true" title="新建文件夹">
      <a-input placeholder="请输入文件夹名称" v-model="newFolder"></a-input>
      <template #footer>
        <a-button @click="visibleNewFolder = false">取消</a-button>
        <a-button @click="createNewFolder" type="primary" :disabled="!newFolder">确定</a-button>
      </template>
    </a-modal>
    <a-modal v-model="visibleRenameGroup" :centered="true" title="重命名" :width="500">
      <p class="text-center" style="margin-bottom: 0">
        <a-input
          style="width:280px;margin-right: 10px"
          placeholder="请输入分组名称"
          v-model="renameGroup.title"
        ></a-input>
      </p>
      <template #footer>
        <a-button @click="visibleRenameGroup = false">取消</a-button>
        <a-button @click="confirmRenameGroup" type="primary" :disabled="!renameGroup.title">确定</a-button>
      </template>
    </a-modal>
    <a-modal v-model="visibleAddGroup" :centered="true" title="添加分组" :width="500">
      <p class="text-center" style="margin-bottom: 0">
        <a-input style="width:280px;margin-right: 10px" placeholder="请输入新分组名称" v-model="newGroup"></a-input>
      </p>
      <!--      <s-table-->
      <!--        ref="table"-->
      <!--        size="default"-->
      <!--        :rowKey="record => record.id"-->
      <!--        :pagination="{ pageSize: 40 }"-->
      <!--        :defaultExpandAllRows="true"-->
      <!--        :columns="groupColumns"-->
      <!--        :data="loadGroupData"-->
      <!--      >-->
      <!--        <template slot="groupName" slot-scope="text, record">-->
      <!--          <editable-cell :text="text" @change="val => editGroupName(val, record)" />-->
      <!--        </template>-->
      <!--        <template slot="parentGroupId" slot-scope="text, record">-->
      <!--          <editable-cell :text="text" @change="val => editGroupId(val, record)" />-->
      <!--        </template>-->
      <!--        <div class="action" slot="action" slot-scope="text, record">-->
      <!--          <a-popconfirm title="你确定要删除该数据吗？" @confirm="delGroup(record.id)">-->
      <!--            <span class="link-btn del">删除</span>-->
      <!--          </a-popconfirm>-->
      <!--        </div>-->
      <!--      </s-table>-->
      <template #footer>
        <a-button @click="visibleAddGroup = false">取消</a-button>
        <a-button @click="handleAddGroup" type="primary" :disabled="!newGroup">确定</a-button>
      </template>
    </a-modal>
    <a-modal v-model="visibleMoveFile" :centered="true" title="移动文件">
      <a-tree
        class="fileTree"
        show-line
        :default-expanded-keys="['0-0']"
        :tree-data="folderTree"
        :selectedKeys.sync="selectedMoveParent"
      >
      </a-tree>
      <template #footer>
        <a-button @click="visibleMoveFile = false">取消</a-button>
        <a-button @click="doMoveFile" type="primary" :disabled="!selectedMoveParent.length">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import STable from '@/components/Table'
import EditableCell from '@/components/EditableCell'
import {
  addFile,
  addFileGroup,
  delFileGroup,
  getFileGroupList,
  getFileList,
  moveFile,
  removeFile,
  updateDelState,
  updateFileGroup
} from '../../api/file'
import { mapState, mapActions } from 'vuex'
import { getUploadSign } from '../../api/products'

const cateTree = [
  {
    title: '所有分组',
    key: '0',
    children: []
  }
]
const folderTree = [
  {
    title: '所有文件夹',
    key: '0-0',
    children: []
  }
]

const fileCate = [
  {
    label: '图片',
    id: 0,
    key: 0
  },
  {
    label: '视频',
    id: 1,
    key: 1
  },
  {
    label: 'PDF',
    id: 2,
    key: 2
  }
]
const fileOptions = []
const groupColumns = [
  {
    title: '#',
    dataIndex: 'id'
  },
  {
    title: '分组名称',
    dataIndex: 'groupName',
    scopedSlots: {
      customRender: 'groupName'
    }
  },
  {
    title: '父级ID',
    dataIndex: 'parentGroupId',
    scopedSlots: {
      customRender: 'parentGroupId'
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
  name: 'FileBank',
  components: {
    STable,
    EditableCell
  },
  data() {
    this.cateTree = cateTree
    this.folderTree = folderTree
    this.fileCate = fileCate
    return {
      groupColumns,
      renameGroup: {},

      selectedTree: null,
      host: process.env.VUE_APP_HOST,
      visibleUploadFile: false,
      visibleVideo: false,
      visibleImg: false,
      currentVideo: '',
      currentImg: '123',
      groupLoading: false,
      indeterminate: false,
      checkedList: [],
      fileOptions,
      selectedAll: false,
      selectedK: [],
      fileKeyword: '',
      selectedCate: 'all',
      selectedGroup: 'all',
      fileGroup: [],
      mode: 0, // 0:图片模式 1:列表模式
      gridMode: { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 8 },
      visibleNewFolder: false,
      newFolder: '',
      newGroup: '',
      total: 0,
      selectedVideo: '',
      folders: [],

      loading: true,
      fileData: [],
      usedSize: 0,
      totalSize: 0,

      visibleAddGroup: false,
      visibleRenameGroup: false,
      visibleManageGroup: false,
      selectedParent: null,
      visibleRecycleBin: false,
      selectedFileId: '',
      selectedMoveParent: [],
      visibleMoveFile: false,

      checkedFiles: [],
      checkedItems: [],
      currentGroupId: 0,
      currentFolderId: null,
      queryParam: {
        pageSize: 40
      },
      fileType: 0,
      uploadType: 1,
      uploadToken: '',
      uploadFileName: '',
      fileList: [],
      uploadUrl: process.env.VUE_APP_QINIU_HOST,
      queryType: ''
    }
  },
  watch: {
    checkedList(newVal, oldVal) {
      if (newVal !== oldVal) {
        const checkedItem = this.fileData.filter(item => {
          if (newVal.includes(item.id)) {
            return item
          }
        })
        window.parent.postMessage(
          {
            cmd: 'recerving-item',
            item: checkedItem
          },
          '*'
        )
      }
    },
    mode(val) {
      if (val === 0) {
        this.gridMode = { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 8 }
      } else {
        this.gridMode = { gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }
      }
    }
  },
  computed: {
    ...mapState({
      website: state => {
        return /^http/.test(state.user.website)
          ? state.user.website
          : process.env.VUE_APP_PROTOCAL_HEAD + state.user.website
      },
      userInfo: state => state.user.userinfo
    }),

    pagination() {
      const vm = this
      if (!this.loading) {
        return {
          pageSize: vm.queryParam.pageSize,
          total: vm.total,
          onChange(page, pageSize) {
            vm.queryParam.pageIndex = page
            vm.fetchFile()
          }
        }
      }
      return {}
    }
  },
  beforeDestroy() {
    this.$nextTick(() => {
      const basicLayout = document.querySelector('.ant-pro-basicLayout-content')
      basicLayout.style.margin = '20px'
    })
  },
  created() {
    this.queryType = this.$route.params.type
    this.fetchGroup()
    this.fetchFile()
    this.fetchFolders()
    this.initSize()
    this.GetInfo()
    this.$nextTick(() => {
      let winHeight
      const footer = document.querySelector('.ant-layout-footer')
      const basicLayout = document.querySelector('.ant-pro-basicLayout-content')
      basicLayout.style.margin = 0
      footer.style.display = 'none'
      if (this.queryType) {
        const sidebar = document.querySelector('.ant-layout-sider')
        const header = document.querySelector('.ant-layout-header')
        const content = document.querySelector('.ant-pro-basicLayout-content')
        content.style.margin = '0 0 0 -80px'
        sidebar.style.display = 'none'
        header.style.display = 'none'
        winHeight = document.body.clientHeight
      } else {
        winHeight = document.body.clientHeight - 64
      }
      document.querySelector('#bankbox').style.height = winHeight + 'px'
    })
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('message', this.handleMessage)

      // 告诉父组件准备好接收消息了
      window.parent.postMessage(
        {
          cmd: 'ready-for-receiving'
        },
        '*'
      )
    })
  },
  destroyed() {
    // 注意移除监听！注意移除监听！注意移除监听！
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    ...mapActions(['GetInfo']),
    confirmRenameGroup() {
      const params = {
        id: this.renameGroup.id,
        groupName: this.renameGroup.title,
        parentGroupId: this.renameGroup.parentGroupId
      }
      updateFileGroup(params)
        .then(res => {
          console.log(res.code)
          if (res.code !== 200) throw res
          this.$message.success('修改成功')
          this.fetchGroup()
        })
        .finally(() => {
          this.visibleRenameGroup = false
        })
    },
    handleDelTreeNode(item) {
      if (item.children !== undefined) {
        this.$message.error('不能直接删除拥有子分组的数据')
        return false
      }
      delFileGroup([item.id])
        .then(res => {
          if (res.code !== 200) throw res
          this.$message.success('删除成功')
          this.fetchGroup()
        })
        .catch(err => {
          this.$message.error(err.msg || '删除失败')
        })
    },
    addNewNode(item) {
      this.selectedParent = item.id
      this.visibleAddGroup = true
    },
    handleGroupRename(item) {
      this.renameGroup = item
      this.visibleRenameGroup = true
    },
    delGroup(id) {
      delFileGroup([id])
        .then(res => {
          if (res.code !== 200) throw res
          this.$message.success('删除成功')
          this.fetchGroup()
        })
        .catch(err => {
          this.$message.error(err.msg || '删除失败')
        })
    },
    editGroupName(val, item) {
      if (this.text === val) return
      const params = {
        id: item.id,
        parentGroupId: item.parentGroupId,
        groupName: val
      }
      updateFileGroup(params)
        .then(res => {
          if (res.code !== 200) throw res
          this.$message.success('修改成功')
          this.fetchGroup()
        })
        .catch(err => {
          this.$message.error(err.msg || '修改失败')
        })
    },
    groupTreeTransfer(data, id) {
      function tree(pid) {
        const arr = []
        data
          .filter(item => {
            return item.parentGroupId === pid
          })
          .forEach(item => {
            const child = tree(item.id.toString())
            if (child.length) {
              item.children = child
            }
            arr.push(item)
          })
        return arr
      }

      return tree(id)
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.fileOptions : [],
        indeterminate: false,
        selectedAll: e.target.checked
      })
      console.log(this.checkedList)
    },
    handleMessage(event) {
      // 根据上面制定的结构来解析 iframe 内部发回来的数据
      const data = event.data
      switch (data.cmd) {
        case 'doSomething':
          // 业务逻辑
          console.log('doSomething' + data.params)
          break
      }
    },
    showRecycleBin() {
      this.selectedTree = null
      this.visibleRecycleBin = true
      this.queryParam = {
        pageIndex: 1,
        pageSize: 40,
        isDel: true
      }
      this.fetchFile()
    },
    initSize() {
      this.usedSize = (this.userInfo.nowFileSize / 1024).toFixed(2)
      this.totalSize = (this.userInfo.fileTotalSize / 1024).toFixed(2)
    },
    getObjectURL(file) {
      console.log(file)
      var url = null
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    getImageSize(path) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
          resolve({
            w: img.width,
            h: img.height
          })
        }
        img.onerror = err => reject(err)
      })
    },
    hideUpload() {
      this.visibleUploadFile = false
      this.fileList = []
    },
    async handleUploadChange(info) {
      if (info.file.status === 'done') {
        const arr = info.file.originFileObj.name.split('.')
        const filePath = this.getObjectURL(info.file.originFileObj)
        const isImg = info.file.originFileObj.type === 'image/jpeg' || info.file.originFileObj.type === 'image/png'
        console.log(info.file)
        const params = {
          fileGroupId: this.currentGroupId,
          fileType: /image/.test(info.file.type) ? 0 : /video/.test(info.file.type) ? 1 : 2,
          isFolder: false,
          fileName: arr[0],
          fileDownloadName: info.file.response.name,
          altValue: arr[0],
          fileSize: info.file.originFileObj.size / 1000000
        }
        if (isImg) {
          const sizes = await this.getImageSize(filePath)

          params.fileWidth = sizes.w
          params.fileHeight = sizes.h
          console.log(sizes, params)
        }
        if (this.queryParam.folderId) {
          params.folderId = this.queryParam.folderId
        }
        addFile(params)
          .then(res => {
            if (res.code !== 200) throw res
            console.log('添加成功：' + res)
            this.fetchFile()
            this.$message.success(`${info.file.name} 文件上传成功！`)
            this.GetInfo()
          })
          .catch(err => {
            this.$message.error(err.msg || '上传失败')
          })
        this.fileList.push({
          name: info.file.response.name,
          path: filePath
        })
        console.log(this.fileList[0])
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败。`)
      }
    },
    async getUploadToken(info) {
      console.log(info.type)
      // 获取视频上传凭证
      // eslint-disable-next-line no-unreachable
      const param = {
        type: /image/.test(info.type) ? 1 : /video/.test(info.type) ? 2 : 4
      }
      await getUploadSign(param)
        .then(res => {
          if (res.code === 200) {
            this.uploadToken = res.data.token
            this.uploadFileName = res.data.fileName
          } else {
            throw res
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    getUploadData(file) {
      return {
        token: this.uploadToken,
        key: this.uploadFileName,
        file: file
      }
    },
    hideVideo() {
      this.visibleVideo = false
      this.currentVideo = ''
    },
    playVideo(item) {
      this.currentVideo = /^http/.test(item.fileDownloadName)
        ? item.fileDownloadName
        : this.host + '/' + item.fileDownloadName
      this.visibleVideo = true
    },
    hideImg() {
      this.visibleImg = false
      this.currentImg = ''
    },
    viewImage(item) {
      this.currentImg = this.host + '/' + item.fileDownloadName
      this.visibleImg = true
    },
    handleAddGroup() {
      const params = {
        parentId: this.selectedParent === null ? 0 : this.selectedParent,
        groupName: this.newGroup
      }
      console.log(params)
      addFileGroup(params)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功')
            this.fetchGroup()
          } else {
            throw res
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
        .finally(() => {
          this.selectedParent = null
          this.visibleAddGroup = false
          this.newGroup = ''
        })
    },
    saveChecked(item) {
      console.log(item)
      this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.fileOptions.length
      this.selectedAll = this.checkedList.length === this.fileOptions.length
    },
    clearQueryParam() {
      delete this.queryParam.folderId
      delete this.queryParam.fileName
      delete this.queryParam.groupId
      delete this.queryParam.fileType
      delete this.queryParam.isDel
    },
    handleTreeClick(e) {
      console.log(e)
      if (e.target.innerText === '所有分组') this.queryGroup('0-0')
    },
    queryGroup(keys) {
      this.clearQueryParam()
      this.visibleRecycleBin = false
      this.folders = []
      this.selectedTree = [keys]
      const arr = keys.split('-')
      const groupId = arr[arr.length - 1]
      this.currentGroupId = groupId
      this.queryParam.groupId = groupId
      this.fetchFile()
    },
    queryFolder(item, index) {
      this.queryParam.folderId = item.id
      if (index === -1) {
        this.folders.push({
          name: item.fileName,
          id: item.id
        })
      } else {
        this.folders.splice(index + 1, this.folders.length)
      }
      this.fetchFile()
    },
    fetchFolders() {
      const params = {
        isFolder: true,
        pageIndex: 1,
        pageSize: 1000
      }
      getFileList(params).then(res => {
        if (res.code !== 200) throw res
        const folders = res.data.datas.filter(item => item.isFolder)
        this.folderTree[0].children = this.folderTreeTransfer(folders, 0)
      })
    },
    fetchFile() {
      this.checkedList = []
      this.selectedAll = false
      this.indeterminate = false
      this.loading = true
      if (this.queryType) this.queryParam.fileType = this.queryType === 'img' ? 0 : this.queryType === 'video' ? 1 : 2
      console.log(this.queryParam)
      getFileList(this.queryParam)
        .then(res => {
          if (res.code !== 200) throw res
          this.fileData = res.data.datas
          this.fileOptions = this.fileData.map(item => {
            return item.id
          })
          this.total = res.data.totalCount
        })
        .catch(err => {
          this.$message.error(err.msg || '获取文件列表失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchGroup() {
      this.groupLoading = true
      const params = {
        pageIndex: 1,
        pageSize: 1000
      }
      getFileGroupList(params)
        .then(res => {
          if (res.code !== 200) throw res
          let { datas } = res.data
          this.fileGroup = datas.map(item => {
            return {
              key: item.id,
              label: item.groupName,
              id: item.id
            }
          })
          datas = datas.map(item => {
            if (!item.parentGroupId) item.parentGroupId = 0
            return item
          })
          this.cateTree[0].children = this.treeTransfer(datas, 0)
        })
        .catch(err => {
          this.$message.error(err.msg || '获取分组数据失败')
        })
        .finally(() => {
          this.groupLoading = false
        })
    },
    treeTransfer(data, id) {
      function tree(pid, tid) {
        const arr = []
        data
          .filter(item => item.parentGroupId === pid)
          .forEach(item => {
            const obj = {
              title: item.groupName,
              key: `${tid}-${item.id}`,
              id: item.id,
              slots: { icon: 'file' },
              isEdit: false,
              scopedSlots: { title: 'custom' }
            }
            const child = tree(item.id, obj.key)
            if (child.length) {
              obj.children = child
            }
            arr.push(obj)
          })
        return arr
      }

      return tree(id, '0-0')
    },
    folderTreeTransfer(data, id) {
      function tree(pid, tid) {
        const arr = []
        data
          .filter(item => item.folderId === pid)
          .forEach(item => {
            const obj = {
              title: item.fileName,
              key: `${tid}-${item.id}`,
              slots: { icon: 'file' }
            }
            const child = tree(item.id, obj.key)
            if (child.length) {
              obj.children = child
            }
            arr.push(obj)
          })
        return arr
      }

      return tree(id, '0-0')
    },
    handleCopyLink(name) {
      const link = this.host + '/' + name
      this.$copyText(link).then(
        e => {
          this.$message.success('复制成功')
          console.log(e)
        },
        function(e) {
          this.$message.error('复制失败')
          console.log(e)
        }
      )
    },
    handleMoveFile(id) {
      this.selectedFileId = id
      this.visibleMoveFile = true
    },
    doMoveFile() {
      const arr = this.selectedMoveParent[0].split('-')
      const query = {
        newFolderId: arr[arr.length - 1]
      }
      const params = [this.selectedFileId]
      moveFile(query, params)
        .then(res => {
          if (res.code !== 200) throw res
          console.log(res)
          this.$message.success('操作成功')
          this.fetchFile()
          this.visibleMoveFile = false
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleDelFile(id) {
      const params = [id]
      const query = {
        isDelete: true
      }
      updateDelState(query, params)
        .then(res => {
          console.log(res)
          if (res.code !== 200) throw res
          this.$message.success('删除成功')
          this.fetchFile()
        })
        .catch(err => {
          this.$message.error(err.msg || '删除失败')
        })
    },
    handleDownload(name) {
      const link = this.host + '/' + name
      window.open(link)
    },
    doRecovery() {
      if (!this.checkedList.length) {
        this.$message.error('请至少选择一份文件')
        return false
      }
      this.$confirm({
        title: '恢复文件',
        content: '你确定要恢复这些文件吗？',
        onOk: () => {
          const query = {
            isDelete: false
          }
          updateDelState(query, this.checkedList)
            .then(res => {
              console.log(res)
              if (res.code !== 200) throw res
              this.$message.success('恢复成功')
              this.checkedList = []
              this.showRecycleBin()
            })
            .catch(err => {
              this.$message.error(err.msg || '恢复成功')
            })
        }
      })
    },
    doRemove() {
      if (!this.checkedList.length) {
        this.$message.error('请至少选择一份文件')
        return false
      }
      this.$confirm({
        title: '彻底删除文件',
        content: '你确定要彻底删除这些文件吗？彻底删除后将不可找回。',
        onOk: () => {
          removeFile(this.checkedList)
            .then(res => {
              console.log(res)
              if (res.code !== 200) throw res
              this.$message.success('删除成功')
              this.checkedList = []
              this.showRecycleBin()
            })
            .catch(err => {
              this.$message.error(err.msg || '删除失败')
            })
        }
      })
    },
    doDelete() {
      if (!this.checkedList.length) {
        this.$message.error('请至少选择一份文件')
        return false
      }
      this.$confirm({
        title: '删除文件',
        content: '你确定要删除这些文件吗，删除后可在回收站进行恢复',
        onOk: () => {
          const query = {
            isDelete: true
          }
          updateDelState(query, this.checkedList)
            .then(res => {
              console.log(res)
              if (res.code !== 200) throw res
              this.$message.success('删除成功')
              this.checkedList = []
              this.fetchFile()
            })
            .catch(err => {
              this.$message.error(err.msg || '删除失败')
            })
        }
      })
    },
    createNewFolder() {
      console.log(this.newFolder)
      const params = {
        groupId: this.currentGroupId || 0,
        folderId: this.queryParam.folderId || 0,
        fileName: this.newFolder,
        isFolder: true
      }
      addFile(params)
        .then(res => {
          console.log(res)
          if (res.code !== 200) throw res
          this.$message.success('新增成功')
          this.visibleNewFolder = false
          this.fetchFile()
        })
        .catch(err => {
          this.$message.error(err.msg || '新增失败')
        })
    },
    // 查询
    handleQuery() {
      if (this.selectedGroup !== 'all') {
        this.queryParam.groupId = this.selectedGroup
      } else {
        delete this.queryParam.groupId
      }
      if (this.selectedCate !== 'all') {
        this.queryParam.fileType = this.selectedCate
      } else {
        delete this.queryParam.fileType
      }
      if (this.fileKeyword) {
        this.queryParam.fileName = this.fileKeyword
      } else {
        delete this.queryParam.fileName
      }
      console.log(this.queryParam)
      this.fetchFile()
    },
    // 重置查询
    handleReset() {
      this.clearQueryParam()
      if (this.visibleRecycleBin) {
        this.queryParam.isDel = true
      }
      this.selectedCate = 'all'
      this.selectedGroup = 'all'
      this.fileKeyword = ''
      this.fetchFile()
    }
  }
}
</script>

<style scoped lang="less">
.bank {
  width: 100%;
  height: 100%;

  .bank-layout {
    width: 100%;
    height: 100%;
  }
}

.side-menu {
  background: #fff;
  padding: 20px;
}

.layout-content {
  padding: 20px;
}

.fileTree {
  .ant-tree-switcher {
    background: transparent !important;
  }

  .icon-wrap {
    margin-left: 5px;
  }

  .tree-icon {
    margin-right: 5px;
  }
}

.action-bar {
  display: block;
  margin: 20px 20px 20px 0;

  .action-btn {
    margin-left: 10px;
  }

  .view-mode {
    display: inline-block;
    margin-left: 10px;

    span {
      display: inline-block;
      width: 55px;
      height: 32px;
      cursor: pointer;
      line-height: 32px;
      background: #fff;
      text-align: center;

      &.active {
        background: #e6e6e6;
        color: #1691ff;
      }

      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}

.progress-bar {
  width: 280px;
}

.file-box {
  .title-box {
    padding: 5px 0;
    height: 32px;
    overflow-y: hidden;

    .size {
      color: #aaa;
    }
  }

  .item {
    position: relative;
    width: 140px;

    &:hover {
      .item-checkbox {
        display: block;
      }
    }

    .item-checkbox {
      display: none;
      position: absolute;
      left: 10px;
      top: 10px;
      z-index: 1;

      &.show {
        display: block;
      }
    }

    .item-img {
      display: block;
    }

    .item-img,
    .file-img,
    .file-video {
      width: 140px;
      height: 140px;
      overflow: hidden;
      border: 1px solid #ddd;
      outline: none;
    }

    .file-video {
      background: #333;
      position: relative;

      .play {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        width: 50px;
        height: 50px;
        border-radius: 25px;
        padding: 14px 10px 15px 17px;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
        z-index: 1;

        &:after {
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          border-left: 20px solid white;
        }
      }
    }

    .file-img {
      .anticon {
        font-size: 64px;
      }

      .file-folder {
        color: #70a9d1;
      }

      .file-pdf {
        color: #d17070;
      }
    }
  }

  .item-action {
    .anticon {
      margin-left: 5px;
      color: #00a0e9;
    }
  }

  .icon-btn {
    cursor: pointer;
  }

  &.list-style {
    .item {
      display: flex;
      width: 100%;
      align-items: center;
      padding-left: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
    }

    .item-checkbox {
      position: relative;
      display: block;
      left: auto;
      top: auto;
      margin-right: 20px;
    }

    .item-img,
    .file-img,
    .video-box,
    .file-video {
      display: flex;
      width: 50px;
      height: 50px;
      margin-right: 15px;
    }

    .video-box {
      .play {
        transform: scale(0.5);
        left: 0;
        top: 0;
      }
    }

    .file-img {
      .anticon {
        font-size: 20px;
      }
    }

    .title-box {
      display: inline-block;

      .folder-name {
        text-align: left;
      }

      .size {
        display: block;
      }
    }

    .item-action {
      display: block;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-80%);

      .anticon,
      .icon-btn {
        margin-left: 10px;
      }
    }
  }
}

.side-btn {
  border-top: 1px solid #ddd;
  padding: 10px;
  cursor: pointer;

  &.active {
    color: #40a9ff;

    .anticon {
      color: #40a9ff;
    }
  }

  .anticon {
    color: #333;
  }
}

.folder-name {
  display: block;
  text-align: center;
  width: 100%;
}

.breadcrumb {
  margin: 10px 0;
}

.preview-box {
  width: 720px;
  overflow: hidden;

  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
