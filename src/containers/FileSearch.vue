<template>
  <div class="file-search-container">
    <project-nav-header
      :projectId="projectId"
      :treeId="treeId"
      :currentTab="currentTab"
      :searchTitle="searchTitle"
      @clear-search-result="clearSearchResult">
    </project-nav-header>
    <file-list
      v-loading="isLoading"
      :files="filesBySearch"
      :pager="pager"
      :scroll-top="scrollTop"
      :sort-params="fileSortParams"
      :expanded-files="expandedFiles"
      @change-page="handleChangePage"
      @change-size="handleChangeSize"
      @change-sort="handleChangeSort"
      @change-expand="handleChangeExpand"
      @open-dir="openDir">
      <template slot="row-handle" slot-scope="row">
        <el-tooltip
          v-if="showInspectAnswerBtn(row.slotScope)"
          effect="dark"
          :content="$t(`message['查看']`)"
          placement="top">
          <el-button
            :type="!$platform.isDefaultEnv() ? 'warning' : 'text'"
            @click.stop="previewFileByInspect(row.slotScope)"
            circle>
            <theme-icon name="view" icon-class="el-icon-document"></theme-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          placement="top"
          :content="$t(`message['编辑']`)"
          v-if="isShowEditInOperations(row.slotScope)">
          <el-button
            :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
            size="small"
            circle
            @click.native.stop="openFilePopup(row.slotScope)">
            <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
          </el-button>
        </el-tooltip>
        <template v-if="isShowReparseInOperations(row.slotScope)">
          <el-tooltip
            v-if="row.slotScope.task_type === 'extract'"
            effect="dark"
            placement="top"
            :content="$t(`message['重新预测']`)">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'success' : 'text'"
              size="small"
              circle
              :disabled="isFileParsing(row.slotScope.pdf_parse_status)"
              @click.native.stop="
                reparseFile(row.slotScope, 'predict', $t(`message['重新预测']`))
              ">
              <theme-icon
                name="reparse"
                icon-class="el-icon-refresh"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-dropdown
            v-else
            class="reparse-dropdown"
            trigger="click"
            @command="(e) => handleReparseCommand(e, row.slotScope)">
            <el-button
              class="reparse-btn"
              :type="!$platform.isDefaultEnv() ? 'success' : 'text'"
              size="small"
              circle
              :disabled="isFileParsing(row.slotScope.pdf_parse_status)"
              @click.stop>
              <theme-icon
                name="reparse"
                icon-class="el-icon-refresh"></theme-icon>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="predict">
                {{ $t(`message['重新预测和审核']`) }}
              </el-dropdown-item>
              <el-dropdown-item command="inspect">
                {{ $t(`message['仅重新审核']`) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <el-tooltip
          effect="dark"
          :content="$text.file['在项目中查看']"
          placement="top">
          <el-button
            :type="!$platform.isDefaultEnv() ? 'default' : 'text'"
            size="mini"
            @click.stop="goDetail(row.slotScope)">
            <theme-icon
              name="view-in-project"
              icon-class="el-icon-search"></theme-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip
          effect="dark"
          :content="$t(`message['删除']`)"
          placement="top">
          <el-button
            v-if="showDeleteFileBtn"
            :type="!$platform.isDefaultEnv() ? 'default' : 'text'"
            size="mini"
            @click.stop="deleteFile(row.slotScope)">
            <theme-icon name="delete" icon-class="el-icon-delete"></theme-icon>
          </el-button>
        </el-tooltip>
      </template>
    </file-list>
    <file-popup
      v-if="fileViewer.current"
      :molds="schemas.items"
      :file="fileViewer.current"
      @update-files="fetchSearchResult">
    </file-popup>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';
import {
  file as fileApi,
  detail as detailApi,
  nafmii as nafmiiApi,
} from '@/store/api';
import { pdfParseStatus } from '@/store/constants';
import ProjectNavHeader from '@/components/ProjectNavHeader';
import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';
import FileList from '@/components/FileList';
import FilePopup from '@/components/FilePopup';

export default {
  name: 'FileSearch',
  mixins: [FileMarkableMixin],
  components: {
    FileList,
    FilePopup,
    ProjectNavHeader,
  },
  props: {
    projectId: {
      type: Number,
      default: -1,
    },
    treeId: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      fileListTimer: null,
      currentTab: 'projectAll',
      search: {},
      CONDITIONS: {
        filename: this.$t(`message['文件名']`),
        fileid: this.$t(`message['文件ID']`),
        username: this.$t(`message['标注用户']`),
        manager_name: this.$t(`message['基金管理人名称']`),
        product_name: this.$t(`message['产品名称']`),
        sysfrom: this.$t(`message['文件来源']`),
      },
      sortParams: {},
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('fileModule', [
      'pager',
      'filesBySearch',
      'isLoading',
      'scrollTop',
      'expandedFiles',
      'fileSortParams',
    ]),
    searchTitle() {
      const title = [];
      Object.entries(this.$route.query).forEach((item) => {
        title.push(this.CONDITIONS[item[0]] + '=' + item[1]);
      });
      return title.join();
    },
    isCanReparse() {
      return !this.$platform.isCustomerEnv() || this.$platform.isCmfchinaEnv();
    },
    isFileParsing() {
      return (status) => {
        return status === pdfParseStatus.parsing;
      };
    },
    isShowEditInOperations() {
      return (file) => {
        return (
          this.isCanReparse &&
          (this.$isAllowed('manageProject') ||
            file.uid === this.loginUser.id ||
            this.$platform.isStrongholdEnv())
        );
      };
    },
    isShowReparseInOperations() {
      return (file) => {
        return (
          this.isCanReparse && this.$isAllowed('manageProject') && !file.isDir
        );
      };
    },
    showDeleteFileBtn() {
      return this.$platform.isCmfchinaEnv();
    },
  },
  watch: {
    '$route.query'() {
      this.getSearchParams();
      this.setFilePager(1);
      this.fetchSearchResult();
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'remark') {
      this.setFilePager(1, 0);
    }
    next();
  },
  created() {
    EventBus.$on('filter-files-by-condition', this.filterFilesByCondition);
    this.init();
  },
  mounted() {
    if (this.isCanReparse) {
      if (this.fileListTimer) {
        clearInterval(this.fileListTimer);
      }
      this.fileListTimer = setInterval(() => {
        this.fetchSearchResult({ needLoading: false });
      }, 30e3);
    }
  },
  beforeDestroy() {
    if (this.isCanReparse) {
      clearInterval(this.fileListTimer);
    }
    EventBus.$off('filter-files-by-condition', this.filterFilesByCondition);
  },
  methods: {
    async init() {
      this.getSearchParams();
      await this.fetchSearchResult();
    },
    getSearchParams() {
      this.search = this.$route.query;
      delete this.search.treeId;
      delete this.search.projectId;
    },
    async fetchSearchResult(options = { needLoading: true }) {
      const params = {
        page: this.pager.page,
        size: this.pager.size,
        ...this.search,
        ...this.sortParams,
      };
      try {
        if (options.needLoading) {
          this.$store.commit('fileModule/SET_ALL_LOADING', true);
        }
        const searchParams = {
          query: _.omitBy(params, (v) => v === '' || v === 'all'),
        };
        if (this.$platform.isCmfchinaEnv()) {
          searchParams.projectId = this.projectId;
        }

        await this.$store.dispatch(
          'fileModule/fetchFileBySearch',
          searchParams,
        );
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        if (options.needLoading) {
          this.$store.commit('fileModule/SET_ALL_LOADING', false);
        }
      }
    },
    handleChangePage(page) {
      const pager = {
        ...this.pager,
        page: page,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', pager);
      this.fetchSearchResult();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', pager);
      this.fetchSearchResult();
    },
    clearSearchResult() {
      this.setFilePager(1, 0);
      this.$router.push({ path: '/project' });
    },
    filterFilesByCondition({ field, value }) {
      Object.assign(this.search, { [field]: value });
      this.fetchSearchResult();
    },
    openDir(file) {
      if (this.showInspectAnswerBtn(file)) {
        this.previewFileByInspect(file);
        return;
      }

      this.previewFileByRemark(file);
    },
    openFilePopup(file) {
      this.$store.commit('detailModule/SET_CUR_FILE', file);
    },
    async reparseFile(row, task, type) {
      try {
        const data = {
          task,
          fids: [row.id],
        };
        if (this.$platform.isNafmiiEnv()) {
          await nafmiiApi.predictFiles(data);
        } else {
          await fileApi.predictFiles(data);
        }
        this.$notify({
          title: this.$t(`message['成功']`),
          message:
            this.$t(`message['发起']`) + `${type}` + this.$t(`message['成功']`),
          type: 'success',
        });
        this.fetchSearchResult();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    handleReparseCommand(command, row) {
      const taskMap = {
        predict: this.$t(`message['重新预测和审核']`),
        inspect: this.$t(`message['重新审核']`),
      };
      this.reparseFile(row, command, taskMap[command]);
    },
    handleChangeSort(params) {
      this.sortParams = params;
      this.$store.commit('fileModule/SET_FILE_SORT_PARAMS', params);
    },
    handleChangeExpand(rows) {
      this.$store.commit('fileModule/SET_EXPANDED_FILES', rows);
    },
    async deleteFile(file) {
      const confirm = await this.$confirm(
        this.$t(`message['此操作将永久删除该{type}, 是否继续?']`, {
          type: '文件',
        }),
        this.$t(`message['提示']`),
      ).catch(() => {});

      if (confirm === 'confirm') {
        try {
          await detailApi.deleteFile(false, file.id);
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(`message['删除成功']`),
            type: 'success',
          });
          this.fetchSearchResult();
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.file-search-container {
  padding: 0 20px;
}

::v-deep .reparse-dropdown {
  margin-top: 5px;
  &.el-dropdown {
    margin: 0 10px;
  }
}
</style>
