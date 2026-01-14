<template>
  <div class="export-answer-data-history">
    <el-popover
      title="导出历史列表"
      width="600"
      placement="bottom"
      popper-class="export-answer-data-history-popover"
      v-model="popoverVisible"
      trigger="click"
      @show="getExportAnswerDataHistory">
      <el-radio-group
        size="mini"
        v-model.number="exportAnswerData.status"
        @change="changeStatus">
        <el-radio-button
          v-for="(item, index) in EXPORT_STATUS_TYPES"
          :key="index"
          :label="item.value">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
      <el-table
        :data="exportAnswerData.items"
        v-loading="exportAnswerData.loading">
        <el-table-column prop="created_utc" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column prop="task_total" label="文件数量" align="center">
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="showDownloadButton(scope.row.status)"
              type="text"
              size="mini"
              :loading="scope.row.downloading"
              @click="downloadAnswerData(scope.row)">
              下载
            </el-button>
            <el-button
              v-if="showDeleteButton(scope.row.status)"
              type="text"
              size="mini"
              class="delete"
              @click="deleteAnswerData(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        layout="total, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :current-page="exportAnswerData.pager.page"
        :page-size="exportAnswerData.pager.size"
        :total="exportAnswerData.pager.total"
        @current-change="changePage">
      </el-pagination>
      <el-tooltip
        slot="reference"
        effect="dark"
        placement="bottom"
        content="导出历史列表">
        <el-button size="small" class="btn">
          <svg-font-icon
            name="history-list"
            :size="20"
            color="#707070"></svg-font-icon>
        </el-button>
      </el-tooltip>
    </el-popover>
  </div>
</template>

<script>
import { downloadFileByBlob } from '@/utils';
import {
  fetchExportAnswerDataTasks,
  deleteExportAnswerDataTask,
  downloadExportAnswerData,
} from '@/store/api/file.api';

const EXPORT_STATUS = {
  DOING: 1,
  FAILED: 2,
  FINISH: 3,
};

const EXPORT_STATUS_TYPES = [
  {
    label: '导出中',
    value: EXPORT_STATUS.DOING,
  },
  {
    label: '导出成功',
    value: EXPORT_STATUS.FINISH,
  },
  {
    label: '导出失败',
    value: EXPORT_STATUS.FAILED,
  },
];

export default {
  name: 'export-answer-data-history',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      EXPORT_STATUS,
      EXPORT_STATUS_TYPES,
      exportAnswerData: {
        loading: false,
        downloading: false,
        status: EXPORT_STATUS.FINISH,
        items: [],
        pager: {
          page: 1,
          size: 5,
          total: 0,
        },
      },
      popoverVisible: false,
    };
  },
  computed: {
    showDownloadButton() {
      return (status) => {
        return [EXPORT_STATUS.FINISH].includes(status);
      };
    },
    showDeleteButton() {
      return (status) => {
        return [EXPORT_STATUS.FINISH, EXPORT_STATUS.FAILED].includes(status);
      };
    },
  },
  created() {},
  methods: {
    async getExportAnswerDataHistory() {
      try {
        this.exportAnswerData.loading = true;
        const res = await fetchExportAnswerDataTasks(this.projectId, {
          page: this.exportAnswerData.pager.page,
          size: this.exportAnswerData.pager.size,
          status: this.exportAnswerData.status,
        });
        this.exportAnswerData.items = res.items.map((item) => {
          return {
            ...item,
            downloading: false,
          };
        });
        this.exportAnswerData.pager.total = res.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.exportAnswerData.loading = false;
      }
    },
    async downloadAnswerData(row) {
      try {
        row.downloading = true;
        const res = await downloadExportAnswerData(this.projectId, row.id);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        row.downloading = false;
      }
    },
    async deleteAnswerData(row) {
      const confirm = await this.$confirm('确定要删除吗？', '提示').catch(
        () => {
          this.$nextTick(() => {
            this.popoverVisible = true;
          });
        },
      );
      if (confirm === 'confirm') {
        this.$nextTick(() => {
          this.popoverVisible = true;
        });
        try {
          await deleteExportAnswerDataTask(this.projectId, row.id);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.exportAnswerData.pager.page = 1;
          this.getExportAnswerDataHistory();
        } catch (err) {
          this.$notify({
            title: '错误',
            message: err.message,
            type: 'error',
          });
        }
      }
    },
    changeStatus() {
      this.exportAnswerData.pager.page = 1;
      this.getExportAnswerDataHistory();
    },
    changePage(page) {
      this.exportAnswerData.pager.page = page;
      this.getExportAnswerDataHistory();
    },
  },
};
</script>

<style lang="scss">
.export-answer-data-history-popover {
  .el-popover__title {
    padding: 5px 0 15px;
    border-bottom: 1px solid #f4f4f4;
  }
  .el-radio-group {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }
  .el-button {
    &.delete {
      color: #fc3c38;
    }
  }
  .el-table {
    max-height: 50vh;
    overflow: auto;
    &::before {
      display: none;
    }
    .el-loading-mask {
      position: absolute;
    }
  }
  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
