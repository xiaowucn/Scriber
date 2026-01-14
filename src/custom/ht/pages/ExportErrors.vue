<template>
  <div class="container">
    <div class="options">
      <el-button type="primary" size="small" @click="downloadExportErrors">
        下载报错数据
      </el-button>
    </div>
    <el-table :data="exportErrors">
      <el-table-column
        prop="id"
        label="报错ID"
        align="center"
        width="80"></el-table-column>
      <el-table-column
        prop="file_name"
        label="报错文档名称"
        width="500"></el-table-column>
      <el-table-column
        prop="fid"
        label="报错文档ID"
        align="center"></el-table-column>
      <el-table-column
        prop="content"
        label="报错内容"
        width="200"></el-table-column>
      <el-table-column
        prop="error_date"
        label="反馈日期"
        align="center"
        width="160"></el-table-column>
      <el-table-column
        prop="user_id"
        label="报错人ID"
        align="center"></el-table-column>
      <el-table-column
        prop="user_name"
        align="center"
        label="报错人姓名"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ht as htApi } from '@/store/api';

export default {
  name: 'export-errors',
  data() {
    return {
      times: {
        start: 0,
        end: null,
      },
    };
  },
  computed: {
    ...mapGetters('htModule', ['exportErrors']),
  },
  created() {
    this.fetchExportErrors();
  },
  methods: {
    fetchExportErrors() {
      this.$store.dispatch('htModule/exportErrors', {
        startTime: this.times.start,
        endTime: this.times.end,
      });
    },
    async downloadExportErrors() {
      try {
        const fileUrl = await htApi.downloadExportErrors(
          this.times.start,
          this.times.end,
        );
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileUrl);
        link.click();
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 10px 30px;
  .options {
    padding: 10px 0 20px 0;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
