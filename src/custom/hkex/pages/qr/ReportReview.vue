<template>
  <el-container class="checking-details-container">
    <download-file-loading
      v-if="showDownloadLoading"
      :document-size="documentSize"
      :download-speed="downloadSpeed"
      :download-remaining-time="downloadRemainingTime"
      :download-progress="downloadProgress"></download-file-loading>
    <el-aside :width="pdfAsideWidth">
      <pdf-viewer
        v-if="documentData"
        ref="pdfViewer"
        :key="fileId"
        :document-data="documentData"
        :document-page-info="documentPageInfo"
        :annotation-disabled="annotationDisabled"
        @document-ready="onDocumentReady"
        @page-rendered="onPageRendered"
        @annotation-rendered="onAnnotationRendered"
        @annotation-drawed="createAnswer"
        @annotation-clicked="createAnswer"
        @table-annotation-cell-clicked="onTableAnnotationCellClicked"
        @annotation-mode-changed="onAnnotationModeChanged"
        @go-back="goback"></pdf-viewer>
      <div v-if="fileInfo" class="file-info">
        {{ fileInfo.year }} - {{ fileInfo.doc_type_name }}
      </div>
    </el-aside>
    <div
      class="gutter-horizontal ra-gutter-horizontal"
      v-dragHorizontal="{
        leftMinWidth: 550,
        rightMinWidth: 550,
        isDragPdfViewer: true,
      }"></div>
    <el-main>
      <el-tabs
        v-model="activeTabName"
        :stretch="true"
        :before-leave="handleTabSwitch"
        @tab-click="tabClicked">
        <el-tab-pane label="Disclosure Checking" name="disclosure-checking">
          <disclosure-checking
            v-if="activeTabName === 'disclosure-checking'"
            ref="disclosureChecking"
            :dc-qid="dcQid"
            @data-ready="onDataReady"
            @jump-to-answer-data="jumpToAnswerData"
            @clear-annotation="clearAnnotations">
          </disclosure-checking>
        </el-tab-pane>
        <el-tab-pane label="Ratio Checking" name="ratio-checking">
          <ratio-checking
            v-if="activeTabName === 'ratio-checking'"
            ref="ratioChecking"
            @switch-pdf="switchPdf"
            @jump-to-answer-data="jumpToAnswerData"
            @clear-annotation="clearAnnotations">
          </ratio-checking>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';
import PdfViewer from '../../components/PdfViewer.vue';
import DisclosureChecking from './ReportReviewDisclosureChecking.vue';
import RatioChecking from './ReportReviewRatioChecking.vue';
import DownloadFileLoading from '../../components/DownloadFileLoading';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';
import { checkUnsubmitAnswer } from '../../common/utils';

export default {
  name: 'results-announcement-checking-details',
  components: {
    PdfViewer,
    DownloadFileLoading,
    DisclosureChecking,
    RatioChecking,
  },
  mixins: [ReportReviewMixin],
  props: {
    dcQid: {
      type: Number,
      required: true,
    },
    pdfAsideWidth: {
      type: String,
      required: false,
      default: '50%',
    },
  },
  data() {
    return {
      fileId: null,
      fileInfo: null,
      activeTabName: 'disclosure-checking',
      switchFileCallback: null,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    isDisclosureChecking() {
      return this.activeTabName === 'disclosure-checking';
    },
    isRadioChecking() {
      return this.activeTabName === 'ratio-checking';
    },
    currentTab() {
      if (this.isDisclosureChecking) {
        return this.$refs.disclosureChecking;
      }

      if (this.isRadioChecking) {
        return this.$refs.ratioChecking;
      }

      return null;
    },
  },
  watch: {
    '$route.params.qid'() {
      this.init();
    },
    dataReady() {
      if (this.isDisclosureChecking) {
        if (this.dataReady && this.documentReady) {
          this.$refs.disclosureChecking.showFirstAnswerLocation();
        }
      }
    },
    documentReady() {
      if (this.isDisclosureChecking) {
        if (this.dataReady && this.documentReady) {
          this.$refs.disclosureChecking.showFirstAnswerLocation();
        }
      }

      if (this.isRadioChecking) {
        if (this.documentReady) {
          if (this.switchFileCallback) {
            this.switchFileCallback();
            this.switchFileCallback = null;
          }
        }
      }
    },
  },

  created() {
    EventBus.$on('predict-position-item', this.showPredictPosition);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('predict-position-item', this.showPredictPosition);
  },
  methods: {
    async init() {
      this.setActiveTabName();

      const fileId = Number(this.$route.query.fileId);
      if (fileId !== this.fileId) {
        this.switchPdf({ fileId });
      }
    },
    setActiveTabName() {
      if (this.$route.query.ratio) {
        this.activeTabName = 'ratio-checking';
      }
    },
    async switchPdf({ fileId, fileInfo, callback }) {
      this.fileId = fileId;
      this.fileInfo = fileInfo;

      if (callback) {
        this.switchFileCallback = callback;
      }

      await this.switchFile(fileId);
    },
    tabClicked(tab) {
      if (tab.name !== 'ratio-checking') {
        this.fileInfo = null;
      }
      this.clearAnnotations();
    },
    handleTabSwitch() {
      if (checkUnsubmitAnswer()) {
        return false;
      }

      return true;
    },
    goback() {
      window.history.go(-1);
    },
    async createAnswer(boxData) {
      if (this.currentAnnotationMode !== 'table') {
        this.clearAnnotations();
      }

      try {
        const boxes = await this.getAnnotationBoxData(boxData);
        this.currentTab.createAnswer(boxes);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.deleteDrawedAnnotation();
      }
    },
    async showPredictPosition(frame) {
      this.clearAnnotations();
      this.jumpToAnswerData(frame);
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';

.checking-details-container {
  position: relative;
  .el-aside {
    position: relative;
    .file-info {
      position: absolute;
      top: 31px;
      left: 0;
      z-index: 100;
      width: 100%;
      padding: 3px 10px;
      background: rgba($--color-primary, 0.7);
      color: $--color-white;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      box-sizing: border-box;
    }
  }

  ::v-deep .el-main {
    margin-top: -60px;
    padding: 0;
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__item {
          height: 33px;
          line-height: 33px;
          font-weight: bold;
        }
      }
      .el-tabs__content {
        position: inherit;
      }
    }
  }

  .ra-gutter-horizontal {
    margin-top: -60px;
  }
  ::v-deep .rule-description {
    display: flex;
    flex-flow: column;
    max-height: 50vh;
    overflow-y: auto;
  }
}
</style>
