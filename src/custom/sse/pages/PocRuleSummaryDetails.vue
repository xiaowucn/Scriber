<template>
  <div class="compliance-rule-summary" v-loading="loading">
    <div class="banner">
      <el-button size="small" icon="el-icon-back" @click="goback"
        >返回</el-button
      >
    </div>
    <el-table :data="ruleSummaryDetails">
      <el-table-column
        prop="file_meta.stock_code"
        label="证券代码"></el-table-column>
      <el-table-column
        prop="file_meta.stock_name"
        label="公司名称"></el-table-column>
      <el-table-column
        prop="file.name"
        label="项目文档"
        width="250"></el-table-column>
      <el-table-column
        prop="rule_result.comment"
        label="规则状态"
        align="center"></el-table-column>
      <el-table-column
        prop="rule_result.second_rule"
        label="规则详情"
        width="400"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="viewFileDetails(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="changePage"></el-pagination>
  </div>
</template>

<script>
import { fetchPocRuleSummaryDetails } from '@/store/api/sse.api';

export default {
  name: 'poc-rule-summary-details',
  data() {
    return {
      loading: false,
      ruleSummaryDetails: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
    };
  },
  created() {
    this.fetchRuleSummaryDetails();
  },
  methods: {
    async fetchRuleSummaryDetails() {
      try {
        this.loading = true;
        const { rule, ruleResult, reportYear } = this.$route.query;
        const params = {
          rule: rule,
          rule_result: ruleResult,
          report_year: reportYear,
          page: this.pager.page,
        };
        const res = await fetchPocRuleSummaryDetails(params);
        this.ruleSummaryDetails = res.data.items;
        this.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.pager.page = page;
      this.fetchRuleSummaryDetails();
    },
    viewFileDetails(row) {
      const { pid, tree_id, name } = row.file;
      const { fid, id: qid } = row.rule_result;
      this.$router.push({
        name: 'pocDetails',
        params: { qid },
        query: {
          projectId: pid,
          treeId: tree_id,
          fileId: fid,
          fileName: name,
        },
      });
    },
    goback() {
      this.$router.push({
        name: 'pocRuleSummary',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.compliance-rule-summary {
  padding: 20px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  ::v-deep .el-table {
    th {
      background: #f6f7fb;
    }
    td {
      padding: 20px 0;
    }
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
