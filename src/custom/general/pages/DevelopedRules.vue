<template>
  <div class="developed-rules">
    <div class="search-header">
      <el-select
        v-model="search.field"
        size="small"
        class="search-type-select"
        placeholder="请选择"
        @change="changeSearchType">
        <el-option
          v-for="(item, index) in searchOptions"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <template>
        <el-input
          size="small"
          clearable
          v-model.trim="search.keyword"
          :placeholder="`请输入${
            search.field === 'name' ? '规则名称' : '合同类型'
          }`"
          @clear="searchRules"
          @keydown.enter.native="searchRules">
        </el-input>
      </template>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="searchRules"></el-button>
    </div>
    <el-table :data="rules">
      <el-table-column
        label="法规ID"
        prop="law_id"
        width="100"></el-table-column>
      <el-table-column label="法规内容" prop="law"></el-table-column>
      <el-table-column label="规则名称" prop="name"></el-table-column>
      <el-table-column
        label="所属合同类型"
        prop="rule_type"
        width="180"></el-table-column>
      <el-table-column label="规则内容" prop="content"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="pager.total"
      :current-page="pager.page"
      :page-size="pager.size"
      @current-change="handleChangePage"></el-pagination>
  </div>
</template>

<script>
import { fetchDevelopedRuleList } from '@/store/api/cgs.api';

export default {
  name: 'developed-rules',
  data() {
    return {
      search: {
        field: 'name',
        keyword: '',
      },
      searchOptions: [
        {
          value: 'name',
          label: '规则名称',
        },
        {
          value: 'rule_type',
          label: '合同类型',
        },
      ],
      rules: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
    };
  },
  created() {
    this.getRules();
  },
  methods: {
    async getRules() {
      try {
        const params = {
          field: this.search.field,
          keyword: this.search.keyword,
          page: this.pager.page,
        };
        const { data } = await fetchDevelopedRuleList(params);
        this.rules = data.items;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleChangePage(page) {
      this.pager.page = page;
      this.getRules();
    },
    changeSearchType() {
      this.search.keyword = '';
    },
    searchRules() {
      this.pager.page = 1;
      this.getRules();
    },
  },
};
</script>

<style lang="scss" scoped>
.developed-rules {
  padding: 0 20px;
  .search-header {
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;
    .el-select,
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
    .search-type-select {
      width: 120px;
      margin-right: 0;
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
