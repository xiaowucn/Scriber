<template>
  <el-container class="annual-report-checking-container">
    <download-file-loading
      v-if="showDownloadLoading"
      :is-show-on-the-pdf="isSelectChangePdf"
      :document-size="documentSize"
      :download-speed="downloadSpeed"
      :download-remaining-time="downloadRemainingTime"
      :download-progress="downloadProgress"></download-file-loading>
    <el-aside :width="pdfAsideWidth" class="pdf-display-panel">
      <pdf-viewer
        v-if="documentData"
        ref="pdfViewer"
        :key="currentFileId"
        :document-data="documentData"
        :document-page-info="documentPageInfo"
        :annotation-disabled="annotationDisabled"
        @document-ready="onDocumentReady"
        @page-rendered="onPageRendered"
        @annotation-rendered="onAnnotationRendered"
        @annotation-drawed="createAnswer"
        @annotation-clicked="createAnswer"
        @table-annotation-cell-clicked="onTableAnnotationCellClicked"
        @annotation-mode-changed="onAnnotationModeChanged"
        @annotation-deleted="onAnnotationDeleted"
        @go-back="goback"></pdf-viewer>
    </el-aside>
    <div
      class="gutter-horizontal"
      v-dragHorizontal="{
        leftMinWidth: 660,
        rightMinWidth: 560,
        isDragPdfViewer: true,
      }"></div>
    <el-main class="rule-details-container" v-loading="loading">
      <div class="rule-details-wrapper">
        <div class="rule-header">
          <span class="rule-label">Listing Rule</span>
          <listing-rule-selector
            v-if="groups.length > 0"
            ref="ruleSelector"
            :file-meta="fileMeta"
            :groups="groups"
            @select-rules="setRules" />
        </div>
        <template v-if="rules.length > 0">
          <div class="rule-list-container" :style="{ height: ruleListHeight }">
            <div ref="ruleList" class="rule-list">
              <div
                v-for="(item, index) in rules"
                :key="index"
                class="rule-list-item"
                :class="[
                  item.color,
                  item.rule == rule ? 'active' : '',
                  getNCClassName(rule),
                ]"
                @click="changeRule(item.rule)">
                <div class="name">
                  <span>{{ index + 1 }}:</span>
                  <span class="title">
                    {{ getRuleAlias(item) }}
                  </span>
                </div>
                <span v-if="item.label" class="label">{{ item.label }}</span>
              </div>
            </div>
          </div>
          <div
            class="gutter-vertical"
            v-dragVertical="{ dragingLine: 'line1', headerHeight: 104 }"></div>
          <div
            class="rule-description-container"
            :style="{ height: ruleDescriptionHeight }">
            <historical-rules :rules="ruleHistory" />
            <div class="description">{{ ruleHistory.review.description }}</div>
          </div>
          <div
            class="gutter-vertical align-center"
            v-dragVertical="{ dragingLine: 'line2', headerHeight: 104 }"></div>
          <div v-if="ruleDetails.can_add_group" class="fundraising-event-tуре">
            <div class="section">
              <label>Fundraising Event Туре</label>
              <div class="operations">
                <el-tooltip
                  effect="dark"
                  content="Add a fundraising event"
                  placement="top">
                  <el-button
                    :disabled="!ruleDetails.can_add_group"
                    type="text"
                    icon="el-icon-document-add"
                    class="add"
                    @click="openAddFundraisingEventTypeDialog">
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="Delete a fundraising event"
                  placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="delete"
                    :disabled="showDeleteFundraisingEventTypeIconsDisabled"
                    @click.stop="showDeleteFundraisingEventTypeIcons">
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="section">
              <div class="tags">
                <el-tag
                  size="mini"
                  v-for="(
                    group, index
                  ) in ruleDetails.preset_answer.answer.filter(
                    (ans) => ans.group_name,
                  )"
                  :key="index"
                  :class="[
                    index === groupIndex ? 'active' : '',
                    eventTypeClassName(group),
                  ]"
                  @click="changeRuleAnswerGroup(index)">
                  {{ group.group_name }}
                  <i
                    v-if="fundraisingEventТуреDeletable && group.group_id"
                    class="el-icon-close"
                    @click.stop="
                      openDeleteFundraisingEventTypeConfirm(
                        group.group_id,
                        index,
                      )
                    "></i>
                </el-tag>
              </div>
            </div>
            <el-dialog
              v-if="showAddFundraisingEventTypeDialog"
              title="Add a fundraising event"
              :visible="true"
              custom-class="hkex-export-dialog add-fundraising-event-type-dialog"
              @close="closeAddFundraisingEventTypeDialog">
              <el-form
                ref="addFundraisingEventTypeForm"
                :model="addFundraisingEventTypeForm"
                :rules="addFundraisingEventTypeFormRules"
                label-width="120px">
                <el-form-item label="Event type" prop="name">
                  <el-select
                    v-model="addFundraisingEventTypeForm.name"
                    size="mini"
                    clearable
                    placeholder="Please select a type">
                    <el-option
                      v-for="(type, index) in fundraisingEventTypes"
                      :label="type"
                      :value="type"
                      :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Copy to">
                  <ul>
                    <li
                      v-for="(rule, index) in fundraisingEventTypeCopyToRules"
                      :key="index">
                      {{ getRuleAlias(rule) }}
                    </li>
                  </ul>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button
                  size="mini"
                  @click="closeAddFundraisingEventTypeDialog">
                  Cancel
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  class="button-hkex"
                  :loading="addFundraisingEventTypeLoading"
                  @click="addFundraisingEventType">
                  Save
                </el-button>
              </div>
            </el-dialog>
          </div>
          <div
            v-if="
              currentRuleUserAnswerGroup &&
              currentRuleUserAnswerGroup.items.length > 1
            "
            class="rule-tabs">
            <span
              v-for="(item, index) in currentRuleUserAnswerGroup.items"
              :key="index"
              :class="[
                index === subRuleIndex ? 'active' : '',
                getUserAnswerInvalidClassName(item),
              ]"
              @click="changeSubRuleTabs(index)">
              {{ item.schema.data.label }}
            </span>
          </div>
          <div
            v-if="!isEsgSpecialRule && !isGmlSpecialRule"
            class="checking-details">
            <div class="section ai-suggestion">
              <div class="title">
                <h4>AI Suggestion</h4>
              </div>
              <div v-if="showDisclosureLocation" class="details-item">
                <h5>Disclosure {{ disclosureBehindText }}</h5>
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
                    <div v-if="disclosureAISuggestionValue === item.value">
                      <i class="fa fa-check fa-fw fa-2x"></i>
                    </div>
                    <div v-if="index === 0 && showDisclosureSelect">
                      <span v-if="showDruleDisclosureText" class="rule-text">
                        {{ disclosureAISuggestionValue }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="ruleDetails.has_director_data" class="details-item">
                <h5>
                  Additional Data:
                  <el-popover
                    placement="left"
                    title=""
                    width="300"
                    trigger="click"
                    popper-class="additional-data-tooltip agm-additional-data-popover">
                    <div class="content">
                      <agm-additional-data-popover></agm-additional-data-popover>
                    </div>
                    <i slot="reference" class="fas fa-list"></i>
                  </el-popover>
                </h5>
              </div>
              <div
                v-if="showFundraisingAdditionalData"
                class="details-item b1-to-b7-additional-data">
                <h5>
                  Additional Data:
                  <el-tooltip
                    effect="dark"
                    content="View Detailed Information"
                    placement="top">
                    <i class="fas fa-list" @click="openFundraisingActivity"></i>
                  </el-tooltip>
                  <span
                    v-if="
                      currentRulePresetAnswerGroup.group_name === 'No Event'
                    "
                    class="no-event-tips">
                    (No applicable event)
                  </span>
                </h5>
                <div
                  v-if="currentRulePresetAnswerGroup.addition_data"
                  class="text-wrapper">
                  <div class="text">
                    <el-popover
                      effect="dark"
                      placement="left"
                      popper-class="additional-data-tooltip">
                      <div class="content">
                        {{ currentRulePresetAnswerGroup.addition_data }}
                      </div>
                      <el-button
                        type="text"
                        size="mini"
                        slot="reference"
                        class="more">
                        More
                      </el-button>
                    </el-popover>
                    {{ currentRulePresetAnswerGroup.addition_data }}
                  </div>
                </div>
              </div>
              <div
                v-if="showNDDRAdditionalData"
                class="details-item b1-to-b7-additional-data">
                <h5>
                  Additional Data:
                  <el-tooltip
                    effect="dark"
                    content="View Detailed Information"
                    placement="top">
                    <i class="fas fa-list" @click="openNDDRPage"></i>
                  </el-tooltip>
                </h5>
              </div>
              <div v-if="showSignificantInvestmentRatio" class="details-item">
                <h5>
                  Significant Investment Ratio:
                  <span
                    v-if="significantInvestmentRatios.length === 0"
                    class="no-event-tips">
                    (No Applicable)
                  </span>
                </h5>
                <significant-investment-ratio
                  :show="true"
                  :show-operation="false"
                  @data-ready="handleRatio4DataReady"
                  @show-boxes="showRatio4Boxes">
                </significant-investment-ratio>
              </div>
              <template v-if="showComplianceSections">
                <div
                  v-if="isShowAdditionalDocumentsButton"
                  class="details-item additional-documents">
                  <h5>
                    Additional Documents:
                    <el-button
                      v-if="isRuleMergeHasData"
                      type="text"
                      class="link"
                      @click="checkComplianceDetail">
                      {{ ruleMergeData.label }}
                    </el-button>
                    <p v-else class="text">{{ ruleMergeData.label }}</p>
                  </h5>
                </div>
                <template v-if="ruleDetails.preset_answer">
                  <div
                    v-if="ruleDetails.preset_answer.rule_result.addition_data"
                    class="details-item b1-to-b7-additional-data">
                    <div v-if="rule === 'B99'">
                      <h5>
                        Additional Data:
                        <el-popover
                          placement="left"
                          title=""
                          width="300"
                          trigger="click"
                          popper-class="additional-data-tooltip agm-additional-data-popover">
                          <div class="content">
                            <ar-additional-data-popover
                              :data="
                                ruleDetails.preset_answer.rule_result
                                  .addition_data
                              ">
                            </ar-additional-data-popover>
                          </div>
                          <i slot="reference" class="fas fa-list"></i>
                        </el-popover>
                      </h5>
                    </div>
                    <el-popover
                      v-else
                      placement="left"
                      title=""
                      width="240"
                      trigger="click"
                      popper-class="additional-data-popover">
                      <div class="content">
                        {{
                          ruleDetails.preset_answer.rule_result.addition_data
                        }}
                      </div>
                      <el-button slot="reference" size="mini" plain>
                        Additional Data
                      </el-button>
                    </el-popover>
                  </div>
                </template>
                <div v-if="isShowComplianceAssessment" class="details-item">
                  <h5>Compliance Assessment</h5>
                  <div class="item-row">
                    <div
                      v-for="(item, index) in complianceAssessmentOptions"
                      :key="index"
                      class="col">
                      {{ item }}
                    </div>
                  </div>
                  <div class="item-row">
                    <div class="col">
                      <div
                        v-if="complianceAISuggestionValue === COMPLIANCE"
                        class="ai-suggestion-select">
                        <i class="fa fa-check fa-fw fa-2x"></i>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        v-if="complianceAISuggestionValue === NON_COMPLIANCE"
                        class="ai-suggestion-select">
                        <i class="fa fa-check fa-fw fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="details-item"
                  v-if="!getRuleType('D') && currentRuleHistoryData">
                  <h5>Other Years Reviewed</h5>
                  <div class="item-row">
                    <div
                      v-for="(item, index) in complianceAssessmentOptions"
                      :key="index"
                      class="col">
                      {{ item }}
                    </div>
                  </div>
                  <div class="item-row">
                    <div class="col">
                      <span class="history-years">{{
                        currentRuleHistoryParticularYear.complianceYear.join(
                          ' ',
                        )
                      }}</span>
                    </div>
                    <div class="col">
                      <span class="history-years">{{
                        currentRuleHistoryParticularYear.notComplianceYear.join(
                          ' ',
                        )
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="details-item">
                  <h5>AI Tagged Information</h5>
                  <div class="item-row manual-tagged-info">
                    <div class="col">
                      <div>
                        No. of Tags: {{ currentRulePresetAnswer.length }}
                      </div>
                      <div class="tags">
                        <el-button
                          type="text"
                          icon="el-icon-caret-left"
                          :disabled="
                            currentRulePresetAnswer.length === 0 ||
                            presetAnswerIndex === 0
                          "
                          @click="switchPresetAnswer('prev')"></el-button>
                        <el-button
                          size="mini"
                          class="view-button"
                          :disabled="currentRulePresetAnswer.length === 0"
                          @click="switchPresetAnswer()">
                          view
                        </el-button>
                        <el-button
                          type="text"
                          icon="el-icon-caret-right"
                          :disabled="
                            presetAnswerIndex >=
                            currentRulePresetAnswer.length - 1
                          "
                          @click="switchPresetAnswer('next')"></el-button>
                        <span v-if="currentRulePresetAnswer.length > 0">
                          {{ presetAnswerIndex + 1 }}/{{
                            currentRulePresetAnswer.length
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="showAILocationSuggestion" class="details-item">
                  <h5>Location Suggestion</h5>
                  <div class="item-row">
                    <el-button
                      type="primary"
                      size="small"
                      class="ai-location-suggestion-button"
                      @click="getPredictedAnswer(true)">
                      AI Location Suggestion
                    </el-button>
                  </div>
                </div>
              </template>
            </div>

            <div class="section manual-adjustment">
              <div class="title">
                <h4>Manual Adjustment</h4>
                <div class="operation-btns">
                  <review-data-quick-edit
                    v-if="supportReviewDataQuickEdit"
                    @copy-answer="copyAnswer"
                    @delete-all-answers="deleteAllAnswers">
                  </review-data-quick-edit>
                  <report-review-history-log :history-log="reviewHistoryLog">
                  </report-review-history-log>
                </div>
              </div>
              <div v-if="showDisclosureLocation" class="details-item">
                <h5>Disclosure {{ disclosureBehindText }}</h5>
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
                    <div v-if="index === 0 && showDisclosureSelect">
                      <el-select
                        size="mini"
                        v-model="DRuleDisclosureValueSelected"
                        placeholder="Please select"
                        @change="changeEnumDisclosureValue">
                        <el-option
                          v-for="item in DRuleDisclosureValues"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                    </div>
                    <div
                      v-else
                      class="manual-box"
                      :class="[
                        disclosureValue.toLowerCase() ===
                        item.value.toLowerCase()
                          ? 'active'
                          : '',
                      ]"
                      @click="changeEnumDisclosureValue(item.value)">
                      <i class="fa fa-check fa-fw fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="isShowComplianceAssessment"
                class="details-item"
                :class="[getUserAnswerInvalidClassName()]">
                <h5>Compliance Assessment</h5>
                <div class="item-row">
                  <div
                    v-for="(item, index) in complianceAssessmentOptions"
                    :key="index"
                    class="col">
                    {{ item }}
                  </div>
                </div>
                <div class="item-row">
                  <div class="col">
                    <div
                      @click="changeEnumComplianceValue(COMPLIANCE)"
                      class="manual-box"
                      :class="[complianceValue === COMPLIANCE ? 'active' : '']">
                      <i
                        v-show="complianceValue === COMPLIANCE"
                        class="fa fa-check fa-fw fa-2x"></i>
                    </div>
                  </div>
                  <div class="col">
                    <div
                      @click="changeEnumComplianceValue(NON_COMPLIANCE)"
                      class="manual-box"
                      :class="[
                        complianceValue === NON_COMPLIANCE ? 'active' : '',
                      ]">
                      <i
                        v-show="complianceValue === NON_COMPLIANCE"
                        class="fa fa-check fa-fw fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="details-item">
                <h5>Manual Tagged Information</h5>
                <div class="item-row manual-tagged-info">
                  <div class="col">
                    <div>No. of Tags: {{ currentRuleUserAnswer.length }}</div>
                    <div class="tags">
                      <el-button
                        type="text"
                        icon="el-icon-caret-left"
                        :disabled="
                          currentRuleUserAnswer.length === 0 ||
                          userAnswerIndex === 0
                        "
                        @click="switchUserAnswer('prev')"></el-button>
                      <el-button
                        size="mini"
                        class="view-button"
                        :disabled="currentRuleUserAnswer.length === 0"
                        @click="switchUserAnswer">
                        view
                      </el-button>
                      <el-button
                        type="text"
                        icon="el-icon-caret-right"
                        :disabled="
                          userAnswerIndex >= currentRuleUserAnswer.length - 1
                        "
                        @click="switchUserAnswer('next')"></el-button>
                      <span v-if="currentRuleUserAnswer.length > 0">
                        {{ userAnswerIndex + 1 }}/{{
                          currentRuleUserAnswer.length
                        }}
                      </span>
                    </div>
                  </div>
                  <div class="col">
                    <el-tooltip
                      effect="dark"
                      content="Delete all tags"
                      placement="top">
                      <el-button
                        type="danger"
                        size="mini"
                        :disabled="currentRuleUserAnswer.length === 0"
                        class="delete-tag-button"
                        @click="removeSchemaNodeBoxes">
                        Delete
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div class="details-item">
                <div class="item-row submit">
                  <el-button
                    size="mini"
                    class="button-hkex"
                    :disabled="isDisabledSubmitAnswer"
                    @click="submitAnswer">
                    Submit Answer
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <esg-special-review
            v-if="isEsgSpecialRule"
            :qid="qid"
            :rule="rule"
            :stock-code="fileMeta.stock_code"
            :rule-schema-path="ruleSchemaPath"
            :review-history="reviewHistoryLog"
            @clear-annotations="clearAnnotations"
            @render-annotations="renderAnnotations"
            @view-answer="viewAnswer"
            @view-ai-location-suggestion="
              ({ subRule, items }) => getPredictedAnswer(true, subRule, items)
            "
            @close-ai-location-suggestion-dialog="isShowLocalSuggestion = false"
            @after-submit-answer="afterSubmitEsgSpecialAnswer">
          </esg-special-review>
          <gml-special-review
            v-if="isGmlSpecialRule"
            ref="gmlSpecialReview"
            :qid="Number(qid)"
            :file-id="Number(currentFileId)"
            :file-type-option="fileTypeOption"
            :review-history-log="reviewHistoryLog"
            @clear-annotations="clearAnnotations"
            @render-annotations="renderAnnotations"
            @view-gml-answer="viewGmlAnswer"
            @switch-file="switchFile"
            @close-ai-location-suggestion-dialog="isShowLocalSuggestion = false"
            @gml-ai-location-suggestion="viewGmlAILocationSuggestion"
            @reset-file="resetFile"
            @after-submit-answer="afterSubmitGmlSpecialAnswer">
          </gml-special-review>
        </template>
        <div v-else class="empty">
          <img src="@/images/empty.svg" />
          <p>No Data</p>
        </div>

        <remark-predict-position
          v-if="isShowPredictPosition"
          class="predicted-position-list"
          :answer-item-map="{}"
          answer-version=""
          :sub-rule="subRule"
          @view-gml-answer="viewGmlAnswer">
        </remark-predict-position>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import PdfViewer from './PdfViewer.vue';

import RemarkPredictPosition from '@/components/remark/FileRemarkPredictPosition';
import EventBus from '@/components/remark/remark-tree/EventBus';

import { fetchOutlines } from '@/store/api/detail.api.js';

import ReviewDataQuickEdit from './ReviewDataQuickEdit';
import ReportReviewHistoryLog from './ReportReviewHistoryLog';
import DownloadFileLoading from './DownloadFileLoading';
import ReportTypeMixin from '../mixins/ReportType.mixin';
import ReportReviewMixin from '../mixins/ReportReview.mixin';
import { getGroups, getRuleHistory } from '../../../store/api/hkex.group.api';
import {
  addFundraisingEventType,
  deleteFundraisingEventType,
} from '../../../store/api/hkex.question.api';
import { fetchRuleQid } from '../../../store/api/hkex.api';
import ListingRuleSelector from './ListingRuleSelector.vue';
import HistoricalRules from './HistoricalRules.vue';
import AgmAdditionalDataPopover from '../pages/agm/AdditionalDataPopover.vue';
import ArAdditionalDataPopover from '../pages/ar/AdditionalDataPopover.vue';
import EsgSpecialReview from '../pages/esg/SpecialReview.vue';
import GmlSpecialReview from '../pages/poll/SpecialReview.vue';
import SignificantInvestmentRatio from './SignificantInvestmentRatio';
import { ruleMergeTypeInfo, GML_SPECIAL_RULE } from '@/store/constants';
import { checkUnsubmitAnswer } from '../common/utils';

const ANSWER_TYPE = {
  PRESET: 'preset_answer',
  USER: 'user_answer',
};

export default {
  name: 'annual-report-review-details',
  components: {
    RemarkPredictPosition,
    PdfViewer,
    ReviewDataQuickEdit,
    ReportReviewHistoryLog,
    DownloadFileLoading,
    ListingRuleSelector,
    HistoricalRules,
    AgmAdditionalDataPopover,
    ArAdditionalDataPopover,
    EsgSpecialReview,
    SignificantInvestmentRatio,
    GmlSpecialReview,
  },
  props: {
    pdfAsideWidth: {
      type: String,
      required: false,
      default: '50%',
    },
    currentFileId: {
      type: Number,
      required: false,
      default: 0,
    },
    isSelectChangePdf: {
      type: Boolean,
      required: false,
      default: false,
    },
    fileTypeOption: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  mixins: [ReportTypeMixin, ReportReviewMixin],
  data() {
    return {
      currentFrames: [],
      answers: [],
      answerType: ANSWER_TYPE.USER,
      presetAnswerIndex: 0,
      userAnswerIndex: 0,
      disclosureValue: '',
      complianceValue: '',
      reasonSelectValue: '',
      isShowLocalSuggestion: false,
      groups: [],
      rules: [],
      ruleQids: {},
      originalRuleDetails: {},
      ruleDetails: {},
      groupIndex: 0,
      subRuleIndex: 0,
      questionMetaData: [],
      loading: false,
      DRuleDisclosureValueSelected: '',
      ruleSchemaPath: '',

      DISCLOSURE: 'disclosure',
      NO_DISCLOSURE: 'no disclosure',
      Query: 'query',
      POSITIVE_STATEMENT: 'positive statement',
      NEGATIVE_STATEMENT: 'negative statement',
      EXPLAIN: 'explain',
      COMPLY: 'comply',
      COMPLIANCE: 'compliance',
      NON_COMPLIANCE: 'potential non-compliance',
      NOT_APPLICABLE: 'not applicable',
      YES: 'Yes',
      NO: 'No',
      NA: 'N/A',

      showAddFundraisingEventTypeDialog: false,
      addFundraisingEventTypeForm: {
        name: '',
      },
      addFundraisingEventTypeFormRules: {
        name: [{ required: true, message: 'Please select a type' }],
      },
      fundraisingEventТуреDeletable: false,
      addFundraisingEventTypeLoading: false,
      showUserAnswerInvalidError: false,
      significantInvestmentRatios: [],

      subRule: '',
      currentEsgSpecialRuleAnswer: null,
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType', 'isDelisted']),
    ...mapGetters('hkexModule/reportReviewModule', [
      'fileMeta',
      'ruleMergeData',
      'ruleHistoryList',
    ]),
    ...mapGetters('remarkModule', [
      'predictPosition',
      'predictPrecisePosition',
    ]),
    ...mapGetters(['loginUser', 'configuration']),
    qid() {
      if (this.isEsgReport) {
        return this.ruleQids[this.rule];
      }
      return this.$route.params.qid;
    },
    fileId() {
      return Number(this.$route.query.fileId);
    },
    rule() {
      return this.$route.query.rule || '';
    },
    ruleAlias() {
      const rule = this.rules.find((rule) => rule.rule === this.rule);
      return this.getRuleAlias(rule);
    },
    allRules() {
      const allRules = [];
      this.groups.forEach((group) => {
        group.children.forEach((subGroup) => {
          allRules.push(...subGroup.rules);
        });
      });
      return _.uniqBy(allRules, 'id');
    },
    isEsgSpecialRule() {
      return (
        this.isEsgReport &&
        [
          'E6-Source of scenarios',
          'E8-Categories of scope 3 emissions',
          'E9-Scope 3 emissions data by categories',
        ].includes(this.rule)
      );
    },
    isGmlSpecialRule() {
      return this.isPollReport && this.isGmlRule;
    },
    eventTypeClassName() {
      return (group) => {
        return group.group_name === 'No Event' &&
          this.ruleDetails.preset_answer.answer.length > 1
          ? 'no-event-deleted'
          : '';
      };
    },
    fundraisingEventTypes() {
      return this.configuration.b1_b7_event_types;
    },
    fundraisingEventTypeCopyToRules() {
      let copyToRules = [];
      if (this.rule.startsWith('B')) {
        copyToRules = [
          'B1',
          'B2',
          'B3',
          'B4',
          'B5',
          'B6',
          'B7',
          'B8',
          'B9',
          'B10',
        ].filter((rule) => rule !== this.rule);
      } else if (this.rule.startsWith('C')) {
        copyToRules = ['C1.1.1', 'C1.2.1', 'C1.3'].filter(
          (rule) => rule !== this.rule,
        );
      }
      return this.allRules.filter((rule) => copyToRules.includes(rule.rule));
    },
    isShowPredictPosition() {
      if (this.isGmlSpecialRule) {
        return (
          !_.isEmpty(this.predictPosition.result) && this.isShowLocalSuggestion
        );
      }
      return (
        this.predictPosition.result.length > 0 && this.isShowLocalSuggestion
      );
    },
    currentRuleUserAnswerGroup() {
      return this.ruleDetails.user_answer?.answer[this.groupIndex];
    },
    currentRulePresetAnswerGroup() {
      return this.ruleDetails.preset_answer?.answer[this.groupIndex];
    },
    currentRuleUserAnswerGroupSubRule() {
      return (
        this.currentRuleUserAnswerGroup?.items[this.subRuleIndex] || {
          data: [],
          schema: {},
        }
      );
    },
    showDeleteFundraisingEventTypeIconsDisabled() {
      return !this.ruleDetails.preset_answer.answer.some(
        (answer) => answer.group_id,
      );
    },
    currentRulePresetAnswer() {
      let frames = [];
      if (this.ruleDetails.preset_answer) {
        frames =
          this.ruleDetails.preset_answer.answer[this.groupIndex].items[
            this.subRuleIndex
          ].data;
      }
      return frames;
    },
    currentRuleUserAnswer() {
      return this.ruleDetails.user_answer
        ? this.currentRuleUserAnswerGroupSubRule.data
        : [];
    },
    currentRuleUserAnswerSchema() {
      return this.currentRuleUserAnswerGroupSubRule.schema.data || { type: '' };
    },
    currentRuleAnswer() {
      let answerData = null;
      if (this.isEsgSpecialRule) {
        return this.currentEsgSpecialRuleAnswer;
      }
      if (this.answerType === ANSWER_TYPE.USER) {
        answerData = this.currentRuleUserAnswer[this.userAnswerIndex];
      } else {
        answerData = this.currentRulePresetAnswer[this.presetAnswerIndex];
      }
      return answerData;
    },
    isDisabledSubmitAnswer() {
      return (
        !this.$isAllowed('remarkOrInspect') || this.submitAnswerButtonDisabled
      );
    },
    showComplianceSections() {
      return !this.ruleDetails.no_compliance;
    },
    showFundraisingAdditionalData() {
      return this.ruleDetails.can_add_group;
    },
    showNDDRAdditionalData() {
      return this.rule === 'C1';
    },
    showSignificantInvestmentRatio() {
      return this.ruleDetails.ratio4;
    },
    isShowAdditionalDocumentsButton() {
      if (this.ruleDetails.can_add_group) {
        return false;
      }
      return (
        this.isArReport &&
        !this.getRuleType('D') &&
        this.ruleMergeData.type !== ruleMergeTypeInfo.notSupport
      );
    },
    isShowComplianceAssessment() {
      return (
        ((this.isArReport && !this.getRuleType('D')) ||
          this.isAgmReport ||
          this.isPollReport) &&
        this.showComplianceSections
      );
    },
    showAILocationSuggestion() {
      return !this.currentRulePresetAnswerGroup?.group_id;
    },
    isRuleMergeHasData() {
      return this.ruleMergeData.type !== ruleMergeTypeInfo.noInfomation;
    },
    currentRuleHistoryData() {
      return this.ruleHistoryList.find((list) => {
        return _.isEqual(list.rule, this.rule);
      });
    },
    currentRuleHistoryParticularYear() {
      let complianceYear = [];
      let notComplianceYear = [];
      if (this.currentRuleHistoryData) {
        _.forEach(this.currentRuleHistoryData.records, (record) => {
          _.forEach(record, (isCompliance, year) => {
            if (isCompliance) {
              complianceYear.push(year);
            } else {
              notComplianceYear.push(year);
            }
          });
        });
      }
      return {
        complianceYear: complianceYear,
        notComplianceYear: notComplianceYear,
      };
    },
    disclosureAISuggestionValue() {
      if (this.ruleDetails.preset_answer) {
        const presetAnswer = this.ruleDetails.preset_answer.answer;
        if (presetAnswer) {
          const value =
            presetAnswer[this.groupIndex].items[this.subRuleIndex].value;
          if (this.showDisclosureSelect) {
            return value;
          }
          return value ? value.toLowerCase() : '';
        }
        return '';
      }
      return '';
    },
    complianceAISuggestionValue() {
      if (this.ruleDetails.preset_answer) {
        const presetAnswer = this.ruleDetails.preset_answer.rule_result;
        if (presetAnswer) {
          return presetAnswer.value ? presetAnswer.value.toLowerCase() : '';
        }
        return '';
      }
      return '';
    },
    DRuleDisclosureValues() {
      const schemaType = this.currentRuleUserAnswerSchema.type;
      const currentSchemaType = this.ruleDetails.schema.schema_types.find(
        (type) => type.label === schemaType,
      );
      if (currentSchemaType) {
        return currentSchemaType.values.slice(
          0,
          currentSchemaType.values.length - 2,
        );
      }
      return [];
    },
    showDisclosureSelect() {
      return this.getRuleType('D') && this.DRuleDisclosureValues.length > 3;
    },
    showDruleDisclosureText() {
      return !['Negative Statement', 'No Disclosure'].includes(
        this.disclosureAISuggestionValue,
      );
    },
    disclosureTitle() {
      if (this.getRuleType('A') || this.getRuleType('D')) {
        return 'Disclosure';
      }
      return 'Positive Statement';
    },
    disclosureBehindText() {
      if (this.isArReport || this.isAgmReport || this.isPollReport) {
        return 'Location';
      }
      return 'Classification';
    },
    currentRuleSchema() {
      if (this.ruleDetails.schema) {
        return this.ruleDetails.schema.schemas[0].schema[this.rule];
      }
      return {};
    },
    showDisclosureLocation() {
      return this.disclosureLocationOptions.length > 0;
    },
    supportReviewDataQuickEdit() {
      return (
        this.isArReport &&
        this.ruleDetails.preset_answer.answer[this.groupIndex].items.length > 1
      );
    },
    disclosureLocationOptions() {
      if (this.isArReport || this.isAgmReport || this.isPollReport) {
        if (this.currentRuleUserAnswerSchema.type === 'Y/N/NA') {
          return [
            {
              label: 'Yes',
              value: this.YES,
            },
            {
              label: 'No',
              value: this.NO,
            },
            {
              label: 'N/A',
              value: this.NA,
            },
          ];
        }
        return [
          {
            label: this.disclosureTitle,
            value: this.DISCLOSURE_VALUE_1,
          },
          {
            label: 'Negative Statement',
            value: this.DISCLOSURE_VALUE_2,
          },
          {
            label: 'No Disclosure',
            value: this.DISCLOSURE_VALUE_3,
          },
        ];
      } else {
        switch (this.currentRuleSchema?.type) {
          case 'E/Y/ND':
            return [
              {
                label: 'Explain',
                value: this.DISCLOSURE_VALUE_1,
              },
              {
                label: 'Comply',
                value: this.DISCLOSURE_VALUE_2,
              },
              {
                label: 'No Disclosure',
                value: this.DISCLOSURE_VALUE_3,
              },
            ];
          case 'Y/ND':
            return [
              {
                label: 'Comply',
                value: this.DISCLOSURE_VALUE_2,
              },
              {
                label: 'No Disclosure',
                value: this.DISCLOSURE_VALUE_3,
              },
            ];
          case 'Y/ND/Q':
            return [
              {
                label: 'Comply',
                value: this.DISCLOSURE_VALUE_2,
              },
              {
                label: 'No Disclosure',
                value: this.DISCLOSURE_VALUE_3,
              },
              {
                label: 'Query',
                value: this.Query,
              },
            ];
          case 'C,ND,N/A':
            return [
              {
                label: 'Comply',
                value: this.DISCLOSURE_VALUE_2,
              },
              {
                label: 'No Disclosure',
                value: this.DISCLOSURE_VALUE_3,
              },
              {
                label: 'Not Applicable',
                value: this.NOT_APPLICABLE,
              },
            ];
          default:
            return [];
        }
      }
    },
    complianceAssessmentOptions() {
      return ['Compliance', 'Non-Compliance'];
    },
    DISCLOSURE_VALUE_1() {
      if (this.isArReport) {
        if (this.getRuleType('A') || this.getRuleType('D')) {
          return this.DISCLOSURE;
        }
        return this.POSITIVE_STATEMENT;
      }
      if (this.isAgmReport || this.isPollReport) {
        return this.POSITIVE_STATEMENT;
      }
      return this.EXPLAIN;
    },
    DISCLOSURE_VALUE_2() {
      if (this.isArReport || this.isAgmReport || this.isPollReport) {
        return this.NEGATIVE_STATEMENT;
      }
      return this.COMPLY;
    },
    DISCLOSURE_VALUE_3() {
      return this.NO_DISCLOSURE;
    },
    isGmlRule() {
      return this.rule === GML_SPECIAL_RULE;
    },
  },
  watch: {
    $route(value, prevValue) {
      const {
        query: { rule, fileId },
        params: { qid },
      } = value;
      const {
        query: { rule: prevRule, fileId: preFileId },
        params: { qid: preQid },
      } = prevValue;

      const needUpdateFile = fileId !== preFileId;
      const needUpdateRule = needUpdateFile || rule !== prevRule;
      const needUpdateQuestionMetaData = qid !== preQid;
      const needUpdateGroups = qid !== preQid;

      this.init({
        needUpdateRule,
        needUpdateFile,
        needUpdateQuestionMetaData,
        needUpdateGroups,
      });
    },
    'ruleDetails.user_answer': {
      deep: true,
      handler() {
        this.$store.commit(
          'hkexModule/SET_HAS_UNSUBMIT_CHANGE',
          this.checkHasUserAnswerChanged(),
        );
      },
    },
    'fileMeta.stock_code': {
      handler() {
        this.fetchRuleHistory();
      },
    },
    dataReady() {
      if (this.dataReady && this.documentReady) {
        this.showFirstAnswerLocation();
      }
    },
    documentReady() {
      if (this.dataReady && this.documentReady) {
        this.showFirstAnswerLocation();
      }
      if (this.viewAnswerData && this.documentReady) {
        if (this.isGmlRule) {
          this.viewGmlAnswer({ data: this.viewAnswerData });
        } else {
          this.viewAnswer(this.viewAnswerData);
        }
        this.viewAnswerData = null;
      }
      setTimeout(() => {
        this.$emit('clear-pdf-status');
      }, 500);
    },
    async currentFileId() {
      this.switchFile(this.currentFileId);
    },
  },
  async created() {
    EventBus.$on('predict-position-item', this.showPredictPosition);
    document.addEventListener('click', this.documentClickHandler);
    this.init();
  },
  beforeDestroy() {
    this.closePredictPosition();
    EventBus.$off('predict-position-item', this.showPredictPosition);
    document.removeEventListener('click', this.documentClickHandler);
  },
  methods: {
    async init(
      params = {
        needUpdateRule: true,
        needUpdateFile: true,
        needUpdateQuestionMetaData: true,
        needUpdateGroups: true,
      },
    ) {
      try {
        this.closePredictPosition();
        this.resetRuleDetails();

        if (this.isEsgReport) {
          await this.getQidByFid();
        }

        if (params.needUpdateFile) {
          this.switchFile(this.fileId);
        }

        const loadDataTasks = [];

        if (params.needUpdateGroups) {
          loadDataTasks.push(this.fetchGroups());
        }

        if (params.needUpdateRule) {
          if (!this.isGmlRule) {
            loadDataTasks.push(
              this.fetchRuleDetails(),
              this.getReportReviewHistoryLog(this.rule),
              this.fetchRuleHistory(),
            );
          } else {
            loadDataTasks.push(
              this.getReportReviewHistoryLog(this.rule),
              this.fetchRuleHistory(),
            );
          }
        }

        if (params.needUpdateQuestionMetaData) {
          loadDataTasks.push(this.fetchQuestionMetaData());
        }

        await Promise.all(loadDataTasks);

        if (!this.isGmlRule) {
          this.initRuleDetails();
        }

        if (this.isArReport || this.isCgReport) {
          await this.getRuleMergeDetailData();
        }

        this.onDataReady();
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async fetchGroups(setGroups = true) {
      try {
        this.loading = true;
        const data = await getGroups({
          rule_type: this.auditType,
          only_enabled: true,
          file_id: this.fileId,
        });
        if (setGroups) {
          this.groups = data;
        }
        return data;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    getRulesFromGroupsTree(tree) {
      const rules = [];
      tree.forEach((t) => {
        t.children.forEach(function getRules(child) {
          child.rules.map((rule) => {
            rule.parent_id = child.id;
          });
          rules.push(...child.rules);
          if (child.children) {
            child.children.forEach(getRules);
          }
        });
      });
      return rules;
    },
    setRules(rules) {
      this.rules = rules;
      if (rules.length === 0) {
        return;
      }
      if (!rules.find((rule) => rule.rule === this.rule)) {
        this.$emit('rule-changed', rules[0].rule);
      }
      this.$nextTick(() => {
        const activeRuleEl = this.$refs.ruleList.querySelector(
          '.rule-list-item.active',
        );
        if (activeRuleEl) {
          activeRuleEl.scrollIntoView({ block: 'center' });
        }
      });
    },
    async fetchRuleDetails() {
      const res = await this.$store.dispatch(
        'hkexModule/reportReviewModule/fetchRuleDetails',
        {
          rule: this.rule,
          qid: this.qid,
          delist: this.isDelisted ? 1 : 0,
        },
      );
      this.addManualProperty(res.user_answer);
      this.originalRuleDetails = _.cloneDeep(res);
      this.ruleDetails = res;
      this.ruleSchemaPath = this.getSchemaPath();
    },
    async fetchRuleHistory() {
      if (this.fileMeta.stock_code) {
        const data = await getRuleHistory(this.rule, {
          stock_code: this.fileMeta.stock_code,
        });
        this.ruleHistory = data;
      }
    },
    async fetchQuestionMetaData() {
      const res = await this.$store.dispatch(
        'hkexModule/reportReviewModule/fetchQuestionMetaData',
        {
          qid: this.$route.params.qid,
          dt: this.auditType,
        },
      );
      this.questionMetaData = res;
    },
    async getQidByFid() {
      try {
        const res = await fetchRuleQid(this.fileId);
        this.ruleQids = res;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    initRuleDetails() {
      const currentAnswer = this.currentRuleUserAnswerGroupSubRule;
      const currentRuleResult = this.ruleDetails.user_answer.rule_result;
      this.disclosureValue = currentAnswer.value
        ? currentAnswer.value.toLowerCase()
        : '';
      this.complianceValue = currentRuleResult.value
        ? currentRuleResult.value.toLowerCase()
        : '';
      this.DRuleDisclosureValueSelected = currentAnswer.value;
      this.resetDRuleDisclosureValueSelected();
      this.currentFrames = currentAnswer.data || [];
    },
    resetDRuleDisclosureValueSelected() {
      if (
        [this.NO_DISCLOSURE, this.NEGATIVE_STATEMENT].includes(
          this.disclosureValue,
        )
      ) {
        this.DRuleDisclosureValueSelected = '';
      }
    },
    addManualProperty(data) {
      for (let i = 0; i < data.answer.length; i++) {
        const newAnswerItem = {};
        Object.assign(newAnswerItem, { manual: false }, data.answer[i]);
        data.answer[i] = newAnswerItem;
      }
      const newRuleResultItem = {};
      Object.assign(newRuleResultItem, { manual: false }, data.rule_result);
      data.rule_result = newRuleResultItem;
    },
    async changeRuleAnswerGroup(index) {
      this.groupIndex = index;
      this.changeSubRuleTabs(0);
    },
    async changeSubRuleTabs(index) {
      this.subRuleIndex = index;
      this.userAnswerIndex = 0;
      this.presetAnswerIndex = 0;
      this.initRuleDetails();
      this.showFirstAnswerLocation();
    },
    checkComplianceDetail() {
      if (this.ruleMergeData.type === ruleMergeTypeInfo.noInfomation) {
        this.$notify({
          title: 'Warning',
          message: 'No additional documents were found',
          type: 'warning',
        });
        return;
      }
      let complianceURL = this.$router.resolve({
        name: 'additionalDocuments',
        query: {
          stockCode: this.fileMeta.stock_code,
          reportYear: this.fileMeta.report_year,
          rule: this.rule,
          yearEnd: this.fileMeta.year_end.replace(/\s/g, ''),
        },
      });
      window.open(complianceURL.href, '_blank');
    },
    switchUserAnswer(direction) {
      this.clearAnnotations();

      this.answerType = ANSWER_TYPE.USER;
      if (direction === 'prev') {
        this.userAnswerIndex--;
      } else if (direction === 'next') {
        this.userAnswerIndex++;
      } else {
        this.userAnswerIndex = 0;
      }

      const userAnswerData = this.currentRuleUserAnswer[this.userAnswerIndex];
      const boxesData = {
        boxes: userAnswerData.boxes,
        tags: ['Manual', this.ruleAlias],
        type: userAnswerData.handleType,
      };

      this.jumpToAnswerData(boxesData);
    },
    switchPresetAnswer(direction) {
      this.clearAnnotations();

      this.answerType = ANSWER_TYPE.PRESET;
      if (direction === 'prev') {
        this.presetAnswerIndex--;
      } else if (direction === 'next') {
        this.presetAnswerIndex++;
      } else {
        this.presetAnswerIndex = 0;
      }
      const currentAIPresetData = {
        ...this.currentRulePresetAnswer[this.presetAnswerIndex],
        tags: ['AI Answers', this.ruleAlias],
        type: 'wireframe',
      };

      this.jumpToAnswerData(currentAIPresetData);
    },
    async createAnswer(boxData) {
      try {
        this.loading = true;

        const boxes = await this.getAnnotationBoxData(
          boxData,
          this.currentFileId || this.fileId,
        );
        const boxesData = {
          boxes,
          handleType: 'wireframe',
          value: this.disclosureValue,
        };

        if (this.isEsgSpecialRule || this.isGmlSpecialRule) {
          EventBus.$emit('create-answer', boxes);
          return;
        }
        const subRule =
          this.ruleDetails.user_answer.answer[this.groupIndex].items[
            this.subRuleIndex
          ];
        subRule.data.push(boxesData);
        subRule.manual = true;

        this.userAnswerIndex = this.currentRuleUserAnswer.length - 1;
        this.refreshAnnotations();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.deleteDrawedAnnotation();
        this.loading = false;
      }
    },
    refreshAnnotations() {
      this.clearAnnotations();

      const currentPageNumber = this.getCurrentPageNumber();
      const annotations = [];
      if (
        this.currentAnnotationMode === 'table' &&
        this.pageElements[currentPageNumber]
      ) {
        annotations.push(...this.pageElements[currentPageNumber]);
      }

      const userAnswerData = this.currentRuleUserAnswer[this.userAnswerIndex];
      if (userAnswerData) {
        annotations.push({
          boxes: userAnswerData.boxes,
          tags: ['Manual', this.ruleAlias],
          type: userAnswerData.handleType,
        });
      }

      this.renderAnnotations(annotations);
    },
    onAnnotationDeleted(annotation) {
      this.currentFrames.forEach((item, index) => {
        item.boxes.forEach((box) => {
          let boxObj = {
            box: box.box,
            page: box.page,
          };
          if (_.isEqual(boxObj, annotation[0])) {
            this.currentFrames.splice(index, 1);
            return false;
          }
        });
      });
      this.refreshAnnotations();
    },
    async showFirstAnswerLocation() {
      if (this.isEsgSpecialRule || this.isGmlRule) {
        return;
      }
      if (this.currentFrames.length > 0) {
        this.answerType = ANSWER_TYPE.USER;
        this.switchUserAnswer();
        return;
      }
      this.answerType = ANSWER_TYPE.PRESET;
      this.showFirstAILocation();
    },
    async showFirstAILocation() {
      if (this.currentRulePresetAnswerGroup.group_id) {
        this.clearAnnotations();
        return;
      }
      if (this.disclosureAISuggestionValue !== this.NO_DISCLOSURE) {
        let boxes = [];
        const subRulePresetAnswer =
          this.currentRulePresetAnswerGroup.items[this.subRuleIndex];
        if (subRulePresetAnswer.data.length > 0) {
          boxes = subRulePresetAnswer.data[0].boxes;
        } else {
          await this.getPredictedAnswer();
          if (this.predictPosition.result.length === 0) {
            return;
          }
          boxes = this.predictPosition.result[0].outlines.map((item) => {
            let box = {
              box_left: item[0],
              box_top: item[1],
              box_right: item[2],
              box_bottom: item[3],
            };
            return {
              box,
              page: this.predictPosition.result[0].page,
            };
          });
        }
        const frame = {
          boxes,
          tags: ['AI Answers', this.ruleAlias],
          type: 'wireframe',
        };
        this.showPredictPosition(frame);
      } else {
        this.clearAnnotations();
      }
      this.closePredictPosition();
    },
    async changeRule(value) {
      if (this.rule === value) {
        return;
      }
      if (checkUnsubmitAnswer()) {
        return;
      }
      this.ruleHistory = {
        review: {},
        history: [],
      };
      this.ruleDetails = {};
      this.originalRuleDetails = {};

      this.$emit('rule-changed', value);
      this.updateRuleInfo();
    },
    async updateRuleInfo() {
      try {
        const res = await this.fetchGroups(false);
        const allRules = this.getRulesFromGroupsTree(res);
        allRules.forEach((node) => {
          const rule = this.rules.find(
            (rule) => rule.id === node.id && rule.parent_id === node.parent_id,
          );
          if (rule) {
            rule.label = node.label;
            rule.color = node.color;
          }
        });
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    resetRuleDetails() {
      this.dataReady = false;
      this.currentFrames = [];
      this.disclosureValue = '';
      this.complianceValue = '';
      this.presetAnswerIndex = 0;
      this.userAnswerIndex = 0;
      this.groupIndex = 0;
      this.subRuleIndex = 0;
      this.deleteDrawedAnnotation();
      this.clearAnnotations();
    },
    checkHasUserAnswerChanged() {
      return !_.isEqual(
        this.originalRuleDetails.user_answer,
        this.ruleDetails.user_answer,
      );
    },
    checkUserAnswerIsInvalid(item) {
      let invalid = false;
      if (item) {
        const value = item.value.toLowerCase();
        invalid =
          (value !== this.NO_DISCLOSURE && item.data.length === 0) ||
          (value === this.NO_DISCLOSURE && item.data.length > 0) ||
          value === '';
      } else {
        invalid = this.ruleDetails.user_answer.rule_result.value === '';
      }
      return invalid;
    },
    getUserAnswerInvalidClassName(item) {
      return this.showUserAnswerInvalidError &&
        this.checkUserAnswerIsInvalid(item)
        ? 'error'
        : '';
    },
    checkSubmitAnswerInvalid() {
      const userAnswer = this.ruleDetails.user_answer;
      for (let i = 0; i < userAnswer.answer.length; i++) {
        const answer = userAnswer.answer[i];
        if (answer.items.length <= 1) {
          return false;
        }
        for (let j = 0; j < answer.items.length; j++) {
          const item = answer.items[j];
          const invalid =
            userAnswer.rule_result.value === '' ||
            this.checkUserAnswerIsInvalid(item);
          if (invalid) {
            return true;
          }
        }
      }
      return false;
    },
    async submitAnswer({ notifyMessage }) {
      if (!this.checkHasUserAnswerChanged()) {
        this.$notify({
          title: 'Warning',
          message: 'No manual answers can not be submitted.',
          type: 'warning',
        });
        return;
      }

      if (this.isArReport && this.checkSubmitAnswerInvalid()) {
        const confirm = await this.$confirm(
          `Highlighted means: <br>
          (i) missing disclosure location / compliance assessment<br>
          (ii) no data tagged for "PS/NS"<br>
          and/or (iii) there is tagged data for "ND"`,
          'Warning',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'Submit Anyway',
            cancelButtonText: 'Cancel',
          },
        ).catch(() => {});
        if (!confirm) {
          this.showUserAnswerInvalidError = true;
          return;
        }
        if (confirm === 'confirm') {
          await this.sendSubmitAnswerRequest(true, notifyMessage);
        }
        return;
      }
      await this.sendSubmitAnswerRequest(true, notifyMessage);
    },
    async sendSubmitAnswerRequest(shouldRefetchRule = true, notifyMessage) {
      try {
        const answer = this.clearAnswerBoxTexts(
          this.ruleDetails.user_answer.answer,
        );
        const data = {
          answer: answer,
          rule_result: this.ruleDetails.user_answer.rule_result,
        };
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/saveRuleDetails',
          {
            rule: this.rule,
            qid: this.qid,
            data,
          },
        );
        this.$notify({
          title: 'Success',
          message: notifyMessage || 'Saved the answer successfully.',
          type: 'success',
        });

        this.showUserAnswerInvalidError = false;

        if (shouldRefetchRule) {
          this.getReportReviewHistoryLog(this.rule);
          await Promise.all([this.fetchRuleDetails(), this.updateRuleInfo()]);
          this.initRuleDetails();
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
        if (error.status_code === 409) {
          this.changeRuleAnswerGroup(0);
          this.fetchRuleDetails();
        }
      }
    },
    async removeSchemaNodeBoxes() {
      const result = await this.$confirm(
        'Are you sure you want to delete all annotations of the current rule?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      ).catch(() => {});
      if (result === 'confirm') {
        this.ruleDetails.user_answer.answer[this.groupIndex].items[
          this.subRuleIndex
        ].data = [];
        this.refreshAnnotations();
      }
    },
    changeEnumDisclosureValue(value) {
      this.disclosureValue =
        this.disclosureValue.toLowerCase() === value.toLowerCase() ? '' : value;

      const userAnswer =
        this.ruleDetails.user_answer.answer[this.groupIndex].items[
          this.subRuleIndex
        ];
      const userAnswerOriginal =
        this.originalRuleDetails.user_answer.answer[this.groupIndex].items[
          this.subRuleIndex
        ];

      userAnswer.value = this.disclosureValue;
      if (!userAnswerOriginal.manual) {
        if (userAnswer.value !== userAnswerOriginal.value) {
          userAnswer.manual = true;
        } else {
          if (userAnswerOriginal.manual === undefined) {
            delete userAnswer.manual;
          } else {
            userAnswer.manual = false;
          }
        }
      }

      this.resetDRuleDisclosureValueSelected();
    },
    changeEnumComplianceValue(value) {
      this.complianceValue = this.complianceValue === value ? '' : value;

      const userAnswer = this.ruleDetails.user_answer.rule_result;
      const userAnswerOriginal =
        this.originalRuleDetails.user_answer.rule_result;

      userAnswer.value = this.complianceValue;
      if (!userAnswerOriginal.manual) {
        if (userAnswer.value !== userAnswerOriginal.value) {
          userAnswer.manual = true;
        } else {
          if (userAnswerOriginal.manual === undefined) {
            delete userAnswer.manual;
          } else {
            userAnswer.manual = false;
          }
        }
      }
    },
    async getRuleMergeDetailData() {
      if (!this.rule) {
        return;
      }
      await this.$store.dispatch(
        'hkexModule/reportReviewModule/getRuleMergeDetailData',
        {
          stockCode: this.fileMeta.stock_code,
          reportYear: this.fileMeta.report_year,
          rule: this.rule,
          yearEnd: this.fileMeta.year_end.replace(/\s/g, ''),
        },
      );
    },
    async getPredictedAnswer(isShowPrompt, subRule, items) {
      try {
        let currentQuestionMeta = {};
        if (this.isArReport) {
          currentQuestionMeta = this.questionMetaData.find((item) =>
            this.getRuleType(item.mold_prefix),
          );
        } else {
          currentQuestionMeta = this.questionMetaData[0];
        }

        let qid = null;
        if (this.isEsgReport) {
          qid = this.ruleQids[this.rule];
        } else {
          qid = currentQuestionMeta?.question_id || null;
        }

        if (!qid) {
          return;
        }
        const data = {
          fileId: this.fileId,
          label: this.ruleAlias,
          key: this.getSchemaPath(),
          qid,
          subRule,
        };
        await this.$store.dispatch('remarkModule/predictPosition', data);

        const presetPreciseAnswer = _.cloneDeep(
          this.currentRulePresetAnswerGroup.items[this.subRuleIndex],
        );
        if (subRule && this.isEsgSpecialRule) {
          presetPreciseAnswer.data = items;
        }
        this.subRule = subRule;
        this.$store.commit(
          'remarkModule/SET_PREDICT_PRECISE_POSITION',
          presetPreciseAnswer,
        );
        this.isShowLocalSuggestion = !!isShowPrompt;
        if (this.predictPosition.result.length === 0 && isShowPrompt) {
          this.$notify({
            title: 'Info',
            message: 'No predict result',
            type: 'info',
          });
        }
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async viewGmlAILocationSuggestion({ rule, subRule, item }) {
      const data = {
        label: this.ruleAlias,
        key: '',
        qid: this.qid,
        subRule: rule,
        ruleKey: subRule,
        isGml: true,
      };

      await this.$store.dispatch('remarkModule/predictPosition', data);

      const presetPreciseAnswer = {};
      if (rule && item) {
        presetPreciseAnswer.data = item.data;
        presetPreciseAnswer.fid = item.fid;
      }
      this.subRule = rule;
      this.$store.commit(
        'remarkModule/SET_PREDICT_PRECISE_POSITION',
        presetPreciseAnswer,
      );
      this.isShowLocalSuggestion = true;
    },
    async showPredictPosition(frame) {
      this.clearAnnotations();
      this.jumpToAnswerData(frame);
    },
    closePredictPosition() {
      this.$store.commit('remarkModule/SET_PREDICT_POSITION', []);
      this.$store.commit('remarkModule/SET_PREDICT_LABEL', '');
    },
    getSchemaPath() {
      const key = JSON.parse(this.currentRuleUserAnswerGroupSubRule.key).map(
        (item) => item.split(':')[0],
      );
      const path = key.join('|');
      return path;
    },
    getRuleType(prefix) {
      return this.rule.startsWith(prefix);
    },
    async fetchTableElements(page) {
      try {
        const res = await fetchOutlines(this.fileId, page);
        return res.data;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    getNCClassName(rule) {
      if (!rule.user_answer) {
        return '';
      }
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
    openFundraisingActivity() {
      const { href } = this.$router.resolve({
        name: 'fundraisingActivity',
        query: {
          qid: this.qid,
          rule: this.rule,
          stockCode: this.fileMeta.stock_code,
          financialYear: this.fileMeta.report_year,
        },
      });
      window.open(href, '_blank');
    },
    openAddFundraisingEventTypeDialog() {
      this.showAddFundraisingEventTypeDialog = true;
    },
    closeAddFundraisingEventTypeDialog() {
      this.showAddFundraisingEventTypeDialog = false;
      this.addFundraisingEventTypeForm.name = '';
    },
    async addFundraisingEventType() {
      const valid = await this.$refs.addFundraisingEventTypeForm
        .validate()
        .catch(() => {});
      if (!valid) {
        return;
      }
      try {
        this.addFundraisingEventTypeLoading = true;
        const res = await addFundraisingEventType(this.qid, this.rule, {
          group_name: this.addFundraisingEventTypeForm.name,
        });
        this.closeAddFundraisingEventTypeDialog();
        this.$notify({
          title: 'Success',
          message: res.message,
          type: 'success',
        });
        this.fetchRuleDetails();
        this.getReportReviewHistoryLog(this.rule);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.addFundraisingEventTypeLoading = false;
      }
    },
    showDeleteFundraisingEventTypeIcons() {
      this.fundraisingEventТуреDeletable = !this.fundraisingEventТуреDeletable;
    },
    hideDeleteFundraisingEventTypeIcons() {
      if (this.fundraisingEventТуреDeletable) {
        this.fundraisingEventТуреDeletable = false;
      }
    },
    documentClickHandler() {
      this.hideDeleteFundraisingEventTypeIcons();
    },
    cancelToDeleteFundraisingEventType() {
      this.fundraisingEventТуреDeletable = false;
    },
    async openDeleteFundraisingEventTypeConfirm(groupId, index) {
      const confirm = await this.$confirm(
        'The "Delete" action will remove all manual records for all associated fundraising rules and the records cannot be recovered after deletion.',
        'Are you sure you want to permanently delete this event?',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          customClass: 'delete-type-confirm-message-box',
        },
      ).catch(() => {});
      if (confirm === 'confirm') {
        this.confirmToDeleteFundraisingEventType(groupId, index);
      }
    },
    async confirmToDeleteFundraisingEventType(groupId, index) {
      try {
        const res = await deleteFundraisingEventType(
          this.qid,
          this.rule,
          groupId,
        );
        this.$notify({
          title: 'Success',
          message: res.message,
          type: 'success',
        });
        this.fundraisingEventТуреDeletable = false;
        if (this.currentRulePresetAnswerGroup.group_id === groupId) {
          this.changeRuleAnswerGroup(0);
        }
        await this.fetchRuleDetails();
        if (this.groupIndex > index) {
          this.groupIndex -= 1;
          this.changeRuleAnswerGroup(this.groupIndex);
        }
        this.getReportReviewHistoryLog(this.rule);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
        if (error.status_code === 409) {
          this.changeRuleAnswerGroup(0);
          this.fetchRuleDetails();
        }
      }
    },
    async viewAnswer(data) {
      this.currentEsgSpecialRuleAnswer = data;
      const handler = () => {
        this.clearAnnotations();
        this.jumpToAnswerData(data);
      };
      if (!this.documentReady) {
        this.viewAnswerData = data;
      } else {
        handler();
      }
    },
    async viewGmlAnswer({ answer, data }) {
      if (answer) {
        if (answer.fid !== this.currentFileId) {
          this.$emit('change-current-file', { fid: answer.fid });
          await this.switchFile(answer.fid);
        }
      }
      const handler = () => {
        this.clearAnnotations();
        if (data) {
          this.jumpToAnswerData(data);
        }
      };

      if (!this.documentReady) {
        this.viewAnswerData = data;
      } else {
        handler();
      }
    },
    copyAnswer(type) {
      const presetAnswer =
        this.ruleDetails.preset_answer.answer[this.groupIndex];
      const userAnswer = this.ruleDetails.user_answer.answer[this.groupIndex];
      const presetAnswerRuleResult = this.ruleDetails.preset_answer.rule_result;
      const userAnswerRuleResult = this.ruleDetails.user_answer.rule_result;
      const currentSubRulePresetAnswer = presetAnswer.items[this.subRuleIndex];
      const currentSubRuleUserAnswer = userAnswer.items[this.subRuleIndex];

      switch (type) {
        case 'ALL': {
          userAnswerRuleResult.value = presetAnswerRuleResult.value;
          userAnswerRuleResult.manual = true;
          userAnswerRuleResult.special_ui = true;
          userAnswer.items.forEach((item, index) => {
            item.value = presetAnswer.items[index].value;
            item.data = presetAnswer.items[index].data;
            item.manual = true;
            item.special_ui = true;
          });

          if (
            presetAnswer.items.every(
              (item) => item.value === '' && item.data.length === 0,
            )
          ) {
            this.$notify({
              title: 'Notice',
              message: 'All attributes do not have copyable data.',
              type: 'info',
            });
          }

          break;
        }
        case 'CURRENT': {
          currentSubRuleUserAnswer.value = currentSubRulePresetAnswer.value;
          currentSubRuleUserAnswer.data = currentSubRulePresetAnswer.data;
          currentSubRuleUserAnswer.manual = true;
          currentSubRuleUserAnswer.special_ui = true;
          if (
            currentSubRulePresetAnswer.value === '' &&
            currentSubRulePresetAnswer.data.length === 0
          ) {
            this.$notify({
              title: 'Notice',
              message: 'The current attribute has no data that can be copied.',
              type: 'info',
            });
          }

          break;
        }
        case 'OTHERS': {
          userAnswer.items.forEach((item) => {
            item.value = currentSubRuleUserAnswer.value;
            item.data = currentSubRuleUserAnswer.data;
            item.manual = true;
            item.special_ui = true;
          });

          if (
            currentSubRuleUserAnswer.value === '' &&
            currentSubRuleUserAnswer.data.length === 0
          ) {
            this.$notify({
              title: 'Notice',
              message: 'The current attribute has no data that can be copied.',
              type: 'info',
            });
          }

          break;
        }
        default:
          break;
      }
      this.initRuleDetails();
    },
    async deleteAllAnswers() {
      const userAnswer = this.ruleDetails.user_answer.answer[this.groupIndex];

      if (
        this.ruleDetails.user_answer.rule_result.value === '' &&
        userAnswer.items.every(
          (item) => item.value === '' && item.data.length === 0,
        )
      ) {
        this.$notify({
          title: 'Notice',
          message: 'There is no data to delete.',
          type: 'info',
        });
        return;
      }

      const confirm = await this.$confirm(
        'The "Delete All at Once" operation will remove "Disclosure Location (if any)," "Compliance Assessment (if any)," and "Manual Tagged Information (if any)" manual records, and they cannot be recovered after deletion.',
        "Are you sure you want to proceed with the 'Delete All at Once' operation?",
        {
          customClass: 'delete-all-confirm-message-box',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      ).catch(() => {});
      if (confirm === 'confirm') {
        this.ruleDetails.user_answer.rule_result.value = '';
        userAnswer.items.forEach((item) => {
          item.value = '';
          item.data = [];
        });

        this.showUserAnswerInvalidError = false;
        await this.sendSubmitAnswerRequest(
          true,
          'Data has been deleted successfully.',
        );
      }
    },
    openNDDRPage() {
      const { href } = this.$router.resolve({
        name: 'nextDayDisclosureReturn',
        query: {
          stockCode: this.fileMeta.stock_code,
          reportYear: this.fileMeta.report_year,
        },
      });
      window.open(href, '_blank');
    },
    handleRatio4DataReady(data) {
      this.significantInvestmentRatios = data;
    },
    showRatio4Boxes(boxes) {
      this.clearAnnotations();
      const boxesData = {
        boxes: boxes,
        tags: ['AI Answers', this.ruleAlias],
        type: 'wireframe',
      };
      this.jumpToAnswerData(boxesData);
    },
    afterSubmitEsgSpecialAnswer() {
      this.fetchGroups();
      this.getReportReviewHistoryLog(this.rule);
    },
    afterSubmitGmlSpecialAnswer() {
      this.updateRuleInfo();
      this.getReportReviewHistoryLog(this.rule);
      this.fetchRuleHistory();
    },
    resetFile(index) {
      this.$emit('change-current-file', { index, fid: this.fileId });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../common/color.scss';
@import '../common/hkex-global.scss';
$--color-background: #f2f5f7;

.rule-merge-table-head-tooltip {
  z-index: 11111 !important;
}

.el-tooltip__popper.is-dark {
  z-index: 11111 !important;
}

.annual-report-checking-container {
  position: relative;
  display: flex;
  width: 100%;
  box-sizing: border-box;

  .el-aside {
    width: 50%;
  }

  ::v-deep .el-main {
    padding: 0;
  }

  .gutter-horizontal {
    margin-top: -60px;
  }

  .rule-details-wrapper {
    height: calc(100vh - 60px);
    overflow-y: auto;

    .rule-header {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      padding: 5px 5px 5px 8px;
      font-size: 14px;
      background: $--color-background;
      color: $--color-black;
      border-top: 1px solid $--color-white;
      border-bottom: 1px solid $--color-white;

      > span {
        line-height: 32px;
      }

      .rule-label {
        display: inline-block;
        width: 95px;
        font-weight: bold;
      }
    }

    .rule-list-container {
      height: 40%;
      overflow: auto;
      .rule-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        padding: 5px;
        background: $--color-background;

        .rule-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          box-sizing: border-box;
          padding: 10px;
          min-width: calc(100% / 3 - 10px);
          min-height: 48px;
          background: #fff;
          border: 1px solid $--color-grey;
          cursor: pointer;

          &:hover {
            background: #e4f2fb;
          }

          &.disabled {
            opacity: 0.6;
            background: #ddd;
            border: 1px solid #bbb;
            pointer-events: none;
          }

          &.green {
            border: 1px solid $--color-primary;
            .label {
              color: $--color-primary;
            }
          }
          &.red {
            border: 1px solid $--color-red;
            .label {
              color: $--color-red;
            }
          }

          &.active {
            background: #a2c7df;
            color: #333;

            &.green {
              background: $--color-primary;
              color: #fff;
              .label {
                color: #fff;
              }
            }
            &.red {
              background: $--color-red;
              color: #fff;
              .label {
                color: #fff;
              }
            }
          }

          .name {
            display: flex;
            max-width: 85%;
            margin-right: 10px;
            font-size: 13px;

            .title {
              margin-left: 5px;
              font-weight: normal;
            }
          }
          .label {
            font-size: 12px;
            font-weight: bold;
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

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      height: calc(100% - 64px);
      padding: 10px;
      img {
        width: 100px;
        height: 100px;
      }
      p {
        margin-top: 15px;
        font-size: 12px;
        color: #aab2c5;
      }
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

    .fundraising-event-tуре {
      padding: 10px;
      .section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        label {
          font-size: 13px;
          font-weight: bold;
        }
        .operations {
          .el-button {
            padding: 5px;
            color: #333;
            & + .el-button {
              margin-left: 0;
            }
            &.add {
              &:hover {
                color: $--color-primary;
              }
            }
            &.delete {
              &:hover {
                color: $--color-red;
              }
            }
            &.is-disabled {
              color: #ccc !important;
            }
          }
        }
        .tags {
          flex: 1;
          width: 100%;
          .el-tag {
            margin: 8px 8px 0 0;
            padding: 0 10px;
            color: #6b6c6f;
            border: 1px solid #efeff0;
            border-radius: 15px;
            background-color: #efeff0;
            cursor: pointer;
            &.no-event-deleted {
              text-decoration: line-through;
            }
            ::v-deep .el-icon-close {
              color: #fff;
              background-color: #ff5d5d;
              &:hover {
                background-color: #ff0000;
              }
            }
            &:hover {
              border: 1px solid #333;
            }
            &.active {
              color: #fff;
              border: 1px solid #333;
              background-color: #333;
            }
          }
        }
      }
      ::v-deep .add-fundraising-event-type-dialog {
        width: 440px;
        .el-form {
          .el-form-item {
            &:last-child {
              margin-bottom: 0;
            }
          }
          .el-select {
            width: 240px;
          }
          ul {
            margin-left: 15px;
            li {
              list-style: none;
              &::before {
                display: inline-block;
                margin-right: 5px;
                content: '';
                width: 8px;
                height: 8px;
                background-color: $--color-primary;
                border-radius: 50%;
                vertical-align: 1px;
              }
            }
          }
        }
      }
    }

    ::v-deep .checking-details {
      display: flex;
      flex: 1;
      background: $--color-white;
      border-top: 3px solid $--color-background;

      .section {
        flex: 1;
        padding: 10px;

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          h4 {
            margin-bottom: 10px;
            font-size: 14px;
          }

          .operation-btns {
            display: flex;
          }
        }

        .details-item {
          border-top: 1px solid #efefef;

          &.error {
            .item-row {
              .col {
                color: $--color-red;
                .manual-box {
                  border-color: $--color-red;
                }
              }
            }
          }

          h5 {
            padding: 10px 0;
            color: $--color-primary;
            font-size: 13px;
            i {
              margin-left: 10px;
              cursor: pointer;
              &:hover {
                color: #333;
              }
            }
          }

          .item-row {
            display: flex;
            align-items: center;
            min-height: 42px;
            font-size: 13px;

            .col {
              flex: 1;
              font-size: 12px;
              text-align: center;

              .fa {
                font-size: 22px;
                color: $--color-primary;
              }

              .manual-box {
                height: 25px;
                margin: 0 5px;
                border: 1px solid #ccc;
                cursor: pointer;

                > i.fa {
                  display: none;
                }

                &.active {
                  border-color: $--color-primary;

                  > i.fa {
                    display: initial;
                  }
                }

                &:hover {
                  border-color: $--color-primary;
                }
              }

              .rule-text {
                color: $--color-primary;
              }
            }

            .ai-location-suggestion-button {
              margin: 10px auto;
              background: $--color-primary;
              border-radius: 0;

              &:hover {
                opacity: 0.9;
              }
            }

            &.submit {
              justify-content: flex-end;
            }

            &.manual-tagged-info {
              justify-content: space-between;
              margin-top: 15px;

              .col {
                flex: initial;
                text-align: left;

                .tags {
                  display: flex;
                  align-items: center;

                  .el-button {
                    margin: 0;

                    &.view-button {
                      padding: 3px 10px;
                      border-radius: 0;
                    }

                    ::v-deep i {
                      font-size: 24px;
                    }
                  }
                }

                .delete-tag-button {
                  padding: 5px 10px;
                  border-radius: 0;
                }
              }
            }
          }

          &.b1-to-b7-additional-data {
            h5 {
              display: flex;
              align-items: center;
            }
            .text-wrapper {
              position: relative;
              display: flex;
              padding: 10px;
              background-color: #ececec;
              .text {
                position: relative;
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 12px;
                color: #333;
                text-align: justify;
                white-space: pre-line;
                &::before {
                  content: '';
                  float: right;
                  height: calc(100% - 14px);
                }
                &::after {
                  content: '';
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  background-color: #ececec;
                }
              }
              .more {
                float: right;
                clear: both;
                margin-left: 5px;
                padding: 0;
                font-size: 12px;
                color: #5287e1;
                text-decoration: underline;
                &:hover {
                  color: #0043af;
                  transform: scale(0.9);
                }
              }
            }
          }

          .no-event-tips {
            margin-left: 10px;
            font-style: italic;
            font-weight: normal;
            font-size: 12px;
            color: #91939a;
          }

          &.additional-documents {
            padding: 5px 0;

            .link {
              color: $--color-primary;
              text-decoration: underline;
              white-space: normal;
              text-align: left;
            }

            .text {
              padding: 12px 0;
            }
          }
          &.additional-data {
            padding: 10px 0;
            border-top: 1px solid #efefef;
            .el-button {
              padding: 5px 8px;
              border-color: $--color-primary;
              &:hover {
                color: $--color-primary;
              }
            }
          }

          .significant-investment-ratio {
            margin: 0;
            padding: 0;
            background-color: #fff;
            .formulas {
              display: block;
              .formula-info {
                padding: 5px;
                background-color: #efeff0;
                border: 1px solid #efeff0;
                cursor: pointer;
                &:not(:last-child) {
                  margin-bottom: 6px;
                }
                &.active {
                  border: 1px solid #459ba2;
                  background-color: rgba(#459ba2, 0.15);
                  .katex-display {
                    color: #333;
                    .result {
                      color: #333;
                    }
                  }
                }
                .katex-display {
                  margin: 5px 0;
                  color: #6b6c6f;
                  .result {
                    color: #6b6c6f;
                    background-color: transparent;
                  }
                }
              }
            }
          }
        }
      }

      .ai-suggestion {
        border-right: 1.5px solid #f2f5f7;
      }

      .manual-adjustment {
        border-left: 1.5px solid #f2f5f7;
      }
    }

    .predicted-position-list {
      position: absolute;
      top: 45px;
      right: 20px;
      width: 500px;
      z-index: 1001;

      ::v-deep .el-card {
        border-radius: 0;
      }
    }

    ::v-deep .el-loading-mask {
      z-index: 1;
    }
  }
}

::v-deep .split-line-wrap {
  display: none;
}
</style>

<style lang="scss">
@import '../common/hkex-global.scss';
.additional-data-popover {
  .content {
    max-height: 200px;
    overflow-y: auto;
    word-break: break-word;
    text-align: left;
  }
}
.additional-data-tooltip {
  max-width: 400px;
  border: none;
  background-color: #222;
  color: #fff;
  .popper__arrow {
    &::after {
      border-left-color: #222 !important;
    }
  }
  &.agm-additional-data-popover {
    .content {
      max-height: initial;
      overflow-y: initial;
    }
  }
  .content {
    max-height: 60vh;
    overflow-y: auto;
    line-height: 18px;
    padding-right: 10px;
    white-space: pre-line;
    font-size: 12px;
    word-break: break-word;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #606060;
      border-radius: 5px;
      &:hover {
        background-color: #6f6f6f;
      }
    }
    &::-webkit-scrollbar-track {
      display: none;
    }
  }
}
.delete-type-confirm-message-box {
  width: 530px;
}
.delete-all-confirm-message-box {
  width: 650px;
}
</style>
