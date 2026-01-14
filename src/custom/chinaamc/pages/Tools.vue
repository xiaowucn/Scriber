<template>
  <div class="pdf-to-word">
    <h4 class="title">PDF转Word</h4>
    <div class="header">
      <div class="upload-container">
        <el-upload
          accept=".pdf"
          action=""
          :show-file-list="false"
          :http-request="uploadFile">
          <el-tooltip effect="dark" content="上传PDF" placement="top">
            <el-button type="text" class="upload-button">
              <img src="../../../assets/svg-icons/upload-file.svg" />
            </el-button>
          </el-tooltip>
        </el-upload>
        <div v-if="uploadFileForm.progressPercentage">
          <div class="file-name">{{ uploadFileForm.name }}</div>
          <div class="upload-progress">
            <span>上传中:</span>
            <el-progress
              :percentage="uploadFileForm.progressPercentage"></el-progress>
            <span class="tips">（正在上传，请勿切换页面） </span>
          </div>
        </div>
      </div>
      <div>总文档数：{{ pager.total }}</div>
    </div>
    <el-table :data="files">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column prop="name" label="文件">
        <template slot-scope="scope">
          {{ scope.row.name }}
          <el-tag size="mini" class="tag-filesize">
            {{ scope.row.size | fileSize }}
          </el-tag>
          <a
            :href="scope.row.download"
            :download="scope.row.name"
            target="_blank"
            class="file-download"
            title="下载源文件">
            <i class="fa fa-download"></i>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="pdf_parse_status" label="预处理" align="center">
        <template slot-scope="scope">
          {{ scope.row.pdf_parse_status | pdfParseStatus }}
        </template>
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="上传用户"
        align="center"></el-table-column>
      <el-table-column prop="created_utc" label="上传时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        align="center"
        class-name="operations">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="下载Word" placement="top">
            <el-button
              type="text"
              :disabled="downloadWordDisabled(scope.row.pdf_parse_status)"
              :loading="scope.row.downloadLoading"
              @click="downloadWord(scope.row)">
              <img
                v-if="!scope.row.downloadLoading"
                src="../../../assets/svg-icons/download.svg"
                alt="" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button type="text" @click="deleteFile(scope.row.id)">
              <img src="../../../assets/svg-icons/delete.svg" alt="" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
import { checkUploadFileSize, downloadFileByBlob } from '@/utils';
import { pdfParseStatus } from '@/store/constants';
import { fetchAllFiles, downloadDocxFile } from '@/store/api/file.api';
import {
  fetchDefaultProject,
  uploadFile,
  deleteFile,
  getFileDownloadUrl,
} from '@/store/api/detail.api';

const UPLOAD_FILE_MAX_SIZE = 200; // 上传文件大小限制最大200MB

export default {
  name: 'tools-page',
  data() {
    return {
      projectId: null,
      treeId: null,
      uploadFileForm: {
        name: '',
        progressPercentage: 0,
      },
      files: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      timer: null,
    };
  },
  computed: {
    downloadWordDisabled() {
      return (status) => {
        return [
          pdfParseStatus.waiting,
          pdfParseStatus.parsing,
          pdfParseStatus.failed,
        ].includes(status);
      };
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      await this.getDefaultProjectInfo();
      this.getFiles();
    },
    async getDefaultProjectInfo() {
      try {
        const res = await fetchDefaultProject({
          name: 'pdf2word',
          visible: false,
        });
        this.projectId = res.data.file_project;
        this.treeId = res.data.file_tree_id;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getFiles() {
      try {
        const { data } = await fetchAllFiles(this.projectId, {
          page: this.pager.page,
        });
        this.files = data.items.map((i) => {
          return {
            ...i,
            download: getFileDownloadUrl(i.id),
            downloadLoading: false,
          };
        });
        this.pager.total = data.total;

        clearInterval(this.timer);
        const hasParsingFiles = this.files.some((file) => {
          return [pdfParseStatus.waiting, pdfParseStatus.parsing].includes(
            file.pdf_parse_status,
          );
        });
        if (hasParsingFiles) {
          this.timer = setInterval(() => {
            this.getFiles();
          }, 5e3);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async uploadFile(file) {
      const isChecked = checkUploadFileSize(
        file.file.size,
        UPLOAD_FILE_MAX_SIZE,
      );
      if (!isChecked) {
        return;
      }
      try {
        this.uploadFileForm.name = file.file.name;
        const formData = new FormData();
        formData.append('file', file.file);
        formData.append('task_type', 'pdf2word');
        await uploadFile(this.treeId, formData, (progressEvent) => {
          const { loaded, total } = progressEvent;
          this.uploadFileForm.progressPercentage = Math.floor(
            (loaded / total) * 100,
          );
        });
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
        });
        this.pager.page = 1;
        this.getFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.uploadFileForm = { name: '', progressPercentage: 0 };
      }
    },
    async downloadWord(file) {
      try {
        file.downloadLoading = true;
        const res = await downloadDocxFile(file.id);
        await downloadFileByBlob(res);
        this.$notify({
          title: '成功',
          message: '下载成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        file.downloadLoading = false;
      }
    },
    async deleteFile(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续？',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await deleteFile(false, id);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.getFiles();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    changePage(page) {
      this.pager.page = page;
      this.getFiles();
    },
  },
};
</script>

<style lang="scss" scoped>
.pdf-to-word {
  padding: 0 40px;
  .title {
    padding: 20px 0;
    border-bottom: 1px solid #e6e6e6;
    font-size: 14px;
    color: #333;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    color: #909399;
    .upload-container {
      display: flex;
      align-items: center;
      ::v-deep .el-upload {
        margin-right: 20px;
      }
      .upload-button {
        padding: 0;
        img {
          width: 54px;
          height: 38px;
        }
      }
      .file-name {
        margin-bottom: 5px;
        color: #333;
      }
      .upload-progress {
        display: flex;
        align-items: center;
        font-size: 14px;
        .el-progress {
          width: 150px;
          margin-left: 10px;
        }
        .tips {
          color: #ff9a03;
        }
      }
    }
  }
  .el-table {
    .cell {
      .tag-filesize {
        margin-left: 3px;
        height: 16px;
        line-height: 15px;
        padding: 0 2px;
        background-color: #0090c01a;
        border-color: #0090c080;
        color: #0090c0;
        border-radius: 2px;
        vertical-align: text-top;
      }
      .file-download {
        visibility: hidden;
        margin-left: 5px;
        color: #606266;
      }
      &:hover {
        .file-download {
          visibility: visible;
        }
      }
    }
    .operations {
      .el-button--text {
        padding: 0;
      }
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
