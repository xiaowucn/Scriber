<template>
  <div class="container" v-loading="loading">
    <template v-if="documents.length > 0">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          :label="doc.file_name"
          :name="doc.file_name"
          v-for="(doc, index) in documents"
          :key="index"></el-tab-pane>
      </el-tabs>
      <pdf-viewer
        v-if="documentData"
        ref="pdfViewer"
        :key="fileId"
        :document-data="documentData"
        :annotation-disabled="true"></pdf-viewer>
    </template>
    <div v-else class="empty">No additional documents found.</div>
  </div>
</template>

<script>
import PdfViewer from '../../components/PdfViewer.vue';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';

export default {
  name: 'results-announcement-additional-document',
  components: { PdfViewer },
  mixins: [ReportReviewMixin],
  data() {
    return {
      loading: false,
      activeName: '',
      documents: [],
      fileId: -1,
      fileInfo: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.isExternalDocument = true;
      await this.getExternalDocuments();
      const currentFile = this.documents[0];
      if (currentFile) {
        this.activeName = currentFile.file_name;
        this.fileId = currentFile.file_id;
        this.switchFile(this.fileId);
      }
    },
    async getExternalDocuments() {
      try {
        this.loading = true;
        const res = await this.$store.dispatch(
          'hkexModule/fetchQuestionRatioCheck',
          {
            qid: Number(this.$route.params.qid),
          },
        );
        this.documents = res.detail.ratio3.ai_ext_docs || [];
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    handleTabClick(tab) {
      const index = Number(tab.index);
      this.switchFile(this.documents[index].file_id);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 5px 20px 0 20px;
  .pdfAppContainer {
    height: calc(100% - 55px);
    ::v-deep .back-container,
    ::v-deep .annotation-toolbar {
      display: none;
    }
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 32px;
    color: #ccc;
  }
}
</style>
