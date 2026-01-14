<template>
  <el-dialog visible :before-close="close" :close-on-click-modal="false">
    <span slot="title">{{
      currentEditId ? $t(`message['文件编辑']`) : $t(`message['文件上传']`)
    }}</span>
    <el-form ref="form" :model="fileData" :rules="rules" label-width="80px">
      <el-form-item
        :label="currentEditId ? $t(`message['名称']`) : $t(`message['上传']`)"
        prop="name">
        <div class="file-name-wrapper">
          <el-input
            v-model="fileData.name"
            :readonly="!currentEditId"
            clearable
            :placeholder="
              currentEditId
                ? $t(`message['请输入文件名称']`)
                : $t(`message['请上传文件']`)
            "></el-input>
          <i
            v-if="!currentEditId && fileData.name"
            class="el-icon-circle-close"
            @click="clearUploadedFile"></i>
        </div>

        <el-upload
          v-if="!currentEditId"
          class="upload-wrapper"
          action=""
          accept=".pdf,.doc,.docx,.txt,image/jpg,image/jpeg,image/png"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          :on-exceed="handleExceed"
          :on-change="onUploadFileChange">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-upload2"></el-button>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t(`message['模型']`)" prop="molds">
        <el-select
          :placeholder="$t(`message['请选择模型']`)"
          v-model="fileData.molds"
          @change="handleChangeSchema">
          <el-option
            v-for="item in schemaOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`message['模板']`)" prop="templates">
        <el-select
          :placeholder="$t(`message['请选择模板']`)"
          multiple
          filterable
          :loading="templateLoading"
          v-model="fileData.templates">
          <el-option
            v-for="item in templates"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`message['版本号']`)" prop="version">
        <el-input
          v-model="fileData.version"
          :placeholder="$t(`message['请输入版本号']`)"></el-input>
        <el-tooltip
          effect="dark"
          placement="right"
          popper-class="version-popper">
          <div slot="content">
            <p>填写合同类的版本号，则需输入X-0形式，例如：1-0，2-0，3-0等</p>
            <p>
              填写补充协议类的版本号，则需输入X-Y形式，例如：1-1，1-13，2-8等
            </p>
          </div>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t(`message['业务组']`)" prop="group_name">
        <el-select
          :placeholder="$t(`message['请选择业务组']`)"
          v-model="fileData.group_name">
          <el-option
            v-for="item in groupNameOption"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">
        {{ $t(`message['取消']`) }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="submitFile">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { uploadFileToProject, updateFile } from '@/store/api/citics-tg.api';
import { fileMaxSize } from '@/store/constants';
import { fetchTemplateList } from '@/store/api/citics-tg.api';
import { checkUploadFileSize } from '@/utils';

export default {
  name: 'mapping-relation-dialog',
  data() {
    return {
      fileData: {
        name: '',
        molds: '',
        templates: [],
        version: '',
        group_name: '',
      },
      templates: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t(`message['请上传文件']`),
            trigger: 'change',
          },
        ],
        molds: [
          {
            required: true,
            message: this.$t(`message['请选择模型']`),
            trigger: 'change',
          },
        ],
        templates: [
          {
            required: true,
            message: this.$t(`message['请选择模板']`),
            trigger: 'change',
          },
        ],
        version: [
          {
            required: false,
            validator: this.validateVersionValue,
            message: this.$t(`message['请输入正确的版本号']`),
            trigger: 'blur',
          },
        ],
        group_name: [
          {
            required: true,
            message: this.$t(`message['请选择所属业务组']`),
            trigger: 'change',
          },
        ],
      },
      templateLoading: false,

      currentEditId: null,
      submitting: false,

      schemaOptions: [],
    };
  },
  props: {
    currentEditItem: {
      type: Object,
      default: () => {},
    },
    treeId: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters('citicsTgModule', ['schemas', 'businessGroups']),
    ...mapGetters(['loginUser']),
    groupNameOption() {
      if (this.loginUser.group_name !== '') {
        return this.loginUser.group_name.split(',');
      }
      return this.businessGroups;
    },
  },
  created() {
    this.fetchAllTemplates();
    if (this.currentEditItem) {
      const { name, molds, templates, version, group_name } =
        this.currentEditItem;
      this.fileData.name = name;
      this.fileData.molds = molds[0];
      this.fileData.templates = templates;
      this.fileData.version = version || '';
      this.fileData.group_name = group_name;
      this.currentEditId = this.currentEditItem.id;
    }
    this.schemaOptions = this.schemas;
    if (this.productType.includes('资管')) {
      this.schemaOptions = this.schemas.filter((item) =>
        item.name.includes('资管'),
      );
    } else if (this.productType.includes('私募基金')) {
      this.schemaOptions = this.schemas.filter((item) =>
        item.name.includes('私募基金'),
      );
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    clearUploadedFile() {
      this.fileData.name = '';
      this.$refs.form.clearValidate('file');
    },
    handleChangeSchema() {
      this.fetchAllTemplates();
    },
    async fetchAllTemplates(page = 1) {
      try {
        this.templateLoading = true;
        if (page === 1) {
          this.templates = [];
        }
        const params = {
          page,
          size: 100,
        };
        if (this.fileData.molds) {
          params.mold = this.fileData.molds;
        }
        const templates = _.cloneDeep(this.templates);
        const res = await fetchTemplateList(params);
        templates.push(...res.data.items);
        this.templates = templates;
        if (res.data.total > templates.length) {
          this.fetchAllTemplates(page + 1);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.templateLoading = false;
      }
    },
    handleExceed(files) {
      this.onUploadFileChange({ raw: files[0] });
    },
    onUploadFileChange(file) {
      const uploadFile = file.raw;
      const isValidate = checkUploadFileSize(
        uploadFile.size,
        fileMaxSize,
        true,
      );
      if (isValidate) {
        this.fileData.name = uploadFile.name;
        this.fileData.file = uploadFile;
        this.$refs.form.clearValidate('file');
      }
    },
    validateVersionValue(rule, value, callback) {
      if (!value) {
        callback();
      }
      const { molds } = this.fileData;
      let moldName = this.schemas.find((item) => item.id === molds)?.name;
      let regex = /^\d+-0$/;
      if (moldName?.includes('补充协议')) {
        regex = /^\d+-[1-9]\d*$/;
      }
      if (!regex.test(value)) {
        callback(new Error('请输入正确的版本号'));
      } else {
        callback();
      }
    },
    async submitFile() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSaveFile();
        } else {
          return false;
        }
      });
    },

    async handleSaveFile() {
      try {
        this.submitting = true;
        const { name, file, molds, templates, version, group_name } =
          this.fileData;
        if (this.currentEditId) {
          const data = {
            name,
            molds: [molds],
            templates,
            version,
            group_name,
          };
          await updateFile(this.currentEditId, data);
        } else {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('molds', molds);
          templates.forEach((item) => {
            formData.append('templates', item);
          });
          formData.append('version', version);
          formData.append('group_name', group_name);
          await uploadFileToProject(this.treeId, formData);
        }
        this.$notify({
          title: '成功',
          message: `${this.currentEditId ? '修改' : '新增'}文件成功`,
          type: 'success',
        });
        this.close();
        this.$emit('fetchList');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.file-name-wrapper {
  width: 100%;
  position: relative;
  .el-icon-circle-close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
  }
}
::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
  .upload-wrapper {
    height: 40px;
    margin-left: 10px;
    .el-button {
      i {
        font-size: 24px;
      }
    }
  }
  .el-input {
    margin-right: 5px;
  }
  i {
    font-size: 16px;
  }
}
</style>
<style lang="scss">
.version-popper {
  width: 150px;
  p {
    padding: 5px 0;
  }
}
</style>
