<template>
  <div class="excel-viewer">
    <header>
      <el-tooltip effect="dark" content="返回" placement="bottom">
        <el-button
          type="text"
          icon="el-icon-back"
          :disabled="gobackBtnDisabled"
          @click="$router.back()">
        </el-button>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="下载"
        :disabled="fileNotFound"
        placement="bottom">
        <el-button
          type="text"
          icon="el-icon-download"
          :disabled="fileNotFound"
          @click="download">
        </el-button>
      </el-tooltip>
    </header>
    <div v-if="showEditToolbar" class="edit-toolbar">
      <ul>
        <li>
          <el-tooltip effect="dark" content="编辑" placement="left">
            <el-button
              type="text"
              :class="isEditMode ? 'active' : ''"
              @click="toggleEditMode">
              <svg-font-icon name="select-cell" :size="20"></svg-font-icon>
            </el-button>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <template>
      <div v-if="!fileNotFound" ref="spreadsheet" id="spreadsheet"></div>
      <div v-else class="empty">文件已被清理，无法查看</div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import EventBus from '../remark-tree/EventBus';
import * as XLSX from 'xlsx';
import 'x-data-spreadsheet/dist/xspreadsheet.js';
import 'x-data-spreadsheet/dist/xspreadsheet.css';
import { getFileDownloadUrl } from '../../../store/api/detail.api';
import { FIELD_STATUS_MAP } from '../../../custom/cmfchina/common/constant';
import ViewerMixin from '../pdf-viewer/Viewer.mixin';

export default {
  name: 'excel-viewer',
  mixins: [ViewerMixin],
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    isInspect: {
      type: Boolean,
      required: false,
    },
    answerItemMap: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      spreadsheet: null,
      activeCell: null,
      isEditMode: false,
      selectedSchemaNode: null,
      response: {},
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['remarkTab', 'answer']),
    url() {
      return getFileDownloadUrl(this.fileId);
    },
    gobackBtnDisabled() {
      return window.history.length <= 1;
    },
    fileNotFound() {
      return this.response?.status === 404;
    },
    showEditToolbar() {
      return (
        this.isInspect &&
        this.remarkTab === 'remark' &&
        this.fileNotFound === false
      );
    },
  },
  watch: {
    remarkTab() {
      this.reset();
    },
    answer() {
      this.reset();
    },
    '$route.query.fileId'() {
      this.$refs.spreadsheet.innerHTML = '';
      this.spreadsheet = null;
      this.init();
    },
  },
  created() {
    EventBus.$on('answer-item-updated', this.answerItemModified);
    EventBus.$on('answer-item-removed', this.answerItemModified);
    EventBus.$on('after-submit-inspect-answer', this.afterSubmitInspectAnswer);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('answer-item-updated', this.answerItemModified);
    EventBus.$off('answer-item-removed', this.answerItemModified);
    EventBus.$off('after-submit-inspect-answer', this.afterSubmitInspectAnswer);
  },
  methods: {
    download() {
      window.open(this.url, '_blank');
    },
    async init() {
      const response = await fetch(this.url);
      this.response = response;
      if (!response.ok) {
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);

      this.spreadsheet = window.x_spreadsheet('#spreadsheet', {
        mode: 'read',
        showToolbar: false,
        showContextmenu: false,
        view: {
          width: () => this.$refs.spreadsheet?.clientWidth,
          height: () => this.$refs.spreadsheet?.clientHeight,
        },
      });
      this.spreadsheet.loadData(this.convertSheetData(workbook));
      this.spreadsheet.on('cell-selected', (cell, row, col) => {
        const sheet_name = this.spreadsheet.bottombar.activeEl.el.textContent;
        const _cell = { row: row + 1, col: col + 1 };
        const cellData = {
          key: this.getAnswerItemKeyByCellData({ sheet_name, cell: _cell }),
          sheet_name,
          cell: _cell,
          text: cell?.text,
        };
        if (this.showEditToolbar) {
          if (this.isEditMode) {
            this.createExcelAnswerItem(cellData);
          }
          this.$nextTick(() => {
            this.$emit(
              'cell-selected',
              cellData,
              this.selectedSchemaNode?.key,
              this.isEditMode,
            );
          });
        }
      });
      this.spreadsheet.on('cells-selected', (cells, range) => {
        const { sri, sci, eri, eci } = range;
        if (!(sri === eri && sci === eci)) {
          this.clearCellSelection();
        }
      });
      this.spreadsheet.bottombar.menuEl.el.addEventListener('click', () => {
        this.clearCellSelection();
      });
      this.clearCellSelection();
    },
    convertSheetData(workbook) {
      const data = [];

      workbook.SheetNames.forEach((name) => {
        const sheet = { name: name, rows: {} };
        const worksheet = workbook.Sheets[name];
        if (!worksheet || !worksheet['!ref']) {
          return;
        }

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        range.s = { r: 0, c: 0 };
        const sheetData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          header: 1,
          range: range,
        });

        sheetData.forEach((row, rowIndex) => {
          const cells = {};

          row.forEach((column, j) => {
            cells[j] = { text: column || String(column) };
            const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: j });
            if (worksheet[cellRef] != null && worksheet[cellRef].f != null) {
              cells[j].text = '=' + worksheet[cellRef].f;
            }
          });

          sheet.rows[rowIndex] = { cells: cells };
        });

        sheet.rows.len = sheetData.length;
        sheet.merges = [];

        (worksheet['!merges'] || []).forEach((merge, index) => {
          if (sheet.rows[merge.s.r] == null) {
            sheet.rows[merge.s.r] = { cells: {} };
          }
          if (sheet.rows[merge.s.r].cells[merge.s.c] == null) {
            sheet.rows[merge.s.r].cells[merge.s.c] = {};
          }
          sheet.rows[merge.s.r].cells[merge.s.c].merge = [
            merge.e.r - merge.s.r,
            merge.e.c - merge.s.c,
          ];
          sheet.merges[index] = XLSX.utils.encode_range(merge);
        });

        data.push(sheet);
      });

      return data;
    },
    getAnswerItemKeyByCellData(cellData) {
      const matchedAnswerItems = Object.values(this.answerItemMap).filter(
        (answerItem) => {
          const { sheet_name, cell } = answerItem.data[0] || {};
          return (
            sheet_name === cellData.sheet_name && _.isEqual(cell, cellData.cell)
          );
        },
      );
      return _.last(matchedAnswerItems)?.key;
    },
    reset() {
      this.isEditMode = false;
      this.selectedSchemaNode = null;
      this.resetCellStyle();
      this.clearCellSelection();
    },
    resetCellStyle() {
      if (this.activeCell) {
        const { row, col } = this.activeCell;
        this.spreadsheet.datas.forEach((data) => {
          const style = data.addStyle({ bgcolor: '' });
          const cell = data.getCell(row, col);
          if (cell) {
            cell.style = style;
          }
        });
      }
      this.spreadsheet?.reRender();
    },
    clearCellSelection() {
      requestAnimationFrame(() => {
        this.$refs.spreadsheet
          ?.querySelectorAll('.x-spreadsheet-selector')
          .forEach((el) => {
            el.style.display = 'none';
          });
      });
    },
    selectSchemaNode(node) {
      this.selectedSchemaNode = node;
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    createExcelAnswerItem({ sheet_name, cell, text }) {
      if (!this.selectedSchemaNode) {
        this.$notify({
          title: '提示',
          message: '尚未选择场景节点，请勿标注',
          type: 'warning',
        });
        return;
      }
      EventBus.$emit('create-excel-answer-item', [
        {
          key: this.selectedSchemaNode.key,
          data: [
            {
              sheet_name,
              cell,
              text,
            },
          ],
        },
      ]);
    },
    answerItemModified() {
      this.resetCellStyle();
    },
    afterSubmitInspectAnswer() {
      this.selectedSchemaNode = null;
      this.resetCellStyle();
      this.clearCellSelection();
    },
    selectAnswerItem(answerItem) {
      this.resetCellStyle();
      const row = answerItem.data.cell.row - 1;
      const col = answerItem.data.cell.col - 1;
      const sheetName = answerItem.data.sheet_name;
      const targetSheet = this.spreadsheet.datas.find(
        (sheet) => sheet.name === sheetName,
      );

      if (!targetSheet) {
        return;
      }

      this.$refs.spreadsheet
        .querySelectorAll('.x-spreadsheet-bottombar li')
        .forEach((li) => {
          if (li.textContent === targetSheet.name) {
            li.click();
          }
        });

      const sheetWidth = this.$refs.spreadsheet.querySelector(
        '.x-spreadsheet-sheet',
      ).clientWidth;
      const tableHeight = this.$refs.spreadsheet.querySelector(
        '.x-spreadsheet-table',
      ).clientHeight;
      const verticalScrollbar = this.$refs.spreadsheet.querySelector(
        '.x-spreadsheet-scrollbar.vertical',
      );
      const horizontalScrollbar = this.$refs.spreadsheet.querySelector(
        '.x-spreadsheet-scrollbar.horizontal',
      );
      verticalScrollbar.scrollTo(0, row * 25 - tableHeight / 2 + 50);
      horizontalScrollbar.scrollTo(col * 100 - sheetWidth / 2, 0);

      const fieldStatusIsFailAudit =
        answerItem.meta.fieldStatus === FIELD_STATUS_MAP.FAIL_AUDIT ||
        answerItem.meta.classNames.includes('red');
      const bgColor = fieldStatusIsFailAudit ? '#fc3c3811' : '#16a63b11';
      const borderColor = fieldStatusIsFailAudit ? '#fc3c38' : '#16a63b';
      const activeStyle = {
        bgcolor: bgColor,
        border: {
          left: ['medium', borderColor],
          top: ['medium', borderColor],
          right: ['medium', borderColor],
          bottom: ['medium', borderColor],
        },
      };
      const style = targetSheet.addStyle(activeStyle);
      const cell = targetSheet.getCell(row, col);
      if (cell) {
        cell.style = style;
      }

      this.activeCell = { row, col };
      this.clearCellSelection();
      this.spreadsheet.reRender();
    },
  },
};
</script>

<style lang="scss" scoped>
.excel-viewer {
  position: relative;
  header {
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #ccc;
    padding: 0 20px;
    box-sizing: border-box;

    .el-button {
      padding: 5px;
      color: #666;
      font-size: 24px;

      &.is-disabled {
        color: #ccc;
      }

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  .edit-toolbar {
    position: absolute;
    right: 20px;
    top: 45%;
    z-index: 99;
    ul {
      li {
        list-style: none;
        .el-button {
          padding: 7px 10px 9px 10px;
          font-size: 24px;
          border-radius: 0;
          color: #9ea0a5;
          border: 1px solid #c1c2c5;
          background-color: #fff;
          &.active {
            color: #fff;
            border-color: rgba($--color-primary, 0.8);
            background-color: rgba($--color-primary, 0.8);
          }
        }
      }
    }
    .mode {
      display: block;
      font-size: 30px;
      background-color: #a6a6a6;
    }
  }

  .excel-content {
    height: calc(100vh - 50px);
    background-color: #f5f5f5;
    overflow-y: auto;

    .tips {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background-color: #f5f5f5;
      color: #a6a6a6;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 50px);
    background-color: #f5f5f5;
    color: #a6a6a6;
  }
}

::v-deep .x-spreadsheet {
  overflow: hidden;

  .x-spreadsheet-sheet {
    width: 100% !important;
    height: calc(100vh - 90px);
  }

  .x-spreadsheet-bottombar {
    padding-left: 0;

    .x-spreadsheet-menu {
      li {
        &:first-child {
          width: 60px;
          box-sizing: border-box;
        }
        > .x-spreadsheet-icon {
          display: none;
        }
      }
    }
  }
}
</style>
