<template>
  <div class="sensitive-words-container">
    <div class="page-header sensitive-words-header">
      <sensitive-words-search-box
        :systems="systems"
        :types="sensitiveWordsTypes"
        @search="searchSensitiveWords" />
      <div class="header-operations">
        <el-button
          size="medium"
          type="primary"
          @click="openSensitiveWordsPopup">
          新建敏感词
        </el-button>
        <el-button size="medium" @click="openSensitiveWordsImportPopup">
          批量导入
        </el-button>
      </div>
    </div>
    <div class="sensitive-words-list">
      <el-table
        height="auto"
        class="has-border"
        style="width: 100%"
        v-loading="isLoading"
        :data="sensitiveWords"
        @sort-change="handleSortChange">
        <el-table-column
          label="敏感词ID"
          prop="id"
          min-width="120"
          align="center"></el-table-column>
        <el-table-column
          label="敏感词"
          prop="name"
          min-width="120"
          align="center"></el-table-column>
        <el-table-column
          label="敏感词类型"
          prop="type"
          min-width="160"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.type.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="归属系统"
          prop="system"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.sys.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="user_name"
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
            <el-button type="text" @click.stop="editSensitiveWords(scope.row)">
              编辑
            </el-button>
            <el-button
              type="text"
              class="delete-btn"
              @click.stop="deleteSensitiveWords(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pager.total > 0"
        background
        :layout="paginationLayout"
        :page-sizes="[10, 20, 50]"
        :current-page="pager.page"
        :page-size="pager.size"
        :total="pager.total"
        @current-change="handleChangePage"
        @size-change="handleChangeSize">
      </el-pagination>
    </div>
    <sensitive-words-popup
      v-if="isShowSensitiveWordsPopup"
      :systems="systems"
      :types="sensitiveWordsTypes"
      :current="currentSensitiveWords"
      :is-edit="isEditSensitiveWords"
      :general-system-value="generalSystemValue"
      @close="closeSensitiveWordsPopup"
      @fetch-list="fetchSensitiveWordsList" />
    <sensitive-words-import-popup
      v-if="isShowSensitiveWordsImportPopup"
      :systems="systems"
      :general-system-value="generalSystemValue"
      @file-upload-success="handleFileUploadSuccess"
      @close="closeSensitiveWordsImportPopup" />
  </div>
</template>

<script>
import _ from 'lodash';
import SensitiveWordsPopup from '../components/SensitiveWordsPopup';
import SensitiveWordsImportPopup from '../components/SensitiveWordsImportPopup';
import SensitiveWordsSearchBox from '../components/SensitiveWordsSearchBox';
import { getSortParams } from '../../../utils';
import { nafmii as nafmiiApi } from '../../../store/api';
import { getPaginationLayout } from '../../../utils/pagination';

export default {
  name: 'sensitive-words-page',
  components: {
    SensitiveWordsPopup,
    SensitiveWordsImportPopup,
    SensitiveWordsSearchBox,
  },
  data() {
    return {
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      isLoading: false,
      sortParams: {},
      searchParams: {},
      sensitiveWords: [],
      currentSensitiveWords: {},
      systems: [],
      sensitiveWordsTypes: [],
      isShowSensitiveWordsPopup: false,
      isShowSensitiveWordsImportPopup: false,
    };
  },
  created() {
    this.init();
  },
  computed: {
    paginationLayout() {
      return getPaginationLayout();
    },
    isEditSensitiveWords() {
      return !_.isEmpty(this.currentSensitiveWords);
    },
    generalSystemValue() {
      return this.systems.find((system) => system.label === '通用')?.value;
    },
  },
  methods: {
    init() {
      this.fetchSystems();
      this.fetchSensitiveWordsTypes();
      this.fetchSensitiveWordsList();
    },
    async fetchSensitiveWordsList() {
      try {
        this.isLoading = true;
        let params = {
          page: this.pager.page,
          size: this.pager.size,
          ...this.sortParams,
          ...this.searchParams,
        };
        const res = await nafmiiApi.fetchSensitiveWords(params);
        this.sensitiveWords = res.data.items;
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
    handleChangePage(page) {
      const pager = {
        ...this.pager,
        page: page,
      };
      this.pager = pager;
      this.fetchSensitiveWordsList();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.pager,
        page: 1,
        size: size,
      };
      this.pager = pager;
      this.fetchSensitiveWordsList();
    },
    handleSortChange({ prop, order }) {
      this.sortParams = getSortParams(prop, order);
      this.handleChangePage(1);
    },
    handleFileUploadSuccess() {
      this.handleChangePage(1);
    },
    searchSensitiveWords(params) {
      this.searchParams = params;
      this.handleChangePage(1);
    },
    openSensitiveWordsPopup() {
      this.isShowSensitiveWordsPopup = true;
    },
    closeSensitiveWordsPopup() {
      this.currentSensitiveWords = {};
      this.isShowSensitiveWordsPopup = false;
    },
    openSensitiveWordsImportPopup() {
      this.isShowSensitiveWordsImportPopup = true;
    },
    closeSensitiveWordsImportPopup() {
      this.isShowSensitiveWordsImportPopup = false;
    },
    editSensitiveWords(row) {
      this.currentSensitiveWords = {
        id: row.id,
        name: row.name,
        type: row.type.id,
        system: row.sys.id,
      };
      this.openSensitiveWordsPopup();
    },
    async deleteSensitiveWords(id) {
      const confirm = await this.$confirm('是否删除该敏感词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await nafmiiApi.deleteSensitiveWords(id);
          this.$notify({
            title: '成功',
            message: '敏感词删除成功',
            type: 'success',
          });
          this.fetchSensitiveWordsList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async fetchSensitiveWordsTypes() {
      const res = await nafmiiApi.fetchSensitiveWordsTypes();
      this.sensitiveWordsTypes = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
    async fetchSystems() {
      const res = await nafmiiApi.fetchSystems();
      this.systems = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
  },
};
</script>

<style scoped lang="scss">
.sensitive-words-container {
  .header-operations {
    display: flex;
    align-items: center;
    .upload-progress-wrapper {
      height: 36px;
    }
  }
}
</style>
