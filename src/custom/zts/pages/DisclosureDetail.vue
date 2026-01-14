<template>
  <div class="disclosure-detail" @click.capture="handleDisclosureDetailClick">
    <div class="left" v-loading="leftViewerLoading">
      <disclosure-detail-header v-if="isShowHeader" />
      <pdf-viewer
        v-if="isShowPdfViewer"
        ref="pdfViewerRef"
        :file-id="mainFile.id"
        :file-doc-type="mainFile.docType"
        :can-continuous-draw-widget="canContinuousDrawWidget"
        @draw-widget="handleDrawWidget"
        @drawed-widget="handleDrawedWidget"
        @update-loading="updateLeftViewerLoading" />
      <diff-file-popup
        v-if="isShowDiffFilePopup"
        ref="diffFilePopupRef"
        :file-id="diffFile.id"
        :file-doc-type="diffFile.docType"
        :can-continuous-draw-widget="canContinuousDrawWidget"
        @draw-widget="handleDrawWidget"
        @drawed-widget="handleDrawedWidget"
        @close="closeDiffFilePopup" />
    </div>
    <div class="right" v-if="isShowRightViewer" v-loading="rightViewerLoading">
      <template v-if="isShowDisclosureAnswer">
        <disclosure-rule-list :answerResults="answerResults" />
        <div class="answer-header">
          <el-header class="disclosure-header" height="50px">
            <span>{{ isShowConsistency ? '一致性判断' : '提取字段' }}</span>
            <el-button
              class="sumbit"
              @click="handleSubmitAnswer"
              :disabled="!canSubmitAnswer"
              :loading="submitAnswerLoading"
              >保存数据</el-button
            >
          </el-header>
        </div>
        <div class="answer-content">
          <disclosure-consistency v-if="isShowConsistency" />
          <disclosure-extract-field v-else />
          <disclosure-check-result />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';
import DisclosureDetailHeader from '../components/DisclosureDetailHeader.vue';
import DisclosureRuleList from '../components/DisclosureRuleList.vue';
import DisclosureExtractField from '../components/DisclosureExtractField.vue';
import DisclosureConsistency from '../components/DisclosureConsistency.vue';
import DisclosureCheckResult from '../components/DisclosureCheckResult.vue';
import PdfViewer from '../components/PdfViewer';
import DiffFilePopup from '../components/DiffFilePopup';
import { getAllSchemaResults } from '../common/utils';
import { DISCLOSURE_RULES } from '../common/constant';

export default {
  name: 'disclosure-detail',
  components: {
    DiffFilePopup,
    DisclosureDetailHeader,
    DisclosureRuleList,
    DisclosureExtractField,
    DisclosureConsistency,
    DisclosureCheckResult,
    PdfViewer,
  },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      mainFile: {
        id: '',
        docType: '',
      },
      diffFile: {
        id: '',
        docType: '',
      },
      leftViewerLoading: true,
      rightViewerLoading: true,
      isShowRightViewer: true,
      isShowDiffFilePopup: false,
      submitAnswerLoading: false,
      canSubmitAnswer: false,
      answerResults: {},
      isDrawWidget: false,
      canContinuousDrawWidget: true,
    };
  },
  watch: {
    projectId() {
      this.reset();
      this.init();
    },
    currentRule() {
      this.resetAnswerResult();
    },
    answerResults() {
      if (!_.isEmpty(this.answerResults)) {
        this.canSubmitAnswer = true;
      }
    },
  },
  created() {
    this.init();
    EventBus.$on('answer-item-updated', this.answerItemUpdated);
    EventBus.$on('answer-item-removed', this.answerItemRemoved);
    EventBus.$on('diff-file-popup-viewed', this.viewDiffFile);
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    this.reset();
    EventBus.$off('answer-item-updated', this.answerItemUpdated);
    EventBus.$off('answer-item-removed', this.answerItemRemoved);
    EventBus.$off('diff-file-popup-viewed', this.viewDiffFile);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeRouteLeave(to, from, next) {
    if (!_.isEmpty(this.answerResults)) {
      next(false);
      setTimeout(() => {
        this.$confirm(
          `当前页面<span class="highlight-message">${this.currentRule}</span>有数据修改未保存，确认退出当前页面?`,
          '提示',
          {
            type: 'warning',
            dangerouslyUseHTMLString: true,
          },
        )
          .then(() => {
            next();
          })
          .catch(() => {
            next(false);
          });
      });
    } else {
      next();
    }
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    currentRule() {
      return this.detail.selectedRule.label;
    },
    schemaId() {
      return this.detail.project.default_molds[0];
    },
    isShowHeader() {
      return !_.isEmpty(this.detail.project) && !_.isEmpty(this.detail.files);
    },
    isShowPdfViewer() {
      return !!this.mainFile.id;
    },
    isShowDisclosureAnswer() {
      return !_.isEmpty(this.detail.mergedTreeData);
    },
    isShowConsistency() {
      return this.currentRule === '一致性比对';
    },
    answerItemMap() {
      const selectedSchemaResults = getAllSchemaResults(this.detail.results)[
        this.currentRule
      ];
      return selectedSchemaResults?.reduce((obj, item) => {
        if (item.answer) {
          obj[`${item.doc_type}${item.answer.key}`] = item.answer;
        }
        return obj;
      }, {});
    },
  },
  methods: {
    async init() {
      try {
        this.fetchFiles();
        this.fetchResults();
        await this.fetchProjects();
        await Promise.all([this.fetchSchema(), this.fetchRuleInfo()]);
        this.initResultsTree();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isShowRightViewer = this.isShowDisclosureAnswer;
        this.rightViewerLoading = false;
      }
    },
    async fetchProjects() {
      try {
        const params = { project_id: this.projectId };
        const projects = await this.$store.dispatch(
          'ztsDisclosureModule/fetchProjects',
          { searchParams: params },
        );
        const detailDisclosures = DISCLOSURE_RULES.reduce((acc, item) => {
          acc[item.label] = projects[0][item.key];
          return acc;
        }, {});
        this.$store.commit(
          'ztsDisclosureModule/SET_DETAIL_PROJECT',
          projects[0],
        );
        this.$store.commit(
          'ztsDisclosureModule/SET_DETAIL_DISCLOSURES_DATA',
          detailDisclosures,
        );
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchFiles() {
      try {
        const params = { project_ids: this.projectId };
        const data = await this.$store.dispatch(
          'ztsDisclosureModule/fetchFiles',
          { params },
        );
        this.$store.commit(
          'ztsDisclosureModule/SET_DETAIL_FILES',
          data[0].files,
        );
        this.mainFile = {
          id: this.detail.files[0].id,
          docType: this.detail.files[0].doc_type,
        };
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchResults() {
      try {
        await this.$store.dispatch('ztsDisclosureModule/fetchResults', {
          projectId: this.projectId,
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchRuleInfo() {
      try {
        const params = { mold_id: this.schemaId };
        await this.$store.dispatch('ztsDisclosureModule/fetchRuleInfo', params);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchSchema() {
      await this.$store.dispatch('ztsDisclosureModule/fetchSchema', {
        id: this.schemaId,
      });
    },
    async initResultsTree() {
      await this.$store.dispatch('ztsDisclosureModule/initResultsTree');
    },
    viewDiffFile(docType) {
      const id = this.detail.files.find((item) => item.doc_type === docType).id;
      this.diffFile = { id, docType };
      if (docType === this.mainFile.docType) {
        this.closeDiffFilePopup();
      } else {
        this.openDiffFilePopup();
      }
    },
    openDiffFilePopup() {
      this.isShowDiffFilePopup = true;
    },
    closeDiffFilePopup() {
      this.isShowDiffFilePopup = false;
    },
    updateLeftViewerLoading(value) {
      this.leftViewerLoading = value;
    },
    answerItemUpdated(answer) {
      this.saveAnswer('update', answer);
    },
    answerItemRemoved(answer) {
      this.saveAnswer('delete', answer);
    },
    async saveAnswer(type, answer) {
      const answerData = !_.isEmpty(this.answerResults)
        ? this.answerResults
        : {
            add: [],
            delete: [],
            update: [],
          };

      answer.answers.forEach((item) => {
        Object.keys(answerData).forEach((dataKey) => {
          answerData[dataKey] = answerData[dataKey].filter(
            (i) => !(i.fid === item.fid && i.key === item.key),
          );
        });
      });

      if (type === 'update') {
        answer.answers.forEach((item) => {
          const answerItemData =
            this.answerItemMap[`${answer.docType}${item.key}`];
          if (answerItemData) {
            answerData.update.push({
              ..._.pick(item, ['id', 'key', 'value', 'data', 'fid', 'name']),
              id: answerItemData.id,
            });
          } else {
            answerData.add.push({
              ..._.pick(item, [
                'key',
                'value',
                'data',
                'schema',
                'fid',
                'name',
              ]),
            });
          }
        });
      }
      if (type === 'delete') {
        answer.answers.forEach((item) => {
          const answerItemData =
            this.answerItemMap[`${answer.docType}${item.key}`];
          if (answerItemData) {
            answerData.delete.push({
              ..._.pick(answerItemData, ['id', 'key']),
              fid: item.fid,
            });
          }
        });
      }
      this.answerResults = answerData;
    },
    async handleSubmitAnswer() {
      try {
        this.submitAnswerLoading = true;
        const multipleDataNames = _.uniq(
          Object.values(this.answerResults)
            .flatMap((items) => items)
            .filter((item) => item.data && item.data.length > 1)
            .map((item) => item.name),
        );
        if (!_.isEmpty(multipleDataNames)) {
          this.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: `<span class="highlight-message">${multipleDataNames.join(
              '、',
            )}</span>存在多个值，无法重新判断，请删除多余值重试`,
            type: 'warning',
          });
          return;
        }
        Object.keys(this.answerResults).forEach((key) => {
          this.answerResults[key] = this.answerResults[key].map((item) => {
            const newItem = _.clone(item);
            delete newItem.name;
            return newItem;
          });
        });

        await this.$store.dispatch('ztsDisclosureModule/sendResults', {
          projectId: this.projectId,
          answerData: this.answerResults,
        });
        this.$notify({
          title: '成功',
          message: '数据已修改，已重新获取披露结果。',
          type: 'success',
        });
        await this.fetchProjects();
        await this.fetchResults();
        this.initResultsTree();
        this.resetAnswerResult();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitAnswerLoading = false;
      }
    },
    handleBeforeUnload(e) {
      if (!_.isEmpty(this.answerResults)) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
    resetAnswerResult() {
      this.answerResults = {};
      this.canSubmitAnswer = false;
      this.closeDiffFilePopup();
      EventBus.$emit('remove-all-frames');
    },
    reset() {
      this.leftViewerLoading = true;
      this.rightViewerLoading = true;
      this.resetAnswerResult();
      this.$store.commit('ztsDisclosureModule/SET_DETAIL_MERGED_TREEDATA', {});
    },
    handleDrawWidget() {
      this.isDrawWidget = true;
    },
    handleDrawedWidget(status) {
      this.canContinuousDrawWidget = !status;
    },
    handleDisclosureDetailClick() {
      if (!this.isDrawWidget) {
        this.canContinuousDrawWidget = true;
      }
      this.isDrawWidget = false;
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-detail {
  height: 100vh;
  min-width: 1000px;
  display: flex;
  .left,
  .right {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .left {
    flex: 1;
    position: relative;
    width: 60%;
    .file-pdf-viewer-container {
      ::v-deep .pdf-viewer-thumbnail {
        height: 100%;
      }
    }
  }
  .right {
    width: 40%;
    font-size: 14px;
    .answer-header {
      .sumbit {
        font-size: 14px;
        font-weight: 400;
        padding: 5px 10px;
        color: $--color-primary;
        border-color: $--color-primary;
        &.is-disabled {
          opacity: 0.6;
          color: #7d8598;
        }
      }
    }
    .answer-content {
      overflow: auto;
    }
    ::v-deep .disclosure-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
