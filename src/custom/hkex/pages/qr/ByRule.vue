<template>
  <div class="result-analysis-by-rule-wrapper" v-loading="isLoading">
    <div class="content">
      <div class="rule-detail-wrapper">
        <el-row class="rule-header">
          <el-col :span="24">
            <div class="header-item">
              <span>Rule #:</span>
              <el-select
                v-model="rule"
                size="mini"
                filterable
                placeholder="Please select or search"
                popper-class="rule-selector"
                style="width: 470px"
                @change="changeRule">
                <el-option
                  v-for="(item, index) in rules"
                  :key="index"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <div class="chart-container">
          <div class="filter-selectors">
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
              v-model="quarterSelected"
              size="mini"
              placeholder="Please select"
              @change="changeQuarterType">
              <el-option
                v-for="quarter in quarters"
                :key="quarter"
                :label="quarter"
                :value="quarter"></el-option>
            </el-select>
          </div>
          <div class="chart" ref="chart"></div>
          <div class="export-btns">
            <el-button class="button-hkex" @click="openExportDialog">
              <i class="fas fa-download"></i>
              <span>Export Table</span>
              <el-tooltip
                effect="dark"
                content="The report contains a large amount of data, and the generated data is derived from the content of the previous day.
If there are manual adjustments on the day, please export the table on the next day."
                placement="top"
                popper-class="tooltip-export-warning">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-button>
          </div>
        </div>
        <el-table
          :data="ruleResult"
          :span-method="mergeTableRows"
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
            prop="quarter"
            fixed
            label
            align="center"
            width="240"></el-table-column>
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
            prop="mb"
            label="Main Board"
            align="center"></el-table-column>
          <el-table-column
            prop="gem"
            label="GEM"
            align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      v-if="dialogVisible"
      title="Export Table"
      :visible="true"
      width="650px"
      :close-on-click-modal="false"
      @close="closeExportDialog">
      <el-form
        ref="exportTableForm"
        :model="exportTableForm"
        :rules="exportTableFormRules"
        label-width="150px">
        <el-form-item label="Financial Year(s)" prop="financialYears">
          <el-select
            v-model="exportTableForm.financialYears"
            size="mini"
            placeholder="Please select financial year(s)"
            multiple
            filterable
            collapse-tags
            @change="
              handleMultipleSelect($event, exportTableForm, 'financialYears')
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
                v-model="exportTableForm.releaseTimeStart"
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
                v-model="exportTableForm.releaseTimeEnd"
                :picker-options="pickerEndDateOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="Issuer"
          prop="teamIds"
          :class="
            stockCodeMode === 'teamIds' ? 'teams-validate-error-offset' : ''
          ">
          <el-radio-group v-model="stockCodeMode" @change="changeStockCodeMode">
            <el-radio label="ALL">All</el-radio>
            <el-radio label="teamIds">
              Teams
              <el-select
                v-model="exportTableForm.teamIds"
                size="mini"
                multiple
                filterable
                collapse-tags
                class="teamids-select"
                placeholder="Teams"
                @focus="teamIdsSelectFocused"
                @change="
                  handleMultipleSelect($event, exportTableForm, 'teamIds')
                ">
                <el-option
                  v-for="(item, index) in teamIds"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-radio>
            <el-radio label="Input">Input Code</el-radio>
          </el-radio-group>
          <el-form-item prop="stockCodes">
            <el-input
              v-if="stockCodeMode === 'Input'"
              ref="stockCodes"
              type="textarea"
              v-model="exportTableForm.stockCodes"
              placeholder="Please separate multiple codes with ','"
              @input="
                (val) => {
                  exportTableForm.stockCodes = val.replace(/[^\d,]/g, '');
                }
              "></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="Report Type(s)" prop="reportTypes">
          <el-select
            v-model="exportTableForm.reportTypes"
            size="mini"
            multiple
            filterable
            collapse-tags
            placeholder="Please select report type(s)"
            @change="
              handleMultipleSelect($event, exportTableForm, 'reportTypes')
            ">
            <el-option
              v-for="(type, index) in reportTypes"
              :key="index"
              :label="type"
              :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Select Rule(s)" prop="rules">
          <el-select
            v-model="exportTableForm.rules"
            size="mini"
            placeholder="Please select listing rule(s)"
            multiple
            filterable
            collapse-tags
            @change="handleMultipleSelect($event, exportTableForm, 'rules')">
            <el-option
              v-for="(item, index) in exportRules"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="showRatioOutputType"
          label="Ratio Output Type"
          prop="ratioOutputType">
          <el-select
            v-model="exportTableForm.ratioOutputType"
            size="mini"
            placeholder="Please select ratio output type">
            <el-option
              v-for="(item, index) in ratioOutputTypes"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeExportDialog">Cancel</el-button>
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable">
          Export
        </el-button>
        <el-progress
          v-if="exportLoading"
          color="#5287e1"
          :percentage="exportProgress"></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { downloadFileByPolling } from '@/utils';
import { endTimestampOffset } from '@/store/constants';
import ByRuleMixin from '../../mixins/ByRule.mixin';

export default {
  name: 'results-announcement-analysis-by-rule',
  mixins: [ByRuleMixin],
  data() {
    return {
      isLoading: false,
      ruleResult: [],
      quarterSelected: '',
      complianceSelected: 'compliance_statistics',
      dialogVisible: false,
      TEAM_IDS: 'teamIds',
      stockCodeMode: 'ALL',
      teamIds: [],
      reportTypes: [],
      ratioOutputTypes: [
        {
          label: 'Full Dataset',
          value: 'full',
        },
        {
          label: 'Summary',
          value: 'summary',
        },
      ],
      exportTableForm: {
        financialYears: [],
        releaseTimeStart: '',
        releaseTimeEnd: '',
        stockCodes: '',
        teamIds: [],
        reportTypes: [],
        rules: [],
        ratioOutputType: '',
      },
      exportTableFormRules: {
        financialYears: [
          { required: true, message: 'Please select financial year(s)' },
        ],
        teamIds: [{ required: true, validator: this.validateTeamIds }],
        stockCodes: [{ required: true, validator: this.validateStockCode }],
        reportTypes: [
          { required: true, message: 'Please select report type(s)' },
        ],
        rules: [{ required: true, message: 'Please select listing rule(s)' }],
        ratioOutputType: [
          { required: true, message: 'Please select ratio output type' },
        ],
      },
      pickerStartDateOptions: {
        disabledDate: (time) => {
          const endTime = new Date(
            this.exportTableForm.releaseTimeEnd,
          ).getTime();
          return (
            time.getTime() > endTime || time.getTime() > new Date().getTime()
          );
        },
      },
      pickerEndDateOptions: {
        disabledDate: (time) => {
          const startTime = new Date(
            this.exportTableForm.releaseTimeStart,
          ).getTime();
          return (
            time.getTime() < startTime || time.getTime() > new Date().getTime()
          );
        },
      },
      exportLoading: false,
      exportProgress: 0,
    };
  },
  computed: {
    complianceOptions() {
      return [
        {
          value: 'compliance_statistics',
          label: '% Compliance',
          text: '% No. of Compliance',
        },
        {
          value: 'non_compliance_statistics',
          label: '% Non-Compliance',
          text: '% No. of Non-Compliance',
        },
      ];
    },
    quarters() {
      return Object.keys(this.ruleStatistics);
    },
    showRatioOutputType() {
      return this.exportTableForm.rules.some((rule) => {
        return rule === this.ALL || rule.startsWith('ratio');
      });
    },
  },
  watch: {
    'exportTableForm.rules'() {
      if (!this.showRatioOutputType) {
        this.exportTableForm.ratioOutputType = '';
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.isLoading = true;
      await this.getRules();
      await Promise.all([
        this.fetchRuleSummary(),
        this.getReportYears(),
        this.getTeamIds(),
      ]);
      this.initChart();
    },
    async getRules() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchAnnouncementRules',
        );
        this.rules = res.data.map((item) => {
          return {
            value: item.rule,
            label: item.main_alias,
          };
        });
        this.rule = this.rules[0].value;
        const ratioRules = await this.getRatioRules();
        this.exportRules = [{ value: this.ALL, label: this.ALL }].concat(
          ...this.rules,
          ...ratioRules,
        );
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
    async getRatioRules() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchAnnouncementRatioRules',
        );
        return res.data.map((item) => {
          return {
            value: item.rule,
            label: item.main_alias,
          };
        });
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchRuleSummary() {
      this.isLoading = true;
      try {
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchAnnouncementRuleSummary',
          {
            rule: this.rule,
          },
        );

        this.ruleStatistics = res.data.bar_chart_data;
        this.setDefaultChartFilters();

        this.ruleResult = [];

        const boardTypesMap = {
          available: 'Available Reports',
          compliance: 'Compliant Issuers',
          non_compliance: 'Non-Compliant Issuers',
        };
        const summaryData = res.data.body;
        for (let i = 0; i < summaryData.length; i++) {
          const resultData = summaryData[i].data;
          this.quarters.forEach((quarter) => {
            if (resultData[quarter]) {
              const quarterData = resultData[quarter];
              const types = Object.keys(boardTypesMap);
              for (let j = 0; j < types.length; j++) {
                const item = {
                  year: summaryData[i].year,
                  quarter: quarter,
                  name: boardTypesMap[types[j]],
                  total: quarterData['Total'][types[j]],
                  mb: quarterData['MB'][types[j]],
                  gem: quarterData['GEM'][types[j]],
                };
                this.ruleResult.push(item);
              }
            }
          });
        }
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
    async getReportYears() {
      try {
        const res = await this.$store.dispatch('hkexModule/fetchReportYears', {
          dt: 'qr',
        });
        this.exportFinancialYears = [this.ALL].concat(_.clone(res.year));
        this.reportTypes = [this.ALL].concat(_.clone(res.doc_types));
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async getTeamIds() {
      try {
        const res = await this.$store.dispatch('hkexModule/fetchTeamIDs');
        const teamIds = res.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        this.teamIds = [{ label: this.ALL, value: this.ALL }].concat(teamIds);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    setDefaultChartFilters() {
      this.quarterSelected = this.quarters[0];
      this.complianceSelected = this.complianceOptions[0].value;
    },
    changeQuarterType() {
      this.initChart();
    },
    mergeTableRows({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const row = this.tableSpanMerged[rowIndex];
        const column = row > 0 ? 1 : 0;
        return [row, column];
      }
      if (columnIndex === 1) {
        if (rowIndex % 3 === 0) {
          return [3, 1];
        }
        return [0, 0];
      }
    },
    openExportDialog() {
      this.dialogVisible = true;
    },
    closeExportDialog() {
      this.dialogVisible = false;
      this.stockCodeMode = this.ALL;
      this.exportTableForm = {
        financialYears: [],
        releaseTimeStart: '',
        releaseTimeEnd: '',
        stockCodes: '',
        teamIds: [],
        reportTypes: [],
        rules: [],
        ratioOutputType: '',
      };
      this.abortController?.abort();
    },
    async exportTable() {
      const isValid = await this.$refs['exportTableForm'].validate();
      if (isValid) {
        try {
          this.abortController = new AbortController();
          this.exportLoading = true;
          const stock_codes = [this.ALL, this.TEAM_IDS].includes(
            this.stockCodeMode,
          )
            ? ''
            : this.exportTableForm.stockCodes
                .split(',')
                .map((code) => code.padStart(5, '0'))
                .join();
          const exportRule = () =>
            this.$store.dispatch('hkexModule/ruleModule/exportRule', {
              params: _.omitBy(
                {
                  rules: this.exportTableForm.rules,
                  report_years: this.exportTableForm.financialYears,
                  stock_codes: stock_codes,
                  qr_types: this.exportTableForm.reportTypes.join(','),
                  date_from: this.exportTableForm.releaseTimeStart
                    ? this.exportTableForm.releaseTimeStart / 1000
                    : null,
                  date_to: this.exportTableForm.releaseTimeEnd
                    ? (this.exportTableForm.releaseTimeEnd +
                        endTimestampOffset) /
                      1000
                    : null,
                  team_ids: this.exportTableForm.teamIds.join(','),
                  ratio_output_type: this.exportTableForm.ratioOutputType,
                  non_compliance: 0,
                  dt: 'qr',
                },
                (v) => v === null || v === '' || v === this.ALL,
              ),
              onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                this.exportProgress = Math.floor((loaded / total) * 100);
              },
              signal: this.abortController.signal,
            });
          await downloadFileByPolling(exportRule);
          this.closeExportDialog();
        } catch (err) {
          this.$notify({
            title: 'Error',
            message: err.message,
            type: 'error',
          });
        } finally {
          this.exportLoading = false;
          this.exportProgress = 0;
        }
      }
    },
    teamIdsSelectFocused() {
      this.stockCodeMode = this.TEAM_IDS;
      this.exportTableForm.stockCodes = '';
      this.clearStockCodesValidate();
    },
    changeStockCodeMode(value) {
      this.clearTeamIdsValidate();
      this.clearStockCodesValidate();
      if (value === this.ALL) {
        this.exportTableForm.teamIds = [];
        this.exportTableForm.stockCodes = '';
      } else if (value === this.TEAM_IDS) {
        this.exportTableForm.stockCodes = '';
      } else {
        this.exportTableForm.teamIds = [];
        this.$refs.stockCodes.focus();
      }
    },
    clearTeamIdsValidate() {
      this.$refs.exportTableForm.clearValidate('teamIds');
    },
    validateTeamIds(rule, value, cb) {
      if (
        this.stockCodeMode === 'teamIds' &&
        this.exportTableForm.teamIds.length === 0
      ) {
        cb(new Error('Please select teams'));
        return;
      }
      cb();
    },
    clearStockCodesValidate() {
      this.$refs.exportTableForm.clearValidate('stockCodes');
    },
    validateStockCode(rule, value, cb) {
      if (
        this.stockCodeMode === 'Input' &&
        this.exportTableForm.stockCodes === ''
      ) {
        cb(new Error('Please input stock code'));
        return;
      }
      cb();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    &.teams-validate-error-offset {
      ::v-deep .el-form-item__error {
        margin-left: 145px;
      }
    }
  }
}
</style>

<style lang="scss">
.tooltip-export-warning {
  width: 270px;
}
</style>
