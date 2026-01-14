<template>
  <el-popover
    v-model="visible"
    trigger="manual"
    placement="bottom-start"
    width="300"
    popper-class="document-viewer-search-bar"
    :open-delay="0"
    @hide="reset"
    @show="autoFocusSearchInput">
    <div class="search-panel">
      <div>
        <el-input
          ref="searchInput"
          v-model="searchConditions.keyword"
          size="mini"
          placeholder="请输入关键词"
          clearable
          @keydown.enter.native="search"
          @input="search"
          @clear="search"></el-input>
        <div v-if="searchResult.visible">
          <span>{{
            searchResult.total === 0 ? 0 : searchResult.currentIndex + 1
          }}</span>
          /
          <span>{{ this.searchResult.total }}</span>
        </div>
        <div class="switch">
          <i
            class="el-icon-arrow-left"
            :class="{ disabled: searchResult.total === 0 }"
            @click="searchNavClicked(searchResult.currentIndex - 1)"></i>
          <i
            class="el-icon-arrow-right"
            :class="{ disabled: searchResult.total === 0 }"
            @click="searchNavClicked(searchResult.currentIndex + 1)"></i>
        </div>
      </div>
    </div>
    <template slot="reference">
      <el-button type="text" class="toolbar-search" @click="toggleSearchPopup">
        <theme-icon name="search1" icon-class="fa fa-search"></theme-icon>
      </el-button>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'search-bar',
  props: {
    searchResult: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      searchConditions: {
        keyword: '',
        lastKeyword: '',
      },
    };
  },
  methods: {
    autoFocusSearchInput() {
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    toggleSearchPopup() {
      this.visible = !this.visible;
      if (!this.visible) {
        this.searchConditions.keyword = '';
        this.$parent.$parent.removeAnnotationByType('search');
      }
    },
    reset() {
      this.searchConditions = {
        keyword: '',
        lastKeyword: '',
      };
      this.search();
    },
    search() {
      this.$emit('search', this.searchConditions);
    },
    searchNavClicked(index) {
      if (index < 0) {
        index = this.searchResult.total - 1;
      }
      if (index === this.searchResult.total) {
        index = 0;
      }
      this.$emit('search-nav-clicked', index);
    },
  },
};
</script>

<style lang="scss">
.document-viewer-search-bar {
  .search-panel {
    > div {
      display: flex;
      flex-flow: row;
      align-items: center;
      & > * + * {
        margin-left: 10px;
      }

      &:not(:first-of-type) {
        margin-top: 10px;
      }

      .switch {
        display: flex;
        flex-flow: row;
        i {
          &.disabled {
            cursor: not-allowed;
            color: #ccc;
          }
        }
      }

      .result {
        color: #1665d8;
        font-size: 14px;
      }

      [class^='el-icon-arrow'] {
        display: inline-block;
        padding: 4px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }

      .el-input {
        flex: 1;
      }

      .el-checkbox {
        margin: 0;
        font-weight: normal;
      }
    }
  }
}
</style>
