<template>
  <div class="navigate-btns">
    <el-button
      size="mini"
      icon="el-icon-d-arrow-left"
      class="btn-prev"
      :disabled="prevFileButtonDisabled"
      @click="openPrevOrNextFile('prev')">
      {{ prevFileButtonDisabled ? '当前页最前' : '上一篇' }}
    </el-button>
    <el-button
      size="mini"
      :disabled="nexFileButtonDisabled"
      @click="openPrevOrNextFile('next')">
      {{ nexFileButtonDisabled ? '当前页最后' : '下一篇' }}
      <i class="el-icon-d-arrow-right"></i>
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { pdfParseStatus } from '@/store/constants';

export default {
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    markableFiles() {
      return this.fileViewer.files.filter(
        (file) => file.pdf_parse_status === pdfParseStatus.completed,
      );
    },
    currentFileId() {
      return Number(this.$route.params.fileId);
    },
    currentFileIndex() {
      return this.markableFiles.findIndex((file) => {
        return file.id === this.currentFileId;
      });
    },
    prevFileButtonDisabled() {
      return this.currentFileIndex === 0;
    },
    nexFileButtonDisabled() {
      return this.currentFileIndex === this.markableFiles.length - 1;
    },
  },
  methods: {
    handleJumpToFileRemark(file) {
      this.$router.push({
        name: 'fileRemark',
        params: { fileId: file.id },
        query: { qid: file.questions[0].id },
      });
    },
    openPrevOrNextFile(direction) {
      let file = {};
      if (direction === 'prev') {
        const prevFile = this.markableFiles[this.currentFileIndex - 1];
        file = prevFile;
      } else {
        const nextFile = this.markableFiles[this.currentFileIndex + 1];
        file = nextFile;
      }
      this.handleJumpToFileRemark(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.navigate-btns {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid #ccc;
}
</style>
