<template>
  <div class="contract-wrapper" v-loading="isLoading">
    <div class="search-wrapper">
      <el-form ref="searchForm" :inline="true" :model="searchForm">
        <el-form-item>
          <el-input
            v-model="searchForm.contract_no"
            placeholder="合同编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.company_name"
            placeholder="企业名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.third_party_name"
            placeholder="第三方名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.project_name"
            placeholder="项目名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.area"
            placeholder="地区"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.variety" placeholder="品种" clearable>
            <el-option
              :label="variety.name"
              :value="variety.name"
              v-for="(variety, index) in varieties"
              :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.date"
            type="daterange"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="签署日期开始"
            end-placeholder="签署日期结束">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.created_utc"
            type="daterange"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="创建日期开始"
            end-placeholder="创建日期结束">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="search-buttons">
        <el-button type="primary" size="small" @click="handleSearchClick"
          >查询</el-button
        >
        <el-button size="small" @click="handleResetClick">重置</el-button>
      </div>
    </div>
    <div class="table-wrapper">
      <h5>合同列表</h5>
      <el-table
        :data="contractList"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod"
          align="center"
          width="80"></el-table-column>
        <el-table-column label="合同编号" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetailClick(scope.row)"
              >{{ scope.row.contract_no || '-' }}</el-button
            >
          </template></el-table-column
        >
        <el-table-column label="企业名称" align="center"
          ><template slot-scope="scope">{{
            scope.row.company_name || '-'
          }}</template></el-table-column
        >
        <el-table-column label="合同签署第三方" align="center"
          ><template slot-scope="scope">{{
            scope.row.third_party_name || '-'
          }}</template></el-table-column
        >
        <el-table-column label="地区" align="center" width="100"
          ><template slot-scope="scope">{{
            scope.row.area || '-'
          }}</template></el-table-column
        >
        <el-table-column label="项目名称" align="center"
          ><template slot-scope="scope">{{
            scope.row.project_name || '-'
          }}</template></el-table-column
        >
        <el-table-column label="签署日期" align="center" width="125"
          ><template slot-scope="scope">
            <span class="action-time">{{
              scope.row.meta['签订日期'] || '-'
            }}</span>
          </template></el-table-column
        >
        <el-table-column label="品种" align="center" width="120"
          ><template slot-scope="scope">{{
            scope.row.variety || '-'
          }}</template></el-table-column
        >
        <el-table-column label="首次金额" align="center" width="100"
          ><template slot-scope="scope">{{
            getAmount(scope.row.meta['首次金额（债券）'])
          }}</template></el-table-column
        >
        <el-table-column label="分期金额" align="center" width="100"
          ><template slot-scope="scope">{{
            getAmount(scope.row.meta['分期金额'])
          }}</template></el-table-column
        >
        <el-table-column label="创建时间" align="center" width="90">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetailClick(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pager.size"
        layout="prev,pager,next,sizes,jumper,total"
        :total="pager.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { fetchContracts } from '@/store/api/ccxi.contract.api';
import { schema as schemaApi } from '@/store/api';
import { endTimestampOffset } from '@/store/constants';
export default {
  name: 'ccxi-contract',
  data() {
    return {
      isLoading: false,
      searchForm: {
        contract_no: '',
        company_name: '',
        third_party_name: '',
        project_name: '',
        area: '',
        variety: '',
        date: null,
        created_utc: null,
      },
      varieties: [],
      contractList: [],
      pager: {
        page: 1,
        total: 0,
        size: 50,
      },
    };
  },

  computed: {
    searchParams() {
      const params = _.omit(this.searchForm, ['date', 'created_utc']);
      const data = _.pickBy(params, (val) => val);
      let result = {
        page: this.pager.page,
        size: this.pager.size,
        ...data,
      };
      if (this.searchForm.date) {
        const [start, end] = this.searchForm.date;
        result.date_signed_start = start / 1000;
        result.date_signed_end = (end + endTimestampOffset) / 1000;
      }
      if (this.searchForm.created_utc) {
        const [start, end] = this.searchForm.created_utc;
        result.created_utc_start = start / 1000;
        result.created_utc_end = (end + endTimestampOffset) / 1000;
      }
      return result;
    },
  },

  created() {
    if (!_.isEmpty(this.$route.params)) {
      this.searchForm = this.$route.params.searchParams;
      this.pager = this.$route.params.pager;
    }
    this.getContracts();
    this.getVarieties();
  },

  methods: {
    async getVarieties() {
      try {
        const { data } = await schemaApi.fetchAllSchema({
          name: '合同提取',
        });
        const schemeTypes = _.get(data, 'items[0].data.schema_types');
        const varietyInfo = schemeTypes.find((item) => {
          return item.label === '品种';
        });
        this.varieties = varietyInfo.values;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async getContracts() {
      try {
        this.isLoading = true;
        const params = { ...this.searchParams };
        const res = await fetchContracts(params);
        this.contractList = res.data.items;
        this.pager.page = res.data.page;
        this.pager.size = res.data.size;
        this.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    handleSearchClick() {
      this.pager = {
        page: 1,
        total: 0,
        size: 50,
      };
      this.getContracts();
    },
    handleResetClick() {
      this.searchForm = {
        contract_no: '',
        company_name: '',
        third_party_name: '',
        project_name: '',
        area: '',
        variety: '',
        date: null,
      };
      this.pager = {
        page: 1,
        total: 0,
        size: 50,
      };
      this.getContracts();
    },
    indexMethod(index) {
      return index + 1 + (this.pager.page - 1) * this.pager.size;
    },
    getAmount(amount) {
      if (!amount) {
        return '-';
      }
      return amount.split('（')[0];
    },
    handleDetailClick(row) {
      console.log(row);
      this.$router.push({
        name: 'contractDetail',
        query: {
          id: row.id,
          treeId: row.tree_id,
          fid: row.fid,
        },
        params: {
          searchParams: {
            ...this.searchForm,
          },
          pager: {
            ...this.pager,
          },
        },
      });
    },
    handleSizeChange(size) {
      this.pager.size = size;
      this.pager.page = 1;
      this.getContracts();
    },
    handleCurrentChange(page) {
      this.pager.page = page;
      this.getContracts();
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-wrapper {
  height: calc(100vh - 60px);
  overflow: auto;
  padding: 10px 30px;
  box-sizing: border-box;

  .search-wrapper {
    border: 1px solid #f2f1f1;
    padding: 10px;
    ::v-deep .el-form {
      .el-form-item {
        margin-bottom: 15px;
        .el-input {
          .el-input__inner {
            width: 240px;
          }
        }
      }
    }
    .search-buttons {
      display: flex;
      justify-content: flex-end;
    }
  }
  .table-wrapper {
    border: 1px solid #f2f1f1;
    padding: 10px;
    margin-top: 5px;

    ::v-deep .el-table {
      margin-top: 10px;
      .el-table__header {
        th {
          background: #fafafa;
        }
      }
    }
    ::v-deep .el-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 5px;

      .el-pagination__jump {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
}
</style>
