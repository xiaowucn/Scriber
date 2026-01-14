<template>
  <div class="log-out">
    <el-tooltip effect="dark" :content="title" placement="top">
      <el-button
        v-if="isLogin"
        type="info"
        @click.native="doLogout"
        class="logout-button">
        <i
          :class="[
            'fa',
            $platform.isSzseIdapEnv() ? 'el-icon-back' : 'fa-sign-out-alt',
            'fa-fw',
          ]"></i>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'log-out',
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    isLogin() {
      return (
        this.$route.name !== 'login' &&
        this.$route.name !== 'remark' &&
        this.$route.name !== 'remark-rulecheck'
      );
    },
    title() {
      return `${this.$t('menu["登出"]')} ${this.loginUser.name || ''}`;
    },
  },
  methods: {
    async doLogout() {
      const res = await this.$store.dispatch('logout');

      if (this.$platform.isSseEnv() || this.$platform.isCcxiEnv()) {
        if (res.data.redirect_url) {
          window.location.href = res.data.redirect_url;
          return;
        }
        if (this.configuration.trident_url) {
          window.location.href = this.configuration.trident_url;
          return;
        }
        this.$router.push({ name: 'login' });
        return;
      }
      if (this.configuration.trident_url) {
        window.location.href = this.configuration.trident_url;
        return;
      }
      this.$router.push({ name: 'login' });

      if (this.$platform.isHkexEnv()) {
        localStorage.removeItem('HKEX_HOME_FILTERS');
      }
    },
  },
};
</script>

<style scoped>
.log-out {
  position: fixed;
  opacity: 0.5;
  right: 1em;
  bottom: 1em;
  z-index: 999;
  transition: opacity 0.3s;
}
.log-out:hover {
  opacity: 1;
}
.logout-button {
  border-radius: 50%;
  width: 3em;
  height: 3em;
  padding: 0.5em;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
</style>
