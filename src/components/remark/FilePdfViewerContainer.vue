<template>
  <div class="file-pdf-viewer-container">
    <pdf-viewer
      ref="pdfViewer"
      :file-id="fileId"
      :file-info="fileInfo"
      :pdf-widget-types="pdfWidgetTypes"
      :default-scale="defaultScale"
      :show-toolbar="isShowToolbar"
      :show-go-back-button="showGoBackButton"
      :show-thumb-button="showThumbButton"
      :show-chapter-button="showChapterButton"
      :show-file-info="showFileInfo"
      :is-iframe-mode="isIframeMode"
      :show-chapter-tree="isShowChapterTree"
      :answerItemMap="answerItemMap"
      :show-thumbnaill="isShowThumbnaill"
      :thumbnail-list="thumbnailList"
      :thumbnail-page-actived="thumbnailPageActived"
      :read-only="isReadOnly"
      @copy-text-by-rect="copyTextByRect"
      @toggle-thumbnail="toggleThumbnail"
      @toggle-chapter="toggleChapter"
      @chapter-node-cliked="chapterNodeCliked"
      @thumbnail-page-cliked="thumbnailPageClicked"
      @scale-change="handleScaleChange"
      @page-change="handlePageChange"
      @pages-loaded="handlePagesLoaded"
      @page-rendered="handlePageRendered"
      @widget-clicked="handleWidgetClicked"
      @drawing-end="drawWidget"
      @annotation-rendered="handleAnnotationRendered"
      @viewer-ready="handleViewerReady">
      <template slot="toolbar">
        <nafmii-toggle-button v-if="isShowNafmiiInspect" />
        <slot name="toolbar"></slot>
      </template>
      <template slot="announcement-name">
        <nafmii-announcement-name-banner v-if="isShowNafmiiInspect" />
      </template>
    </pdf-viewer>

    <draw-widget-switch
      v-if="!isReadOnly"
      :draw-widget-mode-actived="drawWidgetModeActived"
      :draw-widget-mode="drawWidgetMode"
      :multiple-widget-drawed.sync="multipleWidgetDrawed"
      :show-page-blocks="showPageBlocks"
      :show-page-blocks-loading="showPageBlocksLoading"
      :show-answer-panel="showAnswerPanel"
      :button-visibility-config="{
        showOnlyBlocksButton: isSmartAuditTab,
        showAllButtons: isLLMEditDialogVisible,
      }"
      @draw-widget-mode-change="changeDrawWidgetMode"
      @multiple-drawed-item-clicked="scrollToPage"
      @remove-multiple-drawed-item="removeMultipleWidgetDrawedItem"
      @combine-multiple-drawed-item="combineMultipleWidget"
      @toggle-answer-panel="toggleAnswerPanel"></draw-widget-switch>

    <div v-if="showFileName" class="file-name">{{ fileInfo.fileName }}</div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { isEqual, isEmpty, cloneDeep } from 'lodash';
import { v4 as uuid4 } from 'uuid';
import {
  convertPredictionDataToAnnotationData,
  PredictAnnotationTypesLabel,
} from '@paoding/prediction-tools';
import pdfViewer from 'env-pdf-viewer';
import DrawWidgetSwitch from './pdf-viewer/add-ons/DrawWidgetSwitch';
import NafmiiToggleButton from '../../custom/nafmii/components/ToggleButton';
import NafmiiAnnouncementNameBanner from '../../custom/nafmii/components/AnnouncementNameBanner';
import ViewerMixin from './pdf-viewer/Viewer.mixin';
import FileMarkableMixin from '../mixins/FileMarkableMixin';

import EventBus from './remark-tree/EventBus';
import {
  mixDeepInfo,
  normalizeArrayJSON,
  parseQueryFromBase64EncodedUrl,
  getAnswerItemMd5,
} from '@/utils';
import { copyTextToClipboard } from '../../utils/clipboard';
import { baseURL } from '../../store/api/http';
import { fetchFileOutline } from '@/store/api/file.api';
import { fetchOutlines } from '@/store/api/detail.api.js';

import { FIELD_STATUS_MAP } from '../../custom/cmfchina/common/constant';
import { getWidgetClassNames } from '../../custom/cmfchina/common/utils';
import * as chrono from 'chrono-node';
import { isENLang } from '@/store/constants';

export default {
  name: 'FilePDFViewerContainer',
  components: {
    pdfViewer,
    DrawWidgetSwitch,
    NafmiiToggleButton,
    NafmiiAnnouncementNameBanner,
  },
  mixins: [ViewerMixin, FileMarkableMixin],
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileInfo: {
      type: Object,
      required: true,
    },
    fileDocType: {
      type: String,
      required: false,
    },
    defaultScale: {
      type: Number,
      default: -1,
    },
    answerItemMap: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isDiffMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    showCrossPageAnnotationArrow: {
      type: Boolean,
      default: false,
    },
    showAnswerPanel: {
      type: Boolean,
      required: false,
      default: true,
    },
    isShowFileInfo: {
      type: Boolean,
      required: false,
      default: true,
    },
    isShowGoBackButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    isShowThumbButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    isShowChapterButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    canContinuousDrawWidget: {
      type: Boolean,
      required: false,
      default: true,
    },
    isInspect: {
      type: Boolean,
      required: false,
    },
    isIframeMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      thumbnailPageActived: 0,
      isShowThumbnaill: false,
      isShowToolbar: import.meta.env.VITE_DIST !== 'HKEX',
      isShowChapterTree: false,
      pageNumber: 1,
      answerWidgets: [],
      answerWidgetsTemp: [],
      predictionWidget: [],
      answerDiffWidgets: [],
      drawWidgetMode: { selectText: -1, single: 0, multiple: 1, blocks: 2 },
      drawWidgetModeActived: 0,
      multipleWidgetDrawed: { schemaNode: '', boxes: [], uuid: [] },
      sidebarOpened: false,
      pageBlocks: {},
      showPageBlocks: false,
      showPageBlocksLoading: false,
      thumbnailList: [],
      rectCopyText: '',
      pdfWidgetTypes: [],
      isLLMEditDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['diffEnabled', 'remarkFile', 'remarkTab']),
    showFileName() {
      return this.diffEnabled && !this.$features.showCiticsTgRemarkAside();
    },
    showGoBackButton() {
      return (
        this.$route.name !== 'inspectBase64Encoded' &&
        this.isShowGoBackButton &&
        !this.isIframeMode
      );
    },
    showThumbButton() {
      return this.isShowThumbButton;
    },
    showChapterButton() {
      return this.isShowChapterButton;
    },
    showFileInfo() {
      return (
        this.$route.name !== 'inspectBase64Encoded' &&
        this.isShowFileInfo &&
        !this.$route.query.notProjectFile
      );
    },
    isReadOnly() {
      // 在智能审核tab下，始终允许元素块提取操作
      if (
        this.$isAllowed('showFileScenario') &&
        this.remarkTab === 'ruleAudit'
      ) {
        return false;
      }

      // inspect审核页面中只有tab为要素提取时，可以进行画框等操作。
      if (this.isInspect && this.remarkTab && this.remarkTab !== 'remark') {
        return true;
      }
      return (
        this.readOnly ||
        (this.$features.showCiticsTgRemarkAside() && this.isDiffMode) ||
        this.$platform.isCiticsDCMEnv()
      );
    },
    isShowNafmiiInspect() {
      return this.$platform.isNafmiiEnv() && this.isInspect;
    },
    isSmartAuditTab() {
      // 判断是否在智能审核tab下
      return (
        this.$isAllowed('showFileScenario') && this.remarkTab === 'ruleAudit'
      );
    },
  },
  watch: {
    async fileId() {
      this.resetViewer();
    },
    answerItemMap() {
      if (this.nodeSelected) {
        const answer = this.answerItemMap[this.nodeSelected.schemaNodeKey];

        if (answer) {
          this.nodeSelected.answer = answer;
        } else {
          delete this.nodeSelected.answer;
          this.removeWidgetsBySchemaNode(this.nodeSelected);
        }
      }

      if (this.nodeAnswerSelected) {
        const answer =
          this.answerItemMap[this.nodeAnswerSelected.schemaNodeKey];
        if (answer) {
          const isNodeAnswerSelectedBeRemoved = !answer.data.some(
            (answerItemData) =>
              isEqual(answerItemData, this.nodeAnswerSelected.data),
          );
          if (isNodeAnswerSelectedBeRemoved) {
            this.removeWidgetsBySchemaNode(this.nodeAnswerSelected);
            this.nodeAnswerSelected = null;
          }
        } else {
          this.removeWidgetsBySchemaNode(this.nodeAnswerSelected);
          this.nodeAnswerSelected = null;
        }
      }
    },
    diffEnabled() {
      this.resetWidgets();
    },
    remarkTab(value) {
      this.handleRemarkAsideTabChanged(value);
    },
  },
  created() {
    EventBus.$on('answer-item-updated', this.answerItemUpdated);
    EventBus.$on('llm-edit-dialog-opened', this.handleLLMEditDialogOpened);
    EventBus.$on('llm-edit-dialog-closed', this.handleLLMEditDialogClosed);
  },
  beforeDestroy() {
    EventBus.$off('answer-item-updated', this.answerItemUpdated);
    EventBus.$off('llm-edit-dialog-opened', this.handleLLMEditDialogOpened);
    EventBus.$off('llm-edit-dialog-closed', this.handleLLMEditDialogClosed);
    this.resetViewer();
    this.$refs.pdfViewer.$el.removeEventListener(
      'keydown',
      this.keyDownHandler,
    );
  },
  methods: {
    handleViewerReady() {
      if (this.$features.supportToggleAnswerPanel()) {
        this.setDefaultDrawWidgetMode();
      }
      if (this.showThumbButton) {
        this.getThumbnails();
      }
      if (!this.isDiffMode) {
        if (this.$features.supportRemarkAnswerDiff()) {
          this.addRemarkAnswerDiffButton();
        }
        this.handleChapterEmpty();
      }

      this.jumpToPageNumberFromUrl();

      this.$refs.pdfViewer.$el.addEventListener('keydown', this.keyDownHandler);

      this.$emit('viewer-ready');

      EventBus.$emit('viewer-ready');

      if (this.$platform.isCmfchinaEnv()) {
        this.showAllAnswerBoxes(true);
      }
    },
    async getThumbnails() {
      for (let i = 0; i < this.fileInfo.pageInfo.length; i++) {
        if (this.$refs.pdfViewer && this.$refs.pdfViewer.app) {
          const pageThumbnail =
            await this.$refs.pdfViewer.app.getThumbnailImage(i + 1);
          pageThumbnail.page = i;
          this.thumbnailList.push(pageThumbnail);
        } else {
          this.thumbnailList.push({
            page: i,
            url: `${baseURL}/plugins/fileapi/files/${this.fileId}/pages/${i}/image/160.jpg`,
          });
        }
      }
    },

    getScale() {
      return this.$refs.pdfViewer.getScale();
    },

    setScale(scale) {
      this.$refs.pdfViewer.setScale(scale);
    },

    async toggleThumbnail() {
      if (!this.isShowThumbnaill && this.sidebarOpened) {
        const outlineButton = document.querySelector(
          '.header-left > li:nth-of-type(3)',
        );
        if (outlineButton) {
          outlineButton.click();
        }
      }
      this.isShowChapterTree = false;
      this.isShowThumbnaill = !this.isShowThumbnaill;
      this.toggleToolbarButtonActiveStatus('thumbnail', this.isShowThumbnaill);

      await this.$nextTick();
      if (this.isShowThumbnaill) {
        const page = this.$refs.pdfViewer.currentPageNumber - 1;
        this.thumbnailPageActived = page;
        this.jumpToThumbnailPageNumber(page);
      }
      this.$refs.pdfViewer.setScaleSelectValue?.(-1);
      this.$refs.pdfViewer.setScale();
      this.handleScaleChange(this.getScale());
    },

    async toggleChapter() {
      this.isShowThumbnaill = false;
      this.isShowChapterTree = !this.isShowChapterTree;
      this.toggleToolbarButtonActiveStatus('chapter', this.isShowChapterTree);

      await this.$nextTick();
      this.jumpToChapter();
      this.$refs.pdfViewer.setScaleSelectValue?.(-1);
      this.$refs.pdfViewer.setScale();
      this.handleScaleChange(this.getScale());
    },

    toggleToolbarButtonActiveStatus(name, needActive) {
      const toolbarButtons =
        this.$refs.pdfViewer.$el.querySelectorAll('.toolbar-button');
      const toolbarButton = this.$refs.pdfViewer.$el.querySelector(
        `.toolbar-button.${name}`,
      );
      toolbarButtons.forEach((item) => {
        item.classList.remove('active');
      });
      if (needActive) {
        toolbarButton?.classList.add('active');
      } else {
        toolbarButton?.classList.remove('active');
      }
    },

    thumbnailPageClicked(page) {
      this.thumbnailPageActived = page;
      this.jumpToPageNumber(page);
    },

    chapterNodeCliked(data) {
      this.scrollToPage(data.page + 1, [0, data.box[1]]);
    },

    handleScaleChange(scale) {
      this.removeWidgets(this.answerWidgets.map((item) => item.uuid));
      this.removeWidgets(this.predictionWidget.map((item) => item.uuid));
      let toScale = scale;
      if (scale === -2) {
        toScale = 'page-fit';
      } else if (scale === -1) {
        toScale = 'page-width';
      }

      this.setScale(toScale);

      setTimeout(() => {
        this.answerWidgets.forEach((item) => this.renderAnswerWidget(item));
        this.predictionWidget.forEach((item) =>
          this.renderPredictionWidget(item),
        );
        this.$emit('scale-changed');
      }, 800);
    },

    handlePagesLoaded() {
      this.$emit('pages-loaded');
    },
    handlePageRendered(page) {
      this.$emit('page-rendered', page);
      EventBus.$emit('page-rendered', page);
      if (this.$platform.isCmfchinaEnv() && this.remarkTab === 'remark') {
        this.renderRelatedPageAnswerWidget();
      }
    },

    async handleAnnotationRendered() {
      if (this.showCrossPageAnnotationArrow) {
        await this.$nextTick();
        this.renderCrossPageAnnotationArrow();
      }
    },

    renderCrossPageAnnotationArrow() {
      const groupAnswerWidgets = _.groupBy(this.answerWidgets, 'page');
      const crossPages = Object.keys(groupAnswerWidgets).map(Number);
      const getPageAnotationElements = (page) => {
        return Array.from(
          this.$el.querySelectorAll(
            `.page[data-page-number="${page}"] .annotationEditorLayer .widget-border-box`,
          ),
        );
      };

      crossPages.forEach((page, index) => {
        const prevPage = crossPages[index - 1];
        const nextPage = crossPages[index + 1];
        const currentPageFirstAnnotationEl = getPageAnotationElements(
          page + 1,
        )[0];
        const currentPageLastAnnotationEl = getPageAnotationElements(
          page + 1,
        ).at(-1);
        const prevPageFirstAnnotationEl = getPageAnotationElements(
          prevPage + 1,
        ).at(0);
        const nextPageFirstAnnotationEl = getPageAnotationElements(
          nextPage + 1,
        )[0];

        const prevArrowElementExisted =
          currentPageFirstAnnotationEl?.querySelector('.cross-page-arrow-up');
        if (
          currentPageFirstAnnotationEl &&
          prevPageFirstAnnotationEl &&
          !prevArrowElementExisted
        ) {
          const prevArrowElement = document.createElement('DIV');
          prevArrowElement.innerHTML = '<i class="el-icon-d-arrow-left"></i>';
          prevArrowElement.setAttribute(
            'class',
            'cross-page-arrow cross-page-arrow-up',
          );
          prevArrowElement.setAttribute('title', '内容跨页，点击查看上一个');
          prevArrowElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.$refs.pdfViewer.jumpToPage(prevPage + 1);
            prevPageFirstAnnotationEl?.scrollIntoView({ block: 'center' });
          });
          currentPageFirstAnnotationEl.appendChild(prevArrowElement);
        }

        const nextArrowElementExisted =
          currentPageLastAnnotationEl?.querySelector('.cross-page-arrow-down');
        if (
          currentPageLastAnnotationEl &&
          nextPageFirstAnnotationEl &&
          !nextArrowElementExisted
        ) {
          const nextArrowElement = document.createElement('DIV');
          nextArrowElement.innerHTML = '<i class="el-icon-d-arrow-right"></i>';
          nextArrowElement.setAttribute(
            'class',
            ' cross-page-arrow cross-page-arrow-down',
          );
          nextArrowElement.setAttribute('title', '内容跨页，点击查看下一个');
          nextArrowElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.$refs.pdfViewer.jumpToPage(nextPage + 1);
            nextPageFirstAnnotationEl?.scrollIntoView({ block: 'center' });
          });
          currentPageLastAnnotationEl.appendChild(nextArrowElement);
        }
      });
    },

    handlePageChange(pageNumber) {
      this.pageNumber = pageNumber;

      const currentPage = pageNumber - 1;
      const needJump = currentPage !== this.thumbnailPageActived;
      if (this.isShowThumbnaill && needJump) {
        this.thumbnailPageActived = currentPage;
        this.jumpToThumbnailPageNumber(currentPage);
      }
      if (this.showPageBlocks) {
        this.showPageBlocks = false;
        this.removeBlockWidgets();
      }

      const tempWidget = this.answerWidgets.find((item) => {
        return item.page === currentPage;
      });

      if (tempWidget) {
        this.renderRectWidget(tempWidget);
      }

      if (this.$platform.isCmfchinaEnv() && this.remarkTab === 'remark') {
        this.renderRelatedPageAnswerWidget();
      }

      EventBus.$emit('page-change', pageNumber);
    },

    async jumpToPageNumber(pageNumber, offset) {
      await this.$refs.pdfViewer.jumpToPage(pageNumber, offset);
    },

    jumpToPageNumberFromUrl() {
      const page = this.$route.query.pdfPage;
      if (page) {
        this.jumpToPageNumber(page);
      }
    },

    jumpToThumbnailPageNumber(page = 0) {
      this.$refs.pdfViewer.scrollThumbnailIntoView(page);
    },

    jumpToChapter() {
      if (this.isShowChapterTree) {
        this.$refs.pdfViewer.scrollChapterIntoView?.();
      }
    },

    async scrollAnswerItemIntoViewWithDiffMode(data, target) {
      await this.$nextTick();
      const nodeId = target.$parent.$el.dataset.nodeid;
      const allAnswerItemDoms = document.querySelectorAll('.answer-item');
      Array.from(allAnswerItemDoms).forEach((item) => {
        item.classList.remove('schema-node-selected');
        if (item.dataset.nodeid === nodeId) {
          if (data.boxes.length === 0) {
            item.classList.add('schema-node-selected');
          }
          item.scrollIntoView({
            block: 'center',
          });
        }
      });
    },

    getWidgetById(id) {
      return this.$refs.pdfViewer.getWidgetById(id);
    },

    getMountedPageNumbers() {
      return this.$refs.pdfViewer.getRenderedPageNumbers();
    },

    selectSchemaNode({ model, ignoreAnswer, docType }) {
      const node = cloneDeep(model);
      const key = JSON.stringify(mixDeepInfo(node.meta));

      if (ignoreAnswer) {
        delete node.answer;
      } else {
        const answer = this.answerItemMap[key];
        if (answer) {
          node.answer = answer;
        } else {
          delete node.answer;
        }
      }

      if (docType) {
        this.nodeSelected = { ...node, schemaNodeKey: key, docType };
      } else {
        this.nodeSelected = { ...node, schemaNodeKey: key };
      }

      if (!this.$platform.isCmfchinaEnv()) {
        this.resetWidgets();
      }
    },

    async selectAnswerItem({
      index,
      schemaNode,
      schema,
      data,
      detail,
      target,
      docType,
      schemaLabel,
      isSelectAnswerWithoutSchemaNode,
      meta,
      subType,
      jumpToPage = true,
    }) {
      if (this.fileDocType && this.fileDocType !== docType) {
        return;
      }
      if (this.readOnly && !isSelectAnswerWithoutSchemaNode) {
        let findSchemaKey = schemaNode;
        if (!this.answerItemMap[schemaNode]) {
          const schemaNodeArray = JSON.parse(schemaNode);
          schemaNodeArray.splice(0, 1);
          const updatedStr = JSON.stringify(schemaNodeArray);

          findSchemaKey = Object.keys(this.answerItemMap).find((key) => {
            const keyArray = JSON.parse(key);
            keyArray.splice(0, 1);
            return updatedStr === JSON.stringify(keyArray);
          });
        }
        if (!this.answerItemMap[findSchemaKey]) {
          this.resetWidgets();
          return;
        }

        data = this.answerItemMap[findSchemaKey].data[index] || { boxes: [] };
        detail = this.answerItemMap[findSchemaKey].detail || {};

        if (
          !this.$features.showCiticsTgRemarkAside() &&
          !this.$platform.isNafmiiEnv()
        ) {
          this.scrollAnswerItemIntoViewWithDiffMode(data, target);
        }
      }
      if (this.diffEnabled) {
        if (!this.answerItemMap[schemaNode]) {
          this.resetWidgets();
          return;
        }

        // 对比模式下，取各自对应answer下的数据
        const schemaNodeArray = JSON.parse(schemaNode);
        const schemaNodeEndString = schemaNodeArray[schemaNodeArray.length - 1];
        let pairIndex;
        if (schemaNodeEndString.includes('拆分')) {
          pairIndex = !_.isNil(data?.pair_index) ? data.pair_index : null;
        } else {
          pairIndex = index;
        }
        let selectIndex = index;
        if (target.showDiffMarks) {
          if (this.isDiffMode) {
            selectIndex = pairIndex;
          }
        } else {
          if (!this.isDiffMode) {
            selectIndex = pairIndex;
          }
        }
        if (selectIndex === null) {
          return;
        }
        data = this.answerItemMap[schemaNode].data[selectIndex] || {
          boxes: [],
        };
        detail = this.answerItemMap[schemaNode].detail || {};

        if (!this.$features.showCiticsTgRemarkAside()) {
          this.scrollAnswerItemIntoViewWithDiffMode(data, target);
        }
      }

      this.nodeAnswerSelected = { schemaNodeKey: schemaNode, data };

      const label = schemaLabel || schema.data?.label;
      const answerList = this.getPageAndOutline(data);

      if (
        !this.$platform.isCmfchinaEnv() ||
        (this.$platform.isCmfchinaEnv() && this.remarkTab !== 'remark')
      ) {
        this.resetWidgets();
      }

      if (this.$platform.isCmfchinaEnv()) {
        this.setWidgetsActived();
      }

      this.showPageBlocks = false;

      await this.$nextTick();

      answerList.forEach((answer, boxIndex) => {
        if (!answer) {
          this.$notify({
            title: '提示',
            message: '暂无溯源数据',
            type: 'info',
          });
          return;
        }
        const { page, outline, label: box_label } = answer;
        const boxLabel = label || box_label;

        this.$emit('update-answer-selected', true);

        answer.showLabel = true;
        if (this.$features.showFirstBoxLabelOnly() && boxIndex > 0) {
          answer.showLabel = false;
        }

        const widget = this.answerWidgets.find(
          (item) => item.meta?.md5 && _.isEqual(item.meta?.md5, meta?.md5),
        );

        if (!this.answerWidgets.includes(widget)) {
          this.answerWidgets.push({
            uuid: widget?.uuid || uuid4(),
            outline,
            page,
            schemaNode,
            label: boxLabel,
            subType,
          });
        }

        this.renderAnswerWidget({
          id: widget?.uuid || uuid4(),
          page,
          outline,
          label: boxLabel,
          schemaNode,
          showLabel: answer.showLabel,
          meta: meta,
          subType,
        });

        if (jumpToPage) {
          if (boxIndex === 0) {
            this.$refs.pdfViewer.scrollToAnnotation({
              pageNumber: answerList[0].page + 1,
              id: widget?.uuid || this.answerWidgets[0].uuid,
            });
          }
        }
      });

      const boxMinWidth = 3; // box需设置一个最小宽度: 3px

      if (!detail) {
        return;
      }

      Object.keys(detail).forEach((page) => {
        detail[page].forEach((box) => {
          const box_right = box[2];
          if (box[2] - box[0] < boxMinWidth) {
            box[2] = box_right + boxMinWidth;
          }
          const boxInfo = {
            uuid: uuid4(),
            outline: box,
            page: Number(page.replace('page', '')),
          };
          this.renderDiffDetailWidget(boxInfo);
        });
      });
    },

    async selectRuleItem({ ruleItem, index = 0 }) {
      this.resetWidgets();
      if (!ruleItem.schema_cols[0]) {
        return;
      }
      let key = '';
      let boxDataIndex = 0;
      if (ruleItem.schema_cols.length > 1) {
        key = normalizeArrayJSON(ruleItem.schema_cols[index]);
      } else {
        key = normalizeArrayJSON(ruleItem.schema_cols[0]);
        boxDataIndex = index;
      }
      const answerItem = this.answerItemMap[key];
      const answerItemData = answerItem.data[boxDataIndex];
      if (!answerItemData) {
        this.resetWidgets();
        return;
      }
      const firstBox = answerItemData.boxes[0];
      const page = firstBox.page;
      const outline = [
        firstBox.box.box_left,
        firstBox.box.box_top,
        firstBox.box.box_right,
        firstBox.box.box_bottom,
      ];
      const label = answerItem.schema.data.label;
      await this.scrollToPage(page + 1, [0, outline[1]]);
      this.renderAnswerWidget({ page, outline, label, schemaNode: key });
    },

    showAllAnswerBoxes(isSelectedAll, { shouldScrollToPage = true } = {}) {
      if (isSelectedAll) {
        if (!isEmpty(this.answerItemMap)) {
          this.isSelectedAll = true;

          const answerItemFirst =
            this.answerItemMap[Object.keys(this.answerItemMap)[0]];
          const { page } =
            this.getPageAndOutline(answerItemFirst.data[0])?.[0] || {};
          if (shouldScrollToPage) {
            this.scrollToPage(page + 1);
          }
          setTimeout(() => this.renderRelatedPageAnswerWidget(), 800);
        }
      } else {
        this.resetWidgets();
      }
    },

    hideAllAnswerBoxes() {
      this.resetWidgets();
    },

    async showPredictPosition(data) {
      if (this.isDiffMode) {
        return;
      }
      this.resetWidgets();

      const label = data.tags[0];
      const predictionList = this.getPageAndOutline(data);

      await this.scrollToPage(predictionList[0].page + 1, [
        0,
        predictionList[0].outline[1],
      ]);

      predictionList.forEach((answer) => {
        const { page, outline } = answer;
        this.renderPredictionWidget({ page, outline, label });
      });
    },

    async switchToRenderBlocksMode() {
      this.showPageBlocks = !this.showPageBlocks;
      if (this.showPageBlocks) {
        const pdfViewer = this.$refs.pdfViewer;
        const currentPageNumber = pdfViewer.imageViewer
          ? pdfViewer.imageViewer.pageNumber - 1
          : pdfViewer.currentPageNumber - 1;
        await this.getPageBlocks(currentPageNumber);
        this.renderPageBlocks(currentPageNumber);
      } else {
        this.removeBlockWidgets();
      }
    },

    changeDrawWidgetMode(mode) {
      if (mode === this.drawWidgetMode.selectText) {
        if (this.$features.supportCopyTextByRect()) {
          this.$refs.pdfViewer.setDrawRectMode();
        } else {
          this.$refs.pdfViewer.setSelectTextMode();
        }
      } else if (mode !== this.drawWidgetMode.blocks) {
        this.$refs.pdfViewer.setDrawRectMode();
        this.resetAnnotationLayersCursorStyle();
      }

      if (mode === this.drawWidgetMode.blocks) {
        this.resetWidgets();
        this.switchToRenderBlocksMode();
        return;
      }
      if (!this.$platform.isCmfchinaEnv()) {
        this.resetWidgets();
        this.resetMultipleWidgetDrawed();
      }
      this.drawWidgetModeActived = mode;
    },

    resetAnnotationLayersCursorStyle() {
      const annotationLayers = this.$refs.pdfViewer.$el.querySelectorAll(
        '.annotationEditorLayer',
      );
      annotationLayers.forEach((layer) => {
        layer.style.cursor = 'unset';
      });
    },

    keyDownListener(e) {
      // press q
      if (e.keyCode === 81) {
        if (this.drawWidgetModeActived === this.drawWidgetMode.single) {
          this.changeDrawWidgetMode(this.drawWidgetMode.multiple);
        } else {
          this.changeDrawWidgetMode(this.drawWidgetMode.single);
        }
      }

      // press a
      if (e.keyCode === 65) {
        if (
          this.multipleWidgetDrawed.schemaNode !== '' &&
          this.multipleWidgetDrawed.boxes.length > 0
        ) {
          this.combineMultipleWidget();
        }
      }
    },

    renderTempWidget() {
      const { schemaNode, label, boxes, uuid } = this.multipleWidgetDrawed;

      if (schemaNode !== '' && boxes.length > 0) {
        boxes.forEach(({ page, box: outline }, index) => {
          if (page === this.pageNumber - 1) {
            this.renderRectWidget({
              uuid: uuid[index],
              page,
              outline,
              label,
            });
          }
        });
      }
    },

    renderRelatedPageAnswerWidget() {
      this.pageNumber =
        this.currentPageNumber || this.$refs.pdfViewer.currentPageNumber;

      const pageRelated = [
        this.pageNumber - 1,
        this.pageNumber,
        this.pageNumber + 1,
      ].filter((item) => item > 0 && item <= this.fileInfo.pageInfo.length);

      pageRelated.forEach((item) => this.renderAnswerWidgetByPage(item - 1));
    },

    renderAnswerWidgetByPage(pageParam) {
      Object.keys(this.answerItemMap).forEach((key) => {
        if (this.$platform.isCmfchinaEnv()) {
          this.setWidgetsActived();
        }

        const answer = this.answerItemMap[key];
        const label = answer.schema.data?.label;
        const schemaNode = answer.key;
        if (answer.data.length > 0) {
          answer.data.forEach((item) => {
            const answerList = this.getPageAndOutline(item);

            answerList.forEach((answerItem) => {
              const { page, outline } = answerItem;

              if (page === pageParam) {
                this.renderAnswerWidget({
                  id: uuid4(),
                  page,
                  outline,
                  label,
                  schemaNode,
                  subType: this.getAnswerWidgetMeta(
                    schemaNode,
                    item,
                  ).classNames?.join(''),
                  meta: this.getAnswerWidgetMeta(schemaNode, item),
                });
              }
            });
          });
        }
      });
    },

    async renderAnswerWidget({
      id,
      page,
      outline,
      label,
      schemaNode,
      subType,
      dataset,
      showLabel,
      meta,
    }) {
      try {
        const widgetExisted = this.answerWidgets.find(
          (item) =>
            (id && item.id === id) ||
            (item.page === page &&
              item.schemaNode === schemaNode &&
              isEqual(item.outline, outline) &&
              item.subType === subType &&
              isEqual(item.dataset, dataset)),
        );

        if (widgetExisted) {
          this.renderRectWidget({
            uuid: widgetExisted.uuid,
            page,
            outline,
            label,
            subType,
            dataset,
            showLabel,
            meta,
          });
        } else {
          const uuid = this.renderRectWidget({
            uuid: id,
            page,
            outline,
            label,
            subType,
            dataset,
            showLabel,
            meta,
          });
          this.answerWidgets.push({
            uuid,
            outline,
            page,
            schemaNode,
            label,
            subType,
            dataset,
            meta,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    renderPredictionWidget({ page, outline, label }) {
      try {
        const widgetExisted = this.predictionWidget.find(
          (item) => item.page === page && isEqual(item.outline, outline),
        );

        if (widgetExisted) {
          this.renderRectWidget({
            uuid: widgetExisted.uuid,
            page,
            outline,
            label,
          });
        } else {
          const uuid = this.renderRectWidget({ page, outline, label });
          this.predictionWidget.push({ uuid, outline, page, label });
        }
      } catch (error) {
        console.error(error);
      }
    },

    renderRectWidget({
      uuid: uuidExixted,
      page,
      outline,
      label,
      subType,
      dataset,
      showLabel,
      meta,
    }) {
      const widgetDrawed = this.getWidgetById(uuidExixted);

      if (widgetDrawed) {
        showLabel && this.appendWidgetLabel(widgetDrawed, label);
        return uuidExixted;
      }

      const uuid = uuidExixted ? uuidExixted : uuid4();
      const type = 'rect';

      this.$refs.pdfViewer.addWidgets(
        {
          type,
          subType: subType || 'widget-border-box',
          outline,
          uuid,
          label,
          page,
          dataset,
          meta,
        },
        showLabel && this.appendWidgetLabel,
      );

      return uuid;
    },

    appendWidgetLabel(widget, text) {
      if (widget.labelAppended) return;

      const containerEl = widget.div;
      if (!containerEl) return;

      const annotationEditorLayerEl = containerEl.parentElement;

      // 获取父元素的旋转角度
      const transform = window.getComputedStyle(
        annotationEditorLayerEl,
      ).transform;
      let angle = 0;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
      }

      const svgElement = containerEl.querySelector('.editor-svg-canvas');
      if (!svgElement) return;

      const tagEl = document.createElement('span');
      const tagElOffsetRight =
        annotationEditorLayerEl?.getBoundingClientRect().right -
        containerEl.getBoundingClientRect().right -
        10;
      const fontSize = Math.max(10, Number((10 * this.getScale()).toFixed(0)));
      tagEl.className = 'annotation-tag';
      tagEl.textContent = text;
      tagEl.style.fontSize = `${fontSize}px`;
      tagEl.style.transform = `rotate(${-angle}deg)`;
      tagEl.style.maxWidth = `${tagElOffsetRight}px`;

      if ([90, 270].includes(Math.abs(angle))) {
        const { width, height } = containerEl.getBoundingClientRect();
        tagEl.style.left = `${height}px`;
        tagEl.style.top = `${width + 2}px`;
      }

      containerEl.appendChild(tagEl);
      widget.labelAppended = true;
    },
    renderPageBlocks(page) {
      if (this.pageBlocks[page]) {
        this.pageBlocks[page].forEach((data) =>
          this.renderWidget({
            page,
            data,
          }),
        );
      }
    },

    renderWidget({ page, data }) {
      const widgetDrawed = this.getWidgetById(data.uuid);

      if (widgetDrawed) {
        return;
      }

      const type = data.cells ? 'table' : 'rect';

      let widgetData = {};

      widgetData = convertPredictionDataToAnnotationData({
        uuid: data.uuid || uuid4(),
        type,
        pageNumber: page,
        ...data,
      });

      const predictAnnotationTypesLabelMap = {
        ...PredictAnnotationTypesLabel,
        syllabus: '目录',
      };

      const labelText = isENLang
        ? data.type
        : predictAnnotationTypesLabelMap[data.type];
      const label = this.$features.supportShowElementIndex()
        ? labelText + '(' + data.index + ')'
        : labelText;

      this.$refs.pdfViewer.addWidgets(
        {
          type,
          subType: data.type,
          uuid: widgetData.id,
          page,
          label,
          ...widgetData,
        },
        this.appendWidgetLabel,
      );
    },

    removeBlockWidgets() {
      const pageMounted = this.getMountedPageNumbers();
      pageMounted.forEach((page) => {
        if (this.pageBlocks[page]) {
          this.removeWidgets(this.pageBlocks[page].map((item) => item.uuid));
        }
      });
    },

    renderDiffDetailWidget({ uuid, outline, page }) {
      this.answerDiffWidgets.push({ uuid, outline, page });

      const type = 'rect';
      this.$refs.pdfViewer.addWidgets({
        type,
        subType: 'diff-widget',
        outline,
        uuid,
        page,
      });
    },

    async handleWidgetClicked({ widget, cells }) {
      if (this.$platform.isCmfchinaEnv()) {
        EventBus.$emit('answer-widget-clicked', widget);
        return;
      }
      const deactiveWidgetCell = () => {
        if (widget.tableHandler) {
          widget.tableHandler.deactiveCells();
        } else {
          if (widget.tableCell) {
            widget.tableCell.cellDom.remove();
          }
        }
      };
      if (this.canDrawWidget()) {
        let page = 0;
        let uuid = '';
        if (widget.widgetData) {
          page = widget.widgetData.page;
          uuid = widget.uuid;
        } else {
          page = widget.data.pageNumber - 1;
          uuid = widget.data.uuid;
        }

        const pageBlock = this.pageBlocks[page].find(
          (block) => block.uuid === uuid,
        );

        let outline = [];

        if (pageBlock) {
          if (pageBlock.cells) {
            if (!cells) {
              return;
            }

            const [row, col] = cells[0];

            let cell = pageBlock.cells[`${row}_${col}`];
            if (!cell) {
              const mergedCell = pageBlock.merged.find((mergedList) =>
                mergedList.find((cellItem) => isEqual(cellItem, [row, col])),
              );
              if (mergedCell) {
                const [rowOrigin, colOrigin] = mergedCell[0];
                cell = pageBlock.cells[`${rowOrigin}_${colOrigin}`];
              }
            }
            outline = cell.box;
          } else {
            outline = pageBlock.outline;
          }
          await this.drawWidget(outline, { pageInfo: { page } });
          deactiveWidgetCell();
          this.switchToRenderBlocksMode();
        }
      } else {
        deactiveWidgetCell();
      }
    },

    canDrawWidget() {
      if (!this.checkCanModifyAnswer()) {
        return false;
      }
      if (this.drawWidgetModeActived === this.drawWidgetMode.selectText) {
        return false;
      }
      if (
        this.remarkFile &&
        this.remarkFile.meta_info &&
        this.remarkFile.meta_info.is_ocr_expired &&
        this.remarkFile.meta_info.ocr_expired_pages.some(
          (page) => page === this.pageNumber - 1,
        )
      ) {
        this.$notify({
          title: this.$t(`message['警告']`),
          message: this.remarkFile.meta_info.ocr_expired_msg,
          type: 'warning',
        });
        return false;
      }

      if (isEmpty(this.nodeSelected)) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(this.$text.schema['尚未选择Schema节点，请勿标注']),
          type: 'warning',
          isNotRepeatNotify: true,
        });
        return false;
      } else if (this.nodeSelected.children.length > 0) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(
            this.$text.schema['当前schema为组合类型，请勿直接标注'],
          ),
          isNotRepeatNotify: true,
          type: 'warning',
        });
        return false;
      } else if (
        this.fileDocType &&
        this.nodeSelected.docType !== this.fileDocType
      ) {
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `当前文件为<span class="highlight-message">${this.fileDocType}</span>，请在正确文件中进行标注`,
          type: 'warning',
          isNotRepeatNotify: true,
        });
        return false;
      } else if (this.drawWidgetModeActived === this.drawWidgetMode.single) {
        if (!this.canContinuousDrawWidget) {
          this.$confirm(
            '【系统提示】当前字段已完成框选标记，请勿重复标注。请确认最新提取结果是否需要保留？如无需保留数据，请及时清理无效的提取数据。',
            '提示',
            {
              type: 'warning',
              showCancelButton: false,
              showConfirmButton: false,
              customClass: 'continuous-draw-confirm',
            },
          );
          return false;
        }
        return this.checkMultiRemarkSupport();
      }
      return true;
    },

    keyDownHandler(event) {
      if (this.$features.supportCopyTextByRect()) {
        if (this.rectCopyText === '') {
          return;
        }
        if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
          this.copyTextByRect(false);
        }
      }
    },

    async copyTextByRect() {
      try {
        await copyTextToClipboard(this.rectCopyText);
        this.$message({
          message: this.$t(`message['已复制']`),
          type: 'success',
          duration: 1000,
        });
        this.rectCopyText = '';
        this.resetWidgets();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },

    async renderCopyRect({ outline, page, id }) {
      try {
        this.resetWidgets();
        const res = await this.getWidgetContent([
          {
            box: [...outline],
            page,
          },
        ]);
        this.rectCopyText = res[0].text;
        this.renderRectWidget({
          uuid: id,
          page,
          outline: res[0].box.box,
          subType: 'rect-copy',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },

    async drawWidget(outline, { pageInfo: { page, id } }) {
      this.$emit('draw-widget');
      if (
        this.$features.supportCopyTextByRect() &&
        this.drawWidgetModeActived === this.drawWidgetMode.selectText
      ) {
        this.renderCopyRect({ outline, page, id });
        return;
      }
      if (this.canDrawWidget()) {
        this.$emit('drawed-widget', true);

        if (this.$platform.isCmfchinaEnv()) {
          if (this.showPageBlocks) {
            this.showPageBlocks = false;
            this.removeBlockWidgets();
          }
        }

        try {
          if (this.$refs.pdfViewer.setLoading) {
            this.$refs.pdfViewer.setLoading(page, true);
          }
          const label = this.nodeSelected.data.label;
          const schemaNode = JSON.stringify(
            mixDeepInfo(this.nodeSelected.meta),
          );

          if (
            this.multipleWidgetDrawed.schemaNode &&
            this.multipleWidgetDrawed.schemaNode !== schemaNode
          ) {
            this.resetMultipleWidgetDrawed();
          }

          const content = await this.getWidgetContent([
            {
              box: [...outline],
              page,
            },
          ]);

          const text = content[0].text;

          const isValidate = this.validateAnswerItem(text, this.nodeSelected);
          if (!isValidate) {
            return;
          }

          const resOutline = content[0].box.box;
          const box = { box: [...resOutline], page, text };
          const [box_left, box_top, box_right, box_bottom] = resOutline;
          const boxData = {
            box: {
              box_left,
              box_top,
              box_right,
              box_bottom,
            },
            page,
            text,
          };
          const uuid = this.renderRectWidget({
            uuid: id,
            page,
            outline: resOutline,
            label,
            showLabel: true,
            meta: this.getAnswerWidgetMeta(schemaNode, {
              boxes: [boxData],
              text,
            }),
          });

          this.answerWidgetsTemp.push({
            uuid,
            outline: resOutline,
            page,
            schemaNode,
            label,
          });

          if (this.drawWidgetModeActived === this.drawWidgetMode.single) {
            const boxes = [box];
            this.createAnswerItem(schemaNode, boxes, uuid);
          } else {
            this.multipleWidgetDrawed = {
              schemaNode,
              label,
              boxes: this.multipleWidgetDrawed.boxes.concat(box),
              uuid: this.multipleWidgetDrawed.uuid.concat(uuid),
            };
          }
          const answer = this.answerItemMap[schemaNode];
          if (answer) {
            this.nodeSelected.answer = answer;
          }
        } catch (error) {
          this.$emit('drawed-widget', false);
          console.error(error);
        } finally {
          if (this.$refs.pdfViewer.setLoading) {
            this.$refs.pdfViewer.setLoading(page, false);
          }
        }
      }
    },

    removeWidgets(uuidToRemove) {
      this.$refs.pdfViewer.removeWidgets([].concat(uuidToRemove));
    },

    async getWidgetContent(data) {
      this.$emit('fetch-box-text', true);
      try {
        const res = await this.$store.dispatch('remarkModule/fetchBoxText', {
          fileId: this.fileId,
          data,
        });
        return res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
        return null;
      } finally {
        this.$emit('fetch-box-text', false);
      }
    },

    checkMultiRemarkSupport() {
      if (
        this.nodeSelected.answer &&
        this.nodeSelected.answer.data.length > 0 &&
        !this.nodeSelected.answer.schema.data.multi
      ) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['该字段不可标注多项，请勿标注']`),
          type: 'warning',
        });
        return false;
      }

      return true;
    },

    validateAnswerItem(text, model) {
      const schemaType = model.data.type;
      // 校验标注文本是否符合日期和数字格式
      if (schemaType === '日期') {
        let parsedDate = chrono.strict.parseDate(text);
        if (parsedDate === null) {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: this.$t('message["“{text}” 日期格式错误"]', { text }),
            type: 'warning',
          });

          return false;
        }
      }
      if (schemaType === '数字') {
        const reg = /^[-+]?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/;
        if (text.length === 0 || !reg.test(text)) {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: this.$t('message["“{text}” 数字格式错误"]', { text }),
            type: 'warning',
          });

          return false;
        }
      }

      return true;
    },

    async createAnswerItem(schemaNode, boxes, uuid) {
      const boxesFormat = boxes.map((item) => {
        const [box_left, box_top, box_right, box_bottom] = item.box;
        return { ...item, box: { box_left, box_top, box_right, box_bottom } };
      });

      EventBus.$emit('create-answer-item', {
        schemaNode,
        boxes: boxesFormat,
        nodeSelected: this.nodeSelected,
      });

      this.updateAnswerWidgetMd5(boxesFormat);

      if (this.$platform.isCmfchinaEnv()) {
        const widget = this.getWidgetById(uuid);
        await this.$nextTick();
        this.handleWidgetClicked({ widget });
      }

      this.answerWidgets = this.answerWidgets.concat(this.answerWidgetsTemp);
      this.answerWidgetsTemp = [];
      this.multipleWidgetDrawed = { schemaNode: '', boxes: [], uuid: [] };
    },

    async combineMultipleWidget() {
      if (!this.checkMultiRemarkSupport()) {
        return;
      }
      const { schemaNode, boxes, uuid } = this.multipleWidgetDrawed;
      if (schemaNode !== '') {
        this.createAnswerItem(schemaNode, boxes, uuid[0]);
      }
    },

    removeMultipleWidgetDrawedItem(index) {
      const itemToRemove = this.multipleWidgetDrawed.uuid[index];
      this.removeWidgets(itemToRemove);
      this.multipleWidgetDrawed.boxes.splice(index, 1);
      this.multipleWidgetDrawed.uuid.splice(index, 1);
    },

    async scrollToPage(pageNumber, offset = [0, 0]) {
      this.pageNumber = pageNumber;
      await this.jumpToPageNumber(pageNumber, offset);
    },

    getPageAndOutline(item) {
      if (!item) {
        return [];
      }
      return (
        item.boxes?.map((boxItem) => {
          const { box, page, label } = boxItem;
          if (!box) {
            return null;
          }
          const outline = [
            box.box_left,
            box.box_top,
            box.box_right,
            box.box_bottom,
          ];
          return { page, outline, label };
        }) || []
      );
    },

    async getPageBlocks(page) {
      if (this.pageBlocks[page]) {
        return;
      }

      try {
        this.showPageBlocksLoading = true;
        const { data } = await fetchOutlines(this.fileId, page);
        this.pageBlocks[page] = data.map((item) => ({
          ...item,
          uuid: uuid4(),
        }));
        return data;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.showPageBlocksLoading = false;
      }
    },

    addRemarkAnswerDiffButton() {
      const menuItem = document.createElement('LI');
      menuItem.setAttribute(
        'class',
        'head-menu-item head-menu-item-clickable remark-diff-icon menu-button',
      );
      menuItem.onclick = () => this.$emit('open-remark-diff');

      const menuContainer = document.querySelector('.header-left');
      if (menuContainer) {
        menuContainer.appendChild(menuItem, menuContainer.children[1]);
      }
    },

    handleChapterEmpty() {
      const outlineButton = document.querySelector(
        '.header-left > li:nth-of-type(3)',
      );

      if (outlineButton) {
        outlineButton.addEventListener('click', async () => {
          this.sidebarOpened = !this.sidebarOpened;
          this.isShowThumbnaill = false;

          this.$parent.fileThumbnailVisible = false;

          if (this.sidebarOpened) {
            if (this.fileInfo.outline.items.length === 0) {
              const promptElement = document.createElement('DIV');
              promptElement.setAttribute('class', 'file-outline-prompt');

              try {
                const fileOutlineRes = await fetchFileOutline(this.fileId);
                const outlineReady =
                  fileOutlineRes.data && fileOutlineRes.data.children;

                if (outlineReady) {
                  if (fileOutlineRes.data.children.length > 0) {
                    promptElement.innerHTML = `
                    <p>目录已生成,重新刷新页面后查看</p>
                    <p>(若有手动标注,请先保存)</p>
                    `;
                  } else {
                    promptElement.innerHTML = `
                    <p>无目录信息</p>
                    `;
                  }
                } else {
                  promptElement.innerHTML = `
                    <p>目录暂未生成</p>
                    <p>请稍后重新进入文档查看</p>
                    `;
                }
              } catch (error) {
                promptElement.innerHTML = error.message;
              } finally {
                const outlineContainer = document.querySelector(
                  '.image-viewer-sidebar',
                );
                if (outlineContainer) {
                  outlineContainer.appendChild(promptElement);
                }
              }
            }
          } else {
            const promptElement = document.querySelector(
              '.file-outline-prompt',
            );

            if (promptElement) {
              promptElement.remove();
            }
          }
        });
      }
    },

    removeWidgetsBySchemaNode({ schemaNodeKey, data }) {
      const answerWidgetsUpdated = [];
      this.answerWidgets.forEach((widget) => {
        if (widget.schemaNode === schemaNodeKey) {
          if (this.$platform.isCmfchinaEnv()) {
            const md5 = getAnswerItemMd5(schemaNodeKey, data);
            if (widget.meta?.md5 === md5) {
              this.removeWidgets(widget.uuid);
            }
          } else {
            this.removeWidgets(widget.uuid);
          }
        } else {
          answerWidgetsUpdated.push(widget);
        }
      });
      this.answerWidgets = answerWidgetsUpdated;
    },

    resetViewer() {
      this.pageNumber = 1;
      this.$refs.pdfViewer.imageViewer = null;
      this.answerWidgets = [];
      this.answerWidgetsTemp = [];
      this.predictionWidget = [];
      this.drawWidgetModeActived = 0;
      this.multipleWidgetDrawed = { schemaNode: '', boxes: [], uuid: [] };
      this.nodeSelected = null;
      this.nodeAnswerSelected = null;
      this.sidebarOpened = false;
      this.pageBlocks = {};
    },

    resetWidgets() {
      this.removeWidgets(this.answerWidgets.map((item) => item.uuid));
      this.removeWidgets(this.predictionWidget.map((item) => item.uuid));
      this.removeWidgets(this.answerDiffWidgets.map((item) => item.uuid));
      this.removeAnnotations();
      this.removeDrawingEditors();
      this.answerWidgets = [];
      this.answerWidgetsTemp = [];
      this.predictionWidget = [];
      this.answerDiffWidgets = [];
      this.isSelectedAll = false;
      EventBus.$emit('cancel-select-frames');
    },

    removeAnnotations() {
      if (this.showPageBlocks) {
        this.$refs.pdfViewer.removeAnnotationByType('widget-border-box');
      } else {
        this.$refs.pdfViewer.removeAllAnnotations();
        this.$refs.pdfViewer.$el
          .querySelectorAll('.annotationEditorLayer .annotationEditor')
          .forEach((el) => {
            el.remove();
          });
      }
    },

    removeDrawingEditors() {
      this.$refs.pdfViewer.clearDrawingEditors();
    },

    resetMultipleWidgetDrawed() {
      this.multipleWidgetDrawed.uuid.forEach((uuid) =>
        this.removeWidgets(uuid),
      );
      this.multipleWidgetDrawed = { schemaNode: '', boxes: [], uuid: [] };
    },
    async toggleAnswerPanel() {
      this.$emit('toggle-answer-panel');
      setTimeout(() => {
        this.$refs.pdfViewer.setScaleSelectValue(1);
        this.$refs.pdfViewer.setScale(1);
        this.handleScaleChange(this.getScale());
      }, 200);
    },
    setDefaultDrawWidgetMode() {
      let showAnswerPanel = this.$route.query.showAnswerPanel;
      if (this.$route.name === 'inspectBase64Encoded') {
        const query = parseQueryFromBase64EncodedUrl(
          this.$route.params.base64EncodedString,
        );
        showAnswerPanel = query.showAnswerPanel;
      }
      if (showAnswerPanel === 'false') {
        this.changeDrawWidgetMode(this.drawWidgetMode.selectText);
        this.$refs.pdfViewer.setScaleSelectValue(1);
        this.$refs.pdfViewer.setScale(1);
      }
    },
    setWidgetTypes(types) {
      this.pdfWidgetTypes = types;
    },
    getAnswerWidgetMeta(key, item) {
      const answerItem = this.answerItemMap[key];
      return {
        key: key,
        md5: getAnswerItemMd5(key, item),
        fieldStatus: answerItem?.fieldStatus,
        classNames: getWidgetClassNames(
          answerItem?.fieldStatus === FIELD_STATUS_MAP.FAIL_AUDIT,
        ),
      };
    },
    updateAnswerWidgetMd5(boxes) {
      const annotations = this.$refs.pdfViewer
        .getAllAnnotations()
        .filter((annot) => {
          return this.answerWidgetsTemp.some(
            (widget) => widget.uuid === annot.data.uuid,
          );
        });
      annotations.forEach((annot) => {
        annot.data.meta.md5 = getAnswerItemMd5(annot.data.meta.key, { boxes });
      });
    },
    setWidgetsActived() {
      const { schemaNodeKey, data } = this.nodeAnswerSelected || {};
      const answerItemMd5 = getAnswerItemMd5(schemaNodeKey, data);
      const allAnnotations = this.$refs.pdfViewer.getAllAnnotations();
      allAnnotations.forEach((annotation) => {
        const annotEl = annotation.container;
        if (annotEl.classList.contains('active')) {
          annotEl.classList.remove('active');
        }
        if (answerItemMd5 === annotation.data.meta?.md5) {
          annotation.container.classList.add('active');
        }
      });
    },
    async handleRemarkAsideTabChanged(name) {
      if (this.$platform.isCmfchinaEnv()) {
        if (name === 'remark') {
          this.showAllAnswerBoxes(true, { shouldScrollToPage: false });
        } else if (name === 'ruleAudit') {
          this.resetNodeSelected();
          this.hideAllAnswerBoxes();
        }
      }
    },
    handleLLMEditDialogOpened() {
      this.isLLMEditDialogVisible = true;
    },
    handleLLMEditDialogClosed() {
      this.isLLMEditDialogVisible = false;
      this.resetMultipleWidgetDrawed();
    },
    answerItemUpdated(data, md5) {
      const answerWidgets = this.$refs.pdfViewer
        .getAllAnnotations()
        .filter((widget) => widget.data.meta?.md5 === md5);
      answerWidgets.forEach((widget) => {
        this.removeWidgets(widget.data.uuid);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.file-pdf-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .file-name {
    position: absolute;
    top: 42px;
    left: 0;
    width: 100%;
    padding: 2px 100px;
    text-align: center;
    border-bottom: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
    background: #fff;
    font-size: 12px;
    font-weight: bold;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    z-index: 106;
  }

  .remark-diff-icon {
    width: 22px;
    height: 22px;
    background: url(../../images/remark-diff.svg) no-repeat 50% 50%;
    background-size: 20px 20px;
    &:hover {
      filter: drop-shadow(teal 0 0);
    }
  }

  ::v-deep .mark-buttons-wrapper {
    display: none;
  }

  ::v-deep .image-viewer-header {
    background: #fff;
    border: 1px solid #eee;
    border-top: none;
    box-shadow: none;

    .scale-selector {
      display: none;
    }

    .header-left {
      .remark-diff-icon {
        width: 40px;
        height: 40px;
        background: url(../../images/remark-diff.svg) no-repeat 50% 50%;
        background-size: 20px 20px;
        &:hover {
          filter: drop-shadow(teal 0 0);
        }
      }
    }
  }

  ::v-deep .widget-rect {
    rect {
      stroke: #8470ff !important;
      stroke-dasharray: 0;
      &:hover {
        fill: rgba(#8470ff, 0.05) !important;
      }
    }
    &.widget-border-box {
      rect {
        stroke: #333 !important;
        stroke-dasharray: 5;
      }
    }
    &.diff-widget {
      rect {
        fill: rgba(#00bfff, 0.4) !important;
      }
    }
  }

  ::v-deep .widget-table {
    &:not(.table-column-line) {
      .widget-border:first-of-type {
        stroke: #8470ff !important;
      }
    }
  }

  ::v-deep .cross-page-arrow {
    position: absolute;
    right: -20px;
    width: 16px;
    height: 16px;
    line-height: 17px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background: #ffc500;
    pointer-events: visible;
    &.cross-page-arrow-up {
      bottom: 0;
    }
    &.cross-page-arrow-down {
      bottom: -1px;
    }
    &:hover {
      opacity: 0.8;
    }
    i {
      transform: rotate(90deg);
    }
  }

  ::v-deep .widget-toolbar {
    display: none !important;
  }

  ::v-deep .resize-point {
    display: none !important;
  }

  ::v-deep .menu-button {
    line-height: 40px;
    min-width: 40px;
  }

  ::v-deep .image-viewer-sidebar {
    .file-outline-prompt {
      padding: 0 16px;

      p {
        margin-bottom: 12px;
        font-size: 16px;
        color: #e6a23c;
        text-align: center;
        white-space: nowrap;
      }
    }
    ul {
      padding: 0 10px;
      li[data-depth='0'] {
        > span {
          &.menu-title {
            font-size: 15px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.continuous-draw-confirm {
  .el-message-box__status {
    top: 0;
    transform: unset;
  }
}
</style>
