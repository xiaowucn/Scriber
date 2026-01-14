<template>
  <div class="file-remark-container v2" v-loading="isLoading">
    <ul
      class="file-thumbnail"
      v-if="fileThumbnailVisible"
      @click.stop="jumpToViewerPage($event)">
      <li
        v-for="({ page, href }, index) in thumbnailList"
        :key="index"
        :class="{ active: page === fileThumbnailPageActived }">
        <img
          :src="href"
          :alt="index"
          :data-page="page"
          class="file-thumbnail-image"
          :style="{ minHeight: `${fileThumbnailHeight}px` }" />
        <span>{{ index + 1 }}</span>
      </li>
    </ul>
    <div class="file-viewer">
      <file-pdf-viewer
        v-if="fileInfoReady"
        ref="fileViewer"
        :fileId="fileId"
        :answerItemMap="answerItemMap"
        :fileInfo="fileInfo"
        @viewer-ready="setViewerReady"
        @toggleThumbnail="toggleThumbnail"
        @pageChanged="handlePageChanged"></file-pdf-viewer>
    </div>
    <div class="file-remark-aside" v-loading="!viewerReady">
      <el-tabs v-model="activeTabName" :stretch="true">
        <el-tab-pane label="合规判断" name="rulecheck">
          <rule-check></rule-check>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import FilePdfViewer from '@/components/remark/FilePdfViewerContainer';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { baseURL } from '@/store/api/http';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { fetchFileList } from '@/store/api/detail.api';
import RuleCheck from '@/components/RuleCheck';

export default {
  name: 'poc-details',
  components: {
    FilePdfViewer,
    RuleCheck,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  async created() {
    EventBus.$on('rulecheck-item-selected', this.rulecheckItemSelected);
    await this.init();
  },
  beforeDestroy() {
    EventBus.$off('rulecheck-item-selected', this.rulecheckItemSelected);
  },
  data() {
    return {
      isLoading: false,
      viewerReady: false,
      answerItemMap: {},
      fileInfo: {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      fileInfoReady: false,
      fileThumbnailVisible: false,
      fileThumbnailPageActived: 0,
      fileThumbnailHeight: 0,
      activeTabName: 'rulecheck',
    };
  },
  computed: {
    thumbnailList() {
      return this.fileInfo.pageInfo.map((item) => ({
        page: item.page,
        href: `${baseURL}/plugins/fileapi/file/${this.fileId}/page/${item.page}`,
      }));
    },
  },
  methods: {
    async init() {
      this.reset();
      try {
        await this.getFileInfo();
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getFileInfo() {
      const [filePath, pageInfo, outline] = await Promise.all([
        this.getFilePath(),
        this.getFilePageInfo(),
        this.getFileOutline(),
      ]);
      if (pageInfo && pageInfo[0]) {
        this.fileThumbnailHeight =
          (160 * pageInfo[0].height) / pageInfo[0].width;
      }

      this.fileInfo = {
        filePath,
        pageInfo,
        outline,
        ...this.$route.query,
      };

      this.fileInfoReady = true;
    },
    async getFilePath() {
      try {
        const filePathRes = await fetchFileList(this.$route.query.treeId);
        const filePath = [{ name: '总览', href: '#/project' }].concat(
          filePathRes.data.crumbs.map((path) => ({
            name: path.name,
            href: `#/project/${
              this.$route.params.projectId || this.$route.query.projectId
            }/tree/${path.id}`,
          })),
        );

        return filePath;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async getFilePageInfo() {
      try {
        const filePageInfoRes = await fetchFilePageInfo(this.fileId);
        const pageInfo = filePageInfoRes.data;

        return pageInfo;
      } catch (error) {
        console.error(error);
        return [
          {
            page: 0,
            width: 595,
          },
        ];
      }
    },
    async getFileOutline() {
      try {
        const fileOutlineRes = await fetchFileOutline(this.fileId);
        const outline = {
          items: fileOutlineRes.data ? fileOutlineRes.data.children : [],
        };

        return outline;
      } catch (error) {
        console.error(error);
        return { items: [] };
      }
    },
    async fetchFileList() {
      try {
        const treeId = this.$route.query.treeId;
        this.$store.commit('detailModule/SET_DIR_ID', treeId);
        await this.$store.dispatch('detailModule/fetchFileList');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },

    reset() {
      this.fileInfoReady = false;
      this.fileInfo = {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      };
    },
    setViewerReady() {
      this.viewerReady = true;
    },
    async toggleThumbnail() {
      this.fileThumbnailVisible = !this.fileThumbnailVisible;

      if (this.fileThumbnailVisible) {
        await this.$nextTick();
        this.jumpToThumbnailPage();
      }
    },
    jumpToViewerPage({ target }) {
      const page = Number(target.dataset.page);
      if (!Number.isNaN(page) && page >= 0) {
        this.fileThumbnailPageActived = page;
        this.$refs.fileViewer.scrollToPage(page + 1);
      }
    },
    jumpToThumbnailPage() {
      const imageElement = document.querySelector(
        `.file-thumbnail-image[data-page="${this.fileThumbnailPageActived}"]`,
      );

      if (imageElement) {
        imageElement.scrollIntoView({ block: 'center' });
      }
    },
    handlePageChanged(page) {
      const needJump = page !== this.fileThumbnailPageActived;
      this.fileThumbnailPageActived = page;

      if (this.fileThumbnailVisible && needJump) {
        this.jumpToThumbnailPage();
      }
    },
    rulecheckItemSelected(ruleItem) {
      const boxesInfo = ruleItem.detail.position;
      if (!boxesInfo.data || boxesInfo.data.length === 0) {
        this.$refs.fileViewer.resetWidgets();
        return;
      }
      const answerItemData = {
        schemaNode: null,
        schema: {
          data: {
            label: boxesInfo.label,
          },
        },
        data: boxesInfo.data[0],
      };
      EventBus.$emit('answer-item-selected', answerItemData);
    },
  },
};
</script>

<style lang="scss" scoped>
.file-remark-container.v2 {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  ::v-deep .header-pagebar {
    .page-input {
      width: 100px;
    }
    i {
      line-height: 43px;
    }
  }
}

.file-viewer {
  position: relative;
  flex: 1;
  height: 100vh;
  overflow: hidden;
}

.el-tabs__content {
  height: calc(100vh - 50px);
  overflow-y: auto;
}

.file-remark-aside {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  min-width: 420px;
  overflow-y: auto;
  ::v-deep .v-modal {
    z-index: 10000 !important;
  }
  ::v-deep .el-tabs__header {
    position: sticky;
    top: 0;
    z-index: 4;
    background: #fff;
  }
}

.file-thumbnail {
  padding: 40px;
  width: 182px;
  height: calc(100vh - 80px);
  overflow-x: hidden;
  overflow-y: scroll;
  list-style: none;

  li {
    padding: 10px;
    width: 160px;
    min-width: 160px;
    margin-bottom: 20px;
    border: 1px solid #eee;

    &.active {
      background-color: #eee;

      img {
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
      }
    }
  }

  img {
    width: 100%;
    background-color: #fff;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  }

  span {
    display: block;
    margin-top: 10px;
    width: 100%;
    line-height: 16px;
    text-align: center;
    font-size: 14px;
  }
}
</style>
