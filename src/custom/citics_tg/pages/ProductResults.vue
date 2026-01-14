<template>
  <div class="citics-tg-page">
    <div v-if="isCiticsTgAllow('record_product_search')" class="list-header">
      <search-box
        :searchOptions="searchOptions"
        :filterBy="filterBy"
        :filterValue="filterValue"
        @search="handleSearch"></search-box>
    </div>
    <div class="results-container">
      <div class="results-left-project">
        <el-table
          class="has-border"
          :empty-text="$t(`message['暂无数据']`)"
          :data="projectItems"
          v-loading="projectLoading"
          :row-class-name="tableRowClassName"
          @row-click="handleProjectClick">
          <el-table-column
            prop="name"
            :label="$t(`message['项目名称']`)"
            align="center">
          </el-table-column>
          <el-table-column
            prop="product_num"
            :label="$t(`message['产品代码']`)"
            align="center">
            <span slot-scope="scope">
              {{ scope.row.meta ? scope.row.meta.product_num : '' }}
            </span>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :current-page="projectPager.page"
          :page-size="projectPager.size"
          :total="projectPager.total"
          @current-change="handleProjectPageChange">
        </el-pagination>
      </div>
      <div class="results-center-params">
        <p>{{ $t(`message['参数集合']`) }}</p>
        <div
          v-if="templateFields.length > 0"
          class="params-set mapping-check-wrapper">
          <el-collapse v-model="selectField" accordion>
            <template v-for="item in templateFields">
              <el-collapse-item
                :key="item.field"
                :title="item.field"
                :name="item.field">
                <div class="mapping-check-field-container">
                  <div class="mapping-check-relation-list">
                    <div v-if="item.answers.length > 0">
                      <div
                        class="mapping-check-relation-item"
                        v-for="(data, index) in item.answers"
                        :key="`${data}_${index}`">
                        <div class="item-box">{{ data }}</div>
                        <span class="item-version">{{ item.version }}</span>
                      </div>
                    </div>
                    <div v-else class="empty-info">暂无答案数据</div>
                  </div>
                </div>
              </el-collapse-item>
            </template>
          </el-collapse>
        </div>
        <el-empty v-else :description="$t(`message['暂无数据']`)"></el-empty>
      </div>
      <div class="results-right-file">
        <el-table
          class="has-border"
          :empty-text="$t(`message['暂无数据']`)"
          :data="fileItems"
          v-loading="fileLoading">
          <el-table-column
            prop="name"
            :label="$t(`message['相关文件']`)"
            align="center">
          </el-table-column>
          <el-table-column
            prop="version"
            :label="$t(`message['版本号']`)"
            align="center">
            <template slot-scope="scope">
              <p>
                {{ scope.row.version || '无' }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t(`message['操作']`)"
            width="150"
            class-name="operations"
            align="center">
            <template slot-scope="scope">
              <el-row>
                <el-tooltip
                  effect="dark"
                  :content="$t(`message['查看']`)"
                  placement="top">
                  <el-button
                    v-if="isCiticsTgAllow('record_product_detail')"
                    type="text"
                    size="small"
                    circle
                    @click="handleJumpToRemark(scope.row)">
                    <theme-icon
                      name="view"
                      icon-class="el-icon-document"></theme-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  :content="$t(`message['在项目中查看']`)"
                  placement="top">
                  <template>
                    <el-button
                      v-if="isCiticsTgAllow('record_product_project')"
                      circle
                      size="small"
                      type="text"
                      @click.stop="goDetail(scope.row)">
                      <theme-icon
                        name="view-in-project"
                        icon-class="el-icon-search"></theme-icon>
                    </el-button>
                  </template>
                </el-tooltip>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="fileItems.length > 0"
          background
          layout="total, prev, pager, next, jumper"
          :current-page="filePager.page"
          :page-size="filePager.size"
          :total="filePager.total"
          @current-change="handleFilePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '../components/SearchBox';
import FileStatusMixin from '../mixins/FileStatusMixin';
import { answerText, getCollapseTitle } from '../common/utils';
import {
  fetchProjects,
  fetchAllFiles,
  fetchProjectPushedFields,
  fetchProjectAnswersByTemplatesFields,
} from '@/store/api/citics-tg.api';
import { isCiticsTgAllow } from '../common/utils';
export default {
  name: 'citics-tg-product-results',
  components: { SearchBox },
  mixins: [FileStatusMixin],
  data() {
    return {
      projectItems: [],
      selectedProject: null,
      fileItems: [],
      searchOptions: [
        {
          value: 'name',
          label: '项目名称',
        },
        {
          value: 'product_num',
          label: '产品代码',
        },
      ],
      filterBy: 'name',
      filterValue: '',
      projectLoading: false,
      fileLoading: false,
      selectField: '',
      templateFields: [],
      projectPager: {
        page: 1,
        size: 10,
        total: 0,
      },
      filePager: {
        page: 1,
        size: 10,
        total: 0,
      },
    };
  },
  watch: {
    selectedProject() {
      this.getProjectPushedFields(this.selectedProject.id);
      this.filePager.page = 1;
      this.getProjectPushedFiles();
    },
    selectField() {
      if (this.selectField) {
        this.getFieldAnswers();
      }
    },
  },
  mounted() {
    this.getAllProject();
  },
  methods: {
    isCiticsTgAllow,
    answerText,
    getCollapseTitle,
    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.projectPager.page = 1;
      this.filePager.page = 1;
      this.getAllProject();
    },
    tableRowClassName({ row }) {
      if (row.id === this.selectedProject.id) {
        return 'row-selected';
      }
      return '';
    },
    async getAllProject() {
      try {
        this.projectLoading = true;
        this.projectItems = [];
        this.selectedProject = null;
        this.selectField = '';
        const params = {
          page: this.projectPager.page,
          size: this.projectPager.size,
        };
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        const res = await fetchProjects(params);
        this.projectPager.total = res.data.total;
        this.projectItems = res.data.items;
        this.selectedProject = this.projectItems[0];
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.projectLoading = false;
      }
    },
    handleProjectClick(row) {
      this.selectField = '';
      this.selectedProject = row;
    },
    async getProjectPushedFields(id) {
      try {
        const res = await fetchProjectPushedFields(id);
        this.templateFields = res.data.template_fields.map((item) => ({
          field: item,
          answers: [],
        }));
        this.selectField = this.templateFields[0]?.field;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async getFieldAnswers() {
      try {
        const params = {
          field: this.selectField,
        };
        const res = await fetchProjectAnswersByTemplatesFields(
          this.selectedProject.id,
          params,
        );
        const index = this.templateFields.findIndex(
          (item) => item.field === this.selectField,
        );
        if (index !== -1) {
          this.templateFields[index].answers = res.data.field_answers;
          this.templateFields[index].version = res.data?.version || '无';
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async getProjectPushedFiles() {
      try {
        this.fileLoading = true;
        const params = {
          pid: this.selectedProject.id,
          only_stat: 1,
          page: this.filePager.page,
          size: this.filePager.size,
        };
        const res = await fetchAllFiles(params);
        this.fileItems = res.data.items;
        this.filePager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.fileLoading = false;
      }
    },
    handleProjectPageChange(val) {
      this.projectPager.page = val;
      this.getAllProject();
    },
    handleFilePageChange(val) {
      this.filePager.page = val;
      this.getProjectPushedFiles();
    },
  },
};
</script>

<style lang="scss" scoped>
.citics-tg-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 101px);
  padding-bottom: 10px;
  .results-container {
    flex: 1;
    display: flex;
    justify-content: space-between;
    overflow-y: hidden;
    .el-table {
      ::v-deep.row-selected {
        color: #0090c0;
      }
    }
    > div {
      background: #fff;
      border: 1px solid #eceff4;
    }
    .results-left-project {
      width: 30%;
      height: 100%;
      overflow-y: auto;
    }
    .results-center-params {
      flex: 1;
      height: 100%;
      margin: 0 5px;
      background: #fff;
      overflow-y: hidden;
      p {
        text-align: center;
        padding: 10px 0;
        font-size: 14px;
        color: #606266;
        font-weight: 900;
      }
      .params-set {
        height: calc(100% - 40px);
        overflow-y: auto;
      }
    }
    .results-right-file {
      width: 30%;
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
