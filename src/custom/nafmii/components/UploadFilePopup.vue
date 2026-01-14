<template>
  <div class="upload-file-popup">
    <el-dialog
      visible
      :title="uploadTitle"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form
        label-width="100px"
        class="upload-file-form"
        ref="uploadFileForm"
        :model="uploadFileForm"
        :rules="uploadFileFormRules">
        <el-form-item label="任务类型" prop="task_types">
          <el-checkbox-group
            v-model="uploadFileForm.task_types"
            @change="changeTaskType">
            <el-checkbox
              v-for="(option, index) in taskTypeOptions"
              :key="index"
              :label="option.value">
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="文件类型" prop="mold_id">
          <el-select
            clearable
            filterable
            v-model="uploadFileForm.mold_id"
            placeholder="请选择文件类型"
            no-match-text="未找到匹配的文件类型">
            <el-option
              v-for="(label, index) in fileTypesOptions"
              :key="index"
              :label="label.label"
              :value="label.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="files">
          <upload-file
            :multiple="true"
            :accept-types="acceptTypes"
            :file-list="uploadFileForm.files"
            :supported-suffixes="supportedSuffixes"
            :file-size-limit="configuration.file_size_limit"
            @change-upload-files="onUploadFileChange"
            @remove-upload-files="onUploadFileRemove" />
        </el-form-item>
        <el-form-item label="关键字" prop="keywords" v-if="isShowKeyWords">
          <div class="keywords">
            <el-tag
              v-for="(keyword, index) in uploadFileForm.keywords"
              :key="index"
              closable
              class="keywords-tag"
              @close="handleCloseKeywordTag(keyword)">
              <span class="keyword">{{ keyword }}</span>
            </el-tag>
            <el-input
              v-if="keywordInputVisible"
              v-model="keywordInputValue"
              ref="saveKeywordInput"
              class="keywords-input"
              @keyup.enter.native="handleKeywordInputConfirm"
              @blur="handleKeywordInputConfirm">
            </el-input>
            <el-button v-else class="keywords-button" @click="showKeywordInput">
              +
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="uploadFile">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import UploadFile from './UploadFile';
import { TASK_TYPES_OPTIONS } from '../common/constant';

export default {
  name: 'upload-file-popup',
  components: { UploadFile },
  props: {
    treeId: {
      type: [Number, String],
      default: '',
    },
    uploadTitle: {
      type: String,
      required: true,
    },
    supportedSuffixes: {
      type: String,
      required: true,
    },
    acceptTypes: {
      type: String,
      required: true,
    },
    projectMolds: {
      type: Array,
      required: false,
    },
    task: {
      type: Boolean,
      default: false,
    },
    taskFileTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      taskTypeOptions: TASK_TYPES_OPTIONS,
      uploadFileForm: {
        task_types: ['文本识别'],
        mold_id: '',
        files: [],
        keywords: [],
      },
      keywordInputVisible: false,
      keywordInputValue: '',
      isShowKeyWords: false,
    };
  },
  created() {
    this.getProjectMold();
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('schemaModule', ['schemas']),
    fileTypes() {
      const types = this.schemas.items.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      return types;
    },
    fileTypesOptions() {
      if (this.task) {
        return this.taskFileTypes;
      }
      return this.fileTypes;
    },

    uploadFileFormRules() {
      let rules = {
        task_types: [
          { required: true, message: '请选择任务类型', trigger: 'change' },
        ],
        files: [
          {
            required: true,
            message: '请选择文件',
            trigger: 'change',
          },
        ],
      };
      if (this.uploadFileForm.task_types.includes('文本识别')) {
        rules.mold_id = [
          { required: true, message: '请选择文件类型', trigger: 'change' },
        ];
      }
      return rules;
    },
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    changeTaskType(value) {
      this.isShowKeyWords = value.includes('关键字识别');
      this.$refs.uploadFileForm.clearValidate('mold_id');
      this.$refs.uploadFileForm.clearValidate('files');
    },
    getProjectMold() {
      if (!_.isEmpty(this.projectMolds)) {
        this.uploadFileForm.mold_id = this.projectMolds[0];
      }
    },
    getUploadFileParams(file) {
      const formData = new FormData();
      formData.append('file', file.raw);
      const cloneUploadFileForm = _.clone(this.uploadFileForm);
      delete cloneUploadFileForm.files;
      if (!this.isShowKeyWords) {
        delete cloneUploadFileForm.keywords;
      }
      const fileParams = _.omitBy(
        cloneUploadFileForm,
        (value) => value === '' || (_.isArray(value) && value.length === 0),
      );
      if (this.task) {
        fileParams.file_type = fileParams.mold_id;
        delete fileParams.mold_id;
        formData.append('form', JSON.stringify(fileParams));
      } else {
        Object.entries(fileParams).forEach(([key, value]) => {
          if (key === 'keywords') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
      }
      return { treeId: this.treeId, data: formData };
    },
    async uploadFile() {
      const isValid = await this.$refs['uploadFileForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        this.handleClose();
        const { files } = this.uploadFileForm;
        this.$emit('upload-file', files, {}, this.getUploadFileParams);
      }
    },
    onUploadFileChange(files) {
      this.uploadFileForm.files = files;
      this.$refs.uploadFileForm.clearValidate('files');
    },
    onUploadFileRemove(files) {
      this.uploadFileForm.files = files;
    },
    handleCloseKeywordTag(keyword) {
      this.uploadFileForm.keywords = this.uploadFileForm.keywords.filter(
        (item) => item !== keyword,
      );
    },
    handleKeywordInputConfirm() {
      const keyword = this.keywordInputValue.trim();
      if (keyword) {
        if (!this.uploadFileForm.keywords.includes(this.keywordInputValue)) {
          this.uploadFileForm.keywords.push(this.keywordInputValue);
        } else {
          this.$notify({
            title: '提示',
            message: '关键字不能重复',
            type: 'warning',
          });
        }
      }
      this.keywordInputVisible = false;
      this.keywordInputValue = '';
    },
    showKeywordInput() {
      this.keywordInputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveKeywordInput.focus();
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables.scss';

.upload-file-popup {
  .upload-file-form {
    ::v-deep .el-form-item__content {
      .el-select {
        width: 100%;
      }
      .el-checkbox-group {
        height: 40px;
      }
    }
    .keywords {
      padding: 3px 15px;
      border-radius: 4px;
      border: 1px solid #dcdee0;
      min-height: 30px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 10px;
      .keywords-tag {
        max-width: 100%;
        display: flex;
        align-items: center;
        .keyword {
          flex: 1;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        ::v-deep .el-icon-close {
          top: 0;
        }
      }
      .keywords-input {
        width: 90px;
        height: 32px;
        display: flex;
        ::v-deep .el-input__inner {
          height: 100%;
        }
      }
      .keywords-button {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }
}
</style>
