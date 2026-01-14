<template>
  <el-button
    v-if="!disabledToggle"
    type="primary"
    class="toggle-button"
    @click="handleToggle">
    <theme-icon name="toggle"></theme-icon>
    {{ isShowRemarkType ? '文本识别' : '关键字/敏感词识别' }}
  </el-button>
</template>

<script>
import { mapGetters } from 'vuex';
import { isRemarkType } from '../common/utils';

export default {
  name: 'toggle-button',
  computed: {
    ...mapGetters('remarkModule', ['remarkTaskTypes']),

    isShowRemarkType() {
      return isRemarkType(this.$route.query.type);
    },
    disabledToggle() {
      if (this.isShowRemarkType) {
        return !(
          this.remarkTaskTypes.includes('keywords') ||
          this.remarkTaskTypes.includes('sensitiveWords')
        );
      } else {
        return !this.remarkTaskTypes.includes('remark');
      }
    },
  },
  methods: {
    addQueryAboutType(type) {
      const query = this.$route.query;
      const currentQuery = {
        ...query,
        type,
      };
      this.$router.replace({
        path: this.$route.path,
        query: currentQuery,
      });
    },
    handleToggle() {
      if (this.isShowRemarkType) {
        this.addQueryAboutType('other');
      } else {
        this.addQueryAboutType('remark');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle-button {
  background-color: $--color-primary;
  padding: 3px 6px !important;
  &.el-button {
    .text {
      color: #fff;
      font-size: 12px;
      font-weight: 400;
      margin-left: 5px;
    }
    &:hover,
    &:focus {
      background-color: $--color-primary !important;
      opacity: 0.8;
    }
    &.is-disabled {
      &:hover,
      &:focus {
        background-color: #809fbc !important;
        opacity: 0.3;
      }
    }
  }
}
</style>
