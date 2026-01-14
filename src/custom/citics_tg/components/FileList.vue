<template>
  <div class="file-list">
    <div class="list-header">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'projectList' }"
            >总览</el-breadcrumb-item
          >
          <el-breadcrumb-item class="project-name">
            <theme-icon
              name="folder"
              icon-class="fa fa-box fa-fw fa-2x box-icon"
              img-class="folder"></theme-icon>
            <span>{{ projectName }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <search-box
        v-if="isCiticsTgAllow('prj_detail_search')"
        :searchOptions="searchOptions"
        :filterBy="filterBy"
        :filterValue="filterValue"
        @search="handleSearch"></search-box>
    </div>
    <div class="file-list-container">
      <div class="file-head-bar">
        <div class="action-wrapper">
          <div class="action-btns">
            <el-button
              v-if="isCiticsTgAllow('prj_detail_upload')"
              size="small"
              class="file-operate-btn"
              :title="$t(`message['上传文件']`)"
              @click="fileDialogVisible = true">
              <theme-icon name="upload"></theme-icon>
            </el-button>
            <el-button
              v-if="isCiticsTgAllow('prj_detail_compare')"
              class="file-operate-btn"
              size="small"
              :disabled="isDisabledCompare"
              :title="$t(`message['文档比对']`)"
              @click="handleFileCompare">
              <theme-icon name="compare"></theme-icon>
            </el-button>
            <el-button
              v-if="isCiticsTgAllow('prj_detail_predict')"
              size="small"
              class="file-operate-btn"
              :disabled="isDisabledBatchPredict"
              :title="$t(`message['批量预测']`)"
              @click="handleBatchPredictFiles()">
              <theme-icon name="reparse"></theme-icon>
            </el-button>
            <el-button
              v-if="isCiticsTgAllow('prj_detail_inspect')"
              size="small"
              class="file-operate-btn"
              :disabled="isDisabledBatchPredict"
              :title="$t(`message['批量审核']`)"
              @click="handleBatchInspectFiles()">
              <theme-icon name="inspect"></theme-icon>
            </el-button>
            <el-button
              v-if="isCiticsTgAllow('prj_detail_batchdel')"
              size="small"
              icon="el-icon-delete"
              class="file-operate-btn"
              :disabled="!selectedFiles.length"
              :title="$t(`message['批量删除']`)"
              @click="handleBatchDeleteFiles()"></el-button>
          </div>
        </div>
      </div>
      <el-table
        ref="refTable"
        class="has-border"
        :empty-text="$t(`message['暂无数据']`)"
        :data="fileViewer.files"
        :row-class-name="getRowClassName"
        v-loading="fileViewer.isLoading"
        row-key="id"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          :selectable="(row) => isOperatePerm(row.group_name)"
          :reserve-selection="true"></el-table-column>
        <el-table-column
          v-if="showColumn('id')"
          prop="id"
          label="ID"
          width="80"
          align="center"></el-table-column>
        <el-table-column
          v-if="showColumn('name')"
          prop="name"
          :label="$t(`message['文件']`)"
          class-name="name">
          <template slot-scope="scope">
            <span>
              <i :class="getIcon(scope.row.fileType)"></i>
              {{ scope.row.name }}
              <a
                :href="scope.row.download"
                target="_blank"
                :download="scope.row.name"
                class="list-item-title"
                @click.stop>
                <el-tag size="mini" class="tag-filesize">
                  {{ scope.row.size | fileSize }}
                </el-tag>
                <svg-font-icon
                  name="download"
                  class="file-list-download-icon"
                  :size="16"></svg-font-icon>
              </a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('pdf_parse_status')"
          prop="pdf_parse_status"
          :label="$t(`message['预处理']`)"
          align="center">
          <span slot-scope="scope">
            {{ getPdfParseStatus(scope.row.pdf_parse_status) }}
          </span>
        </el-table-column>
        <el-table-column
          v-if="showColumn('version')"
          prop="version"
          :label="$t(`message['版本号']`)"
          align="center">
          <template slot-scope="scope">
            <p>
              {{ scope.row.version || '无' }}
              <el-tag v-if="scope.row.version" size="mini">{{
                scope.row.is_new_file ? '新' : '旧'
              }}</el-tag>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('templates')"
          prop="templates"
          :label="$t(`message['模板']`)"
          width="100"
          align="center">
          <template slot-scope="scope">
            <p
              class="template-item"
              v-for="(item, index) in getTemplateName(scope.row.templates)"
              :key="`${item}_${index}`"
              :title="item">
              {{ item }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('push_status')"
          prop="push_status"
          :label="$t(`message['推送状态']`)"
          align="center"></el-table-column>
        <el-table-column
          v-if="showColumn('push_count')"
          prop="push_count"
          :label="$t(`message['统计状态']`)"
          align="center">
          <template slot-scope="scope">
            <p>
              {{ scope.row.need_stat ? '已统计' : '未统计' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('external_source')"
          prop="external_source"
          :label="$t(`message['外部参数来源']`)"
          align="center"></el-table-column>
        <el-table-column
          v-if="showColumn('batch_number')"
          prop="batch_number"
          :label="$t(`message['批次号']`)"
          align="center"></el-table-column>
        <el-table-column
          v-if="showColumn('group_name')"
          prop="group_name"
          :label="$t(`message['所属业务组']`)"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="showColumn('user_name')"
          prop="user_name"
          :label="$t(`message['上传用户']`)"
          align="center"></el-table-column>
        <el-table-column
          v-if="showColumn('created_utc')"
          prop="created_utc"
          :label="$t(`message['上传时间']`)"
          align="center"
          class-name="time"
          min-width="100">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('updated_utc')"
          prop="updated_utc"
          :label="$t(`message['修改时间']`)"
          align="center"
          class-name="time"
          min-width="100">
          <template slot-scope="scope">
            {{ scope.row.updated_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('molds')"
          prop="molds"
          :label="$t(`message['模型']`)"
          align="center">
          <template slot-scope="scope">
            {{ getSchemaName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn('ai_status')"
          prop="ai_status"
          :label="$t(`message['参数预测']`)"
          align="center">
          <template slot-scope="scope">
            <div
              v-html="getAIPredictionSummaryStatus(scope.row)"
              class="ai-status"></div>
          </template>
        </el-table-column>
        <el-table-column width="150" class-name="operations-column">
          <template slot="header" slot-scope="scope">
            <div class="operations">
              <span>{{ $t(`message['操作']`) }}</span>
              <el-popover
                placement="top"
                width="430"
                trigger="click"
                popper-class="table-columns-filter"
                v-model="tableColumnsFilterVisible">
                <h4 class="title">{{ $t(`message['列表详情']`) }}</h4>
                <el-checkbox-group v-model="tableColumnsSelectedTemp">
                  <el-checkbox
                    v-for="(column, index) in FileListTableColumns"
                    :key="index"
                    :label="column.key">
                    {{ column.label }}
                  </el-checkbox>
                </el-checkbox-group>
                <div class="btns">
                  <el-button
                    size="medium"
                    @click="tableColumnsFilterVisible = false">
                    {{ $t(`message['取消']`) }}
                  </el-button>
                  <el-button
                    size="medium"
                    type="primary"
                    @click="selectTableColumns">
                    {{ $t(`message['确定']`) }}
                  </el-button>
                </div>
                <theme-icon
                  slot="reference"
                  name="column-filter"
                  icon-class="el-icon-menu"
                  class="column-filter-ref"></theme-icon>
              </el-popover>
            </div>
          </template>
          <template slot-scope="scope">
            <el-row>
              <el-tooltip
                effect="dark"
                :content="$t(`message['查看']`)"
                placement="top">
                <el-button
                  v-if="isCiticsTgAllow('prj_detail_file')"
                  type="text"
                  size="small"
                  circle
                  :disabled="viewDisabled(scope.row.pdf_parse_status)"
                  @click="handleJumpToRemark(scope.row)">
                  <theme-icon
                    name="view"
                    icon-class="el-icon-document"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                :content="$t(`message['编辑']`)"
                placement="top">
                <el-button
                  v-if="
                    isOperatePerm(scope.row.group_name) &&
                    isCiticsTgAllow('prj_detail_edit')
                  "
                  circle
                  size="small"
                  type="text"
                  @click="handleEditFile(scope.row)">
                  <theme-icon
                    name="edit"
                    icon-class="el-icon-edit"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                :content="$t(`message['删除']`)"
                placement="top">
                <el-button
                  v-if="
                    isOperatePerm(scope.row.group_name) &&
                    isCiticsTgAllow('prj_detail_del')
                  "
                  circle
                  size="small"
                  type="text"
                  @click="handleDeleteFile(scope.row)">
                  <theme-icon
                    name="delete"
                    icon-class="el-icon-delete"></theme-icon>
                </el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="fileViewer.pager.page"
        :page-size="fileViewer.pager.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="fileViewer.pager.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </div>
    <file-dialog
      v-if="fileDialogVisible"
      :current-edit-item="currentEditItem"
      :tree-id="treeId"
      :product-type="productType"
      @close="handleCloseDialog"
      @fetchList="getAllFiles">
    </file-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { uploadFileImg } from '@/images/';
import SearchBox from './SearchBox';
import { FileListTableColumns } from '../common/constant';
import FileDialog from './FileDialog.vue';
import { convertFileTypeToIcon, getFileTypeByName } from '@/utils';
import { deleteFile } from '@/store/api/detail.api';
import { batchDeleteFiles, predictFiles } from '@/store/api/file.api';
import { compareQuestion } from '@/store/api/citics-tg.api';
import FileStatusMixin from '../mixins/FileStatusMixin';
import { isCiticsTgAllow } from '../common/utils';
const CITICS_TG_FILE_LIST_TABLE_COLUMNS = 'CITICS_TG_FILE_LIST_TABLE_COLUMNS';

export default {
  name: 'fileList',
  mixins: [FileStatusMixin],
  components: { SearchBox, FileDialog },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    treeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      FileListTableColumns,
      uploadFileImg,
      tableColumnsFilterVisible: false,
      fileItems: [],
      searchOptions: [
        {
          value: 'fileid',
          label: '文件ID',
        },
        {
          value: 'filename',
          label: '文件名',
        },
      ],
      filterBy: 'fileid',
      filterValue: '',
      projectName: '',
      projectGroupName: '',
      tableColumnsSelected: [],
      tableColumnsSelectedTemp: [],
      productType: null,
      fileDialogVisible: false,
      currentEditItem: null,
      fileListTimer: null,
      comparing: false,
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('fileModule', ['selectedFiles', 'pager']),
    isDisabledCompare() {
      return (
        this.selectedFiles.length !== 2 ||
        this.comparing ||
        this.isSelectDisabledOperate
      );
    },
    isDisabledBatchPredict() {
      return this.isSelectDisabledOperate || !this.selectedFiles.length;
    },
    isSelectDisabledOperate() {
      const disabled = this.selectedFiles.find((item) =>
        this.viewDisabled(item.pdf_parse_status),
      );
      return !!disabled;
    },
    isOperatePerm() {
      return (fileGroupName) => {
        const userGroupNames = this.loginUser.group_name.split(',');
        return (
          this.loginUser.group_name === '' ||
          userGroupNames.includes(fileGroupName)
        );
      };
    },
  },
  created() {
    this.$store.commit('detailModule/SET_DIR_ID', this.treeId);
    this.setDefaultTableColumns();
    if (this.projectId) {
      this.getAllFiles();
    }
  },
  mounted() {
    const delay = this.$features.supportParsePdf() ? 30e3 : 5e3;
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
    this.fileListTimer = setInterval(() => {
      this.getAllFiles({ needLoading: false });
    }, delay);
  },
  beforeDestroy() {
    clearInterval(this.fileListTimer);
    this.$store.commit('fileModule/SET_SELECTED_FILES', []);
  },
  methods: {
    isCiticsTgAllow,
    async getAllFiles(options = { needLoading: true }) {
      try {
        if (!this.filterValue) {
          const res = await this.$store.dispatch('detailModule/fetchFileList', {
            needLoading: options.needLoading,
            isCustom: true,
          });
          this.projectName = res.data.name;
          this.projectGroupName = res.data.group_name;
          this.productType = res.data.meta.product_type;
        } else {
          if (options.needLoading) {
            this.$store.commit('detailModule/SET_LOADING', true);
          }
          const params = {
            page: this.fileViewer.pager.page,
            size: this.fileViewer.pager.size,
          };
          params.project_id = this.projectId;
          params[this.filterBy] = this.filterValue;
          await this.$store.dispatch('fileModule/fetchFileBySearch', {
            query: _.omitBy(params, (v) => v === ''),
            isCustom: true,
          });
          this.$store.commit('detailModule/SET_FILES_PAGER', this.pager);
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('detailModule/SET_LOADING', false);
      }
    },
    handleChangePage(page) {
      let pager = _.clone(this.fileViewer.pager);
      pager.page = page;
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
      this.getAllFiles();
    },
    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.handleChangePage(1);
    },
    handleCloseDialog() {
      this.fileDialogVisible = false;
      this.currentEditItem = null;
    },
    handleEditFile(row) {
      this.currentEditItem = _.cloneDeep(row);
      this.fileDialogVisible = true;
    },
    handleDeleteFile(row) {
      this.$confirm('确认删除文件吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteFile(row.id);
        })
        .catch(() => {});
    },
    async deleteFile(id) {
      try {
        await deleteFile(false, id);
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
        });
        if (this.fileItems.length === 1 && this.fileViewer.pager.page !== 1) {
          this.clearSelection();
          this.handleChangePage(this.fileViewer.pager.page - 1);
        }
        this.getAllFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    setDefaultTableColumns() {
      const tableColumnsHidden = [
        'push_status',
        // 'external_source',
        'batch_number',
      ];
      let tableColumns = this.FileListTableColumns.filter(
        (item) => !tableColumnsHidden.includes(item.key),
      ).map((item) => item.key);

      const tableColumnsFromStorage = JSON.parse(
        window.sessionStorage.getItem(CITICS_TG_FILE_LIST_TABLE_COLUMNS),
      );
      if (tableColumnsFromStorage) {
        tableColumns = tableColumnsFromStorage;
      }
      this.tableColumnsSelected = tableColumns;
      this.tableColumnsSelectedTemp = tableColumns;
    },
    selectTableColumns() {
      this.tableColumnsSelected = this.tableColumnsSelectedTemp;
      this.tableColumnsFilterVisible = false;
      window.sessionStorage.setItem(
        CITICS_TG_FILE_LIST_TABLE_COLUMNS,
        JSON.stringify(this.tableColumnsSelected),
      );
    },
    showColumn(name) {
      return this.tableColumnsSelected.includes(name);
    },
    getIcon(fileName) {
      return convertFileTypeToIcon(getFileTypeByName(fileName));
    },
    handleSelectionChange(val) {
      this.$store.commit('fileModule/SET_SELECTED_FILES', val);
    },
    handleCurrentPageChange(val) {
      this.handleChangePage(val);
    },

    handleSizeChange(val) {
      this.clearSelection();
      const pager = {
        ...this.fileViewer.pager,
        page: 1,
        size: val,
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
      this.getAllFiles();
    },

    async handleBatchPredictFiles() {
      const confirm = await this.$confirm(
        '确定要重新预测选中的文件吗？',
        '提示',
      ).catch(() => {});

      if (confirm === 'confirm') {
        const data = {
          fids: this.selectedFiles.map((item) => item.id),
          task: 'predict',
        };
        try {
          await predictFiles(data);
          this.$notify({
            title: '成功',
            message: '发起重新预测成功',
            type: 'success',
          });
          this.clearSelection();
          this.handleChangePage(1);
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },

    async handleBatchInspectFiles() {
      const confirm = await this.$confirm(
        '确定要重新审核选中的文件吗？',
        '提示',
      ).catch(() => {});

      if (confirm === 'confirm') {
        const data = {
          fids: this.selectedFiles.map((item) => item.id),
          task: 'inspect',
        };
        try {
          await predictFiles(data);
          this.$notify({
            title: '成功',
            message: '发起重新审核成功',
            type: 'success',
          });
          this.clearSelection();
          this.handleChangePage(1);
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },

    async handleBatchDeleteFiles() {
      const confirm = await this.$confirm(
        '确定要删除选中的文件吗？',
        '提示',
      ).catch(() => {});

      if (confirm === 'confirm') {
        const data = {
          fids: this.selectedFiles.map((item) => item.id),
        };
        try {
          await batchDeleteFiles(data);
          this.$notify({
            title: '成功',
            message: '批量删除文件成功',
            type: 'success',
          });
          this.clearSelection();
          this.handleChangePage(1);
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    clearSelection() {
      this.$store.commit('fileModule/SET_SELECTED_FILES', []);
      this.$refs.refTable.clearSelection();
    },
    handleJumpToRemark(row) {
      const { id } = row;
      this.$router.push({
        path: `/citics-tg/fileRemark/${id}`,
      });
    },
    async handleFileCompare() {
      const mianFileIndex = this.selectedFiles.findIndex((item) => {
        const fileType = getFileTypeByName(item.fileType);
        return fileType.toUpperCase() === 'PDF';
      });
      let diffIndex, standardIndex;
      if (mianFileIndex === -1) {
        diffIndex = 0;
        standardIndex = 1;
      } else {
        diffIndex = mianFileIndex;
        standardIndex = Number(!mianFileIndex);
      }
      const diffQid = this.selectedFiles[diffIndex].questions[0].id;
      const standardQid = this.selectedFiles[standardIndex].questions[0].id;
      const standardFileId = this.selectedFiles[standardIndex].id;
      try {
        this.comparing = true;
        const res = await compareQuestion(diffQid, {
          standard_qid: standardQid,
        });
        this.jumpToComparePage(diffIndex, standardFileId, res.data.id);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.comparing = false;
      }
    },
    jumpToComparePage(diffIndex, standardFileId, compareRecordId) {
      const { id } = this.selectedFiles[diffIndex];
      this.$router.push({
        path: `/citics-tg/fileCompare/${id}`,
        query: {
          standardFileId,
          compareRecordId,
        },
      });
    },
    getRowClassName({ row }) {
      const classList = [];
      const { from, fileId } = this.$route.query;
      if (from && row.id === Number(fileId)) {
        classList.push('row-highlight');
        this.$nextTick(() => {
          const searchMatchRowEl = this.$refs.refTable.$el.querySelector(
            'tbody > tr.row-highlight',
          );
          if (searchMatchRowEl && this.needScrollToSearchMatchedRow) {
            searchMatchRowEl.scrollIntoView({
              block: 'center',
            });
            searchMatchRowEl.addEventListener('animationend', () => {
              this.needScrollToSearchMatchedRow = false;
            });
          }
        });
      }

      return classList;
    },
  },
};
</script>

<style lang="scss" scoped>
.file-list-container {
  background: #fff;
  .file-head-bar {
    padding: 10px 30px 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ebeef5;
    border-width: 1px 1px 0 1px;
    overflow: hidden;
    .action-wrapper {
      display: flex;
      align-items: center;
      .upload-file {
        ::v-deep .el-upload {
          display: block;
          height: 100%;
        }
        ::v-deep .el-upload-list {
          display: none;
        }
      }
      .doc-compare-btn {
        padding: 0;
        width: 60px;
        height: 38px;
        margin-left: 10px;
        font-size: 14px;
        color: #868e9f;
        border-color: #e6e8f0;
        background: #f9fafc;
      }
    }
    .action-btns {
      display: flex;
      align-items: center;
      .file-operate-btn {
        height: 34px;
        padding: 0 15px;
        color: #7d8598;
        border: 1px solid #edeff3;
        background: linear-gradient(180deg, #fff, #f5f7ff);
        &.is-disabled {
          opacity: 0.3;
          border: 1px solid #ccc;
          &:hover {
            color: #7d8598;
            opacity: 0.3;
          }
        }
        ::v-deep i {
          font-size: 20px;
          color: #333;
        }
        img {
          width: 20px !important;
          height: 20px !important;
          vertical-align: middle;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .el-table {
    ::v-deep .template-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
    ::v-deep .el-table__row {
      .list-item-title {
        color: #606266;
        text-decoration: none;
      }
      .file-list-download-icon {
        visibility: hidden;
      }
      &:hover {
        .file-list-download-icon {
          visibility: visible;
        }
      }
    }
  }
}
.operations {
  display: flex;
  align-items: center;
  height: 23px;
  padding: 0;
}
</style>
