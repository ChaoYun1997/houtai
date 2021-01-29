<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <a-row class="wrap">
        <a-col :span="15">
          <br />
          <div class="inner"><img src="~@/assets/inner.png" alt="" /></div>
        </a-col>
        <a-col :span="9" class="right">
          <div class="top">
            <div class="header">
              <a href="/">
                <img src="~@/assets/Fish-Cloud.jpg" class="logo" alt="logo" />
              </a>
            </div>
            <div class="desc"></div>
          </div>
          <router-view />
        </a-col>
      </a-row>

      <div class="footer">
        <!--        <div class="links">-->
        <!--          <a href="_self">帮助</a>-->
        <!--          <a href="_self">隐私</a>-->
        <!--          <a href="_self">条款</a>-->
        <!--        </div>-->
        <div class="copyright">Copyright &copy; 2020 大鱼</div>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'

export default {
  name: 'UserLayout',
  mixins: [deviceMixin],
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLauout {
}
#userLayout.user-layout-wrapper {
  height: 100%;
  background: 044c95;

  &.mobile {
    .container {
      .main {
        max-width: 1440px;
        width: 98%;
      }
    }
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100%;
    background: #044c95 url(~@/assets/bg.png) no-repeat 50%;
    background-size: 100% 100%;
    padding: 110px 0 144px;
    position: relative;
    .wrap{
      width: 1440px;
      .right{
        border-radius: 5px;
        padding: 60px 0;
        background: #f6fafd;
      }
    }
    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 72px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 68px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 33px;
          color: white;
          font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: white;
        font-size: 14px;
      }
    }
  }
}
</style>