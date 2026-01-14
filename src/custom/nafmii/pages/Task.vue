<template>
  <div class="task-container">
    <div class="page-header task-header">
      <task-search-box @search="searchTasks" :file-types="taskFileTypes" />
    </div>
    <file-viewer
      :file-viewer="tasks"
      :read-only="true"
      :can-upload-zip="false"
      :can-create-folder="false"
      :selected-files="tasks.selected"
      :sort-params="tasks.sortParams"
      :task="true"
      :task-file-types="taskFileTypes"
      @set-current="handleSetCurrent"
      @change-sort="handleChangeSort"
      @change-page="handleChangePage"
      @change-size="handleChangeSize"
      @change-selection="handleChangeSelection"
      @delete-file="deleteTask"
      @fetch-files="fetchTasks"
      @after-batch-delete-files="refreshTasks"
      @after-batch-predict-files="fetchTasks">
      <project-summary
        slot="summary"
        :show-tag-completed="false"
        :show-tag-user="false"
        :task="true" />
    </file-viewer>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import TaskSearchBox from '../components/TaskSearchBox';
import FileViewer from '../../../components/FileViewer';
import ProjectSummary from '../../../components/ProjectSummary';
import { nafmii as nafmiiApi } from '../../../store/api';
import { ROUTE_NAME_MAP } from '../common/constant';

export default {
  name: 'task-page',
  components: { TaskSearchBox, FileViewer, ProjectSummary },
  data() {
    return {
      taskListTimer: null,
      taskFileTypes: [],
    };
  },
  created() {
    this.fetchFileTypes();
    this.setQueryToStore();
    this.fetchTasks({ isInit: true });
  },
  mounted() {
    if (this.taskListTimer) {
      clearInterval(this.taskListTimer);
    }
    this.taskListTimer = setInterval(() => {
      this.fetchTasks({ needLoading: false, isAuto: true });
    }, 30e3);
  },
  beforeDestroy() {
    clearInterval(this.taskListTimer);
  },
  computed: {
    ...mapGetters('nafmiiModule', ['tasks']),
    ...mapGetters('fileModule', ['fileSearchParams']),
  },
  watch: {
    '$route.query': {
      handler() {
        this.setQueryToStore();
        this.fetchTasks();
      },
    },
  },
  methods: {
    replaceQuery(query) {
      this.$router.replace({
        query,
      });
    },
    setQueryToStore() {
      const pager = {
        ...this.tasks.pager,
        page: Number(this.$route.query?.page || 1),
        size: Number(this.$route.query?.size || 20),
      };
      this.$store.commit('nafmiiModule/SET_TASKS_PAGER', pager);

      const params = _.omit(this.$route.query, ['page', 'size']);
      this.$store.commit('nafmiiModule/SET_TASKS_SEARCH_PARAMS', params);
    },
    async fetchTasks(
      options = { needLoading: true, isAuto: false, isInit: false },
    ) {
      try {
        await this.$store.dispatch('nafmiiModule/getTasks', options);
        if (!options.isInit && !options.isAuto) {
          this.replaceQuery({
            page: this.tasks.pager.page,
            size: this.tasks.pager.size,
            ...this.tasks.searchParams,
          });
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchFileTypes() {
      try {
        const res = await nafmiiApi.fetchFileTypes();
        this.taskFileTypes = res.map((item) => ({
          value: item,
          label: item,
        }));
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteTask({ file }) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await this.$store.dispatch('detailModule/deleteFile', {
            fileId: file.id,
            isDir: file.isDir,
            from: ROUTE_NAME_MAP[this.$route.name],
          });
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
          });
          const selectedTasks = this.tasks.selected.filter(
            (item) => item.id !== file.id,
          );
          this.handleChangeSelection(selectedTasks);
          this.fetchTasks();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    handleSetCurrent(task) {
      this.$store.commit('nafmiiModule/SET_CURRENT_TASKS', task);
    },
    handleChangeSort(params) {
      this.$store.commit('nafmiiModule/SET_TASKS_SORT_PARAMS', params);
    },
    handleChangeSelection(tasks) {
      this.$store.commit('nafmiiModule/SET_SELECTED_TASKS', tasks);
    },
    handleChangePage(page) {
      if (page !== this.tasks.pager.page) {
        this.replaceQuery({
          ...this.$route.query,
          page: page,
          size: this.tasks.pager.size,
        });
      } else {
        this.fetchTasks();
      }
    },
    handleChangeSize(size) {
      if (size !== this.tasks.pager.size && this.tasks.pager.page === 1) {
        this.replaceQuery({
          ...this.$route.query,
          page: 1,
          size: size,
        });
      } else {
        this.fetchTasks();
      }
    },
    searchTasks(params) {
      const query = {
        page: 1,
        size: this.$route.query.size,
        ...params,
      };
      this.replaceQuery(query);
    },
    refreshTasks() {
      this.handleChangePage(1);
    },
  },
};
</script>
