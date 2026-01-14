<template>
  <div class="result-analysis-by-issuer-wrapper" v-loading="loading">
    <el-row class="issuer-header">
      <el-col :span="10">
        <div class="header-item">
          <by-issuer-header-company-name
            :issuer-header="issuerHeader"
            @change-company-name="
              changeCompanyName
            "></by-issuer-header-company-name>
        </div>
        <div class="header-item">
          <span>Stock Code: </span>
          <el-input
            v-model="stockCode"
            size="mini"
            @change="changeStockCode"></el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header-item">
          <span>Date of Listing:</span>
          <span>{{ currentIssuerHeader.date_of_listing }}</span>
        </div>
        <div class="header-item">
          <span>Financial Year-end:</span>
          <span>{{ currentIssuerHeader.financial_year_end }}</span>
        </div>
        <div class="header-item">
          <span>Last AR:</span>
          <span>{{ currentIssuerHeader.last_ar }}</span>
        </div>
      </el-col>
      <el-col :span="8" class="year-average-content">
        <div class="header-item">
          <el-select
            v-model="yearCount"
            size="mini"
            placeholder="Please select">
            <el-option
              v-for="(item, index) in yearCounts"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <span>- Year Average Compliance Score: </span>
          <span>{{ averageScore }}</span>
        </div>
        <span
          v-for="(item, index) in currentIssuerHeader.compliance_score"
          :key="index">
          <span>{{ item.year }}:</span>
          <span>{{ item.score | conversionPercet }}</span>
        </span>
      </el-col>
    </el-row>
    <div class="chart-container">
      <div class="filter-selectors">
        <el-select
          v-model="complianceSelected"
          size="mini"
          placeholder="请选择"
          @change="changeCompliance">
          <el-option
            v-for="item in complianceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="chart" ref="chart"></div>
      <div class="export-btns">
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable"
          ><i class="fas fa-download"></i>Export Table</el-button
        >
      </div>
    </div>
    <div class="issuer-table">
      <el-table
        :data="currentIssuerBody.items"
        tooltip-effect="dark"
        stripe
        @header-click="handleTableHeaderClicked">
        <el-table-column label="Listing Rules" align="center">
          <el-table-column prop="rule" align="center" width="250">
            <template slot-scope="scope">
              <el-tooltip
                effect="light"
                :content="scope.row.rule_desc"
                placement="right"
                popper-class="hkex-tooltip-popper">
                <span>{{ scope.row.main_alias }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table-column>
        <template v-if="currentIssuerBody.items">
          <el-table-column
            v-for="(item, index) in recordColumns"
            :label="item"
            align="center"
            :key="`${stockCode}-${index}`"
            class-name="thead-cell">
            <template slot-scope="scope">
              <div
                :class="
                  scope.row.records[index].compliance === 'Non-Compliant'
                    ? 'cell-red'
                    : ''
                ">
                {{ scope.row.records[index].compliance }}
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import ByIssuerMixin from '../../mixins/ByIssuer.mixin';
import ByIssuerHeaderCompanyName from '../../components/ByIssuerHeaderCompanyName';

export default {
  name: 'result-analysis-by-issuer',
  components: { ByIssuerHeaderCompanyName },
  mixins: [ByIssuerMixin],
  data() {
    return {
      yearCount: 1,
      complianceOptions: [
        {
          value: 'compliance',
          label: '% Compliance',
          text: '% No. of Compliance',
        },
        {
          value: 'potential non-compliance',
          label: '% Non-Compliance',
          text: '% No. of Non-Compliance',
        },
      ],
      complianceSelected: 'compliance',
      exportLoading: false,
    };
  },
  computed: {
    yearCounts() {
      if (Object.keys(this.currentIssuerHeader).length > 0) {
        let yearLength = this.currentIssuerHeader.compliance_score.length;
        return _.range(1, yearLength + 1);
      }

      return 0;
    },
    averageScore() {
      if (Object.keys(this.currentIssuerHeader).length > 0) {
        let allScore = this.currentIssuerHeader.compliance_score.map(
          (item) => item.score,
        );
        let yearScore = allScore.slice(0, this.yearCount);
        let scoreSum = _.sum(yearScore);
        if (scoreSum === 0) {
          return '0%';
        } else {
          let average = scoreSum / this.yearCount;
          return Math.round(average * 100) + '%';
        }
      }

      return 0;
    },
    recordColumns() {
      if (this.currentIssuerBody.items[0]) {
        return this.currentIssuerBody.items[0].records.map(
          (item) => item.report_year,
        );
      }

      return [];
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      const res = await this.fetchIssuerHeader();
      if (res) {
        await this.fetchIssuerBody();
      } else {
        this.loading = false;
      }
      this.getRules();
      this.initChart();
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-table {
  thead {
    tr:last-child {
      display: none;
    }
  }
}
</style>
