<template>
  <div class="result-analysis-by-rule-wrapper" v-loading="isLoading">
    <div class="content">
      <div class="rule-detail-wrapper">
        <div class="rule-header">
          <div class="header-item">
            <span>Rule #:</span>
            <el-select
              v-model="rule"
              size="mini"
              filterable
              placeholder="Please select or search"
              popper-class="rule-selector"
              style="width: 400px"
              @change="changeRule">
              <el-option
                v-for="(item, index) in rules"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="export-btns">
            <el-dropdown @command="openExportTableDialog">
              <el-button class="button-hkex">
                <i class="fas fa-download"></i>
                <span>Export Table</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="rule">
                  Export by selection rule(s)
                </el-dropdown-item>
                <el-dropdown-item command="year">
                  Export all by year(s)
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="legends-content" v-if="hasSubcategoryRule && isSubcategoryView">
      <el-button type="text" @click="handleSelectAll" class="select-all">
        Select All
      </el-button>
      <el-button type="text" @click="handleClearAll" class="clear-all">
        Clear All
      </el-button>
      <el-button
        v-for="(legend, index) in legends"
        :key="legend.key"
        size="mini"
        class="legend-item"
        :class="legend.value ? 'highlight' : 'dark'"
        :style="{
          color: legendColors[index],
          backgroundColor: legendBackgroundColors[index],
          borderColor: legendColors[index],
        }"
        @click="handleLegendClick(legend.key)">
        {{ legend.key }}
      </el-button>
    </div>
    <div class="chart-container">
      <div class="filter-selectors" v-if="!isSubcategoryView">
        <el-select
          v-model="complianceSelected"
          size="mini"
          placeholder="Please select"
          @change="changeCompliance">
          <el-option
            v-for="item in complianceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-select
          v-model="boardTypesSelected"
          size="mini"
          placeholder="Please select"
          @change="changeBoardTypes">
          <el-option
            v-for="item in boardTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </div>
      <div
        class="chart"
        :class="
          hasSubcategoryRule && isSubcategoryView ? 'subcategory-chart' : ''
        "
        ref="chart"></div>
    </div>
    <el-radio-group
      v-if="hasSubcategoryRule"
      v-model="viewType"
      size="mini"
      class="view-type-radio"
      @change="changeViewTypeChanged">
      <el-radio-button label="overview">Overview</el-radio-button>
      <el-radio-button label="subcategory">Subcategory</el-radio-button>
    </el-radio-group>
    <el-table
      v-if="!isLoading"
      :data="ruleResult"
      :span-method="mergeTableRows"
      :header-cell-style="mergeHeaderCells"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe>
      <el-table-column
        prop="year"
        label
        fixed
        align="center"
        width="180"></el-table-column>
      <el-table-column
        prop="name"
        fixed
        label
        align="center"
        width="240"></el-table-column>
      <el-table-column
        prop="total"
        label="Total"
        align="center"></el-table-column>
      <el-table-column
        v-if="hasSubcategoryRule && isSubcategoryView"
        prop="subCategoryName"
        label="Subcategory"
        align="center"></el-table-column>
      <el-table-column
        v-if="hasSubcategoryRule && isSubcategoryView"
        prop="totalSubCategory"
        label="Subcategory"
        align="center"></el-table-column>
      <el-table-column
        prop="mb"
        label="Main Board"
        align="center"></el-table-column>
      <el-table-column
        v-if="hasSubcategoryRule && isSubcategoryView"
        prop="subCategoryName"
        label="Subcategory"
        align="center"></el-table-column>
      <el-table-column
        v-if="hasSubcategoryRule && isSubcategoryView"
        prop="mbSubCategory"
        label="Subcategory"
        align="center"></el-table-column>
      <el-table-column prop="gem" label="GEM" align="center"></el-table-column>
      <el-table-column
        v-if="hasSubcategoryRule && isSubcategoryView"
        prop="subCategoryName"
        label="Subcategory"
        align="center"></el-table-column>
      <el-table-column
        v-if="hasSubcategoryRule && isSubcategoryView"
        prop="gemSubCategory"
        label="Subcategory"
        align="center"></el-table-column>
    </el-table>

    <el-dialog
      v-if="exportTableByRuleDialogVisible"
      title="Export Table"
      :visible="true"
      width="500px"
      custom-class="hkex-export-dialog"
      :close-on-click-modal="false"
      @close="closeExportTableByRuleDialog">
      <el-form
        ref="exportTableByRuleForm"
        :model="exportTableByRuleForm"
        :rules="exportTableByRuleFormRules"
        label-width="150px">
        <el-form-item label="Financial Year(s)" prop="financialYears">
          <el-select
            v-model="exportTableByRuleForm.financialYears"
            size="mini"
            placeholder="Please select financial year(s)"
            multiple
            filterable
            collapse-tags
            @change="
              handleMultipleSelect(
                $event,
                exportTableByRuleForm,
                'financialYears',
              )
            ">
            <el-option
              v-for="(item, index) in exportFinancialYears"
              :key="index"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-date" label="Release Time">
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                type="date"
                size="mini"
                placeholder="Start date"
                value-format="timestamp"
                v-model="exportTableByRuleForm.releaseTimeStart"
                :picker-options="pickerStartDateOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                type="date"
                size="mini"
                placeholder="End date"
                value-format="timestamp"
                v-model="exportTableByRuleForm.releaseTimeEnd"
                :picker-options="pickerEndDateOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Issuer" required>
          <el-radio-group v-model="exportStockCodeMode">
            <el-radio label="ALL">All</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          ref="selectSubGroupsFormItem"
          label="Select Sub-Group(s)"
          :prop="exportTableByRuleForm.rules.length === 0 ? 'subGroups' : null">
          <el-select
            v-model="exportTableByRuleForm.subGroups"
            size="mini"
            placeholder="Please select sub-group(s)"
            multiple
            filterable
            collapse-tags
            :disabled="exportTableByRuleForm.rules.length > 0"
            @change="selectSubGroups">
            <el-option
              v-for="(item, index) in exportSubGroups"
              :key="index"
              :label="item.name"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          ref="selectRulesFormItem"
          label="Select Rule(s)"
          :prop="exportTableByRuleForm.subGroups.length === 0 ? 'rules' : null">
          <el-select
            v-model="exportTableByRuleForm.rules"
            size="mini"
            placeholder="Please select listing rule(s)"
            multiple
            filterable
            collapse-tags
            :disabled="exportTableByRuleForm.subGroups.length > 0"
            @change="
              handleMultipleSelect($event, exportTableByRuleForm, 'rules')
            ">
            <el-option
              v-for="(rule, index) in exportRules"
              :key="index"
              :label="rule.label"
              :value="rule.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeExportTableByRuleDialog">Cancel</el-button>
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable('rule')"
          >Export</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      v-if="exportTableByYearDialogVisible"
      title="Export Table"
      :visible="true"
      width="500px"
      class="hkex-export-table-by-year-dialog"
      :close-on-click-modal="false"
      @close="closeExportTableByYearDialog">
      <el-form
        ref="exportTableByYearForm"
        :model="exportTableByYearForm"
        :rules="exportTableByYearFormRules"
        label-position="top">
        <el-form-item label="Financial Year(s)" prop="financialYears">
          <el-checkbox-group
            v-model="exportTableByYearForm.financialYears"
            @change="
              handleMultipleSelect(
                $event,
                exportTableByYearForm,
                'financialYears',
              )
            ">
            <el-checkbox-button
              v-for="(year, index) in exportFinancialYears"
              :key="index"
              :label="year"
              :value="year">
              {{ year }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeExportTableByYearDialog">Cancel</el-button>
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable('year')">
          Export
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { downloadFileByPolling } from '@/utils';
import { endTimestampOffset } from '@/store/constants';
import {
  fetchEsgRuleSummary,
  fetchEsgSubcategories,
} from '@/store/api/hkex.rule.api';
import ByRuleMixin from '../../mixins/ByRule.mixin';

export default {
  name: 'esg-report-checking-analysis-by-rule',
  mixins: [ByRuleMixin],
  data() {
    return {
      isLoading: false,
      complianceOptions: [],
      boardTypes: [
        {
          value: 'ALL',
          label: 'ALL',
        },
        {
          value: 'MB',
          label: 'Main Board',
        },
        {
          value: 'GEM',
          label: 'GEM',
        },
      ],
      complianceSelected: 'Comply',
      ruleResult: [],
      exportStockCodeMode: 'ALL',
      exportTableByRuleForm: {
        financialYears: [],
        releaseTimeStart: '',
        releaseTimeEnd: '',
        issuer: '',
        rules: [],
        subGroups: [],
      },
      exportTableByYearForm: {
        financialYears: ['ALL'],
      },
      exportTableByRuleFormRules: {
        financialYears: [
          { required: true, message: 'Please select financial year(s)' },
        ],
        rules: [{ required: true, message: 'Please select listing rule(s)' }],
        subGroups: [{ required: true, message: 'Please select sub-group(s)' }],
      },
      exportTableByYearFormRules: {
        financialYears: [
          { required: true, message: 'Please select financial year(s)' },
        ],
      },
      pickerStartDateOptions: {
        disabledDate: (time) => {
          const endTime = new Date(
            this.exportTableByRuleForm.releaseTimeEnd,
          ).getTime();
          return (
            time.getTime() > endTime || time.getTime() > new Date().getTime()
          );
        },
      },
      pickerEndDateOptions: {
        disabledDate: (time) => {
          const startTime = new Date(
            this.exportTableByRuleForm.releaseTimeStart,
          ).getTime();
          return (
            time.getTime() < startTime || time.getTime() > new Date().getTime()
          );
        },
      },
      exportLoading: false,
      viewType: 'overview',
      legends: [],
      legendColors: [
        '#826af9',
        '#ff6c40',
        '#2D99FF',
        '#91cc75',
        '#ea7ccc',
        '#fac858',
      ],
      legendBackgroundColors: [
        'rgba(130, 106, 249, 0.1)',
        'rgba(255, 108, 64, 0.1)',
        'rgba(45, 153, 255, 0.1)',
        'rgb(145, 204, 117, 0.1)',
        'rgb(234, 124, 204, 0.1)',
        'rgb(250, 200, 88, 0.1)',
      ],
    };
  },
  computed: {
    hasSubcategoryRule() {
      return [
        'E6-Source of scenarios',
        'E8-Categories of scope 3 emissions',
        'E9-Scope 3 emissions data by categories',
      ].includes(this.rule);
    },
    isSubcategoryView() {
      return this.viewType === 'subcategory';
    },
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener('resize', this.afterWindowResize);
  },
  beforeDestroy() {
    this.chart.dispose();
    window.removeEventListener('resize', this.afterWindowResize);
  },
  methods: {
    async init() {
      this.isLoading = true;
      await this.fetchReportYears();
      await this.fetchRules();
      await this.fetchRuleSummary();
      this.initChart();
    },
    afterWindowResize() {
      this.chart.resize({
        animation: {
          duration: 300,
        },
      });
    },
    async changeViewTypeChanged() {
      this.chart.clear();
      if (this.isSubcategoryView) {
        await this.fetchEsgSubcategories();
        this.initSubCategoryChart();
      } else {
        await this.fetchRuleSummary();
        this.initChart();
      }
      this.chart.resize();
    },
    initSubCategoryChart() {
      const selected = {};
      this.legends.forEach((legend) => {
        selected[legend.key] = legend.value;
      });
      this.chart = this.$echarts.init(this.$refs['chart'], null, {
        height: 180,
      });
      this.chart.setOption({
        color: this.legendColors,
        grid: {
          left: 30,
          right: 30,
          top: 20,
          bottom: 20,
          containLabel: true,
        },
        legend: {
          show: false,
          selected,
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let content = params[0]?.axisValue || '';
            params.forEach((param) => {
              content += `<p>${param.marker}${param.seriesName}: ${param.value}%</p>`;
            });
            return content;
          },
        },
        xAxis: {
          type: 'category',
          data: this.subcategoryNames,
          axisLabel: {
            interval: 0,
            formatter: (value) => {
              const chartWidth = this.chart.getDom().clientWidth;
              const axisNum = this.subcategoryNames.length;
              if (chartWidth / axisNum < 80) {
                return value.slice(0, 6).trim() + '\n' + value.slice(6).trim();
              }
              return value;
            },
          },
        },
        yAxis: this.getSubCategoryChartYaxis(),
        series: this.subCategoryChartSeries,
      });
    },
    getSubCategoryChartYaxis() {
      const numbers = this.subCategoryChartSeries
        .filter((item) =>
          this.legends.some(
            (legend) => item.name === legend.key && legend.value === true,
          ),
        )
        .map((item) => item.data)
        .flat(1);

      let max = Math.ceil(Math.max(...numbers) / 5) * 5;
      if (max <= 5) {
        max = 5;
      }
      return {
        axisLabel: {
          formatter: '{value}%',
        },
        min: 0,
        max,
        interval: max / 5,
      };
    },
    updateTableData() {
      this.ruleResult = this.originRuleResult.filter((item) => {
        return this.legends.find(
          (legend) => legend.value && legend.key === item.year,
        );
      });
    },
    handleSelectAll() {
      const selected = {};
      this.legends.forEach((legend) => {
        legend.value = true;
        selected[legend.key] = true;
      });
      this.chart.setOption({
        legend: {
          selected,
        },
        yAxis: this.getSubCategoryChartYaxis(),
      });
      this.updateTableData();
    },
    handleClearAll() {
      const selected = {};
      this.legends.forEach((legend) => {
        legend.value = false;
        selected[legend.key] = false;
      });
      this.chart.setOption({
        legend: {
          selected,
        },
        yAxis: this.getSubCategoryChartYaxis(),
      });
      this.updateTableData();
    },
    handleLegendClick(key) {
      const selected = {};
      this.legends.forEach((legend) => {
        if (legend.key === key) {
          legend.value = !legend.value;
        }
        selected[legend.key] = legend.value;
      });
      this.chart.setOption({
        legend: {
          selected,
        },
        yAxis: this.getSubCategoryChartYaxis(),
      });
      this.updateTableData();
    },
    mergeHeaderCells({ row, columnIndex }) {
      if (this.hasSubcategoryRule && this.isSubcategoryView) {
        row[3].colSpan = 2;
        row[4].colSpan = 0;
        row[6].colSpan = 2;
        row[7].colSpan = 0;
        row[9].colSpan = 2;
        row[10].colSpan = 0;
        if (columnIndex === 4 || columnIndex === 7 || columnIndex === 10) {
          return 'display: none';
        }
      }
    },
    formatRatio(number, withSuffix = true) {
      if (number === null) {
        return '';
      }
      const ratio = (number * 100).toFixed(2);
      return withSuffix ? `${ratio}%` : ratio;
    },
    async fetchEsgSubcategories() {
      this.isLoading = true;
      const DEFAULT_YEAR_NUM = 2;
      try {
        const data = await fetchEsgSubcategories({ rule: this.rule });
        const ruleResultList = [];
        const complianceOptions = [
          { key: 'available_reports', name: 'Available Reports' },
          { key: 'comply_issuers', name: 'Comply Issuers' },
          { key: 'non_disclosure_issuers', name: 'Non-Disclosure Issuers' },
        ];

        this.legends = [];
        this.subCategoryChartSeries = [];
        data.forEach((item, i) => {
          const subcategoryNames = item.comply_issuers.total.items.map(
            (c) => c.label,
          );
          if (i === 0) {
            this.subcategoryNames = subcategoryNames;
          }
          this.legends.push({
            key: item.calendar_year,
            value: i < DEFAULT_YEAR_NUM,
          });
          const serie = {
            type: 'line',
            name: item.calendar_year,
            symbolSize: 8,
            itemStyle: {
              normal: {
                borderWidth: 3,
              },
            },
            data: [],
          };
          complianceOptions.forEach((option, optionIdx) => {
            let numObj = item[option.key].summary || item[option.key];
            const mergeYear =
              optionIdx == 0
                ? [complianceOptions.length + subcategoryNames.length - 1, 1]
                : [0, 0];

            if (option.key === 'comply_issuers') {
              subcategoryNames.forEach((subCategoryName, j) => {
                serie.data.push(
                  this.formatRatio(
                    item[option.key].total.items[j].ratio,
                    false,
                  ),
                );
                ruleResultList.push({
                  year: item.calendar_year,
                  name: j == 0 ? option.name : '',
                  total: j == 0 ? numObj.total : '',
                  mb: j == 0 ? numObj.main_board : '',
                  gem: j == 0 ? numObj.gem : '',
                  totalSubCategory: this.formatRatio(
                    item[option.key].total.items[j].ratio,
                  ),
                  mbSubCategory: this.formatRatio(
                    item[option.key].main_board.items[j].ratio,
                  ),
                  gemSubCategory: this.formatRatio(
                    item[option.key].gem.items[j].ratio,
                  ),
                  subCategoryName: subCategoryName,
                  mergeYear,
                });
              });
            } else {
              ruleResultList.push({
                year: item.calendar_year,
                name: option.name,
                total: numObj.total,
                mb: numObj.main_board,
                gem: numObj.gem,
                totalSubCategory: '~',
                mbSubCategory: '~',
                gemSubCategory: '~',
                subCategoryName: '~',
                mergeYear,
                needMergeSubcategory: true,
              });
            }
          });
          this.subCategoryChartSeries.push(serie);
        });
        this.originRuleResult = ruleResultList;
        this.updateTableData();
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
    async fetchRuleSummary() {
      this.isLoading = true;
      try {
        const { data } = await fetchEsgRuleSummary({ rule: this.rule });
        const ruleSummaryBody = data.body;
        const barChartData = data.bar_chart_data;
        const ruleResultList = [];
        const complianceOptionsMap = {
          Comply: {
            label: '% Comply',
            text: '% No. of Comply',
          },
          Explain: {
            label: '% Explain',
            text: '% No. of Explain',
          },
          'No Disclosure': {
            label: '% No-Disclosure',
            text: '% No. of No-Disclosure',
          },
          Query: {
            label: '% Query',
            text: '% No. of Query',
          },
        };
        const ruleOptionsMap = {
          Available: 'Available Reports',
          Comply: 'Comply Issuers',
          Explain: 'Explain Issuers',
          'No Disclosure': 'Non-Disclosure Issuers',
          Query: 'Query Issuers',
        };
        this.complianceOptions = Object.keys(barChartData).map((key) => {
          return {
            value: key,
            label: complianceOptionsMap[key].label,
            text: complianceOptionsMap[key].text,
          };
        });
        this.complianceSelected = this.complianceOptions[0].value;
        const ruleTypes = ['Available']
          .concat(Object.keys(barChartData))
          .map((key) => {
            return {
              name: key,
              desc: ruleOptionsMap[key],
            };
          });
        for (let i = 0; i < ruleSummaryBody.length; i++) {
          const resultData = ruleSummaryBody[i].data;

          for (let j = 0; j < ruleTypes.length; j++) {
            const name = ruleTypes[j].name;
            const item = {
              year: ruleSummaryBody[i].year,
              name: ruleOptionsMap[name],
              total: resultData.Total[name],
              mb: resultData.MB[name],
              gem: resultData.GEM[name],
            };
            ruleResultList.push(item);
          }
        }
        this.ruleResult = ruleResultList;
        this.ruleStatistics = barChartData;
        this.setTableSpanMerged();
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
    closeExportTableByRuleDialog() {
      this.exportTableByRuleDialogVisible = false;
      this.exportTableByRuleForm = {
        financialYears: [],
        releaseTimeStart: '',
        releaseTimeEnd: '',
        issuer: '',
        rules: [],
        subGroups: [],
      };
      this.abortController?.abort();
    },
    async exportTable(type) {
      const isExportByRule = type === 'rule';
      const isValid = isExportByRule
        ? await this.$refs['exportTableByRuleForm'].validate()
        : await this.$refs['exportTableByYearForm'].validate();
      if (isValid) {
        try {
          this.abortController = new AbortController();
          this.exportLoading = true;
          const params = isExportByRule
            ? {
                sg: this.exportTableByRuleForm.subGroups,
                rules: this.exportTableByRuleForm.rules,
                report_years: this.exportTableByRuleForm.financialYears,
                stock_codes: this.ALL,
                date_from: this.exportTableByRuleForm.releaseTimeStart
                  ? this.exportTableByRuleForm.releaseTimeStart / 1000
                  : null,
                date_to: this.exportTableByRuleForm.releaseTimeEnd
                  ? (this.exportTableByRuleForm.releaseTimeEnd +
                      endTimestampOffset) /
                    1000
                  : null,
                non_compliance: 0,
                dt: 'esg',
              }
            : {
                report_years: this.exportTableByYearForm.financialYears,
                non_compliance: 1,
                dt: 'esg',
              };
          const exportRule = () =>
            this.$store.dispatch('hkexModule/ruleModule/exportRule', {
              params: _.omitBy(
                params,
                (v) => v === null || v === '' || v === this.ALL,
              ),
              signal: this.abortController.signal,
            });
          await downloadFileByPolling(exportRule);
          this.closeExportTableByRuleDialog();
          this.closeExportTableByYearDialog();
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.exportLoading = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.result-analysis-by-rule-wrapper {
  .content {
    .rule-detail-wrapper {
      .rule-header {
        display: flex;
        justify-content: space-between;
      }
      .export-btns {
        .button-hkex {
          padding: 6px 20px;
        }
      }
    }
  }
}
::v-deep .view-type-radio {
  margin-left: 1px;
  .el-radio-button__inner {
    border-radius: 0;
  }
  .el-radio-button__orig-radio {
    &:checked + .el-radio-button__inner {
      background-color: #369aa2;
      border-color: #369aa2;
      color: #fff;
    }
  }
  .el-radio-button__inner:hover {
    color: #369aa2;
  }
}
.legends-content {
  margin-top: 20px;
  padding-left: 45px;

  .el-button {
    color: #3e3f42;
    &:hover {
      color: #369aa2;
    }
    &.clear-all {
      margin: 0 50px 0 15px;
    }
  }

  .legend-item {
    border-radius: 12.5px;
    width: 69px;
    height: 25px;
    line-height: 25px;
    padding: 0;
    &.highlight {
      font-weight: bold;
    }
    &.dark {
      color: #6b6c6f !important;
      background-color: #efeff0 !important;
      border-color: #efeff0 !important;
    }
  }
}
.subcategory-chart {
  height: 180px;
}
</style>
