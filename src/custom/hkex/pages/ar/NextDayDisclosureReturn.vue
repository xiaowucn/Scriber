<template>
  <div class="container" v-loading.fullscreen="loading">
    <div class="header">
      <div class="info">
        <section>
          <h2>Monthly Summary of Next Day Disclosure Returns</h2>
          <span v-if="byMonth"> (Last updated: {{ lastUpdated }}) </span>
        </section>
        <section>
          <el-button
            v-if="!byMonth"
            type="text"
            icon="el-icon-back"
            class="btn-back"
            @click="gotoDataByMonth">
            Back
          </el-button>
          <h3>
            Stock Code: <span>{{ $route.query.stockCode }}</span>
          </h3>
          <h3 v-if="!byMonth">
            Report Year: <span>{{ $route.query.reportYear }}</span>
          </h3>
          <h3>
            Financial Year-end:
            <span>{{ yearEnd }}</span>
          </h3>
        </section>
      </div>
      <div class="filter">
        <span class="label">{{ byMonth ? 'Report Year' : 'Monthly' }}</span>
        <el-select
          v-if="byMonth"
          v-model="filter.calendar_year"
          size="mini"
          placeholder="Please select report year"
          popper-class="fundraising-select-dropdown"
          @change="changeDate">
          <el-option
            v-for="year in years"
            :key="year"
            :label="year"
            :value="year">
          </el-option>
        </el-select>
        <el-select
          v-else
          v-model="filter.month"
          size="mini"
          placeholder="Please select report year"
          popper-class="fundraising-select-dropdown"
          @change="changeDate">
          <el-option
            v-for="month in months"
            :key="month"
            :label="month"
            :value="month">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table
      v-if="!loading"
      border
      stripe
      :data="data.rows"
      :span-method="spanMethod">
      <el-table-column
        :prop="byMonth ? 'trading_month' : 'trading_date'"
        :label="byMonth ? 'Trading Month' : 'Trading Date'"
        align="center">
        <template slot-scope="{ row }">
          {{ byMonth ? row.trading_month : formatDateString(row.trading_date) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="currency"
        label="Method of repurchase"
        align="center">
      </el-table-column>
      <el-table-column
        prop="aggregate_price"
        label="Aggregate price paid $"
        align="center">
        <template slot-scope="{ row }">
          <template v-if="byMonth">
            <el-button type="text" @click="gotoDataByDay(row)">
              {{ row.currency + ' ' + row.aggregate_price }}
            </el-button>
          </template>
          <template v-else>
            {{ row.currency + ' ' + row.aggregate_price }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!byMonth"
        prop="headline"
        label="Headline"
        align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            :title="row.headline"
            @click="gotoNDDRDetails(row)">
            {{ row.headline }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!byMonth"
        prop="release_time"
        label="Release Time"
        align="center">
        <template slot-scope="{ row }">
          {{ formatDateTime(row.release_time) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!byMonth"
      background
      layout="total, prev, pager, next, sizes"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50]"
      :total="pager.total"
      @current-change="changePage"
      @size-change="changeSize">
    </el-pagination>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { fetchNDDRDataByMonth, fetchNDDRDataByDay } from '@/store/api/hkex.api';

export default {
  name: 'next-day-disclosure-return',
  data() {
    return {
      loading: false,
      lastUpdated: '',
      yearEnd: '',
      years: [],
      months: [],
      filter: {
        calendar_year: this.$route.query.reportYear,
        month: '',
      },
      by: 'month',
      data: {
        rows: [],
      },
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      mergeIndexObj: {},
      mergeColumnsInfo: {},
      mergeColumns: ['trading_month', 'trading_date', 'release_time'],
    };
  },
  computed: {
    byMonth() {
      return this.by === 'month';
    },
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.filter.calendar_year = Number(this.$route.query.reportYear);
      this.by = this.$route.query.month ? 'day' : 'month';
      this.filter.month = this.$route.query.month;
      if (this.byMonth) {
        this.getDataByMonth();
      } else {
        if (this.months.length === 0) {
          await this.getDataByMonth(false);
        }
        this.getDataByDay();
      }
    },
    async getDataByMonth(setData = true) {
      try {
        this.loading = true;
        const res = await fetchNDDRDataByMonth({
          stock_code: this.$route.query.stockCode,
          calendar_year: this.filter.calendar_year,
        });
        if (setData) {
          this.data = res;
        }
        this.lastUpdated = this.formatDate(res.last_updated);
        this.yearEnd = res.year_end;
        this.years = res.available_years;
        this.months = [...new Set(res.rows.map((item) => item.trading_month))];
        this.getTableSpanArr(this.data.rows);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
        this.resetSummaryData();
      } finally {
        this.loading = false;
      }
    },
    async getDataByDay() {
      try {
        this.loading = true;
        const res = await fetchNDDRDataByDay({
          stock_code: this.$route.query.stockCode,
          month: this.filter.month,
          page: this.pager.page,
          page_size: this.pager.size,
        });
        this.data = {
          ...res,
          rows: res.items,
        };
        this.pager.total = res.total;
        this.getTableSpanArr(this.data.rows);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
        this.resetSummaryData();
      } finally {
        this.loading = false;
      }
    },
    resetSummaryData() {
      this.lastUpdated = '-';
      this.yearEnd = '-';
      this.data.rows = [];
      this.pager.total = 0;
    },
    getTableSpanArr(data) {
      this.mergeColumns.forEach((column) => {
        let count = 0;
        this.mergeColumnsInfo[column] = [];
        data.forEach((item, index) => {
          if (index === 0) {
            this.mergeColumnsInfo[column].push(1);
          } else {
            if (item[column] === data[index - 1][column]) {
              this.mergeColumnsInfo[column][count] += 1;
              this.mergeColumnsInfo[column].push(0);
            } else {
              count = index;
              this.mergeColumnsInfo[column].push(1);
            }
          }
        });
      });
    },
    spanMethod({ column, rowIndex }) {
      if (this.mergeColumns.indexOf(column.property) !== -1) {
        if (this.mergeColumnsInfo[column.property][rowIndex]) {
          return [this.mergeColumnsInfo[column.property][rowIndex], 1];
        } else {
          return [0, 0];
        }
      }
    },
    gotoDataByMonth() {
      this.by = 'month';
      this.$router.push({
        name: 'nextDayDisclosureReturn',
        query: {
          stockCode: this.$route.query.stockCode,
          reportYear: this.filter.calendar_year,
        },
      });
    },
    gotoDataByDay(row) {
      this.by = 'day';
      this.filter.month = row?.trading_month || this.filter.month;
      this.$router.push({
        name: 'nextDayDisclosureReturn',
        query: {
          stockCode: this.$route.query.stockCode,
          reportYear: this.filter.calendar_year,
          month: this.filter.month,
        },
      });
    },
    gotoNDDRDetails(row) {
      const { href } = this.$router.resolve({
        name: 'nextDayDisclosureReturnDetails',
        query: {
          fid: row.fid,
          qid: row.qid,
          mid: row.mid,
          date: this.formatDate(row.trading_date),
        },
      });
      window.open(href, '_blank');
    },
    formatDate(date) {
      return dayjs(new Date(date)).format('YYYY-MM-DD');
    },
    formatDateTime(time) {
      return dayjs(new Date(time)).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDateString(date) {
      return dayjs(new Date(date)).format('DD MMM YYYY');
    },
    changeDate(value) {
      if (this.byMonth) {
        this.filter.calendar_year = value;
        this.gotoDataByMonth();
      } else {
        this.filter.month = value;
        this.gotoDataByDay();
      }
    },
    changePage(page) {
      this.pager.page = page;
      this.getDataByDay();
    },
    changeSize(size) {
      this.pager.size = size;
      this.getDataByDay();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';

.container {
  padding: 0 20px;
  overflow: auto;
  .header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    min-height: 100px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    .info {
      .btn-back {
        margin-right: 30px;
        padding: 0;
        color: $--color-primary;
        transition: all 0.2s;
        &:hover {
          transform: scale(1.1);
        }
        ::v-deep .el-icon-back {
          font-weight: bold;
        }
      }
      section {
        display: flex;
        align-items: center;
        &:last-child {
          margin-top: 30px;
        }
        h2 {
          margin-right: 10px;
          color: $--color-primary;
          font-size: 18px;
        }
        h3 {
          margin-right: 30px;
          color: #10416c;
          font-size: 16px;
          > span {
            color: #e62742;
          }
        }
      }
    }
    .filter {
      display: flex;
      align-items: center;
      .label {
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        background-color: $--color-primary;
        color: #fff;
      }
      .el-select {
        ::v-deep .el-input__inner {
          border-radius: 0;
          border-color: $--color-primary;
          font-size: 16px;
        }
        ::v-deep .el-select__caret {
          color: $--color-primary;
        }
      }
    }
  }
  ::v-deep .el-table {
    overflow: initial;
    &.el-table--border {
      border: 1px solid #d9d9d9;
      border-top: none;
    }
    .el-table__header-wrapper {
      position: sticky;
      top: 109px;
      z-index: 1;
    }
    tr {
      &.row-highlight {
        .el-table__cell {
          background-color: #eef5f5;
        }
        &:hover {
          td {
            background-color: #eef5f5;
          }
        }
      }
      th {
        background-color: $--color-primary;
        &.el-table__cell {
          border-top: 1px solid #d9d9d9;
        }
        .cell {
          color: #fff;
        }
      }
      .el-table__cell {
        height: 1px;
        border-color: #d9d9d9;
      }
      .cell {
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: 100%;
        word-break: break-word;
        .el-button {
          padding: 0;
          text-decoration: underline;
          color: $--color-primary;
          overflow: hidden;
          text-overflow: ellipsis;
          &:hover {
            color: $--color-primary;
          }
        }
        :is(a) {
          display: block;
          margin: 3px 0;
          &:link {
            color: #333;
          }
          &:hover {
            color: #0088ff;
          }
          &:active {
            color: #5298a0;
          }
          &:visited {
            color: #34aa44;
          }
        }
      }
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>

<style lang="scss">
.table-cell-text-tooltip {
  padding: 5px;
  .content {
    max-width: 600px;
    max-height: 60vh;
    line-height: 20px;
    padding: 5px;
    overflow-x: hidden;
    overflow-y: auto;
    white-space: pre-line;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #606060;
      border-radius: 5px;
      &:hover {
        background-color: #6f6f6f;
      }
    }
  }
}
.fundraising-select-dropdown {
  .el-select-dropdown__item {
    font-size: 16px;
  }
}
</style>
