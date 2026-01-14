<template>
  <div class="report-upload">
    <el-button
      type="primary"
      size="medium"
      class="button-hkex"
      @click="openDialog">
      <i class="el-icon-upload el-icon--left"></i>
      Upload
    </el-button>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeDialog"
      append-to-body
      class="report-upload-dialog">
      <el-upload
        action=""
        :auto-upload="false"
        :limit="1"
        :on-change="addUploadFile"
        :on-remove="removeUploadFile"
        class="upload-btn"
        ref="uploadFile">
        <el-button size="small" class="upload-btn">Choose File</el-button>
      </el-upload>

      <el-form
        :model="uploadForm"
        :rules="uploadFormRules"
        label-position="left"
        label-width="360px"
        class="upload-form"
        ref="uploadFileForm">
        <el-form-item
          :label="
            formatUploadFormItemLabel(
              'stock_code',
              'Please enter the stock code to be uploaded',
            )
          "
          prop="stock_code">
          <el-input
            v-model="uploadForm.stock_code"
            size="small"
            @blur="completeStockCode"></el-input>
        </el-form-item>

        <el-form-item
          :label="
            formatUploadFormItemLabel(
              'financial_year',
              'Please select the corresponding financial year',
            )
          "
          prop="financial_year">
          <el-select v-model="uploadForm.financial_year" size="small">
            <el-option
              v-for="(item, index) in financialYearOptions"
              :key="index"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="hasReportType"
          :label="
            formatUploadFormItemLabel(
              'report_type',
              'Please select the corresponding report type',
            )
          "
          prop="report_type">
          <el-select v-model="uploadForm.report_type" size="small">
            <el-option
              v-for="(item, index) in reportTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="hasDocType"
          :label="
            formatUploadFormItemLabel(
              'doc_type',
              'Please select the corresponding report type',
            )
          "
          prop="doc_type">
          <el-select v-model="uploadForm.doc_type" size="small">
            <el-option
              v-for="(item, index) in docTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="
            formatUploadFormItemLabel(
              'published_time',
              'Please select the corresponding publication date',
            )
          "
          prop="published_time">
          <el-date-picker
            v-model="uploadForm.published_time"
            type="datetime"
            size="small"
            format="dd/MM/yyyy HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button size="medium" @click="closeDialog"> Cancel </el-button>

        <el-button
          type="primary"
          size="medium"
          @click="submit"
          :loading="isUploading"
          :disabled="isUploading"
          class="submit-btn">
          <i class="el-icon-upload el-icon--left"></i>
          Upload
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ReportTypeMixin from '../mixins/ReportType.mixin';
import { preventWindowClose } from '../common/utils';

export default {
  name: 'report-upload',
  mixins: [ReportTypeMixin],
  data() {
    return {
      dialogVisible: false,
      uploadForm: {
        stock_code: '',
        financial_year: '',
        published_time: '',
        report_type: '',
        doc_type: '',
        file: null,
      },
      reportTypeOptions: [
        { label: 'Standalone', value: 'standalone' },
        { label: 'In annual report', value: 'in_ar' },
      ],
      docTypeOptions: [
        { label: 'Q1', value: 'q1' },
        { label: 'Interim', value: 'interim' },
        { label: 'Q3', value: 'q3' },
        { label: 'Final', value: 'final' },
      ],
      isUploading: false,
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType']),
    dialogTitle() {
      if (this.isArReport) {
        return 'Annual Report Upload';
      }

      if (this.isEsgReport) {
        return 'ESG Report Upload';
      }

      if (this.isQrReport) {
        return 'Result Announcement Upload';
      }

      return 'Report Upload';
    },
    hasReportType() {
      return this.isEsgReport;
    },
    hasDocType() {
      return this.isQrReport;
    },
    uploadFormRules() {
      const rules = {
        stock_code: [
          { required: true, message: 'Stock code required', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^\d{1,5}$/.test(value)) {
                callback();
              } else {
                callback(new Error('Limit of five digits'));
              }
            },
            trigger: 'blur',
          },
        ],
        financial_year: [
          {
            required: true,
            message: 'Financial year required',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (/^\d{4}$/.test(value)) {
                callback();
              } else {
                callback(new Error('Invalid financial year'));
              }
            },
            trigger: 'blur',
          },
        ],
        published_time: [
          {
            required: true,
            message: 'Publish time required',
            trigger: 'blur',
          },
        ],
      };

      if (this.hasReportType) {
        rules.report_type = [
          {
            required: true,
            message: 'Report type required',
            trigger: 'blur',
          },
        ];
      }

      if (this.hasDocType) {
        rules.doc_type = [
          {
            required: true,
            message: 'Report type required',
            trigger: 'blur',
          },
        ];
      }

      return rules;
    },
    uploadFormItemOrder() {
      if (this.isEsgReport) {
        return {
          stock_code: 1,
          financial_year: 2,
          report_type: 3,
          published_time: 4,
        };
      }

      if (this.isQrReport) {
        return {
          stock_code: 1,
          financial_year: 2,
          doc_type: 3,
          published_time: 4,
        };
      }

      return {
        stock_code: 1,
        financial_year: 2,
        published_time: 3,
      };
    },
    financialYearOptions() {
      const count = 5;
      const currentYear = new Date().getFullYear();

      return new Array(count).fill().map((i, index) => currentYear - index);
    },
  },
  methods: {
    async openDialog() {
      this.dialogVisible = true;
      await this.$nextTick();
      this.resetUploadForm();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    addUploadFile(file) {
      this.uploadForm.file = file.raw;
    },
    removeUploadFile() {
      this.uploadForm.file = null;
    },
    formatUploadFormItemLabel(key, content) {
      if (this.uploadFormItemOrder[key] !== undefined) {
        return `${this.uploadFormItemOrder[key]}. ${content}`;
      }

      return content;
    },
    completeStockCode() {
      if (/^\d{1,5}$/.test(this.uploadForm.stock_code)) {
        this.uploadForm.stock_code = this.uploadForm.stock_code.padStart(
          5,
          '0',
        );
      }
    },
    async submit() {
      this.$refs['uploadFileForm'].validate(async (valid) => {
        if (!valid) {
          return;
        }

        if (!this.uploadForm.file) {
          this.$notify.warning('Upload file required');
          return;
        }

        try {
          this.isUploading = true;
          window.addEventListener('beforeunload', preventWindowClose);

          const data = new FormData();
          data.append('file', this.uploadForm.file);
          data.append('stock_code', this.uploadForm.stock_code);
          data.append('financial_year', this.uploadForm.financial_year);
          data.append(
            'published_time',
            Math.trunc(this.uploadForm.published_time.getTime() / 1000),
          );

          if (this.hasReportType) {
            data.append('report_type', this.uploadForm.report_type);
          }

          if (this.hasDocType) {
            data.append('dt', this.uploadForm.doc_type);
          } else {
            data.append('dt', this.auditType);
          }

          const res = await this.$store.dispatch(
            'hkexModule/uploadAnnualReport',
            data,
          );
          if (res.need_overwrite) {
            throw new Error(
              'There is already a file with the same code and year in the system',
            );
          }

          this.closeDialog();
          this.$emit('uploaded');
          this.$notify({
            title: 'Success',
            message: 'Upload report successfully.',
            type: 'success',
          });
        } catch (error) {
          this.$notify({
            title: 'Upload failed',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.isUploading = false;
          window.removeEventListener('beforeunload', preventWindowClose);
        }
      });
    },
    resetUploadForm() {
      this.$refs['uploadFileForm'].resetFields();
      this.$refs['uploadFile'].clearFiles();
      this.uploadForm.file = null;
    },
  },
};
</script>
<style lang="scss">
@import '../common/color.scss';

.report-upload-dialog {
  .el-dialog__close {
    padding: 2px;
    background-color: $--color-primary;
    color: $--color-white;

    &:hover {
      color: $--color-white;
    }
  }

  .el-dialog__body {
    padding: 20px 30px;
  }

  button {
    border-radius: 0;
  }

  .upload-btn {
    display: flex;
    flex-flow: row;
    align-items: center;

    ul {
      margin-left: 20px;
      flex: 1;
      overflow: hidden;
    }

    li {
      margin: 0;
    }

    .el-upload-list__item-name {
      color: $--color-blue;
    }
    .el-icon-document {
      color: $--color-blue;
    }
  }

  .upload-form {
    margin-top: 20px;

    .el-input,
    .el-select {
      width: 200px;

      &.is-focus {
        .el-input__inner {
          border-color: $--color-blue;
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    flex-flow: row;
    justify-content: center;

    .submit-btn {
      background-color: $--color-blue;
    }
  }
}

.message-box-confirm-upload {
  .el-message-box__btns {
    > button {
      &:first-child {
        color: $--color-white;
        background-color: $--color-blue;
        border-color: $--color-blue;
      }
      &:last-child {
        color: $--color-grey;
        background-color: $--color-white;
        border-color: $--color-white;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
