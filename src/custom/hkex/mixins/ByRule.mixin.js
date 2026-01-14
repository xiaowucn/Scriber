import _ from 'lodash';
import { mapGetters } from 'vuex';
import { getGroups } from '../../../store/api/hkex.group.api';

export default {
  name: 'by-rule-mixin',
  data() {
    return {
      ALL: 'ALL',
      rules: [],
      rule: '',
      chart: null,
      ruleStatistics: {},
      boardTypesSelected: 'ALL',
      tableSpanMerged: [],
      exportTableByRuleDialogVisible: false,
      exportTableByYearDialogVisible: false,
      exportFinancialYears: [],
      exportRules: [],
      exportSubGroups: [],
      abortController: null, // 用于取消请求
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType']),
    chartTitle() {
      const currentCompliance = this.complianceOptions.find(
        (i) => i.value === this.complianceSelected,
      );
      return currentCompliance ? currentCompliance.text : '';
    },
  },
  methods: {
    async fetchReportYears() {
      try {
        const data = await this.$store.dispatch('hkexModule/fetchReportYears', {
          dt: this.auditType,
        });
        this.exportFinancialYears = [this.ALL].concat(_.clone(data.year));
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async fetchRules() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchRules',
          {
            dt: this.auditType,
          },
        );
        this.rules = res.data.map((item) => {
          return {
            value: item.rule,
            label: item.main_alias || item.rule,
          };
        });
        this.rule = this.rules[0].value;
        this.exportRules = [{ label: this.ALL, value: this.ALL }].concat(
          this.rules,
        );
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async fetchGroups() {
      try {
        const groups = await getGroups({ rule_type: this.auditType });
        const subGroups = [];
        groups
          .filter((group) => group.is_enabled)
          .forEach((group) => {
            group.children.forEach((subGroup) => {
              subGroups.push({
                name: `${group.name}_${subGroup.name}`,
                value: subGroup.id,
              });
            });
          });
        this.exportSubGroups = subGroups;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async initChart() {
      const title = this.chartTitle;
      const chartData = this.quarterSelected
        ? this.ruleStatistics[this.quarterSelected][this.complianceSelected]
        : this.ruleStatistics[this.complianceSelected];
      const xAxisData = [];
      const seriesData = [];
      this.dialogTitle = title;
      await this.$nextTick();
      if (!chartData) return;
      chartData.forEach((item) => {
        xAxisData.push(item.YEAR);
        if (this.auditType === 'qr') {
          seriesData.push(parseFloat(item[this.ALL]));
        } else {
          seriesData.push(parseFloat(item[this.boardTypesSelected]));
        }
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
      });
    },
    async changeRule() {
      this.viewType = 'overview';
      await this.fetchRuleSummary();
      if (this.isSubcategoryView) {
        this.initSubCategoryChart();
      } else {
        this.initChart();
      }
    },
    changeCompliance() {
      this.initChart();
    },
    changeBoardTypes() {
      this.initChart();
    },
    setTableSpanMerged() {
      this.tableSpanMerged = [];
      let tableSpanMergedIndex = 0;
      for (let i = 0; i < this.ruleResult.length; i++) {
        if (i === 0) {
          this.tableSpanMerged.push(1);
          tableSpanMergedIndex = 0;
        } else {
          if (this.ruleResult[i].year === this.ruleResult[i - 1].year) {
            this.tableSpanMerged[tableSpanMergedIndex] += 1;
            this.tableSpanMerged.push(0);
          } else {
            this.tableSpanMerged.push(1);
            tableSpanMergedIndex = i;
          }
        }
      }
    },
    mergeTableRows({ row, column, rowIndex, columnIndex }) {
      if (this.hasSubcategoryRule && this.isSubcategoryView) {
        if (column.property === 'year') {
          return row.mergeYear;
        }
        if (row.needMergeSubcategory && column.property === 'subCategoryName') {
          return [1, 2];
        }
        if (row.needMergeSubcategory && column.label === 'Subcategory') {
          return [0, 0];
        }
      } else if (columnIndex === 0) {
        const row = this.tableSpanMerged[rowIndex];
        const column = row > 0 ? 1 : 0;
        return [row, column];
      }
    },
    handleMultipleSelect(rules, targetForm, type) {
      if (rules.includes(this.ALL)) {
        if (rules[0] === this.ALL && rules.length > 1) {
          targetForm[type].shift();
        } else {
          targetForm[type] = [this.ALL];
        }
      }
      this.$refs.selectSubGroupsFormItem?.clearValidate();
    },
    selectSubGroups() {
      this.$refs.selectRulesFormItem?.clearValidate();
    },
    openExportTableDialog(command) {
      if (command === 'rule') {
        this.openExportTableByRuleDialog();
      } else {
        this.openExportTableByYearDialog();
      }
    },
    openExportTableByRuleDialog() {
      this.exportTableByRuleDialogVisible = true;
      this.fetchGroups();
    },
    openExportTableByYearDialog() {
      this.exportTableByYearDialogVisible = true;
    },
    closeExportTableByRuleDialog() {
      this.exportTableByRuleDialogVisible = false;
      this.exportTableByRuleForm = {
        financialYears: [],
        rules: [],
        subGroups: [],
      };
      this.abortController?.abort();
    },
    closeExportTableByYearDialog() {
      this.exportTableByYearDialogVisible = false;
      this.exportTableByYearForm = {
        financialYears: [this.ALL],
      };
      this.abortController?.abort();
    },
  },
};
