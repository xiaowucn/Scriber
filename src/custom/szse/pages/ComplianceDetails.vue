<template>
  <div class="compliance-details-wrapper" v-loading="isLoading">
    <div class="file-viewer">
      <div class="options">
        <el-button type="text" icon="el-icon-back" @click="goback"
          >返回</el-button
        >
        <h4>
          <span>{{ $route.query.stockCode }}</span>
          <span>{{ $route.query.stockName }}</span>
        </h4>
      </div>
      <file-pdf-viewer
        v-if="fileInfoReady"
        ref="fileViewer"
        :fileId="fileId"
        :answerItemMap="answerItemMap"
        :fileInfo="fileInfo"></file-pdf-viewer>
    </div>
    <div class="file-aside">
      <rule-check @open-extra-document="openExtraDocument"></rule-check>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="100%"
      top="0"
      :modal="false"
      custom-class="extra-documents"
      :close-on-click-modal="false"
      @close="closeDialog">
      <file-pdf-viewer
        v-if="extraFileInfoReady"
        ref="extraFileViewer"
        :defaultPageScale="1"
        :answerItemMap="{}"
        :fileId="extraFileInfo.fileId"
        :fileInfo="extraFileInfo"></file-pdf-viewer>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import FilePdfViewer from '@/components/remark/FilePdfViewerContainer';
import RuleCheck from '../components/RuleCheck';

export default {
  name: 'compliance-details',
  components: {
    FilePdfViewer,
    RuleCheck,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    qid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      answerItemMap: {},
      fileInfo: {
        fileName: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      extraFileInfo: {
        fileId: null,
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      extraFileInfoReady: false,
      fileInfoReady: false,
      dialogVisible: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['question']),
  },
  created() {
    EventBus.$on('rulecheck-item-selected', this.rulecheckItemSelected);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('rulecheck-item-selected', this.rulecheckItemSelected);
  },
  methods: {
    async init() {
      try {
        this.getFileInfo(this.fileId);
        await this.fetchQuestion();
        this.initAnswerMap();
      } catch (error) {
        console.error(error);
      }
    },
    async getFileInfo(fileId, isExtra) {
      const [pageInfo, outline] = await Promise.all([
        this.getFilePageInfo(fileId),
        this.getFileOutline(fileId),
      ]);
      if (pageInfo && pageInfo[0]) {
        this.fileThumbnailHeight =
          (160 * pageInfo[0].height) / pageInfo[0].width;
      }

      this.fileInfo = {
        ...this.fileInfo,
        pageInfo,
        outline,
        ...this.$route.query,
      };

      this.fileInfoReady = true;

      if (isExtra) {
        this.extraFileInfo = {
          fileId,
          filePath: [],
          pageInfo,
          outline,
        };
        this.extraFileInfoReady = true;
      }
    },
    async getFilePageInfo(fileId) {
      try {
        const filePageInfoRes = await fetchFilePageInfo(fileId);
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
    async getFileOutline(fileId) {
      try {
        const fileOutlineRes = await fetchFileOutline(fileId);
        const outline = {
          items: fileOutlineRes.data ? fileOutlineRes.data.children : [],
        };

        return outline;
      } catch (error) {
        console.error(error);
        return { items: [] };
      }
    },
    async fetchQuestion() {
      await this.$store.dispatch('remarkModule/fetchQuestion', {
        qid: this.qid,
      });
    },
    async initAnswerMap() {
      this.answerItemMap = this.question.answer.userAnswer.items.reduce(
        (obj, item) => {
          obj[item.key] = item;
          return obj;
        },
        {},
      );
    },
    rulecheckItemSelected(ruleItem) {
      if (ruleItem.schema_cols.length === 0) {
        this.$refs.fileViewer.resetWidgets();
        return;
      }
      const key = JSON.stringify(ruleItem.schema_cols);
      const answerItem = this.answerItemMap[key];
      const answerItemData = {
        schemaNode: key,
        schema: answerItem.schema,
        data: answerItem.data[0],
      };
      EventBus.$emit('answer-item-selected', answerItemData);
    },
    async openExtraDocument(document) {
      this.dialogVisible = true;
      await this.getFileInfo(document.file_id, true);
      const answerItemData = {
        schemaNode: '',
        schema: {
          data: {
            label: document.label,
          },
        },
        data: document.data[0],
      };
      const extraFileViewer = this.$refs.extraFileViewer;
      extraFileViewer.readyHandler();
      extraFileViewer.selectAnswerItem(answerItemData);
    },
    closeDialog() {
      this.dialogVisible = false;
      this.extraFileInfoReady = false;
    },
    goback() {
      this.$router.push({ name: 'complianceProject' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/reset-pdf-viewer.scss';
.compliance-details-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .file-viewer {
    position: relative;
    width: 55%;
    padding-top: 40px;
    .options {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 10px;
      background: #fff;
      z-index: 999;
      box-sizing: border-box;
      border-right: 1px solid #dbdbdb;
      border-bottom: 1px solid #dbdbdb;
      .el-button {
        margin-right: 30px;
      }
      h4 {
        color: #6a6a6a;
        font-size: 14px;
        > span:first-child {
          margin-right: 20px;
        }
      }
    }
    ::v-deep .draw-widget-switch {
      display: none;
    }
  }
  .file-aside {
    width: 45%;
  }
  ::v-deep .el-dialog__wrapper {
    left: auto;
    width: 45%;
    .extra-documents {
      position: absolute;
      top: 0;
      right: 0;
      height: 100vh;
      overflow: hidden;
      .el-dialog__header {
        padding: 5px 20px;
        .el-dialog__headerbtn {
          top: 13px;
        }
      }
      .el-dialog__body {
        .file-pdf-viewer {
          .image-viewer-header,
          .scale-operation,
          .draw-widget-switch {
            display: none !important;
          }
        }
      }
    }
  }
}
</style>
