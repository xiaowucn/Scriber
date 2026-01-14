<template>
  <div class="not-found">
    <el-empty description="404">
      <p>{{ $t(`message['页面未找到或无权限浏览']`) }}</p>
      <el-button type="primary" size="small" @click="goHomepage">
        {{ $t(`message['返回首页']`) }}
      </el-button>
    </el-empty>
  </div>
</template>

<script>
export default {
  name: 'not-found',
  methods: {
    goHomepage() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: baseline;
  height: 100vh;
  ::v-deep .el-empty {
    padding: 100px 0 0 0;
    .el-empty__description {
      p {
        font-size: 36px;
      }
    }
    .el-empty__bottom {
      p {
        margin-bottom: 30px;
        color: #666;
      }
    }
    .el-button :is(a) {
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>
