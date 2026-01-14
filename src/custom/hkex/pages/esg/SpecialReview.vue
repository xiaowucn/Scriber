<template>
  <div class="esg-special-review checking-details">
    <div
      v-for="(answer, key) in answers"
      :key="key"
      class="section"
      :class="[
        key === 'ai' ? 'ai-suggestion' : 'manual-adjustment',
        key === 'manual' && showSyncAIDataTipsIcon ? 'readonly' : '',
      ]"
      @mouseenter="handleManualAdjustmentMouseEnter(key)"
      @mouseleave="handleManualAdjustmentMouseLeave(key)">
      <div class="title">
        <h4>{{ key === 'ai' ? 'AI Suggestion' : 'Manual Adjustment' }}</h4>
        <div v-if="key === 'manual'" class="operation-icons">
          <div class="btns">
            <el-tooltip
              effect="dark"
              manual
              v-model="showSyncAIDataTooltip"
              content="Synchronize AI Suggestion to Manual Adjustment"
              placement="top">
              <i
                class="icon-plus"
                @mouseenter="showSyncAIDataTooltip = true"
                @mouseleave="showSyncAIDataTooltip = false"
                @click="syncAIData"></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="Remove manual data"
              placement="top">
              <i class="icon-remove" @click="removeManualData"></i>
            </el-tooltip>
            <i v-if="showSyncAIDataTipsIcon" class="icon-hand"></i>
          </div>
          <report-review-history-log :history-log="reviewHistory">
          </report-review-history-log>
        </div>
      </div>
      <section class="details-item">
        <div>
          <h5>Disclosure Classification</h5>
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
            <div :class="key === 'manual' ? 'manual-checkbox' : ''">
              <i v-if="answer.value === item.value" class="fa fa-check"></i>
            </div>
          </div>
        </div>
      </section>
      <section class="details-item">
        <div class="title">
          <h5>Breakdown</h5>
        </div>
        <div>
          <div v-if="showTabs" class="tabs">
            <template v-if="tabs[key]">
              <el-button
                v-for="(tab, index) in tabs[key].options"
                :key="index"
                type=""
                size="mini"
                :class="tabs[key].current === tab.value ? 'active' : ''"
                @click="switchTab(key, tab)">
                {{ tab.label }}
                <template v-if="tab.label !== 'All'">
                  : {{ tab.count }}
                </template>
              </el-button>
            </template>
          </div>
          <div class="list">
            <ul v-if="getAnswerCategories(answer, key).length > 0">
              <li
                v-for="(category, index) in getAnswerCategories(answer, key)"
                :key="index"
                :class="getCategoryClassNames(key, category)"
                @click="selectCategory(key, category)">
                <span class="name">{{ category.category }}</span>
                <span v-if="!showTabs && key === 'ai'">{{
                  category.enum
                }}</span>
                <div v-if="key === 'manual'" class="enums">
                  <div
                    v-for="(enumItem, index) in enums"
                    :key="index"
                    class="enum">
                    <label>{{ enumItem.label }}</label>
                    <span
                      class="checkbox"
                      :class="
                        enumItem.value === category.enum ? 'fa fa-check' : ''
                      "
                      @click.stop="checkEnum(enumItem, category)">
                    </span>
                  </div>
                </div>
                <div class="view-btns">
                  <el-button
                    size="mini"
                    icon="el-icon-arrow-left"
                    class="btn-prev"
                    :disabled="category.dataIndex < 1"
                    @click.stop="view(key, category, 'prev')">
                  </el-button>
                  <el-button
                    size="mini"
                    class="btn-view"
                    :disabled="category.data.length === 0"
                    @click.stop="view(key, category)">
                    view
                  </el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-arrow-right"
                    class="btn-next"
                    :disabled="category.dataIndex >= category.data.length - 1"
                    @click.stop="view(key, category, 'next')">
                  </el-button>
                </div>
                <div
                  class="nums"
                  :class="category.data.length === 0 ? 'hide' : ''">
                  {{ category.dataIndex + 1 }}/{{ category.data.length }}
                </div>
                <div class="operations">
                  <el-button
                    v-if="key === 'ai'"
                    type="text"
                    size="mini"
                    class="btn-ai"
                    @click="viewAILocationSuggestion(category.category)">
                    <i></i>
                  </el-button>
                  <el-button
                    v-if="key === 'manual'"
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    class="btn-delete"
                    :class="category.data.length === 0 ? 'hide' : ''"
                    @click="deleteCategoryData(category)">
                  </el-button>
                </div>
              </li>
            </ul>
            <div v-else class="empty">No Data</div>
          </div>
        </div>
      </section>
      <section v-if="key === 'manual'" class="details-item">
        <div class="item-row submit">
          <el-button
            size="mini"
            class="button-hkex"
            :disabled="isSubmitAnswerBtnDisabled"
            @click="submitAnswer">
            Submit Answer
          </el-button>
        </div>
        <div v-if="showErrorTips" class="error-tips">
          {{ errorTips }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';
import ReportReviewHistoryLog from '../../components/ReportReviewHistoryLog';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';
import {
  fetchEsgSpecialRuleAnswer,
  updateEsgSpecialRuleAnswer,
} from '@/store/api/hkex.api';

const ANNOT_TAG = {
  ai: 'AI Answers',
  manual: 'Manual',
};

export default {
  name: 'esg-special-review',
  components: { ReportReviewHistoryLog },
  mixins: [ReportReviewMixin],
  props: {
    qid: {
      type: Number,
      required: true,
    },
    rule: {
      type: String,
      required: true,
    },
    stockCode: {
      type: String,
      required: true,
    },
    ruleSchemaPath: {
      type: String,
      required: true,
    },
    reviewHistory: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      disclosureLocationOptions: [
        {
          value: 'Comply',
          label: 'Comply',
        },
        {
          value: 'No Disclosure',
          label: 'No Disclosure',
        },
      ],
      manualDisclosureValue: '',
      enums: [
        {
          label: 'Yes',
          value: 'Yes',
          count: 0,
        },
        {
          label: 'No',
          value: 'No',
          count: 0,
        },
      ],
      tabs: {},
      activeCategoryName: '',
      itemsOriginal: [],
      answers: {},
      answersOriginal: {},
      showSyncAIDataTooltip: false,
      showSyncAIDataTipsIcon: false,
      currentSubRule: '',
    };
  },
  computed: {
    showTabs() {
      return [
        'E8-Categories of scope 3 emissions',
        'E9-Scope 3 emissions data by categories',
      ].includes(this.rule);
    },
    showErrorTips() {
      return !(
        this.answers.manual.value === '' &&
        this.answers.manual.categories.every(
          (category) => category.data.length === 0 && category.enum === '',
        )
      );
    },
    isSubmitAnswerBtnDisabled() {
      return this.errorTips !== '' || this.submitAnswerButtonDisabled;
    },
    errorTips() {
      let message = '';
      for (const category of this.answers.manual.categories) {
        if (
          (category.enum === 'Yes' && category.data.length === 0) ||
          (category.enum === 'No' && category.data.length > 0)
        ) {
          message =
            'ERROR! Highlighted categories (A) marked as "YES" but not supported by annotation data, or (B) marked as "NO" but annotation data is not yet removed. Please check highlighted categories.';
          break;
        }
        if (category.enum === '' && category.data.length > 0) {
          message =
            'ERROR! Highlighted categories (A) marked as "YES" but not supported by annotation data, or (B) marked as "NO" but annotation data is not yet removed , or (C) not marked but have annotation data. Please check highlighted categories.';
          break;
        }
        if (category.enum === '' && category.data.length === 0) {
          message =
            'ERROR! There are uncommitted categories. Please check the categories.';
          break;
        }
      }

      return message;
    },
  },
  watch: {
    qid() {
      this.reset();
      this.init();
    },
    rule() {
      this.reset();
      this.init();
    },
    'answers.manual': {
      deep: true,
      handler() {
        this.$store.commit(
          'hkexModule/SET_HAS_UNSUBMIT_CHANGE',
          this.chekHasUnsubmitedAnswer(),
        );
      },
    },
  },
  created() {
    EventBus.$on('create-answer', this.createAnswer);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('create-answer', this.createAnswer);
  },
  methods: {
    async init() {
      await this.getAnswer();
      this.setEnumTabs();
      this.showDefaultAnswer();
    },
    reset() {
      this.tabs.ai.current = 'Yes';
      this.tabs.manual.current = 'All';
      this.activeCategoryName = '';
    },
    setEnumTabs() {
      const tabs = {};

      for (const key in this.answers) {
        const answer = this.answers[key];
        const options = [
          {
            label: 'Yes',
            value: 'Yes',
            count: 0,
          },
          {
            label: 'No',
            value: 'No',
            count: 0,
          },
        ];
        const allOption = {
          label: 'All',
          value: 'All',
          count: answer.categories.length,
        };
        options.forEach((e) => {
          e.count = answer.categories.filter(
            (category) => category.enum === e.value,
          ).length;
        });
        tabs[key] = {
          current: this.tabs[key]?.current || 'Yes',
          options: options,
        };
        if (key === 'manual') {
          tabs[key] = {
            current: this.tabs[key]?.current || 'All',
            options: [allOption, ...options],
          };
        }
      }

      this.tabs = tabs;
    },
    async getAnswer() {
      try {
        const res = await fetchEsgSpecialRuleAnswer(this.qid, {
          rule: this.rule,
          stock_code: this.stockCode,
        });
        this.convertAnswers(res);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    convertAnswers(answers) {
      for (const key in answers) {
        const answer = answers[key];
        answer.categories.forEach((category) => {
          category.dataIndex = 0;
        });
      }
      this.answers = answers;
      this.answersOriginal = _.cloneDeep(this.answers);
    },
    getAnswerCategories(answer, key) {
      if (this.showTabs) {
        return answer.categories.filter((category) => {
          const currentTab = this.tabs[key]?.current;
          if (currentTab === 'All') {
            return true;
          }
          return category.enum === currentTab;
        });
      }
      return answer.categories;
    },
    switchTab(key, tab) {
      this.tabs[key].current = tab.value;
    },
    selectCategory(key, category) {
      if (key === 'ai') {
        return;
      }
      this.activeCategoryName = category.category;
      this.$emit('clear-annotations');
    },
    calcManualDisclosureValue() {
      const manualCategories = this.answers.manual.categories;

      if (manualCategories.length === 0) {
        this.answers.manual.value = '';
        return;
      }

      const hasYes = manualCategories.some((i) => i.enum === 'Yes');
      const allNo = manualCategories.every((i) => i.enum === 'No');

      if (hasYes) {
        this.answers.manual.value = 'Comply';
      } else if (allNo) {
        this.answers.manual.value = 'No Disclosure';
      } else {
        this.answers.manual.value = '';
      }
    },
    getCategoryClassNames(key, category) {
      const classList = [];

      if (key === 'ai') {
        return [];
      }

      if (this.activeCategoryName === category.category) {
        classList.push('active');
      }
      if (
        (category.enum === 'Yes' && category.data.length === 0) ||
        (category.enum === 'No' && category.data.length > 0) ||
        (category.enum === '' && category.data.length > 0)
      ) {
        classList.push('error');
      }

      return classList;
    },
    checkEnum(enumItem, category) {
      category.enum = category.enum === enumItem.value ? '' : enumItem.value;
      this.activeCategoryName = category.category;
      this.calcManualDisclosureValue();
      this.setEnumTabs();
    },
    view(key, item, direction) {
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
        this.activeCategoryName = item.category;
      }
      this.$emit('view-answer', {
        ...item.data[item.dataIndex],
        tags: [ANNOT_TAG[key], item.category],
        type: 'wireframe',
      });
    },
    deleteCategoryData(category) {
      category.data = [];
      category.enum = '';
      category.dataIndex = 0;
      this.calcManualDisclosureValue();
      this.setEnumTabs();
    },
    syncAIData() {
      this.answers.manual = _.cloneDeep(this.answers.ai);
      this.showSyncAIDataTipsIcon = false;
      this.showSyncAIDataTooltip = false;
      this.setEnumTabs();
    },
    handleManualAdjustmentMouseEnter(key) {
      const isManualDataEmpty =
        this.answers.manual.value === '' &&
        this.answers.manual.categories.every(
          (category) => category.data.length === 0 && category.enum === '',
        );
      if (key === 'manual' && isManualDataEmpty) {
        this.showSyncAIDataTipsIcon = true;
        this.showSyncAIDataTooltip = true;
      }
    },
    handleManualAdjustmentMouseLeave(key) {
      if (key === 'manual') {
        this.showSyncAIDataTipsIcon = false;
        this.showSyncAIDataTooltip = false;
      }
    },
    createAnswer(boxes) {
      if (this.activeCategoryName === '') {
        this.$notify({
          title: 'Warning',
          message: 'Please select a category first',
          type: 'warning',
        });
        return;
      }
      const category = this.answers.manual.categories.find(
        (category) => category.category === this.activeCategoryName,
      );
      category.data.push({
        boxes,
      });
      this.$emit('clear-annotations');
      this.$emit('render-annotations', [
        {
          boxes,
          tags: [ANNOT_TAG.manual, this.activeCategoryName],
          type: 'wireframe',
        },
      ]);
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
        this.answers.manual.categories.forEach((category) => {
          this.deleteCategoryData(category);
        });
        this.calcManualDisclosureValue();
        this.setEnumTabs();
        this.activeCategoryName = '';
        this.$emit('clear-annotations');
        this.submitAnswer({
          notifyMessage: 'Remove manual data successfully.',
        });
      }
    },
    viewAILocationSuggestion(subRule) {
      if (this.currentSubRule === subRule) {
        this.$emit('close-ai-location-suggestion-dialog');
        this.currentSubRule = '';
        return;
      }
      this.currentSubRule = subRule;
      const { data: items } = this.answers.ai.categories.find(
        (i) => i.category === subRule,
      );
      this.$emit('view-ai-location-suggestion', {
        subRule: subRule.replace(/\s*Data\s*/, ''),
        items,
      });
    },
    async showDefaultAnswer() {
      let firstCategoryWithData = null;

      const getAnswerData = (boxes, tags) => {
        return {
          type: 'wireframe',
          boxes,
          tags,
        };
      };

      // 展示人工答案
      firstCategoryWithData = this.answersOriginal.manual.categories.find(
        (category) => {
          return category.data.length > 0;
        },
      );
      if (firstCategoryWithData) {
        const answerData = getAnswerData(firstCategoryWithData.data[0].boxes, [
          'Manual',
          firstCategoryWithData.category,
        ]);
        this.$emit('view-answer', answerData);
        return;
      }

      // ND，不展示AI答案
      if (this.answers.ai.value.toLowerCase() === 'no disclosure') {
        return;
      }

      // 非 ND，展示AI精确定位
      firstCategoryWithData = this.answersOriginal.ai.categories.find(
        (category) => {
          return category.data.length > 0;
        },
      );
      if (firstCategoryWithData) {
        const answerData = getAnswerData(firstCategoryWithData.data[0].boxes, [
          'AI Answers',
          firstCategoryWithData.category,
        ]);
        this.$emit('view-answer', answerData);
      }
    },
    chekHasUnsubmitedAnswer() {
      return !_.isEqual(
        this.getManualData(this.answers.manual),
        this.getManualData(this.answersOriginal.manual),
      );
    },
    getManualData(manualData) {
      const manual = _.cloneDeep(manualData);
      manual.categories.forEach((category) => {
        delete category.dataIndex;
      });
      return manual;
    },
    async submitAnswer({ notifyMessage }) {
      try {
        this.answers.manual.categories.forEach((category) => {
          delete category.dataIndex;
          category.special_ui = true;
        });
        await updateEsgSpecialRuleAnswer(this.qid, this.answers.manual, {
          rule: this.rule,
          stock_code: this.stockCode,
        });
        this.$notify({
          title: 'Success',
          message: notifyMessage || 'Submit answer successfully.',
          type: 'success',
        });
        this.init();
        this.$emit('after-submit-answer');
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.esg-special-review {
  font-size: 12px;
  color: #6b6c6f;

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
    .operation-icons {
      display: flex;
      gap: 8px;
      margin-bottom: 5px;
      .btns {
        display: flex;
        gap: 8px;
        position: relative;
        cursor: pointer;
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
    .item-row {
      .col {
        .manual-checkbox {
          height: 25px;
          margin: 0 5px;
          border: 1px solid #ccc;
        }
      }
      &.submit {
        margin-top: 10px;
        .el-button {
          &.is-disabled {
            opacity: 1;
            color: #a6a6a6;
            border-color: #dfdfdf;
            background-color: #dfdfdf;
            cursor: not-allowed;
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
          min-width: 36px;
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
}
</style>
