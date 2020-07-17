<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions bordered>
        <a-descriptions-item label="询盘单号">
          {{ detail.orderNumber }}
        </a-descriptions-item>
        <a-descriptions-item label="发送时间">
          {{ detail.createDate }}
        </a-descriptions-item>
        <a-descriptions-item label="联系人IP">
          {{ detail.contactIP }}
        </a-descriptions-item>
        <a-descriptions-item label="国家/地区">
          {{ detail.contactRegion }}
        </a-descriptions-item>
        <a-descriptions-item label="询盘来源">
          {{ detail.enquirySource }}
        </a-descriptions-item>
        <a-descriptions-item label="来源网页">
          {{ detail.sourceUrl }}
        </a-descriptions-item>
      </a-descriptions>
      <br />
      <h3 class="title">询盘信息</h3>
      <a-descriptions layout="vertical" :column="4" bordered>
        <a-descriptions-item label="产品图片">
          <a-icon type="picture" style="font-size: 32px; opacity: .3" v-if="!detail.shopImgUrl"></a-icon>
          <img v-else :src="detail.shopImgUrl" alt="" class="cover" />
        </a-descriptions-item>
        <a-descriptions-item label="产品名称">
          {{ detail.shopName }}
        </a-descriptions-item>
        <a-descriptions-item label="产品属性">
          {{ detail.shopSku }}
        </a-descriptions-item>
        <a-descriptions-item label="数量">
          {{ detail.quantity }}
        </a-descriptions-item>
      </a-descriptions>
      <ul class="table-list">
        <li>
          <b>Name</b>
          <span>
            {{ detail.contactName }}
          </span>
        </li>
        <li>
          <b>E-mail</b>
          <span>
            {{ detail.contactEMail }}
          </span>
        </li>
        <li>
          <b>Company Name</b>
          <span>
            {{ detail.contactCompany }}
          </span>
        </li>
        <li>
          <b>Tell</b>
          <span>
            {{ detail.contactTel }}
          </span>
        </li>
        <li>
          <b>Message</b>
          <span>
            {{ detail.message }}
          </span>
        </li>
      </ul>
      <h3 class="title">设备信息</h3>
      <ul class="table-list">
        <li>
          <b>访问终端</b>
          <span>
            {{ detail.equipment }}
          </span>
        </li>
        <li>
          <b>浏览器</b>
          <span>
            {{ detail.browser }}
          </span>
        </li>
        <li>
          <b>语言</b>
          <span>
            {{ detail.language }}
          </span>
        </li>
        <li>
          <b>操作系统</b>
          <span>
            {{ detail.systemName }}
          </span>
        </li>
        <li>
          <b>客户端</b>
          <span>
            {{ detail.browserUa }}
          </span>
        </li>
      </ul>
      <!--      <a-descriptions class="info" bordered :column="1">-->
      <!--        <a-descriptions-item>-->
      <!--          <div slot="label" style="width: 120px;">Name</div>-->
      <!--          {{ detail.contactName }}-->
      <!--        </a-descriptions-item>-->
      <!--        <a-descriptions-item>-->
      <!--          <div slot="label" style="width: 120px;">E-mail</div>-->
      <!--          {{ detail.contactEMail }}-->
      <!--        </a-descriptions-item>-->
      <!--        <a-descriptions-item>-->
      <!--          <div slot="label" style="width: 120px;">Company Name</div>-->
      <!--          {{ detail.contactCompany }}-->
      <!--        </a-descriptions-item>-->
      <!--        <a-descriptions-item>-->
      <!--          <div slot="label" style="width: 120px;">Tell</div>-->
      <!--          {{ detail.contactTel }}-->
      <!--        </a-descriptions-item>-->
      <!--        <a-descriptions-item>-->
      <!--          <div slot="label" style="width: 120px;">Message</div>-->
      <!--          {{ detail.message }}-->
      <!--        </a-descriptions-item>-->
      <!--      </a-descriptions>-->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { enquiryDetail } from '../../api/enquiry'

// {
//   shopId: 0,
//   shopSku: null,
//   quantity: 5,
//   contactName: 'leo',
//   contactEMail: '1@qq.com',
//   contactCompany: '1 co,.LTD',
//   contactTel: '13500',
//   message: null,
//   shopImgUrl: null,
//   shopName: null,
//   sourceUrl: 'tt',
//   enquirySource: 'ss',
//   equipment: 'Desktop',
//   browser: '谷歌浏览器83.0.4103.116',
//   language: 'zh-CN,zh;q=0.9,en;q=0.8,de;q=0.7,fr;q=0.6,ja;q=0.5,ko;q=0.4,ru;q=0.3,zh-TW;q=0.2',
//   systemName: 'Windows10',
//   browserUa:
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
//   id: 0,
//   orderNumber: 'Onr20200717201304',
//   contactIP: '112.94.213.84',
//   createDate: '2020-07-17 20:13:05',
//   contactRegion: '暂无',
//   state: 0,
//   isRead: false
// }
export default {
  name: 'EnquiryDetail',
  data() {
    return {
      detail: {}
    }
  },
  created() {
    const { id } = this.$route.params
    if (!isNaN(id)) {
      this.loadDetail(id)
    }
  },
  methods: {
    loadDetail(id) {
      enquiryDetail({ id: id }).then(res => {
        console.log(res.data)
        this.detail = res.data
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import '~ant-design-vue/lib/style/themes/default.less';
.info {
  table {
    tr {
      th.ant-descriptions-item-label {
        background: red !important;
      }
    }
  }
}
.table-list {
  margin: 5px 0;
  padding: 0;
  border-top: 1px solid @border-color-base;
  border-right: 1px solid @border-color-base;
  border-left: 1px solid @border-color-base;
  li {
    display: flex;
    border-bottom: 1px solid @border-color-base;
    b{
      display: block;
      width: 25%;
      height: 40px;
      padding-left: 20px;
      line-height: 40px;
      background: @background-color-base;
      border-right: 1px solid @border-color-base;
    }
    span{
      padding-left: 20px;
      display: block;
      width: 75%;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
