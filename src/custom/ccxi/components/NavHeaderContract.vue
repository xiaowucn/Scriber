<template>
  <div class="ccxi-contract-header">
    <div class="logo">
      <img src="../../../images/ccxi-logo.png" alt="" />
      <h4>中诚信国际合同提取</h4>
    </div>
    <el-menu
      :collapse-transition="false"
      :default-active="activeIndex"
      class="menu"
      text-color="#fff"
      mode="horizontal"
      @select="handleSelect">
      <el-menu-item index="project">{{ $t('menu["项目管理"]') }}</el-menu-item>
      <el-menu-item v-if="$isAllowed('manageContract')" index="contract">{{
        $t('menu["合同管理"]')
      }}</el-menu-item>
      <el-menu-item index="Schema">{{
        $text.schema['Schema管理']
      }}</el-menu-item>
      <el-menu-item v-if="showUserManagement" index="user">
        {{ $t('menu["用户管理"]') }}
      </el-menu-item>
    </el-menu>
    <div class="user-info">
      <img src="../../../images/user.svg" alt="" />
      <el-dropdown @command="logout">
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
import { EventBus } from '@/utils';

export default {
  name: 'ccxi-contract-top-menu',
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
  },
  methods: {
    handleSelect(activeMenuItem) {
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
    async logout() {
      try {
        await this.$store.dispatch('logout');
        if (this.configuration.trident_url) {
          window.location.href = this.configuration.trident_url;
        } else {
          this.$router.push({ name: 'login' });
        }
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
.ccxi-contract-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: #027db4;
  z-index: 9;
  .logo {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 40px;
    color: #fff;
    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    h4 {
      white-space: nowrap;
      &::after {
        position: absolute;
        top: 5px;
        right: -20px;
        content: '';
        width: 1px;
        height: 20px;
        background: #fff;
      }
    }
  }
  .menu {
    position: relative;
    width: 100%;
    padding: 0 50px;
    background-color: transparent;
    border-bottom: none;

    .is-active {
      background-color: #70b6d3;
      color: #ffffff;
    }
    .el-menu-item {
      &:hover,
      &:focus {
        background-color: #70b6d3;
        color: #ffffff;
      }
    }
  }
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
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
