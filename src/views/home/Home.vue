<template>
  <div>
    <h2>欢迎您，{{ coName }}</h2>
    <p>前台网址：<a :href="webSite" target="_blank">{{ webSite }}</a></p>
    <p>开通时间：{{ startedTime }}</p>
    <p>过期时间：{{ expireTime }}</p>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        coName: 'XXX有限公司',
        webSite: 'https://www.something.com',
        startedTime: '2020-02-01',
        expireTime: '2021-02-01'
      }
    }
  }
</script>
