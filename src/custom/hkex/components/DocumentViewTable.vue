<template>
  <div class="hkex-v2-document-view__table">
    <el-table
      v-show="showDocumentTable"
      :data="documentSummary"
      :span-method="documentTableSpan"
      stripe>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <span>Stock Code</span>
          <el-input
            size="small"
            prefix-icon="el-icon-search"
            :value="documentFilter.stock_code"
            placeholder="Please input stock code or company name"
            clearable
            @clear="searchDocumentTableData"
            @keyup.enter.native="searchDocumentTableData"
            @input="updateDocumentFilterStockCode"></el-input>
        </template>
        <el-table-column align="center" min-width="125px">
          <template slot="header" slot-scope="slot">
            <el-button type="text" @click="sortDocument('stock_code')">
              Stock Code
              <i
                :class="[
                  documentSort.stock_code === 1 && documentFilter.desc === 1
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-top',
                  documentSort.stock_code === 1 ? 'active' : '',
                ]"></i>
            </el-button>
          </template>

          <template slot-scope="scope">
            <span v-if="scope.row.type === 'detail'">{{
              scope.row.stock_code
            }}</span>
            <span v-if="scope.row.type === 'summary'">{{
              scope.row.title
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="210px">
          <template slot="header" slot-scope="scope">
            <el-button type="text" @click="sortDocument('company_name')">
              Company Name
              <i
                :class="[
                  documentSort.company_name === 1 && documentFilter.desc === 1
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-top',
                  documentSort.company_name === 1 ? 'active' : '',
                ]"></i>
            </el-button>
          </template>

          <template slot-scope="scope">
            <span v-if="scope.row.type === 'detail'">{{
              scope.row.company_name
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        v-for="year in reportYearOptions"
        :key="year"
        :label="String(year)"
        align="center">
        <template slot="header" slot-scope="scope">
          {{ year }}
        </template>
        <el-table-column align="center" min-width="160px">
          <template slot="header" slot-scope="scope">
            <el-button
              type="text"
              @click="sortDocument('published_time', year)">
              Date Released
              <i
                :class="[
                  documentFilter.desc === 1 &&
                  documentFilter.financial_year === year
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-top',
                  documentSort.published_time === 1 &&
                  documentFilter.financial_year === year
                    ? 'active'
                    : '',
                ]"></i>
            </el-button>
          </template>

          <template slot-scope="scope">
            <div v-if="scope.row.type === 'detail'">
              <router-link
                v-if="
                  scope.row.related_ars_map[year] &&
                  scope.row.related_ars_map[year].available
                "
                :to="{
                  name: reportReviewRouterName,
                  params: {
                    qid: scope.row.related_ars_map[year].question_id,
                  },
                  query: {
                    fileId: scope.row.related_ars_map[year].file_id,
                    schemaId: scope.row.related_ars_map[year].mold_id,
                    rule: rules[0] && rules[0].rule,
                    delist: isDelisted ? 1 : 0,
                  },
                }">
                <i
                  v-if="scope.row.related_ars_map[year].flagged"
                  class="fas fa-flag"></i>
                {{ scope.row.related_ars_map[year].published_time_str }}
              </router-link>

              <span
                v-else
                class="hkex-v2-document-view__table-item_unavailable">
                Not Available
              </span>
            </div>

            <div v-if="scope.row.type === 'summary'">
              <span>{{
                scope.row.countYearly[year] !== undefined
                  ? scope.row.countYearly[year]
                  : '-'
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { hkexReportType } from '@/store/constants';

export default {
  name: 'document-view-for-annual-report-checking',
  props: {
    showDocumentTable: {
      type: Boolean,
      required: false,
      default: true,
    },
    documentSummary: {
      type: Array,
      required: true,
    },
    documentFilter: {
      type: Object,
      required: true,
    },
    documentSort: {
      type: Object,
      required: true,
    },
    reportYearOptions: {
      type: Array,
      required: true,
    },
    documentTableSpan: {
      type: Function,
      required: true,
    },
    searchDocumentTableData: {
      type: Function,
      required: true,
    },
    sortDocument: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType', 'isDelisted']),
    ...mapGetters('hkexModule/ruleModule', ['rules']),
    reportReviewRouterName() {
      return hkexReportType[this.auditType].reportReviewRouterName;
    },
  },
  methods: {
    updateDocumentFilterStockCode(value) {
      this.$emit('update:documentFilter', {
        ...this.documentFilter,
        stock_code: value,
      });
    },
  },
};
</script>

<style></style>
