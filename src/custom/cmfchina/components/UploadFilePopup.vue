<template>
  <div class="upload-file-popup">
    <el-dialog
      visible
      :title="uploadTitle"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form
        ref="uploadFileForm"
        :model="uploadFileForm"
        :rules="uploadFileFormRules"
        label-width="100px"
        class="upload-file-form">
        <el-form-item label="上传" prop="files">
          <el-upload
            drag
            action=""
            :multiple="true"
            :file-list="uploadFileForm.files"
            :accept="acceptTypes"
            :auto-upload="false"
            :on-change="onUploadFileChange"
            :on-remove="onUploadFileRemove">
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
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="uploadFile">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { beforeFileUpload } from '../common/utils';

export default {
  name: 'upload-file-popup',
  props: {
    uploadType: {
      type: String,
      required: true,
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
    };
  },
  computed: {
    ...mapGetters(['configuration']),
  },
  methods: {
    onUploadFileChange(file, fileList) {
      const files = fileList.filter((file) => this.onUploadFileBefore(file));
      this.uploadFileForm.files = files;
      this.$refs.uploadFileForm.clearValidate();
    },
    onUploadFileRemove(file, fileList) {
      this.uploadFileForm.files = fileList;
    },
    onUploadFileBefore(file) {
      const isChecked = beforeFileUpload(
        file,
        this.acceptTypes,
        this.configuration.file_size_limit,
      );
      return isChecked;
    },
    async uploadFile() {
      const isValid = await this.$refs['uploadFileForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        const { files } = this.uploadFileForm;
        this.$emit('upload-file', files);
        this.handleClose();
      }
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>
