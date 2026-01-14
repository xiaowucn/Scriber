<template>
  <div class="tools-container">
    <h4 class="title">Excel解析</h4>
    <div class="header">
      <div class="upload-container">
        <el-upload
          accept=".xls,.xlsx"
          multiple
          action=""
          :show-file-list="false"
          :http-request="uploadFile">
          <el-tooltip effect="dark" content="上传Excel" placement="top">
            <el-button type="text" class="upload-button">
              <img src="../../../assets/svg-icons/upload-file.svg" />
            </el-button>
          </el-tooltip>
        </el-upload>
        <div class="upload-zip-wrapper" title="上传zip">
          <img src="../../../assets/svg-icons/upload-zip.svg" />
          <input
            type="file"
            accept=".zip"
            class="upload-input"
            name="zip"
            @change="uploadZipFile"
            ref="fileInput" />
        </div>
        <div v-if="uploadFileForm.progressPercentage">
          <div class="file-name">{{ uploadFileForm.name }}</div>
          <div class="upload-progress">
            <span>上传中:</span>
            <el-progress
              :percentage="uploadFileForm.progressPercentage"></el-progress>
            <span class="tips">（正在上传，请勿切换页面） </span>
          </div>
        </div>
        <upload-progress
          :fileName="uploadingFileInfo.name"
          :upload="uploadingFileInfo">
        </upload-progress>
      </div>
      <div>总文档数：{{ pager.total }}</div>
    </div>
    <el-table :data="files" class="has-border">
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
      <el-table-column label="入库状态" align="center">
        <template slot-scope="scope">
          {{ getStatusText(scope.row.pdf_parse_status) }}
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
import UploadProgress from '../../../components/UploadProgress.vue';
import UploadFileMixin from '../../../components/mixins/UploadFileMixin';
import { fetchAllFiles, uploadZipBySSE } from '@/store/api/file.api';
import {
  fetchDefaultProject,
  uploadFile,
  deleteFile,
  getFileDownloadUrl,
} from '@/store/api/detail.api';
import { mapGetters } from 'vuex';
import { checkUploadFileSize, checkUploadFile } from '@/utils';

const UPLOAD_FILE_MAX_SIZE = 200; // 上传文件大小限制最大200MB

const EXCEL_PARSE_STATUS = {
  parsing: 1,
  completed: 100,
  failed: 101,
  unsupport: 9,
};

export default {
  name: 'tools-page',
  mixins: [UploadFileMixin],
  components: { UploadProgress },
  data() {
    return {
      projectId: null,
      treeId: null,
      currentUploadFileName: '',
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
    ...mapGetters('detailModule', ['fileViewer']),
    uploadObj() {
      return this.fileViewer.uploadMap[this.fileViewer.curDirId] || {};
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
          name: 'excel解析',
          visible: false,
        });
        this.projectId = res.data.file_project;
        this.treeId = res.data.file_tree_id;
        this.$store.commit('detailModule/SET_DIR_ID', this.treeId);
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
          return [EXCEL_PARSE_STATUS.parsing].includes(file.pdf_parse_status);
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
    async uploadZipFile(e) {
      const file = e.target.files[0];
      const isValid = checkUploadFile(file, '.zip', UPLOAD_FILE_MAX_SIZE);
      if (!isValid) {
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_type', 'extract');

        await this.handleUploadZipFileBySSE({
          fileName: file.name,
          params: {
            treeId: this.treeId,
            data: formData,
          },
          uploadFileApi: uploadZipBySSE,
        });
        this.getFiles();
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
    getStatusText(status) {
      switch (status) {
        case EXCEL_PARSE_STATUS.parsing:
          return '入库中';

        case EXCEL_PARSE_STATUS.completed:
          return '入库完成';

        case EXCEL_PARSE_STATUS.failed:
          return '入库失败';

        case EXCEL_PARSE_STATUS.unsupport:
          return '不支持该类型';

        default:
          return '入库失败';
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
.tools-container {
  padding: 0 40px;
  height: calc(100% - 61px);
  overflow-y: auto;
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
      > div {
        height: 40px;
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
    .upload-zip-wrapper {
      position: relative;
      img {
        display: block;
        width: 54px;
        height: 38px;
      }
    }
    .upload-input {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      clip-path: polygon(
        calc(100% - 40px) 100%,
        100% 100%,
        100% 0%,
        calc(100% - 40px) 0
      );
      opacity: 0;
      cursor: pointer;
    }
  }
  .el-table {
    .cell {
      .tag-filesize {
        margin-left: 3px;
        height: 16px;
        line-height: 15px;
        padding: 0 2px;
        background-color: $--color-primary-hover;
        border-color: $--color-primary-border;
        color: $--color-primary;
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
