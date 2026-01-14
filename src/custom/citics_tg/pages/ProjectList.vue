<template>
  <div class="citics-tg-page">
    <project-view v-if="isProjectList"></project-view>
    <file-list
      v-if="isFileList"
      :project-id="projectId"
      :tree-id="treeId"></file-list>
  </div>
</template>

<script>
import ProjectView from '../components/ProjectView';
import FileList from '../components/FileList';
export default {
  name: 'citics-tg-project',
  components: { ProjectView, FileList },
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
    return {};
  },
  computed: {
    isProjectList() {
      return this.$route.name === 'projectList';
    },
    isFileList() {
      return this.projectId !== -1;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
