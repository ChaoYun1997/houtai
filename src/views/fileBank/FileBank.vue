<template>
  <div class="bank" id="bankbox">
    <a-layout class="bank-layout">
      <a-layout-sider theme="light" class="side-menu">
        <a-tree
          class="fileTree"
          show-line
          :default-expanded-keys="['0-0']"
          :tree-data="cateTree"
          :selectedKeys.sync="selectedK"
        >
        </a-tree>
      </a-layout-sider>
      <a-layout>
        <a-layout-content class="layout-content">
          <a-card :bordered="false" title="文件查询">
            <a-row>
              <a-col :span="16">
                <a-form layout="inline">
                  <a-form-item>
                    <a-select placeholder="文件分类" v-model="selectedCate" style="width: 160px;margin-right:10px;">
                      <a-select-option value="all">全部分类</a-select-option>
                      <a-select-option v-for="item in fileCate" :key="item.id" :value="item.key">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select placeholder="文件分组" v-model="selectedGroup" style="width: 160px;margin-right:10px;">
                      <a-select-option value="all">全部分组</a-select-option>
                      <a-select-option v-for="item in fileGroup" :key="item.id" :value="item.key">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-input v-model="fileKeyword" placeholder="关键词搜索"></a-input>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="handleQuery">查询</a-button>
                    <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                  </a-form-item>
                </a-form>
              </a-col>
              <a-col :span="8" class="s-flex s-flex-end">
                <a-row class="progress-bar" :gutter="10">
                  <a-col :span="12">
                    <p style="margin-bottom: 0;text-align: center">{{ `${usedSize}M/${totalSize}M` }}</p>
                    <a-progress :percent="(usedSize / totalSize) * 100" :show-info="false" />
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" shape="round" @click="uploadPic">上传图片</a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
          <div class="action-bar">
            <a-row>
              <a-col :span="18">
                <a-checkbox v-model="selectedAll">全选</a-checkbox>
                <div class="view-mode">
                  <span :class="{ active: mode === 0 }" @click="mode = 0">
                    <a-icon type="appstore" theme="filled" />
                  </span>
                  <span :class="{ active: mode === 1 }" @click="mode = 1">
                    <a-icon type="bars" />
                  </span>
                </div>
                <a-button class="action-btn" @click="visibleNewFolder = true" shape="round">新建文件夹</a-button>
                <a-button class="action-btn" @click="doDelete" type="danger" shape="round">删除</a-button>
              </a-col>
              <a-col :span="6" class="s-flex s-flex-end">
                <span>数量：{{ total }}</span>
              </a-col>
            </a-row>
          </div>
          <a-card :bordered="false">
            <a-list
              class="file-box"
              :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 8 }"
              :data-source="fileData"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <div class="item">
                  <a-checkbox class="item-checkbox"></a-checkbox>
                  <img v-if="item.type === 1" class="item-img" :src="item.name" alt="" />
                  <div class="video-box file-video" v-else-if="item.type === 2">
                    <span class="play"></span>
                    <video width="140" height="140">
                      <source :src="item.name" />
                    </video>
                  </div>
                  <div v-else class="file-img s-flex s-flex-center s-flex-align-center">
                    <a-icon v-if="item.type === 0" class="file-folder" type="folder-open" />
                    <a-icon v-else class="file-pdf" type="file-pdf" />
                  </div>
                  <div class="title-box s-flex s-flex-between">
                    <span :class="{'text-center':item.type === 0}">
                      {{ item.title.length > 12 ? item.title.substring(0, 12) + '...' : item.title }}
                    </span>
                    <span class="size">{{ item.size }}</span>
                  </div>
                  <div v-if="item.type !== 0" class="s-flex s-flex-end item-action">
                    <a-icon type="download" @click="handleDownload(item.name)"/>
                    <a-icon type="link" @click="handleCopyLink(item.name)"/>
                    <a-icon type="export" @click="handleMoveFile(item.id)"/>
                    <a-icon type="delete" @click="handleDelFile(item.id)"/>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal v-model="visibleNewFolder" :centered="true" title="新建文件夹">
      <a-input placeholder="请输入文件夹名称" v-model="newFolder"></a-input>
      <template #footer>
        <a-button @click="visibleNewFolder = false">取消</a-button>
        <a-button @click="createNewFolder" type="primary">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const cateTree = [
  {
    title: '所有分类',
    key: '0-0',
    children: [
      {
        title: '产品图片',
        key: '0-0-0',
        children: [
          {
            title: 'iphone',
            key: '0-0-0-0'
          },
          {
            title: 'ipad',
            key: '0-0-0-1'
          },
          {
            title: 'mac',
            key: '0-0-0-2'
          }
        ]
      },
      {
        title: 'banner图片',
        key: '0-0-1'
      }
    ]
  }
]
export default {
  name: 'FileBank',
  data() {
    this.cateTree = cateTree
    return {
      selectedAll: false,
      selectedK: [],
      fileKeyword: '',
      selectedCate: 'all',
      selectedGroup: 'all',
      fileGroup: [],
      fileCate: [],
      mode: 0, // 0:图片模式 1:列表模式
      visibleNewFolder: false,
      newFolder: '',
      total: 666,
      fileData: [
        {
          id: 1,
          pid: 0,
          type: 1, // 0 文件夹  1 图片  2 视频  3 pdf
          name: 'test.jpg',
          title: 'iPhone主图',
          size: '800*800'
        },
        {
          id: 2,
          pid: 0,
          type: 2, // 0 文件夹  1 图片  2 视频  3 pdf
          name: 'https://www.baidu.com/1.mp4',
          title: '网球',
          size: '800*800'
        },
        {
          id: 2,
          pid: 0,
          type: 0, // 0 文件夹  1 图片  2 视频  3 pdf
          name: '产品图片',
          title: '产品图片',
          size: ''
        },
        {
          id: 2,
          pid: 0,
          type: 3, // 0 文件夹  1 图片  2 视频  3 pdf
          name: '产品图片',
          title: '白皮书',
          size: ''
        }
      ],
      usedSize: 1021.44,
      totalSize: 11222
    }
  },
  created() {
    this.$nextTick(() => {
      const winHeight = document.body.clientHeight - 64
      const footer = document.querySelector('.ant-layout-footer')
      const basicLayout = document.querySelector('.ant-pro-basicLayout-content')
      basicLayout.style.margin = 0
      document.querySelector('#bankbox').style.height = winHeight + 'px'
      footer.style.display = 'none'
    })
  },
  methods: {
    handleCopyLink() {},
    handleMoveFile() {},
    handleDelFile() {},
    handleDownload() {},
    uploadPic() {},
    doDelete() {},
    createNewFolder() {},
    // 查询
    handleQuery() {
      if (this.selectedGroup !== 'all') {
        this.queryParam.group = this.selectedGroup
      } else {
        delete this.queryParam.group
      }
      if (this.selectedCate !== 'all') {
        this.queryParam.catId = Number(this.selectedCate)
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
  background: #e8e8e8;
  padding: 20px;
}

.layout-content {
  padding: 20px;
}

.fileTree {
  .ant-tree-switcher {
    background: transparent !important;
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
      height: 30px;
      cursor: pointer;
      line-height: 30px;
      background: #fff;
      border-radius: 15px;
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
    .size{
      color:#aaa
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
        background: rgba(255, 255, 255, 0.2);

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
  .item-action{
    .anticon{
      margin-left: 5px;
      color: #00A0E9;
    }
  }
}
</style>
