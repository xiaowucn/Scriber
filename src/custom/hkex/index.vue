<template>
  <router-view></router-view>
</template>

<script>
import { mapGetters } from 'vuex';
import { checkCustomVersion } from '@/utils/custom';
import { preventWindowClose } from './common/utils';

export default {
  name: 'HKEX-App',
  data() {
    return {
      version: checkCustomVersion('hkex'),
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['hasUnsubmitChange']),
  },
  watch: {
    hasUnsubmitChange() {
      if (this.hasUnsubmitChange) {
        window.addEventListener('beforeunload', preventWindowClose);
      } else {
        window.removeEventListener('beforeunload', preventWindowClose);
      }
    },
  },
};
</script>
