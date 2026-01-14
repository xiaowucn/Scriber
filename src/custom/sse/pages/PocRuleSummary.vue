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
      <el-table-column prop="rule_name" label="规则"></el-table-column>
      <el-table-column
        v-for="(item, index) in auditStatusOptions"
        :key="index"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="viewSummaryDetails(scope.row, item.value)"
            >{{ scope.row[item.key] }}/{{ scope.row.total_count }}
            <i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import projectListMixin from '../mixins/projectListMixin';
import {
  fetchPocRuleSummary,
  fetchPocAuditStatusMap,
} from '@/store/api/sse.api';

export default {
  name: 'poc-rule-summary',
  mixins: [projectListMixin],
  data() {
    return {
      loading: false,
      ruleSummaryList: [],
      search: {
        report_year: '2020',
      },
      RULE_COMPLIANCE_STATUS: {
        合规: 0,
        不合规: 1,
        待确认: 3,
      },
      auditStatusOptions: [],
    };
  },
  created() {
    this.getAuditStatusMap();
    this.fetchRuleSummary();
  },
  methods: {
    async fetchRuleSummary() {
      try {
        this.loading = true;
        const params = Object.assign({}, this.search);
        const res = await fetchPocRuleSummary(params);
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
    async getAuditStatusMap() {
      const res = await fetchPocAuditStatusMap();
      this.auditStatusOptions = res.data;
    },
    handleSelectChange(reportYear) {
      this.search.report_year = reportYear;
      this.fetchRuleSummary();
    },
    viewSummaryDetails(row, ruleResult) {
      this.$router.push({
        name: 'pocRuleSummaryDetails',
        query: {
          reportYear: this.search.report_year,
          ruleResult: ruleResult,
          rule: row.rule_name,
        },
      });
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
  ::v-deep .el-table {
    th {
      background: #f6f7fb;
    }
    td {
      padding: 20px 0;
      .el-icon--right {
        margin: 0;
      }
    }
  }
}
</style>
