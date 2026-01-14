<template>
  <div class="container">
    <div class="header">
      <el-button size="small" icon="el-icon-back" @click="goback"
        >返回</el-button
      >
    </div>
    <file-history-list :records="records"></file-history-list>
  </div>
</template>

<script>
import { file } from '../store/api';
import FileHistoryList from '../components/FileHistoryList';

export default {
  name: 'FileHistory',
  components: {
    FileHistoryList,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      pagination: {
        page: 0,
        total: 0,
        size: 20,
      },
      records: [],
    };
  },
  created() {
    this.fetchRecordHistory();
  },
  watch: {
    fileId() {
      this.resetData();
      this.fetchRecordHistory();
    },
  },
  methods: {
    async fetchRecordHistory() {
      try {
        let resp = await file.fetchRecordHistory(this.fileId);
        this.pagination.page = resp.data.page;
        this.pagination.total = resp.data.total;
        Object.assign(this.pagination, resp);
        resp.data.items.forEach((i) => {
          this.records.push(i);
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error,
          type: 'error',
        });
      }
    },
    resetData() {
      this.pagination.page = 0;
      this.pagination.total = 0;
      this.pagination.size = 20;
      this.records = [];
    },
    goback() {
      history.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 0 20px;
  .header {
    margin: 20px 0;
  }
}
</style>
