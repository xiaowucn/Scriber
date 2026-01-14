<template>
  <div class="hkex-container">
    <left-menu v-if="showLeftMenu"></left-menu>
    <router-view
      class="hkex-main"
      :class="[isDelisted ? 'page-readonly' : '']"></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LeftMenu from '../components/Menu';

export default {
  name: 'hkex-page',
  components: {
    LeftMenu,
  },
  computed: {
    ...mapGetters('hkexModule', ['isDelisted']),
    showLeftMenu() {
      return !this.$route.meta.hideLeftMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.hkex-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .hkex-main {
    flex: 1;
    &.page-readonly {
      ::v-deep .pdfViewer:is(.disable-select) {
        pointer-events: none;
      }

      ::v-deep .annotation-toolbar {
        display: none;
        .frame,
        .multiframe {
          pointer-events: none;
        }
      }
      ::v-deep .manual {
        cursor: not-allowed;
        .adjustment-box {
          pointer-events: none;
        }
      }
      ::v-deep .col {
        cursor: not-allowed;
        .manual-box {
          pointer-events: none;
        }
      }
      ::v-deep .submit,
      ::v-deep .title-btns,
      ::v-deep .formula-operate {
        cursor: not-allowed;
        .el-button {
          pointer-events: none;
          opacity: 0.5;
        }
      }
      ::v-deep .currency-and-unit,
      ::v-deep .reason {
        cursor: not-allowed;
        .el-input {
          pointer-events: none;
        }
      }
    }
  }
}
</style>
