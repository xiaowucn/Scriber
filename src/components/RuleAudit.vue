<template>
  <div class="rule-audit-container">
    <div class="rule-audit-header">
      <div v-if="!hideHeaderButtons" class="page-header operater-list">
        <el-button
          v-if="isShowSubmitBtn"
          type="primary"
          size="mini"
          :disabled="submitButtonDisabled"
          :loading="submitLoading"
          @click="updateAuditRuleResult">
          提交
        </el-button>
        <div class="right" v-if="isShowExportBtn">
          <el-dropdown trigger="click" @command="handleExportCommand">
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
              <el-dropdown-item command="word" v-if="$platform.isCgsEnv()">
                原文与审核结果（Word）
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="external-status-content" v-if="statusContent">
        <span>
          <span>数据状态:</span>
          <span :class="{ 'is-failed': [20, 23].includes(externalStatus) }">
            {{ statusContent.status }}
          </span>
        </span>
        <span>
          {{ statusContent.dateKey }}: {{ externalDate | datetime }}
        </span>
      </div>
      <div class="type-select-area">
        <div class="result-switch-select">
          <!-- withLlmReview为true时的展示方式 -->
          <template v-if="withLlmReview">
            <div>
              <span>审核结果：</span>
              <el-tooltip
                effect="dark"
                content="合规 | 不合规 | 不适用 | 人工确认 的数量"
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
                  <span class="separator">|</span>
                  <span
                    class="manual-confirmation-count"
                    :class="{ selected: selectedCompliance === 'by_user' }"
                    @click="handleFilterClick('by_user')"
                    >{{ manualConfirmationCount }}</span
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
            </div>
          </template>
          <!-- withLlmReview为false时的原有展示方式 -->
          <template v-else>
            <span class="noncompliance-count"
              >不合规： {{ nonCompliance.length }}/{{ auditRules.length }}</span
            >
            <div>
              <span>仅查看：</span>
              <el-select
                v-model="compliance"
                size="mini"
                class="compliance-select"
                @change="handleComplianceChange">
                <el-option
                  v-for="item in complianceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
            </div>
          </template>
        </div>
        <div class="schema-change-container">
          <span>名称 / {{ $text.schema['Schema字段'] }}：</span>
          <el-select
            v-model="schemaField"
            filterable
            clearable
            placeholder="请选择"
            class="schema-select"
            size="mini"
            @change="handleSchemaFieldChange">
            <el-option
              v-for="item in schemaFieldList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div
      v-if="!isAuditSuccess && $features.showAuditStatus() && !statusContent"
      class="rule-audit-tips">
      <div v-if="isAuditingFail" class="tips-audit-error">
        <i class="el-icon-circle-close"></i>
        <p>审核失败，请点击<span @click="handleReAudit">重新审核</span></p>
      </div>
      <div v-if="isAuditing" class="tips-auditing">
        <i class="el-icon-loading"></i>
        <p>正在审核中</p>
      </div>
    </div>
    <el-collapse v-else class="rule-audit-result-list" v-model="activeName">
      <el-collapse-item
        v-for="item in ruleList"
        :key="item.id"
        class="rule-audit-item"
        :class="{ 'is-collapse-expanded': activeName.includes(item.id) }"
        :name="item.id"
        @click.native="ruleAuditClick(item)">
        <template slot="title">
          <div class="rule-audit-item-header">
            <div class="title">
              <el-tooltip
                effect="dark"
                :content="item.name"
                placement="top"
                :open-delay="500">
                <span>{{ item.name }}</span>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                popper-class="origin-content-tip"
                :content="
                  '法规原文：' +
                  (item.origin_contents && item.origin_contents.join('\n'))
                "
                placement="right-start">
                <i
                  class="el-icon-info"
                  v-if="
                    !withLlmReview &&
                    item.origin_contents &&
                    item.origin_contents[0]
                  "
                  @click.stop.prevent="() => {}"></i>
              </el-tooltip>
              <div class="page-button-group" v-if="item.outlineList.length > 1">
                <i
                  class="el-icon-arrow-left"
                  :class="{ 'is-disabled': item.currentPositionIndex === 0 }"
                  @click.stop="(e) => handlePrePageClick(item)"></i>
                <span>{{
                  item.currentPositionIndex + 1 + '/' + item.outlineList.length
                }}</span>
                <i
                  class="el-icon-arrow-right"
                  :class="{
                    'is-disabled':
                      item.currentPositionIndex === item.outlineList.length - 1,
                  }"
                  @click.stop="(e) => handleNextPageClick(item)"></i>
              </div>
            </div>
            <div
              class="click-container"
              @click.stop.prevent="changeShowDetail(item)">
              <span
                class="compliance-result"
                :class="
                  item.is_compliance === null
                    ? 'undo'
                    : item.is_compliance
                      ? 'success'
                      : 'fail'
                "
                >{{
                  item.is_compliance === null
                    ? '不适用'
                    : item.is_compliance
                      ? '合规'
                      : '不合规'
                }}</span
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
              @change="(value) => handleComplianceChangeByUser(item, value)">
              <el-option
                v-for="item in complianceOptions.slice(0, 2)"
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
          v-if="
            withLlmReview && item.origin_contents && item.origin_contents[0]
          ">
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
              item.is_compliance_user === true
            ">
            <div v-if="withLlmReview && item.reasons.length > 0">
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
              <div class="reason-title">
                {{ withLlmReview ? '判定依据：' : '不通过原因：' }}
              </div>
              <el-input
                type="textarea"
                v-model="item.reason_text_mod"
                resize="none"
                @click.native.stop>
              </el-input>
              <i
                class="el-icon-error"
                @click.stop="toggleDisplayReasonText(item, false)"></i>
            </div>
            <div class="add-reason" v-else>
              <i class="el-icon-question"></i>
              <el-button
                type="text"
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
            <div class="failure-reason-title">
              {{
                withLlmReview
                  ? '判定依据：'
                  : item.is_compliance === null
                    ? '不适用原因：'
                    : '不通过原因：'
              }}
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
            :autosize="{ minRows: 2, maxRows: 20 }"
            @blur="(e) => handleSuggestionChange(e, item)"
            @click.native.stop>
          </el-input>
          <i
            class="el-icon-error"
            @click.stop="toggleDisplaySuggestion(item, false)"></i>
        </div>
        <div class="add-reason" v-else>
          <i class="el-icon-question"></i>
          <el-button
            type="text"
            @click.stop="toggleDisplaySuggestion(item, true)"
            >添加意见</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      title="详情"
      :visible="true"
      v-if="isShowDiffDialog"
      width="70%"
      :close-on-click-modal="false"
      :before-close="closeDiffDialog">
      <div v-if="diffTextTotal.length > 0" class="text-diff-header">
        <el-button
          v-if="diffTextTotal.length > 1"
          size="mini"
          plain
          :disabled="diffIndex === 0"
          @click="jumpDiffText('prev')">
          上一个
        </el-button>
        <div class="num">
          {{ diffTextTotal.length === 0 ? 0 : diffIndex + 1 }}
          /
          {{ diffTextTotal.length }}
        </div>
        <el-button
          v-if="diffTextTotal.length > 1"
          size="mini"
          plain
          :disabled="diffIndex >= diffTextTotal.length - 1"
          @click="jumpDiffText('next')">
          下一个
        </el-button>
      </div>
      <div class="text-diff-container" ref="textDiffContainer">
        <div class="base">
          <h4>{{ baseTitle }}</h4>
          <h5 v-if="lawSource" class="law-source">{{ lawSource }}</h5>
          <p
            v-for="(paragraph, paragraphIndex) in diffText"
            :key="paragraphIndex"
            v-html="paragraph.left"
            :class="[paragraph.type !== 'equal' ? 'has-diff' : '']"></p>
        </div>
        <div class="diff">
          <h4>{{ diffTitle }}</h4>
          <p
            class="paragraph-item"
            :class="[paragraph.type !== 'equal' ? 'has-diff' : '']"
            v-for="(paragraph, paragraphIndex) in diffText"
            :key="paragraphIndex"
            v-html="paragraph.html"></p>
        </div>
      </div>
    </el-dialog>

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
      @close="auditChangelogVisible = false"></rule-audit-changelog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { downloadFileByBlob } from '@/utils';
import { cgs as cgsApi, ruleAudit as ruleAuditApi } from '@/store/api';
import EventBus from '@/components/remark/remark-tree/EventBus';
import RuleAuditChangelog from '@/components/RuleAuditChangelog';
import { AUDIT_STATUS_MAP } from '@/store/constants';
import { isCiticsTgAllow } from '@/custom/citics_tg/common/utils';
import { getWidgetClassNames } from '../custom/cmfchina/common/utils';

export default {
  name: 'rule-audit',
  components: { RuleAuditChangelog },
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
    currentAnswerMoldId: {
      type: Number,
      required: false,
      default: null,
    },
    hideHeaderButtons: {
      type: Boolean,
      default: false,
    },
    withLlmReview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.complianceOptions = [
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
      {
        label: '人工确认',
        value: 'by_user',
      },
      {
        label: '全部',
        value: 'all',
      },
    ];
    this.consistencyOptions = [
      {
        label: '一致性检查',
        value: true,
      },
      {
        label: '非一致性检查',
        value: false,
      },
      {
        label: '全部',
        value: 'all',
      },
    ];
    return {
      AUDIT_STATUS_MAP,
      ruleList: [],
      currentRuleId: null,
      ruleListOriginal: [],
      cacheRuleList: [],
      activeName: [],
      artificialRuleMap: new Map(),
      compliance: 'all',
      consistency: 'all',
      schemaField: '',
      selectedCompliance: 'all',
      schemaFieldList: [],
      showContractContentDialog: false,
      isShowDiffDialog: false,
      currentContractContent: '',
      baseText: [],
      diffText: [],
      baseTitle: '',
      diffTitle: '',
      diffIndex: 0,
      lawSource: '',
      auditChangelogs: [],
      auditChangelogVisible: false,
      submitLoading: false,
      externalStatus: null,
    };
  },

  computed: {
    ...mapGetters('ruleAuditModule', ['auditRules', 'multiSchemaAuditRules']),
    ...mapGetters('remarkModule', ['question']),
    nonCompliance() {
      return this.cacheRuleList.filter((item) => {
        return !item.is_compliance;
      });
    },
    complianceCount() {
      return this.cacheRuleList.filter((item) => {
        return item.is_compliance === true;
      }).length;
    },
    nonComplianceCount() {
      return this.cacheRuleList.filter((item) => {
        return item.is_compliance === false;
      }).length;
    },
    notApplicableCount() {
      return this.cacheRuleList.filter((item) => {
        return item.is_compliance === null;
      }).length;
    },
    manualConfirmationCount() {
      return this.cacheRuleList.filter((item) => {
        return (
          item.is_compliance != null &&
          item.is_compliance != item.is_compliance_ai
        );
      }).length;
    },
    diffTextTotal() {
      return this.diffText.filter((t) => t.type !== 'equal');
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
    statusContent() {
      const statusMap = {
        20: {
          status: '推送失败',
          dateKey: '推送失败时间',
        },
        21: {
          status: '等待回调',
          dateKey: '推送成功时间',
        },
        22: {
          status: '回调处理中',
          dateKey: '回传时间',
        },
        23: {
          status: '回调处理失败',
          dateKey: '回传失败时间',
        },
        24: {
          status: '回调处理成功',
          dateKey: '回传成功时间',
        },
      };

      return statusMap[this.externalStatus];
    },
    isAuditSuccess() {
      return this.externalStatus === AUDIT_STATUS_MAP.AUDIT_SUCCESS;
    },
    isAuditing() {
      return this.externalStatus === AUDIT_STATUS_MAP.AUDITING;
    },
    isAuditingFail() {
      return this.externalStatus === AUDIT_STATUS_MAP.AUDIT_FAIL;
    },
    isShowSubmitBtn() {
      if (this.isCiticsTGEnv && this.$route.meta.isCustom) {
        return (
          this.isOperatePerm &&
          this.isCiticsTgAllow('prj_detail_file_audit_submit')
        );
      }
      return true;
    },
    isShowExportBtn() {
      if (this.isCiticsTGEnv && this.$route.meta.isCustom) {
        return (
          this.isOperatePerm &&
          this.isCiticsTgAllow('prj_detail_file_audit_export')
        );
      }
      if (this.$platform.isCmfchinaEnv() && !this.supportExportAsPDF) {
        return false;
      }
      return true;
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
      if (this.$platform.isCmfchinaEnv()) {
        schemaId = this.currentAnswerMoldId;
      } else {
        if (this.schemaId) {
          schemaId = this.schemaId;
        } else {
          schemaId = this.$route.query.schemaId;
        }
      }
      return schemaId;
    },
    isShowExportAuditResultOption() {
      return !this.$platform.isCmfchinaEnv();
    },
    isXlsxFile() {
      return ['xls', 'xlsx'].includes(this.$route.query.fileSuffix);
    },
    supportExportAsPDF() {
      return !this.isXlsxFile;
    },
    isCiticsTGEnv() {
      return this.$platform.isCiticsTGEnv();
    },
  },

  watch: {
    auditRules(val) {
      const cacheRuleList = [];
      const schemaFieldSet = new Set();
      this.activeName = [];
      _.cloneDeep(val).forEach((item) => {
        const { reasons, schema_results } = item;
        let outlineList = [];
        let outlinesOrigin = [...(reasons || []), ...(schema_results || [])];
        outlinesOrigin.forEach((item) => {
          if (item.outlines && !_.isNil(item.page)) {
            outlineList.push(item);
          }
          if (
            item.template &&
            item.template.outlines &&
            !_.isNil(item.template.page)
          ) {
            outlineList.push(item.template);
          }
        });
        if (!item.is_compliance) {
          this.activeName.push(item.id);
        }
        cacheRuleList.push({
          ...item,
          suggestion_mod: item.suggestion,
          isShowSuggestion: !!item.suggestion,
          currentPositionIndex: 0,
          outlineList: this.removeDuplicateOutlines(outlineList),
          reason_text_mod: null,
          isShowReasonTextMod: true,
          resultRecordsButtonLoading: false,
          origin_contents: this.processOriginContents(
            item.origin_contents || [],
          ),
        });
        if (item.rule_type === 'template') {
          schemaFieldSet.add(item.name);
        } else {
          schemaFieldSet.add(item.name);
          item.schema_results.forEach((element) => {
            schemaFieldSet.add(element.name);
          });
        }
      });
      this.cacheRuleList = cacheRuleList;
      this.schemaFieldList = [...schemaFieldSet];
      this.updateRuleList();
    },
    qid() {
      this.fetchFileAuditRuleResult();
    },
    currentAnswerMoldId(id) {
      const currentSchemaAuditRules = this.multiSchemaAuditRules.find(
        (item) => item.mold.id === id,
      );
      this.$store.commit(
        'ruleAuditModule/SET_AUDIT_RULES',
        currentSchemaAuditRules?.results || [],
      );
    },
  },

  created() {
    if (this.$features.showExternalAudit()) {
      this.consistencyOptions = [
        {
          label: '非一致性检查',
          value: false,
        },
        {
          label: '外部决策检查',
          value: true,
        },
        {
          label: '全部',
          value: 'all',
        },
      ];
    }

    if (this.$platform.isCgsEnv()) {
      this.compliance = false;
      this.selectedCompliance = false;
      this.consistency = true;
    }

    if (this.$route.query.task_type === 'audit') {
      this.fetchFileAuditRuleResult();
    }
  },

  methods: {
    isCiticsTgAllow,
    changeShowDetail(item) {
      const expandedIndex = this.activeName.findIndex((id) => item.id === id);
      if (expandedIndex >= 0) {
        this.activeName = this.activeName.filter((id) => item.id !== id);
      } else {
        this.activeName.push(item.id);
      }
    },
    async fetchFileAuditRuleResult() {
      try {
        await this.$store.dispatch('ruleAuditModule/fetchFileAuditRuleResult', {
          fileId: this.currentFileId,
          schemaId: this.currentSchemaId,
        });
        if (
          this.$features.showExternalAudit() ||
          this.$features.showAuditStatus()
        ) {
          await this.getFileAuditStatus();
        }
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async getFileAuditStatus() {
      const { data } = await ruleAuditApi.fetchFileAuditStatus(
        this.currentFileId,
      );
      if (data) {
        this.externalStatus = data.status;
        this.externalDate = data.updated_utc;
      }
    },
    // 处理法规名称，确保有中文书名号
    processOriginContents(contents) {
      let processedContents = [...contents];
      // 处理法规名称，确保有中文书名号
      if (processedContents.length > 0 && processedContents[0]) {
        // 分别检查前后是否缺少中文书名号
        let resultContent = processedContents[0];
        if (!resultContent.startsWith('《')) {
          resultContent = `《${resultContent}`;
        }
        if (!resultContent.endsWith('》')) {
          resultContent = `${resultContent}》`;
        }

        processedContents[0] = resultContent;
      }
      return processedContents;
    },
    async updateAuditRuleResult() {
      try {
        this.submitLoading = true;
        const data = {
          results: [],
        };
        for (const value of this.artificialRuleMap.values()) {
          const result = {
            result_id: value.id,
            is_compliance: value.is_compliance,
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
          await this.$store.dispatch('ruleAuditModule/updateAuditRuleResult', {
            fileId: this.currentFileId,
            schemaId: this.currentSchemaId,
            data,
          });
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
    removeDuplicateOutlines(outlineList) {
      const results = [];
      outlineList.forEach((outline) => {
        const isExist = results.find((item) => {
          return (
            outline.page === item.page &&
            _.isEqual(
              outline.outlines[outline.page],
              item.outlines[outline.page],
            )
          );
        });
        if (!isExist) {
          results.push(outline);
        }
      });
      return results;
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
    handleSchemaFieldChange() {
      this.updateRuleList();
    },
    handleComplianceChange() {
      this.updateRuleList();
    },
    handleFilterClick(value) {
      this.compliance = this.compliance === value ? 'all' : value;
      this.selectedCompliance = this.compliance === 'all' ? 'all' : value;
      this.updateRuleList();
    },
    handleConsistencyChange() {
      this.updateRuleList();
    },
    updateRuleList() {
      this.updateRuleListWithoutReset();
      this.ruleListOriginal = _.cloneDeep(this.ruleList);
    },
    updateRuleListWithoutReset() {
      if (this.schemaField) {
        this.ruleList = this.cacheRuleList.filter((item) => {
          return this.isMatched(item, true);
        });
      } else {
        this.ruleList = this.cacheRuleList.filter((item) => {
          return this.isMatched(item);
        });
      }
    },
    isMatched(rule, matchSchema) {
      let isConsistency = rule.rule_type === 'template';
      if (this.$features.showExternalAudit()) {
        isConsistency = rule.rule_type === 'external';
      }
      let isMatchedSchema = true;
      if (matchSchema) {
        if (
          isConsistency &&
          !(this.isCiticsTGEnv || this.$platform.isCmfchinaEnv())
        ) {
          isMatchedSchema = rule.name === this.schemaField;
        } else {
          isMatchedSchema =
            rule.name === this.schemaField ||
            rule.schema_results.find((item) => {
              return item.name === this.schemaField;
            });
        }
      }
      let isMatchedCompliance = false;
      if (this.compliance === 'all') {
        isMatchedCompliance = true;
      } else if (this.compliance === 'by_user') {
        isMatchedCompliance =
          rule.is_compliance != null &&
          rule.is_compliance != rule.is_compliance_ai;
      } else {
        isMatchedCompliance = rule.is_compliance === this.compliance;
      }
      let isMatchedConsistency = false;
      if (this.consistency === 'all') {
        isMatchedConsistency = true;
      } else {
        isMatchedConsistency = isConsistency === this.consistency;
      }
      return isMatchedCompliance && isMatchedConsistency && isMatchedSchema;
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
      let label = '';
      const meta = {
        classNames: getWidgetClassNames(rule.is_compliance === false),
      };
      const { rule_type, outlineList, schema_results } = rule;
      if (this.isXlsxFile) {
        EventBus.$emit('answer-item-selected', {
          index: 0,
          schemaNode: null,
          schema: { data: { label } },
          data: schema_results[rule.currentPositionIndex].cells[0],
          meta: meta,
        });

        return;
      }

      if (outlineList.length === 0) {
        return;
      }
      if (action === 'pre') {
        rule.currentPositionIndex--;
        if (rule.currentPositionIndex < 0) {
          rule.currentPositionIndex = 0;
        }
      } else if (action === 'next') {
        rule.currentPositionIndex++;
        if (rule.currentPositionIndex > outlineList.length - 1) {
          rule.currentPositionIndex = outlineList.length - 1;
        }
      } else {
        rule.currentPositionIndex = 0;
      }

      if (rule_type === 'template') {
        label = rule.name;
      } else {
        label = outlineList[rule.currentPositionIndex].name;
      }
      const boxs = [];
      Object.entries(outlineList[rule.currentPositionIndex].outlines).forEach(
        ([key, outlines]) => {
          outlines.forEach((outline) => {
            const [box_left, box_top, box_right, box_bottom] = outline;
            boxs.push({
              box: { box_left, box_top, box_right, box_bottom },
              page: +key,
              text:
                outlineList[rule.currentPositionIndex].content ||
                outlineList[rule.currentPositionIndex].text,
            });
          });
        },
      );
      EventBus.$emit('answer-item-selected', {
        index: 0,
        schemaNode: null,
        schema: { data: { label: label } },
        data: { boxes: boxs },
        detail: [],
        meta: meta,
        subType: meta.classNames.includes('red') ? 'red-active' : 'active',
      });
    },
    handlePrePageClick(rule) {
      this.ruleItemSelected(rule, 'pre');
    },
    handleNextPageClick(rule) {
      this.ruleItemSelected(rule, 'next');
    },
    openDiffDialog(reason) {
      this.isShowDiffDialog = true;
      this.baseText = [reason.template.content];
      this.diffText = reason.diff;
      this.baseTitle = reason.template.content_title;
      this.diffTitle = reason.content_title;
      this.lawSource = reason.source;
      this.$nextTick(() => {
        this.scrollToDiffText(0);
      });
    },
    closeDiffDialog() {
      this.isShowDiffDialog = false;
      this.diffIndex = 0;
    },
    jumpDiffText(direction) {
      if (direction === 'prev') {
        this.diffIndex--;
      } else {
        this.diffIndex++;
      }
      this.scrollToDiffText(this.diffIndex);
    },
    scrollToDiffText(index) {
      const diffContainer = this.$refs.textDiffContainer;
      const allBaseTextDoms =
        diffContainer.querySelectorAll('.base > p.has-diff');
      const allDiffTextDoms =
        diffContainer.querySelectorAll('.diff > p.has-diff');
      [...allBaseTextDoms, ...allDiffTextDoms].forEach((dom) => {
        dom.classList.remove('active');
      });
      if (allDiffTextDoms[index]) {
        allDiffTextDoms[index].scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
        allBaseTextDoms[index].classList.add('active');
        allDiffTextDoms[index].classList.add('active');
      }
    },
    handleComplianceChangeByUser(rule, value) {
      if (rule.is_compliance !== value) {
        this.artificialRuleMap.set(rule.id, rule);
      }
      if (rule.is_compliance) {
        if (!value) {
          rule.suggestion_mod = null;
        } else {
          rule.suggestion_mod = rule.suggestion;
        }
      } else {
        if (value) {
          rule.suggestion_mod = null;
        } else {
          rule.suggestion_mod = rule.suggestion;
        }
      }
    },
    toggleDisplaySuggestion(rule, flag) {
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
        const res = await ruleAuditApi.fetchAuditRuleResultRecords({
          resultId: item.id,
        });
        const logs = res.data
          .filter((i) => {
            const nodisplay =
              i.is_compliance_from === i.is_compliance_to &&
              !i.user_reason &&
              !i.suggestion;
            return !nodisplay;
          })
          .map((i) => {
            return {
              ...i,
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
  .external-status-content {
    background: #fff;
    padding: 12px 6px;
    margin-bottom: 7px;
    border-radius: 4px;
    color: $--color-primary;
    display: flex;
    justify-content: space-between;

    .is-failed {
      color: #f56c6c;
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
        .manual-confirmation-count {
          color: #225476;
          &.selected {
            font-weight: bold;
            font-size: 18px;
          }
        }
      }
      > div {
        display: flex;
        align-items: center;
        .compliance-select {
          width: 95px;
        }
        .result-type-select {
          width: 120px;
          margin-left: 5px;
        }
      }
    }

    .schema-change-container {
      display: flex;
      align-items: center;
      .schema-select {
        flex: 1;
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
            i {
              pointer-events: auto;
            }
            > span {
              display: block;
              max-width: calc(100% - 50px);
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              margin-right: 5px;
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
            font-weight: bold;
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
        }
      }
    }
  }
  .text-diff-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .num {
      margin: 0 10px;
    }
  }
  .text-diff-container {
    display: flex;
    max-height: 60vh;
    overflow-y: auto;
    line-height: 26px;
    h4 {
      position: sticky;
      top: 0;
      margin-bottom: 10px;
      background: #fff;
      text-align: center;
    }
    .law-source {
      position: sticky;
      top: 25px;
      font-size: 13px;
      background-color: #fff;
    }
    .base {
      width: 50%;
      height: 100%;
      > p > span {
        white-space: pre-line;
      }
    }
    ::v-deep .diff {
      width: 50%;
      height: 100%;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid #ccc;
      s {
        text-decoration: line-through;
        text-decoration-color: #ff4949;
      }
      u {
        color: #14b35b;
        text-decoration: underline;
        text-decoration-color: #14b35b;
      }
    }
    .has-diff {
      background: rgba(#557de6, 0.2);
      &.active {
        background: rgba(0, 191, 255, 0.4);
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
.origin-content-tip,
.user-content-tip {
  max-width: 400px;
  max-height: 400px;
  white-space: pre-line;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
