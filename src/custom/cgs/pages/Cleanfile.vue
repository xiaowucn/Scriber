<template>
  <div class="cleanfile-details" v-loading="loading">
    <div class="pdf-viewer-wrapper">
      <file-pdf-viewer-container
        v-if="viewerReady"
        ref="pdfViewerContainer"
        :readOnly="true"
        :file-id="fileId"
        :file-info="fileInfo">
      </file-pdf-viewer-container>
    </div>
    <div v-if="!loading" class="aside">
      <div v-for="(item, index) in pageData" :key="index" class="item">
        <h5>{{ item.name }}</h5>
        <ul v-if="item.pages.length > 0" class="pages">
          <li
            v-for="(page, index) in item.pages"
            :key="index"
            :class="[acctivePage === page ? 'active' : '']"
            @click="jumpToPage(page)">
            {{ page }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { getFileInfo } from '@/store/api/detail.api';
import { fetchCleanFileInfo } from '@/store/api/cgs.api';

export default {
  name: 'cleanfile-details',
  components: {
    FilePdfViewerContainer,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      fileInfo: null,
      viewerReady: false,
      pageData: [
        {
          name: '存在修订',
          key: 'revisions',
          pages: [],
        },
        {
          name: '存在空白页',
          key: 'blank_pages',
          pages: [],
        },
        {
          name: '存在批注',
          key: 'comment_pages',
          pages: [],
        },
      ],
      acctivePage: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getFileInfo(this.fileId);
      this.getCleanFileInfo(this.fileId);
    },
    async getFileInfo(fileId) {
      this.loading = true;
      const [pageInfo, outline, filePath] = await Promise.all([
        this.getFilePageInfo(fileId),
        this.getFileOutline(fileId),
        this.getFilePath(fileId),
      ]);
      this.fileInfo = {
        fileId,
        pageInfo,
        outline,
        ...filePath,
      };
      this.viewerReady = true;
      this.loading = false;
    },
    async getFilePageInfo(fileId) {
      try {
        const res = await fetchFilePageInfo(fileId);
        const pageInfo = res.data;
        return pageInfo;
      } catch (error) {
        return [
          {
            page: 0,
            width: 595,
          },
        ];
      }
    },
    async getFileOutline(fileId) {
      try {
        const res = await fetchFileOutline(fileId);
        const outline = {
          items: res.data?.children || [],
        };
        return outline;
      } catch (error) {
        return { items: [] };
      }
    },
    async getFilePath(fileId) {
      try {
        const res = await getFileInfo(fileId);
        const fileName = res.data.name;
        const filePath = [{ name: '总览', href: '#/project' }].concat(
          res.data.crumbs.map((path) => ({
            name: path.name,
            href: `#/project/${res.data.pid}/tree/${path.id}`,
          })),
        );
        return { fileName, filePath };
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async getCleanFileInfo(fileId) {
      try {
        const res = await fetchCleanFileInfo(fileId);
        this.pageData.forEach((item) => {
          const pages = res.data[item.key];
          if (_.isEmpty(pages)) {
            item.name = `不${item.name}`;
            return;
          }
          if (item.key !== 'revisions') {
            item.pages = pages;
          }
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    jumpToPage(page) {
      this.acctivePage = page;
      this.$refs.pdfViewerContainer.jumpToPageNumber(page);
    },
  },
};
</script>

<style lang="scss" scoped>
.cleanfile-details {
  display: flex;
  height: 100vh;
  .pdf-viewer-wrapper {
    width: 65%;
  }
  .aside {
    width: 35%;
    padding: 0 15px;
    .item {
      margin: 10px 0;
      padding: 10px 0 20px;
      border-bottom: 1px solid #e5e5e5;
      h5 {
        color: #13419d;
      }
      .pages {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        list-style: none;
        li {
          width: 50px;
          margin: 0 10px 10px 0;
          padding: 5px 10px;
          font-size: 14px;
          text-align: center;
          background-color: #e5e5e5;
          &:hover {
            cursor: pointer;
            background-color: #bcbcbc;
          }
          &.active {
            background-color: #13419d;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
