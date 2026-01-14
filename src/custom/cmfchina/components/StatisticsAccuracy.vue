<template>
  <div class="statistics-accuracy">
    <statistics-filter @search="search"></statistics-filter>
    <div class="chart-container">
      <el-radio-group v-model="dataType" @change="changeDataType">
        <el-radio
          v-for="(type, index) in chartDataTypes"
          :key="index"
          :label="type.value">
          {{ type.label }}
        </el-radio>
      </el-radio-group>
      <div ref="chart-line" class="chart-line"></div>
    </div>
    <div class="table-container">
      <el-table
        ref="table-accuracy"
        :data="tableData.items"
        :cell-class-name="tableCellClassName"
        @expand-change="handleExpandChange"
        @sort-change="changeTableSort"
        @row-click="clickTableCell">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.expandRowData" class="expand-table">
              <el-table-column
                v-for="(item, index) in getExpandRowColumns(
                  props.row.expandRowData,
                )"
                :key="index"
                :label="item"
                :prop="item"
                align="center"
                min-width="200">
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="时间" align="center" width="150">
        </el-table-column>
        <el-table-column
          prop="internal"
          label="内部规则审核错误比率"
          sortable="custom"
          align="center">
          <template slot-scope="scope">
            <span class="text">{{ scope.row.internal.ratio }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="external"
          label="AB比对审核错误比率"
          sortable="custom"
          align="center">
          <template slot-scope="scope">
            <span class="text">{{ scope.row.external.ratio }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="preset_answer"
          label="人工复核前准确率"
          sortable="custom"
          align="center">
          <template slot-scope="scope">
            <span class="text">{{ scope.row.preset_answer.ratio }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="人工复核后准确率"
          sortable="custom"
          align="center">
          <template slot-scope="scope">
            <span class="text">{{ scope.row.answer.ratio }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        :current-page="tableData.pager.page"
        :page-size="tableData.pager.size"
        :total="tableData.pager.total"
        @current-change="changeTablePage"
        @size-change="changeTableSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import StatisticsFilter from './StatisticsFilter';
import StatisticsMixin from '../mixins/StatisticsMixin';
import { fetchAccuracyStatistics } from '../../../store/api/cmfchina.api';

export default {
  name: 'statistics-accuracy',
  components: {
    StatisticsFilter,
  },
  mixins: [StatisticsMixin],
  props: {},
  data() {
    return {
      dataType: 'internal',
      chartDataTypes: [
        {
          label: '内部规则审核错误比率',
          value: 'internal',
        },
        {
          label: 'AB比对审核错误比率',
          value: 'external',
        },
        {
          label: '人工复核前准确率',
          value: 'preset_answer',
        },
        {
          label: '人工复核后准确率',
          value: 'answer',
        },
      ],
      originalData: [],
      chartData: {
        line: {
          title: '各模型准确率趋势图',
          xAxisData: [],
          series: [],
        },
      },
      activeLineIndex: 0,
      activeTableCells: [],
    };
  },
  methods: {
    search(searchParams) {
      this.filter = searchParams;
      this.activeLineIndex = 0;
      this.activeTableCells = [];
      this.tableData.pager.page = 1;
      this.$refs['table-accuracy'].clearSort();
      this.getStatData();
    },
    async getStatData() {
      try {
        const res = await fetchAccuracyStatistics(this.filter);
        this.originalData = _.cloneDeep(res.data);
        this.convertLineData(res.data);
        this.initLineChart();
        this.getTableData(res.data);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    getTableData(data) {
      if (
        data.length === 0 ||
        !data[this.activeLineIndex] ||
        data[this.activeLineIndex].accuracy_items.length === 0
      ) {
        return;
      }

      const result = {};

      data[this.activeLineIndex].accuracy_items.forEach((item) => {
        const { date, internal, external, preset_answer, answer } = item;

        if (!result[date]) {
          result[date] = {
            date: this.formatDate(date),
            internal: 0,
            external: 0,
            preset_answer: 0,
            answer: 0,
          };
        }

        result[date].date = this.formatDate(date);
        result[date].internal = {
          ratio: this.formatPercentage(
            (internal.total - internal.compliance_count) / answer.total,
          ),
          rules: item.internal.rules,
        };
        result[date].external = {
          ratio: this.formatPercentage(
            (external.total - external.compliance_count) / answer.total,
          ),
          rules: item.external.rules,
        };
        result[date].preset_answer = {
          ratio: this.formatPercentage(
            preset_answer.compliance_count / preset_answer.total,
          ),
          rules: item.preset_answer.rules,
        };
        result[date].answer = {
          ratio: this.formatPercentage(answer.compliance_count / answer.total),
          rules: item.answer.rules,
        };
        result[date].expandRowData = this.getExpandRowData(item, 'internal');
      });

      const items = Object.values(result);
      this.tableData.all = items;
      this.tableData.pager.total = items.length;
      const start = (this.tableData.pager.page - 1) * this.tableData.pager.size;
      const end = this.tableData.pager.page * this.tableData.pager.size;
      this.tableData.items = items.slice(start, end);
    },
    getExpandRowData(row, type = 'internal') {
      const rules = Object.keys(row[type].rules);
      if (rules.length === 0) {
        return [];
      }

      const expandRowData = {};
      rules.forEach((key) => {
        const { total, rule_total, compliance_count } = row[type].rules[key];
        const ratio = ['internal', 'external'].includes(type)
          ? (rule_total - compliance_count) / total
          : compliance_count / total;

        expandRowData[key] = this.formatPercentage(ratio);
      });
      return [expandRowData];
    },
    getExpandRowColumns(expandRowData) {
      if (expandRowData.length === 0) {
        return [];
      }

      return Object.keys(expandRowData[0]);
    },
    formatPercentage(number, withSuffix = true) {
      if (isNaN(number) || !isFinite(number)) {
        return 0;
      }
      const percentage = (number * 100).toFixed(2);
      return withSuffix ? percentage + '%' : percentage;
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
      const cell = `${row.index}_${column.index}`;
      return this.activeTableCells.includes(cell) ? 'active' : '';
    },
    async clickTableCell(row, column) {
      if (column.property === 'date') {
        return;
      }
      const cell = `${row.index}_${column.index}`;
      this.$refs['table-accuracy'].toggleRowExpansion(row, true);
      if (this.activeTableCells.some((cell) => cell.startsWith(row.index))) {
        _.remove(this.activeTableCells, (cell) => cell.startsWith(row.index));
      }
      if (!this.activeTableCells.includes(cell)) {
        this.activeTableCells.push(cell);
      }
      row.expandRowData = this.getExpandRowData(row, column.property);
    },
    handleExpandChange(row, expandedRows) {
      if (expandedRows.some((r) => r.index === row.index)) {
        this.activeTableCells.push(`${row.index}_2`);
        return;
      }
      if (this.activeTableCells.some((cell) => cell.startsWith(row.index))) {
        _.remove(this.activeTableCells, (cell) => cell.startsWith(row.index));
      }
      row.expandRowData = this.getExpandRowData(row, 'internal');
    },
    convertLineData(data, type = this.dataType) {
      this.chartData.line = {
        title: this.chartData.line.title,
        xAxisData:
          data[0]?.accuracy_items.map((item) => this.formatDate(item.date)) ||
          [],
        series: data.map((item, index) => {
          return {
            name: `${item.name}-${index}`,
            data: item.accuracy_items.map((item) => {
              const { total, compliance_count } = item[type];
              const ratio = ['internal', 'external'].includes(type)
                ? (total - compliance_count) / item.answer.total
                : compliance_count /
                  (type === 'preset_answer' ? total : item.answer.total);
              return this.formatPercentage(ratio, false);
            }),
          };
        }),
      };
    },
    initLineChart() {
      const chart = this.$echarts.init(this.$refs['chart-line']);
      chart.clear();
      const series = [];
      const legendData = [];

      this.chartData.line.series.forEach((item, index) => {
        series.push({
          type: 'line',
          name: item.name,
          data: item.data,
          lineStyle: {
            width: index === this.activeLineIndex ? 5 : 2,
            opacity: index === this.activeLineIndex ? 1 : 0.5,
          },
        });

        legendData.push(item.name);
      });

      const option = {
        color: ['#68bbc4', '#5087ec', '#95c597', '#f7d58a', '#f2915c'],
        grid: {
          left: '6%',
          right: '6%',
          bottom: '80',
        },
        title: {
          text: this.chartData.line.title,
          textStyle: {
            color: '#666',
            fontSize: 14,
          },
          top: 'bottom',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: (params) => {
            return this.formattLineChartTooltipContent(params);
          },
        },
        legend: {
          top: 10,
          padding: [0, 70],
          type: 'scroll',
          data: legendData,
          formatter(name) {
            return name.split('-')[0];
          },
        },
        dataZoom: [
          {
            type: 'slider',
            height: 15,
            bottom: 35,
            startValue: 0,
            endValue: Math.ceil(chart.getDom().clientWidth / 150),
          },
        ],
        xAxis: {
          type: 'category',
          data: this.chartData.line.xAxisData,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: this.chartData.line.xAxisData.length > 0,
            formatter: '{value}%',
          },
          min: 0,
          max: 100,
        },
        series: series,
      };

      chart.setOption(option);

      chart.off('click');
      chart.on('click', (params) => {
        const seriesIndex = params.seriesIndex;
        this.activeLineIndex = seriesIndex;

        option.series.forEach((_, index) => {
          if (index === seriesIndex) {
            option.series[index].lineStyle = {
              opacity: 1,
              width: 5,
            };
          } else {
            option.series[index].lineStyle = {
              opacity: 0.5,
              width: 2,
            };
          }
        });
        chart.setOption({
          series: option.series,
          animation: false,
        });

        this.getTableData(this.originalData);
      });
    },
    changeDataType(type) {
      this.convertLineData(this.originalData, type);
      this.initLineChart();
    },
    changeTableSort(sort) {
      switch (sort.order) {
        case 'ascending':
          this.tableData.all.sort(
            (a, b) =>
              parseFloat(a[sort.prop].ratio) - parseFloat(b[sort.prop].ratio),
          );
          break;
        case 'descending':
          this.tableData.all.sort(
            (a, b) =>
              parseFloat(b[sort.prop].ratio) - parseFloat(a[sort.prop].ratio),
          );
          break;
        default:
          this.tableData.all.sort(
            (a, b) => new Date(a.date) - new Date(b.date),
          );
          break;
      }
      this.tableData.pager.page = 1;
      this.tableData.items = this.tableData.all.slice(
        0,
        this.tableData.pager.size,
      );
      this.activeTableCells = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics-accuracy {
  .chart-container {
    .el-radio-group {
      display: flex;
      justify-content: end;
      margin-right: 6%;
      .el-radio {
        ::v-deep .el-radio__label {
          padding-left: 3px;
          vertical-align: -1px;
        }
      }
    }
    .chart-line {
      width: 100%;
      height: 350px;
      padding: 20px 30px;
      box-sizing: border-box;
    }
  }
  .el-table {
    ::v-deep .el-table__cell {
      &.active {
        .text {
          color: #0090c0;
          font-weight: bold;
        }
      }
      .text {
        cursor: pointer;
        &:hover {
          color: #0090c0;
        }
      }
      .expand-table {
        width: calc(100% - 40px);
        margin: 20px;
        border-right: 1px solid #eceff4;
        border-bottom: none;
        .el-table__header,
        .el-table__row {
          .el-table__cell {
            .cell {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}
</style>
