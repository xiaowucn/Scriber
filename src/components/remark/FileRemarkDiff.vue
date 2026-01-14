<template>
  <div class="file-remark-diff-wrapper" :style="`height: ${diffPanelHeight}px`">
    <div class="divider" ref="divider" title="按住可拖拽" v-drag></div>

    <div v-if="!showRemarkDiffResultPanel" class="select-file-panel">
      <h4>选择对比文件</h4>
      <div class="panel-content">
        <div class="select-item">
          <span>选择版本:</span>
          <el-select
            v-model="selectedFolderId"
            size="small"
            placeholder="请选择版本"
            @change="changeFolder">
            <el-option
              v-for="item in folderList"
              :key="item.id"
              :label="item.meta.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <template>
          <ul v-if="!showEmptyTips" class="file-list" v-loading="isLoading">
            <li
              v-for="(file, index) in treeFiles"
              :key="index"
              @click="openDiffResultPanel(file)">
              {{ file.name }}
            </li>
          </ul>
          <div v-else class="file-list-empty">
            该目录下，与对比文件相同schema的文件不存在
          </div>
        </template>
      </div>
      <i class="el-icon-error close-icon" @click="closeDiffPanel"></i>
    </div>
    <div v-else class="file-remark-container">
      <div class="file-viewer">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-back"
          circle
          class="back-btn"
          @click="goback"></el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-close"
          circle
          class="close-btn"
          @click="closeDiffPanel"></el-button>
        <file-pdf-viewer
          v-if="fileInfoReady"
          ref="fileViewerRemarkDiff"
          :fileId="fileId"
          :answerItemMap="answerItemMap"
          :fileInfo="fileInfo"
          :is-diff-mode="true"
          @viewer-ready="setViewerReady"></file-pdf-viewer>
      </div>
      <div class="file-remark-aside" v-loading="diffAnswerTreeLoading">
        <div
          class="search-and-collpase-answer"
          v-if="Object.keys(this.currentSchema).length > 0">
          <file-remark-tree-nodes-searcher></file-remark-tree-nodes-searcher>

          <toggle-answer-collapse-state @toggle="toggleAllAnswerCollapseState">
          </toggle-answer-collapse-state>
        </div>

        <file-remark-answer
          v-if="Object.keys(this.currentSchema).length > 0"
          :schema="currentSchema"
          :answerItemMap="answerItemMap"
          :mergedTreeData="diffMergedTreeData"
          :showDiffMarks="false"
          ref="remarkAnswer">
        </file-remark-answer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FilePdfViewer from './FilePdfViewerContainer';
import FileRemarkTreeNodesSearcher from './FileRemarkTreeNodesSearcher';
import ToggleAnswerCollapseState from '../ToggleAnswerCollapseState.vue';
import FileRemarkAnswer from './FileRemarkAnswer';
import { pdfParseStatus } from '@/store/constants';
import { baseURL } from '@/store/api/http';
import { fetchProject } from '@/store/api/project.api';
import { fetchFileList, fetchTreeFiles } from '@/store/api/detail.api';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { fetchDiffQuestion } from '@/store/api/remark.api';
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';

export default {
  name: 'file-remark-diff',
  components: {
    FilePdfViewer,
    FileRemarkAnswer,
    FileRemarkTreeNodesSearcher,
    ToggleAnswerCollapseState,
  },
  props: {
    qid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      viewerReady: false,
      diffAnswerTreeLoading: false,
      answerItemMap: {},
      answerVersion: '',
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
      showRemarkDiffResultPanel: false,
      projectId: null,
      pTreeId: null,
      treeId: null,
      fileId: null,
      schemaId: null,
      standardQid: null,
      folderList: [],
      selectedFolderId: null,
      treeFiles: [],
      standardAnswer: {},
      showEmptyTips: false,
      diffPanelHeight: 0,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'originSchema',
      'currentSchema',
      'answer',
      'diffAnswer',
      'diffMergedTreeData',
    ]),
    ...mapGetters('detailModule', ['fileViewer']),
    thumbnailList() {
      return this.fileInfo.pageInfo.map((item) => ({
        page: item.page,
        href: `${baseURL}/plugins/fileapi/file/${this.fileId}/page/${item.page}`,
      }));
    },
  },
  directives: {
    drag(el, bindings, vnode) {
      el.onmousedown = () => {
        const winHeight = document.documentElement.clientHeight;
        const HeaderHeight = 90,
          FooterHeight = 100,
          DividerHeight = 4;
        document.onmousemove = (e) => {
          if (e.pageY <= HeaderHeight || e.pageY > winHeight - FooterHeight) {
            return;
          }
          vnode.context.diffPanelHeight = winHeight - e.clientY - DividerHeight;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
        };
      };
    },
  },
  created() {
    this.resetDiffPanelHeight();
    this.fetchFolders();
  },
  async beforeDestroy() {
    this.setDiffModeEnabled(false);
    this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', {});

    await this.$parent.fetchQuestion();
    this.$parent.initAnswerMap();
  },
  methods: {
    async init() {
      this.reset();
      try {
        this.diffAnswerTreeLoading = true;
        await RemarkTreeLoading.start();
        await this.getFileInfo();
        await this.fetchSchema();
        await this.fetchQuestion();
        await this.setCurrentSchema();
        await this.initAnswerMap();
        this.setDiffModeEnabled(true);
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.diffAnswerTreeLoading = false;
        RemarkTreeLoading.close();
        this.$store.commit('remarkModule/SET_ERROR_TIPS', []);
      }
    },
    resetDiffPanelHeight() {
      const windowHeight = document.body.clientHeight;
      this.diffPanelHeight = windowHeight / 2;
    },
    async openDiffResultPanel(file) {
      this.showRemarkDiffResultPanel = true;
      this.projectId = file.pid;
      this.treeId = file.tree_id;
      this.fileId = file.id;
      this.schemaId = file.molds[0];
      this.standardQid = file.questions[0].id;
      await this.init();
      this.fileInfo = {
        ...this.fileInfo,
        projectId: this.projectId,
        treeId: this.treeId,
        fileId: this.fileId,
        schemaId: this.schemaId,
        qid: this.qid,
        fileName: file.name,
      };
    },
    async goback() {
      try {
        await RemarkTreeLoading.start();
        this.diffAnswerTreeLoading = true;
        this.showRemarkDiffResultPanel = false;
        this.setDiffModeEnabled(false);
        await this.$parent.reloadQuestion();
      } catch (error) {
        console.log(error);
      } finally {
        RemarkTreeLoading.close();
        this.diffAnswerTreeLoading = false;
      }
    },
    setDiffModeEnabled(enabled) {
      this.$store.commit('remarkModule/SET_REMARK_DIFF_OPEN_STATUS', enabled);
    },
    async fetchFolders() {
      try {
        this.isLoading = true;
        const res = await fetchProject(this.$route.query.projectId);
        this.rTreeId = res.data.rtree_id;
        const resp = await fetchFileList(this.rTreeId);
        this.folderList = resp.data.trees;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async changeFolder(treeId) {
      try {
        this.isLoading = true;
        const res = await fetchTreeFiles(treeId, this.$route.query.schemaId);
        this.treeFiles = res.data.items.filter(
          (item) =>
            item.pdf_parse_status === pdfParseStatus.completed &&
            item.id !== Number(this.$route.query.fileId),
        );
        this.showEmptyTips = this.treeFiles.length === 0;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
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
      };

      this.fileInfoReady = true;
    },
    async getFilePath() {
      try {
        const filePathRes = await fetchFileList(this.treeId);
        const filePath = [
          { name: this.$text.file['总览'], href: '#/project' },
        ].concat(
          filePathRes.data.crumbs.map((path) => ({
            name: path.name,
            href: `#/project/${this.projectId || this.projectId}/tree/${
              path.id
            }`,
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
    async fetchSchema() {
      await this.$store.dispatch('remarkModule/fetchSchema', {
        id: this.schemaId,
      });
      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', this.originSchema);
    },
    async fetchQuestion() {
      const res = await fetchDiffQuestion(this.qid, this.standardQid);
      this.$store.commit('remarkModule/SET_DIFF_ANSWER', {
        items: res.data.standard_answer,
      });
      this.$store.commit('remarkModule/SET_CUSTOM_FIELD_ANSWER', {
        items: res.data.diff_answer.filter((item) => item.custom),
      });
      this.$store.commit('remarkModule/SET_DIFF_CUSTOM_FIELD_ANSWER', {
        items: res.data.standard_answer.filter((item) => item.custom),
      });
      this.$store.commit('remarkModule/SET_USER_ANSWER', {
        items: res.data.diff_answer,
      });
    },
    async setCurrentSchema() {
      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', this.originSchema);
    },
    reset() {
      this.$store.commit('remarkModule/SET_QUESTION', {});
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
    async initAnswerMap() {
      await this.$store.dispatch('remarkModule/initAnswerTree');
      await this.$store.dispatch('remarkModule/initAnswerTree', true);
      this.answerItemMap = this.diffAnswer.items.reduce((obj, item) => {
        obj[item.key] = item;
        return obj;
      }, {});
    },
    toggleAllAnswerCollapseState() {
      this.$refs.remarkAnswer.toggleAllAnswerCollapseState();
    },
    closeDiffPanel() {
      this.$emit('close-diff-panel');
    },
    async reloadDiffAnswer() {
      await this.fetchQuestion();
      await this.initAnswerMap();
    },
  },
};
</script>

<style lang="scss" scoped>
.file-remark-diff-wrapper {
  display: flex;
  flex-flow: column;

  ::v-deep .document-toolbar,
  ::v-deep .image-viewer-header,
  ::v-deep .scale-operation,
  ::v-deep .draw-widget-switch,
  ::v-deep .node-item-buttons > .el-button,
  ::v-deep .node-item-buttons > i,
  ::v-deep .answer-create,
  ::v-deep .edit-icon,
  ::v-deep .answer-create-inline,
  ::v-deep .answer-item-close,
  ::v-deep .answer-item-operation-btn,
  ::v-deep .answer-index .el-checkbox {
    display: none;
  }
  ::v-deep .page-viewer {
    .viewer-layer-wrapper[data-layer-name='widget-layer'] {
      &.markable {
        pointer-events: none;
      }
    }
  }
  ::v-deep .file-name {
    top: 0;
  }
  ::v-deep .file-remark-aside {
    margin-top: 10px;
    .remark-tree-list {
      .answer-item {
        pointer-events: none;
        .user-answer-wrapper {
          pointer-events: auto;
        }
        .icon-placeholder {
          pointer-events: auto;
        }
      }
    }
  }
  .select-file-panel {
    position: relative;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    background: #ddd;
    h4 {
      margin-bottom: 15px;
      font-size: 14px;
      color: #333;
    }
    .panel-content {
      height: calc(100% - 65px);
      padding: 15px;
      background: #fff;
      .select-item {
        > span {
          margin-right: 10px;
        }
        .el-select {
          width: 25%;
        }
      }
    }
    .close-icon {
      position: absolute;
      top: 18px;
      right: 15px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .file-list {
      height: calc(100% - 42px);
      margin: 10px 0;
      overflow: auto;
      li {
        margin: 15px 0;
        list-style: none;
        color: #333;
        cursor: pointer;
        font-size: 14px;
        &:hover {
          color: #3f9eff;
        }
      }
    }
    .file-list-empty {
      margin-top: 20px;
      color: #959595;
      font-size: 14px;
    }
  }
}
.divider {
  border-top: 2px solid #cacaca;
  &:hover {
    cursor: ns-resize;
    border-color: #3f9eff;
  }
}
.file-remark-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.file-viewer {
  position: relative;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  .back-btn {
    position: absolute;
    top: 30px;
    left: 20px;
    z-index: 102;
  }
  .close-btn {
    position: absolute;
    top: 30px;
    right: 20px;
    z-index: 102;
  }
}

.file-remark-answer {
  height: calc(100% - 40px);
}

.file-remark-aside {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  min-width: 420px;
  overflow: hidden;
  ::v-deep .v-modal {
    z-index: 10000 !important;
  }
}
</style>
