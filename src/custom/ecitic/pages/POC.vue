<template>
  <div>
    <common-header
      v-if="showHeader"
      :title="headerTitle"
      :menu-items="headerMenuItems"
      :hide-logout="hideLogout"></common-header>
    <router-view :system="system"></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CommonHeader from '../../szse/components/Header';
import { ECITIC_ENV_SYSTEM } from '@/store/constants';

export default {
  name: 'POC',
  components: {
    CommonHeader,
  },
  computed: {
    ...mapGetters(['configuration']),
    showHeader() {
      return this.$route.meta.showPrivateHeader;
    },
    system() {
      return this.$route.path.split('/')[2];
    },
    headerTitle() {
      return ECITIC_ENV_SYSTEM[this.system.toUpperCase()].title;
    },
    headerMenuItems() {
      if (this.system === ECITIC_ENV_SYSTEM.SHARES.name) {
        return [];
      }

      return [
        {
          name: 'project',
          text: '项目管理',
          path: '/ecitic/poc',
          icon: 'el-icon-tickets',
          perimeter: 'browse',
        },
        {
          name: 'user',
          text: '用户管理',
          path: '/ecitic/poc/user',
          icon: 'fa fa-user',
          perimeter: 'manageUser',
          hide: !!this.configuration.trident_url,
        },
      ];
    },
    hideLogout() {
      return !!this.configuration.trident_url;
    },
  },
};
</script>

<style lang="scss">
$primary-color: #2b70cf;

.szse-ipo-message-box {
  .el-button--primary {
    background: $primary-color;
    border-color: $primary-color;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
