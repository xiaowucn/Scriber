<template>
  <el-header class="disclosure-detail-header" height="50px">
    <div class="left">
      <div>
        <label>交易所：</label>
        <span>{{ project.exchange }}</span>
      </div>
      <div class="file-name">
        <label>文件名称：</label>
        <span class="name" :title="mainFile.name">{{ mainFile.name }}</span>
      </div>
    </div>
    <div class="right">
      <div>
        <label>报告年份：</label>
        <span>{{ mainFile.report_year }}</span>
      </div>
      <div>
        <label>报告类型：</label>
        <span>{{ mainFile.doc_type }}</span>
      </div>
    </div>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'disclosure-detail-header',
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    project() {
      return this.detail.project;
    },
    mainFile() {
      return this.detail.files[0];
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-detail-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #ffffff;
  background-color: $--color-primary;
  column-gap: 50px;
  .left,
  .right {
    display: flex;
    align-items: center;
    column-gap: 20px;
    > div {
      white-space: nowrap;
    }
  }
  .left {
    overflow: hidden;
    .file-name {
      display: flex;
      overflow: hidden;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
