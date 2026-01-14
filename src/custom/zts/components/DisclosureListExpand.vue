<template>
  <div class="disclosure-list-expand">
    <el-table
      class="has-border"
      empty-text="暂无数据"
      :data="currentFiles"
      v-loading="currentFilesLoading">
      <el-table-column
        prop="name"
        label="文件名称"
        align="center"
        width="340"
        class-name="file-name">
      </el-table-column>
      <el-table-column prop="doc_type" label="文件类型" align="center">
      </el-table-column>
      <el-table-column prop="report_year" label="文件年份" align="center">
      </el-table-column>
      <el-table-column prop="pdf_parse_status" label="文件状态" align="center">
        <template slot-scope="scope">
          <span :style="getFileStatusStyle(scope.row.pdf_parse_status)">
            {{ scope.row.pdf_parse_status | pdfParseStatus }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="created_utc" label="上传时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_utc | datetime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { getFileStatusStyle } from '../common/utils';

export default {
  name: 'disclosure-list-expand',
  props: {
    projectId: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['files']),

    currentFiles() {
      if (!_.isEmpty(this.files.items)) {
        return this.files.items.find(
          (item) => item.project_id === this.projectId,
        )?.files;
      }
      return [];
    },
    currentFilesLoading() {
      return this.files.isLoading;
    },
  },
  methods: {
    getFileStatusStyle,
  },
};
</script>

<style lang="scss" scoped>
.disclosure-list-expand {
  margin: 20px 40px;
  ::v-deep .el-table {
    font-size: 13px;
    .el-table__header {
      .el-table__cell {
        background-color: #f3f3f3;
        .cell {
          font-size: 13px;
        }
      }
    }
    .el-table__body {
      .el-table__row {
        .el-table__cell {
          .cell {
            padding: 0 20px;
          }
          &.file-name {
            .cell {
              padding: 0 30px;
            }
          }
        }
      }
    }
  }
}
</style>
