<template>
  <file-pdf-viewer-container
    v-if="viewerReady"
    ref="pdfViewerContainer"
    :file-id="currentFile.id"
    :file-info="currentFile.fileInfo"
    :show-cross-page-annotation-arrow="true"
    @scale-changed="$emit('scale-changed')"
    @pages-loaded="$emit('pages-loaded')"
    @page-rendered="handlePageRendered"
    @viewer-ready="handleViewerReady">
    <template slot="toolbar">
      <el-popover
        v-if="!isDiffMode"
        trigger="hover"
        placement="bottom-start"
        width="500"
        popper-class="document-viewer-toolbar-bar-files-summary">
        <div class="files-summary">
          <div>
            <label>主文件名:</label>
            <div>
              <router-link
                :to="getFileDiffRouterLink(mainFile.id)"
                target="_blank"
                :title="mainFile.name"
                :class="getRouterLinkClassName(mainFile)">
                {{ mainFile.name }}
              </router-link>
            </div>
          </div>
          <div>
            <label>附文件名:</label>
            <div>
              <router-link
                v-for="file in otherFiles"
                :key="file.id"
                :to="getFileDiffRouterLink(file.id)"
                target="_blank"
                :disabled="file.id === currentFile.id"
                :title="file.name"
                :class="getRouterLinkClassName(file)">
                {{ file.name }}
              </router-link>
            </div>
          </div>
        </div>
        <template slot="reference">
          <el-button type="text">
            <theme-icon
              name="doc"
              icon-class="icon-file-alt-regular"></theme-icon>
          </el-button>
        </template>
      </el-popover>

      <slot name="toolbar"></slot>
    </template>
  </file-pdf-viewer-container>
</template>

<script>
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { fetchTaskFiles } from '@/store/api/chinaamc_yx.api';
import { FILE_TYPES, FILE_STATUS_CODE } from '../common/constant';

export default {
  name: 'pdf-viewer',
  components: {
    FilePdfViewerContainer,
  },
  props: {
    fileId: {
      type: Number,
      required: false,
      default: null,
    },
    isDiffMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    pageAnnotations: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      viewerReady: false,
      currentFile: {
        id: null,
        fileInfo: {
          pageInfo: [],
          outline: [],
        },
      },
      mainFile: {
        id: null,
        name: '',
      },
      otherFiles: [],
    };
  },
  computed: {
    taskId() {
      return Number(this.$route.params.taskId);
    },
  },
  created() {
    this.init();
  },
  watch: {
    pageAnnotations() {
      const app = this.$refs.pdfViewerContainer?.$refs.pdfViewer.app;
      if (app && app.annotationManager) {
        app.removeAllAnnotation();

        const pages = this.getRenderedPages();
        pages.forEach((page) => {
          const annotations = this.pageAnnotations[page] || [];
          annotations.forEach((item) => {
            this.$refs.pdfViewerContainer.renderAnswerWidget(item);
          });
        });
      }
    },
  },
  methods: {
    async init() {
      if (!this.isDiffMode) {
        await this.getTaskFiles();
      } else {
        this.currentFile.id = this.fileId;
      }
      const { pageInfo, outline } = await this.getFileInfo(this.currentFile.id);
      this.viewerReady = true;
      this.currentFile.fileInfo = {
        pageInfo,
        outline,
      };
    },
    async getTaskFiles() {
      try {
        const MAIN_FILE_TYPE = FILE_TYPES[1];

        const res = await fetchTaskFiles(this.taskId);

        const mainFile = res.data.find(
          (item) => item.file_type === MAIN_FILE_TYPE,
        );
        if (!mainFile) {
          throw new Error('找不到主文件');
        }

        this.currentFile.id = this.fileId || mainFile.id;
        this.mainFile = mainFile;
        this.otherFiles = res.data.filter(
          (item) => item.file_type !== MAIN_FILE_TYPE,
        );
        this.$emit('task-files-fetched', res.data);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getFileInfo(fileId) {
      const [pageInfo, outline] = await Promise.all([
        this.getFilePageInfo(fileId),
        this.getFileOutline(fileId),
      ]);

      return {
        pageInfo,
        outline,
      };
    },
    async getFilePageInfo(fileId) {
      try {
        const res = await fetchFilePageInfo(fileId);
        const pageInfo = res.data;

        return pageInfo;
      } catch (error) {
        return [
          {
            page: 0,
            width: 595,
          },
        ];
      }
    },
    async getFileOutline(fileId) {
      try {
        const res = await fetchFileOutline(fileId);
        const outline = {
          items: res.data?.children || [],
        };

        return outline;
      } catch (error) {
        return { items: [] };
      }
    },
    getRouterLinkClassName(file) {
      const classList = [];
      if (file.status !== FILE_STATUS_CODE.CMP_FINISH) {
        classList.push('disabled');
      }
      if (this.currentFile.id === file.id) {
        classList.push('active');
      }
      return classList;
    },
    getFileDiffRouterLink(fileId) {
      return {
        name: 'fileDiff',
        params: {
          taskId: this.taskId,
          fileId: fileId,
        },
      };
    },
    handlePageRendered(page) {
      const annotations = this.pageAnnotations[page] || [];
      annotations.forEach((item) => {
        this.$refs.pdfViewerContainer.renderAnswerWidget(item);
      });
      this.$emit('page-rendered', page);
    },
    handleViewerReady() {
      this.setScale();
      this.$emit('viewer-ready');
    },
    setScale(scale = 'auto') {
      this.$refs.pdfViewerContainer.setScale(scale);
    },
    getScale() {
      return this.$refs.pdfViewerContainer.getScale();
    },
    getRenderedPages() {
      return this.$refs.pdfViewerContainer.getMountedPageNumbers();
    },
    jumpToPage(pageNumber, offset = [0, 0]) {
      return this.$refs.pdfViewerContainer.scrollToPage(pageNumber + 1, offset);
    },
    getWidgetById(id) {
      return this.$refs.pdfViewerContainer.getWidgetById(id);
    },
    resetWidgets() {
      return this.$refs.pdfViewerContainer?.resetWidgets();
    },
  },
};
</script>

<style lang="scss" scoped>
.file-pdf-viewer-container {
  ::v-deep .pdfViewer {
    pointer-events: none;
  }
  ::v-deep .draw-widget-switch-container {
    display: none;
  }
}
</style>

<style lang="scss">
.document-viewer-toolbar-bar-files-summary {
  .files-summary {
    > div {
      display: flex;
      label {
        flex-shrink: 0;
        width: 60px;
      }
      > div {
        flex: 1;
        width: calc(100% - 70px);
        margin-left: 10px;
        :is(a) {
          display: block;
          width: 100%;
          margin-bottom: 5px;
          text-decoration: none;
          color: #606266;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &.disabled {
            pointer-events: none;
            color: #aaa;
          }
          &[disabled] {
            pointer-events: none;
          }
          &.active {
            color: #0090c0;
          }
          &:hover {
            color: #0090c0;
          }
        }
      }
    }
  }
}
</style>
