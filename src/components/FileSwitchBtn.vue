<template>
  <div
    class="navigate-btns"
    :style="{
      display:
        $isAllowed('showFileScenario') || isInspectPage ? 'none' : 'flex',
    }">
    <el-button
      size="mini"
      icon="el-icon-d-arrow-left"
      class="btn-prev"
      :disabled="prevQuestionButtonDisabled"
      @click="openPrevOrNextFile('prev')">
      {{ prevQuestionButtonDisabled ? '当前页最前' : '上一篇' }}
    </el-button>
    <el-button
      size="mini"
      :disabled="nextQuestionButtonDisabled"
      @click="openPrevOrNextFile('next')">
      {{ nextQuestionButtonDisabled ? '当前页最后' : '下一篇' }}
      <i class="el-icon-d-arrow-right"></i>
    </el-button>
  </div>
</template>

<script>
import _ from 'lodash';
import { pdfParseStatus } from '../store/constants';
import { mapGetters } from 'vuex';
import FileMarkableMixin from './mixins/FileMarkableMixin';
import { EventBus } from '../utils/eventBus';
export default {
  name: 'file-switch-btn',
  mixins: [FileMarkableMixin],
  props: {
    customRemarkName: {
      type: String,
      default: 'remark',
    },
    qid: {
      type: Number,
      required: false,
    },
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('nafmiiModule', ['tasks']),
    markableQuestions() {
      const markableQuestions = [];
      this.files.forEach((file) => {
        if (file.questions) {
          file.questions.forEach((question) => {
            if (
              file.pdf_parse_status === pdfParseStatus.completed &&
              !_.isNil(question.mold)
            ) {
              markableQuestions.push(question);
            }
          });
        }
      });
      return markableQuestions;
    },
    markableFiles() {
      return this.files.filter(
        (file) =>
          !file.isDir &&
          (!_.isEmpty(file.questions) || file.task_type === 'judge'),
      );
    },
    currentQid() {
      return this.qid || Number(this.$route.params.qid);
    },
    currentFileId() {
      return Number(this.$route.query.fileId);
    },
    currentFileIndex() {
      return this.markableFiles.findIndex((file) => {
        return file.id === this.currentFileId;
      });
    },
    currentQuestionIndex() {
      return this.markableQuestions.findIndex((question) => {
        return question.id === this.currentQid;
      });
    },
    prevQuestionButtonDisabled() {
      if (this.isInspectPage) {
        return this.currentFileIndex === 0;
      }
      return this.currentQuestionIndex === 0;
    },
    nextQuestionButtonDisabled() {
      if (this.isInspectPage) {
        return this.currentFileIndex === this.markableFiles.length - 1;
      }
      return this.currentQuestionIndex === this.markableQuestions.length - 1;
    },
    files() {
      if (this.$platform.isNafmiiEnv() && this.tasks.files.length > 0) {
        return this.tasks.files;
      }
      return this.fileViewer.files;
    },
    isInspectPage() {
      return ['inspect', 'inspectBase64Encoded'].includes(this.$route.name);
    },
  },
  watch: {
    prevQuestionButtonDisabled() {
      this.broadcastButtonStates();
    },
    nextQuestionButtonDisabled() {
      this.broadcastButtonStates();
    },
  },
  mounted() {
    EventBus.$on('file-switch', this.openPrevOrNextFile);
    EventBus.$on('file-switch-state-request', this.broadcastButtonStates);
    this.$nextTick(() => {
      this.broadcastButtonStates();
    });
  },
  beforeDestroy() {
    EventBus.$off('file-switch', this.openPrevOrNextFile);
    EventBus.$off('file-switch-state-request', this.broadcastButtonStates);
  },
  methods: {
    openPrevOrNextFile(direction) {
      let file = {};
      let question = {};

      if (direction === 'prev') {
        const prevQuestionIndex = Math.max(this.currentQuestionIndex - 1, 0);
        const prevQuestion = this.markableQuestions[prevQuestionIndex];

        file = this.files.find((file) => {
          return file.questions?.some(
            (question) => question.id === prevQuestion.id,
          );
        });
        if (this.isInspectPage) {
          file = this.markableFiles[this.currentFileIndex - 1];
        }
        question = prevQuestion;
      } else {
        const nextQuestionIndex = Math.min(
          this.currentQuestionIndex + 1,
          this.markableQuestions.length - 1,
        );
        const nextQuestion = this.markableQuestions[nextQuestionIndex];
        file = this.files.find((file) => {
          return file.questions?.some(
            (question) => question.id === nextQuestion.id,
          );
        });
        if (this.isInspectPage) {
          file = this.markableFiles[this.currentFileIndex + 1];
        }
        question = nextQuestion;
      }

      if (this.$platform.isCiticsTGEnv() && this.$route.meta.isCustom) {
        const routeParams = {
          name: 'fileRemark',
          params: { fileId: file.id },
        };
        this.$router.replace(routeParams);
        return;
      }

      if (this.isInspectPage) {
        this.previewFileByInspect(file, 'replace');
        return;
      }

      this.previewFileByRemark(
        { ...file, qid: question.id, mold: question.mold },
        'replace',
        this.customRemarkName,
      );
    },
    broadcastButtonStates() {
      // 广播按钮状态给Toolbar组件
      const states = {
        prevDisabled: this.prevQuestionButtonDisabled,
        nextDisabled: this.nextQuestionButtonDisabled,
      };
      EventBus.$emit('file-switch-state-update', states);
    },
  },
};
</script>

<style lang="scss" scoped>
.navigate-btns {
  display: none !important;
}
</style>
