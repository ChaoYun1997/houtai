<template>
  <div>
    <a-form-model
      ref="form"
      :hideRequiredMark="true"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-card :body-style="{ padding: '24px 32px' }" :bordered="false" class="margin-bottom">
        <h3 slot="title">基本信息</h3>
        <a-form-model-item style="margin-bottom: 0 !important" labelAlign="left" :colon="false" prop="name">
          <div slot="label" class="pt10 required">产品名称</div>
          <a-input v-model="form.name" />
          <a-checkbox class="upper-checkbox" :checked="isUpperCase" @change="handleUpperCase">
            词首字母大写
            <span class="info negativeTop">频繁修改产品名称直接影响SEO效果，请仔细斟酌后再提交。</span>
          </a-checkbox>
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false" prop="model">
          <div slot="label" class="pt10 required">产品型号</div>
          <a-input v-model="form.model" placeholder="请输入产品型号" />
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false" ref="category" prop="category">
          <div slot="label" class="pt10 required">产品类目</div>
          <a-select
            mode="multiple"
            placeholder="请选择产品类目"
            v-model="form.category"
            style="width: 360px"
            showArrow
            @change="handleCateSelect"
          >
            <a-select-option v-for="item in categoryOptions" :key="item.id">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false" prop="brand">
          <div slot="label" class="pt10">产品品牌</div>
          <a-input v-model="form.brand" placeholder="请输入产品品牌" />
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false" prop="code">
          <div slot="label" class="pt10">产品编码</div>
          <a-input v-model="form.code" placeholder="请输入产品编码" />
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" ref="intro" label="简要描述" prop="intro">
          <a-textarea v-model="form.intro" placeholder="请输入产品简介" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-form-model-item>
        <a-row>
          <a-col span="6">
            <a-form-model-item
              class="label-col"
              labelAlign="left"
              :colon="false"
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 16, offset: 2 }"
            >
              <div slot="label" class="pt10 required">产品状态</div>
              <a-select v-model="form.shelved">
                <a-select-option :value="1">上架</a-select-option>
                <a-select-option :value="0">下架</a-select-option>
              </a-select>
              <!--              <a-radio-group v-model="form.shelved">-->
              <!--                <a-radio :value="1">上架</a-radio>-->
              <!--                <a-radio :value="0">下架(访客不可见)</a-radio>-->
              <!--              </a-radio-group>-->
            </a-form-model-item>
          </a-col>
          <a-col span="8">
            <a-form-model-item
              class="label-col"
              :colon="false"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 16, offset: 2 }"
            >
              <div slot="label" class="pt10 required">产品标签</div>

              <a-select placeholder="请选择" v-model="form.tags" style="width: 160px" @change="handleTagSelect">
                <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.id">
                  {{ tag.name }}
                </a-select-option>
              </a-select>
              <!--              <template v-for="tag in tags">-->
              <!--                <a-checkable-tag-->
              <!--                  :key="tag"-->
              <!--                  :checked="selectedTags.indexOf(tag) > -1"-->
              <!--                  @change="checked => handleTagChange(tag, checked)"-->
              <!--                >-->
              <!--                  {{ tag }}-->
              <!--                </a-checkable-tag>-->
              <!--              </template>-->
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :bordered="false" class="margin-bottom">
        <h3 slot="title">SEO信息</h3>
        <a-form-model-item labelAlign="left" :colon="false" label="自定义URL" class="url">
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.productUrl" placeholder="请输入自定义URL"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="handleRecommendUrl">系统推荐</a-button>
            </a-col>
          </a-row>
          <div slot="extra">
            - URL必须以/开头，例如：/about-us.html
            <br />- 请勿使用以p+数字结尾结构的URL，跟系统分页规则冲突，例如：/prod-p2.html <br />-
            频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </div>
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false">
          <div slot="label" class="pt10">标题 Title</div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.keyword.pageTitle" placeholder="请输入页面标题" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item class="label-col" :colon="false" labelAlign="left">
          <div slot="label" class="pt3">
            <span>关键词 Keywords</span>
          </div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-input v-model="form.keyword.pageKeyword" placeholder="请输入页面关键词" />
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="handleAddPageTitle">系统添加</a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item class="label-col2" :colon="false" labelAlign="left">
          <div slot="label" class="pt3">
            <span>描述 Description</span>
          </div>
          <a-row :gutter="10">
            <a-col :span="18">
              <a-textarea
                v-model="form.keyword.pageDesc"
                placeholder="请输入页面描述"
                :auto-size="{ minRows: 2, maxRows: 2 }"
              />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" label="产品关键词" prop="keyword" class="keyword-box">
          <a-row>
            <a-col :span="10">
              <div ref="list" class="s-flex s-flex-start">
                <div>
                  <div ref="list" class="list-group-item keyword-input" v-for="(item, index) in form.keyword.words" :key="index">
                    <a-input v-model="item.keyword" placeholder="请输入关键词" />
                    <a-icon
                      v-show="form.keyword.words.length > 1"
                      class="keyword-action sort"
                      slot="addonAfter"
                      type="menu"
                      @click="handleSort"
                    />
                    <a-icon
                      v-show="form.keyword.words.length > 1"
                      slot="addonAfter"
                      type="close"
                      @click="handleDelKeyword(index)"
                    />
                  </div>
                </div>
                <a-button type="primary" class="keyword-btn" @click="handleKeywordChoose">系统选择</a-button>
              </div>
              <a-button icon="plus" v-show="form.keyword.words.length < 8" @click="handleAddKeyword">
                新增关键词
              </a-button>
            </a-col>
            <a-col :span="6">
              <!--              <a-card class="keyword-list" size="small">-->
              <!--                <div-->
              <!--                  slot="title"-->
              <!--                  style="cursor:pointer;"-->
              <!--                  class="s-flex s-flex-between"-->
              <!--                  @click="showKeyword = !showKeyword"-->
              <!--                >-->
              <!--                  关键词列表-->
              <!--                  <a-icon v-if="showKeyword" type="eye"></a-icon>-->
              <!--                  <a-icon v-else type="eye-invisible" />-->
              <!--                </div>-->
              <!--                <a-list-->
              <!--                  v-if="showKeyword"-->
              <!--                  class="list-box"-->
              <!--                  item-layout="horizontal"-->
              <!--                  :data-source="keywordList"-->
              <!--                  :loading="keywordListLoading"-->
              <!--                >-->
              <!--                  <a-list-item-->
              <!--                    class="list-content"-->
              <!--                    slot="renderItem"-->
              <!--                    key="item.id"-->
              <!--                    slot-scope="item"-->
              <!--                    @click="handleKeywordList(item.keyWord)"-->
              <!--                  >-->
              <!--                    <a-list-item-meta>-->
              <!--                      <span slot="title">{{ item.keyWord }}</span>-->
              <!--                    </a-list-item-meta>-->
              <!--                    <span slot="extra">{{ `(${item.associatedItemCount})` }}</span>-->
              <!--                  </a-list-item>-->
              <!--                </a-list>-->
              <!--                <span slot="actions" v-if="showKeyword">-->
              <!--                  <a-button type="link" @click="$router.push('/keyword/keyword-list')" size="small">-->
              <!--                    管理关键词-->
              <!--                  </a-button>-->
              <!--                </span>-->
              <!--              </a-card>-->
            </a-col>
          </a-row>
          <p class="info">
            -推荐填写3个以上的关键词，每个关键词的长度≤5个单词，长度不得超过100字符，单词之间不需要增加任何符号，直接空格表示。
          </p>
        </a-form-model-item>
      </a-card>
      <a-card :bordered="false" class="margin-bottom">
        <h3 slot="title">产品信息</h3>
        <a-form-model-item class="img-list" labelAlign="left" :colon="false" ref="img" prop="cover">
          <div slot="label" class="required">产品主图</div>
          <p>
            <a-upload
              class="img-uploader"
              :action="uploadUrl"
              :file-list="imgList"
              accept="image/*"
              :show-upload-list="false"
              :data="getUploadData"
              :before-upload="getUploadToken"
              @change="handleListUploadChange"
            >
              <a-button shape="round" type="primary" :loading="isUploading">浏览</a-button>
            </a-upload>
            <span
              v-if="picList.length < picLength"
              :class="{ 'link-btn': true, 'right-split': picList.length }"
              @click="showFileBank(0)"
            >
              从文件银行选取
            </span>
            <template v-if="picList.length">
              <span class="link-btn" @click="clearFile(0)">全部删除</span>
              <a-popconfirm placement="right">
                <template slot="title"> 删除对象不会影响文件银行内容 </template>
                <a-icon type="question-circle" />
              </a-popconfirm>
            </template>
          </p>
          <p class="info">
            单张图片不超过5M,支持JPEG,JPG,PNG格式；<br />
            建议图片大于640*640，主题鲜明、图片清晰、提升买家满意度；<br />
          </p>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <ul ref="piclist" class="pic-list" v-if="picList.length">
            <li v-for="(item, index) in picList" :key="index" @click="handlePicPreview(item.path)">
              <!--              <div class="operate">-->
              <!--                <a-icon type="eye"></a-icon>-->
              <!--              <a-icon type="delete"></a-icon>-->
              <!--              </div>-->
              <img :src="item.path" alt />
              <p class="s-flex s-flex-between">
                <span :title="item.name">{{
                  item.name.length > 6 ? item.name.substring(0, 6) + '...' : item.name
                }}</span>
                <span style="cursor: pointer" @click.stop="handleDelPic(index)">删除</span>
              </p>
            </li>
            <!--            <a-upload-->
            <!--              list-type="picture-card"-->
            <!--              class="img-uploader"-->
            <!--              :action="uploadUrl"-->
            <!--              :file-list="imgList"-->
            <!--              accept="image/*"-->
            <!--              :show-upload-list="false"-->
            <!--              :data="getUploadData"-->
            <!--              :before-upload="getUploadToken"-->
            <!--              @change="handleListUploadChange"-->
            <!--            >-->
            <!--              <div v-if="imgList.length < 8">-->
            <!--                <a-icon type="plus" />-->
            <!--                <div class="ant-upload-text">上传</div>-->
            <!--              </div>-->
            <!--            </a-upload>-->
          </ul>
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false">
          <div slot="label">添加水印</div>
          <a-radio-group v-model="watermarkOption" @change="onWatermarkChange">
            <a-radio :value="1"> 是 </a-radio>
            <a-radio :value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" class="label-col" :colon="false">
          <div slot="label" class="required">产品视频</div>

          <div>
            <!--            <a-upload-->
            <!--              v-if="videoList.length === 0"-->
            <!--              style="display: inline-block"-->
            <!--              name="file"-->
            <!--              ref="videoUploader"-->
            <!--              :action="uploadUrl"-->
            <!--              accept="video/*"-->
            <!--              :data="getVideoUploadData"-->
            <!--              :before-upload="getVideoUploadToken"-->
            <!--              @change="handleVideoListUploadChange"-->
            <!--            >-->
            <!--              <a-button> <a-icon type="upload" /> 上传视频 </a-button>-->
            <!--            </a-upload>-->
            <p>
              <span
                v-if="videoList.length < 1"
                :class="{ 'link-btn': true, 'right-split': videoList.length }"
                @click="showFileBank(1)"
              >
                从文件银行选取
              </span>
              <!--              <span class="link-btn" @click="useVideoLink = true">填写链接</span>-->
            </p>
            <div v-if="videoList.length > 0">
              <video class="video-preview" :src="videoList[0].path" controls />
              <div class="operate">
                <span class="link-btn" @click="replaceVideo">替换</span> |
                <span class="link-btn" @click="delVideo">删除</span>
              </div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item class="label-col" labelAlign="left" :colon="false" ref="video" prop="videoUrl">
          <div slot="label" class="required">视频链接</div>
          <a-input style="width: 600px" v-model="form.videoUrl" placeholder="请输入产品视频连接"></a-input>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" extra="属性名和属性值必须同时填写，如 Style: Luxury">
          <div slot="label" class="required">规格属性</div>
          <div class="addFieldBox" ref="attrList">
            <template v-for="(item, index) in form.customFields">
              <a-row :key="index" :gutter="10">
                <a-col :span="4">
                  <a-input v-model="item.name" placeholder="规格名" style="width: 100%" />
                </a-col>
                <a-col :span="19">
                  <a-input v-model="item.value" placeholder="规格值" style="width: 220px" />
                  <a-icon
                    @click="handleSetFieldUp(index)"
                    type="up"
                    :class="{ isSide: index === 0, iconBtn: true }"
                    style="margin-left: 20px; font-size: 16px"
                  />
                  <a-icon
                    @click="handleSetFieldDown(index)"
                    type="down"
                    :class="{ isSide: index === form.customFields.length - 1, iconBtn: true }"
                    style="margin-left: 20px; font-size: 16px"
                  />
                  <a-icon
                    type="delete"
                    style="margin-left: 20px; margin-left: 20px; font-size: 16px"
                    @click="handleDelField(index)"
                  ></a-icon>
                  <span
                    v-if="index !== 0"
                    style="margin-left: 20px; color: #40a9ff; cursor: pointer"
                    @click="handleSetFieldToTop(index)"
                  >
                    置顶
                  </span>
                  <!--                  <a-button type="danger" shape="circle" size="small" icon="delete" />-->
                </a-col>
              </a-row>
            </template>
          </div>
          <a-button @click="handleAddField">新增规格</a-button>
        </a-form-model-item>
        <a-form-model-item labelAlign="left" :colon="false" >
          <div slot="label" class="required">自定义字段</div>
          <div class="addFieldBox">
            <template v-for="(item, index) in form.custom">
              <a-row :key="index" :gutter="10">
                <a-col :span="4">
                  <a-input v-model="item.name" placeholder="key" style="width: 100%" />
                </a-col>
                <a-col :span="19">
                  <a-input v-model="item.value" placeholder="value" style="width: 220px" />
                  <a-icon
                    @click="handleSetCustomUp(index)"
                    type="up"
                    :class="{ isSide: index === 0, iconBtn: true }"
                    style="margin-left: 20px; font-size: 16px"
                  />
                  <a-icon
                    @click="handleSetCustomDown(index)"
                    type="down"
                    :class="{ isSide: index === form.custom.length - 1, iconBtn: true }"
                    style="margin-left: 20px; font-size: 16px"
                  />
                  <a-icon
                    type="delete"
                    style="margin-left: 20px; margin-left: 20px; font-size: 16px"
                    @click="handleDelCustom(index)"
                  ></a-icon>
                  <span
                    v-if="index !== 0"
                    style="margin-left: 20px; color: #40a9ff; cursor: pointer"
                    @click="handleSetCustomToTop(index)"
                  >
                    置顶
                  </span>
                  <!--                  <a-button type="danger" shape="circle" size="small" icon="delete" />-->
                </a-col>
              </a-row>
            </template>
          </div>
          <a-button @click="handleAddCustom">新增字段</a-button>
        </a-form-model-item>
      </a-card>
      <a-card :bordered="false" class="margin-bottom">
        <h3 slot="title">产品详情</h3>
        <a-form-model-item>
          <div class="panel-box">
            <div class="custom-desc">
              <template v-for="(item, index) in form.descs">
                <a-button
                  :class="{ 'a-btn': true, active: selectedDesc === index }"
                  size="large"
                  :key="index"
                  @click="handleDescBtn(index)"
                >
                  {{ item.name }}
                  <a-button icon="edit" @click.stop="handleDescEditBtn(item, index)" class="a-icon" />
                  <a-button
                    v-if="index !== 0"
                    icon="close"
                    @click.stop="handleDescDelBtnEdit(index)"
                    class="a-icon delete-icon"
                  />
                </a-button>
              </template>
              <a-button size="large" icon="plus" @click="visibleAddDesc = true"></a-button>
            </div>
            <!--            <x-editor v-model="form.desc" :val="form.desc"></x-editor>-->
            <tinymce ref="tinymce" v-model="form.desc" @handleBlur="handleBlur"></tinymce>
            <!--            <l-editor v-model="form.desc" @blur="handleEditorBlur" ref="leditor"></l-editor>-->
            <!--            <kind-editor-->
            <!--              @uploadImg="handleEditorUploadPic"-->
            <!--              :content="form.desc"-->
            <!--              :html="form.desc"-->
            <!--              :afterBlur="handleKEditorBlur"-->
            <!--              ref="kindeditor"-->
            <!--            ></kind-editor>-->
            <!--            <div v-for="(item, index) in form.descs" :key="index" v-if="selectedDesc === index">-->
            <!--              {{ `${index} - ${item.content}` }}-->
            <!--              <kind-editor-->
            <!--                @uploadImg="handleEditorUploadPic"-->
            <!--                :content="item.content"-->
            <!--                :html="item.content"-->
            <!--                :ref="'kindeditor' + index"-->
            <!--              ></kind-editor>-->
            <!--            </div>-->
          </div>
        </a-form-model-item>
      </a-card>
      <a-card :bordered="false">
        <h3 slot="title">相关内容</h3>
        <h4><b>相关产品列表</b></h4>
        <!--        <a-alert message="选出5~20篇与该产品相关联的产品展示在前台产品详情。" banner closable />-->
        <a-table
          :columns="relativeProductColumns"
          :row-key="(record) => record.id"
          :row-selection="relativeProductsSelection"
          :data-source="relativeProductsList"
        >
          <span slot="cate" slot-scope="text, record">
            <template v-for="(item, index) in record.catId">
              <span :key="index">{{ getCateName(item) }}<br /></span>
            </template>
          </span>
        </a-table>
        <div class="margin-top">
          <a-button type="primary" style="margin-right: 10px" @click="visibleProductRelative = true">新增</a-button>
          <a-button
            type="danger"
            v-if="relativeProductsList.length > 0"
            @click="cancelRelativeProducts"
            :disabled="relativeProductRowKeys.length === 0"
          >
            取消关联
          </a-button>
        </div>
        <!--        <a-card class="panel-box">-->
        <!--          <a-row :gutter="10">-->
        <!--            <a-col :span="24" class="article-list">-->
        <!--              <h5>已选择的相关产品</h5>-->
        <!--              <ul class="selected-articles">-->
        <!--                <template v-for="(item, index) in selectedProducts">-->
        <!--                  <li :key="index">-->
        <!--                    <span>{{ item.shopTitle }}</span>-->
        <!--                    <a-icon class="del-icon" type="close" @click="handleDelProduct(item.id)"></a-icon>-->
        <!--                  </li>-->
        <!--                </template>-->
        <!--              </ul>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </a-card>-->
        <br />
        <h4><b>相关文章列表</b></h4>
        <!--        <a-alert message="选出5~20篇与该产品相关联的文章展示在前台产品详情。" banner closable/>-->

        <a-table
          :columns="relativeArticleColumns"
          :row-selection="relativeArticlesSelection"
          :data-source="relativeArticlesList"
          :rowKey="(record) => record.id"
        >
          <span slot="cate" slot-scope="text, record">
            <template v-for="(item, index) in record.catId">
              <span :key="index">{{ getCateName(item) }}<br /></span>
            </template>
          </span>
        </a-table>
        <div class="margin-top">
          <a-button type="primary" style="margin-right: 10px" @click="visibleArticleRelative = true">新增</a-button>
          <a-button
            type="danger"
            v-if="relativeArticlesList.length > 0"
            @click="cancelRelativeArticles"
            :disabled="relativeArticleRowKeys.length === 0"
          >
            取消关联
          </a-button>
        </div>
      </a-card>

      <br />
      <a-form-model-item>
        <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-modal v-model="visibleKeywordChoose" title="关键词库" :width="600" centered>
      <a-input v-model="keywordSearch" style="width: 260px; margin-right: 10px"></a-input>
      <a-button @click="handleKeywordSearch" type="primary" style="margin-right: 10px">搜索</a-button>
      <a-button @click="handleResetKeywordSearch" type="">重置</a-button>
      <s-table
        class="keyword-table"
        size="small"
        ref="keywordTable"
        :rowKey="(record) => record.id"
        :columns="keywordColumns"
        :data="loadKeywordData"
        :rowSelection="keywordRowSelection"
      ></s-table>
      <div slot="footer">
        <a-button type="primary" @click="handleAppendKeyword" :disabled="!selectedKeywordRowKeys.length">
          添 加
        </a-button>
        <a-button @click="visibleKeywordChoose = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleFileBank" title="文件银行" :width="1000" centered @cancel="hideFileBank">
      <iframe :src="src" ref="iframe" width="950" height="600"></iframe>
      <div slot="footer">
        <a-button type="primary" @click="addFilesTo">确 定</a-button>
        <a-button @click="hideFileBank">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleArticleRelative" title="选择关联文章" centered>
      <a-select
        placeholder="全部分类"
        :options="articleCate"
        style="width: 160px"
        @change="handleArticleCateChange"
      ></a-select>
      <a-input-search
        placeholder="请输入文章标题"
        enter-button="搜索"
        style="width: 220px; margin-left: 10px"
        @search="onArticleSearch"
      />
      <s-table
        class="article-table"
        size="small"
        ref="articleTable"
        :pageSize="100"
        :rowKey="(record) => record.id"
        :scroll="{ y: 380 }"
        :columns="articleColumns"
        :data="loadArticleData"
        :rowSelection="articleRowSelection"
      ></s-table>
      <div slot="footer">
        <a-button type="primary" @click="addRelativeArticles">确 定</a-button>
        <a-button @click="visibleArticleRelative = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleProductRelative" title="选择关联产品" centered>
      <a-select
        placeholder="请选择产品分类"
        :options="categoryOptions"
        style="width: 160px"
        @change="handleProductCateChange"
      ></a-select>
      <a-input-search
        placeholder="请输入产品标题"
        enter-button="搜索"
        style="width: 220px; margin-left: 10px"
        @search="onProductSearch"
      />
      <s-table
        class="article-table"
        size="small"
        ref="productTable"
        :pageSize="100"
        :rowKey="(record) => record.id"
        :scroll="{ y: 380 }"
        :columns="productColumns"
        :data="loadProductData"
        :rowSelection="productRowSelection"
      ></s-table>
      <div slot="footer">
        <a-button type="primary" @click="addRelativeProducts">确 定</a-button>
        <a-button @click="visibleProductRelative = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleAddDesc" title="描述标题" centered @cancel="handleCancelAddDesc">
      <a-input v-model="newDescName" placeholder="请输入描述标题"></a-input>
      <div slot="footer">
        <a-button type="primary" @click="handleAddDesc" :disabled="newDescName === ''">确 定</a-button>
        <a-button @click="handleCancelAddDesc">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleAddItem" title="添加SKU" centered>
      <a-input placeholder="请输入SKU名称" v-model="newSku"></a-input>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleAddSku" :disabled="newSku === ''">确 定</a-button>
        <a-button @click="showAddSku = false">取 消</a-button>
      </div>
    </a-modal>
    <a-modal v-model="showCategoryModal" title="请选择产品分类">
      <a-checkbox-group :default-value="form.category" @change="onCategoryChange">
        <a-row>
          <template v-for="item in categoryOptions">
            <a-col :key="item.label">
              <a-checkbox :value="item.id" :disabled="item.id === 'all'">{{ item.label }}</a-checkbox>
            </a-col>
          </template>
        </a-row>
      </a-checkbox-group>
      <div slot="footer" class="model-footer">
        <a-button type="primary" @click="handleSelectCate" :disabled="selectedCate.length === 0">确 定</a-button>
        <a-button @click="showCategoryModal = false">取 消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getProducts, getUploadSign, addProduct, getProductDetail, updateProduct } from '@/api/products'
import { getProductCate, getArticleCate } from '@/api/category'
import { getKeyword } from '@/api/keyword'
import { getArticles } from '@/api/article'
import sortableJS from 'sortablejs'
import KindEditor from '@/components/Kindeditor'
import STable from '@/components/Table'
import moment from 'moment'
import { mapState } from 'vuex'
import { getRelativeArticles, getRelativeProducts } from '../../api/products'
// import LEditor from '@/components/LEditor'
// import XEditor from '@/components/XEditor'
import Tinymce from '@/components/Tinymce'
import { addFile } from '../../api/file'
const relativeProductColumns = [
  {
    title: '产品名称',
    dataIndex: 'shopTitle',
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
    align: 'center'
  }
]
const relativeArticleColumns = [
  {
    title: '文章名称',
    dataIndex: 'articleTitle',
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
    align: 'center'
  }
]

const articleColumns = [
  {
    title: '',
    dataIndex: 'articleTitle',
    scopedSlots: { customRender: 'title' }
  }
]
const productColumns = [
  {
    title: '',
    dataIndex: 'shopTitle',
    scopedSlots: { customRender: 'title' }
  }
]

const items = ['color', 'size', 'type']
const keywordColumns = [
  {
    title: '关键词',
    dataIndex: 'keyWord'
  }
]
export default {
  name: 'Detail',
  components: {
    STable,
    KindEditor,
    // LEditor,
    // XEditor,
    Tinymce,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    this.items = items
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    this.relativeProductColumns = relativeProductColumns
    this.relativeArticleColumns = relativeArticleColumns
    this.keywordColumns = keywordColumns
    return {
      visibleKeywordChoose: false,
      keywordSearch: '',
      keywordQuery: {},
      selectedKeywords: [],
      selectedKeywordRowKeys: [],
      loadKeywordData: (parameter) => {
        parameter = Object.assign(parameter, this.keywordQuery)
        return getKeyword(parameter)
      },

      editorConfig: {
        // The configuration of the editor.
      },
      src: '',
      iframeWin: {},
      queryType: null,
      visibleFileBank: false,
      visibleProductRelative: false,
      visibleArticleRelative: false,
      editDesc: '',
      newDescName: '',
      visibleAddDesc: false,
      selectedDesc: 0,
      submitLoading: false,
      visibleAddItem: false,
      newSku: '',
      queryArticle: {},
      queryArticleCate: {},
      loadArticleData: (parameter) => {
        parameter = Object.assign(parameter, this.queryArticle)
        return getArticles(parameter)
      },
      queryProduct: {
        pageIndex: 1,
        pageSize: 100
      },
      queryProductCate: {},
      loadProductData: (parameter) => {
        parameter = Object.assign(parameter, this.queryProduct)
        return getProducts(parameter)
      },
      articleData: [], // 文章数据
      productData: [], // 产品数据
      pagination: {
        size: 'small'
      },
      articleCate: [
        {
          label: '全部',
          value: 'all',
          id: 'all'
        }
      ], // 文章分类
      selectedArticles: [], // 已关联文章列表
      selectedArticleRowKeys: [], // 已选择文章id
      relativeArticles: [], // 已选择的关联文章列表
      relativeArticleRowKeys: [], // 已选择的关联文章id
      relativeArticlesList: [],

      selectedProducts: [], // 已选择产品内容
      selectedProductRowKeys: [], // 已选择产品id
      relativeProducts: [], // 已选择的关联产品列表
      relativeProductRowKeys: [], // 已选择的关联产品id
      relativeProductsList: [],

      content: '',
      tags: [
        {
          id: '0',
          name: '推荐产品'
        },
        {
          id: '1',
          name: '最新产品'
        },
        {
          id: '2',
          name: '热门产品'
        }
      ],
      selectedTag: '',
      selectedTags: [],
      uploadUrl: process.env.VUE_APP_QINIU_HOST,
      isUploading: false,
      picToken: '',
      fileName: '',
      coverImg: [],
      imageUrl: '',
      showImage: false,
      coverLoading: false,
      previewCover: '',
      imgList: [],
      picLength: 8,
      picList: [],
      coverList: [],
      coverVisible: false,
      previewImage: [],
      previewVisible: false,
      videoList: [],
      videoToken: '',
      videoFileName: '',

      enabled: true, // 关键词拖动排序开关
      dragging: false, // 关键词拖动

      keywordList: [], // 关键词列表
      keywordListLoading: true, // 关键词列表加载动画
      showKeyword: false,

      showSeo: true,
      showCategoryModal: false, // 显示选择分类
      categoryLoading: true,
      selectedCate: [],
      categoryOptions: [
        {
          label: '全部',
          value: 'all',
          id: 'all'
        }
      ],
      shopSku: [
        {
          skuName: '',
          skuInventory: 0,
          skuValues: [
            {
              skuValueName: '',
              skuInventory: 0,
              skuValueImg: ''
            }
          ]
        }
      ],
      productId: this.$route.params.id,
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
      isUpperCase: false,
      editorOptions: {
        width: '700px',
        height: '400px'
      },
      // 产品表单
      watermarkOption: 1,
      useVideoLink: false,
      form: {
        name: '',
        modal: '',
        productUrl: '',
        urlValue: 'a',
        keyword: {
          words: [{ keyword: '' }],
          pageTitle: '',
          pageKeyword: '',
          pageDesc: ''
        },
        category: [],
        shopImg: '', // 产品主图
        shopImgList: [], // 产品图片列表
        pics: [],
        videoUrl: '',
        intro: '',
        model: '',
        brand: '',
        code: '',
        customFields: [
          {
            name: '',
            value: ''
          }
        ],
        custom: [
          {
            name: '',
            value: '',
            sort: 0
          }
        ],
        sku: {
          stock: 10,
          pic: '',
          attr: [
            {
              name: 'color',
              vals: [{ value: 'yellow' }, { value: 'white' }]
            }
          ]
        },
        desc: '',
        descs: [
          {
            name: 'Details',
            content: ''
          }
        ],
        status: {
          val: 1, // 默认1 上架状态
          tmallLink: '',
          jdLink: '',
          amazonLink: '',
          smtLink: '',
          dhwLink: '',
          wechatLink: ''
        },
        articles: [],
        linkProducts: [],
        shelved: 1,
        tags: null
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入产品型号', trigger: 'blur' }],
        category: [{ required: true, message: '请选择产品类目', trigger: 'blur' }]
      },
      recervingItems: []
    }
  },
  watch: {
    'form.desc'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.descs[this.selectedDesc].content = this.form.desc
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
    }),
    // 已选择产品列表
    relativeProductsSelection() {
      return {
        selectedRowKeys: this.relativeProductRowKeys,
        onChange: this.onrelativeProductSelect
      }
    },
    // 产品列表
    productRowSelection() {
      return {
        selectedRowKeys: this.selectedProductRowKeys,
        onChange: this.onProductSelectChange
      }
    },
    // 已选择文章列表
    relativeArticlesSelection() {
      return {
        selectedRowKeys: this.relativeArticleRowKeys,
        onChange: this.onrelativeArticleSelect
      }
    },
    // 文章列表
    articleRowSelection() {
      return {
        selectedRowKeys: this.selectedArticleRowKeys,
        onChange: this.onArticleSelectChange
      }
    },
    // 关键词列表
    keywordRowSelection() {
      return {
        selectedRowKeys: this.selectedKeywordRowKeys,
        onChange: this.onKeywordSelectChange
      }
    }
  },
  created() {
    const { id } = this.$route.params
    const { copy, keyword } = this.$route.query
    if (id || copy) {
      this.loadProductDetail(id || copy)
    }

    if (keyword) {
      this.form.keyword.words[0] = { keyword: keyword }
    }

    this.loadKeyword()
    // this.loadArticles()
    // this.loadProducts()
  },
  mounted() {
    this.loadCategory()

    this.$nextTick(() => {
      // 在外部 Vue 的 window 上添加 postMessage 的监听，并且绑定处理函数 handleMessage
      window.addEventListener('message', this.handleMessage)
    })
    const that = this
    // eslint-disable-next-line no-unused-vars
    const sortable = sortableJS.create(this.$refs.list, {
      sort: true,
      animation: 300,
      onEnd: function (evt) {
        // 拖拽结束发生该事件
        that.form.keyword.words.splice(evt.newIndex, 0, that.form.keyword.words.splice(evt.oldIndex, 1)[0])
        var newArray = that.form.keyword.words.slice(0)
        that.form.keyword.words = []
        that.$nextTick(function () {
          that.form.keyword.words = newArray
          console.log(that.form.keyword.words)
        })
      }
    })

    // eslint-disable-next-line no-unused-vars
    const sortableAttr = sortableJS.create(this.$refs.attrList, {
      sort: true,
      animation: 300,
      onEnd: function (evt) {
        // 拖拽结束发生该事件1
        that.form.customFields.splice(evt.newIndex, 0, that.form.customFields.splice(evt.oldIndex, 1)[0])
        var newArray = that.form.customFields.slice(0)
        that.form.customFields = []
        that.$nextTick(function () {
          that.form.customFields = newArray
        })
      }
    })
  },
  destroyed() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    handleResetKeywordSearch() {
      this.keywordSearch = ''
      this.keywordQuery = {}
      this.$refs.keywordTable.refresh(true)
    },
    handleKeywordSearch() {
      console.log('search')
      this.keywordQuery.KeywordName = this.keywordSearch
      this.$refs.keywordTable.refresh(true)
    },
    handleAppendKeyword() {
      this.form.keyword.words = this.form.keyword.words.filter((item) => item.keyword !== '')
      console.log(this.form.keyword.words)
      const length = this.form.keyword.words.length
      if (length >= 8) return false
      const limit = 8 - length
      this.selectedKeywords.forEach((item, index) => {
        if (index >= limit) return
        this.form.keyword.words.push({ keyword: item.keyWord })
      })
      this.visibleKeywordChoose = false
      this.selectedKeywords = []
      this.selectedKeywordRowKeys = []
    },
    handleBlur(content) {
      console.log(content)
    },
    handleRecommendUrl() {
      if (!this.form.name) {
        this.$message.error('内容根据产品名称生成，请先填写产品名称')
        return
      }
      const nameArr = this.form.name.split(' ')
      this.form.productUrl = nameArr.join('-') + '.html'
    },
    handleAddPageTitle() {
      if (!this.form.name) {
        this.$message.error('内容根据产品名称、品牌、型号等生成，请先填写')
        return
      }
      this.form.keyword.pageKeyword =
        this.form.name + ' ' + this.form.brand + ' ' + this.form.code + ' ' + this.form.model
    },
    addFilesTo() {
      console.log(this.recervingItems)
      this.visibleFileBank = false
      this.src = ''
      const host = process.env.VUE_APP_HOST
      if (this.queryType === 0) {
        const len = this.picLength - this.picList.length
        const items = []
        for (let i = 0; i < len && i < this.recervingItems.length; i++) {
          items.push({
            path: host + '/' + this.recervingItems[i].fileDownloadName,
            name: this.recervingItems[i].fileDownloadName
          })
        }
        console.log(items)
        this.picList = this.picList.concat(items)
      } else {
        this.videoList.push({
          path: host + '/' + this.recervingItems[0].fileDownloadName,
          name: this.recervingItems[0].fileDownloadName
        })
      }
    },
    hideFileBank() {
      this.src = ''
      this.visibleFileBank = false
    },
    clearFile(type) {
      console.log(type)
      if (type === 0) {
        this.picList = []
      } else if (type === 1) {
        this.videoList = []
      }
    },
    showFileBank(type) {
      const files = ['img', 'video', 'pdf']
      this.src = '/fileBank/list/' + files[type]
      this.visibleFileBank = true
      this.queryType = type
      this.$nextTick(() => {
        this.sendMessage(type)
      })
    },
    sendMessage(type) {
      // 外部vue向iframe内部传数据
      console.log(this.$refs.iframe)
      this.iframeWin = this.$refs.iframe.contentWindow
      this.iframeWin.postMessage(
        {
          cmd: 'doSomething',
          params: {
            type: type
          }
        },
        '*'
      )
    },
    handleMessage(event) {
      // 根据上面制定的结构来解析 iframe 内部发回来的数据
      const data = event.data
      switch (data.cmd) {
        case 'ready-for-receiving':
          // 业务逻辑
          break
        case 'recerving-item':
          console.log(data.item)
          this.recervingItems = data.item
          break
      }
    },
    onWatermarkChange(e) {
      this.form.isWatermarkOpen = e.target.value === 1
    },
    handleAddField() {
      this.form.customFields.push({
        name: '',
        value: '',
        sort: this.form.customFields.length
      })
      console.log(this.form.customFields)
    },
    handleAddCustom() {
      this.form.custom.push({
        name: '',
        value: '',
        sort: this.form.custom.length
      })
      console.log(this.form.custom)
    },
    handleDelField(index) {
      this.form.customFields.splice(index, 1)
      this.formatCustomSort('customFields')
    },
    handleSetFieldUp(index) {
      if (index === 0) return false
      const temp = this.form.customFields[index]
      this.form.customFields.splice(index, 1)
      this.form.customFields.splice(index - 1, 0, temp)
      this.formatCustomSort('customFields')
    },
    handleSetFieldDown(index) {
      if (index === this.form.customFields.length - 1) return false
      const temp = this.form.customFields[index]
      this.form.customFields.splice(index, 1)
      this.form.customFields.splice(index + 1, 0, temp)
      this.formatCustomSort('customFields')
    },
    handleSetFieldToTop(index) {
      const temp = this.form.customFields[index]
      console.log(index, temp)
      this.form.customFields.splice(index, 1)
      this.form.customFields.unshift(temp)
      this.formatCustomSort('customFields')
    },
    handleSetCustomUp(index) {
      if (index === 0) return false
      const temp = this.form.custom[index]
      this.form.custom.splice(index, 1)
      this.form.custom.splice(index - 1, 0, temp)
      this.formatCustomSort('custom')
    },
    handleDelCustom(index) {
      this.form.custom.splice(index, 1)
      this.formatCustomSort('custom')
    },
    handleSetCustomDown(index) {
      if (index === this.form.custom.length - 1) return false
      const temp = this.form.custom[index]
      this.form.custom.splice(index, 1)
      this.form.custom.splice(index + 1, 0, temp)
      this.formatCustomSort('custom')
    },
    handleSetCustomToTop(index) {
      const temp = this.form.custom[index]
      console.log(index, temp)
      this.form.custom.splice(index, 1)
      this.form.custom.unshift(temp)
      this.formatCustomSort('custom')
    },
    formatCustomSort(field) {
      this.form[field].forEach((item, index) => {
        item.sort = index
      })
      console.log(this.form[field])
    },
    // sku 选择
    handleSkuChange(value, index) {
      const isKeyExisted = this.shopSku.findIndex((item) => {
        console.log(item.skuName, value)
        return item.skuName === value
      })
      console.log(isKeyExisted, index)
      if (isKeyExisted !== -1) {
        this.$warning({
          content: '不能选择相同的规格'
        })
        this.shopSku[index].skuName = ''
        return false
      }
      this.shopSku[index].skuName = value
    },
    handleSkuFileChange(index) {
      console.log(`selected ${index}`)
    },
    handleAddSku() {
      if (!this.newSku) {
        const isKeyExisted = this.shopSku.findIndex((item) => {
          return item.skuName === this.newSku
        })
        if (isKeyExisted !== -1) {
          this.$warning({
            content: '请不要重复添加相同的规格'
          })
          this.newSku = ''
          return false
        }
        this.items.push(this.newSku)
      }
    },
    handleDelSku(index) {
      console.log('del sku')
      this.$confirm({
        content: '确定要删除该SKU吗',
        centered: true,
        onOk: () => {
          this.form.sku.attr.splice(index, 1)
        }
      })
    },
    handleDelSkuVal(sku, index) {
      console.log(`del val ${index}`)
      sku.vals.splice(index, 1)
    },
    handleAddSkuBox() {
      this.form.sku.attr.push({
        name: '',
        vals: []
      })
    },
    handleAddSkuValue(item) {
      console.log(item)
      item.push({
        value: '',
        stock: null,
        pic: ''
      })
    },
    isKeyExisted(key, obj) {
      return true
    },
    handleSkuInputBlur(item, val, index) {
      const isExist = item.vals.filter((i) => {
        return i.value === val
      })
      console.log(isExist)
      if (isExist.length > 1) {
        this.$warning({
          content: '请不要输入已存在的值'
        })
        item.vals[index].value = ''
      }
    },
    delVal(index, i) {
      this.shopSku[index].skuValues.splice(i, 1)
    },
    delRow(index) {
      this.shopSku.splice(index, 1)
    },
    handleAddSkuVal(index) {
      this.shopSku[index].skuValues.push({
        skuValueName: '',
        skuInventory: '',
        skuValueImg: ''
      })
    },
    handleAddSkuObj() {
      this.shopSku.push({
        skuName: '',
        skuInventory: 0,
        skuValues: [
          {
            skuValueName: '',
            skuInventory: 0,
            skuValueImg: ''
          }
        ]
      })
    },
    loadProductDetail(id) {
      getProductDetail({ id }).then((res) => {
        const { form } = this
        const { data } = res
        form.name = data.shopTitle
        form.productUrl = data.shopUrl
        form.keyword.words = data.shopKeyWords.map((item) => {
          // 关键词
          return { keyword: item }
        })
        form.keyword.pageTitle = data.seoTitle // seo标题
        form.keyword.pageKeyword = data.seoKeyWords // seo关键词
        form.keyword.pageDesc = data.seoDescription // seo描述
        const host = process.env.VUE_APP_HOST
        this.picList = data.shopImgList.map((item) => {
          // 产品图片
          const name = item.split('/')
          return {
            path: host + '/' + item,
            name: name[name.length - 1]
          }
        })
        // form.shopImg = data.shopImg
        form.category = data.catId
        if (data.shopVideoUrl) {
          if (data.shopVideoUrl.match(host)) {
            const videoArr = data.shopVideoUrl.split('/')
            this.videoList.push({
              path: data.shopVideoUrl,
              name: videoArr[videoArr.length - 1].split('.')[0]
            })
          } else {
            form.videoUrl = data.shopVideoUrl
          }
        }
        // if (data.shopVideoUrl) {
        //   this.useVideoLink = true
        // }
        form.intro = data.shopDesc
        form.brand = data.shopBrand
        form.code = data.shopNumber
        form.model = data.shopModel

        form.descs = data.shopDescribe
        form.desc = data.shopDescribe[0].content

        form.customFields = data.shopAttribute
        form.custom = data.shopCustomProp
        this.fetchRelativeArticles(data.id)
        this.fetchRelativeProducts(data.id)
        // this.selectedArticleRowKeys = data.relatedAids
        // this.selectedProductRowKeys = data.relatedShopIds
        form.shelved = data.isShelve ? 1 : 0
        form.tags = data.isRecommend ? '0' : data.isNew ? '1' : data.isHot ? '2' : null
      })
    },
    setDesc(desc) {
      this.$refs.kindeditor.editor.html(desc)
    },
    // 文章相关
    handleDelArticle(id) {
      console.log(id, this.selectedArticleRowKeys)
      this.selectedArticleRowKeys.forEach((item, index) => {
        if (id === item) {
          this.selectedArticleRowKeys.splice(index, 1)
          this.selectedArticles.splice(index, 1)
        }
      })
    },
    onArticleSelectChange(selectedRowKeys, selectedRows) {
      this.selectedArticleRowKeys = selectedRowKeys
      this.selectedArticles = selectedRows
    },
    onKeywordSelectChange(selectedRowKeys, selectedRows) {
      this.selectedKeywordRowKeys = selectedRowKeys
      this.selectedKeywords = selectedRows
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      this.selectedProductRowKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },
    onrelativeProductSelect(selectedRowKeys, selectedRows) {
      this.relativeProductRowKeys = selectedRowKeys
      this.relativeProducts = selectedRows
    },
    onrelativeArticleSelect(selectedRowKeys, selectedRows) {
      this.relativeArticleRowKeys = selectedRowKeys
      this.relativeArticles = selectedRows
    },
    loadArticleCate() {
      getArticleCate({
        pageSize: 100,
        pageIndex: 1
      }).then((res) => {
        const result = res.data.datas
        if (result.length > 0) {
          result.forEach((item) => {
            this.articleCate.push({
              value: item.id,
              label: item.catName,
              id: item.id
            })
          })
        }
      })
    },
    loadProducts() {
      getProducts().then((res) => {
        this.productData = res.result.data
      })
    },
    handleDescBtn(index) {
      // this.setDesc(this.form.descs[index].content)
      this.selectedDesc = index
      this.form.desc = this.form.descs[index].content
      this.$refs.tinymce.setContent(this.form.desc)
    },
    handleDescDelBtnEdit(index) {
      console.log('del', this.form.descs)
      this.form.descs.splice(index, 1)
      this.$refs.tinymce.setContent(this.form.descs[0].content)
      this.selectedDesc = 0
    },
    handleDescEditBtn(item, index) {
      console.log('edit')
      this.editDesc = index
      this.newDescName = item.name
      this.visibleAddDesc = true
    },
    handleAddDesc() {
      // 编辑现有描述标题
      if (this.editDesc !== '') {
        this.form.descs[this.editDesc].name = this.newDescName
        this.newDescName = ''
        this.editDesc = ''
        this.visibleAddDesc = false
        return
      }

      // 新增描述
      this.form.descs.push({
        name: this.newDescName,
        content: ''
      })
      this.selectedDesc = this.form.descs.length - 1
      this.$refs.tinymce.setContent('')
      this.form.desc = ''
      this.newDescName = ''
      this.visibleAddDesc = false
    },
    handleCancelAddDesc() {
      this.visibleAddDesc = false
      this.editDesc = ''
      this.newDescName = ''
    },
    handleTagSelect(value) {
      console.log(`Selected: ${value}`)
      // ['推荐产品', '最新产品', '热门产品']
      // this.selectedTag = value === '推荐产品' ? '0' : value === '最新产品' ? '1' : '2'
    },
    handleCateSelect(value) {
      console.log(`Selected: ${value}`)
      this.form.category = value
    },
    addRelativeArticles() {
      this.relativeArticlesList = this.selectedArticles
      console.log(this.relativeArticlesList)
      this.visibleArticleRelative = false
    },
    addRelativeProducts() {
      this.relativeProductsList = this.selectedProducts
      console.log(this.relativeProductsList)
      this.visibleProductRelative = false
    },
    fetchRelativeArticles(id) {
      getRelativeArticles({ id })
        .then((res) => {
          this.relativeArticlesList = res.data
          this.selectedArticleRowKeys = res.data.map((item) => item.id)
        })
        .catch((err) => {
          this.$message.error(err.msg || '获取相关联文章失败')
        })
    },
    fetchRelativeProducts(id) {
      getRelativeProducts({ id })
        .then((res) => {
          this.relativeProductsList = res.data
          this.selectedProductRowKeys = res.data.map((item) => item.id)
        })
        .catch((err) => {
          this.$message.error(err.msg || '获取相关联产品失败')
        })
    },
    handleDelProduct(id) {
      this.selectedProductRowKeys.forEach((item, index) => {
        if (id === item) {
          this.selectedProductRowKeys.splice(index, 1)
          this.selectedProducts.splice(index, 1)
        }
      })
    },
    cancelRelativeProducts() {
      this.relativeProductRowKeys.forEach((key) => {
        this.selectedProductRowKeys = this.selectedProductRowKeys.filter((item) => item !== key)
        this.relativeProductsList = this.relativeProductsList.filter((item) => item.id !== key)
      })
      this.selectedProducts = this.relativeProductsList
      this.relativeProductRowKeys = []
    },
    cancelRelativeArticles() {
      console.log(this.relativeArticleRowKeys)
      this.relativeArticleRowKeys.forEach((key) => {
        this.selectedArticleRowKeys = this.selectedArticleRowKeys.filter((item) => item !== key)
        this.relativeArticlesList = this.relativeArticlesList.filter((item) => item.id !== key)
      })
      this.selectedArticles = this.relativeArticlesList
      this.relativeArticleRowKeys = []
    },
    handleTagChange(tag, checked) {
      const { selectedTags } = this
      const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag)
      console.log('You are interested in: ', nextSelectedTags)
      this.selectedTags = nextSelectedTags
    },
    handleArticleCateChange(value) {
      if (value === 'all') {
        delete this.queryArticle.catId
      } else {
        this.queryArticle.catId = value
      }
      this.$refs.articleTable.refresh(true)
    },
    handleProductCateChange(value) {
      if (value === 'all') {
        delete this.queryProduct.catId
      } else {
        this.queryProduct.catId = value
      }
      this.$refs.productTable.refresh(true)
    },
    onArticleSearch(value) {
      this.queryArticle.keyWords = value
      this.$refs.articleTable.refresh(true)
    },
    onProductSearch(value) {
      this.queryProduct.keyWords = value
      this.$refs.productTable.refresh(true)
    },
    // 获取编辑器内容
    getContent(content) {
      console.log('content', content)
      this.form.desc = content
    },
    handleKEditorBlur() {
      console.log(this.$refs.kindeditor.outContent)
      this.form.descs[this.selectedDesc].content = this.$refs.kindeditor.outContent
    },
    // 编辑器上传图片
    async handleEditorUploadPic(file) {
      const size = file.size / 1024 / 1024
      if (size > 2) {
        this.$message.warning('图片不能大于2MB')
        return
      }
      const paramUploadSign = {
        type: 1
      }
      const { data } = await getUploadSign(paramUploadSign)
      try {
        const formData = new FormData()
        formData.append('token', data.token)
        formData.append('key', data.fileName)
        formData.append('file', file)
        const d = await this.$http.post(this.uploadUrl, formData)
        console.log(d.name)
        let imgUrl = process.env.VUE_APP_HOST
        if (d.name) {
          imgUrl = imgUrl + '/' + d.name
        }
        this.$refs.kindeditor.editor.appendHtml(`<img style="max-width:100%;" src="${imgUrl}">`)
      } catch (e) {
        console.log(e)
        this.$message.error('上传图片出错')
      }
    },
    categoryLabel(id) {
      const cate = this.categoryOptions.find((item) => {
        return item.id === id
      })
      if (!cate) return
      return cate.label
    },
    // 加载关键词数据
    loadKeyword() {
      getKeyword({ pageIndex: 1, pageSize: 100 }).then((res) => {
        this.keywordListLoading = false
        this.keywordList = res.data.datas
      })
    },
    getCateName(cate) {
      if (!cate.length) return ''
      const name = []
      cate.forEach((item) => {
        const target = this.categoryOptions.find((i) => i.id === item)
        if (!target) return
        name.push(target.label)
      })
      return name
    },
    // 加载分类数据
    loadCategory() {
      getProductCate({
        pageIndex: 1,
        pageSize: 100
      }).then((res) => {
        res.data.datas.forEach((item) => {
          this.categoryOptions.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
      this.loadArticleCate()
    },
    handleDelKeyword(index) {
      this.form.keyword.words.splice(index, 1)
    },
    handleSort() {
      console.log('del')
    },
    handleKeywordChoose() {
      this.visibleKeywordChoose = true
    },
    handleAddKeyword() {
      console.log(this.form.keyword.words.length)
      this.form.keyword.words.push({ keyword: '' })
    },
    handleKeywordList(keyword) {
      const length = this.form.keyword.words.length
      if (length >= 8) return false
      if (this.form.keyword.words[length - 1].keyword !== '') {
        this.form.keyword.words.push({ keyword: keyword })
        return
      }
      this.form.keyword.words[length - 1].keyword = keyword
    },
    handleNameChange() {
      console.log(this.form.name)
      if (this.isUpperCase) {
        this.form.name = this.setFirstCharToUpperCase(this.form.name)
      } else {
        this.form.name = this.setFirstCharToLowerCase(this.form.name)
      }
    },
    handleUpperCase(e) {
      this.isUpperCase = !this.isUpperCase
      if (!this.form.name) return
      if (e.target.checked) {
        const name = this.form.name.trim()
        this.form.name = this.setFirstCharToUpperCase(name)
      } else {
        const name = this.form.name.trim()
        this.form.name = this.setFirstCharToLowerCase(name)
      }
    },
    setFirstCharToLowerCase(name) {
      const nameArr = name.trim().split(' ')
      const result = []
      nameArr.forEach((word) => {
        let firstChar = word.substring(0, 1)
        if (/[A-Z]/.test(firstChar)) {
          firstChar = firstChar.toLowerCase()
          result.push(firstChar + word.substring(1, word.length))
        } else result.push(word)
      })
      return result.join(' ')
    },
    setFirstCharToUpperCase(name) {
      const nameArr = name.split(' ')
      const result = []
      nameArr.forEach((word) => {
        let firstChar = word.substring(0, 1)
        if (/[a-z]/.test(firstChar)) {
          firstChar = firstChar.toUpperCase()
          result.push(firstChar + word.substring(1, word.length))
        } else result.push(word)
      })
      return result.join(' ')
    },
    // 产品主图
    uploadCover(info) {
      this.coverLoading = true
      this.imageUrl = this.getObjectURL(info.file)
      const fd = new FormData()
      fd.append('key', this.fileName)
      fd.append('token', this.picToken)
      fd.append('file', info.file)
      this.$http.post(this.uploadUrl, fd).then((res) => {
        this.form.shopImg = res.name
        this.showImage = true
        this.coverLoading = false
        console.log(res.name)
      })
    },
    async getVideoUploadToken() {
      // 获取视频上传凭证
      const param = {
        type: 2
      }
      await getUploadSign(param)
        .then((res) => {
          if (res.code === 200) {
            this.videoToken = res.data.token
            this.videoFileName = res.data.fileName
          } else {
            throw res
          }
        })
        .catch((err) => {
          this.$message.error(err.msg)
        })
    },
    async getUploadToken() {
      this.isUploading = true
      // 获取图片上传凭证
      const param = {
        type: 1
      }
      await getUploadSign(param)
        .then((res) => {
          if (res.code === 200) {
            this.picToken = res.data.token
            this.fileName = res.data.fileName
          } else {
            throw res
          }
        })
        .catch((err) => {
          this.$message.error(err.msg)
          this.isUploading = false
        })
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
    beforeCoverChange(file, fileList) {
      this.coverImg = fileList
      return false
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePicPreview(url) {
      this.previewImage = url
      this.previewVisible = true
    },
    handleDelPic(index) {
      this.picList.splice(index, 1)
    },
    handleCoverPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = this.getObjectURL(file.originFileObj)
      }
      this.imageUrl = file.url || file.preview
      this.coverVisible = true
    },
    handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = this.getObjectURL(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    getUploadData(file) {
      return {
        token: this.picToken,
        key: this.fileName,
        file: file
      }
    },
    replaceVideo() {
      this.videoList = []
      this.$refs.videoUploader.$el.click()
    },
    delVideo() {
      this.videoList = []
    },
    getVideoUploadData(file) {
      return {
        token: this.videoToken,
        key: this.videoFileName,
        file: file
      }
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
        img.onerror = (err) => reject(err)
      })
    },
    async handleListUploadChange(info) {
      this.imgList = info.fileList
      try {
        if (info.file.status === 'done') {
          console.log(info.file.originFileObj)
          console.log(this.picList)
          const arr = info.file.originFileObj.name.split('.')
          const filePath = this.getObjectURL(info.file.originFileObj)
          const params = {
            fileGroupId: 0,
            fileType: 0,
            isFolder: false,
            fileName: arr[0],
            fileDownloadName: info.file.response.name,
            altValue: arr[0],
            fileSize: info.file.originFileObj.size / 1000000
          }
          const sizes = await this.getImageSize(filePath)
          params.fileWidth = sizes.w
          params.fileHeight = sizes.h
          console.log(sizes, params)

          const res = await addFile(params)
          if (res.code === 200) {
            this.$message.success(`${info.file.name} 文件上传成功！`)
          } else {
            this.$message.error(res.msg || '上传失败')
          }
          this.picList.push({
            name: info.file.response.name,
            path: this.getObjectURL(info.file.originFileObj)
          })
          this.isUploading = false
        }
      } catch (e) {
        this.isUploading = false
      }
    },
    handleVideoListUploadChange(info) {
      console.log(info)
      // this.videoList = info.fileList
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功！`)
        this.videoList.push({
          name: info.file.response.name,
          path: this.getObjectURL(info.file.originFileObj)
        })
        console.log(this.videoList[0])
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败。`)
      }
      // if (info.file.status === 'done') {
      //   this.videoList.push({
      //     name: info.file.response.name,
      //     path: this.getObjectURL(info.file.originFileObj)
      //   })
      // }
    },
    handleCoverRemove() {
      this.coverImg = []
      this.previewCover = ''
    },
    handleImgRemove(index) {
      this.imgList.splice(index, 1)
      this.previewImage.splice(index, 1)
    },
    getHtml(html) {
      console.log(html)
    },
    // 提交产品表单
    handleSubmit() {
      const { form, picList, videoList } = this
      const piclist = picList.map((item) => item.name)
      const keyword = form.keyword.words.filter((item) => item.keyword !== '').map((item) => item.keyword)
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unreachable
      const host = process.env.VUE_APP_HOST
      const detailId = this.$route.params.id
      let params = {}
      params = {
        shopTitle: form.name, // 产品标题
        shopUrl: form.productUrl, // 产品URL
        shopKeyWords: keyword, // 产品关键词
        seoTitle: form.keyword.pageTitle, // SEO 标题
        seoKeyWords: form.keyword.pageKeyword, // SEO 关键词
        seoDescription: form.keyword.pageDesc, // SEO 描述
        shopImgList: piclist, // 产品图片
        imgUseWatermark: this.watermarkOption === 1,
        shopVideoUrl: videoList.length ? host + '/' + videoList[0].name : form.videoUrl || '', // 产品视频链接
        shopDesc: form.intro, // 产品简介
        shopBrand: form.brand, // 产品品牌
        shopNumber: form.code, // 产品编码
        shopModel: form.model, // 产品型号
        shopAttribute: form.customFields,
        shopCustomProp: form.custom,
        shopDescribe: form.descs, // 产品描述
        relatedAids: this.selectedArticleRowKeys, // 关联文章ID
        relatedShopIds: this.selectedProductRowKeys, // 关联产品ID
        shopImg: piclist[0], // 产品主图
        catId: form.category, // 分类ID
        updateDate: moment(new Date()).format(), // 更新时间
        isShelve: form.shelved === 1, // 是否上架
        isHot: form.tags === '2',
        isNew: form.tags === '1',
        isRecommend: form.tags === '0'
        // shopTags: [selectedTag] // 产品标签
      }
      if (detailId) {
        params.id = detailId
      }
      console.log(params)
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(params)
          this.submitLoading = true
          let res
          if (params.id) {
            res = await updateProduct(params)
          } else {
            res = await addProduct(params)
          }
          this.submitLoading = false
          if (res.code === 200) {
            this.$message.success('操作成功')
            console.log(res)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          console.log('error submit!!')
          this.submitLoading = false
          return false
        }
      })
    },
    onCategoryChange(value) {
      console.log(value)
      this.selectedCate = value
    },
    // 选择分类
    handleSelectCate() {
      this.form.category = this.selectedCate
      this.showCategoryModal = false
    }
  }
}
</script>

<style scoped lang="less">
@import './ProductDetail.less';

.custom-desc {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .a-btn {
    position: relative;
    padding-right: 20px;
    margin-right: 10px;

    &.active {
      border: 1px solid #40a9ff;
    }

    &:hover {
      .a-icon {
        display: block;
      }

      .delete-icon {
        display: block;
      }
    }

    .a-icon {
      display: none;
      position: absolute;
      transform: scale(0.7);
      background: dodgerblue;
      width: 18px;
      height: 18px;
      color: white;
      top: 2px;
      right: 2px;
      font-weight: bold;
      border-radius: 3px;

      i {
        margin-top: -2px;
      }
    }

    .delete-icon {
      display: none;
      background: red;
      bottom: 2px;
      font-size: 13px;
      top: auto;
    }
  }
}

.aa {
  .btn {
    display: none;
  }

  &:hover {
    .btn {
      display: block;
    }
  }
}

.ant-form-item {
  margin-bottom: 20px !important;
}

.label-col {
  height: 40px !important;
  overflow: hidden;
}
.label-col2 {
  height: 55px !important;
  overflow: hidden;
}

.label-text {
  width: 72px;
  height: 40px;
  overflow: hidden;
  display: block;
  line-height: 16px;
  text-align: justify;
  white-space: normal;
  text-justify: inter-ideograph;
  text-align-last: justify; /* ie9*/
  -moz-text-align-last: justify; /*ff*/
  -webkit-text-align-last: justify; /*chrome 20+*/

  &.pt3 {
    padding-top: 3px;
  }

  &.pt10 {
    padding-top: 10px;
  }

  .en-text {
    letter-spacing: 0.1em;
  }
}

.video-preview {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
}

.video-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
}
.keyword-table {
  margin-top: 10px;
}
.list-group-item {
  width: 320px;
}
.keyword-btn {
  margin-top: 5px;
}
</style>
