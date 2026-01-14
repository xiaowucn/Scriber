<template>
  <el-upload
    drag
    action=""
    :auto-upload="false"
    :multiple="multiple"
    :file-list="fileList"
    v-bind="{
      ...(limit && { limit: limit }),
      ...(isOpenFileSelection && { accept: acceptTypes }),
    }"
    :on-change="onUploadFileChange"
    :on-remove="onUploadFileRemove"
    :on-exceed="onUploadFileExceed"
    @dragover.native="handleDropOver"
    class="file-upload"
    :class="{ 'is-disabled': disabled }">
    <div class="el-upload__text" @click="handleClick">
      <span class="text">
        <svg-font-icon name="upload-files" :size="18" hover-color="#333333" />
        添加文件
        <span v-if="limit" class="limit-number">
          {{ fileList.length }}/{{ limit }}
        </span>
      </span>
      <span class="prompt">单个文件不超过 {{ fileSizeLimit }}MB</span>
    </div>
    <div v-if="supportedSuffixes" class="el-upload__tip" slot="tip">
      说明：当前支持
      {{
        supportedSuffixes
          .split(',')
          .map((item) => item.replace(/^./, ''))
          .join('、')
      }}
      格式文件上传
    </div>
  </el-upload>
</template>

<script>
import { checkUploadFile } from '../../../utils';

export default {
  name: 'upload-file',
  props: {
    multiple: {
      type: Boolean,
      default: false,
      required: false,
    },
    limit: {
      type: Number,
      required: false,
    },
    fileList: {
      type: Array,
      required: true,
    },
    fileSizeLimit: {
      type: Number,
      required: true,
    },
    acceptTypes: {
      type: String,
      required: true,
    },
    supportedSuffixes: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      isOpenFileSelection: false,
    };
  },
  methods: {
    beforeFileUpload(file) {
      const isChecked = checkUploadFile(
        file,
        this.acceptTypes,
        this.fileSizeLimit,
      );
      return isChecked;
    },
    onUploadFileChange(file, fileList) {
      const files = fileList.filter((file) => this.beforeFileUpload(file));
      this.$emit('change-upload-files', files);
    },
    onUploadFileRemove(file, fileList) {
      this.$emit('remove-upload-files', fileList);
    },
    onUploadFileExceed(files, fileList) {
      if (this.limit === 1) {
        if (fileList.length === 0 && files.length > this.limit) {
          this.$notify({
            title: '提示',
            message: '请勿上传多份文件',
            type: 'warning',
          });
        } else {
          this.$notify({
            title: '提示',
            message: '请删除已上传文件',
            type: 'warning',
          });
        }
      }
    },
    handleClick() {
      this.isOpenFileSelection = true;
    },
    handleDropOver() {
      this.isOpenFileSelection = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables.scss';

.file-upload {
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 140px;
      border-style: solid;
      &:hover {
        .el-upload__text {
          .text {
            .svg-icon-container {
              color: $--color-primary !important;
            }
          }
        }
      }
    }
    .el-upload__text {
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      .text {
        display: flex;
        align-items: center;
        justify-content: center;
        .svg-icon-container {
          margin: 0 5px 0 0;
        }
      }
      .limit-number {
        margin-left: 10px;
        color: $--color-text-auxiliary;
      }
      .prompt {
        color: $--color-text-auxiliary;
      }
    }
  }
  .el-upload__tip {
    margin-top: 0;
    font-size: 14px;
    line-height: 14px;
    color: $--color-text-auxiliary;
  }
  &.is-disabled {
    ::v-deep .el-upload {
      .el-upload-dragger {
        border-color: $--border-color-light !important;
        &:hover {
          .el-upload__text {
            .text {
              .svg-icon-container {
                color: $--color-text-placeholder !important;
              }
            }
          }
        }
      }
      .el-upload__text {
        cursor: not-allowed;
        color: $--color-text-placeholder;
        background-color: $--background-color-base;
        .limit-number,
        .prompt {
          color: $--color-text-placeholder;
        }
      }
    }
  }
}
</style>
