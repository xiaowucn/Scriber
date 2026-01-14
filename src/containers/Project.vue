<template>
  <div ref="projectContainer" class="project-container">
    <project-nav-header
      v-if="!$user.isCcxiNormalUser()"
      :projectId="projectId"
      :treeId="treeId"
      :currentTab="currentTab"
      :isProjectActive="isProjectActive"
      @clear-search-result="reload">
      <el-button
        v-if="isShowCreateProject"
        :class="{ 'button-csc': $platform.isCscEnv() }"
        size="medium"
        type="primary"
        @click="openProjectPopup">
        <i
          v-if="isShowCreateProjectIcon"
          :class="
            $platform.isDefaultEnv()
              ? 'fa fa-plus fa-fw'
              : 'el-icon-circle-plus'
          "></i>
        {{ $text.project['新建项目'] }}
      </el-button>
    </project-nav-header>
    <el-tabs
      v-if="isShowProjectTabs"
      :type="!$platform.isDefaultEnv() ? 'border-card' : 'card'"
      v-model="currentTab"
      @tab-click="tabClick">
      <el-tab-pane name="projectAll">
        <span slot="label">
          {{ $text.file['项目'] }}
          <el-button
            v-if="isShowCreateProjectInTab"
            :title="$t(`message['新增']`)"
            v-show="projectId === -1"
            class="popup-button"
            size="mini"
            @click.stop="openProjectPopup">
            <i class="fa fa-fw fa-plus"></i>
          </el-button>
        </span>
        <project-viewer
          v-if="currentTab === 'projectAll'"
          :projectId="projectId"
          :treeId="treeId"></project-viewer>
      </el-tab-pane>
      <el-tab-pane
        v-if="isProjectActive && $features.showProjectRemarkTab()"
        :label="$t(`message['我标注过的']`)"
        name="projectAnsweredFiles">
        <project-file
          v-if="currentTab === 'projectAnsweredFiles'"
          type="answeredFiles"
          :projectId="projectId"></project-file>
      </el-tab-pane>
      <el-tab-pane
        v-if="isProjectActive && $features.showProjectRemarkTab()"
        :label="$t(`message['标注完成']`)"
        name="projectTaggedFiles">
        <project-file
          v-if="currentTab === 'projectTaggedFiles'"
          type="taggedFiles"
          :projectId="projectId"></project-file>
      </el-tab-pane>
      <el-tab-pane
        v-if="isShowConflict && !configuration.single_answer"
        :label="$t(`message['冲突数据']`)"
        name="projectConflictFiles">
        <project-file
          v-if="currentTab === 'projectConflictFiles'"
          type="conflictFiles"
          :projectId="projectId"></project-file>
      </el-tab-pane>
      <el-tab-pane
        v-if="isProjectActive && $features.showProjectAllFiles()"
        :label="$t(`message['所有文件']`)"
        name="projectAllFiles">
        <project-file
          v-if="currentTab === 'projectAllFiles'"
          type="allFiles"
          :projectId="projectId"></project-file>
      </el-tab-pane>
      <el-tab-pane
        v-if="isProjectActive"
        :label="$text.schema['Schema']"
        name="projectSchema">
        <template v-if="currentTab === 'projectSchema'">
          <project-schema
            v-if="isShowProjectSchemaComponent"
            :projectId="projectId"></project-schema>
          <project-file
            v-else
            type="schemaFiles"
            :projectId="projectId"
            :schemaId="Number($route.query.schemaId)"
            :show-back-button="true">
          </project-file>
        </template>
      </el-tab-pane>
      <el-tab-pane
        v-if="isProjectActive && $features.supportFileRecycle()"
        name="projectRecycleFiles"
        :projectId="projectId"
        :label="$t(`message['文件回收站']`)">
        <project-trash
          v-if="currentTab === 'projectRecycleFiles'"
          :projectId="projectId"
          :treeId="treeId"></project-trash>
      </el-tab-pane>
    </el-tabs>
    <project-viewer
      v-else
      ref="projectViewer"
      :projectId="projectId"
      :treeId="treeId"
      @reset-projects-params="resetProjectsParams"
      @reset-files="resetFiles"
      @reset-files-params="resetFilesParams"></project-viewer>

    <!-- LLM 项目弹窗组件 -->
    <llm-project-dialog
      :visible="universalDialogVisible"
      mode="project"
      operation="create"
      :scenario-options="scenarioItems"
      :dialog-loading="dialogLoading"
      @success="handleCreateSuccess"
      @close="handleUniversalDialogClose">
    </llm-project-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectNavHeader from '@/components/ProjectNavHeader';
import ProjectViewer from '@/components/ProjectViewer';
import ProjectFile from '@/components/ProjectFile';
import ProjectTrash from '@/components/ProjectTrash';
import ProjectSchema from '@/components/ProjectSchema';
import LlmProjectDialog from '@/components/LLMProjectDialog';
import { fetchProject } from '@/store/api/project.api';
import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';

export default {
  name: 'project-page',
  mixins: [FileMarkableMixin],
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
  components: {
    ProjectViewer,
    ProjectFile,
    ProjectTrash,
    ProjectSchema,
    ProjectNavHeader,
    LlmProjectDialog,
  },
  data() {
    return {
      currentTab: '',
      isRouteToRemarkOrInspectPage: false,
      universalDialogVisible: false,
      dialogLoading: false,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('projectModule', ['projects']),
    ...mapGetters('fileModule', ['pager']),
    ...mapGetters('scenariosModule', ['scenarioItems']),
    isProjectActive() {
      return this.projectId !== -1;
    },
    isShowConflict() {
      return this.isProjectActive && this.$isAllowed('manageProject');
    },
    isShowProjectSchemaComponent() {
      return this.$route.query.schemaId === undefined;
    },
    isShowCreateProject() {
      if (this.$platform.isStrongholdEnv()) {
        return false;
      }

      return this.projectId === -1;
    },
    isShowCreateProjectIcon() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return true;
    },
    isShowCreateProjectInTab() {
      if (!this.$platform.isDefaultEnv()) {
        return true;
      }

      return false;
    },
    isShowProjectTabs() {
      return (
        !this.$platform.isDefaultEnv() ||
        (!this.$user.isCcxiNormalUser() &&
          this.isProjectActive &&
          !this.$platform.isCmfchinaEnv())
      );
    },
  },
  watch: {
    $route(to) {
      this.showTab(to.name);
      this.resetFilesPager();
      if (!this.isShowProjectTabs) {
        this.resetFilesParams();
      }
    },
    'fileViewer.filePath': {
      handler() {
        this.getBreadCrumbData();
      },
      immediate: true,
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'remark') {
      this.$store.commit('fileModule/SET_SCROLL_TOP', 0);
      this.$store.commit('fileModule/SET_EXPANDED_FILES', []);
      this.$store.commit('fileModule/SET_LAST_OPENED_QUESTION_ID', null);
    }
    if (to.name === 'remark' || to.name === 'inspect') {
      this.isRouteToRemarkOrInspectPage = true;
    }
    next();
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    if (!this.isRouteToRemarkOrInspectPage) {
      this.resetProjects();
      this.resetFiles();
    }
    this.resetBreadcrumb();
  },
  methods: {
    async init() {
      try {
        this.showTab(this.$route.name);
        const preloadTasks = [];
        if (this.projectId > -1) {
          preloadTasks.push(this.fetchProjectInfo());
        }
        await Promise.all(preloadTasks);
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    reload() {
      if (this.isProjectActive) {
        this.$store.commit('projectModule/SET_PROJECTS_PAGER', {
          page: 1,
          size: 20,
          total: 0,
        });
        this.$router.push({ path: '/project' });
        return;
      }
      this.$refs.projectViewer.reload();
    },
    async fetchProjectInfo() {
      await fetchProject(this.projectId);
    },
    async openProjectPopup() {
      if (this.$isAllowed('showFileScenario')) {
        try {
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
        this.$store.commit('projectModule/SET_EMPTY_PROJECT');
        this.fetchAllSchemas();
      }
    },
    getBreadCrumbData() {
      if (this.$platform.isNafmiiEnv()) {
        const breadCrumbData = this.fileViewer.filePath.map((item) => ({
          name: item.name,
          path: `project/${this.projectId}/tree/${item.id}`,
        }));
        this.$store.commit('nafmiiModule/SET_BREAD_CRUMB_DATA', breadCrumbData);
      }
    },
    showTab(name) {
      if (name === 'project' || name === 'projectDetail') {
        this.currentTab = 'projectAll';
      } else {
        this.currentTab = name;
      }
      return this.currentTab;
    },
    tabClick(e) {
      if (e.name === 'projectAll') {
        if (this.fileViewer.curDirId === -1) {
          this.$router.push({ path: '/project' });
        } else {
          // restore previous project tree
          this.$router.push({
            name: 'projectDetail',
            params: {
              projectId: this.projectId,
              treeId: this.fileViewer.curDirId,
            },
          });
        }
      } else {
        this.$router.push({
          name: e.name,
          params: {
            projectId: this.projectId,
            treeId:
              this.fileViewer.curDirId > -1
                ? this.fileViewer.curDirId
                : this.treeId,
          },
        });
      }
    },
    resetProjects() {
      this.resetProjectsPager();
      this.resetProjectsParams();
    },
    resetProjectsPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('projectModule/SET_PROJECTS_PAGER', pager);
    },
    resetProjectsParams() {
      this.$store.commit('projectModule/SET_PROJECTS_SORT_PARAMS', {});
      this.$store.commit('projectModule/SET_PROJECTS_SEARCH_PARAMS', {});
    },
    resetFiles() {
      this.resetFilesPager();
      this.resetFilesParams();
    },
    resetFilesPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', pager);
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
    },
    resetFilesParams() {
      this.$store.commit('fileModule/SET_FILE_SORT_PARAMS', {});
      this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', {});
    },
    resetBreadcrumb() {
      if (this.$platform.isNafmiiEnv()) {
        this.$store.commit('nafmiiModule/SET_BREAD_CRUMB_DATA', []);
      }
    },

    handleUniversalDialogClose() {
      this.universalDialogVisible = false;
      this.dialogLoading = false;
    },
    handleCreateSuccess() {
      this.handleUniversalDialogClose();
      // 重新请求项目列表
      this.$refs.projectViewer.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.project-container {
  height: calc(100% - 86px);
  overflow-y: auto;
  padding: 0 20px;
  .el-tabs {
    border-bottom: none;
    box-shadow: none;
    &.el-tabs--border-card {
      border: none;
    }
    ::v-deep .el-tabs__header {
      border: 1px solid #dcdfe6;
      .popup-button {
        padding: 0.5em;
      }
    }
    ::v-deep .el-tabs__content {
      padding: 0 0 20px 0;
    }
  }
}
</style>
