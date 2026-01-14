<template>
  <div class="file-viewer">
    <common-image-viewer
      v-if="fileInfo"
      ref="viewer"
      :pages="fileInfo.pageInfo"
      :outline="fileInfo.outline"
      :settings="settings"
      :plugins="['outline', 'header']"
      :header-sections="[[4, { target: 'left' }]]"
      @viewer-document-ready="readyHandler"
      @page-mounted="handlePageMounted"></common-image-viewer>

    <div v-if="showMarkTool" class="draw-widget-switch">
      <el-tooltip effect="dark" content="画框提取" placement="top">
        <button
          class="fas fa-expand"
          :class="{ active: drawModeActived }"
          @click="switchDrawMode"></button>
      </el-tooltip>
      <el-tooltip effect="dark" content="表格单元格提取" placement="top">
        <button
          class="fas fa-table"
          :class="{ active: isShowPageTables }"
          @click="switchPageTableVisible"></button>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import CommonImageViewer from '@paoding-label/vue-image-viewer';
import { v4 as uuid4 } from 'uuid';
import { baseURL } from '@/store/api/http';
import { fetchTables } from '@/store/api/detail.api.js';
import { convertBlockDataFromAPIToWidget } from '@/utils/image-viewer';
import { EventBus } from '@/utils';

export default {
  name: 'szse-annual-report-file-viewer',
  components: { CommonImageViewer },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileInfo: {
      type: Object,
      required: true,
    },
    showGoBackButton: {
      type: Boolean,
      require: false,
      default: false,
    },
    showMarkTool: {
      type: Boolean,
      require: false,
      default: false,
    },
    markable: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      settings: {
        markable: {
          autoActive: true,
        },
        pageSpacing: 10,
        imageURLParser: (pageIndex) => {
          const url = `${baseURL}/plugins/fileapi/file/${this.fileId}/page/${pageIndex}`;
          return [url];
        },
        searchURLParser: (keyword) => {
          return `${baseURL}/plugins/fileapi/file/${this.fileId}/search?keyword=${keyword}`;
        },
        fetchFunction: (url, params) => {
          return new Promise((resolve, reject) => {
            fetch(url, params)
              .then((res) => res.json())
              .then((res) => {
                if (res.status === 'error') {
                  this.$notify({
                    title: this.$t(`message['提示']`),
                    message: res.message,
                    type: 'error',
                  });
                  this.imageViewer.searchManage.searchBox.setEnable(true);
                }
                resolve(res);
              })
              .catch((error) => {
                reject(error);
              });
          });
        },
      },
      imageViewer: null,
      drawModeActived: false,
      isShowPageTables: false,
      pageTables: {},
      blocks: [],
    };
  },
  watch: {
    markable(value) {
      if (!value) {
        this.drawModeActived = false;
      }
    },
  },
  mounted() {
    EventBus.$on('update-file-viewer-blocks', this.handleBlocksUpdated);
  },
  beforeDestroy() {
    EventBus.$off('update-file-viewer-blocks', this.handleBlocksUpdated);
  },
  methods: {
    readyHandler() {
      const viewerElement = this.$refs.viewer;
      if (viewerElement !== undefined) {
        this.imageViewer = viewerElement.imageViewer;
        this.imageViewer.setMountedPagesMarkable(true);
        this.imageViewer.widgetHelper.selectionEndCallback = this.drawWidget;

        this.imageViewer.eventBus.on(
          'widget-table-cell-active',
          this.selectTableWidgetCell,
        );
      }

      if (this.showGoBackButton) {
        this.addHistoryBackButton();
      }
    },
    addHistoryBackButton() {
      const menuItem = document.createElement('LI');
      menuItem.setAttribute(
        'class',
        'head-menu-item head-menu-item-clickable fas fa-arrow-left menu-button',
      );
      menuItem.onclick = () => history.back();

      const menuContainer = document.querySelector('.header-left');
      if (menuContainer) {
        menuContainer.insertBefore(menuItem, menuContainer.firstChild);
      }
    },
    checkAuditItemSelected() {
      if (!this.markable) {
        const message = '请先选择右侧审核点';
        this.$notify({
          title: '提示',
          message,
          type: 'warning',
        });

        throw new Error(message);
      }
    },
    switchDrawMode() {
      this.checkAuditItemSelected();

      this.drawModeActived = !this.drawModeActived;
    },
    drawWidget(outline, { pageInfo: { page } }) {
      EventBus.$emit('create-manual-label', { page, outline });
    },
    async handlePageMounted(page) {
      this.renderBlocks(page);

      await this.getPageTables(page);
      if (this.isShowPageTables) {
        this.renderPageTables(page);
      }
    },
    renderBlocks(page) {
      const blocksToRender = this.blocks.filter((item) => item.page === page);
      blocksToRender.forEach((item) => {
        if (item.type === 'rect') {
          this.renderRectWidget(item);
        }
      });
    },
    renderRectWidget({ page, outline }) {
      const uuid = uuid4();
      const type = 'rect';

      const widgetLayer = this.imageViewer.getPages()[page].getWidgetLayer();

      if (widgetLayer && widgetLayer.widgetCanvas) {
        const widget = widgetLayer.load({ type, data: { outline } });
        widget.setUUID(uuid);

        return uuid;
      }
    },
    switchPageTableVisible() {
      this.checkAuditItemSelected();

      this.isShowPageTables = !this.isShowPageTables;
      if (this.isShowPageTables) {
        const pageMounted = this.imageViewer
          .getMountedPages()
          .map((item) => item.pageInfo.page);
        pageMounted.forEach((page) => this.renderPageTables(page));
      } else {
        this.removeTableWidgets();
      }
    },
    async getPageTables(page) {
      if (this.pageTables[page]) {
        return;
      }

      try {
        const { data } = await fetchTables(this.fileId, page);
        this.pageTables[page] = data.map((item) => ({
          ...item,
          uuid: uuid4(),
        }));
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    renderPageTables(page) {
      if (this.pageTables[page]) {
        this.pageTables[page].forEach((data) =>
          this.renderTableWidget({ uuid: data.uuid, page, data }),
        );
      }
    },
    renderTableWidget({ uuid, page, data }) {
      const widgetDrawed = this.imageViewer.widgetHelper.getWidgetByUUID(uuid);

      if (widgetDrawed) {
        return;
      }

      const type = 'table';

      const widgetLayer = this.imageViewer.getPages()[page].getWidgetLayer();

      if (widgetLayer && widgetLayer.widgetCanvas) {
        const tableData = convertBlockDataFromAPIToWidget(data);
        const widget = widgetLayer.load({
          type,
          data: tableData,
        });
        widget.setUUID(uuid);

        return uuid;
      }
    },
    async selectTableWidgetCell(cells, widget) {
      const page = widget.canvas.pageViewer.pageInfo.page;
      const table = this.pageTables[page].find(
        (item) => item.uuid === widget.uuid,
      );

      if (table) {
        const [row, col] = cells[0];

        let cell = table.cells[`${row}_${col}`];
        if (!cell) {
          const mergedCell = table.merged.find((mergedList) =>
            mergedList.find((cellItem) => _.isEqual(cellItem, [row, col])),
          );
          if (mergedCell) {
            const [rowOrigin, colOrigin] = mergedCell[0];
            cell = table.cells[`${rowOrigin}_${colOrigin}`];
          }
        }

        if (cell) {
          this.drawWidget(cell.box, { pageInfo: { page } });
        }
      }
    },
    removeTableWidgets() {
      const pageMounted = this.imageViewer
        .getMountedPages()
        .map((item) => item.pageInfo.page);
      pageMounted.forEach((page) => {
        if (this.pageTables[page]) {
          this.pageTables[page].forEach(({ uuid }) => {
            const widget = this.imageViewer.widgetHelper.getWidgetByUUID(uuid);

            if (widget) {
              widget.destroy();
            }
          });
        }
      });
    },
    jumpToPage(page, offset) {
      const viewer = this.$refs.viewer;
      const scale = viewer.getScale();
      const viewportWidth =
        viewer.$el.querySelector('.page-viewers').offsetWidth;
      const viewportHeight =
        viewer.$el.querySelector('.page-viewers').offsetHeight;
      const targetRectOffsetX = offset[0] * scale;
      const targetRectOffsetY = offset[1] * scale;

      const scrollPosition = (viewportHeight * 1) / 4;
      const scrollOffsetX =
        targetRectOffsetX > viewportWidth
          ? targetRectOffsetX - viewportWidth
          : 0;
      const scrollOffsetY = targetRectOffsetY - scrollPosition;

      this.imageViewer.jumpToPageNumber(page + 1, [
        scrollOffsetX,
        scrollOffsetY,
      ]);
    },
    handleBlocksUpdated(blocks) {
      this.blocks = blocks;

      if (this.imageViewer) {
        const pageViewerMounted = this.imageViewer.getMountedPages();
        pageViewerMounted.forEach((pageViewer) =>
          pageViewer.widgetLayer.clearWidgets(),
        );

        if (blocks.length > 0) {
          const { page, outline, needJump } = blocks[0];

          const pageMounted = pageViewerMounted.map(
            (item) => item.pageInfo.page,
          );
          if (pageMounted.includes(page)) {
            this.handlePageMounted(page);
          }

          if (needJump) {
            this.jumpToPage(page, outline);
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.file-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.draw-widget-switch {
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  z-index: 220;
  display: flex;
  flex-direction: column;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  button {
    padding: 8px;
    border: 1px solid #eee;
    background-color: #fff;

    &:not(:first-of-type) {
      border-top-color: transparent;
    }

    &::before {
      background-color: #fff;
      font-size: 24px;
      color: #9ea0a5;
      opacity: 0.8;
    }

    &.active {
      background-color: #409eff;
      border: 1px solid #409eff;

      &:before {
        background-color: #409eff;
        color: #fff;
      }
    }
  }
}

::v-deep .mark-buttons-wrapper {
  display: none;
}

::v-deep .image-viewer-header {
  background: #fff;
  border: 1px solid #eee;
  border-top: none;
  box-shadow: none;
}

::v-deep .scale-selector {
  margin: 0 8px;
}

::v-deep .header-pagebar {
  .page-input {
    width: auto;
  }

  i {
    line-height: 40px;
    font-size: 20px;
    color: #3e3f43;
    vertical-align: middle;
  }
}

::v-deep .widget-toolbar {
  display: none !important;
}

::v-deep .menu-button {
  line-height: 40px;
  min-width: 40px;
}

::v-deep .resize-point {
  display: none !important;
}

::v-deep .widget-rect .editor-content {
  stroke: #409eff !important;
  stroke-width: 2 !important;
  stroke-dasharray: 5;
  pointer-events: none;
}

::v-deep .widget-table {
  &:not(.table-column-line) {
    .editor-content:first-of-type {
      stroke: #8470ff !important;
    }
  }
}
</style>
