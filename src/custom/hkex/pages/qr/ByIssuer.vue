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
            @change="changeStockCode"></el-input>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="header-item">
          <span>Publish time:</span>
          <span>{{ currentIssuerHeader.date_of_listing }}</span>
        </div>
        <div class="header-item">
          <span>Financial Year-end:</span>
          <span>{{ currentIssuerHeader.financial_year_end }}</span>
        </div>
      </el-col>
    </el-row>
    <div class="chart-container">
      <div class="filter-selectors">
        <el-select
          v-model="complianceSelected"
          size="mini"
          placeholder="Please Select"
          @change="initChart">
          <el-option
            v-for="item in complianceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-select
          v-model="quarterSelected"
          size="mini"
          placeholder="Please select"
          @change="initChart">
          <el-option
            v-for="quarter in quarters"
            :key="quarter"
            :label="quarter"
            :value="quarter"></el-option>
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
      <el-table :data="currentIssuerBody.items" tooltip-effect="dark" stripe>
        <el-table-column label="Listing Rules" align="center">
          <el-table-column prop="main_alias" align="center" width="250">
          </el-table-column>
        </el-table-column>
        <template>
          <el-table-column
            v-for="(item, index) in recordColumns"
            :label="item"
            align="center"
            :key="`${stockCode}-${index}`">
            <el-table-column align="center" min-width="300px">
              <template slot="header" slot-scope="{}">
                <el-button
                  v-for="(quarter, quarterIndex) in quarters"
                  :key="quarterIndex"
                  type="text">
                  {{ quarter }}
                </el-button>
              </template>
              <template slot-scope="scope">
                <span
                  v-for="(quarter, quarterIndex) in quarters"
                  :key="quarterIndex"
                  :class="
                    getComplianceValue(
                      scope.row.records[index].compliance,
                      quarter,
                    ) === 'Non-Compliant'
                      ? 'non'
                      : ''
                  ">
                  {{
                    getComplianceValue(
                      scope.row.records[index].compliance,
                      quarter,
                    )
                  }}
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
import _ from 'lodash';
import ByIssuerMixin from '../../mixins/ByIssuer.mixin';
import ByIssuerHeaderCompanyName from '../../components/ByIssuerHeaderCompanyName';

export default {
  name: 'results-announcement-analysis-by-issuer',
  components: { ByIssuerHeaderCompanyName },
  mixins: [ByIssuerMixin],
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
      quarterSelected: '',
      exportLoading: false,
    };
  },
  computed: {
    quarters() {
      if (_.isEmpty(this.currentIssuerBody.statistics)) {
        return [];
      }
      return Object.keys(this.currentIssuerBody.statistics);
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
      this.initChart();
    },
    async fetchIssuerBody() {
      try {
        this.loading = true;
        const res = await this.$store.dispatch(
          'hkexModule/issuerModule/fetchResultsAnnouncementAnalysisByIssuer',
          {
            stockCode: this.stockCode,
          },
        );
        this.issuerBody = res.data;
        this.quarterSelected = Object.keys(this.issuerBody[0].statistics)[0];
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
    getComplianceValue(quarters, targetQuarter) {
      const quarterCompliance = quarters.find(
        (i) => Object.keys(i)[0] === targetQuarter,
      );
      if (quarterCompliance) {
        return quarterCompliance[targetQuarter];
      }
      return '-';
    },
  },
};
</script>
