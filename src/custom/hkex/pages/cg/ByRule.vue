<template>
  <div class="result-analysis-by-rule-wrapper" v-loading="isLoading">
    <div class="content">
      <div class="rule-detail-wrapper">
        <el-row class="rule-header">
          <el-col :span="10">
            <div class="header-item">
              <span>Rule #:</span>
              <el-select
                v-model="rule"
                size="mini"
                filterable
                placeholder="Please select or search"
                popper-class="rule-selector"
                style="width: 360px"
                @change="changeRule">
                <el-option
                  v-for="(item, index) in rules"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
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
          <div class="chart" ref="chart"></div>
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
      v-if="exportTableByRuleDialogVisible"
      title="Export Table"
      :visible="true"
      width="30%"
      custom-class="hkex-export-dialog"
      :close-on-click-modal="false"
      @close="closeExportTableByRuleDialog">
      <el-form
        ref="exportTableByRuleForm"
        :model="exportTableByRuleForm"
        :rules="exportTableByRuleFormRules"
        label-width="180px">
        <el-form-item label="Select Financial Year(s)" prop="financialYears">
          <el-select
            v-model="exportTableByRuleForm.financialYears"
            size="mini"
            placeholder="Please select"
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
        <el-form-item
          ref="selectSubGroupsFormItem"
          label="Select Sub-Group(s)"
          :prop="exportTableByRuleForm.rules.length === 0 ? 'subGroups' : null">
          <el-select
            v-model="exportTableByRuleForm.subGroups"
            size="mini"
            placeholder="Please select"
            :disabled="exportTableByRuleForm.rules.length > 0"
            multiple
            filterable
            collapse-tags
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
          label="Select Listing Rule(s)"
          :prop="exportTableByRuleForm.subGroups.length === 0 ? 'rules' : null">
          <el-select
            v-model="exportTableByRuleForm.rules"
            size="mini"
            placeholder="Please select"
            :disabled="exportTableByRuleForm.subGroups.length > 0"
            multiple
            filterable
            collapse-tags
            @change="
              handleMultipleSelect($event, exportTableByRuleForm, 'rules')
            ">
            <el-option
              v-for="(item, index) in exportRules"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeExportTableByRuleDialog">Cancel</el-button>
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable('rule')">
          Export
        </el-button>
      </span>
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
import ByRuleMixin from '../../mixins/ByRule.mixin';
import { fetchCgRuleSummary } from '../../../../store/api/hkex.rule.api';

export default {
  name: 'result-analysis-by-rule',
  mixins: [ByRuleMixin],
  data() {
    return {
      isLoading: false,
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
      ruleSummaryHeader: {},
      ruleResult: [],
      exportTableByRuleForm: {
        financialYears: [],
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
      exportLoading: false,
    };
  },
  computed: {
    complianceOptions() {
      return [
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
      ];
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.isLoading = true;
      this.fetchReportYears();
      await this.fetchRules();
      await this.fetchRuleSummary();
      this.initChart();
    },
    async fetchRuleSummary() {
      this.isLoading = true;
      try {
        const data = await fetchCgRuleSummary({ rule: this.rule });
        const ruleSummaryHeader = data.header;
        const ruleSummaryBody = data.body;
        const barChartData = data.bar_chart_data;
        const ruleResultList = [];
        let resultDataItemMap = {
          Available: 'Available Reports',
          Comply: 'Comply Issuers',
          'No Disclosure': 'Non-Disclosure Issuers',
          'N/A': 'N/A Issuers',
        };
        for (let i = 0; i < ruleSummaryBody.length; i++) {
          const resultData = ruleSummaryBody[i].data;

          const types = Object.keys(resultDataItemMap);
          for (let j = 0; j < types.length; j++) {
            const item = {
              year: ruleSummaryBody[i].year,
              name: resultDataItemMap[types[j]],
              total: resultData.Total[types[j]],
              mb: resultData.MB[types[j]],
              gem: resultData.GEM[types[j]],
            };
            ruleResultList.push(item);
          }
        }
        this.ruleSummaryHeader = ruleSummaryHeader;
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
                report_years: this.exportTableByRuleForm.financialYears,
                rules: this.exportTableByRuleForm.rules,
                sg: this.exportTableByRuleForm.subGroups,
                non_compliance: 0,
                dt: 'cg',
              }
            : {
                report_years: this.exportTableByYearForm.financialYears,
                non_compliance: 1,
                dt: 'cg',
              };
          const exportRule = () =>
            this.$store.dispatch('hkexModule/ruleModule/exportRule', {
              params: _.omitBy(params, (v) => v === ''),
              signal: this.abortController.signal,
            });
          await downloadFileByPolling(exportRule);
          this.closeExportTableByRuleDialog();
          this.closeExportTableByYearDialog();
        } catch (err) {
          this.$notify({
            title: 'Error',
            message: err.message,
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
