<template>
  <div class="csc-header">
    <el-menu
      :collapse-transition="false"
      :default-active="activeIndex"
      class="csc-menu"
      mode="horizontal"
      text-color="#ffffff"
      active-color="#489db5"
      @select="handleSelect">
      <el-menu-item v-if="$isAllowed('browse')" index="project">
        <i class="fa fa-list"></i>
        <span>{{ $t('menu["项目列表"]') }}</span>
      </el-menu-item>
      <el-menu-item v-if="$isAllowed('manageSchema')" index="Schema">
        <i class="fa fa-cubes"></i>
        <span>{{ $text.schema['Schema管理'] }}</span>
      </el-menu-item>
      <el-menu-item v-if="$isAllowed('tableIdentification')" index="extraction">
        <i class="fa fa-table"></i>
        <span>{{ $t('menu["表格抽取"]') }}</span>
      </el-menu-item>
      <el-menu-item v-if="$isAllowed('manageUser')" index="user">
        <i class="fa fa-user"></i>
        <span>{{ $t('menu["用户管理"]') }}</span>
      </el-menu-item>
    </el-menu>
    <div class="user-info" v-popover:userLogout>
      <span>hello，{{ loginUser.name }}</span>
      <img src="../../../images/Ai-preset.png" alt="头像" />
      <i class="el-icon-arrow-down"></i>
    </div>
    <el-popover ref="userLogout" placement="bottom" width="150" trigger="click">
      <button class="logout-btn" @click="logout">退出登录</button>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';

export default {
  name: 'csc-top-menu',
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
    logout() {
      this.$store.dispatch('logout');
      if (this.$platform.isCscEnv()) {
        window.location.href = this.configuration.trident_url;
      } else {
        this.$router.push({ name: 'login' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.csc-header {
  position: sticky;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: linear-gradient(to right, #7bc9c9, #016b98);
  .el-menu {
    width: 100%;
  }
  .user-info {
    width: 190px;
    height: 61px;
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    cursor: pointer;
    span {
      white-space: nowrap;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}
.logout-btn {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
}
.csc-menu {
  background-color: transparent;
  border-bottom: none;
  ::v-deep .is-active {
    background-color: #489db5;
    border-bottom: none;
    color: #ffffff;
  }

  ::v-deep .el-menu-item {
    &:hover {
      background-color: #489db5;
      color: #ffffff;
    }
    &:focus {
      background-color: #489db5;
      color: #ffffff;
    }
  }
  ::v-deep i {
    margin-right: 5px;
    color: #ffffff;
  }
}
.menu-float {
  float: right;
}
</style>
