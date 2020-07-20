<template>
  <div>
    <p>欢迎您，<b>{{ nick }}</b></p>
    <h2>{{ websiteName }}</h2>
    <p>
      前台网址：<a :href="site" target="_blank">{{ website }}</a>
    </p>
    <p>开通时间：{{ openDate }}</p>
    <p>过期时间：{{ expDate }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Home',
  computed: {
    ...mapState({
      nick: state => state.user.nick,
      websiteName: state => state.user.websiteName,
      openDate: state => state.user.openDate,
      expDate: state => state.user.expDate,
      website: state => state.user.website
    }),
    site() {
      return this.website.startsWith('http://') || this.website.startsWith('https://')
        ? this.website
        : `http://${this.website}`
    }
  }
}
</script>
