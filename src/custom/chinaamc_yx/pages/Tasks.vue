<template>
  <div class="tasks-container">
    <div class="page-header">
      <el-button
        v-if="showCreateTaskButton"
        size="medium"
        type="primary"
        @click="openTaskDialog">
        <i class="fa fa-plus fa-fw"></i>
        创建比对任务
      </el-button>
    </div>
    <el-table
      ref="tasksTable"
      empty-text="暂无数据"
      :data="tasks"
      v-loading="loading"
      row-key="id"
      :expand-row-keys="expandRowKeys"
      @row-click="handleRowClicked"
      :row-class-name="getRowClassName">
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <el-table
            empty-text="暂无数据"
            v-loading="filesLoading"
            :data="props.row.files || []"
            class="task-expanded-table">
            <el-table-column
              prop="id"
              label="ID"
              width="100"
              align="center"></el-table-column>
            <el-table-column prop="file_type" label="文档类型" align="center">
            </el-table-column>
            <el-table-column prop="name" label="文档名称" align="center">
            </el-table-column>
            <el-table-column prop="created_utc" label="上传时间" align="center">
              <template slot-scope="scope">
                {{ scope.row.created_utc | datetime }}
              </template>
            </el-table-column>
            <el-table-column prop="" label="状态" align="center" width="300px">
              <span
                slot-scope="scope"
                :class="[
                  'file-status',
                  getColumnStatusClass(getFileStatus(scope.row)),
                ]">
                {{ getFileStatus(scope.row) }}
                <template v-if="scope.row.file_type === FILE_TYPES[2]">
                  /
                  <template
                    v-if="
                      [
                        CHAPTER_STATUS_CODE.DEFAULT,
                        CHAPTER_STATUS_CODE.DOING,
                      ].includes(props.row.chapter_status)
                    ">
                    <span class="chapter-status doing">
                      {{ CHAPTER_STATUS[props.row.chapter_status] }}
                    </span>
                  </template>
                  <template
                    v-if="
                      props.row.chapter_status === CHAPTER_STATUS_CODE.FAILED
                    ">
                    <span class="chapter-status failed">
                      {{ CHAPTER_STATUS[props.row.chapter_status] }},
                    </span>
                    <el-button
                      type="text"
                      class="btn-retry"
                      @click="retryChapterDiff(props.row)">
                      重新尝试
                    </el-button>
                  </template>
                  <template
                    v-if="
                      props.row.chapter_status === CHAPTER_STATUS_CODE.DONE
                    ">
                    <span class="chapter-status success">
                      {{ CHAPTER_STATUS[props.row.chapter_status] }},
                    </span>
                    <router-link
                      :to="{
                        name: 'chapterDiff',
                        params: {
                          taskId: props.row.id,
                        },
                      }"
                      target="_blank">
                      去查看
                    </router-link>
                  </template>
                </template>
              </span>
            </el-table-column>
            <el-table-column
              label="操作"
              width="240"
              class-name="operations"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="default"
                  size="mini"
                  :disabled="fileDiffBtnDisabled(scope.row)"
                  @click="gotoFileDiffPage(props.row.id, scope.row.id)">
                  文档内比对
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="100"
        align="center"></el-table-column>
      <el-table-column prop="name" label="任务名称" align="center">
      </el-table-column>
      <el-table-column prop="created_utc" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="创建人" align="center">
      </el-table-column>
      <el-table-column prop="source" label="任务来源" align="center">
        <template slot-scope="scope">
          {{ scope.row.source | source }}
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="处理进度" align="center">
        <span
          slot-scope="scope"
          :class="getColumnStatusClass(PROGRESS_STATUS[scope.row.status])">
          {{ scope.row.status | progress }}
        </span>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="上传文档" placement="top">
            <el-button
              v-if="showUploadBtn(scope.row)"
              type="text"
              @click.stop="openUploadDialog(scope.row)">
              <theme-icon name="upload" icon-class="el-icon-upload">
              </theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="一致性比对" placement="top">
            <el-button
              :disabled="compareBtnDisabled(scope.row)"
              type="text"
              @click.stop="gotoDetails(scope.row)">
              <theme-icon name="compare" icon-class="el-icon-compare">
              </theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="重新比对" placement="top">
            <el-button
              v-if="scope.row.retryable"
              type="text"
              @click.stop="recompare(scope.row)">
              <theme-icon name="reparse" icon-class="el-icon-refresh">
              </theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button type="text" @click.stop="deleteTask(scope.row.id)">
              <theme-icon name="delete" icon-class="el-icon-delete">
              </theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pager.total > 0"
      background
      layout="total, prev, pager, next, sizes"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50]"
      :total="pager.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange">
    </el-pagination>

    <el-dialog
      v-if="showCreateTaskDialog"
      visible
      title="创建任务"
      width="600px"
      @close="closeTaskDialog">
      <el-form ref="taskForm" :model="task" :rules="rules" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input
            v-model="task.name"
            ref="nameInput"
            placeholder="请输入任务名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeTaskDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="createTaskLoading"
          @click="createTask">
          确定
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="showUploadDialog"
      visible
      title="上传文档"
      width="800px"
      class="upload-dialog"
      @close="closeUploadDialog">
      <el-form
        ref="uploadForm"
        :model="task.upload"
        label-width="150px"
        v-loading="filesLoading">
        <el-form-item label="任务名称:" prop="name" class="task-name">
          <el-input v-model="task.name" ref="nameInput" readonly size="small">
          </el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in task.upload.files"
          :key="index"
          :label="item.label"
          :prop="item.rules ? `files[${index}].name` : ''"
          :rules="item.rules">
          <div class="upload-item">
            <el-input v-model="item.name" size="mini" readonly></el-input>
            <div class="upload-action">
              <el-upload
                action=""
                :accept="task.upload.acceptTypes"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="(event) => onUploadChange(event, index)">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-upload2"
                  :disabled="item.progress > 0">
                </el-button>
              </el-upload>
              <el-button
                v-if="showRemoveFileBtn(item)"
                :type="
                  item.file_type === FILE_TYPES[8] && item.index !== 1
                    ? 'default'
                    : 'danger'
                "
                size="mini"
                icon="el-icon-delete"
                @click="removeUploadedFile(item, index)">
              </el-button>
              <el-button
                v-if="item.canAddItem"
                size="mini"
                icon="el-icon-plus"
                :disabled="addUploadItemBtnDisabled"
                @click="addUploadItem(item)">
              </el-button>
            </div>
          </div>
          <el-progress
            v-if="item.progress"
            :percentage="item.progress"></el-progress>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeUploadDialog">取消</el-button>
        <el-button type="primary" @click="startDiff">开始比对</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  updateSearchParams,
  fillSearchParamsFromURL,
} from '@/utils/tableSearchUtils';
import {
  fetchCompareTasks,
  createTask,
  deleteTask,
  uploadFile,
  deleteFile,
  fetchTaskFiles,
  diff,
  redo,
  redoChapter,
} from '@/store/api/chinaamc_yx.api';
import {
  TASK_SOURCE_CODE,
  TASK_SOURCE,
  PROGRESS_STATUS,
  PROGRESS_STATUS_CODE,
  FILE_TYPES,
  FILE_STATUS,
  FILE_STATUS_CODE,
  CHAPTER_STATUS_CODE,
  CHAPTER_STATUS,
  UPLOAD_FILE_MAX_SIZE,
} from '../common/constant';
import { getCookie, checkUploadFileSize } from '@/utils';

export default {
  name: 'chinaamc_yx-tasks',
  props: {},
  data() {
    return {
      PROGRESS_STATUS,
      FILE_TYPES,
      CHAPTER_STATUS_CODE,
      CHAPTER_STATUS,
      showCreateTaskButton: false,
      showCreateTaskDialog: false,
      createTaskLoading: false,
      loading: false,
      filesLoading: false,
      task: {
        id: null,
        name: '',
        source: TASK_SOURCE_CODE.LOCAL,
        upload: {
          acceptTypes: '.pdf,.doc,.docx',
          files: [
            {
              label: FILE_TYPES[1],
              file_type: FILE_TYPES[1],
              name: '',
              file: null,
              progress: 0,
              rules: [
                {
                  required: true,
                  message: `请上传${FILE_TYPES[1]}`,
                  trigger: 'change',
                },
              ],
            },
            {
              label: FILE_TYPES[2],
              file_type: FILE_TYPES[2],
              name: '',
              file: null,
              progress: 0,
              rules: [
                {
                  required: true,
                  message: `请上传${FILE_TYPES[2]}`,
                  trigger: 'change',
                },
              ],
            },
            {
              label: FILE_TYPES[3],
              file_type: FILE_TYPES[3],
              name: '',
              file: null,
              progress: 0,
              rules: [
                {
                  required: true,
                  message: `请上传${FILE_TYPES[3]}`,
                  trigger: 'change',
                },
              ],
            },
            {
              label: FILE_TYPES[4],
              file_type: FILE_TYPES[4],
              name: '',
              file: null,
              progress: 0,
            },
            {
              label: FILE_TYPES[5],
              file_type: FILE_TYPES[5],
              name: '',
              file: null,
              progress: 0,
            },
            {
              label: FILE_TYPES[6],
              file_type: FILE_TYPES[6],
              name: '',
              file: null,
              progress: 0,
            },
            {
              label: FILE_TYPES[7],
              file_type: FILE_TYPES[7],
              name: '',
              file: null,
              progress: 0,
            },
            {
              label: `${FILE_TYPES[8]}1`,
              file_type: FILE_TYPES[8],
              name: '',
              file: null,
              progress: 0,
              canAddItem: true,
              index: 1,
            },
          ],
        },
      },
      rules: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'change' },
          { validator: this.validateTaskName, trigger: 'change' },
        ],
      },
      timer: null,
      tasks: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      expandRowKeys: [],
      showUploadDialog: false,
      uploadOrigin: null,
    };
  },
  computed: {
    addUploadItemBtnDisabled() {
      return (
        this.task.upload.files.filter(
          (file) => file.file_type === FILE_TYPES[8],
        ).length >= 5
      );
    },
    showRemoveFileBtn() {
      return (file) => {
        if (file.file_type === FILE_TYPES[8]) {
          if (!file.canAddItem) {
            return true;
          }
          return file.name !== '';
        }
        return file.name !== '';
      };
    },
  },
  filters: {
    source(status) {
      return TASK_SOURCE[status];
    },
    progress(status) {
      return PROGRESS_STATUS[status];
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      fillSearchParamsFromURL(this, this.pager);
      this.setShowCreateTaskButton();
      this.getTasks();
    },
    setShowCreateTaskButton() {
      const pidFromCookie = getCookie('pid');
      this.showCreateTaskButton = Boolean(!pidFromCookie);
    },
    async getTasks({ loading = true } = {}) {
      try {
        if (loading) {
          this.loading = true;
        }
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        const res = await fetchCompareTasks(params);
        this.tasks = res.data.items;
        this.pager.total = res.data.total;
        updateSearchParams(this, {
          page: this.pager.page,
          size: this.pager.size,
        });

        clearInterval(this.timer);
        const hasProcessingTasks = this.tasks.some((item) =>
          [
            PROGRESS_STATUS_CODE.PARSING,
            PROGRESS_STATUS_CODE.PARSED,
            PROGRESS_STATUS_CODE.AI_DOING,
            PROGRESS_STATUS_CODE.DIFF_DOING,
          ].includes(item.status),
        );
        if (hasProcessingTasks) {
          this.timer = setInterval(() => {
            this.getTasks({ loading: false });
          }, 10e3);
        }
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
    openTaskDialog() {
      this.showCreateTaskDialog = true;
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    closeTaskDialog() {
      this.showCreateTaskDialog = false;
      this.task.name = '';
    },
    validateTaskName(rule, value, callback) {
      if (value.trim() === '') {
        callback(new Error('任务名称不能为空'));
      } else {
        callback();
      }
    },
    async createTask() {
      const isValid = await this.$refs['taskForm'].validate().catch(() => {});
      if (isValid) {
        try {
          this.createTaskLoading = true;
          await createTask({ name: this.task.name.trim() });
          this.$notify({
            title: '成功',
            message: '任务新建成功',
            type: 'success',
          });
          this.closeTaskDialog();
          this.pager.page = 1;
          this.getTasks();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.createTaskLoading = false;
        }
      }
    },
    async deleteTask(id) {
      try {
        const confirm = await this.$confirm('确认删除该任务吗？', '提示').catch(
          () => {},
        );
        if (confirm === 'confirm') {
          await deleteTask(id);
          this.$notify({
            title: '成功',
            message: '任务删除成功',
            type: 'success',
          });
          this.pager.page = 1;
          this.getTasks();
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async openUploadDialog(row) {
      try {
        this.filesLoading = true;
        this.uploadOrigin = _.cloneDeep(this.task.upload);
        this.task.id = row.id;
        this.task.name = row.name;
        this.showUploadDialog = true;
        await this.initUploadedFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.filesLoading = false;
      }
    },
    closeUploadDialog() {
      this.showUploadDialog = false;
      this.task.name = '';
      this.task.upload = this.uploadOrigin;
    },
    async onUploadChange(file, index) {
      const fileType = file.name
        .substring(file.name.lastIndexOf('.'))
        .toLowerCase();
      if (!this.task.upload.acceptTypes.split(',').includes(fileType)) {
        this.$message.error('检测到不支持的文件类型，请重新上传');
        return false;
      }

      const isChecked = checkUploadFileSize(file.size, UPLOAD_FILE_MAX_SIZE);
      if (!isChecked) {
        return;
      }

      const currentFile = this.task.upload.files[index];
      try {
        const formData = new FormData();
        formData.append('file', file.raw);
        formData.append('file_type', currentFile.file_type);
        if (currentFile.name !== '') {
          await deleteFile(this.task.id, currentFile.id);
        }
        const res = await uploadFile(
          this.task.id,
          formData,
          function onUploadProgress(event) {
            const percentage = Math.floor((event.loaded / event.total) * 100);
            currentFile.progress = percentage;
          },
        );
        currentFile.id = res.data[0].id;
        currentFile.name = res.data[0].name;
        this.initUploadedFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        currentFile.progress = 0;
      }
    },
    addUploadItem() {
      const lastUploadItem = this.task.upload.files.at(-1);
      if (lastUploadItem.name === '') {
        this.$alert(`请先上传 ${lastUploadItem.label}`, '提示');
        return;
      }
      const newIndex = lastUploadItem.index + 1;
      const newUploadItem = {
        label: `${FILE_TYPES[8]}${newIndex}`,
        file_type: FILE_TYPES[8],
        name: '',
        file: null,
        progress: 0,
        index: newIndex,
      };
      this.task.upload.files.push(newUploadItem);
    },
    async removeUploadedFile(file, index) {
      try {
        if (
          file.file_type === FILE_TYPES[8] &&
          file.index > 1 &&
          file.name === ''
        ) {
          this.task.upload.files.splice(index, 1);
          return;
        }

        const confirm = await this.$confirm(
          `确定要删除文档 ${file.label}？`,
          '提示',
        ).catch(() => {});

        if (confirm === 'confirm') {
          await deleteFile(this.task.id, file.id);

          this.$notify({
            title: '成功',
            message: '文档删除成功',
            type: 'success',
          });

          await this.initUploadedFiles();
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async initUploadedFiles() {
      try {
        this.filesLoading = true;
        const res = await fetchTaskFiles(this.task.id);
        this.task.upload.files.forEach((item) => {
          const currentFile = res.data.find(
            (file) => file.file_type === item.file_type,
          );
          item.name = '';
          if (currentFile) {
            item.id = currentFile.id;
            item.name = currentFile.name;
          }
        });

        if (!res.data.some((file) => file.file_type === FILE_TYPES[8])) {
          return;
        }

        _.remove(
          this.task.upload.files,
          (item) => item.file_type === FILE_TYPES[8],
        );
        res.data
          .filter((file) => file.file_type === FILE_TYPES[8])
          .forEach((item, index) => {
            const file = {
              ...item,
              label: `承诺函${index + 1}`,
              canAddItem: index === 0,
              index: index + 1,
            };
            this.task.upload.files.push(file);
          });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.filesLoading = false;
      }
    },
    gotoDetails(row) {
      const link = this.$router.resolve({
        name: 'taskDiff',
        params: { taskId: row.id },
      });
      window.open(link.href, '_blank');
    },
    async recompare(row) {
      try {
        const confirm = await this.$confirm(
          '确认重新进行一致性比对？',
          '提示',
        ).catch(() => {});
        if (confirm === 'confirm') {
          await redo(row.id);
          this.$notify({
            title: '成功',
            message: '发起重新比对成功',
            type: 'success',
          });
          await this.getTasks();
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleCurrentPageChange(page) {
      this.pager.page = page;
      this.getTasks();
    },
    handleSizeChange(size) {
      this.pager.page = 1;
      this.pager.size = size;
      this.getTasks();
    },
    getRowClassName({ row }) {
      const classList = [];
      if (this.checkRowCanExpand(row)) {
        classList.push('row-expand-available');
      }
      return classList;
    },
    getColumnStatusClass(statusText) {
      if (!statusText) {
        return '';
      }
      if (statusText.includes('成功')) {
        return 'success';
      }
      if (statusText.includes('失败')) {
        return 'failed';
      }
      return '';
    },
    checkRowCanExpand(row) {
      return row.status !== PROGRESS_STATUS_CODE.TO_BE_UPLOADED;
    },
    handleRowClicked(row) {
      if (this.checkRowCanExpand(row)) {
        this.$refs.tasksTable.toggleRowExpansion(row);
      }
    },
    async startDiff() {
      const isValid = await this.$refs['uploadForm'].validate().catch(() => {});
      if (isValid) {
        try {
          const confirm = await this.$confirm(
            '开始比对之后，此任务将不能上传新的文档，确定开始比对吗？',
            '提示',
          ).catch(() => {});

          if (confirm === 'confirm') {
            await diff(this.task.id);
            this.$notify({
              title: '成功',
              message: '开始比对成功',
              type: 'success',
            });
            this.closeUploadDialog();
            this.getTasks();
          }
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    showUploadBtn(row) {
      return (
        Number(row.source) === TASK_SOURCE_CODE.LOCAL &&
        Number(row.status) === PROGRESS_STATUS_CODE.TO_BE_UPLOADED
      );
    },
    compareBtnDisabled(row) {
      return Number(row.status) !== PROGRESS_STATUS_CODE.DIFF_DONE;
    },
    fileDiffBtnDisabled(row) {
      return FILE_STATUS_CODE.CMP_FINISH !== row.status;
    },
    getFileStatus(row) {
      return FILE_STATUS[row.status] || '';
    },
    gotoFileDiffPage(pid, id) {
      const link = this.$router.resolve({
        name: 'fileDiff',
        params: { taskId: pid, fileId: id },
      });
      window.open(link.href, '_blank');
    },
    async retryChapterDiff(row) {
      try {
        const confirm = await this.$confirm(
          '确认重新进行章节比对？',
          '提示',
        ).catch(() => {});

        if (confirm === 'confirm') {
          await redoChapter(row.id);
          this.$notify({
            title: '成功',
            message: '发起重新比对成功',
            type: 'success',
          });
          await this.getTasks();
        }
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
.tasks-container {
  height: calc(100% - 86px);
  overflow-y: auto;
  padding: 0 20px;
  .el-table {
    &.el-table--fit {
      border-right: 1px solid #eceff4;
    }
    ::v-deep .el-table__row {
      &.row-expand-available {
        cursor: pointer;
      }

      &:not(.row-expand-available) {
        .el-table__expand-icon {
          visibility: hidden;
        }
      }

      .el-table__cell {
        .cell {
          .file-status {
            font-style: italic;
          }
          .success {
            color: #049e26;
          }
          .failed {
            color: #b60000;
          }
        }
      }
    }
    ::v-deep .operations {
      .el-button {
        margin: 0 8px;
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
    .task-expanded-table {
      width: calc(100% - 60px);
      margin: 0 30px;
      ::v-deep th {
        background-color: #eceff4;
        .cell {
          font-size: 13px;
        }
      }
      ::v-deep td {
        .cell {
          font-size: 13px;
          .chapter-status {
            color: #333;
            &.failed {
              color: #b60000;
            }
            &.success {
              color: #049e26;
            }
          }
          :is(a) {
            color: $--color-primary;
            font-style: normal;
          }
          .btn-retry {
            font-size: 12px;
            text-decoration: underline;
          }
        }
      }
      ::v-deep .el-loading-mask {
        position: absolute;
      }
    }
  }
  .upload-dialog {
    background: rgba(0, 0, 0, 0.3);
    ::v-deep .el-dialog__body {
      .el-form {
        .el-form-item {
          &.task-name {
            width: 76%;
            font-weight: bold;
            .el-input__inner {
              font-weight: bold;
            }
          }
          .upload-item {
            display: flex;
            justify-content: space-between;
            .upload-action {
              display: flex;
              align-items: baseline;
              width: 230px;
              margin-left: 20px;
              .el-button {
                height: 28px;
                margin-left: 10px;
              }
            }
          }
          .el-input__inner {
            text-overflow: ellipsis;
            overflow: hidden;
            &[readonly] {
              border-color: #dcdfe6;
              background-color: #fcfcfc;
            }
          }
          &.is-error {
            .el-input__inner {
              border-color: #f56c6c;
            }
          }
          .el-progress {
            width: calc(100% - 165px);
          }
        }
      }
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
