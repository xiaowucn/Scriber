<template>
  <div class="disclosure-container">
    <div class="page-header">
      <disclosure-search
        @search="handleSearch"
        :page="projects.pager.page"
        :size="projects.pager.size" />
    </div>
    <div class="disclosure-list">
      <el-table
        class="has-border"
        empty-text="暂无数据"
        :data="projects.items"
        v-loading="projects.isLoading"
        row-key="id"
        :expand-row-keys="expandRowKeys"
        @expand-change="handleExpandChange">
        <el-table-column v-if="isShowTableExpand" type="expand" width="30">
          <template slot-scope="scope">
            <disclosure-list-expand :projectId="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="项目ID" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="goDetail(scope.row)">
              {{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>
        <!-- https://gitpd.paodingai.com/cheftin/docs_scriber/-/issues/5706#note_647614 -->
        <!-- <el-table-column
          prop=""
          label="归属项目组"
          align="center"></el-table-column> -->
        <el-table-column
          prop="status"
          label="项目状态"
          align="center"
          class-name="status-column">
          <template slot-scope="scope">
            <span
              class="point"
              :style="getProjectStatusStyle(scope.row.status)"></span>
            <span>{{ getProjectStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="exchange"
          label="交易所"
          align="center"></el-table-column>
        <el-table-column
          prop="user_name"
          label="创建人"
          align="center"></el-table-column>
        <!-- https://gitpd.paodingai.com/cheftin/docs_scriber/-/issues/5706#note_647614 -->
        <!-- <el-table-column
          prop=""
          label="修改用户"
          align="center"></el-table-column> -->
        <el-table-column
          prop="restricted_funds"
          label="受限资金"
          align="center">
          <template slot-scope="scope">
            <span
              v-if="isBoolean(scope.row.restricted_funds)"
              :style="disclosureColor(scope.row.restricted_funds)">
              {{ scope.row.restricted_funds | yesOrNo }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="borrowing" label="新增借款" align="center">
          <template slot-scope="scope">
            <span
              v-if="isBoolean(scope.row.borrowing)"
              :style="disclosureColor(scope.row.borrowing)">
              {{ scope.row.borrowing | yesOrNo }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="guarantee" label="对外担保" align="center">
          <template slot-scope="scope">
            <span
              v-if="isBoolean(scope.row.guarantee)"
              :style="disclosureColor(scope.row.guarantee)">
              {{ scope.row.guarantee | yesOrNo }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="consistency" label="一致性比对" align="center">
          <template slot-scope="scope">
            <span
              v-if="isBoolean(scope.row.consistency)"
              :style="disclosureColor(scope.row.consistency)">
              {{ scope.row.consistency | yesOrNo }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_utc" label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.created_utc | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inspected_utc"
          label="分析完成时间"
          align="center">
          <template slot-scope="scope">
            <span v-if="!!scope.row.inspected_utc">
              {{ scope.row.inspected_utc | datetime }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :current-page="projects.pager.page"
        :page-size="projects.pager.size"
        :total="projects.pager.total"
        :page-sizes="[10, 20, 50]"
        @current-change="handleChangePage"
        @size-change="handleChangeSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { PROJECT_STATUS_CODE } from '../common/constant';
import {
  getProjectStatus,
  getProjectStatusPrompt,
  getProjectStatusStyle,
} from '../common/utils';
import DisclosureListExpand from '../components/DisclosureListExpand';
import DisclosureSearch from '../components/DisclosureSearch';

export default {
  name: 'disclosure-container',
  components: { DisclosureListExpand, DisclosureSearch },
  data() {
    return {
      expandRowKeys: [],
      fileListTimer: null,
      searchParams: {},
      isExpandFirstRow: false,
      projectIds: [],
    };
  },
  watch: {
    '$route.query': {
      handler() {
        const pager = {
          ...this.projects.pager,
          page: Number(this.$route.query.page) || 1,
          size: Number(this.$route.query.size) || 20,
        };
        this.$store.commit('ztsDisclosureModule/SET_PROJECTS_PAGER', pager);
        this.searchParams = this.$route.query;
        delete this.searchParams.size;
        delete this.searchParams.page;
      },
      immediate: true,
    },
  },
  created() {
    this.init();
  },
  mounted() {
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
    this.fileListTimer = setInterval(() => {
      this.init({ needLoading: false });
    }, 30e3);
  },
  beforeDestroy() {
    clearInterval(this.fileListTimer);
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['projects']),
    isBoolean() {
      return (value) => _.isBoolean(value);
    },
    disclosureColor() {
      return (value) => value && { color: '#ce1509' };
    },
    isShowTableExpand() {
      return !_.isEmpty(this.projects.items);
    },
  },
  methods: {
    getProjectStatus,
    getProjectStatusStyle,
    async init(options = { needLoading: true }) {
      try {
        await this.fetchProjects({ needLoading: options.needLoading });
        if (this.projectIds) {
          this.fetchFiles({ needLoading: options.needLoading });
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchProjects({ needLoading }) {
      try {
        await this.$store.dispatch('ztsDisclosureModule/fetchProjects', {
          searchParams: this.searchParams,
          needLoading: needLoading,
        });
        this.projectIds = this.projects.items.map((item) => item.id).join(',');
        this.expandFirstRow();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchFiles({ needLoading }) {
      try {
        const params = { project_ids: this.projectIds };
        await this.$store.dispatch('ztsDisclosureModule/fetchFiles', {
          params,
          needLoading: needLoading,
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleExpandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => row.id);
    },
    handleChangePage(page) {
      const pager = {
        ...this.projects.pager,
        page: page,
      };
      this.$store.commit('ztsDisclosureModule/SET_PROJECTS_PAGER', pager);
      this.init();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.projects.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('ztsDisclosureModule/SET_PROJECTS_PAGER', pager);
      this.init();
    },
    handleSearch(searchData, isSearchFileName) {
      this.searchParams = searchData;
      this.isExpandFirstRow = isSearchFileName;
      this.handleChangePage(1);
    },
    expandFirstRow() {
      if (this.isExpandFirstRow) {
        this.expandRowKeys = !_.isEmpty(this.projects.items)
          ? [this.projects.items[0].id]
          : [];
        this.isExpandFirstRow = false;
      }
    },
    resetDisclosureListPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('ztsDisclosureModule/SET_PROJECTS_PAGER', pager);
    },
    goDetail(row) {
      const { id, status } = row;
      const projectStatusPrompt = getProjectStatusPrompt(status);
      if (Number(status) !== PROJECT_STATUS_CODE.inspected) {
        this.$notify({
          title: '提示',
          message: projectStatusPrompt,
          type: 'warning',
        });
        return;
      }
      this.$router.push({
        name: 'disclosureDetail',
        params: { projectId: id },
      });
      this.resetDisclosureListPager();
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-container {
  padding: 0 20px;
  .disclosure-list {
    ::v-deep .el-table {
      .el-table__row {
        .cell {
          padding: 0;
          word-break: normal;
        }
      }
      .el-table__cell {
        &.status-column {
          .cell {
            display: flex;
            align-items: center;
            padding-left: 25%;
          }
          .point {
            width: 8px;
            height: 8px;
            margin-right: 10px;
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
          }
        }
        .el-button {
          &.el-button--text {
            text-decoration: underline;
          }
        }
      }
      .el-table__expanded-cell {
        padding: 0;
      }
      .el-table__header {
        .el-table__cell {
          &.status-column {
            .cell {
              padding-left: 10px;
              justify-content: center;
            }
          }
        }
      }
    }
    .el-pagination {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>
