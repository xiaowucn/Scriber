<template>
  <div class="upload-file-popup">
    <el-dialog
      visible
      :title="$t(`message['上传文件']`)"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form
        ref="uploadFileForm"
        :model="uploadFileForm"
        :rules="uploadFileFormRules"
        label-width="100px"
        class="upload-file-form">
        <el-form-item :label="$t(`message['上传']`)" prop="files">
          <el-upload
            drag
            action=""
            :multiple="true"
            :file-list="uploadFileForm.files"
            accept=".pdf"
            :auto-upload="false"
            :on-change="handleChangeUploadFile"
            :on-remove="handleRemoveUploadFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t(`message['将文件拖到此处']`) }}，{{ $t(`message['或']`) }}
              <em>{{ $t(`message['点击上传']`) }}</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              {{ $t(`message['说明']`) }}：{{ $t(`message['目前支持上传']`) }}
              *.pdf
              {{ $t(`message['格式的文档']`) }}
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button
          type="primary"
          :loading="showUploadFileLoading"
          @click="handleUploadFile">
          {{ $t(`message['确定']`) }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'emailPopup',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      uploadFileForm: {
        files: [],
      },
      uploadFileFormRules: {
        files: [
          {
            required: true,
            message: '请选择文件',
            trigger: 'change',
          },
        ],
      },
      showUploadFileLoading: false,
    };
  },
  methods: {
    handleChangeUploadFile(file, fileList) {
      this.uploadFileForm.files = fileList;
      this.$refs.uploadFileForm.clearValidate('files');
    },
    handleRemoveUploadFile(file, fileList) {
      this.uploadFileForm.files = fileList;
    },
    handleClose() {
      this.$emit('close');
    },
    async handleUploadFile() {
      const isValid = await this.$refs['uploadFileForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          this.showUploadFileLoading = true;
          const { files } = this.uploadFileForm;
          const formData = new FormData();
          files.forEach((file) => {
            formData.append('file', file.raw);
          });
          await this.$store.dispatch('detailModule/uploadFile', {
            treeId: this.projectId,
            data: formData,
          });
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success',
          });
          this.handleClose();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.showUploadFileLoading = false;
        }
      }
    },
  },
};
</script>
