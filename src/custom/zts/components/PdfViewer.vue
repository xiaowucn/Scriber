<template>
  <file-pdf-viewer-container
    ref="pdfViewerContainer"
    v-if="viewerReady"
    :file-id="fileId"
    :file-doc-type="fileDocType"
    :file-info="fileInfo"
    :is-show-file-info="false"
    :can-continuous-draw-widget="canContinuousDrawWidget"
    @draw-widget="handleDrawWidget"
    @drawed-widget="handleDrawedWidget"
    @pages-loaded="onPagesLoaded"
    @page-rendered="onPageRendered"
    @update-answer-selected="updateAnswerSelected" />
</template>

<script>
import EventBus from '@/components/remark/remark-tree/EventBus';
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';

export default {
  name: 'pdf-viewer',
  components: { FilePdfViewerContainer },
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
  data() {
    return {
      fileInfo: {
        pageInfo: [],
        outline: [],
      },
      viewerReady: false,
      selectedSchemaNode: '',
      selectedAnswerItem: '',
      isAnswerItemSelected: false,
      canSelectAnswerItemWhenPageRender: true,
    };
  },
  watch: {
    fileId() {
      this.init();
    },
  },
  created() {
    this.init();
    EventBus.$on('page-change', this.onPageChange);
    EventBus.$on('pdf-viewer-schema-node-selected', this.setSelectedSchemaNode);
    EventBus.$on('pdf-viewer-answer-item-selected', this.setSelectedAnswerItem);
  },
  beforeDestroy() {
    EventBus.$off('page-change', this.onPageChange);
    EventBus.$off(
      'pdf-viewer-schema-node-selected',
      this.setSelectedSchemaNode,
    );
    EventBus.$off(
      'pdf-viewer-answer-item-selected',
      this.setSelectedAnswerItem,
    );
  },
  methods: {
    async init() {
      this.reset();
      try {
        await this.fetchFileInfo();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.viewerReady = true;
        this.$emit('update-loading', false);
      }
    },
    async fetchFileInfo() {
      const fileInfo = {};
      const [pageInfo, outline] = await Promise.all([
        this.getFilePageInfo(),
        this.getFileOutline(),
      ]);
      fileInfo.pageInfo = pageInfo;
      fileInfo.outline = outline;
      this.fileInfo = fileInfo;
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
    updateAnswerSelected(value) {
      this.isAnswerItemSelected = value;
    },
    onPageChange() {
      if (this.isAnswerItemSelected) {
        this.canSelectAnswerItemWhenPageRender = false;
      }
    },
    onPagesLoaded() {
      this.$nextTick(() => {
        if (this.selectedSchemaNode) {
          EventBus.$emit('schema-node-selected', this.selectedSchemaNode);
        }
      });
    },
    onPageRendered() {
      this.$nextTick(() => {
        if (this.selectedAnswerItem && this.canSelectAnswerItemWhenPageRender) {
          EventBus.$emit('answer-item-selected', this.selectedAnswerItem);
        }
      });
    },
    setSelectedSchemaNode(node) {
      this.selectedSchemaNode = node;
      EventBus.$emit('schema-node-selected', this.selectedSchemaNode);
    },
    setSelectedAnswerItem(item) {
      this.selectedAnswerItem = item;
      EventBus.$emit('answer-item-selected', this.selectedAnswerItem);
    },
    reset() {
      this.fileInfo = {
        pageInfo: [],
        outline: [],
      };
      this.viewerReady = false;
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
