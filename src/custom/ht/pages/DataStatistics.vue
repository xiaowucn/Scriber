<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="clickTab">
      <el-tab-pane label="按月统计" name="month"></el-tab-pane>
      <el-tab-pane label="按天统计" name="day"></el-tab-pane>
      <el-tab-pane label="分类统计" name="mold"></el-tab-pane>
      <el-tab-pane label="用户使用统计" name="user"></el-tab-pane>
    </el-tabs>
    <div class="filter-options">
      <el-date-picker
        :type="datePickerType"
        placeholder="开始日期"
        size="small"
        v-model="times.start"
        value-format="yyyy-MM-dd"></el-date-picker>
      <span class="line">-</span>
      <el-date-picker
        :type="datePickerType"
        placeholder="结束日期"
        size="small"
        v-model="times.end"
        value-format="yyyy-MM-dd"
        @change="changeEndTime"></el-date-picker>
      <el-select
        v-if="showDepartment"
        placeholder="请选择部门"
        v-model="selectedDepartment"
        size="small">
        <el-option
          v-for="(item, index) in departments"
          :key="index"
          :label="item.department"
          :value="item.department_id">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" @click="fetchStatistics"
        >查询</el-button
      >
      <el-button type="primary" size="small" @click="exportExcel"
        >导出Excel</el-button
      >
    </div>
    <data-statistics-detail
      :data="statistics"
      :table-name="tableName"
      :column-name="columnName"
      :is-not-show-column="isNotShowColumn"
      :is-need-sortable="isNeedSortable"></data-statistics-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { baseURL } from '@/store/api/http';
import { getCurrentMonthFirst, getCurrentMonthLast } from '@/utils';
import DataStatisticsDetail from '../components/DataStatisticsDetails';

export default {
  components: {
    DataStatisticsDetail,
  },
  data() {
    return {
      activeName: 'month',
      condition: 'month',
      datePickerType: 'month',
      times: {
        start: '',
        end: '',
      },
      tableName: '每月文档',
      columnName: '日期',
      isNotShowColumn: false,
      isNeedSortable: false,
      showDepartment: false,
      selectedDepartment: null,
    };
  },
  computed: {
    ...mapGetters('htModule', ['statistics', 'departments']),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initTime();
      this.fetchStatistics();
      this.fetchDepartments();
    },
    initTime() {
      this.times.start = getCurrentMonthFirst();
      this.times.end = getCurrentMonthLast();
    },
    changeEndTime(date) {
      if (date && this.datePickerType === 'month') {
        const splitDate = date.split('-');
        const endTime = new Date(splitDate[0], splitDate[1], 0).getTime();
        this.times.end = this.$options.filters.date(endTime);
      }
    },
    fetchStatistics() {
      this.$store.dispatch('htModule/fetchStatistics', {
        condition: this.condition,
        startTime: this.times.start,
        endTime: this.times.end,
        departmentId: this.selectedDepartment,
      });
    },
    fetchDepartments() {
      this.$store.dispatch('htModule/fetchDepartments');
    },
    clickTab(tab) {
      this.showDepartment = false;
      this.condition = tab.paneName;
      this.datePickerType = 'date';
      this.isNotShowColumn = false;
      this.isNeedSortable = false;
      switch (tab.paneName) {
        case 'month':
          this.tableName = '每月文档';
          this.datePickerType = 'month';
          this.columnName = '日期';
          this.initTime();
          break;
        case 'day':
          this.tableName = '每日文档';
          this.columnName = '日期';
          break;
        case 'mold':
          this.tableName = '分类统计';
          this.columnName = '合同类型';
          break;
        case 'user':
          this.showDepartment = true;
          this.tableName = '使用统计';
          this.columnName = '用户';
          this.isNotShowColumn = true;
          this.isNeedSortable = true;
          break;
        default:
          break;
      }
      this.fetchStatistics();
    },
    exportExcel() {
      let downloadUrl = `${baseURL}/plugins/ht/ht_stat?group_by=${this.condition}&s_time=${this.times.start}&e_time=${this.times.end}&is_export=true`;
      if (this.selectedDepartment !== null) {
        downloadUrl = `${downloadUrl}&department_id=${this.selectedDepartment}`;
      }
      window.open(downloadUrl);
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 20px 40px;
  .filter-options {
    margin: 10px 0 25px 0;
    .el-input {
      width: 180px;
    }
    .line {
      margin: 0 10px;
      text-align: center;
    }
    .el-select {
      margin-left: 20px;
    }
    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
