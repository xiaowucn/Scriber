<template>
  <div class="download-file-loading" :style="{ right: right }">
    <div class="download-info">
      <div class="file">
        <span>
          File Size
          <i class="size">{{ documentSize }}</i>
          ,
        </span>
        <span>
          Internet Speed
          <i class="speed">{{ downloadSpeed }}</i>
          ,
        </span>
        <span>
          Remaining
          <i class="time">{{ downloadRemainingTime }}</i>
        </span>
      </div>
      <el-progress color="#369aa2" :percentage="downloadProgress"></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'download-file-loading',
  props: {
    documentSize: {
      type: String,
      required: true,
    },
    downloadSpeed: {
      type: String,
      required: true,
    },
    downloadRemainingTime: {
      type: String,
      required: true,
    },
    downloadProgress: {
      type: Number,
      required: true,
    },
    isShowOnThePdf: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      right: '0px',
    };
  },
  mounted() {
    if (this.isShowOnThePdf) {
      const pdfPanle = document.querySelector('.rule-details-wrapper');
      const pdfPanleWidth = pdfPanle.clientWidth;
      this.right = `${pdfPanleWidth}px`;
    } else {
      this.right = '0px';
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.download-file-loading {
  position: absolute;
  top: -60px;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  z-index: 9999;
  .download-info {
    min-width: 420px;
    padding: 20px 30px;
    background-color: #fff;
    color: #303133;
    border-radius: 5px;
    box-shadow: 0 1px 8px #ccc;
    font-size: 14px;
    text-align: center;
    .file {
      > span {
        display: inline-block;
        margin-right: 5px;
      }
      i {
        margin-left: 3px;
        font-style: initial;
        font-weight: bold;
        &.size,
        &.speed {
          color: $--color-primary;
        }
        &.time {
          color: $--color-red;
        }
      }
    }
    .el-progress {
      width: 70%;
      margin: 15px auto 0;
    }
  }
}
</style>
