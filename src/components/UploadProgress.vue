<template>
  <div class="upload-progress-wrapper">
    <template v-if="upload.showProgress">
      <el-tooltip :content="fileName" placement="top">
        <p class="file-name" v-if="fileName">
          {{ fileName }}
        </p>
      </el-tooltip>
      <span>{{ $t(`message['上传中']`) }}：</span>
      <div class="progress-bar">
        <el-progress
          :percentage="upload.progress"
          color="#8e71c7"></el-progress>
        <span class="tips"
          >（{{ $t(`message['正在上传，请勿切换页面']`) }}）
        </span>
      </div>
    </template>
    <template v-if="upload.showUnPackProgress">
      <span>{{ $t(`message['上传成功正在解压缩']`) }}：</span>
      <el-progress
        :percentage="upload.unpackProgress"
        color="#8e71c7"></el-progress>
    </template>
  </div>
</template>

<script>
export default {
  name: 'upload-progress',
  props: {
    upload: {
      type: Object,
      required: true,
    },
    fileName: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-progress-wrapper {
  margin-left: 10px;
  .file-name {
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .progress-bar {
    display: flex;
    .tips {
      font-size: 14px;
      color: #ff9a03;
    }
  }
}
</style>
