<template>
  <div>
    <div class="filter-container">
      <div class="date-filters">
        <div>
          <label>统计方式:</label>
          <el-radio-group v-model="filter.statBy" @change="changeStatType">
            <el-radio label="day">按日统计</el-radio>
            <el-radio label="month">按月统计</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-form
            ref="filterForm"
            :model="filter"
            :rules="filterFormRules"
            label-width="120px">
            <el-form-item label="时间段选择:" prop="dateRange">
              <el-date-picker
                size="medium"
                v-model="filter.dateRange"
                :type="datePickerType"
                range-separator="至"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
                :picker-options="datePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button
            type="primary"
            size="medium"
            :disabled="searchButtonDisabled"
            @click="search">
            查 询
          </el-button>
        </div>
      </div>
      <div class="update-time">更新时间: {{ updateTime }}</div>
    </div>
    <div class="models">
      <label>模型选择:</label>
      <el-select
        v-model="filter.models"
        size="mini"
        multiple
        filterable
        collapse-tags
        placeholder="请选择模型"
        :popper-append-to-body="false"
        v-load-more-select-options="getMoreModels"
        @change="changeModels">
        <span
          :class="['option-all', allOptionSelected ? 'active' : '']"
          @click.stop="selectAllModels">
          全选
        </span>
        <el-option
          v-for="item in model.items"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          {{ item.label }}
        </el-option>
        <el-option v-if="loadingMoreModels" label="" value="">
          <i class="el-icon-loading"></i>
          <span style="margin-left: 10px; color: #999">loading...</span>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';
import isToday from 'dayjs/plugin/isToday';
import { fetchModels } from '../../../store/api/cmfchina.api';

dayjs.extend(isToday);

export default {
  name: 'statistics-filter',
  props: {},
  data() {
    return {
      datePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > new Date().getTime();
        },
      },
      filter: {
        statBy: 'day',
        dateRange: [],
        models: [],
      },
      filterFormRules: {
        dateRange: [{ required: true, message: '请选择时间段' }],
      },
      model: {
        items: [],
        pager: {
          page: 1,
          size: 100,
          total: 0,
        },
      },
      loadingMoreModels: false,
    };
  },
  computed: {
    ...mapGetters('cmfchinaModule', ['selectedModels']),
    datePickerType() {
      return this.filter.statBy === 'day' ? 'daterange' : 'monthrange';
    },
    updateTime() {
      return dayjs().startOf('date').format('YYYY-MM-DD HH:mm:ss');
    },
    searchButtonDisabled() {
      return !this.filter.dateRange || this.filter.models.length === 0;
    },
    allOptionSelected() {
      return this.filter.models.length === this.model.items.length;
    },
  },
  watch: {
    selectedModels() {
      this.filter.models = this.selectedModels;
      this.search();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.setDefaultDate();
      await this.getModels();
      this.search();
    },
    setDefaultDate() {
      if (this.filter.statBy === 'day') {
        const start = dayjs().subtract(7, 'day').startOf('day').valueOf();
        const end = dayjs().subtract(1, 'day').startOf('day').valueOf();
        this.filter.dateRange = [start, end];
      } else {
        const start = dayjs().subtract(5, 'month').startOf('month').valueOf();
        let end = dayjs();
        if (dayjs().isSame(new Date(), 'month')) {
          end = dayjs().startOf('day').valueOf();
        } else {
          end = dayjs(end).endOf('month').valueOf();
        }
        this.filter.dateRange = [start, end];
      }
    },
    changeStatType() {
      this.setDefaultDate();
      this.search();
    },
    async getModels() {
      try {
        this.isLoading = true;
        const params = {
          page: this.model.pager.page,
          size: this.model.pager.size,
        };
        const res = await fetchModels(params);
        const modelItems = res.data.items.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.model.items = [...this.model.items, ...modelItems];
        this.model.pager.total = res.data.total;
        this.filter.models =
          this.selectedModels.length > 0
            ? this.selectedModels
            : this.model.items.map((item) => item.value);
      } catch (err) {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getMoreModels() {
      const { page, size, total } = this.model.pager;
      if (this.loadingMoreModels || page * size >= total) {
        return;
      }
      this.loadingMoreModels = true;
      this.model.pager.page += 1;
      await this.getModels();
      this.loadingMoreModels = false;
    },
    changeModels() {
      this.$store.commit(
        'cmfchinaModule/SET_SELECTED_MODELS',
        this.filter.models,
      );
    },
    selectAllModels() {
      this.filter.models = this.allOptionSelected
        ? []
        : this.model.items.map((item) => item.value);
      this.$store.commit(
        'cmfchinaModule/SET_SELECTED_MODELS',
        this.filter.models,
      );
    },
    search() {
      if (!this.filter.dateRange) {
        this.$notify({
          title: '提示',
          message: '未选择查询时间段，请选择时间段后进行查询',
          type: 'warning',
        });
        return;
      }

      if (this.filter.models.length === 0) {
        this.$notify({
          title: '提示',
          message: '请至少选择一个模型',
          type: 'info',
        });
        return;
      }

      const typeMap = {
        day: 0,
        month: 1,
      };

      let [start_at, end_at] = this.filter.dateRange;

      if (this.filter.statBy === 'day' && !dayjs(end_at).isToday()) {
        end_at = dayjs(end_at).endOf('day').valueOf();
      }

      if (this.filter.statBy === 'month') {
        if (dayjs().isSame(dayjs(end_at), 'month')) {
          end_at = dayjs().startOf('day').valueOf();
        } else {
          end_at = dayjs(end_at).endOf('month').valueOf();
        }
      }

      this.$emit('search', {
        ids: this.filter.models,
        type: typeMap[this.filter.statBy],
        start_at: dayjs(start_at).unix(),
        end_at: dayjs(end_at).unix(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 20px;
  border-bottom: 1px solid #e4e7ed;
  .date-filters {
    display: flex;
    align-items: center;
    gap: 30px;
    label {
      margin-right: 10px;
    }
    .el-date-editor {
      width: 300px;
    }
    .el-form {
      .el-form-item {
        margin-bottom: 0;
        ::v-deep .el-form-item__label,
        ::v-deep .el-form-item__content {
          line-height: 36px;
        }
      }
    }
  }
  .update-time {
    font-size: 14px;
    color: #999;
  }
}
.models {
  display: flex;
  align-items: center;
  padding: 15px 0;
  label {
    margin-right: 10px;
  }
  .el-select {
    width: 350px;
    .option-all {
      display: flex;
      padding: 7px 20px;
      color: #606266;
      cursor: pointer;
      &.active {
        color: $--color-primary;
        font-weight: bold;
        &::after {
          position: absolute;
          top: 16px;
          right: 20px;
          font-family: 'element-icons';
          content: '\e6da';
          font-size: 12px;
          font-weight: bold;
        }
      }
      &:hover {
        background-color: #f5f7fa;
      }
    }
    ::v-deep .el-tag {
      max-width: 80%;
    }
  }
  ::v-deep .el-select-dropdown {
    width: 350px;
    .el-select-dropdown__item {
      &.hover {
        background-color: #fff !important;
      }
      &:hover {
        background-color: #f5f7fa !important;
      }
    }
  }
}
</style>
