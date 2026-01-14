<template>
  <el-popover
    trigger="hover"
    placement="bottom-start"
    width="300"
    popper-class="header-file-info-popper"
    :open-delay="0">
    <div class="header-file-info-container">
      <p>
        <span>文件名</span>：
        <span class="file-name">
          {{ fileInfo.fileName }}
        </span>
      </p>
      <p>
        <span>文件ID</span>：
        <span class="file-id">
          {{ fileInfo.fileId }}
        </span>
      </p>
      <p v-if="!isIframeMode" class="position">
        <span>位置</span>：<el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(path, index) in fileInfo.filePath"
            :key="index"
            ><a :href="path.href">{{ path.name }}</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </p>
    </div>
    <el-button slot="reference" type="text" class="toolbar-fileinfo">
      <theme-icon name="doc" icon-class="icon-file-alt-regular"></theme-icon>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'toolbar-file-info',
  props: {
    fileInfo: {
      type: Object,
      required: true,
    },
    isIframeMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.header-file-info-popper {
  width: auto !important;
  max-width: 45vw;
  padding: 1em 2em;
  .header-file-info-container {
    p {
      padding: 5px 0;
    }
    .file-name,
    .file-id {
      color: #4475de;
    }
    .position {
      display: flex;
      align-items: center;
      .el-breadcrumb__item {
        .el-breadcrumb__inner :is(a) {
          cursor: pointer;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
