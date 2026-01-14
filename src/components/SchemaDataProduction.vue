<template>
  <div class="schema-data-production">
    <el-table
      :data="taskList"
      :stripe="!$platform.isDefaultEnv()"
      row-key="id"
      class="has-border">
      <el-table-column label="任务类型" prop="task_name"></el-table-column>
      <el-table-column label="任务信息">
        <template slot-scope="scope">
          {{ scope.row.data ? '已设置' : '未设置' }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">
          <span :class="[scope.row.enable === 1 ? 'active' : '']">{{
            scope.row.enable === 1 ? '已启用' : '已停用'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="openEditDialog(scope.row.task_type)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableTask(scope.row)"
            :disabled="!scope.row.data">
            {{ scope.row.enable === 1 ? '停用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="editRequestDialogVisible"
      title="外部文件获取"
      width="600px"
      :close-on-click-modal="false">
      <el-form
        :model="requestForm"
        ref="requestForm"
        :rules="requestFormRules"
        label-width="150px"
        label-position="left"
        class="setting-form">
        <div class="setting-form-divider">文件获取</div>
        <el-form-item label="数据库版本" prop="db_driver">
          <el-radio-group v-model="requestForm.db_driver">
            <el-radio
              v-for="protocol in databaseTypeOptions"
              :key="protocol"
              :label="protocol"
              >{{ protocol }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="服务地址" prop="db_host">
          <el-input
            v-model="requestForm.db_host"
            size="small"
            placeholder="请输入服务地址"></el-input>
        </el-form-item>

        <el-form-item label="端口" prop="db_port">
          <el-input
            v-model="requestForm.db_port"
            size="small"
            placeholder="请输入端口"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="db_user">
          <el-input
            v-model="requestForm.db_user"
            size="small"
            placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="db_password">
          <el-input
            v-model="requestForm.db_password"
            size="small"
            placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="数据库名" prop="db_name">
          <el-input
            v-model="requestForm.db_name"
            size="small"
            placeholder="请输入数据库名"></el-input>
        </el-form-item>

        <el-form-item label="表名" prop="db_table">
          <el-input
            v-model="requestForm.db_table"
            size="small"
            placeholder="请输入表名"></el-input>
        </el-form-item>

        <el-form-item label="主键字段" prop="db_table_pk">
          <el-input
            v-model="requestForm.db_table_pk"
            size="small"
            placeholder="请输入主键字段"></el-input>
        </el-form-item>

        <el-form-item label="链接字段" prop="db_table_link">
          <el-input
            v-model="requestForm.db_table_link"
            size="small"
            placeholder="请输入链接字段"></el-input>
        </el-form-item>

        <el-form-item label="上传项目路径" prop="tree_id">
          <el-cascader
            v-model="requestForm.tree_id"
            size="small"
            placeholder="请选择上传项目路径"
            :props="cascaderProps"
            :options="projectDirectory"
            :change-on-select="true"
            @change="changeCascader"></el-cascader>
        </el-form-item>
        <el-form-item label="文件获取/更新频率" prop="sync_frequency">
          <el-radio-group
            v-model="requestForm.sync_frequency"
            class="request-update-frequency">
            <div>
              <el-radio label="daily">每日</el-radio>
              <el-time-picker
                v-model="requestForm.sync_time"
                size="small"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                :disabled="requestForm.sync_frequency !== 'daily'"
                placeholder="请选择"></el-time-picker>
            </div>

            <div>
              <el-radio label="weekly">每周</el-radio>

              <el-select
                v-model="requestForm.sync_weekday"
                size="small"
                :disabled="requestForm.sync_frequency !== 'weekly'"
                placeholder="请选择">
                <el-option
                  v-for="date in weekDateOptions"
                  :key="date.value"
                  :label="date.label"
                  :value="date.value"></el-option>
              </el-select>

              <el-time-picker
                v-model="requestForm.sync_time"
                size="small"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                :disabled="requestForm.sync_frequency !== 'weekly'"
                placeholder="请选择"></el-time-picker>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRequestSetting">取消</el-button>
        <el-button type="primary" @click="submitRequestSetting">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editResponseDialogVisible"
      title="抽取结果下传"
      width="600px"
      :close-on-click-modal="false">
      <el-form
        :model="responseForm"
        :rules="responseFormRules"
        ref="responseForm"
        label-width="140px"
        label-position="left"
        class="setting-form">
        <div class="setting-form-divider">抽取结果回传</div>

        <el-form-item label="数据库版本" prop="db_driver">
          <el-radio-group v-model="responseForm.db_driver">
            <el-radio
              v-for="database in databaseTypeOptions"
              :key="database"
              :label="database"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="服务地址" prop="db_host">
          <el-input
            v-model="responseForm.db_host"
            size="small"
            placeholder="请输入服务地址"></el-input>
        </el-form-item>

        <el-form-item label="端口" prop="db_port">
          <el-input
            v-model="responseForm.db_port"
            size="small"
            placeholder="请输入端口"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="db_user">
          <el-input
            v-model="responseForm.db_user"
            size="small"
            placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="db_password">
          <el-input
            v-model="responseForm.db_password"
            size="small"
            placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="数据库名" prop="db_name">
          <el-input
            v-model="responseForm.db_name"
            size="small"
            placeholder="请输入数据库名"></el-input>
        </el-form-item>

        <el-form-item label="同步频率" prop="sync_frequency">
          <el-radio-group
            v-model="responseForm.sync_frequency"
            class="request-update-frequency">
            <div>
              <el-radio label="daily">每日</el-radio>
              <el-time-picker
                v-model="responseForm.sync_time"
                size="small"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                :disabled="responseForm.sync_frequency !== 'daily'"
                placeholder="请选择"></el-time-picker>
            </div>

            <div>
              <el-radio label="weekly">每周</el-radio>

              <el-select
                v-model="responseForm.sync_weekday"
                size="small"
                :disabled="responseForm.sync_frequency !== 'weekly'"
                placeholder="请选择">
                <el-option
                  v-for="date in weekDateOptions"
                  :key="date.value"
                  :label="date.label"
                  :value="date.value"></el-option>
              </el-select>

              <el-time-picker
                v-model="responseForm.sync_time"
                size="small"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                :disabled="responseForm.sync_frequency !== 'weekly'"
                placeholder="请选择"></el-time-picker>
            </div>
          </el-radio-group>
        </el-form-item>

        <!-- <div class="setting-form-divider">数据库字段映射关系设置</div>
        <ul class="database-field-setting">
          <li v-for="(item, index) in databaseFieldData" :key="index">
            <span class="label">{{ item.label }}</span>
            <span class="status">{{
              responseForm.databaseFileds[item.label] ? '已设置' : '未设置'
            }}</span>
            <el-button
              @click="editDatabaseField(item)"
              circle
              icon="el-icon-edit"
              class="operation"
              size="mini"
            ></el-button>
          </li>
        </ul> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelResponseSetting">取消</el-button>
        <el-button type="primary" @click="submitResponseSetting"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="responseFieldFormDialogVisible" title="设置字段映射关系" width="400px">
      <el-form :model="responseFieldForm" label-width="200px" label-position="left" class="database-field-setting-form">
        <el-form-item v-for="(value, key) in responseFieldForm" :key="key" :label="key">
          <el-input
            v-model="responseFieldForm[key]"
            :placeholder="`请输入数据库${key === databaseTableEdited ? '表' : '字段'}`"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeResponseFieldFormDialog">取消</el-button>
        <el-button type="primary" size="small" @click="submitResponseFieldSetting">确认</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { detail as detailApi } from '@/store/api';

const weekData = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' },
];

const databaseTypeMockData = ['mysql', 'postgresql', 'oracle'];

export default {
  name: 'SchemaDataProduction',
  data() {
    return {
      taskList: [
        {
          task_type: 0,
          task_name: '外部文件获取',
        },
        {
          task_type: 1,
          task_name: '抽取结果下传',
        },
      ],
      taskForm: {
        name: '',
      },
      requestForm: {
        db_driver: '',
        db_host: '',
        db_port: '',
        db_user: '',
        db_password: '',
        db_name: '',
        db_table: '',
        db_table_pk: '',
        db_table_link: '',
        tree_id: [],
        sync_frequency: '',
        sync_weekday: '',
        sync_time: '',
      },
      responseForm: {
        db_driver: '',
        db_host: '',
        db_port: '',
        db_user: '',
        db_password: '',
        db_name: '',
        sync_frequency: '',
        sync_weekday: '',
        sync_time: '',
      },
      requestFormRules: {
        db_driver: [
          { required: true, message: '请选择数据库版本', trigger: 'change' },
        ],
        db_host: [
          { required: true, message: '请输入服务地址', trigger: 'blur' },
        ],
        db_port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        db_user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        db_password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        db_name: [
          { required: true, message: '请输入数据库名', trigger: 'blur' },
        ],
        db_table: [{ required: true, message: '请输入表名', trigger: 'blur' }],
        db_table_pk: [
          { required: true, message: '请输入主键字段', trigger: 'blur' },
        ],
        db_table_link: [
          { required: true, message: '请输入链接字段', trigger: 'blur' },
        ],
        tree_id: [
          { required: true, message: '请选择上传项目路径', trigger: 'change' },
        ],
        sync_frequency: [
          { required: true, message: '请选择文件更新频率', trigger: 'change' },
        ],
      },
      responseFormRules: {
        db_driver: [
          { required: true, message: '请选择数据库版本', trigger: 'change' },
        ],
        db_host: [
          { required: true, message: '请输入服务地址', trigger: 'blur' },
        ],
        db_port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        db_user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        db_password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        db_name: [
          { required: true, message: '请输入数据库名', trigger: 'blur' },
        ],
        sync_frequency: [
          { required: true, message: '请选择同步频率', trigger: 'change' },
        ],
      },
      cascaderProps: {
        label: 'name',
        value: 'tree_id',
        children: 'trees',
      },
      projectDirectory: [],
      responseFieldForm: {},
      databaseTableEdited: '',
      taskEdited: '',
      taskFormEdited: '',
      editRequestDialogVisible: false,
      editResponseDialogVisible: false,
      createTaskDialogVisible: false,
      responseFieldFormDialogVisible: false,
      protocolOptions: ['FTP', 'NAS'],
      weekDateOptions: weekData,
      databaseTypeOptions: databaseTypeMockData,
    };
  },

  computed: {
    ...mapGetters('schemaModule', ['tree']),
    ...mapGetters('projectModule', ['projects']),
    databaseFieldData() {
      if (this.tree && this.tree.data) {
        const fieldList = [];

        [].concat(this.tree.data).forEach(function getField(item) {
          if (item.children && item.children.length > 0) {
            fieldList.push({ fields: [], label: item.data.label });
            const lastIndex = fieldList.length - 1;

            item.children.forEach((child) => {
              if (child.children.length === 0) {
                fieldList[lastIndex].fields.push({ label: child.data.label });
              } else {
                getField(child);
              }
            });
          }
        });

        return fieldList;
      } else {
        return [];
      }
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.fetchExternalFileConfig();
      this.fetchAnswerDBConfig();
    },
    async fetchExternalFileConfig() {
      const res = await this.fetchDatabaseConfig('sync_external_file');
      if (res.data) {
        const taskData = Object.assign(this.taskList[0], res.data);
        if (!Array.isArray(taskData.data.tree_id)) {
          taskData.data.tree_id = [res.data.data.tree_id];
        }
        this.$set(this.taskList, 0, taskData);
        this.requestForm = res.data.data;
      }
    },
    async fetchAnswerDBConfig() {
      const res = await this.fetchDatabaseConfig('answer_sync_db');
      if (res.data) {
        const taskData = Object.assign(this.taskList[1], res.data);
        this.$set(this.taskList, 1, taskData);
        this.responseForm = res.data.data;
      }
    },
    async fetchDatabaseConfig(key) {
      try {
        const res = await this.$store.dispatch(
          'schemaModule/fetchDatabaseConfig',
          {
            key,
            schemaId: this.$route.params.schemaId,
          },
        );
        return res;
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    async saveDatabaseConfig(key, data) {
      try {
        await this.$store.dispatch('schemaModule/saveDatabaseConfig', {
          key,
          schemaId: this.$route.params.schemaId,
          data,
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    async enableDatabaseConfig(key, enable) {
      try {
        await this.$store.dispatch('schemaModule/enableDatabaseConfig', {
          key,
          schemaId: this.$route.params.schemaId,
          enable,
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    async fetchProjects() {
      await this.$store.dispatch('projectModule/fetchProjects');
      this.projectDirectory = this.projects.items.map((item) => {
        return {
          name: item.name,
          tree_id: item.rtree_id,
          trees: [],
        };
      });
    },
    async submitRequestSetting() {
      const isValid = await this.$refs['requestForm'].validate();
      if (isValid) {
        const data = Object.assign(this.requestForm, {
          schema_id: Number(this.$route.params.schemaId),
        });
        await this.saveDatabaseConfig('sync_external_file', data);
        this.fetchExternalFileConfig();
        this.editRequestDialogVisible = false;
      }
    },
    async submitResponseSetting() {
      const isValid = await this.$refs['responseForm'].validate();
      if (isValid) {
        const data = Object.assign(this.responseForm, {
          schema_id: Number(this.$route.params.schemaId),
        });
        await this.saveDatabaseConfig('answer_sync_db', data);
        this.fetchAnswerDBConfig();
        this.editResponseDialogVisible = false;
      }
    },
    cancelRequestSetting() {
      this.editRequestDialogVisible = false;
    },
    cancelResponseSetting() {
      this.editResponseDialogVisible = false;
    },
    submitResponseFieldSetting() {
      this.responseForm.databaseFileds[this.databaseTableEdited] =
        this.responseFieldForm;

      this.closeResponseFieldFormDialog();
    },
    async changeCascader(val) {
      const findTreeItem = (trees, id) => {
        for (let i = 0; i < trees.length; i++) {
          if (trees[i].tree_id === id) {
            return trees[i];
          } else if (trees[i].trees && trees[i].trees.length > 0) {
            return findTreeItem(trees[i].trees, id);
          }
        }
      };
      const res = await detailApi.fetchFileList(_.last(val));
      const trees = res.data.trees.map((item) => {
        return {
          name: item.name,
          tree_id: item.id,
          trees: item.trees || [],
        };
      });
      const currentProject = this.projectDirectory.find(
        (item) => item.tree_id === val[0],
      );
      if (val.length === 1) {
        currentProject.trees = trees;
      } else {
        const treeItem = findTreeItem(currentProject.trees, _.last(val));
        if (treeItem) {
          treeItem.trees = trees;
        }
      }
    },
    // editDatabaseField(item) {
    //   let fieldForm = {};

    //   if (this.responseForm.databaseFileds[item.label]) {
    //     fieldForm = this.responseForm.databaseFileds[item.label];
    //   } else {
    //     fieldForm[item.label] = '';

    //     item.fields.forEach(item => {
    //       fieldForm[item.label] = '';
    //     });
    //   }

    //   this.databaseTableEdited = item.label;
    //   this.responseFieldForm = fieldForm;
    //   this.responseFieldFormDialogVisible = true;
    // },
    openEditDialog(type) {
      if (type === 0) {
        this.fetchProjects();
        this.editRequestDialogVisible = true;
      } else {
        this.editResponseDialogVisible = true;
      }
    },
    async enableTask(item) {
      let typeText = item.enable === 0 ? '启用' : '停用';
      const confirm = await this.$confirm(
        `确定${typeText}该任务?`,
        `${typeText}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).catch(() => {});
      if (confirm === 'confirm') {
        const enable = item.enable === 1 ? 0 : 1;
        await this.enableDatabaseConfig(item.name, enable);
        if (item.task_type === 0) {
          this.fetchExternalFileConfig();
        } else {
          this.fetchAnswerDBConfig();
        }
      }
    },
    resetRequestForm() {
      this.requestForm = {
        db_protocol: '',
        db_host: '',
        db_port: '',
        db_user: '',
        db_password: '',
        tree_id: [],
        sync_frequency: '',
        sync_weekday: '',
        sync_time: '',
      };
    },
    resetResponseForm() {
      this.responseForm = {
        db_protocol: '',
        db_host: '',
        db_port: '',
        db_user: '',
        db_password: '',
        db_name: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table__expand-column .el-table__expand-icon {
  display: none;
}
::v-deep .el-table {
  .cell {
    > span {
      &.active {
        color: #43a0ff;
      }
    }
  }
}
.setting-form {
  display: flex;
  flex-flow: column;
  justify-content: center;

  .el-form-item {
    margin-left: 24px;
    .el-cascader {
      width: 100%;
    }
  }

  .el-select {
    width: 100%;
  }
}

.setting-form-divider {
  margin: 16px 0;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  font-weight: bold;
}

.request-update-frequency {
  > div {
    display: flex;
    align-items: center;

    &:first-of-type {
      margin-bottom: 16px;
    }

    .el-input,
    .el-select {
      width: 120px;
      margin-right: 16px;
    }
  }
}

.database-field-setting {
  margin-bottom: 16px;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    padding: 5px 20px;

    &:hover {
      background-color: #eee;
    }
  }

  .label {
    flex: 1;
  }

  .status {
    width: 100px;
  }
}

.database-field-setting-form {
  > div {
    &:first-of-type {
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;

      ::v-deep label {
        font-weight: bold;
      }
    }
  }
}
</style>
