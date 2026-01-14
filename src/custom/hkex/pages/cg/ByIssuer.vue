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
      <el-col :span="12">
        <div class="header-item">
          <span>Date of Annual Report:</span>
          <span> {{ currentIssuerHeader.date_of_listing }}</span>
        </div>
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
                <span>{{ scope.row.rule }}</span>
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
                  scope.row.records[index].compliance === 'No Disclosure'
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
import { fetchCgIssuerSummary } from '@/store/api/hkex.issuer.api';

export default {
  name: 'result-analysis-by-issuer',
  components: { ByIssuerHeaderCompanyName },
  mixins: [ByIssuerMixin],
  data() {
    return {
      complianceOptions: [
        {
          value: 'Comply',
          label: '% Comply',
          text: '% No. of Comply',
        },
        {
          value: 'No Disclosure',
          label: '% No Disclosure',
          text: '% No. of No Disclosure',
        },
        {
          value: 'N/A',
          label: '% N/A',
          text: '% No. of N/A',
        },
      ],
      complianceSelected: 'Comply',
    };
  },
  computed: {
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
      await this.getIssuerSummary();
      this.getRules();
      this.initChart();
    },
    async getIssuerSummary() {
      try {
        this.loading = true;
        this.stockCode = this.stockCode.padStart(5, '0');
        const data = await fetchCgIssuerSummary({
          stock_code: this.stockCode,
        });
        const issuerHeader = [];
        const issuerBody = [];
        if (!_.isEmpty(data)) {
          data.forEach((item) => {
            issuerHeader.push({
              ...item.header,
            });
            issuerBody.push({
              ...item.body,
            });
          });
        }
        this.issuerHeader = issuerHeader;
        this.issuerBody = issuerBody;
        this.currentCompanyName = data?.[0].company_name || '';
        this.stockCode = this.currentIssuerHeader.stock_code;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
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
