<template>
  <div class="rule-audit-container">
    <div class="rule-audit-header">
      <div class="type-select-area">
        <div class="result-switch-select">
          <div>
            <span>审核结果：</span>
            <el-tooltip
              effect="dark"
              content="合规 | 不合规 | 不适用 的数量"
              placement="top">
              <span class="noncompliance-count">
                <span
                  class="compliance-count"
                  :class="{ selected: selectedCompliance === true }"
                  @click="handleFilterClick(true)"
                  >{{ complianceCount }}</span
                >
                <span class="separator">|</span>
                <span
                  class="noncompliance-count"
                  :class="{ selected: selectedCompliance === false }"
                  @click="handleFilterClick(false)"
                  >{{ nonComplianceCount }}</span
                >
                <span class="separator">|</span>
                <span
                  class="not-applicable-count"
                  :class="{ selected: selectedCompliance === null }"
                  @click="handleFilterClick(null)"
                  >{{ notApplicableCount }}</span
                >
              </span>
            </el-tooltip>
          </div>
          <div>
            <span>仅查看：</span>
            <el-select
              v-model="consistency"
              size="mini"
              class="result-type-select"
              @change="handleConsistencyChange">
              <el-option
                v-for="item in consistencyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select
              v-model="parseStatus"
              size="mini"
              class="result-type-select"
              @change="handleParseStatusChange">
              <el-option
                v-for="item in parseStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="schema-change-container">
          <div class="search-item">
            <span>法规名称：</span>
            <el-select
              v-model="lawOrderName"
              filterable
              clearable
              placeholder="请选择法规名称"
              class="law-order-select"
              size="mini"
              @change="handleLawOrderNameChange">
              <el-option
                v-for="item in lawOrderNameList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>规则名称：</span>
            <el-input
              v-model="cpName"
              placeholder="请输入规则名称"
              class="cp-name-input"
              size="mini"
              clearable
              @input="handleCpNameChange">
            </el-input>
          </div>
        </div>
      </div>
    </div>

    <el-collapse class="rule-audit-result-list" v-model="activeName">
      <el-collapse-item
        v-for="item in ruleList"
        :key="item.id"
        class="rule-audit-item"
        :disabled="!isRuleInteractable(item)"
        :class="{
          'rule-audit-item-displaying': currentDisplayingRuleId === item.id,
          'is-collapse-expanded': activeName.includes(item.id),
        }"
        :name="isRuleInteractable(item) ? item.id : ''"
        @click.native="isRuleInteractable(item) ? ruleAuditClick(item) : null">
        <template slot="title">
          <div class="rule-audit-item-header">
            <div class="title">
              <el-tooltip
                effect="dark"
                :content="item.name"
                placement="top"
                :open-delay="500">
                <span class="rule-name">{{ item.name }}</span>
              </el-tooltip>
              <el-tooltip effect="dark" content="重新审核" placement="top">
                <i
                  class="el-icon-refresh"
                  :class="{
                    'is-disabled':
                      currentDisplayingRuleId === item.id || isAnalyzing(item),
                  }"
                  @click.stop="handleReAnalyze(item)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑审核片段" placement="top">
                <i
                  class="el-icon-edit"
                  :class="{
                    'is-disabled':
                      currentDisplayingRuleId === item.id || isAnalyzing(item),
                  }"
                  @click.stop="handleEdit(item)"></i>
              </el-tooltip>
              <div
                class="page-button-group"
                v-if="shouldShowPageNavigation(item)">
                <i
                  class="el-icon-arrow-left"
                  :class="{
                    'is-disabled':
                      item.currentPositionIndex === 0 ||
                      currentDisplayingRuleId === item.id ||
                      isAnalyzing(item),
                  }"
                  @click.stop="handlePrePageClick(item)"></i>
                <span>{{ getPageNavigationText(item) }}</span>
                <i
                  class="el-icon-arrow-right"
                  :class="{
                    'is-disabled':
                      isLastPagePosition(item) ||
                      currentDisplayingRuleId === item.id ||
                      isAnalyzing(item),
                  }"
                  @click.stop="handleNextPageClick(item)"></i>
              </div>
            </div>
            <div
              class="click-container"
              @click.stop.prevent="changeShowDetail(item)">
              <span
                class="compliance-result"
                :class="{
                  undo: item.is_compliance === null && isRuleInteractable(item),
                  success: item.is_compliance === true,
                  fail: item.is_compliance === false,
                  analyzing: isAnalyzing(item),
                  'analyze-failed': isAnalyzeFailed(item),
                }"
                >{{ getComplianceResultText(item) }}</span
              >
            </div>
          </div>
        </template>
        <div v-if="item.contract_content !== null" class="contract-content">
          <span>合同指引：</span>
          <el-button
            type="text"
            :disabled="item.contract_content === ''"
            @click.stop="openContractContentDialog(item.contract_content)">
            详情
          </el-button>
        </div>
        <div class="compliance-selection">
          <div class="user">
            <span>人工确认：</span>
            <el-tooltip
              effect="dark"
              popper-class="user-content-tip"
              :content="'提示：' + item.tip_content"
              placement="right-start">
              <i
                class="el-icon-info user-tip-content"
                v-if="isShowTipContent(item)"></i>
            </el-tooltip>
            <el-select
              v-model="item.is_compliance_user"
              size="mini"
              class="compliance-select"
              placeholder="请选择"
              :popper-append-to-body="false"
              :disabled="currentDisplayingRuleId === item.id"
              @change="(value) => handleComplianceChangeByUser(item, value)">
              <el-option
                v-for="item in chooseComplianceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button
              v-if="item.is_edited && $platform.isCgsEnv()"
              type="primary"
              size="mini"
              plain
              :loading="item.resultRecordsButtonLoading"
              @click.stop="getAuditRuleResultRecords(item)">
              变更记录
            </el-button>
          </div>
          <div class="ai">
            <span>
              {{ item.rule_type === 'external' ? '外部结果：' : 'AI结果：' }}
            </span>
            <span
              class="compliance-result"
              :class="
                item.is_compliance_ai === null
                  ? 'undo'
                  : item.is_compliance_ai
                    ? 'success'
                    : 'fail'
              "
              >{{
                item.is_compliance_ai === null
                  ? '不适用'
                  : item.is_compliance_ai
                    ? '合规'
                    : '不合规'
              }}</span
            >
          </div>
        </div>
        <div
          class="origin-law"
          v-if="item.origin_contents && item.origin_contents[0]">
          <div class="title">依据法规：</div>
          <div class="content">
            {{ item.origin_contents.join('\n').trim() }}
          </div>
        </div>
        <template v-if="item.is_compliance">
          <div
            class="failure-reasons-container"
            v-if="
              item.is_compliance_user == null ||
              item.is_compliance_user === true ||
              item.rule_type === 'template'
            ">
            <div
              class="failure-reason-title"
              :class="{ 'consistency-check-title': isConsistencyCheck(item) }">
              判定依据：
            </div>
            <ul class="failure-reason-list">
              <li
                v-for="(reason, reasonIndex) in item.reasons"
                :key="reasonIndex">
                <span>{{ reason.reason_text }}</span>
                <el-button
                  type="text"
                  v-if="reason.diff"
                  @click.stop="openDiffDialog(reason)"
                  >详情</el-button
                >
              </li>
            </ul>
          </div>
          <template v-else>
            <div class="modify-reason" v-if="item.isShowReasonTextMod">
              <div class="reason-title">判定依据：</div>
              <el-input
                type="textarea"
                v-model="item.reason_text_mod"
                resize="none"
                :disabled="currentDisplayingRuleId === item.id"
                @click.native.stop>
              </el-input>
              <i
                class="el-icon-error"
                :class="{
                  'is-disabled': currentDisplayingRuleId === item.id,
                }"
                @click.stop="toggleDisplayReasonText(item, false)"></i>
            </div>
            <div class="add-reason" v-else>
              <i class="el-icon-question"></i>
              <el-button
                type="text"
                :disabled="currentDisplayingRuleId === item.id"
                @click.stop="toggleDisplayReasonText(item, true)"
                >添加不正确原因</el-button
              >
            </div>
          </template>
        </template>
        <template v-else>
          <div
            class="failure-reasons-container"
            v-if="
              item.is_compliance_user == null ||
              item.is_compliance_user === false
            ">
            <div
              class="failure-reason-title"
              :class="{ 'consistency-check-title': isConsistencyCheck(item) }">
              判定依据：
            </div>
            <div v-if="item.user_reason" class="user-reason">
              {{ item.user_reason }}
            </div>
            <ul class="failure-reason-list" v-else>
              <li
                v-for="(reason, reasonIndex) in item.reasons"
                :key="reasonIndex">
                <span>{{ reason.reason_text }}</span>
                <el-button
                  type="text"
                  v-if="reason.diff"
                  @click.stop="openDiffDialog(reason)"
                  >详情</el-button
                >
              </li>
            </ul>
          </div>
        </template>

        <div class="modify-reason" v-if="item.isShowSuggestion">
          <div class="reason-title">修改意见：</div>
          <el-input
            type="textarea"
            v-model="item.suggestion_mod"
            :ref="'suggestion_' + item.id"
            resize="none"
            :disabled="currentDisplayingRuleId === item.id"
            :autosize="{ minRows: 2, maxRows: 20 }"
            @blur="(e) => handleSuggestionChange(e, item)"
            @click.native.stop>
          </el-input>
          <i
            class="el-icon-error"
            :class="{
              'is-disabled': currentDisplayingRuleId === item.id,
            }"
            @click.stop="toggleDisplaySuggestion(item, false)"></i>
        </div>
        <div class="add-reason" v-else>
          <i class="el-icon-question"></i>
          <el-button
            type="text"
            :disabled="currentDisplayingRuleId === item.id"
            @click.stop="toggleDisplaySuggestion(item, true)"
            >添加意见</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
    <show-diff-dialog
      :visible="isShowDiffDialog"
      :diff-text="diffText"
      :base-title="baseTitle"
      :diff-title="diffTitle"
      :law-source="lawSource"
      @close="closeDiffDialog">
    </show-diff-dialog>

    <el-dialog
      v-if="showContractContentDialog"
      :visible="true"
      title="合同指引"
      width="50%"
      @close="showContractContentDialog = false">
      <div v-html="currentContractContent" class="contract-content"></div>
    </el-dialog>

    <rule-audit-changelog
      v-if="auditChangelogVisible"
      :logs="auditChangelogs"
      :isLlmReview="true"
      @close="auditChangelogVisible = false"></rule-audit-changelog>

    <!-- 编辑弹窗 -->
    <div v-if="showEditDialog" class="audit-segment-dialog" v-drag>
      <div class="dialog-header">
        <span class="dialog-title">审核片段</span>
        <div class="header-actions">
          <el-button
            type="primary"
            size="mini"
            :loading="submiting"
            :disabled="editSegments.length === 0"
            @click="submitSegments"
            >审核</el-button
          >
          <el-button size="mini" @click="closeEditDialog">关闭</el-button>
        </div>
      </div>
      <div class="dialog-body">
        <div class="segment-description">
          <span class="description-text"
            >在左侧文档划取对应的内容，或在下方删除对应的片段，完成审核片段的变更</span
          >
        </div>

        <div class="segment-list" v-loading="submiting">
          <div
            class="segment-item"
            :class="{
              'segment-item-selected': currentSelectedSegmentIndex === index,
            }"
            v-for="(item, index) in editSegments"
            :key="index"
            @click="handleSegmentClick(item, index)">
            <div class="segment-number">{{ index + 1 }}.</div>
            <div class="segment-content">
              <div class="segment-text">{{ item.content }}</div>
            </div>
            <div class="segment-actions">
              <i
                class="el-icon-delete delete-icon"
                @click.stop="deleteSegment(index)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { downloadFileByBlob } from '@/utils';
import { cgs as cgsApi, ruleAudit as ruleAuditApi } from '@/store/api';
import { getResultRecords } from '@/store/api/judge.api';

import EventBus from '@/components/remark/remark-tree/EventBus';
import RuleAuditChangelog from '@/components/RuleAuditChangelog';
import ShowDiffDialog from '@/components/ShowDiffDialog.vue';
import {
  AUDIT_STATUS_MAP,
  JUDGE_STATUS,
  JUDGE_STATUS_MAP,
} from '@/store/constants';
import { isCiticsTgAllow } from '@/custom/citics_tg/common/utils';
import { getWidgetClassNames } from '../custom/cmfchina/common/utils';
import {
  getJudgeResults,
  updateJudgeResults,
  refreshSingleJudgeResults,
  updateSingleJudgeResults,
} from '@/store/api/judge.api';

export default {
  name: 'llm-review',
  components: {
    RuleAuditChangelog,
    ShowDiffDialog,
  },

  props: {
    isOperatePerm: {
      type: Boolean,
      default: true,
    },
    qid: {
      type: Number,
      required: false,
    },
    fileId: {
      type: Number,
      required: false,
    },
    schemaId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      AUDIT_STATUS_MAP,
      JUDGE_STATUS,
      JUDGE_STATUS_MAP,
      auditRules: [],
      ruleList: [],
      currentRuleId: null,
      currentDisplayingRuleId: null, // 当前正在展示审核片段的规则ID
      ruleListOriginal: [],
      cacheRuleList: [],
      activeName: [],
      artificialRuleMap: new Map(),
      compliance: 'all',
      consistency: 'all',
      parseStatus: JUDGE_STATUS.SUCCESS,
      selectedCompliance: 'all',
      lawOrderName: '', // 法规名称搜索
      cpName: '', // 规则名称搜索
      lawOrderNameList: [], // 法规名称列表
      showContractContentDialog: false,
      isShowDiffDialog: false,
      currentContractContent: '',
      diffText: [],
      baseTitle: '',
      diffTitle: '',
      lawSource: '',
      auditChangelogs: [],
      auditChangelogVisible: false,
      submitLoading: false,
      // 编辑弹窗相关
      showEditDialog: false,
      editSegments: [],
      currentEditItem: null, // 当前编辑的审核项
      currentSelectedSegmentIndex: -1, // 当前选中的片段索引

      // 编辑弹窗常量
      VIRTUAL_NODE_PREFIX: 'llm-review-virtual-',
      VIRTUAL_NODE_LABEL_PREFIX: 'LLM审核片段-',
      chooseComplianceOptions: [
        {
          label: '合规',
          value: true,
        },
        {
          label: '不合规',
          value: false,
        },
      ],
      complianceOptions: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '合规',
          value: true,
        },
        {
          label: '不合规',
          value: false,
        },
        {
          label: '不适用',
          value: null,
        },
      ],

      consistencyOptions: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '一致性检查',
          value: true,
        },
        {
          label: '非一致性检查',
          value: false,
        },
      ],
      parseStatusOptions: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '分析中',
          value: 'analyzing',
        },
        {
          label: JUDGE_STATUS_MAP[JUDGE_STATUS.SUCCESS],
          value: JUDGE_STATUS.SUCCESS,
        },
        {
          label: JUDGE_STATUS_MAP[JUDGE_STATUS.FAILED],
          value: JUDGE_STATUS.FAILED,
        },
      ],
      submiting: false,
    };
  },

  computed: {
    nonCompliance() {
      return this.cacheRuleList.filter((item) => {
        return item.is_compliance === false;
      });
    },
    complianceCount() {
      return this.cacheRuleList.filter((item) => {
        return (
          item.is_compliance === true &&
          !this.isAnalyzingOrFailed(item.judge_status)
        );
      }).length;
    },
    nonComplianceCount() {
      return this.cacheRuleList.filter((item) => {
        return (
          item.is_compliance === false &&
          !this.isAnalyzingOrFailed(item.judge_status)
        );
      }).length;
    },
    notApplicableCount() {
      return this.cacheRuleList.filter((item) => {
        return (
          item.is_compliance === null &&
          !this.isAnalyzingOrFailed(item.judge_status)
        );
      }).length;
    },

    submitButtonDisabled() {
      const list = this.ruleList.map((item) => {
        return {
          ...item,
          currentPositionIndex: 0,
        };
      });
      const ruleListOriginal = this.ruleListOriginal.map((item) => {
        return {
          ...item,
          currentPositionIndex: 0,
        };
      });
      return _.isEqual(list, ruleListOriginal);
    },
    currentFileId() {
      let fileId;
      if (this.fileId) {
        fileId = this.fileId;
      } else {
        fileId = this.$route.query.fileId;
      }
      return fileId;
    },
    currentSchemaId() {
      let schemaId;

      if (this.schemaId) {
        schemaId = this.schemaId;
      } else {
        schemaId = this.$route.query.schemaId;
      }

      schemaId = schemaId === -1 ? 0 : schemaId;

      return schemaId;
    },
    isShowExportAuditResultOption() {
      return true;
    },
    isXlsxFile() {
      return ['xls', 'xlsx'].includes(this.$route.query.fileSuffix);
    },
    supportExportAsPDF() {
      return !this.isXlsxFile;
    },
  },

  watch: {
    auditRules(val) {
      const cacheRuleList = [];
      const lawOrderNameSet = new Set();
      this.activeName = [];
      _.cloneDeep(val).forEach((item) => {
        const { schema_results } = item;
        let outlineList = [];
        if (schema_results) {
          schema_results.forEach((item) => {
            if (item.outlines && !_.isNil(item.page)) {
              outlineList.push(item);
            }
          });
        }

        if (!item.is_compliance && this.isRuleInteractable(item)) {
          this.activeName.push(item.id);
        }

        // 处理法规名称，确保有中文书名号
        let processedOriginContents = [...item.origin_contents];
        if (processedOriginContents.length > 0 && processedOriginContents[0]) {
          // 分别检查前后是否缺少中文书名号
          let resultContent = processedOriginContents[0];
          if (!resultContent.startsWith('《')) {
            resultContent = `《${resultContent}`;
          }
          if (!resultContent.endsWith('》')) {
            resultContent = `${resultContent}》`;
          }

          processedOriginContents[0] = resultContent;
        }

        cacheRuleList.push({
          ...item,
          suggestion_mod: item.suggestion,
          isShowSuggestion: !!item.suggestion,
          currentPositionIndex: 0,
          outlineList: outlineList,
          reason_text_mod: null,
          isShowReasonTextMod: true,
          resultRecordsButtonLoading: false,
          origin_contents: processedOriginContents,
        });
        // 收集法规名称
        if (item.law_order_name) {
          lawOrderNameSet.add(item.law_order_name);
        }
      });
      this.cacheRuleList = cacheRuleList;
      this.lawOrderNameList = [...lawOrderNameSet];
      this.updateRuleList();
    },
    qid() {
      this.fetchFileAuditRuleResult();
    },
    fileId() {
      this.fetchFileAuditRuleResult();
    },
  },

  created() {
    this.compliance = false;
    this.selectedCompliance = false;
    this.fetchFileAuditRuleResult();

    // 监听画框提取的结果
    EventBus.$on('create-answer-item', this.handleCreateAnswerItem);
  },

  beforeDestroy() {
    // 清理事件监听
    EventBus.$off('create-answer-item', this.handleCreateAnswerItem);
  },

  methods: {
    isCiticsTgAllow,
    isAnalyzingOrFailed(status) {
      return [
        JUDGE_STATUS.INIT,
        JUDGE_STATUS.PARSING,
        JUDGE_STATUS.FAILED,
      ].includes(status);
    },
    changeShowDetail(item) {
      if (this.isRuleInteractable(item)) {
        const expandedIndex = this.activeName.findIndex((id) => item.id === id);
        if (expandedIndex >= 0) {
          this.activeName = this.activeName.filter((id) => item.id !== id);
        } else {
          this.activeName.push(item.id);
        }
      }
    },
    formatOriginContents(item) {
      let contents = [...item.origin_contents];

      if (item.is_template && this.isConsistencyCheck(item)) {
        return ['', ...contents.slice(1)];
      }
      return contents;
    },
    // 判断是否为一致性检查
    isConsistencyCheck(rule) {
      return rule.rule_type === 'template';
    },
    // 获取规则的分析状态
    getRuleStatus(rule) {
      return rule.judge_status;
    },
    // 判断规则是否为分析中状态
    isAnalyzing(rule) {
      const status = this.getRuleStatus(rule);
      return status === JUDGE_STATUS.INIT || status === JUDGE_STATUS.PARSING;
    },
    // 判断规则是否为分析失败状态
    isAnalyzeFailed(rule) {
      const status = this.getRuleStatus(rule);
      return status === JUDGE_STATUS.FAILED;
    },
    // 判断规则是否可以展开和点击
    isRuleInteractable(rule) {
      return !this.isAnalyzing(rule) && !this.isAnalyzeFailed(rule);
    },
    // 获取合规状态显示文本
    getComplianceResultText(rule) {
      if (this.isAnalyzing(rule)) {
        return '分析中';
      }
      if (this.isAnalyzeFailed(rule)) {
        return '分析失败';
      }
      if (rule.is_compliance === null) {
        return '不适用';
      }
      return rule.is_compliance ? '合规' : '不合规';
    },
    async fetchFileAuditRuleResult() {
      try {
        const resData = await getJudgeResults(this.currentFileId);
        this.auditRules = resData;
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async updateAuditRuleResult() {
      try {
        this.submitLoading = true;
        const data = {
          results: [],
        };
        for (const value of this.artificialRuleMap.values()) {
          console.log('artificialRuleMap.value', value);
          const result = {
            result_id: value.id,
            is_compliance: value.is_compliance,
            suggestion_user: null,
            is_compliance_user: null,
            user_reason: null,
          };
          if (value.suggestion_mod !== null) {
            result.suggestion_user = value.suggestion_mod;
          }
          if (value.is_compliance_user !== null) {
            result.is_compliance_user = value.is_compliance_user;
          }
          if (value.reason_text_mod !== null) {
            result.user_reason = value.reason_text_mod;
          }
          data.results.push(result);
        }

        if (data.results.length > 0) {
          await updateJudgeResults(this.currentFileId, data);
          this.$notify({
            title: this.$t(`message['成功']`),
            message: '修改成功',
            type: 'success',
            offset: 30,
          });
          await this.fetchFileAuditRuleResult();
          const currentRule = this.ruleList.find((item) => {
            return item.id === this.currentRuleId;
          });
          if (currentRule) {
            this.ruleItemSelected(currentRule, 'init');
          }
          this.artificialRuleMap.clear();
        }
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
          offset: 30,
        });
      } finally {
        this.submitLoading = false;
      }
    },
    handleExportCommand(command) {
      switch (command) {
        case 'result':
          this.exportAuditRuleResult();
          break;
        case 'pdf':
          this.exportAuditRuleComment();
          break;
        case 'word':
          this.exportAuditRuleComment('docx');
          break;
        default:
          break;
      }
    },
    async exportAuditRuleResult() {
      try {
        const res = await ruleAuditApi.exportAuditRuleResult({
          fileId: this.currentFileId,
          schemaId: this.currentSchemaId,
        });
        if (res) {
          await downloadFileByBlob(res);
        } else {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: res.message,
            type: 'warning',
            offset: 30,
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async exportAuditRuleComment(type) {
      try {
        let res = null;
        if (this.$platform.isCgsEnv()) {
          res = await cgsApi.exportAuditRuleComment({
            fileId: this.currentFileId,
            schemaId: this.currentSchemaId,
            params: {
              export_type: type,
            },
          });
        } else {
          res = await ruleAuditApi.exportAuditRuleComment({
            fileId: this.currentFileId,
            schemaId: this.currentSchemaId,
          });
        }
        if (res) {
          await downloadFileByBlob(res);
        } else {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: res.message,
            type: 'warning',
            offset: 30,
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    isShowTipContent(item) {
      if (item.tip_content) {
        if (item.is_compliance && item.is_compliance_tip) {
          return true;
        } else if (!item.is_compliance && item.is_noncompliance_tip) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },

    handleLawOrderNameChange() {
      this.updateRuleList();
    },
    handleCpNameChange() {
      this.updateRuleList();
    },
    handleComplianceChange() {
      this.updateRuleList();
    },
    handleConsistencyChange() {
      this.updateRuleList();
    },
    handleParseStatusChange() {
      // 如果选择了分析中或分析失败，且selectedCompliance !== 'all'，则取消选中的合规状态
      if (
        this.parseStatus !== JUDGE_STATUS.SUCCESS &&
        this.selectedCompliance !== 'all'
      ) {
        this.compliance = 'all';
        this.selectedCompliance = 'all';
      }
      this.updateRuleList();
    },
    handleFilterClick(value) {
      this.compliance = this.compliance === value ? 'all' : value;
      this.selectedCompliance = this.compliance === 'all' ? 'all' : value;
      // 如果状态下拉筛选不是分析成功，那么需要重置为分析成功
      if (this.parseStatus !== JUDGE_STATUS.SUCCESS) {
        this.parseStatus = JUDGE_STATUS.SUCCESS;
      }
      this.updateRuleList();
    },
    updateRuleList() {
      this.updateRuleListWithoutReset();
      this.ruleListOriginal = _.cloneDeep(this.ruleList);
    },
    updateRuleListWithoutReset() {
      this.ruleList = this.cacheRuleList.filter((item) => {
        return this.isMatched(item);
      });
    },
    isMatched(rule) {
      // 分析状态过滤逻辑
      let isMatchedParseStatus = false;
      if (this.parseStatus === 'all') {
        isMatchedParseStatus = true;
      } else if (this.parseStatus === 'analyzing') {
        const ruleStatus = rule.judge_status;
        isMatchedParseStatus =
          ruleStatus === JUDGE_STATUS.INIT ||
          ruleStatus === JUDGE_STATUS.PARSING;
      } else {
        const ruleStatus = rule.judge_status;
        isMatchedParseStatus = ruleStatus === this.parseStatus;
      }

      let isConsistency = rule.rule_type === 'template';
      if (this.$features.showExternalAudit()) {
        isConsistency = rule.rule_type === 'external';
      }

      // 法规名称搜索过滤
      let isMatchedLawOrderName = true;
      if (this.lawOrderName) {
        isMatchedLawOrderName =
          rule.law_order_name &&
          rule.law_order_name.includes(this.lawOrderName);
      }

      // 规则名称搜索过滤
      let isMatchedCpName = true;
      if (this.cpName) {
        isMatchedCpName = rule.cp_name && rule.cp_name.includes(this.cpName);
      }

      let isMatchedCompliance = false;
      if (this.compliance === 'all') {
        isMatchedCompliance = true;
      } else {
        // 分析中和分析失败的数据，不属于任何合规状态
        const ruleStatus = rule.judge_status;
        const isAnalyzingOrFailed =
          ruleStatus === JUDGE_STATUS.INIT ||
          ruleStatus === JUDGE_STATUS.PARSING ||
          ruleStatus === JUDGE_STATUS.FAILED;

        // 筛选不适用时，不展示分析失败或分析中的数据
        if (this.compliance === null) {
          isMatchedCompliance =
            !isAnalyzingOrFailed && rule.is_compliance === null;
        } else {
          // 其他筛选条件下，只匹配正常完成分析的数据
          isMatchedCompliance =
            !isAnalyzingOrFailed && rule.is_compliance === this.compliance;
        }
      }
      let isMatchedConsistency = false;
      if (this.consistency === 'all') {
        isMatchedConsistency = true;
      } else {
        isMatchedConsistency = isConsistency === this.consistency;
      }
      return (
        isMatchedCompliance &&
        isMatchedConsistency &&
        isMatchedParseStatus &&
        isMatchedLawOrderName &&
        isMatchedCpName
      );
    },
    async ruleAuditClick(rule) {
      this.currentRuleId = rule.id;
      this.ruleItemSelected(rule, 'init');
      await this.$nextTick();
      if (
        this.$refs['suggestion_' + rule.id] &&
        this.$refs['suggestion_' + rule.id][0]
      ) {
        this.$refs['suggestion_' + rule.id][0].resizeTextarea();
      }
    },
    ruleItemSelected(rule, action) {
      // 检查是否使用新的页码切换逻辑
      if (this.shouldUsePageKeyNavigation(rule)) {
        const targetPageKeyIndex = this.calculateTargetPageKeyIndex(
          rule,
          action,
        );
        this.navigateToPageKey(rule, targetPageKeyIndex);
      } else {
        // 保留原有逻辑
        const targetIndex = this.calculateTargetIndex(rule, action);
        this.navigateToPosition(rule, targetIndex);
      }
    },

    /**
     * 判断是否应该使用新的页码切换逻辑
     * 当 outlineList 只有一个元素且该元素包含 outlines 对象时使用
     */
    shouldUsePageKeyNavigation(rule) {
      const { outlineList } = rule;
      return (
        outlineList &&
        outlineList.length === 1 &&
        outlineList[0].outlines &&
        typeof outlineList[0].outlines === 'object'
      );
    },

    /**
     * 判断是否应该显示页码导航按钮组
     * @param {Object} rule - 规则对象
     * @returns {boolean} 是否显示
     */
    shouldShowPageNavigation(rule) {
      if (this.shouldUsePageKeyNavigation(rule)) {
        // 新逻辑: 页码数量大于1时显示
        const sortedPageKeys = this.getSortedPageKeys(rule);
        return sortedPageKeys.length > 1;
      } else {
        // 旧逻辑: outlineList 长度大于1时显示
        return rule.outlineList.length > 1;
      }
    },

    /**
     * 获取页码导航显示文本
     * @param {Object} rule - 规则对象
     * @returns {string} 显示文本,如 "1/3" (第1页/共3页)
     */
    getPageNavigationText(rule) {
      if (this.shouldUsePageKeyNavigation(rule)) {
        const sortedPageKeys = this.getSortedPageKeys(rule);
        const currentIndex = rule.currentPositionIndex || 0;
        return `${currentIndex + 1}/${sortedPageKeys.length}`;
      } else {
        const currentIndex = rule.currentPositionIndex || 0;
        return `${currentIndex + 1}/${rule.outlineList.length}`;
      }
    },

    /**
     * 判断是否在最后一页位置
     * @param {Object} rule - 规则对象
     * @returns {boolean} 是否在最后位置
     */
    isLastPagePosition(rule) {
      if (this.shouldUsePageKeyNavigation(rule)) {
        const sortedPageKeys = this.getSortedPageKeys(rule);
        return rule.currentPositionIndex === sortedPageKeys.length - 1;
      } else {
        return rule.currentPositionIndex === rule.outlineList.length - 1;
      }
    },

    /**
     * 获取排序后的页码keys
     * @param {Object} rule - 规则对象
     * @returns {Array<string>} 排序后的页码数组
     */
    getSortedPageKeys(rule) {
      if (!this.shouldUsePageKeyNavigation(rule)) {
        return [];
      }

      const outlines = rule.outlineList[0].outlines;
      const pageKeys = Object.keys(outlines);

      // 按数值从小到大排序
      return pageKeys.sort((a, b) => Number(a) - Number(b));
    },

    /**
     * 计算目标页码索引 (新逻辑)
     * @param {Object} rule - 规则对象
     * @param {string} action - 动作: 'pre', 'next', 'init'
     * @returns {number} 目标页码在排序后keys数组中的索引
     */
    calculateTargetPageKeyIndex(rule, action) {
      const sortedPageKeys = this.getSortedPageKeys(rule);

      if (sortedPageKeys.length === 0) {
        return -1;
      }

      let targetIndex = rule.currentPositionIndex || 0;

      if (action === 'pre') {
        targetIndex--;
        if (targetIndex < 0) {
          targetIndex = 0;
        }
      } else if (action === 'next') {
        targetIndex++;
        if (targetIndex > sortedPageKeys.length - 1) {
          targetIndex = sortedPageKeys.length - 1;
        }
      } else {
        targetIndex = 0;
      }

      return targetIndex;
    },

    calculateTargetIndex(rule, action) {
      const { outlineList } = rule;

      if (outlineList.length === 0) {
        return -1;
      }

      let targetIndex = rule.currentPositionIndex || 0;

      if (action === 'pre') {
        targetIndex--;
        if (targetIndex < 0) {
          targetIndex = 0;
        }
      } else if (action === 'next') {
        targetIndex++;
        if (targetIndex > outlineList.length - 1) {
          targetIndex = outlineList.length - 1;
        }
      } else {
        targetIndex = 0;
      }

      return targetIndex;
    },

    /**
     * 根据页码key索引进行跳转 (新逻辑)
     * @param {Object} rule - 规则对象
     * @param {number} pageKeyIndex - 页码在排序后keys数组中的索引
     */
    navigateToPageKey(rule, pageKeyIndex) {
      if (pageKeyIndex < 0) {
        return;
      }

      const sortedPageKeys = this.getSortedPageKeys(rule);
      if (pageKeyIndex >= sortedPageKeys.length) {
        return;
      }

      const { rule_type, outlineList } = rule;
      const meta = {
        classNames: getWidgetClassNames(rule.is_compliance === false),
      };

      // 更新当前位置索引
      rule.currentPositionIndex = pageKeyIndex;

      // 获取当前页码
      const currentPageKey = sortedPageKeys[pageKeyIndex];
      const currentOutline = outlineList[0];
      const currentPageOutlines = currentOutline.outlines[currentPageKey];

      // 构建label
      let label = '';
      if (rule_type === 'template') {
        label = rule.name;
      } else {
        label = currentOutline.name || rule.name;
      }

      // 构建boxes数据 (包含该页的所有框)
      const boxs = [];
      if (currentPageOutlines && Array.isArray(currentPageOutlines)) {
        currentPageOutlines.forEach((outline) => {
          const [box_left, box_top, box_right, box_bottom] = outline;
          boxs.push({
            box: { box_left, box_top, box_right, box_bottom },
            page: Number(currentPageKey),
            text: currentOutline.content || currentOutline.text || '',
          });
        });
      }

      // 发送跳转事件
      EventBus.$emit('answer-item-selected', {
        index: 0,
        schemaNode: null,
        schema: { data: { label: label } },
        data: { boxes: boxs },
        detail: [],
        meta: meta,
      });
    },

    navigateToPosition(rule, positionIndex) {
      if (positionIndex < 0) {
        return;
      }

      const { rule_type, outlineList, schema_results } = rule;
      const meta = {
        classNames: getWidgetClassNames(rule.is_compliance === false),
      };

      // 更新当前位置索引
      rule.currentPositionIndex = positionIndex;

      // 处理 Excel 文件
      if (this.isXlsxFile) {
        EventBus.$emit('answer-item-selected', {
          index: 0,
          schemaNode: null,
          schema: { data: { label: '' } },
          data: schema_results[positionIndex].cells[0],
          meta: meta,
        });
        return;
      }

      // 处理 PDF 文件
      const currentOutline = outlineList[positionIndex];
      let label = '';

      if (rule_type === 'template') {
        label = rule.name;
      } else {
        label = currentOutline.name;
      }

      const boxs = [];
      Object.entries(currentOutline.outlines).forEach(([key, outlines]) => {
        outlines.forEach((outline) => {
          const [box_left, box_top, box_right, box_bottom] = outline;
          boxs.push({
            box: { box_left, box_top, box_right, box_bottom },
            page: +key,
            text: currentOutline.content || currentOutline.text,
          });
        });
      });

      EventBus.$emit('answer-item-selected', {
        index: 0,
        schemaNode: null,
        schema: { data: { label: label } },
        data: { boxes: boxs },
        detail: [],
        meta: meta,
      });
    },
    handlePrePageClick(rule) {
      if (this.currentDisplayingRuleId === rule.id || this.isAnalyzing(rule)) {
        return;
      }
      this.ruleItemSelected(rule, 'pre');
    },
    handleNextPageClick(rule) {
      if (this.currentDisplayingRuleId === rule.id || this.isAnalyzing(rule)) {
        return;
      }
      this.ruleItemSelected(rule, 'next');
    },
    openDiffDialog(reason) {
      this.isShowDiffDialog = true;
      this.diffText = reason.diff;
      this.baseTitle = reason.template.content_title;
      this.diffTitle = '当前合同';
      this.lawSource = reason.source;
    },
    closeDiffDialog() {
      this.isShowDiffDialog = false;
    },

    handleComplianceChangeByUser(rule, value) {
      if (rule.is_compliance !== value) {
        this.artificialRuleMap.set(rule.id, rule);
      }

      // 更新用户选择的合规状态
      rule.is_compliance_user = value;

      // 根据当前保存状态和用户新选择来决定显示哪个输入框
      if (rule.is_compliance) {
        // 当前保存的是合规
        if (!value) {
          // 用户选择不合规，显示不通过原因输入框
          rule.suggestion_mod = null;
          rule.isShowReasonTextMod = true;
          rule.isShowSuggestion = false;
        } else {
          // 用户选择合规，不需要显示输入框
          rule.suggestion_mod = rule.suggestion;
          rule.isShowReasonTextMod = false;
          rule.isShowSuggestion = false;
        }
      } else {
        // 当前保存的是不合规或未确认
        if (value) {
          // 用户选择合规，显示修改意见输入框
          rule.suggestion_mod = null;
          rule.isShowSuggestion = true;
          rule.isShowReasonTextMod = false;
        } else {
          // 用户选择不合规，显示不通过原因输入框
          rule.suggestion_mod = rule.suggestion;
          rule.isShowReasonTextMod = true;
          rule.isShowSuggestion = false;
        }
      }
    },
    toggleDisplaySuggestion(rule, flag) {
      if (this.currentDisplayingRuleId === rule.id) {
        return;
      }
      rule.isShowSuggestion = flag;
      if (!flag) {
        if (rule.suggestion_mod !== null) {
          rule.suggestion_mod = '';
        }
        this.artificialRuleMap.set(rule.id, rule);
      }
    },
    toggleDisplayReasonText(rule, flag) {
      rule.isShowReasonTextMod = flag;
      if (!flag) {
        if (rule.reason_text_mod !== null) {
          rule.reason_text_mod = '';
        }
      }
    },
    handleSuggestionChange(e, rule) {
      this.artificialRuleMap.set(rule.id, rule);
    },
    // 保存用户修改的数据
    preserveModifications() {
      const savedArtificialMap = new Map();
      for (const [key, value] of this.artificialRuleMap.entries()) {
        savedArtificialMap.set(key, { ...value });
      }

      const savedDisplayStates = new Map();
      this.cacheRuleList.forEach((rule) => {
        if (
          rule.suggestion_mod !== null ||
          rule.reason_text_mod !== null ||
          rule.isShowSuggestion ||
          rule.isShowReasonTextMod !== true
        ) {
          savedDisplayStates.set(rule.id, {
            isShowSuggestion: rule.isShowSuggestion,
            isShowReasonTextMod: rule.isShowReasonTextMod,
          });
        }
      });

      return {
        artificialMap: savedArtificialMap,
        displayStates: savedDisplayStates,
      };
    },
    // 恢复用户修改的数据
    restoreModifications(savedModifications) {
      if (
        !savedModifications ||
        !savedModifications.artificialMap ||
        savedModifications.artificialMap.size === 0
      ) {
        return;
      }

      // 恢复artificialRuleMap
      for (const [key, value] of savedModifications.artificialMap.entries()) {
        this.artificialRuleMap.set(key, value);

        // 同时更新cacheRuleList中对应的数据
        const cacheRule = this.cacheRuleList.find((rule) => rule.id === key);
        if (cacheRule) {
          if (value.is_compliance_user !== null) {
            cacheRule.is_compliance_user = value.is_compliance_user;
          }
          if (value.suggestion_mod !== null) {
            cacheRule.suggestion_mod = value.suggestion_mod;
          }
          if (value.reason_text_mod !== null) {
            cacheRule.reason_text_mod = value.reason_text_mod;
          }
        }
      }

      // 恢复展示状态
      if (
        savedModifications.displayStates &&
        savedModifications.displayStates.size > 0
      ) {
        for (const [
          key,
          displayState,
        ] of savedModifications.displayStates.entries()) {
          const cacheRule = this.cacheRuleList.find((rule) => rule.id === key);
          if (cacheRule) {
            cacheRule.isShowSuggestion = displayState.isShowSuggestion;
            cacheRule.isShowReasonTextMod = displayState.isShowReasonTextMod;
          }
        }
      }

      // 更新列表显示，但不重置原始数据以保持提交按钮可用状态
      this.updateRuleListWithoutReset();
    },
    async getAuditRuleResultRecords(item) {
      try {
        item.resultRecordsButtonLoading = true;
        const resData = await getResultRecords(item.id);
        const logs = resData
          .filter((i) => {
            const nodisplay =
              i.is_compliance_from === i.is_compliance_to &&
              !i.user_reason &&
              !i.suggestion;
            return !nodisplay;
          })
          .map((i) => {
            const { created_utc, ...rest } = i;
            return {
              ...rest,
              updated_utc: created_utc,
              user_reasons: i.user_reason ? [i.user_reason] : [],
            };
          })
          .concat({
            updated_utc: item.created_utc,
            is_ai_result: true,
            is_compliance_ai: item.is_compliance_ai,
            user_name: 'AI',
            user_reasons: item.reasons.map((i) => i.reason_text),
            suggestion: item.suggestion_ai,
            rule_type: item.rule_type,
          });
        this.auditChangelogs = logs;
        this.auditChangelogVisible = true;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        item.resultRecordsButtonLoading = false;
      }
    },
    openContractContentDialog(content) {
      this.showContractContentDialog = true;
      this.currentContractContent = content;
    },
    handleReAudit() {
      this.$emit('re-audit-file');
    },
    async handleReAnalyze(item) {
      if (this.currentDisplayingRuleId === item.id || this.isAnalyzing(item)) {
        return;
      }

      const itemIndex = this.activeName.indexOf(item.id);
      if (itemIndex > -1) {
        this.activeName.splice(itemIndex, 1);
      }
      const cacheJudgeStatus = item.judge_status;

      try {
        item.judge_status = JUDGE_STATUS.PARSING;
        // 更新缓存列表中的状态
        this.cacheRuleList = this.cacheRuleList.map((rule) => {
          if (rule.id === item.id) {
            return { ...rule, judge_status: JUDGE_STATUS.PARSING };
          }
          return rule;
        });
        // 重新过滤列表
        this.updateRuleList();

        const data = await refreshSingleJudgeResults(
          this.currentFileId,
          item.id,
        );
        this.auditRules = this.auditRules.map((rule) => {
          if (rule.id === item.id) {
            // 保留origin_contents原始内容，接口返回的为空
            return { ...rule, ...data, origin_contents: rule.origin_contents };
          }
          return rule;
        });
        // 更新缓存列表中的最终数据
        this.cacheRuleList = this.cacheRuleList.map((rule) => {
          if (rule.id === item.id) {
            return { ...rule, ...data };
          }
          return rule;
        });
        // 再次重新过滤列表
        this.updateRuleList();

        this.$notify({
          title: this.$t(`message['成功']`),
          message: '重新分析成功',
          type: 'success',
        });
      } catch (error) {
        // 使用 $set 确保响应式更新
        this.$set(item, 'judge_status', cacheJudgeStatus);
        // 更新缓存列表中的状态
        this.cacheRuleList = this.cacheRuleList.map((rule) => {
          if (rule.id === item.id) {
            return { ...rule, judge_status: cacheJudgeStatus };
          }
          return rule;
        });
        // 重新过滤列表以确保界面更新
        this.updateRuleList();
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    handleEdit(item) {
      if (this.currentDisplayingRuleId === item.id || this.isAnalyzing(item)) {
        return;
      }

      this.currentSelectedSegmentIndex = -1;
      this.currentDisplayingRuleId = item.id;

      // 保存当前编辑的审核项
      this.currentEditItem = item;

      // 根据审核项生成片段数据
      this.editSegments = this.generateSegmentsFromItem(item);

      // 显示编辑弹窗
      this.showEditDialog = true;

      // 发送弹窗打开事件
      EventBus.$emit('llm-edit-dialog-opened');

      // 激活画框提取功能 - 模拟选择一个虚拟的 Schema 节点
      this.activateDrawWidget(item);
    },

    generateSegmentsFromItem(item) {
      const segments = [];

      // 从审核项的 outlineList 中生成片段
      if (item.outlineList && item.outlineList.length > 0) {
        item.outlineList.forEach((outline, index) => {
          if (outline.text) {
            segments.push({
              content: outline.text,
              outlineData: outline, // 保存原始数据用于跳转
              ruleData: item, // 保存规则数据用于跳转
              segmentIndex: index, // 保存片段索引
            });
          }
        });
      }

      return segments;
    },

    closeEditDialog() {
      this.resetEditDialogState();
      EventBus.$emit('reset-node-selected');
    },

    resetEditDialogState() {
      this.showEditDialog = false;
      this.editSegments = [];
      this.currentEditItem = null;
      this.currentSelectedSegmentIndex = -1;
      this.currentDisplayingRuleId = null;

      // 取消画框展示
      EventBus.$emit('remove-all-frames');

      // 发送弹窗关闭事件
      EventBus.$emit('llm-edit-dialog-closed');
    },

    deleteSegment(index) {
      if (this.currentSelectedSegmentIndex === index) {
        EventBus.$emit('remove-all-frames');
        this.currentSelectedSegmentIndex = -1;
      } else if (this.currentSelectedSegmentIndex > index) {
        this.currentSelectedSegmentIndex--;
      }

      this.editSegments.splice(index, 1);
    },

    handleSegmentClick(segment, index) {
      this.currentSelectedSegmentIndex = index;

      // 处理画框提取的片段
      if (segment.isDrawnSegment && segment.boxes) {
        this.navigateToDrawnSegment(segment);
        return;
      }

      // 处理原始 outlineList 片段
      if (segment.ruleData && segment.outlineData) {
        this.navigateToPosition(segment.ruleData, segment.segmentIndex);
        return;
      }

      // 无法跳转的情况
      this.$notify({
        title: '提示',
        message: '该片段缺少跳转数据，无法定位',
        type: 'warning',
        offset: 30,
      });
    },

    navigateToDrawnSegment(segment) {
      // 直接使用画框数据进行跳转
      const { boxes } = segment;
      const itemName = this.currentEditItem?.name || '审核项';

      EventBus.$emit('answer-item-selected', {
        index: 0,
        schemaNode: null,
        schema: { data: { label: itemName } },
        data: { boxes: boxes },
        detail: [],
        meta: {
          classNames: [], // 画框提取的片段不需要特殊样式
        },
      });
    },

    async submitSegments() {
      try {
        this.submiting = true;
        EventBus.$emit('llm-edit-dialog-closed');

        await this.updateItemOutlineList();
        this.currentDisplayingRuleId = null;
        this.closeEditDialog();
      } catch (error) {
        EventBus.$emit('llm-edit-dialog-opened');
        // 如果更新失败，不关闭弹窗，让用户可以重试
        console.error('提交片段失败:', error);
      } finally {
        this.submiting = false;
      }
    },

    async updateItemOutlineList() {
      if (!this.currentEditItem) {
        return;
      }
      // 将编辑后的片段转换回 outlineList 格式
      const newOutlineList = [];

      this.editSegments.forEach((segment, index) => {
        if (segment.isDrawnSegment) {
          // 处理画框提取的片段
          const outlineItem = this.convertDrawnSegmentToOutline(segment, index);
          if (outlineItem) {
            newOutlineList.push(outlineItem);
          }
        } else {
          // 处理原始的 outline 片段，保持原有结构但更新内容
          const outlineItem = {
            ...segment.outlineData,
            content: segment.content,
            text: segment.content, // 同时更新 text 字段以保持兼容性
          };
          newOutlineList.push(outlineItem);
        }
      });
      const updateData = [];
      newOutlineList.forEach((item) => {
        updateData.push([item.text, [item.outlines]]);
      });

      try {
        const updatedData = await updateSingleJudgeResults(
          this.currentFileId,
          this.currentEditItem.id,
          updateData,
        );

        this.auditRules = this.auditRules.map((rule) => {
          if (rule.id === this.currentEditItem.id) {
            return { ...rule, ...updatedData };
          }
          return rule;
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
        throw error;
      }
    },

    convertDrawnSegmentToOutline(segment) {
      if (!segment.boxes || segment.boxes.length === 0) {
        return null;
      }

      // 将画框数据转换为 outlines 格式
      const outlines = {};
      segment.boxes.forEach((boxData) => {
        const page = boxData.page || 0;
        if (!outlines[page]) {
          outlines[page] = [];
        }

        // 将 box 对象转换为数组格式 [left, top, right, bottom]
        const box = boxData.box;
        outlines[page].push([
          box.box_left,
          box.box_top,
          box.box_right,
          box.box_bottom,
        ]);
      });

      return {
        name: this.currentEditItem.name,
        content: segment.content,
        text: segment.content,
        outlines: outlines,
      };
    },

    activateDrawWidget(item) {
      const virtualKey = this.createVirtualNodeKey(item.id);
      const label = `${this.VIRTUAL_NODE_LABEL_PREFIX}${item.name}`;
      const virtualSchemaNode = this.createVirtualSchemaNode(
        item,
        virtualKey,
        label,
      );

      EventBus.$emit('schema-node-selected', {
        key: virtualKey,
        model: virtualSchemaNode,
        ignoreAnswer: true,
        _isVirtualForLLMReview: true,
      });
    },

    createVirtualNodeKey(itemId) {
      return `${this.VIRTUAL_NODE_PREFIX}${itemId}`;
    },

    createVirtualSchemaNode(item, virtualKey) {
      const label = `${this.VIRTUAL_NODE_LABEL_PREFIX}${item.name}`;
      return {
        data: { label },
        meta: {
          _deepIndex: [0],
          _deepLabels: [label],
          _uuid: virtualKey,
          _isVirtualForLLMReview: true,
        },
        children: [],
      };
    },

    handleCreateAnswerItem({ boxes }) {
      if (!this.showEditDialog) {
        return;
      }

      this.processDrawWidgetResult(boxes);
    },

    processDrawWidgetResult(boxes) {
      const text = boxes.map((box) => box.text).join('');

      // 创建可跳转的片段数据
      const newSegment = {
        content: text,
        boxes: boxes, // 保存画框数据用于跳转
        isDrawnSegment: true, // 标记为画框提取的片段
      };

      this.editSegments.push(newSegment);
      // 选中当前新增的一条
      this.handleSegmentClick(newSegment, this.editSegments.length - 1);
    },

    showSuccessNotification(message) {
      this.$notify({
        title: '成功',
        message,
        type: 'success',
        offset: 30,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-audit-container {
  font-size: 13px;
  padding: 0 10px 6px;
  background: #eff2f5;
  height: calc(100vh - 42px);
  overflow: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .rule-audit-header {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #eff2f5;
    padding-top: 6px;
  }
  .rule-audit-tips {
    flex: 1;
    > div {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      color: #0090c0;
      font-size: 14px;
      &.tips-audit-error {
        color: #ff0000;
      }
      i {
        font-size: 26px;
        margin-bottom: 5px;
      }
      span {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .operater-list {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  .type-select-area {
    background: #fff;
    margin-bottom: 7px;
    padding: 6px;
    border-radius: 4px;
    .result-switch-select {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 14px;
      .noncompliance-count {
        display: flex;
        align-items: center;
        line-height: 28px;
        cursor: pointer;
        column-gap: 4px;
        span {
          text-decoration: underline;
          cursor: pointer;
          font-size: 16px;
        }
        .compliance-count {
          color: #67c23a;
          &.selected {
            font-weight: bold;
            font-size: 18px;
          }
        }
        .separator {
          color: #909399;
          margin: 0 5px;
        }
        .noncompliance-count {
          color: #f56c6c;
          &.selected {
            font-weight: bold;
            font-size: 18px;
          }
        }
        .not-applicable-count {
          color: #606266;
          &.selected {
            font-weight: bold;
            font-size: 18px;
          }
        }
      }
      > div {
        display: flex;
        align-items: center;
        .result-type-select {
          width: 120px;
          margin-left: 5px;
        }
      }
    }

    .schema-change-container {
      display: flex;
      align-items: center;
      gap: 15px;

      .search-item {
        flex: 1;
        display: flex;
        align-items: center;

        span {
          white-space: nowrap;
          margin-right: 8px;
          font-size: 14px;
        }

        .law-order-select,
        .cp-name-input {
          flex: 1;
        }
      }
    }
  }
  .rule-audit-result-list {
    overflow-y: auto;
    .is-collapse-expanded {
      ::v-deep .el-collapse-item__header {
        pointer-events: none;
      }
    }
    ::v-deep .rule-audit-item {
      background: #fff;
      margin-bottom: 7px;
      padding: 6px;
      border-radius: 4px;

      &.rule-audit-item-displaying {
        border: 2px solid #409eff;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      }

      // 禁用状态的样式
      &.is-disabled {
        opacity: 0.8;

        .el-collapse-item__header {
          color: #303133;
          .rule-name {
            color: #bbb;
          }
        }
      }

      .el-collapse-item__header {
        border-bottom: 0;
        font-weight: normal;

        &.focusing {
          color: #303133;
        }
        .rule-audit-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          position: relative;
          .title {
            width: 60%;
            display: flex;
            align-items: baseline;
            > span {
              display: block;
              max-width: calc(100% - 50px);
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              margin-right: 5px;
            }
            .el-icon-refresh,
            .el-icon-edit {
              margin-left: 5px;
              cursor: pointer;
              font-size: 14px;

              &.is-disabled {
                color: #c0c4cc;
                cursor: not-allowed;
                opacity: 0.6;
              }
            }
            i {
              pointer-events: auto;
            }
            .el-icon-info {
              cursor: pointer;
            }
            .page-button-group {
              display: flex;
              align-items: center;
              > i {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                &.is-disabled {
                  color: #ccc;
                  cursor: not-allowed;
                }
              }
            }
          }
          .click-container {
            padding-left: 16px;
            padding-right: 20px;
            pointer-events: auto;
            position: absolute;
            right: -14px;
          }
          .compliance-result {
            &::before {
              content: '';
              width: 8px;
              height: 8px;
              display: inline-block;
              margin: 0 4px;
            }
            &.success {
              color: #7bda86;
              &::before {
                background: #7bda86;
              }
            }
            &.fail {
              color: #fb8f8f;
              &::before {
                background: #fb8f8f;
              }
            }
            &.undo {
              color: #ccc;
              &::before {
                background: #ccc;
              }
            }
            &.analyzing {
              color: #409eff;
              &::before {
                background: #409eff;
              }
            }
            &.analyze-failed {
              color: #f56c6c;
              &::before {
                background: #f56c6c;
              }
            }
          }
        }
        .el-collapse-item__arrow {
          margin: 0;
        }
      }
      .el-collapse-item__wrap {
        border-bottom: 0;
        position: relative;
        overflow: initial;
        .compliance-selection {
          display: flex;
          justify-content: space-between;
          padding-right: 13px;
          .compliance-select {
            width: 150px;
            margin-left: 10px;
            margin-right: 20px;
            z-index: 1;
          }
        }
        .origin-law {
          display: flex;
          margin-top: 15px;
          .title {
            flex-shrink: 0;
          }
          .content {
            white-space: pre-line;
          }
        }
        .failure-reasons-container {
          display: flex;
          margin-top: 15px;
          .failure-reason-title {
            &.consistency-check-title {
              display: flex;
              align-items: center;
            }
          }
          .user-reason {
            margin-left: 10px;
            margin-right: 15px;
            flex: 1;
          }
          .failure-reason-list {
            margin-right: 15px;
            flex: 1;
            li {
              list-style: none;
              .el-button--text {
                padding: 0;
                margin-left: 5px;
                font-weight: normal;
                font-size: 13px;
              }
            }
          }
        }
        .add-reason {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 15px;
          .el-icon-question {
            color: #409eff;
          }
          .el-button--text {
            padding: 0;
          }
        }
        .modify-reason {
          display: flex;
          align-items: center;
          margin-top: 15px;
          .el-textarea {
            flex: 1;
            margin: 0 10px;
          }
          .el-icon-error {
            color: #fb8f8f;
            cursor: pointer;
          }
          .is-disabled {
            color: #ccc;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .contract-content {
    margin-bottom: 10px;
    line-height: 26px;
    white-space: pre-line;
    .el-button--text {
      padding: 0;
      font-size: 13px;
    }
  }
}
</style>
<style lang="scss">
/* 审核片段弹窗样式 */
.audit-segment-dialog {
  position: fixed;
  top: 50px;
  right: 50px;
  z-index: 2000;
  pointer-events: auto;
  width: 750px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.65);

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e4e7ed;
    cursor: move;
    user-select: none;

    .dialog-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .header-actions {
      display: flex;
      gap: 8px;

      .el-button {
        padding: 7px 15px;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }

  .dialog-body {
    padding: 20px;
  }

  .segment-description {
    padding: 15px 0;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 20px;

    .description-text {
      color: #606266;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .segment-list {
    max-height: 400px;
    overflow-y: auto;

    .segment-item {
      display: flex;
      align-items: flex-start;
      padding: 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f5f7fa;
      }

      &.segment-item-selected {
        background-color: #e6f7ff;
      }

      .segment-number {
        color: #303133;
        font-weight: 500;
        margin-right: 12px;
        margin-top: 2px;
        min-width: 20px;
      }

      .segment-content {
        flex: 1;

        .segment-title {
          color: #303133;
          font-weight: 500;
          margin-bottom: 4px;
          line-height: 1.4;
          font-size: 14px;
        }

        .segment-text {
          color: #606266;
          line-height: 1.5;
          font-size: 14px;
          white-space: pre-line;
        }
      }

      .segment-actions {
        margin-left: 12px;
        margin-top: 2px;

        .delete-icon {
          color: #f56c6c;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;

          &:hover {
            background-color: #fef0f0;
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style>
