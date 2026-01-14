<template>
  <div class="filed-code-test-popup">
    <el-dialog
      visible
      :before-close="handleClose"
      :close-on-click-modal="false"
      title="代码测试">
      <el-form
        ref="testForm"
        :model="testForm"
        :rules="testFormRules"
        label-width="100px">
        <el-form-item prop="" label="规则文件：" class="test-file">
          <el-input type="text" :value="filedCodeFileName" disabled />
          <el-button @click="downloadFile">
            <img src="@/images/file-download.svg" alt="logo" />
          </el-button>
        </el-form-item>
        <el-form-item prop="" label="示例文件：" class="sample-file">
          <el-radio-group
            v-model="sampleFileRadio"
            @change="changeSampleFileRadio">
            <el-radio label="senceFile">系统已关联场景的文件</el-radio>
            <el-radio label="newFile">上传新文件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="fid"
          label=""
          class="select-file"
          v-if="isShowSenceFiles">
          <el-select
            v-model="testForm.fid"
            v-loadmore="getMoreSenceFiles"
            filterable
            remote
            :remote-method="searchSenceFile"
            @change="changeSenceFile"
            @visible-change="visibleChangeSenceFile"
            popper-class="filed-code-test-select-dropdown"
            placeholder="请选择系统已关联场景的文件">
            <el-option
              v-for="(file, index) in files.items"
              :key="index"
              :title="file.name"
              :label="file.name"
              :value="file.id" />
            <el-option v-if="files.isLoading" label="" value="">
              <i class="el-icon-loading"></i>
              <span style="margin-left: 10px; color: #999">loading...</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          prop="uploadFid"
          ref="uploadFile"
          class="upload-file"
          v-else>
          <div class="input-box">
            <el-input
              disabled
              type="text"
              :value="uploadFileName"
              placeholder="请上传分类的文件">
            </el-input>
            <el-upload
              action=""
              :accept="acceptTypes"
              :show-file-list="false"
              :disabled="isUploadLoading"
              :http-request="uploadVerifyFile"
              class="upload">
              <el-button type="primary" :loading="isUploadLoading">
                <i class="el-icon-upload2" v-if="!isUploadLoading"></i>
              </el-button>
            </el-upload>
          </div>
          <span class="message">{{ fileParseMessage }}</span>
        </el-form-item>
        <div class="expected-result" v-if="!isShowSenceFiles">
          <label class="label">期望结果：</label>
          <div class="content">
            <el-form-item prop="mid">
              <el-select
                v-model="testForm.mid"
                v-loadmore="getMoreScenes"
                filterable
                remote
                :remote-method="searchScenes"
                @change="changeScenes"
                @visible-change="visibleChangeScenes"
                popper-class="filed-code-test-select-dropdown"
                placeholder="请选择场景">
                <el-option
                  v-for="(scene, index) in scenes.items"
                  :key="index"
                  :label="scene.name"
                  :value="scene.id" />
                <el-option v-if="scenes.isLoading" label="" value="">
                  <i class="el-icon-loading"></i>
                  <span style="margin-left: 10px; color: #999">loading...</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pid">
              <el-select
                v-model="testForm.pid"
                v-loadmore="getMoreProjects"
                filterable
                remote
                :remote-method="searchProjects"
                @change="changeProjects"
                @visible-change="visibleChangeProjects"
                popper-class="filed-code-test-select-dropdown"
                placeholder="请选择项目">
                <el-option
                  v-for="(project, index) in projects.items"
                  :key="index"
                  :label="project.name"
                  :value="project.id" />
                <el-option v-if="projects.isLoading" label="" value="">
                  <i class="el-icon-loading"></i>
                  <span style="margin-left: 10px; color: #999">loading...</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="test-result">
        <label class="label">测试结果：</label>
        <el-input disabled class="content" :value="testResult" />
      </div>
      <div class="test-error-result" v-if="testErrorResult">
        <label class="label">不通过原因：</label>
        <span class="content">{{ testErrorResult }}</span>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="handleTest"
          :loading="isVerifyFileLoading"
          :disabled="!isCanVerfiyFile">
          测试
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { pdfParseStatus } from '@/store/constants';
import { cmfchina as cmfchinaApi } from '../../../store/api';
import { beforeFileUpload } from '../common/utils';

export default {
  name: 'filed-code-test-popup',
  props: {
    filedCodeFileName: {
      type: String,
      required: true,
    },
    acceptTypes: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      testForm: {
        fid: '',
        mid: '',
        pid: '',
        uploadFid: '',
      },
      files: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
        isLoadingMore: false,
      },
      scenes: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
        isLoadingMore: false,
      },
      projects: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
        isLoadingMore: false,
      },
      sampleFileRadio: 'senceFile',
      isShowSenceFiles: true,
      uploadFileName: '',
      uploadFileParseStatus: '',
      fileListTimer: null,
      senceFileTestResult: '',
      newFileTestResult: '',
      senceFileTestErrorResult: '',
      newFileTestErrorResult: '',
      isVerifySenceFileLoading: false,
      isVerifyNewFileLoading: false,
      isUploadVerifyFileLoading: false,
      isFetchVerifyFileLoading: false,
    };
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectDom = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap',
        );
        selectDom.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    clearInterval(this.fileListTimer);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  computed: {
    ...mapGetters(['configuration']),

    testFormRules() {
      if (this.isShowSenceFiles) {
        return {
          fid: [
            {
              required: true,
              message: '请选择系统已关联场景的文件',
              trigger: 'change',
            },
          ],
        };
      } else {
        return {
          uploadFid: [{ required: true, message: '请上传分类的文件' }],
          mid: [{ required: true, message: '请选择场景', trigger: 'change' }],
          pid: [{ required: true, message: '请选择项目', trigger: 'change' }],
        };
      }
    },
    isFileParseSuccessful() {
      const successfullyStatus = [pdfParseStatus.completed];
      return successfullyStatus.includes(this.uploadFileParseStatus);
    },
    isFileParseUnsuccessful() {
      const unsuccessfullyStatus = [
        pdfParseStatus.failed,
        pdfParseStatus.canceled,
        pdfParseStatus.exception,
        pdfParseStatus.ocr_expired,
      ];
      return unsuccessfullyStatus.includes(this.uploadFileParseStatus);
    },
    fileParseMessage() {
      if (!this.uploadFileParseStatus || this.isFileParseSuccessful) {
        return;
      } else if (this.isFileParseUnsuccessful) {
        return '注意：解析失败，请重新上传文件。';
      } else {
        return '注意：新上传的文件将对其进行解析，解析过程需较长的时间。';
      }
    },
    isUploadLoading() {
      return this.isUploadVerifyFileLoading || this.isFetchVerifyFileLoading;
    },
    isCanVerfiyFile() {
      if (this.isShowSenceFiles) {
        return true;
      }
      if (this.isFileParseUnsuccessful) {
        return false;
      }
      return !this.isUploadLoading;
    },
    isVerifyFileLoading() {
      return this.isShowSenceFiles
        ? this.isVerifySenceFileLoading
        : this.isVerifyNewFileLoading;
    },
    testResult() {
      return this.isShowSenceFiles
        ? this.senceFileTestResult
        : this.newFileTestResult;
    },
    testErrorResult() {
      return this.isShowSenceFiles
        ? this.senceFileTestErrorResult
        : this.newFileTestErrorResult;
    },
  },
  methods: {
    handleClose() {
      if (this.isUploadLoading) {
        this.$confirm(
          `测试文档解析中，关闭将中断解析，确定是否关闭？`,
          '提示',
          { type: 'warning' },
        )
          .then(() => this.$emit('close'))
          .catch(() => {});
      } else {
        this.$emit('close');
      }
    },
    async verifySenceFile() {
      try {
        this.isVerifySenceFileLoading = true;
        await cmfchinaApi.verifyFile(this.testForm.fid);
        this.senceFileTestResult = '测试通过';
      } catch (error) {
        this.senceFileTestResult = '测试未通过';
        this.senceFileTestErrorResult = error.message;
      } finally {
        this.isVerifySenceFileLoading = false;
      }
    },
    async verifyUploadFile() {
      try {
        this.isVerifyNewFileLoading = true;
        const params = {
          fid: this.testForm.uploadFid,
          mid: this.testForm.mid,
          pid: this.testForm.pid,
        };
        await cmfchinaApi.verifyUploadFile(params);
        this.newFileTestResult = '测试通过';
      } catch (error) {
        this.newFileTestResult = '测试未通过';
        this.newFileTestErrorResult = error.message;
      } finally {
        this.isVerifyNewFileLoading = false;
      }
    },
    async handleTest() {
      const isValid = await this.$refs.testForm.validate().catch(() => {});
      if (isValid) {
        try {
          if (this.isShowSenceFiles) {
            await this.verifySenceFile();
          } else {
            await this.verifyUploadFile();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async getSenceFiles(query) {
      try {
        const params = {
          page: this.files.pager.page,
          size: this.files.pager.size,
        };
        if (query) {
          params.name = query;
        }
        const res = await cmfchinaApi.fetchSenceFiles(params);
        this.files.items = [...this.files.items, ...res.data.items];
        this.files.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    searchSenceFile(query) {
      this.files.pager.page = 1;
      this.files.items = [];
      this.getSenceFiles(query);
    },
    visibleChangeSenceFile(value) {
      if (value) {
        this.searchSenceFile();
      }
    },
    async getMoreSenceFiles() {
      if (
        this.files.isLoadingMore ||
        this.files.pager.page * this.files.pager.size >= this.files.pager.total
      ) {
        return;
      }
      this.files.isLoadingMore = true;
      this.files.pager.page += 1;
      await this.getSenceFiles();
      this.files.isLoadingMore = false;
    },
    async getScenes(query) {
      try {
        let params = {
          page: this.scenes.pager.page,
          size: this.scenes.pager.size,
        };
        if (query) {
          params.name = query;
        }
        const res = await cmfchinaApi.searchScene(params);
        this.scenes.items = [...this.scenes.items, ...res.data.items];
        this.scenes.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    searchScenes(query) {
      this.scenes.pager.page = 1;
      this.scenes.items = [];
      this.getScenes(query);
    },
    visibleChangeScenes(value) {
      if (value) {
        this.searchScenes();
      }
    },
    async getMoreScenes() {
      if (
        this.scenes.isLoadingMore ||
        this.scenes.pager.page * this.scenes.pager.size >=
          this.scenes.pager.total
      ) {
        return;
      }
      this.scenes.isLoadingMore = true;
      this.scenes.pager.page += 1;
      await this.getScenes();
      this.scenes.isLoadingMore = false;
    },
    async getProjects(query) {
      try {
        let params = {
          page: this.projects.pager.page,
          size: this.projects.pager.size,
        };
        if (query) {
          params.name = query;
        }
        const res = await cmfchinaApi.fetchProjects(params);
        this.projects.items = [...this.projects.items, ...res.data.items];
        this.projects.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    searchProjects(query) {
      this.projects.pager.page = 1;
      this.projects.items = [];
      this.getProjects(query);
    },
    visibleChangeProjects(value) {
      if (value) {
        this.searchProjects();
      }
    },
    async getMoreProjects() {
      if (
        this.projects.isLoadingMore ||
        this.projects.pager.page * this.projects.pager.size >=
          this.projects.pager.total
      ) {
        return;
      }
      this.projects.isLoadingMore = true;
      this.projects.pager.page += 1;
      await this.getProjects();
      this.projects.isLoadingMore = false;
    },
    downloadFile() {
      this.$emit('download-filed-code-file');
    },
    changeSampleFileRadio(val) {
      this.$refs.testForm.clearValidate();
      if (val === 'senceFile') {
        this.isShowSenceFiles = true;
      } else {
        this.isShowSenceFiles = false;
      }
    },
    changeSenceFile() {
      this.senceFileTestResult = '';
      this.senceFileTestErrorResult = '';
    },
    changeScenes() {
      this.clearNewFileTestResult();
    },
    changeProjects() {
      this.clearNewFileTestResult();
    },
    clearNewFileTestResult() {
      this.newFileTestResult = '';
      this.newFileTestErrorResult = '';
    },
    startVerifyFileListTimer() {
      if (this.fileListTimer) {
        clearInterval(this.fileListTimer);
      }
      this.fileListTimer = setInterval(() => {
        this.fetchVerifyFile();
      }, 30e3);
    },
    stopVerifyFileListTimer() {
      if (this.fileListTimer) {
        clearInterval(this.fileListTimer);
        this.fileListTimer = null;
      }
    },
    async fetchVerifyFile() {
      try {
        this.isFetchVerifyFileLoading = true;
        const res = await cmfchinaApi.fetchVerifyFile(this.testForm.uploadFid);
        this.uploadFileName = res.data.name;
        this.uploadFileParseStatus = res.data.pdf_parse_status;
        this.startVerifyFileListTimer();
        if (this.isFileParseSuccessful || this.isFileParseUnsuccessful) {
          this.isFetchVerifyFileLoading = false;
          this.stopVerifyFileListTimer();
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async uploadVerifyFile(file) {
      this.clearNewFileTestResult();
      const isChecked = beforeFileUpload(
        file.file,
        this.acceptTypes,
        this.configuration.file_size_limit,
      );
      if (!isChecked) {
        return;
      }
      try {
        this.isUploadVerifyFileLoading = true;
        this.$refs.uploadFile.clearValidate();
        const formData = new FormData();
        formData.append('file', file.file);
        const res = await cmfchinaApi.uploadVerifyFile(formData);
        this.testForm.uploadFid = res.data.fid;
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
        });
        this.fetchVerifyFile();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isUploadVerifyFileLoading = false;
      }
    },
    handleBeforeUnload(e) {
      if (this.isUploadLoading) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filed-code-test-popup {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px 60px 20px 40px;
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
  ::v-deep .el-form {
    .el-form-item__label {
      padding-right: 10px;
    }
    .test-file {
      .el-form-item__content {
        display: flex;
        align-items: center;
        .el-button {
          padding: 0px;
          border: unset;
          margin-left: 10px;
          &:hover,
          &:focus {
            color: unset;
            background-color: unset;
          }
        }
      }
    }
    .select-file {
      .el-select {
        width: 100%;
      }
    }
    .upload-file {
      .input-box {
        display: flex;
        align-items: center;
        .el-button {
          margin-left: 10px;
        }
      }
      .message {
        position: absolute;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        color: #f56c6c;
      }
    }
    .expected-result {
      display: flex;
      align-items: center;
      margin-bottom: 22px;
      .label {
        width: 100px;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
      }
      .content {
        flex: 1;
        display: flex;
        column-gap: 20px;
      }
      .el-form-item,
      .el-form-item__content {
        &::before,
        &::after {
          content: unset;
        }
      }
      .el-form-item {
        flex: 1;
        margin-bottom: 0;
      }
      .el-form-item__content {
        display: flex;
        margin-left: 0 !important;
        .el-select {
          flex: 1;
        }
      }
    }
    .el-form-item .el-form-item__label,
    .expected-result .label {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
  ::v-deep .el-select {
    .el-select__caret:first-child::before {
      content: '\e6e1';
    }
    .is-focus {
      .el-select__caret:first-child {
        transform: rotateZ(0deg);
      }
    }
  }
  .test-result,
  .test-error-result {
    display: flex;
    .label {
      width: 100px;
      text-align: right;
      padding-right: 10px;
      box-sizing: border-box;
    }
    .content {
      flex: 1;
    }
  }
  .test-result {
    align-items: center;
  }
  .test-error-result {
    color: #f56c6c;
    margin-top: 22px;
  }
}
</style>

<style lang="scss">
.filed-code-test-select-dropdown {
  width: 100px;
  overflow: hidden;
}
</style>
