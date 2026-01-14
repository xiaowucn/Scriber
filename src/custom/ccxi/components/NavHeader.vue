<template>
  <div class="ccxi-header">
    <div class="logo">
      <img src="../../../images/ccxi-logo.png" alt="" />
      <h4>中诚信国际结构融资平台</h4>
    </div>
    <el-menu
      v-if="!$user.isCcxiNormalUser()"
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      text-color="#fff"
      @select="handleSelect">
      <el-menu-item index="project">项目文档</el-menu-item>
      <el-menu-item index="Schema">Schema</el-menu-item>
      <el-menu-item index="tag">文件类型管理</el-menu-item>
      <el-menu-item v-if="$isAllowed('manageUser')" index="user">
        用户管理
      </el-menu-item>
    </el-menu>
    <div class="user-info">
      <span class="welcome">欢迎</span>
      <span v-if="$user.isCcxiNormalUser()" class="name">
        {{ loginUser.name }}
      </span>
      <el-dropdown v-else @command="handleCommand">
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
  name: 'ccxi-top-menu',
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
.ccxi-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: #004681;
  z-index: 9;
  .logo {
    position: relative;
    display: flex;
    align-items: center;
    width: 25%;
    margin-right: 40px;
    color: #fff;
    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .menu {
    position: relative;
    width: 100%;
    padding: 0 50px;
    background-color: transparent;
    border-bottom: none;
    &::before {
      position: absolute;
      top: 20px;
      left: 0;
      content: '';
      width: 1px;
      height: 20px;
      background: #fff;
    }
    .is-active {
      background-color: #0259a2;
      color: #ffffff;
    }
    .el-menu-item {
      &:hover,
      &:focus {
        background-color: #0259a2;
        color: #ffffff;
      }
    }
  }
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    .welcome {
      position: relative;
      width: 40px;
      padding-right: 5px;
      &::after {
        position: absolute;
        top: 5px;
        right: 0;
        content: '';
        width: 1px;
        height: 14px;
        background: #fff;
      }
    }
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
