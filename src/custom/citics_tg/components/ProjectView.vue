<template>
  <div class="project-view">
    <div class="list-header">
      <div>
        <el-button
          v-if="isCiticsTgAllow('prj_add')"
          size="medium"
          type="primary"
          @click="projectDialogVisible = true">
          <i class="fa fa-plus fa-fw"></i>
          {{ $t(`message['新建项目']`) }}
        </el-button>
      </div>
      <div v-if="isCiticsTgAllow('prj_search')" class="filter-container">
        <span>{{ $t(`message['产品类型']`) }}</span>
        <el-select
          v-model="filterProductType"
          clearable
          :placeholder="$t(`message['请选择产品类型']`)"
          size="medium"
          @change="getProjects">
          <el-option label="全部" value=""> </el-option>
          <el-option
            v-for="item in productTypes"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
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
      :data="projectItems"
      v-loading="isLoading"
      @row-click="jumpToFileList">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column
        prop="name"
        :label="$t(`message['项目名称']`)"
        class-name="name">
        <template slot-scope="scope">
          <theme-icon
            name="folder"
            icon-class="fa fa-box fa-fw fa-2x box-icon"
            img-class="folder"></theme-icon>
          <span class="icontext">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_type"
        :label="$t(`message['产品类型']`)"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.meta ? scope.row.meta.product_type : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_name"
        :label="$t(`message['产品名称']`)"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.meta ? scope.row.meta.product_name : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_num"
        :label="$t(`message['产品代码']`)"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.meta ? scope.row.meta.product_num : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="user_name"
        :label="$t(`message['创建人']`)"
        align="center"></el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="150"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip
              effect="dark"
              :content="$t(`message['编辑']`)"
              placement="top">
              <el-button
                v-if="isCiticsTgAllow('prj_edit')"
                circle
                size="small"
                type="text"
                @click.stop="handleEditProject(scope.row)">
                <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="$t(`message['删除']`)"
              placement="top">
              <el-button
                v-if="isCiticsTgAllow('prj_del')"
                circle
                size="small"
                type="text"
                @click.stop="handleDeleteProject(scope.row)">
                <theme-icon
                  name="delete"
                  icon-class="el-icon-delete"></theme-icon>
              </el-button>
            </el-tooltip>
          </el-row>
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
    <project-dialog
      v-if="projectDialogVisible"
      :current-edit-item="currentEditItem"
      :product-types="productTypes"
      @close="closeProjectPopup"
      @fetchList="getProjects">
    </project-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import ProjectDialog from '../components/ProjectDialog';
import SearchBox from '../components/SearchBox';
import { fetchProjects } from '@/store/api/citics-tg.api';
import { deleteProject } from '@/store/api/project.api';
import { isCiticsTgAllow } from '../common/utils';
export default {
  name: 'projectView',
  components: { ProjectDialog, SearchBox },
  data() {
    return {
      currentTab: '',
      isLoading: false,
      projectItems: [],
      projectDialogVisible: false,
      searchOptions: [
        {
          value: 'pid',
          label: '项目ID',
        },
        {
          value: 'name',
          label: '项目名称',
        },
        {
          value: 'product_name',
          label: '产品名称',
        },
        {
          value: 'product_num',
          label: '产品代码',
        },
      ],
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      currentEditItem: null,
      filterBy: 'pid',
      filterValue: null,
      filterProductType: '',
    };
  },
  watch: {
    $route() {},
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('citicsTgModule', ['productTypes']),
  },
  mounted() {
    this.getProjects();
  },
  methods: {
    isCiticsTgAllow,
    async getProjects() {
      try {
        this.isLoading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        if (this.filterProductType) {
          params.product_type = this.filterProductType;
        }
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        const res = await fetchProjects(params);
        this.projectItems = res.data.items;
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
    handleEditProject(row) {
      this.currentEditItem = _.cloneDeep(row);
      this.projectDialogVisible = true;
    },
    handleDeleteProject(row) {
      this.$confirm('确认删除项目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteProject(row.id);
        })
        .catch(() => {});
    },
    async deleteProject(id) {
      try {
        await deleteProject(id);
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
        });
        if (this.projectItems.length === 1 && this.pager.page !== 1) {
          this.pager.page -= 1;
        }
        this.getProjects();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    closeProjectPopup() {
      this.projectDialogVisible = false;
      this.currentEditItem = null;
    },
    jumpToFileList(row) {
      if (!this.isCiticsTgAllow('prj_detail')) {
        return;
      }
      const { id, rtree_id } = row;
      this.$router.push({
        path: `/citics-tg/projectList/${id}/tree/${rtree_id}`,
      });
    },
    handleCurrentPageChange(val) {
      this.pager.page = val;
      this.getProjects();
    },

    handleSizeChange(val) {
      this.pager.size = val;
      this.pager.page = 1;
      this.getProjects();
    },

    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.pager.page = 1;
      this.getProjects();
    },
  },
};
</script>

<style lang="scss" scoped>
.project-view {
  .el-icon-view {
    font-size: 16px;
    font-weight: bolder;
    vertical-align: text-bottom;
  }
  .filter-container {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
    }
    .el-select {
      margin: 0 10px;
    }
  }
}
</style>
