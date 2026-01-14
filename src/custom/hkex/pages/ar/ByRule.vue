<template>
  <div class="result-analysis-by-rule-wrapper" v-loading="isLoading">
    <div class="content">
      <div class="rule-detail-wrapper">
        <el-row class="rule-header">
          <el-col :span="6">
            <div class="header-item">
              <span>Rule #:</span>
              <el-select
                v-model="rule"
                size="mini"
                filterable
                placeholder="Please select or search"
                popper-class="rule-selector"
                style="width: 200px"
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
          <el-col :span="9">
            <div class="header-item">
              <div class="item">
                <span class="label">Main Board:</span>
                <span>{{ ruleSummaryHeader.main_alias }}</span>
              </div>
              <div class="item">
                <span class="label">GEM Board:</span>
                <span>{{ ruleSummaryHeader.gem_alias }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="header-item">
              <span>Newly Listed Companies: Listed after</span>
              <el-date-picker
                v-model="newlyListedDate"
                type="date"
                size="mini"
                style="width: 150px"
                placeholder="pick a date"
                value-format="yyyy-MM-dd"
                @change="changeDate">
              </el-date-picker>
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
            <el-button class="button-hkex" @click="openExportDialog('rules')"
              ><i class="fas fa-download"></i>Export Table</el-button
            >
            <el-button
              class="button-hkex"
              icon="el-icon-download"
              @click="openExportDialog('issuers')"
              >Display List of Non-Compliant Issuers</el-button
            >
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
          <el-table-column
            prop="newlyListed"
            label="Newly Listed"
            align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :title="
        exportType === 'rules'
          ? 'Export Table'
          : 'List of Non-Compliant Issuers'
      "
      :visible="true"
      width="30%"
      custom-class="hkex-export-dialog"
      :close-on-click-modal="false"
      @close="closeExportDialog">
      <el-form
        ref="exportTableForm"
        :model="exportTableForm"
        :rules="exportTableFormRules"
        label-width="180px">
        <el-form-item label="Select Financial Year(s)" prop="financialYears">
          <el-select
            v-model="exportTableForm.financialYears"
            size="mini"
            placeholder="Please select"
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
        <el-form-item
          ref="selectSubGroupsFormItem"
          label="Select Sub-Group(s)"
          :prop="exportTableForm.rules.length === 0 ? 'subGroups' : null">
          <el-select
            v-model="exportTableForm.subGroups"
            size="mini"
            placeholder="Please select"
            :disabled="exportTableForm.rules.length > 0"
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
          :prop="exportTableForm.subGroups.length === 0 ? 'rules' : null">
          <el-select
            v-model="exportTableForm.rules"
            size="mini"
            placeholder="Please select"
            :disabled="exportTableForm.subGroups.length > 0"
            multiple
            filterable
            collapse-tags
            @change="handleMultipleSelect($event, exportTableForm, 'rules')">
            <el-option
              v-for="(item, index) in exportListingRules"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeExportDialog">Cancel</el-button>
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTableOrIssuers"
          >Export</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { downloadFileByPolling } from '@/utils';
import ByRuleMixin from '../../mixins/ByRule.mixin';

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
        {
          value: 'NewlyListed',
          label: 'Newly Listed',
        },
      ],
      complianceSelected: 'compliance_statistics',
      ruleSummaryHeader: {},
      ruleResult: [],
      newlyListedDate: '',
      newListed: {},
      dialogVisible: false,
      exportType: '',
      exportTableForm: {
        financialYears: [],
        rules: [],
        subGroups: [],
      },
      exportTableFormRules: {
        financialYears: [
          { required: true, message: 'Please select financial year(s)' },
        ],
        rules: [{ required: true, message: 'Please select listing rule(s)' }],
        subGroups: [{ required: true, message: 'Please select sub-group(s)' }],
      },
      exportLoading: false,
    };
  },
  computed: {
    complianceOptions() {
      if (this.rule.startsWith('D')) {
        return [
          {
            value: 'compliance_statistics',
            label: '% Disclosure',
            text: '% No. of Disclosure',
          },
          {
            value: 'non_compliance_statistics',
            label: '% No-Disclosure',
            text: '% No. of No-Disclosure',
          },
        ];
      }
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
    exportListingRules() {
      if (this.exportType === 'issuers') {
        return this.exportRules.filter((rule) => !rule.value.startsWith('D'));
      }
      return this.exportRules;
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
      this.setDefaultDate();
      await this.fetchRuleSummary();
      this.initChart();
    },
    setDefaultDate() {
      const currentTime = Date.parse(new Date());
      this.newlyListedDate = this.$options.filters.date(currentTime);
    },
    changeDate() {
      this.fetchRuleSummary();
    },
    async fetchRuleSummary() {
      this.isLoading = true;
      try {
        const newList = this.newlyListedDate;
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchRuleSummary',
          {
            ruleCode: this.rule,
            newList: newList,
          },
        );
        const ruleSummaryHeader = res.data.header;
        const ruleSummaryBody = res.data.body;
        const barChartData = res.data.bar_chart_data;
        const ruleResultList = [];
        let resultDataItemMap = {
          available: 'Available Annual Reports',
          compliance: 'Compliant Issuers',
          non_compliance: 'Non-Compliant Issuers',
        };
        if (this.rule.startsWith('D')) {
          resultDataItemMap = {
            available: 'Available Annual Reports',
            compliance: 'Disclosure Issuers',
            non_compliance: 'No Disclosure Issuers',
          };
        }
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
              newlyListed: resultData.NewlyListed[types[j]],
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
    openExportDialog(type) {
      this.exportType = type;
      this.dialogVisible = true;
      this.fetchGroups();
    },
    closeExportDialog() {
      this.exportType = '';
      this.dialogVisible = false;
      this.exportTableForm = {
        financialYears: [],
        rules: [],
        subGroups: [],
      };
      this.abortController?.abort();
    },
    async exportTableOrIssuers() {
      const isValid = await this.$refs['exportTableForm'].validate();
      if (isValid) {
        try {
          this.abortController = new AbortController();
          this.exportLoading = true;
          const exportRule = () =>
            this.$store.dispatch('hkexModule/ruleModule/exportRule', {
              params: _.omitBy(
                {
                  rules: this.exportTableForm.rules,
                  sg: this.exportTableForm.subGroups,
                  report_years: this.exportTableForm.financialYears,
                  non_compliance: this.exportType === 'rules' ? 0 : 1,
                },
                (v) => v === '',
              ),
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
        }
      }
    },
  },
};
</script>
