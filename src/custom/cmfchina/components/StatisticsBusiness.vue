<template>
  <div>
    <statistics-filter @search="search"></statistics-filter>
    <statistics-charts
      :filter="filter"
      :chart-data="chartData"
      :data-types="chartDataTypes"
      :active-bar-index="activeBarIndex"
      @bar-clicked="handleBarClicked"
      @change-data-type="changeDataType">
    </statistics-charts>
    <div class="table-container">
      <el-table ref="table" :data="tableData.items" @sort-change="changeSort">
        <el-table-column
          prop="date"
          label="时间"
          align="center"></el-table-column>
        <el-table-column
          prop="total"
          label="总文档数"
          sortable="custom"
          align="center"></el-table-column>
        <el-table-column
          prop="reviewed_total"
          label="已复核文档数"
          sortable="custom"
          align="center"></el-table-column>
        <el-table-column
          prop="not_reviewed_total"
          label="未复核文档数"
          sortable="custom"
          align="center"></el-table-column>
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
import StatisticsCharts from './StatisticsCharts';
import StatisticsMixin from '../mixins/StatisticsMixin';
import { fetchBusinessStatistics } from '../../../store/api/cmfchina.api';

export default {
  name: 'statistics-business',
  components: {
    StatisticsFilter,
    StatisticsCharts,
  },
  mixins: [StatisticsMixin],
  props: {},
  data() {
    return {
      chartDataTypes: [
        {
          label: '总文档数',
          value: 'total',
        },
        {
          label: '已复核文档数',
          value: 'reviewed_count',
        },
        {
          label: '未复核文档数',
          value: 'not_reviewed_count',
        },
      ],
      chartData: {
        pie: {
          title: '已复核/未复文档数占比',
          seriesData: [],
        },
        bar: {
          xAxisData: [],
          series: [],
        },
        line: {
          title: '总文档数/已复核/未复核文档数趋势图',
          xAxisData: [],
          series: [],
        },
      },
    };
  },
  created() {},
  methods: {
    async getStatData(params) {
      try {
        const res = await fetchBusinessStatistics(params);
        this.originalData = _.cloneDeep(res.data);
        this.convertToChartData(res.data);
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
      this.convertToTableData(data, (item, result) => {
        const { date, reviewed_count, not_reviewed_count } = item;

        if (!result[date]) {
          result[date] = {
            date: this.formatDate(date),
            total: 0,
            reviewed_total: 0,
            not_reviewed_total: 0,
          };
        }
        result[date].date = this.formatDate(date);
        result[date].reviewed_total += reviewed_count;
        result[date].not_reviewed_total += not_reviewed_count;
        result[date].total =
          result[date].reviewed_total + result[date].not_reviewed_total;
      });
    },
    convertToChartData(data) {
      this.convertPieData(
        data,
        this.chartData.pie.title,
        ['已复核', '未复核'],
        'reviewed_total',
        'not_reviewed_total',
      );
      this.convertBarData(
        data,
        ['已复核文档数', '未复核文档数'],
        'reviewed_total',
        'not_reviewed_total',
      );
      this.convertLineData(
        data,
        this.chartData.line.title,
        'reviewed_count',
        'not_reviewed_count',
      );
    },
    changeDataType(type) {
      this.convertLineData(
        this.originalData,
        this.chartData.line.title,
        'reviewed_count',
        'not_reviewed_count',
        type,
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
