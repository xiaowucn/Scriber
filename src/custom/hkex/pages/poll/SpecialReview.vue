<template>
  <div class="gml-special-review">
    <div v-if="currentGmlAiAnswerGroupKeys.length > 0" class="rule-tabs">
      <span
        v-for="(item, index) in currentGmlAiAnswerGroupKeys"
        :key="index"
        :class="[item === subGmlIndex ? 'active' : '']"
        @click="changeSubGmlTabs(item)">
        {{ item }}
      </span>
    </div>
    <div class="checking-details">
      <div
        v-for="(answer, key) in answers"
        :key="key"
        class="section"
        :class="[key === 'ai' ? 'ai-suggestion' : 'manual-adjustment']">
        <div class="title">
          <h4>{{ key === 'ai' ? 'AI Suggestion' : 'Manual Adjustment' }}</h4>
          <div v-if="key === 'manual'" class="operation-icons">
            <div class="btns">
              <el-tooltip
                effect="dark"
                manual
                v-model="showSyncAIDataTooltip"
                content="Synchronize AI Suggestion to Manual Adjustment"
                placement="top"
                v-if="isGmlSub1">
                <i
                  class="icon-plus"
                  @mouseenter="showSyncAIDataTooltip = true"
                  @mouseleave="showSyncAIDataTooltip = false"
                  @click="quoteGmlAIDataToManual"></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="Remove manual data"
                placement="top"
                v-if="isGmlSub1">
                <i class="icon-remove" @click="removeGmlManualData"></i>
              </el-tooltip>
              <report-review-history-log :history-log="reviewHistoryLog">
              </report-review-history-log>
              <!-- <i v-if="showSyncAIDataTipsIcon" class="icon-hand"></i> -->
            </div>
          </div>
        </div>
        <section class="details-item">
          <div class="disclosure-title">
            <h5>Disclosure Location</h5>
            <el-tooltip
              v-if="isGmlSub1 && key === 'manual'"
              effect="dark"
              content="The Disclosure Location will be updated based on the breakdown input below."
              placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </div>
          <div class="item-row">
            <div
              v-for="(item, index) in disclosureLocationOptions"
              :key="index"
              class="col">
              {{ item.label }}
            </div>
          </div>
          <div class="item-row">
            <div
              v-for="(item, index) in disclosureLocationOptions"
              :key="index"
              class="col">
              <div
                :class="{
                  'manual-checkbox': key === 'manual',
                  active: isDisclosureActive(key, item.value),
                  disabled: isGmlSub1 && key === 'manual',
                }"
                @click="changeEnumDisclosureValue(key, item.value)">
                <i
                  v-if="
                    answer &&
                    answer[subGmlIndex] &&
                    answer[subGmlIndex].enum === item.value
                  "
                  class="fa fa-check"></i>
              </div>
            </div>
          </div>
        </section>
        <section v-if="!isGmlSub3" class="details-item">
          <div class="title">
            <h5>Breakdown</h5>
          </div>
          <template v-if="isGmlSub1">
            <div class="item-row" v-if="key === 'ai' && answer[subGmlIndex]">
              <div>
                <div v-if="answer[subGmlIndex].total" class="breakdown-list">
                  <h5>{{ DEFAULT_TOTAL_NAME }}</h5>
                  <div
                    class="breakdown-item"
                    v-for="item in GML_BREAKDOWN_ITEMS"
                    :key="item"
                    @click="
                      handleClickedAnswer(
                        answer[subGmlIndex].total[item],
                        key,
                        item,
                        'total',
                      )
                    ">
                    <p class="item-name">{{ item }}</p>
                    <div class="item-value-container">
                      <span
                        class="item-value"
                        :class="{
                          'active-value':
                            activeAiAnswer === `${key}_total_${item}`,
                        }">
                        {{
                          answer[subGmlIndex].total[item]
                            ? answer[subGmlIndex].total[item].text
                            : '-'
                        }}
                      </span>
                      <span class="item-value-source">{{
                        currentValueSource(answer[subGmlIndex].total[item])
                      }}</span>
                    </div>

                    <el-button
                      type="text"
                      size="mini"
                      class="btn-ai"
                      @click.stop="
                        viewAILocationSuggestion(
                          answer[subGmlIndex].total[item],
                          item,
                        )
                      ">
                      <i></i>
                    </el-button>
                  </div>
                </div>
                <div
                  class="breakdown-list"
                  v-for="(item, index) in answer[subGmlIndex].classes"
                  :key="index">
                  <h5>{{ item[RELEVANT_SHARE_CLASS].text }}</h5>
                  <div
                    class="breakdown-item"
                    v-for="bKey in GML_BREAKDOWN_ITEMS"
                    :key="bKey"
                    @click="handleClickedAnswer(item[bKey], key, bKey, index)">
                    <p class="item-name">{{ bKey }}</p>
                    <span
                      class="item-value"
                      :class="{
                        'active-value':
                          activeAiAnswer === `${key}_${index}_${bKey}`,
                      }"
                      >{{ item[bKey] ? item[bKey].text : '-' }}</span
                    >
                    <el-button
                      type="text"
                      size="mini"
                      class="btn-ai"
                      @click.stop="viewAILocationSuggestion(item[bKey], bKey)">
                      <i></i>
                    </el-button>
                  </div>
                </div>
                <div
                  v-if="answer[subGmlIndex].formula"
                  class="calculate-formula">
                  {{ answer[subGmlIndex].formula }}
                </div>
              </div>
            </div>
            <div class="item-row" v-if="key === 'manual'">
              <div class="breakdown-list">
                <div class="calculation-type">
                  <h5>Calculation Type</h5>
                  <div
                    v-for="item in CALCULATION_TYPE"
                    :key="item"
                    class="type-select"
                    :class="{
                      'active-type': currentActiveCalculationType === item,
                    }"
                    @click="handleChangeCalculationType(item)">
                    {{ item }}
                  </div>
                </div>
                <template v-for="item in CALCULATION_TYPE">
                  <div
                    v-if="
                      item === currentActiveCalculationType &&
                      answer[subGmlIndex]
                    "
                    :key="item">
                    <div v-if="item === CALCULATION_TYPE.BY_TOTAL">
                      <div class="breakdown-title">
                        <div class="title-left">
                          <h5>
                            {{ DEFAULT_TOTAL_NAME }}
                          </h5>
                        </div>

                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-delete"
                          @click="handleDeleteItems(item, 0)"></el-button>
                      </div>
                      <div
                        class="breakdown-item"
                        :class="{
                          'select-item': currentFocusInputKey === `0_${bKey}`,
                        }"
                        v-for="bKey in GML_BREAKDOWN_ITEMS"
                        :key="bKey"
                        @click="handleFocusInputBox(0, bKey)">
                        <p class="item-name">{{ bKey }}</p>
                        <div class="item-value item-input-value">
                          <el-input
                            :class="{
                              selectInput: currentFocusInputKey === `0_${bKey}`,
                            }"
                            :value="
                              formatNumberWithCommas(
                                answer[subGmlIndex].total[bKey]
                                  ? answer[subGmlIndex].total[bKey].text
                                  : '0',
                              )
                            "
                            type="text"
                            clearable
                            @clear="handleClearAnswer(0, bKey)"
                            @focus="handleFocusInputBox(0, bKey)"
                            @input="
                              (value) =>
                                handleNumberInput(
                                  value,
                                  answer[subGmlIndex].total[bKey],
                                  `total_${bKey}`,
                                )
                            "
                            :data-input-id="`total_${bKey}`" />
                          <span v-if="bKey === 'Percentage'">%</span>
                        </div>
                      </div>
                    </div>
                    <template v-if="item === CALCULATION_TYPE.BY_CLASS">
                      <div
                        v-for="(classItem, index) in answer[subGmlIndex]
                          .classes"
                        :key="index">
                        <div class="breakdown-title">
                          <div class="title-left">
                            <el-tooltip
                              effect="dark"
                              :content="classItem[RELEVANT_SHARE_CLASS].text"
                              placement="top"
                              v-if="!classItem.isEditing">
                              <h5>
                                {{
                                  item === CALCULATION_TYPE.BY_TOTAL
                                    ? DEFAULT_TOTAL_NAME
                                    : classItem[RELEVANT_SHARE_CLASS].text
                                }}
                              </h5>
                            </el-tooltip>
                            <el-input
                              v-if="classItem.isEditing"
                              :ref="`classInput-${index}`"
                              :class="{
                                selectInput:
                                  currentFocusInputKey ===
                                  `${index}_${RELEVANT_SHARE_CLASS}`,
                              }"
                              v-model="classItem[RELEVANT_SHARE_CLASS].text"
                              @focus="
                                handleFocusInputBox(index, RELEVANT_SHARE_CLASS)
                              " />
                            <template v-if="item === CALCULATION_TYPE.BY_CLASS">
                              <i
                                v-if="!classItem.isEditing"
                                slot="reference"
                                class="icon-history-log"
                                @click="handleEditClassTypeName(index)"></i>
                              <i
                                v-if="classItem.isEditing"
                                class="el-icon el-icon-circle-check"
                                @click="handleSaveClassTypeName(index)"></i>
                              <i
                                v-if="classItem.isEditing"
                                class="el-icon el-icon-circle-close"
                                @click="handleDeleteClassTypeName(index)"></i>
                            </template>
                          </div>
                          <el-button
                            v-if="item === CALCULATION_TYPE.BY_CLASS"
                            type="text"
                            size="mini"
                            icon="el-icon-circle-plus-outline"
                            @click="handleAddGmlClassType"></el-button>

                          <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDeleteItems(item, index)"></el-button>
                        </div>
                        <div
                          class="breakdown-item"
                          :class="{
                            'select-item':
                              currentFocusInputKey === `${index}_${bKey}`,
                          }"
                          v-for="bKey in GML_BREAKDOWN_ITEMS"
                          :key="bKey"
                          @click="handleFocusInputBox(index, bKey)">
                          <p class="item-name">{{ bKey }}</p>
                          <div class="item-value item-input-value">
                            <el-input
                              :class="{
                                selectInput:
                                  currentFocusInputKey === `${index}_${bKey}`,
                              }"
                              :value="
                                formatNumberWithCommas(
                                  classItem[bKey] ? classItem[bKey].text : '0',
                                )
                              "
                              type="text"
                              clearable
                              @clear="handleClearAnswer(index, bKey)"
                              @focus="handleFocusInputBox(index, bKey)"
                              @input="
                                (value) =>
                                  handleNumberInput(
                                    value,
                                    classItem[bKey],
                                    `class_${index}_${bKey}`,
                                  )
                              "
                              :data-input-id="`class_${index}_${bKey}`" />
                            <span v-if="bKey === 'Percentage'">%</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                <div class="calculate-formula">
                  {{ manualCalculationFormulaResult }}
                </div>
              </div>
            </div>
          </template>
          <template v-if="isGmlSub2">
            <div class="list">
              <ul>
                <template
                  v-for="(item, passedKey, index) in answer[subGmlIndex]">
                  <li
                    v-if="passedKey !== 'enum'"
                    :class="getPassedClassNames(key, passedKey)"
                    :key="index"
                    @click="selectPassed(key, passedKey)">
                    <span class="name">{{ PASSED_ITEMS[passedKey] }}</span>
                    <div class="view-btns">
                      <el-button
                        size="mini"
                        icon="el-icon-arrow-left"
                        class="btn-prev"
                        :disabled="item.dataIndex < 1"
                        @click.stop="view(key, item, passedKey, 'prev')">
                      </el-button>
                      <el-button
                        size="mini"
                        class="btn-view"
                        :disabled="item.data.length === 0"
                        @click.stop="view(key, item, passedKey)">
                        view
                      </el-button>
                      <el-button
                        size="mini"
                        icon="el-icon-arrow-right"
                        class="btn-next"
                        :disabled="item.dataIndex >= item.data.length - 1"
                        @click.stop="view(key, item, passedKey, 'next')">
                      </el-button>
                    </div>
                    <div
                      class="nums"
                      :class="item.data.length === 0 ? 'hide' : ''">
                      {{ item.dataIndex + 1 }}/{{ item.data.length }}
                    </div>
                    <div class="operations">
                      <el-button
                        v-if="key === 'ai'"
                        type="text"
                        size="mini"
                        class="btn-ai"
                        @click="
                          viewAILocationSuggestion(
                            item,
                            PASSED_ITEMS[passedKey],
                          )
                        ">
                        <i></i>
                      </el-button>
                      <el-button
                        v-if="key === 'manual'"
                        type="text"
                        size="mini"
                        icon="el-icon-delete"
                        class="btn-delete"
                        :class="item.data.length === 0 ? 'hide' : ''"
                        @click="deletePassedData(item)">
                      </el-button>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </template>
        </section>
        <section v-if="isGmlSub3" class="details-item">
          <div class="title date-title">
            <h5>Passed Date:</h5>
            <p v-if="key === 'ai'">
              {{ answer[subGmlIndex].passed_date.text }}
            </p>
          </div>
          <el-date-picker
            v-if="key === 'manual'"
            class="approval-date-picker"
            :class="{
              'is-active': approvalDateValue,
            }"
            v-model="approvalDateValue"
            type="date"
            size="mini"
            style="width: 130px"
            placeholder="pick a date"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy"
            @change="changePassedDate">
          </el-date-picker>
          <div class="title">
            <h5>AI Tagged Information</h5>
          </div>
          <div class="item-row manual-tagged-info">
            <div class="col">
              <div>
                No. of Tags:
                {{ answer[subGmlIndex].passed_date.data.length }}
              </div>
              <div class="tags">
                <el-button
                  type="text"
                  icon="el-icon-caret-left"
                  :disabled="
                    answer[subGmlIndex].passed_date.data.length === 0 ||
                    answer[subGmlIndex].passed_date.dateAnswerIndex === 0
                  "
                  @click="
                    switchDateAnswer(
                      key,
                      answer[subGmlIndex].passed_date,
                      'prev',
                    )
                  "></el-button>
                <el-button
                  size="mini"
                  class="view-button"
                  :disabled="answer[subGmlIndex].passed_date.data.length === 0"
                  @click="
                    switchDateAnswer(key, answer[subGmlIndex].passed_date)
                  ">
                  view
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-caret-right"
                  :disabled="
                    answer[subGmlIndex].passed_date.data.length === 0 ||
                    answer[subGmlIndex].passed_date.dateAnswerIndex >=
                      answer[subGmlIndex].passed_date.data.length - 1
                  "
                  @click="
                    switchDateAnswer(
                      key,
                      answer[subGmlIndex].passed_date,
                      'next',
                    )
                  "></el-button>
                <span v-if="answer[subGmlIndex].passed_date.data.length > 0">
                  {{ answer[subGmlIndex].passed_date.dateAnswerIndex + 1 }}/{{
                    answer[subGmlIndex].passed_date.data.length
                  }}
                </span>
              </div>
            </div>
            <div class="col" v-if="key === 'manual'">
              <el-tooltip
                effect="dark"
                content="Delete all tags"
                placement="top">
                <el-button
                  type="danger"
                  size="mini"
                  :disabled="answer[subGmlIndex].passed_date.data.length === 0"
                  class="delete-tag-button"
                  @click="
                    removeApprovalDateNodeBoxes(answer[subGmlIndex].passed_date)
                  ">
                  Delete
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="title" v-if="key === 'ai'">
            <h5>Location Suggestion</h5>
          </div>
          <div class="item-row" v-if="key === 'ai'">
            <el-button
              type="primary"
              size="small"
              class="ai-location-suggestion-button"
              @click="
                viewAILocationSuggestion(answer[subGmlIndex].passed_date)
              ">
              AI Location Suggestion
            </el-button>
          </div>
        </section>
        <section v-if="key === 'manual'" class="details-item">
          <div class="item-row submit">
            <el-button
              size="mini"
              class="button-hkex"
              :disabled="isDisabledSubmitAnswer"
              @click="submitAnswer('')">
              Submit Answer
            </el-button>
          </div>
        </section>
      </div>
    </div>
    <el-dialog
      title="Select data synchronization type"
      :visible.sync="showDataSyncDialog"
      custom-class="data-sync-dialog"
      @close="cancelDataSync">
      <div class="sync-type-selection">
        <el-radio-group v-model="selectedSyncType">
          <el-radio label="total">Sync Total data only</el-radio>
          <el-radio label="classes">Sync Class data only</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="cancelDataSync"> Cancel </el-button>
        <el-button type="primary" size="mini" @click="confirmDataSync">
          Confirm Sync
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';
import {
  fetchPollGmlAnswer,
  submitPollGmlAnswer,
} from '../../../../store/api/hkex.api';
import { v4 as uuid4 } from 'uuid';
import ReportReviewHistoryLog from '../../components/ReportReviewHistoryLog';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';

const GML_BREAKDOWN_ITEMS = {
  TOTAL_ISSUED_SHARES: 'Total number of issued shares',
  TREASURY_SHARES: 'Number of treasury shares',
  PERCENTAGE: 'Percentage',
};

const RELEVANT_SHARE_CLASS = 'Relevant share class';

const CALCULATION_TYPE = {
  BY_TOTAL: 'By Total',
  BY_CLASS: 'By Class',
};

const ANSWER_KEYS = {
  'By Total': 'total',
  'By Class': 'classes',
};

const DEFAULT_CLASS_NAME = 'Each Class Type';
const DEFAULT_TOTAL_NAME = 'Total';

const CLASS_MODEL = {
  fid: 0,
  qid: 0,
  text: '0',
  value: 0,
  data: [],
};

const PASSED_ITEMS = {
  resolution: 'General mandate resolution',
  pass_or_not: 'Yes or No',
};

const ANNOT_TAG = {
  ai: 'AI Answers',
  manual: 'Manual',
};

export default {
  name: 'gml-special-review',
  components: {
    ReportReviewHistoryLog,
  },
  mixins: [ReportReviewMixin],
  props: {
    qid: {
      type: Number,
      required: true,
    },
    fileId: {
      type: Number,
      required: true,
    },
    fileTypeOption: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      GML_BREAKDOWN_ITEMS,
      CALCULATION_TYPE,
      RELEVANT_SHARE_CLASS,
      DEFAULT_CLASS_NAME,
      DEFAULT_TOTAL_NAME,
      PASSED_ITEMS,
      answers: {},
      answersOriginal: {},
      POSITIVE_STATEMENT: 'Positive Statement',
      NO_DISCLOSURE: 'No Disclosure',
      YES: 'Yes',
      NO: 'No',
      currentActiveCalculationType: '',
      subGmlIndex: '',
      classModel: {
        [RELEVANT_SHARE_CLASS]: _.cloneDeep(CLASS_MODEL),
        [GML_BREAKDOWN_ITEMS.TOTAL_ISSUED_SHARES]: _.cloneDeep(CLASS_MODEL),
        [GML_BREAKDOWN_ITEMS.TREASURY_SHARES]: _.cloneDeep(CLASS_MODEL),
        [GML_BREAKDOWN_ITEMS.PERCENTAGE]: _.cloneDeep(CLASS_MODEL),
        isEditing: false,
      },
      manualCalculationFormulaResult: '',
      currentFocusInputKey: '',
      showDataSyncDialog: false,
      selectedSyncType: 'total',
      activePassedName: '',
      showSyncAIDataTooltip: false,
      // showSyncAIDataTipsIcon: false,
      approvalDateValue: '',
      gmlInputValue: 0,
      activeAiAnswer: '',
      locationSuggestion: '',
      measureElement: null,
    };
  },
  computed: {
    currentGmlAiAnswerGroupKeys() {
      return this.answers.ai
        ? Object.keys(this.answers.ai)
        : Object.values(this.answers?.manual || []);
    },
    isDisclosureActive() {
      return (key, value) => {
        return this.answers[key]?.[this.subGmlIndex]?.enum === value;
      };
    },
    disclosureLocationOptions() {
      if (this.isGmlSub2) {
        return [
          {
            value: this.YES,
            label: this.YES,
          },
          {
            value: this.NO,
            label: this.NO,
          },
          {
            value: this.NO_DISCLOSURE,
            label: this.NO_DISCLOSURE,
          },
        ];
      }
      return [
        {
          value: this.POSITIVE_STATEMENT,
          label: this.POSITIVE_STATEMENT,
        },
        {
          value: this.NO_DISCLOSURE,
          label: this.NO_DISCLOSURE,
        },
      ];
    },
    isGmlSub1() {
      return this.subGmlIndex === this.currentGmlAiAnswerGroupKeys[0];
    },
    isGmlSub2() {
      return this.subGmlIndex === this.currentGmlAiAnswerGroupKeys[1];
    },
    isGmlSub3() {
      return this.subGmlIndex === this.currentGmlAiAnswerGroupKeys[2];
    },
    isDisabledSubmitAnswer() {
      return (
        !this.$isAllowed('remarkOrInspect') || this.submitAnswerButtonDisabled
      );
    },
    currentValueSource() {
      return (item) => {
        if (item?.fid) {
          const file = this.fileTypeOption.find(
            (file) => file.value === item.fid,
          );
          return file?.label || '-';
        }
        return '-';
      };
    },
  },
  watch: {
    fileId() {
      this.showDefaultAnswer();
    },
  },
  created() {
    EventBus.$on('create-answer', this.createAnswer);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('create-answer', this.createAnswer);
    if (this.measureElement) {
      document.body.removeChild(this.measureElement);
      this.measureElement = null;
    }
  },
  methods: {
    formatNumberWithCommas(value) {
      if (!value && value !== 0) return '';
      const numStr = value.toString();
      const cleanNum = numStr.replace(/,/g, '');
      if (isNaN(cleanNum)) return value;
      return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    parseNumberFromCommas(value) {
      if (!value && value !== 0) return '';
      return value.toString().replace(/,/g, '');
    },

    handleNumberInput(value, item, inputId = null) {
      const inputValue = value;

      const cleanValue = inputValue.replace(/[^\d,]/g, '');
      const numericValue = cleanValue.replace(/,/g, '');

      item.text = numericValue;

      const formattedValue = this.formatNumberWithCommas(numericValue);

      this.$nextTick(() => {
        if (value !== formattedValue) {
          value = formattedValue;
        }
        this.resizeInputWidths(inputId);
      });

      this.handleInputValueChange(false, item);
    },

    adjustCurrentInputWidth(event) {
      if (!event || !event.target) return;

      const input = event.target;
      const value = input.value || '';

      if (!this.measureElement) {
        this.measureElement = document.createElement('span');
        this.measureElement.style.visibility = 'hidden';
        this.measureElement.style.position = 'absolute';
        this.measureElement.style.top = '-20px';
        this.measureElement.style.fontSize = '13px';
        this.measureElement.style.fontFamily = 'inherit';
        this.measureElement.style.whiteSpace = 'nowrap';
        document.body.appendChild(this.measureElement);
      }

      this.measureElement.textContent = value || '0';
      const textWidth = this.measureElement.offsetWidth;
      const inputPadding = 40;
      const newWidth = textWidth + inputPadding;

      const inputElement = input.closest('.el-input');
      if (inputElement && inputElement.style.width !== `${newWidth}px`) {
        inputElement.style.width = `${newWidth}px`;
      }
    },

    resizeInputWidths(inputId) {
      this.$nextTick(() => {
        if (inputId) {
          let targetInput = this.$el.querySelector(
            `input[data-input-id="${inputId}"]`,
          );

          if (targetInput) {
            this.adjustCurrentInputWidth({ target: targetInput });
          }
        } else {
          const allInputs = this.$el.querySelectorAll('input[data-input-id]');
          allInputs.forEach((input) => {
            this.adjustCurrentInputWidth({ target: input });
          });
        }
      });
    },

    async changeSubGmlTabs(index) {
      if (this.checkGmlUnsubmitAnswer()) {
        return;
      }
      this.currentActiveCalculationType = '';
      this.subGmlIndex = index;
      this.initGmlRuleDetails();
      this.showDefaultAnswer();
      this.$emit('reset-file', index);
    },
    initGmlRuleDetails() {
      this.currentFocusInputKey = '';
      this.activePassedName = '';
      this.activeAiAnswer = '';
      if (!this.answers.manual) {
        this.$set(this.answers, 'manual', {
          [this.subGmlIndex]: null,
        });
        this.answersOriginal = _.cloneDeep(this.answers);
      }
      if (this.isGmlSub1) {
        if (this.answers.manual?.[this.subGmlIndex]?.total) {
          this.currentActiveCalculationType = CALCULATION_TYPE.BY_TOTAL;
          const item = this.answers.manual[this.subGmlIndex].total;
          this.setSub1ItemAnswer(item);
        } else if (this.answers.manual?.[this.subGmlIndex]?.classes) {
          this.currentActiveCalculationType = CALCULATION_TYPE.BY_CLASS;
          const classes = this.answers.manual[this.subGmlIndex].classes;
          classes.forEach((item) => {
            this.setSub1ItemAnswer(item);
          });
        }
        this.resizeInputWidths();
        this.handleInputValueChange();
      } else if (this.isGmlSub2) {
        if (this.answers.ai[this.subGmlIndex]) {
          for (const key in this.answers.ai[this.subGmlIndex]) {
            if (key === 'enum') {
              continue;
            }
            if (!this.answers.ai[this.subGmlIndex][key]) {
              this.answers.ai[this.subGmlIndex][key] = {
                text: '',
                data: [],
                dataIndex: 0,
              };
            }
            if (!this.answers.ai[this.subGmlIndex][key].dataIndex) {
              this.answers.ai[this.subGmlIndex][key] = {
                ...this.answers.ai[this.subGmlIndex][key],
                dataIndex: 0,
              };
            }
          }
        }

        if (!this.answers.manual[this.subGmlIndex]) {
          this.$set(this.answers.manual, this.subGmlIndex, {
            enum: '',
            resolution: {
              text: '',
              data: [],
              dataIndex: 0,
            },
            pass_or_not: {
              text: '',
              data: [],
              dataIndex: 0,
            },
          });
        } else {
          for (const key in this.answers.manual[this.subGmlIndex]) {
            if (key === 'enum') {
              continue;
            }
            if (!this.answers.manual[this.subGmlIndex][key]) {
              this.answers.manual[this.subGmlIndex][key] = {
                text: '',
                data: [],
                dataIndex: 0,
              };
            }
            if (!this.answers.manual[this.subGmlIndex][key].dataIndex) {
              this.answers.manual[this.subGmlIndex][key] = {
                ...this.answers.manual[this.subGmlIndex][key],
                dataIndex: 0,
              };
            }
          }
        }
        this.answersOriginal = _.cloneDeep(this.answers);
      } else if (this.isGmlSub3) {
        if (this.answers.ai[this.subGmlIndex]) {
          for (const key in this.answers.ai[this.subGmlIndex]) {
            if (key === 'enum') {
              continue;
            }
            if (!this.answers.ai[this.subGmlIndex][key]) {
              this.answers.ai[this.subGmlIndex][key] = {
                text: '',
                data: [],
                dateAnswerIndex: 0,
              };
            }
            if (!this.answers.ai[this.subGmlIndex][key].dateAnswerIndex) {
              this.answers.ai[this.subGmlIndex][key] = {
                ...this.answers.ai[this.subGmlIndex][key],
                dateAnswerIndex: 0,
              };
            }
          }
        } else {
          this.answers.ai[this.subGmlIndex] = {
            enum: '',
            passed_date: {
              text: '',
              data: [],
              fid: this.fileId,
              qid: this.qid,
              value: '',
            },
            dateAnswerIndex: 0,
          };
        }

        if (!this.answers.manual[this.subGmlIndex]) {
          this.$set(this.answers.manual, this.subGmlIndex, {
            enum: '',
            passed_date: {
              text: '',
              data: [],
              fid: this.fileId,
              qid: this.qid,
              value: '',
            },
            dateAnswerIndex: 0,
          });
          this.answersOriginal = _.cloneDeep(this.answers);
        } else {
          let manualPassedDate =
            this.answers.manual[this.subGmlIndex].passed_date;
          this.answers.manual[this.subGmlIndex].passed_date = {
            ...this.answers.manual[this.subGmlIndex].passed_date,
            dateAnswerIndex: 0,
          };
          this.approvalDateValue = manualPassedDate?.text;
        }
        this.answersOriginal = _.cloneDeep(this.answers);
      }
    },
    async init() {
      this.resetGmlDetails();
      await this.getAnswer();
      this.subGmlIndex = this.currentGmlAiAnswerGroupKeys[0];
      this.initGmlRuleDetails();
      this.showDefaultAnswer();
    },
    async showDefaultAnswer() {
      this.$emit('clear-annotations');
      const getAnswerData = (boxes, tags) => {
        return {
          type: 'wireframe',
          boxes,
          tags,
        };
      };

      if (this.answers.manual?.[this.subGmlIndex]) {
        // 展示人工答案
        const { firstItemWithData, firstKey } = this.getFirstData(
          this.answers.manual[this.subGmlIndex],
        );
        if (firstItemWithData && firstItemWithData.data.length > 0) {
          const answerData = getAnswerData(firstItemWithData.data[0].boxes, [
            'Manual',
            firstKey,
          ]);
          this.$emit('view-gml-answer', { data: answerData });
          return;
        }
      }
      if (this.answers.ai) {
        // ND，不展示AI答案
        if (
          !this.answers.ai[this.subGmlIndex] ||
          this.answers.ai[this.subGmlIndex].enum.toLowerCase() ===
            'no disclosure'
        ) {
          return;
        }

        // 非 ND，展示AI精确定位
        const { firstItemWithData, firstKey } = this.getFirstData(
          this.answers.ai[this.subGmlIndex],
        );

        if (firstItemWithData && firstItemWithData.data.length > 0) {
          const answerData = getAnswerData(firstItemWithData.data[0].boxes, [
            'AI Answers',
            firstKey,
          ]);
          this.$emit('view-gml-answer', { data: answerData });
        }
      }
    },
    getFirstData(currentItem) {
      let firstItemWithData = null;
      let firstKey = '';
      if (this.isGmlSub1) {
        if (currentItem?.total) {
          firstKey = Object.keys(currentItem.total).find((key) => {
            return (
              key !== RELEVANT_SHARE_CLASS &&
              key !== 'uuid' &&
              currentItem.total[key] &&
              currentItem.total[key].data.length > 0 &&
              currentItem.total[key].fid === this.fileId
            );
          });
          firstItemWithData = currentItem.total[firstKey];
          if (firstKey && firstItemWithData) {
            return {
              firstItemWithData,
              firstKey,
            };
          }
        }
        if (currentItem?.classes) {
          for (let i = 0; i < currentItem.classes.length - 1; i++) {
            const classItem = currentItem.classes[i];
            firstKey = Object.keys(classItem).find((key) => {
              return (
                key !== RELEVANT_SHARE_CLASS &&
                key !== 'uuid' &&
                classItem[key] &&
                classItem[key].data.length > 0 &&
                classItem[key].fid === this.fileId
              );
            });
            if (firstKey) {
              firstItemWithData = classItem[firstKey];
              break;
            }
          }
          if (firstKey && firstItemWithData) {
            return {
              firstItemWithData,
              firstKey,
            };
          }
        }
      } else if (this.isGmlSub2) {
        firstKey = Object.keys(currentItem).find((key) => {
          return (
            currentItem[key]?.data?.length > 0 &&
            currentItem[key].fid === this.fileId
          );
        });
        firstItemWithData = currentItem[firstKey];
        return {
          firstItemWithData,
          firstKey,
        };
      } else if (this.isGmlSub3) {
        firstItemWithData = currentItem.passed_date;
        if (firstItemWithData.data.length > 0) {
          firstKey = this.subGmlIndex;
          return {
            firstItemWithData,
            firstKey,
          };
        }
      }
      return {
        firstItemWithData,
        firstKey,
      };
    },
    async getAnswer() {
      try {
        const res = await fetchPollGmlAnswer(this.qid);
        this.answers = res;
        this.answersOriginal = _.cloneDeep(this.answers);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    resetGmlDetails() {
      this.answers = {};
      this.subGmlIndex = '';
      this.answersOriginal = [];
      this.currentActiveCalculationType = '';
      this.activePassedName = '';
    },
    changeEnumDisclosureValue(key, value) {
      if (
        key === 'ai' ||
        this.subGmlIndex === this.currentGmlAiAnswerGroupKeys[0]
      ) {
        return;
      }
      let disclosureValue = this.answers[key][this.subGmlIndex].enum;
      if (disclosureValue === value) {
        disclosureValue = '';
      } else {
        disclosureValue = value;
      }
      this.answers[key][this.subGmlIndex].enum = disclosureValue;
    },

    handleChangeCalculationType(type, isInit = false) {
      this.currentActiveCalculationType = type;
      this.resetGmlAnswerData(isInit);
    },
    resetGmlAnswerData(isInit = false) {
      this.currentFocusInputKey = '';
      let setData = _.cloneDeep(this.classModel);
      setData.uuid = uuid4();
      Object.keys(setData).forEach((key) => {
        if (typeof setData[key] === 'object') {
          setData[key].fid = this.fileId;
          setData[key].qid = this.qid;
        }
      });
      if (this.currentActiveCalculationType === CALCULATION_TYPE.BY_TOTAL) {
        if (!_.isEmpty(this.answers.manual[this.subGmlIndex]?.total)) {
          setData = this.answers.manual[this.subGmlIndex].total;
        }
        setData[RELEVANT_SHARE_CLASS].text = DEFAULT_TOTAL_NAME;
        if (!this.answers.manual[this.subGmlIndex]) {
          this.answers.manual[this.subGmlIndex] = {
            total: setData,
          };
        } else {
          this.answers.manual[this.subGmlIndex].total = setData;
        }
        if (
          this.answers.manual[this.subGmlIndex].classes &&
          !this.getManualClassesHasData()
        ) {
          this.answers.manual[this.subGmlIndex].classes = null;
        }
      } else {
        if (this.answers.manual[this.subGmlIndex]?.classes?.length > 0) {
          setData = this.answers.manual[this.subGmlIndex].classes;
          this.answers.manual[this.subGmlIndex].classes = setData;
        } else {
          setData[RELEVANT_SHARE_CLASS].text = DEFAULT_CLASS_NAME;
          if (!this.answers.manual[this.subGmlIndex]) {
            this.answers.manual[this.subGmlIndex] = {
              classes: [setData],
            };
          } else {
            this.$set(this.answers.manual[this.subGmlIndex], 'classes', [
              setData,
            ]);
          }
        }
        if (
          this.answers.manual[this.subGmlIndex].total &&
          !this.getManualTotalHasData()
        ) {
          this.answers.manual[this.subGmlIndex].total = null;
        }
      }
      this.resizeInputWidths();
      this.handleInputValueChange(isInit);
    },

    handleEditClassTypeName(index) {
      const classItem = this.answers.manual[this.subGmlIndex].classes[index];
      classItem.isEditing = true;
      classItem.originalName = classItem[RELEVANT_SHARE_CLASS].text;
      this.$set(
        this.answers.manual[this.subGmlIndex].classes,
        index,
        classItem,
      );
      this.$nextTick(() => {
        this.$refs[`classInput-${index}`][0].focus();
      });
    },
    handleSaveClassTypeName(index) {
      const classItem = this.answers.manual[this.subGmlIndex].classes[index];
      classItem.isEditing = false;
      delete classItem.originalName;
      this.$set(
        this.answers.manual[this.subGmlIndex].classes,
        index,
        classItem,
      );
    },
    handleDeleteClassTypeName(index) {
      const classItem = this.answers.manual[this.subGmlIndex].classes[index];
      classItem.isEditing = false;
      if (classItem.originalName !== undefined) {
        classItem[RELEVANT_SHARE_CLASS].text = classItem.originalName;
        delete classItem.originalName;
      }
      this.$set(
        this.answers.manual[this.subGmlIndex].classes,
        index,
        classItem,
      );
    },
    handleAddGmlClassType() {
      const newClass = _.cloneDeep(this.classModel);
      newClass[RELEVANT_SHARE_CLASS].text = DEFAULT_CLASS_NAME;
      newClass.uuid = uuid4();
      this.answers.manual[this.subGmlIndex].classes.push(newClass);
      this.handleInputValueChange();
    },
    async handleDeleteItems(type, index) {
      const result = await this.$confirm(
        'The data group will be permanently deleted. Do you want to continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      ).catch(() => {});
      if (result === 'confirm') {
        if (type === CALCULATION_TYPE.BY_TOTAL) {
          this.currentActiveCalculationType = null;
          this.answers.manual[this.subGmlIndex].total = [];
          this.answers.manual[this.subGmlIndex].enum = '';
          if (!_.isEmpty(this.answers.manual[this.subGmlIndex].classes)) {
            this.currentActiveCalculationType = CALCULATION_TYPE.BY_CLASS;
          }
        } else {
          this.answers.manual[this.subGmlIndex].classes.splice(index, 1);
          if (this.answers.manual[this.subGmlIndex].classes.length === 0) {
            this.currentActiveCalculationType = null;
            this.answers.manual[this.subGmlIndex].enum = '';
            if (!_.isEmpty(this.answers.manual[this.subGmlIndex].total)) {
              this.currentActiveCalculationType = CALCULATION_TYPE.BY_TOTAL;
            }
          }
        }
        this.handleInputValueChange();
      }
    },
    handleInputValueChange(isInit = false, isInput = {}) {
      if (!isInit) {
        this.$store.commit(
          'hkexModule/SET_HAS_UNSUBMIT_CHANGE',
          this.checkHasGmlUserAnswerChanged(),
        );
      }
      if (!_.isEmpty(isInput)) {
        if (isInput.text && typeof isInput.text === 'string') {
          const cleanText = isInput.text.replace(/[^\d]/g, '');
          if (cleanText !== isInput.text && !isInput.text.includes(',')) {
            isInput.text = cleanText.replace(/^0+/, '') || '0';
          }
        }

        if (this.currentActiveCalculationType === CALCULATION_TYPE.BY_TOTAL) {
          const item = this.answers.manual[this.subGmlIndex].total;
          Object.keys(item).forEach((key) => {
            if (item[key] && typeof item[key] === 'object') {
              if (key === GML_BREAKDOWN_ITEMS.PERCENTAGE) {
                item[key].value = Number(item[key].text) / 100;
              } else {
                const numericValue = this.parseNumberFromCommas(item[key].text);
                item[key].value = Number(numericValue) || 0;
              }
            }
          });
        } else if (
          this.currentActiveCalculationType === CALCULATION_TYPE.BY_CLASS
        ) {
          const classes = this.answers.manual[this.subGmlIndex].classes;
          if (classes && Array.isArray(classes)) {
            classes.forEach((item) => {
              Object.keys(item).forEach((key) => {
                if (item[key] && typeof item[key] === 'object') {
                  if (key === GML_BREAKDOWN_ITEMS.PERCENTAGE) {
                    item[key].value = Number(item[key].text) / 100;
                  } else {
                    const numericValue = this.parseNumberFromCommas(
                      item[key].text,
                    );
                    item[key].value = Number(numericValue) || 0;
                  }
                }
              });
            });
          }
        }
      }
      this.manualCalculationFormulaResult = '';
      const key = ANSWER_KEYS[this.currentActiveCalculationType] || '';
      if (!key) {
        return;
      }
      if (
        !this.answers.manual[this.subGmlIndex] ||
        _.isEmpty(this.answers.manual[this.subGmlIndex][key])
      ) {
        return;
      }
      let formulaResultString = [];
      let formulaResult = 0;
      if (this.currentActiveCalculationType === CALCULATION_TYPE.BY_TOTAL) {
        const { resultString, result } = this.calculateFormulaResult(
          this.answers.manual[this.subGmlIndex][key],
        );
        formulaResultString.push(resultString);
        formulaResult += Number(result);
      } else {
        this.answers.manual[this.subGmlIndex][key].forEach((item) => {
          const { resultString, result } = this.calculateFormulaResult(item);
          formulaResultString.push(resultString);
          formulaResult += Number(result);
        });
      }
      formulaResult = Math.floor(formulaResult);
      if (formulaResultString.length > 0) {
        if (formulaResult) {
          this.answers.manual[this.subGmlIndex].enum = this.POSITIVE_STATEMENT;
        } else {
          this.answers.manual[this.subGmlIndex].enum = this.NO_DISCLOSURE;
        }
      }

      const formattedFinalResult = this.formatNumberWithCommas(formulaResult);
      this.manualCalculationFormulaResult = `${formulaResultString.join(
        ' + ',
      )} = ${formattedFinalResult}`;
    },
    calculateFormulaResult(item) {
      const totalIssuedShares =
        item[GML_BREAKDOWN_ITEMS.TOTAL_ISSUED_SHARES]?.value || 0;
      const treasuryShares =
        item[GML_BREAKDOWN_ITEMS.TREASURY_SHARES]?.value || 0;
      const percentage = item[GML_BREAKDOWN_ITEMS.PERCENTAGE]?.value || 0;

      const formattedTotalShares =
        this.formatNumberWithCommas(totalIssuedShares);
      const formattedTreasuryShares =
        this.formatNumberWithCommas(treasuryShares);
      const formattedPercentage = this.formatNumberWithCommas(
        (percentage * 100).toFixed(0),
      );

      const resultString = `(${formattedTotalShares} - ${formattedTreasuryShares}) * ${formattedPercentage}%`;
      const result = (
        (totalIssuedShares - treasuryShares) *
        percentage
      ).toFixed(2);
      return {
        resultString,
        result,
      };
    },
    refreshGmlAnnotations(data, currentKey) {
      this.$emit('clear-annotations');
      const annotations = [];
      data.forEach((item) => {
        annotations.push({
          boxes: item.boxes,
          tags: ['Manual', currentKey],
          type: 'wireframe',
        });
      });
      this.$emit('render-annotations', annotations);
    },
    handleFocusInputBox(index, key) {
      this.activeAiAnswer = '';
      this.currentFocusInputKey = `${index}_${key}`;
      const type = ANSWER_KEYS[this.currentActiveCalculationType] || '';
      let currentClassItem;
      if (type === 'total') {
        currentClassItem = this.answers.manual[this.subGmlIndex][type][key];
      } else {
        currentClassItem =
          this.answers.manual[this.subGmlIndex][type][index][key];
      }

      if (currentClassItem.data.length > 0) {
        const data = {
          boxes: currentClassItem.data[0].boxes,
          tags: [ANNOT_TAG.manual, key],
          type: 'wireframe',
        };
        this.$emit('view-gml-answer', {
          answer: currentClassItem,
          data,
        });
      } else {
        this.$emit('clear-annotations');
      }
    },
    handleClearAnswer(index, bkey) {
      if (this.currentActiveCalculationType === CALCULATION_TYPE.BY_TOTAL) {
        this.answers.manual[this.subGmlIndex].total[bkey] = {
          ...this.answers.manual[this.subGmlIndex].total[bkey],
          text: '',
          value: 0,
          data: [],
        };
      } else {
        this.answers.manual[this.subGmlIndex].classes[index][bkey] = {
          ...this.answers.manual[this.subGmlIndex].classes[index][bkey],
          text: '',
          value: 0,
          data: [],
        };
      }
      this.$emit('clear-annotations');
    },
    async createAnswer(boxes) {
      if (this.isGmlSub1) {
        if (!this.currentFocusInputKey) {
          this.$notify({
            title: 'Warning',
            message: 'Please select an item first',
            type: 'warning',
          });
          return;
        }
        const currentIndex = this.currentFocusInputKey.split('_')[0];
        const currentKey = this.currentFocusInputKey.split('_')[1];
        const type = ANSWER_KEYS[this.currentActiveCalculationType] || '';

        let currentClassItem;
        if (type === 'total') {
          currentClassItem =
            this.answers.manual[this.subGmlIndex][type][currentKey];
        } else {
          currentClassItem =
            this.answers.manual[this.subGmlIndex][type][currentIndex][
              currentKey
            ];
        }
        currentClassItem.data = [
          {
            boxes: boxes,
            handleType: 'wireframe',
            text: '',
          },
        ];
        const answerText = boxes.map((box) => box.text).join('');
        const newText = Number(answerText.replace(/[^0-9]/g, ''));
        currentClassItem.text = newText.toString();
        currentClassItem.value = newText;
        currentClassItem.fid = this.fileId;
        currentClassItem.qid = this.qid;
        if (currentKey === GML_BREAKDOWN_ITEMS.PERCENTAGE) {
          currentClassItem.value = newText / 100;
        }

        this.refreshGmlAnnotations(currentClassItem.data, currentKey);
        this.handleInputValueChange();

        const inputId =
          type === 'total'
            ? `total_${currentKey}`
            : `class_${currentIndex}_${currentKey}`;
        this.resizeInputWidths(inputId);
      } else if (this.isGmlSub2) {
        if (this.activePassedName === '') {
          this.$notify({
            title: 'Warning',
            message: 'Please select an item first',
            type: 'warning',
          });
          return;
        }
        const item =
          this.answers.manual[this.subGmlIndex][this.activePassedName];
        item.data = [
          ...item.data,
          {
            boxes,
          },
        ];
        const answerText = boxes.map((box) => box.text).join('');
        item.text = answerText;
        item.value = answerText;
        item.qid = this.qid;
        item.fid = this.fileId;
        item.dataIndex = item.data.length - 1;
        this.$emit('clear-annotations');
        this.$emit('render-annotations', [
          {
            boxes,
            tags: [ANNOT_TAG.manual, this.activePassedName],
            type: 'wireframe',
          },
        ]);
      } else if (this.isGmlSub3) {
        const currentAnswerItem =
          this.answers.manual[this.subGmlIndex].passed_date;
        currentAnswerItem.data = [
          ...currentAnswerItem.data,
          {
            boxes,
          },
        ];
        currentAnswerItem.fid = this.fileId;
        currentAnswerItem.qid = this.qid;
        currentAnswerItem.dateAnswerIndex = currentAnswerItem.data.length - 1;
        this.$emit('clear-annotations');
        this.$emit('render-annotations', [
          {
            boxes,
            tags: [ANNOT_TAG.manual, this.subGmlIndex],
            type: 'wireframe',
          },
        ]);
      }
    },
    checkHasGmlUserAnswerChanged() {
      const answers = _.cloneDeep(this.answers);
      for (const key in answers.manual[this.subGmlIndex]) {
        const item = answers.manual[this.subGmlIndex][key];
        if (!_.isNil(item?.dataIndex)) {
          delete item.dataIndex;
        }
        if (!_.isNil(item?.dateAnswerIndex)) {
          delete item.dateAnswerIndex;
        }
      }

      const answersOriginal = _.cloneDeep(this.answersOriginal);
      for (const key in answersOriginal.manual[this.subGmlIndex]) {
        const item = answersOriginal.manual[this.subGmlIndex][key];
        if (!_.isNil(item?.dataIndex)) {
          delete item.dataIndex;
        }
        if (!_.isNil(item?.dateAnswerIndex)) {
          delete item.dateAnswerIndex;
        }
      }
      return !_.isEqual(answersOriginal.manual, answers.manual);
    },
    getSubmitData() {
      const answers = _.cloneDeep(this.answers);
      if (this.isGmlSub1) {
        const key = ANSWER_KEYS[this.currentActiveCalculationType] || '';
        if (!key) {
          return;
        }
        if (this.currentActiveCalculationType === CALCULATION_TYPE.BY_TOTAL) {
          delete answers.manual[this.subGmlIndex][key].isEditing;
          answers.manual[this.subGmlIndex].classes = null;
        } else if (
          this.currentActiveCalculationType === CALCULATION_TYPE.BY_CLASS
        ) {
          answers.manual[this.subGmlIndex][key].forEach((item) => {
            delete item.isEditing;
          });
          answers.manual[this.subGmlIndex].total = null;
        }
        answers.manual[this.subGmlIndex].formula =
          this.manualCalculationFormulaResult;
        answers.manual[this.subGmlIndex].calc_type =
          this.currentActiveCalculationType;
      }
      if (this.isGmlSub2) {
        for (const key in answers.manual[this.subGmlIndex]) {
          delete answers.manual[this.subGmlIndex][key].dataIndex;
          const data = answers.manual[this.subGmlIndex][key].data;
          if (data && data.length === 0) {
            answers.manual[this.subGmlIndex][key] = null;
          }
        }
      }
      if (this.isGmlSub3) {
        if (answers.manual[this.subGmlIndex]?.passed_date) {
          delete answers.manual[this.subGmlIndex].passed_date.dateAnswerIndex;
        }
      }
      return answers.manual[this.subGmlIndex];
    },
    async removeGmlManualData() {
      let hasManualData;
      if (this.isGmlSub1) {
        const key = ANSWER_KEYS[this.currentActiveCalculationType] || '';
        if (key) {
          hasManualData = !_.isEmpty(
            this.answers.manual[this.subGmlIndex][key],
          );
        }
      }
      // else if (this.isGmlSub2) {
      //   hasManualData = !_.isEmpty(this.answers.manual[this.subGmlIndex]);
      // }
      if (hasManualData) {
        const confirm = await this.$confirm(
          `The data group will be permanently deleted. Do you want to continue?`,
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          },
        );
        if (confirm !== 'confirm') {
          return;
        }
      }
      if (this.isGmlSub1) {
        this.answers.manual[this.subGmlIndex].enum = '';
        this.answers.manual[this.subGmlIndex].total = null;
        this.answers.manual[this.subGmlIndex].classes = null;
        this.currentActiveCalculationType = null;
        this.handleInputValueChange();
        this.submitAnswer('Remove manual data successfully.');
      }
      // else if (this.isGmlSub2) {
      //   this.answers.manual[this.subGmlIndex] = {
      //     enum: '',
      //     resolution: {
      //       text: '',
      //       data: [],
      //       dataIndex: 0,
      //     },
      //     pass_or_not: {
      //       text: '',
      //       data: [],
      //       dataIndex: 0,
      //     },
      //   };
      // }
    },
    // handleManualAdjustmentMouseEnter(key) {
    //   if (this.isGmlSub2) {
    //     let isManualDataEmpty;
    //     isManualDataEmpty =
    //       !this.answers.manual ||
    //       this.answers.manual[this.subGmlIndex] === null ||
    //       Object.values(this.answers.manual[this.subGmlIndex]).every((item) => {
    //         if (item?.data) {
    //           return item.data.length === 0;
    //         }
    //         return true;
    //       });
    //     if (key === 'manual' && isManualDataEmpty) {
    //       this.showSyncAIDataTipsIcon = true;
    //       this.showSyncAIDataTooltip = true;
    //     }
    //   }
    // },
    // handleManualAdjustmentMouseLeave(key) {
    //   if (key === 'manual') {
    //     this.showSyncAIDataTipsIcon = false;
    //     this.showSyncAIDataTooltip = false;
    //   }
    // },
    async quoteGmlAIDataToManual() {
      const hasChanged = this.checkHasGmlUserAnswerChanged();
      let hasManualData;
      if (this.isGmlSub1) {
        const key = ANSWER_KEYS[this.currentActiveCalculationType] || '';
        if (key) {
          hasManualData = !_.isEmpty(
            this.answers.manual[this.subGmlIndex][key],
          );
        }
      }
      if (hasChanged || hasManualData) {
        const confirm = await this.$confirm(
          `There's already data here. Do you want to continue?`,
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          },
        );
        if (confirm === 'confirm') {
          this.judgeGmlDataSync();
        }
      } else {
        this.judgeGmlDataSync();
      }
      // this.showSyncAIDataTipsIcon = false;
      this.showSyncAIDataTooltip = false;
    },

    judgeGmlDataSync() {
      if (this.isGmlSub1) {
        if (
          this.answers.ai[this.subGmlIndex]?.total &&
          this.answers.ai[this.subGmlIndex]?.classes.length > 0
        ) {
          this.showDataSyncDialog = true;
        } else if (this.answers.ai[this.subGmlIndex]?.total) {
          this.selectedSyncType = 'total';
          this.confirmDataSync();
        } else if (this.answers.ai[this.subGmlIndex]?.classes.length > 0) {
          this.selectedSyncType = 'classes';
          this.confirmDataSync();
        } else {
          this.$notify({
            title: 'Warning',
            message: 'No data to sync.',
            type: 'warning',
          });
        }
      } else if (this.isGmlSub2) {
        if (!this.answers.manual) {
          this.$set(this.answers, 'manual', {});
        }
        if (this.answers.ai[this.subGmlIndex]) {
          this.$set(
            this.answers.manual,
            this.subGmlIndex,
            _.cloneDeep(this.answers.ai[this.subGmlIndex]),
          );
        } else {
          this.$notify({
            title: 'Warning',
            message: 'No data to sync.',
            type: 'warning',
          });
        }
      }
    },

    async confirmDataSync() {
      this.showDataSyncDialog = false;
      const copyData = _.cloneDeep(this.answers.ai[this.subGmlIndex]);
      if (this.selectedSyncType === 'total') {
        this.answers.manual[this.subGmlIndex] = {
          ...this.answers.manual[this.subGmlIndex],
          total: copyData.total,
        };
        this.currentActiveCalculationType = CALCULATION_TYPE.BY_TOTAL;
        const item = this.answers.manual[this.subGmlIndex].total;
        this.setSub1ItemAnswer(item);
      } else if (this.selectedSyncType === 'classes') {
        this.answers.manual[this.subGmlIndex] = {
          ...this.answers.manual[this.subGmlIndex],
          classes: copyData.classes,
        };
        this.currentActiveCalculationType = CALCULATION_TYPE.BY_CLASS;
        this.answers.manual[this.subGmlIndex][this.selectedSyncType].forEach(
          (item) => {
            this.setSub1ItemAnswer(item);
          },
        );
      }
      this.resizeInputWidths();
      this.handleInputValueChange();
    },
    setSub1ItemAnswer(item) {
      Object.keys(item).forEach((key) => {
        if (key !== RELEVANT_SHARE_CLASS && key !== 'uuid') {
          if (item[key]) {
            item[key].text = item[key].text.replace(/[^0-9]/g, '');
            item[key].value = item[key].value || 0;
          } else {
            item[key] = {
              text: '0',
              value: 0,
              data: [],
              fid: this.fileId,
              qid: this.qid,
            };
          }
        }
      });
    },

    cancelDataSync() {
      this.showDataSyncDialog = false;
    },

    checkGmlUnsubmitAnswer() {
      if (this.checkHasGmlUserAnswerChanged()) {
        this.$notify({
          title: 'Warning',
          message:
            'There is an unsubmitted answer on the current page, please submit it first',
          type: 'warning',
        });
        return true;
      }
      return false;
    },
    getManualClassesHasData() {
      if (!_.isEmpty(this.answers.manual[this.subGmlIndex].classes)) {
        const classes = this.answers.manual[this.subGmlIndex].classes;
        const hasDataClasses = classes.some((item) => {
          return Object.values(item).some((value) => {
            return (
              typeof value === 'object' &&
              (value.value !== 0 || value.data.length > 0)
            );
          });
        });
        return hasDataClasses;
      }
      return false;
    },
    getManualTotalHasData() {
      if (!_.isEmpty(this.answers.manual[this.subGmlIndex].total)) {
        const total = this.answers.manual[this.subGmlIndex].total;
        const hasDataTotal = Object.values(total).some((value) => {
          return (
            typeof value === 'object' &&
            (value.value !== 0 || value.data.length > 0)
          );
        });
        return hasDataTotal;
      }
      return false;
    },
    async submitAnswer(notifyMessage = '') {
      if (!this.checkHasGmlUserAnswerChanged()) {
        this.$notify({
          title: 'Warning',
          message: 'No manual answers can not be submitted.',
          type: 'warning',
        });
        return;
      }
      if (this.isGmlSub1) {
        let hasOtherData;
        if (this.currentActiveCalculationType === 'By Total') {
          hasOtherData = this.getManualClassesHasData();
        } else {
          hasOtherData = this.getManualTotalHasData();
        }
        if (hasOtherData) {
          const confirm = await this.$confirm(
            `Submitting will overwrite the previous answer. Do you want to continue?`,
            'Warning',
            {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning',
            },
          );
          if (confirm !== 'confirm') {
            return;
          }
        }
      }
      try {
        const currentRuleData = this.getSubmitData();
        const params = {
          rule: this.subGmlIndex,
        };
        const data = {
          [this.subGmlIndex]: currentRuleData,
        };
        await submitPollGmlAnswer(this.qid, data, params);
        this.$notify({
          title: 'Success',
          message: notifyMessage
            ? notifyMessage
            : 'Saved the answer successfully.',
          type: 'success',
        });
        this.answers = {};
        this.answersOriginal = {};
        await this.getAnswer();
        this.initGmlRuleDetails();
        this.showDefaultAnswer();
        this.$emit('after-submit-answer');
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },

    getPassedClassNames(key, passedKey) {
      const classList = [];
      if (key === 'ai') {
        return [];
      }
      if (this.activePassedName === passedKey) {
        classList.push('active');
      }
      return classList;
    },
    selectPassed(key, passedKey) {
      if (key === 'ai') {
        return;
      }
      this.activePassedName = passedKey;
    },
    deletePassedData(item) {
      item.data = [];
      item.dataIndex = 0;
      this.showDefaultAnswer();
    },
    view(key, item, passedKey, direction) {
      switch (direction) {
        case 'prev':
          item.dataIndex--;
          break;
        case 'next':
          item.dataIndex++;
          break;
        default:
          item.dataIndex = 0;
          break;
      }
      if (key === 'manual') {
        this.activePassedName = passedKey;
      }
      const data = {
        ...item.data[item.dataIndex],
        tags: [ANNOT_TAG[key], passedKey],
        type: 'wireframe',
      };

      this.$emit('view-gml-answer', { data });
    },
    handleClickedAnswer(answer, key, bKey, index) {
      this.activeAiAnswer = `${key}_${index}_${bKey}`;
      if (!answer || answer.data.length === 0) {
        return;
      }
      const data = {
        boxes: answer.data[0].boxes,
        tags: [ANNOT_TAG[key], bKey],
        type: 'wireframe',
      };

      this.$emit('view-gml-answer', { answer, data });
    },
    async viewAILocationSuggestion(item, key = '') {
      if (this.locationSuggestion === `${this.subGmlIndex}_${key}`) {
        this.$emit('close-ai-location-suggestion-dialog');
        this.locationSuggestion = '';
        return;
      }
      this.locationSuggestion = `${this.subGmlIndex}_${key}`;
      this.$emit('gml-ai-location-suggestion', {
        rule: this.subGmlIndex,
        subRule: key || null,
        item: item,
      });
    },

    switchDateAnswer(key, item, direction) {
      this.$emit('clear-annotations');

      if (direction === 'prev') {
        item.dateAnswerIndex--;
      } else if (direction === 'next') {
        item.dateAnswerIndex++;
      } else {
        item.dateAnswerIndex = 0;
      }
      this.answers[key][this.subGmlIndex].passed_date = {
        ...this.answers[key][this.subGmlIndex].passed_date,
        dateAnswerIndex: item.dateAnswerIndex,
      };
      const data = {
        ...this.answers[key][this.subGmlIndex].passed_date.data[
          item.dateAnswerIndex
        ],
        tags: [ANNOT_TAG[key], this.subGmlIndex],
        type: 'wireframe',
      };

      this.$emit('view-gml-answer', { data });
    },

    changePassedDate() {
      this.answers.manual[this.subGmlIndex].passed_date = {
        ...this.answers.manual[this.subGmlIndex].passed_date,
        text: this.approvalDateValue || '',
        value: this.approvalDateValue || '',
      };
    },

    removeApprovalDateNodeBoxes(item) {
      item.data.splice(0, item.data.length);
      item.dateAnswerIndex = 0;
      this.showDefaultAnswer();
    },
  },
};
</script>

<style lang="scss">
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';
.gml-special-review {
  .manual-adjustment {
    position: relative;
    &.readonly {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 40px;
        right: 0;
        bottom: 0;
        z-index: 1;
        cursor: not-allowed;
        animation: blur 0.2s forwards;
      }
      @keyframes blur {
        from {
          backdrop-filter: blur(0);
        }
        to {
          backdrop-filter: blur(3px);
        }
      }
    }
    .empty {
      min-width: 337px;
    }
  }

  .title {
    &.date-title {
      justify-content: flex-start !important;
      margin-top: 10px;
      p {
        font-weight: 900;
        color: #7d7d7d;
        font-size: 14px;
        margin-left: 15px;
      }
    }
    .operation-icons {
      display: flex;
      gap: 8px;
      margin-bottom: 5px;
      .btns {
        display: flex;
        gap: 8px;
        position: relative;
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
          &.icon-hand {
            position: absolute;
            bottom: -25px;
            left: 0;
            z-index: 2;
            cursor: default;
            background-image: url(../../common/images/icon-hand.svg);
            animation: jump 1.5s infinite;
          }
          &.disabled {
            filter: grayscale(1);
            opacity: 0.6;
            cursor: not-allowed;
          }
          @keyframes jump {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
            100% {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }

  .tabs {
    margin-bottom: 10px;
    .el-button {
      padding: 4px 8px;
      border-radius: 15px;
      border-color: transparent;
      background-color: #efeff0;

      &:hover,
      &.active {
        border-color: #3e3f42;
        color: #3e3f42;
      }
    }
  }
  .details-item {
    .disclosure-title {
      display: flex;
      align-items: center;
    }
    .el-icon-warning {
      color: red;
      margin-left: 5px;
    }
    .item-row {
      .col {
        .manual-checkbox {
          height: 25px;
          margin: 0 5px;
          border: 1px solid #ccc;
          &.active {
            border-color: $--color-primary;
          }
          &.disabled {
            cursor: not-allowed;
          }
        }
      }
      &.submit {
        margin-top: 10px;
        .el-button {
          &.is-disabled {
            background: #5287e1;
            color: #fff;
            border: 1px solid #5287e1;
            border-radius: 0;
          }
        }
      }
      .breakdown-list {
        width: 100%;
        h5 {
          color: #000 !important;
        }
        .selectInput {
          input {
            border-color: $--color-primary !important;
          }
        }
        .breakdown-title {
          display: flex;
          align-items: center;
          .title-left {
            margin-right: auto;
            display: flex;
            align-items: center;
            h5 {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 120px;
            }
            .el-input {
              input {
                width: 130px;
                height: 26px;
                border: 1px solid #dbe3e8;
                background: #fff;
                font-size: 13px;
                color: #000;
                padding: 0 5px;
              }
            }
          }
          .el-button {
            margin-left: 8px;
          }
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          border-radius: 4px;
          background: #f2f5f7;
          padding: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          .el-input__inner {
            font-weight: normal !important;
          }
          &.select-item {
            border: 1px solid $--color-primary;
            background: rgba(69, 155, 162, 0.15);
          }
        }
        .item-name {
          flex: 1;
          margin-right: 10px;
        }
        .item-value {
          margin-left: auto;
          width: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &.item-input-value {
            width: auto;
            .el-input {
              width: 100px;
              min-width: 100px;
              max-width: 300px;
              transition: width 0.2s ease;
            }
          }
          &.active-value {
            color: $--color-primary;
          }
          .el-input {
            flex: 1;
            margin-right: 5px;
            input {
              height: 26px;
              border: 1px solid #dbe3e8;
              background: #fff;
              color: #000;
              padding: 0 25px 0 5px;
              font-size: 13px;
              -moz-appearance: textfield;
              &::-webkit-inner-spin-button,
              &::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
            }
            .el-input__suffix {
              display: flex;
              align-items: center;
            }
          }
        }
        .item-value-container {
          position: relative;
        }
        .item-value-source {
          display: inline-block;
          font-size: 11px;
          color: #6b6c6f;
          margin-top: 3px;
          position: absolute;
        }

        .btn-ai {
          margin-left: 20px;
          i {
            display: block;
            width: 20px;
            height: 20px;
            background-image: url(../../common/images/icon-ai.svg);
            background-size: cover;
          }
        }

        .el-icon-delete,
        .el-icon-circle-plus-outline,
        .el-icon {
          color: #459ba2;
          font-size: 16px;
          font-weight: 500;
        }
        .el-icon {
          margin-left: 10px;
        }
        .icon-history-log {
          display: inline-block;
          width: 18px;
          height: 18px;
          background-size: 100% 100%;
          background-image: url(../../common/images/icon-review-history.svg);
          cursor: pointer;
          margin-left: 5px;
        }

        .calculation-type {
          display: flex;
          align-items: center;
          gap: 10px;
          .type-select {
            border-radius: 99px;
            background: #efeff0;
            color: #6b6c6f;
            font-size: 13px;
            width: 69px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .active-type {
            border: 1px solid #3e3f42;
            color: #3e3f42;
          }
        }
      }
    }
    .error-tips {
      margin-top: 10px;
      font-size: 13px;
      color: #d80303;
    }
  }

  .list {
    font-size: 12px;
    color: #6b6c6f;
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        margin: 10px 0;
        padding: 8px 10px;
        background-color: #f2f5f7;
        border: 1px solid #f2f5f7;
        border-radius: 4px;

        &:first-child {
          margin-top: 0;
        }

        &:hover {
          background-color: #eee;
        }

        &.active {
          border: 1px solid $--color-primary;
          background: rgba(69, 155, 162, 0.15);
        }

        &.error {
          border-left: 2px solid #f56c6c;

          .name {
            color: #f56c6c;
          }
        }

        .name {
          width: 70px;
        }

        .enums {
          display: flex;

          .enum {
            display: flex;
            align-items: center;
            margin: 0 5px;

            .checkbox {
              display: inline-block;
              width: 28px;
              height: 16px;
              margin-left: 3px;
              line-height: 16px;
              border: 1.5px solid #dbe3e8;
              text-align: center;
              cursor: pointer;

              &:hover {
                border-color: $--color-primary;
              }

              &.fa-check {
                color: $--color-primary;
              }
            }
          }
        }

        .view-btns {
          display: flex;

          .el-button {
            margin: 0 2px;
            padding: 3px;
            border-radius: 0;

            &.btn-view {
              padding: 3px 5px;
            }

            &.btn-prev,
            &.btn-next {
              padding: 3px 4px;

              &:not(:disabled) {
                color: $--color-primary;
              }

              ::v-deep > i {
                &::before {
                  font-weight: bold;
                }
              }
            }
          }
        }

        .nums {
          margin: 0 5px;
          font-size: 13px;

          &.hide {
            visibility: hidden;
          }
        }

        .operations {
          display: flex;
          align-items: center;

          .el-button {
            padding: 0;

            &.btn-ai {
              i {
                display: block;
                width: 20px;
                height: 20px;
                background-image: url(../../common/images/icon-ai.svg);
                background-size: cover;
              }

              &:hover {
                transform: scale(1.1);
              }
            }

            &.btn-delete {
              color: $--color-primary;

              &.hide {
                visibility: hidden;
              }

              &:hover {
                color: #f56c6c;
              }
            }

            ::v-deep > i {
              font-size: 14px;
            }
          }
        }
      }
    }
    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      color: #999;
    }
  }
  .calculate-formula {
    color: #6b6c6f;
    font-size: 14px;
    margin: 10px 0;
  }
  .rule-tabs {
    width: 100%;
    padding: 5px 10px;
    text-align: left;
    box-sizing: border-box;

    > span {
      display: inline-table;
      height: 20px;
      line-height: 20px;
      margin: 5px 0 0 0;
      padding: 2px 10px;
      border: 1px solid $--color-blue-light;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;

      &.active {
        color: $--color-white;
        background: $--color-primary;
        border-color: $--color-primary;
      }

      &.error {
        color: $--color-red;
      }
    }
  }
}
.data-sync-dialog {
  .sync-type-selection {
    .el-radio-group {
      display: flex;
      justify-content: space-around;
      .el-radio {
        .el-radio__label {
          font-size: 14px;
          color: #606266;
        }
        .el-radio__input.is-checked {
          .el-radio__inner {
            border-color: $--color-primary;
            background-color: $--color-primary;
          }
        }
      }
    }
  }
  .el-button--default {
    &:hover {
      color: $--color-primary;
      border-color: $--color-primary;
    }
  }
  .el-button--primary {
    color: #fff;
    background-color: $--color-primary;
    border-color: $--color-primary;
  }
}
.approval-date-picker {
  .el-input__inner {
    border-color: #ccc !important;
    color: $--color-primary !important;
  }
  margin-bottom: 15px;
  &.is-active {
    .el-input__inner {
      border-color: $--color-primary !important;
    }
  }
}
</style>
