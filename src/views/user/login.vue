<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="errText" />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入帐户名"
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }],
              validateTrigger: 'change'
            }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="请输入密码"
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-row class="verify-code">
          <a-col :span="17">
            <a-input
              size="large"
              type="text"
              v-decorator="[
                'code',
                {
                  rules: [{ required: true, message: '请输入图片验证码' }],
                  validateTrigger: 'blur'
                }
              ]"
              placeholder="请输入图片验证码"
            />
          </a-col>
          <a-col :span="6" class="img-box" :push="1">
            <img :src="authCode" alt="" @click="updateVerifyCode" />
          </a-col>
        </a-row>
      </a-form-item>
      <!--      <a-tabs-->
      <!--        :activeKey="customActiveKey"-->
      <!--        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"-->
      <!--        @change="handleTabClick"-->
      <!--      >-->
      <!--        <a-tab-pane key="tab1" tab="账号密码登录">-->
      <!--        </a-tab-pane>-->
      <!--        <a-tab-pane key="tab2" tab="手机号登录">-->
      <!--          <a-form-item>-->
      <!--            <a-input-->
      <!--              size="large"-->
      <!--              type="text"-->
      <!--              placeholder="手机号"-->
      <!--              v-decorator="[-->
      <!--                'mobile',-->
      <!--                {-->
      <!--                  rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }],-->
      <!--                  validateTrigger: 'change'-->
      <!--                }-->
      <!--              ]"-->
      <!--            >-->
      <!--              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />-->
      <!--            </a-input>-->
      <!--          </a-form-item>-->

      <!--          <a-row :gutter="16">-->
      <!--            <a-col class="gutter-row" :span="16">-->
      <!--              <a-form-item>-->
      <!--                <a-input-->
      <!--                  size="large"-->
      <!--                  type="text"-->
      <!--                  placeholder="验证码"-->
      <!--                  v-decorator="[-->
      <!--                    'captcha',-->
      <!--                    { rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur' }-->
      <!--                  ]"-->
      <!--                >-->
      <!--                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />-->
      <!--                </a-input>-->
      <!--              </a-form-item>-->
      <!--            </a-col>-->
      <!--            <a-col class="gutter-row" :span="8">-->
      <!--              <a-button-->
      <!--                class="getCaptcha"-->
      <!--                tabindex="-1"-->
      <!--                :disabled="state.smsSendBtn"-->
      <!--                @click.stop.prevent="getCaptcha"-->
      <!--                v-text="(!state.smsSendBtn && '获取验证码') || state.time + ' s'"-->
      <!--              ></a-button>-->
      <!--            </a-col>-->
      <!--          </a-row>-->
      <!--        </a-tab-pane>-->
      <!--      </a-tabs>-->

      <a-form-item>
        <!--        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>-->
        <!--        <router-link-->
        <!--          :to="{ name: 'recover' }"-->
        <!--          class="forge-password"-->
        <!--          style="float: right;"-->
        <!--        >忘记密码-->
        <!--        </router-link>-->
        <!--        <a-button class="forge-password" type="link" @click="showFogPwd = true">忘记密码</a-button>-->
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >
          登陆
        </a-button>
      </a-form-item>
      <!--      <div class="user-login-other">-->
      <!--        <span>其他登录方式</span>-->
      <!--        <a>-->
      <!--          <a-icon class="item-icon" type="alipay-circle"></a-icon>-->
      <!--        </a>-->
      <!--        <a>-->
      <!--          <a-icon class="item-icon" type="taobao-circle"></a-icon>-->
      <!--        </a>-->
      <!--        <a>-->
      <!--          <a-icon class="item-icon" type="weibo-circle"></a-icon>-->
      <!--        </a>-->
      <!--        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>-->
      <!--      </div>-->
    </a-form>
    <a-modal title="忘记密码" v-model="showFogPwd">
      <a-form ref="formPwd" :form="formPwd">
        <a-form-item>
          <a-input
            type="text"
            placeholder="请输入帐户名"
            v-decorator="[
              'userName',
              {
                rules: [{ required: true, message: '请输入帐户名' }],
                validateTrigger: 'blur'
              }
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="请输入密码"
            v-decorator="['oldPwd', { rules: [{ required: true, message: '请输入旧密码' }], validateTrigger: 'blur' }]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="请输入新密码"
            v-decorator="['newPwd', { rules: [{ required: true, message: '请输入新密码' }], validateTrigger: 'blur' }]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" class="login-button" @click="submitPwd">
            确定
          </a-button>
        </a-form-item>
      </a-form>
      <div slot="footer"></div>
    </a-modal>
    <!--    <a-button @click="Logout">登出</a-button>-->
  </div>
</template>

<script>
// import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix, sha1 } from '@/utils/util'
import { getCode } from '@/api/user'

export default {
  data() {
    return {
      errText: '账户、密码错误',
      showFogPwd: false,
      verifyCode: '',
      authCode: '',
      codeSession: '',
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      formPwd: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created() {
    this.loadVerifyCode()
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'UpdatePwd', 'GetPicUploadSign', 'GetVideoUploadSign']),
    loadVerifyCode() {
      getCode().then(res => {
        this.authCode = res.data.imgData
        this.codeSession = res.data.session
      })
    },
    submitPwd() {
      console.log('忘记密码')
      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        console.log(err, values)
      })
    },
    updateVerifyCode() {
      this.loadVerifyCode()
    },
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this
      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'code'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = {
            userName: values.username,
            userPwd: sha1(values.password),
            // userPwd: values.password,
            code: values.code,
            codeSession: this.codeSession
          }
          // delete loginParams.username
          // loginParams[!state.loginType ? 'email' : 'username'] = values.username
          // loginParams.password = md5(values.password)
          Login(loginParams)
            .then(res => {
              console.log(res)
              this.loginSuccess(res)
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess(res) {
      console.log(res)
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
        this.$router.push({ name: 'analysis' }, () => {
          console.log('onComplete')
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        })
        */
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      this.errText = err.msg || '请求出现错误，请稍后再试'
      this.$notification['error']({
        message: '错误',
        description: (err.response || {}).data || err.msg || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    background: #fad956;
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    color: black;
    border:none;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
.verify-code {
  margin-bottom: 10px;
  .img-box {
    display: flex;
    justify-content: flex-end;
    img {
      border: 1px solid @border-color-base;
      width: 100%;
      height: 40px;
      cursor: pointer;
    }
  }
}
</style>
