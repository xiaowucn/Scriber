<template>
  <div class="compliance-project" v-loading="loading">
    <div class="banner">
      <el-button
        type="primary"
        size="small"
        @click="createProjectDialogVisible = true"
        >新建项目</el-button
      >
      <div class="filter-options">
        <div class="search">
          <div class="search-item">
            <span>年份：</span>
            <el-select
              v-model="search.report_year"
              size="small"
              placeholder="请选择年份"
              @change="handleSearchClicked">
              <el-option
                v-for="item in reportYears"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>证券代码：</span>
            <el-input
              v-model="search.stock_code"
              size="small"
              clearable
              placeholder="请输入证券代码"
              @clear="handleSearchClicked"></el-input>
          </div>
          <div class="search-item">
            <span>公司名称：</span>
            <el-input
              v-model="search.stock_name"
              size="small"
              clearable
              placeholder="请输入公司名称"
              @clear="handleSearchClicked"></el-input>
          </div>
          <el-button
            slot="append"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="handleSearchClicked"
            >搜索</el-button
          >
        </div>
      </div>
    </div>
    <el-table :data="fileList">
      <el-table-column
        prop="stock_code"
        label="证券代码"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column prop="stock_name" label="公司名称" align="center">
      </el-table-column>
      <el-table-column prop="report_year" label="年报年份" align="center">
      </el-table-column>
      <el-table-column prop="title" label="项目文档" align="center" width="240">
        <template slot-scope="scope">
          <span class="name" :title="scope.row.title">{{
            scope.row.title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AI解析状态" align="center" width="200">
        <template slot-scope="scope">
          <span
            :class="[
              'tag',
              scope.row.ai_status === questionAIStatusCompleted
                ? 'tag-success'
                : '',
            ]"
            >{{ scope.row.ai_status | getComplianceAIParseStatus }}</span
          >
          <el-progress
            v-if="scope.row.ai_status !== questionAIStatusCompleted"
            :percentage="
              scope.row.ai_status | getAIParseProgress
            "></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="compliance_count" label="合规数量" align="center">
        <template slot-scope="scope">
          <span
            >{{ scope.row.compliance_count }}/{{ scope.row.total_count }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="non_compliance_count"
        label="不合规数量"
        align="center">
        <template slot-scope="scope">
          <span
            >{{ scope.row.non_compliance_count }}/{{
              scope.row.total_count
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="score" label="合规评分" align="center">
        <template slot-scope="scope">
          <span>{{
            (scope.row.compliance_count / scope.row.total_count)
              | conversionPercet
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_utc"
        label="更新时间"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.updated_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="scope.row.ai_status !== questionAIStatusCompleted"
            @click="viewFileDetails(scope.row)"
            >查看</el-button
          >
          <el-button
            type="text"
            class="btn-delete"
            @click="deleteProject(scope.row.file_id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="changePage"></el-pagination>

    <el-dialog
      v-if="createProjectDialogVisible"
      title="新建项目"
      :visible.sync="createProjectDialogVisible"
      :close-on-click-modal="false"
      @close="closeProjectDialog">
      <el-form
        ref="projectForm"
        :model="projectForm"
        :rules="projectFormRules"
        label-width="100px">
        <el-form-item label="证券代码" prop="sec_code">
          <el-input
            v-model="projectForm.sec_code"
            maxlength="6"
            placeholder="请输入证券代码"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="sec_name">
          <el-input
            v-model="projectForm.sec_name"
            placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="年报年份" prop="report_year">
          <el-input
            v-model="projectForm.report_year"
            maxlength="4"
            placeholder="请输入年报年份（如：2020）"></el-input>
        </el-form-item>
        <el-form-item label="年报文件" prop="file">
          <el-upload
            v-model="projectForm.file"
            :limit="1"
            action=""
            accept=".pdf,.doc,.docx"
            :auto-upload="false"
            :on-change="onUploadFileChange"
            :on-remove="onUploadFileRemove">
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              <p>
                上传后将进入“AI自动解析”过程（预计10-15min），稍后可查看结果。
              </p>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeProjectDialog">取消</el-button>
        <el-button
          type="primary"
          @click="addProject"
          :loading="isUploadFileLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  addPocProject,
  fetchPocFiles,
  deletePocProject,
} from '@/store/api/sse.api';
import projectListMixin from '../mixins/projectListMixin';

export default {
  name: 'poc-project',
  mixins: [projectListMixin],
  data() {
    return {
      loading: false,
      fileList: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      search: {
        report_year: '',
        stock_code: '',
        stock_name: '',
      },
      questionAIStatusCompleted: 3, // 预测完成
      createProjectDialogVisible: false,
      isUploadFileLoading: false,
      projectForm: {
        sec_code: '',
        sec_name: '',
        report_year: '',
        file: null,
      },
      projectFormRules: {
        sec_code: [
          { required: true, message: '请输入股票代码', trigger: 'blur' },
        ],
        sec_name: [
          { required: true, message: '请输入股票简称', trigger: 'blur' },
        ],
        report_year: [
          { required: true, message: '请输入年报年份', trigger: 'blur' },
        ],
        file: [{ required: true, message: '请选择文件', trigger: 'change' }],
      },
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      this.fetchFiles();
    },

    async fetchFiles() {
      try {
        const search = _.pickBy(
          this.search,
          (value) => value !== null && value !== '',
        );
        const params = Object.assign({}, search, {
          page: this.pager.page,
        });
        const res = await fetchPocFiles(params);
        this.fileList = res.data.items;
        this.pager.total = res.data.total;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          const hasParsingFiles = this.fileList.some(
            (file) => file.ai_status !== this.questionAIStatusCompleted,
          );
          if (hasParsingFiles) {
            this.fetchFiles();
          } else {
            clearInterval(this.timer);
          }
        }, 5000);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    handleSearchClicked() {
      this.pager.page = 1;
      this.fetchFiles();
    },

    changePage(page) {
      this.pager.page = page;
      this.fetchFiles();
    },

    viewFileDetails(row) {
      const { id: qid, title } = row;
      const { id, pid, tree_id: treeId } = row.file;
      this.$router.push({
        name: 'pocDetails',
        params: { qid },
        query: {
          projectId: pid,
          treeId,
          fileId: id,
          fileName: title,
        },
      });
    },

    async deleteProject(id) {
      const confirm = await this.$confirm('确定删除该项目吗？', '提示').catch(
        () => {},
      );
      if (confirm === 'confirm') {
        try {
          await deletePocProject(id);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.fetchFiles();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },

    async addProject() {
      const isValid = await this.$refs['projectForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          this.isUploadFileLoading = true;
          const { sec_code, sec_name, report_year, file } = this.projectForm;
          const formData = new FormData();
          formData.append('sec_code', sec_code);
          formData.append('sec_name', sec_name);
          formData.append('report_year', report_year);
          formData.append('file', file);
          await addPocProject(formData);
          this.$notify({
            title: '成功',
            message: '项目新建成功',
            type: 'success',
          });
          this.fetchFiles();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.closeProjectDialog();
          this.isUploadFileLoading = false;
        }
      }
    },

    closeProjectDialog() {
      this.createProjectDialogVisible = false;
      this.resetProjectForm();
    },

    onUploadFileChange(file) {
      this.projectForm.file = file.raw;
      this.$refs.projectForm.clearValidate('file');
    },

    onUploadFileRemove() {
      this.projectForm.file = null;
    },

    resetProjectForm() {
      this.projectForm = {
        sec_code: '',
        sec_name: '',
        report_year: '',
        file: null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.compliance-project {
  padding: 20px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .filter-options {
      .search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .search-item {
          margin-right: 20px;
          span {
            margin-right: 5px;
            color: #707070;
            font-size: 14px;
          }
          .el-input {
            width: 160px;
          }
          .el-select {
            width: 160px;
          }
        }
      }
    }
  }
  .el-form {
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
  ::v-deep .el-table {
    th {
      background: #f6f7fb;
    }
    .cell {
      .name {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tag {
        position: relative;
        padding: 0 10px 0 25px;
        &::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 10px;
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: $primary-color;
          animation: warn 1.5s ease-out 0s infinite;
        }
        &.tag-success {
          &::before {
            background: #67c23a;
            animation: none;
          }
        }
      }
      .el-progress {
        .el-progress-bar__inner {
          background-color: $primary-color;
        }
      }
    }
    .btn-delete {
      color: $primary-color;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
