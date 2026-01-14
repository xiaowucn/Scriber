<template>
  <div class="szse-label-file-list" v-loading="loading">
    <div class="banner">
      <h4>模型管理</h4>
      <div class="filter-options">
        <div class="search">
          <span>查找：</span>
          <el-input
            placeholder="模型名称"
            size="mini"
            v-model="searchText"
            @keyup.enter.native="getModelList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getModelList"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <el-table :data="models">
      <el-table-column
        prop="mold_id"
        label="模型ID"
        align="center"
        width="80"></el-table-column>
      <el-table-column
        prop="name"
        label="模型名称"
        align="center"></el-table-column>
      <el-table-column
        prop="model_type"
        label="模型类型"
        align="center"></el-table-column>
      <el-table-column
        prop="created_utc"
        label="训练时间"
        align="center"></el-table-column>
      <el-table-column
        prop="files"
        label="训练文件基数"
        align="center"></el-table-column>
      <el-table-column
        prop="model_status"
        label="训练状态"
        align="center"
        width="190">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.status === 3 ? 'success' : ''"
            >{{ scope.row.model_status }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="启用状态" align="center">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.enable === 1 ? 'success' : ''"
            >{{ scope.row.enable | getEnableStatus }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="precision" label="最新准确率" align="center">
        <template slot-scope="scope">{{
          scope.row.precision | conversionPercet
        }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="openSchemaDetails(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="changePage"></el-pagination>
  </div>
</template>

<script>
import { fetchSZSEModels } from '@/store/api/schema.api';

export default {
  name: 'SZSE-model-list',
  data() {
    return {
      loading: true,
      pager: {
        page: 1,
        size: 20,
      },
      models: [],
      searchText: '',
    };
  },
  filters: {
    getTrainingStatus(status) {
      switch (status) {
        case 0:
          return '训练中';
        case 1:
          return '已完成';
        default:
          return '-';
      }
    },
    getEnableStatus(status) {
      switch (status) {
        case 0:
          return '未启用';
        case 1:
          return '已启用';
        default:
          return '-';
      }
    },
  },
  created() {
    this.getModelList();
  },
  methods: {
    async getModelList() {
      try {
        this.loading = true;
        const query = Object.assign({}, this.pager, {
          moldname: this.searchText,
        });
        const res = await fetchSZSEModels(query);
        const data = res.data;
        this.models = data.items;
        this.pager = {
          page: data.page,
          size: data.size,
          total: data.total,
        };
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.pager.page = page;
      this.getModelList();
    },
    openSchemaDetails(schema) {
      const { mold_id, type } = schema;
      const routeParams = {
        name: 'schemaTree',
        params: {
          schemaId: mold_id,
          panelType: type === 2 ? 'moldLocation' : 'moldExtraction',
        },
      };
      const { href } = this.$router.resolve(routeParams);
      window.open(href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.szse-label-file-list {
  padding: 20px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    h4 {
      font-size: 14px;
      color: #666;
    }
    .filter-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          width: 60px;
        }
      }
    }
  }
  .el-alert {
    margin-bottom: 10px;
  }
  ::v-deep .el-table {
    th {
      background: #f6f7fb;
    }
    .cell {
      .el-tag {
        position: relative;
        min-width: 80px;
        padding: 0 20px;
        border-radius: 15px;
        line-height: 24px;
        &::before {
          content: '';
          position: absolute;
          top: 9px;
          left: 10px;
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #409eff;
        }
        &.el-tag--success {
          &::before {
            background: #67c23a;
          }
        }
      }
    }
  }
  ::v-deep .el-input-group__append {
    background-color: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
