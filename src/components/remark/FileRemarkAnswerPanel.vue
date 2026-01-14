<template>
  <div class="remark-answer-panel">
    <file-remark-table-answer
      v-show="tableRemarkEnable"
      :qid="qid"
      @close="closeTableRemark"></file-remark-table-answer>

    <file-remark-batch-edit
      v-show="remarkBatchEditEnable"
      @close="closeRemarkBatchEdit"></file-remark-batch-edit>

    <file-remark-chapter-assist
      v-show="chapterAssistEnable"
      @close="closeChapterAssist">
    </file-remark-chapter-assist>

    <file-remark-custom-schema-node
      v-show="customSchemaNodeEnable"
      @close="closeCustomSchemaNode">
    </file-remark-custom-schema-node>

    <div v-if="mergedTreeData.error" class="remark-answer-error">
      {{ $text.schema['Schema'] }}字段和答案不匹配，请检查！
    </div>
    <file-remark-answer
      v-else-if="currentSchema && Object.keys(currentSchema).length > 0"
      :schema="currentSchema"
      :schemaId="schemaId"
      :answerItemMap="answerItemMap"
      :mergedTreeData="mergedTreeData"
      :showDiffMarks="!readOnly"
      ref="remarkAnswer">
    </file-remark-answer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import FileRemarkAnswer from './FileRemarkAnswer';
import FileRemarkTableAnswer from './FileRemarkTableAnswer.jsx';
import FileRemarkBatchEdit from './FileRemarkBatchEdit.jsx';
import FileRemarkChapterAssist from './FileRemarkChapterAssist';
import FileRemarkCustomSchemaNode from './FileRemarkCustomSchemaNode.jsx';
import EventBus from './remark-tree/EventBus';

export default {
  name: 'file-remark-answer-panel',
  components: {
    FileRemarkAnswer,
    FileRemarkTableAnswer,
    FileRemarkBatchEdit,
    FileRemarkChapterAssist,
    FileRemarkCustomSchemaNode,
  },
  props: {
    schemaId: {
      type: Number,
      required: false,
    },
    qid: {
      type: Number,
      required: true,
    },
    answerItemMap: {
      type: Object,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    EventBus.$on('create-answer-item', this.createAnswer);
    EventBus.$on('open-table-remark', this.openTableRemark);
    EventBus.$on('open-batch-edit', this.openRemarkBatchEdit);
    EventBus.$on('open-chapter-assist-remark', this.openChapterAssist);
    EventBus.$on('open-custom-schema-node', this.openCustomSchemaNode);
  },
  beforeDestroy() {
    EventBus.$off('create-answer-item', this.createAnswer);
    EventBus.$off('open-table-remark', this.openTableRemark);
    EventBus.$off('open-batch-edit', this.openRemarkBatchEdit);
    EventBus.$off('open-chapter-assist-remark', this.openChapterAssist);
    EventBus.$off('open-custom-schema-node', this.openCustomSchemaNode);
  },
  data() {
    return {
      tableRemarkEnable: false,
      remarkBatchEditEnable: false,
      chapterAssistEnable: false,
      customSchemaNodeEnable: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['currentSchema', 'mergedTreeData']),
  },
  methods: {
    createAnswer(data) {
      if (this.readOnly) {
        return;
      }
      if (this.tableRemarkEnable) {
        EventBus.$emit('create-table-answer-item', data);
      } else if (this.remarkBatchEditEnable) {
        EventBus.$emit('create-batch-edit-answer-item', data);
      } else if (this.chapterAssistEnable) {
        EventBus.$emit('create-chapter-assist-answer-item', data);
      } else {
        EventBus.$emit('create-remark-answer-item', data);
      }
    },
    openTableRemark() {
      this.tableRemarkEnable = true;
      this.resetPdfViewer();
    },
    closeTableRemark() {
      this.tableRemarkEnable = false;
    },
    openRemarkBatchEdit() {
      this.remarkBatchEditEnable = true;
      this.resetPdfViewer();
    },
    closeRemarkBatchEdit() {
      this.remarkBatchEditEnable = false;
    },
    openChapterAssist() {
      this.chapterAssistEnable = true;
      this.resetPdfViewer();
    },
    closeChapterAssist() {
      this.chapterAssistEnable = false;
    },
    openCustomSchemaNode() {
      this.customSchemaNodeEnable = true;
    },
    closeCustomSchemaNode() {
      this.customSchemaNodeEnable = false;
    },
    toggleAllAnswerCollapseState() {
      this.$refs.remarkAnswer.toggleAllAnswerCollapseState();
    },
    resetPdfViewer() {
      EventBus.$emit('remove-all-frames');
      EventBus.$emit('reset-node-selected');
    },
  },
};
</script>
<style lang="scss" scoped>
.remark-answer-panel {
  position: relative;
  flex: 1;
  overflow: hidden;

  .remark-table-container,
  .remark-batch-edit,
  .remark-title-content {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 4;
  }
  .remark-answer-error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #bbb;
  }
}
</style>
