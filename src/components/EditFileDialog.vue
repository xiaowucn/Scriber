<template>
  <el-dialog
    :title="dialogTitle"
    :visible="true"
    width="600px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="handleClose">
    <div class="edit-dialog-content">
      <el-form
        :model="form"
        :rules="formRules"
        ref="form"
        label-width="100px"
        size="small">
        <el-form-item :label="nameLabel" prop="filename">
          <el-input
            v-model="form.filename"
            :placeholder="namePlaceholder"
            style="width: 100%">
          </el-input>
        </el-form-item>

        <el-form-item label="处理方式" prop="process_methods">
          <el-checkbox-group
            v-model="form.process_methods"
            :disabled="isProcessMethodsDisabled"
            @change="handleProcessMethodChange">
            <el-checkbox label="extract">要素提取</el-checkbox>
            <el-checkbox label="intelligent">智能审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

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

        <el-form-item prop="molds" label="Schema">
          <el-select
            v-model="form.molds"
            multiple
            filterable
            placeholder="请选择Schema"
            style="width: 100%"
            :disabled="isSchemaConfigDisabled">
            <el-option
              v-for="(label, index) in schemas.items"
              :key="index"
              :disabled="label.disabled"
              :label="getSelectOptionLabel(label)"
              :value="label.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="scenario_id">
          <span slot="label">
            <el-tooltip placement="left">
              <div slot="content">
                选择大模型审核后，必须选择<br />
                应用场景，大模型审核规则可<br />
                使用与应用场景有关的审核点<br />
                来审核合同
              </div>
              <i
                class="el-icon-question"
                style="margin-right: 4px; color: #909399"></i>
            </el-tooltip>
            应用场景
          </span>
          <el-select
            v-model="form.scenario_id"
            placeholder="请选择一个应用场景"
            style="width: 100%"
            filterable
            :disabled="isScenarioConfigDisabled">
            <el-option
              v-for="item in scenarioOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <div class="scenario-tips" v-if="isDir">
            提示：选择一个应用场景，文件夹内传入的合同都会自动绑定该场景
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

export default {
  name: 'EditFileDialog',
  mixins: [fileFormMixin],

  props: {
    fileData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: {
        filename: '',
        process_methods: [],
        audit_methods: [],
        scenario_id: '',
        molds: [],
      },
      submitting: false,
    };
  },

  computed: {
    isDir() {
      return this.fileData.isDir || false;
    },
    dialogTitle() {
      const isCreate = !this.fileData.filename || this.fileData.filename === '';
      if (this.isDir) {
        return isCreate ? '新建文件夹' : '修改文件夹';
      } else {
        return '修改文件';
      }
    },
    nameLabel() {
      return this.isDir ? '文件夹名称' : '文件名称';
    },
    namePlaceholder() {
      return this.isDir ? '请输入文件夹名称' : '请输入文件名称';
    },

    formRules() {
      const rules = {
        filename: [
          {
            required: true,
            message: this.isDir ? '请输入文件夹名称' : '请输入文件名称',
            trigger: 'blur',
          },
        ],
      };

      if (this.isDir) {
        // 文件夹操作：使用可选校验规则
        Object.assign(rules, this.optionalFormRules);
      } else {
        // 文件操作：使用完整校验规则
        Object.assign(rules, this.baseFormRules);
      }

      return rules;
    },
  },

  created() {
    this.initFormData();
  },

  methods: {
    initFormData() {
      // 从传入的文件数据中回填表单
      this.form = {
        filename: this.fileData.filename || '',
        process_methods: this.fileData.process_methods || [],
        audit_methods: this.fileData.audit_methods || [],
        scenario_id: this.fileData.scenario_id || '',
        molds: this.fileData.molds || [],
      };

      // 数据回填后清除验证状态，确保验证规则正确应用
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true;

          const params = this.getParams();
          const editData = {
            ...params,
            filename: this.form.filename,
            folderName: this.form.filename,
          };

          this.$emit('confirm', editData);
        } else {
          return false;
        }
      });
    },

    handleClose() {
      this.$emit('close');
      this.resetForm();
    },

    resetForm() {
      this.form = {
        filename: '',
        process_methods: [],
        audit_methods: [],
        scenario_id: '',
        molds: [],
      };
      this.submitting = false;

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });
    },
    closeSubmitting() {
      this.submitting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-dialog-content {
  .el-form {
    margin-bottom: 20px;
  }
  .scenario-tips {
    color: #8f8f8f;
    font-size: 12px;
    line-height: 20px !important;
  }
  .status-warning {
    background-color: #fdf6ec;
    border: 1px solid #faecd8;
    border-radius: 4px;
    padding: 12px 16px;
    margin-bottom: 20px;
    color: #e6a23c;
    font-size: 14px;
    display: flex;
    align-items: center;

    .el-icon-warning {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
</style>
