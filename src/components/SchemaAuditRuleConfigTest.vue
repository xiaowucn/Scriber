<template>
  <div class="schema-audit-rule-config-test">
    <el-dialog
      v-bind="$attrs"
      title="测试"
      :close-on-click-modal="false"
      :before-close="close">
      <el-form
        ref="form"
        :model="testForm"
        label-width="150px"
        label-position="top">
        <el-form-item
          class="select-condition-item"
          label="选择条件:"
          v-if="testForm.rule_type === 'condition'">
          <el-select
            v-model="testForm.condition"
            @change="handleConditionChange">
            <el-option
              :label="`条件${index + 1}`"
              :value="index"
              v-for="(cond, index) in testForm.ruleContentList"
              :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则内容:">
          <el-input
            type="textarea"
            v-model="testForm.rule_content"
            disabled></el-input>
        </el-form-item>
        <el-form-item
          :label="`${$text.schema['Schema字段']}: ${field.name}`"
          v-for="(field, index) in testForm.fieldList"
          :key="index"
          :prop="`fieldList[${index}].value`"
          :rules="{
            required: testForm.rule_type !== 'empty',
            message: `${$text.schema['Schema字段']}值不能为空`,
            trigger: 'blur',
          }">
          <el-input type="textarea" v-model="field.value"></el-input>
        </el-form-item>
      </el-form>
      <div class="test-result-content">
        <span class="test-result-title">测试结果：</span>
        <span
          class="test-result-text"
          :class="testResult ? 'success' : 'fail'"
          >{{ testResultText }}</span
        >
      </div>
      <div class="test-result-reason" v-if="reason !== undefined">
        <span class="text">不合规原因：</span>
        <span class="content">{{ reason }}</span>
      </div>
      <div class="test-result-message" v-if="message !== undefined">
        <span class="text">修改意见：</span>
        <span class="content">{{ message }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleTest">测试</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'schema-audit-rule-config-test',

  props: {
    ruleId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      testForm: {},
      testResult: undefined,
      reason: undefined,
      message: undefined,
    };
  },

  mounted() {},

  computed: {
    testResultText({ testResult }) {
      if (testResult === undefined) {
        return '';
      }
      if (testResult === null) {
        return '不适用';
      }
      return testResult ? '合规' : '不合规';
    },
  },

  methods: {
    handleConditionChange(val) {
      this.testForm.rule_content = this.testForm.ruleContentList[val];
      this.testForm.fieldList = this.testForm.fieldListMap[val];
      this.testForm.fieldList.forEach((item) => {
        item.value = '';
      });
      this.testResult = undefined;
      this.reason = undefined;
      this.message = undefined;
    },
    resetFields() {
      this.$refs.form && this.$refs.form.resetFields();
    },
    setTestForm(data) {
      this.testForm = data;
    },
    async handleTest() {
      const validate = await this.$refs.form.validate().catch(() => {});
      if (!validate) {
        return;
      }

      const mapping = {};
      this.testForm.fieldList.forEach((item) => {
        Object.assign(mapping, {
          [item.name]: {
            value: item.value,
          },
        });
      });

      const { data } = await this.$store.dispatch(
        'schemaModule/validateAuditRule',
        {
          ruleId: this.ruleId,
          data: {
            mapping,
          },
        },
      );
      this.testResult = data.result;
      if (data.result === false) {
        this.reason = data.reason;
        this.message = data.message.replace(/[\n\r]+/g, '\n');
      } else {
        this.reason = undefined;
        this.message = undefined;
      }
    },
    close() {
      this.testResult = undefined;
      this.reason = undefined;
      this.message = undefined;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-audit-rule-config-test {
  ::v-deep .el-dialog {
    width: 460px;
    border-radius: 4px;

    .el-dialog__header {
      background: $--color-primary;
      height: 46px;
      line-height: 46px;
      padding: 0 0 0 15px;

      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__headerbtn {
        top: 16px;
        right: 16px;
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      padding: 20px 50px 0;
    }
    .dialog-footer {
      padding: 20px 30px;

      .el-button {
        width: 100%;
      }
    }
  }

  ::v-deep .el-form {
    .el-form-item {
      .el-form-item__label {
        line-height: 30px;
        padding: 0;
      }

      &.select-condition-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-form-item__label {
          flex: 1;
        }

        .el-form-item__content {
          line-height: 30px;

          .el-input__inner {
            width: 240px;
            height: 30px;
            line-height: 30px;
          }

          .el-input__suffix {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }

  .test-result-content {
    position: relative;

    .test-result-title {
      position: absolute;
    }

    .test-result-text {
      display: inline-flex;
      justify-content: center;
      width: 100%;

      &.success {
        color: #67c23a;
      }

      &.fail {
        color: #f56c6c;
      }
    }
  }
  .test-result-reason,
  .test-result-message {
    display: flex;
    margin-top: 5px;
    .text {
      white-space: nowrap;
    }
    .content {
      white-space: pre-line;
    }
  }
}
</style>
