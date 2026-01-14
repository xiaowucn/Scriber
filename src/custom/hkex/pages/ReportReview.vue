<template>
  <el-container class="annual-report-review-wrapper">
    <el-header class="header">
      <div
        :style="{ width: pdfAsideWidth }"
        :class="['header-left', collapsed ? 'collapsed' : '']">
        <div v-if="fileMeta" class="report-detail-title">
          <div class="stock-code-content">
            <span class="label">Stock Code</span>
            <span>
              <el-input
                size="small"
                v-model="stockCode"
                @change="changeReportQuery"></el-input>
            </span>
            <span class="company-name">{{ fileMeta.name }}</span>
          </div>
          <div class="report-year">
            <span class="label">
              {{
                isAgmReport || isPollReport ? 'Calendar Year' : 'Report Year'
              }}
            </span>
            <span>
              <el-input
                size="small"
                v-model="reportYear"
                @change="changeReportQuery"></el-input>
            </span>
          </div>
          <div v-if="isAgmReport || isPollReport" class="report-type">
            <span class="label">Published</span>
            <el-select
              v-model="currentDocId"
              size="mini"
              class="doc-select"
              @change="changePublishedDoc">
              <el-option
                v-for="doc in currentYearDocs"
                :key="doc.fid"
                :value="doc.fid"
                :label="formatDate(doc.release_time)">
              </el-option>
            </el-select>
          </div>
          <div v-if="isGmlSub1 && fileTypeOption.length > 0">
            <el-select
              v-model="currentFileId"
              size="mini"
              class="file-select"
              @change="changeFile">
              <el-option
                v-for="file in fileTypeOption"
                :key="file.value"
                :value="file.value"
                :label="file.label">
              </el-option>
            </el-select>
          </div>
          <div v-if="isEsgReport" class="report-type">
            <span class="label">Type</span>
            <span>{{ getReportType(fileMeta.doc_type) }}</span>
          </div>
        </div>
        <el-popover
          width="400"
          placement="bottom-end"
          :offset="10"
          popper-class="results-annoucement-checking-popover"
          trigger="hover"
          v-if="currentFileId === fileId">
          <div v-if="fileMeta" class="content">
            <template v-if="isEsgReport">
              <p>
                <span>Publish time:</span>
                <span>{{ formatterPublished(fileMeta.published) }}</span>
              </p>
              <p>
                <span>Financial year end:</span>
                <span>{{ fileMeta.year_end }}</span>
              </p>
              <p>
                <span>Headline/title:</span>
                <span>{{ fileMeta.title }}</span>
              </p>
            </template>
            <template v-else>
              <p v-if="!(isAgmReport || isPollReport)">
                <span>Last AR:</span>
                <span>{{ fileMeta.last_ar }}</span>
              </p>
              <p>
                <span>Published:</span>
                <span>{{ formatterPublished(fileMeta.published) }}</span>
              </p>
              <p>
                <span>Financial Year-end:</span>
                <span>{{ fileMeta.year_end }}</span>
              </p>
            </template>
          </div>
          <el-button
            slot="reference"
            type="text"
            size="mini"
            circle
            icon="el-icon-more"
            class="info-more"></el-button>
        </el-popover>
        <el-button
          type="text"
          size="small"
          class="collapsed-button"
          title="Collapse right side area"
          @click="switchCollapsed">
          <i v-if="collapsed" class="fas fa-angle-double-left"></i>
          <i v-else class="fas fa-angle-double-right"></i>
        </el-button>
      </div>
      <div :class="['header-right', collapsed ? 'collapsed' : '']">
        <div class="score-content">
          <div v-if="isArReport" class="item">
            <span>Score for This AR:</span>
            <span>{{ ruleScore.score_for_this_ar }}</span>
          </div>
          <div v-if="!(isAgmReport || isPollReport)" class="item">
            <span>Flag for Follow-up:</span>
            <span
              :class="['flag', isFlagged ? 'active' : '']"
              @click="flagAnnualReport('flagged')"
              ><i v-show="isFlagged" class="fas fa-flag"></i
            ></span>
          </div>
          <div v-if="isArReport" class="item">
            <span>Predicted Score:</span>
            <span>{{ ruleScore.predicted_score }}</span>
          </div>
        </div>
      </div>
    </el-header>
    <report-review-details
      v-if="showReportReviewDetails"
      :pdf-aside-width="pdfAsideWidth"
      :current-file-id="currentFileId"
      :file-type-option="fileTypeOption"
      :is-select-change-pdf="isSelectChangePdf"
      @change-current-file="changeCurrentFile"
      @clear-pdf-status="isSelectChangePdf = false"
      @rule-changed="handleRuleChanged">
    </report-review-details>
  </el-container>
</template>

<script>
import _ from 'lodash';
import { hkexReportType, GML_SPECIAL_RULE } from '@/store/constants';
import ReportReviewDetails from '../components/ReportReviewDetails';
import ReportTypeMixin from '../mixins/ReportType.mixin';
import ReportReviewMixin from '../mixins/ReportReview.mixin';
import { mapGetters } from 'vuex';
import { checkUnsubmitAnswer } from '../common/utils';
import {
  fetchAgmDocs,
  fetchPollDocs,
  fetchPollMeta,
} from '@/store/api/hkex.api';

const reportTypeMap = {
  1: 'Annual Report',
  2: 'ESG Report',
};

const GML_SUB_1 = 'General mandate limit';

export default {
  name: 'annual-report-review',
  components: {
    ReportReviewDetails,
  },
  mixins: [ReportTypeMixin, ReportReviewMixin],
  data() {
    return {
      pdfAsideWidth: '60%',
      stockCode: '',
      reportYear: null,
      isFlagged: false,
      isMarked: false,
      collapsed: false,
      currentDocId: null,
      currentYearDocs: [],
      fileTypeOption: [],
      currentFileId: null,
      currentSub: GML_SUB_1,
      isSelectChangePdf: false,
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType', 'isDelisted']),
    ...mapGetters('hkexModule/ruleModule', ['rules']),
    ...mapGetters('hkexModule/reportReviewModule', ['fileMeta', 'ruleScore']),
    qid() {
      return this.$route.params.qid;
    },
    fileId() {
      return Number(this.$route.query.fileId);
    },
    schemaId() {
      return this.$route.query.schemaId;
    },
    showReportReviewDetails() {
      return (
        this.qid && this.fileId && this.schemaId && !_.isEmpty(this.fileMeta)
      );
    },
    rule() {
      return this.$route.query.rule;
    },
    isGmlRule() {
      return this.rule === GML_SPECIAL_RULE;
    },
    isGmlSub1() {
      return this.isGmlRule && this.currentSub === GML_SUB_1;
    },
  },
  watch: {
    $route(value, prevValue) {
      const { qid } = value.params;
      const { qid: prevQid } = prevValue.params;
      const { rule } = value.query;
      this.currentSub = GML_SUB_1;
      if (rule !== GML_SPECIAL_RULE) {
        this.changeFile(this.fileId);
      } else {
        this.getPollMeta();
      }
      if (qid !== prevQid) {
        this.init();
      }
    },
    fileId: {
      handler() {
        this.currentFileId = this.fileId;
      },
      immediate: true,
    },
  },
  async created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getFileMeta();
      if (this.isAgmReport || this.isPollReport) {
        await this.getPublishedDocs({
          stock_code: this.stockCode.padStart(5, '0'),
          calendar_year: this.reportYear,
        });
      }
      if (
        (this.isArReport || this.isAgmReport || this.isPollReport) &&
        this.fileMeta
      ) {
        this.getRuleScore();
        this.getRuleHistory();
      }
      if (this.isArReport || this.isEsgReport || this.isCgReport) {
        this.getAnnualReportMarkedStatus();
      }
      if (this.isGmlRule) {
        this.getPollMeta();
      }
    },
    formatterPublished(date) {
      if (!date) {
        return '';
      }
      let formatDate = date.split('T')[0];
      let dateString = new Date(formatDate).toDateString().split(' ');
      let month = dateString[1];
      let day = dateString[2];
      let year = dateString[3];
      return `${day} ${month} ${year}`;
    },
    isValidQuery() {
      let reg = /^\d+$/;
      if (
        this.reportYear.length === 4 &&
        reg.test(this.reportYear) &&
        reg.test(this.stockCode)
      ) {
        return true;
      } else {
        this.$notify({
          title: 'Warning',
          message: 'The format is incorrect, please input again',
          type: 'warning',
        });
        return false;
      }
    },
    async changeReportQuery() {
      if (checkUnsubmitAnswer()) {
        this.init();
        return;
      }

      if (this.isValidQuery()) {
        try {
          this.shouldReloadQuestionHKEX = true; // 需要重新初始化本页面
          let resp = {};

          if (this.isAgmReport || this.isPollReport) {
            const data = await this.getPublishedDocs({
              stock_code: this.stockCode.padStart(5, '0'),
              calendar_year: this.reportYear,
            });
            resp = { data: data };
          } else {
            resp = await this.$store.dispatch(
              'hkexModule/reportReviewModule/fetchQuestionMetaByQuery',
              {
                reportYear: this.reportYear,
                stockCode: this.stockCode.padStart(5, '0'),
                dt: this.auditType,
              },
            );
          }

          if (resp.data.length === 0) {
            this.$alert('No data', 'Tips', {
              confirmButtonText: 'OK',
            });

            return;
          }

          const { file_id, fid, question_id, qid, mold_id } = resp.data[0];
          const routeParams = {
            name: hkexReportType[this.auditType].reportReviewRouterName,
            params: { qid: question_id || qid },
            query: {
              fileId: file_id || fid,
              schemaId: mold_id,
              rule: this.$route.query.rule || this.rules[0].rule,
            },
          };
          this.$router.push(routeParams);
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async getPublishedDocs(params) {
      const fetchMeta = (params) => {
        if (this.isAgmReport) {
          return fetchAgmDocs(params);
        }
        if (this.isPollReport) {
          return fetchPollDocs(params);
        }
      };

      const res = await fetchMeta(params);

      this.currentYearDocs = res;
      this.currentDocId = Number(this.$route.query.fileId);

      return res;
    },
    async getPollMeta() {
      try {
        const res = await fetchPollMeta({
          file_id: this.fileId,
          mold_id: this.schemaId,
        });
        this.fileTypeOption = [];
        if (res.poll) {
          this.fileTypeOption.push({
            value: res.poll.fid,
            label: 'AGM Poll Results',
            release_time: res.poll.release_time,
            report_year: res.poll.report_year,
            published: res.poll.published,
          });
        }
        if (res.mr?.fid) {
          this.fileTypeOption.push({
            value: res.mr.fid,
            label: 'Monthly Return',
            release_time: res.mr.release_time,
            report_year: res.mr.report_year,
            published: res.mr.published,
          });
        }
        if (res.agm?.fid) {
          this.fileTypeOption.push({
            value: res.agm.fid,
            label: 'AGM Circular',
            release_time: res.agm.release_time,
            report_year: res.agm.report_year,
            published: res.agm.published,
          });
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    changeFile(id) {
      this.currentFileId = id;
      const currentFile = this.fileTypeOption.find((item) => item.value === id);
      if (!currentFile || this.currentDocId === id) {
        return;
      }
      this.reportYear = currentFile.report_year;
      if (id === this.fileId) {
        this.getPublishedDocs({
          stock_code: this.stockCode.padStart(5, '0'),
          calendar_year: this.reportYear,
        });
      } else {
        this.currentYearDocs = [
          {
            fid: id,
            release_time: currentFile.release_time,
          },
        ];
      }
      this.currentDocId = id;
      this.isSelectChangePdf = true;
    },
    changeCurrentFile({ index: currentSub, fid }) {
      if (currentSub) {
        this.currentSub = currentSub;
      }
      this.changeFile(fid);
    },
    changePublishedDoc(fileId) {
      const doc = this.currentYearDocs.find((doc) => doc.fid === fileId);

      if (!doc) {
        return;
      }

      const { fid, qid, mold_id } = doc;

      this.$router.push({
        name: hkexReportType[this.auditType].reportReviewRouterName,
        params: { qid },
        query: {
          fileId: fid,
          schemaId: mold_id,
          rule: this.$route.query.rule || this.rules[0].rule,
        },
      });
    },
    formatDate(timestamp) {
      const dateString = new Date(timestamp * 1000).toDateString().split(' ');
      return `${dateString[2]} ${dateString[1]}`;
    },
    async getExchangeVersionMeta() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchExchangeVersionMeta',
          {
            stockCode: this.stockCode,
            reportYear: this.reportYear,
          },
        );
        return res;
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async getFileMeta() {
      try {
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchQuestionMeta',
          {
            questionId: this.qid,
            params: {
              dt: this.auditType,
              delist: this.isDelisted ? 1 : 0,
            },
          },
        );
        if (this.fileMeta) {
          this.stockCode = this.fileMeta.stock_code;
          this.reportYear = this.fileMeta.report_year;
        }
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    getRuleScore() {
      try {
        this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchScoreSummary',
          {
            stockCode: this.stockCode,
            reportYear: this.reportYear,
          },
        );
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async getRuleHistory() {
      try {
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/getRuleHistoryList',
          {
            stockCode: this.fileMeta.stock_code,
            reportYear: this.fileMeta.report_year,
            delist: this.isDelisted ? 1 : 0,
          },
        );
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async getAnnualReportMarkedStatus() {
      try {
        const res = await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchAnnualReportMarkedStatus',
          {
            questionId: this.qid,
          },
        );
        switch (res.mark_status) {
          case 3:
            this.isMarked = true;
            break;
          case 5:
            this.isFlagged = true;
            break;
          case 7:
            this.isFlagged = true;
            this.isMarked = true;
            break;
          default:
            break;
        }
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async flagAnnualReport(name) {
      let message = '';
      let markedData = [];
      if (name === 'flagged') {
        markedData = [
          !this.isFlagged ? 'flagged' : null,
          this.isMarked ? 'completed' : null,
        ];
        message = this.isFlagged
          ? 'Unflagged successfully'
          : 'Flagged successfully';
        this.isFlagged = !this.isFlagged;
        this.$store.commit('hkexModule/SET_REPORT_YEAR', this.reportYear);
      } else {
        markedData = [
          this.isFlagged ? 'flagged' : null,
          !this.isMarked ? 'completed' : null,
        ];
        message = this.isMarked
          ? 'Unmarked successfully'
          : 'Marked successfully';
        this.isMarked = !this.isMarked;
      }
      await this.flagOrMarkAnnualReport(_.compact(markedData));
      this.$notify({
        title: 'Success',
        message: message,
        type: 'success',
      });
    },
    async flagOrMarkAnnualReport(markStatus) {
      try {
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/flagOrMarkAnnualReport',
          {
            markStatus,
            questionId: this.qid,
          },
        );
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    handleRuleChanged(rule) {
      this.$router.replace({
        name: hkexReportType[this.auditType].reportReviewRouterName,
        params: this.$route.params,
        query: Object.assign({}, this.$route.query, {
          rule: rule,
          delist: this.isDelisted ? 1 : 0,
        }),
      });
    },
    getReportType(type) {
      return reportTypeMap[type];
    },
  },
};
</script>
<style scoped lang="scss">
@import '../common/color.scss';
.annual-report-review-wrapper {
  height: 100vh;
  .header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    padding: 0;
    .header-left {
      position: relative;
      width: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: $--color-primary;
      color: rgba($--color-white, 0.8);
      padding: 10px 20px;
      box-sizing: border-box;
      &.collapsed {
        width: 100%;
      }
      .report-detail-title {
        display: flex;
        width: 90%;
        font-size: 13px;
        box-sizing: border-box;
        > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          &:not(last-child) {
            margin-right: 5px;
          }
          .label {
            margin-right: 8px;
          }
        }
        .stock-code-content {
          flex: 3;
          max-width: 30%;
          .label {
            margin-right: 5px;
            font-size: 13px;
          }
          .company-name {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0 5px;
            font-size: 12px;
          }
        }
        .report-year,
        .report-type {
          flex: 2;
          margin-left: 10px;
          .doc-select {
            ::v-deep .el-input__inner {
              width: 90px;
              padding-right: 30px;
            }
          }
        }
        .file-select {
          margin-left: 10px;
          ::v-deep .el-input__inner {
            width: 100%;
            max-width: 160px;
            min-width: 70px;
            padding-right: 30px;
          }
        }
        ::v-deep .el-input__inner {
          width: 70px;
          background: $--color-white;
          color: $--color-primary;
          border-radius: 0;
          font-size: 14px;
          font-weight: bold;
          padding: 0 10px;
          text-align: center;
        }
      }
      .report-message {
        width: 62%;
        h2 {
          margin: 8px 0 15px;
          font-size: 14px;
          font-weight: normal;
        }
        div {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          .label-info-number {
            display: block;
            color: $--color-white;
          }
        }
      }
      .info-more {
        padding: 3px;
        color: rgba($--color-white, 0.8);
        border: 1px solid rgba($--color-white, 0.8);
      }
      .collapsed-button {
        font-size: 20px;
        color: rgba($--color-white, 0.5);
        &:hover {
          color: rgba($--color-white, 0.7);
        }
      }
    }
    .header-right {
      display: flex;
      flex: 1;
      padding: 10px 20px;
      box-sizing: border-box;
      background: $--color-primary;
      color: $--color-white;
      &.collapsed {
        display: none;
      }
      .score-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        color: $--color-white;
        font-size: 14px;
        .item {
          flex: 1;
          &:last-child {
            text-align: end;
          }
          span {
            &.flag {
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              text-align: center;
              border: 1px solid $--color-white;
              vertical-align: middle;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
              &.active {
                background: $--color-white;
              }
            }
            .fas {
              font-size: 12px;
              transform: scale(0.8);
              &.fa-flag {
                color: $--color-red;
              }
              &.fa-check {
                color: $--color-primary;
              }
            }
            &:nth-child(odd) {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
