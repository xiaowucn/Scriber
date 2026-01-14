<template>
  <div class="tag-user-wrapper">
    <file-switch-btn v-if="showQuestionQuickNav"></file-switch-btn>
    <template v-if="showCommonOperateBtns">
      <div class="export-btns">
        <el-button
          v-if="isShowExportButton"
          @click="exportAnswers('standard')"
          type="primary"
          size="mini"
          :loading="exportAnswersStandardLoading">
          {{ $t(`message['导出标注答案']`) }}
        </el-button>
        <el-button
          v-if="isShowExportButton"
          @click="exportAnswers('predict')"
          type="primary"
          size="mini"
          :loading="exportAnswersPredictLoading">
          {{ $t(`message['导出预测答案']`) }}
        </el-button>
      </div>
      <div class="user-operate-container">
        <div class="user-operate-content">
          <el-tooltip
            effect="dark"
            :content="$t(`message['提交修改过的答案并设为正确答案']`)"
            placement="right"
            :disabled="!isConflictQuestion">
            <el-button
              v-if="isShowSubmitAnswerBtn"
              @click="handleSubmitAnswer"
              :disabled="!canSubmitAnswer"
              :loading="submitAnswerLoading"
              type="primary"
              size="mini">
              {{ $t(`message['提交答案']`) }}
            </el-button>
          </el-tooltip>
          <!-- <el-button
            v-if="isShowBidMatchBtn"
            @click="handleBidMatchDownload"
            :loading="matchLoading"
            type="primary"
            size="mini">
            {{ matchLoading ? '匹配中...' : '投监指标匹配' }}
          </el-button> -->
          <el-button
            v-if="isShowSaveDraftBtn"
            @click="handleSaveDraft"
            :disabled="!canSubmitAnswer"
            :loading="saveDraftLoading"
            type="primary"
            size="mini">
            {{ $t(`message['保存草稿']`) }}
          </el-button>
          <el-button
            v-if="$features.supportLLMExtract()"
            type="primary"
            size="mini"
            :loading="exportAnswerResultLoading"
            :disabled="exportAnswerResultDisabled"
            @click="exportAnswerResult">
            导出答案
          </el-button>
          <template v-if="isShowCiticsTgCustom">
            <el-button
              v-if="isAllowStatisticsBtn"
              type="primary"
              :disabled="isEditAnswer || isPushLoading"
              size="mini"
              @click="handleStatisStatusChange">
              {{
                filePushCount
                  ? $t(`message['取消统计']`)
                  : $t(`message['加入统计']`)
              }}
            </el-button>
            <el-button
              v-if="isAllowMappingCheck"
              type="primary"
              size="mini"
              :disabled="isEditAnswer"
              @click="handleOpenCheck">
              {{ $t(`message['映射关系检查']`) }}
            </el-button>
            <el-button
              v-if="isAllowParaPush"
              type="primary"
              size="mini"
              :disabled="isEditAnswer || isPushLoading"
              @click="handleParamPush">
              {{ $t(`message['参数推送']`) }}
            </el-button>
          </template>
          <template v-if="$features.showHtRemarkAside()">
            <el-button
              type="primary"
              size="mini"
              @click="generateAnnotatedDocument">
              生成带批注文档
            </el-button>
            <el-button
              v-if="fileViewer.currentFileIsReadonly"
              type="primary"
              size="mini"
              @click="downloadAnnotatedDocument">
              下载带批注文档
            </el-button>
          </template>
          <el-button
            v-if="isShowTransferSchema"
            @click="openTransfer"
            type="info"
            size="mini">
            {{ $t(`message['迁移Schema']`) }}
          </el-button>
          <el-button
            v-if="
              isShowPresetAnswer &&
              $platform.isSzseEnv() &&
              predictList.length > 0
            "
            size="mini"
            type="success"
            @click="restartPredictionHandle">
            {{ $t(`message['生成预测']`) }}
          </el-button>
          <el-button
            v-if="isShowPushToAutodocButton"
            type="primary"
            size="mini"
            plain
            @click="pushToAutodoc">
            {{ $t(`message['推送到AutoDoc']`) }}
          </el-button>
          <!-- <el-button type="warning" size="mini" @click="switchCustomSchemaNode">{{
            enableCustomSchemaNode ? '批量修改' : '自定义字段'
          }}</el-button> -->
        </div>
        <div class="right-container">
          <file-remark-answer-tree-filter
            v-if="isInspect"></file-remark-answer-tree-filter>
          <review-fields-select
            v-if="$features.showReviewStatusSelect() && fileId && fileSource"
            :file-id="fileId" />
        </div>
        <schema-quick-switching
          v-if="$features.supportSchemaQuickSwitching()"
          :file="currentFile"></schema-quick-switching>
        <schema-quick-switching2 v-if="$features.supportSchemaQuickSwitching()">
        </schema-quick-switching2>

        <el-button
          v-if="showHkexAgmDirectorButton"
          type="primary"
          size="mini"
          class="link-button">
          <router-link
            :to="{ name: 'directorList', query: { fileId } }"
            target="_blank">
            To AGM Directors
          </router-link>
        </el-button>

        <answer-source-select
          v-if="!diffEnabled && isShowCiticsTgCustom"
          :file-id="fileId"></answer-source-select>
      </div>
      <div class="answer-type-container" v-if="isShowButtonsByStatus">
        <template v-if="$features.showAIModules()">
          <span v-if="isExistPresetAnswer && !isExistUserAnswer">
            {{ $t(`message['此答案由AI推荐']`) }}
          </span>
          <span v-if="isExistPresetAnswer && isExistUserAnswer">
            {{ $t(`message['此题部分答案由AI推荐']`) }}
          </span>
          <span v-if="!isExistPresetAnswer && isAiPredicting">
            {{ $t(`message['答案预测中、稍后请重新进入页面查看']`) }}
          </span>
        </template>
      </div>
      <div class="user-answer-container" v-if="isShowUserAnswerRow">
        <el-button
          v-if="isShowNewBlankAnswer && isShowButtonsByStatus"
          :type="getAnswerType(newBlankAnswerUid)"
          :plain="$platform.isDefaultEnv()"
          size="mini"
          @click="switchAnswerHandle(newBlankAnswerUid)">
          {{ $t(`message['新增答案']`) }}
        </el-button>
        <el-button
          v-if="isShowCorrectAnswer"
          :type="getAnswerType(correctAnswerUid)"
          :plain="$platform.isDefaultEnv()"
          size="mini"
          @click="switchAnswerHandle(correctAnswerUid)">
          {{ $t(`message['正确答案']`) }}
        </el-button>
        <el-tooltip
          v-for="(item, key) in userAnswers"
          :key="key"
          placement="top">
          <template slot="content">
            更新时间: {{ item.updated_utc | datetime }}
          </template>
          <el-button
            :type="getAnswerType(item.uid)"
            :plain="$platform.isDefaultEnv()"
            size="mini"
            @click="switchAnswerHandle(item.uid)">
            {{ item.name }}
          </el-button>
        </el-tooltip>
        <el-button
          v-if="$features.showAIModules() && isShowPresetAnswer"
          :type="getAnswerType(presetUid)"
          :plain="$platform.isDefaultEnv()"
          size="mini"
          @click="switchAnswerHandle(presetUid)">
          {{ $t(`message['推荐答案']`) }}
        </el-button>
        <el-button
          v-if="isShowMergedAnswerButton"
          :type="getAnswerType(mergedUid)"
          :plain="$platform.isDefaultEnv()"
          size="mini"
          @click="switchAnswerHandle(mergedUid)">
          {{ $t(`message['合并的答案']`) }}
        </el-button>
        <el-button
          v-if="isShowExportedAnswerButton"
          :type="getAnswerType(exportedUid)"
          :plain="$platform.isDefaultEnv()"
          size="mini"
          @click="switchAnswerHandle(exportedUid)">
          {{ $t(`message['导出的答案']`) }}
        </el-button>
        <el-switch
          v-if="diffEnabled"
          v-model="showDiffOnly"
          :active-text="$t(`message['仅展示差异']`)"
          @change="handleShowDiffOnlyChanged">
        </el-switch>
        <el-button
          v-if="isShowDownloadSpecialData"
          class="download-result-btn"
          type="primary"
          size="mini"
          @click="downloadSpecialAnswer(qid)">
          {{ $t(`message['下载转义结果']`) }}
        </el-button>
      </div>
      <div>
        <el-tooltip
          effect="dark"
          :content="$t(`message['设置该用户提交的答案为正确答案']`)"
          placement="right">
          <el-button
            v-if="isRemarkManageTag"
            type="primary"
            size="mini"
            @click="saveCorrectAnswer">
            {{ $t(`message['设为正确答案']`) }}
          </el-button>
        </el-tooltip>
      </div>
    </template>

    <div v-else class="csc-octopus-operate-bar">
      <el-button type="primary" size="mini" @click="saveCscOctopusAnswer">
        确定
      </el-button>
    </div>

    <schema-transfer-v2
      :schemas="transfer"
      :userAnswers="userDraftAndAnswer"
      @transfer-schema="handleTransfer"
      @close-transfer="closeTransfer">
    </schema-transfer-v2>
  </div>
</template>

<script>
import _ from 'lodash';
import md5 from 'blueimp-md5';
import { mapGetters } from 'vuex';
import {
  questionStatusNames,
  answerStatus,
  scriberPublicPoc,
  AI_PREDICT_STATUS_MAP,
} from '../../store/constants';
import SchemaTransferV2 from '../SchemaTransferV2';
import EventBus from './remark-tree/EventBus';
import { flattenSchemaData, downloadFileByBlob } from '../../utils';
import { remark as remarkApi } from '@/store/api';
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';
import FileSwitchBtn from '../FileSwitchBtn.vue';
import ReviewFieldsSelect from '../../custom/general/components/ReviewFieldsSelect.vue';
import FileRemarkAnswerTreeFilter from './FileRemarkAnswerTreeFilter.vue';
import schemaQuickSwitching from '../../custom/hkex/components/SchemaQuickSwitching';
import schemaQuickSwitching2 from '../../custom/hkex/components/SchemaQuickSwitching2';
import FileMarkableMixin from '../mixins/FileMarkableMixin';
import { isCiticsTgAllow } from '@/custom/citics_tg/common/utils';
import AnswerSourceSelect from '../../custom/citics_tg/components/AnswerSourceSelect.vue';
import platformPerimeter from '@/perimeters/platform.perimeter';

export default {
  name: 'file-remark-operate',
  components: {
    SchemaTransferV2,
    FileSwitchBtn,
    ReviewFieldsSelect,
    FileRemarkAnswerTreeFilter,
    schemaQuickSwitching,
    schemaQuickSwitching2,
    AnswerSourceSelect,
  },
  mixins: [FileMarkableMixin],
  props: {
    answerItemMap: {
      type: Object,
      required: true,
    },
    answerVersion: {
      type: String,
      required: true,
    },
    updatedAnswerKeys: {
      type: Set,
      required: false,
    },
    qid: {
      type: Number,
      required: true,
    },
    isInspect: {
      type: Boolean,
      default: false,
    },
    taskType: {
      type: String,
      default: 'extract',
    },
    isEditAnswer: {
      type: Boolean,
      default: false,
    },
    isShowCiticsTgCustom: {
      type: Boolean,
      default: false,
    },
    isPushLoading: {
      type: Boolean,
      default: false,
    },
    isOperatePerm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      presetUid: -1, // 推荐答案
      mergedUid: -2, // 合并答案
      newBlankAnswerUid: -3, // 新建空白答案
      exportedUid: -4, // 导出的答案
      schemaBoxesVisible: false,
      transfer: [],
      selectAnswerUid: null,
      canSubmitAnswer: true,
      submitAnswerLoading: false,
      saveDraftLoading: false,
      exportAnswersStandardLoading: false,
      exportAnswersPredictLoading: false,
      exportAnswerResultLoading: false,
      enableCustomSchemaNode: false,
      showDiffOnly: false,
      filePushCount: false,

      // matchLoading: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'question',
      'answer',
      'mergedTreeData',
      'originSchema',
      'predictList',
      'userAnswerType',
      'diffEnabled',
      'remarkFile',
    ]),
    ...mapGetters('schemaModule', ['transferData']),
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters('detailModule', ['fileViewer']),
    fileId() {
      if (this.remarkFile) {
        return this.remarkFile.id;
      }

      return Number(this.$route.query.fileId);
    },
    fileSource() {
      if (this.remarkFile) {
        return this.remarkFile.source;
      }
      return true;
    },
    userAnswers() {
      if (this.isConflictQuestion) {
        return this.question.answers.filter((answer) => {
          return answer.status === answerStatus.answer;
        });
      } else {
        return this.currentUserDraftAndOtherAnswers;
      }
    },
    currentUserDraftAndOtherAnswers() {
      if (!this.question.answers) {
        return [];
      }
      return this.question.answers.filter((answer) => {
        return (
          answer.status === answerStatus.answer ||
          answer.uid === this.loginUser.id
        );
      });
    },
    userDraftAndAnswer() {
      return this.question.answers || [];
    },
    projectId() {
      return this.$route.query.projectId;
    },
    currentFile() {
      const file = this.fileViewer.files.find(
        (file) => file.id === this.fileId,
      );
      return file || {};
    },
    userOwnAnswer() {
      return this.userDraftAndAnswer.find((e) => e.uid === this.loginUser.id);
    },
    markQuestionUids() {
      let uids = [];
      this.userDraftAndAnswer.forEach((answer) => {
        if (answer.status === answerStatus.answer) {
          uids.push(answer.uid);
        }
      });
      return uids;
    },
    isAllowSubmitQuestionStatus() {
      let canSubmitQuestionStatusArr = [
        questionStatusNames.prepare,
        questionStatusNames.answering,
        questionStatusNames.completed,
      ];
      return canSubmitQuestionStatusArr.includes(this.question.status);
    },
    isRemarkManageTag() {
      if (!this.markQuestionUids.includes(this.loginUser.id)) {
        // 如果题目处于 答案不一致，标注管理 权限的用户可以保存答案
        if (this.question.status === questionStatusNames.conflict) {
          return true;
        }
      }
      return false;
    },
    isShowButtonsByStatus() {
      if (this.$isAllowed('remarkOrInspect')) {
        // 当开启「无限答题模式」时，无视题目状态, 都可以保存答案
        if (this.$features.enableUnlimitAnswerMode()) {
          return true;
        }
        // 如果题目处于 待做、答题中、答题完毕 状态下，标注 权限的用户可以保存答案
        if (this.isAllowSubmitQuestionStatus) {
          return (
            this.question.health !== 0 ||
            this.markQuestionUids.includes(this.loginUser.id)
          );
        }
        return false;
      }
      return false;
    },
    allowSubmitAnswerOrSaveDraft() {
      if (
        this.configuration.app_id === scriberPublicPoc &&
        !this.$user.isAdminUser() &&
        this.currentFile.public
      ) {
        return false;
      }
      return true;
    },
    isShowSubmitAnswerBtn() {
      if (this.isShowCiticsTgCustom) {
        if (!this.isOperatePerm) {
          return false;
        }
        if (
          (this.diffEnabled && !isCiticsTgAllow('prj_detail_compare_submit')) ||
          (!this.diffEnabled && !isCiticsTgAllow('prj_detail_file_para_submit'))
        ) {
          return false;
        }
      }
      if (this.$platform.isNafmiiEnv()) {
        return true;
      }
      if (this.taskType === 'audit') {
        return true;
      }
      if (this.$features.supportLLMExtract()) {
        return true;
      }
      if (!this.allowSubmitAnswerOrSaveDraft) {
        return false;
      }
      return this.isShowButtonsByStatus || this.isRemarkManageTag;
    },
    isShowSaveDraftBtn() {
      if (this.isShowCiticsTgCustom) {
        return false;
      }
      if (!this.allowSubmitAnswerOrSaveDraft) {
        return false;
      }
      if (!this.question.answers) {
        return false;
      }
      let currentUid = this.loginUser.id;
      let hasCurrentUserAnswer = this.question.answers.find(
        (answer) =>
          answer.uid === currentUid && answer.status === answerStatus.answer,
      );
      if (
        this.question.status === questionStatusNames.prepare ||
        this.question.status === questionStatusNames.answering
      ) {
        if (!hasCurrentUserAnswer && this.$isAllowed('remarkOrInspect')) {
          return true;
        }
      }
      return false;
    },
    isShowTransferSchema() {
      if (
        this.transferData.length === 2 &&
        (this.question.status === questionStatusNames.answering ||
          this.question.status === questionStatusNames.completed) &&
        this.$isAllowed('remarkOrInspect')
      ) {
        // 没有记录旧版schema version数据，不迁移
        if (this.transferData[0].version) {
          return this.transferData[0].version !== this.transferData[1].version;
        }
      }
      return false;
    },
    isShowPresetAnswer() {
      if (this.$isAllowed('remarkOrInspect')) {
        if (this.isExistPresetAnswer) {
          return true;
        }
      }
      return false;
    },
    isShowNewBlankAnswer() {
      if (this.isInspect) {
        return false;
      }
      return !this.userOwnAnswer;
    },
    isShowMergedAnswerButton() {
      if (this.$isAllowed('remarkOrInspect')) {
        return !!this.configuration.show_merge_answer && !!this.question.answer;
      }
      return false;
    },
    isShowExportedAnswerButton() {
      if (this.$isAllowed('remarkOrInspect')) {
        return (
          !!this.configuration.show_export_answer &&
          !!this.question.export_answer
        );
      }
      return false;
    },
    isShowPushToAutodocButton() {
      if (this.$isAllowed('remarkOrInspect')) {
        return !!this.configuration.show_push_to_autodoc_btn;
      }
      return false;
    },
    isShowExportButton() {
      if (this.$isAllowed('remarkOrInspect')) {
        return !!this.configuration.export_single_answer;
      }
      return false;
    },
    isShowCorrectAnswer() {
      if (
        this.correctAnswer &&
        this.question.status === questionStatusNames.conflictConfirmed
      ) {
        return true;
      }
      return false;
    },
    isExistPresetAnswer() {
      return !!this.question.preset_answer;
    },
    isAiPredicting() {
      return [AI_PREDICT_STATUS_MAP.TODO, AI_PREDICT_STATUS_MAP.DOING].includes(
        this.question.ai_status,
      );
    },
    isExistUserAnswer() {
      return this.userDraftAndAnswer.length > 0;
    },
    correctAnswer() {
      return this.userDraftAndAnswer.find((answer) => answer.result === 1);
    },
    correctAnswerUid() {
      if (this.correctAnswer) {
        return this.correctAnswer.id;
      }

      return null;
    },
    isValidate() {
      if (typeof this.configuration.check_schema_base_type === 'undefined') {
        return true;
      }
      return this.configuration.check_schema_base_type;
    },
    isConflictQuestion() {
      return this.question.status === questionStatusNames.conflict;
    },
    isShowAllPredictItems() {
      if (typeof this.configuration.show_all_predict_items === 'undefined') {
        return false;
      }
      return this.configuration.show_all_predict_items;
    },
    presetAnswer() {
      const userAnswer = _.cloneDeep(this.question.preset_answer.userAnswer);
      let presetAnswer = {
        items: [],
        version: userAnswer.version,
      };
      for (let i = 0; i < userAnswer.items.length; i++) {
        const item = {
          data:
            userAnswer.items[i].data.length > 0
              ? [userAnswer.items[i].data[0]]
              : [],
          key: userAnswer.items[i].key,
          schema: userAnswer.items[i].schema,
        };
        if (userAnswer.items[i].score) {
          item.score = userAnswer.items[i].score;
        }
        if (userAnswer.items[i].value) {
          item.value = userAnswer.items[i].value;
        }
        presetAnswer.items.push(item);
      }
      return presetAnswer;
    },
    newBlankAnswer() {
      const newBlankAnswer = {
        items: [],
        version: '2.2',
      };
      return newBlankAnswer;
    },
    showQuestionQuickNav() {
      if (this.isShowCiticsTgCustom) {
        return false;
      }
      if (this.$platform.isHkexEnv()) {
        return false;
      }
      if (!this.showCommonOperateBtns) {
        return false;
      }
      return !this.diffEnabled;
    },
    showCommonOperateBtns() {
      return !this.$route.meta.noAuth;
    },
    isShowDownloadSpecialData() {
      return this.configuration.export_special_data;
    },
    isShowUserAnswerRow() {
      if (this.isShowCiticsTgCustom) {
        return false;
      }
      return true;
    },
    isAllowStatisticsBtn() {
      if (!this.isOperatePerm) {
        return false;
      }
      if (this.diffEnabled) {
        return false;
      }
      return isCiticsTgAllow('prj_detail_file_para_statis');
    },
    isAllowMappingCheck() {
      if (!this.isOperatePerm) {
        return false;
      }
      if (
        (this.diffEnabled && !isCiticsTgAllow('prj_detail_compare_mapping')) ||
        (!this.diffEnabled && !isCiticsTgAllow('prj_detail_file_para_mapping'))
      ) {
        return false;
      }
      return true;
    },
    isAllowParaPush() {
      if (!this.isOperatePerm) {
        return false;
      }
      if (
        (this.diffEnabled && !isCiticsTgAllow('prj_detail_compare_push')) ||
        (!this.diffEnabled && !isCiticsTgAllow('prj_detail_file_para_push'))
      ) {
        return false;
      }
      return true;
    },
    showHkexAgmDirectorButton() {
      return (
        platformPerimeter.isHkexEnv() &&
        Number(this.$route.query.schemaId) === 33
      );
    },
    // isShowBidMatchBtn() {
    //   return this.$platform.isCgsEnv();
    // },
    exportAnswerResultDisabled() {
      return _.isEmpty(this.answer?.items) || this.mergedTreeData?.error;
    },
  },
  watch: {
    isShowTransferSchema(show) {
      this.canSubmitAnswer = !show;
    },
    currentFile: {
      handler() {
        this.filePushCount = this.currentFile?.need_stat || false;
      },
      immediate: true,
    },
  },
  created() {
    this.initialize();
    EventBus.$on('cancel-select-frames', this.cancelSelectedFrames);
    EventBus.$on(
      'toggle-submit-answer-loading',
      this.toggleSubmitAnswerLoading,
    );
    EventBus.$on(
      'toggle-submit-answer-disabled',
      this.toggleSubmitAnswerDisabled,
    );
  },
  beforeDestroy() {
    EventBus.$off('cancel-select-frames', this.cancelSelectedFrames);
    EventBus.$off(
      'toggle-submit-answer-loading',
      this.toggleSubmitAnswerLoading,
    );
    EventBus.$off(
      'toggle-submit-answer-disabled',
      this.toggleSubmitAnswerDisabled,
    );
  },
  methods: {
    initialize() {
      if (this.isConflictQuestion) {
        this.$store.commit('remarkModule/SET_CONFLICT_MAPS', this.userAnswers);
        this.initConflictUserAnswer();
      } else {
        // 对比模式下不需要设置用户答案
        if (this.diffEnabled) {
          return;
        }
        this.initUserAnswer();
      }
      if (this.isInspect) {
        this.canSubmitAnswer = false;
      }
    },
    getAnswerType(id) {
      if (this.selectAnswerUid === id) {
        if (this.$platform.isDefaultEnv()) {
          return 'primary';
        } else {
          return 'success';
        }
      }
      return '';
    },
    initUserAnswer() {
      let answer = {
        items: [],
        version: '2.2',
      };
      let customFieldAnswer = {
        version: '2.2',
        items: [],
      };
      if (this.question.answer && this.question.answer.custom_field) {
        customFieldAnswer = this.question.answer.custom_field;
      }
      this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', '');
      if (this.userOwnAnswer) {
        answer = this.userOwnAnswer.data.userAnswer;
        this.selectAnswerUid = this.userOwnAnswer.uid;
      } else if (this.userAnswers.length > 0) {
        // 管理员有标注权限要在已标答案上标注，所以如果有答案，先展示一份答案
        answer = this.userAnswers[0].data.userAnswer;
        this.selectAnswerUid = this.userAnswers[0].uid;
        // 答题者没有自己的答案时，只能新增答案，不能在别人的答案基础上作答(“证监会-新”、“上交所”环境需求)
        if (this.isShowMergedAnswerButton) {
          this.canSubmitAnswer = false;
        }
        // 不能在别人的答案基础上作答（中诚信国际）
        if (this.$features.canNotSubmitOtherUserAnswer()) {
          this.canSubmitAnswer = false;
        }
      } else if (this.correctAnswer) {
        answer = this.correctAnswer.data.userAnswer;
        this.selectAnswerUid = this.correctAnswerUid;
      } else if (this.isExistPresetAnswer) {
        if (!this.isShowAllPredictItems) {
          answer = this.presetAnswer;
        } else {
          answer = this.question.preset_answer.userAnswer;
        }
        this.selectAnswerUid = this.presetUid;
        this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', 'PRESET');
      } else if (this.isInspect) {
        answer.items = this.question.answer_data || [];
      }
      let userAnswer = _.cloneDeep(answer);
      userAnswer.items = userAnswer.items.filter((item) => item !== null);

      userAnswer.items.forEach((item) => {
        if (typeof item.manual === 'undefined') {
          item.manual = false;
        }
      });
      this.$store.commit(
        'remarkModule/SET_CURRENT_ANSWER_USER_ID',
        this.selectAnswerUid,
      );
      this.$store.commit('remarkModule/SET_USER_ANSWER', userAnswer);
      this.$store.commit(
        'remarkModule/SET_CUSTOM_FIELD_ANSWER',
        customFieldAnswer,
      );
    },
    initConflictUserAnswer() {
      let answer = this.userAnswers[0].data.userAnswer;
      this.selectAnswerUid = this.userAnswers[0].uid;
      this.$store.commit(
        'remarkModule/SET_CURRENT_CONFLICT_MAP',
        this.selectAnswerUid,
      );
      this.$store.commit('remarkModule/SET_USER_ANSWER', answer);
    },
    cancelSelectedFrames() {
      this.schemaBoxesVisible = false;
    },
    updateComponentVisible() {
      this.schemaBoxesVisible = !this.schemaBoxesVisible;
      EventBus.$emit('select-all-frames', this.schemaBoxesVisible);
    },
    openTransfer() {
      this.transfer = [
        { data: _.cloneDeep(this.transferData[0]) },
        { data: _.cloneDeep(this.transferData[1]) },
      ];
    },
    async switchAnswerHandle(uid) {
      await RemarkTreeLoading.start();
      this.$store.commit('remarkModule/SET_CURRENT_ANSWER_USER_ID', uid);
      this.$store.commit('remarkModule/SET_MERGED_TREEDATA', []);
      if (this.$platform.isHkexEnv()) {
        await this.$parent.fetchQuestion();
        await this.$parent.initAnswerMap();
      }
      await this.$nextTick();

      let userAnswer = {};
      this.schemaBoxesVisible = false;
      // 答题者只能修改(提交)自己的答案或新增答案，不能在别人的答案基础上作答(“证监会-新”、“上交所”环境需求)
      if (this.isShowMergedAnswerButton) {
        this.canSubmitAnswer =
          uid === this.loginUser.id ||
          uid === this.presetUid ||
          uid === this.newBlankAnswerUid ||
          uid === this.exportedUid;
      }

      // 答题者只能提交：自己的答案/预测答案/空白答案（中诚信国际）
      if (this.$features.canNotSubmitOtherUserAnswer()) {
        this.canSubmitAnswer =
          uid === this.loginUser.id ||
          uid === this.presetUid ||
          uid === this.newBlankAnswerUid;
      }

      EventBus.$emit('select-all-frames', this.schemaBoxesVisible);
      this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', '');
      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', this.originSchema);
      if (uid === this.correctAnswerUid) {
        userAnswer = this.correctAnswer.data.userAnswer;
      } else if (uid === this.presetUid) {
        if (!this.isShowAllPredictItems) {
          userAnswer = this.presetAnswer;
        } else {
          userAnswer = this.question.preset_answer.userAnswer;
        }
        this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', 'PRESET');
        this.closeAIPredictPositionPopup(); // 切换到推荐答案时，关闭【AI推荐详情】弹窗
      } else if (uid === this.mergedUid) {
        userAnswer = this.question.answer.userAnswer;
        this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', 'MERGED');
      } else if (uid === this.newBlankAnswerUid) {
        userAnswer = this.newBlankAnswer;
        this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', 'NEW_BLANK');
      } else if (uid === this.exportedUid) {
        this.$store.commit(
          'remarkModule/SET_ANSWER_SCHEMA',
          this.question.export_answer.schema,
        );
        userAnswer = this.question.export_answer.userAnswer;
        this.$store.commit('remarkModule/SET_USER_ANSWER_TYPE', 'EXPORTED');
      } else {
        userAnswer = this.userAnswers.find((item) => item.uid === uid).data
          .userAnswer;
      }
      this.selectAnswerUid = uid;
      if (this.isConflictQuestion) {
        this.$store.commit(
          'remarkModule/SET_CURRENT_CONFLICT_MAP',
          this.selectAnswerUid,
        );
      }
      // Object.freeze(userAnswer);
      userAnswer.items = userAnswer.items.filter((item) => item !== null);
      this.$store.dispatch('remarkModule/switchUserAnswer', userAnswer);

      RemarkTreeLoading.close();
    },
    async downloadSpecialAnswer(qid) {
      try {
        const res = await this.$store.dispatch(
          'remarkModule/downloadSpecialAnswer',
          qid,
        );
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
          title: '错误',
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async saveCorrectAnswer() {
      const canSaveCorrectAnswer =
        this.selectAnswerUid === this.presetUid ||
        this.selectAnswerUid === this.newBlankAnswerUid ||
        this.selectAnswerUid === this.mergedUid;
      if (canSaveCorrectAnswer) {
        this.$notify({
          title: this.$t(`message['警告']`),
          message: this.$t(`message['只能设置用户答案为正确答案']`),
          type: 'warning',
          offset: 30,
        });
        return;
      }
      let query = {
        uid: this.selectAnswerUid,
        qid: this.qid,
      };
      try {
        await this.$store.dispatch('remarkModule/saveCorrectAnswer', query);
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['答案设置成功']`),
          type: 'success',
          offset: 30,
        });
      } catch (e) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['答案设置失败']`),
          type: 'error',
          offset: 30,
        });
      }
    },
    async handleSubmitAnswer() {
      if (this.isInspect) {
        this.$emit('submit-inspect-answer');
        return;
      }

      this.sendSubmitRequest(0);
    },
    handleSaveDraft() {
      this.saveDraftLoading = true;
      this.sendSubmitRequest(1);
    },
    validateSchemaAnswer() {
      let errors = [];
      // 校验schema节点是否为必填字段
      let flattenSchema = flattenSchemaData(this.originSchema);
      let requiredSchemas = flattenSchema.filter((item) => item.data.required);
      requiredSchemas.forEach((schema) => {
        let isTag = false;
        Object.keys(this.answerItemMap).forEach((key) => {
          const item = this.answerItemMap[key];
          if (
            schema.data.label === item.schema.data.label &&
            schema.data.type === item.schema.data.type
          ) {
            isTag = true;
            return false;
          }
        });
        if (!isTag) {
          let error = {
            name: schema.data.label,
            message: `不能为空`,
          };
          errors.push(error);
        }
      });
      this.$store.commit('remarkModule/SET_ERROR_TIPS', errors);
    },
    formatUserAnswer() {
      if (this.isValidate) {
        this.validateSchemaAnswer();
      }

      this.$store.dispatch('remarkModule/removeEmptyAnswer');
    },
    resetConflictMap() {
      if (this.isConflictQuestion) {
        this.$store.commit('remarkModule/SET_CONFLICT_MAPS', []);
        this.$store.commit('remarkModule/SET_CURRENT_CONFLICT_MAP', -1);
      }
    },
    answerItemIsEmpty(item) {
      return _.isEmpty(item.data) && _.isEmpty(item.value);
    },
    async sendSubmitRequest(type) {
      this.formatUserAnswer();
      const currentSchema =
        this.userAnswerType === 'EXPORTED'
          ? this.question.export_answer.schema
          : this.originSchema;

      const allAnswerItems = Object.keys(this.answerItemMap).map(
        (key) => this.answerItemMap[key],
      );

      const userAnswerItems = allAnswerItems.filter(
        (item) => !item.custom && !this.answerItemIsEmpty(item),
      );

      const customAnswerItems = allAnswerItems
        .filter((item) => item.custom && (!item.md5 || item.edited))
        .map((item) => {
          if (!item.md5) {
            return {
              ...item,
              md5: md5(item.key),
            };
          }
          return item;
        });

      // 对比模式下提交答案需要删除标记差异的diff_result属性
      if (this.diffEnabled) {
        userAnswerItems.forEach((item) => {
          delete item.diff_result;
        });
      }

      customAnswerItems.forEach((item) => {
        delete item.diff_result;
        if (item.edited) {
          delete item.edited;
        }
      });

      let data = {
        data: {
          schema: currentSchema,
          userAnswer: {
            version: this.answerVersion,
            items: userAnswerItems,
          },
        },
      };

      if (this.$features.supportCustomField()) {
        data.data.custom_field = {
          version: this.answerVersion,
          items: customAnswerItems,
        };
      }
      try {
        this.submitAnswerLoading = true;
        this.$emit('before-send-question-answer');
        await this.$store.dispatch('remarkModule/sendQuestionAnswer', {
          qid: this.qid,
          data,
          type,
          isExportAnswer: this.userAnswerType === 'EXPORTED' ? true : false,
        });
        if (this.showCommonOperateBtns) {
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(
              `message['${type === 0 ? '保存答案成功！' : '保存草稿成功！'}']`,
            ),
            type: 'success',
            offset: 30,
          });
        }
        this.$emit('reload-question');
        this.resetConflictMap();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      } finally {
        this.submitAnswerLoading = false;
        this.saveDraftLoading = false;
      }
    },
    handleTransfer() {
      this.$emit('reset-transfer-schema');
    },
    closeTransfer() {
      this.transfer = [];
    },
    async restartPredictionHandle() {
      this.formatUserAnswer();
      const userAnswer = _.cloneDeep({
        version: this.answerVersion,
        items: Object.keys(this.answerItemMap).map(
          (key) => this.answerItemMap[key],
        ),
      });
      this.predictList.forEach((key) => {
        const anserItem = userAnswer.items.find((item) => item.key === key);
        if (anserItem) anserItem.confirm = true;
      });
      let data = {
        data: {
          schema: this.originSchema,
          userAnswer,
        },
      };
      try {
        await this.$store.dispatch('remarkModule/restartPredictAnswer', {
          qid: this.qid,
          data,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: '将重新生成推荐答案',
          type: 'success',
          offset: 30,
        });
        this.$store.commit('remarkModule/RESET_PREDICT_LIST');
        this.$router.back();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async pushToAutodoc() {
      try {
        await remarkApi.pushToAutodoc(this.fileId);
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['推送到AutoDoc成功']`),
          type: 'success',
          offset: 30,
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async exportAnswers(answerType) {
      const qid = this.qid;
      try {
        if (answerType === 'standard') {
          this.exportAnswersStandardLoading = true;
        } else {
          this.exportAnswersPredictLoading = true;
        }
        const res = await remarkApi.exportAnswers(qid, answerType);
        const blob = new Blob([JSON.stringify(res.data)]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = this.fileId + '_' + answerType + '.json';
        link.click();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      } finally {
        this.exportAnswersStandardLoading = false;
        this.exportAnswersPredictLoading = false;
      }
    },
    async exportAnswerResult() {
      try {
        this.exportAnswerResultLoading = true;
        const res = await remarkApi.exportAnswerResult(this.fileId);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.exportAnswerResultLoading = false;
      }
    },
    closeAIPredictPositionPopup() {
      this.$store.commit('remarkModule/SET_PREDICT_POSITION', []);
      this.$store.commit('remarkModule/SET_PREDICT_LABEL', '');
      this.$store.commit(
        'remarkModule/SET_PREDICT_PRECISE_POSITION_SELECTED_STATUS',
        [],
      );
    },
    switchCustomSchemaNode() {
      this.enableCustomSchemaNode = !this.enableCustomSchemaNode;
      EventBus.$emit(
        'switch-custom-schema-node-enable',
        this.enableCustomSchemaNode,
      );
    },
    async generateAnnotatedDocument() {
      try {
        const result = await this.$confirm('所有批注已完成？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(() => {});
        if (result === 'confirm') {
          this.annotateButtonDisabled = true;
          await this.$store.dispatch('htModule/annotatedDocument', this.fileId);
          this.$notify({
            title: '提示',
            message: '批注到文档成功',
            type: 'success',
            offset: 30,
          });
          this.$store.commit('detailModule/SET_CURRENT_FILE_READONLY', true);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async downloadAnnotatedDocument() {
      try {
        const fileUrl = await this.$store.dispatch(
          'htModule/downloadAnnotatedDocument',
          this.fileId,
        );
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileUrl);
        link.click();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    async saveCscOctopusAnswer() {
      try {
        const data = {
          data: {
            fid: Number(this.fileId),
            schema: this.originSchema,
            userAnswer: {
              version: this.answerVersion,
              items: Object.keys(this.answerItemMap).map(
                (key) => this.answerItemMap[key],
              ),
            },
          },
        };
        await this.handleSubmitAnswer();
        await remarkApi.saveCscOctopusAnswer(data);
        window.parent.postMessage(
          { status: 'ok', event: 'paitech-saved' },
          '*',
        );
        this.$notify({
          title: '成功',
          message: '信息推送成功！',
          type: 'success',
          offset: 30,
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    toggleSubmitAnswerLoading(isSubmit) {
      this.submitAnswerLoading = isSubmit;
    },
    toggleSubmitAnswerDisabled(isDisabled) {
      this.canSubmitAnswer = !isDisabled;
    },
    handleShowDiffOnlyChanged(data) {
      this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', {
        diffOnly: data,
      });
    },

    handleOpenCheck() {
      this.$emit('open-mapping-check');
    },
    handleParamPush() {
      this.$emit('handle-param-push');
    },
    handleStatisStatusChange() {
      this.$emit(
        'handle-statis-status-change',
        this.filePushCount ? this.currentFile : null,
      );
    },
    changePushCountStatus() {
      this.filePushCount = !this.filePushCount;
    },
    joinPushCountStatus() {
      this.filePushCount = true;
    },
    // async handleBidMatchDownload() {
    //   this.matchLoading = true;
    //   await new Promise((resolve) => setTimeout(resolve, 10e3));
    //   try {
    //     const res = await cgsApi.downloadBidMatches({
    //       fileId: this.fileId,
    //     });
    //     if (res) {
    //       await downloadFileByBlob(res);
    //     } else {
    //       this.$notify({
    //         title: '提示',
    //         message: res.message,
    //         type: 'warning',
    //         offset: 30,
    //       });
    //     }
    //   } catch (error) {
    //     this.$notify({
    //       title: '错误',
    //       message: error.message,
    //       type: 'error',
    //       offset: 30,
    //     });
    //   } finally {
    //     this.matchLoading = false;
    //   }
    // },
  },
};
</script>

<style scoped lang="scss">
.tag-user-wrapper {
  padding: 0 15px;

  .export-btns {
    margin: 8px 0;
  }

  .user-operate-container {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: baseline;
  }

  .user-operate-content,
  .user-answer-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    ::v-deep .el-button {
      margin: 4px 10px 4px 0;
      &.download-result-btn {
        background-color: #349bd5;
      }
    }
  }
  .right-container {
    display: flex;
    column-gap: 10px;
  }
  .answer-type-container {
    margin-top: 8px;
    color: #67c23a;
    span {
      margin-right: 20px;
      font-size: 14px;
    }
  }
  .user-answer-container {
    margin: 8px 0;
  }
  .csc-octopus-operate-bar {
    margin: 10px 0;
  }
  .link-button {
    :is(a) {
      text-decoration: none;
      color: #fff;
    }
  }
}
</style>
