<template>
  <div class="project-summary" :class="[!expand ? 'fold' : '']">
    <el-button
      v-if="$features.supportFoldProjectSummary()"
      size="mini"
      :icon="`el-icon-d-arrow-${expand ? 'right' : 'left'}`"
      @click="expand = !expand">
      {{ expand ? '收回' : '展开' }}
    </el-button>

    <project-summary-item :label="$text.file['总文档']">
      {{ totalFiles }}
    </project-summary-item>
    <template v-if="$features.showAIModules()">
      <project-summary-item :label="$t(`message['预测中']`)">{{
        predicting
      }}</project-summary-item>
      <project-summary-item :label="$t(`message['预测完成']`)">{{
        predicted
      }}</project-summary-item>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectSummaryItem from './ProjectSummaryItem';

export default {
  name: 'project-summary',
  components: {
    ProjectSummaryItem,
  },
  props: {
    projectId: {
      type: [Number, String],
      required: false,
    },
    showTagCompleted: {
      type: Boolean,
      required: false,
      default: true,
    },
    showTagUser: {
      type: Boolean,
      required: false,
      default: true,
    },
    task: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expand: true,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('summaryModule', [
      'summary',
      'totalFiles',
      'totalPages',
      'totalQuestions',
      'tagCompleted',
      'conflicts',
      'finishedQuestions',
      'predicting',
      'predicted',
      'users',
    ]),
    ...mapGetters('projectModule', ['projects']),
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('nafmiiModule', ['tasks']),
    usernames() {
      if (!this.users || !this.users.length) {
        return this.$t(`message['无']`);
      } else {
        return this.users
          .filter((e) => e.name)
          .map((e) => e.name)
          .join(', ');
      }
    },
    isTreeidInProject() {
      const treeId = Number(this.$route.params.treeId);
      return !!this.projects.items.find((item) => item.rtree_id === treeId);
    },
    isShowTagCompleted() {
      return (
        this.showTagCompleted &&
        !this.$platform.isCiticsDCMEnv() &&
        !this.$platform.isCmfchinaEnv()
      );
    },
    isShowTagUser() {
      return (
        this.showTagUser &&
        !this.$user.isCcxiNormalUser() &&
        !this.$platform.isCiticsDCMEnv() &&
        !this.$platform.isCmfchinaEnv()
      );
    },
    files() {
      return this.task ? this.tasks.files : this.fileViewer.files;
    },
  },
  watch: {
    files: {
      handler() {
        this.fetchSummary();
      },
    },
  },
  async created() {
    if (this.projects.items.length === 0 && !this.task) {
      await this.$store.dispatch('projectModule/fetchProjects');
    }
  },
  methods: {
    async fetchSummary() {
      try {
        this.$store.dispatch('summaryModule/fetchSummary', {
          projectId: this.projectId,
          params: {
            tree_id: this.$route.params.treeId,
            isTask: this.task,
          },
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.project-summary {
  display: flex;
  margin-right: 30px;
  transition: all 0.3s;
  &.fold {
    transform: translateX(95%);
  }
  .project-summary-item {
    display: flex;
    align-items: center;
    margin-left: 1em;
    padding-left: 1em;
    border-left: 3px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
