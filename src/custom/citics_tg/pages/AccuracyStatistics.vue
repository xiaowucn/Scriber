<template>
  <div class="citics-tg-page">
    <div class="list-header">
      <div class="search-container">
        <el-select
          size="medium"
          v-model="filterField"
          clearable
          multiple
          collapse-tags
          :placeholder="$t(`message['请选择字段']`)"
          @change="handleFilterFieldChange">
          <el-option
            v-for="(item, index) in searchOptions"
            :key="index"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="statistics-container">
      <el-table
        class="has-border"
        :empty-text="$t(`message['暂无数据']`)"
        :data="items"
        v-loading="isLoading">
        <el-table-column
          prop="name"
          :label="$t(`message['字段名称']`)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="私募基金合同_rate"
          label="私募基金合同"
          align="center">
        </el-table-column>
        <el-table-column prop="资管合同_rate" label="资管合同" align="center">
        </el-table-column>
        <el-table-column
          prop="资管合同_补充协议_rate"
          label="资管合同_补充协议"
          align="center">
        </el-table-column>
        <el-table-column
          prop="私募基金合同_补充协议_rate"
          label="私募基金合同_补充协议"
          align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { fetchModelStatistics } from '@/store/api/citics-tg.api';
export default {
  name: 'citics-tg-accuracy-statistics',
  data() {
    return {
      items: [],
      filterField: [],
      isLoading: false,
      searchOptions: [],
    };
  },
  mounted() {
    this.getModelStatistics();
  },
  methods: {
    async getModelStatistics() {
      try {
        this.isLoading = true;
        const res = await fetchModelStatistics();
        this.searchOptions = this.convertStatisticsData(res.data);
        this.items = _.cloneDeep(this.searchOptions);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    convertStatisticsData(data) {
      const transformedData = {};
      data.forEach((item) => {
        const itemName = item.name;
        const result = item.data.result;
        if (result) {
          result.forEach((obj) => {
            const productName = obj.name;
            const rateKey = `${itemName}_rate`;

            if (!transformedData[productName]) {
              transformedData[productName] = {};
            }

            transformedData[productName][rateKey] =
              Math.round(obj.rate * 100) + '%';
          });
        }
      });

      const finalTransformedData = Object.entries(transformedData).map(
        ([name, values]) => ({
          name,
          ...values,
        }),
      );

      return finalTransformedData.filter((item) => !item.name.includes('拆分'));
    },
    handleFilterFieldChange() {
      if (this.filterField.length > 0) {
        const data = [];
        this.filterField.forEach((field) => {
          const filterData = this.searchOptions.filter(
            (item) => item.name === field,
          );
          data.push(...filterData);
        });
        this.items = data;
      } else {
        this.items = this.searchOptions;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.citics-tg-page {
  .search-container {
    display: flex;
    align-items: center;
    .el-select {
      width: 350px;
      margin-right: 10px;
    }
  }
}
</style>
