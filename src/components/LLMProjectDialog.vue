<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    width="600px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="handleClose">
    <div
      class="universal-dialog-content"
      v-loading="dialogLoading"
      element-loading-text="正在加载数据..."
      element-loading-spinner="el-icon-loading">
      <el-form
        :model="form"
        :rules="formRules"
        ref="form"
        label-width="100px"
        size="small">
        <!-- 名称字段（第一行） -->
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="form.name"
            ref="nameInput"
            placeholder="请输入项目名称">
          </el-input>
        </el-form-item>

        <!-- 通用字段：处理方式 -->
        <el-form-item label="处理方式" prop="process_methods">
          <el-checkbox-group
            v-model="form.process_methods"
            @change="handleProcessMethodChange">
            <el-checkbox label="extract">要素提取</el-checkbox>
            <el-checkbox label="intelligent">智能审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 通用字段：审核方式 -->
        <el-form-item prop="audit_methods">
          <span slot="label">
            <el-tooltip
              content="如要审核，至少选择一种审核方式"
              placement="left">
              <i
                class="el-icon-question"
                style="margin-right: 4px; color: #909399"></i>
            </el-tooltip>
            审核方式
          </span>
          <el-checkbox-group
            v-model="form.audit_methods"
            :disabled="isAuditMethodsDisabled"
            @change="handleAuditMethodChange">
            <el-checkbox label="rule" :disabled="isRuleAuditDisabled"
              >规则审核</el-checkbox
            >
            <el-checkbox label="judge">大模型审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 通用字段：Schema -->
        <el-form-item prop="molds" label="Schema">
          <el-select
            v-model="form.molds"
            multiple
            filterable
            placeholder="请选择Schema"
            style="width: 100%">
            <el-option
              v-for="(item, index) in schemas.items"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 通用字段：应用场景 -->
        <el-form-item prop="scenario_id" label="应用场景">
          <el-select
            v-model="form.scenario_id"
            placeholder="请选择应用场景"
            style="width: 100%"
            :disabled="isScenarioDisabled"
            clearable
            filterable
            :loading="scenariosLoading">
            <el-option
              v-for="(item, index) in scenarioOptions"
              :key="index"
              :label="getSelectOptionLabel(item)"
              :value="item.id">
            </el-option>
          </el-select>
          <div class="scenario-tips">
            提示：选择一个应用场景，项目内传入的合同都会自动绑定该场景
          </div>
        </el-form-item>

        <!-- 项目权限字段（仅项目模式显示，在最底部） -->
        <el-form-item v-if="mode === 'project'" label="项目权限">
          <el-radio-group v-model="form.projectPermission">
            <el-radio :label="0">私密</el-radio>
            <el-radio :label="1">公共</el-radio>
          </el-radio-group>
          <div class="permission-tips">
            提示：设为公共后，将不支持更改为私密项目
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleConfirm"
        :loading="submitting">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import fileFormMixin from '@/mixins/fileFormMixin';
import { getLlmParams } from '@/utils/llmParamsUtils';
import { saveProject, updateProject } from '@/store/api/project.api';

export default {
  name: 'LLMProjectDialog',
  mixins: [fileFormMixin],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      required: true,
      validator: (value) => ['project'].includes(value),
    },
    operation: {
      type: String,
      required: true,
      validator: (value) => ['create', 'edit'].includes(value),
    },
    initialData: {
      type: Object,
      default: () => ({}),
    },
    dialogLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        process_methods: [],
        audit_methods: [],
        scenario_id: '',
        molds: [],
        name: '',
        projectPermission: 1, // 0:私密 1:公共
      },
      submitting: false,
    };
  },

  computed: {
    dialogTitle() {
      const operationText = this.operation === 'create' ? '新建' : '修改';
      return `${operationText}项目`;
    },

    formRules() {
      return {
        // 项目名称验证
        name: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur',
          },
        ],
        // 使用 mixin 中的可选校验规则
        ...this.optionalFormRules,
      };
    },

    scenariosLoading() {
      return this.$store.getters['scenariosModule/isLoading'];
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.initForm();
        this.$nextTick(() => {
          if (this.$refs.nameInput) {
            this.$refs.nameInput.focus();
          }
        });
      }
    },
  },

  methods: {
    initForm() {
      // 重置表单数据
      this.resetBaseForm();
      this.form.name = '';
      this.form.projectPermission = 1;
      this.submitting = false;

      // 如果是编辑模式，填充初始数据
      if (this.operation === 'edit' && this.initialData) {
        this.form = { ...this.initialData };
      }

      // 清除表单验证状态，但不重置字段值
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

    async handleConfirm() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (valid) {
        this.submitting = true;

        // 获取任务参数
        const submitData = getLlmParams(
          {
            name: this.form.name.trim(),
            molds: this.form.molds,
            isPublic: this.form.projectPermission,
          },
          {
            process_methods: this.form.process_methods,
            audit_methods: this.form.audit_methods,
            scenario_id: this.form.scenario_id,
          },
        );
        const params = {
          default_task_type: submitData.task_type || null,
          default_scenario_id: submitData.scenario_id || null,
          default_molds: submitData.molds,
          name: submitData.name,
        };

        if (this.operation === 'create') {
          params.is_public = submitData.isPublic;
        } else {
          params.permission = submitData.isPublic ? 'public' : 'private';
        }

        try {
          if (this.operation === 'create') {
            await saveProject(params);
          } else {
            await updateProject(this.initialData.id, params);
          }
          this.$notify({
            title: '成功',
            message: `${this.operation === 'create' ? '新增' : '修改'}项目成功`,
            type: 'success',
          });
          this.$emit('success');
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.submitting = false;
        }
      }
    },

    handleClose() {
      this.$emit('close');
      this.resetForm();
    },

    resetForm() {
      this.resetBaseForm();
      this.form.name = '';
      this.form.projectPermission = 1;
      this.submitting = false;

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });
    },

    closeLoading() {
      this.submitting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.universal-dialog-content {
  position: relative;
  min-height: 200px;

  .el-form {
    margin-bottom: 20px;
  }
  .scenario-tips,
  .permission-tips {
    color: #8f8f8f;
    font-size: 12px;
    line-height: 20px !important;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
