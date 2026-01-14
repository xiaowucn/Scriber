<template>
  <div class="container" v-loading="loading">
    <div class="rule-list-container" :style="{ height: ruleListHeight }">
      <div class="ratio-list">
        <ul>
          <li
            v-for="(ratio, index) in ratioList"
            :key="index"
            :class="[
              currentRatio.name === ratio.name ? 'active' : '',
              !ratio.visible ? 'disabled' : '',
              getRatioRedFlag(ratio) ? 'is-nc' : 'is-c',
            ]"
            @click="ratioItemClicked(ratio.name, index)">
            <div class="name">
              <span>{{ index + 1 }}:</span>
              <h4>{{ ratio.label }}</h4>
            </div>
            <p v-if="ratio.visible" class="ratio-score">
              <span
                v-if="isRatio6(ratio)"
                :class="[
                  getRatio6RedFlagNum(ratio.brief_summary.summary) > 0
                    ? 'red'
                    : '',
                ]">
                <span>{{ ratio.brief_summary.description }}</span>
                <span>
                  {{ getRatio6RedFlagNum(ratio.brief_summary.summary) }}
                </span>
              </span>
              <template v-else>
                <span
                  v-for="(ai, aiIndex) in ratio.brief_summary.summary"
                  :key="aiIndex"
                  :class="[ai.red_flag ? 'red' : '']">
                  {{ ai.ratio_str }}
                </span>
              </template>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="gutter-vertical"
      v-dragVertical="{ dragingLine: 'line1', headerHeight: 33 }"></div>
    <div
      class="rule-description-container"
      :style="{ height: ruleDescriptionHeight }">
      <historical-rules :rules="ruleHistory" />
      <div class="description">
        <div class="definition">{{ ruleHistory.review.description }}</div>
        <div
          v-if="showLatex(currentRatio.description)"
          v-katex
          class="desc"
          v-text="currentRatio.description"></div>
        <div v-else class="desc">
          {{ currentRatio.description }}
        </div>
      </div>
    </div>

    <div
      class="gutter-vertical align-center"
      v-dragVertical="{ dragingLine: 'line2', headerHeight: 33 }"></div>

    <div class="details">
      <div class="ai-suggestion">
        <div class="title">
          <h4>AI suggestion</h4>
        </div>
        <template v-if="currentRatio.ai.length">
          <div class="currency-and-unit">
            <div>
              Currency:
              <span
                @click="
                  ratioTextClicked(
                    'AI Answers',
                    currentRatio.ai_currency_info.currency,
                    'Currency',
                  )
                ">
                {{ currentRatio.ai_currency_info.currency.text }}
              </span>
            </div>
            <div>
              Unit:
              <span
                @click="
                  ratioTextClicked(
                    'AI Answers',
                    currentRatio.ai_currency_info.unit,
                    'Unit',
                  )
                ">
                {{ currentRatio.ai_currency_info.unit.text }}
              </span>
            </div>
          </div>
          <div v-for="(ai, index) in currentRatio.ai" :key="`ai-${index}`">
            <div v-if="showUnitInfo(ai)" class="unit-info">
              <p v-if="ai.unit_info.date">
                Financial period end: {{ ai.unit_info.date }}
              </p>
              <p>
                <span v-if="ai.unit_info.rate">
                  Exchange Rate: {{ ai.unit_info.rate }}
                </span>
                <a
                  v-if="ai.unit_info.link"
                  :href="ai.unit_info.link"
                  target="_blank">
                  link
                </a>
              </p>
            </div>
          </div>
          <div v-for="(ai, index) in currentRatio.ai" :key="index">
            <ul>
              <li
                v-for="(section, sectionIndex) in ai.sections"
                :key="sectionIndex">
                <h4>
                  {{ section.label_ }}
                  <sub>{{ section.period_ }}</sub>
                  <span
                    v-if="
                      showSubTotalInSectionTitle(currentRatio, section.items[0])
                    ">
                    ({{ section.items[0].account.meta.sub_total }})
                  </span>
                </h4>
                <p v-for="(item, itemIndex) in section.items" :key="itemIndex">
                  <span
                    class="account"
                    @click="
                      ratioTextClicked(
                        'AI Answers',
                        item.account,
                        'Account',
                        index,
                        section,
                      )
                    ">
                    <template
                      v-if="showAccountItem(currentRatio, section, itemIndex)">
                      {{ item.account.text }}
                    </template>
                  </span>
                  <span
                    v-if="showAccountDate(currentRatio, section)"
                    class="account-date"
                    >{{ item.date_var }}
                  </span>
                  <span
                    v-if="showSubTotal(currentRatio, item)"
                    class="account-date">
                    {{ item.account.meta.sub_total }}
                  </span>
                  <span
                    class="value"
                    @click="
                      ratioTextClicked(
                        'AI Answers',
                        item.value,
                        'Value',
                        index,
                        section,
                      )
                    "
                    >{{ item.value.text }}</span
                  >
                </p>
                <div v-if="showLastPeriod(section.scope)" class="last-period">
                  <i class="el-icon-warning"></i>
                  Reference: {{ section.scope.year }} -
                  {{ section.scope.doc_type_name }}
                </div>
              </li>
            </ul>
          </div>
          <div
            v-for="(ai, index) in currentRatio.unsorted_ai"
            :key="`formula-${index}`"
            class="formulas">
            <div
              v-if="ai.formula_info"
              class="formula"
              :class="[ai.red_flag ? 'red' : '']">
              <div>
                <template v-if="showLatex(ai.formula_info)">
                  <h5 class="name">{{ ai.name }}</h5>
                  <span v-katex v-text="ai.formula_info"></span>
                </template>
                <span v-else>{{ ai.formula_info }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="showSummaryReason(currentRatio.brief_summary.reason, 'ai')"
            class="reason">
            <p class="label">{{ currentRatio.brief_summary.reason.attr }}</p>
            <p
              class="text"
              :class="[
                currentRatio.brief_summary.reason.ai.page !== -1
                  ? 'clickable'
                  : '',
              ]"
              @click="
                ratioTextClicked(
                  'AI Answers',
                  currentRatio.brief_summary.reason.ai,
                  'Material Impairment',
                )
              ">
              {{ currentRatio.brief_summary.reason.ai.text }}
            </p>
          </div>
          <div v-if="currentRatio.ai_ext_docs" class="additional-document">
            <el-tooltip
              effect="dark"
              content="No additional documents found"
              placement="top"
              :disabled="currentRatio.ai_ext_docs.length > 0">
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="currentRatio.ai_ext_docs.length === 0"
                  @click="openExternalDocuments">
                  Additional Document
                </el-button>
              </div>
            </el-tooltip>
          </div>
        </template>
        <div v-else class="empty">No data</div>
      </div>
      <div class="manual-adjustment">
        <div class="title">
          <h4>
            Manual adjustment
            <el-tooltip
              effect="dark"
              content="You can tag financial account and value from the document."
              placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </h4>
          <div class="operate">
            <el-tooltip effect="dark" content="Quote AI data" placement="top">
              <i class="icon-plus" @click="quoteAIData"></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="Remove manual data"
              placement="top">
              <i
                class="icon-remove"
                :class="[currentRatio.manual.length ? '' : 'disabled']"
                @click="removeManualData"></i>
            </el-tooltip>
            <report-review-history-log
              :history-log="reviewHistoryLog"></report-review-history-log>
          </div>
        </div>
        <template v-if="currentRatio.manual.length">
          <div class="currency-and-unit">
            <div>
              Currency:
              <el-input
                size="mini"
                placeholder="Currency"
                v-model="currentRatio.manual_currency_info.currency.text"
                clearable
                @clear="
                  clearInputData(currentRatio.manual_currency_info.currency)
                "
                @focus="
                  ratioTextClicked(
                    'Manual',
                    currentRatio.manual_currency_info.currency,
                    'Currency',
                  )
                "></el-input>
            </div>
            <div>
              Unit:
              <el-input
                size="mini"
                placeholder="Unit"
                v-model="currentRatio.manual_currency_info.unit.text"
                clearable
                @clear="clearInputData(currentRatio.manual_currency_info.unit)"
                @focus="
                  ratioTextClicked(
                    'Manual',
                    currentRatio.manual_currency_info.unit,
                    'Unit',
                  )
                "></el-input>
            </div>
          </div>
          <div
            v-for="(ai, index) in currentRatio.manual"
            :key="`manual-${index}`">
            <div v-if="showUnitInfo(ai)" class="unit-info">
              <p v-if="ai.unit_info.date">
                Financial period end: {{ ai.unit_info.date }}
              </p>
              <p>
                <span v-if="ai.unit_info.rate">
                  Exchange Rate: {{ ai.unit_info.rate }}
                </span>
                <a
                  v-if="ai.unit_info.link"
                  :href="ai.unit_info.link"
                  target="_blank">
                  link
                </a>
              </p>
            </div>
          </div>
          <div v-for="(manual, index) in currentRatio.manual" :key="index">
            <ul>
              <li
                v-for="(section, sectionIndex) in manual.sections"
                v-show="section.visible"
                :key="sectionIndex">
                <div class="title">
                  <h4>
                    {{ section.label_ }}
                    <sub>{{ section.period_ }}</sub>
                  </h4>
                  <div class="title-btns">
                    <el-tooltip
                      effect="dark"
                      content="AI location Suggestion"
                      placement="top">
                      <!-- <el-button size="mini" @click="getPredictAnswer(section)">
                        AI
                      </el-button> -->
                    </el-tooltip>
                    <el-button
                      icon="el-icon-plus"
                      size="mini"
                      @click="addManualData(index, section)"></el-button>
                  </div>
                </div>
                <div
                  v-for="(item, itemIndex) in section.items"
                  :key="itemIndex"
                  class="edit">
                  <div class="account">
                    <el-input
                      v-if="showAccountItem(currentRatio, section, itemIndex)"
                      size="mini"
                      placeholder="Account"
                      v-model="item.account.text"
                      clearable
                      @clear="clearInputData(item.account)"
                      @focus="
                        ratioTextClicked(
                          'Manual',
                          item.account,
                          'Account',
                          index,
                          section,
                          sectionIndex,
                          itemIndex,
                        )
                      "></el-input>
                  </div>
                  <div
                    v-if="showAccountDate(currentRatio, section)"
                    class="account-date">
                    {{ item.date_var }}
                  </div>
                  <el-input
                    size="mini"
                    placeholder="Value"
                    v-model="item.value.text"
                    class="value"
                    clearable
                    @clear="clearInputData(item.value)"
                    @focus="
                      ratioTextClicked(
                        'Manual',
                        item.value,
                        'Value',
                        index,
                        section,
                        sectionIndex,
                        itemIndex,
                      )
                    "></el-input>
                  <div class="edit-operate">
                    <el-button
                      v-if="showAccountItem(currentRatio, section, itemIndex)"
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      :disabled="isDeleteButtonDisabled(index, section)"
                      @click="
                        deleteManualData(
                          currentRatio,
                          index,
                          section,
                          itemIndex,
                        )
                      "></el-button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-for="(manual, index) in currentRatio.unsorted_manual"
            :key="`formula-${index}`"
            class="formulas">
            <div
              v-if="manual.formula_info"
              class="formula"
              :class="[manual.red_flag ? 'red' : '']">
              <div>
                <template v-if="showLatex(manual.formula_info)">
                  <h5 class="name">{{ manual.name }}</h5>
                  <span v-katex v-text="manual.formula_info"> </span>
                </template>
                <span v-else>{{ manual.formula_info }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="
              showSummaryReason(currentRatio.brief_summary.reason, 'manual')
            "
            class="reason">
            <p class="label">
              <span>{{ currentRatio.brief_summary.reason.attr }}</span>
              <el-tooltip
                effect="dark"
                content="AI location Suggestion"
                placement="top">
                <el-button
                  size="mini"
                  @click="getPredictAnswer(currentRatio.brief_summary.reason)">
                  AI
                </el-button>
              </el-tooltip>
            </p>
            <el-input
              size="mini"
              v-model="currentRatio.brief_summary.reason.manual.text"
              class="value"
              clearable
              @clear="clearInputData(currentRatio.brief_summary.reason.manual)"
              @focus="
                ratioTextClicked(
                  'Manual',
                  currentRatio.brief_summary.reason.manual,
                  currentRatio.brief_summary.reason.attr,
                )
              "></el-input>
          </div>
          <div class="formula-operate">
            <el-button
              type="primary"
              size="mini"
              :disabled="submitAnswerButtonDisabled"
              @click="generateFormula">
              Calculate Ratio and Submit Answer
            </el-button>
          </div>
        </template>
        <div v-else class="empty">No data</div>
      </div>
    </div>

    <remark-predict-position
      v-if="this.predictPosition.result.length > 0"
      :answer-item-map="{}"
      answer-version=""
      :show-precise-position="false"
      class="predict-position"></remark-predict-position>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import RemarkPredictPosition from '@/components/remark/FileRemarkPredictPosition';
import ReportReviewHistoryLog from '../../components/ReportReviewHistoryLog';
import HistoricalRules from '../../components/HistoricalRules';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';
import VueKatex from '@/utils/katexAutoRender';
import { checkUnsubmitAnswer } from '../../common/utils';
import { getRuleHistory } from '../../../../store/api/hkex.group.api';

export default {
  name: 'results-announcement-checking-details-for-ratio',
  components: {
    RemarkPredictPosition,
    ReportReviewHistoryLog,
    HistoricalRules,
  },
  mixins: [ReportReviewMixin],
  directives: { katex: VueKatex },
  data() {
    return {
      loading: false,
      ratioList: [],
      ratioListOriginal: [],
      ratioData: {},
      currentRatioIndex: 0,
      currentRatio: {
        ai: [],
        manual: [],
      },
      currentManualIndex: 0,
      currentManualSectionIndex: 0,
      currentManualSectionItemIndex: 0,
      currentManualSectionItemKey: '',
      prevFileId: null,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['predictPosition']),
    ...mapGetters('hkexModule', ['isDelisted']),
    ...mapGetters('hkexModule/reportReviewModule', ['fileMeta']),
    qid() {
      return Number(this.$route.params.qid);
    },
    fileId() {
      return Number(this.$route.query.fileId);
    },
  },
  watch: {
    '$route.params.qid'() {
      this.init();
    },
    currentRatio: {
      deep: true,
      handler() {
        let hasUnsubmitChange = false;

        const currentRatioOriginal =
          this.ratioListOriginal[this.currentRatioIndex];
        if (currentRatioOriginal) {
          hasUnsubmitChange = !_.isEqual(
            {
              ..._.pick(currentRatioOriginal, [
                'manual_currency_info',
                'brief_summary',
              ]),
              manual: this.filterVisibleData(
                this.sortByOrder(currentRatioOriginal.manual),
              ),
            },
            _.pick(this.currentRatio, [
              'manual',
              'manual_currency_info',
              'brief_summary',
            ]),
          );
        }

        this.$store.commit(
          'hkexModule/SET_HAS_UNSUBMIT_CHANGE',
          hasUnsubmitChange,
        );
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.prevFileId = this.fileId;
      this.resetPredictAnswer();
      await this.getRatioCheck();
      this.setCurrentRatioIndex();
      const currentRatioName = this.ratioList[this.currentRatioIndex].name;
      this.setCurrentRatioData(currentRatioName);
      this.getReportReviewHistoryLog(currentRatioName);
      this.fetchRuleHistory();
    },
    async getRatioCheck() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch(
          'hkexModule/fetchQuestionRatioCheck',
          {
            qid: this.qid,
            params: {
              delist: this.isDelisted ? 1 : 0,
            },
          },
        );
        this.ratioData = data;
        this.ratioList = data.orders.map((order) => {
          return {
            name: order,
            ...data.detail[order],
          };
        });
        this.ratioListOriginal = _.cloneDeep(this.ratioList);
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    setCurrentRatioIndex() {
      const ratioFromRoute = this.$route.query.ratio;
      if (ratioFromRoute) {
        const ratioIndex = this.ratioList.findIndex(
          (ratio) => ratio.label === ratioFromRoute,
        );
        if (ratioIndex !== -1) {
          this.currentRatioIndex = ratioIndex;
        }
        return;
      }
      const ratioIndex = this.ratioList.findIndex((ratio) => ratio.visible);
      if (ratioIndex !== -1) {
        this.currentRatioIndex = ratioIndex;
      }
    },
    setCurrentRatioData(ratioName) {
      const ratioInfo = this.ratioData.detail[ratioName];
      if (!ratioInfo) {
        this.currentRatio = { name: ratioName };
        return;
      }
      this.currentRatio = {
        ...ratioInfo,
        name: ratioName,
        ai: this.filterVisibleData(this.sortByOrder(ratioInfo.ai)),
        manual: this.filterVisibleData(this.sortByOrder(ratioInfo.manual)),
        unsorted_ai: this.filterVisibleData(ratioInfo.ai),
        unsorted_manual: this.filterVisibleData(ratioInfo.manual),
      };
    },
    filterVisibleData(data) {
      data.forEach((i) => {
        i.sections = i.sections.filter((section) => section.visible);
      });
      return data;
    },
    sortByOrder(data) {
      return _.cloneDeep(data).sort((a, b) => a.order - b.order);
    },
    isRatio6(ratio) {
      return ratio.name === 'ratio6';
    },
    getRatioRedFlag(ratio) {
      if (this.isRatio6(ratio)) {
        return this.getRatio6RedFlagNum(ratio.brief_summary.summary) > 0;
      }
      return ratio.brief_summary.summary.some((i) => i.red_flag);
    },
    getRatio6RedFlagNum(summary) {
      return summary.filter((i) => i.red_flag).length;
    },
    showAccountItem(ratio, item, itemIndex) {
      return (
        (this.isRatio6(ratio) &&
          Array.isArray(item.sub_labels) &&
          item.sub_labels.length > 0 &&
          item.sub_labels[itemIndex].visible_account) ||
        (this.isRatio6(ratio) && _.isEmpty(item.sub_labels)) ||
        !this.isRatio6(ratio)
      );
    },
    showAccountDate(ratio, item) {
      return (
        this.isRatio6(ratio) &&
        (Array.isArray(item.sub_labels) || item.date_var)
      );
    },
    showSubTotal(ratio, item) {
      return (
        !this.isRatio6(ratio) &&
        item.account.meta &&
        item.account.meta.sub_total
      );
    },
    showSubTotalInSectionTitle(ratio, item) {
      return (
        this.isRatio6(ratio) &&
        item &&
        item.account.meta &&
        item.account.meta.sub_total
      );
    },
    showUnitInfo(item) {
      return item.unit_info && item.unit_info.rate;
    },
    showSummaryReason(reason, type) {
      return reason && reason[type];
    },
    showLastPeriod(item) {
      return item && item.fid !== null;
    },
    isDeleteButtonDisabled(index, item) {
      return (
        this.isRatio6(this.currentRatio) &&
        index === 0 &&
        !_.isEmpty(item.sub_labels)
      );
    },
    ratioItemClicked(ratioName, ratioIndex) {
      if (checkUnsubmitAnswer()) {
        return;
      }

      this.currentManualSectionItemKey = '';

      this.$emit('clear-annotation');

      this.switchPdfFile(this.fileId, null, () => {
        this.currentRatioIndex = ratioIndex;
        this.setCurrentRatioData(ratioName);
        this.resetPredictAnswer();
        this.getReportReviewHistoryLog(ratioName);
        this.fetchRuleHistory();
      });
    },
    ratioTextClicked(
      annotType,
      ratio,
      label,
      index,
      section,
      sectionIndex,
      itemIndex,
    ) {
      this.$emit('clear-annotation', 'wireframe');

      this.currentManualIndex = index || 0;
      this.currentManualSectionIndex = sectionIndex || 0;
      this.currentManualSectionItemIndex = itemIndex || 0;
      this.currentManualSectionItemKey = label.toLowerCase();

      const annotationData = {
        boxes: [{ ...ratio }],
        tags: [annotType, this.currentManualSectionItemKey],
        type: 'wireframe',
      };

      if (!_.isNil(ratio.fid)) {
        const fileInfo = section ? section.scope : null;
        this.switchPdfFile(ratio.fid, fileInfo, () => {
          if (!_.isEmpty(ratio.box)) {
            this.$emit('jump-to-answer-data', annotationData);
          }
        });
      }

      if (!_.isEmpty(ratio.box)) {
        this.$emit('jump-to-answer-data', annotationData);
      }

      if (section && section.scope && !section.scope.fid) {
        this.$notify({
          title: 'Info',
          message: 'No corresponding document',
          type: 'info',
        });
      }
    },
    switchPdfFile(fid, fileInfo, callback) {
      if (fid !== this.prevFileId) {
        this.$emit('switch-pdf', { fileId: fid, fileInfo, callback });
        this.prevFileId = fid;
      } else if (callback) {
        callback();
      }
    },
    createAnswer(boxes) {
      const key = this.currentManualSectionItemKey;
      const boxData = boxes[0];

      if (!key) {
        this.$notify({
          title: 'Warning',
          message:
            'Please select the "Account" or "Value" in the Manual adjustment before annotating them',
          type: 'warning',
        });
        return;
      }

      if (['currency', 'unit'].includes(key)) {
        this.currentRatio.manual_currency_info[key] = boxData;
      } else if (['material impairment'].includes(key)) {
        const originData = this.currentRatio.brief_summary.reason.manual;
        Object.assign(originData, boxData);
      } else {
        const originData =
          this.currentRatio.manual[this.currentManualIndex].sections[
            this.currentManualSectionIndex
          ].items[this.currentManualSectionItemIndex][key];
        Object.assign(originData, boxData);
      }

      const annotationData = {
        boxes,
        tags: ['Manual', key],
        type: 'wireframe',
      };

      this.$emit('jump-to-answer-data', annotationData);
    },
    async quoteAIData() {
      const hasManualData = this.currentRatio.manual.some((manual) => {
        if (this.isRatio6(this.currentRatio)) {
          return (
            this.currentRatio.manual.length > 1 ||
            manual.sections[0].items.length > 0
          );
        }
        return manual.sections.some((section) => {
          return section.items.length > 0;
        });
      });
      const replaceManualData = async () => {
        try {
          const res = await this.$store.dispatch(
            'hkexModule/quoteRatioCheckAIData',
            {
              qid: this.qid,
              ratio: this.currentRatio.name,
            },
          );
          this.currentRatio.manual_currency_info = _.cloneDeep(
            this.currentRatio.ai_currency_info,
          );
          this.currentRatio.manual = this.sortByOrder(res.ai);
          this.currentRatio.unsorted_manual = res.ai;
          this.currentRatio.brief_summary = res.brief_summary;
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      };
      if (hasManualData) {
        const confirm = await this.$confirm(
          'Are you sure to quote AI data?',
          'Warning',
          {
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
            type: 'warning',
          },
        ).catch(() => {});
        if (confirm === 'confirm') {
          replaceManualData();
        }
      } else {
        replaceManualData();
      }
    },
    async removeManualData() {
      const confirm = await this.$confirm(
        'Are you sure to remove manual data?',
        'Warning',
        {
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await this.$store.dispatch(
            'hkexModule/removeQuestionRatioManualData',
            {
              qid: this.qid,
              ratio: this.currentRatio.name,
            },
          );
          await this.getRatioCheck();
          this.setCurrentRatioData(this.currentRatio.name);
          this.$emit('clear-annotation', 'wireframe');
          this.$notify({
            title: 'Success',
            message: 'Remove manual data successfully',
            type: 'success',
          });
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    addManualData(index, section) {
      const generateNewItem = () => {
        const newItem = {
          account: {},
          value: {},
          currency: {},
          unit: {},
          time_period: {},
        };
        for (const key in newItem) {
          newItem[key] = {
            box: {},
            page: 0,
            text: '',
            fid: section.scope ? section.scope.fid : this.fileId,
          };
        }
        if (this.isRatio6(this.currentRatio)) {
          newItem.date_var = section.date_var;
        }
        return newItem;
      };

      if (this.isRatio6(this.currentRatio) && !_.isEmpty(section.sub_labels)) {
        const newItem = _.cloneDeep(this.currentRatio.manual[0]);
        newItem.id = null;
        newItem.formula_info = '';
        newItem.sections.forEach((section) => {
          if (_.isEmpty(section.sub_labels)) {
            section.visible = false;
          }
          section.items.forEach((item) => {
            Object.keys(item).forEach((key) => {
              const ignoredKeys = ['date_var', 'from_attr'];
              if (!ignoredKeys.includes(key)) {
                item[key].box = {};
                item[key].page = -1;
                item[key].text = '';
              }
            });
          });
        });
        this.currentRatio.manual.splice(index + 1, 0, newItem);
      } else {
        section.items.push(generateNewItem());
      }
    },
    deleteManualData(ratio, index, section, itemIndex) {
      if (this.isRatio6(ratio) && !_.isEmpty(section.sub_labels)) {
        ratio.manual.splice(index, 1);
        this.$emit('clear-annotation', 'wireframe');
        return;
      }
      section.items.splice(itemIndex, 1);
      this.$emit('clear-annotation', 'wireframe');
    },
    clearInputData(item) {
      item.box = {};
      item.text = '';
      item.page = null;
      this.$emit('clear-annotation', 'wireframe');
    },
    async generateFormula() {
      try {
        const formulaData = {
          ratio: this.currentRatio.name,
          formulas: this.currentRatio.manual,
          manual_currency_info: this.currentRatio.manual_currency_info,
          brief_summary: this.currentRatio.brief_summary,
        };
        await this.$store.dispatch('hkexModule/generateRatioFormula', {
          qid: this.qid,
          data: formulaData,
        });
        await this.getRatioCheck();
        this.setCurrentRatioData(this.currentRatio.name);
        this.$notify({
          title: 'Success',
          message: 'Save the answer successfully',
          type: 'success',
        });
        this.getReportReviewHistoryLog(this.currentRatio.name);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    resetPredictAnswer() {
      this.$store.commit('remarkModule/SET_PREDICT_POSITION', []);
    },
    async getPredictAnswer(item) {
      try {
        this.$emit('clear-annotation');

        const qid = item.scope ? item.scope.qid : this.qid;
        const fid = item.scope ? item.scope.fid : this.fileId;

        let attrKey = '';
        if (item.attr) {
          attrKey = item.attr;
        } else {
          attrKey = Array.isArray(item.attrs_[0])
            ? item.attrs_[0][0]
            : item.attrs_[0];
        }

        if (!qid || !fid) {
          this.$notify({
            title: 'Info',
            message: 'No corresponding document',
            type: 'info',
          });

          return;
        }

        await this.$store.dispatch('hkexModule/fetchRatioPredictPosition', {
          qid: qid,
          key: attrKey,
          label: item.label || item.attr,
        });

        this.switchPdfFile(fid, item.scope);

        if (this.predictPosition.result.length === 0) {
          this.$notify({
            title: 'Info',
            message: 'No predict result',
            type: 'info',
          });
          return;
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    openExternalDocuments() {
      const url = this.$router.resolve({
        name: 'resultsAnnouncementAdditionalDocument',
        params: {
          qid: this.qid,
        },
      });
      window.open(url.href, '_blank');
    },
    showLatex(expr) {
      return expr && expr.startsWith('$') && expr.endsWith('$');
    },
    async fetchRuleHistory() {
      if (this.fileMeta && this.fileMeta.stock_code) {
        const data = await getRuleHistory(this.currentRatio.name, {
          stock_code: this.fileMeta.stock_code,
        });
        this.ruleHistory = data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';
$--color-background: #f2f5f7;

.container {
  display: flex;
  flex-flow: column;
  height: calc(100vh - 33px);
  font-size: 14px;
  ul {
    li {
      list-style: none;
    }
  }
  ::v-deep .el-input__inner {
    height: 22px;
    line-height: 22px;
    padding: 0 5px;
    border-color: #ccc;
    color: #777;
    font-size: 12px;
    font-weight: normal;
    text-align: left;
    &:focus {
      border: 2px solid $--color-primary;
    }
    &::-webkit-input-placeholder {
      padding-left: 13px;
      background: url(../../common/images/icon-ratio-frame.svg);
      background-size: 10px 10px;
      background-repeat: no-repeat;
      background-position: 0 50%;
    }
  }
  ::v-deep .el-input__suffix {
    top: 2px;
    right: 2px;
    height: calc(100% - 4px);
    background: #fff;
    i {
      margin: -1px 0 0 0;
      &::before {
        color: $--color-primary;
      }
    }
  }
  ::v-deep i {
    margin-left: 5px;
    color: $--color-primary;
    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }

  .rule-list-container {
    height: 40%;
    overflow: auto;
    .ratio-list {
      overflow-y: auto;
      background: $--color-background;
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 5px;
        font-size: 13px;
        li {
          position: relative;
          width: calc(100% / 3 - 3px);
          margin: 2px 0;
          padding: 5px 10px;
          background: #fff;
          box-sizing: border-box;
          border: 1px solid $--color-grey;
          cursor: pointer;
          &:hover {
            background: #e4f2fb;
          }
          &.disabled {
            opacity: 0.6;
            background: #ddd;
            border: 1px solid #bbb !important;
            pointer-events: none;
          }
          .name {
            display: flex;
            font-size: 13px;
            h4 {
              margin-left: 5px;
              font-weight: normal;
              white-space: pre-line;
            }
          }
          .ratio-score {
            margin-top: 3px;
            padding-left: 16px;
            font-weight: bold;
            margin-right: 5px;
            > span {
              margin-right: 5px;
              color: $--color-primary;
              font-size: 12px;
              word-break: break-word;
              &.red {
                color: $--color-red;
              }
            }
          }
          &.is-c {
            border-color: $--color-primary;
            &.active {
              background: $--color-primary;
            }
          }
          &.is-nc {
            border-color: $--color-red;
            &.active {
              background: $--color-red;
            }
          }
          &.active {
            color: #fff;
            .ratio-score {
              span {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }

  .rule-description-container {
    overflow: auto;
    min-height: 60px;
    padding: 10px;
    overflow-y: auto;
    box-sizing: border-box;
    background: $--color-background;
    .description {
      background: $--color-background;
      font-size: 13px;
      .definition {
        padding-bottom: 10px;
        line-height: 16px;
        border-bottom: 1px solid #d9dcde;
        white-space: pre-line;
      }
      .desc {
        padding: 10px 0 5px;
      }
    }
  }

  .details {
    display: flex;
    flex: 1;
    overflow-y: auto;
    > div {
      flex: 1;
      width: 50%;
      padding: 10px;
      box-sizing: border-box;
      .title {
        display: flex;
        justify-content: space-between;
        padding-bottom: 5px;
        border-bottom: 1px solid #efefef;
        .title-btns {
          min-width: 55px;
          text-align: right;
          .el-button {
            padding: 2px 5px;
            font-size: 12px;
            + .el-button {
              margin-left: 5px;
            }
            ::v-deep i {
              margin-left: 0;
            }
          }
          i {
            font-size: 12px;
          }
        }
      }
      .currency-and-unit {
        display: flex;
        align-items: center;
        padding: 10px 0 0 10px;
        font-size: 13px;
        > div {
          display: flex;
          align-items: center;
          height: 24px;
          &:first-child {
            margin-right: 10px;
          }
          > span {
            margin-left: 5px;
            color: $--color-primary;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
          .el-input {
            margin-left: 5px;
          }
        }
      }
      ul {
        li {
          margin: 10px 0;
          padding: 10px;
          background: $--color-background;
          font-size: 14px;
          &:hover {
            background-color: #e4f2fb;
          }
          .title {
            padding-bottom: 0;
            border-bottom: none;
          }
          h4 {
            min-height: 18px;
            color: $--color-primary;
            sub {
              display: inline-block;
              transform: scale(0.8) translate(-10px, 0);
              font-style: italic;
            }
          }
          p {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            min-height: 28px;
            margin: 5px 0;
            font-size: 13px;
            > span {
              flex: 1;
              margin: 6px 0;
              padding: 0 5px;
              text-align: center;
              &.account {
                flex: 1;
                padding-left: 0;
                text-align: left;
                word-break: break-word;
              }
              &.account-date {
                flex: 1;
              }
              &.value {
                flex: 1;
              }
              &:last-child {
                padding-right: 0;
              }
              &:hover:not(.account-date) {
                cursor: pointer;
                color: $--color-primary;
              }
            }
          }
          .last-period {
            padding-top: 10px;
            font-size: 13px;
            color: $--color-primary;
            border-top: 1px solid #e1e1e1;
            i {
              margin-left: 0;
              cursor: default;
            }
          }
        }
      }
      .formulas {
        &:last-child {
          padding-bottom: 10px;
        }
      }
      .formula {
        margin-top: 5px;
        padding: 10px;
        color: #666;
        border: 3px solid $--color-background;
        word-break: break-word;
        &.red {
          background: $--color-red;
          color: #fff;
          border-color: $--color-red;
        }
        .name {
          margin-bottom: 10px;
        }
        .formula-ratio {
          margin-left: 5px;
        }
      }
      .unit-info {
        margin-top: 5px;
        padding: 0 10px;
        > p {
          &:not(:last-child) {
            margin: 5px 0;
          }
          :is(a) {
            margin-left: 10px;
            color: #12b30a;
          }
        }
      }
      .reason {
        margin-top: 5px;
        padding: 10px;
        color: #666;
        border: 3px solid #f2f5f7;
        word-break: break-word;
        .label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          color: $--color-primary;
          font-weight: bold;
          .el-button {
            padding: 2px 5px;
            font-size: 12px;
          }
        }
        .text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          white-space: normal;
          overflow: hidden;
          &.clickable {
            &:hover {
              cursor: pointer;
              color: $--color-primary;
            }
          }
        }
      }
      .additional-document {
        padding: 10px 0;
        .el-tooltip {
          display: inline-block;
        }
        .el-button {
          border-radius: 0;
          background: $--color-primary;
          &:hover {
            opacity: 0.9;
          }
          &.is-disabled {
            opacity: 0.5;
          }
        }
      }
    }
    .ai-suggestion {
      border-right: 3px solid #f2f5f7;
    }
    .manual-adjustment {
      .title {
        .operate {
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            width: 18px;
            height: 18px;
            background-size: 100% 100%;
            &.icon-plus {
              background-image: url(../../common/images/icon-ratio-ai.svg);
            }
            &.icon-remove {
              background-image: url(../../common/images/icon-ratio-remove.svg);
            }
            &.disabled {
              filter: grayscale(1);
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
          .report-review-history-log {
            width: 18px;
            height: 18px;
            margin-right: 5px;
          }
        }
      }
      ul {
        li {
          .edit {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
            font-size: 13px;
            > div {
              margin: 0 2px;
              &.account {
                flex: 1;
              }
              &.account-date {
                flex: 1;
                text-align: center;
              }
              &.value {
                flex: 1;
              }
            }
          }
          .edit-operate {
            display: flex;
            justify-content: flex-end;
            min-width: 20px;
            .el-button[disabled] {
              filter: grayscale(1);
              opacity: 0.6;
              ::v-deep i {
                cursor: not-allowed;
              }
            }
          }
        }
      }
      .formula-operate {
        margin-top: 10px;
        padding-bottom: 10px;
        text-align: center;
        .el-button {
          border-radius: 0;
          background: $--color-primary;
          &:hover {
            opacity: 0.9;
          }
          &.is-disabled {
            opacity: 0.5;
            cursor: not-allowed;
            &:hover {
              opacity: 0.5;
            }
          }
        }
      }
    }
    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #aaa;
    }
  }
}

::v-deep .katex-display {
  margin: 0;
  padding: 5px 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  .katex-mathml {
    display: none;
  }
  .katex {
    font-size: 13px;
    font-family: inherit;
    text-align: left;
    .msupsub {
      .sizing {
        &.size3 {
          transform: scale(0.8) translate(-3px, 0);
        }
      }
    }
    .mathnormal {
      margin-right: 0 !important;
      font-family: 'KaTeX_Main';
      font-style: normal;
    }
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

.predict-position {
  position: fixed;
  top: 40px;
  right: 10px;
  width: 500px;
  z-index: 1001;
  ::v-deep .el-card {
    border-radius: 0;
  }
}
</style>
