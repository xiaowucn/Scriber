<template>
  <div class="summary-statistics-wrapper" v-loading="isLoading">
    <div class="summary-top">
      <div>
        <div class="title">
          <span>Issuer Compliance & Model Accuracy</span>
          <el-select
            v-model="selectedReportYears"
            multiple
            collapse-tags
            size="mini"
            placeholder="Please select"
            @change="changeYears">
            <el-option
              v-for="(item, index) in reportYears"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="overall-score-wrapper">
          Overall Identification Score:
          <span>{{ modelAccuracyData.overall_identification_score }}</span>
          Overall Assessment Score:
          <span>{{ modelAccuracyData.overall_assessment_score }}</span>
        </div>
      </div>
      <div class="btns">
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable">
          <i class="fas fa-download"></i>
          Export Table
        </el-button>
      </div>
    </div>
    <el-table stripe :data="modelAccuracyData.items">
      <el-table-column align="center" label="Listing Rules">
        <el-table-column
          prop="rule"
          align="center"
          min-width="100px"
          label="Jura reference no.">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.rule_desc"
              placement="right"
              popper-class="hkex-tooltip-popper">
              <span
                class="rule-name"
                @click="openSummaryByRuleDialog(scope.row.rule)"
                >{{ scope.row.rule }}</span
              >
            </el-tooltip>
          </template>
        </el-table-column>
        <template v-if="modelAccuracyData.items">
          <el-table-column
            v-for="(item, index) in modelAccuracyData.items[0].rule_referenced"
            align="center"
            min-width="100px"
            :key="index"
            :label="index === 0 ? 'Main board rule no.' : 'GEM board rule no.'">
            <template slot-scope="scope">
              {{ scope.row.rule_referenced[index] }}
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column label="Issuer Compliance Score" align="center">
        <el-table-column
          label="AI Suggestion"
          prop="ai_suggestion"
          align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="Model Performance" align="center">
        <el-table-column align="center" label="Location Identification">
          <el-table-column
            align="center"
            min-width="60px"
            label="Recall"
            prop="location_identification_recall"
            :render-header="renderRecallTableColumnHeader"></el-table-column>
          <el-table-column
            align="center"
            min-width="60px"
            label="Precision"
            prop="location_identification_precision"
            :render-header="renderPrecisionTableColumnHeader"></el-table-column>
        </el-table-column>
        <el-table-column
          align="center"
          label="Compliance Assessment"
          prop="compliance_assessment_recall">
          <el-table-column
            align="center"
            min-width="60px"
            label="Recall"
            prop="compliance_assessment_recall"
            :render-header="renderRecallTableColumnHeader"></el-table-column>
          <el-table-column
            align="center"
            min-width="60px"
            label="Precision"
            prop="compliance_assessment_precision"
            :render-header="renderPrecisionTableColumnHeader"></el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="currentRule"
      :visible.sync="statisticsByRuleDialogVisible"
      width="90%"
      custom-class="popup-table"
      :close-on-click-modal="false">
      <el-table :data="statisticsByRuleData" class="popup-table">
        <el-table-column prop="date" label="Date" align="center">
        </el-table-column>
        <el-table-column
          label="AI Suggestion"
          prop="ai_suggestion"
          align="center">
        </el-table-column>
        <el-table-column
          label="with Manual Adjustment"
          prop="with_manual_adjustment"
          align="center">
        </el-table-column>
        <el-table-column align="center" label="Location Identification">
          <el-table-column
            align="center"
            min-width="60px"
            label="Recall"
            prop="location_identification_recall"></el-table-column>
          <el-table-column
            align="center"
            min-width="60px"
            label="Precision"
            prop="location_identification_precision"></el-table-column>
        </el-table-column>
        <el-table-column
          align="center"
          label="Compliance Assessment"
          prop="compliance_assessment_recall">
          <el-table-column
            align="center"
            min-width="60px"
            label="Recall"
            prop="compliance_assessment_recall"></el-table-column>
          <el-table-column
            align="center"
            min-width="60px"
            label="Precision"
            prop="compliance_assessment_precision"></el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { downloadFileByBlob } from '@/utils';
import { hkexSummaryStatistics as summaryStatisticsApi } from '@/store/api';

export default {
  name: 'summary-statistics',
  data() {
    return {
      isLoading: false,
      reportYears: [],
      selectedReportYears: [],
      reportYearsQuery: '',
      exportLoading: false,
      currentRule: '',
      statisticsByRuleDialogVisible: false,
      statisticsByRuleData: [],
      modelAccuracyData: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.fetchReportYears();
      this.fetchModelAccuracy();
    },
    async fetchModelAccuracy() {
      try {
        this.isLoading = true;
        const res = await summaryStatisticsApi.fetchModelAccuracyScore(
          this.reportYearsQuery,
        );
        this.modelAccuracyData = res.data;
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async fetchReportYears() {
      try {
        const data = await this.$store.dispatch('hkexModule/fetchReportYears');
        this.reportYears = _.clone(data.year);
        this.selectedReportYears = this.reportYears;
        this.setReportYearsQuery();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message || 'Failed to get summary condition data.',
          type: 'error',
        });
      }
    },
    setReportYearsQuery() {
      this.reportYearsQuery = '';
      this.selectedReportYears.forEach((year) => {
        this.reportYearsQuery += `&report_years=${year}`;
      });
      this.reportYearsQuery = this.reportYearsQuery.replace(/^&/, '');
    },
    changeYears() {
      this.setReportYearsQuery();
      this.fetchModelAccuracy();
    },
    async exportTable() {
      try {
        this.exportLoading = true;
        const res = await summaryStatisticsApi.exportTable(
          this.reportYearsQuery,
        );
        await downloadFileByBlob(res);
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.exportLoading = false;
      }
    },
    renderRecallTableColumnHeader() {
      return (
        <el-tooltip
          content="Recall = True Positives / (True Positives + False Negatives)"
          effect="light"
          placement="top"
          popper-class="hkex-summary-table-header-popover">
          <span>Recall</span>
        </el-tooltip>
      );
    },
    renderPrecisionTableColumnHeader() {
      return (
        <el-tooltip
          content="Precision = True Positives / (True Positives + False Positives)"
          effect="light"
          placement="top"
          popper-class="hkex-summary-table-header-popover">
          <span>Precision</span>
        </el-tooltip>
      );
    },
    async openSummaryByRuleDialog(rule) {
      this.currentRule = rule;
      try {
        const res = await summaryStatisticsApi.fetchSummaryHistoryByRule(
          rule,
          this.reportYearsQuery,
        );
        if (res.data.length > 0) {
          this.statisticsByRuleDialogVisible = true;
          this.statisticsByRuleData = res.data;
        }
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../common/hkex-global.scss';
.summary-statistics-wrapper {
  padding: 15px;
  .summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 16px;
      span {
        margin-right: 30px;
      }
    }
    ::v-deep .el-select {
      width: 130px;
    }
    .overall-score-wrapper {
      margin: 10px 0 20px 0;
      font-size: 14px;
      span {
        margin: 0 30px 0 5px;
        color: $--color-primary;
      }
    }
  }
  .rule-name {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: $--color-primary;
    }
  }
  ::v-deep .el-table {
    thead {
      tr:nth-of-type(2),
      tr:nth-of-type(3) {
        th {
          .cell {
            color: $--color-grey;
          }
        }
      }
    }
  }
  ::v-deep .popup-table {
    .el-dialog__close {
      padding: 2px;
      background: $--color-primary;
      color: $--color-white;
      &:hover {
        opacity: 0.9;
      }
    }
    thead {
      &.is-group {
        th {
          background: $--color-grey-light;
          .cell {
            color: $--color-grey;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import '../common/reset-element.scss';

.hkex-summary-table-header-popover {
  font-weight: bold;
}
</style>
