<template>
  <div class="left-menu">
    <el-menu
      :collapse="isMenuCollapsed"
      :collapse-transition="false"
      :default-active="defaultActive"
      @select="handleSelect">
      <el-menu-item class="brand">
        <img src="../assets/logo.svg" alt="logo" class="logo" />
        <span class="text">智能文本识别</span>
      </el-menu-item>
      <template v-for="menuItem in menuItems">
        <el-tooltip
          :content="menuItem.label"
          :key="menuItem.key"
          placement="right"
          effect="light"
          popper-class="nafmii-menu-tooltip"
          :visible-arrow="false"
          :disabled="!isMenuCollapsed">
          <el-menu-item
            v-if="menuItem.isAllowed"
            :index="menuItem.key"
            class="menu-item">
            <svg-font-icon
              :name="menuItem.icon"
              :color="defaultActive === menuItem.key ? '#333333' : '#ffffff'"
              :size="18" />
            <span class="menu-item-text">
              {{ menuItem.label }}
            </span>
          </el-menu-item>
        </el-tooltip>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';

export default {
  name: 'left-menu',
  props: {
    isMenuCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  created() {
    const path = this.$route.path;
    const activeMenuItem = path.split('/')[1];
    const activeMenuInfo = this.menuItems.find(
      (item) => item.key === activeMenuItem,
    );
    const currentIsAllowed = activeMenuInfo.isAllowed;

    if (!currentIsAllowed) {
      const activeMenu = this.menuItems.find((item) => item.isAllowed);
      this.activeMenu(activeMenu.key);

      this.$router.push({
        path: `/${activeMenu.key}`,
      });
    } else {
      this.activeMenu(activeMenuItem);
    }
    EventBus.$on('route-to', this.routeTo);
  },
  beforeDestroy() {
    EventBus.$off('route-to', this.routeTo);
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('nafmiiModule', ['menu']),
    menuItems() {
      return [
        {
          key: 'project',
          label: '识别文件管理',
          icon: 'menu-project',
          isAllowed: this.$isAllowed('manageAll'),
        },
        {
          key: 'schema',
          label: '算法模型管理',
          icon: 'menu-schema',
          isAllowed: this.$isAllowed('manageAll'),
        },
        {
          key: 'sensitive-words',
          label: '敏感词管理',
          icon: 'menu-word',
          isAllowed: this.$isAllowed('manageAll'),
        },
        {
          key: 'data-knowledge',
          label: '数据知识管理',
          icon: 'menu-knowledge',
          isAllowed: this.$isAllowed('manageAll'),
        },
        {
          key: 'system-log',
          label: '系统日志管理',
          icon: 'menu-log',
          isAllowed: this.$isAllowed('manageAll'),
        },
        {
          key: 'task',
          label: '识别任务管理',
          icon: 'menu-task',
          isAllowed: this.$isAllowed('manageTask'),
        },
        {
          key: 'user',
          label: '用户管理',
          icon: 'menu-user',
          isAllowed: this.showUserManagement,
        },
      ];
    },
    defaultActive() {
      return this.menu.activeItem.key;
    },
    showUserManagement() {
      if (this.configuration.trident_url) {
        return false;
      }
      return this.$isAllowed('manageUser');
    },
  },
  methods: {
    activeMenu(activeMenuItem) {
      const activeMenuName = this.menuItems.find(
        (item) => item.key === activeMenuItem,
      ).label;
      const activeItem = {
        key: activeMenuItem,
        label: activeMenuName,
      };
      this.$store.commit('nafmiiModule/SET_ACTIVE_MENU_ITEM', activeItem);
    },
    routeTo({ path }) {
      const firstWord = path.slice(1).split('/');
      this.activeMenu(firstWord[0]);
    },
    handleSelect(activeMenuItem) {
      if (!activeMenuItem) {
        return;
      }
      this.$router.push({
        path: `/${activeMenuItem}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.left-menu {
  height: 100%;
  .el-menu {
    height: 100%;
    width: 240px;
    .el-menu-item {
      height: 47px;
      line-height: 47px;
      padding-left: 32px !important;
    }
    &.el-menu--collapse {
      width: 120px;
      .el-menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 !important;
      }
      .brand {
        .text {
          margin-left: 0px;
        }
      }
    }
  }
  .brand {
    cursor: unset;
    margin: 20px 0px 16px;
    .logo {
      width: 50px;
      height: 50px;
    }
    .text {
      font-size: 16px;
      line-height: 21px;
      margin-left: 10px;
    }
    &.el-menu-item {
      display: block;
      height: 60px;
      line-height: 60px;
      padding-left: 35px !important;
      &:hover,
      &:focus {
        background-color: unset;
      }
      &.is-active {
        color: $--color-white;
        background-color: unset;
      }
    }
  }
  .menu-item {
    display: flex;
    .menu-item-text {
      margin-left: 10px;
    }
  }
}
</style>

<style lang="scss">
.nafmii-menu-tooltip {
  &.el-tooltip__popper {
    margin-left: 2px !important;
    color: #333333;
    font-size: 14px;
    line-height: 1.4;
    border: 1px solid #ebeef5 !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
