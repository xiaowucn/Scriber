<template>
  <div class="search-container">
    <el-select
      size="medium"
      v-model="filterByData"
      placeholder="请选择"
      @change="changeFilter">
      <el-option
        v-for="(item, index) in searchOptions"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select
      class="value-select"
      v-if="currentFilterOptions"
      v-model="filterValueData"
      clearable
      size="medium"
      placeholder="请选择"
      @change="handleSearch">
      <el-option
        v-for="item in currentFilterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input
      v-else
      ref="searchInput"
      size="medium"
      clearable
      class="filter-input"
      v-model.trim="filterValueData"
      @clear="handleSearch"
      @keypress.enter.native="handleSearch">
    </el-input>
    <el-button
      type="primary"
      class="search-btn"
      size="mini"
      @click="handleSearch">
      <svg-font-icon name="search" :size="20"></svg-font-icon>
      搜索
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'search-box',
  props: {
    searchOptions: {
      type: Array,
      required: false,
      default: () => [],
    },
    filterBy: {
      type: String,
      required: false,
      default: '',
    },
    filterValue: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      filterByData: this.filterBy,
      filterValueData: this.filterValue,
      currentFilterOptions: null,
    };
  },
  methods: {
    validateSearchVal() {
      if (
        this.filterByData === 'pid' ||
        this.filterByData === 'fileid' ||
        this.filterByData === 'fid'
      ) {
        let reg = /^[0-9]*$/;
        if (!reg.test(this.filterValueData)) {
          this.$notify({
            title: this.$t(`message['警告']`),
            message: this.$t(`message['请输入数字']`),
            type: 'warning',
          });
          return false;
        }
      }
      return true;
    },
    handleSearch() {
      if (!this.validateSearchVal()) {
        return;
      }
      this.$emit('search', {
        filterBy: this.filterByData,
        filterValue: this.filterValueData,
      });
    },
    changeFilter() {
      this.currentFilterOptions = this.searchOptions.find(
        (item) => item.value === this.filterByData,
      )?.options;
      this.filterValueData = '';
      if (!this.currentFilterOptions) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.search-container {
  display: flex;
  align-items: center;
  width: 500px;

  ::v-deep .filter-input {
    .el-input__inner {
      border-radius: 0;
    }
  }
  .el-input {
    flex: 1;
  }

  ::v-deep .el-select {
    width: 108px;
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: transparent;
      &:focus {
        border-right: 1px solid $--color-primary;
      }
    }
  }
  .value-select {
    flex: 1;
    ::v-deep .el-input__inner {
      border-radius: 0;
      border-right: transparent;
      &:focus {
        border-right: 1px solid $--color-primary;
      }
    }
  }

  ::v-deep .search-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 16px;
    font-weight: 400;
    padding: 7px 26px;
    > span {
      display: flex;
      align-items: center;
    }
  }

  .pd-icon-search {
    margin-right: 7px;
  }
}
</style>
