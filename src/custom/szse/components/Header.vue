<template>
  <div class="header" :class="customClass">
    <div class="left">
      <h4 class="title">
        <img :src="logoUrl" alt="" />
        <span>{{ title }}</span>
      </h4>
      <el-menu
        :default-active="$route.path.split('/').slice(-1)[0]"
        class="el-menu-demo"
        mode="horizontal">
        <template v-for="(menu, index) in menuItems">
          <el-menu-item
            v-if="$isAllowed(menu.perimeter) && !menu.hide"
            :key="index"
            :index="menu.name"
            :class="menu.name">
            <router-link :to="{ path: menu.path }" :target="menu.target">
              <i :class="menu.icon"></i>
              <span>{{ menu.text }}</span>
            </router-link>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <span>{{ loginUser.name }}</span>
        <i v-if="!hideLogout" class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" v-if="!hideLogout">
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ipoLogo from '@/images/ipo-logo.svg';

export default {
  name: 'ipo-header',
  props: {
    title: {
      type: String,
      required: false,
      default: '招股书说明书数据抽取填报平台',
    },
    customClass: {
      type: String,
      required: false,
      default: '',
    },
    menuItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    hideLogout: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      logoUrl: ipoLogo,
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
    },
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  padding: 0 20px;
  background: #3e5993;
  .left {
    display: flex;
    align-items: center;
    width: 95%;
    .title {
      display: flex;
      align-items: center;
      width: 20%;
      margin-right: 20px;
      color: #fff;
      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .el-menu {
      width: 80%;
      background: #3e5993;
      border-bottom: none;
      .el-menu-item {
        height: 40px;
        line-height: 38px;
        margin: 10px 20px;
        border-radius: 5px;
        color: #fff;
        border-bottom: none;
        &.is-active {
          background: #96a4c4;
        }
        &.user {
          float: right;
        }
        &:first-child {
          float: left;
        }
        :is(a) {
          text-decoration: none;
        }
        &.is-active {
          border-bottom: none;
          background: #96a4c4;
        }
        &:last-child {
          border-bottom: none;
          background: none;
        }
        &:hover {
          background: #96a4c4;
        }
        i {
          color: #fff;
          &.fa {
            margin-right: 10px;
          }
        }
      }
    }
  }
  .el-dropdown {
    min-width: 120px;
    color: #fff;
    font-size: 16px;
    text-align: right;
    cursor: pointer;
  }
}
</style>
