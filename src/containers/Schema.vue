<template>
  <div ref="schemaContainer" class="schema-container">
    <div class="page-header schema-header">
      <nafmii-schema-search-box
        v-if="showNafmiiSchemaSearchBox"
        @search="searchSchemas">
      </nafmii-schema-search-box>
      <div class="header-btns">
        <el-button
          :class="{ 'button-csc': $platform.isCscEnv() }"
          size="medium"
          type="primary"
          @click="openRootSchemaPopup">
          <i :class="addIcon" v-if="isShowCreateSchemaIcon"></i>
          {{ $text.schema['新增Schema'] }}
        </el-button>
        <el-button
          v-if="$features.supportImportSchema()"
          size="medium"
          type="primary"
          icon="el-icon-upload2"
          class="import-btn"
          @click="openImportSchemaPopup">
          导入场景
        </el-button>
      </div>
      <scene-search-box
        v-if="isCmfchinaEnv"
        :searchData="sceneSearchData"
        @search="searchSchemas" />
      <div
        class="search-container"
        v-if="!isCmfchinaEnv && !showNafmiiSchemaSearchBox">
        <el-select
          size="medium"
          v-model="search.by"
          :placeholder="$t(`message['请选择']`)">
          <el-option
            v-for="(item, index) in search.options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          ref="searchInput"
          size="medium"
          clearable
          class="filter-input"
          v-model.trim="search.value"
          @clear="searchSchemas"
          @keypress.enter.native="searchSchemas">
        </el-input>
        <el-button
          type="primary"
          class="search-btn"
          size="mini"
          @click="searchSchemas">
          <svg-font-icon name="search" :size="20"></svg-font-icon>
          {{ $t(`message['搜索']`) }}
        </el-button>
      </div>
    </div>
    <el-table
      v-bind="
        $style.schema.tableHeight ? { height: $style.schema.tableHeight } : {}
      "
      ref="table"
      class="has-border"
      v-loading="schemas.isLoading"
      style="width: 100%"
      :data="schemas.items || []"
      :row-class-name="getRowClassName"
      @row-click="(row) => openSchema(row)"
      @sort-change="handleSortChange">
      <el-table-column
        :width="$style.schema.idWidth"
        :label="$text.schema['ID']"
        prop="id"></el-table-column>
      <el-table-column
        :min-width="$style.schema.nameWidth"
        :label="$text.schema['名称']"
        prop="name"
        align="center">
        <template slot-scope="scope">
          <overflow-popover :content="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column label="模型类型" prop="mold_type" align="center">
        <template slot-scope="scope">
          {{ getMoldType(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.supportSchemaAlias()"
        :label="$text.schema['Schema别名']"
        prop="alias"
        align="center">
        <template slot-scope="scope">
          <span class="alias">{{ scope.row.data.schemas[0].alias }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['创建人']`)"
        prop="user_name"
        align="center">
      </el-table-column>
      <el-table-column
        :label="$t(`message['创建时间']`)"
        :min-width="$style.schema.timeWidth"
        prop="created_utc"
        :sortable="isTimeSorting"
        align="center">
        <template slot-scope="scope">
          <span class="created-time">{{
            scope.row.created_utc | datetime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['修改时间']`)"
        :min-width="$style.schema.timeWidth"
        prop="updated_utc"
        :sortable="isTimeSorting"
        align="center">
        <template slot-scope="scope">
          <span class="updated-time">{{
            scope.row.updated_utc | datetime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="200"
        class-name="operations"
        :fixed="$features.operationColumnFixed()"
        :label="$t(`message['操作']`)">
        <template
          v-if="$isAllowed('manageSchema') || scope.row.uid === loginUser.id"
          slot-scope="scope">
          <template>
            <el-tooltip
              v-if="$features.isShowOperationIcon()"
              effect="dark"
              :content="$t(`message['详情']`)"
              placement="top">
              <el-button
                :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                size="small"
                @click.stop="openSchema(scope.row)"
                circle>
                <theme-icon
                  name="detail"
                  icon-class="el-icon-more"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-button v-else type="text" @click.stop="openSchema(scope.row)">
              {{ $t(`message['详情']`) }}
            </el-button>
          </template>
          <template>
            <el-tooltip
              v-if="$features.supportImportSchema()"
              effect="dark"
              content="导出"
              placement="top">
              <el-button
                type="text"
                size="small"
                @click.stop="exportSchema(scope.row.id)">
                <theme-icon
                  name="download"
                  img-class="el-icon-download"></theme-icon>
              </el-button>
            </el-tooltip>
          </template>
          <template>
            <el-tooltip
              v-if="$features.isShowOperationIcon()"
              effect="dark"
              :content="$t(`message['删除']`)"
              placement="top">
              <el-button
                :disabled="scope.row.readonly"
                :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
                size="small"
                @click.stop="removeSchema(scope.row)"
                circle>
                <theme-icon
                  name="delete"
                  icon-class="el-icon-delete"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-button
              v-else
              type="text"
              class="delete-btn"
              :disabled="scope.row.readonly"
              @click.stop="removeSchema(scope.row)">
              {{ $t(`message['删除']`) }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :layout="paginationLayout"
      :page-sizes="[10, 20, 50]"
      :current-page="schemas.pager.page"
      :page-size="schemas.pager.size"
      :total="schemas.pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <schema-part-info
      :schemaRules="rootSchemaRules"
      :schemaPart="tree.current"
      :groups="groups"
      :isLoading="tree.isLoading"
      width="650px"
      @persist-schema-part="persistSchemaPart"
      @close-part-info="partInfoClose">
    </schema-part-info>
    <schema-import-popup
      v-if="showImportSchemaPopup"
      action="import"
      @import-success="onImportSchemaSuccess"
      @close="showImportSchemaPopup = false">
    </schema-import-popup>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { getSortParams, downloadFileByBlob } from '@/utils';
import { getPaginationLayout } from '@/utils/pagination';
import SchemaPartInfo from '../components/SchemaPartInfo';
import NafmiiSchemaSearchBox from '../custom/nafmii/components/SchemaSearchBox';
import SceneSearchBox from '../custom/cmfchina/components/SearchBox';
import {
  fetchUserBusinessGroups,
  exportSchema,
} from '../store/api/cmfchina.api';
import OverflowPopover from '../components/OverflowPopover.vue';
import SchemaImportPopup from '../components/SchemaImportPopup.vue';
import { SCHEMA_TYPE } from '../store/constants';

export default {
  name: 'schema-page',
  components: {
    OverflowPopover,
    SchemaPartInfo,
    NafmiiSchemaSearchBox,
    SceneSearchBox,
    SchemaImportPopup,
  },
  data() {
    return {
      search: {
        by: 'name',
        value: '',
        options: [
          {
            value: 'name',
            label: this.$text.schema['Schema名称'],
          },
        ],
      },
      sceneSearchData: {
        dateOptions: [
          {
            value: 'created_utc',
            label: '创建时间',
          },
          {
            value: 'updated_utc',
            label: '修改时间',
          },
        ],
        contentOptions: [
          {
            value: 'name',
            label: '场景名称',
          },
          {
            value: 'id',
            label: '场景ID',
          },
          {
            value: 'alias',
            label: '场景别名',
          },
          {
            value: 'user_name',
            label: '创建人',
          },
        ],
      },
      sortParams: {},
      searchData: {},
      groups: [],
      showImportSchemaPopup: false,
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('schemaModule', ['schemas', 'tree', 'scrollTop']),
    rootSchemaRules() {
      return {
        name: [{ required: true, message: this.$t(`message['名称不能为空']`) }],
        alias: [
          {
            required: this.$features.schemaAliasRequired(),
            message: this.$t(`message['别名不能为空']`),
          },
        ],
        group_ids: [
          { required: true, message: '请选择业务组', trigger: 'change' },
        ],
        moldType: [
          { required: true, message: '请选择模型类型', trigger: 'change' },
        ],
        model_name: [
          { required: true, message: '请选择大模型', trigger: 'change' },
        ],
      };
    },
    showNafmiiSchemaSearchBox() {
      return this.$platform.isNafmiiEnv();
    },
    paginationLayout() {
      return getPaginationLayout();
    },
    isCmfchinaEnv() {
      return this.$platform.isCmfchinaEnv();
    },
    isTimeSorting() {
      if (this.isCmfchinaEnv || this.$platform.isNafmiiEnv()) {
        return 'custom';
      }
      return false;
    },
    addIcon() {
      if (this.$platform.isDefaultEnv()) {
        return 'fa fa-plus fa-fw';
      }
      return 'el-icon-circle-plus';
    },
    isShowCreateSchemaIcon() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return true;
    },
  },
  async created() {
    this.$store.commit('schemaModule/SET_SCHEMAS_PAGER', {
      ...this.schemas.pager,
      size: 20,
    });
    await this.fetchSchemaList();
    this.getLLMList();
    if (this.$features.supportBusinessGroup()) {
      this.getUserGroups();
    }
    this.setScrollTop();
  },
  mounted() {
    this.autoOpenRootSchemaPopup();
  },
  methods: {
    autoOpenRootSchemaPopup() {
      if (this.$route.query.project_group_id !== undefined) {
        this.openRootSchemaPopup();
      }
    },
    async fetchSchemaList() {
      try {
        let params;
        if (this.$platform.isNafmiiEnv() || this.isCmfchinaEnv) {
          params = { ...this.searchData };
        } else {
          params = _.omitBy({ name: this.search.value }, (v) => v === '');
        }
        params = { ...this.sortParams, ...params };
        this.$store.commit('schemaModule/SET_LOADING', true);
        await this.$store.dispatch('schemaModule/fetchSchemas', { params });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_LOADING', false);
      }
    },
    searchSchemas(searchData) {
      this.$store.commit('schemaModule/SET_SCHEMAS_PAGER', {
        ...this.schemas.pager,
        page: 1,
      });
      this.searchData = searchData;
      this.fetchSchemaList();
    },
    handleSortChange(sort) {
      const { prop, order } = sort;
      this.sortParams = getSortParams(prop, order);
      this.fetchSchemaList();
    },
    async updateSchemaHandle({ entity }) {
      try {
        await this.$store.dispatch('schemaModule/updateSchema', {
          entity,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$text.schema['Schema 修改成功'],
          type: 'success',
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    async removeSchema(scm) {
      try {
        await this.$confirm(
          this.$t(`message['确定删除"{name}"吗？']`, { name: scm.name }),
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );
        this.$store.commit('schemaModule/SET_LOADING', true);
        await this.$store.dispatch('schemaModule/deleteSchema', {
          id: scm.id,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$text.schema['Schema 删除成功'],
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_LOADING', false);
      }
    },
    /**
     * 进入schema tree页面
     */
    openSchema(row) {
      if (!this.$root.isClick) {
        return;
      }
      let path = `/schema/${row.id}/tree`;
      if (this.$features.supportLLMExtract()) {
        path = `/schema/${row.id}/llm-tree`;
      }
      this.$router.push({ path });
      this.$store.commit('schemaModule/SET_SCROLL_TOP', window.scrollY);
      this.$store.commit('schemaModule/SET_LAST_OPENED_SCHEMA_ID', row.id);
    },
    openRootSchemaPopup() {
      this.$store.commit('schemaModule/SET_EMPTYPART_DATA', {
        type: 'root',
        groupId: this.$route.query.project_group_id,
        params: {
          mold_type: 0,
        },
      });
    },
    /**
     * 关闭根Schema popup
     */
    partInfoClose() {
      this.$store.commit('schemaModule/SET_PART_DATA', null);
    },
    async persistSchemaPart({ current, type }) {
      try {
        const res = await this.$store.dispatch(
          'schemaModule/persistSchemaPart',
          {
            current,
            type,
            callback: (err) => {
              if (!err) {
                this.partInfoClose();
              }
            },
          },
        );
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$text.schema['Schema 新增成功'],
          type: 'success',
        });
        this.openSchema(res.data);
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_TREE_LOADING', false);
        this.partInfoClose();
      }
    },
    handleChangePage(page) {
      const pager = {
        ...this.schemas.pager,
        page: page,
      };
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$store.commit('schemaModule/SET_SCHEMAS_PAGER', pager);
      this.fetchSchemaList();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.schemas.pager,
        page: 1,
        size: size,
      };
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$store.commit('schemaModule/SET_SCHEMAS_PAGER', pager);
      this.fetchSchemaList();
    },
    getRowClassName({ row }) {
      const classList = [];
      if (this.schemas.lastOpenedSchemaId === row.id) {
        classList.push('row-highlight');
      }
      return classList;
    },
    setScrollTop() {
      this.$nextTick(() => {
        window.scrollTo(0, this.scrollTop);
      });
    },
    async getUserGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    openImportSchemaPopup() {
      this.showImportSchemaPopup = true;
    },
    async exportSchema(id) {
      try {
        const res = await exportSchema(id);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    onImportSchemaSuccess() {
      this.$store.commit('schemaModule/SET_SCHEMAS_PAGER', {
        ...this.schemas.pager,
        page: 1,
      });
      this.fetchSchemaList();
    },
    getMoldType(row) {
      if (_.isEmpty(row.data.schemas[0].schema)) {
        return '-';
      }
      if (row.mold_type === SCHEMA_TYPE.HYBRID.value) {
        return SCHEMA_TYPE.HYBRID.label;
      }
      if (row.mold_type === SCHEMA_TYPE.CUSTOM.value) {
        return SCHEMA_TYPE.CUSTOM.label;
      }
      return SCHEMA_TYPE.LLM.label;
    },
    getLLMList() {
      try {
        this.$store.dispatch('schemaModule/fetchLLMList');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-container {
  padding: 0 20px;
  height: calc(100% - 61px);
  overflow-y: auto;
  .page-header {
    display: flex;
    justify-content: space-between;
    .header-btns {
      .import-btn {
        ::v-deep i {
          font-weight: bold;
          transform: scale(1.2);
        }
      }
    }
    .search-container {
      display: flex;
      align-items: center;

      ::v-deep .filter-input {
        .el-input__inner {
          border-radius: 0;
        }
      }

      ::v-deep .el-select {
        width: 250px;
        .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: transparent;
          &:focus {
            border-right: 1px solid $--color-primary;
          }
        }
      }

      ::v-deep .search-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        font-size: 16px;
        font-weight: 400;
        padding: 7px 26px;
        > span {
          display: flex;
          align-items: center;
        }
      }

      .pd-icon-search {
        margin-right: 7px;
      }
    }
  }
  .created-time,
  .updated-time {
    font-family: monospace;
  }
}
::v-deep .operations {
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-download {
      width: 20px;
    }
  }
}
.el-pagination {
  padding: 20px 0;
  text-align: center;
}
</style>
