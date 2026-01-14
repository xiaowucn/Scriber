<template>
  <div class="header">
    <div class="logo">
      <img
        v-if="isShowCiticsLogo"
        src="../custom/citics_tg/assets/logo.png"
        alt="logo" />
      <img
        v-else-if="isShowFullgoalLogo"
        src="../custom/fullgoal/assets/logo.png"
        alt="logo"
        class="fullgoal" />
      <img v-else src="../images/logo.svg" alt="logo" />
      <el-divider v-if="isShowDivider" direction="vertical"></el-divider>
    </div>
    <el-menu
      v-if="isShowMenu"
      :collapse-transition="false"
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect">
      <el-menu-item v-if="$isAllowed('browse')" index="project">
        <svg-font-icon name="menu-project" :size="18"></svg-font-icon>
        {{ $t('menu["项目列表"]') }}
      </el-menu-item>
      <el-menu-item v-if="$isAllowed('browseSchema')" index="schema">
        <svg-font-icon name="menu-schema" :size="18"></svg-font-icon>
        {{ $t('menu["Schema列表"]') }}
      </el-menu-item>
      <el-submenu
        v-if="$isAllowed('customerRuleParticipate')"
        index="rule"
        :popper-append-to-body="false">
        <template slot="title"
          ><svg-font-icon name="menu-rule" :size="18"></svg-font-icon
          >{{ $t('menu["规则管理"]') }}</template
        >
        <el-menu-item
          v-if="$isAllowed('customerRuleParticipate')"
          index="custom-rules">
          自定义规则
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-if="showToolsMenuItem" index="tools">
        <svg-font-icon name="menu-tools" :size="18"></svg-font-icon>
        {{ $t('menu["工具栏"]') }}
      </el-menu-item>
      <el-menu-item v-if="showUserManagement" index="user">
        <svg-font-icon name="menu-user" :size="18"></svg-font-icon>
        {{ $t('menu["用户管理"]') }}
      </el-menu-item>
      <el-menu-item v-if="$user.isCiticsTgCustomUser()" index="citics_tg">
        <svg-font-icon name="window" :size="18"></svg-font-icon>
        {{ $t('menu["参数提取稽核"]') }}
      </el-menu-item>
    </el-menu>
    <div v-if="showUserInfo" class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ loginUser.name }} <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '../utils';

export default {
  name: 'default-menu',
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
    ...mapGetters(['loginUser', 'configuration']),
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
    isShowCiticsLogo() {
      return this.$platform.isCiticsTGEnv();
    },
    isShowFullgoalLogo() {
      return this.$platform.isFullgoalEnv();
    },
    showUserInfo() {
      if (!this.$platform.isCmbchinaEnv()) {
        return true;
      }
      return this.configuration.trident_url === undefined;
    },
    isShowMenu() {
      return !this.$route.meta.hideMenuInHeader;
    },
    isShowDivider() {
      return this.isShowMenu;
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
      if (activeMenuItem === 'citics_tg') {
        const { href } = this.$router.resolve({
          path: '/citics-tg/sysFullView',
        });
        window.open(href, '_blank');
        return;
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
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout');

        if (this.configuration.cas_logout_url) {
          window.location.href = this.configuration.cas_logout_url;
          return;
        }

        if (this.configuration.trident_url) {
          window.location.href = this.configuration.trident_url;
          return;
        }

        this.$router.push({ name: 'login' });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
  height: 60px;

  .logo {
    display: flex;
    align-items: center;

    img {
      height: 44px;
      &.fullgoal {
        height: 32px;
      }
    }
  }
  .el-divider {
    background-color: #eaedf3;
    margin: 0 10px 0 30px;
    height: 30px;
  }

  .el-menu {
    width: 100%;
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
    }

    .el-submenu {
      display: flex;
      align-items: center;

      .svg-icon-container {
        margin-right: 5px;
      }

      ::v-deep .el-submenu__icon-arrow {
        display: none;
      }

      ::v-deep .el-submenu__title {
        display: flex;
        align-items: center;
        color: #303133;
        border-bottom: none !important;
      }

      ::v-deep .el-menu--popup {
        margin-left: 20px;
        min-width: 100px;

        .el-menu-item {
          min-width: 100px;

          &:hover {
            color: $--color-primary;
          }
        }
      }

      &.is-active {
        ::v-deep .el-submenu__title {
          color: #0090c0 !important;
        }
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;

    .name {
      margin-left: 10px;
    }
    .el-dropdown {
      margin-left: 10px;
      cursor: pointer;
      white-space: nowrap;
      i {
        margin-left: 5px;
      }
    }
  }
}
</style>
