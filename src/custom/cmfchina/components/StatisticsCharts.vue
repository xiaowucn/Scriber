<template>
  <div class="chart-container">
    <section>
      <div ref="chart-pie" class="chart-pie"></div>
      <div ref="chart-bar" class="chart-bar"></div>
    </section>
    <section>
      <el-radio-group v-model="dataType" @change="changeDataType">
        <el-radio
          v-for="(type, index) in dataTypes"
          :key="index"
          :label="type.value">
          {{ type.label }}
        </el-radio>
      </el-radio-group>
      <div ref="chart-line" class="chart-line"></div>
    </section>
  </div>
</template>

<script>
import StatisticsMixin from '../mixins/StatisticsMixin';

export default {
  name: 'statistics-charts',
  mixins: [StatisticsMixin],
  props: {
    chartData: {
      type: Object,
      default: () => ({}),
    },
    dataTypes: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
    activeBarIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dataType: 'total',
      chart: {
        pie: {
          instance: null,
          option: {},
        },
        bar: {
          instance: null,
          option: {},
        },
        line: {
          instance: null,
          option: {},
        },
      },
    };
  },
  watch: {
    'chartData.pie'() {
      this.initPieChart();
    },
    'chartData.bar'() {
      this.initBarChart();
    },
    'chartData.line'() {
      this.chart.line.instance.clear();
      this.initLineChart();
    },
    'filter.ids'() {
      this.dataType = 'total';
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initPieChart();
      this.initBarChart();
      this.initLineChart();
    },
    initPieChart() {
      const chart = this.$echarts.init(this.$refs['chart-pie']);
      const data = this.chartData.pie.seriesData.filter(
        (item) => item.value !== 0,
      );
      const option = {
        color: ['#5087ec', '#68bbc4'],
        title: {
          text: this.chartData.pie.title,
          textStyle: {
            color: '#666',
            fontSize: 14,
          },
          top: 'bottom',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter(params) {
            return `${params.name}: ${params.percent}%`;
          },
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            label: {
              show: true,
              position: 'inside',
            },
            data: data,
          },
        ],
      };

      chart.setOption(option);

      this.chart.pie.instance = chart;
    },
    initBarChart() {
      const chart = this.$echarts.init(this.$refs['chart-bar']);
      const xAxisData = [];
      const legendData = [];
      const series = [];

      this.chartData.bar.xAxisData.forEach((item, index) => {
        xAxisData.push({
          value: item,
          interval: 0,
          textStyle: {
            color: index === 0 ? '#0090c0' : '#000',
            fontWeight: index === 0 ? 'bold' : 'normal',
          },
        });
      });

      this.chartData.bar.series.forEach((item) => {
        series.push({
          type: 'bar',
          name: item.name,
          barMaxWidth: 50,
          stack: 'value',
          label: {
            show: true,
            position: 'inside',
            formatter(params) {
              return params.value !== 0 ? params.value : '';
            },
          },
          data: item.data,
        });

        legendData.push(item.name);
      });

      const option = {
        color: ['#5087ec', '#68bbc4'],
        grid: {
          bottom: 40,
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            interval: 0,
            formatter: (value) => {
              if (value?.length > 6) {
                return `${value.slice(0, 6)}...`;
              }
              return value;
            },
          },
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: legendData,
        },
        dataZoom: [
          {
            show: xAxisData.length > 6,
            type: 'slider',
            height: 15,
            bottom: 0,
            startValue: 0,
            endValue: 6,
          },
        ],
        series: series,
      };

      chart.setOption(option);

      this.chart.bar.instance = chart;

      chart.off('click');
      chart.on('click', (params) => {
        const dataIndex = params.dataIndex;

        option.series.forEach((item) => {
          item.data.forEach((bar, barIndex) => {
            if (barIndex === dataIndex) {
              option.xAxis.data[barIndex].textStyle = {
                color: '#0090c0',
                fontWeight: 'bold',
              };
              this.chart.line.option.series[barIndex].lineStyle = {
                opacity: 1,
                width: 5,
              };
            } else {
              option.xAxis.data[barIndex].textStyle = {
                color: '#000',
                fontWeight: 'normal',
              };
              this.chart.line.option.series[barIndex].lineStyle = {
                opacity: 0.5,
                width: 2,
              };
            }
          });
        });

        chart.setOption({
          xAxis: option.xAxis,
          series: option.series,
          animation: false,
        });
        this.chart.line.instance.setOption(this.chart.line.option);
        this.$emit('bar-clicked', params.dataIndex);
      });
    },
    initLineChart() {
      const chart = this.$echarts.init(this.$refs['chart-line']);
      const series = [];
      const legendData = [];

      this.chartData.line.series.forEach((item, index) => {
        series.push({
          type: 'line',
          name: item.name,
          data: item.data,
          lineStyle: {
            width: index === this.activeBarIndex ? 5 : 2,
            opacity: index === this.activeBarIndex ? 1 : 0.5,
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
        },
        series: series,
      };

      chart.setOption(option);

      this.chart.line.instance = chart;
      this.chart.line.option = option;
    },
    changeDataType(type) {
      this.$emit('change-data-type', type);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  margin-bottom: 20px;
  > section {
    &:not(:last-child) {
      display: flex;
      border-bottom: 1px solid #e4e7ed;
    }
    .chart-pie {
      width: 30%;
      height: 300px;
      padding: 20px;
      border-right: 1px solid #e4e7ed;
    }
    .chart-bar {
      width: 70%;
      height: 300px;
      padding: 20px;
    }
    .chart-line {
      width: 100%;
      height: 350px;
      padding: 20px 30px;
      box-sizing: border-box;
    }
    .el-radio-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      margin-right: 8%;
      .el-radio {
        ::v-deep .el-radio__label {
          padding-left: 3px;
          vertical-align: -1px;
        }
      }
    }
  }
}
</style>
