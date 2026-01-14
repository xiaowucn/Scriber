import _ from 'lodash';
import { mapGetters } from 'vuex';
import { downloadFileByBlob } from '@/utils';
import { fetchAgmDocs, fetchPollDocs } from '@/store/api/hkex.api';
import { hkexReportType } from '@/store/constants';

export default {
  name: 'by-issuer-mixin',
  data() {
    return {
      loading: false,
      exportLoading: false,
      issuerHeader: [],
      issuerBody: [],
      currentCompanyName: '',
      stockCode: '00001',
      chart: null,
      rules: [],
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType']),
    currentIssuerHeader() {
      if (!_.isEmpty(this.issuerHeader)) {
        return (
          this.issuerHeader.find(
            (i) => i.company_name === this.currentCompanyName,
          ) || {}
        );
      }
      return {};
    },
    currentIssuerBody() {
      const emptyData = {
        items: [],
        statistics: {},
      };
      if (!_.isEmpty(this.issuerBody)) {
        return (
          this.issuerBody.find((i) => {
            if (!i.company_name) {
              return false;
            }
            return i.company_name === this.currentCompanyName;
          }) || this.issuerBody[0]
        );
      }
      return emptyData;
    },
    chartTitle() {
      const currentCompliance = this.complianceOptions.find(
        (i) => i.value === this.complianceSelected,
      );
      return currentCompliance ? currentCompliance.text : '';
    },
  },
  methods: {
    async fetchIssuerHeader() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/issuerModule/fetchIssuerHeader',
          {
            stockCode: this.stockCode.padStart(5, '0'),
            dt: this.auditType,
          },
        );
        this.issuerHeader = res.data;
        this.setDefaultCompanyName();
        this.stockCode = this.currentIssuerHeader.stock_code;
        return res;
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },

    async fetchIssuerBody() {
      try {
        this.loading = true;
        const res = await this.$store.dispatch(
          'hkexModule/issuerModule/fetchIssuerBody',
          {
            stockCode: this.stockCode,
          },
        );
        this.issuerBody = res.data;
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

    async getRules() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchRules',
          {
            dt: this.auditType,
          },
        );
        this.rules = res.data;
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },

    async initChart() {
      const title = this.chartTitle;
      const chartData = this.quarterSelected
        ? this.currentIssuerBody.statistics[this.quarterSelected]
        : this.currentIssuerBody.statistics;
      const xAxisData = [];
      const seriesData = [];
      this.dialogTitle = title;
      await this.$nextTick();
      if (!chartData) return;
      chartData.forEach((item) => {
        xAxisData.push(item.year);
        seriesData.push(parseFloat(item[this.complianceSelected]));
      });
      this.chart = this.$echarts.init(this.$refs['chart']);
      this.chart.clear();
      this.chart.setOption({
        color: ['#5287e1', '#369aa2'],
        tooltip: {
          formatter: '{c}%',
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%',
          },
          min: 0,
          max: 100,
        },
        legend: {
          top: 20,
          data: [title],
        },
        series: [
          {
            name: title,
            type: 'line',
            symbol: 'rect',
            symbolSize: 12,
            symbolRotate: 45,
            lineStyle: {
              width: 4,
            },
            data: seriesData,
          },
        ],
        noDataLoadingOption: {
          text: 'No data',
        },
      });
    },

    async exportTable() {
      try {
        this.exportLoading = true;
        const res = await this.$store.dispatch(
          'hkexModule/issuerModule/exportIssuer',
          {
            stockCode: this.stockCode,
            params: {
              dt: this.auditType,
              delist: this.currentIssuerHeader.delist,
            },
          },
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

    handleTableHeaderClicked(row) {
      const reviewRouteName =
        hkexReportType[this.auditType].reportReviewRouterName;
      const defaultRuleName = this.rules[0].rule;
      this.jumpToReportReviewPage(row.label, reviewRouteName, defaultRuleName);
    },

    async jumpToReportReviewPage(reportYear, reviewRouteName, defaultRuleName) {
      try {
        let res = {};
        if (this.isAgmReport || this.isPollReport) {
          const data = await this.getDocs({
            stock_code: this.currentIssuerHeader.stock_code,
            calendar_year: reportYear,
          });
          res = { data: data };
        } else {
          const params = {
            reportYear: reportYear,
            stockCode: this.currentIssuerHeader.stock_code,
            dt: this.auditType,
          };
          res = await this.$store.dispatch(
            'hkexModule/reportReviewModule/fetchQuestionMetaByQuery',
            params,
          );
        }
        if (!res.data) {
          return;
        }
        if (res.data?.length === 0) {
          this.$alert('No corresponding esg report', 'tip', {
            confirmButtonText: 'OK',
            customClass: 'hkex-message-box',
          });
        } else {
          const { file_id, fid, question_id, qid, mold_id } = res.data[0];
          let routeParams = {
            name: reviewRouteName,
            params: { qid: question_id || qid },
            query: {
              fileId: file_id || fid,
              schemaId: mold_id,
              rule: defaultRuleName,
            },
          };
          this.$router.push(routeParams);
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },

    async getDocs(params) {
      try {
        const fetchDocsFunc = (params) => {
          if (this.isAgmReport) {
            return fetchAgmDocs(params);
          }
          if (this.isPollReport) {
            return fetchPollDocs(params);
          }
        };
        const res = await fetchDocsFunc(params);
        return res;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },

    setDefaultCompanyName() {
      this.currentCompanyName =
        this.issuerHeader.length > 0 ? this.issuerHeader[0].company_name : '';
    },

    changeCompanyName(name) {
      this.currentCompanyName = name;
      if (this.yearCount) {
        this.yearCount = 1;
      }
      this.initChart();
    },

    changeStockCode() {
      if (this.yearCount) {
        this.yearCount = 1;
      }
      this.init();
    },

    changeCompliance() {
      this.initChart();
    },
  },
};
