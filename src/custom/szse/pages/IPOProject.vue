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
          >新建任务</el-button
        >
        <el-popover
          placement="bottom-end"
          popper-class="steps-popper"
          trigger="click">
          <steps></steps>
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
            <span>任务名称：</span>
            <el-input
              v-model.trim="search.name"
              size="small"
              clearable
              placeholder="请输入任务名称"
              @change="handleSearchClicked"></el-input>
          </div>
          <div class="search-item">
            <span>任务编号：</span>
            <el-input
              v-model.trim="search.id"
              size="small"
              clearable
              placeholder="请输入任务编号"
              @change="handleSearchClicked"></el-input>
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
    <template v-if="fileList">
      <div v-if="displayMode === 'card'" class="card-container">
        <div v-if="fileList.length === 0" class="card-add">
          <el-row :gutter="30">
            <el-col :span="8">
              <div class="card add" @click="createProjectDialogVisible = true">
                <i class="el-icon-plus"></i>
                <p>新建任务</p>
              </div>
            </el-col>
          </el-row>
          <steps></steps>
        </div>
        <el-row v-else :gutter="30">
          <el-col :span="8">
            <div class="card add" @click="createProjectDialogVisible = true">
              <i class="el-icon-plus"></i>
              <p>新建任务</p>
            </div>
          </el-col>
          <el-col :span="8" v-for="(card, index) in fileList" :key="index">
            <div class="card">
              <div class="title">
                <img :src="getFileType(card.name)" alt="" class="file-icon" />
                <h5 :title="card.name">{{ card.name }}</h5>
              </div>
              <div class="details">
                <div>
                  <span>任务编号：</span><span>{{ card.fid }}</span>
                </div>
                <div>
                  <span>任务名称：</span
                  ><span :title="card.question_name">{{
                    card.question_name
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
                  type="primary"
                  size="mini"
                  :disabled="
                    card.question_ai_status !== questionAIStatusCompleted
                  "
                  @click="viewFileDetails(card)"
                  >人工复核</el-button
                >
                <el-button size="mini" @click="deleteProject(card.fid)"
                  >删除</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table v-else :data="fileList">
        <el-table-column prop="fid" label="任务编号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="question_name" label="任务名称" align="center">
          <template slot-scope="scope">
            <span class="name" :title="scope.row.question_name">{{
              scope.row.question_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="任务文档"
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
        <el-table-column
          prop="data_updated_utc"
          label="创建时间"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
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
              @click="deleteProject(scope.row.fid)"
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
      title="新建任务"
      :visible.sync="createProjectDialogVisible"
      :close-on-click-modal="false"
      @close="closeProjectDialog">
      <el-form
        ref="projectForm"
        :model="projectForm"
        :rules="projectFormRules"
        label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input
            v-model="projectForm.name"
            maxlength="40"
            placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="上传招股书" prop="file">
          <el-upload
            v-model="projectForm.file"
            action=""
            accept=".doc,.docx,.pdf"
            :auto-upload="false"
            :on-change="onUploadFileChange"
            :on-remove="onUploadFileRemove">
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              <p>
                支持docx/doc/pdf格式文档，上传后将进入“AI自动解析提取”过程，稍后可查看提取结果。
              </p>
              <p>
                docx格式文件提取较快，建议上传该格式文件。（docx格式预估6到8分钟，其他格式预计25到30分钟）
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
          :loading="showUploadFileProgress"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import Steps from '../components/Steps.vue';
import answerTableMixin from '../mixins/answerTableMixin';
import {
  fetchDefaultProject,
  fetchFiles,
  addProject,
  deleteProject,
} from '@/store/api/szse.api';

import iconPDF from '../assets/icon-pdf.svg';
import iconWord from '../assets/icon-word.svg';

export default {
  name: 'ipo-list',
  components: { Steps },
  mixins: [answerTableMixin],
  data() {
    return {
      loading: false,
      createProjectDialogVisible: false,
      projectId: null,
      fileTreeId: null,
      projectForm: {
        name: '',
        file: null,
      },
      projectFormRules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        file: [{ required: true, message: '请选择文件', trigger: 'change' }],
      },
      showUploadFileProgress: false,
      fileList: null,
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      search: {
        name: '',
        id: '',
        fill_in_status: null,
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
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      await this.fetchDefaultProject();
      this.fetchFiles(this.fileTreeId);
    },

    async fetchDefaultProject() {
      try {
        const res = await fetchDefaultProject();
        this.projectId = res.data.file_project;
        this.fileTreeId = res.data.file_tree_id;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchFiles() {
      try {
        if (!this.fileList) {
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
        const res = await fetchFiles(params);
        this.fileList = res.data.items;
        this.pager.total = res.data.total;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          const hasParsingFiles = this.fileList.some(
            (file) =>
              file.question_ai_status !== this.questionAIStatusCompleted,
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
      } finally {
        this.loading = false;
      }
    },

    onUploadFileChange(file, fileList) {
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
          const { name, file } = this.projectForm;
          const formData = new FormData();
          formData.append('name', name);
          formData.append('file', file);
          await addProject(this.fileTreeId, formData);
          this.$notify({
            title: '成功',
            message: '任务新建成功',
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
          this.showUploadFileProgress = false;
        }
      }
    },

    async deleteProject(fileId) {
      const confirm = await this.$confirm('确定要删除吗？', '提示', {
        customClass: 'szse-ipo-message-box',
      }).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await deleteProject(fileId);
          this.$notify({
            title: '成功',
            message: '任务删除成功',
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

    handleSearchClicked() {
      this.pager.page = 1;
      this.fetchFiles();
    },

    changePage(page) {
      this.pager.page = page;
      this.fetchFiles();
    },

    resetProjectForm() {
      this.projectForm = {
        name: '',
        file: null,
      };
    },

    closeProjectDialog() {
      this.createProjectDialogVisible = false;
      this.resetProjectForm();
    },

    getFileType(name) {
      const suffix = _.last(name.split('.'));
      const fileType = suffix === 'doc' || suffix === 'docx' ? 'word' : 'pdf';
      if (fileType === 'pdf') {
        return iconPDF;
      }
      return iconWord;
    },

    viewFileDetails(row) {
      const { fid, qid, question_name, question_ai_status, fill_in_status } =
        row;
      this.$router.push({
        name: 'fileDetails',
        params: { id: this.projectId },
        query: {
          projectName: question_name,
          fileId: fid,
          questionId: qid,
          fileStatus: question_ai_status,
          fillInStatus: fill_in_status,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/szse-ipo.common.scss';

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
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #4e4e4e;
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
