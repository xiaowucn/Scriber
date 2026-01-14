<template>
  <div class="citics-tg-page">
    <div v-if="isCiticsTgAllow('record_push_search')" class="list-header">
      <div class="search-container">
        <search-box
          :searchOptions="searchOptions"
          :filterBy="filterBy"
          :filterValue="filterValue"
          @search="handleSearch"></search-box>
      </div>
    </div>
    <div class="record-container">
      <el-table
        class="has-border"
        :empty-text="$t(`message['暂无数据']`)"
        :data="items"
        v-loading="isLoading">
        <el-table-column prop="id" label="ID" align="center" width="100">
        </el-table-column>
        <el-table-column
          prop="project_name"
          :label="$t(`message['项目名称']`)"
          align="center">
          <span slot-scope="scope">
            {{ scope.row.data.project_name || '' }}
          </span>
        </el-table-column>
        <el-table-column
          prop="file_name"
          :label="$t(`message['文件名称']`)"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.data.file_name || '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="external_source"
          :label="$t(`message['外部参数来源']`)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="task_type"
          :label="$t(`message['场景']`)"
          align="center">
          <span slot-scope="scope">
            {{
              TASK_TYPE_MAP.find((item) => item.value === scope.row.task_type)
                .label
            }}
          </span>
        </el-table-column>
        <el-table-column
          prop="push_type"
          :label="$t(`message['推送方式']`)"
          align="center">
          <span slot-scope="scope">
            {{
              PUSH_TYPE_MAP.find((item) => item.value === scope.row.push_type)
                .label
            }}
          </span>
        </el-table-column>
        <el-table-column
          prop="created_utc"
          :label="$t(`message['推送时间']`)"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t(`message['状态']`)"
          align="center">
          <template slot-scope="scope">
            <span :class="{ 'push-failed': !scope.row.status }">
              {{
                PUSH_STATUS_MAP.find((item) => item.value === scope.row.status)
                  .label
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t(`message['操作']`)"
          width="200"
          class-name="operations"
          align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button
                v-if="isCiticsTgAllow('record_push_detail')"
                type="text"
                size="small"
                circle
                @click="handleViewPushContent(scope.row)">
                {{ $t(`message['推送详情']`) }}
              </el-button>
              <el-button
                v-if="
                  !scope.row.status && isCiticsTgAllow('record_push_repush')
                "
                type="text"
                size="small"
                circle
                @click="handleRePush(scope.row)">
                {{ $t(`message['重新推送']`) }}
              </el-button>
              <el-button
                v-if="isCiticsTgAllow('record_push_del')"
                class="delete-btn"
                type="text"
                size="small"
                circle
                @click="handleDeletePush(scope.row)">
                {{ $t(`message['删除']`) }}
              </el-button>
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
    <push-content-dialog
      v-if="pushContentDialogVisible"
      :current-view-content="currentViewContent"
      @close="handleCloseDialog">
    </push-content-dialog>
  </div>
</template>

<script>
import PushContentDialog from '../components/PushContentDialog.vue';
import SearchBox from '../components/SearchBox';
import {
  fetchPushRecords,
  deletePushRecord,
  rePushRecord,
} from '@/store/api/citics-tg.api';
import {
  TASK_TYPE_MAP,
  PUSH_TYPE_MAP,
  PUSH_STATUS_MAP,
} from '../common/constant';
import { isCiticsTgAllow } from '../common/utils';
export default {
  name: 'citics-tg-push-record',
  components: { SearchBox, PushContentDialog },
  data() {
    return {
      TASK_TYPE_MAP,
      PUSH_TYPE_MAP,
      PUSH_STATUS_MAP,
      items: [],
      searchOptions: [
        {
          value: 'push_id',
          label: '推送ID',
        },
        {
          value: 'project',
          label: '项目名称',
        },
        {
          value: 'file',
          label: '文件名称',
        },
        {
          value: 'task_type',
          label: '场景',
          options: TASK_TYPE_MAP,
        },
        {
          value: 'push_type',
          label: '推送方式',
          options: PUSH_TYPE_MAP,
        },
        {
          value: 'status',
          label: '推送状态',
          options: PUSH_STATUS_MAP,
        },
      ],
      filterBy: 'push_id',
      filterValue: '',
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      isLoading: false,
      pushContentDialogVisible: false,
      currentViewContent: {},
    };
  },
  mounted() {
    this.getPushRecords();
  },
  methods: {
    isCiticsTgAllow,
    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = `${filterValue}`;
      this.pager.page = 1;
      this.getPushRecords();
    },
    handleCloseDialog() {
      this.pushContentDialogVisible = false;
    },
    handleCurrentPageChange(val) {
      this.pager.page = val;
      this.getPushRecords();
    },

    handleSizeChange(val) {
      this.pager.size = val;
      this.pager.page = 1;
      this.getPushRecords();
    },
    async getPushRecords() {
      try {
        this.isLoading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        const res = await fetchPushRecords(params);
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
    handleDeletePush(row) {
      this.$confirm('确认删除推送记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deletePushRecord(row.id);
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    async deletePushRecord(id) {
      try {
        await deletePushRecord(id);
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
        });
        if (this.items.length === 1 && this.pager.page !== 1) {
          this.pager.page -= 1;
        }
        this.getPushRecords();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleViewPushContent(row) {
      this.pushContentDialogVisible = true;
      this.currentViewContent = row.data;
    },
    handleRePush(row) {
      this.$confirm('确认重新推送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.setParameterPush(row.id);
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    async setParameterPush(id) {
      try {
        await rePushRecord(id, { re_push: 1 });
        this.$notify({
          title: '成功',
          message: this.$t(`message['重新推送成功']`),
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.citics-tg-page {
  .search-container {
    display: flex;
    align-items: center;
    .el-select {
      width: 300px;
      margin-right: 10px;
    }
  }
  ::v-deep .delete-btn {
    color: #ff0000;
  }
  ::v-deep .push-failed {
    color: #ff0000;
  }
}
</style>
