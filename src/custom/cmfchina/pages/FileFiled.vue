<template>
  <div class="file-filed-container">
    <div class="page-header">
      <div>
        <upload-filed-code
          v-if="showOperationButtons"
          ref="uploadFiledCodeRef"
          :accept-types="acceptTypes" />
      </div>
      <search-box :search-data="searchData" @search="searchFiles" />
    </div>
    <div class="page-detail">
      <div v-if="showOperationButtons" class="file-action">
        <div class="action-btns">
          <el-button
            size="small"
            title="上传文件"
            @click="openUploadFilePopup('file')">
            <theme-icon
              name="file-upload"
              icon-class="el-icon-upload"></theme-icon>
          </el-button>
          <el-button
            size="small"
            title="上传压缩包"
            @click="openUploadFilePopup('zip')">
            <theme-icon name="file-compression"></theme-icon>
          </el-button>
          <el-button
            :disabled="!showBatchReFiledFilesButton"
            size="small"
            class="btn"
            title="批量重跑分类"
            @click="batchReFiledFiles">
            <theme-icon
              name="reparse"
              icon-class="el-icon-refresh"
              img-class="refresh-img"></theme-icon>
          </el-button>
          <el-button
            :disabled="!showBatchDeleteFilesButton"
            size="small"
            class="btn"
            title="批量删除"
            @click="batchDeleteFiles">
            <svg-font-icon name="batch-delete" color="#707070"></svg-font-icon>
          </el-button>
        </div>
        <upload-progress
          :fileName="uploadingFileInfo.name"
          :upload="uploadingFileInfo" />
      </div>
      <div class="file-list">
        <el-table
          ref="fileTable"
          :data="filesData"
          class="has-border"
          height="auto"
          empty-text="暂无数据"
          row-key="id"
          v-loading="isLoading"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="30"
            align="center"
            :reserve-selection="true">
          </el-table-column>
          <el-table-column prop="id" label="ID" align="center" width="100">
          </el-table-column>
          <el-table-column prop="name" label="文件" align="center">
            <template slot-scope="scope">
              <span class="filename">
                {{ scope.row.name }}
                <a
                  v-if="scope.row.download"
                  target="_blank"
                  title="下载"
                  :href="scope.row.download"
                  :download="scope.row.name"
                  @click.stop>
                  <i class="el-icon-download"></i>
                </a>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pdf_parse_status"
            label="预处理"
            align="center">
            <template slot-scope="scope">
              <span :style="getPdfParseStatusStyle(scope.row.pdf_parse_status)">
                {{ getPdfParseStatus(scope.row.pdf_parse_status) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="分类状态"
            align="center"
            class-name="filed-status">
            <template slot-scope="scope">
              <div class="content">
                <span
                  class="status"
                  :style="getFileFiledStatusStyle(scope.row.filed_status)">
                  {{ getFileFiledStatus(scope.row.filed_status) }}
                </span>
                <el-tooltip
                  v-if="isFileFiledFailed(scope.row.filed_status)"
                  placement="top"
                  :content="scope.row.filed_fail_info"
                  popper-class="filed-status-tooltip">
                  <theme-icon
                    :name="getFileFiledIconName(scope.row.filed_status)" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="场景&AI预测"
            class-name="scene_and_ai_status">
            <template slot-scope="scope">
              <div
                v-if="scope.row.questions && scope.row.questions.length !== 0">
                <div
                  v-for="(question, index) in scope.row.questions"
                  :key="index"
                  class="question">
                  <span class="mold-name">{{ question.mold_name }}</span>
                  <el-tooltip
                    placement="top"
                    :content="getAIPredictionStatus(question.ai_status)">
                    <theme-icon
                      :name="getAIPredictIconName(question.ai_status)" />
                  </el-tooltip>
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="project_name" label="项目名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.project_name ? scope.row.project_name : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="sysfrom" label="文件来源" align="center">
            <template slot-scope="scope">
              {{ getFileSysfrom(scope.row.sysfrom) }}
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="上传用户" align="center">
          </el-table-column>
          <el-table-column
            prop="created_utc"
            label="上传时间"
            align="center"
            sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.created_utc | datetime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="operations">
            <template v-if="showOperationButtons" slot-scope="scope">
              <!-- <el-tooltip effect="dark" placement="top" content="查看">
                <el-button
                  type="text"
                  size="small"
                  :disabled="!isCanPreviewFile(scope.row.filed_status)"
                  @click.stop="previewFile(scope.row)">
                  <theme-icon name="view"></theme-icon>
                </el-button>
              </el-tooltip> -->
              <el-tooltip effect="dark" placement="top" content="重跑分类">
                <el-button
                  type="text"
                  size="small"
                  :disabled="!isCanReFiledFile(scope.row.filed_status)"
                  @click.stop="reFiledFile(scope.row.id)">
                  <theme-icon name="reparse"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" placement="top" content="在项目中查看">
                <el-button
                  type="text"
                  size="small"
                  :disabled="!isCanPreviewFile(scope.row.filed_status)"
                  @click.stop="goDetail(scope.row)">
                  <theme-icon name="view-in-project"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" placement="top" content="删除">
                <el-button
                  type="text"
                  size="small"
                  @click.stop="deleteFile(scope.row.id)">
                  <theme-icon name="delete"></theme-icon>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="isShowPagePagination"
          background
          layout="total, prev, pager, next, sizes"
          :current-page="pager.page"
          :page-size="pager.size"
          :total="pager.total"
          :page-sizes="[10, 20, 50]"
          @current-change="handleChangePage"
          @size-change="handleChangeSize">
        </el-pagination>
      </div>
    </div>
    <upload-file-popup
      v-if="isShowUploadFilePopup"
      @close="closeUploadFilePopup"
      @upload-file="uploadFile"
      :upload-type="uploadType"
      :upload-title="uploadTitle"
      :supported-suffixes="supportedSuffixes"
      :accept-types="acceptTypes" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import UploadProgress from '@/components/UploadProgress.vue';
import SearchBox from '../components/SearchBox';
import UploadFiledCode from '../components/UploadFiledCode';
import UploadFilePopup from '../components/UploadFilePopup';
import {
  FILE_FILED_STATUS,
  FILE_FILED_STATUS_CODE,
  FILE_FILED_STATUS_ICON_NAME_MAP,
  PDF_PARSE_STATUS_STYLE,
  FILE_FILED_STATUS_STYLE,
  PDF_PARSE_STATUS_SEARCH_OPTION,
  AI_STATUS_SEARCH_OPTION,
  FILE_SOURCE,
} from '../common/constant';
import {
  PDF_PARSE_STATUS,
  AI_PREDICT_STATUS_TEXT_MAP,
  AI_PREDICT_STATUS_ICON_NAME_MAP,
} from '@/store/constants';
import { getSortParams, getAcceptFileTypes, isUploadZipFile } from '@/utils';
import { cmfchinaPermAllowed } from '../common/utils';
import {
  cmfchina as cmfchinaApi,
  detail as detailApi,
} from '../../../store/api';
import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';
import UploadFileMixin from '@/components/mixins/UploadFileMixin';

export default {
  name: 'file-filed-container',
  mixins: [FileMarkableMixin, UploadFileMixin],
  components: {
    SearchBox,
    UploadFiledCode,
    UploadFilePopup,
    UploadProgress,
  },
  data() {
    return {
      searchData: {
        dateOptions: [
          {
            value: 'created_utc',
            label: '上传时间',
          },
        ],
        contentOptions: [
          {
            value: 'filename',
            label: '文件名称',
          },
          {
            value: 'projectname',
            label: '项目名称',
          },
          {
            value: 'fid',
            label: '文件ID',
          },
          {
            value: 'user_name',
            label: '上传用户',
          },
          PDF_PARSE_STATUS_SEARCH_OPTION,
          AI_STATUS_SEARCH_OPTION,
        ],
      },
      sortParams: {},
      searchParams: {},
      filesData: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      isLoading: false,
      fileListTimer: null,
      selectedFiles: [],
      isShowUploadFilePopup: false,
      uploadType: '',
    };
  },
  created() {
    this.fetchFileList();
  },
  mounted() {
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
    this.fileListTimer = setInterval(() => {
      this.fetchFileList({ needLoading: false });
    }, 30e3);
  },
  beforeDestroy() {
    clearInterval(this.fileListTimer);
  },
  watch: {
    '$route.query': {
      handler() {
        this.searchParams = this.$route.query;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    showOperationButtons() {
      return cmfchinaPermAllowed('classification_settings');
    },
    isShowPagePagination() {
      return this.pager.total > 0;
    },
    isFileFiledFailed() {
      return (status) => {
        return status === FILE_FILED_STATUS_CODE.failed;
      };
    },
    isFileFiledCompleted() {
      return (status) => {
        return status === FILE_FILED_STATUS_CODE.completed;
      };
    },
    isCanPreviewFile() {
      return (status) => {
        return this.isFileFiledCompleted(status);
      };
    },
    isCanReFiledFile() {
      return (status) => {
        return (
          this.isFileFiledCompleted(status) || this.isFileFiledFailed(status)
        );
      };
    },
    showBatchDeleteFilesButton() {
      return this.selectedFiles.length > 0;
    },
    showBatchReFiledFilesButton() {
      return this.selectedFiles.length > 0;
    },
    uploadTitle() {
      return this.uploadType === 'zip' ? '上传压缩包' : '上传文件';
    },
    supportedSuffixes() {
      if (this.uploadType === 'zip') {
        return this.configuration.supported_zip_suffixes.join(',');
      }
      return this.configuration.supported_suffixes.join(',');
    },
    acceptTypes() {
      return getAcceptFileTypes(this.supportedSuffixes);
    },
  },
  methods: {
    getFileFiledStatus(status) {
      return FILE_FILED_STATUS[status] || '';
    },
    getFileFiledIconName(status) {
      return FILE_FILED_STATUS_ICON_NAME_MAP[status] || '';
    },
    getAIPredictIconName(status) {
      return AI_PREDICT_STATUS_ICON_NAME_MAP[status] || '';
    },
    getAIPredictionStatus(status) {
      return AI_PREDICT_STATUS_TEXT_MAP[status] || '';
    },
    getPdfParseStatus(status) {
      return PDF_PARSE_STATUS[status] || '';
    },
    getPdfParseStatusStyle(status) {
      return PDF_PARSE_STATUS_STYLE[status] || '';
    },
    getFileFiledStatusStyle(status) {
      return FILE_FILED_STATUS_STYLE[status] || '';
    },
    getFileSysfrom(value) {
      return FILE_SOURCE[value] || '';
    },
    searchFiles(searchParams) {
      this.searchParams = searchParams;
      this.handleChangePage(1);
      this.refreshRouter();
    },
    refreshRouter() {
      this.$router.replace({
        path: this.$route.path,
        query: this.searchParams,
      });
    },
    async fetchFileList(options = { needLoading: true }) {
      try {
        if (options.needLoading) {
          this.isLoading = true;
        }
        const params = _.omitBy(
          {
            page: this.pager.page,
            size: this.pager.size,
            ...this.searchParams,
            ...this.sortParams,
          },
          (v) => v === '' || v === 'all',
        );
        const res = await cmfchinaApi.fetchFiledFile(params);
        const files = res.data.items.map((file) => {
          file.download = detailApi.getFileDownloadUrl(file.id);
          return file;
        });
        this.filesData = files;
        this.pager.total = res.data.total;
      } catch (err) {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error',
        });
      } finally {
        if (options.needLoading) {
          this.isLoading = false;
        }
      }
    },
    handleChangePage(page) {
      this.$refs.fileTable.bodyWrapper.scrollTop = 0;
      const pager = {
        ...this.pager,
        page: page,
      };
      this.pager = pager;
      this.fetchFileList();
    },
    handleChangeSize(size) {
      this.$refs.fileTable.bodyWrapper.scrollTop = 0;
      const pager = {
        ...this.pager,
        page: 1,
        size: size,
      };
      this.pager = pager;
      this.fetchFileList();
    },
    async openUploadFilePopup(type) {
      if (!this.$refs.uploadFiledCodeRef.isUploadedFiledCodeFile) {
        this.$alert('请先上传分类代码，再上传文档。', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        });
        return;
      }
      this.uploadType = type;
      this.isShowUploadFilePopup = true;
    },
    closeUploadFilePopup() {
      this.uploadType = '';
      this.isShowUploadFilePopup = false;
    },
    getUploadFileParams(file) {
      const formData = new FormData();
      formData.append('file', file.raw);
      return { data: formData };
    },
    async uploadFile(files) {
      try {
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          const handleUpload = isUploadZipFile(file.raw)
            ? this.handleUploadZipFileBySSE
            : this.handleUploadDefaultFile;
          const uploadFileApi = isUploadZipFile(file.raw)
            ? cmfchinaApi.uploadFiledZipFile
            : cmfchinaApi.uploadFiledFile;
          await handleUpload({
            fileName: file.raw.name,
            params: this.getUploadFileParams(file),
            uploadFileApi,
          });
          this.handleChangePage(1);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    previewFile(file) {
      const fileValid = this.checkRemarkFileValid(file);
      if (!fileValid) {
        return;
      }
      const { qid, mold } = this.getFileSchema(file);
      const { project, id, tree_id, task_type } = file;
      const routeParams = {
        name: 'inspect',
        params: { qid },
        query: {
          projectId: project,
          fileId: id,
          treeId: tree_id,
          schemaId: mold,
          task_type: task_type,
        },
      };
      this.$router.push(routeParams);
    },
    goDetail(file) {
      const { project, tree_id, id } = file;
      const routeParams = {
        name: 'projectDetail',
        params: { projectId: project, treeId: tree_id },
        query: { fileId: id, from: 'filed' },
      };
      this.$router.push(routeParams);
    },
    async reFiledFile(id) {
      try {
        const data = { fids: [id] };
        await cmfchinaApi.reFiledFile(data);
        this.$notify({
          title: '成功',
          message: '重跑分类成功',
          type: 'success',
        });
        this.fetchFileList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteFile(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续？',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          const data = { fids: [id] };
          await cmfchinaApi.deleteFiledFile(data);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.fetchFileList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async batchReFiledFiles() {
      const confirm = await this.$confirm(
        '确定要重跑分类选中的文件吗？',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          const data = {
            fids: this.selectedFiles.map((item) => item.id),
          };
          await cmfchinaApi.reFiledFile(data);
          this.$notify({
            title: '成功',
            message: '发起重跑分类成功',
            type: 'success',
          });
          this.resetSelectedFiles();
          this.fetchFileList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async batchDeleteFiles() {
      const confirm = await this.$confirm(
        '确定要删除选中的文件吗？',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          const data = {
            fids: this.selectedFiles.map((item) => item.id),
          };
          await cmfchinaApi.deleteFiledFile(data);
          this.$notify({
            title: '成功',
            message: '批量删除文件成功',
            type: 'success',
          });
          this.resetSelectedFiles();
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
    handleSortChange({ prop, order }) {
      this.sortParams = getSortParams(prop, order);
      this.handleChangePage(1);
    },
    handleSelectionChange(selection) {
      this.selectedFiles = selection;
    },
    resetSelectedFiles() {
      this.selectedFiles = [];
      this.$refs.fileTable.clearSelection();
    },
  },
};
</script>

<style scoped lang="scss">
.file-filed-container {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .page-detail {
    display: flex;
    flex: 1;
    flex-flow: column;
    overflow: hidden;
  }
  .file-action {
    padding: 13px 0;
    border: 1px solid #eceff4;
    border-width: 1px 1px 0 1px;
    background-color: #fff;
    display: flex;
    align-items: center;
    .action-btns {
      display: flex;
      align-items: center;
      ::v-deep .el-button {
        margin-left: 12px;
        padding: 5px 15px;
        border: 1px solid #edeff3;
        background: linear-gradient(180deg, #fff, #f5f7ff);
        &.el-button--text {
          padding: 0;
        }
        img {
          width: 20px;
          height: 20px;
          border-radius: 0;
        }
      }
      .btn {
        height: 34px;
        padding: 0 15px;
        color: #7d8598;
        border: 1px solid #edeff3;
        background: linear-gradient(180deg, #fff, #f5f7ff);
        &.is-disabled {
          opacity: 0.3;
          border: 1px solid #ccc;
        }
        ::v-deep i {
          font-size: 20px;
          font-weight: bold;
        }
        .refresh-img {
          width: 20px !important;
          height: 20px !important;
          filter: contrast(0);
        }
      }
    }
  }
  .file-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    ::v-deep .el-table {
      .cell {
        padding: 0px;
        word-break: normal;
      }
    }
    .filename {
      word-break: break-all;
      &:hover {
        .el-icon-download {
          visibility: visible;
          &:hover {
            color: $--color-primary;
          }
        }
      }
      .el-icon-download {
        visibility: hidden;
        color: #606266;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .filed-status .content,
    .scene_and_ai_status .question {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .filed-status .status,
    .scene_and_ai_status .mold-name {
      margin-right: 5px;
    }
    .operations {
      .el-dropdown {
        margin: 0px 10px;
      }
    }
  }
}
</style>

<style lang="scss">
.filed-status-tooltip {
  max-width: 130px;
}
</style>
