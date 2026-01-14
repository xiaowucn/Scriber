<template>
  <div class="citics-tg-page param-map-config">
    <div class="list-header">
      <el-button
        v-if="isCiticsTgAllow('para_add')"
        size="medium"
        type="primary"
        @click="mappingRelationDlalogVisible = true">
        <i class="fa fa-plus fa-fw"></i>
        {{ $t(`message['新增映射关系']`) }}
      </el-button>
      <div class="filter-container" v-if="isCiticsTgAllow('para_search')">
        <span>{{ $t(`message['参数名称']`) }}</span>
        <el-cascader
          v-model="filterLabel"
          :options="categoryOptions"
          :props="categoryProps"
          :placeholder="$t(`message['请选择参数名称']`)"
          separator="-"
          clearable
          size="medium"
          popper-class="label-filter-cascader"
          @change="handleChangeLabelFilter"></el-cascader>
        <search-box
          :searchOptions="searchOptions"
          :filterBy="filterBy"
          :filterValue="filterValue"
          @search="handleSearch"></search-box>
      </div>
    </div>

    <el-table
      class="has-border"
      :empty-text="$t(`message['暂无数据']`)"
      :data="paraMappingItems"
      v-loading="isLoading">
      <el-table-column
        prop="id"
        label="ID"
        width="100"
        align="center"></el-table-column>
      <el-table-column
        prop="category"
        :label="$t(`message['参数分类']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="label"
        :label="$t(`message['参数名称']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="group_name"
        :label="$t(`message['映射名称']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="values"
        :label="$t(`message['参数值']`)"
        align="center"
        class-name="para-texts-td tags-column"
        width="500">
        <template slot-scope="scope">
          <el-tooltip placement="top" popper-class="all-tags-tooltip">
            <div slot="content">
              <el-tag :key="tag" v-for="tag in scope.row.values">
                {{ tag }}
              </el-tag>
            </div>
            <p>
              <el-tag :key="tag" v-for="tag in scope.row.values">
                {{ tag }}
              </el-tag>
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="to_value"
        :label="$t(`message['映射值']`)"
        align="center"></el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="150"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isCiticsTgAllow('para_edit')"
            circle
            size="small"
            type="text"
            @click="handleEditMappingRelation(scope.row)">
            编辑
          </el-button>
          <el-button
            v-if="isCiticsTgAllow('para_del')"
            class="delete-btn"
            circle
            size="small"
            type="text"
            @click="handleDeleteMappingRelation(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50, 100]"
      :total="pager.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange">
    </el-pagination>
    <mapping-relation-dialog
      v-if="mappingRelationDlalogVisible"
      :current-edit-item="currentEditItem"
      @close="handleCloseDialog"
      @fetchList="getParaMappingList"></mapping-relation-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import MappingRelationDialog from '../components/MappingRelationDialog.vue';
import SearchBox from '../components/SearchBox';
import {
  fetchParaMappingList,
  deleteParaMapping,
  fetchSchemaItems,
} from '@/store/api/citics-tg.api';
import { isCiticsTgAllow, convertObjectTreeToArray } from '../common/utils';
export default {
  name: 'citics-tg-param-map',
  components: { MappingRelationDialog, SearchBox },
  data() {
    return {
      isLoading: false,
      paraMappingItems: [],
      mappingRelationDlalogVisible: false,
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      currentEditItem: null,
      filterLabel: null,
      searchOptions: [
        {
          value: 'group_name',
          label: '映射名称',
        },
        {
          value: 'to_value',
          label: '映射值',
        },
      ],
      filterBy: 'group_name',
      filterValue: null,
      categoryProps: {
        label: 'value',
        expandTrigger: 'hover',
      },
      categoryOptions: [],
    };
  },
  computed: {},
  mounted() {
    this.handleGetSchemaItems();
    this.getParaMappingList();
  },
  methods: {
    isCiticsTgAllow,
    async handleGetSchemaItems() {
      try {
        const params = {
          for_convert: true,
        };
        const res = await fetchSchemaItems(params);
        this.categoryOptions = convertObjectTreeToArray(res.data);
      } catch (error) {
        console.error(error);
      }
    },
    async getParaMappingList() {
      try {
        this.isLoading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        if (this.filterLabel) {
          params.category = this.filterLabel[0];
          params.label = this.filterLabel[1];
        }
        const res = await fetchParaMappingList(params);
        this.paraMappingItems = res.data.items;
        this.pager.total = res.data.total;
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

    handleEditMappingRelation(row) {
      this.currentEditItem = _.cloneDeep(row);
      // this.currentEditItem.category = this.currentEditItem.category.split('-');
      this.currentEditItem.category = [this.currentEditItem.category];
      this.mappingRelationDlalogVisible = true;
    },
    handleDeleteMappingRelation(row) {
      this.$confirm('确认删除映射关系吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteParaMapping(row.id);
        })
        .catch(() => {});
    },

    async deleteParaMapping(id) {
      try {
        await deleteParaMapping(id);
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
        });
        if (this.paraMappingItems.length === 1 && this.pager.page !== 1) {
          this.pager.page -= 1;
        }
        this.getParaMappingList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    handleCloseDialog() {
      this.mappingRelationDlalogVisible = false;
      this.currentEditItem = null;
    },

    handleCurrentPageChange(val) {
      this.pager.page = val;
      this.getParaMappingList();
    },

    handleSizeChange(val) {
      this.pager.size = val;
      this.pager.page = 1;
      this.getParaMappingList();
    },

    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.pager.page = 1;
      this.getParaMappingList();
    },

    handleChangeLabelFilter() {
      this.pager.page = 1;
      this.getParaMappingList();
    },
  },
};
</script>

<style lang="scss" scoped>
.delete-btn {
  color: red;
}
.filter-container {
  display: flex;
  align-items: center;
  span {
    font-size: 14px;
  }
  .el-cascader {
    margin: 0 10px;
    width: 245px;
  }
}
</style>
<style lang="scss">
.label-filter-cascader {
  .el-cascader-panel {
    .el-cascader-menu {
      .el-cascader-menu__wrap {
        overflow-x: hidden;
        height: auto;
        max-height: 204px;
        padding-bottom: 15px;
      }
    }
  }
}
</style>
