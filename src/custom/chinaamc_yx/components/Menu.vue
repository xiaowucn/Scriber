<template>
  <div class="header">
    <div class="logo">
      <img src="../../../images/logo.svg" alt="logo" />
      <el-divider direction="vertical"></el-divider>
    </div>
    <el-menu
      :collapse-transition="false"
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal">
      <el-menu-item v-if="$isAllowed('browse')" index="project">
        <svg-font-icon name="menu-project" :size="18"></svg-font-icon>
        任务列表
      </el-menu-item>
    </el-menu>
    <div class="user-info">
      {{ loginUser.name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'default-menu',
  data() {
    return {
      activeIndex: 'project',
    };
  },
  created() {},
  computed: {
    ...mapGetters(['loginUser']),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
  .logo {
    display: flex;
    align-items: center;

    img {
      height: 44px;
    }
  }
  .el-divider {
    background-color: #eaedf3;
    margin: 0 10px 0 30px;
    height: 30px;
  }

  .el-menu {
    width: 80%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: none;

    .el-menu-item {
      display: flex;
      align-items: center;
      border-bottom: none !important;
      color: #303133;
      &.is-active {
        color: $--color-primary !important;
      }

      .svg-icon-container {
        margin-right: 5px;
      }
      i {
        font-size: 19px;
        color: inherit;
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: end;
    width: 20%;
    margin-right: 5px;
    color: #606266;
  }
}
</style>
