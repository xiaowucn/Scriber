<template>
  <div class="model-use-page">
    <div class="model-use-header">
      <el-button size="medium" type="primary" @click="goback">
        <i class="el-icon-back"></i>
        返回
      </el-button>
      <div class="model-name">
        <span>模型名称</span>
        <div class="model-name-box">{{ modelName }}</div>
      </div>
      <div class="model-scene-select">
        <span>场景名称</span>
        <el-select
          v-model="moldId"
          size="medium"
          placeholder="请选择场景"
          :disabled="moldsList.length === 1"
          @change="setFileListParamsToUrl">
          <el-option
            v-for="item in moldsList"
            :key="item.mold_id"
            :label="item.mold_name"
            :value="item.mold_id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="model-use-file-upload">
      <el-upload
        ref="upload"
        v-loading="isUploadLoading"
        element-loading-text="文件上传中..."
        class="upload-demo"
        drag
        action=""
        :accept="acceptTypes"
        :show-file-list="false"
        :limit="1"
        :http-request="uploadFile"
        @drop.native="(e) => onUploadFileDrop(e.dataTransfer.files)">
        <svg-font-icon name="update" />
        <div class="el-upload__text">请将文件拖放到此处，或点击上传</div>
      </el-upload>
    </div>
    <el-table
      ref="table"
      class="has-border"
      empty-text="暂无数据"
      :data="modelFiles"
      height="calc(100% - 40px)"
      v-loading="isLoading">
      <el-table-column
        prop="id"
        label="ID"
        width="70"
        align="center"></el-table-column>
      <el-table-column
        prop="name"
        label="文件名"
        min-width="300"></el-table-column>
      <el-table-column
        prop="created_utc"
        label="创建时间"
        align="center"
        width="200">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column prop="pdf_parse_status" label="预处理" align="center">
        <template slot-scope="scope">
          {{ getPdfParseStatus(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="ai_status" label="AI预测" align="center">
        <template slot-scope="scope">
          {{ getAIStatus(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="operations">
        <template slot-scope="scope">
          <el-button size="small" @click="handleViewResults(scope.row)">
            查看结果
          </el-button>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="handleDeleteFile(scope.row)">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  fetchModels,
  fetchModelsFiles,
  uploadModelsFiles,
  deleteModelsFiles,
} from '../../../store/api/cmfchina.api';
import { pdfParseStatus, AI_PREDICT_STATUS_MAP } from '@/store/constants';
import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';
import {
  PDF_PARSE_STATUS,
  AI_PREDICT_STATUS_TEXT_MAP,
} from '../../../store/constants';
import { INTERFACE_STATUS } from '../common/constant';
import { getAcceptFileTypes } from '@/utils';
import { beforeFileUpload } from '../common/utils';

export default {
  name: 'model-use',
  mixins: [FileMarkableMixin],
  props: {
    modelId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      modelName: '',
      modelFiles: [],
      isLoading: false,
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      resultJson: null,
      fileListTimer: null,
      moldId: null,
      moldsList: [{ mold_id: null, mold_name: '无' }],
      isUploadLoading: false,
    };
  },
  computed: {
    ...mapGetters(['configuration']),

    supportedSuffixes() {
      return this.configuration.supported_suffixes.join(',');
    },
    acceptTypes() {
      return getAcceptFileTypes(this.supportedSuffixes);
    },
  },
  watch: {
    $route: {
      handler() {
        const params = this.$route.query;
        this.pager.page = Number(params.page) || 1;
        this.pager.size = Number(params.size) || 20;
        this.moldId = Number(params.mold_id) || null;

        this.fetchFilesList();
      },
      immediate: true,
    },
  },
  async mounted() {
    await this.fetchCurrentModel();
    this.setFileListParamsToUrl();
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
    this.fileListTimer = setInterval(() => {
      this.fetchFilesList({ needLoading: false });
    }, 30e3);
  },
  beforeDestroy() {
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isUploadLoading) {
      this.$notify({
        title: '提示',
        message: '文件正在上传中，请勿离开当前页面',
        type: 'warning',
      });
      next(false);
      return;
    }
    next();
  },
  methods: {
    getTaskStatus(row) {
      let predictStatus = ''; // 预测状态
      let completeStatus = ''; // 完成状态
      let doingStatus = ''; // 处理中状态
      if (row.molds.length > 0) {
        predictStatus = row.questions[0].ai_status;
        completeStatus = AI_PREDICT_STATUS_MAP.FINISHED;
        doingStatus = AI_PREDICT_STATUS_MAP.DOING;
      } else {
        predictStatus = row.interface_status;
        completeStatus = INTERFACE_STATUS.FINISHED;
        doingStatus = INTERFACE_STATUS.DOING;
      }

      if (
        row.pdf_parse_status === pdfParseStatus.completed &&
        predictStatus === completeStatus
      ) {
        return {
          value: 'success',
          text: '成功',
        };
      } else if (
        row.pdf_parse_status <= pdfParseStatus.parsing ||
        predictStatus <= doingStatus
      ) {
        return {
          value: 'doing',
          text: '处理中',
        };
      } else {
        return {
          value: 'failed',
          text: '失败',
        };
      }
    },
    getPdfParseStatus(row) {
      const status = row.pdf_parse_status;
      return PDF_PARSE_STATUS[status] || '-';
    },
    getAIStatus(row) {
      const status = row.questions[0]?.ai_status;
      return AI_PREDICT_STATUS_TEXT_MAP[status] || '-';
    },
    async fetchCurrentModel() {
      try {
        const params = {
          id: this.modelId,
        };
        const res = await fetchModels(params);
        this.modelName = res.data.items[0].name;
        if (res.data.items[0].molds.length > 0) {
          this.moldsList = [
            ...res.data.items[0].molds,
            { mold_id: null, mold_name: '无' },
          ];
          if (!this.moldId) {
            this.moldId = this.moldsList[0].mold_id;
          }
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    setFileListParamsToUrl() {
      const params = {
        page: this.pager.page,
        size: this.pager.size,
      };
      if (this.moldId) {
        params.mold_id = this.moldId;
      }
      this.$router.replace({
        query: params,
      });
    },
    async fetchFilesList(options = { needLoading: true }) {
      try {
        if (options.needLoading) {
          this.isLoading = true;
        }
        const params = this.$route.query;
        const res = await fetchModelsFiles(this.modelId, params);
        this.modelFiles = res.data.items;
        this.pager.total = res.data.total;
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
    handleChangePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = page;
      this.setFileListParamsToUrl();
    },
    handleChangeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = 1;
      this.pager.size = size;
      this.setFileListParamsToUrl();
    },
    onUploadFileDrop(files) {
      if (files.length > 1) {
        this.$notify({
          title: '提示',
          message: '只能上传一个文件',
          type: 'warning',
        });
        return false;
      }
      this.onUploadFileBefore(files[0]);
    },
    onUploadFileBefore(file) {
      const isChecked = beforeFileUpload(
        file,
        this.acceptTypes,
        this.configuration.file_size_limit,
      );
      return isChecked;
    },
    async uploadFile(file) {
      this.$refs.upload.clearFiles();
      const isChecked = this.onUploadFileBefore(file.file);
      if (!isChecked) {
        return;
      }
      try {
        this.isUploadLoading = true;
        const formData = new FormData();
        if (this.moldId) {
          formData.append('mold_id', this.moldId);
        }
        formData.append('file', file.file);
        await uploadModelsFiles(this.modelId, formData);
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
        });
        this.$refs.upload.uploadFiles = [];
        if (this.pager.page !== 1) {
          this.pager.page = 1;
          this.setFileListParamsToUrl();
        } else {
          this.fetchFilesList();
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isUploadLoading = false;
      }
    },
    handleDeleteFile(row) {
      this.$confirm('确认删除当前文件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await deleteModelsFiles(this.modelId, row.id);
            this.$notify({
              title: '成功',
              message: '删除成功!',
              type: 'success',
            });
            if (this.modelFiles.length === 1 && this.pager.page !== 1) {
              this.pager.page -= 1;
              this.setFileListParamsToUrl();
            } else {
              this.fetchFilesList();
            }
          } catch (error) {
            this.$notify({
              title: '错误',
              message: error.message,
              type: 'error',
            });
          }
        })
        .catch(() => {});
    },
    handleViewResults(row) {
      const taskStatus = this.getTaskStatus(row);
      if (taskStatus.value !== 'success') {
        this.$notify({
          title: '提示',
          message: `文件处理${
            taskStatus.value === 'doing' ? '中' : '失败'
          }，无法查看结果`,
          type: 'warning',
        });
        return;
      }
      if (row.molds.length > 0) {
        this.previewFileByInspect(row, 'push', true);
      } else {
        this.resultJson = row.interface_answer;
        this.$alert(
          `<pre>${JSON.stringify(this.resultJson, null, 2)}</pre>`,
          'json结果',
          {
            customClass: 'label-data-box',
            dangerouslyUseHTMLString: true,
          },
        );
      }
    },
    goback() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="scss">
.model-use-page {
  padding: 0 20px;
  height: calc(100% - 61px);
  background: #fff;
  display: flex;
  flex-direction: column;
  .model-use-header {
    display: flex;
    align-items: center;
    margin: 25px 0;
    span {
      margin: 0 10px;
      color: rgba(97, 98, 102, 1);
      font-size: 16px;
    }
    .model-name {
      display: flex;
      align-items: center;
      flex: 1;
      margin-left: 20px;
    }
    .model-name-box {
      width: 80%;
      padding: 0 13px;
      height: 36px;
      line-height: 36px;
      border-radius: 3px;
      background-color: #fff;
      color: rgb(124, 125, 126);
      font-size: 14px;
      text-align: left;
      border: 1px solid rgba(220, 220, 220, 1);
      box-sizing: border-box;
    }
    .model-scene-select {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 1;
      .el-select {
        width: 80%;
      }
    }
  }
  .model-use-file-upload {
    margin: 0 0 20px 0;
    ::v-deep .el-upload {
      width: 100%;
      .el-upload-dragger {
        width: 100%;
        border-style: solid;
        background-color: #f5f5f7;
        display: flex;
        flex-direction: column;
        align-items: center;
        .pd-icon-update {
          font-size: 67px;
          color: #c0c4cc !important;
          margin: 40px 0 16px;
          line-height: 50px;
        }
        .el-upload__text {
          font-size: 16px;
        }
      }
    }
  }
  .el-table {
    ::v-deep .operations {
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    ::v-deep .cell {
      .failed {
        color: #ea0e0e;
      }
      .success {
        color: #4fb661;
      }
    }
  }
}
</style>
<style lang="scss">
.label-data-box {
  width: 50vw !important;
  .el-message-box__message {
    height: 70vh;
    overflow-y: auto;
  }
}
</style>
