<template>
  <div class="project-list-wrapper">
    <el-table
      v-bind="
        $style.project.tableHeight ? { height: $style.project.tableHeight } : {}
      "
      ref="table"
      class="has-border"
      :empty-text="$t(`message['暂无数据']`)"
      :data="projects.items"
      v-loading="projects.isLoading"
      @row-click="openDir"
      :default-sort="defaultSort"
      @sort-change="handleSortChange">
      <el-table-column
        prop="id"
        :label="$text.project['ID']"
        :width="$style.project.idWidth"></el-table-column>
      <el-table-column
        prop="name"
        :label="$text.project['名称']"
        :min-width="$style.project.nameWidth"
        class-name="name">
        <template slot-scope="scope">
          <theme-icon
            name="folder"
            icon-class="fa fa-box fa-fw fa-2x box-icon"
            img-class="folder"></theme-icon>
          <span class="icontext">
            <overflow-popover :content="getMetaName(scope.row)" />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showSchemaNameInProjectList()"
        :min-width="$style.project.schemaWidth"
        :label="$text.project['Schema名称']">
        <template slot-scope="scope">
          <template v-if="scope.row.mold_names.length !== 0">
            <span v-for="(name, index) in scope.row.mold_names" :key="index">
              <overflow-popover :content="name" />
            </span>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showFileCountInProjectList()"
        prop="file_count"
        :width="$style.project.fileCountWidth"
        :label="$t(`message['文件数']`)">
      </el-table-column>
      <el-table-column
        v-if="$features.supportProjectPermission()"
        prop="name"
        :width="$style.project.permissionWidth"
        :label="$t(`message['类型']`)">
        <template slot-scope="scope">
          {{ scope.row.public ? projectType.public : projectType.private }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showCommentInProjectList()"
        :min-width="$style.project.commentWidth"
        :label="$t(`message['备注']`)"
        class-name="comment">
        <template slot-scope="scope">
          <overflow-popover
            :content="scope.row.meta.comment ? scope.row.meta.comment : '-'" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showFounderInProjectList()"
        prop="user_name"
        :label="$t(`message['创建人']`)">
        <template slot-scope="scope">
          <overflow-popover :content="scope.row.user_name" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showCreatedDateInProjectList()"
        :sortable="isTimeSorting"
        prop="created_utc"
        :width="$style.project.timeWidth"
        :label="$t(`message['创建时间']`)">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="150"
        class-name="operations"
        :fixed="$features.operationColumnFixed()"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="showOperationBtns(scope.row)">
            <template v-if="isShowViewInOperations">
              <el-tooltip
                v-if="$features.isShowOperationIcon()"
                effect="dark"
                :content="$t(`message['详情']`)"
                placement="top">
                <el-button
                  circle
                  :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                  size="small"
                  @click.stop="openDir(scope.row)">
                  <theme-icon
                    name="detail"
                    icon-class="el-icon-more"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-button
                v-else
                type="text"
                class="view-btn"
                @click.stop="openDir(scope.row)">
                {{ $t(`message['查看']`) }}
              </el-button>
            </template>
            <template v-if="isShowEditInOperations(scope.row)">
              <el-tooltip
                v-if="$features.isShowOperationIcon()"
                effect="dark"
                :content="$t(`message['编辑']`)"
                placement="top">
                <template>
                  <el-button
                    circle
                    size="small"
                    :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                    @click.stop="openProjectPopup(scope.row)">
                    <theme-icon
                      name="edit"
                      icon-class="el-icon-edit"></theme-icon>
                  </el-button>
                </template>
              </el-tooltip>
              <el-button
                v-else
                type="text"
                class="edit-btn"
                @click.stop="openProjectPopup(scope.row)">
                {{ $t(`message['编辑']`) }}
              </el-button>
            </template>
            <template v-if="isShowDeleteInOperations(scope.row)">
              <el-tooltip
                v-if="$features.isShowOperationIcon()"
                effect="dark"
                :content="$t(`message['删除']`)"
                placement="top">
                <el-button
                  circle
                  size="small"
                  :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
                  @click.stop="deleteProject(scope.row.id)">
                  <theme-icon
                    name="delete"
                    icon-class="el-icon-delete"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-button
                v-else
                type="text"
                class="delete-btn"
                @click.stop="deleteProject(scope.row.id)">
                {{ $t(`message['删除']`) }}
              </el-button>
            </template>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :layout="paginationLayout"
      :current-page="projects.pager.page"
      :page-size="projects.pager.size"
      :page-sizes="[10, 20, 50]"
      :total="projects.pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <project-popup
      v-if="projects.current"
      :current="projects.current"
      @persist-project="persistProject"
      @close="closeProjectPopup">
    </project-popup>

    <!-- LLM 项目弹窗组件 -->
    <llm-project-dialog
      :visible="universalDialogVisible"
      mode="project"
      operation="edit"
      :scenario-options="scenarioItems"
      :initial-data="editProjectInitialData"
      :dialog-loading="dialogLoading"
      @success="handleUpdateSuccess"
      @close="handleUniversalDialogClose">
    </llm-project-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { EventBus, getSortParams, parseSortParams } from '@/utils';
import ProjectPopup from './ProjectPopup';
import LlmProjectDialog from './LLMProjectDialog';
import FileMarkableMixin from './mixins/FileMarkableMixin';
import { getPaginationLayout } from '@/utils/pagination';
import { projectType } from '@/store/constants';
import OverflowPopover from './OverflowPopover.vue';
import { fetchUserBusinessGroups } from '../store/api/cmfchina.api';
import * as llmParamsUtils from '@/utils/llmParamsUtils';

export default {
  name: 'project-root',
  mixins: [FileMarkableMixin],
  components: {
    OverflowPopover,
    ProjectPopup,
    LlmProjectDialog,
  },
  data() {
    return {
      projectType,
      groups: [],
      universalDialogVisible: false,
      dialogLoading: false,
      editingProject: null,
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('projectModule', [
      'projects',
      'projectSortParams',
      'projectSearchParams',
    ]),
    ...mapGetters('scenariosModule', ['scenarioItems']),
    paginationLayout() {
      return getPaginationLayout();
    },
    isTimeSorting() {
      if (this.$platform.isCmfchinaEnv() || this.$platform.isNafmiiEnv()) {
        return 'custom';
      }
      return false;
    },
    defaultSort() {
      return parseSortParams(this.projectSortParams);
    },
    isShowViewInOperations() {
      if (this.$platform.isNafmiiEnv()) {
        return true;
      }
      return !this.$platform.isDefaultEnv();
    },
    isShowEditInOperations() {
      return (row) => {
        if (this.$platform.isStrongholdEnv()) {
          return true;
        }
        if (this.$platform.isNafmiiEnv()) {
          return true;
        }
        return (
          this.$isAllowed('manageProject') || row.uid === this.loginUser.id
        );
      };
    },
    isShowDeleteInOperations() {
      return (row) => {
        if (this.$platform.isStrongholdEnv()) {
          return false;
        }
        if (this.$platform.isNafmiiEnv()) {
          return true;
        }
        return (
          this.$isAllowed('manageProject') || row.uid === this.loginUser.id
        );
      };
    },
    showOperationBtns() {
      return (row) => {
        if (this.$platform.isCmfchinaEnv()) {
          const visibleTreeIds = this.groups
            .map((group) => group.file_tree_ids)
            .flat(1);
          return visibleTreeIds.includes(row.rtree_id);
        }
        return true;
      };
    },
    editProjectInitialData() {
      if (!this.editingProject) {
        return {};
      }

      // 获取任务类型和场景ID
      const taskType = this.editingProject.default_task_type;
      const scenarioId = this.editingProject.default_scenario_id;

      // 根据任务类型和场景ID获取处理方式和审核方式
      const methodsResult = llmParamsUtils.getMethodsByTaskTypeCode(
        taskType,
        scenarioId,
      );
      return {
        id: this.editingProject.id,
        name: this.editingProject.name,
        process_methods: methodsResult.process_methods,
        audit_methods: methodsResult.audit_methods,
        scenario_id: scenarioId,
        molds: this.editingProject.default_molds || [],
        projectPermission: this.editingProject.public ? 1 : 0,
      };
    },
  },
  created() {
    EventBus.$on('search-projects', this.searchProjects);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('search-projects', this.searchProjects);
  },
  methods: {
    async init() {
      this.reset();
      this.$store.commit('detailModule/SET_DIR_ID', -1);
      this.$store.commit(
        'projectModule/SET_PROJECTS_SEARCH_PARAMS',
        this.$route.query,
      );
      await this.fetchProjects();
      if (this.$platform.isCmfchinaEnv()) {
        this.getUserGroups();
      }
    },
    reload() {
      this.$store.commit('projectModule/SET_PROJECTS_PAGER', {
        page: 1,
        size: 20,
        total: 0,
      });
      this.fetchProjects();
    },
    async fetchProjects() {
      try {
        this.$store.commit('projectModule/SET_LOADING', true);
        await this.$store.dispatch('projectModule/fetchProjects', {
          canSearch: true,
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('projectModule/SET_LOADING', false);
      }
    },
    closeProjectPopup() {
      this.$store.commit('projectModule/SET_CUR_PROJECT', null);
    },
    async openProjectPopup(row) {
      if (this.$isAllowed('showFileScenario')) {
        try {
          this.editingProject = row;
          this.universalDialogVisible = true;
          this.dialogLoading = true;
          await Promise.all([
            this.$store.dispatch('scenariosModule/getScenarios'),
            this.fetchAllSchemas(),
          ]);
        } catch (error) {
          console.error('获取数据失败:', error);
          this.$notify({
            title: '错误',
            message: '获取数据失败，请重试',
            type: 'error',
          });
          this.universalDialogVisible = false;
        } finally {
          this.dialogLoading = false;
        }
      } else {
        this.$store.commit('projectModule/SET_CUR_PROJECT', {
          id: row.id,
          uid: row.uid,
          name: row.name,
          defaultMolds: row.default_molds,
          isPublic: row.public,
          comment: row?.meta?.comment,
          group_ids: [],
        });
        this.fetchAllSchemas();
      }
    },
    async persistProject({ projectData, isPublic, defaultMolds }) {
      try {
        let tip = this.$text.project['项目修改成功'];
        await this.$store.dispatch('projectModule/persistProject', {
          projectData,
          isPublic,
          defaultMolds,
        });
        if (this.$platform.isCmfchinaEnv()) {
          await this.getUserGroups();
        }
        this.closeProjectPopup();
        if (projectData.id === -1) {
          tip = this.$text.project['项目新建成功'];
        }
        this.$notify({
          title: this.$t(`message['成功']`),
          message: tip,
          type: 'success',
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('projectModule/SET_LOADING', false);
      }
    },
    async deleteProject(id) {
      try {
        await this.$confirm(
          this.$text.project['是否删除该项目?'],
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );
        await this.$store.dispatch('projectModule/deleteProject', { id });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$text.project['项目删除成功'],
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('projectModule/SET_LOADING', false);
      }
    },
    openDir(project) {
      if (!this.$root.isClick) {
        return;
      }
      this.resetFileViewerPager();
      this.$emit('go-detail', project.rtree_id, project.id);
    },
    resetFileViewerPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
    },
    handleChangePage(page) {
      const pager = {
        ...this.projects.pager,
        page: page,
      };
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$store.commit('projectModule/SET_PROJECTS_PAGER', pager);
      this.fetchProjects();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.projects.pager,
        page: 1,
        size: size,
      };
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$store.commit('projectModule/SET_PROJECTS_PAGER', pager);
      this.fetchProjects();
    },
    handleSortChange({ prop, order }) {
      const sortParams = getSortParams(prop, order);
      this.$store.commit('projectModule/SET_PROJECTS_SORT_PARAMS', sortParams);
      this.handleChangePage(1);
    },
    searchProjects(params) {
      if (!_.isEmpty(params)) {
        this.$store.commit('projectModule/SET_PROJECTS_SEARCH_PARAMS', params);
      } else {
        this.$store.commit('projectModule/SET_PROJECTS_SEARCH_PARAMS', {});
      }
      this.handleChangePage(1);
    },
    reset() {
      this.$emit('reset-files');
      if (!this.$platform.isNafmiiEnv()) {
        this.$emit('reset-projects-params');
      }
    },
    async getUserGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    handleUniversalDialogClose() {
      this.universalDialogVisible = false;
      this.dialogLoading = false;
      this.editingProject = null;
    },

    handleUpdateSuccess() {
      this.handleUniversalDialogClose();
      this.fetchProjects();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  ::v-deep .el-table__row {
    cursor: pointer;
  }
  ::v-deep .cell {
    word-break: normal;
  }
  ::v-deep .name {
    .cell {
      display: flex;
      align-items: center;
    }
  }
  ::v-deep .comment {
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .icontext {
    font-size: 14px;
  }
  .folder {
    width: 26px;
    margin-right: 10px;
  }
  ::v-deep .box-icon {
    margin-right: 10px;
    font-size: 18px;
    vertical-align: -1px;
  }
}
.el-pagination {
  margin: 0 -1px;
  padding: 20px 0;
  text-align: center;
  background: #fff;
}
</style>
