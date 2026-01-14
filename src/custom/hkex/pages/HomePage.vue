<template>
  <main ref="hkex-home" class="hkex-home" v-loading="loading">
    <el-tabs v-model="activeTabName" @tab-click="changeTab">
      <el-tab-pane
        label="Current Securities"
        name="current-securities"></el-tab-pane>
    </el-tabs>
    <section
      v-if="!(isQrReport || isAgmReport || isPollReport)"
      class="hkex-v2-summary">
      <header>
        <h2>Summary</h2>
      </header>

      <div class="hkex-v2-summary__fy-filter">
        <div v-if="showSummaryTeam">
          <span>Team</span>
          <el-select
            v-model="teamIDs"
            placeholder="Please select"
            size="small"
            multiple
            class="teamid-selector"
            @change="updateByTeamIDs">
            <el-option
              v-for="(item, index) in teamIDsOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>Financial Year</span>
          <el-select
            v-model="reportYears"
            placeholder="Please select"
            size="small"
            multiple
            @change="updateByReportYear">
            <el-option
              v-for="(item, index) in reportYearOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <dl class="hkex-v2-summary__progress_pair">
        <div class="hkex-v2-summary__progress_total">
          <dt>{{ hkexReportType[auditType].summaryTitleDesc }}:</dt>
          <dd>{{ progressSummary.total }}</dd>
        </div>
        <div
          v-if="isArReport || isEsgReport"
          class="hkex-v2-summary__progress_flagged">
          <dt>Flag for Follow-up:</dt>
          <dd @click="openTotalFlaggedDialog">
            <span>{{ progressSummary.flagged }}</span>
            <i class="fas fa-flag"></i>
          </dd>
        </div>
      </dl>
    </section>

    <section class="hkex-v2-document-view" :class="`hkex-${auditType}`">
      <header>
        <div class="left">
          <h2>Document View</h2>

          <div class="data-craw">
            <span class="label">Latest Update:</span>
            <span class="date">{{ Date.now() | date }}</span>
          </div>
        </div>

        <div>
          <dl
            v-if="isArReport || isEsgReport"
            class="hkex-v2-document-view__symbol">
            <div>
              <dt><i class="fas fa-flag"></i></dt>
              <dd>Flagged</dd>
            </div>
          </dl>

          <report-upload
            v-if="isArReport || isEsgReport"
            @uploaded="fetchDocumentTableData" />
        </div>
      </header>

      <div v-if="showDocumentViewFilter" class="view-exchange-header">
        <div>
          <el-button
            v-for="(type, index) in documentViewFilterTypes"
            :key="index"
            :class="[defaultDocumentViewType === type.value ? 'active' : '']"
            size="mini"
            round
            @click="changeDocumentViewType(type.value)">
            {{ type.label }}
          </el-button>
        </div>
        <div class="search-bar">
          <div>
            <span class="label">Team</span>
            <el-select
              v-model="teamIDs"
              placeholder="Please select"
              size="mini"
              multiple
              collapse-tags
              class="teamid-selector"
              @change="updateByTeamIDs">
              <el-option
                v-for="(item, index) in teamIDsOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-if="showAdvancedSearchOptions">
            <span class="label">
              {{ isQrReport ? 'Financial Year' : 'Calendar Year' }}
            </span>
            <el-select
              v-model="reportYears"
              placeholder="Please select"
              size="mini"
              multiple
              collapse-tags
              @change="updateByReportYear">
              <el-option
                v-for="(item, index) in reportYearOptions"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <el-input
            v-if="showAdvancedSearchOptions || showSearchInput"
            class="search-input"
            size="mini"
            prefix-icon="el-icon-search"
            v-model="documentFilter.stock_code"
            placeholder="Please input stock code or company name"
            clearable
            @clear="searchDocumentTableData"
            @keyup.enter.native="searchDocumentTableData"
            @input="searchDocumentTableData('input')"></el-input>
          <div v-if="isQrReport">
            <el-checkbox v-model="criticalFlagged" @change="changeCriticalFlag">
              Filter Critical Flag
            </el-checkbox>
          </div>
        </div>
      </div>

      <component
        :is="documentViewTable"
        :show-document-table="showDocumentTable"
        :document-summary="documentSummary"
        :document-total="documentTotal"
        :document-flows="documentFlows"
        :document-flows-total="documentFlowsTotal"
        :document-filter.sync="documentFilter"
        :report-year-options="reportYearOptions.filter((i) => i !== 'ALL')"
        :report-doc-types="reportDocTypes"
        :document-sort="documentSort"
        :sort-document="sortDocument"
        :document-table-span="documentTableSpan"
        :fetch-document-table-data="fetchDocumentTableData"
        :search-document-table-data="searchDocumentTableData"
        :change-document-page="changeDocumentPage"
        :change-document-size="changeDocumentSize"></component>
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        :current-page="documentTablePage"
        :page-size="documentTableSize"
        :total="documentTableTotal"
        @current-change="changeDocumentPage"
        @size-change="changeDocumentSize"></el-pagination>
    </section>

    <el-dialog
      title="Flag for Follow-up"
      :visible.sync="totalFlaggedDialogVisible"
      width="1024px"
      :close-on-click-modal="false">
      <el-table :data="flaggedData" class="hkex-v2-total-flagged__table" stripe>
        <el-table-column
          label="Stock Code"
          prop="stock_code"
          align="center"
          width="100px"></el-table-column>
        <el-table-column
          label="Company Name"
          prop="company_name_en"
          align="center"></el-table-column>
        <el-table-column
          label="Release Time"
          prop="published_time_str"
          align="center"
          width="180px"></el-table-column>

        <el-table-column label="Document" align="center">
          <template slot-scope="scope">
            <router-link :to="getReportReviewLink(scope.row)">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :current-page.sync="flaggedFilter.page"
        :page-size="flaggedFilter.size"
        :page-sizes="[10, 20, 50]"
        :total="flaggedTotal"
        @current-change="fetchTotalFlagged"
        @size-change="changeTotalFlaggedSize"
        class="hkex-v2-total-flagged__table-pagination"></el-pagination>
    </el-dialog>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { hkexReportType } from '@/store/constants';
import { omitBy, pickBy, isEmpty } from 'lodash';
import DocumentViewTable from '../components/DocumentViewTable';
import DocumentViewTableForQr from './qr/DocumentViewTable';
import DocumentViewTableForAgm from './agm/DocumentViewTable';
import { readDataFromStorage, saveDataInStorage } from '../common/utils';
import ReportUpload from '../components/ReportUpload.vue';
import ReportTypeMixin from '../mixins/ReportType.mixin';
import { fetchAgmDocFlows, fetchPollDocFlows } from '@/store/api/hkex.api';

const FILTER_TYPE = {
  LATEST_3_MONTHS: 'Latest 3 months',
  ADVANCED_SEARCH: 'Advanced search',
  ALL: 'All',
};

export default {
  name: 'hkex-home',
  components: {
    DocumentViewTable,
    DocumentViewTableForQr,
    DocumentViewTableForAgm,
    ReportUpload,
  },
  mixins: [ReportTypeMixin],
  created() {
    this.init();
  },
  data() {
    return {
      activeTabName: '',
      loading: false,
      teamIDs: [],
      teamIDsOptions: [],
      teamIDsParams: {},

      optionAll: 'ALL',

      reportYearParams: {},
      reportYears: [],
      reportYearOptions: [],
      reportDocTypes: [],

      criticalFlagged: false,

      progressSummary: {
        completed: 0,
        toStart: 0,
        total: 0,
        flagged: 0,
      },

      totalFlaggedDialogVisible: false,
      flaggedFilter: {
        size: 10,
        page: 1,
      },
      flaggedSort: {
        published_time: 0,
      },
      flaggedData: [],
      flaggedTotal: 0,

      documentTablePage: 1,
      documentTableSize: 10,
      documentTableTotal: 0,

      documentFilter: {
        stock_code: '',
        financial_year: '',
        desc: 0,
        size: 10,
        page: 1,
      },
      documentSort: {
        stock_code: 0,
        company_name: 0,
        published_time: 0,
        release_date: 0,
      },
      documentSummary: [],
      documentTotal: 0,

      documentFlows: [],
      documentFlowsTotal: 0,

      hkexReportType,
      defaultDocumentViewType: FILTER_TYPE.LATEST_3_MONTHS,

      lastScrollTop: 0,
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType', 'isDelisted']),
    ...mapGetters('hkexModule/ruleModule', ['rules']),
    showSummaryTeam() {
      return [this.isArReport, this.isCgReport].includes(this.auditType);
    },
    progressCompletedPercent() {
      if (
        this.progressSummary.completed === 0 &&
        this.progressSummary.toStart === 0
      ) {
        return 50;
      }

      return (
        (this.progressSummary.completed /
          (this.progressSummary.completed + this.progressSummary.toStart)) *
        100
      ).toFixed(2);
    },
    showDocumentTable() {
      return this.reportYearOptions.length > 0;
    },
    showDocumentViewFilter() {
      return this.isQrReport || this.isAgmReport || this.isPollReport;
    },
    documentViewTable() {
      switch (this.auditType) {
        case 'qr':
          return 'DocumentViewTableForQr';
        case 'agm':
          return 'DocumentViewTableForAgm';
        case 'poll':
          return 'DocumentViewTableForAgm';
        default:
          return 'DocumentViewTable';
      }
    },
    documentViewFilterTypes() {
      return [
        {
          value: FILTER_TYPE.LATEST_3_MONTHS,
          label: FILTER_TYPE.LATEST_3_MONTHS,
        },
        {
          value: FILTER_TYPE.ADVANCED_SEARCH,
          label:
            this.isAgmReport || this.isPollReport
              ? FILTER_TYPE.ALL
              : FILTER_TYPE.ADVANCED_SEARCH,
        },
      ];
    },
    isLatest3monthsMode() {
      return this.defaultDocumentViewType === FILTER_TYPE.LATEST_3_MONTHS;
    },
    showAdvancedSearchOptions() {
      return this.defaultDocumentViewType === FILTER_TYPE.ADVANCED_SEARCH;
    },
    showSearchInput() {
      return this.isAgmReport || this.isPollReport;
    },
  },
  watch: {
    auditType() {
      this.$refs['hkex-home'].scrollTop = 0;
      this.resetProgressSummaryFilter();
      this.resetDocumentFilter();
      saveDataInStorage({ page: 1 });
      this.init();
    },
    isDelisted() {
      saveDataInStorage({ page: 1 });
      this.init();
    },
  },
  methods: {
    async init() {
      this.loading = true;
      await Promise.all([this.fetchReportYears(), this.fetchTeamIDs()]);
      this.setActiveTabName();
      this.initFilterOptions();
      this.fetchSummaryAndFlagged();
      this.fetchDocumentTableData();
    },
    scroll(e) {
      const homeEl = e.target;
      const summaryEl = homeEl.querySelector('.hkex-v2-summary');
      const viewEl = homeEl.querySelector('.hkex-v2-document-view');

      if (!summaryEl) {
        return;
      }

      const scrollTop = homeEl.scrollTop;

      if (scrollTop > this.lastScrollTop) {
        if (summaryEl.classList.contains('scrolling')) {
          return;
        }
        summaryEl.classList.add('scrolling');
        viewEl.classList.add('scrolling');
      } else {
        summaryEl.classList.remove('scrolling');
        viewEl.classList.remove('scrolling');
      }

      this.lastScrollTop = scrollTop;
    },
    fetchSummaryAndFlagged() {
      if (!(this.isQrReport || this.isAgmReport || this.isPollReport)) {
        this.fetchProgressSummary();
        this.fetchTotalFlagged();
      }
    },
    initFilterOptions() {
      const storageData = readDataFromStorage();
      if (storageData) {
        this.defaultDocumentViewType =
          storageData.viewType || this.defaultDocumentViewType;
        this.teamIDs = storageData.teamIDs || this.teamIDs;
        this.reportYears = storageData.reportYears || this.reportYears;
        this.teamIDsParams = this.handleSelectAll(
          this.teamIDs,
          'team_ids',
        ).selectedOptionParams;
        this.reportYearParams = this.handleSelectAll(
          this.reportYears,
          'financial_year',
        ).selectedOptionParams;
        this.documentFilter.stock_code = storageData.stockCode;
        this.criticalFlagged =
          storageData.criticalFlagged || this.criticalFlagged;
        this.documentFilter.page = storageData.page || this.documentFilter.page;
        this.documentFilter.size = storageData.size || this.documentFilter.size;
      }
    },
    updateByReportYear(years) {
      const { selectedOptions, selectedOptionParams } = this.handleSelectAll(
        years,
        'financial_year',
      );
      this.reportYears = selectedOptions;
      this.reportYearParams = selectedOptionParams;
      this.documentFilter.page = 1;
      saveDataInStorage({ reportYears: selectedOptions, page: 1 });
      this.fetchSummaryAndFlagged();
      this.fetchDocumentTableData();
    },
    updateByTeamIDs(ids) {
      const { selectedOptions, selectedOptionParams } = this.handleSelectAll(
        ids,
        'team_ids',
      );
      this.teamIDs = selectedOptions;
      this.teamIDsParams = selectedOptionParams;
      this.documentFilter.page = 1;
      saveDataInStorage({ teamIDs: selectedOptions, page: 1 });
      this.fetchSummaryAndFlagged();
      this.fetchDocumentTableData();
    },
    changeTab(tab) {
      this.activeTabName = tab.name;
      this.$router.push(this.activeTabName);
    },
    setActiveTabName() {
      const currentTabName = this.$route.path.split('/').at(-1);
      this.activeTabName = currentTabName;
    },
    handleSelectAll(options, paramKey) {
      let selectedOptions = [...options];
      let selectedOptionParams = {};

      if (options.includes(this.optionAll)) {
        if (options[0] === this.optionAll && options.length > 1) {
          selectedOptions.shift();
        } else {
          selectedOptions = [this.optionAll];
        }
      }
      if (selectedOptions.length > 0 && selectedOptions[0] !== this.optionAll) {
        selectedOptionParams = { [paramKey]: selectedOptions.join(',') };
      }

      return { selectedOptions, selectedOptionParams };
    },
    changeCriticalFlag() {
      this.documentFilter.page = 1;
      saveDataInStorage({ criticalFlagged: this.criticalFlagged, page: 1 });
      this.fetchDocumentTableData();
    },
    async fetchReportYears() {
      try {
        const data = await this.$store.dispatch(
          'hkexModule/fetchReportYears',
          omitBy(
            {
              dt: hkexReportType[this.auditType].value,
              delist: this.isDelisted ? 1 : '',
            },
            (v) => v === undefined || v === '',
          ),
        );
        this.reportYearOptions = [this.optionAll].concat(data.year);
        this.reportDocTypes = data.doc_types;
        this.reportYears = [this.reportYearOptions[0]];
      } catch (error) {
        this.notifyError(error, 'Failed to get report years.');
      }
    },
    async fetchProgressSummary() {
      try {
        const data = await this.$store.dispatch(
          'hkexModule/fetchProgressSummary',
          omitBy(
            {
              ...this.teamIDsParams,
              ...this.reportYearParams,
              dt: this.auditType,
              delist: this.isDelisted ? 1 : '',
            },
            (v) => v === undefined || v === '',
          ),
        );

        this.progressSummary.completed = data.completed_ar_cnt;
        this.progressSummary.toStart = data.to_start_ar_cnt;
        this.progressSummary.total = data.total_ar_cnt;
        this.progressSummary.flagged = data.total_flagged_cnt;
      } catch (error) {
        this.notifyError(error, 'Failed to get progress summary data.');
      }
    },
    async fetchTeamIDs() {
      try {
        const data = await this.$store.dispatch('hkexModule/fetchTeamIDs');
        const allTeams = { label: 'All teams', value: this.optionAll };
        const teamIDs = data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        this.teamIDsOptions = [allTeams].concat(teamIDs);
        this.teamIDs = [this.optionAll];
      } catch (error) {
        this.notifyError(error, 'Failed to get team ids.');
      }
    },
    async fetchTotalFlagged() {
      let sorted_by, desc;

      const sortedItem = pickBy(this.flaggedSort, (v) => v === 1);
      if (!isEmpty(sortedItem)) {
        sorted_by = Object.entries(sortedItem)[0][0];
        desc = Object.entries(sortedItem)[0][1];
      }

      try {
        const data = await this.$store.dispatch(
          'hkexModule/fetchFlaggedData',
          omitBy(
            {
              sorted_by,
              desc,
              ...this.flaggedFilter,
              ...this.teamIDsParams,
              ...this.reportYearParams,
              dt: this.auditType,
              delist: this.isDelisted ? 1 : '',
            },
            (v) => v === undefined || v === '',
          ),
        );
        this.flaggedData = data.items.map((item) => {
          item.published_time_str = this.$options.filters.date(
            Number(item.published_time),
          );
          return item;
        });
        this.flaggedTotal = data.total;
      } catch (error) {
        this.notifyError(error, 'Failed to get progress summary data.');
      }
    },
    sortTotalFlagged(sort_by) {
      this.flaggedSort = {
        stock_code: 0,
        company_name: 0,
        published_time: 0,
      };
      const updateSort = this.flaggedSort[sort_by] === 0 ? 1 : 0;
      this.flaggedSort[sort_by] = updateSort;
      this.fetchTotalFlagged();
    },
    changeTotalFlaggedSize(size) {
      this.flaggedFilter.size = size;
      this.fetchTotalFlagged();
    },

    async fetchDocumentTableData() {
      if (this.isQrReport) {
        const documentFlows = await this.fetchDocumentFlows();
        const documentFlowsItems = documentFlows.items || [];
        documentFlowsItems.forEach((item) => {
          this.setCompleteAndFlagged(item);
        });

        this.documentFlows = documentFlows.items;

        this.setDocumentTablePager(documentFlows);

        return;
      }

      if (this.isAgmReport || this.isPollReport) {
        const res = await this.fetchAgmDocFlows({ dt: this.auditType });
        this.documentFlows = res.items || [];
        this.setDocumentTablePager(res);
        return;
      }

      let [data, summary] = await Promise.all([
        this.fetchDocumentData(),
        this.fetchDocumentSummary(),
      ]);

      this.setDocumentTablePager(data);

      const summaryItemMap = !this.isQrReport
        ? {
            available_ar_count: !this.isQrReport
              ? `Available ${this.auditType.toUpperCase()}s`
              : 'Available Reports',
            to_be_released_ar_count: !this.isQrReport
              ? `${this.auditType.toUpperCase()}s to be released`
              : 'Reports to be released',
            flagged_ar_count: 'Flagged',
          }
        : {};

      if (this.isDelisted) {
        delete summaryItemMap.to_be_released_ar_count;
      }

      this.documentSummary = [].concat(
        data.items.map((item) => {
          item.type = 'detail';

          this.setCompleteAndFlagged(item);

          item.related_ars_map = {};

          if (Array.isArray(item.related_ars)) {
            item.related_ars.forEach((ar) => {
              item.related_ars_map[ar.financial_year] = ar;

              this.setCompleteAndFlagged(ar);

              ar['published_time_str'] = this.$options.filters.date(
                Number(ar.published_time),
              );
            });
          } else {
            for (const obj in item.related_ars) {
              item.related_ars[obj].forEach((ar) => {
                if (ar[1].ar_status) {
                  this.setCompleteAndFlagged(ar[1]);
                }
              });
            }
          }

          return item;
        }),
        Object.keys(summaryItemMap).map((key) => {
          const countYearly = {};
          Object.keys(summary).forEach((summaryKey) => {
            if (!this.isQrReport) {
              countYearly[summaryKey] =
                summary[summaryKey][key] !== undefined
                  ? summary[summaryKey][key]
                  : '-';
            } else {
              countYearly[summaryKey] = summary[summaryKey].map(
                (i) => i[1][key],
              );
            }
          });

          return {
            type: 'summary',
            title: summaryItemMap[key],
            countYearly,
          };
        }),
      );
    },
    setDocumentTablePager(pager) {
      this.documentTableTotal = pager.total;
      this.documentTablePage = pager.page;
      this.documentTableSize = pager.size;
    },
    setCompleteAndFlagged(targetObj) {
      const statusMap = {
        not_available: 0,
        available: 1,
        complete: 3,
        flagged: 5,
        complete_flagged: 7,
      };
      targetObj['available'] =
        [
          statusMap.available,
          statusMap.complete,
          statusMap.flagged,
          statusMap.complete_flagged,
        ].indexOf(targetObj.ar_status) > -1;
      targetObj['complete'] =
        [statusMap.complete, statusMap.complete_flagged].indexOf(
          targetObj.ar_status,
        ) > -1;
      targetObj['flagged'] =
        [statusMap.flagged, statusMap.complete_flagged].indexOf(
          targetObj.ar_status,
        ) > -1;
    },
    async fetchDocumentData() {
      let sorted_by;

      const sortedItem = pickBy(this.documentSort, (v) => v === 1);
      if (!isEmpty(sortedItem)) {
        sorted_by = Object.entries(sortedItem)[0][0];
        if (sorted_by === 'release_date') {
          sorted_by = 'published_time';
        }
      }

      try {
        this.loading = true;

        const data = await this.$store.dispatch(
          'hkexModule/fetchDocumentData',
          omitBy(
            {
              sorted_by,
              ...this.documentFilter,
              ...this.teamIDsParams,
              dt: this.auditType,
              delist: this.isDelisted ? 1 : '',
            },
            (v) => v === undefined || v === '',
          ),
        );

        if (!data.items) {
          return { items: [], total: 0 };
        } else {
          return data;
        }
      } catch (error) {
        this.notifyError(error, 'Failed to get document data.');
        return { items: [], total: 0 };
      } finally {
        this.loading = false;
      }
    },
    async fetchDocumentSummary() {
      try {
        return await this.$store.dispatch(
          'hkexModule/fetchDocumentSummary',
          omitBy(
            {
              stock_code: this.documentFilter.stock_code,
              ...this.teamIDsParams,
              dt: this.auditType,
              delist: this.isDelisted ? 1 : '',
            },
            (v) => v === undefined || v === '',
          ),
        );
      } catch (error) {
        this.notifyError(error, 'Failed to get document summary data.');
        return {};
      }
    },
    async fetchDocumentFlows() {
      let order_by;

      const sortedItem = pickBy(this.documentSort, (v) => v === 1);
      if (!isEmpty(sortedItem)) {
        order_by = Object.entries(sortedItem)[0][0];
        if (order_by === 'published_time') {
          order_by = 'release_date';
        }
      }

      try {
        this.loading = true;

        const params = {
          order_by,
          ...this.documentFilter,
          ...this.teamIDsParams,
          ...this.reportYearParams,
          desc: this.documentFilter.desc === 0 ? 1 : 0,
          pre_month: this.isLatest3monthsMode ? 3 : '',
          critical_only: this.criticalFlagged ? 1 : 0,
          delist: this.isDelisted ? 1 : '',
        };

        if (this.isLatest3monthsMode) {
          delete params.financial_year;
          delete params.stock_code;
        }

        const data = await this.$store.dispatch(
          'hkexModule/fetchDocumentFlows',
          omitBy(params, (v) => v === undefined || v === ''),
        );
        this.documentFlows = data.items;

        return data;
      } catch (error) {
        this.notifyError(error, 'Failed to get document data.');
      } finally {
        this.loading = false;
      }
    },
    async fetchAgmDocFlows({ dt = 'agm' }) {
      let order_by;

      const sortedItem = pickBy(this.documentSort, (v) => v === 1);
      if (!isEmpty(sortedItem)) {
        order_by = Object.entries(sortedItem)[0][0];
        if (order_by === 'published_time') {
          order_by = 'release_time';
        }
      }

      try {
        this.loading = true;
        const params = {
          order_by,
          page: this.documentFilter.page,
          page_size: this.documentFilter.size,
          teams: this.teamIDsParams.team_ids,
          calendar_years: this.reportYearParams.financial_year,
          stock_code: this.documentFilter.stock_code,
          desc: this.documentFilter.desc === 0 ? 1 : 0,
          pre_month: this.isLatest3monthsMode ? 3 : '',
        };

        if (this.isLatest3monthsMode) {
          delete params.calendar_years;
        }

        let data = {};
        if (dt === 'poll') {
          data = await fetchPollDocFlows(
            omitBy(params, (v) => v === undefined || v === ''),
          );
        } else {
          data = await fetchAgmDocFlows(
            omitBy(params, (v) => v === undefined || v === ''),
          );
        }
        this.documentFlows = data.items;

        return data;
      } catch (error) {
        this.notifyError(error, 'Failed to get document data.');
      } finally {
        this.loading = false;
      }
    },
    sortDocument(sort_by, year) {
      const updateSort = 1;

      const documentSort = {
        stock_code: 0,
        company_name: 0,
        published_time: 0,
        release_date: 0,
      };
      documentSort[sort_by] = updateSort;

      this.documentFilter.desc = this.documentFilter.desc === 0 ? 1 : 0;
      this.documentFilter.financial_year = year;
      this.documentFilter.page = 1;

      this.documentSort = documentSort;
      this.fetchDocumentTableData();
    },
    changeDocumentPage(page) {
      this.documentFilter.page = page;
      saveDataInStorage({ page });
      this.fetchDocumentTableData();
    },
    changeDocumentSize(size) {
      this.documentFilter.size = size;
      saveDataInStorage({ size });
      this.fetchDocumentTableData();
    },
    searchDocumentTableData(eventName) {
      const stockCode = this.documentFilter.stock_code;
      this.documentFilter.page = 1;
      if (eventName === 'input') {
        if (stockCode === '') {
          this.fetchDocumentTableData();
        }
        return;
      }
      if (stockCode !== '' && /^\d{1,5}$/.test(stockCode)) {
        this.documentFilter.stock_code = stockCode.padStart(5, '0');
      }
      saveDataInStorage({ stockCode: this.documentFilter.stock_code, page: 1 });
      this.fetchDocumentTableData();
    },
    openTotalFlaggedDialog() {
      this.totalFlaggedDialogVisible = true;
    },
    documentTableSpan({ row, columnIndex }) {
      if (row.type === 'summary') {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2,
          };
        }

        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 0,
          };
        }
      }
    },
    notifySuccess(message) {
      this.$notify({
        title: 'Success',
        message,
        type: 'success',
      });
    },
    notifyError(error, message) {
      this.$notify({
        title: 'Error',
        message: error.message || message,
        type: 'error',
      });
    },
    changeDocumentViewType(type) {
      this.defaultDocumentViewType = type;
      this.documentFilter.page = 1;
      saveDataInStorage({ viewType: type });
      this.fetchDocumentTableData();
    },
    getReportReviewLink(file) {
      const query = !this.isQrReport
        ? {
            schemaId: file.mold,
            rule: this.rules[0].rule,
            delist: this.isDelisted ? 1 : '',
          }
        : {};
      return {
        name: hkexReportType[this.auditType].reportReviewRouterName,
        params: {
          qid: file.qid,
        },
        query: {
          fileId: file.id,
          ...query,
        },
      };
    },
    resetDocumentFilter() {
      this.documentFilter = {
        ...this.documentFilter,
        desc: 0,
        size: 10,
        page: 1,
      };
    },
    resetProgressSummaryFilter() {
      this.teamIDs = [];
      this.reportYears = [];
      this.teamIDsParams = {};
      this.reportYearParams = {};
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';
@import '../common/hkex-global.scss';

.hkex-home {
  position: relative;
  overflow: auto;

  ::v-deep .el-tabs {
    position: sticky;
    top: 0;
    z-index: 9;
    background: #fff;
    padding-bottom: 10px;
    .el-tabs__nav-wrap {
      padding: 0 32px;
      &::after {
        height: 1px;
      }
      .el-tabs__item {
        &.is-active {
          color: $--color-primary;
          font-weight: bold;
        }
      }
      .el-tabs__active-bar {
        background-color: $--color-primary;
      }
    }
  }

  .hkex-v2-summary {
    position: absolute;
    top: 64px;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 32px 30px 32px;
    transition: all 0.4s ease-in-out;
    &.scrolling {
      top: -170px;
    }
  }

  header {
    padding-bottom: 20px;

    h2 {
      height: 28px;
      line-height: 28px;
      font-size: 24px;

      &::before {
        content: '';
        display: inline-block;
        margin-right: 8px;
        width: 20px;
        height: 20px;
        background: url('~@/images/summary.svg') center no-repeat;
      }
    }

    .left {
      display: flex;
      align-items: center;
    }

    .data-craw {
      margin-left: 20px;
      margin-top: 4px;
    }
  }
}

.hkex-v2-summary__fy-filter {
  display: flex;
  justify-content: space-around;

  > div {
    flex: 1;

    span {
      margin-right: 24px;
      font-size: 18px;
      font-weight: bold;
    }
    .teamid-selector {
      width: 260px;
      height: 32px;
      ::v-deep .el-select__tags {
        height: 24px;
        overflow-y: hidden;
      }
    }
  }
}

.hkex-v2-summary__progress {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-top: 24px;
  width: 900px;
}

.hkex-v2-progress-bar__title {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 8px;

  span {
    font-size: 18px;
    font-weight: bold;
  }
}

.hkex-v2-progress-bar__description {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-top: 8px;
  width: 400px;

  span {
    font-size: 18px;
    font-weight: bold;
    color: $--color-primary;

    em {
      font-size: 14px;
      font-style: normal;
      margin-left: 4px;
    }
  }
}

.hkex-v2-summary__progress_pair {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  margin-top: 24px;

  > div {
    position: relative;
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;

    &:first-of-type {
      dd {
        left: 200px;
      }
    }

    &:last-of-type {
      dd {
        left: 240px;
      }
    }
  }

  dt {
    line-height: 20px;
    font-size: 16px;
    font-weight: bold;
  }

  dd {
    position: absolute;
    font-size: 18px;
    font-weight: bold;
  }
}

.hkex-v2-summary__progress_flagged {
  dd {
    cursor: pointer;

    span {
      border-bottom: 2px solid $--color-red;
    }
  }

  .fa-flag {
    margin-left: 8px;

    &::before {
      font-size: 14px;
    }
  }
}

.hkex-v2-document-view {
  position: absolute;
  top: 230px;
  width: 100%;
  padding: 0 32px;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
  &.scrolling {
    top: 0;
    padding-top: 80px;
  }

  header {
    position: sticky;
    top: 64px;
    z-index: 2;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    min-height: 36px;
    background-color: #fff;

    > div {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
  }

  .view-exchange-header {
    position: sticky;
    top: 120px;
    z-index: 1;
    height: 90px;
    padding-bottom: 10px;
    background-color: #fff;
    .el-button {
      &:hover,
      &.active {
        color: #fff;
        background: $--color-primary;
      }
    }
    .search-bar {
      display: flex;
      padding: 20px 0 15px;
      > div {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-right: 30px;
        }
        .label {
          margin-right: 10px;
          font-weight: bold;
        }
        .el-select {
          height: 28px;
        }
        &.search-input {
          flex: 1;
          max-width: 400px;
        }
      }
    }
  }

  &.hkex-qr,
  &.hkex-agm,
  &.hkex-poll {
    top: 64px;
    ::v-deep .el-table {
      .el-table__header-wrapper {
        top: 220px;
      }
    }
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin: 25px 0;
  }

  ::v-deep .el-table {
    .el-input__suffix {
      right: 15px;
    }
  }
}

.hkex-v2-document-view__symbol {
  display: flex;
  flex-flow: row nowrap;
  font-size: 14px;

  > div {
    display: flex;
    flex-flow: row nowrap;
    margin-right: 16px;
  }

  dt {
    width: 20px;

    i::before {
      font-size: 12px;
    }
  }
}

.hkex-v2-document-view__table,
.hkex-v2-total-flagged__table {
  ::v-deep .el-table {
    overflow: initial;
    z-index: 0;
    .el-table__header-wrapper {
      position: sticky;
      top: 120px;
      z-index: 1;
    }
  }
  ::v-deep .el-table__header thead {
    .cell {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .el-button {
        flex: 1;
        margin-left: 0;
      }
    }

    tr:first-of-type th {
      padding: 0;
      height: 40px;
      background-color: $--color-primary;
      color: $--color-white;

      .cell {
        > span {
          min-width: 80px;
        }
      }

      .el-input {
        min-width: 220px;

        input {
          padding-left: 25px;
          border-radius: 0;
          text-overflow: ellipsis;
        }
      }

      .el-input__prefix {
        left: 3px;
      }
      .el-input__suffix {
        right: 3px;
      }
    }

    tr:nth-of-type(2) th {
      padding: 4px 0;
      background-color: $--color-grey-light;
      .el-button {
        padding: 4px;
        font-size: 14px;
        color: $--color-black-light;
        white-space: initial;
        line-height: initial;
        .el-icon-caret-top,
        .el-icon-caret-bottom {
          &.active {
            color: $--color-blue;
          }
        }
      }
    }
  }

  ::v-deep .el-table__row {
    :is(a) {
      color: $--color-primary;
      font-weight: bold;
      font-size: 13px;

      i {
        &::before {
          font-size: 12px;
        }

        &.fa-flag {
          color: $--color-red;
        }
      }
    }
  }
}

::v-deep .hkex-v2-document-view__table-item_unavailable {
  color: $--color-blue;
  font-weight: bold;
  font-size: 13px;
}

::v-deep .hkex-v2-document-view__table-pagination,
.hkex-v2-total-flagged__table-pagination {
  display: flex;
  justify-content: center;
  margin: 25px 0 0 0;

  ::v-deep .el-pager {
    li:not(.disabled).active {
      background-color: $--color-white;
      border: 1px solid $--color-primary;
      color: $--color-primary;
    }
  }
}

.hkex-v2-upload-annual-report__tabs {
  margin-bottom: 20px;
  .tab-pane-tips {
    > i {
      margin-left: 10px;
      color: $--color-warning;
    }
  }
}

.hkex-tooltip-popper-in-tabs {
  width: 200px;
}

.fas {
  margin: 0 2px;
  &::before {
    color: $--color-black-light;
  }

  &.fa-flag::before {
    color: $--color-red;
  }
}
</style>
