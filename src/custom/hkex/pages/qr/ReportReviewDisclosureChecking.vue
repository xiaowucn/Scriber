<template>
  <div class="container" v-loading="loading">
    <div class="rule-list-container" :style="{ height: ruleListHeight }">
      <div class="rule-list">
        <ul>
          <li
            v-for="(rule, index) in disclosureRuleList"
            :key="index"
            :class="[
              selectedRuleIndex === index ? 'active' : '',
              !rule.visible ? 'disabled' : '',
              getNCClassName(rule),
            ]"
            @click="changeRule(index)">
            <div class="name">
              <span>{{ index + 1 }}:</span>
              <h4>{{ rule.label }}</h4>
            </div>
            <p v-if="rule.visible" class="result">
              <span
                v-for="(subRule, subRuleIndex) in rule.user_answer.answer"
                :key="subRuleIndex"
                :class="[isNC(rule) ? 'warning' : '']">
                {{ getRuleAlias(rule, 'answer', subRuleIndex) }}
              </span>
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
      <div class="description">{{ ruleHistory.review.description }}</div>
    </div>
    <div
      class="gutter-vertical align-center"
      v-dragVertical="{ dragingLine: 'line2', headerHeight: 33 }"></div>
    <div class="content">
      <section class="disclosure-location">
        <div v-if="isShowSubRules" class="sub-rules">
          <el-button-group>
            <el-tooltip
              v-for="(subRule, subIndex) in currentRule.user_answer.answer"
              :key="subIndex"
              :content="subRule.schema.data.label"
              effect="dark"
              placement="top">
              <el-button
                :type="subIndex === selectedSubRuleIndex ? 'primary' : ''"
                size="mini"
                @click="changeSubRule(subIndex)">
                {{ subRule.schema.data.label }}
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
        <div class="title">
          <h4>AI Suggestion</h4>
        </div>
        <div class="sub-content">
          <h5>Disclosure Location</h5>
          <div>
            <span v-for="(type, index) in disclosureTypes" :key="index">
              {{ type.name }}
            </span>
          </div>
          <div>
            <span v-for="(type, index) in disclosureTypes" :key="index">
              <i
                v-if="
                  type.value ===
                  disclosureAISuggestionValue(selectedSubRuleIndex)
                "
                class="fa fa-check fa-fw fa-2x"></i>
            </span>
          </div>
          <div
            v-if="
              currentRule.last_year_final_result && selectedSubRuleIndex === 1
            "
            class="extra-rule-info">
            Last year final result:
            <span>{{ currentRule.last_year_final_result }}</span>
          </div>
          <div
            v-if="
              currentRule.incorporated_in_hk !== undefined &&
              currentRule.incorporated_in_hk !== null
            "
            class="extra-rule-info">
            Incorporated Place (Hong Kong) :
            <span>
              {{ currentRule.incorporated_in_hk === true ? 'Y' : 'N' }}
            </span>
          </div>
          <h5>Compliance/Red Flag Assessment</h5>
          <div>
            <span v-for="(type, index) in complianceTypes" :key="index">
              {{ type.name }}
            </span>
          </div>
          <div>
            <span v-for="(type, index) in complianceTypes" :key="index">
              <i
                v-if="type.value === complianceAISuggestionValue"
                class="fa fa-check fa-fw fa-2x"></i>
            </span>
          </div>
          <h5>AI Tagged Information</h5>
          <div class="tags">
            <div>
              <p>No. of Tags: {{ currentSubRulePresetAnswer.data.length }}</p>
              <div class="tag-btns">
                <el-button
                  type="text"
                  icon="el-icon-caret-left"
                  :disabled="
                    currentSubRulePresetAnswer.data.length === 0 ||
                    presetAnswerIndex === 0
                  "
                  @click="presetAnswerNavClicked('prev')"></el-button>
                <el-button
                  size="mini"
                  class="btn-view"
                  :disabled="currentSubRulePresetAnswer.data.length === 0"
                  @click="presetAnswerNavClicked()">
                  view
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-caret-right"
                  :disabled="
                    presetAnswerIndex >=
                    currentSubRulePresetAnswer.data.length - 1
                  "
                  @click="presetAnswerNavClicked('next')"></el-button>
                <span v-if="currentSubRulePresetAnswer.data.length > 0">
                  {{ presetAnswerIndex + 1 }}/{{
                    currentSubRulePresetAnswer.data.length
                  }}
                </span>
              </div>
            </div>
          </div>
          <h5>Location Suggestion</h5>
          <div class="ai-location">
            <el-button type="primary" size="small" @click="getPredictAnswer">
              AI Location Suggestion
            </el-button>
          </div>
        </div>
      </section>
      <section class="compliance-assessment">
        <div class="title">
          <h4>Manual Adjustment</h4>
          <report-review-history-log
            :history-log="reviewHistoryLog"></report-review-history-log>
        </div>
        <div class="sub-content">
          <h5>Disclosure Location</h5>
          <div>
            <span v-for="(type, index) in disclosureTypes" :key="index">
              {{ type.name }}
            </span>
          </div>
          <div class="manual">
            <span
              v-for="(type, index) in disclosureTypes"
              :key="index"
              class="adjustment-box"
              :class="[type.value === disclosureValue ? 'active' : '']"
              @click="setDisclosureValue(type.value)">
              <i
                v-if="type.value === disclosureValue"
                class="fa fa-check fa-fw fa-2x"></i>
            </span>
          </div>
          <h5>Compliance/Red Flag Assessment</h5>
          <div>
            <span v-for="(type, index) in complianceTypes" :key="index">
              {{ type.name }}
            </span>
          </div>
          <div class="manual">
            <span
              v-for="(type, index) in complianceTypes"
              :key="index"
              class="adjustment-box"
              :class="[type.value === complianceValue ? 'active' : '']"
              @click="setComplianceValue(type.value)">
              <i
                v-if="type.value === complianceValue"
                class="fa fa-check fa-fw fa-2x"></i>
            </span>
          </div>
          <h5>Manual Tagged Infomation</h5>
          <div class="tags">
            <div>
              <p>No. of Tags: {{ currentAnnotations.length }}</p>
              <div class="tag-btns">
                <el-button
                  type="text"
                  icon="el-icon-caret-left"
                  :disabled="prevBoxDisabled"
                  @click="annotationNavClicked('prev')"></el-button>
                <el-button
                  type="default"
                  size="mini"
                  class="btn-view"
                  :disabled="currentAnnotations.length === 0"
                  @click="annotationNavClicked()"
                  >view</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-caret-right"
                  :disabled="nextBoxDisabled"
                  @click="annotationNavClicked('next')"></el-button>
                <span v-if="currentAnnotations.length > 0">
                  {{ currentAnnotationBoxIndex + 1 }}/{{
                    currentAnnotations.length
                  }}
                </span>
                <el-button
                  v-if="currentAnnotations.length > 0"
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="btn-delete"
                  @click="deleteBox"></el-button>
              </div>
            </div>
            <div>
              <el-button
                type="danger"
                size="mini"
                slot="reference"
                class="btn-delete-all"
                :disabled="currentAnnotations.length === 0"
                @click="deleteAllBoxes">
                Delete All
              </el-button>
            </div>
          </div>
          <div class="submit">
            <el-button
              size="mini"
              class="btn-submit button-hkex"
              :disabled="submitAnswerButtonDisabled"
              @click="submitAnswer">
              Submit Answer
            </el-button>
          </div>
        </div>
      </section>
    </div>

    <remark-predict-position
      v-if="isShowPredictPosition"
      :answerItemMap="{}"
      answerVersion=""
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
import { getRuleHistory } from '../../../../store/api/hkex.group.api';

export default {
  name: 'results-announcement-checking-details-for-disclosure',
  components: {
    RemarkPredictPosition,
    ReportReviewHistoryLog,
    HistoricalRules,
  },
  mixins: [ReportReviewMixin],
  props: {
    dcQid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      disclosureTypes: [
        {
          name: 'Disclosure',
          value: 'Disclosure',
          alias: 'D',
        },
        {
          name: 'Negative Statement',
          value: 'Negative Statement',
          alias: 'NS',
        },
        {
          name: 'No Disclosure',
          value: 'No Disclosure',
          alias: 'ND',
        },
      ],
      complianceTypes: [
        {
          name: 'Compliance/Without Red Flag',
          value: 'compliance',
          alias: 'C',
        },
        {
          name: 'Non-Compliance/With Red Flag',
          value: 'potential non-compliance',
          alias: 'NC',
        },
      ],
      disclosureData: {},
      disclosureRuleList: [],
      selectedRuleIndex: 0,
      selectedSubRuleIndex: 0,
      disclosureValue: '',
      complianceValue: '',
      presetAnswerIndex: 0,
      currentAnnotationBoxIndex: 0,
      isShowAILocalSuggestion: false,
      shouldSetDefaultRuleIndex: true,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'predictPosition',
      'predictPrecisePosition',
    ]),
    ...mapGetters('hkexModule', ['isDelisted']),
    ...mapGetters('hkexModule/reportReviewModule', ['fileMeta']),
    currentRule() {
      return this.disclosureRuleList[this.selectedRuleIndex] || {};
    },
    currentRuleOriginal() {
      return this.disclosureData.detail[this.currentRule.name] || {};
    },
    currentSubRulePresetAnswer() {
      if (this.currentRule.preset_answer) {
        return this.currentRule.preset_answer.answer[this.selectedSubRuleIndex];
      }
      return { data: [] };
    },
    currentSubRuleUserAnswer() {
      if (this.currentRule.user_answer) {
        return this.currentRule.user_answer.answer[this.selectedSubRuleIndex];
      }
      return {};
    },
    currentRuleResult() {
      return this.currentRule.user_answer.rule_result;
    },
    currentAnnotations() {
      return this.currentSubRuleUserAnswer.data || [];
    },
    isShowSubRules() {
      if (this.currentRule.user_answer) {
        return this.currentRule.user_answer.answer.length > 1;
      }
      return false;
    },
    disclosureAISuggestionValue() {
      return (index) => {
        if (this.currentRule.preset_answer) {
          const presetAnswer = this.currentRule.preset_answer.answer;
          if (presetAnswer) {
            return presetAnswer[index].value;
          }
          return '';
        }
        return '';
      };
    },
    complianceAISuggestionValue() {
      if (this.currentRule.preset_answer) {
        const presetAnswerRuleResult =
          this.currentRule.preset_answer.rule_result;
        if (presetAnswerRuleResult) {
          return presetAnswerRuleResult.value;
        }
        return '';
      }
      return '';
    },
    prevBoxDisabled() {
      return this.currentAnnotationBoxIndex === 0;
    },
    nextBoxDisabled() {
      return (
        this.currentAnnotationBoxIndex >= this.currentAnnotations.length - 1
      );
    },
    isShowPredictPosition() {
      return (
        this.isShowAILocalSuggestion && this.predictPosition.result.length > 0
      );
    },
  },
  watch: {
    '$route.params.qid'() {
      this.init();
    },
    'currentRule.user_answer': {
      deep: true,
      handler() {
        this.$store.commit(
          'hkexModule/SET_HAS_UNSUBMIT_CHANGE',
          this.chekHasManuallyMarked(),
        );
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.isShowAILocalSuggestion = false;
      await this.getDisclosureCheck();
      if (this.shouldSetDefaultRuleIndex) {
        this.setDefaultRuleIndex();
      }
      this.setCheckDetails();
      this.$emit('data-ready');
      this.getReportReviewHistoryLog(this.currentRule.name);
      this.fetchRuleHistory();
    },
    async getDisclosureCheck() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch(
          'hkexModule/fetchQuestionDisclosureCheck',
          {
            qid: this.dcQid,
            params: {
              delist: this.isDelisted ? 1 : 0,
            },
          },
        );
        this.disclosureData = _.cloneDeep(data);
        this.disclosureRuleList = data.orders.map((order) => {
          return {
            name: order,
            ...data.detail[order],
          };
        });
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
    setDefaultRuleIndex() {
      if (this.$route.query.rule) {
        const ruleIndex = this.disclosureRuleList.findIndex(
          (rule) => rule.name === this.$route.query.rule,
        );
        if (ruleIndex !== -1) {
          this.selectedRuleIndex = ruleIndex;
        }
        return;
      }
      const ruleIndex = this.disclosureRuleList.findIndex(
        (rule) => rule.visible,
      );
      if (ruleIndex !== -1) {
        this.selectedRuleIndex = ruleIndex;
      }
    },
    setCheckDetails() {
      const currentRuleResult = this.currentRuleResult;
      this.disclosureValue = this.currentSubRuleUserAnswer.value;
      this.complianceValue = currentRuleResult.value;
    },
    setDisclosureValue(value) {
      this.disclosureValue = this.disclosureValue === value ? '' : value;

      const disclosureUserAnswer =
        this.currentRule.user_answer.answer[this.selectedSubRuleIndex];
      const disclosureUserAnswerOriginal =
        this.currentRuleOriginal.user_answer.answer[this.selectedSubRuleIndex];

      disclosureUserAnswer.value = this.disclosureValue;
      if (!disclosureUserAnswerOriginal.manual) {
        if (disclosureUserAnswer.value !== disclosureUserAnswerOriginal.value) {
          disclosureUserAnswer.manual = true;
        } else {
          if (disclosureUserAnswerOriginal.manual === undefined) {
            delete disclosureUserAnswer.manual;
          } else {
            disclosureUserAnswer.manual = false;
          }
        }
      }
    },
    setComplianceValue(value) {
      this.complianceValue = this.complianceValue === value ? '' : value;

      const complianceRuleResult = this.currentRule.user_answer.rule_result;
      const complianceRuleResultOriginal =
        this.currentRuleOriginal.user_answer.rule_result;

      complianceRuleResult.value = this.complianceValue;
      if (!complianceRuleResultOriginal.manual) {
        if (
          complianceRuleResultOriginal.value !==
          complianceRuleResultOriginal.value
        ) {
          complianceRuleResultOriginal.manual = true;
        } else {
          if (complianceRuleResultOriginal.manual === undefined) {
            delete complianceRuleResultOriginal.manual;
          } else {
            complianceRuleResultOriginal.manual = false;
          }
        }
      }
    },
    getRuleAlias(rule, type, subRuleIndex) {
      const userAnswer = rule.user_answer;
      const presetAnswer = rule.preset_answer;
      let currentRule = {};
      let value = '';
      if (type === 'answer') {
        value =
          userAnswer[type][subRuleIndex].value ||
          presetAnswer[type][subRuleIndex].value;
        currentRule = this.disclosureTypes.find((type) => type.value === value);
        const emptyText = userAnswer[type].length > 1 ? '-' : '';
        return currentRule ? currentRule.alias : emptyText;
      } else {
        value = userAnswer[type].value || presetAnswer[type].value;
        currentRule = this.complianceTypes.find((type) => type.value === value);
      }
      return currentRule ? currentRule.alias : '';
    },
    isND(rule, subRuleIndex) {
      const value =
        rule.user_answer.answer[subRuleIndex].value ||
        rule.preset_answer.answer[subRuleIndex].value;
      return value === this.disclosureTypes[2].value;
    },
    isNC(rule) {
      const value =
        rule.user_answer.rule_result.value ||
        rule.preset_answer.rule_result.value;
      return value === this.complianceTypes[1].value;
    },
    getNCClassName(rule) {
      const value =
        rule.user_answer.rule_result.value ||
        rule.preset_answer.rule_result.value;
      switch (value) {
        case this.complianceTypes[0].value:
          return 'is-c';
        case this.complianceTypes[1].value:
          return 'is-nc';
        default:
          return '';
      }
    },
    isShowNCWarning(rule) {
      if (!rule.visible) {
        return false;
      }
      return this.isNC(rule);
    },
    chekHasManuallyMarked() {
      return !_.isEqual(
        this.currentRule.user_answer,
        this.currentRuleOriginal.user_answer,
      );
    },
    async changeRule(index) {
      this.isShowAILocalSuggestion = false;
      if (this.chekHasManuallyMarked()) {
        await this.submitAnswer();
      }
      this.selectedRuleIndex = index;
      this.selectedSubRuleIndex = 0;
      this.presetAnswerIndex = 0;
      this.setCheckDetails();
      this.showFirstAnswerLocation();
      this.getReportReviewHistoryLog(this.disclosureRuleList[index].name);
      this.fetchRuleHistory();
    },
    changeSubRule(subIndex) {
      this.selectedSubRuleIndex = subIndex;
      this.presetAnswerIndex = 0;
      this.setCheckDetails();
      this.showFirstAnswerLocation();
    },
    createAnswer(boxes) {
      this.currentRule.user_answer.answer[this.selectedSubRuleIndex].data.push({
        boxes,
      });
      this.currentAnnotationBoxIndex = this.currentAnnotations.length - 1;

      this.renderAnnotations(
        this.currentRule.user_answer.answer[this.selectedSubRuleIndex],
        this.currentAnnotationBoxIndex,
        'Manual',
      );
    },
    presetAnswerNavClicked(direction) {
      if (direction === 'prev') {
        this.presetAnswerIndex--;
      } else if (direction === 'next') {
        this.presetAnswerIndex++;
      } else {
        this.presetAnswerIndex = 0;
      }

      this.$emit('clear-annotation');

      this.renderAnnotations(
        this.currentSubRulePresetAnswer,
        this.presetAnswerIndex,
        'AI Answers',
      );
    },
    annotationNavClicked(direction) {
      if (direction === 'prev') {
        this.currentAnnotationBoxIndex--;
      } else if (direction === 'next') {
        this.currentAnnotationBoxIndex++;
      } else {
        this.currentAnnotationBoxIndex = 0;
      }

      this.$emit('clear-annotation');

      this.renderAnnotations(
        this.currentSubRuleUserAnswer,
        this.currentAnnotationBoxIndex,
        'Manual',
      );
    },
    renderAnnotations(answer, index, answerType) {
      const boxes = answer.data;
      const currentBox = boxes[index];
      const annotationData = {
        boxes: currentBox ? currentBox.boxes : [],
        tags: [answerType, this.currentRule.label],
        type: 'wireframe',
      };

      this.$emit('jump-to-answer-data', annotationData);
    },
    deleteBox() {
      this.currentRule.user_answer.answer[
        this.selectedSubRuleIndex
      ].data.splice(this.currentAnnotationBoxIndex, 1);
      this.annotationNavClicked();
    },
    async deleteAllBoxes() {
      const confirm = await this.$confirm(
        'Are you sure to delete all boxes under this rule?',
        'Hint',
        {},
      ).catch(() => {});

      if (confirm === 'confirm') {
        this.currentRule.user_answer.answer[this.selectedSubRuleIndex].data =
          [];
        this.annotationNavClicked();
      }
    },
    async getPredictAnswer(isShowPopup = true) {
      try {
        const keyPath = JSON.parse(this.currentSubRuleUserAnswer.key)
          .map((item) => item.split(':')[0])
          .join('|');

        await this.$store.dispatch('remarkModule/predictPosition', {
          qid: this.dcQid,
          key: keyPath,
          label: this.currentSubRuleUserAnswer.schema.data.label,
        });

        const presetPreciseAnswer =
          this.currentRule.preset_answer.answer[this.selectedSubRuleIndex];

        this.$store.commit(
          'remarkModule/SET_PREDICT_PRECISE_POSITION',
          presetPreciseAnswer,
        );

        if (this.predictPosition.result.length === 0) {
          this.$notify({
            title: 'Info',
            message: 'No predict result',
            type: 'info',
          });
          return;
        }
        this.isShowAILocalSuggestion = isShowPopup;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async showFirstAnswerLocation() {
      if (this.currentAnnotations.length > 0) {
        this.annotationNavClicked();
        return;
      }
      this.showFirstAILocation();
    },
    async showFirstAILocation() {
      this.$emit('clear-annotation');

      if (
        [this.disclosureTypes[0].value, this.disclosureTypes[1].value].includes(
          this.disclosureAISuggestionValue(this.selectedSubRuleIndex),
        )
      ) {
        await this.getPredictAnswer(false);

        const ruleName = this.currentSubRuleUserAnswer.schema.data.label;
        let boxes = [];
        if (this.predictPrecisePosition.data.length > 0) {
          boxes = this.predictPrecisePosition.data[0].boxes;
        } else {
          if (this.predictPosition.result.length === 0) {
            return;
          }
          const predictResult = this.predictPosition.result[0];
          boxes = predictResult.outlines.map((item) => {
            const box = {
              box_left: item[0],
              box_top: item[1],
              box_right: item[2],
              box_bottom: item[3],
            };
            return {
              box,
              page: predictResult.page,
              text: predictResult.text,
            };
          });
        }
        const boxesData = {
          boxes: boxes,
          tags: ['AI Answers', ruleName],
          type: 'wireframe',
        };

        this.$emit('jump-to-answer-data', boxesData);
      }
    },
    async submitAnswer() {
      try {
        const { name, user_answer } = this.currentRule;
        const answer = this.clearAnswerBoxTexts(user_answer.answer);
        const data = {
          answer: answer,
          rule_result: user_answer.rule_result,
        };
        await this.$store.dispatch('hkexModule/updateQuestionDisclosureCheck', {
          qid: this.dcQid,
          rule: name,
          data,
        });
        this.$notify({
          title: 'Success',
          message: 'Save the answer successfully',
          type: 'success',
        });
        this.shouldSetDefaultRuleIndex = false;
        this.init();
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async fetchRuleHistory() {
      if (this.fileMeta && this.fileMeta.stock_code) {
        const data = await getRuleHistory(this.currentRule.name, {
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
  height: calc(100vh - 33px);
  overflow-y: auto;
  ul {
    li {
      list-style: none;
    }
  }
  .el-button {
    margin: 0;
    border-radius: 0;
    &:not(.is-disabled) {
      &:hover {
        opacity: 0.9;
      }
    }
    ::v-deep i {
      font-size: 24px;
    }
    &.is-disabled {
      ::v-deep i {
        color: #ccc;
      }
    }
    &.btn-submit {
      color: #fff;
      background: $--color-blue;
    }
  }

  .rule-list-container {
    height: 40%;
    overflow: auto;
    .rule-list {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: calc(100% / 3 - 3px);
          min-height: 48px;
          margin: 2px 0;
          padding: 5px 10px;
          background: #fff;
          box-sizing: border-box;
          border: 1px solid $--color-grey;
          &:nth-child(-n + 4) {
            width: calc(100% / 2 - 3px);
          }
          &:hover {
            background: #e4f2fb;
            cursor: pointer;
          }
          &.disabled {
            opacity: 0.6;
            background: #ddd;
            border: 1px solid #bbb !important;
            pointer-events: none;
          }
          .name {
            display: flex;
            max-width: 85%;
            font-size: 13px;
            h4 {
              margin-left: 5px;
              font-weight: normal;
            }
          }
          .result {
            text-align: end;
            span {
              font-size: 12px;
              font-weight: bold;
              color: $--color-primary;
              &:not(:first-child):not(:empty) {
                margin-left: 3px;
              }
              &.warning {
                color: $--color-red;
              }
            }
          }
          &.warning {
            border: 1px solid $--color-red;
          }
          &.is-c {
            border: 1px solid $--color-primary;
          }
          &.is-nc {
            border: 1px solid $--color-red;
          }
          &.active {
            background: #a2c7df;
            color: #333;
            &.is-c {
              background: $--color-primary;
              color: #fff;
            }
            &.is-nc {
              background: $--color-red;
              color: #fff;
            }
            .result {
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
      flex-shrink: 0;
      margin-top: 5px;
      line-height: 16px;
      font-size: 13px;
      box-sizing: border-box;
      white-space: pre-wrap;
    }
  }

  .content {
    display: flex;
    flex: 1;
    border-top: 3px solid $--color-background;
    > section {
      flex: 1;
      padding: 10px;
      &:first-child {
        border-right: 3px solid #f2f5f7;
      }
      .sub-rules {
        margin-bottom: 10px;
        .el-button-group {
          width: 100%;
        }
        .el-button {
          padding: 5px 10px;
          max-width: 50%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          &.el-button--primary {
            background: $--color-primary;
          }
        }
      }
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h4 {
          margin-bottom: 5px;
          font-size: 14px;
        }
      }
      h5 {
        padding-top: 5px;
        border-top: 1px solid #efefef;
        color: $--color-primary;
        font-size: 13px;
      }
      .sub-content {
        width: 100%;
        > div {
          display: flex;
          align-items: center;
          min-height: 42px;
          &.extra-rule-info {
            font-weight: bold;
            font-size: 13px;
            color: rgba($--color-black, 0.7);
            > span {
              margin: 0 0 0 10px;
              text-align: left;
              color: $--color-primary;
            }
          }
          > span {
            flex: 1;
            margin: 0 10px;
            padding: 5px 0;
            font-size: 13px;
            line-height: 16px;
            text-align: center;
            ::v-deep i {
              margin-top: -5px;
              font-size: 22px;
              color: $--color-primary;
            }
          }
          &.manual {
            .adjustment-box {
              height: 25px;
              margin: 5px 0;
              border: 1px solid #ccc;
              box-sizing: border-box;
              cursor: pointer;
              &.active,
              &:hover {
                border-color: $--color-primary;
              }
              &:nth-child(2) {
                margin: 0 10px;
                &:last-child {
                  margin-right: 0;
                }
              }
              ::v-deep i {
                &:hover {
                  opacity: 0.8;
                  cursor: pointer;
                }
              }
            }
          }
          &.ai-location {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            padding: 10px;
            .el-button {
              background: $--color-primary;
              &:hover {
                opacity: 0.9;
              }
            }
          }
          &.tags {
            justify-content: space-between;
            margin-top: 5px;
            font-size: 13px;
            .tag-btns {
              display: flex;
              align-items: center;
              margin-top: 10px;
              .el-button {
                padding: 0;
                &.btn-view {
                  padding: 3px 10px;
                }
                &.btn-delete {
                  ::v-deep i {
                    font-size: 15px;
                    color: $--color-primary;
                    font-weight: bold;
                  }
                }
              }
              > span {
                margin: 0 10px;
              }
            }
            .btn-delete-all {
              padding: 5px 10px;
            }
          }
          &.submit {
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            min-height: 30px;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px solid #efefef;
            .el-button {
              height: 32px;
            }
          }
        }
      }
    }
  }
  .predict-position {
    position: fixed;
    top: 100px;
    right: 10px;
    width: 500px;
    z-index: 1001;
    ::v-deep .el-card {
      border-radius: 0;
    }
  }
}
</style>
