<template>
  <div
    class="image-viewer-wrapper"
    :class="showThumbnaill ? 'has-left-nav' : ''">
    <scale-select
      ref="scaleSelect"
      :default-scale="defaultPageScale"
      :get-scale="getScale"
      @scale-change="handleScaleChange"></scale-select>
    <common-image-viewer
      ref="viewer"
      :pages="fileInfo.pageInfo"
      :outline="fileInfo.outline"
      :settings="settings"
      :plugins="['outline', 'header']"
      :header-sections="getHeaderSections()"
      @toggle-menu="handleContentsMenuClick"
      @viewer-document-ready="readyHandler"
      @viewer-page-changed="handlePageChanged"
      @page-mounted="handlePageMounted">
    </common-image-viewer>
    <thumbnail
      v-if="showThumbnaill"
      ref="thumbnail"
      :thumbnail-list="thumbnailList"
      :thumbnail-page-actived="thumbnailPageActived"
      @thumbnail-page-clicked="thumbnailPageClicked"></thumbnail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { baseURL } from '@/store/api/http';
import CommonImageViewer from '@paoding-label/vue-image-viewer';
import ScaleSelect from './add-ons/ScaleSelect';
import Thumbnail from './add-ons/Thumbnail';

export default {
  name: 'image-viewer',

  components: { CommonImageViewer, ScaleSelect, Thumbnail },

  props: {
    fileId: {
      type: Number,
      required: true,
    },
    fileInfo: {
      type: Object,
      required: true,
    },
    defaultPageScale: {
      type: Number,
      required: false,
      default: 1.3,
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
  },

  data() {
    return {
      imageViewer: null,
      settings: {
        markable: {
          autoActive: true,
          selection: true,
        },
        pageSpacing: 10,
        defaultPageScale: this.defaultPageScale,
        // pdfURL: `api/v1/plugins/fileapi/file/${this.fileId}/pdf`, // 传入pdfURL会启用pdfium.wasm浏览器端渲染，不再向后端请求图片接口
        imageURLParser: (pageIndex, scale, pageInfo) => {
          if (this.configuration.page_image_format === 'svg') {
            return [
              `${baseURL}/plugins/fileapi/file/${this.fileId}/page/${pageIndex}`,
            ];
          }
          const scaledWidth = Math.floor(
            Number(pageInfo.width) * window.devicePixelRatio * scale,
          );
          const url = `${baseURL}/plugins/fileapi/files/${this.fileId}/pages/${pageIndex}/image/${scaledWidth}.jpg`;
          return [url];
        },
        searchURLParser: (keyword) => {
          return `${baseURL}/plugins/fileapi/file/${this.fileId}/search?keyword=${keyword}`;
        },
        fetchFunction: (url, params) => {
          return new Promise((resolve, reject) => {
            fetch(url, params)
              .then((res) => res.json())
              .then((res) => {
                if (res.status === 'error') {
                  this.$notify({
                    title: this.$t(`message['提示']`),
                    message: res.message,
                    type: 'error',
                  });
                  this.imageViewer.searchManage.searchBox.setEnable(true);
                }
                resolve(res);
              })
              .catch((error) => {
                reject(error);
              });
          });
        },
      },
    };
  },
  computed: {
    ...mapGetters(['configuration']),
  },
  methods: {
    readyHandler() {
      const viewerElement = this.$refs.viewer;
      if (viewerElement !== undefined) {
        this.imageViewer = viewerElement.imageViewer;
        this.imageViewer.setMountedPagesMarkable(true);
        this.imageViewer.widgetHelper.selectionEndCallback = this.drawWidget;

        this.imageViewer.eventBus.on(
          'widget-table-cell-active',
          this.selectTableWidgetCell,
        );

        this.addGoBackButton();
        this.addThumbnailButton();
      }

      this.$emit('viewer-ready');
    },
    getScale() {
      return this.$refs.viewer.getScale();
    },
    handleScaleChange(...args) {
      this.$emit('scale-change', ...args);
    },
    drawWidget(...args) {
      this.$emit('drawing-end', ...args);
    },
    onWidgetClicked(widget) {
      this.$emit('widget-clicked', { widget });
    },
    selectTableWidgetCell(...args) {
      const [cells, widget] = args;
      this.$emit('widget-clicked', { widget, cells });
    },
    handlePageChanged(page) {
      this.$emit('page-change', page);
    },
    handlePageMounted(page) {
      this.$emit('page-mounted', page);
    },
    setLoading(page, loading) {
      this.imageViewer.getPages()[page].setLoading(loading);
    },
    getHeaderSections() {
      const sections = [[4, { target: 'left' }]];
      if (!this.$user.isCcxiNormalUser()) {
        sections.push(this.fileDetailSection());
      }

      return sections;
    },
    fileDetailSection() {
      const fileInfo = this.fileInfo;

      const pathBreadCrumb = fileInfo.filePath
        .map(
          (path, index) =>
            `<a href="${path.href}">${path.name}</a>${
              index < fileInfo.filePath.length - 1 ? ' / ' : ''
            }`,
        )
        .join('');

      return [
        5,
        {
          textContent() {
            const textWrapper = document.createElement('div');
            textWrapper.innerHTML = `
              <p style="color:black;margin: 0">
                <span>文件名</span>：<span style="color: #4475de;">${fileInfo.fileName}</span>
              </p>
               <p style="color:black;margin: 0">
                <span>文件ID</span>：<span style="color: #4475de;">${fileInfo.fileId}</span>
              </p>
              <div>
              <span>位置</span>：${pathBreadCrumb}
              </div>
            `;
            return textWrapper;
          },
        },
      ];
    },
    addGoBackButton() {
      const menuItem = document.createElement('LI');
      menuItem.setAttribute(
        'class',
        'head-menu-item head-menu-item-clickable fas fa-arrow-left menu-button go-back',
      );
      menuItem.onclick = () => history.back();

      const menuContainer = document.querySelector('.header-left');
      if (menuContainer) {
        const existedMenu = menuContainer.querySelector('.go-back');
        if (!existedMenu) {
          menuContainer.insertBefore(menuItem, menuContainer.firstChild);
        }
      }
    },
    addThumbnailButton() {
      const menuItem = document.createElement('LI');
      menuItem.setAttribute(
        'class',
        'head-menu-item head-menu-item-clickable fas fa-images menu-button thumbnail',
      );
      menuItem.onclick = () => this.$emit('toggle-thumbnail');

      const menuContainer = document.querySelector('.header-left');
      if (menuContainer) {
        const existedMenu = menuContainer.querySelector('.thumbnail');
        if (!existedMenu) {
          menuContainer.insertBefore(menuItem, menuContainer.children[1]);
        }
      }
    },
    thumbnailPageClicked(data) {
      this.$emit('thumbnail-page-cliked', data);
    },
    scrollThumbnailIntoView(page) {
      this.$refs.thumbnail.scrollIntoView(page);
    },
    getRenderedPageNumbers() {
      return this.imageViewer
        ? this.imageViewer.getMountedPages().map((item) => item.pageInfo.page)
        : [];
    },
    async jumpToPage(page, offset) {
      await this.imageViewer.jumpToPageNumber(page, offset);
    },
    setScaleSelectValue(scale) {
      return this.$refs.scaleSelect.setScale(scale);
    },
    getBestScaleWithSideBar() {
      const sideBarWidth = 260;
      const maxWidth = this.getViewerMaxPageWidth();
      const viewportWidth =
        this.$refs.viewer.imageViewer.pageContainerWidth - sideBarWidth;
      return viewportWidth / maxWidth - 0.05;
    },
    setScale(scale) {
      if (scale === undefined) {
        if (this.showThumbnaill) {
          scale = this.getBestScaleWithSideBar();
        } else {
          scale = this.imageViewer.getBestScale();
        }
      }
      return this.imageViewer.setScale(scale);
    },
    getViewerMaxPageWidth() {
      const widthList = this.fileInfo.pageInfo.map((item) => item.width);
      const maxWidth = this.getMostMaxWidth(widthList);
      return maxWidth;
    },
    getMostMaxWidth(widthList, threshold = 0.4) {
      const pagesSortedByWidth = widthList.sort((a, b) => a - b);
      const pageWidthCount = pagesSortedByWidth.reduce((all, width) => {
        if (typeof all[width] !== 'number') {
          all[width] = 0;
        }
        all[width] += 1;
        return all;
      }, {});

      const widthKeys = Object.keys(pageWidthCount).sort(
        (a, b) => Number(b) - Number(a),
      );
      const scaleCount = widthKeys.reduce((all, key) => {
        all[key] = pageWidthCount[key] / widthList.length;
        return all;
      }, {});

      for (const widthType of widthKeys) {
        if (scaleCount[widthType] > threshold) {
          return Number(widthType);
        }
      }

      return Number(widthKeys[0]);
    },
    handleContentsMenuClick(isOpen) {
      if (isOpen) {
        const scale = this.getBestScaleWithSideBar();
        this.setScale(scale);
      } else {
        this.setScale(this.imageViewer.getBestScale());
      }
    },
    getWidgetById(id) {
      return this.imageViewer.widgetHelper.getWidgetByUUID(id);
    },
    getWidgetLayer(page) {
      return this.imageViewer.getPages()[page].getWidgetLayer();
    },
    addWidgets(data, callBack) {
      const {
        type,
        subType,
        outline,
        colGroup,
        rowGroup,
        items,
        uuid,
        label,
        page,
      } = data;
      const widgetLayer = this.getWidgetLayer(page);
      if (widgetLayer && widgetLayer.widgetCanvas) {
        const widget = widgetLayer.load({
          type,
          page,
          data: { outline, colGroup, rowGroup, items },
        });
        widget.addClass(subType);
        widget.setUUID(uuid);
        callBack && callBack(widget.widget, label);

        return uuid;
      }
    },
    removeWidgets(uuidToRemove) {
      [].concat(uuidToRemove).forEach((uuid) => {
        const widget = this.imageViewer.widgetHelper.getWidgetByUUID(uuid);

        if (widget) {
          widget.destroy();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.image-viewer-wrapper {
  height: 100%;

  &.has-left-nav {
    ::v-deep .image-viewer {
      margin-left: 260px;
      width: calc(100% - 260px);
    }
  }

  .scale-operation {
    position: absolute;
    right: 20px;
    z-index: 301;
  }

  ::v-deep .header-pagebar {
    .page-input {
      width: auto;
    }

    .page-next {
      margin-left: 10px;
    }

    i {
      line-height: 40px;
      font-size: 20px;
      color: #3e3f43;
    }
  }

  ::v-deep .image-viewer-container {
    .image-viewer {
      height: calc(100vh - 40px) !important;
    }
  }

  ::v-deep .pdf-viewer-thumbnail {
    position: absolute;
    top: 40px;
    left: 0;
  }
  ::v-deep .image-viewer-sidebar {
    transition: unset;
  }
}
</style>
