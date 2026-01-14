<template>
  <div class="project-viewer">
    <project-root
      v-if="top"
      ref="projectRoot"
      @go-detail="goDetail"
      @reset-files="resetFiles"
      @reset-projects-params="resetProjectsParams"></project-root>
    <project-detail
      v-else
      :project-id="projectId"
      :dir-id="dirId"
      @go-project="goProject"
      @go-detail="goDetail"
      @go-remark="goRemark"
      @reset-files-params="resetFilesParams"></project-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectRoot from '@/components/ProjectRoot.vue';
import ProjectDetail from '@/components/ProjectDetail.vue';
import FileMarkableMixin from './mixins/FileMarkableMixin';

export default {
  name: 'project-viewer',
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
    ProjectRoot,
    ProjectDetail,
  },
  data() {
    return {
      dirId: -1,
    };
  },
  created() {
    this.dirId = this.treeId;
  },
  watch: {
    treeId(newTreeId) {
      this.dirId = newTreeId;
    },
  },
  computed: {
    ...mapGetters('projectModule', ['projectSearchParams']),
    top() {
      return this.dirId === -1;
    },
  },
  methods: {
    goDetail(dirId, projectId) {
      const mid = this.projectSearchParams?.mid;
      const query = mid ? { mid } : {};
      this.$router.push({
        name: 'projectDetail',
        params: { treeId: dirId, projectId },
        query,
      });
    },
    goProject() {
      this.dirId = -1;
      this.$router.push({ name: 'project' });
    },
    goRemark(file) {
      this.previewFileByRemark(file);
    },
    reload() {
      this.$refs.projectRoot.reload();
    },
    resetProjectsParams() {
      this.$emit('reset-projects-params');
    },
    resetFiles() {
      this.$emit('reset-files');
    },
    resetFilesParams() {
      this.$emit('reset-files-params');
    },
  },
};
</script>
