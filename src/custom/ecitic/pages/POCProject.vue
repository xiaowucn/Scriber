<template>
  <div class="ipo-list" v-loading="loading">
    <div class="banner">
      <div class="btns">
        <el-button-group>
          <el-button
            v-for="(mode, index) in displayModeList"
            :key="index"
            :type="displayMode === mode.name ? 'primary' : ''"
            size="small"
            @click="displayMode = mode.name">
            <i :class="['fa', mode.icon]"></i>
          </el-button>
        </el-button-group>
        <el-button
          v-if="displayMode === 'list'"
          type="primary"
          size="small"
          @click="createProjectDialogVisible = true"
          >新建项目</el-button
        >
        <el-popover
          placement="bottom-end"
          popper-class="steps-popper"
          trigger="click">
          <steps :system="system"></steps>
          <el-button
            slot="reference"
            type="text"
            icon="el-icon-warning"
            class="tips-btn"
            >系统提示</el-button
          >
        </el-popover>
      </div>
      <div class="filter-options">
        <div class="search">
          <div class="search-item">
            <span>项目名称：</span>
            <el-input
              v-model="search.project_name"
              size="small"
              clearable
              placeholder="输入项目名称"
              @keyup.enter.native="searchProjects"
              @clear="searchProjects"></el-input>
          </div>
          <div class="search-item">
            <span>项目编号：</span>
            <el-input
              v-model="search.project_id"
              size="small"
              clearable
              placeholder="输入项目编号"
              @keyup.enter.native="searchProjects"
              @clear="searchProjects"></el-input>
          </div>
          <el-button
            slot="append"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="searchProjects"
            >搜索</el-button
          >
        </div>
      </div>
    </div>
    <template v-if="projectList">
      <div v-if="displayMode === 'card'" class="card-container">
        <div v-if="projectList.length === 0" class="card-add">
          <el-row :gutter="30">
            <el-col :span="8">
              <div class="card add" @click="createProjectDialogVisible = true">
                <i class="el-icon-plus"></i>
                <p>新建项目</p>
              </div>
            </el-col>
          </el-row>
          <steps :system="system"></steps>
        </div>
        <el-row v-else :gutter="30">
          <el-col :span="8">
            <div class="card add" @click="createProjectDialogVisible = true">
              <i class="el-icon-plus"></i>
              <p>新建项目</p>
            </div>
          </el-col>
          <el-col :span="8" v-for="(card, index) in projectList" :key="index">
            <div class="card">
              <div class="title">
                <img :src="getFileType(card.name)" alt="" class="file-icon" />
                <h5 :title="card.name">{{ card.name }}</h5>
              </div>
              <div class="details">
                <div>
                  <span>项目编号：</span><span>{{ card.id }}</span>
                </div>
                <div>
                  <span>项目名称：</span
                  ><span :title="card.meta_info.project_name">{{
                    card.meta_info.project_name
                  }}</span>
                </div>
                <div>
                  <span>所属用户：</span><span>{{ card.user_name }}</span>
                </div>
                <div>
                  <span>创建时间：</span>
                  <span :title="card.created_utc | datetime">{{
                    card.created_utc | datetime
                  }}</span>
                </div>
                <div class="progress">
                  <span class="label">文档状态：</span>
                  <span>
                    <el-progress
                      v-if="
                        card.question_ai_status !== questionAIStatusCompleted
                      "
                      :stroke-width="8"
                      color="#2b70cf"
                      :percentage="
                        card.question_ai_status | getAIParseProgress
                      "></el-progress>
                    <span
                      :class="[
                        'tag',
                        card.question_ai_status === questionAIStatusCompleted
                          ? 'tag-success'
                          : '',
                      ]"
                      >{{ card.question_ai_status | getAIParseStatus }}</span
                    >
                  </span>
                </div>
              </div>
              <div class="btns">
                <el-button
                  v-if="isSharesSystem"
                  size="mini"
                  :disabled="
                    card.question_ai_status !== questionAIStatusCompleted
                  "
                  :loading="card.exportLoading"
                  @click="exportDetails(card)">
                  导出
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="
                    card.question_ai_status !== questionAIStatusCompleted
                  "
                  @click="viewFileDetails(card)"
                  >人工复核</el-button
                >
                <el-button size="mini" @click="deleteProject(card.id)"
                  >删除</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table v-else :data="projectList">
        <el-table-column prop="id" label="项目编号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="project_name" label="项目名称" align="center">
          <template slot-scope="scope">
            <span class="name" :title="scope.row.meta_info.project_name">{{
              scope.row.meta_info.project_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="项目文档"
          align="center"
          width="240">
          <template slot-scope="scope">
            <span class="name" :title="scope.row.name">{{
              scope.row.name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="所属用户" align="center">
        </el-table-column>
        <el-table-column
          prop="question_ai_status"
          label="文档状态"
          align="center">
          <template slot-scope="scope">
            <span
              :class="[
                'tag',
                scope.row.question_ai_status === questionAIStatusCompleted
                  ? 'tag-success'
                  : '',
              ]"
              >{{ scope.row.question_ai_status | getAIParseStatus }}</span
            >
            <el-progress
              v-if="scope.row.question_ai_status !== questionAIStatusCompleted"
              :percentage="scope.row.question_ai_status | getAIParseProgress"
              color="#2b70cf"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="created_utc" label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="isSharesSystem"
              type="text"
              :disabled="
                scope.row.question_ai_status !== questionAIStatusCompleted
              "
              :loading="scope.row.exportLoading"
              @click="exportDetails(scope.row)">
              导出
            </el-button>
            <el-button
              type="text"
              :disabled="
                scope.row.question_ai_status !== questionAIStatusCompleted
              "
              @click="viewFileDetails(scope.row)"
              >人工复核</el-button
            >
            <el-button
              type="text"
              class="btn-delete"
              @click="deleteProject(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-pagination
      v-if="pager.total > pager.size"
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
        <el-form-item label="项目名称" prop="project_name">
          <el-input
            v-model="projectForm.project_name"
            maxlength="40"
            placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item v-if="isPocSystem" label="项目类型" prop="project_type">
          <el-radio-group v-model="projectForm.project_type">
            <el-radio
              v-for="(type, index) in projectTypes"
              :key="index"
              :label="type.value"
              >{{ type.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传文档" prop="file">
          <el-upload
            v-model="projectForm.file"
            action=""
            :accept="accept"
            :auto-upload="false"
            :on-change="onUploadFileChange"
            :on-remove="onUploadFileRemove">
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              <p>
                支持
                {{ accept.split(',').join('/').replace(/\./g, '') }}
                格式文档，上传后将进入“AI自动解析提取”过程，稍后可查看提取结果。
              </p>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          :disabled="showUploadFileProgress"
          @click="closeProjectDialog"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="addProject"
          :loading="showUploadFileProgress"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  fetchProjects,
  addProject,
  deleteProject,
  fetchSupportedReportTypes,
} from '@/store/api/ecitic.api';

import Steps from '../components/Steps';
import answerTableMixin from '../mixins/answerTableMixin';

import iconPDF from '../../szse/assets/icon-pdf.svg';
import iconWord from '../../szse/assets/icon-word.svg';

import { ECITIC_ENV_SYSTEM } from '@/store/constants';

export default {
  name: 'poc-project',
  components: { Steps },
  mixins: [answerTableMixin],
  props: {
    system: {
      type: String,
      default: 'poc',
    },
  },
  data() {
    return {
      loading: false,
      createProjectDialogVisible: false,
      projectForm: {
        project_name: '',
        project_type: '',
        file: null,
      },
      projectFormRules: {
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        project_type: [
          { required: true, message: '请选择项目类型', trigger: 'change' },
        ],
        file: [{ required: true, message: '请选择文件', trigger: 'change' }],
      },
      showUploadFileProgress: false,
      projectList: null,
      projectTypes: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      search: {
        project_id: '',
        project_name: '',
      },
      questionAIStatusCompleted: 3, // 预测完成
      projectFillStatusOptions: [
        {
          label: '全部',
          value: null,
        },
        {
          label: '待填报',
          value: 0,
        },
        {
          label: '已提交',
          value: 2,
        },
      ],
      displayMode: 'card',
      displayModeList: [
        {
          name: 'card',
          icon: 'fa-th-large',
        },
        {
          name: 'list',
          icon: 'fa-bars',
        },
      ],
    };
  },
  computed: {
    isPocSystem() {
      return this.system === ECITIC_ENV_SYSTEM.POC.name;
    },
    isSharesSystem() {
      return this.system === ECITIC_ENV_SYSTEM.SHARES.name;
    },
    accept() {
      return this.isPocSystem ? '.doc,.docx,.pdf' : '.pdf';
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      this.fetchProjects();
      this.fetchSupportedReportTypes();
    },

    async fetchProjects() {
      try {
        if (!this.projectList) {
          this.loading = true;
        }
        const params = _.pickBy(
          {
            ...this.search,
            page: this.pager.page,
            size: this.pager.size,
          },
          (value) => value !== null && value !== '',
        );
        const res = await fetchProjects(params);
        this.projectList = res.data.items.map((item) => {
          return {
            ...item,
            exportLoading: false,
          };
        });
        this.pager.total = res.data.total;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          const hasParsingFiles = this.projectList.some(
            (file) =>
              file.question_ai_status !== this.questionAIStatusCompleted,
          );
          if (hasParsingFiles) {
            this.fetchProjects();
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
      } finally {
        this.loading = false;
      }
    },

    async fetchSupportedReportTypes() {
      try {
        const res = await fetchSupportedReportTypes();
        this.projectTypes = Object.keys(res.data).map((key) => {
          return {
            label: res.data[key].name,
            value: key,
          };
        });
        this.projectForm.project_type = this.projectTypes[0].value;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    onUploadFileChange(file, fileList) {
      const suffix = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
      if (this.accept.indexOf(suffix) === -1) {
        this.$message.error(`不支持 ${suffix} 格式文件`);
        fileList.splice(0, 1);
        return;
      }

      const fileSize = file.size / 1024 / 1024;
      const MAX_FILE_SIZE = 20;
      if (fileSize > MAX_FILE_SIZE) {
        this.$message.error(`文件大小不能超过${MAX_FILE_SIZE}MB`);
        fileList.splice(0, 1);
        return;
      }

      this.projectForm.file = file.raw;
      this.$refs.projectForm.clearValidate('file');
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },

    onUploadFileRemove() {
      this.projectForm.file = null;
    },

    async addProject() {
      const isValid = await this.$refs['projectForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          this.showUploadFileProgress = true;
          const { project_name, project_type, file } = this.projectForm;
          const formData = new FormData();
          formData.append('project_name', project_name);
          if (this.isPocSystem) {
            formData.append('project_type', project_type);
          }
          formData.append('file', file);
          await addProject(formData);
          this.$notify({
            title: '成功',
            message: '项目新建成功',
            type: 'success',
          });
          this.closeProjectDialog();
          this.fetchProjects();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.showUploadFileProgress = false;
        }
      }
    },

    async deleteProject(id) {
      const confirm = await this.$confirm('确定要删除吗？', '提示', {
        customClass: 'szse-ipo-message-box',
      }).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await deleteProject(id);
          this.$notify({
            title: '成功',
            message: '项目删除成功',
            type: 'success',
          });
          this.fetchProjects();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },

    searchProjects() {
      this.pager.page = 1;
      this.fetchProjects();
    },

    changePage(page) {
      this.pager.page = page;
      this.fetchProjects();
    },

    resetProjectForm() {
      this.projectForm = {
        ...this.projectForm,
        project_name: '',
        file: null,
      };
    },

    closeProjectDialog() {
      this.createProjectDialogVisible = false;
      this.resetProjectForm();
    },

    getFileType(name) {
      const suffix = _.last(name.split('.')).toLowerCase();
      const fileType = suffix === 'doc' || suffix === 'docx' ? 'word' : 'pdf';
      if (fileType === 'pdf') {
        return iconPDF;
      }
      return iconWord;
    },

    async exportDetails(row) {
      this.exportExcel({ qid: row.question_id, file_id: row.id }, row);
    },

    viewFileDetails(row) {
      const { id, question_id } = row;
      this.$router.push({
        name: `${this.system}ProjectDetails`,
        params: { id: question_id },
        query: {
          fileId: id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../szse/styles/szse-ipo.common.scss';

.ipo-list {
  min-height: calc(100vh - 100px);
  padding: 20px;
  background: #f5f7fa;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    h4 {
      font-size: 14px;
      color: #666;
    }
    .el-button-group {
      margin-right: 25px;
    }
    .btns {
      display: flex;
      align-items: center;
      .tips-btn {
        margin-left: 20px;
        text-decoration: underline;
      }
    }
    .filter-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    ::v-deep .el-upload-list__item {
      transition: none;
    }
  }
  .card-container {
    .card-add {
      > .el-row {
        &:not(:first-child) {
          border-top: 1px solid #dfdfdf;
        }
        color: #333;
      }
      h4 {
        position: relative;
        margin: 20px 0;
        padding-left: 20px;
        &::before {
          content: '';
          position: absolute;
          top: 7px;
          left: 0;
          display: inline-block;
          width: 8px;
          height: 8px;
          background: $primary-color;
          transform: rotate(45deg);
        }
      }
      .text {
        margin: 20px 0;
        padding-left: 20px;
        color: #7e7e7e;
        line-height: 26px;
        &.primary-text {
          font-weight: 500;
          color: #333;
        }
      }
      .steps {
        .el-col {
          position: relative;
          text-align: center;
          color: #666;
          img {
            width: 100%;
          }
          p {
            font-size: 14px;
          }
          &:not(:last-child) {
            &::after {
              content: '';
              position: absolute;
              top: 42%;
              right: -13px;
              display: block;
              width: 30px;
              height: 20px;
              background: url(../assets/step-arrow.svg) no-repeat;
              background-size: 100%;
            }
          }
        }
      }
    }
    .card {
      position: relative;
      min-height: 220px;
      margin: 15px 0;
      padding: 20px;
      background: #fff;
      box-shadow: 0 0 19px 0 rgba(16, 66, 126, 0.15);
      border-radius: 5px;
      &.add {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        color: #a7b2c2;
        cursor: pointer;
        i {
          font-size: 44px;
          font-weight: bold;
        }
        p {
          margin: 10px 0 0 0;
          font-size: 14px;
        }
      }
      &:hover {
        box-shadow: 0 0 30px 0 rgba(16, 66, 126, 0.15);
      }
      .title {
        display: flex;
        align-items: center;
        .file-icon {
          width: 32px;
          height: 32px;
          margin-right: 15px;
        }
        h5 {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: #4e4e4e;
        }
      }
      .details {
        display: flex;
        margin-top: 20px;
        flex-flow: wrap;
        font-size: 14px;
        > div {
          display: flex;
          align-items: center;
          margin: 10px 0;

          &:nth-child(odd) {
            width: 40%;
          }
          &:nth-child(even) {
            width: 60%;
            > span:last-child {
              width: 70%;
            }
          }
          > span:first-child {
            min-width: 70px;
            color: #4e4e4e;
          }
          > span:last-child {
            width: 55%;
            color: #999;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          &.progress {
            width: 100%;
            > span:last-child {
              display: flex;
              align-items: center;
              .el-progress {
                width: 60%;
              }
            }
            .tag {
              position: relative;
              padding: 0 0 0 20px;
              &::before {
                content: '';
                position: absolute;
                top: 6px;
                left: 3px;
                display: block;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #ff0000;
                animation: warn 1.5s ease-out 0s infinite;
              }
              &.tag-success {
                &::before {
                  background: #67c23a;
                  animation: none;
                }
              }
            }
          }
        }
      }
      .btns {
        height: 30px;
        margin-top: 20px;
        text-align: center;
      }
    }
  }

  ::v-deep .el-table {
    th {
      background: #edf1fb;
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
          top: 6px;
          left: 10px;
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff0000;
          animation: warn 1.5s ease-out 0s infinite;
        }
        &.tag-success {
          &::before {
            background: #67c23a;
            animation: none;
          }
        }
      }
    }
    .btn-delete {
      color: #f56c6c;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
    &.is-background {
      ::v-deep .el-pager {
        li:not(.disabled) {
          background-color: #fff;
          &.active {
            background-color: $primary-color;
          }
        }
      }
    }
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

<style lang="scss">
.steps-popper {
  width: calc(100vw - 40px);
  box-shadow: 0 3px 10px #ccc;
  font-size: initial;
}
</style>
