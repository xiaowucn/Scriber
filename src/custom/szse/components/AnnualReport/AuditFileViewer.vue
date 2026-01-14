<template>
  <div class="audit-file-viewer">
    <document-viewer
      ref="pdfViewer"
      :pdf-url="pdfUrl"
      :file-id="fileId"
      :widget-types="widgetTypes"
      :page-widgets="pageWidgets"
      :isShowPageTool="false"
      @page-rendered="handlePageRendered"
      @drawingEnd="handleDrawingEnd"
      @selectTableWidgetCell="handleSelectTableWidgetCell">
      <div slot="toolbar-before-search">
        <i class="fa fa-bars" @click="toggleChapter"></i>
        <scale-select
          :isShowQuickButton="false"
          :getScale="getScale"
          :setScale="setScale"></scale-select>
      </div>
    </document-viewer>
    <template v-if="isShowChapterTree">
      <el-tree
        v-if="fileInfo.outline.items.length"
        class="chapter-tree"
        :data="fileInfo.outline.items"
        node-key="index"
        :props="{ children: 'children', label: 'title' }"
        :default-expand-all="true"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="nodeClick"></el-tree>
      <div v-else ref="chapterError" class="chapter-error"></div>
    </template>
    <div class="draw-widget-switch">
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
import { v4 as uuid4 } from 'uuid';
import { baseURL } from '@/store/api/http';
import { isEmpty, isEqual } from 'lodash';
import DocumentViewer from '@/components/remark/pdf-viewer/DocumentViewer';
import ScaleSelect from '@/components/remark/pdf-viewer/ScaleSelect';
import { fetchTables } from '@/store/api/detail.api.js';
import { fetchFileOutline } from '@/store/api/file.api';
import { convertBlockDataFromAPIToWidget } from '@/utils/image-viewer';
import { EventBus } from '@/utils';

export default {
  name: 'AuditFileViewer',

  components: { DocumentViewer, ScaleSelect },

  data() {
    return {
      pdfUrl: `${baseURL}/plugins/fileapi/file/${this.fileId}/pdf`,
      pageWidgets: {},
      widgetTypes: [
        {
          type: 'rect',
          subType: 'widget-border-box',
          classNames: ['widget-border-box'],
          operation: [],
        },
        {
          type: 'rect',
          subType: 'widget-label-bg',
          classNames: ['widget-label-bg'],
          operation: [],
        },
        {
          type: 'table',
          subType: 'widget-table',
          classNames: ['table-wrapper'],
          operation: [],
        },
        {
          type: 'text',
          subType: 'widget-label-text',
          classNames: ['widget-label-text'],
          operation: [],
        },
      ],
      isShowChapterTree: false,
      drawModeActived: false,
      isShowPageTables: false,
      pageTables: {},
    };
  },

  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileInfo: {
      type: Object,
      required: false,
    },
    showMarkTool: {
      type: Boolean,
      require: false,
      default: false,
    },
    markable: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    EventBus.$on('update-file-viewer-blocks', this.handleBlocksUpdated);
  },
  beforeDestroy() {
    EventBus.$off('update-file-viewer-blocks', this.handleBlocksUpdated);
  },

  methods: {
    getScale() {
      return this.$refs.pdfViewer.getScale();
    },
    setScale(scale) {
      this.$refs.pdfViewer.setScale(scale);
    },
    async handlePageRendered(page) {
      await this.getPageTables(page);
      if (this.isShowPageTables) {
        this.renderTableWidget([page]);
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
    getRenderedPageNumbers() {
      return this.$refs.pdfViewer.getRenderedPageNumbers();
    },
    switchPageTableVisible() {
      this.checkAuditItemSelected();

      this.isShowPageTables = !this.isShowPageTables;
      if (this.isShowPageTables) {
        const pageMounted = this.getRenderedPageNumbers();
        // pageMounted.forEach(page => this.renderPageTables(page));
        this.renderTableWidget(pageMounted);
      } else {
        this.removeTableWidgets();
      }
    },
    removeTableWidgets() {
      this.$refs.pdfViewer.clearWidgetsBySubType('table');
    },
    renderTableWidget(pages) {
      const pageWidgets = {};
      pages.forEach((page) => {
        this.pageTables[page].forEach((data) => {
          const tableData = convertBlockDataFromAPIToWidget(data);
          if (!pageWidgets[page]) {
            pageWidgets[page] = [];
          }
          pageWidgets[page].push({
            id: data.uuid,
            spanCellData: tableData.spanCellData,
            outline: tableData.outline,
            hLines: tableData.rows,
            vLines: tableData.columns,
            type: 'table',
            subType: 'table',
            data: {
              ...data,
              page: page,
            },
          });
        });
      });

      if (!isEmpty(pageWidgets)) {
        this.pageWidgets = pageWidgets;
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
    async handleDrawingEnd(widget) {
      this.$refs.pdfViewer.removeWidgets([widget.id]);
      const { id: uuid, pageNumber, outline } = widget;

      let pageWidgets = {};
      pageWidgets[pageNumber - 1] = [
        {
          id: uuid,
          outline: outline,
          type: 'rect',
          subType: 'widget-border-box',
          data: {
            ...widget,
            page: pageNumber - 1,
          },
        },
      ];
      this.pageWidgets = pageWidgets;

      EventBus.$emit('create-manual-label', { page: pageNumber - 1, outline });
    },
    handleSelectTableWidgetCell({ cellData, widget }) {
      const page = widget.widgetData.page;
      const table = this.pageTables[page].find(
        (item) => item.uuid === widget.uuid,
      );

      if (table) {
        const [row, col] = cellData[0];

        let cell = table.cells[`${row}_${col}`];
        if (!cell) {
          const mergedCell = table.merged.find((mergedList) =>
            mergedList.find((cellItem) => isEqual(cellItem, [row, col])),
          );
          if (mergedCell) {
            const [rowOrigin, colOrigin] = mergedCell[0];
            cell = table.cells[`${rowOrigin}_${colOrigin}`];
          }
        }

        if (cell) {
          this.handleDrawingEnd({
            id: uuid4(),
            outline: cell.box,
            type: 'rect',
            pageNumber: page + 1,
            subType: 'widget-border-box',
          });
        }
      }
    },
    handleBlocksUpdated(blocks) {
      if (blocks.length > 0) {
        const { page, outline, needJump } = blocks[0];

        if (needJump) {
          this.jumpToPage(page, outline[1]);
        }
      }

      const pageWidgets = {};

      blocks.forEach((item) => {
        if (!pageWidgets[item.page]) {
          pageWidgets[item.page] = [];
        }
        const uuid = uuid4();
        pageWidgets[item.page].push({
          id: uuid,
          outline: item.outline,
          type: 'rect',
          subType: 'widget-border-box',
          data: {
            page: item.page,
          },
        });
      });
      this.pageWidgets = pageWidgets;
    },
    nodeClick(data) {
      this.jumpToPage(data.page, data.box[1]);
    },
    jumpToPage(page, top) {
      this.$refs.pdfViewer.jumpToPage(page, top);
    },
    async toggleChapter() {
      this.isShowChapterTree = !this.isShowChapterTree;
      if (this.isShowChapterTree) {
        if (this.fileInfo.outline.items.length === 0) {
          try {
            const fileOutlineRes = await fetchFileOutline(this.fileId);
            const outlineReady =
              fileOutlineRes.data && fileOutlineRes.data.children;

            if (outlineReady) {
              if (fileOutlineRes.data.children.length > 0) {
                this.$refs.chapterError.innerHTML = `
                    <p>目录已生成,重新刷新页面后查看</p>
                    <p>(若有手动标注,请先保存)</p>
                    `;
              } else {
                this.$refs.chapterError.innerHTML = `
                    <p>无目录信息</p>
                    `;
              }
            } else {
              this.$refs.chapterError.innerHTML = `
                    <p>目录暂未生成</p>
                    <p>请稍后重新进入文档查看</p>
                    `;
            }
          } catch (error) {
            this.$refs.chapterError.innerHTML = error.message;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.audit-file-viewer {
  position: relative;
  height: 100%;
  .chapter-tree {
    position: absolute;
    top: 40px;
    left: 0;
    width: 260px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    z-index: 2000;
    overflow: auto;
    background: #fff;
    box-shadow: 0 0 5px #ccc;
    ::v-deep .el-tree-node__label {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .chapter-error {
    position: absolute;
    top: 40px;
    left: 0;
    width: 260px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    z-index: 2000;
    overflow: auto;
    background: #fff;
    box-shadow: 0 0 5px #ccc;
    padding: 16px;
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
  ::v-deep .widget-rect .editor-content {
    stroke: #409eff !important;
    stroke-width: 2 !important;
    stroke-dasharray: 5;
    pointer-events: none;
  }
}
</style>
