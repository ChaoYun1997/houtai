<template>
  <div>
    <a-button v-print="'#print-content'" type="primary" style="margin-bottom: 20px">打印</a-button>
    <div id="print-content">
      <a-card :bordered="false">
        <h3 slot="title">询盘信息</h3>
        <a-descriptions bordered :column="{ xs: 2, md: 2, lg: 2 }" style="width: 1300px">
          <a-descriptions-item label="询盘单号">
            {{ detail.orderNumber }}
          </a-descriptions-item>
          <a-descriptions-item label="发送时间">
            {{ detail.createDate }}
          </a-descriptions-item>
          <a-descriptions-item label="询盘IP">
            <!--            {{ detail.contactIP }}-->
            -
          </a-descriptions-item>
          <a-descriptions-item label="来源国家">
            <!--            {{ detail.contactRegion }}-->
            -
          </a-descriptions-item>
          <a-descriptions-item label="询盘来源">
            {{ detail.enquirySource }}
          </a-descriptions-item>
          <a-descriptions-item label="来源网页">
            {{ detail.sourceUrl }}
          </a-descriptions-item>
          <a-descriptions-item label="来源终端">
            {{
              `${detail.equipment} | ${detail.browser} | ${detail.language} | ${detail.systemName} | ${detail.browserUa}`
            }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <br />
      <a-card :bordered="false">
        <h3 slot="title">询盘内容</h3>
        <a-descriptions bordered :column="{ xs: 2, md: 2, lg: 2 }" style="width: 1300px">
          <a-descriptions-item label="姓名">
            {{ detail.contactName }}
          </a-descriptions-item>
          <a-descriptions-item label="公司">
            {{ detail.contactCompany }}
          </a-descriptions-item>
          <a-descriptions-item label="职位"> </a-descriptions-item>
          <a-descriptions-item label="邮箱">
            {{ detail.contactEMail }}
          </a-descriptions-item>
          <a-descriptions-item label="国家">
            <!--            {{ detail.contactRegion }}-->
            -
          </a-descriptions-item>
          <a-descriptions-item label="电话">
            {{ detail.contactTel }}
          </a-descriptions-item>
          <a-descriptions-item label="询盘内容">
            {{ detail.message }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <br />
      <a-card :bordered="false" title="产品信息">
        <!--        <a-descriptions layout="vertical" :column="4" bordered>-->
        <!--          <a-descriptions-item label="产品图片">-->
        <!--            <a-icon type="picture" style="font-size: 32px; opacity: .3" v-if="!detail.shopImgUrl"></a-icon>-->
        <!--            <img v-else :src="imgUrl" alt="" class="cover" />-->
        <!--          </a-descriptions-item>-->
        <!--          <a-descriptions-item label="产品名称">-->
        <!--            {{ detail.shopName }}-->
        <!--          </a-descriptions-item>-->
        <!--          <a-descriptions-item label="产品属性">-->
        <!--            {{ detail.shopSku }}-->
        <!--          </a-descriptions-item>-->
        <!--          <a-descriptions-item label="数量">-->
        <!--            {{ detail.quantity }}-->
        <!--          </a-descriptions-item>-->
        <!--        </a-descriptions>-->
        <table width="1200" class="product-list">
          <tr>
            <th style="text-align: center">图片</th>
            <th style="text-align: center">产品名称</th>
            <th style="text-align: center">产品型号</th>
            <th style="text-align: center">产品链接</th>
            <th style="text-align: center">需求数量</th>
          </tr>
          <tr>
            <td style="text-align: center">
              <a-icon type="picture" style="font-size: 32px; opacity: 0.3" v-if="!detail.shopImgUrl"></a-icon>
              <img v-else :src="imgUrl" alt="" class="cover" />
            </td>
            <td style="text-align: center">
              <span class="link-btn">{{ detail.shopName }}</span>
            </td>
            <td style="text-align: center">
              {{ detail.shopSku }}
            </td>
            <td style="text-align: center"></td>
            <td style="text-align: center">
              {{ detail.quantity }}
            </td>
          </tr>
        </table>
      </a-card>
    </div>
    <br />
    <a-card :bordered="false" title="跟进记录">
      <a-timeline style="margin-top: 20px">
        <template v-for="(item, index) in progressingLog">
          <a-timeline-item :key="index">
            <a-row>
              <a-col :span="4"> 意向：{{ intentions[item.intentionType] }} </a-col>
              <a-col :span="12"> 进展：{{ progressingText[item.progressType] }} </a-col>
            </a-row>
            <p>备注：{{ item.note }}</p>
          </a-timeline-item>
        </template>
      </a-timeline>
    </a-card>
    <br />
    <a-card :bordered="false">
      <a-card>
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :form="form" ref="form">
          <a-form-item label="意向">
            <a-radio-group v-model="intention">
              <a-radio :value="0">低</a-radio>
              <a-radio :value="1">中</a-radio>
              <a-radio :value="2">高</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="进展">
            <a-radio-group v-model="progressing">
              <a-radio :value="0">待沟通</a-radio>
              <a-radio :value="1">沟通中</a-radio>
              <a-radio :value="2">放弃</a-radio>
              <a-radio :value="3">成单</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="备注">
            <a-input v-model="note" type="textarea" />
          </a-form-item>
          <a-form-item :wrapperCol="{ span: 12, offset: 5 }">
            <a-button htmlType="submit" type="primary" @click="handleSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </a-card>
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
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { enquiryDetail, getEnquiryLog, addEnquiryLog } from '../../api/enquiry'

const intentions = ['低', '中', '高']
const progressingText = ['待沟通', '沟通中', '放弃', '成单']
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
    this.intentions = intentions
    this.progressingText = progressingText
    return {
      detail: {},
      intention: 0,
      progressing: 0,
      note: '',
      form: this.$form.createForm(this),
      progressingLog: []
    }
  },
  computed: {
    imgUrl() {
      const host = process.env.VUE_APP_HOST
      const url = host + '/' + this.detail.shopImgUrl
      return url
    }
  },
  created() {
    const { id } = this.$route.params
    if (!isNaN(id)) {
      this.loadDetail(id)
      this.loadEnquiryLog(id)
    }
  },
  methods: {
    loadEnquiryLog(id) {
      getEnquiryLog({ enquiryId: id }).then((res) => {
        console.log(res)
        this.progressingLog = res.data
      })
    },
    handlePrint() {
      window.print()
    },
    loadDetail(id) {
      enquiryDetail({ id: id }).then((res) => {
        console.log(res.data)
        this.detail = res.data
      })
    },
    handleSubmit() {
      const params = {
        enquiryId: this.detail.id,
        intentionType: this.intention,
        progressType: this.progressing,
        note: this.note
      }
      addEnquiryLog(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('跟进成功')
          } else {
            throw res
          }
        })
        .catch((err) => {
          this.$message.error(err.msg || 'fail')
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
    b {
      display: flex;
      align-items: center;
      width: 25%;
      padding: 10px 20px;
      background: @background-color-base;
      border-right: 1px solid @border-color-base;
    }
    span {
      padding: 10px 20px;
      display: block;
      width: 75%;
    }
  }
}
.cover {
  width: 100px;
  height: auto;
}
.product-list {
  td {
    padding: 10px;
    height: 100px;
    line-height: 80px;
  }
}
</style>
