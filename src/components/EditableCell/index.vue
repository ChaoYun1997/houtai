<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-row type="flex" justify="space-between">
        <a-col :span="12">
          <a-input :value="value" @change="handleChange" style="width: 160px;" @pressEnter="check" />
        </a-col>
        <a-col :span="4">
          <a-icon type="check" class="editable-cell-icon-check" style="margin-right: 5px" @click="check" />
          <a-popconfirm
            title="确定要删除该数据吗?"
            @confirm="$emit('delete')"
          >
            <a-icon type="delete" />
          </a-popconfirm>
        </a-col>
      </a-row>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      <a-row type="flex" justify="space-between">
        <a-col :span="12">
          {{ value || ' ' }}
        </a-col>
        <a-col :span="4">
          <a-icon type="edit" class="editable-cell-icon" style="margin-right: 5px" @click="edit" />
          <a-popconfirm
            title="确定要删除该数据吗?"
            @confirm="$emit('delete')"
          >
            <a-icon type="delete" />
          </a-popconfirm>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      this.value = value
    },
    check() {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true
    }
  }
}
</script>

<style scoped></style>
