<template>
  <div class="audit-test-container">
    <iframe
      id="audit-iframe"
      :src="src"
      frameborder="0"
      width="100%"
      height="100%"></iframe>

    <el-form v-model="form" inline label-width="120px">
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入备注信息"></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'audit-test',
  data() {
    return {
      form: {
        remark: '',
      },
    };
  },
  computed: {
    src() {
      return window.location.href.replace(/audit-test/, 'audit');
    },
  },
  created() {
    window.addEventListener('message', this.handleMessageEvent);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessageEvent);
  },
  methods: {
    handleMessageEvent(event) {
      if (event.data.type === 'submit-success') {
        console.log('iframe内容提交成功', event.data);
      }
    },
    submit() {
      const iframe = document.getElementById('audit-iframe');
      iframe.contentWindow.postMessage(
        {
          type: 'submit',
          origin: window.location.origin,
          data: {
            remark: '',
            userName: 'test',
            userId: 1,
          },
        },
        window.location.origin,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.audit-test-container {
  display: flex;
  flex-flow: column;
  height: 100vh;
  .el-form {
    padding: 10px 0;
  }
  .btns {
    display: flex;
    justify-content: center;
    margin: 10px 0;
    .el-button {
      background-color: #e20303;
      border-color: #e20303;
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
