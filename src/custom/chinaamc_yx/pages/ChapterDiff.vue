<template>
  <div
    ref="chapterDiffContainer"
    class="chapter-diff-container"
    v-loading="loading">
    <div ref="pdfViewerWrapper" class="pdf-viewer-wrapper">
      <div class="file-pdf-viewer-wrapper">
        <pdf-viewer
          v-if="file1.id"
          ref="pdfViewer1"
          :file-id="file1.id"
          :is-diff-mode="true"
          :pageAnnotations="pageAnnotations.left"
          @viewer-ready="onDocumentReady('left')"
          @page-rendered="(page) => onPageRendered(page, 'left')">
          <template slot="toolbar">
            <span class="file-type">
              类型: <em>{{ file1.file_type }}</em>
            </span>
          </template>
        </pdf-viewer>
      </div>
      <diff-control-bar
        ref="diffControlsBar"
        :loading="loading"
        :current-diff-index="diffNavIndex"
        :diff-list="filteredDiffResult"
        :diff-total="filteredDiffResult.length"
        :doc-size="leftDocSize"
        :is-show-review-btn="false"
        @change-current-diff="changeCurrentDiff"></diff-control-bar>
      <div class="file-pdf-viewer-wrapper">
        <pdf-viewer
          v-if="file2.id"
          ref="pdfViewer2"
          :file-id="file2.id"
          :is-diff-mode="true"
          :pageAnnotations="pageAnnotations.right"
          @viewer-ready="onDocumentReady('right')"
          @page-rendered="(page) => onPageRendered(page, 'right')">
          <template slot="toolbar">
            <span class="file-type">
              类型: <em>{{ file2.file_type }}</em>
            </span>
            <el-button
              type="primary"
              plain
              size="mini"
              class="btn-file-switch"
              @click="switchFile">
              {{ switchableFileIndex === 0 ? '下一篇' : '上一篇' }}
            </el-button>
          </template>
        </pdf-viewer>
        <div class="diff-nav">
          <p class="num">
            {{ diffList.length === 0 ? 0 : diffListIndex + 1 }}/{{
              diffList.length
            }}
          </p>
          <el-button
            type="primary"
            icon="el-icon-back"
            size="mini"
            :disabled="diffListIndex === 0"
            @click="switchDiffItem('prev')">
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-right"
            size="mini"
            :disabled="diffListIndex >= diffList.length - 1"
            @click="switchDiffItem('next')">
          </el-button>
        </div>
      </div>
    </div>
    <div class="diff-aside" v-loading="loading">
      <div class="diff-filter">
        <span>审核点</span>
        <el-select
          v-model="diffType"
          size="mini"
          placeholder="请选择类型"
          @change="changeDiffType">
          <el-option
            v-for="(item, index) in diffTypes"
            :key="index"
            :value="item.value">
            <span>{{ item.value }}</span>
            <span style="margin-left: 5px">({{ item.total }})</span>
          </el-option>
        </el-select>
      </div>
      <ul class="diff-list">
        <li
          v-for="(item, index) in diffList"
          :key="index"
          :class="getDiffItemClassName(item)"
          @click="diffItemChanged(item, index)">
          {{ item.name }}
        </li>
      </ul>
      <el-empty v-if="!loading && diffList.length === 0"></el-empty>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { v4 as uuid4 } from 'uuid';
import { formatDiffData } from '../util';
import PdfViewer from '../components/PdfViewer.vue';
import {
  fetchTaskFiles,
  fetchChapterCompareAnswer,
} from '@/store/api/chinaamc_yx.api';
import { FILE_TYPES } from '../common/constant';
import DiffControlBar from '../components/DiffControlBar.vue';

const DIFF_RESULT_TYPE = {
  ALL: '全部',
  CONSISTENT: '一致',
  INCONSISTENT: '不一致',
  UNMATCHED: '不适用',
};

const DOC_TYPE = {
  [FILE_TYPES[1]]: 'fund_contract',
  [FILE_TYPES[3]]: 'custody_agreement',
};

const WIDGET_TYPE = {
  CHAPTER: 'widget-border-box',
  BLOCK: 'widget-rect',
  DIFF: 'diff-widget',
};

export default {
  name: 'chapter-diff',
  components: {
    PdfViewer,
    DiffControlBar,
  },
  data() {
    return {
      pdfViewer1: null,
      pdfViewer2: null,
      svgContainerEl: null,
      documentReady: { left: false, right: false },
      diffRendered: { left: false, right: false },
      diffRendering: false,
      leftDocSize: {},
      rightDocSize: {},
      loading: false,
      file1: {
        id: null,
        file_type: FILE_TYPES[2],
      },
      file2: {
        id: null,
        file_type: FILE_TYPES[1],
      },
      switchableFiles: [],
      switchableFileIndex: 0,
      diffType: DIFF_RESULT_TYPE.ALL,
      diffList: [],
      diffListOrigin: [],
      filteredDiffResult: [],
      diffListIndex: 0,
      diffNavIndex: -1,
    };
  },
  computed: {
    taskId() {
      return this.$route.params.taskId;
    },
    diffTypes() {
      const total = this.diffListOrigin.length;
      const consistentTotal = this.diffListOrigin.filter(
        (item) => item.type === DIFF_RESULT_TYPE.CONSISTENT,
      ).length;
      const inconsistentTotal = this.diffListOrigin.filter(
        (item) => item.type === DIFF_RESULT_TYPE.INCONSISTENT,
      ).length;
      const unmatchedTotal = this.diffListOrigin.filter(
        (item) => item.type === DIFF_RESULT_TYPE.UNMATCHED,
      ).length;
      return [
        {
          value: DIFF_RESULT_TYPE.ALL,
          total: total,
        },
        {
          value: DIFF_RESULT_TYPE.CONSISTENT,
          total: consistentTotal,
        },
        {
          value: DIFF_RESULT_TYPE.INCONSISTENT,
          total: inconsistentTotal,
        },
        {
          value: DIFF_RESULT_TYPE.UNMATCHED,
          total: unmatchedTotal,
        },
      ];
    },
    pageAnnotations() {
      const pageAnnotations = { left: {}, right: {} };
      const diffList = this.filteredDiffResult;
      const diff = this.diffList[this.diffListIndex];
      if (this.diffList.length === 0) {
        return {
          left: {},
          right: {},
        };
      }
      diff.left?.data.forEach((item) => {
        item.boxes.forEach((box) => {
          if (!pageAnnotations.left[box.page]) {
            pageAnnotations.left[box.page] = [];
          }

          pageAnnotations.left[box.page].push({
            id: uuid4(),
            subType: WIDGET_TYPE.CHAPTER,
            page: box.page,
            outline: [
              box.box.box_left,
              box.box.box_top,
              box.box.box_right,
              box.box.box_bottom,
            ],
            dataset: [['diffIndex', `${diff.id}`]],
            data: {},
          });
        });
      });
      diff.right?.data.forEach((item) => {
        item.boxes.forEach((box) => {
          if (!pageAnnotations.right[box.page]) {
            pageAnnotations.right[box.page] = [];
          }

          pageAnnotations.right[box.page].push({
            id: uuid4(),
            subType: WIDGET_TYPE.CHAPTER,
            page: box.page,
            outline: [
              box.box.box_left,
              box.box.box_top,
              box.box.box_right,
              box.box.box_bottom,
            ],
            dataset: [['diffIndex', `${diff.id}`]],
            data: {},
          });
        });
      });
      diffList.forEach((item) => {
        item.leftBlocks.forEach((boxItem) => {
          if (!pageAnnotations.left[boxItem.page]) {
            pageAnnotations.left[boxItem.page] = [];
          }

          pageAnnotations.left[boxItem.page].push({
            id: boxItem.id,
            subType: WIDGET_TYPE.BLOCK,
            page: boxItem.page,
            outline: this.formatOutline(boxItem.outline),
            dataset: [['diffIndex', `${diff.id}`]],
            data: {
              ...boxItem,
              side: 'left',
              fileId: this.file1Id,
              diffBox: item.leftBoxes.map((item) => item.outline),
            },
          });
        });

        item.leftBoxes.forEach((boxItem) => {
          if (!pageAnnotations.left[boxItem.page]) {
            pageAnnotations.left[boxItem.page] = [];
          }

          pageAnnotations.left[boxItem.page].push({
            id: boxItem.id,
            subType: WIDGET_TYPE.DIFF,
            page: boxItem.page,
            outline: this.formatOutline(boxItem.outline),
            dataset: [['diffIndex', `${diff.id}`]],
            data: {
              ...boxItem,
              fileId: this.file1Id,
              diffId: item.id,
              blocksRelated: item.leftBlocks
                .filter((item) => item.page === boxItem.page)
                .map((item) => item.id),
            },
          });
        });

        item.rightBlocks.forEach((boxItem) => {
          if (!pageAnnotations.right[boxItem.page]) {
            pageAnnotations.right[boxItem.page] = [];
          }

          pageAnnotations.right[boxItem.page].push({
            id: boxItem.id,
            subType: WIDGET_TYPE.BLOCK,
            page: boxItem.page,
            outline: this.formatOutline(boxItem.outline),
            dataset: [['diffIndex', `${diff.id}`]],
            data: {
              ...boxItem,
              side: 'right',
              fileId: this.file2Id,
              diffBox: item.rightBoxes.map((item) => item.outline),
            },
          });
        });

        item.rightBoxes.forEach((boxItem) => {
          if (!pageAnnotations.right[boxItem.page]) {
            pageAnnotations.right[boxItem.page] = [];
          }

          pageAnnotations.right[boxItem.page].push({
            id: boxItem.id,
            subType: WIDGET_TYPE.DIFF,
            page: boxItem.page,
            outline: this.formatOutline(boxItem.outline),
            dataset: [['diffIndex', `${diff.id}`]],
            data: {
              ...boxItem,
              fileId: this.file2Id,
              diffId: item.id,
              blocksRelated: item.rightBlocks
                .filter((item) => item.page === boxItem.page)
                .map((item) => item.id),
            },
          });
        });
      });
      return pageAnnotations;
    },
  },
  created() {
    this.init();
    this.syncPDFViewerPositionByDiffControlBarDebounce = _.throttle(
      this.syncPDFViewerPositionByDiffControlBar,
      1000 / 60,
    );
    this.afterWindowResize = _.throttle(this.syncRenderSVGPolyline, 1000 / 60);
  },
  beforeDestroy() {
    this.syncPDFViewerPositionByDiffControlBarDebounce.cancel();
    window.removeEventListener('resize', this.afterWindowResize);
  },
  methods: {
    async init() {
      this.getTaskFiles();
      this.getChapterCompareAnswer();
    },
    async getTaskFiles() {
      try {
        const res = await fetchTaskFiles(this.taskId);
        this.file1 = res.data.find((item) => item.file_type === FILE_TYPES[2]);
        this.switchableFiles = res.data.filter((file) =>
          [FILE_TYPES[1], FILE_TYPES[3]].includes(file.file_type),
        );
        this.file2 = _.cloneDeep(this.switchableFiles[0]);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getChapterCompareAnswer() {
      try {
        this.loading = true;
        const res = await fetchChapterCompareAnswer(this.taskId, {
          doc_type: DOC_TYPE[this.file2.file_type],
        });
        res.data.forEach((item) => {
          item.diffs = formatDiffData(item.diffs, this.file1.id, this.file2.id);
        });
        this.diffList = res.data;
        this.selectDiffItem(this.diffList[0]);
        this.diffListOrigin = _.cloneDeep(res.data);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async changeDiffType(type) {
      this.diffType = type;
      this.diffList = this.diffListOrigin.filter((item) => {
        if (type === DIFF_RESULT_TYPE.ALL) {
          return true;
        }
        return type === item.type;
      });
      this.diffListIndex = 0;
      this.resetDiffNav();
      this.selectDiffItem(this.diffList[0]);
      await this.$nextTick();
      this.changeCurrentDiff(0);
    },
    async diffItemChanged(item, index) {
      if (index === this.diffListIndex) {
        this.changeCurrentDiff(0);
        return;
      }
      this.resetWidgets();
      this.diffNavIndex = -1;
      this.selectDiffItem(item);
      await this.$nextTick();
      this.changeCurrentDiff(0);
    },
    async selectDiffItem(item) {
      if (!item) {
        this.filteredDiffResult = [];
        return;
      }
      this.diffListIndex = this.diffList.findIndex((i) => i.name === item.name);
      this.filteredDiffResult = item.diffs;
    },
    async switchDiffItem(direction) {
      if (direction === 'prev') {
        if (this.diffListIndex > 0) {
          this.diffListIndex -= 1;
        }
      } else {
        if (this.diffListIndex < this.diffList.length - 1) {
          this.diffListIndex += 1;
        }
      }
      this.diffNavIndex = -1;
      this.selectDiffItem(this.diffList[this.diffListIndex]);
      await this.$nextTick();
      this.changeCurrentDiff(0);
    },
    async switchFile() {
      this.reset();
      this.file2.id = null;
      this.switchableFileIndex = this.switchableFileIndex === 0 ? 1 : 0;
      await this.$nextTick();
      this.file2 = _.cloneDeep(this.switchableFiles[this.switchableFileIndex]);
      this.getChapterCompareAnswer();
    },
    reset() {
      this.diffType = DIFF_RESULT_TYPE.ALL;
      this.diffListIndex = 0;
      this.resetWidgets();
      this.resetDiffNav();
    },
    resetWidgets() {
      [this.$refs.pdfViewer1, this.$refs.pdfViewer2].forEach((pdfViewer) => {
        pdfViewer?.resetWidgets();
      });
    },
    getDiffItemClassName(item) {
      const classList = [];
      switch (item.type) {
        case DIFF_RESULT_TYPE.CONSISTENT:
          classList.push('is-equal');
          break;
        case DIFF_RESULT_TYPE.INCONSISTENT:
          classList.push('not-equal');
          break;
        default:
          break;
      }
      if (this.diffListIndex === this.diffList.indexOf(item)) {
        classList.push('active');
      }
      return classList;
    },
    formatOutline(outline) {
      const [left, top, right, bottom] = outline;
      return [
        left,
        top,
        left === right ? right + 2 : right,
        top === bottom ? bottom + 1 : bottom,
      ];
    },
    async onDocumentReady(side) {
      this.documentReady[side] = true;

      if (!this.documentReady.left || !this.documentReady.right) {
        return;
      }

      this.setDocsSize();
      await this.$nextTick();
      this.bindDomEvents();

      if (this.enableSwitchOnlyShowDiffs) {
        this.bindOnlyDiffDomEvents();
      }

      this.renderSVGContainer();
      this.$emit('document-ready');
      this.changeCurrentDiff(0);
    },
    setDocsSize() {
      this.setLeftDocSize();
      this.setRightDocSize();
    },
    setLeftDocSize() {
      this.leftDocSize = {
        headerHeight: 40,
        docHeight:
          this.$refs.pdfViewer1.$el.querySelector('.pdfViewer').clientHeight,
        pagesHeight: Array.from(
          this.$refs.pdfViewer1.$el.querySelectorAll('.page[data-page-number]'),
        ).map((el) => el.clientHeight),
        pageMargin: 10,
        scale: this.$refs.pdfViewer1.getScale(),
      };
    },
    setRightDocSize() {
      this.rightDocSize = {
        headerHeight: 40,
        docHeight:
          this.$refs.pdfViewer2.$el.querySelector('.pdfViewer').clientHeight,
        pagesHeight: Array.from(
          this.$refs.pdfViewer2.$el.querySelectorAll('.page[data-page-number]'),
        ).map((el) => el.clientHeight),
        pageMargin: 10,
        scale: this.$refs.pdfViewer2.getScale(),
      };
    },
    async onPageRendered(page, side, options = { needUpdateDocSize: true }) {
      let isCurrentDiffPage = false;
      const currentDiff = this.filteredDiffResult[this.diffNavIndex];
      if (currentDiff) {
        if (side === 'left') {
          isCurrentDiffPage = page === this.leftViewerCurrentPage;
        }
        if (side === 'right') {
          isCurrentDiffPage = page === this.rightViewerCurrentPage;
        }
      }

      if (isCurrentDiffPage) {
        if (options.needUpdateDocSize) {
          this.updateDocsSize(side);

          await this.$nextTick();
          this.isCurrentAnnotationInCenter = true;
          this.setDiffControlsBarPosition();
          this.isCurrentAnnotationInCenter = false;
        } else {
          this.syncPDFViewerPositionByDiffControlBar(side);
        }

        setTimeout(() => {
          this.highlightCurrentDiffBlocks(side);
          this.renderSVGPolyline(side);
          this.diffRendered[side] = true;

          if (this.diffRendered.left && this.diffRendered.right) {
            this.diffRendering = false;
          }
        });
      }
    },
    highlightCurrentDiffBlocks(side) {
      let pdfViewer = null;
      if (side === 'left') {
        pdfViewer = this.$refs.pdfViewer1;
      } else {
        pdfViewer = this.$refs.pdfViewer2;
      }
      this.filteredDiffResult.forEach((item, i) => {
        [...item[`${side}Blocks`], ...item[`${side}Boxes`]].forEach(
          (boxItem) => {
            const widget = pdfViewer.getWidgetById(boxItem.id);
            if (widget) {
              if (i == this.diffNavIndex) {
                widget.addClass('highlight');
              } else {
                widget.removeClass('highlight');
              }
            }
          },
        );
      });
    },
    updateDocsSize(side) {
      const previousDocHeight =
        side === 'left'
          ? this.leftDocSize.docHeight
          : this.rightDocSize.docHeight;
      const updatedDocHeight =
        side === 'left'
          ? this.$refs.pdfViewer1.$el.querySelector('.pdfViewer').clientHeight
          : this.$refs.pdfViewer2.$el.querySelector('.pdfViewer').clientHeight;

      if (previousDocHeight === updatedDocHeight) {
        return;
      }

      if (side === 'left') {
        this.setLeftDocSize();
      } else if (side === 'right') {
        this.setRightDocSize();
      }
    },
    removeNoDiffContent() {
      [this.$refs.pdfViewer1, this.$refs.pdfViewer2].forEach((pdfViewer) => {
        pdfViewer.$refs.pdfViewerContainer.$el.querySelector('.tips')?.remove();
      });
    },
    renderNoDiffContent(pdfViewer) {
      const tips = document.createElement('div');
      tips.className = 'tips';
      tips.innerHTML =
        '<i class="el-icon-warning"></i> 此审核点所指内容在原文中没有对应文本';
      pdfViewer.$refs.pdfViewerContainer.$el.appendChild(tips);
    },
    async changeCurrentDiff(diffIndex, options = { inCenter: false }) {
      diffIndex = Number(diffIndex);

      if (diffIndex < 0 || diffIndex === this.diffNavIndex) {
        return;
      }

      const currentDiff = this.filteredDiffResult[diffIndex];

      this.diffRendered = { left: false, right: false };
      this.clearSVGPolyline();
      this.clearCurrentDiffMark();
      this.removeNoDiffContent();

      if (!currentDiff) {
        const diffItem = this.diffList[this.diffListIndex];
        if (!diffItem) {
          return;
        }
        if (diffItem.left?.data[0]?.boxes[0]) {
          this.leftViewerCurrentPage = diffItem.left?.data[0]?.boxes[0].page;
          this.$refs.pdfViewer1.jumpToPage(this.leftViewerCurrentPage);
        } else {
          this.renderNoDiffContent(this.$refs.pdfViewer1);
        }
        if (diffItem.right?.data[0]?.boxes[0]) {
          this.rightViewerCurrentPage = diffItem.right?.data[0]?.boxes[0].page;
          this.$refs.pdfViewer2.jumpToPage(this.rightViewerCurrentPage);
        } else {
          this.renderNoDiffContent(this.$refs.pdfViewer2);
        }
        return;
      }

      this.diffRendering = true;
      this.diffNavIndex = diffIndex;
      if (currentDiff.leftFirstBox) {
        this.leftViewerCurrentPage = currentDiff.leftFirstBox.page;
      }
      if (currentDiff.rightFirstBox) {
        this.rightViewerCurrentPage = currentDiff.rightFirstBox.page;
      }

      const isCrossPageDiffs =
        currentDiff.leftBoxes.some(
          (item) => item.page !== this.$refs.pdfViewer1.currentPageNumber - 1,
        ) ||
        currentDiff.rightBoxes.some(
          (item) => item.page !== this.$refs.pdfViewer2.currentPageNumber - 1,
        );

      const diffControlDom = this.diffControlsBar.querySelector(
        `.diff-control-item:nth-of-type(${this.diffNavIndex + 1})`,
      );
      const { top: diffIconTop, bottom: diffIconBottom } =
        diffControlDom.getBoundingClientRect();
      const viewportBottomDistance = window.innerHeight - diffIconBottom;
      const isOverViewport =
        diffIconTop < 100 ||
        currentDiff.leftBlocks.some(
          (item) =>
            (item.outline[3] - item.outline[1]) *
              this.$refs.pdfViewer1.getScale() >
            viewportBottomDistance,
        ) ||
        currentDiff.rightBlocks.some(
          (item) =>
            (item.outline[3] - item.outline[1]) *
              this.$refs.pdfViewer2.getScale() >
            viewportBottomDistance,
        );

      this.isCurrentAnnotationInCenter =
        options.inCenter || isCrossPageDiffs || isOverViewport;

      await this.$nextTick();

      this.setDiffControlsBarPosition();

      const leftRenderedPages = this.$refs.pdfViewer1.getRenderedPages();
      this.$refs.pdfViewer1.jumpToPage(this.leftViewerCurrentPage);
      if (leftRenderedPages.includes(this.leftViewerCurrentPage)) {
        this.onPageRendered(this.leftViewerCurrentPage, 'left', {
          needUpdateDocSize: false,
        });
      }

      const rightRenderedPages = this.$refs.pdfViewer2.getRenderedPages();
      this.$refs.pdfViewer2.jumpToPage(this.rightViewerCurrentPage);
      if (rightRenderedPages.includes(this.rightViewerCurrentPage)) {
        this.onPageRendered(this.rightViewerCurrentPage, 'right', {
          needUpdateDocSize: false,
        });
      }
      this.$emit('change-current-diff');
    },
    bindDomEvents() {
      this.pdfViewerLeft = this.$refs.pdfViewer1.$el.querySelector(
        '[data-id="viewerContainer"]',
      );
      this.pdfViewerRight = this.$refs.pdfViewer2.$el.querySelector(
        '[data-id="viewerContainer"]',
      );
      this.diffControlsBar = this.$refs.diffControlsBar.$el;

      this.pdfViewerLeft.addEventListener('scroll', () => {
        this.scrollPdfViewerLeft();
      });
      this.pdfViewerLeft.addEventListener('mouseenter', () => {
        this.isScrollLeftViewer = true;
      });
      this.pdfViewerLeft.addEventListener('mouseleave', () => {
        this.isScrollLeftViewer = false;
      });

      this.pdfViewerRight.addEventListener('scroll', () => {
        this.scrollPdfViewerRight();
      });

      this.diffControlsBar.addEventListener(
        'scroll',
        this.scrollDiffControlsBar,
      );
      this.diffControlsBar.addEventListener('mouseenter', () => {
        this.isScrollLeftViewer = false;
      });
      if (this.enableComment) {
        this.leftCommentsControlBar = this.$refs.leftCommentsControlBar.$el;
        this.rightCommentsControlBar = this.$refs.rightCommentsControlBar.$el;
        this.leftCommentsControlBar.addEventListener(
          'wheel',
          (e) => {
            e.preventDefault();
          },
          {
            passive: false,
          },
        );
        this.rightCommentsControlBar.addEventListener(
          'wheel',
          (e) => {
            e.preventDefault();
          },
          {
            passive: false,
          },
        );
      }
      window.addEventListener('resize', this.afterWindowResize);
    },
    scrollPdfViewerLeft() {
      this.renderSVGPolyline('left');
      if (this.isScrollLeftViewer && !this.diffRendering) {
        const diffActiveIconDom = this.diffControlsBar.querySelector(
          '.diff-control-item.active',
        );

        if (diffActiveIconDom) {
          const { top: diffActiveTop } =
            diffActiveIconDom.getBoundingClientRect();
          const currentDiff = this.filteredDiffResult[this.diffNavIndex];

          const annotationIDs = currentDiff.leftBoxes
            .concat(currentDiff.leftBlocks)
            .map((item) => item.id);

          if (annotationIDs.length > 0) {
            const leftAnnotationElement = this.pdfViewerLeft.querySelector(
              `[data-id="${annotationIDs[0]}"]`,
            );

            if (leftAnnotationElement) {
              const { top: leftAnnotationElementTop } =
                leftAnnotationElement.getBoundingClientRect();

              this.diffControlsBar.scrollTop -=
                leftAnnotationElementTop - diffActiveTop;
            } else {
              this.diffControlsBar.scrollTop = this.pdfViewerLeft.scrollTop;
            }
          } else {
            this.diffControlsBar.scrollTop = this.pdfViewerLeft.scrollTop;
          }
        } else {
          this.diffControlsBar.scrollTop = this.pdfViewerLeft.scrollTop;
        }
      }
    },
    scrollDiffControlsBar() {
      this.isCurrentAnnotationInCenter = false;

      if (!this.isScrollLeftViewer && !this.diffRendering) {
        this.syncPDFViewerPositionByDiffControlBarDebounce();
      }
      this.renderSVGPolyline('left');
      this.renderSVGPolyline('right');
    },
    scrollPdfViewerRight() {
      this.renderSVGPolyline('right');
    },
    renderSVGPolyline(side) {
      let pdfViewer;
      if (side === 'left') {
        pdfViewer = this.pdfViewerLeft;
      } else if (side === 'right') {
        pdfViewer = this.pdfViewerRight;
      }

      if (!pdfViewer) {
        return;
      }
      const lineExisted = this.svgContainerEl.querySelector(
        `[data-side="${side}"]`,
      );
      if (lineExisted) {
        lineExisted.remove();
      }

      const isLeftViewer = side === 'left';

      const diffIconDom = document.querySelector('.diff-control-item.active');
      if (!diffIconDom) {
        return;
      }

      const currentDiff = this.filteredDiffResult[this.diffNavIndex];

      if (!currentDiff) {
        return;
      }

      const {
        top: diffIconDomTop,
        bottom: diffIconDomBottom,
        left: diffIconDomLeft,
        right: diffIconDomRight,
      } = diffIconDom.getBoundingClientRect();

      let linePoints = [];
      if (isLeftViewer) {
        if (!currentDiff.leftFirstBox) {
          return;
        }
        const page = currentDiff.leftFirstBox.page;
        const pageDom = pdfViewer.querySelectorAll('.page')[page];
        if (!pageDom) {
          return;
        }

        const pageViewer = pageDom.querySelector('.canvasWrapper');
        if (!pageViewer) {
          return;
        }

        const annotationLayer = pageDom.querySelector('.annotationEditorLayer');
        if (!annotationLayer) {
          return;
        }

        const allBoxes = currentDiff.leftBoxes
          .concat(currentDiff.leftBlocks)
          .map((item) =>
            annotationLayer.querySelector(
              `.annotationEditor[data-id="${item.id}"]`,
            ),
          )
          .filter((item) => item);

        if (allBoxes.length === 0) {
          return;
        }

        let boxLeft, boxTop, boxRight, boxBottom;
        allBoxes.forEach((boxEl) => {
          const { top, right, bottom, left } = boxEl.getBoundingClientRect();
          boxLeft = boxLeft !== undefined ? Math.min(boxLeft, left) : left;
          boxTop = boxTop !== undefined ? Math.min(boxTop, top) : top;
          boxRight = boxRight !== undefined ? Math.max(boxRight, right) : right;
          boxBottom =
            boxBottom !== undefined ? Math.max(boxBottom, bottom) : bottom;
        });

        const { right: pageViewerRight } = pdfViewer.getBoundingClientRect();
        const { right: pageRight } = pageViewer.getBoundingClientRect();

        const startX = boxRight;
        const startY = boxTop + (boxBottom - boxTop) / 2;
        const endX = diffIconDomLeft;
        const endY = diffIconDomTop + (diffIconDomBottom - diffIconDomTop) / 2;

        let mid1X = pageRight;
        const mid1Y = startY;
        let mid2X = pageRight + (pageViewerRight - pageRight) / 2;
        const mid2Y = endY;

        if (endX <= startX) {
          return;
        }

        if (pageViewerRight <= pageRight) {
          const offsetX = endX - startX;
          mid1X = startX + (offsetX * 3) / 5;
          mid2X = endX - (offsetX * 1) / 5;
        }

        linePoints = [
          `${startX} ${startY}`,
          `${mid1X} ${mid1Y}`,
          `${mid2X} ${mid2Y}`,
          `${endX} ${endY}`,
        ];
      } else {
        if (!currentDiff.rightFirstBox) {
          return;
        }

        const page = currentDiff.rightFirstBox.page;
        const pageDom = pdfViewer.querySelectorAll('.page')[page];
        if (!pageDom) {
          return;
        }

        const pageViewer = pageDom.querySelector('.canvasWrapper');
        if (!pageViewer) {
          return;
        }

        const annotationLayer = pageDom.querySelector('.annotationEditorLayer');
        if (!annotationLayer) {
          return;
        }

        const allBoxes = currentDiff.rightBoxes
          .concat(currentDiff.rightBlocks)
          .map((item) =>
            annotationLayer.querySelector(
              `.annotationEditor[data-id="${item.id}"]`,
            ),
          )
          .filter((item) => item);

        if (allBoxes.length === 0) {
          return;
        }

        let boxLeft, boxTop, boxRight, boxBottom;
        allBoxes.forEach((boxEl) => {
          const { top, right, bottom, left } = boxEl.getBoundingClientRect();
          boxLeft = boxLeft !== undefined ? Math.min(boxLeft, left) : left;
          boxTop = boxTop !== undefined ? Math.min(boxTop, top) : top;
          boxRight = boxRight !== undefined ? Math.max(boxRight, right) : right;
          boxBottom =
            boxBottom !== undefined ? Math.max(boxBottom, bottom) : bottom;
        });

        const { left: pageViewerLeft } = pdfViewer.getBoundingClientRect();
        const { left: pageLeft } = pageViewer.getBoundingClientRect();

        const startX = diffIconDomRight;
        const startY =
          diffIconDomTop + (diffIconDomBottom - diffIconDomTop) / 2;
        const endX = boxLeft;
        const endY = boxTop + (boxBottom - boxTop) / 2;

        if (endX <= startX) {
          return;
        }

        let mid1X = pageViewerLeft + (pageLeft - pageViewerLeft) / 2;
        const mid1Y = startY;
        let mid2X = pageLeft;
        const mid2Y = endY;

        if (pageLeft <= pageViewerLeft) {
          const offsetX = endX - startX;
          mid1X = startX + (offsetX * 1) / 5;
          mid2X = endX - (offsetX * 3) / 5;
        }

        linePoints = [
          `${startX} ${startY}`,
          `${mid1X} ${mid1Y}`,
          `${mid2X} ${mid2Y}`,
          `${endX} ${endY}`,
        ];
      }

      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polyline',
      );

      line.setAttribute('points', linePoints.join(','));
      line.setAttribute('data-side', side);
      line.setAttribute('style', `stroke: #ffbaba`);

      this.svgContainerEl.firstChild.appendChild(line);
    },
    clearSVGPolyline() {
      if (this.svgContainerEl) {
        Array.from(this.svgContainerEl.querySelectorAll('polyline')).forEach(
          (el) => el.remove(),
        );
      }
    },
    clearCurrentDiffMark() {
      Array.from(
        this.pdfViewerLeft.querySelectorAll(`.annotationEditor.active`),
      )
        .concat(
          Array.from(
            this.pdfViewerRight.querySelectorAll(`.annotationEditor.active`),
          ),
        )
        .forEach((el) => el.classList.remove('active'));
    },
    async syncRenderSVGPolyline() {
      // resize事件触发 dom还未渲染好
      setTimeout(() => {
        this.changeCurrentDiff(this.diffNavIndex);
      }, 10);
    },
    syncPDFViewerPositionByDiffControlBar(side) {
      const diffActiveIconDom = this.diffControlsBar.querySelector(
        '.diff-control-item.active',
      );

      let preLeftScrollTop = this.pdfViewerLeft.scrollTop;
      if (diffActiveIconDom) {
        const { top: diffActiveTop } =
          diffActiveIconDom.getBoundingClientRect();
        const currentDiff = this.filteredDiffResult[this.diffNavIndex];

        if (!side || side === 'left') {
          const annotationIDs = currentDiff.leftBoxes
            .concat(currentDiff.leftBlocks)
            .map((item) => item.id);

          if (annotationIDs.length > 0) {
            const leftAnnotationElement = this.pdfViewerLeft.querySelector(
              `[data-id="${annotationIDs[0]}"]`,
            );

            if (leftAnnotationElement) {
              const { top: leftAnnotationElementTop } =
                leftAnnotationElement.getBoundingClientRect();

              this.pdfViewerLeft.scrollTop +=
                leftAnnotationElementTop - diffActiveTop;
            } else {
              this.pdfViewerLeft.scrollTop = this.diffControlsBar.scrollTop;
            }
          } else {
            this.pdfViewerLeft.scrollTop = this.diffControlsBar.scrollTop;
          }
        }

        if (!side || side === 'right') {
          const annotationIDs = currentDiff.rightBoxes
            .concat(currentDiff.rightBlocks)
            .map((item) => item.id);

          if (annotationIDs.length > 0) {
            const rightAnnotationElement = this.pdfViewerRight.querySelector(
              `[data-id="${annotationIDs[0]}"]`,
            );

            if (rightAnnotationElement) {
              const { top: rightAnnotationElementTop } =
                rightAnnotationElement.getBoundingClientRect();

              this.pdfViewerRight.scrollTop +=
                rightAnnotationElementTop - diffActiveTop;
            } else {
              this.pdfViewerRight.scrollTop -=
                preLeftScrollTop - this.diffControlsBar.scrollTop;
            }
          } else {
            this.pdfViewerRight.scrollTop -=
              preLeftScrollTop - this.diffControlsBar.scrollTop;
          }
        }
      } else {
        this.pdfViewerLeft.scrollTop = this.diffControlsBar.scrollTop;
        this.pdfViewerRight.scrollTop -=
          preLeftScrollTop - this.diffControlsBar.scrollTop;
      }
    },
    setDiffControlsBarPosition() {
      const diffActiveIconDom = this.diffControlsBar?.querySelector(
        '.diff-control-item.active',
      );
      if (diffActiveIconDom) {
        if (this.isDemo) {
          this.diffControlsBar.scrollTo({
            top: diffActiveIconDom.offsetTop - window.innerHeight / 2,
          });
        } else {
          if (this.isCurrentAnnotationInCenter) {
            diffActiveIconDom.scrollIntoView({ block: 'center' });
          } else {
            diffActiveIconDom.scrollIntoViewIfNeeded();
          }
        }
      }
    },
    renderSVGContainer() {
      const className = 'diff-svg-container';
      const existedSvg = this.$refs.pdfViewerWrapper.querySelector(
        `.${className}`,
      );
      if (existedSvg) {
        existedSvg.remove();
      }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('style', 'fill:transparent;');
      svg.classList.add(className);
      svg.appendChild(g);
      this.$refs.pdfViewerWrapper.appendChild(svg);
      this.svgContainerEl = svg;
    },
    resetDiffNav() {
      this.diffNavIndex = -1;
      this.clearSVGPolyline();
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter-diff-container {
  display: flex;
  height: 100vh;
  .pdf-viewer-wrapper {
    position: relative;
    display: flex;
    flex: 4;
    min-width: 1080px;
    .file-pdf-viewer-wrapper {
      flex: 1;
      ::v-deep .document-viewer-toolbar {
        position: relative;
        z-index: 2003;
        box-shadow: none;
      }
      ::v-deep .annotationEditor:not(.editing):not(.linkEditor) {
        pointer-events: none;
        &.widget-border-box {
          .editor-content {
            stroke: #1d89ff;
            fill: rgba(#1d89ff, 0.2);
          }
        }
        &.widget-rect {
          .editor-content {
            stroke: none !important;
            fill: transparent;
          }
        }
        &.highlight.widget-rect {
          .editor-content {
            fill: rgba(#fbeb6e, 0.3);
          }
        }
        &.diff-widget {
          .editor-content {
            stroke: none;
            fill: transparent !important;
          }
        }
        &.highlight.diff-widget {
          .editor-content {
            fill: rgba(#d43636, 0.3) !important;
          }
        }
      }
      ::v-deep .tips {
        position: absolute;
        top: 40px;
        left: 20px;
        width: calc(100% - 40px);
        padding: 5px 10px;
        background: #ffff00c2;
        color: #d43636;
        font-size: 13px;
        box-sizing: border-box;
        text-align: center;
      }
    }
    ::v-deep .document-viewer-toolbar {
      .toolbar-back,
      .toolbar-fileinfo,
      .toolbar-files-summary,
      .scale-operation {
        display: none;
      }
      .file-type {
        margin: 0 20px;
        padding: 3px 15px;
        font-size: 13px;
        border: 1px solid #0291c0;
        border-radius: 15px;
        em {
          font-style: normal;
          color: #0291c0;
        }
      }
      .btn-file-switch {
        padding: 5px 8px;
        &:hover {
          color: #fff;
          background-color: #0291c0;
        }
      }
    }
    .diff-control-nav {
      position: relative;
      display: flex;
      flex-flow: column;
      width: 60px;
      overflow: hidden;
      .nav {
        position: relative;
        z-index: 2002;
        background-color: #fff;
        .nav-nums {
          display: flex;
          justify-content: space-around;
          margin: 10px 0;
          font-size: 14px;
        }
        .nav-btns {
          display: flex;
          justify-content: space-evenly;
          .el-button {
            margin: 0;
            padding: 2px;
          }
        }
      }
      .diff-icons {
        flex: 1;
        li {
          position: absolute;
          width: 100%;
          height: 20px;
          line-height: 20px;
          list-style: none;
          text-align: center;
          &.active {
            background-color: #ffbaba;
          }
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -8px 0 0 -8px;
            color: #d22727;
            cursor: pointer;
            z-index: 2001;
          }
        }
      }
    }
    ::v-deep .diff-svg-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2000;
    }
  }
  .diff-aside {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    border-left: 1px solid #d5d5d5;
    min-width: 160px;
    .diff-filter {
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      padding: 6px 10px 5px;
      background: #fff;
      font-size: 14px;
      box-shadow: 0 0 3px #ccc;
      .el-select {
        flex: 1;
        margin-left: 10px;
      }
    }
    .diff-list {
      padding: 0 10px;
      list-style: none;
      li {
        margin: 8px 0;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #a9a9a9;
        font-size: 13px;
        cursor: pointer;
        &::before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          vertical-align: middle;
          border-radius: 50%;
          background-color: #a9a9a9;
        }
        &:hover {
          background-color: rgba(#a9a9a9, 0.05);
        }
        &.active {
          color: #fff;
          background-color: #a9a9a9;
          &::before {
            background-color: #fff !important;
          }
        }
        &.is-equal {
          border-color: #66af10;
          &::before {
            background-color: #66af10;
          }
          &:hover {
            background-color: rgba(#66af10, 0.05);
          }
          &.active {
            color: #fff;
            background-color: #66af10;
          }
        }
        &.not-equal {
          border-color: #d22727;
          &::before {
            background-color: #d22727;
          }
          &:hover {
            background-color: rgba(#d22727, 0.05);
          }
          &.active {
            color: #fff;
            background-color: #d22727;
          }
        }
      }
    }
  }
  .diff-nav {
    position: absolute;
    right: 38px;
    top: 40%;
    display: flex;
    flex-flow: column;
    align-items: baseline;
    .num {
      width: 100%;
      margin-bottom: 10px;
      text-align: center;
      font-size: 14px;
    }
    .el-button {
      margin: 5px 0;
    }
  }
}
</style>
