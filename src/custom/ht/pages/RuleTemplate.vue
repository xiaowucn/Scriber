<template>
  <div class="rule-template">
    <div class="options">
      <el-upload
        v-if="$isAllowed('manageUser')"
        ref="upload"
        accept=".doc, .docx"
        action
        :show-file-list="false"
        :http-request="uploadTemplate">
        <el-button size="small" type="primary">上传模板</el-button>
      </el-upload>
    </div>
    <el-table :data="template.items">
      <el-table-column width="200" prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="模板名称"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button
              circle
              title="下载"
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="downloadTemplate(scope.row.id)"></el-button>
            <el-button
              v-if="$isAllowed('manageUser')"
              circle
              title="删除"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteTemplate(scope.row.id)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="template.pager.total > template.pager.size"
      background
      layout="prev, pager, next"
      @current-change="handleChangePage"
      :current-page="template.pager.page"
      :page-size="template.pager.size"
      :total="template.pager.total"></el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RuleTemplate',
  computed: {
    ...mapGetters('htModule', ['template', 'pager']),
  },
  created() {
    this.fetchTemplates();
  },
  methods: {
    fetchTemplates() {
      try {
        this.$store.dispatch('htModule/fetchTemplates');
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    async uploadTemplate(file) {
      try {
        const formData = new FormData();
        formData.append('file', file.file);
        await this.$store.dispatch('htModule/uploadTemplate', {
          data: formData,
        });
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    async downloadTemplate(id) {
      try {
        const downloadUrl = await this.$store.dispatch(
          'htModule/downloadTemplate',
          { id },
        );
        window.open(downloadUrl);
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    async deleteTemplate(id) {
      try {
        await this.$confirm('是否删除该模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await this.$store.dispatch('htModule/deleteTemplate', { id });
        this.$notify({
          title: '成功',
          message: '模板删除成功',
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    handleChangePage(page) {
      const pager = {
        page: page,
        size: this.pager.size,
        total: this.pager.total,
      };
      this.$store.commit('htModule/SET_TEMPLATE_PAGER', pager);
      this.fetchTemplates();
    },
  },
};
</script>

<style scoped lang="scss">
.rule-template {
  padding: 10px 30px;
  .options {
    padding: 10px 0 20px 0;
    border-bottom: 1px solid #ebeef5;
  }
  .el-pagination {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
