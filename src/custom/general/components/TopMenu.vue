<template>
  <div class="general-header">
    <div class="logo">
      <img
        v-if="$platform.isCgsEnv() && brandLogo === 'paoding'"
        class="logo-default"
        src="@/custom/general/assets/logo-paoding.png"
        alt="logo" />
      <img
        v-else-if="$platform.isCgsEnv()"
        class="logo-cgs"
        src="@/custom/general/assets/logo-cgs.png"
        alt="logo" />
      <img
        v-else-if="$platform.isGffundEnv()"
        class="logo-gffund"
        src="@/custom/general/assets/logo-gffund.png"
        alt="logo" />
      <img
        v-else
        class="logo-default"
        src="@/assets/svg-icons/logo.svg"
        alt="logo" />
    </div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      background-color="#225476"
      text-color="#fff"
      @select="handleSelect">
      <el-menu-item index="project">项目管理</el-menu-item>
      <el-menu-item index="schema">{{
        $text.schema['Schema管理']
      }}</el-menu-item>
      <el-submenu
        v-if="showRuleMenu"
        index="cgs"
        :popper-append-to-body="false">
        <template slot="title">规则管理</template>
        <el-menu-item
          v-if="$isAllowed('customerRuleParticipate')"
          :index="
            $isAllowed('showFileScenario')
              ? 'switch-custom-rules'
              : 'custom-rules'
          ">
          自定义规则
        </el-menu-item>
        <el-menu-item
          v-if="$isAllowed('developedRuleBrowse')"
          index="developed-rules">
          研发规则
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        index="laws"
        v-if="$isAllowed('showFileScenario') && $isAllowed('manageLaw')">
        文档库管理
      </el-menu-item>
      <el-menu-item v-if="showToolsMenuItem" index="tools">
        工具栏
      </el-menu-item>
      <el-menu-item
        v-if="$isAllowed('manageUser') && !configuration.trident_url"
        index="user">
        用户管理
      </el-menu-item>
    </el-menu>
    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ loginUser.name }} <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';

export default {
  name: 'general-top-menu',
  created() {
    const path = this.$route.path;
    this.routeTo({ path });
    EventBus.$on('route-to', this.routeTo);
  },
  beforeDestroy() {
    EventBus.$off('route-to', this.routeTo);
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters({ activeIndex: 'menuActiveIndex' }),
    brandLogo() {
      // 读取 Vite 环境变量中的配置
      return import.meta.env.VITE_BRAND;
    },
    showRuleMenu() {
      return (
        this.$isAllowed('customerRuleParticipate') ||
        this.$isAllowed('developedRuleBrowse')
      );
    },
    showToolsMenuItem() {
      return this.configuration.gffund_parse_excel;
    },
  },
  methods: {
    handleSelect(activeMenuItem) {
      this.$router.push({
        path: '/' + activeMenuItem,
      });
    },
    activeMenu(activeMenuItem) {
      this.$store.commit('CHANGE_MENUACTIVE', activeMenuItem);
    },
    routeTo({ path }) {
      const route = path.replace(/^\/|\/$/g, '').split('/')[0];
      this.activeMenu(route);
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
@import '../element-variables.scss';
$--active-bg-color: #0470cb;

.general-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: $--color-primary;
  z-index: 9;
  .logo {
    img {
      vertical-align: middle;
    }
    .logo-cgs {
      width: 250px;
    }
    .logo-gffund {
      width: 155px;
    }
    .logo-default {
      width: 120px;
    }
  }
  .el-menu {
    width: 100%;
    padding: 0 20px;
    background-color: transparent;
    border-bottom: none;
    .is-active {
      background-color: $--active-bg-color !important;
      color: #fff;
    }
    .el-menu-item {
      border-bottom: none;
      &:hover,
      &:focus,
      &.is-active {
        background-color: $--active-bg-color;
        color: #fff;
      }
    }
    .el-submenu {
      &.is-active {
        color: #ffffff;
        ::v-deep .el-submenu__title {
          background-color: $--active-bg-color !important;
          color: #fff;
          border-bottom: none;
        }
      }
      ::v-deep .el-menu--horizontal {
        width: 118px !important;
      }
      ::v-deep .el-menu--popup {
        min-width: 100px !important;
        .el-menu-item {
          min-width: 100px !important;
        }
      }
    }
  }
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    .name {
      margin-left: 10px;
    }
    .el-dropdown {
      margin-left: 10px;
      cursor: pointer;
      color: #fff;
      white-space: nowrap;
      i {
        margin-left: 5px;
      }
    }
  }
}
</style>
