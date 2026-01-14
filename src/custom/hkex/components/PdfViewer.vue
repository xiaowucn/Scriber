<template>
  <div class="document-viewer-container">
    <div class="viewer" ref="viewer"></div>

    <div v-if="!annotationDisabled" class="annotation-toolbar">
      <el-tooltip
        v-for="(value, key) in annotationTools"
        :key="key"
        effect="dark"
        :content="value.title"
        placement="left">
        <button
          class="mode-btn"
          :class="{ actived: annotationMode === key, [value.class]: true }"
          @click="onAnnotationModeChanged(key)">
          <i class="icon"></i>
        </button>
      </el-tooltip>
    </div>

    <div
      v-if="
        annotationMode === 'multiframe' && documentViewerTempWidgets.length > 0
      "
      class="multiframe-panel">
      <div class="title">Set</div>
      <div
        v-for="box in documentViewerTempWidgets"
        :key="box.id"
        class="box"
        @click="onMultiframeBoxClicked(box)">
        <span class="delete" @click.stop="deleteMultiFrameBox(box.id)">+ </span>
      </div>
      <button
        v-if="documentViewerTempWidgets.length > 0"
        class="combine-button"
        @click="combineMultiFrameBoxes">
        Merge
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { createViewer, AnnotationType, pxToPt } from 'pdf-document-viewer';
import 'pdf-document-viewer/style.css';
import {
  PredictionTools,
  convertPredictionDataToAnnotationData,
  PredictAnnotationTypes,
} from '@paoding/prediction-tools';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import GoBack from './GoBack.vue';
import AnnotationTag from './AnnotationTag.vue';
import { isENLang } from '@/store/constants';

/**
 * AnnotationBoxDataType: Array<{
 *  box: { box_left, box_top, box_right, box_bottom }
 *  page
 *  id
 * }>
 */

/**
 * TableDataType: {
 *   id,
 *   page,
 *   cells,
 *   merged,
 *   grid
 * }
 */

/**
 * AnnotationDataType: Array<{
 *   boxes: AnnotationBoxDataType,
 *   type: 'table' || 'wireframe',
 *   tags,
 *   style: Object,
 *   tagStyle: Object,
 *   tableDatas?: Array<{TableDataType>
 * }>
 */

export default {
  name: 'pdf-viewer',
  props: {
    documentData: {
      type: Uint8Array,
      require: true,
    },
    documentPageInfo: {
      type: Array,
      default: () => [],
    },
    annotationDisabled: {
      type: Boolean,
      default: false,
    },
    disableViewerToolbar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPageNumber: 1,

      documentViewerApp: null,
      documentViewerAppPredictionTools: null,
      documentViewerTempWidgets: [],
      annotationMode: 'wireframe',
      annotationTools: {
        highlight: {
          title: 'Text Selection',
          class: 'text',
        },
        wireframe: {
          title: 'Rectangle Tool',
          class: 'frame',
        },
        multiframe: {
          title: 'Multi-Rectangle Tool',
          class: 'multiframe',
        },
        table: {
          title: 'Display Page Elements',
          class: 'table',
        },
      },
      annotationToAddTags: {},
    };
  },
  mounted() {
    this.loadDocumentViewer();
  },
  beforeDestroy() {
    this.destroyDocumentViewer();
  },
  methods: {
    onDocumentReady() {
      this.$emit('document-ready');
    },
    onPageChanged(pageNumber) {
      this.currentPageNumber = pageNumber;
      this.$emit('page-changed', pageNumber);
    },
    onPageRendered(pageNumber) {
      this.$emit('page-rendered', pageNumber);
    },
    onAnnotationDrawed(annot) {
      // annot: AnnotationBoxDataType
      this.$emit('annotation-drawed', annot);
    },
    onAnnotationRendered(annot) {
      this.$emit('annotation-rendered', annot);
    },
    onAnnotationDeleted(annot) {
      // annotations: AnnotationBoxDataType
      this.$emit('annotation-deleted', annot);
    },
    onAnnotationClicked(annot) {
      // annot: AnnotationBoxDataType
      this.$emit('annotation-clicked', annot);
    },
    onTableAnnotationCellClicked(data) {
      // data: { coords: {row: number, col: number}, table: TableDataType }
      this.$emit('table-annotation-cell-clicked', data);
    },
    onAnnotationModeChanged(mode) {
      // mode: 'highlight', 'wireframe', 'multiframe', 'table'
      this.annotationMode = this.annotationMode === 'table' ? '' : mode;
      this.deleteDrawedAnnotation();
      switch (mode) {
        case 'highlight':
          this.documentViewerApp.changeAnnotationType(
            AnnotationType.SelectText,
          );
          break;
        case 'wireframe':
        case 'multiframe':
          this.documentViewerApp.changeAnnotationType(AnnotationType.Square);
          break;
        default:
          break;
      }

      this.$emit('annotation-mode-changed', this.annotationMode);
    },
    getScale() {
      return this.documentViewerApp.pdfViewer.currentScale;
    },
    setScale(scale = 'auto') {
      this.documentViewerApp.toolbarControl.setViewerScale(scale);
    },
    jumpToPageNumber(pageNumber) {
      this.documentViewerApp.toolbarControl.goPageByNumber(pageNumber);
    },
    addAnnotations(data) {
      // data: Array<AnnotationDataType
      data.forEach((item) => {
        const { boxes, type, customType, tableDatas } = item;
        const mergeBoxes = [_.cloneDeep(boxes[0])];
        for (let index = 1; index < boxes.length; index++) {
          const boxItem = boxes[index];
          const preBoxItem = mergeBoxes[mergeBoxes.length - 1];
          if (
            boxItem.page === preBoxItem.page &&
            Math.abs(boxItem.box.box_left - preBoxItem.box.box_left) <= 1 &&
            Math.abs(boxItem.box.box_top - preBoxItem.box.box_bottom) <= 7 &&
            (index !== boxes.length - 1 ||
              Math.abs(boxItem.box.box_right - preBoxItem.box.box_right) <= 1)
          ) {
            preBoxItem.box.box_left = Math.min(
              preBoxItem.box.box_left,
              boxItem.box.box_left,
            );
            preBoxItem.box.box_right = Math.max(
              preBoxItem.box.box_right,
              boxItem.box.box_right,
            );
            preBoxItem.box.box_bottom = boxItem.box.box_bottom;
          } else {
            mergeBoxes.push(_.cloneDeep(boxItem));
          }
        }
        mergeBoxes.forEach((boxItem) => {
          const { page, box } = boxItem;
          const { box_left, box_top, box_right, box_bottom } = box;

          const id = boxItem.id || uuid();

          this.$set(this.annotationToAddTags, id, {
            ...item,
            mergeBoxes,
            currentBox: boxItem,
          });

          const widgetData = {
            id,
            type: customType || type,
            pageNumber: page + 1,
            outline: [box_left, box_top, box_right, box_bottom],
          };

          if (type === 'table') {
            const { grid, merged } = tableDatas[0];
            Object.assign(widgetData, { grid, merged });
          }

          const annotData = convertPredictionDataToAnnotationData(widgetData, {
            expand: 0,
          });

          this.documentViewerAppPredictionTools.addBlock(annotData);
        });
      });
    },
    deleteDrawedAnnotation() {
      this.documentViewerTempWidgets.forEach(({ id }, index) => {
        const widget = this.documentViewerApp.getAnnotationById(id);
        if (widget) {
          this.documentViewerApp.removeAnnotationById(id);
        }

        this.documentViewerTempWidgets.splice(index, 1);
      });
    },
    clearAnnotations(type) {
      if (type) {
        this.documentViewerApp.removeAnnotationByType(type);
      } else {
        this.documentViewerApp
          .filterAnnotation()
          .filter((annot) => annot.subtype !== 'Link')
          .forEach((annot) => {
            this.documentViewerApp.removeAnnotationByType(annot.customType);
          });
      }
    },
    scrollToFirstAnnotation() {
      const annots = this.documentViewerApp
        .filterAnnotation()
        .filter((annot) => annot.customType === 'wireframe');
      if (annots.length > 0) {
        const annotationTags =
          this.$refs.viewer.querySelector('.annotation-tags');
        annotationTags?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    },
    resetAnnotationMode() {
      this.annotationMode = 'wireframe';
      this.documentViewerApp.changeAnnotationType(AnnotationType.Null);
    },
    goback() {
      this.$emit('go-back');
    },
    async loadDocumentViewer() {
      let pathname = window.location.pathname.replace('index.html', '');
      pathname = pathname + (pathname.endsWith('/') ? '' : '/');

      const defaultUrl = URL.createObjectURL(new Blob([this.documentData]));

      this.documentViewerApp = createViewer(this.$refs.viewer, {
        locale: isENLang ? 'en-US' : 'zh-CN',
        viewOnLoad: 0,
        spreadModeOnLoad: 0,
        textLayerMode: 1,
        annotationMode: 1,
        enableWordSegmentation: false,
        disableViewerToolbar: this.disableViewerToolbar,
        disableDocAnnotation: this.$features.disablePdfViewerDocAnnotation(),
        disableStream: true,
        disableRange: true,
        disableAutoFocus: true,
        disableAnnotationList: true,
        disableCollaborate: true,
        disableDraggingAndDropping: true,
        sidebarViewOnLoad: 0,
        defaultUrl,
        resourcePath: `${pathname}static/pdf-document-viewer/`,
        fontHostServer: `${pathname}pdfonts`,
      });

      await this.documentViewerApp.readyPromise;

      this.documentViewerAppPredictionTools = new PredictionTools(
        this.documentViewerApp,
      );

      this.documentViewerApp.annotationManager.on(
        'pagechanging',
        ({ pageNumber }) => this.onPageChanged(pageNumber),
      );
      this.documentViewerApp.annotationManager.on(
        'pagerendered',
        ({ pageNumber }) => {
          const pageInfo = this.documentPageInfo[pageNumber - 1];
          if (pageInfo) {
            if (pageInfo.rotate) {
              this.documentViewerAppPredictionTools.rotatePage({
                pageNumber,
                rotation: -pageInfo.rotate,
              });
            }
          }

          this.handlePdfjsSearch();

          this.onPageRendered(pageNumber);
        },
      );
      this.documentViewerApp.annotationManager.on(
        'annot-click',
        ({ annotation, event }) => {
          event.stopPropagation();

          const { id, pageNumber, rect, customType, subtype } = annotation.data;

          if ('Link'.includes(subtype)) {
            return;
          }

          if (['wireframe', 'table'].includes(customType)) {
            return;
          }

          const [box_left, box_top, box_right, box_bottom] = rect;

          const boxData = {
            id,
            page: pageNumber - 1,
            box: {
              box_left,
              box_top,
              box_right,
              box_bottom,
            },
          };

          this.onAnnotationClicked([boxData]);
        },
      );
      this.documentViewerApp.annotationManager.on(
        'annot-table-cell-active',
        ({ annotation, cellData, event }) => {
          event.stopPropagation();

          const [row, col] = cellData[0];
          const table = annotation.originalData.tableDatas[0];

          const tableCellData = {
            coords: { row, col },
            table,
          };

          this.onTableAnnotationCellClicked(tableCellData);
        },
      );

      this.documentViewerApp.annotationManager.on('annot-created', (widget) => {
        const widgetData = widget.toJSON();
        const { rect, pageNumber } = widgetData;
        const [box_left, box_top, box_right, box_bottom] = rect;

        const boxData = {
          id: widget.id,
          page: pageNumber - 1,
          box: {
            box_left,
            box_top,
            box_right,
            box_bottom,
          },
        };

        this.documentViewerTempWidgets.push(boxData);

        // 未选择任何标注模式或在预测元素块模式下不可画框
        if (['', 'table'].includes(this.annotationMode)) {
          this.$notify({
            title: 'Warning',
            message: 'Please select an annotation mode first',
            type: 'warning',
          });
          this.deleteDrawedAnnotation();
          return;
        }

        if (this.annotationMode === 'wireframe') {
          this.onAnnotationDrawed([boxData]);
        }
      });

      this.documentViewerApp.annotationManager.on('annot-rendered', (annot) => {
        const annotOriginalData = this.annotationToAddTags[annot.id];
        if (annotOriginalData) {
          const { tags, tagStyle, index, mergeBoxes, currentBox } =
            annotOriginalData;

          annot.originalData = annotOriginalData;

          AnnotationTag.propsData = {
            tags,
            tagStyle,
            index,
            showIndex:
              this.$features.supportShowElementIndexOnReviewPage() &&
              index !== undefined &&
              index !== null,
          };
          const tagEl = new Vue(AnnotationTag);

          annot.container.appendChild(tagEl.$mount().$el);

          const annotEl = annot.container;
          const annotTagsEl = annotEl.querySelector('.annotation-tags');
          const pdfViewerEl = this.$refs.viewer.querySelector('.pdfViewer');
          const pageEl = this.$refs.viewer.querySelector(
            `.pdfViewer .page[data-page-number="${annot.pageNumber}"]`,
          );
          const pdfViewerElWidth = pdfViewerEl.offsetWidth;
          const pageOffsetWidth = pageEl.offsetWidth;
          const annotOffsetWidth = annotEl.offsetWidth;
          const annotOffsetLeft = annotEl.offsetLeft;
          const tagsWidth = parseFloat(getComputedStyle(annotTagsEl).width);
          const tagsHeight = parseFloat(getComputedStyle(annotTagsEl).height);

          const offsetWithPt = pxToPt(tagsWidth) / this.getScale();
          const offsetHeightPt = pxToPt(tagsHeight) / this.getScale();
          const pageOffsetHeightPt =
            pxToPt(pageEl.offsetHeight) / this.getScale();

          let topBox = null;
          let rightBox = null;
          let bottomBox = null;
          let leftBox = null;

          mergeBoxes.forEach((item) => {
            if (item === currentBox || item.page !== currentBox.page) {
              return;
            }
            if (
              (currentBox.box.box_top + offsetHeightPt >= item.box.box_top &&
                currentBox.box.box_top <= item.box.box_bottom &&
                currentBox.box.box_right <= item.box.box_left &&
                currentBox.box.box_right + offsetWithPt >= item.box.box_left) ||
              (currentBox.box.box_top + offsetHeightPt >= item.box.box_top &&
                currentBox.box.box_top <= item.box.box_bottom &&
                currentBox.box.box_right <= item.box.box_right + offsetWithPt &&
                currentBox.box.box_right + offsetWithPt >=
                  item.box.box_left - offsetWithPt) ||
              currentBox.box.box_top + offsetHeightPt > pageOffsetHeightPt
            ) {
              rightBox = item;
            }
            if (
              (currentBox.box.box_bottom <= item.box.box_top &&
                currentBox.box.box_bottom + offsetHeightPt >=
                  item.box.box_top &&
                currentBox.box.box_left <= item.box.box_right + offsetWithPt &&
                currentBox.box.box_left + offsetWithPt >=
                  item.box.box_left - offsetWithPt) ||
              currentBox.box.box_bottom + offsetHeightPt > pageOffsetHeightPt
            ) {
              bottomBox = item;
            }
            if (
              (currentBox.box.box_top >= item.box.box_bottom &&
                currentBox.box.box_top - offsetHeightPt <=
                  item.box.box_bottom &&
                currentBox.box.box_right - offsetWithPt <=
                  item.box.box_right + offsetWithPt &&
                currentBox.box.box_right >= item.box.box_left - offsetWithPt) ||
              currentBox.box.box_top < offsetHeightPt
            ) {
              topBox = item;
            }
            if (
              (currentBox.box.box_bottom - offsetHeightPt <=
                item.box.box_bottom &&
                currentBox.box.box_bottom >= item.box.box_top &&
                currentBox.box.box_left >= item.box.box_right &&
                currentBox.box.box_left - offsetWithPt <= item.box.box_right) ||
              (currentBox.box.box_bottom - offsetHeightPt <=
                item.box.box_bottom &&
                currentBox.box.box_bottom >= item.box.box_top &&
                currentBox.box.box_left >= item.box.box_left - offsetWithPt &&
                currentBox.box.box_left - offsetWithPt <=
                  item.box.box_right + offsetWithPt) ||
              currentBox.box.box_bottom < offsetHeightPt
            ) {
              leftBox = item;
            }
          });
          // 右侧有元素块，或者右侧放不下
          if (
            rightBox ||
            Math.max(pdfViewerElWidth - pageOffsetWidth, 0) / 2 +
              (pageOffsetWidth - annotOffsetWidth - annotOffsetLeft) <
              tagsWidth
          ) {
            if (!topBox) {
              Object.assign(annotTagsEl.style, {
                left: `calc(100% - ${tagsWidth}px)`,
                top: `-${tagsHeight + 2}px`,
              });
            } else if (!leftBox) {
              Object.assign(annotTagsEl.style, {
                top: 'unset',
                left: 'unset',
                right: `calc(100% + 2px)`,
                bottom: 0,
              });
            } else if (!bottomBox) {
              Object.assign(annotTagsEl.style, {
                top: 'unset',
                left: 'unset',
                right: `calc(100% - ${tagsWidth}px)`,
                bottom: `-${tagsHeight + 2}px`,
              });
            } else {
              Object.assign(annotTagsEl.style, {
                display: 'none',
              });
            }
          }

          this.$delete(this.annotationToAddTags, annot.id);
        }

        this.onAnnotationRendered(annot);
      });

      this.documentViewerApp.eventBus.on(
        'updatetextlayermatches',
        this.handlePdfjsSearch,
      );

      this.documentViewerApp.registerAnnotation(AnnotationType.Square, {
        customType: 'wireframe',
        isResizeEnable: false,
        isAlwaysShow: true,
        isAlwaysShowControlBar: false,
      });

      Object.keys(PredictAnnotationTypes).forEach((type) =>
        PredictAnnotationTypes[type].forEach((customType) =>
          this.documentViewerApp.registerAnnotation(
            PredictAnnotationTypes.Table.includes(customType)
              ? AnnotationType.Table
              : AnnotationType.Square,
            {
              customType,
              classNames: ['predict-annotation', customType],
              isResizeEnable: false,
              isAlwaysShow: true,
              isAlwaysShowControlBar: false,
            },
          ),
        ),
      );

      this.documentViewerAppPredictionTools.setDrawSelection();

      const goBackEl = new Vue(GoBack);
      goBackEl.$on('go-back', () => this.goback());

      const toolbarEl = this.$refs.viewer.querySelector(
        '[data-id="toolbarViewerLeft"]',
      );
      if (toolbarEl) {
        toolbarEl.insertBefore(goBackEl.$mount().$el, toolbarEl.firstChild);
      }

      if (this.annotationDisabled) {
        this.documentViewerApp.changeAnnotationType(AnnotationType.Null);
      }

      this.onDocumentReady();
    },
    destroyDocumentViewer() {
      this.documentViewerApp = null;
      this.documentViewerAppPredictionTools = null;
      this.documentViewerTempWidgets = [];
    },
    onMultiframeBoxClicked(box) {
      const annot = this.documentViewerApp.getAnnotationById(box.id);
      if (annot) {
        annot.container.scrollIntoViewIfNeeded();
      }
    },
    deleteMultiFrameBox(id) {
      this.documentViewerApp.removeAnnotationById(id);
      this.documentViewerTempWidgets = this.documentViewerTempWidgets.filter(
        (box) => box.id !== id,
      );
    },
    combineMultiFrameBoxes() {
      this.onAnnotationDrawed(this.documentViewerTempWidgets);
      this.documentViewerTempWidgets = [];
    },
    getPageAnotationElements(pageNumber) {
      return Array.from(
        this.$el.querySelectorAll(
          `.page[data-page-number="${pageNumber}"] .annotationEditorLayer .annotationEditor`,
        ),
      );
    },
    getPageRendered() {
      return this.documentViewerApp.getMountedPages().map((item) => item.id);
    },
    checkPageRendered(pageNumber) {
      const pageRendered = this.getPageRendered();

      return pageRendered.includes(pageNumber);
    },
    getAnnotationTags(annotEl) {
      return annotEl.querySelector('.annotation-tags');
    },
    handlePdfjsSearch() {
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

      const pdfViewerContainerEl = pdfViewerEl.parentElement;
      if (pdfViewerContainerEl.scrollLeft > 0) {
        let scrollLeft = 0;

        const firstSearchEl = pdfViewerEl.querySelector(
          '.annotationLayer .highlight',
        );
        if (firstSearchEl) {
          const pdfViewerContainerElRightEdge =
            pdfViewerContainerEl.getBoundingClientRect().right;
          const firstSearchElRightEdge =
            firstSearchEl.getBoundingClientRect().right;
          scrollLeft = Math.max(
            0,
            pdfViewerContainerEl.scrollLeft +
              firstSearchElRightEdge -
              pdfViewerContainerElRightEdge,
          );
        }

        pdfViewerContainerEl.scrollLeft = scrollLeft;
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../../styles/pdf-viewer.common.scss';

.document-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;

  .viewer {
    width: 100%;
    height: 100%;

    ::v-deep [data-id='viewerContainer'] {
      border-right: 5px solid #ededf0;
      @media (prefers-color-scheme: dark) {
        border-right: 5px solid #232327;
      }
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        padding: 10px;
        background-color: #ededf0;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 5px;
        &:hover {
          background-color: #777;
        }
      }
    }

    ::v-deep .annotationEditorLayer {
      pointer-events: unset;
    }

    ::v-deep .annotationEditor:not(.editing):not(.linkEditor) {
      opacity: 1;

      .table-cell {
        fill: none;
      }

      .resizers {
        display: none;
      }

      &[data-subtype='Square'] {
        &[data-custom-type='wireframe'] {
          .editor-content {
            stroke: rgba(0, 0, 0, 0.7);
            stroke-width: 2;
            stroke-dasharray: 6;
            animation: none;
          }
        }
      }
    }

    ::v-deep [data-subtype='SelectText'] {
      &.control-bar-wrapper li {
        display: none;

        &[data-type='copy-text'] {
          display: inline-flex;
        }
      }
    }

    ::v-deep .annotationEditor.editing {
      .editor-content {
        stroke: #5287e1;
        stroke-width: 3;
        stroke-dasharray: 6;
      }
    }

    ::v-deep .annotation-tags {
      position: absolute;
      left: calc(100% + 2px);
      top: -1px;
    }

    ::v-deep .text-layer-search {
      color: transparent;

      & > span {
        position: absolute;
        white-space: pre;
        transform-origin: 0% 0%;
      }

      .highlight {
        background-color: #006400;
        opacity: 0.2;
      }
    }
  }

  .annotation-toolbar {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    z-index: 100;
    display: flex;
    flex-direction: column;

    .mode-btn {
      position: relative;
      height: 40px;
      width: 40px;
      padding: 4px;
      background-color: rgba(0, 0, 0, 0.2);
      border: none;
      color: white;
      transition: all 0.3s;

      &:hover {
        background-color: #369aa2;
      }

      &.actived {
        background-color: #369aa2;
      }

      .icon {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
      }

      &.text {
        .icon {
          background-image: url('../common/images/annotation-tool-text.png');
        }
      }

      &.frame {
        .icon {
          background-image: url('../common/images/annotation-tool-frame.png');
        }
      }

      &.multiframe {
        .icon {
          background-image: url('../common/images/annotation-tool-multiframe.png');
        }
      }

      &.table {
        .icon {
          background-image: url('../common/images/annotation-tool-table.png');
        }
      }
    }
  }

  .multiframe-panel {
    position: absolute;
    top: 100px;
    right: 80px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.2s;

    .title {
      margin-top: 10px;
    }

    .combine-button {
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      border: none;
      width: 100%;
      padding: 2px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }

    .box {
      width: 30px;
      height: 30px;
      border: 1px dashed blue;
      margin: 10px 0;
      cursor: pointer;
      position: relative;

      &:hover,
      &.active {
        background-color: rgba(0, 0, 0, 0.1);
      }

      &:hover {
        .delete {
          display: block;
        }
      }

      .delete {
        display: none;
        content: '+\FE0F';
        position: absolute;
        right: -7px;
        top: -7px;
        width: 14px;
        height: 14px;
        text-align: center;
        line-height: 0.8;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 100%;
        color: white;
        transform: rotate(45deg);
        font-size: 18px;

        &:hover {
          box-shadow: 0 0 3px rgba(0, 0, 0, 1);
        }
      }

      & + .box {
        margin-top: -5px;
      }
    }
  }

  ::v-deep .toolbar {
    z-index: 100;
    .toolbarField {
      &.pageNumber {
        height: 14px;
        margin: 4px 2px 0;
        font-size: 12px;
      }
    }
  }

  ::v-deep [data-id='toolbarViewerLeft'] .toolbarButtonSpacer,
  ::v-deep [data-id='toolbarViewerRight'] {
    display: none;
  }

  ::v-deep [data-id='toolbarViewerMiddle'] {
    left: unset;
    transform: unset;
    right: 18px;
    select {
      appearance: none;
      width: 100%;
      padding-left: 10px;
      line-height: 27px;
      font-size: 12px;
    }
  }

  ::v-deep .toolbarButton {
    box-sizing: border-box;
  }

  ::v-deep .findbar {
    left: 105px;
    top: 35px;
    .toolbarField {
      font-size: 14px;
    }
  }
}
</style>
