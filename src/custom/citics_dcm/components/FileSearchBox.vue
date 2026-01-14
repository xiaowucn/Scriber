<template>
  <div class="search-container">
    <el-input
      clearable
      size="medium"
      ref="searchInput"
      class="filter-input"
      v-model.trim="filterValue"
      placeholder="搜索"
      @clear="handleSearch"
      @keypress.enter.native="handleSearch">
    </el-input>
    <el-select
      size="medium"
      v-model="filterBy"
      placeholder="请选择"
      @change="changeFilter">
      <el-option
        v-for="(item, index) in searchOptions"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button
      type="primary"
      class="search-btn"
      size="mini"
      @click="handleSearch">
      <svg-font-icon name="search" :size="20" />
      搜索
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'file-search-box',
  data() {
    return {
      filterBy: 'investor_name',
      filterValue: '',
      searchOptions: [
        {
          value: 'investor_name',
          label: '订单人',
        },
        {
          value: 'file_name',
          label: '文件名称',
        },
      ],
    };
  },
  methods: {
    handleSearch() {
      this.$emit('search', {
        filterBy: this.filterBy,
        filterValue: this.filterValue,
      });
    },
    changeFilter() {
      this.filterValue = '';
      this.$refs.searchInput.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.search-container {
  display: flex;
  align-items: center;

  ::v-deep .filter-input {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 1px solid transparent;
      &:focus {
        border-right: 1px solid $--color-primary;
      }
    }
  }

  ::v-deep .el-select {
    .el-input__inner {
      border-radius: 0;
      border-right: transparent;
    }
    .el-select__caret {
      color: #9ea0a5;
      font-size: 18px;
    }
    .el-icon-arrow-up {
      &::before {
        content: '\e78f';
      }
    }
  }

  ::v-deep .search-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 16px;
    font-weight: 500;
    padding: 7px 27px;
    > span {
      display: flex;
      align-items: center;
    }
    .pd-icon-search {
      margin-right: 8px;
    }
  }
}
</style>
