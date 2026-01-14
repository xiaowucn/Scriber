<template>
  <el-dialog
    title="上传文件"
    :visible="true"
    width="600px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="handleClose">
    <div class="upload-dialog-content">
      <el-form
        :model="form"
        :rules="formRules"
        ref="form"
        label-width="100px"
        size="small">
        <el-form-item label="处理方式" prop="process_methods">
          <el-checkbox-group
            v-model="form.process_methods"
            @change="handleProcessMethodChange">
            <el-checkbox label="extract">要素提取</el-checkbox>
            <el-checkbox label="intelligent">智能审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item prop="audit_methods">
          <span slot="label">
            <el-tooltip
              content="如要审核，至少选择一种审核方式"
              placement="left">
              <i
                class="el-icon-question"
                style="margin-right: 4px; color: #909399"></i>
            </el-tooltip>
            审核方式
          </span>
          <el-checkbox-group
            v-model="form.audit_methods"
            @change="handleAuditMethodChange">
            <el-checkbox
              label="rule"
              :disabled="isAuditMethodDisabled || isRuleAuditDisabled"
              >规则审核</el-checkbox
            >
            <el-checkbox label="judge" :disabled="isAuditMethodDisabled"
              >大模型审核</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="molds" label="Schema">
          <el-select
            v-model="form.molds"
            multiple
            filterable
            placeholder="请选择Schema"
            style="width: 100%"
            :disabled="isSchemaDisable">
            <el-option
              v-for="(label, index) in schemas.items"
              :key="index"
              :disabled="label.disabled"
              :label="getSelectOptionLabel(label)"
              :value="label.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="scenario_id">
          <span slot="label">
            <el-tooltip placement="left">
              <div slot="content">
                选择大模型审核后，必须选择<br />
                应用场景，大模型审核规则可<br />
                使用与应用场景有关的审核点<br />
                来审核合同
              </div>
              <i
                class="el-icon-question"
                style="margin-right: 4px; color: #909399"></i>
            </el-tooltip>
            应用场景
          </span>
          <el-select
            v-model="form.scenario_id"
            placeholder="请选择应用场景"
            style="width: 100%"
            filterable
            :disabled="isAuditMethodDisabled || isScenarioDisabled">
            <el-option
              v-for="item in scenarioOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传文件" prop="files">
          <el-upload
            drag
            action=""
            :multiple="true"
            :file-list="form.files"
            :accept="acceptTypes"
            :auto-upload="false"
            class="upload-file-popup"
            :on-change="onUploadFileWithTaskTypeChange"
            :on-remove="onUploadFileWithTaskTypeRemove"
            @drop.native="(e) => handleUploadFileDrop(e.dataTransfer.files)">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t(`message['将文件拖到此处']`) }}，{{ $t(`message['或']`) }}
              <em>{{ $t(`message['点击上传']`) }}</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              {{ $t(`message['说明']`) }}：{{ $t(`message['目前支持上传']`) }}
              {{
                supportedSuffixes
                  .split(',')
                  .map((item) => item.replace(/^./, ''))
                  .join('、')
              }}
              {{ $t(`message['格式的文档']`) }}
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleConfirm"
        :loading="uploading">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { checkUploadFile, isUploadZipFile } from '@/utils';
import { fileMaxSize } from '@/store/constants';
import fileFormMixin from '@/mixins/fileFormMixin';
import * as llmParamsUtils from '@/utils/llmParamsUtils';

export default {
  name: 'UploadDialog',
  mixins: [fileFormMixin],

  props: {
    acceptTypes: {
      type: String,
      required: true,
    },
    supportedSuffixes: {
      type: String,
      required: true,
    },
    treeId: {
      type: [Number, String],
      default: '',
    },
    defaultOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        process_methods: [],
        audit_methods: [],
        scenario_id: '',
        files: [],
        molds: [],
      },
      fileList: [],
      uploading: false,
      isDragOver: false,
    };
  },
  computed: {
    formRules() {
      return {
        ...this.baseFormRules,
        files: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '请选择要上传的文件',
            trigger: 'change',
          },
        ],
      };
    },
    isSchemaDisable() {
      return !this.form.process_methods.includes('extract');
    },
  },
  watch: {
    isSchemaDisable(newVal) {
      if (newVal) {
        // 当Schema被禁用时，清空Schema字段的值
        this.form.molds = [];
      }
    },
  },
  methods: {
    getUploadFileParams(file, params) {
      const formData = new FormData();
      formData.append('file', file.raw);
      for (const key in params) {
        if (Array.isArray(params[key])) {
          params[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, params[key]);
        }
      }
      return { treeId: this.treeId, data: formData };
    },
    onUploadFileWithTaskTypeChange(_file, fileList) {
      const files = fileList.filter((file) => this.beforeFileUpload(file));
      this.form.files = files;
      this.$refs.form.clearValidate('files');
    },
    onUploadFileWithTaskTypeRemove(_file, fileList) {
      this.form.files = fileList;
    },
    handleUploadFileDrop(files) {
      Array.from(files).forEach((file) => {
        this.beforeFileUpload(file);
      });
    },
    beforeFileUpload(file) {
      let fileSizeLimit;
      if (this.$platform.isCmfchinaEnv()) {
        if (!isUploadZipFile(file)) {
          fileSizeLimit = this.configuration.file_size_limit;
        }
      } else {
        fileSizeLimit = fileMaxSize;
      }
      const isChecked = checkUploadFile(
        file,
        this.acceptTypes,
        fileSizeLimit,
        true,
      );
      return isChecked;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.uploading = true;

          const params = this.getUploadParams();
          this.$emit('confirm', params);
        } else {
          return false;
        }
      });
    },

    getUploadParams() {
      const baseParams = this.getParams();
      return {
        ...baseParams,
        files: this.form.files,
      };
    },

    handleClose() {
      this.$emit('close');
      this.resetForm();
    },

    resetForm() {
      this.resetBaseForm();
      this.form.files = [];
      this.uploading = false;

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });
    },

    closeLoading() {
      this.uploading = false;
    },
  },
  created() {
    const { default_molds, default_task_type, default_scenario_id } =
      this.defaultOptions;
    const methodsResult = llmParamsUtils.getMethodsByTaskTypeCode(
      default_task_type,
      default_scenario_id,
    );
    this.form = {
      ...this.form,
      process_methods: methodsResult.process_methods,
      audit_methods: methodsResult.audit_methods,
      scenario_id: default_scenario_id,
      molds: default_molds,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-dialog-content {
  .el-form {
    margin-bottom: 20px;
  }

  .status-tips {
    background: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    padding: 12px;
    margin-top: 20px;

    .tip-item {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      .tip-label {
        color: #333;
      }

      .tip-content {
        color: #f56c6c;
      }
    }
  }
  .upload-file-popup {
    ::v-deep .el-upload-list {
      max-height: 130px;
      overflow-y: auto;
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>
