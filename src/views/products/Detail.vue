<template>
  <page-header-wrapper>
    <div class="table-page-search-wrapper">details: {{ productId }}</div>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      productId: this.$route.params.id
    }
  }
}
</script>

<style scoped></style>
