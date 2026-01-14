<template>
  <div ref="statistics" class="statistics">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :name="item.value"
        :label="item.label"
        :lazy="true">
        <transition name="fade">
          <component
            v-show="item.value === tab"
            :is="item.component"></component>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import _ from 'lodash';
import { cmfchinaPermAllowed } from '../common/utils';
import StatisticsCall from '../components/StatisticsCall';
import StatisticsAccuracy from '../components/StatisticsAccuracy';
import StatisticsBusiness from '../components/StatisticsBusiness';

const tabs = [
  {
    label: '调用统计',
    value: 'call',
    component: StatisticsCall,
    perimeterAction: 'stat_call',
  },
  {
    label: '准确率统计',
    value: 'accuracy',
    component: StatisticsAccuracy,
    perimeterAction: 'stat_accuracy',
  },
  {
    label: '业务统计',
    value: 'business',
    component: StatisticsBusiness,
    perimeterAction: 'stat_business',
  },
];

export default {
  name: 'statistical-evaluation',
  components: {
    StatisticsCall,
    StatisticsAccuracy,
    StatisticsBusiness,
  },
  props: {},
  data() {
    return {
      tab: 'call',
      resizeObserver: null,
    };
  },
  computed: {
    tabs() {
      return tabs.filter((item) => cmfchinaPermAllowed(item.perimeterAction));
    },
  },
  mounted() {
    this.tab = this.tabs[0].value;
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
  },
  methods: {
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver(
        _.debounce(() => {
          this.handleChartResize();
        }, 200),
      );

      this.resizeObserver.observe(this.$refs.statistics);
    },
    handleChartResize() {
      const pane = this.$refs.statistics?.querySelector(`#pane-${this.tab}`);
      if (!pane) return;

      const chartSelectors = ['.chart-pie', '.chart-bar', '.chart-line'];

      chartSelectors.forEach((selector) => {
        const chartElement = pane.querySelector(selector);
        if (chartElement) {
          const chartInstance = this.$echarts.getInstanceByDom(chartElement);
          if (chartInstance) {
            chartInstance.resize();
            if (selector === '.chart-line') {
              chartInstance.setOption({
                dataZoom: [
                  {
                    endValue: Math.ceil(
                      chartInstance.getDom().clientWidth / 150,
                    ),
                  },
                ],
              });
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics {
  padding: 0 20px;
  font-size: 14px;
  .el-tabs {
    ::v-deep .el-tabs__header {
      position: sticky;
      top: 61px;
      z-index: 9;
      padding-top: 10px;
      background: #f8fafc;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
