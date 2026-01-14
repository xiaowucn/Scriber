<template>
  <div class="document-viewer-toolbar" :class="{ 'llm-review-mode': true }">
    <div class="left header-left" v-if="showToolbarLeft">
      <template v-if="showGoBackButton">
        <el-button
          type="text"
          class="toolbar-back"
          :disabled="gobackBtnDisabled"
          @click="goBack">
          <theme-icon name="back" icon-class="fas fa-arrow-left"></theme-icon>
        </el-button>
      </template>

      <template v-if="showThumbButton">
        <el-button type="text" class="toolbar-thumb" @click="toggleThumbnail">
          <theme-icon name="thumb" icon-class="fas fa-images"></theme-icon>
        </el-button>
      </template>

      <template v-if="showChapterButton">
        <el-button type="text" class="toolbar-chapter" @click="toggleChapter">
          <theme-icon name="chapter" icon-class="fas fa-bars"></theme-icon>
        </el-button>
      </template>

      <search-bar
        v-if="showSearchButton"
        :search-result="searchResult"
        @search="search"
        @search-nav-clicked="searchNavClicked"></search-bar>

      <file-info
        v-if="showFileInfo"
        :file-info="fileInfo"
        :is-iframe-mode="isIframeMode"></file-info>

      <slot name="toolbar"></slot>
    </div>
    <div class="middle">
      <scale-select
        ref="scaleSelect"
        :default-scale="defaultScale"
        :get-scale="getScale"
        @scale-change="changeScale"></scale-select>
    </div>
    <div class="right">
      <div class="page-nav">
        <el-button
          type="text"
          icon="el-icon-caret-left"
          class="page-prev"
          :disabled="currentPage <= 1"
          @click="pageNavClicked('prev')"></el-button>
        <el-input
          v-model.number="currentPage"
          size="mini"
          @keydown.enter.native="changePageNumber" />
        <span>/</span>
        <span>{{ pageTotal }}</span>
        <el-button
          type="text"
          icon="el-icon-caret-right"
          class="page-next"
          :disabled="currentPage >= pageTotal"
          @click="pageNavClicked('next')"></el-button>
      </div>

      <!-- 文件切换按钮 - 仅在LLM Review模式下显示 -->
      <div class="file-switch-btns" v-if="!isIframeMode">
        <svg-font-icon
          name="arrow-left-border"
          :size="24"
          color="#606164"
          title="上一篇"
          :disabled="prevFileButtonDisabled"
          @click="fileSwitchClicked('prev')"></svg-font-icon>

        <el-tooltip content="下一篇" placement="bottom">
          <svg-font-icon
            name="arrow-right-border"
            :size="24"
            color="#606164"
            title="下一篇"
            :disabled="nextFileButtonDisabled"
            @click="fileSwitchClicked('next')"></svg-font-icon>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from './SearchBar';
import FileInfo from './FileInfo';
import ScaleSelect from './ScaleSelect';
import { EventBus } from '../../../../utils/eventBus';

export default {
  name: 'document-viewer-toolbar',
  components: { SearchBar, FileInfo, ScaleSelect },
  props: {
    showToolbarLeft: {
      type: Boolean,
      required: false,
      default: true,
    },
    showGoBackButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showThumbButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showChapterButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSearchButton: {
      type: Boolean,
      default: true,
    },
    searchResult: {
      type: Object,
      required: true,
    },
    showFileInfo: {
      type: Boolean,
      required: false,
      default: true,
    },
    isIframeMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    fileInfo: {
      type: Object,
      required: true,
    },
    pageTotal: {
      type: Number,
      required: true,
    },
    currentPageNumber: {
      type: Number,
      required: true,
    },
    defaultScale: {
      type: Number,
      default: -1,
    },
    getScale: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      fileSwitchButtonStates: {
        prevDisabled: false,
        nextDisabled: false,
      },
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.currentPageNumber;
      },
      set(page) {
        this.$parent.currentPageNumber = page;
      },
    },
    gobackBtnDisabled() {
      return window.history.length <= 1;
    },
    prevFileButtonDisabled() {
      return this.fileSwitchButtonStates.prevDisabled;
    },
    nextFileButtonDisabled() {
      return this.fileSwitchButtonStates.nextDisabled;
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    toggleThumbnail() {
      this.$emit('toggle-thumbnail');
    },
    toggleChapter() {
      this.$emit('toggle-chapter');
    },
    search(searchConditions) {
      this.$emit('search', searchConditions);
    },
    searchNavClicked(index) {
      this.$emit('search-nav-clicked', index);
    },
    changePageNumber(page) {
      this.$emit('page-change', page);
    },
    pageNavClicked(direction) {
      this.$emit('page-nav-clicked', direction);
    },
    changeScale(scale) {
      this.$emit('scale-change', scale);
    },
    setScaleSelectValue(scale) {
      return this.$refs.scaleSelect.setScale(scale);
    },
    fileSwitchClicked(direction) {
      // 通过EventBus触发文件切换事件
      if (this.direction === 'prev' && this.prevFileButtonDisabled) {
        return;
      }
      if (this.direction === 'next' && this.nextFileButtonDisabled) {
        return;
      }
      EventBus.$emit('file-switch', direction);
    },
  },
  mounted() {
    // 监听按钮状态更新事件
    EventBus.$on('file-switch-state-update', (states) => {
      this.fileSwitchButtonStates = states;
    });
    // 请求初始状态
    EventBus.$emit('file-switch-state-request');
  },
  beforeDestroy() {
    // 清理事件监听
    EventBus.$off('file-switch-state-update');
  },
};
</script>

<style lang="scss" scoped>
.document-viewer-toolbar {
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 15px;
  background: #ffffff;
  border: 1px solid #eaedf3;
  box-sizing: border-box;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);

  .left {
    order: 1;
  }

  .middle {
    order: 3;
  }

  .right {
    order: 2;
  }

  // LLM Review模式下调换middle和right的位置
  &.llm-review-mode {
    .middle {
      order: 2;
    }

    .right {
      order: 3;
    }
  }

  ::v-deep .el-button {
    &.is-disabled {
      opacity: 0.3;
    }
    i {
      text-align: center;
      font-size: 18px;
      color: #333;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }

  .left {
    display: flex;
    align-items: center;
    ::v-deep .el-button {
      margin: 0;
      padding: 6px 8px;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  .middle {
    display: flex;
    flex-flow: row;
    align-items: center;
    color: #3e3f42;
  }
  .right {
    display: flex;
    align-items: center;

    ::v-deep .el-button {
      margin: 0;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;

      &[disabled] {
        ::v-deep i {
          cursor: not-allowed;
          color: #ccc;
        }
      }

      i {
        color: #333;
        &:hover {
          color: #409eff;
        }
      }
    }

    .file-switch-btns {
      display: flex;
      align-items: center;
      margin-left: 50px;
      gap: 8px;
      .el-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        cursor: pointer;

        &[disabled] {
          cursor: not-allowed;
        }

        i {
          color: #606266;
          transition: color 0.3s;

          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }

  .page-nav {
    display: flex;
    align-items: center;
    color: #3e3f42;
    & > * + * {
      margin-left: 5px;
    }
    .page-prev,
    .page-next {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      cursor: pointer;
      font-size: 20px;
      &[disabled] {
        ::v-deep i {
          cursor: not-allowed;
          color: #ccc;
        }
      }
    }

    .el-input {
      width: 50px;

      ::v-deep input {
        padding: 0 5px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 14px;
      }
    }
  }
}
</style>
