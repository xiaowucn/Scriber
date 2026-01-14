<template>
  <div class="chapter-tree-container">
    <h4 class="title">{{ $t(`message['目录']`) }}</h4>
    <el-tree
      ref="tree"
      v-if="fileInfo.outline.items.length"
      class="chapter-tree"
      node-key="index"
      :data="fileInfo.outline.items"
      :props="{ children: 'children', label: 'title' }"
      :default-expand-all="true"
      :expand-on-click-node="false"
      @node-click="chapterNodeClick">
      <span
        class="el-tree-node__label"
        slot-scope="{ node, data }"
        :class="getNodeClass(data)">
        {{ data.title }}
      </span>
    </el-tree>
    <div v-else ref="chapterError" class="chapter-empty">
      {{ $t(`message['无目录']`) }}
    </div>
  </div>
</template>

<script>
import { ptToPx } from 'pdf-document-viewer';
import { tree2list } from '@/utils';
export default {
  name: 'chapter-tree',
  props: {
    fileInfo: {
      type: Object,
      required: true,
    },
    getScrollTop: {
      type: Function,
    },
    getScale: {
      type: Function,
    },
    getPdfPages: {
      type: Function,
    },
  },
  data() {
    return {
      chaptersList: [],
      menuItemsRange: [],
      currentClickingNodeIndex: -1,
      currentNodeIndex: -1,
    };
  },
  created() {
    this.chaptersList = tree2list(this.fileInfo.outline.items);
  },
  methods: {
    updateRanges() {
      const menuItemsRange = [];
      for (var i = 0; i < this.chaptersList.length; i++) {
        var item = this.chaptersList[i];
        var top = this.getMenuItemTop(
          this.fileInfo.pageInfo,
          item,
          10,
          this.getScale(),
        );
        menuItemsRange.push(top);
      }
      this.menuItemsRange = menuItemsRange;
    },
    getMenuItemTop(pageInfo, menuItem, pageSpacing, scale) {
      var pageTop = this.getPageOffsetTop(
        pageInfo,
        menuItem.page + 1,
        pageSpacing,
        scale,
      );
      var itemOffsetTop = ptToPx(menuItem.box[1]) * scale;
      return pageTop + itemOffsetTop - pageSpacing;
    },
    getPageOffsetTop(pageInfo, pageNumber, spacingTop, scale) {
      if (!scale) {
        scale = 1;
      }

      if (pageNumber < 1) {
        pageNumber = 1;
      } else if (pageNumber > pageInfo.length) {
        pageNumber = pageInfo.length;
      }

      var offsetTop = 0;
      var abovePages = this.getPdfPages().slice(0, pageNumber - 1);

      abovePages.forEach((item) => {
        var page = item;
        offsetTop += page.height;
      });

      offsetTop += spacingTop * (pageNumber - 1);
      return offsetTop;
    },
    getCurrentMenuItem() {
      var currentMenuItem = null;

      for (var i = 0; i < this.menuItemsRange.length - 1; i++) {
        var cur = this.menuItemsRange[i];

        if (this.getScrollTop() >= cur - 50) {
          currentMenuItem = this.chaptersList[i];
        }
      }

      return currentMenuItem;
    },
    chapterNodeClick(data) {
      this.currentClickingNodeIndex = data.index;
      this.currentNodeIndex = data.index;
      this.$emit('chapter-node-cliked', data);
    },
    getNodeClass(data) {
      return this.currentNodeIndex == data.index ? 'is-actived' : '';
    },
    async scrollIntoView() {
      let index = -1;
      this.updateRanges();
      const currentMenu = this.getCurrentMenuItem();
      if (currentMenu) {
        index = currentMenu.index;
      }

      if (
        this.currentClickingNodeIndex !== -1 ||
        index === this.currentNodeIndex
      ) {
        if (index === this.currentClickingNodeIndex) {
          this.currentClickingNodeIndex = -1;
        }
        return;
      }
      this.currentNodeIndex = index;

      await this.$nextTick();
      const currentNode = this.$el.querySelector('.is-actived');
      if (currentNode) {
        currentNode.scrollIntoView({ block: 'center' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter-tree-container {
  flex-shrink: 0;
  width: 260px;
  height: 100%;
  box-sizing: border-box;
  z-index: 2000;
  overflow: auto;
  background: #fff;
  box-shadow: 0 0 5px #ccc;
  .title {
    position: sticky;
    top: 0;
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    background: #fff;
    font-size: 16px;
    font-weight: normal;
    z-index: 1;
  }
  .chapter-tree {
    padding: 10px;
    ::v-deep .el-tree-node__label {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &.is-actived {
        color: $--color-primary;
      }
    }

    &.el-tree--highlight-current {
      ::v-deep .el-tree-node.is-current > .el-tree-node__content {
        background: #fff;
        color: $--color-primary;
      }
    }
  }

  .chapter-empty {
    position: absolute;
    top: 40px;
    left: 0;
    display: flex;
    justify-content: center;
    width: 260px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    z-index: 2000;
    overflow: auto;
    background: #fff;
    box-shadow: 0 0 5px #ccc;
    padding: 50px 16px;
    font-size: 14px;
    color: #999;
  }
}
</style>
