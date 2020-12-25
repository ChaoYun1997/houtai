<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-row type="flex" justify="space-between">
        <a-col :span="24" class="s-flex s-flex-align-center s-flex-center">
          <a-input :value="value" @change="handleChange" style="width: 160px;" @pressEnter="check" />
          <a-icon type="check" class="editable-cell-icon-check" style="margin-left:10px;margin-right: 5px" @click="check" />
          <a-icon type="close" class="editable-cell-icon-check" style="margin-right: 5px" @click="cancelEdit" />
          <a-popconfirm
            v-if="showDel"
            title="确定要删除该数据吗?"
            @confirm="$emit('delete')"
          >
            <a-icon type="delete" />
          </a-popconfirm>
        </a-col>
      </a-row>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      <a-row type="flex">
        <a-col :span="24" class="s-flex s-flex-center s-flex-align-center">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" style="margin-left:10px;margin-right: 5px" @click="edit" />
          <a-popconfirm
            v-if="showDel"
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
    },
    showDel: {
      type: Boolean,
      default: false
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
    },
    cancelEdit() {
      this.editable = false
    }
  }
}
</script>

<style scoped></style>
