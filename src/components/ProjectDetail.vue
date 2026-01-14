<template>
  <div class="project-detail">
    <file-viewer
      :fileViewer="fileViewer"
      :projectId="pid"
      :treeId="treeId"
      :scroll-top="scrollTop"
      :sort-params="fileSortParams"
      :expanded-files="expandedFiles"
      :selected-files="selectedFiles"
      @set-current="handleSetCurrent"
      @change-sort="handleChangeSort"
      @change-page="handleChangePage"
      @change-size="handleChangeSize"
      @change-expand="handleChangeExpand"
      @change-selection="handleChangeSelection"
      @after-upload="refreshFileList"
      @after-batch-delete-files="refreshFileList"
      @after-batch-predict-files="handleAfterBatchPredictFiles"
      @delete-file="deleteFile"
      @fetch-files="fetchFileList"
      @open-dir="openDir">
      <project-summary slot="summary" :projectId="pid"></project-summary>
    </file-viewer>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';
import ProjectSummary from './ProjectSummary';
import FileViewer from './FileViewer';
import { fetchProjectMeta } from '@/store/api/detail.api';
import { trashOrRestoreFile } from '@/store/api/cgs.api';
import { ROUTE_NAME_MAP } from '@/custom/nafmii/common/constant';
const ROUTE_QUERY_PARAMS_TO_OMIT = ['page', 'size', 'from', 'fileId', 'mid'];

export default {
  name: 'project-detail',
  components: {
    ProjectSummary,
    FileViewer,
  },
  props: {
    projectId: {
      type: [Number, String],
      required: true,
    },
    dirId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      fileListTimer: null,
      pid: -1,
      treeId: -1,
    };
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('projectModule', ['projectSearchParams']),
    ...mapGetters('fileModule', [
      'selectedFiles',
      'expandedFiles',
      'fileSortParams',
      'scrollTop',
      'fileSearchParams',
      'jumpToFileInfo',
    ]),
  },
  created() {
    this.reset();
    this.checkRoute();
    this.init();
    EventBus.$on('search-files', this.searchFiles);
  },
  mounted() {
    const delay = this.$features.supportParsePdf() ? 30e3 : 5e3;
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
    this.fileListTimer = setInterval(() => {
      this.fetchFileList({ needLoading: false, isAuto: true });
    }, delay);
  },
  beforeDestroy() {
    clearInterval(this.fileListTimer);
    EventBus.$off('search-files', this.searchFiles);
  },
  watch: {
    dirId(val) {
      this.$store.commit('detailModule/SET_DIR_ID', val);
    },
    '$route.query'() {
      this.init();
    },
  },
  methods: {
    async init() {
      if (this.$user.isCcxiNormalUser()) {
        await this.getProjectMeta();
        if (this.treeId === -1) {
          return;
        }
      } else {
        this.pid = this.projectId;
        this.treeId = this.dirId;
        this.$store.commit('detailModule/SET_DIR_ID', this.dirId);
      }

      if (this.$platform.isCcxiEnv()) {
        await this.fetchSchemaList();
      }

      this.setPager();
      await this.fetchFileList({ isInit: true });

      if (this.$features.showFileTag()) {
        this.fetchTags();
      }
    },
    setPager() {
      const pager = {
        ...this.fileViewer.pager,
        page: Number(this.$route.query?.page || 1),
        size: Number(this.$route.query?.size || 20),
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);

      if (this.$route.query?.fileId) {
        this.$store.commit('fileModule/SET_JUMP_TO_FILE_INFO', {
          fileId: this.$route.query.fileId,
          from: this.$route.query?.from || '',
        });
      } else {
        this.$store.commit('fileModule/SET_JUMP_TO_FILE_INFO', null);
      }

      const params = _.omit(this.$route.query, ROUTE_QUERY_PARAMS_TO_OMIT);
      this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', params);
    },
    replaceQuery(query, removeSearchParams) {
      if (removeSearchParams) {
        query = _.omit(query, ['from', 'fileId']);
      }
      this.$router.replace({
        query,
      });
    },
    async getProjectMeta() {
      try {
        const res = await fetchProjectMeta(this.projectId, this.dirId);
        this.pid = res.data.pid;
        this.treeId = res.data.tree_id;
        this.$store.commit('detailModule/SET_DIR_ID', res.data.tree_id);
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    openDir(file) {
      if (!file.id) {
        this.$store.commit('detailModule/SET_DIR_ID', file);
        if (file === -1) {
          this.$emit('go-project');
        } else {
          this.$emit('go-detail', file, this.projectId);
        }
      } else {
        this.$emit('go-remark', file);
      }
    },
    resetFileViewerPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
      this.replaceQuery(
        { ...this.$route.query, page: 1, size: 20 },
        'removeSearchParams',
      );
    },
    async fetchSchemaList() {
      await this.$store.dispatch('schemaModule/fetchSchemas');
    },
    async fetchFileList(options) {
      try {
        options = {
          needLoading: true,
          isAuto: false,
          isInit: false,
          ...options,
        };
        await this.$store.dispatch('detailModule/fetchFileList', {
          ...options,
          projectId: this.projectId,
          search_fid: this.jumpToFileInfo?.fileId,
        });
        if (!options.isInit && !options.isAuto) {
          this.replaceQuery({
            page: this.fileViewer.pager.page,
            size: this.fileViewer.pager.size,
            ...this.projectSearchParams,
            ...this.fileSearchParams,
            ...this.jumpToFileInfo,
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    refreshFileList() {
      this.resetFileViewerPager();
      this.fetchFileList();
    },
    handleAfterBatchPredictFiles() {
      this.fetchFileList();
    },
    async fetchTags() {
      try {
        await this.$store.dispatch('tagModule/fetchTags');
      } catch (error) {
        console.log(error.message);
      }
    },
    async deleteFile({ file }) {
      const fileType = file.isDir ? '文件夹' : '文件';
      const message = this.$features.supportFileRecycle()
        ? this.$t(`message['此操作将该{type}放入回收站, 是否继续?']`, {
            type: fileType,
          })
        : this.$t(`message['此操作将永久删除该{type}, 是否继续?']`, {
            type: fileType,
          });
      const confirm = await this.$confirm(
        message,
        this.$t(`message['提示']`),
      ).catch(() => {});

      if (confirm === 'confirm') {
        try {
          if (this.$features.supportFileRecycle()) {
            const params = file.isDir
              ? { tree_id: file.id }
              : { file_id: file.id };
            await trashOrRestoreFile(this.projectId, {
              ...params,
              abandon: true,
            });
          } else {
            await this.$store.dispatch('detailModule/deleteFile', {
              fileId: file.id,
              isDir: file.isDir,
              from: ROUTE_NAME_MAP[this.$route.name],
            });
          }
          this.$notify({
            title: this.$t(`message['提示']`),
            message: this.$features.supportFileRecycle()
              ? '放入回收站成功'
              : this.$t(`message['删除成功']`),
            type: 'success',
          });

          this.$store.commit(
            'fileModule/SET_SELECTED_FILES',
            this.selectedFiles.filter((item) => item.id !== file.id),
          );

          this.fetchFileList();
        } catch (error) {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    checkRoute() {
      const { query } = this.$route;
      const page = Number(query.page);
      if (!isNaN(page) && page > 0) {
        this.$store.commit('detailModule/SET_FILES_PAGER', {
          ...this.fileViewer.pager,
          page,
        });
      }
    },
    handleSetCurrent(file) {
      this.$store.commit('detailModule/SET_CUR_FILE', file);
    },
    handleChangePage(page) {
      if (page !== this.fileViewer.pager.page) {
        this.replaceQuery(
          {
            ...this.$route.query,
            page,
            size: this.fileViewer.pager.size,
          },
          'removeSearchParams',
        );
      } else {
        this.fetchFileList();
      }
    },
    handleChangeSize(size) {
      this.$store.commit('detailModule/SET_FILES_PAGER', {
        ...this.fileViewer.pager,
        page: 1,
      });
      if (
        size !== this.fileViewer.pager.size &&
        this.fileViewer.pager.page === 1
      ) {
        this.replaceQuery(
          {
            ...this.$route.query,
            page: 1,
            size,
          },
          'removeSearchParams',
        );
      } else {
        this.fetchFileList();
      }
    },
    handleChangeSort(params) {
      this.$store.commit('fileModule/SET_FILE_SORT_PARAMS', params);
    },
    handleChangeExpand(rows) {
      this.$store.commit('fileModule/SET_EXPANDED_FILES', rows);
    },
    handleChangeSelection(files) {
      this.$store.commit('fileModule/SET_SELECTED_FILES', files);
    },
    searchFiles(params) {
      const query = {
        page: 1,
        size: this.$route.query.size,
        ...params,
        ...this.jumpToFileInfo,
      };
      this.replaceQuery(query);
    },
    reset() {
      if (!this.$platform.isNafmiiEnv()) {
        this.$emit('reset-files-params');
      }
    },
  },
};
</script>
