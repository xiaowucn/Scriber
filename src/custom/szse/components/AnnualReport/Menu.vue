<template>
  <div class="szse-annual-report-menu">
    <div>
      <img
        src="@/custom/szse/assets/annual-logo-2.png"
        alt="logo"
        class="logo" />
    </div>
    <div>
      <div class="navigator">
        <el-button
          v-for="item in menuList"
          :key="item.label"
          type="text"
          class="menu-link"
          @click="$router.push(item.href)"
          >{{ item.label }}</el-button
        >
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <span class="user-name">{{ loginUser.name }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
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

export default {
  name: 'szse-annual-report-menu',
  data() {
    return {
      menuList: [
        {
          label: '主页',
          href: '/',
        },
        {
          label: '统计分析',
          href: '',
        },
        {
          label: '行业规则管理',
          href: '',
        },
        {
          label: '任务管理',
          href: '',
        },
        {
          label: '用户管理',
          href: '/user',
        },
      ],
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
.szse-annual-report-menu {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #4b7dd0;

  > div {
    display: flex;
    flex-flow: row;
    align-items: center;
  }
}

.navigator {
  margin-right: 20px;

  .menu-link {
    padding: 0 10px;
    color: white;

    &:hover {
      text-decoration: underline;
    }

    &:not(:first-of-type) {
      border-left: 1px solid white;
    }
  }
}

.el-dropdown-link {
  .user-name {
    color: white;
    cursor: pointer;
  }
  i {
    color: white;
  }
}
</style>
