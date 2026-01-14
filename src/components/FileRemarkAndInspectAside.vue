<template>
  <el-aside
    width="40%"
    class="file-remark-aside"
    v-show="showAnswerPanel"
    v-loading="loading">
    <p class="ai-predict-failed-tip" v-if="isAiPredictFailed">
      预测失败，请重新识别
    </p>
    <div class="file-aside-tabs">
      <div v-if="shouldShowTabsAndRemarkType">
        <el-tabs
          :class="{ 'ai-predict-failed': isAiPredictFailed }"
          v-model="activeName"
          :stretch="true"
          @tab-click="handleTabClick(activeName)">
          <el-tab-pane label="要素提取" name="remark" v-if="isShowRemarkTab">
            <file-remark-operate
              ref="fileRemarkOperate"
              v-if="Object.keys(question).length > 0"
              :qid="qid"
              :answerVersion="answerVersion"
              :answerItemMap="answerItemMap"
              :updatedAnswerKeys="updatedAnswerKeys"
              :is-inspect="true"
              :task-type="taskType"
              @before-send-question-answer="beforeSendQuestionAnswer"
              @reload-question="handleReloadQuestion"
              @submit-inspect-answer="
                $emit('submit-inspect-answer')
              "></file-remark-operate>

            <remark-validate-result
              v-if="errorTips.length > 0"></remark-validate-result>

            <div v-if="showAnswerDataSelect" class="answer-data-select">
              <el-select
                v-model="currentAnswerMoldId"
                size="mini"
                placeholder="请选择Schema"
                :disabled="question.length <= 1"
                @change="setAnswerData">
                <el-option
                  v-for="(item, index) in question"
                  :key="index"
                  :label="item.mold.name"
                  :value="item.mold.id">
                </el-option>
              </el-select>
              <file-remark-tree-nodes-searcher
                :show-prepend="false"
                :show-append="false"
                :show-search-button="true">
              </file-remark-tree-nodes-searcher>
              <div
                class="search-and-collpase-answer"
                v-if="hasCurrentSchemaData">
                <toggle-answer-collapse-state
                  @toggle="toggleAllAnswerCollapseState">
                </toggle-answer-collapse-state>
              </div>
            </div>
            <div
              v-else-if="Object.keys(question).length > 0"
              class="tree-nodes-searcher-container">
              <file-remark-tree-nodes-searcher></file-remark-tree-nodes-searcher>
              <div
                class="search-and-collpase-answer"
                v-if="hasCurrentSchemaData">
                <toggle-answer-collapse-state
                  @toggle="toggleAllAnswerCollapseState">
                </toggle-answer-collapse-state>
              </div>
            </div>

            <file-remark-answer-panel
              :qid="qid"
              :schema-id="schemaId"
              :read-only="readOnly"
              :answerItemMap="answerItemMap"
              ref="remarkAnswer"></file-remark-answer-panel>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowRuleAuditTab"
            :label="isLLMReview ? '智能审核' : '规则审核'"
            name="ruleAudit"
            :disabled="shouldDisableSmartAuditTab">
            <div v-if="isLLMReview" class="smart-audit-container">
              <div class="smart-audit-header">
                <div class="header-left">
                  <div class="audit-tab-buttons">
                    <div
                      class="audit-tab-button"
                      :class="{
                        active: auditActiveTab === 'rule',
                        disabled: disabledRuleAudit,
                      }"
                      @click="handleAuditTabButtonClick('rule')">
                      规则审核
                    </div>
                    <div
                      class="audit-tab-button"
                      :class="{
                        active: auditActiveTab === 'llm',
                        disabled: disabledLLMAudit,
                      }"
                      @click="handleAuditTabButtonClick('llm')">
                      大模型审核
                    </div>
                  </div>
                </div>
                <div class="header-right">
                  <el-button
                    v-if="isShowSubmitBtn"
                    type="primary"
                    size="mini"
                    :disabled="submitButtonDisabled"
                    :loading="submitLoading"
                    @click="handleSubmit">
                    提交
                  </el-button>
                  <el-dropdown
                    v-if="isShowExportBtn"
                    trigger="click"
                    @command="handleExportCommand">
                    <el-button type="primary" size="mini">
                      导出<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="isShowExportAuditResultOption"
                        command="result">
                        仅导出审核结果
                      </el-dropdown-item>
                      <el-dropdown-item v-if="supportExportAsPDF" command="pdf">
                        原文与审核结果（PDF）
                      </el-dropdown-item>
                      <el-dropdown-item
                        command="word"
                        v-if="$platform.isCgsEnv()">
                        原文与审核结果（Word）
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="smart-audit-content">
                <rule-audit
                  v-if="!disabledRuleAudit"
                  v-show="auditActiveTab === 'rule'"
                  ref="ruleAudit"
                  :qid="qid"
                  :file-id="fileId"
                  :with-llm-review="true"
                  :schema-id="schemaId"
                  :current-answer-mold-id="currentAnswerMoldId"
                  :hide-header-buttons="true">
                </rule-audit>
                <llm-review
                  v-show="auditActiveTab === 'llm'"
                  ref="llmReview"
                  :qid="qid"
                  :file-id="fileId"
                  :schema-id="schemaId">
                </llm-review>
              </div>
            </div>
            <rule-audit
              v-else
              ref="ruleAudit"
              :qid="qid"
              :file-id="fileId"
              :schema-id="schemaId"
              :current-answer-mold-id="currentAnswerMoldId">
            </rule-audit>
          </el-tab-pane>
          <el-tab-pane v-if="isShowCheckTab" label="要素核查" name="check">
            <nafmii-consistency-comparison
              v-if="isShowNafmiiConsistencyComparison"
              ref="check"
              :data="answersData.diff" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <nafmii-identify-aside
        v-if="isShowIdentifyTabs"
        :file-id="fileId"
        :answers-data="answersData"
        :is-show-remark-type="isShowRemarkType"
        :viewer-ready="viewerReady"
        @answers-updated-success="getAnswers" />
    </div>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';
import EventBus from '../components/remark/remark-tree/EventBus';
import FileRemarkOperate from '@/components/remark/FileRemarkOperate';
import RemarkValidateResult from '@/components/remark/FileRemarkValidateResult';
import FileRemarkTreeNodesSearcher from '@/components/remark/FileRemarkTreeNodesSearcher';
import FileRemarkAnswerPanel from '@/components/remark/FileRemarkAnswerPanel';
import RuleAudit from '@/components/RuleAudit';
import LlmReview from '@/components/LLMReview';
import NafmiiConsistencyComparison from '@/custom/nafmii/components/ConsistencyComparison';
import NafmiiIdentifyAside from '@/custom/nafmii/components/IdentifyAside';
import ToggleAnswerCollapseState from './ToggleAnswerCollapseState.vue';
import { isCiticsTgAllow } from '@/custom/citics_tg/common/utils';
import { parseQueryFromBase64EncodedUrl } from '@/utils';
import { isRemarkType } from '../custom/nafmii/common/utils';
import { SHOW_CONSISTENCY_COMPARISON_TAB_SCHEMA_NAMES } from '../custom/nafmii/common/constant';
import { nafmii as nafmiiApi } from '../store/api';

import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';
import {
  AI_PREDICT_STATUS_MAP,
  AUDIT_STATUS_MAP,
  JUDGE_STATUS,
} from '../store/constants';
import { getAuditAndLLMStatus } from '../store/api/judge.api';

export default {
  name: 'file-remark-aside-and-inspect',
  mixins: [FileMarkableMixin],
  components: {
    FileRemarkOperate,
    RemarkValidateResult,
    FileRemarkTreeNodesSearcher,
    FileRemarkAnswerPanel,
    RuleAudit,
    LlmReview,
    ToggleAnswerCollapseState,
    NafmiiConsistencyComparison,
    NafmiiIdentifyAside,
  },
  props: {
    qid: {
      type: Number,
      required: true,
    },
    fileId: {
      type: Number,
      required: true,
    },
    schemaId: {
      type: Number,
      required: true,
    },
    scenarioId: {
      type: Number,
      required: false,
      default: null,
    },
    answerVersion: {
      type: String,
      required: true,
    },
    answerItemMap: {
      type: Object,
      required: true,
    },
    updatedAnswerKeys: {
      type: Set,
      required: true,
    },
    reloadQuestion: {
      type: Function,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    isIframeMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    showAnswerPanel: {
      type: Boolean,
      default: true,
    },
    viewerReady: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('remarkModule', [
      'errorTips',
      'question',
      'currentSchema',
      'diffEnabled',
      'remarkTaskTypes',
    ]),
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('detailModule', ['fileViewer']),

    // 平台检查
    isNafmiiEnv() {
      return this.$platform.isNafmiiEnv();
    },
    isCmfchinaEnv() {
      return this.$platform.isCmfchinaEnv();
    },
    isCiticsTGEnv() {
      return this.$platform.isCiticsTGEnv();
    },
    isCgsEnv() {
      return this.$platform.isCgsEnv();
    },

    // 基础状态计算
    isLLMReview() {
      return this.$isAllowed('showFileScenario');
    },
    isOnlyLLMReview() {
      return this.taskType === 'judge';
    },
    disabledRuleAudit() {
      return (
        this.isOnlyLLMReview ||
        (this.scenarioId && this.taskType === 'extract') ||
        this.ruleAuditStatus !== AUDIT_STATUS_MAP.AUDIT_SUCCESS
      );
    },

    // 构造审核数据对象
    auditData() {
      return {
        audit_status: this.ruleAuditStatus,
        judge_status: this.llmAuditStatus,
      };
    },

    disabledLLMAudit() {
      if (this.scenarioId === null) {
        return true;
      }

      return [
        JUDGE_STATUS.INIT,
        JUDGE_STATUS.PARSING,
        JUDGE_STATUS.MISSING,
      ].includes(this.llmAuditStatus);
    },

    // 路由相关计算
    isInspectBase64Route() {
      return this.$route.name === 'inspectBase64Encoded';
    },
    isCustomRoute() {
      return this.$route.meta.isCustom;
    },
    hasNoAuth() {
      return this.$route.meta.noAuth;
    },

    showFileSwitchBtn() {
      return (
        !this.isInspectBase64Route &&
        !this.$route.query.notProjectFile &&
        !this.isIframeMode
      );
    },
    showCommonOperateBtns() {
      return !this.hasNoAuth;
    },
    // 任务类型计算
    taskType() {
      let taskType = this.$route.query.task_type;

      if (this.isInspectBase64Route) {
        const query = parseQueryFromBase64EncodedUrl(
          this.$route.params.base64EncodedString,
        );
        taskType = query.task_type;
      }

      return taskType || 'extract';
    },

    // 当前文件和Schema相关
    currentFile() {
      return this.fileViewer?.files.find((file) => file.id === this.fileId);
    },
    currentFileQuestions() {
      return this.currentFile?.questions || [];
    },
    currentSchemaName() {
      return this.schemas.items.find((item) => item.id === this.schemaId)?.name;
    },
    hasCurrentSchemaData() {
      return this.currentSchema && Object.keys(this.currentSchema).length > 0;
    },

    // Tab显示逻辑
    isShowRemarkTab() {
      return !this.isOnlyLLMReview;
    },
    isShowRuleAuditTab() {
      if (this.isNafmiiEnv) {
        return false;
      }
      return (
        this.taskType === 'audit' || this.scenarioId || this.isOnlyLLMReview
      );
    },
    isShowCheckTab() {
      return (
        this.isNafmiiEnv &&
        !this.isAiPredictFailed &&
        SHOW_CONSISTENCY_COMPARISON_TAB_SCHEMA_NAMES.includes(
          this.currentSchemaName,
        )
      );
    },
    isShowRemarkType() {
      return this.isNafmiiEnv ? isRemarkType(this.$route.query.type) : true;
    },
    isShowTabs() {
      return this.isNafmiiEnv ? this.remarkTaskTypes.includes('remark') : true;
    },
    isShowIdentifyTabs() {
      if (!this.isNafmiiEnv) return false;
      return (
        this.remarkTaskTypes.includes('keywords') ||
        this.remarkTaskTypes.includes('sensitiveWords')
      );
    },
    isShowNafmiiConsistencyComparison() {
      return this.isNafmiiEnv && this.answersData?.diff;
    },

    // 简化AI预测失败检查
    isAiPredictFailed() {
      if (!this.isNafmiiEnv) return false;

      return this.currentFileQuestions.some(
        (question) => question.ai_status === AI_PREDICT_STATUS_MAP.FAILED,
      );
    },

    // 模板条件组合
    shouldShowTabsAndRemarkType() {
      return this.isShowTabs && this.isShowRemarkType;
    },
    showAnswerDataSelect() {
      return this.$features.supportLLMExtract() && this.question.length > 0;
    },

    // 文件类型检查
    isXlsxFile() {
      return ['xls', 'xlsx'].includes(this.$route.query.fileSuffix);
    },
    supportExportAsPDF() {
      return !this.isXlsxFile;
    },

    // 权限相关计算
    isCustomCiticsTG() {
      return this.isCiticsTGEnv && this.isCustomRoute;
    },

    // 简化后的按钮显示逻辑
    isShowSubmitBtn() {
      return this.isCustomCiticsTG
        ? this.isCiticsTgAllow('prj_detail_file_audit_submit')
        : true;
    },
    isShowExportBtn() {
      if (this.isCustomCiticsTG) {
        return this.isCiticsTgAllow('prj_detail_file_audit_export');
      }
      if (this.isCmfchinaEnv && !this.supportExportAsPDF) {
        return false;
      }
      return true;
    },
    isShowExportAuditResultOption() {
      return !this.isCmfchinaEnv;
    },
    // 审核相关状态
    submitButtonDisabled() {
      return this.currentAuditRef?.submitButtonDisabled || false;
    },
    submitLoading() {
      return this.currentAuditRef?.submitLoading || false;
    },

    // 大模型审核状态判断
    llmAuditStatus() {
      return this.auditAndLLMStatus?.judge_status;
    },

    // 规则审核状态判断
    ruleAuditStatus() {
      return this.auditAndLLMStatus?.audit_status;
    },

    // 智能审核 tab 是否应该被禁用
    shouldDisableSmartAuditTab() {
      // 如果不支持LLM审核，使用原有的 ruleAuditTabDisabled 逻辑
      if (!this.isLLMReview) {
        return this.ruleAuditTabDisabled;
      }

      // 如果没有审核状态数据，使用原有逻辑
      if (!this.auditAndLLMStatus) {
        return this.ruleAuditTabDisabled;
      }

      // 根据业务需求：
      // - 审核失败：智能审核功能不可点击
      if (this.disabledRuleAudit && this.disabledLLMAudit) {
        return true;
      }

      // 其他情况使用原有逻辑
      return this.ruleAuditTabDisabled;
    },
  },
  data() {
    return {
      activeName: 'remark',
      ruleAuditTabDisabled: false,
      answersData: {},
      loading: false,
      currentAnswerMoldId: Number(this.$route.query.schemaId) || null,
      auditActiveTab: 'rule',
      currentAuditRef: null, // 当前审核组件的引用
      auditAndLLMStatus: null, // 审核和LLM状态数据
    };
  },
  created() {
    if (this.isNafmiiEnv) {
      this.getAnswers();
      if (this.schemas.items.length === 0) {
        this.fetchAllSchemas();
      }
    }
  },
  mounted() {
    // 初始化审核组件引用
    this.updateCurrentAuditRef();
  },
  watch: {
    taskType: {
      handler() {
        this.getActiveName();
      },
      immediate: true,
    },
    '$route.query.type'() {
      if (this.isNafmiiEnv) {
        this.getActiveName();
      }
    },
    '$route.query': {
      handler() {
        if (!this.isShowRemarkTab) {
          this.activeName = 'ruleAudit';
          this.getActiveName();
        }
        // 在 LLM Review 模式下调用审核状态接口
        if (this.isLLMReview) {
          this.fetchAuditAndLLMStatus();
        }
      },
      immediate: true,
    },
    fileId() {
      if (this.isNafmiiEnv) {
        this.getAnswers();
      }
      this.currentAnswerMoldId = null;
    },
    auditActiveTab: {
      handler() {
        this.updateCurrentAuditRef();
        this.closeLLMReviewEditDialog();
      },
    },
  },
  methods: {
    isCiticsTgAllow,
    updateCurrentAuditRef() {
      if (this.auditActiveTab === 'rule') {
        this.currentAuditRef = this.$refs.ruleAudit;
      } else if (this.auditActiveTab === 'llm') {
        this.currentAuditRef = this.$refs.llmReview;
      }
    },
    closeLLMReviewEditDialog() {
      if (
        this.$refs.llmReview &&
        typeof this.$refs.llmReview.closeEditDialog === 'function'
      ) {
        this.$refs.llmReview.closeEditDialog();
      }
    },
    setAnswerData() {
      const answerDataList = this.question || [];
      const answer =
        answerDataList.find(
          (item) => item.mold.id === this.currentAnswerMoldId,
        ) || {};
      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', {});
      this.$store.commit('remarkModule/SET_USER_ANSWER', {});
      this.$nextTick(() => {
        this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', {
          ...answer.mold?.data,
          mold_type: answer.mold?.mold_type,
        });
        this.$store.commit('remarkModule/SET_USER_ANSWER', {
          items: answer.answer_data,
        });
        this.$store.dispatch('remarkModule/initAnswerTree');
      });
      this.$emit('change-answer-data');
      EventBus.$emit('toggle-submit-answer-disabled', true);
    },
    getActiveName() {
      if (!this.isShowRuleAuditTab) {
        this.activeName = 'remark';
      }
      if (this.isShowRemarkType) {
        this.$store.commit('remarkModule/SET_REMARK_TAB', this.activeName);
      }
    },
    toggleAllAnswerCollapseState() {
      this.$refs.remarkAnswer.toggleAllAnswerCollapseState();
    },
    handleTabClick(name) {
      if (name === 'ruleAudit') {
        if (this.isLLMReview) {
          // 智能审核模式下，根据当前选中的内部 tab 来决定调用哪个组件的方法
          this.updateCurrentAuditRef();
          this.currentAuditRef.fetchFileAuditRuleResult();
        } else {
          // 普通模式下，直接调用规则审核
          this.$refs.ruleAudit.fetchFileAuditRuleResult();
        }
      } else if (name === 'remark' && this.isCmfchinaEnv) {
        this.handleReloadQuestion();
      }
      this.$store.commit('remarkModule/SET_REMARK_TAB', name);
    },
    async handleAuditTabButtonClick(tabName) {
      // 检查规则审核是否被禁用
      if (tabName === 'rule' && this.disabledRuleAudit) {
        return;
      }

      // 检查LLM审核是否被禁用
      if (tabName === 'llm' && this.disabledLLMAudit) {
        return;
      }

      this.auditActiveTab = tabName;

      // TODO：看是否要去掉频繁调用接口
      // 处理智能审核内部 tab 切换
      if (tabName === 'rule') {
        await this.handleTabSwitchWithDataPreservationAndRefresh(
          this.$refs.ruleAudit,
        );
      } else if (tabName === 'llm') {
        await this.handleTabSwitchWithDataPreservationAndRefresh(
          this.$refs.llmReview,
        );
      }
    },
    // 处理tab切换时的数据保存和恢复
    handleTabSwitchWithDataPreservation(targetRef) {
      if (
        !targetRef ||
        typeof targetRef.preserveModifications !== 'function' ||
        typeof targetRef.restoreModifications !== 'function'
      ) {
        return;
      }

      // 保存当前用户修改的数据
      const savedModifications = targetRef.preserveModifications();

      // 恢复用户修改的数据
      targetRef.restoreModifications(savedModifications);
    },
    // 处理tab切换时的数据保存、接口调用和恢复
    async handleTabSwitchWithDataPreservationAndRefresh(targetRef) {
      if (!targetRef) {
        return;
      }

      // 1. 先保存当前用户修改的数据
      const savedModifications = targetRef.preserveModifications();

      // 2. 调用接口获取最新数据
      await targetRef.fetchFileAuditRuleResult();

      // 3. 恢复用户修改的数据
      targetRef.restoreModifications(savedModifications);
    },
    // 智能审核相关的方法 - 同时触发两个tab的提交
    async handleSubmit() {
      const updatePromises = [];

      // 添加RuleAudit组件的提交
      if (!this.disabledRuleAudit) {
        updatePromises.push(this.$refs.ruleAudit.updateAuditRuleResult());
      }

      // 添加LLMReview组件的提交
      if (!this.disabledLLMAudit) {
        updatePromises.push(this.$refs.llmReview.updateAuditRuleResult());
      }

      try {
        await Promise.all(updatePromises);
      } catch (error) {
        console.error('提交审核结果失败:', error);
      }
    },
    handleExportCommand(command) {
      if (
        this.currentAuditRef &&
        typeof this.currentAuditRef.handleExportCommand === 'function'
      ) {
        this.currentAuditRef.handleExportCommand.call(
          this.currentAuditRef,
          command,
        );
      }
    },
    beforeSendQuestionAnswer() {
      this.ruleAuditTabDisabled = true;
    },
    handleReloadQuestion() {
      if (this.$route.query.task_type === 'audit') {
        this.ruleAuditTabDisabled = false;
      }
      this.reloadQuestion();
    },

    // 获取审核和LLM状态
    async fetchAuditAndLLMStatus() {
      try {
        this.loading = true;

        const response = await getAuditAndLLMStatus(this.fileId);

        this.auditAndLLMStatus = response;
        if (this.disabledRuleAudit) {
          this.auditActiveTab = 'llm';
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },

    async getAnswers() {
      try {
        this.loading = true;
        let res = await nafmiiApi.fetchAnswers(this.fileId, true);
        this.answersData = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-remark-aside {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

::v-deep .navigate-btns {
  height: 50px;
  box-sizing: border-box;
  padding: 10px 15px;
}

.file-aside-tabs {
  flex: 1;
  overflow: hidden;
  > div {
    display: flex;
    height: 100%;
  }
  .ai-predict-failed {
    ::v-deep .el-tabs__header {
      display: none;
    }
    .tag-user-wrapper,
    .search-and-collpase-answer {
      display: none;
    }
  }
  .answer-data-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 15px 20px;
    .label {
      width: 50px;
      margin-right: 10px;
      font-size: 14px;
    }
    .el-select {
      width: 40%;
      box-sizing: border-box;
      ::v-deep .el-input__inner {
        font-size: 14px;
        font-weight: bold;
        border-right: none;
        border-radius: 4px 0 0 4px;
      }
    }
    .search-container {
      flex: 1;
      ::v-deep .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
    .search-and-collpase-answer {
      display: none;
    }
  }
  .tree-nodes-searcher-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    .search-container {
      flex: 1;
    }
    .search-and-collpase-answer {
      width: auto;
      margin-bottom: 0;
      padding: 0 10px;
    }
  }
  ::v-deep .file-remark-answer {
    .node-title {
      display: none;
    }
  }
}

.ai-predict-failed-tip {
  color: #ff0000;
  padding: 10px;
  font-size: 14px;
  text-align: center;
}

.el-tabs {
  flex: 1;
  overflow: hidden;
}

::v-deep .el-tabs__header {
  position: sticky;
  top: 0;
  z-index: 4;
  background: #fff;
  margin-bottom: 0;

  .el-tabs__item {
    height: 42px;
    line-height: 42px;
    padding: 0;
  }
}

::v-deep .el-tabs__content {
  height: calc(100% - 42px);
  overflow: hidden;
}

::v-deep .el-tab-pane {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

.smart-audit-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .smart-audit-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 10px;

    .header-left {
      flex: 1;

      .audit-tab-buttons {
        display: flex;

        .audit-tab-button {
          padding: 8px 24px;
          font-size: 14px;
          background-color: #ffffff;
          color: #666666;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          border: 1px solid #d9d9d9;
          position: relative;

          &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }

          &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            border-left: none;
          }

          &.active {
            color: #225476;
            background-color: #ffffff;
            border-color: #225476;
            z-index: 1;
            border-left: 1px solid;
          }

          &:hover:not(.active):not(.disabled) {
            color: #225476;
            border-color: #225476;
          }

          &.disabled {
            color: #c0c4cc;
            cursor: not-allowed;
            background-color: #f5f7fa;
            border-color: #e4e7ed;
          }
        }
      }
    }

    .header-right {
      flex-shrink: 0;
      display: flex;
      gap: 10px;

      .el-button {
        margin-left: 0;
      }
    }
  }

  .smart-audit-content {
    flex: 1;
    overflow: hidden;

    > div {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
