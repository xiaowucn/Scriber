<template>
  <div class="citics-tg-page">
    <div class="list-header">
      <search-box
        v-if="isCiticsTgAllow('sys_search')"
        :searchOptions="searchOptions"
        :filterBy="filterBy"
        :filterValue="filterValue"
        @search="handleSearch"></search-box>
    </div>
    <el-table
      class="has-border"
      :empty-text="$t(`message['暂无数据']`)"
      :data="items"
      :row-key="(row) => row.id"
      v-loading="isLoading"
      @expand-change="handleExpandRow">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            class="has-border"
            :empty-text="$t(`message['暂无数据']`)"
            :data="props.row.children">
            <el-table-column
              prop="compare_id"
              :label="$t(`message['比对ID']`)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="std_file_info"
              :label="$t(`message['文件']`)"
              align="center">
              <template slot-scope="scope">
                {{
                  props.row.qid === scope.row.qid
                    ? scope.row.std_file_info.name
                    : scope.row.diff_file_info.name
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="version"
              :label="$t(`message['版本号']`)"
              align="center">
              <template slot-scope="scope">
                {{
                  scope.row.diff_file_info
                    ? scope.row.diff_file_info.version
                    : '无'
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="push_type"
              :label="$t(`message['推送方式']`)"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.push_type">
                  {{
                    PUSH_TYPE_MAP.find(
                      (item) => item.value === scope.row.push_type,
                    ).label
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="params_id"
              :label="$t(`message['外部参数ID']`)"
              align="center">
            </el-table-column> -->
            <el-table-column
              prop="external_source"
              :label="$t(`message['外部参数来源']`)"
              align="center">
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
                    :content="$t(`message['进入比对界面']`)"
                    placement="top">
                    <el-button
                      v-if="
                        isCiticsTgAllow('sys_compare') &&
                        scope.row.std_file_info.version &&
                        scope.row.diff_file_info.version
                      "
                      class="compare-button"
                      type="text"
                      size="small"
                      circle
                      @click="jumpToComparePage(scope.row)">
                      <theme-icon name="compare"></theme-icon>
                    </el-button>
                  </el-tooltip>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        :label="$t(`message['文档ID']`)"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t(`message['文件']`)"
        align="center"></el-table-column>
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
        prop="product_type"
        :label="$t(`message['产品类型']`)"
        align="center">
        <template slot-scope="scope">
          {{
            scope.row.project_meta ? scope.row.project_meta.product_type : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product_name"
        :label="$t(`message['产品名称']`)"
        align="center">
        <template slot-scope="scope">
          {{
            scope.row.project_meta ? scope.row.project_meta.product_name : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="molds"
        :label="$t(`message['模型']`)"
        align="center">
        <template slot-scope="scope">
          {{ getSchema(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="templates"
        :label="$t(`message['模板']`)"
        align="center">
        <template slot-scope="scope" v-if="scope.row.templates">
          <p
            class="template-item"
            v-for="(item, index) in getTemplateName(scope.row.templates)"
            :key="`${item}_${index}`"
            :title="item">
            {{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="push"
        :label="$t(`message['推送方式']`)"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.push_type">
            {{
              PUSH_TYPE_MAP.find((item) => item.value === scope.row.push_type)
                .label
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pdf_parse_status"
        :label="$t(`message['预处理']`)"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.pdf_parse_status">
            {{ getPdfParseStatus(scope.row.pdf_parse_status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ai_status"
        :label="$t(`message['参数预测']`)"
        align="center">
        <template slot-scope="scope">
          <div v-html="getAIStatus(scope.row)" class="ai-status"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_name"
        :label="$t(`message['上传用户']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="created_utc"
        :label="$t(`message['上传时间']`)"
        align="center"
        class-name="time"
        min-width="100">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
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
                v-if="isCiticsTgAllow('sys_detail')"
                type="text"
                size="small"
                circle
                :disabled="viewDisabled(scope.row.pdf_parse_status)"
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
              <el-button
                v-if="isCiticsTgAllow('sys_project')"
                circle
                size="small"
                type="text"
                @click.stop="goDetail(scope.row)">
                <theme-icon
                  name="view-in-project"
                  icon-class="el-icon-search"></theme-icon>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SearchBox from '../components/SearchBox';
import FileStatusMixin from '../mixins/FileStatusMixin';
import {
  fetchAllFiles,
  fetchFileCompareRecords,
} from '@/store/api/citics-tg.api';
import { PUSH_TYPE_MAP } from '../common/constant';
import { isCiticsTgAllow } from '../common/utils';
import { AI_PREDICT_STATUS_TEXT_MAP } from '@/store/constants';
export default {
  name: 'systemFullView',
  mixins: [FileStatusMixin],
  components: { SearchBox },
  data() {
    return {
      PUSH_TYPE_MAP,
      isLoading: false,
      items: [],
      searchOptions: [
        {
          value: 'fid',
          label: '文件ID',
        },
        {
          value: 'name',
          label: '文件名称',
        },
        {
          value: 'product_name',
          label: '产品名称',
        },
        {
          value: 'product_type',
          label: '产品类型',
          options: [],
        },
      ],
      filterBy: 'fid',
      filterValue: '',
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
    };
  },
  computed: {
    ...mapGetters('citicsTgModule', ['productTypes']),
  },
  watch: {
    productTypes: {
      handler() {
        const productTypesOptions = this.productTypes.map((item) => ({
          label: item,
          value: item,
        }));
        const productTypesSearch = this.searchOptions.find(
          (item) => item.value === 'product_type',
        );
        productTypesSearch.options = productTypesOptions;
      },
    },
  },
  async created() {
    this.getAllFiles();
  },
  methods: {
    isCiticsTgAllow,
    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.pager.page = 1;
      this.getAllFiles();
    },
    getSchema(file) {
      const schema = this.schemas?.find((item) => item.id === file.molds?.[0]);
      if (schema) {
        return schema.name;
      }
      return '';
    },
    getAIStatus(file) {
      const { ai_status } = file;
      const item = {
        text: AI_PREDICT_STATUS_TEXT_MAP[ai_status],
        count: 1,
        class: `ai-status-${ai_status}`,
      };
      return `<p class="${item.class}">${item.text}: ${item.count}</p>`;
    },
    async getAllFiles() {
      try {
        this.isLoading = true;
        this.items = [];
        const params = {
          page: this.pager.page,
          size: this.pager.size,
          task_type: 1,
        };
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        const res = await fetchAllFiles(params);
        this.items = res.data.items;
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
    handleCurrentPageChange(val) {
      this.pager.page = val;
      this.getAllFiles();
    },

    handleSizeChange(val) {
      this.pager.size = val;
      this.pager.page = 1;
      this.getAllFiles();
    },

    async handleExpandRow(row, expandRows) {
      if (expandRows.find((item) => item.id === row.id)) {
        const { id } = row;
        const data = await this.getFileCompareRecord(id);
        this.$nextTick(() => {
          this.$set(row, 'children', data);
        });
      } else {
        this.$set(row, 'children', []);
      }
    },
    async getFileCompareRecord(id) {
      try {
        const res = await fetchFileCompareRecords(id);
        return res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    jumpToComparePage(compare_row) {
      const { compare_id, diff_file_info, std_file_info } = compare_row;
      const resolvedPath = this.$router.resolve({
        path: `/citics-tg/fileCompare/${diff_file_info.id}`,
        query: {
          standardFileId: std_file_info.id,
          compareRecordId: compare_id,
        },
      });
      window.open(resolvedPath.href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  ::v-deep .compare-button {
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
