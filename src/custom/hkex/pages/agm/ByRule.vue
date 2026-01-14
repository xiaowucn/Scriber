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
                :value="item.value">
              </el-option>
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
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="chart" ref="chart"></div>
          <div class="export-btns">
            <el-button class="button-hkex" @click="openExportDialog('rules')">
              <i class="fas fa-download"></i>
              Export Table
            </el-button>
            <el-button
              class="button-hkex"
              icon="el-icon-download"
              @click="openExportDialog('issuers')">
              Display List of Non-Compliant Issuers
            </el-button>
            <el-button
              class="button-hkex"
              icon="el-icon-download"
              @click="openExportDialog(GML_SPECIAL_RULE)">
              Export Table of General Mandate Limit
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
      v-if="exportDialogVisible"
      :title="
        exportType === 'rules' || exportType === GML_SPECIAL_RULE
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
        <el-form-item label="Select Calendar Year(s)" prop="calendarYears">
          <el-select
            v-model="exportTableForm.calendarYears"
            size="mini"
            placeholder="Please select"
            multiple
            filterable
            collapse-tags
            @change="
              handleMultipleSelect($event, exportTableForm, 'calendarYears')
            ">
            <el-option
              v-for="(item, index) in exportFinancialYears"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="exportType !== GML_SPECIAL_RULE"
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
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="exportType !== GML_SPECIAL_RULE"
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
              v-for="(item, index) in exportRules"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeExportDialog">Cancel</el-button>
        <el-button
          class="button-hkex"
          :loading="exportLoading"
          @click="exportTable">
          Export
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { downloadFileByPolling } from '@/utils';
import ReportTypeMixin from '../../mixins/ReportType.mixin';
import ByRuleMixin from '../../mixins/ByRule.mixin';
import { hkexReportType, GML_SPECIAL_RULE } from '@/store/constants';
import {
  fetchAgmRuleSummary,
  fetchPollRuleSummary,
} from '@/store/api/hkex.api';

export default {
  name: 'result-analysis-by-rule',
  mixins: [ReportTypeMixin, ByRuleMixin],
  data() {
    return {
      GML_SPECIAL_RULE,
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
      exportDialogVisible: false,
      exportType: '',
      exportTableForm: {
        calendarYears: [],
        rules: [],
        subGroups: [],
      },
      exportTableFormRules: {
        calendarYears: [
          { required: true, message: 'Please select calendar year(s)' },
        ],
        rules: [{ required: true, message: 'Please select listing rule(s)' }],
        subGroups: [{ required: true, message: 'Please select sub-group(s)' }],
      },
      exportLoading: false,
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType']),
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
        const fetchFunc = (params) => {
          if (this.isAgmReport) {
            return fetchAgmRuleSummary(params);
          }
          if (this.isPollReport) {
            return fetchPollRuleSummary(params);
          }
        };
        const res = await fetchFunc({ rule: this.rule });
        const ruleSummaryHeader = res.header;
        const ruleSummaryBody = res.body;
        const barChartData = res.chart;
        const ruleResultList = [];
        let resultDataItemMap = {
          available: this.isAgmReport
            ? 'Available AGM Circulars'
            : 'Available AGM Poll Results',
          compliance: 'Compliant Issuers',
          non_compliance: 'Non-Compliant Issuers',
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
      this.exportDialogVisible = true;
      this.fetchGroups();
    },
    closeExportDialog() {
      this.exportType = '';
      this.exportDialogVisible = false;
      this.exportTableForm = {
        calendarYears: [],
        rules: [],
        subGroups: [],
      };
      this.abortController?.abort();
    },
    async exportTable() {
      const isValid = await this.$refs['exportTableForm'].validate();
      if (isValid) {
        try {
          this.abortController = new AbortController();
          this.exportLoading = true;
          let params = {
            rules: this.exportTableForm.rules,
            report_years: this.exportTableForm.calendarYears,
            dt: hkexReportType[this.auditType].value,
          };
          if (this.exportType === GML_SPECIAL_RULE) {
            params.rules = GML_SPECIAL_RULE;
          } else {
            params = {
              ...params,
              sg: this.exportTableForm.subGroups,
              non_compliance: this.exportType === 'rules' ? 0 : 1,
            };
          }
          const exportRule = () =>
            this.$store.dispatch('hkexModule/ruleModule/exportRule', {
              params: _.omitBy(params, (v) => v === ''),
              signal: this.abortController.signal,
            });
          await downloadFileByPolling(exportRule);
          this.closeExportDialog();
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
