<template>
  <a-form-model ref="form" :model="form" :rules="rules">
    <a-form-model-item label="name" prop="name">
      <a-input v-model="form.name"></a-input>
    </a-form-model-item>
    <a-form-model-item label="Activity form" prop="desc">
      <a-input v-model="form.desc" type="textarea" />
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSubmit">提交</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      form: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(valid, this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped></style>
