<template>
  <div class="model-config-page" v-loading="isLoading">
    <div class="page-header model-header">
      <el-button
        size="medium"
        type="primary"
        @click="modelDialogVisible = true">
        <i class="fa fa-plus fa-fw"></i>
        新增模型
      </el-button>
      <search-box :searchData="searchData" @search="searchModels" />
    </div>
    <el-table
      :data="modelsData"
      ref="table"
      class="has-border"
      height="auto"
      empty-text="暂无数据"
      @sort-change="handleSortChange">
      <el-table-column prop="id" align="center" label="ID"></el-table-column>
      <el-table-column prop="name" align="center" label="名称">
      </el-table-column>
      <el-table-column prop="address" align="center" label="地址">
      </el-table-column>
      <el-table-column prop="intro" align="center" label="简介">
      </el-table-column>
      <el-table-column prop="usage" align="center" label="使用方式">
      </el-table-column>
      <el-table-column prop="user_name" align="center" label="创建人">
      </el-table-column>
      <el-table-column
        prop="created_utc"
        align="center"
        label="创建时间"
        width="170"
        sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="handleEditModelConfig(scope.row)">
              <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="模型使用" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="handleUseModel(scope.row)">
              <svg-font-icon class="model-view-icon" name="model-view" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="handleDeleteModelConfig(scope.row)">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <model-dialog
      v-if="modelDialogVisible"
      :current-edit-item="currentEditItem"
      @close="handleCloseDialog"
      @fetch-list="handleUpdateList"></model-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import SearchBox from '../components/SearchBox';
import ModelDialog from '../components/ModelDialog';
import { getSortParams } from '@/utils';
import { fetchModels, deleteModels } from '../../../store/api/cmfchina.api';

export default {
  name: 'model-config-page',
  components: {
    SearchBox,
    ModelDialog,
  },
  data() {
    return {
      searchData: {
        dateOptions: [
          {
            value: 'created_utc',
            label: '创建时间',
          },
        ],
        contentOptions: [
          {
            value: 'name',
            label: '模型名称',
          },
          {
            value: 'id',
            label: '模型ID',
          },
          {
            value: 'user_name',
            label: '创建用户',
          },
        ],
      },
      modelsData: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      modelDialogVisible: false,
      currentEditItem: null,
      sortParams: {},
      searchParams: {},
      isLoading: false,
    };
  },
  mounted() {
    this.fetchModelsList();
  },
  methods: {
    searchModels(searchParams) {
      this.searchParams = searchParams;
      this.fetchModelsList();
    },
    async fetchModelsList() {
      try {
        this.isLoading = true;
        let params = {
          page: this.pager.page,
          size: this.pager.size,
          ...this.searchParams,
          ...this.sortParams,
        };
        const res = await fetchModels(params);
        this.modelsData = res.data.items;
        this.pager.total = res.data.total;
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
    handleUpdateList() {
      this.pager.page = 1;
      this.fetchModelsList();
    },
    handleChangePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = page;
      this.fetchModelsList();
    },
    handleChangeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = 1;
      this.pager.size = size;
      this.fetchModelsList();
    },
    handleSortChange(sort) {
      const { prop, order } = sort;
      this.sortParams = getSortParams(prop, order);
      this.fetchModelsList();
    },
    handleEditModelConfig(row) {
      this.currentEditItem = _.cloneDeep(row);
      this.modelDialogVisible = true;
    },
    handleCloseDialog() {
      this.modelDialogVisible = false;
      this.currentEditItem = null;
    },
    handleUseModel(row) {
      this.$router.push(`/model/use/${row.id}`);
    },
    handleDeleteModelConfig(row) {
      this.$confirm('确认删除模型吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await deleteModels(row.id);
            this.$notify({
              title: '成功',
              message: '删除成功!',
              type: 'success',
            });
            if (this.modelsData.length === 1 && this.pager.page !== 1) {
              this.pager.page -= 1;
            }
            this.fetchModelsList();
          } catch (error) {
            this.$notify({
              title: '错误',
              message: error.message,
              type: 'error',
            });
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
.model-config-page {
  .model-header {
    display: flex;
    justify-content: space-between;
  }
  .model-view-icon {
    font-size: 20px;
    color: #606266 !important;
    vertical-align: baseline;
    margin: 0 10px;
  }
}
</style>
