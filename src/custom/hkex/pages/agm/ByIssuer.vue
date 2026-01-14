<template>
  <div class="result-analysis-by-issuer-wrapper" v-loading="loading">
    <el-row class="issuer-header">
      <el-col :span="18">
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
          <span>Published:</span>
          <span>
            {{ formatPublishedDate(currentIssuerHeader.publish_date) }}
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
        <el-table-column label="Listing Rules" align="center">
          <el-table-column prop="rule" align="center" width="250">
            <template slot-scope="scope">
              <el-tooltip
                effect="light"
                :content="scope.row.description"
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
            <el-table-column align="center">
              <template slot="header" slot-scope="{}">
                <el-button
                  v-for="(doc, docIndex) in getDocColumns(index)"
                  :key="docIndex"
                  type="text">
                  {{ formatDateTime(doc.publish_date) }}
                </el-button>
              </template>
              <template slot-scope="scope">
                <span
                  v-for="(doc, docIndex) in scope.row.records[index].docs"
                  :key="docIndex"
                  :class="doc.cmp_value === 'Non-Compliant' ? 'cell-red' : ''">
                  {{ doc.cmp_value || '-' }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import ByIssuerMixin from '../../mixins/ByIssuer.mixin';
import ReportTypeMixin from '../../mixins/ReportType.mixin';
import ByIssuerHeaderCompanyName from '../../components/ByIssuerHeaderCompanyName.vue';
import { fetchAgmIssuer, fetchPollIssuer } from '@/store/api/hkex.api';

export default {
  name: 'result-analysis-by-issuer',
  components: { ByIssuerHeaderCompanyName },
  mixins: [ByIssuerMixin, ReportTypeMixin],
  data() {
    return {
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
    };
  },
  computed: {
    recordColumns() {
      if (this.currentIssuerBody.items[0]) {
        return this.currentIssuerBody.items[0].records.map(
          (item) => item.calendar_year,
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
      await this.getIssuer();
      this.getRules();
      this.initChart();
    },
    async getIssuer() {
      try {
        this.loading = true;

        const fetchFunc = (params) => {
          if (this.isAgmReport) {
            return fetchAgmIssuer(params);
          }
          if (this.isPollReport) {
            return fetchPollIssuer(params);
          }
        };

        const res = await fetchFunc({ stock_code: this.stockCode });

        this.issuerHeader = [res.header];
        this.issuerBody = [
          {
            items: res.body,
            statistics: this.convertChartData(res.chart),
          },
        ];

        this.setDefaultCompanyName();
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
    convertChartData(chartData) {
      const statistics = [];

      if (
        !chartData ||
        !chartData.c_stats ||
        !chartData.nc_stats ||
        chartData.c_stats.length !== chartData.nc_stats.length
      ) {
        return [];
      }

      for (let i = 0; i < chartData.c_stats.length; i++) {
        const cStat = chartData.c_stats[i];
        const ncStat = chartData.nc_stats[i];

        statistics.push({
          'potential non-compliance': ncStat.percentage,
          compliance: cStat.percentage,
          year: cStat.calendar_year,
        });
      }

      return statistics;
    },
    getDocColumns(index) {
      return this.currentIssuerBody.items[0]?.records[index].docs || [];
    },
    async changeStockCode(stockCode) {
      this.stockCode = stockCode.padStart(5, '0');
      await this.getIssuer();
      this.initChart();
    },
    formatPublishedDate(date) {
      return date?.split('T')[0];
    },
    formatDateTime(datetime) {
      const dateStr = datetime?.split('T')[0].split('-');
      const timeStr = datetime?.split('T')[1].split(':');
      const date = `${dateStr[1]}-${dateStr[2]}`;
      const time = `${timeStr[0]}:${timeStr[1]}`;
      return `${date} ${time}`;
    },
  },
};
</script>
