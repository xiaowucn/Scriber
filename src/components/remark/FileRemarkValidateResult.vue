<template>
  <div class="el-card error-card-container" shadow="never">
    <div class="error-title">
      <span>{{ $t(`message['数据校验失败']`) }}</span>
      <el-button
        size="mini"
        type="text"
        icon="el-icon-close"
        @click="resetErrors"></el-button>
    </div>
    <div v-for="(item, index) in errorTips" :key="index" class="error-content">
      <span>{{ item.name }}: {{ item.message }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'file-remark-validate-result',
  computed: {
    ...mapGetters('remarkModule', ['errorTips']),
  },
  methods: {
    resetErrors() {
      this.$store.commit('remarkModule/SET_ERROR_TIPS', []);
    },
  },
};
</script>

<style scoped lang="scss">
.error-card-container {
  margin: 0 20px 5px 20px;
  overflow: initial;
  .error-title {
    padding: 6px 10px;
    span {
      margin-right: 10px;
    }
  }
  .error-content {
    border-top: 1px solid #edf0f5;
    padding: 5px 10px;
    color: red;
  }
}
</style>
