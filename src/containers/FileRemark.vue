<template>
  <div
    class="file-remark-wrapper"
    :class="{
      'csc-octopus': isFromCscOctopus,
      'citics-tg-remark': showCiticsTgRemarkAside,
    }">
    <div class="file-remark-container file-remark-base">
      <file-remark-schema-aside
        v-if="showFileRemarkSchemaSideBar"
        :treeData="treeData"
        :entity="entity"></file-remark-schema-aside>

      <div
        ref="pdfViewerContainer"
        class="file-viewer-wrapper"
        :class="{ 'file-viewer-box': isSideAgreementRemark }"
        v-loading="!viewerReady">
        <template v-if="isExcel">
          <excel-viewer
            :file-id="fileId"
            :is-inspect="isInspect"
            :answer-item-map="answerItemMap"
            @cell-selected="handleCellSelected">
          </excel-viewer>
        </template>
        <template v-else>
          <file-pdf-viewer-container
            v-if="viewerReady"
            ref="pdfViewerContainer"
            :file-id="fileId"
            :file-info="fileInfo"
            :answer-item-map="answerItemMap"
            :read-only="isPdfReadOnly"
            :show-answer-panel="showAnswerPanel"
            :is-inspect="isInspect"
            :is-iframe-mode="isIframeMode"
            @toggle-answer-panel="toggleAnswerPanel"
            @open-remark-diff="openRemarkDiff">
          </file-pdf-viewer-container>
          <side-agreement-compare-pdf
            v-if="isSideAgreementRemark"
            :main-file-id="fileId"
            :tree-id="treeId"
            :file-info="fileInfo">
          </side-agreement-compare-pdf>
        </template>
      </div>

      <div
        v-splitter="{
          leftEl: $refs.pdfViewerContainer,
          rightEl: $refs.rightAside,
          localStorageKey: 'FILE_REMARK_SPLITTER',
          minLeftRatio: 0.5,
          maxLeftRatio: 0.7,
        }"
        class="drag-splitter"></div>

      <div ref="rightAside" class="right-aside">
        <remark-predict-position
          v-if="this.predictPosition.result.length > 0"
          :answerItemMap="answerItemMap"
          :answerVersion="answerVersion">
        </remark-predict-position>

        <file-remark-and-inspect-aside
          v-if="isInspect"
          ref="fileRemarkAndInspectAside"
          :qid="qid"
          :file-id="fileId"
          :schema-id="schemaId"
          :scenario-id="remarkFile?.scenario_id"
          :viewerReady="viewerReady"
          :answerVersion="answerVersion"
          :answerItemMap="answerItemMap"
          :updatedAnswerKeys="updatedAnswerKeys"
          :reload-question="reloadQuestion"
          :read-only="isInspectReadOnly"
          :show-answer-panel="showAnswerPanel"
          :is-iframe-mode="isIframeMode"
          @change-answer-data="changeAnswerData"
          @submit-inspect-answer="
            submitInspectAnswer
          "></file-remark-and-inspect-aside>

        <template v-else>
          <ht-file-remark-aside
            v-if="$features.showHtRemarkAside()"
            :qid="qid"
            :answerVersion="answerVersion"
            :answerItemMap="answerItemMap"
            :reload-question="reloadQuestion"
            @reset-transfer-schema="resetTransferSchema"></ht-file-remark-aside>
          <citics-tg-file-remark-aside
            v-if="showCiticsTgRemarkAside"
            ref="citicsTgFileRemarkAside"
            :qid="qid"
            :fileId="fileId"
            :schemaId="schemaId"
            :compareRecordId="compareRecordId"
            :answerVersion="answerVersion"
            :answerItemMap="answerItemMap"
            :originalAnswerItemMap="originalAnswerItemMap"
            :isShowRuleAudit="!isCiticsTgDiffMode"
            :reload-question="reloadQuestion"
            :isOperatePerm="isOperatePerm"
            @submit-inspect-answer="
              submitInspectAnswer
            "></citics-tg-file-remark-aside>

          <div
            v-else
            class="file-remark-aside"
            v-show="showAnswerPanel"
            v-loading="!viewerReady">
            <file-remark-operate
              v-if="Object.keys(question).length > 0 || diffEnabled"
              :answerItemMap="answerItemMap"
              :answerVersion="answerVersion"
              :qid="qid"
              @reload-question="reloadQuestion"
              @reset-transfer-schema="resetTransferSchema">
            </file-remark-operate>
            <remark-validate-result
              v-if="errorTips.length > 0"></remark-validate-result>
            <div
              class="search-and-collpase-answer"
              v-if="Object.keys(this.currentSchema).length > 0">
              <file-remark-tree-nodes-searcher
                ref="fileRemarkTreeNodesSearcher"></file-remark-tree-nodes-searcher>

              <toggle-answer-collapse-state
                @toggle="toggleAllAnswerCollapseState">
              </toggle-answer-collapse-state>

              <file-remark-archived-answers
                v-if="$features.supportRestoreUserAnswer()"
                :qid="qid"
                @reload-question="reloadQuestion">
              </file-remark-archived-answers>
            </div>

            <hkex-significant-investment-ratio
              v-if="showHkexSignificantInvestmentRatio">
            </hkex-significant-investment-ratio>

            <file-remark-answer-panel
              :qid="qid"
              :schema-id="schemaId"
              :answerItemMap="answerItemMap"
              ref="remarkAnswer"></file-remark-answer-panel>
          </div>
        </template>
      </div>
    </div>

    <file-remark-diff
      v-if="showFileRemarkDiff"
      ref="fileRemarkDiff"
      :qid="qid"
      @close-diff-panel="showFileRemarkDiff = false"></file-remark-diff>
    <citics-tg-file-remark-diff
      v-if="isCiticsTgDiffMode"
      ref="citicsTgFileRemarkDiff"
      :projectId="projectId"
      :schemaId="schemaId"
      :compareRecordId="compareRecordId"></citics-tg-file-remark-diff>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { cloneDeep, omit } from 'lodash';
import FileRemarkSchemaAside from '@/components/remark/FileRemarkSchemaAside';
import RemarkPredictPosition from '../components/remark/FileRemarkPredictPosition';
import FileRemarkOperate from '../components/remark/FileRemarkOperate';
import RemarkValidateResult from '../components/remark/FileRemarkValidateResult';
import FileRemarkTreeNodesSearcher from '../components/remark/FileRemarkTreeNodesSearcher';
import FilePdfViewerContainer from '../components/remark/FilePdfViewerContainer';
import ExcelViewer from '@/components/remark/pdf-viewer/ExcelViewer';
import ToggleAnswerCollapseState from '../components/ToggleAnswerCollapseState.vue';
import {
  AI_PREDICT_STATUS_MAP,
  BasicSchemaTypes,
  INVALID_SCHEMA_IDS,
} from '@/store/constants';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { supplementSchemaAnswers } from '@/store/api/remark.api';
import {
  saveMergedAnswerData,
  fetchMergedAnswerData,
} from '@/store/api/rule-audit.api';
import {
  saveInspectAnswerData,
  fetchProbabilities,
} from '../store/api/cmfchina.api';
import {
  mixDeepInfo,
  generateBasicAnswerItemData,
  isValidBase64URL,
  parseQueryFromBase64EncodedUrl,
} from '@/utils';
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';
import FileRemarkAnswerPanel from '../components/remark/FileRemarkAnswerPanel';
import FileRemarkDiff from '../components/remark/FileRemarkDiff';
import CiticsTgFileRemarkDiff from '../custom/citics_tg/components/FileRemarkDiff';
import HtFileRemarkAside from '../custom/ht/components/FileRemarkAside';
import FileRemarkAndInspectAside from '@/components/FileRemarkAndInspectAside';
import FileRemarkArchivedAnswers from '@/components/remark/FileRemarkArchivedAnswers';
import CiticsTgFileRemarkAside from '../custom/citics_tg/components/FileRemarkAside';
import SideAgreementComparePdf from '../custom/citics_tg/components/SideAgreementComparePdf';
import HkexSignificantInvestmentRatio from '../custom/hkex/components/SignificantInvestmentRatio';
import { isCiticsTgAllow } from '../custom/citics_tg/common/utils';
import platformPerimeter from '@/perimeters/platform.perimeter';
import { isFileSourceByLocalUpload } from '@/custom/nafmii/common/utils';
import {
  FILE_SEARCH_DATA_KEYS,
  TASK_SEARCH_DATA_KEYS,
} from '@/custom/nafmii/common/constant';
import {
  getFieldStatus,
  getFieldProbability,
} from '../custom/cmfchina/common/utils';

export default {
  name: 'FileRemark',
  components: {
    FilePdfViewerContainer,
    ToggleAnswerCollapseState,
    FileRemarkSchemaAside,
    FileRemarkOperate,
    RemarkValidateResult,
    FileRemarkTreeNodesSearcher,
    RemarkPredictPosition,
    FileRemarkAnswerPanel,
    FileRemarkDiff,
    HtFileRemarkAside,
    FileRemarkAndInspectAside,
    FileRemarkArchivedAnswers,
    CiticsTgFileRemarkAside,
    SideAgreementComparePdf,
    CiticsTgFileRemarkDiff,
    HkexSignificantInvestmentRatio,
    ExcelViewer,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    qid: {
      type: Number,
      required: true,
    },
    schemaId: {
      type: Number,
      required: true,
    },
    projectId: {
      type: Number,
      required: true,
    },
    treeId: {
      type: Number,
      required: true,
    },
    showSchemaTree: {
      type: Boolean,
      require: false,
      default: false,
    },
    standardQid: {
      type: Number,
      require: false,
    },
  },
  data() {
    return {
      viewerReady: false,
      answerItemMap: {},
      answerVersion: '',
      fileInfo: {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      fileInfoReady: false,
      fileThumbnailVisible: false,
      fileThumbnailPageActived: 0,
      fileThumbnailHeight: 0,
      showFileRemarkDiff: false,
      pdfDocumentData: '',
      updatedAnswerKeys: new Set(),
      fetchQuestionTimer: null,
      mergedAnswerSaved: null,
      groupName: '',
      showAnswerPanel: true,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'treeData',
      'entity',
      'question',
      'originSchema',
      'currentSchema',
      'predictPosition',
      'errorTips',
      'answer',
      'customFieldAnswer',
      'diffEnabled',
      'remarkFile',
    ]),
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('ruleAuditModule', ['auditRules']),
    ...mapGetters(['loginUser']),
    ...mapGetters('nafmiiModule', ['tasks']),
    ...mapGetters('cmfchinaModule', ['fieldProbabilities']),
    isIframeMode() {
      return 'isIframe' in this.$route.query;
    },
    currentUserAnswer() {
      return this.question.answers.find(
        (answer) => answer.uid === this.loginUser.id,
      );
    },
    showFileRemarkSchemaSideBar() {
      return (
        this.$platform.isHkexEnv() &&
        this.showSchemaTree &&
        this.treeData !== null
      );
    },
    isFromCscOctopus() {
      return this.$route.meta.noAuth;
    },
    isInspect() {
      return ['inspect', 'inspectBase64Encoded'].includes(this.$route.name);
    },
    isUseFileAnswer() {
      return this.isInspect || this.showCiticsTgRemarkAside;
    },
    originalAnswerItemMap() {
      return this.answer.items?.reduce((obj, item) => {
        obj[item.key] = item;
        return obj;
      }, {});
    },
    showCiticsTgRemarkAside() {
      return (
        this.$features.showCiticsTgRemarkAside() && this.$route.meta.isCustom
      );
    },
    isSideAgreementRemark() {
      const currentSchemaName = this.currentSchema?.schemas?.[0].name;
      return (
        currentSchemaName?.includes('补充协议') &&
        this.showCiticsTgRemarkAside &&
        !this.isCiticsTgDiffMode
      );
    },
    compareRecordId() {
      return Number(this.$route.query.compareRecordId) || null;
    },
    isCiticsTgDiffMode() {
      return this.standardQid && this.showCiticsTgRemarkAside;
    },
    isOperatePerm() {
      const userGroupNames = this.loginUser.group_name.split(',');
      return (
        !this.loginUser.group_name || userGroupNames.includes(this.groupName)
      );
    },
    showHkexSignificantInvestmentRatio() {
      return (
        platformPerimeter.isHkexEnv() && Object.keys(this.question).length > 0
      );
    },
    isPdfReadOnly() {
      if (this.$platform.isNafmiiEnv() && this.isInspect) {
        return !isFileSourceByLocalUpload(this.remarkFile?.source);
      }
      if (this.showCiticsTgRemarkAside) {
        return this.$refs.citicsTgFileRemarkAside?.readOnly;
      }
      return false;
    },
    isInspectReadOnly() {
      if (this.$platform.isNafmiiEnv()) {
        return this.isPdfReadOnly;
      }
      return false;
    },
    isExcel() {
      return ['xls', 'xlsx'].includes(this.$route.query.fileSuffix);
    },
  },
  watch: {
    answer(answerData) {
      if (this.showCiticsTgRemarkAside) {
        if (
          (this.diffEnabled && !isCiticsTgAllow('prj_detail_compare')) ||
          (!this.diffEnabled && !isCiticsTgAllow('prj_detail_file_para'))
        ) {
          return;
        }
      }
      if (answerData.items) {
        let allAnswerItems = [];
        if (this.customFieldAnswer?.items) {
          allAnswerItems = answerData.items.concat(
            this.customFieldAnswer.items,
          );
        } else {
          allAnswerItems = answerData.items;
        }
        this.answerItemMap = allAnswerItems.reduce((obj, item) => {
          obj[item.key] = item;
          return obj;
        }, {});
      }
      if (answerData.version) {
        this.answerVersion = answerData.version;
      }
      if (this.$platform.isCmfchinaEnv()) {
        this.getAnswerItemAuditStatus();
      }
    },
    '$route.query'(newQuery, oldQuery) {
      if (!this.isCiticsTgDiffMode) {
        if (this.$platform.isNafmiiEnv()) {
          const newQueryWithoutType = { ...newQuery };
          const oldQueryWithoutType = { ...oldQuery };
          delete newQueryWithoutType.type;
          delete oldQueryWithoutType.type;
          if (!_.isEqual(newQueryWithoutType, oldQueryWithoutType)) {
            this.init();
          }
        } else {
          this.init();
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.name === 'inspectBase64Encoded') {
      if (!isValidBase64URL(to.params.base64EncodedString)) {
        next('/404');
        return;
      }
    }
    next();
  },
  created() {
    EventBus.$on('answer-item-updated', this.answerItemUpdated);
    EventBus.$on('answer-item-removed', this.answerItemRemoved);
    EventBus.$on('supplement-schema-answers', this.supplementSchemaAnswers);
    EventBus.$on('custom-schema-node-added', this.customSchemaNodeAdded);
    this.init();
  },
  beforeDestroy() {
    this.$store.commit('remarkModule/SET_MERGED_TREEDATA', []);

    EventBus.$off('answer-item-updated', this.answerItemUpdated);
    EventBus.$off('answer-item-removed', this.answerItemRemoved);
    EventBus.$off('supplement-schema-answers', this.supplementSchemaAnswers);
    EventBus.$off('custom-schema-node-added', this.customSchemaNodeAdded);

    if (this.fetchQuestionTimer) {
      clearTimeout(this.fetchQuestionTimer);
    }
  },
  methods: {
    async init() {
      this.reset();
      try {
        if (this.$features.supportToggleAnswerPanel()) {
          this.initAnswerPanelToggleStatus();
        }
        await this.fetchFileInfo();
        if (!INVALID_SCHEMA_IDS.includes(this.schemaId)) {
          await this.fetchSchema();
          await this.fetchQuestion();
        }
        await this.setCurrentSchema();
        if (
          !this.showCiticsTgRemarkAside ||
          (this.diffEnabled && isCiticsTgAllow('prj_detail_compare')) ||
          (!this.diffEnabled && isCiticsTgAllow('prj_detail_file_para'))
        ) {
          await this.initAnswerMap();
        }
        this.fetchFileList();
        this.setHTFileReadonlyStatus();
        if (this.$platform.isCmfchinaEnv()) {
          await this.getFieldProbabilities();
          this.getAnswerItemAuditStatus();
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('remarkModule/SET_ERROR_TIPS', []);
        this.viewerReady = true;
      }
    },
    async fetchFileInfo() {
      if (this.isExcel) {
        return;
      }
      const data = await this.$store.dispatch('remarkModule/fetchRemarkFile', {
        id: this.fileId,
        isCustom: this.showCiticsTgRemarkAside,
        from: this.$route.query.from,
      });
      this.groupName = data?.group_name || '';
      if (data.meta_info && data.meta_info.is_ocr_expired) {
        this.$notify({
          title: this.$t(`message['警告']`),
          message: data.meta_info.ocr_expired_msg,
          type: 'warning',
        });
      }

      const fileInfo = {
        ...this.$route.query,
        fileName: data.name,
      };
      const href = this.showCiticsTgRemarkAside
        ? '#/citics-tg/projectList'
        : '#/project';
      const filePath = [{ name: this.$text.file['总览'], href }].concat(
        data.crumbs &&
          data.crumbs.map((path) => ({
            name: path.name,
            href: `${href}/${
              this.$route.params.projectId || this.$route.query.projectId
            }/tree/${path.id}`,
          })),
      );

      fileInfo.filePath = filePath;

      const [pageInfo, outline] = await Promise.all([
        this.getFilePageInfo(),
        this.getFileOutline(),
      ]);
      if (pageInfo && pageInfo[0]) {
        this.fileThumbnailHeight =
          (160 * pageInfo[0].height) / pageInfo[0].width;
      }

      fileInfo.pageInfo = pageInfo;
      fileInfo.outline = outline;

      this.fileInfo = fileInfo;
      this.fileInfoReady = true;
    },
    async getFilePageInfo() {
      const { data } = await fetchFilePageInfo(this.fileId);
      return data;
    },
    async getFileOutline() {
      const { data } = await fetchFileOutline(this.fileId);
      const outline = {
        items: data ? data.children : [],
      };
      const buildOutlines = function (data) {
        data.forEach((item) => {
          if (item.level === 3) {
            item.children = [];
          } else {
            buildOutlines(item.children);
          }
        });
      };
      buildOutlines(outline.items);

      return outline;
    },
    async fetchSchema() {
      await this.$store.dispatch('remarkModule/fetchSchema', {
        id: this.schemaId,
        isAuto: true,
      });
    },
    async fetchQuestion() {
      const params = { qid: this.qid };
      if (this.isUseFileAnswer) {
        Object.assign(params, { fileId: this.fileId });
      }
      const result = await this.$store.dispatch(
        'remarkModule/fetchQuestion',
        params,
      );
      clearTimeout(this.fetchQuestionTimer);
      if (this.question.ai_status === AI_PREDICT_STATUS_MAP.DOING) {
        this.fetchQuestionTimer = setTimeout(() => {
          this.fetchQuestion();
        }, 180e3);
      } else {
        if (
          !this.showCiticsTgRemarkAside ||
          (this.diffEnabled && isCiticsTgAllow('prj_detail_compare')) ||
          (!this.diffEnabled && isCiticsTgAllow('prj_detail_file_para'))
        ) {
          await this.initAnswerMap();
        }
      }

      if (this.$features.supportLLMExtract()) {
        const inspectRef = this.$refs.fileRemarkAndInspectAside;
        if (inspectRef) {
          inspectRef.currentAnswerMoldId =
            inspectRef.currentAnswerMoldId ||
            Number(this.$route.query.schemaId);
          inspectRef.setAnswerData();
        }
      }

      return result;
    },
    async setCurrentSchema() {
      let curSchema = {};
      if (this.question.answers && this.question.answers.length > 0) {
        let answerSchema = {};
        if (this.currentUserAnswer) {
          answerSchema = cloneDeep(this.currentUserAnswer.data.schema);
          await this.$store.dispatch(
            'schemaModule/updateTreeData',
            answerSchema,
          );
        } else {
          answerSchema = cloneDeep(this.question.answers[0].data.schema);
        }
        curSchema = answerSchema;
        this.$store.dispatch('schemaModule/fetchTransferData', {
          id: this.schemaId,
          oldSchema: answerSchema,
        });
      } else if (this.question.mold) {
        curSchema = this.question.mold.data;
      } else {
        curSchema = this.originSchema;
      }
      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', curSchema); // set answerSchema
    },
    async reloadQuestion() {
      if (this.diffEnabled) {
        if (this.isCiticsTgDiffMode) {
          this.$refs.citicsTgFileRemarkDiff.reloadDiffAnswer();
        } else {
          this.$refs.fileRemarkDiff.reloadDiffAnswer();
        }
        this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', {});

        return;
      }
      await RemarkTreeLoading.start();
      this.$store.commit('remarkModule/SET_QUESTION', {});
      await this.fetchQuestion();
      this.initAnswerMap();
      RemarkTreeLoading.close();
    },
    async resetTransferSchema() {
      this.$store.commit('remarkModule/SET_MERGED_TREEDATA', []);
      this.$store.commit('remarkModule/SET_QUESTION', {});

      await this.fetchQuestion();

      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', this.originSchema);
      this.$store.dispatch('remarkModule/initAnswerTree');
    },
    reset() {
      this.$store.commit('remarkModule/SET_QUESTION', {});
      this.$store.commit('remarkModule/SET_USER_ANSWER', {});
      this.$store.commit('remarkModule/SET_ANSWER_SCHEMA', {});
      this.$store.commit('remarkModule/SET_CONFLICT_MAPS', []);
      this.$store.commit('remarkModule/SET_PREDICT_POSITION', []);
      this.$store.commit('remarkModule/SET_PREDICT_LABEL', '');
      this.$store.commit('remarkModule/SET_CURRENT_CONFLICT_MAP', -1);
      this.$store.commit('remarkModule/SET_ANSWER_GROUP_PAGE_INFO', {});
      this.viewerReady = false;
      this.fileInfoReady = false;
      this.fileInfo = {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      };
    },
    async initAnswerMap() {
      if (
        (this.$platform.isNafmiiEnv() && _.isEmpty(this.answer)) ||
        !this.answer.items
      ) {
        return;
      }
      await this.$store.dispatch('remarkModule/initAnswerTree');
    },
    async fetchFileList() {
      const { page, size } = this.$route.query;
      if (this.$platform.isNafmiiEnv() && this.$route.query.from === 'task') {
        if (this.tasks.files.length === 0) {
          if (page) {
            const pager = {
              ...this.tasks.pager,
              page: Number(page),
              size: Number(size),
            };
            this.$store.commit('nafmiiModule/SET_TASKS_PAGER', pager);
          }
          const searchData = {};
          Object.keys(this.$route.query).forEach((key) => {
            const isSearch = TASK_SEARCH_DATA_KEYS.findIndex(
              (item) => item === key,
            );
            if (isSearch !== -1) {
              searchData[key] = this.$route.query[key];
            }
          });
          this.$store.commit(
            'nafmiiModule/SET_TASKS_SEARCH_PARAMS',
            searchData,
          );
          await this.$store.dispatch('nafmiiModule/getTasks', { isAuto: true });
        }
      } else if (this.fileViewer.files.length === 0) {
        if (page) {
          const pager = {
            ...this.fileViewer.pager,
            page: Number(page),
            size: Number(size),
          };
          this.$store.commit('detailModule/SET_FILES_PAGER', pager);
        }
        if (this.$platform.isNafmiiEnv()) {
          const searchData = {};
          Object.keys(this.$route.query).forEach((key) => {
            const isSearch = FILE_SEARCH_DATA_KEYS.findIndex(
              (item) => item === key,
            );
            if (isSearch !== -1) {
              searchData[key] = this.$route.query[key];
            }
          });
          this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', searchData);
        }
        if (this.$platform.isCgsEnv()) {
          const searchParams = {};
          const searchKeys = [
            'manager_name',
            'product_name',
            'fileid',
            'filename',
            'username',
          ];
          searchKeys.forEach((key) => {
            if (this.$route.query[key]) {
              searchParams[key] = this.$route.query[key];
            }
          });
          this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', searchParams);
        }
        this.$store.commit('detailModule/SET_DIR_ID', this.treeId);
        await this.$store.dispatch('detailModule/fetchFileList', {
          isCustom: this.showCiticsTgRemarkAside,
          projectId: this.projectId,
          isAuto: true,
        });
      }
    },
    answerItemUpdated(answerData) {
      const answerItemMapUpdated = cloneDeep(this.answerItemMap);
      answerData.forEach((item) => {
        if (item._migrated === true) {
          item._migrated = false;
        }
        if (item.custom) {
          item.edited = true;
        }
        answerItemMapUpdated[item.key] = item;
        this.updatedAnswerKeys.add(item.key);
      });

      this.answerItemMap = answerItemMapUpdated;

      if (this.isUseFileAnswer) {
        this.saveInspectAnswer('update', answerData);
      }
    },
    answerItemRemoved(answerKeys) {
      answerKeys.forEach((key) => {
        this.updatedAnswerKeys.add(key);
      });
      this.answerItemMap = cloneDeep(omit(this.answerItemMap, answerKeys));
      if (!this.$platform.isCmfchinaEnv()) {
        EventBus.$emit('remove-all-frames');
      }

      if (this.isUseFileAnswer) {
        this.saveInspectAnswer('delete', answerKeys);
      }
    },
    toggleAllAnswerCollapseState() {
      this.$refs.fileRemarkTreeNodesSearcher.highlightCurrentSearchNodes();
      this.$refs.remarkAnswer.toggleAllAnswerCollapseState();
    },
    async supplementSchemaAnswers({ key }) {
      try {
        await RemarkTreeLoading.start();
        this.$store.commit('remarkModule/SET_MERGED_TREEDATA', []);
        await this.$nextTick();

        const data = {
          key,
          answer: {
            schema: this.originSchema,
            userAnswer: {
              version: this.answerVersion,
              items: Object.keys(this.answerItemMap).map(
                (answerItemKey) => this.answerItemMap[answerItemKey],
              ),
            },
          },
        };

        const answerUpdatedRes = await supplementSchemaAnswers(this.qid, data);
        this.$store.dispatch(
          'remarkModule/switchUserAnswer',
          answerUpdatedRes.data.userAnswer,
        );
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        RemarkTreeLoading.close();
      }
    },
    customSchemaNodeAdded(children) {
      children.forEach((child) => {
        const key = JSON.stringify(mixDeepInfo(child.meta));
        const data = child.data;
        const answerItem = generateBasicAnswerItemData({ key, data });
        this.answerItemMap[key] = answerItem;
      });
    },
    openRemarkDiff() {
      this.showFileRemarkDiff = !this.showFileRemarkDiff;
    },
    setHTFileReadonlyStatus() {
      const currentFile = this.fileViewer.files.find(
        (file) => file.id === this.fileId,
      );
      if (currentFile) {
        const hasAnnotationPath = currentFile.annotation_path;
        this.$store.commit(
          'detailModule/SET_CURRENT_FILE_READONLY',
          !!hasAnnotationPath,
        );
      }
    },
    async saveInspectAnswer(type, answers) {
      const answerData = this.mergedAnswerSaved || {
        add: [],
        delete: [],
        update: [],
      };

      answers.forEach((item) => {
        Object.keys(answerData).forEach((key) => {
          answerData[key] = answerData[key].filter(
            (i) => i.key !== (type === 'delete' ? item : item.key),
          );
        });
      });

      if (type === 'update') {
        answers.forEach((item) => {
          const answerItem = this.originalAnswerItemMap[item.key];
          if (answerItem) {
            if (
              !_.isEqual(answerItem.data, item.data) ||
              !_.isEqual(answerItem.value, item.value) ||
              !_.isEqual(answerItem.revise_suggestion, item.revise_suggestion)
            ) {
              item.id = answerItem.id;
              answerData.update.push(
                _.pick(item, [
                  'id',
                  'key',
                  'value',
                  'data',
                  'item',
                  'revise_suggestion',
                  this.$features.supportLLMExtract() ? 'qid' : undefined,
                ]),
              );
            }
          } else {
            item.revise_suggestion = false;
            item.mold_id =
              this.$refs.fileRemarkAndInspectAside?.currentAnswerMoldId;
            answerData.add.push(
              _.pick(item, [
                'key',
                'value',
                'data',
                'schema',
                'revise_suggestion',
                this.$features.supportLLMExtract() ? 'mold_id' : undefined,
              ]),
            );
          }
        });
      }

      if (type === 'delete') {
        answers.forEach((itemKey) => {
          const answerItem = this.originalAnswerItemMap[itemKey];
          if (answerItem) {
            const answerParentKey = JSON.parse(itemKey)
              .slice(0, -1)
              .map((item) => item.split(':')[0])
              .pop();

            const answerParentItem =
              this.currentSchema.schemas[0].schema[answerParentKey];

            if (
              answerParentItem &&
              !BasicSchemaTypes.includes(answerParentItem.type)
            ) {
              // 父级是组合类型
              answerData.delete.push(_.pick(answerItem, ['id', 'key']));
            } else {
              answerData.update.push({
                ..._.pick(answerItem, [
                  'id',
                  'key',
                  'value',
                  'revise_suggestion',
                  this.$platform.isCmfchinaEnv() ? 'qid' : undefined,
                ]),
                data: [],
              });
            }
          }
        });
      }

      this.mergedAnswerSaved = answerData;

      EventBus.$emit(
        'toggle-submit-answer-disabled',
        Object.values(answerData).every((i) => i.length === 0),
      );
    },
    async submitInspectAnswer() {
      try {
        EventBus.$emit('toggle-submit-answer-loading', true);

        if (this.diffEnabled) {
          for (let i in this.mergedAnswerSaved) {
            this.mergedAnswerSaved[i].forEach((item) => {
              delete item.similarity;
              item.data.forEach((data) => {
                delete data.pair_index;
                delete data.similarity;
              });
            });
          }
        }
        const answerData = this.mergedAnswerSaved || {
          add: [],
          delete: [],
          update: [],
        };

        const keysToUpdate = answerData.add
          .concat(answerData.update)
          .map((item) => item.key);

        if (this.$platform.isCmfchinaEnv()) {
          await saveInspectAnswerData(this.fileId, answerData);
        } else {
          await saveMergedAnswerData({
            fileId: this.fileId,
            answerData,
          });
        }

        this.mergedAnswerSaved = null;
        if (this.diffEnabled) {
          if (this.isCiticsTgDiffMode) {
            this.$refs.citicsTgFileRemarkDiff.reloadDiffAnswer();
          }
          this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', {});
        } else {
          let answer_data = [];
          if (this.$platform.isCmfchinaEnv()) {
            const res = await this.fetchQuestion();
            answer_data = res.find(
              (item) =>
                item.mold.id ===
                this.$refs.fileRemarkAndInspectAside?.currentAnswerMoldId,
            )?.answer_data;
          } else {
            const res = await fetchMergedAnswerData({ fileId: this.fileId });
            if (this.$features.supportLLMExtract()) {
              answer_data = res.find(
                (item) =>
                  item.mold.id ===
                  this.$refs.fileRemarkAndInspectAside?.currentAnswerMoldId,
              )?.answer_data;
            } else {
              answer_data = res.data.answer_data;
            }
          }

          keysToUpdate.forEach((schemaNode) => {
            const answer = answer_data.find((item) => item.key === schemaNode);
            if (answer) {
              EventBus.$emit('sync-remark-answer', { schemaNode, answer });
            }
          });

          this.$store.commit('remarkModule/SET_USER_ANSWER', {
            items: answer_data,
          });

          if (this.showCiticsTgRemarkAside) {
            this.$refs.citicsTgFileRemarkAside.getRuleAuditResult();
          }
        }

        this.initAnswerMap();

        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$platform.isCmfchinaEnv()
            ? '答案保存成功，已发起重新审核'
            : this.$t(`message['答案保存成功']`),
          type: 'success',
        });

        EventBus.$emit('after-submit-inspect-answer');

        EventBus.$emit('toggle-submit-answer-disabled', true);

        this.resetAllWidgets();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        EventBus.$emit('toggle-submit-answer-loading', false);
      }
    },
    initAnswerPanelToggleStatus() {
      if (this.$route.name === 'inspectBase64Encoded') {
        const query = parseQueryFromBase64EncodedUrl(
          this.$route.params.base64EncodedString,
        );
        this.showAnswerPanel = query.showAnswerPanel !== 'false';
        return;
      }
      this.showAnswerPanel = this.$route.query.showAnswerPanel !== 'false';
    },
    toggleAnswerPanel() {
      this.showAnswerPanel = !this.showAnswerPanel;
    },
    getAnswerItemAuditStatus() {
      for (const key in this.answerItemMap) {
        const answerItem = this.answerItemMap[key];
        const probability = getFieldProbability(
          this.fieldProbabilities,
          answerItem.mold_field_id,
        );
        answerItem.fieldStatus = getFieldStatus(
          answerItem,
          this.auditRules,
          [],
          probability,
        );
      }
    },
    async getFieldProbabilities() {
      try {
        const res = await fetchProbabilities(this.schemaId);
        this.$store.commit('cmfchinaModule/SET_FIELD_PROBABILITIES', res);
      } catch (error) {
        this.notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleCellSelected(cellData, selectedAnswerKey, isEditMode) {
      EventBus.$emit(
        'excel-cell-selected',
        cellData,
        selectedAnswerKey,
        isEditMode,
      );
    },
    resetAllWidgets() {
      if (this.$platform.isCmfchinaEnv()) {
        const pdfViewerContainer = this.$refs.pdfViewerContainer;
        if (!pdfViewerContainer) {
          return;
        }
        pdfViewerContainer.resetWidgets();
        pdfViewerContainer.resetNodeSelected();
        pdfViewerContainer.showAllAnswerBoxes(true);
      }
    },
    changeAnswerData() {
      this.resetAllWidgets();
    },
  },
};
</script>

<style lang="scss" scoped>
.file-remark-wrapper {
  display: flex;
  flex-flow: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
}

.file-remark-container {
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
  .right-aside {
    display: flex;
    flex: 1;
    min-width: 30%;
  }
}

.file-viewer-wrapper {
  position: relative;
  height: 100%;
  width: 60%;
  overflow: hidden;

  ::v-deep .toolbar {
    z-index: 99;
  }
  &.file-viewer-box {
    display: flex;
    flex-direction: column;
    .file-pdf-viewer-container:first-child {
      flex: 1;
    }
    .side-agreement-bottom-viewer {
      max-height: 40%;
    }
  }
}

.file-remark-aside {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease;

  ::v-deep .v-modal {
    z-index: 10000 !important;
  }
}

.search-and-collpase-answer {
  .el-tooltip {
    cursor: pointer;
    color: #666;
    &:hover {
      color: $--color-primary !important;
    }
  }

  .collapsed {
    transform: rotate(180deg);
  }

  > div:first-of-type {
    flex: 1;
  }

  i {
    width: 40px;
    height: 28px;
    line-height: 28px;
    text-align: center;

    &::before {
      font-size: 18px;
    }
  }
}

.csc-octopus {
  ::v-deep .image-viewer-container {
    .header-left {
      display: none;
    }

    .header-pagebar {
      margin-left: 45%;
    }
  }
}
.citics-tg-remark {
  ::v-deep .pdf-viewer-thumbnail {
    height: 100%;
  }
}
</style>
