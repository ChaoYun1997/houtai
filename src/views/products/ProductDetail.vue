<template>
  <div>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="产品名称" prop="name">
          <a-input v-model="form.name" @change="handleNameChange" />
          <a-checkbox class="upper-checkbox" :checked="isUpperCase" @change="handleUpperCase">词首字母大写</a-checkbox>
          <p class="info negativeTop">-频繁修改产品名称直接影响SEO效果，请仔细斟酌后再提交。</p>
        </a-form-model-item>
        <a-form-model-item label="产品URL" class="url">
          <a-radio-group v-model="form.urlValue">
            <a-radio value="a" class="url-radio">系统URL</a-radio>
            <a-radio value="b" class="url-radio">自定义URL</a-radio>
          </a-radio-group>
          <a-input
            class="url-input"
            v-show="form.urlValue === 'b'"
            v-model="form.productUrl"
            placeholder="请输入自定义URL"
          ></a-input>
          <p class="info" v-show="form.urlValue === 'b'">
            - URL必须以/开头，例如：/about-us.html
            <br />- 请勿使用以p+数字结尾结构的URL，跟系统分页规则冲突，例如：/prod-p2.html <br />-
            频繁修改详情URL直接影响SEO效果，请仔细斟酌后再提交。
          </p>
        </a-form-model-item>
        <a-form-model-item label="产品关键词" prop="keyword" class="keyword-box">
          <a-row>
            <a-col :span="12">
              <div ref="list" class="list">
                <div class="list-group-item keyword-input" v-for="(item, index) in form.keyword.words" :key="index">
                  <a-input v-model="item.keyword" @change="handleNameChange" placeholder="请输入关键词" />
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
              <a-button icon="plus" v-show="form.keyword.words.length < 8" @click="handleAddKeyword">
                新增关键词
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-card class="keyword-list" size="small">
                <span slot="title">关键词列表</span>
                <a-list
                  class="list-box"
                  item-layout="horizontal"
                  :data-source="keywordList"
                  :loading="keywordListLoading"
                >
                  <a-list-item
                    class="list-content"
                    slot="renderItem"
                    key="item.id"
                    slot-scope="item"
                    @click="handleKeywordList(item.keyWord)"
                  >
                    <a-list-item-meta>
                      <span slot="title">{{ item.keyWord }}</span>
                    </a-list-item-meta>
                    <span slot="extra">{{ `(${item.associatedItemCount})` }}</span>
                  </a-list-item>
                </a-list>
                <span slot="actions">
                  <a-button type="link" @click="$router.push('/keyword/keyword-list')" size="small">
                    管理关键词
                  </a-button>
                </span>
              </a-card>
            </a-col>
          </a-row>
          <p class="info">
            -请填写3个以上的关键词，每个关键词的长度≤5个单词，长度不得超过100字符，单词之间不需要增加任何符号，直接空格表示。
          </p>
          <a-button :icon="showSeo ? 'caret-down' : 'caret-up'" type="link" :ghost="true" @click="showSeo = !showSeo">
            搜索引擎优化设置
          </a-button>
          <transition name="slideToggle">
            <div class="seo" v-show="showSeo">
              <a-row>
                <a-col :span="4" :push="1">
                  <span class="label">页面标题</span>
                </a-col>
                <a-col :span="19">
                  <a-input v-model="form.keyword.pageTitle" placeholder="请输入页面标题" />
                </a-col>
                <a-col :span="4" :push="1">
                  <span class="label">页面关键词</span>
                </a-col>
                <a-col :span="19">
                  <a-input v-model="form.keyword.pageKeyword" placeholder="请输入页面关键词" />
                </a-col>
                <a-col :span="4" :push="1">
                  <span class="label">页面描述</span>
                </a-col>
                <a-col :span="19">
                  <a-input v-model="form.keyword.pageDesc" placeholder="请输入页面描述" />
                </a-col>
              </a-row>
            </div>
          </transition>
        </a-form-model-item>
        <a-form-model-item ref="category" label="所属产品分类" prop="category">
          <span class="cate-item" v-if="form.category.length === 0">未分组</span>
          <template v-else>
            <template v-for="item in form.category">
              <span class="cate-item" :key="item">{{ categoryLabel(item) }}</span>
            </template>
          </template>
          <a-button @click="showCategoryModal = true">选择</a-button>
        </a-form-model-item>
        <a-form-model-item ref="img" label="产品图片" prop="cover" class="img-list">
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <ul ref="piclist" class="pic-list">
            <li v-for="(item, index) in picList" :key="index">
              <div class="operate">
                <a-icon type="eye" @click="handlePicPreview(item.path)"></a-icon>
                <a-icon type="delete" @click="handleDelPic(index)"></a-icon>
              </div>
              <img :src="item.path" alt />
            </li>
            <a-upload
              list-type="picture-card"
              class="img-uploader"
              :action="uploadUrl"
              :file-list="imgList"
              accept="image/*"
              :show-upload-list="false"
              :data="getUploadData"
              :before-upload="getUploadToken"
              @change="handleListUploadChange"
            >
              <div v-if="imgList.length < 8">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </ul>
        </a-form-model-item>
        <a-form-model-item ref="video" label="产品视频" prop="videoUrl">
          <a-input v-model="form.videoUrl" placeholder="请输入产品视频连接"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="intro" label="产品简介" prop="intro">
          <a-textarea v-model="form.intro" placeholder="请输入产品简介" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-form-model-item>
        <a-form-model-item ref="video" label="产品属性">
          <a-row class="panel-box">
            <a-col :span="4" :push="1">
              <span class="label">型号</span>
            </a-col>
            <a-col :span="19">
              <a-input v-model="form.attribute.model" placeholder="请输入产品型号" />
            </a-col>
            <a-col :span="4" :push="1">
              <span class="label">品牌</span>
            </a-col>
            <a-col :span="19">
              <a-input v-model="form.attribute.brand" placeholder="请输入产品品牌" />
            </a-col>
            <a-col :span="4" :push="1">
              <span class="label">编码</span>
            </a-col>
            <a-col :span="19">
              <a-input v-model="form.attribute.code" placeholder="请输入产品编码" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item ref="video" label="产品自定义字段">
          <div class="panel-box addFieldBox">
            <template v-for="(item, index) in form.customFields">
              <a-row :key="index">
                <a-col :span="4">
                  <a-input v-model="item.name" placeholder="字段名" style="width: 100px" />
                </a-col>
                <a-col :span="19">
                  <a-input v-model="item.value" placeholder="字段值" style="width: 220px" />
                  <a-button
                    type="danger"
                    shape="circle"
                    size="small"
                    icon="delete"
                    style="margin-left: 10px"
                    @click="handleDelField(index)"
                  />
                </a-col>
              </a-row>
            </template>
            <a-button icon="plus" @click="handleAddField">新增字段</a-button>
          </div>
        </a-form-model-item>
        <!--        <a-form-model-item label="产品SKU">-->
        <!--          <a-row class="sku-box">-->
        <!--            <a-col class="c-header" :span="8">规格名称</a-col>-->
        <!--            <a-col class="c-header" :span="16">规格值</a-col>-->
        <!--          </a-row>-->
        <!--          <template v-for="(item, index) in shopSku">-->
        <!--            <a-row class="sku-box" :key="index">-->
        <!--              <div class="sku-row">-->
        <!--                <a-col class="c-content" :span="8">-->
        <!--                  <div class="sku-title">-->
        <!--                    <a-select-->
        <!--                      style="width: 120px"-->
        <!--                      :value="item.skuName"-->
        <!--                      @change="value => handleSkuChange(value, index)"-->
        <!--                    >-->
        <!--                      <div slot="dropdownRender" slot-scope="menu">-->
        <!--                        <v-nodes :vnodes="menu" />-->
        <!--                        <a-divider style="margin: 4px 0;" />-->
        <!--                        <div-->
        <!--                          style="padding: 4px 8px; cursor: pointer;"-->
        <!--                          @mousedown="e => e.preventDefault()"-->
        <!--                          @click="visibleAddItem"-->
        <!--                        >-->
        <!--                          <a-icon type="plus" /> Add item-->
        <!--                        </div>-->
        <!--                      </div>-->
        <!--                      <a-select-option v-for="(el, j) in items" :key="j" :value="el">-->
        <!--                        {{ el }}-->
        <!--                      </a-select-option>-->
        <!--                    </a-select>-->
        <!--                    &lt;!&ndash;                    <a-input v-model="item.skuName" style="width: 120px"></a-input>&ndash;&gt;-->
        <!--                  </div>-->
        <!--                </a-col>-->
        <!--                <a-col class="c-content" :span="16">-->
        <!--                  <a-icon type="close" class="del-row" @click="delRow(index)"></a-icon>-->
        <!--                  <div class="sku-val" v-for="(val, i) in item.skuValues" :key="i">-->
        <!--                    <a-icon type="close" class="del-val" @click="delVal(index, i)"></a-icon>-->
        <!--                    <a-input v-model="val.skuValueName" style="width: 120px"></a-input>-->
        <!--                    <div class="sku-img">-->
        <!--                      <a-upload-->
        <!--                        :action="uploadUrl"-->
        <!--                        accept="image/*"-->
        <!--                        :show-upload-list="false"-->
        <!--                        :data="getUploadData"-->
        <!--                        :before-upload="getUploadToken"-->
        <!--                        @change="info => handleSkuUpload(info, index, i)"-->
        <!--                      >-->
        <!--                        <a-icon v-if="!val.skuValueImg" type="picture"></a-icon>-->
        <!--                        <img v-else :src="`http://cdn.fish-cloud.com/${val.skuValueImg}`" alt="val.skuValueName" />-->
        <!--                      </a-upload>-->
        <!--                    </div>-->
        <!--                  </div>-->
        <!--                  <a-button type="link" @click="handleAddSkuVal(index)">添加规格值</a-button>-->
        <!--                </a-col>-->
        <!--              </div>-->
        <!--            </a-row>-->
        <!--          </template>-->
        <!--          &lt;!&ndash;          <dl class="custom-list sku-box">&ndash;&gt;-->
        <!--          &lt;!&ndash;            <dt>规格名称</dt>&ndash;&gt;-->
        <!--          &lt;!&ndash;            <dt>规格值</dt>&ndash;&gt;-->
        <!--          &lt;!&ndash;            <template v-for="(item, index) in shopSku">&ndash;&gt;-->
        <!--          &lt;!&ndash;              <div :key="index" class="sku-row">&ndash;&gt;-->
        <!--          &lt;!&ndash;                <dd>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <div class="sku-title">&ndash;&gt;-->
        <!--          &lt;!&ndash;                    <a-input v-model="item.skuName" style="width: 120px"></a-input>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;                </dd>&ndash;&gt;-->
        <!--          &lt;!&ndash;                <dd>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <a-icon type="close" class="del-row"></a-icon>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <div class="sku-val" v-for="(val, i) in item.skuValues" :key="i">&ndash;&gt;-->
        <!--          &lt;!&ndash;                    <a-icon type="close" class="del-val"></a-icon>&ndash;&gt;-->
        <!--          &lt;!&ndash;                    <a-input v-model="val.skuValueName" style="width: 120px"></a-input>&ndash;&gt;-->
        <!--          &lt;!&ndash;                    <div class="sku-img">&ndash;&gt;-->
        <!--          &lt;!&ndash;                      <a-upload>&ndash;&gt;-->
        <!--          &lt;!&ndash;                        <a-icon v-if="!val.skuValueImg" type="picture"></a-icon>&ndash;&gt;-->
        <!--          &lt;!&ndash;                        <img v-else :src="val.skuValueImg" alt="" />&ndash;&gt;-->
        <!--          &lt;!&ndash;                      </a-upload>&ndash;&gt;-->
        <!--          &lt;!&ndash;                    </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <a-button type="link" @click="handleAddSkuVal(index)">添加规格值</a-button>&ndash;&gt;-->
        <!--          &lt;!&ndash;                </dd>&ndash;&gt;-->
        <!--          &lt;!&ndash;              </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;            </template>&ndash;&gt;-->
        <!--          &lt;!&ndash;          </dl>&ndash;&gt;-->

        <!--          &lt;!&ndash;          <a-descriptions layout="vertical" bordered>&ndash;&gt;-->
        <!--          &lt;!&ndash;            <template v-for="(item, index) in shopSku">&ndash;&gt;-->
        <!--          &lt;!&ndash;              <a-descriptions-item label="规格名称" :key="index">&ndash;&gt;-->
        <!--          &lt;!&ndash;                <div class="sku-title">&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <a-input v-model="item.skuName" style="width: 120px"></a-input>&ndash;&gt;-->
        <!--          &lt;!&ndash;                </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;              </a-descriptions-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;              <a-descriptions-item :span="2" label="规格值" :key="index">&ndash;&gt;-->
        <!--          &lt;!&ndash;                <div class="sku-val" v-for="(val, i) in item.skuValues" :key="i">&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <a-input v-model="val.skuValueName" style="width: 120px"></a-input>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <div class="sku-img">&ndash;&gt;-->
        <!--          &lt;!&ndash;                    <a-upload>&ndash;&gt;-->
        <!--          &lt;!&ndash;                      <a-icon v-if="!val.skuValueImg" type="picture"></a-icon>&ndash;&gt;-->
        <!--          &lt;!&ndash;                      <img v-else :src="val.skuValueImg" alt="" />&ndash;&gt;-->
        <!--          &lt;!&ndash;                    </a-upload>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;                </div>&ndash;&gt;-->
        <!--          &lt;!&ndash;                <a-button type="link" @click="handleAddSkuVal(index)">添加规格值</a-button>&ndash;&gt;-->
        <!--          &lt;!&ndash;              </a-descriptions-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;            </template>&ndash;&gt;-->
        <!--          &lt;!&ndash;            <br />&ndash;&gt;-->
        <!--          &lt;!&ndash;          </a-descriptions>&ndash;&gt;-->
        <!--          <a-button type="link" @click="handleAddSkuObj">添加规格项目</a-button>-->
        <!--        </a-form-model-item>-->
        <h3>产品描述</h3>
        <a-form-model-item label="产品描述">
          <div class="panel-box">
            <!--            <div class="custom-desc">-->
            <!--              <template v-for="(item, index) in form.descs">-->
            <!--                <a-button-->
            <!--                  :class="{'a-btn':true,'active':selectedDesc===index}"-->
            <!--                  size="large"-->
            <!--                  :key="index"-->
            <!--                  @click="handleDescBtn(index)"-->
            <!--                >-->
            <!--                  {{ item.name }}-->
            <!--                  <a-button-->
            <!--                    icon="edit"-->
            <!--                    @click.stop="handleDescEditBtn(item, index)"-->
            <!--                    class="a-icon"-->
            <!--                  />-->
            <!--                  <a-icon-->
            <!--                    v-if="index!==0"-->
            <!--                    type="close"-->
            <!--                    @click.stop="handleDescDelBtnEdit"-->
            <!--                    class="a-icon delete-icon"-->
            <!--                  />-->
            <!--                </a-button>-->
            <!--              </template>-->
            <!--              <a-button size="large" icon="plus" @click="visibleAddDesc = true"></a-button>-->
            <!--            </div>-->
            <kind-editor
              @uploadImg="handleEditorUploadPic"
              :content="form.desc"
              id="k-editor"
              ref="kindeditor"
            ></kind-editor>
          </div>
        </a-form-model-item>
        <h3>产品状态</h3>
        <a-form-model-item label="产品状态">
          <a-radio-group v-model="form.shelved">
            <a-radio :value="1">上架</a-radio>
            <a-radio :value="0">下架(访客不可见)</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!--        <a-form-model-item label="产品标签">-->
        <!--          <template v-for="tag in tags">-->
        <!--            <a-checkable-tag-->
        <!--              :key="tag"-->
        <!--              :checked="selectedTags.indexOf(tag) > -1"-->
        <!--              @change="checked => handleTagChange(tag, checked)"-->
        <!--            >-->
        <!--              {{ tag }}-->
        <!--            </a-checkable-tag>-->
        <!--          </template>-->
        <!--        </a-form-model-item>-->
        <h3>相关文章</h3>
        <a-alert message="选出5~20篇与该产品相关联的文章展示在前台产品详情。" banner closable />
        <a-card class="panel-box">
          <a-row :gutter="10">
            <a-col :span="12">
              <a-select
                placeholder="全部分类"
                :options="articleCate"
                style="width: 160px"
                @change="handleArticleCateChange"
              ></a-select>
              <a-input-search
                placeholder="请输入文章标题"
                enter-button="搜索"
                style="width:220px;margin-left: 10px;"
                @search="onArticleSearch"
              />
              <s-table
                class="article-table"
                size="small"
                ref="articleTable"
                :rowKey="record => record.id"
                :scroll="{ y: 380 }"
                :columns="articleColumns"
                :data="loadArticleData"
                :rowSelection="articleRowSelection"
              ></s-table>
            </a-col>
            <a-col :span="12" class="article-list">
              <h5>已选择的相关文章</h5>
              <ul class="selected-articles">
                <template v-for="(item, index) in selectedArticles">
                  <li :key="index">
                    <span>{{ item.title }}</span>
                    <a-icon class="del-icon" type="close" @click="handleDelArticle(item.id)"></a-icon>
                  </li>
                </template>
              </ul>
            </a-col>
          </a-row>
        </a-card>

        <h3>相关产品</h3>
        <a-alert message="选出5~20篇与该产品相关联的产品展示在前台产品详情。" banner closable />
        <a-card class="panel-box">
          <a-row :gutter="10">
            <a-col :span="12">
              <a-select
                placeholder="请选择产品分类"
                :options="categoryOptions"
                style="width: 160px"
                @change="handleProductCateChange"
              ></a-select>
              <a-input-search
                placeholder="请输入产品标题"
                enter-button="搜索"
                style="width:220px;margin-left: 10px;"
                @search="onProductSearch"
              />
              <!--              <a-table-->
              <!--                class="article-table"-->
              <!--                size="small"-->
              <!--                row-key="id"-->
              <!--                :scroll="{ y: 380 }"-->
              <!--                :row-selection="{ selectedRowKeys: selectedProductRowKeys, onChange: onProductSelectChange }"-->
              <!--                :columns="productColumns"-->
              <!--                :data-source="productData"-->
              <!--              >-->
              <!--              </a-table>-->
              <s-table
                class="article-table"
                size="small"
                ref="productTable"
                :rowKey="record => record.id"
                :scroll="{ y: 380 }"
                :columns="productColumns"
                :data="loadProductData"
                :rowSelection="productRowSelection"
              ></s-table>
            </a-col>
            <a-col :span="12" class="article-list">
              <h5>已选择的相关产品</h5>
              <ul class="selected-articles">
                <template v-for="(item, index) in selectedProducts">
                  <li :key="index">
                    <span>{{ item.shopTitle }}</span>
                    <a-icon class="del-icon" type="close" @click="handleDelProduct(item.id)"></a-icon>
                  </li>
                </template>
              </ul>
            </a-col>
          </a-row>
        </a-card>
        <br />
        <a-form-model-item>
          <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>

    <a-modal v-model="visibleAddDesc" title="添加描述" centered @cancel="handleCancelAddDesc">
      <a-input v-model="newDesc" placeholder="请输入描述名称"></a-input>
      <div slot="footer">
        <a-button type="primary" @click="handleAddDesc" :disabled="newDesc === ''">确 定</a-button>
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
export default {
  name: 'Detail',
  components: {
    STable,
    KindEditor,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    this.items = items
    this.articleColumns = articleColumns
    this.productColumns = productColumns
    return {
      editDesc: '',
      newDesc: '',
      visibleAddDesc: false,
      selectedDesc: 0,
      submitLoading: false,
      visibleAddItem: false,
      newSku: '',
      queryArticle: {},
      queryArticleCate: {},
      loadArticleData: parameter => {
        parameter = Object.assign(parameter, this.queryArticle)
        return getArticles(parameter)
      },
      queryProduct: {},
      queryProductCate: {},
      loadProductData: parameter => {
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
      selectedProducts: [], // 已关联产品列表
      selectedArticleRowKeys: [], // 已选择文章
      selectedProductRowKeys: [], // 已选择产品

      content: '',
      tags: ['推荐产品', '最新产品', '热门产品'],
      selectedTags: [],
      uploadUrl: process.env.VUE_APP_QINIU_HOST,
      picToken: '',
      fileName: '',
      coverImg: [],
      imageUrl: '',
      showImage: false,
      coverLoading: false,
      previewCover: '',
      imgList: [],
      picList: [],
      coverList: [],
      coverVisible: false,
      previewImage: [],
      previewVisible: false,

      enabled: true, // 关键词拖动排序开关
      dragging: false, // 关键词拖动

      keywordList: [], // 关键词列表
      keywordListLoading: true, // 关键词列表加载动画

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
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      isUpperCase: false,
      editorOptions: {
        width: '700px',
        height: '400px'
      },
      // 产品表单
      form: {
        name: '',
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
        attribute: {
          model: '',
          brand: '',
          code: ''
        },
        customFields: [
          {
            name: '',
            value: ''
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
            name: 'Product Description',
            content: '<b>test</b>'
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
        tags: []
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        keyword: [{ required: true, message: '请输入产品关键词', trigger: 'blur' }]
      }
    }
  },
  computed: {
    productRowSelection() {
      return {
        selectedRowKeys: this.selectedProductRowKeys,
        onChange: this.onProductSelectChange
      }
    },
    articleRowSelection() {
      return {
        selectedRowKeys: this.selectedArticleRowKeys,
        onChange: this.onArticleSelectChange
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

    const that = this
    // eslint-disable-next-line no-unused-vars
    const sortable = sortableJS.create(this.$refs.list, {
      sort: true,
      animation: 300,
      onEnd: function(evt) {
        // 拖拽结束发生该事件
        that.form.keyword.words.splice(evt.newIndex, 0, that.form.keyword.words.splice(evt.oldIndex, 1)[0])
        var newArray = that.form.keyword.words.slice(0)
        that.form.keyword.words = []
        that.$nextTick(function() {
          that.form.keyword.words = newArray
          console.log(that.form.keyword.words)
        })
      }
    })

    // eslint-disable-next-line no-unused-vars
    const sortablePic = sortableJS.create(this.$refs.piclist, {
      sort: true,
      animation: 300,
      onEnd: function(evt) {
        // 拖拽结束发生该事件
        that.picList.splice(evt.newIndex, 0, that.picList.splice(evt.oldIndex, 1)[0])
        const newArray = that.picList.slice(0)
        that.picList = []
        that.$nextTick(function() {
          that.picList = newArray
          console.log(that.picList)
        })
      }
    })
  },
  methods: {
    handleAddField() {
      this.form.customFields.push({
        name: '',
        value: ''
      })
    },
    handleDelField(index) {
      this.form.customFields.splice(index, 1)
    },
    // sku 选择
    handleSkuChange(value, index) {
      const isKeyExisted = this.shopSku.findIndex(item => {
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
        const isKeyExisted = this.shopSku.findIndex(item => {
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
      const isExist = item.vals.filter(i => {
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
      getProductDetail({ id }).then(res => {
        const { form } = this
        const { data } = res
        form.name = data.shopTitle // 产品标题
        console.log(data.shopTitle)
        form.productUrl = data.shopUrl ? data.shopUrl : '' // 产品url
        form.urlValue = data.shopUrl ? 'b' : 'a'
        form.keyword.words = data.shopKeyWords.map(item => {
          // 关键词
          return { keyword: item }
        })
        form.keyword.pageTitle = data.seoTitle // seo标题
        form.keyword.pageKeyword = data.seoKeyWords // seo关键词
        form.keyword.pageDesc = data.seoDescription // seo描述
        const host = process.env.VUE_APP_HOST
        this.picList = data.shopImgList.map(item => {
          // 产品图片
          const name = item.split('/')
          return {
            path: host + '/' + item,
            name: name[name.length - 1]
          }
        })
        // form.shopImg = data.shopImg
        form.category = data.catId
        form.videoUrl = data.shopVideoUrl
        form.intro = data.shopDesc
        form.attribute.brand = data.shopBrand
        form.attribute.code = data.shopNumber
        form.attribute.model = data.shopModel
        form.desc = data.shopDescribe
        form.customFields = data.shopAttribute
        this.selectedArticleRowKeys = data.relatedAids
        this.selectedProductRowKeys = data.relatedShopIds
        // 改为数组 TODO
        // form.category = data.catId
        form.shelved = data.isShelve ? 1 : 0
        form.tags = data.shopTags
      })
    },
    setDesc(desc) {
      console.log(this.$refs.kindeditor)
      // if (desc) {
      //   this.$refs.kindeditor.html(desc)
      // }
    },
    handleDelProduct(id) {
      this.selectedProductRowKeys.forEach((item, index) => {
        if (id === item) {
          this.selectedProductRowKeys.splice(index, 1)
          this.selectedProducts.splice(index, 1)
        }
      })
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
      console.log('selectedRowKeys changed: ', selectedRows)
      this.selectedArticleRowKeys = selectedRowKeys
      this.selectedArticles = selectedRows
    },
    onProductSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedProductRowKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },
    loadArticleCate() {
      getArticleCate(this.queryArticleCate).then(res => {
        const result = res.data.datas
        console.log(`article cate: ${result}`)
        if (result.length > 0) {
          result.forEach(item => {
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
      getProducts().then(res => {
        this.productData = res.result.data
      })
    },
    handleA() {
      console.log('a')
    },
    handleB() {
      console.log('b')
    },
    handleDescBtn(index) {
      console.log(index)
      this.selectedDesc = index
    },
    handleDescEditBtn(item, index) {
      console.log('edit')
      this.editDesc = index
      this.newDesc = item.name
      this.visibleAddDesc = true
    },
    handleAddDesc() {
      if (this.editDesc !== '') {
        this.form.descs[this.editDesc].name = this.newDesc
        this.newDesc = ''
        this.editDesc = ''
        this.visibleAddDesc = false
        return
      }
      this.form.descs.push({
        name: this.newDesc,
        content: ''
      })
      this.newDesc = ''
      this.visibleAddDesc = false
    },
    handleCancelAddDesc() {
      this.visibleAddDesc = false
      this.editDesc = ''
      this.newDesc = ''
    },
    handleTagChange(tag, checked) {
      const { selectedTags } = this
      const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
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
    // 编辑器上传图片
    async handleEditorUploadPic(file) {
      console.log(file)
      const size = file.size / 1024 / 1024
      if (size > 2) {
        this.$message.warning('图片不能大于2MB')
        return
      }
      const paramUploadSign = {
        type: 1
      }
      const { data } = await getUploadSign(paramUploadSign)
      const formData = new FormData()
      formData.append('token', data.token)
      formData.append('key', data.fileName)
      formData.append('file', file)
      const d = await this.$http.post(this.uploadUrl, formData)
      let imgUrl = process.env.VUE_APP_HOST
      if (d.name) {
        imgUrl = imgUrl + '/' + d.name
      } else {
        this.$message.error('上传图片出错')
      }
      const img = new Image()
      img.src = imgUrl
      this.$refs.kindeditor.editor.appendHtml(`<img style="max-width:100%;" src="${imgUrl}">`)
    },
    afterChange() {},
    categoryLabel(id) {
      const cate = this.categoryOptions.find(item => {
        return item.id === id
      })
      if (!cate) return
      return cate.label
    },
    // 加载关键词数据
    loadKeyword() {
      getKeyword({ pageIndex: 1, pageSize: 100 }).then(res => {
        this.keywordListLoading = false
        this.keywordList = res.data.datas
      })
    },
    // 加载分类数据
    loadCategory() {
      getProductCate(this.queryArticleCate).then(res => {
        res.data.datas.forEach(item => {
          this.categoryOptions.push({
            label: item.catName,
            value: item.id,
            id: item.id
          })
        })
      })
      console.log(this.categoryOptions)
      this.loadArticleCate()
    },
    handleDelKeyword(index) {
      this.form.keyword.words.splice(index, 1)
    },
    handleSort() {
      console.log('del')
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
      if (this.isUpperCase) {
        const name = this.form.name.trim()
        this.setFirstCharToUpperCase(name)
      }
    },
    handleUpperCase(e) {
      this.isUpperCase = !this.isUpperCase
      if (!this.form.name) return
      if (e.target.checked) {
        const name = this.form.name.trim()
        this.setFirstCharToUpperCase(name)
      }
    },
    setFirstCharToUpperCase(name) {
      let firstChar = name.substring(0, 1)
      if (/[a-z]/.test(firstChar)) {
        firstChar = firstChar.toUpperCase()
        this.form.name = firstChar + name.substring(1, name.length)
        return this.form.name
      }
    },
    // 产品主图
    uploadCover(info) {
      this.coverLoading = true
      this.imageUrl = this.getObjectURL(info.file)
      const fd = new FormData()
      fd.append('key', this.fileName)
      fd.append('token', this.picToken)
      fd.append('file', info.file)
      this.$http.post(this.uploadUrl, fd).then(res => {
        this.form.shopImg = res.name
        this.showImage = true
        this.coverLoading = false
        console.log(res.name)
      })
    },
    async getUploadToken() {
      // 获取图片上传凭证
      const param = {
        type: 1
      }
      await getUploadSign(param)
        .then(res => {
          if (res.code === 200) {
            this.picToken = res.data.token
            this.fileName = res.data.fileName
          } else {
            throw res
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
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
    handleCoverUploadChange(info) {
      this.coverList = info.fileList
      if (info.file.status === 'done') {
        this.form.shopImg = info.file.response.name
      }
    },
    handleSkuUpload(info, index, i) {
      if (info.file.status === 'done') {
        console.log(info.file.response.name)
        this.shopSku[index].skuValues[i].skuValueImg = info.file.response.name
        this.shopSku[index].skuValues[i].imgPath = this.getObjectURL(info.file.originFileObj)
      }
    },
    handleListUploadChange(info) {
      this.imgList = info.fileList
      if (info.file.status === 'done') {
        console.log(info.file.response.name)
        console.log(this.picList)
        this.picList.push({
          name: info.file.response.name,
          path: this.getObjectURL(info.file.originFileObj)
        })
      }
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
      const { form, picList } = this
      const piclist = picList.map(item => item.name)
      const keyword = form.keyword.words.map(item => item.keyword)
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unreachable
      let params = {}
      params = {
        shopTitle: form.name, // 产品标题
        shopUrl: form.urlValue === 'a' ? '' : form.productUrl, // 产品URL
        shopKeyWords: keyword, // 产品关键词
        seoTitle: form.keyword.pageTitle, // SEO 标题
        seoKeyWords: form.keyword.pageKeyword, // SEO 关键词
        seoDescription: form.keyword.pageDesc, // SEO 描述
        shopImgList: piclist, // 产品图片
        shopVideoUrl: form.videoUrl, // 产品视频链接
        shopDesc: form.intro, // 产品简介
        shopBrand: form.attribute.brand, // 产品品牌
        shopNumber: form.attribute.code, // 产品编码
        shopModel: form.attribute.model, // 产品型号
        shopAttribute: form.customFields,
        shopDescribe: this.$refs.kindeditor.outContent, // 产品描述
        relatedAids: this.selectedArticleRowKeys, // 关联文章ID
        relatedShopIds: this.selectedProductRowKeys, // 关联产品ID
        shopImg: piclist[0], // 产品主图
        catId: form.category, // 分类ID
        updateDate: moment(new Date()).format(), // 更新时间
        isShelve: form.shelved === 1, // 是否上架
        shopTags: form.tags // 产品标签
      }
      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      this.$refs.form.validate(async valid => {
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
</style>
