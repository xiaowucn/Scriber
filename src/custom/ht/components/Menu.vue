<template>
  <el-header>
    <el-menu
      mode="horizontal"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      :router="true"
      :default-active="activeIndex">
      <el-menu-item index="/project">
        <i class="fa fa-list"></i>项目管理
      </el-menu-item>
      <el-menu-item index="/ht/contract-type-settings">
        <i class="fa fa-file"></i>合同类型设置
      </el-menu-item>
      <el-menu-item v-if="showUserManagement" index="/user">
        <i class="fa fa-user"></i>用户管理
      </el-menu-item>
      <el-menu-item v-if="$isAllowed('manageUser')" index="/ht/data-statistics">
        <i class="fa fa-chart-line"></i>数据统计
      </el-menu-item>
      <el-menu-item v-if="$isAllowed('manageUser')" index="/ht/export-errors">
        <i class="fa fa-download"></i>导出报错数据
      </el-menu-item>
      <el-menu-item index="/ht/rule-template">
        <i class="fa fa-cloud-download-alt"></i>模板下载
      </el-menu-item>
    </el-menu>
    <div class="user-info">
      <span>Hello, {{ loginUser.name }}</span>
      <el-dropdown @command="handleCommand">
        <div>
          <img src="../assets/avator.png" alt class="avator" />
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="accessToken">
            获取 access-token
          </el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'top-header',
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
  created() {
    const path = this.$route.path;
    const activeMenuItem = '/' + path.split('/')[1];
    this.activateMenu(activeMenuItem);
  },
  methods: {
    activateMenu(activeMenuItem) {
      this.$store.commit('CHANGE_MENUACTIVE', activeMenuItem);
    },
    handleCommand(menu) {
      if (menu === 'accessToken') {
        this.getAccessToken();
      } else if (menu === 'logout') {
        this.logout();
      }
    },
    async getAccessToken() {
      try {
        const res = await this.$store.dispatch('getAccessToken');
        const token = res.data.token;
        const message = `
          最新的access-token: 
          <input value="${token}" readonly id="access-token" style="width: 65%;border: none;" />
        `;
        this.$msgbox({
          title: '获取 access-token',
          message: message,
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          confirmButtonText: '复制到剪贴板',
          cancelButtonText: '关闭',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              const copyInput = document.getElementById('access-token');
              if (this.copyTextToClipboard(copyInput)) {
                this.$message({
                  message: 'access-token已复制到剪贴板~',
                  type: 'success',
                });
              } else {
                this.$message({
                  message: '复制失败，请手动复制~',
                  type: 'error',
                });
              }
              done();
            } else {
              done();
            }
          },
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async logout() {
      const result = await this.$confirm('确定退出当前账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (result === 'confirm') {
        try {
          await this.$store.dispatch('logout');
          const tridentUrl = this.configuration.trident_url;
          if (!tridentUrl) {
            this.$router.push({ name: 'login' });
          } else {
            window.location.href = tridentUrl;
          }
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    copyTextToClipboard(inputElement) {
      window.getSelection().removeAllRanges();
      const range = document.createRange();
      range.selectNode(inputElement);
      window.getSelection().addRange(range);
      const result = document.execCommand('copy');
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
.el-header {
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #6485e3, #35bbef);
}
.el-menu--horizontal {
  border-bottom: none;
}
.el-menu {
  background: transparent;
  .el-menu-item {
    font-weight: bold;
    color: #fff;
    border-bottom: none;
    i {
      margin-right: 10px;
      vertical-align: 0;
      color: #fff;
    }
    &.is-active {
      background: rgba(0, 0, 0, 0.1) !important;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1) !important;
    }
  }
}
.user-info {
  span {
    margin-right: 15px;
    font-size: 16px;
    color: #fff;
  }
}
.el-dropdown {
  color: #fff;
  .avator {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin-right: 5px;
    border: 1px solid #fff;
    border-radius: 50%;
    background: #fff;
    vertical-align: -7px;
    cursor: pointer;
  }
}
</style>
