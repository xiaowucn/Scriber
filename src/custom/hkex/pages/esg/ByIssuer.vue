<template>
  <div class="result-analysis-by-issuer-wrapper" v-loading="loading">
    <el-row class="issuer-header">
      <el-col :span="12">
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
            class="stockcode-input"
            @change="changeStockCode"></el-input>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="header-item">
          <span>Date of ESG Report:</span>
          <span class="date-value">
            {{ currentIssuerHeader.date_of_listing }}
          </span>
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
        <el-table-column prop="rule" label="Listing Rules" align="center">
          <el-table-column prop="rule" align="center" width="300">
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
        <template v-if="currentIssuerBody.items.length > 0">
          <el-table-column
            v-for="(item, index) in currentIssuerBody.items[0].records"
            :label="item.report_year"
            align="center"
            :key="index"
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
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { fetchEsgIssuerSummary } from '@/store/api/hkex.issuer.api';
import ByIssuerMixin from '../../mixins/ByIssuer.mixin';
import ByIssuerHeaderCompanyName from '../../components/ByIssuerHeaderCompanyName';

export default {
  name: 'esg-report-checking-analysis-by-issuer',
  components: { ByIssuerHeaderCompanyName },
  mixins: [ByIssuerMixin],
  data() {
    return {
      complianceSelected: 'Comply',
      issuerData: [],
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    complianceOptions() {
      const list = [
        {
          value: 'Comply',
          label: '% Comply',
          text: '% No. of Comply',
        },
        {
          value: 'Explain',
          label: '% Explain',
          text: '% No. of Explain',
        },
        {
          value: 'No Disclosure',
          label: '% No-Disclosure',
          text: '% No. of No-Disclosure',
        },
        {
          value: 'Query',
          label: '% Query',
          text: '% No. of Query',
        },
      ];
      return list;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      await this.getIssuerSummary();
      this.initChart();
      this.getRules();
    },
    async getIssuerSummary() {
      try {
        this.loading = true;
        if (this.stockCode !== '') {
          this.stockCode = this.stockCode.padStart(5, '0');
        } else {
          this.stockCode = '00001';
        }
        const { data } = await fetchEsgIssuerSummary(this.stockCode);
        this.issuerData = data;
        const issuerHeader = [];
        const issuerBody = [];
        if (!_.isEmpty(this.issuerData)) {
          this.issuerData.forEach((item) => {
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
        this.currentCompanyName =
          this.issuerData.length > 0 ? this.issuerData[0].company_name : '';
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
