<template>
  <div class="knowledge-popup">
    <el-dialog
      visible
      :title="title"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form
        label-width="100px"
        class="knowledge-file-form"
        ref="knowledgeForm"
        :model="knowledgeForm"
        :disabled="uploadingFileInfo.showProgress">
        <el-form-item label="知识类型" prop="type" :rules="{ required: true }">
          <el-radio-group
            v-if="!isEdit"
            v-model="knowledgeForm.type"
            @input="changeKnowledgeType">
            <el-radio
              v-for="(type, index) in knowledgeTypes"
              :key="index"
              :label="type.value">
              {{ type.label }}
            </el-radio>
          </el-radio-group>
          <label v-else class="label">{{ currentKnowledgeType }}</label>
        </el-form-item>
        <el-form-item
          v-if="isShowFileType"
          label="文件标题"
          prop="title"
          :rules="titleRules">
          <el-input
            clearable
            ref="fileTitleInput"
            v-model="knowledgeForm.title"
            placeholder="请输入文件标题" />
        </el-form-item>
        <template v-else>
          <el-form-item label="词条名称" prop="name" :rules="nameRules">
            <el-input
              clearable
              ref="itemNameInput"
              v-model="knowledgeForm.name"
              placeholder="请输入词条名称" />
          </el-form-item>
          <el-form-item label="词条内容" prop="content">
            <el-input
              clearable
              v-model="knowledgeForm.content"
              placeholder="请输入词条内容" />
          </el-form-item>
        </template>
        <el-form-item
          class="upload"
          label="上传文件"
          :rules="uploadRules"
          :prop="isShowFileType ? 'files' : 'itemFiles'">
          <upload-file
            :limit="1"
            :accept-types="acceptTypes"
            :supported-suffixes="supportedSuffixes"
            :file-size-limit="configuration.file_size_limit"
            :file-list="
              isShowFileType ? knowledgeForm.files : knowledgeForm.itemFiles
            "
            :disabled="uploadingFileInfo.showProgress"
            @change-upload-files="onUploadFileChange"
            @remove-upload-files="onUploadFileRemove" />
        </el-form-item>
        <div class="message">
          {{ `${title}上传文件过程中，请勿关闭弹窗。` }}
        </div>
      </el-form>
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
import { KNOWLEDGE_TYPE_OPTIONS } from '../common/constant';
import { getAcceptFileTypes } from '../../../utils';
import { nafmii as nafmiiApi } from '../../../store/api';
import UploadFileMixin from '../../../components/mixins/UploadFileMixin';

export default {
  name: 'knowledge-popup',
  components: { UploadFile },
  mixins: [UploadFileMixin],
  props: {
    dataKnowledgeId: {
      type: Number,
      required: true,
    },
    current: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      knowledgeForm: {},
      originKnowledgeForm: {},
      knowledgeTypes: KNOWLEDGE_TYPE_OPTIONS,
      supportedSuffixes: '.pdf',
    };
  },
  mounted() {
    this.initKnowledgeForm();
    this.initInputFoucs();
  },
  computed: {
    ...mapGetters(['configuration']),

    title() {
      return this.isEdit ? '编辑知识' : '新建知识';
    },
    submitMessage() {
      return this.isEdit ? '知识编辑成功' : '知识新建成功';
    },
    canceledMessage() {
      return `${this.title}失败，请勿关闭弹窗`;
    },
    acceptTypes() {
      return getAcceptFileTypes(this.supportedSuffixes);
    },
    isShowFileType() {
      return this.knowledgeForm.type === this.knowledgeTypes[0].value;
    },
    uploadRules() {
      if (this.isShowFileType) {
        return { required: true, message: '请上传文件', trigger: 'change' };
      } else {
        return { required: false };
      }
    },
    titleRules() {
      return { required: true, message: '请输入文件标题', trigger: 'change' };
    },
    nameRules() {
      return { required: true, message: '请输入词条名称', trigger: 'change' };
    },
    knowledgeFormFields() {
      if (this.isShowFileType) {
        return ['type', 'title', 'files'];
      } else {
        return ['type', 'name', 'content', 'itemFiles'];
      }
    },
    currentKnowledgeType() {
      return this.knowledgeTypes.find(
        (type) => type.value === this.current.type,
      ).label;
    },
  },
  methods: {
    initKnowledgeForm() {
      const { type, filename, title = '', content = '' } = this.current;
      const files = filename ? [{ name: filename }] : [];
      const isFileType = type === KNOWLEDGE_TYPE_OPTIONS[0].value;
      this.knowledgeForm = {
        type: type || KNOWLEDGE_TYPE_OPTIONS[0].value,
        title: isFileType ? title : '',
        files: isFileType ? files : [],
        name: !isFileType ? title : '',
        content: content,
        itemFiles: !isFileType ? files : [],
      };
      this.originKnowledgeForm = _.clone(this.knowledgeForm);
    },
    initInputFoucs() {
      this.$nextTick(() => {
        if (this.isShowFileType) {
          this.$refs.knowledgeForm.clearValidate('title');
          this.$refs.fileTitleInput.focus();
        } else {
          this.$refs.knowledgeForm.clearValidate('name');
          this.$refs.itemNameInput.focus();
        }
      });
    },
    onUploadFileChange(files) {
      if (this.isShowFileType) {
        this.knowledgeForm.files = files;
        this.$refs.knowledgeForm.clearValidate('files');
      } else {
        this.knowledgeForm.itemFiles = files;
        this.$refs.knowledgeForm.clearValidate('itemFiles');
      }
      this.addFileName();
    },
    onUploadFileRemove(files) {
      if (this.isShowFileType) {
        this.knowledgeForm.files = files;
      } else {
        this.knowledgeForm.itemFiles = files;
      }
    },
    getDifferentParams(originParams, currentParams) {
      return _.pickBy(
        currentParams,
        (value, key) => !_.isEqual(value, originParams[key]),
      );
    },
    getUploadFileParams() {
      const params = _.pick(this.knowledgeForm, this.knowledgeFormFields);
      const originParams = _.pick(
        this.originKnowledgeForm,
        this.knowledgeFormFields,
      );
      const diffParams = this.getDifferentParams(originParams, params);
      let files;
      if (this.isShowFileType) {
        files = diffParams.files;
        delete diffParams.files;
      } else {
        if (diffParams.name) {
          diffParams.title = diffParams.name;
          delete diffParams.name;
        }
        files = diffParams.itemFiles;
        delete diffParams.itemFiles;
      }
      const formData = new FormData();
      if (files) {
        if (files.length === 0) {
          formData.append('file_path', '');
        } else {
          formData.append('file', files[0].raw);
        }
      }
      Object.entries(diffParams).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (this.isEdit) {
        return { id: this.current.id, data: formData };
      } else {
        if (!diffParams.type) {
          formData.append('type', this.knowledgeForm.type);
        }
        return { id: this.dataKnowledgeId, data: formData };
      }
    },
    addFileName() {
      if (this.isShowFileType) {
        if (!this.knowledgeForm.title && !_.isEmpty(this.knowledgeForm.files)) {
          this.knowledgeForm.title = this.knowledgeForm.files[0].name.replace(
            /\.[^.]*$/,
            '',
          );
          this.$refs.knowledgeForm.validate();
        }
      }
    },
    async handleSumbit() {
      const isValid = await this.$refs['knowledgeForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          this.abortController = new AbortController();
          const uploadFileApi = this.isEdit
            ? nafmiiApi.updateKnowledge
            : nafmiiApi.saveKnowledge;
          await this.handleUploadDefaultFile({
            params: this.getUploadFileParams(),
            uploadFileApi,
            successMessage: this.submitMessage,
            signal: this.abortController.signal,
          });
          if (this.isEdit) {
            this.$emit('save-knowledge-success', this.current.id);
          } else {
            this.$emit('save-knowledge-success');
          }
          this.handleClose();
        } catch (error) {
          if (error.status === 'canceled') {
            this.$notify({
              title: '提示',
              message: this.canceledMessage,
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
      }
    },
    handleClose() {
      this.abortController?.abort();
      this.$emit('close');
    },
    changeKnowledgeType() {
      this.$refs.knowledgeForm.clearValidate();
      this.initInputFoucs();
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables.scss';

.knowledge-popup {
  ::v-deep .el-form {
    .el-form-item__content {
      .label {
        padding-left: 10px;
      }
    }
    .message {
      margin-left: 100px;
      color: $--color-danger;
    }
  }
}
</style>
