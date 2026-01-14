<template>
  <div class="fundraising-activity" v-loading.fullscreen="loading">
    <div class="header">
      <div class="info">
        <section>
          <h2>Fundraising Event Data</h2>
          <span>(Last updated: {{ additionData.latest_update }})</span>
        </section>
        <section>
          <h3>
            Stock Code: <span>{{ $route.query.stockCode }}</span>
          </h3>
          <h3>
            Count of applicable record(s) during the report year:
            <span>{{ additionData.count }}</span>
          </h3>
          <h3>
            Financial Year End:
            <span>{{ additionData.year_end }}</span>
          </h3>
        </section>
      </div>
      <div class="filter">
        <span class="label">Report Year</span>
        <el-select
          v-model="filter.financial_year"
          size="mini"
          placeholder="Please select report year"
          popper-class="fundraising-select-dropdown"
          @change="changeReportYear">
          <el-option
            v-for="year in reportYears"
            :key="year"
            :label="year"
            :value="year">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table
      border
      stripe
      :data="additionData.items"
      :row-class-name="getRowClassName"
      :span-method="spanMethod">
      <el-table-column
        prop="index"
        type="index"
        :index="customRowIndex"
        label="#"
        width="40"
        align="center">
      </el-table-column>
      <el-table-column
        prop="Event ID"
        label="Event ID"
        width="70"
        align="center">
      </el-table-column>
      <el-table-column
        prop="Involved Entities English"
        label="Involved Entities English"
        header-align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row['Involved Entities English']"
            effect="dark"
            placement="right"
            :open-delay="500"
            popper-class="table-cell-text-tooltip">
            <div slot="content" class="content">
              {{ scope.row['Involved Entities English'].join('\n') }}
            </div>
            <div>
              <p
                v-for="(entity, index) in scope.row[
                  'Involved Entities English'
                ].slice(0, cellTextMaxLines(scope.row))"
                :key="index"
                class="company-name">
                {{ entity }}
              </p>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="Involved Entities Note"
        label="Involved Entities Note"
        header-align="center"
        min-width="135">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row['Involved Entities Note']"
            effect="dark"
            placement="right"
            :open-delay="500"
            popper-class="table-cell-text-tooltip">
            <div slot="content" class="content">
              {{ scope.row['Involved Entities Note'] }}
            </div>
            <div>
              <span class="text-overflow" :style="cellStyle(scope.row)">
                {{ scope.row['Involved Entities Note'] }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="Event Type"
        label="Event Type"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="Lapsed"
        label="Lapsed"
        align="center"
        width="75"></el-table-column>
      <el-table-column
        prop="First Report Time"
        label="First Report Time"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="Report Date"
        label="Report Date"
        align="center"
        width="110">
        <template slot-scope="scope">
          <p v-for="(date, index) in scope.row['Report Date']" :key="index">
            {{ date }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="Report Link"
        label="Report Link"
        align="center"
        width="150">
        <template slot-scope="scope">
          <a
            v-for="(link, index) in scope.row['Report Link']"
            :key="index"
            :href="link"
            target="_blank">
            {{ link.split('/').at(-1) }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="Reasons"
        label="Reasons"
        min-width="130"
        header-align="center">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row['Reasons']"
            effect="dark"
            placement="left"
            :open-delay="500"
            popper-class="table-cell-text-tooltip">
            <div slot="content" class="content">
              {{ scope.row['Reasons'] }}
            </div>
            <div>
              <span class="text-overflow" :style="cellStyle(scope.row)">{{
                scope.row['Reasons']
              }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="Method of Issue"
        label="Method of Issue"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="Shares Issued"
        label="Shares Issued"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="Shares Class"
        label="Shares Class"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="Net Funds to Be Raised"
        label="Net Funds to Be Raised"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="Proposed Use of Proceeds"
        label="Proposed Use of Proceeds"
        min-width="110"
        header-align="center">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row['Proposed Use of Proceeds']"
            effect="dark"
            placement="left"
            :open-delay="500"
            popper-class="table-cell-text-tooltip">
            <div slot="content" class="content">
              {{ scope.row['Proposed Use of Proceeds'] }}
            </div>
            <div>
              <span class="text-overflow" :style="cellStyle(scope.row)">
                {{ scope.row['Proposed Use of Proceeds'] }}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="Issue Price"
        label="Issue Price"
        align="center"
        width="80"></el-table-column>
      <el-table-column
        prop="Exercise Price"
        label="Exercise Price"
        align="center"
        width="100"></el-table-column>
      <el-table-column
        prop="MKT Share Price"
        label="MKT Share Price"
        align="center"
        width="80">
      </el-table-column>
    </el-table>
    <el-pagination
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
import { fetchFileAdditionData } from '@/store/api/hkex.api';

export default {
  name: 'fundraising-activity',
  data() {
    return {
      loading: false,
      reportYears: [],
      additionData: {},
      filter: {
        financial_year: this.$route.query.financialYear,
        month_offset: -1,
      },
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      mergeIndexObj: {},
      mergeColumnsInfo: {},
      mergeColumns: ['index', 'Event ID'],
    };
  },
  computed: {
    cellTextMaxLines() {
      return (row) => Math.max(row['Report Link'].length, 5);
    },
    cellStyle() {
      return (row) => `-webkit-line-clamp:${this.cellTextMaxLines(row)}`;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getFileAdditionData();
    },
    async getFileAdditionData() {
      try {
        this.loading = true;
        const { qid, rule, stockCode } = this.$route.query;
        const res = await fetchFileAdditionData(qid, rule, {
          stock_code: stockCode,
          ...this.filter,
          page: this.pager.page,
          page_size: this.pager.size,
        });
        this.reportYears = res.ar_years;
        this.additionData = res;
        this.getTableSpanArr(this.additionData.items);
        this.pager = {
          page: res.page,
          size: res.size,
          total: res.total,
        };
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
        this.clearAdditionData();
      } finally {
        this.loading = false;
      }
    },
    clearAdditionData() {
      this.additionData.latest_update = '';
      this.additionData.count = 0;
      this.additionData.year_end = '';
      this.additionData.items = [];
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
      this.mergeColumnsInfo['index'] = this.mergeColumnsInfo['Event ID'];
      this.handleMergeIndex();
    },
    handleMergeIndex() {
      let num = 0;
      this.mergeColumnsInfo['index'].forEach((item, index) => {
        if (item !== 0) {
          num++;
          this.mergeIndexObj[index] = num;
        }
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
    customRowIndex(index) {
      return this.mergeIndexObj[index];
    },
    changeReportYear() {
      this.$router.replace({
        name: 'fundraisingActivity',
        query: Object.assign({}, this.$route.query, {
          financialYear: this.filter.financial_year,
        }),
      });
      this.getFileAdditionData();
    },
    changePage(page) {
      this.pager.page = page;
      this.getFileAdditionData();
    },
    changeSize(size) {
      this.pager.size = size;
      this.getFileAdditionData();
    },
    getRowClassName({ row }) {
      if (row.is_in_the_year === true) {
        return 'row-highlight';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';

.fundraising-activity {
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
      section {
        display: flex;
        align-items: baseline;
        &:last-child {
          margin-top: 20px;
        }
        h2 {
          color: $--color-primary;
          margin-right: 10px;
        }
        h3 {
          color: #10416c;
          margin-right: 30px;
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
          font-weight: bold;
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
        > div {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
        }
        .text-overflow {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 29px;
        }
        .company-name {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 3px 0;
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
