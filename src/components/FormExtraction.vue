<template>
  <div>
    <div v-loading="loading" class="pdflux-wrapper">
      <iframe ref="pdfluxIframe" :src="tridentUrl"> </iframe>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { tridentApiVersion } from '../store/api/http';
export default {
  name: 'form-extraction',
  computed: {
    ...mapGetters(['configuration']),
    tridentUrl() {
      return `${this.configuration.trident_url}${tridentApiVersion}/get-off?sys=pdflux`;
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.loading = true;
  },
  mounted() {
    this.$refs.pdfluxIframe.onload = () => {
      this.loading = false;
    };
  },
};
</script>
<style lang="scss" scoped>
.user-upload-file {
  margin: 1em 0;
  button {
    padding: 10px 20px;
  }
}
.pdflux-wrapper {
  position: absolute;
  top: 74px;
  bottom: 0;
  left: 15px;
  right: 15px;
  iframe {
    width: 100%;
    height: calc(100% - 10px);
    border: none;
  }
}
</style>
