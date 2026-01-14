<template>
  <div class="date-picker">
    <el-select
      size="medium"
      :disabled="disabled"
      v-model="filterBy"
      placeholder="请选择"
      @change="changeFilter"
      v-if="isShowSelect">
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span v-else class="label">{{ options[0].label }}</span>
    <el-date-picker
      size="medium"
      :disabled="disabled"
      v-model="filterValue"
      type="daterange"
      range-separator="-"
      value-format="timestamp"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="handleChange"
      :unlink-panels="true"
      :default-time="['00:00:00', '23:59:59']">
    </el-date-picker>
  </div>
</template>

<script>
import _ from 'lodash';
import { TIME_TYPE } from '@/store/constants';

export default {
  name: 'date-picker',
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterBy: '',
      filterValue: [],
    };
  },
  created() {
    this.init();
  },
  computed: {
    isShowSelect() {
      return this.options.length > 1;
    },
  },
  methods: {
    init() {
      const { type, start_at, end_at } = this.$route.query;
      if (start_at && end_at) {
        this.filterValue = [start_at * 1000, end_at * 1000];
      }
      if (type) {
        this.filterBy = Object.keys(TIME_TYPE).find(
          (key) => TIME_TYPE[key] === Number(type),
        );
      } else {
        this.filterBy = this.options[0].value;
      }
    },
    getSearchParams() {
      if (!_.isEmpty(this.filterValue)) {
        let params = {
          start_at: this.filterValue[0] / 1000,
          end_at: this.filterValue[1] / 1000,
        };
        if (this.isShowSelect) {
          params.type = TIME_TYPE[this.filterBy];
        }
        return params;
      }
    },
    handleSearch() {
      this.$emit('search');
    },
    handleChange() {
      if (!this.filterValue) {
        this.handleSearch();
      }
    },
    changeFilter() {
      this.filterValue = '';
    },
  },
};
</script>
<style scoped lang="scss">
.date-picker {
  display: flex;
  align-items: center;
  .label {
    margin-right: 9px;
    font-size: 14px;
    color: #606266;
  }
  .el-select {
    position: relative;
    right: -1px;
    ::v-deep .el-input {
      width: 100px;
      &.is-focus,
      &:hover {
        position: relative;
        z-index: 1;
      }
      .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding: 0 20px 0 10px;
        &:focus {
          position: relative;
          z-index: 1;
        }
      }
      .el-input__icon {
        position: relative;
        z-index: 2;
      }
    }
  }
  .el-select {
    + .el-date-editor {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .el-date-editor {
    &.el-input__inner {
      width: 240px;
    }
    ::v-deep .el-range-separator {
      line-height: 26px;
    }
  }
}
</style>
