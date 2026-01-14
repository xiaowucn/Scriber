<template>
  <el-dialog
    :title="fileName"
    :visible="true"
    width="900px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    top="0"
    @close="handleCancel"
    class="contract-file-dialog">
    <common-image-viewer
      v-if="fileInfo"
      ref="viewer"
      :pages="fileInfo.pageInfo"
      :outline="fileInfo.outline"
      :settings="settings"
      :plugins="['outline', 'header']"
      @page-mounted="handlePageMounted"></common-image-viewer>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import CommonImageViewer from '@paoding-label/vue-image-viewer';
import { baseURL } from '@/store/api/http';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { canvasWM } from '@/utils/waterMark';
export default {
  name: 'contract-file-dialog',

  components: { CommonImageViewer },

  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      fileInfo: null,
      exsitWaterMarkPageMap: {},
      settings: {
        markable: {
          autoActive: true,
        },
        pageSpacing: 10,
        imageURLParser: (pageIndex, scale, pageInfo) => {
          const scaledWidth = Math.floor(
            Number(pageInfo.width) * window.devicePixelRatio * scale,
          );
          let url = `${baseURL}/plugins/fileapi/files/${this.fileId}/pages/${pageIndex}/image/${scaledWidth}.jpg`;
          if (this.configuration.page_image_format === 'svg') {
            url = `${baseURL}/plugins/fileapi/file/${this.fileId}/page/${pageIndex}`;
          }
          return [url];
        },
        searchURLParser: (keyword) => {
          return `${baseURL}/plugins/fileapi/file/${this.fileId}/search?keyword=${keyword}`;
        },
      },
    };
  },

  computed: {
    ...mapGetters(['configuration']),
  },

  async created() {
    this.getFileInfo();
  },

  methods: {
    async getFileInfo() {
      try {
        const [pageInfoRes, outlineRes] = await Promise.all([
          fetchFilePageInfo(this.fileId),
          fetchFileOutline(this.fileId),
        ]);

        this.fileInfo = {
          pageInfo: pageInfoRes.data,
          outline: {
            items: outlineRes.data ? outlineRes.data.children : [],
          },
        };
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    handlePageMounted() {
      this.$refs.viewer.imageViewer.getMountedPages().forEach((item) => {
        if (!this.exsitWaterMarkPageMap[item.dom.dataset.pageNumber]) {
          canvasWM({
            content: '中诚信国际信用评级有限责任公司',
            container: item.dom,
          });
          this.exsitWaterMarkPageMap[item.dom.dataset.pageNumber] = true;
        }
      });
    },
    handleCancel() {
      this.$emit('handleCancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-file-dialog {
  ::v-deep .el-dialog {
    height: 100vh;
    .el-dialog__body {
      height: calc(100% - 54px);
      overflow: hidden;
      padding: 0;
      .mark-buttons-wrapper {
        display: none;
      }
    }
  }
}
</style>
