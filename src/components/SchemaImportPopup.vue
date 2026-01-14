<template>
  <el-dialog
    :title="dialogTitle"
    visible
    width="650px"
    :close-on-click-modal="false"
    class="import-schema-dialog"
    :before-close="close">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="上传" prop="file">
        <el-upload
          ref="upload"
          v-model="form.file"
          drag
          :accept="accept"
          :auto-upload="false"
          action=""
          :file-list="fileList"
          :on-change="onUploadFileChange"
          :on-remove="onUploadFileRemove">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将 json 文件拖到此处，或<em>点击上传</em>
          </div>
          <div v-if="showCoverTips" class="el-upload__tip" slot="tip">
            说明:
            上传成功后，系统将直接清除之前场景的结构且无法恢复。同时也会自动重新运行该场景对应的未复核文档的预测流程。请谨慎操作！
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="showGroupsFormItem" label="业务组" prop="group_ids">
        <el-select
          v-model="form.group_ids"
          multiple
          filterable
          clearable
          placeholder="请选择业务组">
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  fetchUserBusinessGroups,
  importSchema,
  coverSchema,
} from '../store/api/cmfchina.api';
export default {
  name: 'schema-import-popup',
  props: {
    action: {
      type: String,
      default: 'import',
    },
    schemaId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      accept: '.json',
      fileList: [],
      form: {
        file: null,
        group_ids: [],
      },
      formRules: {
        file: [
          { required: true, validator: this.fileValidator, trigger: 'change' },
        ],
        group_ids: [
          { required: true, message: '请选择业务组', trigger: 'change' },
        ],
      },
      groups: [],
    };
  },
  computed: {
    dialogTitle() {
      return this.action === 'import' ? '导入场景' : '覆盖场景';
    },
    showGroupsFormItem() {
      return this.action === 'import';
    },
    showCoverTips() {
      return this.action === 'cover';
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getBusinessGroups();
    },
    async getBusinessGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    close() {
      this.$emit('close');
    },
    fileValidator(rule, value, callback) {
      if (!value) {
        return callback(new Error('请上传 json 文件'));
      }
      const suffix = value.name
        .substring(value.name.lastIndexOf('.'))
        .toLowerCase();
      if (!this.accept.split(',').includes(suffix)) {
        return callback(new Error('文件类型不支持，请上传 json 文件'));
      }
      callback();
    },
    onUploadFileChange(file, fileList) {
      this.form.file = file.raw;
      this.$refs.form.validateField('file', (err) => {
        if (err) {
          this.$refs.upload.clearFiles();
          this.form.file = null;
          return;
        }
        if (fileList.length > 0) {
          this.fileList = [fileList.at(-1)];
        }
        this.$refs.form.clearValidate('file');
      });
    },
    onUploadFileRemove() {
      this.form.file = null;
    },
    async submit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', this.form.file);
        if (this.action === 'import') {
          this.form.group_ids.forEach((group) => {
            formData.append('group_ids', group);
          });
          await importSchema(formData);
        }
        if (this.action === 'cover') {
          await coverSchema(this.schemaId, formData);
        }
        this.$notify({
          title: '成功',
          message: this.action === 'import' ? '导入场景成功' : '覆盖场景成功',
          type: 'success',
        });
        this.close();
        this.$emit('import-success');
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

<style lang="scss" scoped>
.import-schema-dialog {
  .el-form {
    ::v-deep .el-upload,
    ::v-deep .el-upload-dragger,
    .el-select {
      width: 100%;
    }
    ::v-deep .el-upload-list__item {
      transition: none !important;
    }
    .el-upload__tip {
      margin-bottom: 10px;
      line-height: 22px;
      color: #ffae00;
    }
  }
}
</style>
