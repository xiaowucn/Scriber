<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'hkex-user',
};
</script>

<style lang="scss" scoped>
::v-deep header {
  margin-bottom: 20px;

  h2 {
    font-size: 24px;

    &::before {
      content: '';
      display: inline-block;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      background: url('~@/images/summary.svg') center no-repeat;
    }
  }
}
</style>
