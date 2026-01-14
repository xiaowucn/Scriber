<template>
  <div class="search-box">
    <div class="search-container">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        class="search-form"
        :class="{
          'search-form-default':
            displayedSearchFormList.length >= defaultSearchFormNumber,
        }">
        <el-form-item
          :key="index"
          :label="`${item.label}：`"
          :prop="item.key"
          v-for="(item, index) in displayedSearchFormList">
          <el-date-picker
            v-if="item.isDatePicker"
            size="small"
            type="daterange"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="searchForm[item.key]"
            @change="handleDataPickerChange"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          <el-select
            v-else-if="item.isSelect"
            clearable
            placeholder="请选择"
            v-model="searchForm[item.key]"
            @change="handleSelectChange">
            <el-option
              v-for="(option, index) in item.options"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
          <el-input
            v-else
            clearable
            type="text"
            size="small"
            placeholder="请输入"
            v-model.trim="searchForm[item.key]"
            @clear="handleInputClear"
            @keyup.enter.native="handleSearch" />
        </el-form-item>
      </el-form>
      <div class="search-btns">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="toggle-btn" v-if="isShowToggleBtn">
      <el-button @click="toggleSearchForm">
        {{ toggleBtnText }}
        <i :class="toggleBtnIconClass"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { EventBus } from '@/utils';
export default {
  name: 'search-box',
  props: {
    searchFormList: {
      type: Array,
      required: true,
      default: () => [],
    },
    defaultSearchData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showMore: false,
      defaultSearchFormNumber: 3,
      searchForm: {},
    };
  },
  created() {
    this.init();
    EventBus.$on('clear-search-form', this.handleReset);
  },
  beforeDestroy() {
    EventBus.$off('clear-search-form', this.handleReset);
  },
  computed: {
    toggleBtnText() {
      return this.showMore ? '收起' : '更多筛选';
    },
    toggleBtnIconClass() {
      return this.showMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down';
    },
    isShowToggleBtn() {
      return this.searchFormList.length > this.defaultSearchFormNumber;
    },
    displayedSearchFormList() {
      return this.showMore
        ? this.searchFormList
        : this.searchFormList.slice(0, this.defaultSearchFormNumber);
    },
  },
  watch: {
    searchFormList: {
      handler() {
        this.initSearchForm();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.initShowMore();
      this.initSearchForm();
    },
    initSearchForm() {
      this.searchFormList.forEach((item) => {
        const searchItemValue =
          item.isSelect && item.autoSelectOption === true
            ? item.options[0].value
            : '';
        this.$set(this.searchForm, item.key, item.value ?? searchItemValue);
      });
      this.defaultSearchData.forEach((item) => {
        this.$set(this.searchForm, item.key, item.value);
      });
    },
    initShowMore() {
      const hasValuesAfterDefaultSearchFormNumber = this.searchFormList
        .slice(this.defaultSearchFormNumber)
        .some((item) => item.value && item.value !== '');
      this.showMore = hasValuesAfterDefaultSearchFormNumber;
    },
    toggleSearchForm() {
      this.showMore = !this.showMore;
    },
    handleSearch() {
      if (
        _.every(
          _.values(this.searchForm),
          (value) => value === '' || value === null,
        )
      ) {
        this.$emit('clear');
        return;
      }
      const searchParams = _.omitBy(
        this.searchForm,
        (value) => value === '' || value === null,
      );
      this.$emit('search', searchParams);
    },
    handleInputClear() {
      this.handleSearch();
    },
    handleDataPickerChange() {
      this.handleSearch();
    },
    handleSelectChange() {
      this.handleSearch();
    },
    handleReset() {
      this.showMore = false;
      this.$emit('clear');
      this.$nextTick(() => {
        this.initSearchForm();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.search-box {
  .search-container {
    display: flex;
    justify-content: space-between;
    column-gap: 30px;
  }
  ::v-deep .search-form {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 30px;
    .el-form-item {
      display: inline-flex;
      margin: 0px;
    }
    .el-form-item__content {
      flex: 1;
    }
    .el-form-item__label {
      font-size: 14px;
      padding-right: 5px;
      white-space: nowrap;
    }
    .el-form-item__label,
    .el-form-item__content {
      line-height: 32px;
    }
    .el-input__inner {
      height: 32px;
      max-width: unset;
      padding: 0px 32px 0 15px;
    }
    .el-input__suffix {
      display: flex;
      align-items: center;
    }
    .el-date-editor {
      &.el-input__inner {
        width: 100%;
        padding: 0 5px 0 10px;
      }
    }
    .el-select {
      width: 100%;
    }
  }
  .search-btns {
    height: 100%;
    display: flex;
    align-items: flex-start;
    .el-button {
      width: 60px;
      height: 32px;
      padding: 0px;
      border-radius: 2px;
      + .el-button {
        margin-left: 20px;
      }
    }
  }
  .toggle-btn {
    width: 100%;
    display: flex;
    margin-top: 20px;
    &:before,
    &:after {
      content: '';
      flex: 1 1;
      margin: auto;
      border: 0.5px solid #dcdee0;
    }
    .el-button {
      border: none;
      background: unset;
      padding: 0px 16px;
    }
  }
}
</style>
