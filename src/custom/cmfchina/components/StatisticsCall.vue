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
          label="调用总数"
          sortable="custom"
          align="center"></el-table-column>
        <el-table-column
          prop="success_total"
          label="调用成功总数"
          sortable="custom"
          align="center"></el-table-column>
        <el-table-column
          prop="failure_total"
          label="调用失败总数"
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
import { fetchCallStatistics } from '../../../store/api/cmfchina.api';

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
          label: '调用总数',
          value: 'total',
        },
        {
          label: '调用成功总数',
          value: 'success_count',
        },
        {
          label: '调用失败总数',
          value: 'failure_count',
        },
      ],
      originalData: [],
      chartData: {
        pie: {
          title: '调用成功/失败占比',
          seriesData: [],
        },
        bar: {
          xAxisData: [],
          series: [],
        },
        line: {
          title: '各模型使用趋势图',
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
        const res = await fetchCallStatistics(params);
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
        const { date, success_count, failure_count } = item;

        if (!result[date]) {
          result[date] = {
            date: this.formatDate(date),
            total: 0,
            success_total: 0,
            failure_total: 0,
          };
        }
        result[date].date = this.formatDate(date);
        result[date].success_total += success_count;
        result[date].failure_total += failure_count;
        result[date].total =
          result[date].success_total + result[date].failure_total;
      });
    },
    convertToChartData(data) {
      this.convertPieData(
        data,
        this.chartData.pie.title,
        ['调用成功', '调用失败'],
        'success_total',
        'failure_total',
      );
      this.convertBarData(
        data,
        ['调用成功', '调用失败'],
        'success_total',
        'failure_total',
      );
      this.convertLineData(
        data,
        this.chartData.line.title,
        'success_count',
        'failure_count',
      );
    },
    changeDataType(type) {
      this.convertLineData(
        this.originalData,
        this.chartData.line.title,
        'success_count',
        'failure_count',
        type,
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
