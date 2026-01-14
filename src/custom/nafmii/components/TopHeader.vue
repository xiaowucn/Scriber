<template>
  <div class="top-header">
    <slot name="collapse-btn"></slot>
    <div class="breadcrumb-container" v-if="isShowBreadCrumb">
      <div class="back-btn">
        <el-button type="text" :disabled="gobackBtnDisabled" @click="goback()">
          <svg-font-icon
            name="arrow-left"
            :size="12"
            color="var($--color-text-secondary)"
            hover-color="var($--color-text-primary)" />
          返回
        </el-button>
      </div>
      <span class="separator">｜</span>
      <bread-crumb
        :currentMenuItem="activeMenuItem"
        :breadCrumbData="breadCrumbData" />
    </div>
    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ loginUser.name }} <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <i class="fa fa-user"></i>
            <el-link :href="userinfoUrl" :underline="false" target="_blank">
              个人信息
            </el-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="fa fa-key"></i>
            <el-link
              :href="changePasswordUrl"
              :underline="false"
              target="_blank">
              修改密码
            </el-link>
          </el-dropdown-item> -->
          <el-dropdown-item command="logout">
            <i class="fa fa-sign-out-alt"></i>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import BreadCrumb from './BreadCrumb';

export default {
  name: 'top-header',
  components: { BreadCrumb },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters('nafmiiModule', ['menu', 'breadCrumbData']),

    activeMenuItem() {
      return this.menu.activeItem;
    },
    gobackBtnDisabled() {
      return window.history.length <= 1;
    },
    isShowBreadCrumb() {
      return !_.isEmpty(this.breadCrumbData);
    },
    userinfoUrl() {
      return this.configuration['nafmii.urls']?.user_info;
    },
    changePasswordUrl() {
      return this.configuration['nafmii.urls']?.edit_password;
    },
  },
  methods: {
    goback() {
      history.back();
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;
        default:
          break;
      }
    },
    async logout() {
      const confirm = await this.$confirm(
        '确认退出当前登录用户？',
        '退出登录',
        { confirmButtonText: '确定', cancelButtonText: '取消' },
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await this.$store.dispatch('logout');
          this.$emit('logout');
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  height: 60px;
  padding: 0 30px;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  .breadcrumb-container {
    display: flex;
    align-items: center;
  }
  .back-btn {
    margin-left: 20px;
    ::v-deep .el-button {
      border: none;
      background: unset;
      padding: 0px;
      color: $--color-text-secondary;
      font-size: 14px;
      > span {
        font-weight: 400;
        display: flex;
        &:hover {
          color: $--color-primary;
        }
      }
      .svg-icon-container {
        margin-right: 10px;
      }
    }
  }
  .separator {
    margin: 0px 10px;
    color: $--color-text-secondary;
  }
  .user-info {
    margin-left: auto;
    .el-dropdown {
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
.el-dropdown-menu {
  .el-dropdown-menu__item {
    i {
      vertical-align: middle;
    }
    .el-link {
      font-weight: normal;
    }
  }
}
</style>
