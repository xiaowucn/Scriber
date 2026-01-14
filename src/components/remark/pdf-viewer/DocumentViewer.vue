<template>
  <div class="document-viewer">
    <toolbar
      ref="toolbar"
      v-if="showToolbar"
      :show-toolbar-left="showToolbarLeft"
      :show-go-back-button="showGoBackButton"
      :show-thumb-button="showThumbButton"
      :show-chapter-button="showChapterButton"
      :show-search-button="showSearchButton"
      :show-file-info="showFileInfo"
      :is-iframe-mode="isIframeMode"
      :file-info="fileInfo"
      :page-total="pageTotal"
      :search-result="searchResult"
      :current-page-number="currentPageNumber"
      :default-scale="defaultScale"
      :get-scale="getScale"
      @toggle-thumbnail="toggleThumbnail"
      @toggle-chapter="toggleChapter"
      @search="search"
      @search-nav-clicked="jumpToSearchResult"
      @page-nav-clicked="handlePageNavClicked"
      @page-change="changeCurrentPageNumber"
      @scale-change="changeScale">
      <template slot="toolbar">
        <slot name="toolbar"></slot>
      </template>
    </toolbar>

    <div
      class="viewer-wrapper"
      :class="{
        'use-pdfjs-toolbar': usePdfjsToolbar,
        'has-left-nav': usePdfjsToolbar && (showThumbnaill || showChapterTree),
      }">
      <chapter-tree
        ref="chapterTree"
        v-if="showChapterTree"
        :file-info="fileInfo"
        :get-scale="getScale"
        :getScrollTop="getScrollTop"
        :getPdfPages="getPdfPages"
        @chapter-node-cliked="chapterNodeCliked"></chapter-tree>

      <thumbnail
        v-if="showThumbnaill"
        ref="thumbnail"
        :thumbnail-list="thumbnailList"
        :thumbnail-page-actived="thumbnailPageActived"
        @thumbnail-page-clicked="thumbnailPageClicked"></thumbnail>

      <div ref="viewer" class="viewer">
        <slot name="announcement-name"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { createViewer, AnnotationType } from 'pdf-document-viewer';
import 'pdf-document-viewer/style.css';
import Toolbar from './add-ons/Toolbar';
import ChapterTree from './add-ons/ChapterTree';
import Thumbnail from './add-ons/Thumbnail';
import { baseURL, getTokenFromUrl } from '@/store/api/http';
import { searchKeyword } from '@/store/api/file.api';
import {
  PredictionTools,
  PredictAnnotationTypes,
} from '@paoding/prediction-tools';
import { CMFCHINA_WIDGET_TYPES } from '@/custom/cmfchina/common/constant';
import { isENLang } from '@/store/constants';

const searchWidgetSubType = 'search';

export default {
  name: 'document-viewer',
  components: { Toolbar, ChapterTree, Thumbnail },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileInfo: {
      type: Object,
      required: true,
    },
    fileUrl: {
      type: String,
      required: false,
    },
    defaultScale: {
      type: Number,
      required: false,
      default: -1,
    },
    showToolbar: {
      type: Boolean,
      required: false,
      default: true,
    },
    showToolbarLeft: {
      type: Boolean,
      required: false,
      default: true,
    },
    showGoBackButton: {
      type: Boolean,
      required: false,
    },
    showThumbButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showChapterButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSearchButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    showFileInfo: {
      type: Boolean,
      required: false,
      default: true,
    },
    isIframeMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    showChapterTree: {
      type: Boolean,
      required: false,
      default: false,
    },
    showThumbnaill: {
      type: Boolean,
      required: false,
      default: false,
    },
    thumbnailList: {
      type: Array,
      required: false,
      default: () => [],
    },
    thumbnailPageActived: {
      type: Number,
      required: false,
      default: 0,
    },
    widgetEvents: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    pdfWidgetTypes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      app: null,
      widgetActived: null,
      currentPageNumber: 1,
      searchResult: {
        currentIndex: -1,
        total: 0,
        data: [],
      },
      annotationType: {
        'select-text': AnnotationType.SelectText,
        'rect-copy': AnnotationType.Square,
        rect: AnnotationType.Square,
        table: AnnotationType.Table,
        search: AnnotationType.Square,
      },
      widgetTypes: [
        {
          type: 'select-text',
          subType: 'select-text',
          classNames: ['select-text'],
          operations: [],
        },
        {
          type: 'rect-copy',
          subType: 'rect-copy',
          classNames: ['rect-copy'],
          showControlBar: true,
          operations: [
            {
              title: '复制',
              type: 'copy-text',
              floatType: 'bottom',
              iconClassList: ['copy-text'],
              dataset: {
                type: 'copy-text',
              },
              handler: (data) => {
                this.$emit('copy-text-by-rect', data);
              },
            },
          ],
        },
        {
          type: 'rect',
          subType: 'widget-border-box',
          classNames: ['widget-border-box'],
          operations: [],
        },
        {
          type: 'rect',
          subType: 'diff-widget',
          classNames: ['diff-widget'],
          operations: [],
        },
        {
          type: 'rect',
          subType: 'widget-rect',
          classNames: ['widget-rect'],
          operations: [],
        },
        {
          type: 'table',
          subType: 'widget-table',
          classNames: ['table-wrapper'],
          operations: [],
        },
      ],
      predictionTools: null,
    };
  },
  computed: {
    pdfUrl() {
      if (this.fileUrl) {
        return this.fileUrl;
      }
      const baseUrl = `${window.location.origin}${window.location.pathname}${baseURL}`;
      let pdfUrl = `${baseUrl}/plugins/fileapi/file/${this.fileId}/pdf`;
      const { hasToken, tokenValue } = getTokenFromUrl();
      if (this.$platform.isEciticEnv()) {
        pdfUrl = `${baseUrl}/plugins/ecitic/files/${this.fileId}/pdf`;
      }
      if (hasToken) {
        pdfUrl = `${pdfUrl}?_bearer_token=${tokenValue}`;
      }
      return pdfUrl;
    },
    eventBus() {
      return this.app ? this.app.eventBus : null;
    },
    pageTotal() {
      return this.app ? this.app.pages.length : 0;
    },
    usePdfjsToolbar() {
      return import.meta.env.VITE_DIST === 'HKEX';
    },
    predictAnnotationTypes() {
      return Object.keys(PredictAnnotationTypes).reduce(
        (list, type) =>
          list.concat(
            PredictAnnotationTypes[type].map((customType) => ({
              type: PredictAnnotationTypes.Table.includes(customType)
                ? AnnotationType.Table
                : AnnotationType.Square,
              customType,
              classNames: ['predict-annotation'],
              operations: [],
            })),
          ),
        [],
      );
    },
  },
  watch: {
    readOnly(val) {
      if (!val) {
        this.changeAnnotationType(AnnotationType.Square);
      } else {
        this.changeAnnotationType(AnnotationType.Null);
      }
    },
  },
  async mounted() {
    const appOptions = this.createAppOptions();
    this.app = createViewer(this.$refs.viewer, appOptions);
    await this.app.readyPromise;

    this.predictionTools = new PredictionTools(this.app);
    this.injectCustomWidgetTypes();
    this.registerWidgetTypes([
      ...this.widgetTypes,
      ...this.pdfWidgetTypes,
      ...this.predictAnnotationTypes,
    ]);
    this.setScale();
    this.bindEvents();
    this.addChapterToggleButton();
    this.addThumbnailToggleButton();
    this.addScrollEvent();
    this.syncCurrentPageNumber({ pageNumber: this.app.page });

    this.$emit('viewer-ready');
  },
  beforeDestroy() {
    this.unbindEvents();
    this.app.close();
  },
  methods: {
    createAppOptions() {
      let pathname = window.location.pathname.replace('index.html', '');
      pathname = pathname + (pathname.endsWith('/') ? '' : '/');

      const appOptions = {
        defaultUrl: this.pdfUrl,
        resourcePath: `${pathname}static/pdf-document-viewer/`,
        locale: isENLang ? 'en-US' : 'zh-CN',
        viewOnLoad: 0,
        sidebarViewOnLoad: 0,
        spreadModeOnLoad: 0,
        textLayerMode: 1,
        annotationMode: 1,
        enableWordSegmentation: false,
        disableViewerToolbar: !this.usePdfjsToolbar,
        disableDocAnnotation: this.$features.disablePdfViewerDocAnnotation(),
        disableStream: true,
        disableAutoFocus: true,
        disableAnnotationList: true,
        disableCollaborate: true,
        disableDraggingAndDropping: true,
        disableHistory: true, // 禁用PDF.js的历史记录功能，避免翻页时影响浏览器历史记录
        fontHostServer: `${pathname}pdfonts`,
      };

      return appOptions;
    },
    bindEvents() {
      this.app.annotationManager.on('pagesloaded', this.onPagesLoaded);
      this.app.annotationManager.on('pagechanging', this.syncCurrentPageNumber);
      this.app.annotationManager.on('pagerendered', this.onPageRendered);
      this.app.annotationManager.on('annot-click', this.onClickWidget);
      this.app.annotationManager.on('annot-created', this.onDrawingEnd);
      this.app.annotationManager.on(
        'annot-table-cell-active',
        this.selectTableWidgetCell,
      );
      this.app.annotationManager.on(
        'annot-rendered',
        this.onAnnotationRendered,
      );
      this.app.eventBus.on('updatetextlayermatches', this.handlePdfjsSearch);
    },
    unbindEvents() {
      this.app.annotationManager.off(
        'pagechanging',
        this.syncCurrentPageNumber,
      );
      this.app.annotationManager.off('pagesloaded', this.onPagesLoaded);
      this.app.annotationManager.off('pagerendered', this.onPageRendered);
      this.app.annotationManager.off('annot-click', this.onClickWidget);
      this.app.annotationManager.off('annot-created', this.onDrawingEnd);
      this.app.annotationManager.off(
        'annot-table-cell-active',
        this.selectTableWidgetCell,
      );
      this.app.annotationManager.off(
        'annot-rendered',
        this.onAnnotationRendered,
      );
      this.app.eventBus.off('updatetextlayermatches', this.handlePdfjsSearch);

      this.app.unbindEvents();
      this.app.unbindWindowEvents();
    },

    injectCustomWidgetTypes() {
      if (this.$platform.isCmfchinaEnv()) {
        this.widgetTypes.push(...CMFCHINA_WIDGET_TYPES);
      }
    },

    registerWidgetTypes(widgetTypes) {
      this.app.registerAnnotation(this.annotationType.search, {
        customType: searchWidgetSubType,
        classNames: ['search-result'],
        isResizeEnable: false,
        isAlwaysShow: true,
        isAlwaysShowControlBar: false,
      });

      widgetTypes.forEach((widgetSubType) => {
        const {
          type,
          customType,
          subType,
          classNames,
          operations,
          showControlBar,
        } = widgetSubType;

        operations.forEach((item) => {
          this.app.registerAnnotationOperation(subType, item.floatType, {
            type: item.type,
            handleDOMEvents: {
              click: (data, event) => {
                event.stopPropagation();
                item.handler(data);
              },
            },
            classNames: item.iconClassList,
            render() {
              const li = document.createElement('li');
              li.innerHTML = '<i class="el-icon-document-copy"></i>';
              li.title = item.title;
              return li;
            },
          });
        });

        this.app.registerAnnotation(this.annotationType[type] || type, {
          customType: customType || subType,
          classNames: [...classNames, customType],
          isResizeEnable: false,
          isAlwaysShow: true,
          isAlwaysShowControlBar: showControlBar || false,
          locked: false,
        });
      });

      if (!this.readOnly) {
        this.changeAnnotationType(AnnotationType.Square);
      } else {
        this.changeAnnotationType(AnnotationType.Null);
      }
    },

    changeAnnotationType(type) {
      this.app.changeAnnotationType(type);
    },

    setSelectTextMode() {
      this.changeAnnotationType(AnnotationType.SelectText);
    },

    setDrawRectMode() {
      this.changeAnnotationType(AnnotationType.Square);
    },

    addWidgets(data, callback) {
      const { uuid, type, page, subType, outline, rect, label } = data;

      const widgetData = {
        ...data,
        id: uuid,
        annotationType: this.annotationType[type],
        customType: subType || 'widget-border-box',
        pageNumber: page + 1,
        rect: rect || outline,
        rotation: -this.fileInfo.pageInfo[page].rotate,
      };

      this.predictionTools.addBlock(widgetData);

      const widget = this.getWidgetById(uuid);
      if (widget) {
        setTimeout(() => {
          callback && callback(widget, label);
        });
      } else {
        setTimeout(() => {
          const widget = this.getWidgetById(uuid);
          if (widget) {
            callback && callback(widget, label);
          }
        }, 200);
      }

      return uuid;
    },
    removeWidgets(widgetIDs) {
      widgetIDs.forEach((id) => {
        const existedWidget = this.getWidgetById(id);
        if (existedWidget) {
          this.$nextTick(() => {
            this.app.removeAnnotationById(existedWidget.id);
          });
        }
      });
    },
    addChapterToggleButton() {
      const chapterBtn = document.createElement('span');
      chapterBtn.setAttribute('class', 'fa fa-bars toolbar-button chapter');
      chapterBtn.onclick = () => this.toggleChapter();

      const menuContainer = document.querySelector(
        '[data-id="toolbarViewerLeft"]',
      );
      if (menuContainer) {
        menuContainer.insertBefore(chapterBtn, menuContainer.children[0]);
      }
    },
    addThumbnailToggleButton() {
      const thumbnailBtn = document.createElement('span');
      thumbnailBtn.setAttribute(
        'class',
        'fas fa-images toolbar-button thumbnail',
      );
      thumbnailBtn.onclick = () => this.toggleThumbnail();

      const menuContainer = document.querySelector(
        '[data-id="toolbarViewerLeft"]',
      );
      if (menuContainer) {
        menuContainer.insertBefore(thumbnailBtn, menuContainer.children[0]);
      }
    },
    addScrollEvent() {
      this.app.pdfViewer.container.addEventListener('scroll', () => {
        this.scrollChapterIntoView();
      });
    },
    onPagesLoaded() {
      this.$emit('pages-loaded');
    },
    onAnnotationRendered(annot) {
      this.$emit('annotation-rendered', annot);
    },
    onPageRendered({ pageNumber }) {
      const page = pageNumber - 1;
      if (!_.isEmpty(this.fileInfo)) {
        this.app.rotatePageView(
          pageNumber,
          -this.fileInfo.pageInfo[page].rotate,
        );
      }
      const searchResultItems = [];
      const currentSearchResult =
        this.searchResult.data[this.searchResult.currentIndex];
      if (currentSearchResult && currentSearchResult.page === page) {
        searchResultItems.push(currentSearchResult);
      }
      searchResultItems.forEach((item) => this.addSearchWidget(item));

      this.handlePdfjsSearch();

      this.$emit('page-rendered', pageNumber - 1);
    },
    onClickWidget({ annotation, event }) {
      event.stopPropagation();
      const subType = annotation.subtype;

      if ('Link'.includes(subType)) {
        return;
      }

      this.$emit('widget-clicked', { widget: annotation });

      if (this.widgetEvents[subType] && this.widgetEvents[subType].click) {
        this.widgetEvents[subType].click(annotation);
      }
    },
    onDrawingEnd(widget) {
      widget.labelAppended = false;
      const widgetJson = widget.toJSON();
      this.removeWidgets([widget.id]);
      this.$emit('drawing-end', widgetJson.rect, {
        pageInfo: {
          id: widgetJson.id,
          page: widgetJson.pageNumber - 1,
        },
      });
    },
    selectTableWidgetCell({ annotation, cellData, event }) {
      if (event.type !== 'pointerdown') {
        return;
      }
      this.$emit('widget-clicked', { widget: annotation, cells: cellData });
    },
    setScaleSelectValue(scale) {
      this.$refs.toolbar && this.$refs.toolbar.setScaleSelectValue(scale);
    },
    getScale() {
      return this.app.pdfViewer.currentScale;
    },
    setScale(scale = 'page-width') {
      this.app.toolbarControl.setViewerScale(scale);
    },
    getRenderedPages() {
      return this.app.getMountedPages() || [];
    },
    getRenderedPageNumbers() {
      return this.app.getMountedPages().map((item) => item.id - 1) || [];
    },
    jumpToPage(page) {
      const pageSpot = {
        left: 0,
      };
      const pageView = this.app.pdfViewer.getPageView(page - 1);
      if (!pageView) {
        return;
      }
      const pageViewDivHeight = pageView.div.clientHeight;
      const viewerHeight = pageView.div.closest('.viewer-wrapper').clientHeight;
      if (pageViewDivHeight < viewerHeight) {
        pageSpot.top = (pageViewDivHeight - viewerHeight) / 2;
      }
      this.app.toolbarControl.goPageByNumber(page);

      return new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    },
    scrollToAnnotation({
      pageNumber,
      id,
      focus = true,
      options = {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      },
    }) {
      this.app.scrollToAnnotation(pageNumber, id, focus, options);
    },
    handlePageNavClicked(type) {
      if (type === 'prev') {
        if (this.currentPageNumber === 1) {
          return;
        }
        this.currentPageNumber--;
      } else {
        if (this.currentPageNumber === this.pageTotal) {
          return;
        }
        this.currentPageNumber++;
      }
      this.changeCurrentPageNumber();
    },
    changeCurrentPageNumber() {
      if (
        this.currentPageNumber < 1 ||
        this.currentPageNumber > this.pageTotal
      ) {
        return;
      }

      this.jumpToPage(this.currentPageNumber);
    },
    syncCurrentPageNumber({ pageNumber }) {
      this.currentPageNumber = pageNumber;
      this.$emit('page-change', pageNumber);
    },
    toggleThumbnail() {
      this.$emit('toggle-thumbnail');
    },
    toggleChapter() {
      this.$emit('toggle-chapter');
    },
    chapterNodeCliked(data) {
      this.$emit('chapter-node-cliked', data);
    },
    thumbnailPageClicked(data) {
      this.$emit('thumbnail-page-cliked', data);
    },
    getScrollTop() {
      return this.app.pdfViewer.container.scrollTop;
    },
    scrollThumbnailIntoView(page) {
      this.$refs.thumbnail.scrollIntoView(page);
    },
    scrollChapterIntoView() {
      if (this.$refs.chapterTree) {
        this.$refs.chapterTree.scrollIntoView();
      }
    },
    changeScale(scale) {
      this.$emit('scale-change', scale);
    },
    async search(searchConditions) {
      this.clearWidgetsBySubType(searchWidgetSubType);

      if (searchConditions.keyword) {
        if (searchConditions.keyword === this.searchResult.lastKeyword) {
          this.searchResult.currentIndex++;
          if (this.searchResult.currentIndex >= this.searchResult.data.length) {
            this.searchResult.currentIndex = 0;
          }
          this.jumpToSearchResult(this.searchResult.currentIndex);
          return;
        }
        const { data } = await searchKeyword(
          this.fileId,
          searchConditions.keyword,
        );

        this.searchResult = {
          visible: true,
          currentIndex: data.results.length ? 0 : -1,
          total: data.results.length,
          data: data.results.map((item) => ({ ...item.items[0], id: uuid() })),
          lastKeyword: searchConditions.keyword,
        };

        this.jumpToSearchResultNearBy(this.currentPageNumber - 1);
      } else {
        this.searchResult = {
          visible: false,
          currentIndex: -1,
          total: 0,
          data: [],
        };
      }
    },
    addSearchWidget(data) {
      const { id, page, outlines } = data;
      const widgetData = {
        id,
        annotationType: this.annotationType.search,
        customType: searchWidgetSubType,
        rect: outlines[0],
        pageNumber: page + 1,
        rotation: -this.fileInfo.pageInfo[page].rotate,
      };

      this.predictionTools.addBlock(widgetData);
    },
    jumpToSearchResult(index) {
      const searchResultItem = this.searchResult.data[index];
      if (!searchResultItem) {
        return;
      }

      this.searchResult.currentIndex = index;

      const { id, page } = searchResultItem;
      const pages = this.getRenderedPageNumbers();

      this.clearWidgetsBySubType(searchWidgetSubType);

      this.scrollToAnnotation({
        pageNumber: page + 1,
        id,
      });

      if (pages.includes(page)) {
        const existed = this.getWidgetById(id);
        if (!existed) {
          this.addSearchWidget(searchResultItem);
        }
      }
    },
    jumpToSearchResultNearBy(page) {
      let minDiff = -1;
      let minIndex = 0;

      this.searchResult.data.forEach((item, index) => {
        const diff = Math.abs(item.page - page);
        if (minDiff < 0 || diff < minDiff) {
          minDiff = diff;
          minIndex = index;
        }
      });

      this.jumpToSearchResult(minIndex);
    },
    clearWidgetsBySubType(subType) {
      const pages = this.getRenderedPageNumbers();
      pages.forEach(() => {
        this.removeAnnotationByType(subType);
      });
    },
    getPdfPages() {
      return this.app.pages;
    },
    getWidgetById(id) {
      return this.app.getAnnotationById(id);
    },
    getAllAnnotations() {
      return this.app.filterAnnotation();
    },
    getAnnotationByPage(page) {
      return this.app.getAnnotationByPage(page + 1);
    },
    removeAnnotationByType(type) {
      return this.app.removeAnnotationByType(type);
    },
    removeAllAnnotations() {
      return this.app.removeAllAnnotation();
    },
    clearDrawingEditors() {
      this.app.editorUIManager.clearDrawingEditors();
    },
    handlePdfjsSearch() {
      if (this.usePdfjsToolbar) {
        const pdfViewerEl = this.$refs.viewer.querySelector('.pdfViewer');

        const highlightElsInAnnotationLayers = pdfViewerEl.querySelectorAll(
          '.annotationLayer .text-layer-search',
        );
        highlightElsInAnnotationLayers.forEach((el) => (el.innerHTML = ''));

        const highlightEls = pdfViewerEl.querySelectorAll(
          '.textLayer .highlight',
        );

        highlightEls.forEach((el) => {
          const textLayerEl = el.closest('.textLayer');
          const annotLayerEl = textLayerEl.nextElementSibling;

          const elCloned = el.parentElement.cloneNode(true);

          let highlightContainer =
            annotLayerEl.querySelector('.text-layer-search');
          if (!highlightContainer) {
            highlightContainer = document.createElement('div');
            highlightContainer.classList.add('text-layer-search');
            annotLayerEl.appendChild(highlightContainer);
          }

          highlightContainer.appendChild(elCloned);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../styles/pdf-viewer.common.scss';

.document-viewer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ddd;
}

.viewer-wrapper {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;

  &.use-pdfjs-toolbar {
    height: 100%;

    ::v-deep .pdf-viewer-thumbnail {
      height: calc(100% - 32px);
      position: absolute;
      top: 32px;
    }

    ::v-deep .chapter-tree-container {
      height: calc(100% - 32px);
      position: absolute;
      top: 32px;
    }
  }

  &.has-left-nav {
    ::v-deep div[data-id='viewerContainer'] {
      left: 260px;
      width: calc(100% - 260px);
    }
  }
}

.viewer {
  width: 100%;
  height: 100%;

  ::v-deep button[data-id='sidebarToggle'] {
    display: none;
  }

  ::v-deep div[data-id='loadingBar'] {
    z-index: 1;
  }

  ::v-deep div[data-id='toolbarContainer'] {
    .toolbar-button {
      width: 32px;
      height: 32px;
      margin: 0;
      padding: 0;
      line-height: 32px;
      text-align: center;
      color: #555;
      border: none;
      &:hover {
        background: #dddedf;
      }
      &.active {
        background-color: #0000004d;
      }
    }
  }

  ::v-deep div[data-id='sidebarContainer'] {
    .verticalToolbarSeparator {
      box-sizing: border-box;
    }
  }

  ::v-deep div[data-id='mainContainer'] {
    .findbar {
      left: 97px;
      top: 35px;
      .toolbarField {
        height: 16px;
        font-size: 12px;
      }
    }
    .toolbar {
      div[data-id='toolbarViewerRight'] {
        display: none;
      }
    }
    .toolbarButton::before {
      width: 14px;
      height: 14px;
    }

    .dropdownToolbarButton {
      width: 135px;
      select {
        font-size: 12px;
      }
    }
  }

  ::v-deep .page {
    border-image: none;

    .canvasWrapper {
      filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12));
    }
  }

  ::v-deep .annotationEditorLayer {
    pointer-events: unset;
    .annotationEditor {
      &.selectedEditor:not(.editing):not(.linkEditor) .editor-content,
      .editor-content {
        stroke: #1508f6;
        fill: transparent;
        stroke-dasharray: 5;
        stroke-width: 2px;
        stroke-dashoffset: unset !important;
      }

      .annotation-tag {
        position: absolute;
        top: 0;
        left: calc(100% + 2px);
        width: max-content;
        padding: 0 2px;
        z-index: 10;
        transform-origin: 0 0;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 10px;
      }

      &.focus {
        .editor-content {
          stroke: #333;
        }

        .resize-point {
          display: none;
        }
      }

      &.editing {
        .editor-content {
          stroke: #1508f6;
          stroke-width: 2px;
        }
      }

      &.rect-copy {
        .editor-content {
          fill: #1a00ff33;
          stroke: none;
        }
      }

      &.search-result {
        .editor-content {
          stroke: #ffba00 !important;
          fill: rgba(250, 207, 85, 0.3);
          stroke-width: 1 !important;
          stroke-dasharray: unset !important;
        }
      }

      &.diff-widget {
        .editor-content {
          fill: rgba(0, 191, 255, 0.4) !important;
        }
      }

      .resizers {
        display: none;
      }

      .control-bar-wrapper {
        li {
          display: none;
          &[data-type='copy-text'] {
            display: inline-flex;
            font-size: 20px;
            color: #333;
          }
        }
      }
    }

    .text-layer-search {
      color: transparent;

      & > span {
        position: absolute;
        white-space: pre;
        transform-origin: 0% 0%;
      }

      .highlight {
        background-color: #006400;
        opacity: 0.4;
        &.selected {
          background-color: #fe9633;
        }
      }
    }
  }

  ::v-deep .operation-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    opacity: unset;
    border-radius: 4px;
    position: relative;

    &:hover {
      background-color: #eee;
    }
  }
}
</style>
