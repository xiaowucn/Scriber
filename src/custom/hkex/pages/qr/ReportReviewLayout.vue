<template>
  <el-container class="results-announcement-checking-wrapper">
    <el-header class="header">
      <div
        :style="{ width: pdfAsideWidth }"
        :class="['header-left', collapsed ? 'collapsed' : '']">
        <div class="header-info">
          <div class="stock-code">
            <label>Stock Code</label>
            <span v-if="fileMeta">
              <el-input
                size="small"
                v-model="stockCode"
                maxlength="5"
                @input="
                  (val) => {
                    stockCode = val.replace(/\D/g, '');
                  }
                "
                @change="changeReportQuery"></el-input>
            </span>
          </div>
          <div class="company-name">{{ fileMeta ? fileMeta.name : '' }}</div>
          <div class="report-year">
            <label>Report Year</label>
            <span v-if="fileMeta">
              <el-input
                size="small"
                v-model="reportYear"
                maxlength="4"
                @input="
                  (val) => {
                    reportYear = val.replace(/\D/g, '');
                  }
                "
                @change="changeReportQuery"></el-input>
            </span>
          </div>
          <div class="results-type">
            <label>Type of results</label>
            <el-select
              v-model="resultsType"
              size="small"
              placeholder=""
              v-loading="resultsTypeLoading"
              element-loading-spinner="el-icon-loading"
              @change="changeResultsType">
              <el-option
                v-for="(item, index) in resultsTypeOptions"
                :key="index"
                :label="item.doc_type"
                :value="item.qid">
              </el-option>
            </el-select>
          </div>
          <el-popover
            placement="bottom-end"
            width="450"
            popper-class="results-annoucement-checking-popover"
            trigger="hover">
            <div class="content">
              <p>
                <span>Publish time:</span>
                <span>{{ companyInfo.publish_time | date }}</span>
              </p>
              <p>
                <span>Financial year/period end:</span>
                <span>{{ companyInfo.year_end }}</span>
              </p>
              <p>
                <span>Headline/title:</span>
                <span>{{ companyInfo.title }}</span>
              </p>
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
      </div>
    </el-header>
    <report-review
      v-if="dcQid"
      :dc-qid="dcQid"
      :pdf-aside-width="pdfAsideWidth">
    </report-review>
  </el-container>
</template>

<script>
import _ from 'lodash';
import { hkexReportType } from '@/store/constants';
import ReportReview from './ReportReview.vue';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';
import { mapGetters } from 'vuex';
import { checkUnsubmitAnswer } from '../../common/utils';

export default {
  name: 'result-announcement-checking',
  components: {
    ReportReview,
  },
  mixins: [ReportReviewMixin],
  data() {
    return {
      stockCode: '',
      reportYear: null,
      isFlagged: false,
      isMarked: false,
      collapsed: false,
      qid: null,
      dcQid: null,
      fileId: null,
      resultsType: '',
      resultsTypeName: '',
      resultsTypeLoading: false,
      resultsTypeOptions: [],
    };
  },
  computed: {
    ...mapGetters('hkexModule', ['isDelisted']),
    ...mapGetters('hkexModule/reportReviewModule', ['fileMeta']),
    companyInfo() {
      const currentCompanyInfo = this.resultsTypeOptions.find(
        (option) => option.qid === this.resultsType,
      );
      return currentCompanyInfo || {};
    },
  },
  watch: {
    '$route.params.qid'() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.qid = Number(this.$route.params.qid);
      this.fileId = Number(this.$route.query.fileId);
      await this.getFileMeta();
      this.getQuarterReports();
    },
    async getFileMeta() {
      try {
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchQuestionMeta',
          {
            questionId: this.$route.params.qid,
            params: {
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
    async getQuarterReports() {
      try {
        this.resultsType = this.resultsTypeName;
        this.resultsTypeLoading = true;
        const data = await this.$store.dispatch(
          'hkexModule/fetchQuarterReports',
          {
            stockCode: this.stockCode,
            reportYear: this.reportYear,
            params: {
              delist: this.isDelisted ? 1 : 0,
            },
          },
        );
        this.resultsTypeOptions = data;
        const currentQr = data.find((item) => item.qid === this.qid);
        if (currentQr) {
          this.resultsType = currentQr.qid;
          this.resultsTypeName = currentQr.doc_type;
          this.dcQid = currentQr.dc_qid;
        }
        return data;
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.resultsTypeLoading = false;
      }
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
          title: 'Error',
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
          const data = await this.getQuarterReports();
          if (!data) {
            return;
          }
          if (data.length === 0) {
            this.$alert('No data', 'Tips', {
              confirmButtonText: 'OK',
            });
            return;
          }
          this.refreshRouter(data[0]);
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    changeResultsType(type) {
      if (checkUnsubmitAnswer()) {
        this.init();
        return;
      }

      const currentResult = this.resultsTypeOptions.find(
        (option) => option.qid === type,
      );
      this.refreshRouter(currentResult);
    },
    refreshRouter({ qid, fid, dc_qid }) {
      this.dcQid = dc_qid;
      this.$router.replace({
        name: hkexReportType.qr.reportReviewRouterName,
        params: { qid },
        query: { fileId: fid },
      });
    },
    async flagOrMarkAnnualReport(name) {
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
      try {
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/flagOrMarkAnnualReport',
          {
            markStatus: _.compact(markedData),
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
      this.$notify({
        title: 'success',
        message: message,
        type: 'success',
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';

.results-announcement-checking-wrapper {
  height: 100vh;
  .header {
    display: flex;
    height: auto;
    padding: 0;
    .header-left {
      position: relative;
      width: 60%;
      display: flex;
      background: $--color-primary;
      color: rgba($--color-white, 0.8);
      padding: 10px 20px;
      box-sizing: border-box;
      &.collapsed {
        width: 100%;
      }
      .header-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-size: 13px;
        box-sizing: border-box;
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          > span,
          .el-select {
            margin-left: 5px;
          }
          ::v-deep .el-input__inner {
            width: 60px;
            background: $--color-white;
            color: $--color-primary;
            border-radius: 0;
            padding: 0 10px;
            text-align: center;
          }
        }
        .company-name {
          max-width: 18%;
          margin-left: 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .results-type {
          margin-left: 10px;
          ::v-deep .el-input__inner {
            width: 90px;
          }
          .el-select {
            ::v-deep .el-loading-spinner {
              margin-top: -8px;
              .el-icon-loading {
                color: $--color-primary;
              }
            }
          }
        }
        .info-more {
          margin-left: 20px;
          padding: 3px;
          color: rgba($--color-white, 0.8);
          border: 1px solid rgba($--color-white, 0.8);
        }
        .collapsed-button {
          margin-left: 20px;
          font-size: 20px;
          color: rgba($--color-white, 0.5);
          &:hover {
            color: rgba($--color-white, 0.7);
          }
        }
      }
    }
  }
  ::v-deep .el-input__suffix {
    right: 3px;
    .el-input__icon {
      font-size: 12px;
      width: 16px;
      line-height: 20px;
    }
  }
}
</style>

<style lang="scss">
@import '../../common/color.scss';

.results-annoucement-checking-popover {
  .content {
    p {
      display: flex;
      margin: 10px 0;
      font-weight: bold;
      > span {
        &:first-child {
          flex: 2;
        }
        &:last-child {
          flex: 3;
          word-break: break-all;
          color: $--color-primary;
        }
      }
    }
  }
}
</style>
