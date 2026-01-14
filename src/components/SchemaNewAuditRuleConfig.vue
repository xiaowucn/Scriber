<template>
  <div class="schema-new-audit-rule-config">
    <el-dialog
      :visible="true"
      ref="ruleDialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :before-close="close">
      <el-tabs
        v-model="editableTabsValue"
        tab-position="left"
        type="card"
        :class="{
          'hidden-add-btn': ruleList.length >= 5,
          'preview-style': isPreview || isCopy || !isNewRule,
        }"
        :editable="isNewRule"
        :before-leave="beforeTabChange"
        @tab-click="handelTabClick"
        @edit="handleTabsEdit">
        <el-tab-pane
          v-for="(item, index) in ruleList"
          :key="index"
          :label="`规则` + (index + 1)"
          :name="String(index)">
          <schema-new-audit-rule-config-form
            ref="ruleConfigForm"
            :defaultRuleForm.sync="ruleList[index]"
            :schemaList="schemaList"
            :schemaFieldList="schemaFieldList"
            :isPreview="isPreview"
            :is-copy="isCopy"
            @select-schema="
              (schemaId) => selectSchema(schemaId, index)
            "></schema-new-audit-rule-config-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" v-if="!isPreview">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button
          v-if="!isReview"
          type="primary"
          @click="ok"
          class="ok-button"
          :disabled="reviewButtonDisabled">
          {{ okButtonText }}
        </el-button>
        <div v-else>
          <template v-if="reviewStatus === RULE_REVIEW_STATUS.NOT_REVIEWED">
            <el-button
              type="primary"
              @click="review(RULE_REVIEW_STATUS.PASS)"
              class="ok-button">
              {{ $t(`message['复核通过']`) }}
            </el-button>
            <el-button
              type="danger"
              @click="review(RULE_REVIEW_STATUS.NOT_PASS)"
              class="ok-button">
              {{ $t(`message['复核不通过']`) }}
            </el-button>
          </template>
          <template
            v-if="
              [
                RULE_REVIEW_STATUS.DEL_NOT_REVIEWED,
                RULE_REVIEW_STATUS.DEL_NOT_PASS,
              ].includes(reviewStatus)
            ">
            <el-button type="primary" @click="deleteRule" class="ok-button">
              {{ $t(`message['复核通过，直接删除']`) }}
            </el-button>
            <el-button
              type="danger"
              @click="review(RULE_REVIEW_STATUS.DEL_NOT_REVIEWED)"
              class="ok-button">
              {{ $t(`message['复核不通过']`) }}
            </el-button>
          </template>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-if="showReasonDialog"
      :visible="true"
      title="不通过原因"
      width="400px"
      class="reason-dialog"
      :close-on-click-modal="false"
      @close="showReasonDialog = false">
      <el-form ref="reasonForm" :model="reasonForm" :rules="reasonRules">
        <el-form-item label="" prop="reason">
          <el-input
            v-model="reasonForm.reason"
            type="textarea"
            :rows="5"
            placeholder="请输入不通过原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showReasonDialog = false"> 取消 </el-button>
        <el-button type="primary" @click="submitReason"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { RULE_REVIEW_STATUS } from '@/store/constants';
import _ from 'lodash';
import SchemaNewAuditRuleConfigForm from './SchemaNewAuditRuleConfigForm';
const ruleForm = {
  name: '',
  associationCheck: [],
  complianceCheckList: ['is_compliance_tip', 'is_noncompliance_tip'],
  tip_content: '',
  origin_content: '',
  rule_type: 'expr',
  formula: [],
  schemaId: '',
  schemaField: '',
  keywords: '',
  regex: '',
  unique: true,
  reason: '',
  conditions: [
    {
      expr_if: {
        expr: [],
      },
      expr_then: {
        expr: [],
      },
      unique_if: true,
      unique_then: true,
      reason: '',
      message: '',
      isShowAddOpinionBtn: true,
      isShowAddReasonBtn: true,
    },
  ],
  message: '', //修改意见
};
export default {
  name: 'schema-new-audit-rule-config',
  components: { SchemaNewAuditRuleConfigForm },
  props: {
    schemaList: {
      type: Array,
      required: true,
    },
    schemaId: {
      type: Number,
      required: false,
    },
    isNewRule: {
      type: Boolean,
      default: true,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isReview: {
      type: Boolean,
      default: false,
    },
    isCopy: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      RULE_REVIEW_STATUS,
      ruleList: [_.cloneDeep(ruleForm)],
      ruleListOriginal: [_.cloneDeep(ruleForm)],
      schemaListMap: {},
      schemaFieldList: [],
      editableTabsValue: '0',
      isDeleteing: false,
      showReasonDialog: false,
      reasonForm: {
        reason: '',
      },
      reasonRules: {
        reason: [
          { required: true, message: '请输入不通过原因', trigger: 'blur' },
        ],
      },
    };
  },

  computed: {
    editableTabsIndex() {
      return Number(this.editableTabsValue);
    },
    dialogTitle() {
      if (this.isPreview) {
        return '规则查看';
      } else if (this.isNewRule) {
        return '新建规则';
      } else if (this.isReview) {
        return '规则复核';
      } else if (this.isCopy) {
        return '新建规则';
      } else {
        return '规则修改';
      }
    },
    okButtonText() {
      if (this.isPreview) {
        return this.$t(`message['确定']`);
      } else if (this.$features.supportRuleReview()) {
        return this.$t(`message['提交复核']`);
      }

      return this.$t(`message['提交']`);
    },
    ruleId() {
      return this.ruleList[0].id;
    },
    reviewStatus() {
      return this.ruleList[0].review_status;
    },
    reviewButtonDisabled() {
      return !this.isPreview && _.isEqual(this.ruleList, this.ruleListOriginal);
    },
  },

  async created() {
    this.init();
  },

  methods: {
    init() {
      this.getSchemaFieldList(this.schemaId);
    },
    async getSchemaFieldList(schemaId) {
      if (!schemaId) {
        return;
      }
      try {
        const { data } = await this.$store.dispatch(
          'schemaModule/fetchSchemaFieldList',
          schemaId,
        );
        const schemaFieldList = Object.keys(data).map((item) => {
          return Object.assign(data[item], { name: item });
        });
        this.schemaListMap[schemaId] = schemaFieldList;
        this.setSchemaFieldList(schemaId);
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    setSchemaFieldList(schemaId) {
      this.schemaFieldList = this.schemaListMap[schemaId];
    },
    selectSchema(schemaId, index) {
      this.ruleList[index].schemaField = '';
      this.getSchemaFieldList(schemaId);
    },
    async handleTabsEdit(targetName, action) {
      this.scrollTop = this.$refs.ruleDialog.$el.scrollTop;
      if (action === 'add') {
        const isCurrentFormValid = await this.validate(this.editableTabsIndex);
        if (!isCurrentFormValid) {
          return;
        }

        const preRule = this.ruleList[this.ruleList.length - 1];
        const { name, tip_content, origin_content } = preRule;
        this.ruleList.push({
          ..._.cloneDeep(ruleForm),
          name,
          tip_content,
          origin_content,
        });
        this.editableTabsValue = String(this.ruleList.length - 1);
      } else {
        if (Number(this.editableTabsValue) >= Number(targetName)) {
          this.editableTabsValue = String(Number(this.editableTabsValue) - 1);
          this.isDeleteing = true;
        }

        this.ruleList.splice(targetName, 1);
        await this.$nextTick();
        const rule = this.ruleList[this.editableTabsValue];
        if (rule.message) {
          this.showOpinion(this.editableTabsIndex);
        }
        if (rule.reason) {
          this.showReason(this.editableTabsIndex);
        }
      }
      await this.$nextTick();
      this.$refs.ruleDialog.$el.scrollTo(0, this.scrollTop);
    },
    async handelTabClick(tab) {
      await this.$nextTick();

      let tabIndex = tab.index;
      const rule = this.ruleList[tabIndex];
      this.setSchemaFieldList(rule.schemaId);
      if (rule.message) {
        this.showOpinion(tabIndex);
      }
      if (rule.reason) {
        this.showReason(tabIndex);
      }
    },
    async beforeTabChange() {
      // 删除tab时不校验当前tab表单
      if (this.isDeleteing) {
        this.isDeleteing = false;
        return true;
      }

      const isCurrentFormValid = await this.validate(this.editableTabsIndex);
      return isCurrentFormValid;
    },
    async validate(index) {
      const form = this.$refs.ruleConfigForm[index];
      if (form) {
        const formValid = await form.validate();
        if (!formValid.status) {
          if (formValid.message) {
            this.$notify({
              title: this.$t(`message['提示']`),
              message: formValid.message,
              type: 'error',
            });
          }
          return false;
        }
      }

      let isValid = true;
      for (let i = 0; i < this.ruleList.length; i++) {
        const formValid = await this.$refs.ruleConfigForm[i].validate();
        if (!formValid.status) {
          isValid = false;
          this.editableTabsValue = String(i);

          if (formValid.message) {
            this.$notify({
              title: this.$t(`message['提示']`),
              message: formValid.message,
              type: 'error',
            });
          }
          break;
        }
      }
      return isValid;
    },

    async setRuleList(ruleList) {
      this.editableTabsValue = '0';
      this.ruleList = ruleList;
      this.ruleListOriginal = _.cloneDeep(ruleList);

      await this.$nextTick();
      this.$refs.ruleConfigForm.forEach((form) => form.reset());
    },

    showOpinion(index) {
      this.$refs.ruleConfigForm[index].showOpinion();
    },
    showReason(index) {
      this.$refs.ruleConfigForm[index].showIncorrectReasonInput();
    },

    async ok() {
      if (this.isPreview) {
        this.$emit('close');
        return;
      }

      const isFormValid = await this.validate();
      if (!isFormValid) {
        return;
      }

      const ruleList = [];
      for (let index = 0; index < this.ruleList.length; index++) {
        const ruleForm = this.ruleList[index];
        let params = {
          name: ruleForm.name,
          validate_company_info: ruleForm.associationCheck.includes(
            'validate_company_info',
          ),
          validate_bond_info:
            ruleForm.associationCheck.includes('validate_bond_info'),
          tip_content: ruleForm.tip_content,
          is_compliance_tip:
            ruleForm.complianceCheckList.includes('is_compliance_tip'),
          is_noncompliance_tip: ruleForm.complianceCheckList.includes(
            'is_noncompliance_tip',
          ),
          origin_content: ruleForm.origin_content,
          rule_type: ruleForm.rule_type,
          detail: this.getFormulaDetail(ruleForm),
          schema_id: ruleForm.schemaId,
        };
        ruleList.push(params);
      }
      try {
        const operationMode = this.isNewRule ? '新建' : '修改';
        if (this.isNewRule) {
          await this.$store.dispatch('schemaModule/createAuditRule', {
            data: {
              rules: ruleList,
            },
          });
        } else {
          await this.$store.dispatch('schemaModule/updateAuditRule', {
            data: ruleList[0],
            ruleId: this.ruleId,
          });
        }
        this.$notify({
          title: '成功',
          message: `${operationMode}规则成功`,
          type: 'success',
        });
      } catch (error) {
        let message = '';
        if (this.isNewRule && !_.isEmpty(error.errors)) {
          Object.keys(error.errors).forEach((item) => {
            message += `规则${+item + 1}: ${error.errors[item].message}\n`;
          });
        } else {
          message = error.message;
        }

        this.$notify({
          title: this.$t(`message['提示']`),
          customClass: 'audit-rule-error-class',
          message: message,
          type: 'error',
        });
        return;
      }

      this.$emit('close');
    },
    getFormulaDetail(ruleForm) {
      const { rule_type } = ruleForm;
      if (rule_type === 'expr') {
        const expr = this.getExpr(ruleForm.formula);
        return {
          expr,
          message: ruleForm.message,
          unique: ruleForm.unique,
          reason: ruleForm.reason,
        };
      } else if (rule_type === 'empty') {
        const field = this.schemaFieldList.find((item) => {
          return item.name === ruleForm.schemaField;
        });
        return {
          field,
          message: ruleForm.message,
          reason: ruleForm.reason,
        };
      } else if (rule_type === 'regex') {
        const field = this.schemaFieldList.find((item) => {
          return item.name === ruleForm.schemaField;
        });
        return {
          field,
          regex: ruleForm.regex,
          message: ruleForm.message,
          reason: ruleForm.reason,
        };
      } else if (rule_type === 'condition') {
        const conditions = [];
        ruleForm.conditions.forEach((condition) => {
          const cond = {
            expr_if: {
              expr: this.getExpr(condition.expr_if.expr),
              unique: condition.unique_if,
            },
            expr_then: {
              expr: this.getExpr(condition.expr_then.expr),
              unique: condition.unique_then,
            },
            message: condition.message,
            reason: condition.reason,
          };
          conditions.push(cond);
        });
        return {
          conditions,
        };
      }
    },
    getExpr(formula) {
      const expr = [];
      formula.forEach((item) => {
        if (item.type === 'column') {
          expr.push({
            name: item.value,
            type: 'text',
          });
        } else if (item.type === 'operator') {
          expr.push(item.value);
        } else if (item.type === 'keywords') {
          expr.push({
            value: item.value,
          });
        }
      });
      return expr;
    },
    close() {
      this.$emit('close');
    },
    async review(status) {
      if (status === RULE_REVIEW_STATUS.NOT_PASS) {
        this.showReasonDialog = true;
      } else if (status === RULE_REVIEW_STATUS.PASS) {
        const data = {
          review_status: RULE_REVIEW_STATUS.PASS,
        };
        this.reviewRule(data);
      } else if (status === RULE_REVIEW_STATUS.DEL_NOT_REVIEWED) {
        await this.updateReviewStatus(RULE_REVIEW_STATUS.DEL_NOT_PASS);
        this.close();
      }
    },
    async reviewRule(data) {
      try {
        await this.$store.dispatch('schemaModule/reviewAuditRule', {
          ruleId: this.ruleId,
          data,
        });
        this.$notify({
          title: '成功',
          message: '复核成功',
          type: 'success',
        });
        this.showReasonDialog = false;
        this.close();
        this.$store.dispatch('schemaModule/fetchAuditRuleList');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteRule() {
      try {
        await this.$store.dispatch('schemaModule/deleteAuditRule', {
          ruleId: this.ruleId,
        });
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
        });
        this.close();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async updateReviewStatus(reviewStatus) {
      try {
        await this.$store.dispatch('schemaModule/updateRuleReviewStatus', {
          ruleId: this.ruleId,
          data: {
            review_status: reviewStatus,
          },
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async submitReason() {
      const isValid = await this.$refs.reasonForm.validate();
      if (isValid) {
        const data = {
          review_status: RULE_REVIEW_STATUS.NOT_PASS,
          not_pass_reason: this.reasonForm.reason,
        };
        this.reviewRule(data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-new-audit-rule-config {
  ::v-deep .el-dialog {
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
      padding: 20px 20px 0 0;
    }
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      padding-top: 15px;

      .el-button {
        min-width: 150px;
        margin: 0 10px;
      }
      .ok-button {
        margin-left: auto;
      }
    }
  }
  ::v-deep .reason-dialog {
    .el-dialog__body {
      padding: 20px 20px 0;
    }
    .el-dialog__footer {
      > div {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  ::v-deep .el-tabs {
    &.preview-style {
      .el-tabs__header {
        visibility: hidden;
      }
    }
    .el-tabs__header {
      display: flex;
      flex-direction: column-reverse;
      border-bottom: none;
      margin-right: 2px;
      .el-tabs__new-tab {
        margin: 0;
        background: $--color-primary;
        color: #fff;
        border-radius: 0;
        border: none;
      }
      .el-tabs__nav-wrap {
        margin-bottom: 1px;
        .el-tabs__nav {
          width: 18px;
          border: none;
          .el-tabs__active-bar {
            display: none;
          }
          .el-tabs__item {
            display: flex;
            align-items: center;
            padding: 0;
            white-space: pre-wrap;
            height: 75px;
            line-height: initial;
            text-align: center;
            border: 1px solid $--color-primary;
            color: $--color-primary;
            font-weight: normal;
            display: flex;
            flex-direction: column;
            &.is-active {
              background: $--color-primary;
              color: #fff;
            }
            &:not(:last-child) {
              border-bottom: none;
            }
            .el-icon-close {
              margin-left: 0;
              top: 0;
              right: 0;
            }
            &[aria-controls='pane-0'] {
              .el-icon-close {
                display: none;
              }
            }
          }
        }

        &::after {
          display: none;
        }
      }
    }

    &.hidden-add-btn {
      .el-tabs__new-tab {
        display: none;
      }
    }
  }
}
</style>
<style lang="scss">
.audit-rule-error-class {
  .el-notification__content {
    p {
      white-space: pre-line;
    }
  }
}
</style>
