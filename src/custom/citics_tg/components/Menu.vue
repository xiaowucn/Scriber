<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo" />
      <el-divider direction="vertical"></el-divider>
    </div>
    <el-menu
      :collapse-transition="false"
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect">
      <el-menu-item v-if="isCiticsTgAllow('sys')" index="sysFullView">
        <i class="el-icon-view"></i>
        {{ $t('menu["系统全景"]') }}
      </el-menu-item>
      <el-menu-item v-if="isCiticsTgAllow('prj')" index="projectList">
        <svg-font-icon name="menu-project" :size="18"></svg-font-icon>
        {{ $t('menu["项目列表"]') }}
      </el-menu-item>
      <el-menu-item v-if="isCiticsTgAllow('template')" index="templateManage">
        <i class="el-icon-s-operation"></i>
        {{ $t('menu["模板管理"]') }}
      </el-menu-item>
      <el-menu-item v-if="isCiticsTgAllow('push')" index="dataPushConfig">
        <i class="el-icon-setting"></i>
        {{ $t('menu["数据推送配置"]') }}
      </el-menu-item>
      <el-menu-item v-if="isCiticsTgAllow('para')" index="paramMapConfig">
        <i class="el-icon-s-operation"></i>
        {{ $t('menu["参数值映射配置表"]') }}
      </el-menu-item>
      <el-submenu
        v-if="isCiticsTgAllow('record')"
        index="productResults"
        popper-class="record-manage-popper">
        <template slot="title">
          <i class="el-icon-position"></i>
          {{ $t('menu["记录管理"]') }}
        </template>
        <el-menu-item
          v-if="isCiticsTgAllow('record_product')"
          index="productResults">
          {{ $t('menu["产品结果"]') }}
        </el-menu-item>
        <el-menu-item
          v-if="isCiticsTgAllow('record_rate')"
          index="accuracyStatistics"
          >{{ $t('menu["准确率统计"]') }}</el-menu-item
        >
        <el-menu-item
          v-if="isCiticsTgAllow('record_push')"
          index="pushRecord"
          >{{ $t('menu["推送记录"]') }}</el-menu-item
        >
      </el-submenu>
      <el-menu-item v-if="$user.isCiticsTgNormalUser()" index="scriber">
        <svg-font-icon name="window" :size="18"></svg-font-icon>
        {{ $t('menu["文档智能提取"]') }}
      </el-menu-item>
    </el-menu>
    <div class="user-info">
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
import { isCiticsTgAllow } from '../common/utils';
import { MENU_INFO } from '../common/constant';
export default {
  name: 'default-menu',
  data() {
    return {
      activeIndex: 'sysFullView',
      prefix: 'citics-tg',
    };
  },
  created() {
    const path = this.$route.path;
    this.activeIndex = path.split('/')[2];
    const activePerm = MENU_INFO.find(
      (item) => item.index === this.activeIndex,
    )?.perm;

    const paramPerms = this.loginUser.param_perms;
    if (!paramPerms.includes(activePerm)) {
      const activeMenu = MENU_INFO.find((item) =>
        paramPerms.includes(item.perm),
      );
      this.activeIndex = activeMenu.index;
      this.$router.push({
        path: `/${this.prefix}/${this.activeIndex}`,
      });
    }
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
  },
  methods: {
    isCiticsTgAllow,
    handleSelect(activeMenuItem) {
      if (activeMenuItem === 'scriber') {
        const { href } = this.$router.resolve({
          path: '/project',
        });
        window.open(href, '_blank');
        return;
      }
      this.$router.push({
        path: `/${this.prefix}/${activeMenuItem}`,
      });
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout');

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
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: none;

    .el-submenu {
      ::v-deep .el-submenu__title {
        color: #303133;
        border-bottom: none !important;
        i {
          font-size: 19px;
          color: inherit;
          &.el-icon-position {
            margin-right: 0;
          }
          &.el-icon-arrow-down {
            margin-left: 2px;
            font-size: 16px;
          }
        }
      }
      &.is-active {
        ::v-deep .el-submenu__title {
          color: $--color-primary !important;
        }
      }
    }

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
<style lang="scss">
.record-manage-popper {
  margin-left: 45px;
  .el-menu-item {
    color: #303133 !important;
    &:hover {
      color: #909399 !important;
    }
    &.is-active {
      color: #909399 !important;
    }
  }
}
</style>
