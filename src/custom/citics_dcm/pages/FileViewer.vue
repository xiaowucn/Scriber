<template>
  <div class="file-list">
    <div class="page-header list-header">
      <bread-crumb currentTab="projectAll" />
      <file-search-box @search="handleSearch" />
    </div>
    <div class="list-summary">
      <el-button
        size="medium"
        type="primary"
        @click="openUploadFilePopup"
        v-if="$user.isAdminUser()">
        <i class="fa fa-plus fa-fw"></i>
        <span> 上传文件</span>
      </el-button>
      <div class="summary" v-if="isShowProjectSummary">
        <project-summary :projectId="projectId" />
      </div>
    </div>
    <el-table
      class="has-border"
      empty-text="暂无数据"
      :data="fileViewer.files"
      v-loading="fileViewer.isLoading">
      <el-table-column prop="id" label="ID" width="150" align="center" />
      <el-table-column prop="name" label="文件名称">
        <template slot-scope="scope">
          <span v-if="scope.row.download" class="filename">
            {{ scope.row.name }}
            <el-tag size="mini">{{ scope.row.size | fileSize }}</el-tag>
            <a
              :href="scope.row.download"
              target="_blank"
              title="下载"
              :download="scope.row.name"
              @click.stop>
              <i class="el-icon-download"></i>
            </a>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="email_sent_at"
        label="发送时间"
        class-name="time">
        <template slot-scope="scope">
          <span>{{ scope.row.email_sent_at | datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="investor_name" label="订单人">
        <template slot-scope="scope">
          <span>{{ scope.row.investor_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="browse_status" label="浏览状态">
        <template slot-scope="scope">
          <span :style="getFileStatusStyle(scope.row.browse_status)">
            {{ getFileBrowseStatus(scope.row.browse_status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="edit_status" label="修改状态">
        <template slot-scope="scope">
          <span :style="getFileStatusStyle(scope.row.edit_status)">
            {{ getFileModifyStatus(scope.row.edit_status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fill_status" label="填写状态">
        <template slot-scope="scope">
          <span :style="getFillStatusStyle(scope.row.fill_status)">
            {{ getFillStatus(scope.row.fill_status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip effect="dark" placement="top" content="查看">
              <el-button
                size="small"
                type="text"
                :disabled="!isFileParseCompleted(scope.row.pdf_parse_status)"
                @click="handleJumpToFileRemark(scope.row)">
                <theme-icon name="view" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top" content="重新预测">
              <el-button
                size="small"
                type="text"
                :disabled="isFileParsing(scope.row.pdf_parse_status)"
                @click.stop="reparseFile(scope.row)">
                <theme-icon name="reparse" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top" content="重新填写">
              <el-button
                size="small"
                type="text"
                @click.stop="autoFillFile(scope.row.id)">
                <theme-icon name="fill" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top" content="删除">
              <el-button
                size="small"
                type="text"
                @click.stop="deleteFile(scope.row)">
                <theme-icon name="delete" />
              </el-button>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :current-page="fileViewer.pager.page"
      :page-size="fileViewer.pager.size"
      :page-sizes="[10, 20, 50]"
      :total="fileViewer.pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <upload-file-popup
      v-if="uploadFileDialogVisible"
      :projectId="projectId"
      @close="closeUploadFilePopup" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import BreadCrumb from '@/components/BreadCrumb';
import ProjectSummary from '@/components/ProjectSummary';
import FileSearchBox from '../components/FileSearchBox';
import UploadFilePopup from '../components/UploadFilePopup';
import { file as fileApi, citicsDCM as citicsDCMApi } from '@/store/api';
import { pdfParseStatus } from '@/store/constants';
import { FILL_STATUS_CODE } from '../common/constant';
import {
  getFillStatus,
  getFileBrowseStatus,
  getFileModifyStatus,
  getFillStatusStyle,
  getFileStatusStyle,
} from '../common/utils';

export default {
  name: 'fileViewer',
  components: {
    FileSearchBox,
    BreadCrumb,
    ProjectSummary,
    UploadFilePopup,
  },
  props: {
    projectId: {
      type: Number,
      default: -1,
      required: true,
    },
  },
  data() {
    return {
      filterBy: '',
      filterValue: '',
      fileListTimer: null,
      isShowProjectSummary: true,
      uploadFileDialogVisible: false,
    };
  },
  watch: {
    'fileViewer.files': {
      handler(val) {
        if (_.isEmpty(val)) {
          this.stopFileListTimer();
        }
      },
    },
  },
  created() {
    this.$store.commit('detailModule/SET_DIR_ID', this.projectId);
    this.fetchFiles();
  },
  mounted() {
    this.startFileListTimer();
  },
  beforeDestroy() {
    this.stopFileListTimer();
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    isFileParsing() {
      return (status) => {
        return status === pdfParseStatus.parsing;
      };
    },
    isFileParseCompleted() {
      return (status) => {
        return status === pdfParseStatus.completed;
      };
    },
  },
  methods: {
    getFillStatus,
    getFileBrowseStatus,
    getFileModifyStatus,
    getFillStatusStyle,
    getFileStatusStyle,
    startFileListTimer() {
      if (this.fileListTimer) {
        clearInterval(this.fileListTimer);
      }
      this.fileListTimer = setInterval(() => {
        this.fetchFiles({ needLoading: false });
      }, 30e3);
    },
    stopFileListTimer() {
      if (this.fileListTimer) {
        clearInterval(this.fileListTimer);
        this.fileListTimer = null;
      }
    },
    fetchFiles(options) {
      if (this.filterValue) {
        this.isShowProjectSummary = false;
        this.fetchFilesList(options);
      } else {
        this.isShowProjectSummary = true;
        this.fetchFilesList(options);
      }
      if (!this.fileListTimer) {
        this.startFileListTimer();
      }
    },
    async fetchFilesList(options = { needLoading: true }) {
      try {
        let params = {};
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', params);
        await this.$store.dispatch('detailModule/fetchFileList', {
          projectId: this.projectId,
          needLoading: options.needLoading,
        });
      } catch (e) {
        this.$notify({
          title: '提示',
          message: e.message,
          type: 'error',
        });
      }
    },

    async autoFillFile(id) {
      const confirm = await this.$confirm('是否触发重新填写？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (confirm) {
        try {
          const params = { fill_status: String(FILL_STATUS_CODE.fillable) };
          await citicsDCMApi.updateFile(id, params);
          this.$notify({
            title: '成功',
            message: '已触发重新填写',
            type: 'success',
          });
          this.fetchFiles();
        } catch (e) {
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'error',
          });
        }
      }
    },
    async deleteFile(file) {
      const confirm = await this.$confirm('是否删除该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (confirm) {
        try {
          await this.$store.dispatch('detailModule/deleteFile', {
            fileId: file.id,
            isDir: file.isDir,
          });
          this.$notify({
            title: '成功',
            message: '文件删除成功',
            type: 'success',
          });
          this.fetchFiles();
        } catch (e) {
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'error',
          });
        }
      }
    },
    async reparseFile(file) {
      try {
        await fileApi.rerunFile(file.id, 'preset');
        this.$notify({
          title: '成功',
          message: '发起重新预测成功',
          type: 'success',
        });
        this.fetchFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleJumpToFileRemark(file) {
      this.$router.push({
        name: 'fileRemark',
        params: { fileId: file.id },
        query: { qid: file.questions[0].id },
      });
    },
    handleChangePage(page) {
      const pager = {
        ...this.fileViewer.pager,
        page: page,
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
      this.fetchFiles();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.fileViewer.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
      this.fetchFiles();
    },
    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.handleChangePage(1);
    },
    openUploadFilePopup() {
      this.uploadFileDialogVisible = true;
    },
    closeUploadFilePopup() {
      this.uploadFileDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.file-list {
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    ::v-deep .file-path {
      .path-name {
        display: inline-flex;
        align-items: center;
        &:not(:last-child):hover {
          color: $--color-primary;
        }
      }
    }
  }
  .list-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 17px;
    .summary {
      flex: 1;
    }
    .project-summary {
      margin: 0px;
      justify-content: flex-end;
    }
  }
  .el-table {
    ::v-deep .el-table__cell {
      &.time {
        .cell {
          display: flex;
        }
        .caret-wrapper {
          height: 23px;
        }
        .sort-caret {
          &.ascending {
            top: 0px;
          }
          &.descending {
            bottom: 0px;
          }
        }
      }
    }
    ::v-deep .el-table__row {
      .filename {
        &:hover {
          .el-icon-download {
            visibility: visible;
            color: $--color-primary;
          }
        }
        .el-icon-download {
          cursor: pointer;
          visibility: hidden;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
