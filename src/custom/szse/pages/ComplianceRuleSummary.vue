<template>
  <div class="compliance-rule-summary" v-loading="loading">
    <div class="banner">
      <el-select
        v-model="search.report_year"
        size="small"
        placeholder=""
        @change="handleSelectChange">
        <el-option
          v-for="item in reportYears"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-table :data="ruleSummaryList">
      <el-table-column
        prop="rule_name"
        label="规则"
        width="600"></el-table-column>
      <el-table-column prop="compliance_count" label="合规公司" align="center">
        <template slot-scope="scope">
          <span
            >{{ scope.row.compliance_count }}/{{ scope.row.total_count }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="non_compliance_count"
        label="不合规公司"
        align="center">
        <template slot-scope="scope">
          <span
            >{{ scope.row.non_compliance_count }}/{{
              scope.row.total_count
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="score" label="合规占比" align="center">
        <template slot-scope="scope">
          <span>{{
            (scope.row.compliance_count / scope.row.total_count)
              | conversionPercet
          }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchComplianceRuleSummary } from '@/store/api/rule-check.api';

export default {
  name: 'compliance-rule-summary',
  data() {
    return {
      loading: false,
      ruleSummaryList: [],
      reportYears: [
        {
          label: '2019',
          value: '2019',
        },
      ],
      search: {
        report_year: '2019',
      },
    };
  },
  created() {
    this.fetchRuleSummary();
  },
  methods: {
    async fetchRuleSummary() {
      try {
        this.loading = true;
        const params = Object.assign({}, this.search);
        const res = await fetchComplianceRuleSummary(params);
        this.ruleSummaryList = res.data;
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
    handleSelectChange(reportYear) {
      this.search.report_year = reportYear;
      this.fetchRuleSummary();
    },
  },
};
</script>

<style lang="scss" scoped>
.compliance-rule-summary {
  padding: 20px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .el-form {
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
  ::v-deep .el-table {
    th {
      background: #f6f7fb;
    }
    td {
      padding: 20px 0;
    }
    .cell {
      .name {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
