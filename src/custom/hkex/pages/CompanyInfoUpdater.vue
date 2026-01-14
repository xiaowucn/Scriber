<template>
  <div class="update-stock">
    <h2>Upload excel file to update stock information</h2>
    <el-upload
      drag
      accept=".xls,.xlsx"
      action=""
      :limit="1"
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-change="handleChange">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drag the excel file here or <em>click upload</em>
      </div>
    </el-upload>
    <div v-if="uploadFile" class="btns">
      <el-button size="big" type="primary" @click="uploadExcel">
        Upload now
      </el-button>
    </div>
  </div>
</template>

<script>
import { updateCompanies } from '@/store/api/hkex.api';

export default {
  name: 'company-info-updater',
  data() {
    return {
      uploadFile: null,
    };
  },
  methods: {
    handleChange(file) {
      this.uploadFile = file.raw;
    },
    handleRemove() {
      this.uploadFile = null;
    },
    async uploadExcel() {
      try {
        const formData = new FormData();
        formData.append('file', this.uploadFile);
        await updateCompanies(formData);
        this.$notify({
          title: 'Success',
          message: 'Upload successfully',
          type: 'success',
        });
        this.uploadFile = null;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.update-stock {
  padding: 32px;
  ::v-deep .el-upload {
    width: 100%;
    margin: 30px 0;
    .el-upload-dragger {
      width: 100%;
      .el-upload__text {
        margin-top: 10px;
        font-size: 18px;
      }
    }
  }
  ::v-deep .el-upload-list--text {
    font-weight: bold;
    .el-upload-list__item {
      padding: 10px 0;
      background: #f8f8f8;
      .el-icon-close {
        display: block;
        top: 18px;
        right: 15px;
        color: #f56c6c;
        font-weight: bold;
      }
    }
  }
  .btns {
    margin-top: 30px;
    text-align: left;
  }
}
</style>
