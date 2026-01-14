import _ from 'lodash';
import { mapGetters } from 'vuex';
import { fileSize, formatSecondToHms } from '@/utils';
import { getPdfAsideWidthFromStorage } from '../common/utils';
import { USER_PLATFORM } from '../../../store/constants';
import {
  saveDataInStorage,
  getRightPanelHeightFromStorage,
} from '../common/utils';
import { fetchOutlines } from '@/store/api/detail.api.js';
import { formatTablesToBoxes } from '@/utils/remarkAnswerTools';
import { fetchFilePageInfo } from '@/store/api/file.api';

export default {
  name: 'report-review-mixin',
  data() {
    return {
      dataReady: false,
      documentReady: false,
      documentData: null,
      documentPageInfo: [],
      isExternalDocument: false,
      reviewHistoryLog: [],
      documentSize: '',
      downloadSpeed: '',
      downloadRemainingTime: '',
      downloadProgress: 0,
      showDownloadLoading: false,
      LEFT_MIN_WIDTH: 0,
      RIGHT_MIN_WIDTH: 0,
      ruleListHeight: '',
      ruleDescriptionHeight: '',
      ruleHistory: {
        review: {},
        history: [],
      },
      handler: () => {},
      pageElements: {},
      currentAnnotationPageNumber: 0,
      currentAnnotationMode: '',
      answerDataToRender: null,
    };
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters('hkexModule', ['isDelisted', 'auditType']),
    annotationDisabled() {
      return this.isDelisted;
    },
    submitAnswerButtonDisabled() {
      return (
        this.configuration.non_sso_read_only &&
        this.loginUser.platform === USER_PLATFORM.BUILD_IN &&
        this.loginUser.name.startsWith('pai_')
      );
    },
  },
  created() {
    this.setWidthAndHeight();
  },
  mounted() {
    this.handler = _.throttle(this.resize, 500);
    window.addEventListener('resize', this.handler);
  },
  directives: {
    dragHorizontal(el, bindings, vnode) {
      const _this = vnode.context;
      const parentNode = _this.$parent.$el;
      _this.LEFT_MIN_WIDTH = bindings.value ? bindings.value.leftMinWidth : 0;
      _this.RIGHT_MIN_WIDTH = bindings.value ? bindings.value.rightMinWidth : 0;
      const isDragPdfViewer = bindings.value
        ? bindings.value.isDragPdfViewer
        : false;
      let lastLeftWidth;
      let pdfViewerScale;

      el.onmousedown = () => {
        document.body.style.userSelect = 'none';
        el.classList.add('is-draging');

        const pdfViewer = _this.$refs.pdfViewer;
        if (isDragPdfViewer) {
          pdfViewerScale =
            pdfViewer.documentViewerApp.pdfViewer._currentScaleValue;
        }

        document.onmousemove = _.throttle((e) => {
          const windowWidth = document.documentElement.clientWidth;
          const leftMenuWidth =
            document.querySelector('.hkex-menu').clientWidth;
          if (
            e.x < _this.LEFT_MIN_WIDTH + leftMenuWidth ||
            e.x > windowWidth - _this.RIGHT_MIN_WIDTH
          ) {
            return;
          }
          const leftWidth = e.pageX - leftMenuWidth + 'px';
          parentNode.querySelector('.header-left').style.width = leftWidth;
          parentNode.querySelector('.el-aside').style.width = leftWidth;

          lastLeftWidth = leftWidth;

          if (isDragPdfViewer) {
            pdfViewer.setScale(pdfViewerScale);
          }
        }, 1000 / 60);
        document.onmouseup = () => {
          if (el.classList.contains('is-draging')) {
            document.body.style.userSelect = 'unset';
            document.onmousemove = null;
            el.classList.remove('is-draging');
            saveDataInStorage({ pdfAsideWidth: lastLeftWidth });
          }
        };
      };
    },
    dragVertical(el, bindings, vnode) {
      const HEADER_HEIGHT = bindings.value ? bindings.value.headerHeight : 0;
      const dragingLine = bindings.value ? bindings.value.dragingLine : null;
      el.onmousedown = () => {
        document.body.style.userSelect = 'none';
        el.classList.add('is-draging');
        const ruleListEl = vnode.context.$el.querySelector(
          '.rule-list-container',
        );
        const ruleDescriptionEl = vnode.context.$el.querySelector(
          '.rule-description-container',
        );
        document.onmousemove = _.throttle((e) => {
          if (e.pageY <= HEADER_HEIGHT) {
            return;
          }
          if (dragingLine === 'line1') {
            ruleListEl.style.height = e.pageY - HEADER_HEIGHT + 'px';
          } else {
            const ruleListHeight = ruleListEl.clientHeight;
            ruleDescriptionEl.style.height =
              e.pageY - HEADER_HEIGHT - ruleListHeight + 'px';
          }
        }, 1000 / 60);
        document.onmouseup = () => {
          if (el.classList.contains('is-draging')) {
            document.body.style.userSelect = 'unset';
            document.onmousemove = null;
            el.classList.remove('is-draging');
            saveDataInStorage({
              ruleListHeight: ruleListEl.style.height,
              ruleDescriptionHeight: ruleDescriptionEl.style.height,
            });
          }
        };
      };
    },
  },
  methods: {
    setWidthAndHeight() {
      this.setPdfAsideWidth();
      this.setPanelHeight();
    },
    setPdfAsideWidth() {
      this.pdfAsideWidth = getPdfAsideWidthFromStorage();
    },
    setPanelHeight() {
      const { ruleListHeight, ruleDescriptionHeight } =
        getRightPanelHeightFromStorage();
      this.ruleListHeight = ruleListHeight;
      this.ruleDescriptionHeight = ruleDescriptionHeight;
    },
    switchCollapsed() {
      this.collapsed = !this.collapsed;
      this.pdfAsideWidth = this.collapsed
        ? '100%'
        : getPdfAsideWidthFromStorage();
    },
    async fetchFile(fileId) {
      try {
        this.showDownloadLoading = true;

        if (!this.isExternalDocument) {
          const { data } = await fetchFilePageInfo(fileId);
          if (data) {
            this.documentPageInfo = data;
          }
        }

        const startTime = new Date().getTime();
        const res = await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchPDFDocument',
          {
            url: `/plugins/fileapi/file/${fileId}/pdf`,
            onDownloadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const currentTime = new Date().getTime();
              const loadedSize = loaded / 1024;
              const unloadedSize = (total - loaded) / 1024;
              const spendTime = (currentTime - startTime) / 1000;
              const speed = loadedSize / spendTime;
              const speedText =
                speed > 1024
                  ? `${(speed / 1024).toFixed(2)}MB/s`
                  : `${Math.floor(speed)}KB/s`;
              this.documentSize = fileSize(total);
              this.downloadSpeed = speedText;
              this.downloadRemainingTime = formatSecondToHms(
                unloadedSize / speed,
              );
              this.downloadProgress = Math.floor((loaded / total) * 100);
            },
          },
        );
        this.documentData = new Uint8Array(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        this.showDownloadLoading = false;
        this.documentSize = '';
        this.downloadSpeed = '';
        this.downloadRemainingTime = '';
        this.downloadProgress = 0;
      }
    },
    async switchFile(fileId) {
      this.documentReady = false;
      this.documentData = null;
      await this.$nextTick();

      await this.fetchFile(fileId);
    },
    async getReportReviewHistoryLog(rule) {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/fetchReportReviewHistoryLog',
          {
            fid: this.$route.query.fileId,
            rule,
          },
        );
        this.reviewHistoryLog = res.data;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    resize() {
      const windowWidth = window.innerWidth;
      const leftMenuWidth = document.querySelector('.hkex-menu')?.clientWidth;

      const leftEl = document.querySelector('.el-aside');
      const rightEl = document.querySelector('.el-main');
      const headerLeftEl = document.querySelector('.header-left');

      if (leftEl.clientWidth < this.LEFT_MIN_WIDTH) {
        const leftWidth = this.LEFT_MIN_WIDTH + 'px';
        leftEl.style.width = leftWidth;
        headerLeftEl.style.width = leftWidth;
      }
      if (rightEl.clientWidth < this.RIGHT_MIN_WIDTH) {
        const leftWidth =
          windowWidth - leftMenuWidth - this.RIGHT_MIN_WIDTH + 'px';
        leftEl.style.width = leftWidth;
        headerLeftEl.style.width = leftWidth;
      }
    },
    getRuleAlias(rule) {
      if (!rule) {
        return '';
      }
      const isMainboard = this.fileMeta.stock_code_type === 'MB';
      return isMainboard ? rule.main_alias : rule.gem_alias;
    },
    onDataReady() {
      this.dataReady = true;
    },
    async onDocumentReady() {
      this.documentReady = true;
    },
    onPageRendered(pageNumber) {
      if (this.answerDataToRender) {
        const answerPageNumber = this.answerDataToRender.boxes[0].page + 1;

        if (pageNumber === answerPageNumber) {
          this.renderAnnotations([this.answerDataToRender]);
          this.$refs.pdfViewer.scrollToFirstAnnotation();
          this.answerDataToRender = null;
        }
      }

      if (this.currentAnnotationMode === 'table') {
        this.renderPagePredictBlocks(pageNumber);
      }
    },
    onAnnotationRendered() {
      this.renderCrossPageArrow();
    },
    async onAnnotationModeChanged(mode) {
      this.currentAnnotationMode = mode;
      if (mode === 'table') {
        const pageRendered = this.$refs.pdfViewer.getPageRendered();
        pageRendered.forEach((pageNumber) =>
          this.renderPagePredictBlocks(pageNumber),
        );
      } else {
        this.clearAnnotations();
      }
    },
    async onTableAnnotationCellClicked(data) {
      const { coords, table } = data;
      const { row, col } = coords;
      let cell = table.cells[`${row}_${col}`];
      if (!cell) {
        const mergedCell = table.merged.find((mergedList) =>
          mergedList.find((cellItem) => _.isEqual(cellItem, [row, col])),
        );
        if (mergedCell) {
          const [rowOrigin, colOrigin] = mergedCell[0];
          cell = table.cells[`${rowOrigin}_${colOrigin}`];
        }
      }

      if (cell) {
        const cellBox = {
          box: {
            box_left: cell.box[0],
            box_top: cell.box[1],
            box_right: cell.box[2],
            box_bottom: cell.box[3],
          },
          page: table.page,
          text: cell.text,
        };

        await this.createAnswer([cellBox]);
      }
    },
    renderAnnotations(data) {
      this.$refs.pdfViewer.addAnnotations(data);
    },
    clearAnnotations(type) {
      if (this.$refs.pdfViewer) {
        this.$refs.pdfViewer.clearAnnotations(type);
      }
    },
    jumpToAnswerData(data) {
      if (this.$refs.pdfViewer) {
        const pageNumber = data.boxes[0].page + 1;
        const pageRendered = this.$refs.pdfViewer.checkPageRendered(pageNumber);

        this.$refs.pdfViewer.jumpToPageNumber(pageNumber);

        if (pageRendered) {
          this.renderAnnotations([data]);
          this.$refs.pdfViewer.scrollToFirstAnnotation();
        } else {
          this.answerDataToRender = data;
        }
      }
    },
    clearAnswerBoxTexts(answer) {
      answer.forEach((answerItem) => {
        if (answerItem.items) {
          answerItem.items.forEach((answerItem) => {
            answerItem?.data.forEach((answerData) => {
              answerData?.boxes.forEach((box) => (box.text = ''));
            });
          });
          return;
        }
        answerItem?.data.forEach((answerData) => {
          answerData?.boxes.forEach((box) => (box.text = ''));
        });
      });
      return answer;
    },
    async getAnnotationBoxData(boxData, fileId) {
      const boxParams = [];
      boxData.forEach((item) => {
        const box = {
          box_left: item.box.box_left,
          box_top: item.box.box_top,
          box_right: item.box.box_right,
          box_bottom: item.box.box_bottom,
        };
        const params = {
          box: Object.values(box),
          page: item.page,
        };
        boxParams.push(params);
      });
      const { data } = await this.$store.dispatch('detailModule/fetchBoxText', {
        fileId: fileId || this.fileId,
        data: boxParams,
      });
      const boxes = data.map((item) => {
        const box = item.box.box;
        const boxInfo = {
          box_left: box[0],
          box_top: box[1],
          box_right: box[2],
          box_bottom: box[3],
        };
        return {
          box: boxInfo,
          page: item.box.page,
          text: item.text,
        };
      });

      return boxes;
    },
    async renderPagePredictBlocks(pageNumber) {
      if (!this.pageElements[pageNumber]) {
        const page = pageNumber - 1;
        const { data } = await fetchOutlines(this.fileId, page);
        this.pageElements[pageNumber] = formatTablesToBoxes(data, page);
      }

      this.renderAnnotations(this.pageElements[pageNumber]);
    },
    renderCrossPageArrow() {
      if (!this.currentRuleAnswer) {
        return;
      }

      const groupAnnotationData = _.groupBy(
        this.currentRuleAnswer.boxes,
        'page',
      );
      const crossPages = Object.keys(groupAnnotationData).map(Number);
      crossPages.forEach((page, index) => {
        const nextPage = crossPages[index + 1];

        if (!nextPage) {
          return;
        }

        const currentPageAnotationEls =
          this.$refs.pdfViewer.getPageAnotationElements(page + 1);
        const nextPageAnotationEls =
          this.$refs.pdfViewer.getPageAnotationElements(nextPage + 1);

        if (!currentPageAnotationEls.length || !nextPageAnotationEls.length) {
          return;
        }

        const currentPageLastAnnotationEl =
          currentPageAnotationEls[currentPageAnotationEls.length - 1];
        const nextPageFirstAnnotationEl = nextPageAnotationEls[0];

        const tagElement = this.$refs.pdfViewer.getAnnotationTags(
          currentPageLastAnnotationEl,
        );

        if (!tagElement) {
          return;
        }

        const arrowElementExisted = currentPageLastAnnotationEl.querySelector(
          '.cross-page-arrow-down',
        );
        if (arrowElementExisted) {
          return;
        }

        const tagStyle = getComputedStyle(tagElement);

        const arrowElement = document.createElement('DIV');
        arrowElement.setAttribute('class', 'cross-page-arrow-down');
        arrowElement.setAttribute('title', 'view next page boxes');
        arrowElement.style.top = `${
          tagElement.clientHeight + parseFloat(tagStyle.top)
        }px`;
        arrowElement.style.left = `${parseFloat(tagStyle.left)}px`;
        arrowElement.innerHTML = '↓';
        arrowElement.addEventListener('click', (e) => {
          e.stopPropagation();
          this.$refs.pdfViewer.jumpToPageNumber(nextPage);
          if (nextPageFirstAnnotationEl) {
            nextPageFirstAnnotationEl.scrollIntoView({ block: 'center' });
          }
        });
        if (crossPages.length > 1 && index < crossPages.length - 1) {
          currentPageLastAnnotationEl.appendChild(arrowElement);
        }
      });
    },
    deleteDrawedAnnotation() {
      if (this.$refs.pdfViewer) {
        this.$refs.pdfViewer.deleteDrawedAnnotation();
      }
    },
    getCurrentPageNumber() {
      return this.$refs.pdfViewer.currentPageNumber;
    },
    goback() {
      window.history.go(-1);
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handler);
  },
};
