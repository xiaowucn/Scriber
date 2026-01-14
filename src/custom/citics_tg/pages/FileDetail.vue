<template>
  <file-remark
    v-if="qid"
    :qid="qid"
    :fileId="fileId"
    :schemaId="schemaId"
    :projectId="projectId"
    :treeId="treeId"
    :standardQid="standardQid"></file-remark>
</template>

<script>
import FileRemark from '@/containers/FileRemark.vue';
import { fetchFilesbyId } from '@/store/api/citics-tg.api';
export default {
  name: 'citics-tg-file-detail',
  components: { FileRemark },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    standardFileId() {
      return Number(this.$route.query.standardFileId) || null;
    },
  },
  data() {
    return {
      qid: null,
      schemaId: null,
      projectId: null,
      treeId: null,
      standardQid: 0,
    };
  },
  watch: {
    standardFileId: {
      async handler() {
        if (this.standardFileId) {
          const standerdFile = await this.getCurrentFileInfo(
            this.standardFileId,
          );
          if (standerdFile) {
            this.standardQid = standerdFile.qid;
          }
        }
      },
      immediate: true,
    },
    fileId() {
      this.init();
    },
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      const currentFile = await this.getCurrentFileInfo(this.fileId);
      if (currentFile) {
        this.qid = currentFile.qid;
        this.schemaId = currentFile.molds[0];
        this.projectId = currentFile.project;
        this.treeId = currentFile.tree_id;
      }
    },
    async getCurrentFileInfo(fileId) {
      try {
        const res = await fetchFilesbyId(fileId);
        const { data } = res;
        return data;
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
