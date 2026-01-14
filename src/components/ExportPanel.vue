<template>
  <div class="export-panel" v-loading="isLoading">
    <el-header class="export-header">
      <el-button type="primary" size="small" @click="openDialog">
        <i
          :class="
            $platform.isDefaultEnv()
              ? 'fa fa-plus fa-fw'
              : 'el-icon-circle-plus'
          "></i>
        新建导出
      </el-button>
      <span class="export-tips">
        <template v-if="$features.showAIModules()">
          {{ exportTip }}
        </template>
        <template v-else>（将导出文档所对应字段的抽取结果为csv文件）</template>
      </span>
      <select-folder-popup
        v-if="visible"
        :visible="visible"
        :export-action="exportAction"
        :export-type="exportType"
        @close="visible = false"
        @update-export-files="handleNewExport" />
    </el-header>
    <el-table
      v-loading="false"
      style="width: 100%"
      class="has-border"
      :default-sort="{ prop: 'created_utc', order: 'descending' }"
      :data="exportList || []">
      <el-table-column label="创建时间" prop="created_utc">
        <template slot-scope="scope">
          <span class="created-time">{{
            scope.row.created_utc | datetime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="exportType === 'csv' ? '文件数量' : '标注文件数量'"
        prop="task_total">
        <template slot-scope="scope">{{ scope.row.task_total }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="exportType === 'csv' ? '结果数据' : '标注结果数据'"
        prop="task_done">
        <template slot-scope="scope">
          <span class="updated-time">{{ showExportMessage(scope.row) }}</span>
          <el-tag v-if="!scope.row.zip_path" size="mini">{{
            fetchProgressVal(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="operations"
        :fixed="$features.operationColumnFixed()">
        <template slot-scope="scope">
          <el-tooltip
            v-if="$isAllowed('manageSchema') && scope.row.zip_path"
            effect="dark"
            :content="$t(`message['下载']`)"
            placement="top">
            <el-button type="text">
              <a
                :href="downloadFile(scope.row.id)"
                :download="scope.row"
                class="download-btn">
                <theme-icon
                  name="download"
                  :old-icon-url="exportFileImg"></theme-icon>
              </a>
            </el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$isAllowed('manageSchema') && scope.row.zip_path"
            effect="dark"
            :content="$t(`message['删除']`)"
            placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
              @click="deleteFile(scope.row.id)">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="exportPager.page"
      :page-size="exportPager.size"
      :total="exportPager.total"
      @current-change="changeExportListPage">
    </el-pagination>
  </div>
</template>

<script>
import SelectFolderPopup from './SelectFolderPopup';
import { exportFileImg, batchExportImg } from '@/images/';
import { schema as schemaApi } from '../store/api';

export default {
  name: 'export-panel',
  components: { SelectFolderPopup },
  props: {
    exportActionMap: {
      type: Object,
      required: true,
    },
    exportType: {
      type: String,
      required: false,
      default: '',
    },
    exportList: {
      type: Array,
      required: true,
    },
    exportPager: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      exportFileImg,
      batchExportImg,
      visible: false,
    };
  },
  computed: {
    exportTip() {
      const panelType = this.$route.params.panelType;
      switch (panelType) {
        case 'export-catalog-csv':
          return '（将导出目录结构为csv文件）';
        case 'export-inspect-csv':
          return '（将导出审核结果为csv文件，只导出有审核结果的文档）';
        case 'export-answer-json':
          return '（将导出提取结果为json文件，有人工标注取人工标注结果，无人工标注则取预测结果）';
        case 'export-answer-csv':
          return '（将导出提取结果为csv文件，有人工标注取人工标注结果，无人工标注则取预测结果）';
        default:
          return '';
      }
    },
    exportAction() {
      return this.exportActionMap.create;
    },
  },
  methods: {
    showExportMessage(row) {
      if (row.zip_path) {
        return '已生成';
      } else {
        return '生成中...';
      }
    },
    openDialog() {
      this.visible = true;
    },
    handleNewExport(list) {
      this.$emit('export-new-result', list);
    },
    downloadFile(id) {
      return schemaApi.exportTrainingData(id, this.exportActionMap.download);
    },
    async deleteFile(id) {
      const result = await this.$confirm('确定要删除吗？', '提示').catch(
        () => {},
      );
      if (result === 'confirm') {
        try {
          await schemaApi.deleteTrainingData(id, this.exportActionMap.delete);
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
          });
          this.$emit('deleted-file');
        } catch (err) {
          this.$notify({
            title: '错误',
            message: err.message,
            type: 'error',
          });
        }
      }
    },
    fetchProgressVal(row) {
      return `${row.task_done} / ${row.task_total}`;
    },
    changeExportListPage(page) {
      this.$emit('change-export-list-page', page);
    },
  },
};
</script>

<style lang="scss" scoped>
.export-panel {
  .export-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    border-bottom: 1px solid #e9eef6;
    margin-top: 0;
    .export-tips {
      margin-left: 10px;
      color: #8c8c8c;
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}

.export-icon {
  padding: 4px !important;
  background: #4bd3b4;
  border: none;
  &:hover {
    background: rgba(#4bd3b4, 0.8);
  }
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  &.batch {
    img {
      width: 16px;
      height: 16px;
    }
  }
}
.batch-export-icon {
  background: #409eff;
  border: none;
  &:hover {
    background: rgba(#409eff, 0.8);
  }
  img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
}
.download-btn {
  text-decoration: none;
  color: #ffffff;
  display: block;
  width: 24px;
  height: 24px;
}
</style>
