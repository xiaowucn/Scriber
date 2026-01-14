<template>
  <el-menu
    :collapse-transition="false"
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect">
    <el-menu-item index="project">{{ $t('menu["项目列表"]') }}</el-menu-item>
    <el-menu-item v-if="showUserManagement" index="user" class="menu-float">
      {{ $t('menu["用户管理"]') }}
    </el-menu-item>
    <el-menu-item
      index="Schema"
      :class="$platform.isStencilEnv() ? '' : 'menu-float'"
      >{{ $t('menu["Schema列表"]') }}</el-menu-item
    >
    <el-menu-item
      v-if="$features.showFileTag()"
      index="tag"
      class="menu-float"
      >{{ $t('menu["文件类型管理"]') }}</el-menu-item
    >
    <el-menu-item v-if="showToolsMenuItem" index="tools" class="menu-float">
      {{ $t('menu["工具栏"]') }}
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '../utils';

export default {
  name: 'top-menu',
  created() {
    const path = this.$route.path;
    const activeMenuItem = path.split('/')[1];
    this.activeMenu(activeMenuItem);
    EventBus.$on('route-to', this.routeTo);
  },
  beforeDestroy() {
    EventBus.$off('route-to', this.routeTo);
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters({ activeIndex: 'menuActiveIndex' }),

    showUserManagement() {
      if (this.configuration.trident_url) {
        return false;
      }
      return this.$isAllowed('manageUser');
    },
    showToolsMenuItem() {
      return this.configuration.enable_pdf2word;
    },
  },
  methods: {
    handleSelect(activeMenuItem) {
      if (this.$platform.isStencilEnv()) {
        if (activeMenuItem === 'project' && this.configuration.stencil_host) {
          window.location.href = this.configuration.stencil_host;

          return;
        }
      }
      this.$router.push({
        path: `/${activeMenuItem}`,
      });
    },
    activeMenu(activeMenuItem) {
      this.$store.commit('CHANGE_MENUACTIVE', activeMenuItem);
    },
    routeTo({ path }) {
      const firstWord = path.slice(1).split('/');
      this.activeMenu(firstWord[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .menu-float {
    float: right;
  }
  .el-menu-item {
    &.is-active {
      color: #409eff;
    }
  }
}
</style>
