<template>
  <div class="sensitive-words-import-popup">
    <el-dialog
      visible
      title="敏感词导入"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-steps direction="vertical">
        <el-step>
          <div slot="title" class="download">
            <span>敏感词模板下载</span>
            <el-button
              class="download-btn"
              type="text"
              @click="downloadSensitiveWordsTemplate">
              <i class="el-icon-download"></i>
            </el-button>
          </div>
        </el-step>
        <el-step>
          <div slot="title" class="system">
            <span>归属系统</span>
            <el-select
              size="small"
              class="system-select"
              v-model="selectedSystem"
              placeholder="请选择归属系统"
              @change="handleSelectChange"
              :clearable="isShowSystemClearable">
              <el-option
                v-for="(system, index) in systems"
                :key="index"
                :label="system.label"
                :value="system.value">
              </el-option>
            </el-select>
          </div>
        </el-step>
        <el-step>
          <div slot="title" class="upload">
            <span>上传文件</span>
            <upload-file
              :limit="1"
              :accept-types="acceptTypes"
              :file-size-limit="fileSizeLimit"
              :file-list="sensitiveWordsFiles"
              @change-upload-files="onUploadFileChange"
              @remove-upload-files="onUploadFileRemove"
              class="upload-box" />
            <div v-if="isShowUploadErrorMessage" class="upload-error">
              请选择文件
            </div>
          </div>
        </el-step>
      </el-steps>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="uploadingFileInfo.showProgress"
          @click="handleSumbit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import UploadFile from './UploadFile';
import { downloadFileByBlob } from '../../../utils';
import { nafmii as nafmiiApi } from '../../../store/api';
import UploadFileMixin from '../../../components/mixins/UploadFileMixin';
import { UPLOAD_SENSITIVE_WORDS_FILE_MAX_SIZE } from '../common/constant';

export default {
  name: 'sensitive-words-import-popup',
  components: { UploadFile },
  mixins: [UploadFileMixin],
  props: {
    systems: {
      type: Array,
      required: true,
    },
    generalSystemValue: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      acceptTypes: '.xlsx',
      selectedSystem: '',
      sensitiveWordsFiles: [],
      isShowUploadErrorMessage: false,
      fileSizeLimit: UPLOAD_SENSITIVE_WORDS_FILE_MAX_SIZE,
    };
  },
  created() {
    this.initSelectedSystem();
  },
  computed: {
    ...mapGetters(['configuration']),

    isShowSystemClearable() {
      return this.selectedSystem !== this.generalSystemValue;
    },
  },
  methods: {
    initSelectedSystem() {
      this.selectedSystem = this.generalSystemValue;
    },
    onUploadFileChange(files) {
      this.sensitiveWordsFiles = files;
      this.isShowUploadErrorMessage = false;
    },
    onUploadFileRemove(files) {
      this.sensitiveWordsFiles = files;
    },
    getUploadFileParams(files) {
      const formData = new FormData();
      for (let index = 0; index < files.length; index++) {
        formData.append('file', files[index].raw);
      }
      formData.append('sys_id', this.selectedSystem);
      return { data: formData };
    },
    async handleSumbit() {
      if (_.isEmpty(this.sensitiveWordsFiles)) {
        this.isShowUploadErrorMessage = true;
        return;
      }
      try {
        this.abortController = new AbortController();
        await this.handleUploadDefaultFile({
          params: this.getUploadFileParams(this.sensitiveWordsFiles),
          uploadFileApi: nafmiiApi.uploadSensitiveWords,
          successMessage: '导入成功',
          signal: this.abortController.signal,
        });
        this.$emit('file-upload-success');
        this.handleClose();
      } catch (error) {
        if (error.status === 'canceled') {
          this.$notify({
            title: '提示',
            message: '导入失败，请勿关闭弹窗',
            type: 'warning',
          });
        } else {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    handleClose() {
      this.abortController?.abort();
      this.$emit('close');
    },
    handleSelectChange(value) {
      if (!value) {
        this.initSelectedSystem();
      }
    },
    async downloadSensitiveWordsTemplate() {
      try {
        const res = await nafmiiApi.downloadSensitiveWordsTemplate();
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables.scss';

.sensitive-words-import-popup {
  ::v-deep .el-steps {
    .el-step__head {
      width: 30px;
      &.is-wait {
        color: #fff;
        border-color: $--color-primary;
      }
      .el-step__line {
        left: 7px;
        top: 22px;
        width: 1px;
      }
      .el-step__icon {
        font-size: 12px;
        width: 16px;
        height: 16px;
        background-color: $--color-primary;
        .el-step__icon-inner {
          font-weight: 400;
        }
      }
    }
    .el-step__main {
      min-height: 45px;
    }
    .el-step__title {
      font-size: 14px;
      &.is-wait {
        color: $--color-text-regular;
      }
    }
  }
  .download {
    .download-btn {
      padding: 0px;
      margin-left: 5px;
    }
  }
  .system {
    position: relative;
    top: -4px;
    .system-select {
      margin-left: 10px;
    }
  }
  .upload {
    .upload-box {
      margin-top: 8px;
    }
    .upload-error {
      font-size: 12px;
      color: $--color-danger;
    }
  }
}
</style>
