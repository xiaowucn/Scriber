<template>
  <div class="file-detail">
    <el-tabs class="file-detail-tabs">
      <el-tab-pane label="项目管理">
        <div class="file-detail-container">
          <div class="file-viewer-wrapper" v-loading="!viewerReady">
            <file-pdf-viewer-container
              v-if="viewerReady"
              :file-id="fileId"
              :file-info="fileInfo" />
          </div>
          <file-remark-aside :fileId="fileId" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import FileRemarkAside from '../components/FileRemarkAside.vue';
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';

export default {
  name: 'fileRemark',
  components: { FilePdfViewerContainer, FileRemarkAside },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      fileInfo: {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      projectId: null,
      schemaId: null,
      viewerReady: false,
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
  },
  watch: {
    fileId() {
      this.init();
    },
  },
  methods: {
    async init() {
      this.reset();
      try {
        await this.fetchFileInfo();
        await this.fetchSchema();
        this.fetchFileList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.viewerReady = true;
      }
    },
    async fetchFileInfo() {
      const data = await this.$store.dispatch(
        'citicsDcmModule/fetchRemarkFile',
        { id: this.fileId },
      );
      const fileInfo = {
        fileId: this.fileId,
        fileName: data.name,
        filePath: this.getFilePath(data),
      };
      const [pageInfo, outline] = await Promise.all([
        this.getFilePageInfo(),
        this.getFileOutline(),
      ]);
      fileInfo.pageInfo = pageInfo;
      fileInfo.outline = outline;

      this.fileInfo = fileInfo;
      this.projectId = data.pid;
      this.schemaId = data.molds[0];
    },
    async fetchSchema() {
      await this.$store.dispatch('citicsDcmModule/fetchSchema', {
        id: this.schemaId,
      });
    },
    async fetchFileList() {
      if (this.fileViewer.files.length === 0) {
        this.$store.commit('detailModule/SET_DIR_ID', this.projectId);
        await this.$store.dispatch('detailModule/fetchFileList');
      }
    },
    async getFilePageInfo() {
      const { data } = await fetchFilePageInfo(this.fileId);
      return data;
    },
    async getFileOutline() {
      const { data } = await fetchFileOutline(this.fileId);
      const outline = { items: data ? data.children : [] };
      const buildOutlines = function (data) {
        data.forEach((item) => {
          if (item.level === 3) {
            item.children = [];
          } else {
            buildOutlines(item.children);
          }
        });
      };
      buildOutlines(outline.items);
      return outline;
    },
    getFilePath(data) {
      const href = '#/project';
      const filePath = [{ name: '总览', href }].concat(
        data.crumbs.map((path) => ({
          name: path.name,
          href: `${href}/${data.pid}`,
        })),
      );
      return filePath;
    },
    reset() {
      this.viewerReady = false;
      this.fileInfo = {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.file-detail {
  .file-detail-tabs {
    background: #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
    ::v-deep > .el-tabs__header {
      z-index: 10;
    }
    ::v-deep > .el-tabs__content {
      flex: 1;
      .el-tab-pane {
        height: 100%;
      }
    }
    .file-detail-container {
      height: 100%;
    }
    .file-remark-aside {
      overflow-y: auto;
    }
  }
  ::v-deep .el-tabs {
    .el-tabs__nav-wrap {
      padding: 0px 10px;
    }
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__item {
      height: 36px;
      text-align: center;
    }
    .el-tabs__item,
    .el-tabs__active-bar {
      width: 71px !important;
    }
  }
  .file-detail-container {
    display: flex;
  }
  .file-viewer-wrapper {
    flex: 1;
    ::v-deep .pdf-viewer-thumbnail {
      height: 100%;
    }
  }
}
</style>
