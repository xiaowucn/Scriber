<template>
  <iframe :src="iframeUrl" width="100%" height="100%" frameborder="0"></iframe>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'permission-management',
  computed: {
    ...mapGetters(['configuration']),
    iframeUrl() {
      return `${
        this.configuration.trident_url
      }/#/userManage?_t=${new Date().getTime()}`;
    },
  },
  created() {
    window.addEventListener('message', this.handleMessageEvent);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessageEvent);
  },
  methods: {
    handleMessageEvent(event) {
      if (event.data.type === 'session_expired') {
        window.location.href = `${this.configuration.trident_url}/api/v1/user/customer-logout`;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
