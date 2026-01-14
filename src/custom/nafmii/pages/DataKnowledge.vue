<template>
  <div class="data-knowledge-container">
    <div class="page-header data-knowledge-header">
      <data-knowledge-search-box
        :types="dataKnowledgeTypes"
        @search="searchDataKnowledge" />
      <div class="header-operations">
        <el-button size="medium" type="primary" @click="openDataKnowledgePopup">
          新建数据知识
        </el-button>
      </div>
    </div>
    <div class="data-knowledge-list">
      <el-table
        height="auto"
        class="has-border"
        style="width: 100%"
        v-loading="isLoading"
        :data="dataKnowledge"
        :default-sort="defaultSort"
        @sort-change="handleSortChange">
        <el-table-column
          label="数据知识ID"
          prop="id"
          min-width="120"
          align="center"></el-table-column>
        <el-table-column
          label="数据知识名称"
          prop="name"
          min-width="120"
          align="center"
          class-name="name">
          <template slot-scope="scope">
            <overflow-popover
              :content="scope.row.name"
              is-button
              @click="openDataKnowledgeDetail(scope.row.id)" />
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.type.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="user"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.user.name }}
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="created_utc"
          label="创建时间"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="200"
          label="操作"
          class-name="operations"
          :fixed="$features.operationColumnFixed()">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click.stop="openDataKnowledgeDetail(scope.row.id)">
              详情
            </el-button>
            <el-button type="text" @click.stop="editDataKnowledge(scope.row)">
              编辑
            </el-button>
            <el-button
              type="text"
              class="delete-btn"
              @click.stop="deleteDataKnowledge(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="dataKnowledges.pager.total > 0"
        background
        :layout="paginationLayout"
        :page-sizes="[10, 20, 50]"
        :current-page="dataKnowledges.pager.page"
        :page-size="dataKnowledges.pager.size"
        :total="dataKnowledges.pager.total"
        @current-change="handleChangePage"
        @size-change="handleChangeSize">
      </el-pagination>
    </div>
    <data-knowledge-popup
      v-if="isShowDataKnowledgePopup"
      :types="dataKnowledgeTypes"
      :current="currentDataKnowledge"
      :is-edit="isEditDataKnowledge"
      @close="closeDataKnowledgePopup"
      @fetch-list="fetchDataKnowledgeList" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import DataKnowledgePopup from '../components/DataKnowledgePopup';
import DataKnowledgeSearchBox from '../components/DataKnowledgeSearchBox';
import OverflowPopover from '../../../components/OverflowPopover';
import { getSortParams, parseSortParams } from '../../../utils';
import { nafmii as nafmiiApi } from '../../../store/api';
import { getPaginationLayout } from '../../../utils/pagination';

export default {
  name: 'data-knowledge-page',
  components: {
    OverflowPopover,
    DataKnowledgePopup,
    DataKnowledgeSearchBox,
  },
  data() {
    return {
      isLoading: false,
      dataKnowledge: [],
      currentDataKnowledge: {},
      dataKnowledgeTypes: [],
      isRouteToDetailPage: false,
      isShowDataKnowledgePopup: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'dataKnowledgeDetail') {
      this.isRouteToDetailPage = true;
    }
    next();
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    if (!this.isRouteToDetailPage) {
      this.reset();
    }
  },
  computed: {
    ...mapGetters('nafmiiModule', ['dataKnowledges']),

    paginationLayout() {
      return getPaginationLayout();
    },
    isEditDataKnowledge() {
      return !_.isEmpty(this.currentDataKnowledge);
    },
    defaultSort() {
      return parseSortParams(this.dataKnowledges.sortParams);
    },
  },
  methods: {
    init() {
      this.fetchDataKnowledgeTypes();
      this.fetchDataKnowledgeList();
    },
    async fetchDataKnowledgeList() {
      try {
        this.isLoading = true;
        let params = {
          page: this.dataKnowledges.pager.page,
          size: this.dataKnowledges.pager.size,
          ...this.dataKnowledges.sortParams,
          ...this.dataKnowledges.searchParams,
        };
        const res = await nafmiiApi.fetchDataKnowledge(params);
        this.dataKnowledge = res.data.items;
        const pager = {
          ...this.dataKnowledges.pager,
          total: res.data.total,
        };
        this.$store.commit('nafmiiModule/SET_DATA_KNOWLEDGES_PAGER', pager);
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
    handleChangePage(page) {
      const pager = {
        ...this.dataKnowledges.pager,
        page: page,
      };
      this.$store.commit('nafmiiModule/SET_DATA_KNOWLEDGES_PAGER', pager);
      this.fetchDataKnowledgeList();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.dataKnowledges.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('nafmiiModule/SET_DATA_KNOWLEDGES_PAGER', pager);
      this.fetchDataKnowledgeList();
    },
    handleSortChange({ prop, order }) {
      const sortParams = getSortParams(prop, order);
      this.$store.commit(
        'nafmiiModule/SET_DATA_KNOWLEDGES_SORT_PARAMS',
        sortParams,
      );
      this.handleChangePage(1);
    },
    searchDataKnowledge(params) {
      if (!_.isEmpty(params)) {
        this.$store.commit(
          'nafmiiModule/SET_DATA_KNOWLEDGES_SEARCH_PARAMS',
          params,
        );
      } else {
        this.$store.commit(
          'nafmiiModule/SET_DATA_KNOWLEDGES_SEARCH_PARAMS',
          {},
        );
      }
      this.handleChangePage(1);
    },
    openDataKnowledgePopup() {
      this.isShowDataKnowledgePopup = true;
    },
    closeDataKnowledgePopup() {
      this.currentDataKnowledge = {};
      this.isShowDataKnowledgePopup = false;
    },
    openDataKnowledgeDetail(id) {
      this.$router.push({
        name: 'dataKnowledgeDetail',
        params: { dataKnowledgeId: id },
      });
    },
    editDataKnowledge(row) {
      this.currentDataKnowledge = {
        id: row.id,
        name: row.name,
        type: row.type.id,
      };
      this.openDataKnowledgePopup();
    },
    async deleteDataKnowledge(id) {
      const confirm = await this.$confirm('是否删除该数据知识？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await nafmiiApi.deleteDataKnowledge(id);
          this.$notify({
            title: '成功',
            message: '数据知识删除成功',
            type: 'success',
          });
          this.fetchDataKnowledgeList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async fetchDataKnowledgeTypes() {
      const res = await nafmiiApi.fetchDataKnowledgeTypes();
      this.dataKnowledgeTypes = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
    resetPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('nafmiiModule/SET_DATA_KNOWLEDGES_PAGER', pager);
    },
    resetParams() {
      this.$store.commit('nafmiiModule/SET_DATA_KNOWLEDGES_SORT_PARAMS', {});
      this.$store.commit('nafmiiModule/SET_DATA_KNOWLEDGES_SEARCH_PARAMS', {});
    },
    reset() {
      this.resetPager();
      this.resetParams();
    },
  },
};
</script>

<style scoped lang="scss">
.data-knowledge-container {
  .el-table {
    ::v-deep .el-table__cell {
      &.name {
        .overflow-content-button {
          font-weight: 400;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
