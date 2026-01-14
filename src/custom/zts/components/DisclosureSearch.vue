<template>
  <div class="disclosure-search">
    <div class="select-box">
      <span class="label">交易所</span>
      <el-select
        clearable
        size="medium"
        v-model="exchangeValue"
        placeholder="请选择"
        @change="handleSearch">
        <el-option
          v-for="item in exchangeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="select-box">
      <span class="label">项目状态</span>
      <el-select
        clearable
        size="medium"
        v-model="statusValue"
        placeholder="请选择"
        @change="handleSearch">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-input
      clearable
      size="medium"
      ref="contentInput"
      v-model="contentValue"
      placeholder="请输入"
      @keyup.enter.native="handleSearch"
      @clear="handleClear">
      <el-select
        slot="prepend"
        placeholder="请选择"
        v-model="contentSelected"
        @change="handleContentSelect">
        <el-option
          v-for="(item, index) in contentOptions"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-input>
    <el-button
      type="primary"
      size="medium"
      class="search-button"
      @click="handleSearch">
      <svg-font-icon name="search" :size="20"></svg-font-icon>
      {{ $t(`message['搜索']`) }}
    </el-button>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  EXCHANGES,
  PROJECT_STATUS,
  PROJECT_STATUS_CODE,
} from '../common/constant';

export default {
  name: 'disclosure-search',
  props: {
    page: {
      type: Number,
      required: false,
    },
    size: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      exchangeOptions: [],
      statusOptions: [],
      contentOptions: [
        {
          value: 'project_id',
          label: '项目ID',
        },
        {
          value: 'file_name',
          label: '文件名称',
        },
        {
          value: 'user_name',
          label: '创建人',
        },
      ],
      contentSelected: 'project_id',
      exchangeValue: '',
      statusValue: '',
      contentValue: '',
    };
  },
  watch: {
    page() {
      this.refreshRouter();
    },
    size() {
      this.refreshRouter();
    },
  },
  created() {
    this.initSearchOptions();
    this.getSearchParams();
  },
  computed: {
    searchData() {
      const params = {
        exchange: this.exchangeValue,
        status: this.statusValue,
        [this.contentSelected]: this.contentValue,
      };
      return _.pickBy(params, (value) => value !== null && value !== '');
    },
  },
  methods: {
    initSearchOptions() {
      this.exchangeOptions = _.concat(
        { value: '', label: '全部' },
        _.map(EXCHANGES, (value) => ({
          value: value,
          label: value,
        })),
      );
      this.statusOptions = _.concat(
        { value: '', label: '全部' },
        _.map(PROJECT_STATUS_CODE, (value) => ({
          value: value,
          label: PROJECT_STATUS[value],
        })),
      );
    },
    getSearchParams() {
      const { query } = this.$route;
      const { exchange, status } = query;
      const selectedKey = this.contentOptions
        .map((item) => item.value)
        .find((key) => key in query);
      if (exchange) {
        this.exchangeValue = exchange;
      }
      if (status) {
        this.statusValue = Number(status);
      }
      if (selectedKey) {
        this.contentValue = query[selectedKey];
        this.contentSelected = selectedKey;
      } else {
        this.contentSelected = this.contentOptions[0].value;
      }
    },
    validateSearchVal() {
      let reg = /^[0-9]*$/;
      if (this.searchData.project_id && !reg.test(this.searchData.project_id)) {
        this.$notify({
          title: '警告',
          message: '项目ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    handleSearch() {
      if (!this.validateSearchVal()) {
        return;
      }
      const isSearchFileName = _.has(this.searchData, 'file_name');
      this.$emit('search', this.searchData, isSearchFileName);
      this.refreshRouter();
    },
    handleContentSelect() {
      this.contentValue = '';
      this.$nextTick(() => {
        this.$refs.contentInput.focus();
      });
    },
    handleClear() {
      this.handleSearch();
    },
    refreshRouter() {
      this.$router.replace({
        path: this.$route.path,
        query:
          this.page && this.size
            ? { ...this.searchData, page: this.page, size: this.size }
            : { ...this.searchData },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-search {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 20px;
  font-size: 14px;
  .select-box {
    display: flex;
    align-items: center;
    .label {
      white-space: nowrap;
      margin-right: 8px;
      color: #606266;
    }
    .el-select {
      max-width: 120px;
    }
  }
  ::v-deep .el-input {
    &.el-input-group {
      max-width: 300px;
    }
    .el-input-group__prepend {
      background-color: #ffffff;
    }
    .el-select {
      width: 100px;
      .el-input__inner {
        color: #606266;
        padding: 0px 20px 0px 10px;
      }
    }
  }
  .search-button {
    height: 36px;
    font-size: 16px;
    padding: 7px 20px;
    ::v-deep > span {
      display: flex;
      align-items: center;
    }
    .svg-icon-container {
      margin-right: 5px;
    }
  }
}
</style>
