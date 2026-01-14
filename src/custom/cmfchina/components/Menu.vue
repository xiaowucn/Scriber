<template>
  <div class="header">
    <div class="logo">
      <img
        v-if="configuration.client_name === 'gjzq'"
        src="../../../images/logo.svg"
        style="height: 40px"
        alt="logo" />
      <img v-else src="../assets/logo.png" alt="logo" />
      <el-divider direction="vertical" />
    </div>
    <el-menu
      :collapse-transition="false"
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect">
      <el-menu-item index="panorama" v-if="cmfchinaPermAllowed('para')">
        <svg-font-icon name="menu-panorama" />
        数据全景
      </el-menu-item>
      <el-menu-item index="project" v-if="cmfchinaPermAllowed('prj')">
        <svg-font-icon name="menu-project-cmf" />
        项目管理
      </el-menu-item>
      <el-menu-item index="schema" v-if="cmfchinaPermAllowed('scene')">
        <svg-font-icon name="menu-scene" />
        场景管理
      </el-menu-item>
      <el-menu-item index="custom-rules" v-if="cmfchinaPermAllowed('rule')">
        <svg-font-icon name="menu-rule-cmf" />
        规则管理
      </el-menu-item>
      <el-menu-item index="filed" v-if="cmfchinaPermAllowed('classification')">
        <svg-font-icon name="menu-file-filed" />
        文档分类配置
      </el-menu-item>
      <el-menu-item index="model" v-if="cmfchinaPermAllowed('model')">
        <svg-font-icon name="menu-model" />
        模型配置
      </el-menu-item>
      <!-- <el-menu-item index="dataPermissions">
        <svg-font-icon name="menu-data" />
        数据权限
      </el-menu-item> -->
      <el-menu-item
        index="statisticalEvaluation"
        v-if="cmfchinaPermAllowed('stat')">
        <svg-font-icon name="menu-statistical" />
        统计评估
      </el-menu-item>
      <el-menu-item
        index="permissionManagement"
        v-if="cmfchinaPermAllowed('super_admin')">
        <svg-font-icon name="menu-permission-management" />
        权限管理
      </el-menu-item>
      <el-menu-item
        index="businessGroupManagement"
        v-if="cmfchinaPermAllowed('group')">
        <svg-font-icon name="menu-business-group" :size="16" />
        业务组管理
      </el-menu-item>
      <el-menu-item index="emailConfig" v-if="cmfchinaPermAllowed('email')">
        <svg-font-icon name="menu-email" />
        邮箱配置
      </el-menu-item>
      <el-menu-item index="user" v-if="showUserManagement">
        <svg-font-icon name="menu-user" />
        用户管理
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
import { cmfchinaPermAllowed } from '../common/utils';

export default {
  name: 'default-menu',
  data() {
    return {
      activeIndex: 'panorama',
    };
  },
  created() {
    this.init();
  },
  watch: {
    '$route.path'() {
      this.init();
    },
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),

    showUserManagement() {
      if (this.configuration.trident_url) {
        return false;
      }
      return this.$isAllowed('manageUser');
    },
  },
  methods: {
    cmfchinaPermAllowed,
    init() {
      const path = this.$route.path;
      const activeMenuItem = path.split('/')[1];
      if (activeMenuItem === 'search') {
        this.activeMenu('project');
      } else {
        this.activeMenu(activeMenuItem);
      }
    },
    activeMenu(activeMenuItem) {
      this.activeIndex = activeMenuItem;
    },
    handleSelect(activeMenuItem) {
      if (this.$route.path === `/${activeMenuItem}`) {
        this.$router.replace({ query: {} });
        window.location.reload();
      } else {
        this.$router.push({
          path: `/${activeMenuItem}`,
        });
      }
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
          window.location.href = `${this.configuration.trident_url}/api/v1/user/customer-logout`;
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
      height: 35px;
    }
  }

  .el-divider {
    background-color: #eaedf3;
    margin: 0 11px 0 20px;
    height: 40px;
  }

  .el-menu {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: none;

    .el-menu-item {
      display: flex;
      align-items: center;
      color: #303133;
      padding: 0 11px;
      border-bottom: none !important;

      &.is-active {
        color: $--color-primary !important;
      }
    }

    .el-submenu {
      ::v-deep .el-submenu__icon-arrow {
        display: none;
      }

      ::v-deep .el-submenu__title {
        display: flex;
        align-items: center;
        color: #303133;
        padding: 0 11px;
        border-bottom: none !important;
      }

      ::v-deep .el-menu--popup {
        margin-left: 10px;
        min-width: 100px;

        .el-menu-item {
          min-width: 100px;
          justify-content: center;

          &:hover {
            color: $--color-primary;
          }
        }
      }

      &.is-active {
        ::v-deep .el-submenu__title {
          color: $--color-primary !important;
        }
      }
    }

    .el-menu-item,
    .el-submenu {
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
      cursor: pointer;
      margin-left: 10px;
      white-space: nowrap;

      i {
        margin-left: 5px;
      }
    }
  }
}
</style>
