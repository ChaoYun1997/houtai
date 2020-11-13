<template>
  <div :class="prefixCls">
    <div class="chart-wrapper" :style="{ height: 346 }">
      <v-chart :force-fit="true" :height="300" :data="dataSource" :scale="scale" :padding="[36, 30, 20, 40]">
        <v-tooltip />
        <v-axis />
        <v-legend />
        <v-smooth-line position="x*y" color="amount" :size="2" />
        <v-point position="x*y" color="amount" shape="circle" />
      </v-chart>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Line',
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-smooth-area'
      },
      scale: {
        type: [Object, Array],
        required: true
      },
      dataSource: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        height: 100
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "smooth.area.less";
</style>
