<template>
  <div class="upload-filed-code">
    <div class="upload-operations">
      <div class="message">
        <template v-if="isUploadedFiledCodeFile">
          <span class="file-name" :title="uploadedFiledCodeFileName">
            {{ uploadedFiledCodeFileName }}
          </span>
          <el-button class="download" @click="downloadUploadedFiledCodeFile">
            <i class="el-icon-download"></i>
          </el-button>
        </template>
        <template v-else>
          <span>请上传分类代码文件</span>
        </template>
      </div>
      <el-upload
        action=""
        :accept="acceptFiledCodeFileTypes"
        :show-file-list="false"
        :http-request="uploadFiledCode"
        class="upload">
        <el-button type="primary">
          <i class="el-icon-upload2"></i>
        </el-button>
      </el-upload>
      <el-button
        type="primary"
        @click="handleTestFiledCode"
        class="test"
        :loading="isFetchUploadedFiledCodeLoading">
        代码测试
      </el-button>
      <el-button
        type="text"
        class="example"
        @click="downloadSampleFiledCodeFile"
        >示例代码</el-button
      >
    </div>
    <filed-code-test-popup
      v-if="isShowFiledCodeTestPopup"
      @close="closeFiledCodeTestPopup"
      :accept-types="acceptTypes"
      :filed-code-file-name="uploadedFiledCodeFileName"
      @download-filed-code-file="downloadUploadedFiledCodeFile" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { downloadFileByBlob, getAcceptFileTypes } from '@/utils';
import FiledCodeTestPopup from './FiledCodeTestPopup';
import { cmfchina as cmfchinaApi } from '../../../store/api';
import { beforeFileUpload } from '../common/utils';

export default {
  name: 'upload-filed-code',
  components: { FiledCodeTestPopup },
  props: {
    acceptTypes: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      uploadedFiledCodeFileName: '',
      isUploadedFiledCodeFile: false,
      isFetchUploadedFiledCodeLoading: false,
      isShowFiledCodeTestPopup: false,
      filedCodeFileSupportedSuffixes: '.py',
    };
  },
  created() {
    this.fetchUploadedFiledCode();
  },
  computed: {
    ...mapGetters(['configuration']),

    acceptFiledCodeFileTypes() {
      return getAcceptFileTypes(this.filedCodeFileSupportedSuffixes);
    },
  },
  methods: {
    openFiledCodeTestPopupp() {
      this.isShowFiledCodeTestPopup = true;
    },
    closeFiledCodeTestPopup() {
      this.isShowFiledCodeTestPopup = false;
    },
    handleTestFiledCode() {
      if (!this.isUploadedFiledCodeFile) {
        this.$alert('请先上传分类代码文件。', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        });
        return;
      }
      this.openFiledCodeTestPopupp();
    },
    async fetchUploadedFiledCode() {
      try {
        this.isFetchUploadedFiledCodeLoading = true;
        const params = { sample: false };
        const res = await this.fetchFiledCode(params);
        const filename = decodeURI(
          res.headers['content-disposition'].split('filename=')[1],
        );
        this.uploadedFiledCodeFileName = filename;
        this.isUploadedFiledCodeFile = true;
      } catch (error) {
        this.isUploadedFiledCodeFile = false;
        console.error(error);
      } finally {
        this.isFetchUploadedFiledCodeLoading = false;
      }
    },
    downloadUploadedFiledCodeFile() {
      this.downloadFiledCodeFile({ sample: false });
    },
    downloadSampleFiledCodeFile() {
      this.downloadFiledCodeFile({ sample: true });
    },
    async downloadFiledCodeFile(params) {
      try {
        const res = await this.fetchFiledCode(params);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchFiledCode(params) {
      const res = await cmfchinaApi.fetchFiledCode(params);
      return res;
    },
    async uploadFiledCode(file) {
      const isChecked = beforeFileUpload(
        file.file,
        this.acceptFiledCodeFileTypes,
        this.configuration.file_size_limit,
      );
      if (!isChecked) {
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', file.file);
        await cmfchinaApi.uploadFiledCode(formData);
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
        });
        this.fetchUploadedFiledCode();
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
.upload-filed-code {
  i {
    font-size: 16px;
  }
  .upload-operations {
    display: flex;
    align-items: center;
    > * {
      height: 36px;
    }
    ::v-deep .el-upload {
      margin-left: 10px;
      .el-button {
        height: 36px;
        padding: 0 14px;
      }
    }
    > .el-button {
      padding: 0 14px;
      margin-left: 10px;
    }
    .message {
      width: 180px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #909399;
      font-size: 14px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
    }
    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .download {
      padding: 0;
      border: unset;
      background-color: unset;
      &:hover {
        color: $--color-primary;
      }
    }
    .example {
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }
}
</style>
