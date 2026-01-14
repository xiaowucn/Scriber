<template>
  <el-dialog
    title="关联法规"
    :visible="true"
    width="900px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="closeDialog"
    class="related-laws-dialog">
    <div v-loading="isDialogLoading">
      <!-- 原法规信息 -->
      <div class="original-law-section">
        <h4 class="section-title">原法规信息</h4>
        <el-table :data="[currentRow]" border class="original-law-table">
          <el-table-column
            prop="id"
            label="ID"
            width="80"
            align="center"></el-table-column>
          <el-table-column
            prop="order.name"
            label="文档名称"
            width="200"></el-table-column>
          <el-table-column prop="nowData.name" label="规则名称" width="200">
            <template slot-scope="scope">
              {{ scope.row.nowData.name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nowData.rule_content"
            label="法规内容"></el-table-column>
        </el-table>
      </div>

      <!-- 关联法规信息 -->
      <div class="related-law-section">
        <div class="section-header">
          <h4 class="section-title">关联法规信息</h4>
          <div class="search-form">
            <span class="selector-label">选择法规</span>
            <el-select
              v-model="selectedLawId"
              size="medium"
              placeholder="请选择法规"
              @change="handleLawChange"
              class="law-select"
              popper-class="law-select-popper">
              <el-option
                v-for="item in lawsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <tooltip-over :content="item.name" :width="200"></tooltip-over>
              </el-option>
            </el-select>
            <el-select
              v-model="searchForm.field"
              size="medium"
              class="search-field">
              <el-option
                v-for="(item, index) in searchOptions"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <el-input
              v-model.trim="searchForm.keyword"
              :placeholder="currentSearchOption.placeholder"
              size="medium"
              clearable
              class="search-input"
              @clear="fetchRelatedLawData"
              @keydown.enter.native="fetchRelatedLawData">
            </el-input>
            <el-button
              type="primary"
              size="medium"
              class="search-btn"
              @click="fetchRelatedLawData">
              查询
            </el-button>
          </div>
        </div>

        <el-table
          ref="relatedTable"
          v-loading="isLoading"
          :data="relatedLawData"
          height="300px"
          border
          class="related-law-table"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            align="center"></el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="80"
            align="center"></el-table-column>
          <el-table-column
            prop="nowData.name"
            label="规则名称"
            width="200"></el-table-column>
          <el-table-column
            prop="nowData.rule_content"
            label="法规内容"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pager-wrapper">
          <el-pagination
            background
            hide-on-single-page
            @current-change="handleCurrentChange"
            :current-page="pager.page"
            :page-size="pager.size"
            layout="total, prev, pager, next"
            :total="pager.total">
          </el-pagination>
        </div>
      </div>

      <!-- 选中统计和说明文字 -->
      <div class="info-section">
        <div class="selection-info" v-if="selectedRowsCount > 0">
          <span class="selection-count"
            >已选中 {{ selectedRowsCount }} 条法规</span
          >
          <el-button
            type="text"
            size="small"
            @click="clearAllSelections"
            class="clear-btn">
            清空选择
          </el-button>
        </div>
        <div class="notice-text">
          <span
            >说明：法规关联后，关联法规的规则名称会统一调整为原法规信息中的规则名称</span
          >
        </div>
      </div>

      <!-- 底部按钮 -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取消关联</el-button>
      <el-button
        type="primary"
        :loading="isDialogLoading"
        @click="handleConfirm"
        size="small"
        >关联法规</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { laws as lawsApi } from '@/store/api';
import { REVIEW_STATUS } from '@/store/constants';
import TooltipOver from '../components/TooltipOver.vue';

export default {
  name: 'related-laws-dialog',
  props: {
    currentRow: {
      type: Object,
      required: true,
    },
    lawsOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TooltipOver,
  },
  data() {
    return {
      selectedLawId: '',
      searchForm: {
        field: 'parent_name',
        keyword: '',
      },
      selectedRows: [],
      selectedRowIds: new Set(),
      isRestoringSelection: false,
      pager: {
        page: 1,
        size: 10,
        total: null,
      },
      searchOptions: [
        {
          label: '规则名称',
          value: 'parent_name',
          placeholder: '请输入规则名称',
        },
        {
          label: '法规内容',
          value: 'parent_rule_content',
          placeholder: '请输入法规内容',
        },
      ],
      relatedLawData: [],
      isLoading: false,
      isDialogLoading: false,
    };
  },
  computed: {
    currentSearchOption() {
      return this.searchOptions.find(
        (option) => option.value === this.searchForm.field,
      );
    },
    params() {
      const params = {
        page: this.pager.page,
        size: this.pager.size,
        abandoned: false,
        order_ids: [this.selectedLawId],
      };
      if (this.searchForm.keyword) {
        params[this.searchForm.field] = this.searchForm.keyword;
      }

      return params;
    },
    selectedRowsCount() {
      return this.selectedRows.length;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    handleLawChange() {
      this.pager.page = 1;
      this.fetchRelatedLawData();
    },
    handleSelectionChange(selection) {
      if (this.isRestoringSelection) {
        return;
      }
      const currentPageIds = this.relatedLawData.map((row) => row.id);
      currentPageIds.forEach((id) => {
        this.selectedRowIds.delete(id);
      });

      selection.forEach((row) => {
        this.selectedRowIds.add(row.id);
      });

      this.selectedRows = this.selectedRows.filter(
        (row) => !currentPageIds.includes(row.id),
      );

      this.selectedRows.push(...selection);

      const uniqueRows = [];
      const seenIds = new Set();
      this.selectedRows.forEach((row) => {
        if (!seenIds.has(row.id)) {
          seenIds.add(row.id);
          uniqueRows.push(row);
        }
      });
      this.selectedRows = uniqueRows;
    },

    handleCurrentChange(page) {
      this.pager.page = page;
      this.fetchRelatedLawData(this.selectedLawId);
    },
    async fetchRelatedLawData() {
      try {
        if (!this.selectedLawId) {
          this.$notify({
            title: '提示',
            message: '请选择法规',
            type: 'warning',
            duration: 2000,
          });
          return;
        }
        this.isLoading = true;
        const { items, total } = await lawsApi.getCheckPoints(this.params);
        this.isRestoringSelection = true;
        this.relatedLawData = this.formatTableData(items);
        this.pager.total = total;

        this.$nextTick(() => {
          this.scrollTableToTop();
          this.restoreSelectionState();
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    formatTableData(data) {
      return data.map((item) => {
        if (item.draft && item.draft.review_status === REVIEW_STATUS.NOT_PASS) {
          item.review_status = REVIEW_STATUS.NOT_PASS;
          item.meta = item.draft.meta;
          delete item.draft;
        }
        const nowData = item.draft ? item.draft : item;
        const {
          check_method,
          check_type,
          core,
          id,
          name,
          review_status,
          rule_content,
          subject,
          updated_by_id,
          reviewer_id,
          meta,
        } = nowData;
        const order = item.order;
        return {
          ...item,
          nowData: {
            check_method,
            check_type,
            core,
            id,
            name,
            review_status,
            rule_content,
            subject,
            updated_by_id,
            reviewer_id,
            meta,
            law_name: order.name,
          },
        };
      });
    },

    /**
     * 恢复表格的选择状态
     */
    async restoreSelectionState() {
      if (!this.$refs.relatedTable) {
        return;
      }
      this.isRestoringSelection = true;

      try {
        this.relatedLawData.forEach((row) => {
          if (this.selectedRowIds.has(row.id)) {
            this.$refs.relatedTable.toggleRowSelection(row, true);
          }
        });
      } finally {
        this.isRestoringSelection = false;
      }
    },

    scrollTableToTop() {
      this.$refs.relatedTable.bodyWrapper.scrollTop = 0;
    },
    clearAllSelections() {
      this.isRestoringSelection = true;

      try {
        this.selectedRows = [];
        this.selectedRowIds.clear();
        if (this.$refs.relatedTable) {
          this.$refs.relatedTable.clearSelection();
        }
      } finally {
        this.isRestoringSelection = false;
      }
    },

    handleCancel() {
      this.closeDialog();
    },
    async handleConfirm() {
      if (this.selectedRows.length === 0) {
        this.$notify({
          title: '提示',
          message: '请选择关联法规',
          type: 'warning',
        });
        return;
      }
      try {
        this.isDialogLoading = true;
        await lawsApi.setCheckPointAlias({
          alias_name: this.currentRow.nowData.name,
          cp_ids: this.selectedRows.map((row) => row.id),
        });
        this.$notify({
          title: '提示',
          message: '关联成功',
          type: 'success',
        });
        this.$emit('success');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isDialogLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.related-laws-dialog {
  .original-law-section,
  .related-law-section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin: 0 0 16px 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .search-form {
      display: flex;
      align-items: center;
      gap: 8px;

      .selector-label {
        font-size: 14px;
        color: #606266;
      }

      .law-select {
        width: 200px;
      }
      .modification-filter {
        width: 120px;
      }
      .search-field {
        width: 110px;
      }
      .search-input {
        width: 200px;
      }
    }
  }

  .original-law-table,
  .related-law-table {
    width: 100%;

    ::v-deep .el-table__header {
      background-color: #f5f7fa;
    }
  }

  .pager-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .info-section {
    margin: 16px 0;
  }

  .selection-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 8px 12px;
    background-color: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 4px;

    .selection-count {
      font-size: 14px;
      color: #409eff;
      font-weight: 500;
    }

    .clear-btn {
      color: #f56c6c;
      padding: 0;

      &:hover {
        color: #f78989;
      }
    }
  }

  .notice-text {
    padding: 12px;
    background-color: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
  }

  .dialog-footer {
    text-align: right;

    .el-button {
      margin-left: 8px;
    }
  }
}
</style>
