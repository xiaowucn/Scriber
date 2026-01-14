<template>
  <div class="diff-file-popup" v-drag>
    <div class="file-header">
      <span class="file-name">{{ fileName }}</span>
      <i class="el-icon-close" @click="handleClosePopup"></i>
    </div>
    <pdf-viewer
      ref="pdfViewerRef"
      :file-id="fileId"
      :file-doc-type="fileDocType"
      :can-continuous-draw-widget="canContinuousDrawWidget"
      @draw-widget="handleDrawWidget"
      @drawed-widget="handleDrawedWidget" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PdfViewer from './PdfViewer';

export default {
  name: 'diff-file-popup',
  components: { PdfViewer },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileDocType: {
      type: String,
      required: true,
    },
    canContinuousDrawWidget: {
      type: Boolean,
      required: true,
    },
  },
  directives: {
    drag: {
      inserted: (target) => {
        const targetHeader = target.querySelector('.file-header');
        targetHeader.onmousedown = (e) => {
          const disX = e.clientX - target.offsetLeft;
          const disY = e.clientY - target.offsetTop;
          document.onmousemove = (e) => {
            target.style.left = e.clientX - disX + 'px';
            target.style.top = e.clientY - disY + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
          return false;
        };
      },
    },
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    fileName() {
      return this.detail.files.find((fileItem) => fileItem.id === this.fileId)
        .name;
    },
  },
  methods: {
    handleClosePopup() {
      this.$emit('close');
    },
    handleDrawWidget() {
      this.$emit('draw-widget');
    },
    handleDrawedWidget(status) {
      this.$emit('drawed-widget', status);
    },
  },
};
</script>

<style scoped lang="scss">
.diff-file-popup {
  position: absolute;
  bottom: 30px;
  left: 20px;
  width: calc(100% - 40px);
  height: 50%;
  z-index: 2000;
  background-color: #fff;
  box-shadow: 0 0 10px #7a7a7a;
  .file-header {
    position: absolute;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    cursor: move;
    .file-name {
      z-index: 1;
      font-size: 14px;
      color: $--color-primary;
      width: 100%;
      text-align: center;
    }
    .el-icon-close {
      position: absolute;
      right: 0;
      z-index: 1;
      margin: 0 20px;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        background-color: #ff4949;
        color: #fff;
      }
    }
  }
  .file-pdf-viewer-container {
    ::v-deep .document-viewer-toolbar {
      .left {
        z-index: 1;
        height: 40px;
        > button:not(.toolbar-chapter),
        > span {
          display: none;
        }
        .el-button {
          height: 100%;
        }
      }
      .middle,
      .right {
        display: none;
      }
    }
  }
}
</style>
