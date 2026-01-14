<template>
  <div class="schema-new-audit-rule-config-form">
    <el-form
      v-if="ruleForm"
      ref="form"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      :disabled="isPreview"
      :class="{ 'preview-style': isPreview }">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="是否需要关联检查" v-if="$platform.isCgsEnv()">
        <el-checkbox-group v-model="ruleForm.associationCheck">
          <el-checkbox label="validate_company_info"
            >国家企业信用信息</el-checkbox
          >
          <el-checkbox label="validate_bond_info"
            >中国证券业投资基金协会-私募基金管理人信息公示</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="提示内容">
        <el-checkbox-group v-model="ruleForm.complianceCheckList">
          <el-checkbox label="is_compliance_tip">合规时展示</el-checkbox>
          <el-checkbox label="is_noncompliance_tip">不合规时展示</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-input type="textarea" :rows="2" v-model="ruleForm.tip_content">
        </el-input>
      </el-form-item>
      <el-form-item label="参照的法规原文">
        <el-input type="textarea" v-model="ruleForm.origin_content"></el-input>
      </el-form-item>
      <el-form-item label="规则类型" prop="rule_type" class="rule-type-item">
        <el-select v-model="ruleForm.rule_type" @change="ruleTypeChange">
          <el-option label="逻辑校验" value="expr"></el-option>
          <el-option label="为空校验" value="empty"></el-option>
          <el-option label="正则校验" value="regex"></el-option>
          <el-option label="条件校验" value="condition"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$text.schema['Schema字段']"
        prop="schemaField"
        class="schema-field-item">
        <el-select
          filterable
          popper-class="rule-schema-select"
          v-model="ruleForm.schemaId"
          :placeholder="$text.schema['请选择Schema']"
          :disabled="ruleFormSchemaDisabled"
          @change="selectSchema">
          <el-option
            v-for="schema in schemaList"
            :key="schema.id"
            :label="schema.name"
            :value="schema.id"></el-option>
        </el-select>
        <el-select
          filterable
          :disabled="!ruleForm.schemaId"
          v-model="ruleForm.schemaField"
          placeholder="请选择详细字段">
          <el-option
            v-for="schemaField in schemaFieldList"
            :key="schemaField.name"
            :label="schemaField.name"
            :value="schemaField.name"></el-option>
        </el-select>
        <el-button
          v-if="displayKeywords"
          class="insert-btn"
          type="text"
          @click="insertSchemaField"
          >插入</el-button
        >
      </el-form-item>
      <el-form-item
        v-if="displayKeywords"
        label="关键词"
        prop="keywords"
        class="keywords-item">
        <el-input v-model="ruleForm.keywords"></el-input>
        <el-button class="insert-btn" type="text" @click="insertKeywords"
          >插入</el-button
        >
      </el-form-item>
      <el-form-item class="operators-selection-item">
        <div class="operators-selection" v-if="displayKeywords">
          <el-button-group>
            <el-button
              v-for="item in operators"
              :key="item"
              type="primary"
              size="mini"
              @click="selectOperator(item)"
              >{{ item }}</el-button
            >
            <el-button
              type="danger"
              size="mini"
              class="operator-delete-btn"
              @click="deleteFormulaElement"
              >删除</el-button
            >
          </el-button-group>
        </div>
        <div
          class="compliance-decide-formula"
          v-if="ruleForm.rule_type === 'expr'">
          <div class="formula-header">
            <span class="formula-title">合规判定公式</span>
            <div class="formula-header-right">
              <span>包含多个关键词时，关键词的判定是否唯一</span>
              <el-radio-group v-model="ruleForm.unique">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="editor-content">
            <span
              v-for="(item, index) in ruleForm.formula"
              :key="index"
              class="formula-element"
              :class="{
                [item.type]: true,
                active: !isPreview && elementIndexActived === index,
              }"
              @click="selectElement(index)"
              >{{ item.value }}</span
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item
        prop="regex"
        class="regex-formula"
        key="regex"
        v-if="ruleForm.rule_type === 'regex'">
        <div class="regex-formula-container">
          <div class="regex-formula-header">
            <span>正则公式</span>
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="ruleForm.regex">
          </el-input>
        </div>
      </el-form-item>
      <template v-if="ruleForm.rule_type === 'condition'">
        <div class="conditions-list-container">
          <div
            class="conditions-list"
            v-for="(cond, condIndex) in ruleForm.conditions"
            :key="condIndex">
            <div
              class="condition-operator-list"
              v-if="!isPreview && condIndex !== 0">
              <el-button
                type="text"
                class="delete-condition-btn"
                @click="deleteCondition(condIndex)"
                >删除</el-button
              >
            </div>
            <div class="condition-item-container">
              <div class="condition-item-header">
                <span class="condition-item-title">{{
                  `条件${condIndex + 1}`
                }}</span>
                <div class="condition-item-header-right">
                  <span>包含多个关键词时，关键词的判定是否唯一</span>
                  <el-radio-group v-model="cond.unique_if">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div
                class="condition-item-content"
                :class="{
                  'active-area':
                    !isPreview &&
                    currentConditionArea === 'if' &&
                    currentConditionIndex === condIndex,
                }"
                @click="handleChangeEditArea(condIndex, 'if')">
                <span
                  v-for="(item, index) in cond.expr_if.expr"
                  :key="index"
                  class="formula-element"
                  :class="{
                    [item.type]: true,
                    active:
                      !isPreview &&
                      currentConditionArea === 'if' &&
                      elementIndexActived === index &&
                      currentConditionIndex === condIndex,
                  }"
                  @click.stop="selectElement(index, condIndex, 'if')"
                  >{{ item.value }}</span
                >
              </div>
              <div class="condition-item-header">
                <span class="condition-item-title">表达式</span>
                <div class="condition-item-header-right">
                  <span>包含多个关键词时，关键词的判定是否唯一</span>
                  <el-radio-group v-model="cond.unique_then">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div
                class="condition-item-content"
                :class="{
                  'active-area':
                    !isPreview &&
                    currentConditionArea === 'then' &&
                    currentConditionIndex === condIndex,
                }"
                @click="handleChangeEditArea(condIndex, 'then')">
                <span
                  v-for="(item, index) in cond.expr_then.expr"
                  :key="index"
                  class="formula-element"
                  :class="{
                    [item.type]: true,
                    active:
                      !isPreview &&
                      currentConditionArea === 'then' &&
                      elementIndexActived === index &&
                      currentConditionIndex === condIndex,
                  }"
                  @click.stop="selectElement(index, condIndex, 'then')"
                  >{{ item.value }}</span
                >
              </div>
            </div>
            <el-form-item class="condition-item">
              <div class="add-incorrect-reason" v-if="cond.isShowAddReasonBtn">
                <el-button
                  class="add-reason-btn"
                  type="text"
                  @click="showIncorrectReasonInput(cond)"
                  >增加不正确原因</el-button
                >
              </div>
              <div class="reason-container" v-else>
                <div class="reason-header">
                  <span>不正确原因</span>
                  <el-button
                    class="delete-reason-btn"
                    type="text"
                    @click="deleteIncorrectReason(cond)"
                    >删除</el-button
                  >
                </div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="cond.reason">
                </el-input>
              </div>
            </el-form-item>
            <div class="add-opinion" v-if="cond.isShowAddOpinionBtn">
              <el-button
                class="add-opinion-btn"
                type="text"
                @click="(e) => showOpinion(e, cond)"
                >增加修改意见</el-button
              >
            </div>
            <div class="modify-opinion-container" v-else>
              <div class="modify-opinion-header">
                <span>修改意见</span>
                <el-button
                  class="delete-opinion-btn"
                  type="text"
                  @click="deleteOpinion(cond)"
                  >删除</el-button
                >
              </div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="cond.message">
              </el-input>
            </div>
          </div>
        </div>
        <div
          class="add-condition-content"
          v-if="ruleForm.conditions.length < 3">
          <el-button size="mini" @click="addCondition">增加条件</el-button>
        </div>
      </template>
      <el-form-item
        class="incorrect-reason-container"
        v-if="ruleForm.rule_type !== 'condition'">
        <div class="add-incorrect-reason" v-if="isShowAddReasonBtn">
          <el-button
            class="add-reason-btn"
            type="text"
            @click="showIncorrectReasonInput"
            >增加不正确原因</el-button
          >
        </div>
        <div class="incorrect-reason-input" v-else>
          <div class="incorrect-reason-header">
            <span>不正确原因</span>
            <el-button
              class="delete-reason-btn"
              type="text"
              @click="deleteIncorrectReason"
              >删除</el-button
            >
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="ruleForm.reason">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item
        class="opinion-container"
        v-if="ruleForm.rule_type !== 'condition'">
        <div class="add-opinion" v-if="isShowAddOpinionBtn">
          <el-button class="add-opinion-btn" type="text" @click="showOpinion"
            >增加修改意见</el-button
          >
        </div>
        <div class="modify-opinion-container" v-else>
          <div class="modify-opinion-header">
            <span>修改意见</span>
            <el-button
              class="delete-opinion-btn"
              type="text"
              @click="deleteOpinion"
              >删除</el-button
            >
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="ruleForm.message">
          </el-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'schema-new-audit-rule-config-form',

  props: {
    defaultRuleForm: {
      type: Object,
      default: () => ({}),
    },
    schemaList: {
      type: Array,
      required: true,
    },
    schemaFieldList: {
      type: Array,
      default: () => [],
    },
    isPreview: {
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
      ruleForm: {},
      rules: {
        name: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: ['blur', 'change'],
          },
        ],
        rule_type: [{ required: true }],
        regex: [{ required: true, message: '请输入正则', trigger: 'blur' }],
        schemaField: [
          {
            required: true,
            message: `请选择${this.$text.schema['Schema字段']}`,
          },
        ],
      },
      exprOperators: [
        '+',
        '-',
        '×',
        '÷',
        '>',
        '<',
        '≥',
        '≤',
        '=',
        '==',
        '≠',
        '包含',
        '不包含',
        '或',
        '且',
      ],
      conditionOperators: [
        '+',
        '-',
        '×',
        '÷',
        '>',
        '<',
        '≥',
        '≤',
        '=',
        '==',
        '≠',
        '包含',
        '不包含',
        '或',
        '且',
        'NULL',
      ],
      currentConditionIndex: 0,
      currentConditionArea: 'if',
      elementIndexActived: -1,
      isShowAddOpinionBtn: true,
      isShowAddReasonBtn: true,
    };
  },

  mounted() {},

  computed: {
    displayKeywords() {
      return ['expr', 'condition'].includes(this.ruleForm.rule_type);
    },
    operators() {
      return this.ruleForm.rule_type === 'expr'
        ? this.exprOperators
        : this.conditionOperators;
    },
    ruleFormSchemaDisabled() {
      if (this.isCopy) {
        return false;
      }
      return this.ruleForm.formula.length > 0;
    },
  },
  watch: {
    defaultRuleForm: {
      immediate: true,
      handler(val) {
        if (_.isEqual(val, this.ruleForm)) {
          return;
        }
        this.ruleForm = _.cloneDeep(val);
      },
    },
    ruleForm: {
      deep: true,
      handler(val) {
        this.$emit('update:defaultRuleForm', val);
      },
    },
  },

  methods: {
    async validate() {
      const validate = await this.$refs.form.validate().catch(() => {});
      if (!validate) {
        return {
          status: false,
        };
      }
      if (this.ruleForm.rule_type === 'expr') {
        if (this.ruleForm.formula.length === 0) {
          return {
            status: false,
            message: '合规判定公式不能为空',
          };
        }
      } else if (this.ruleForm.rule_type === 'condition') {
        for (let i = 0; i < this.ruleForm.conditions.length; i++) {
          const condition = this.ruleForm.conditions[i];
          if (condition.expr_if.expr.length === 0) {
            return {
              status: false,
              message: '条件不能为空',
            };
          }
          if (condition.expr_then.expr.length === 0) {
            return {
              status: false,
              message: '表达式不能为空',
            };
          }
        }
      }
      return {
        status: true,
      };
    },
    reset() {
      this.elementIndexActived = this.ruleForm.formula.length - 1;
      if (this.ruleForm.rule_type === 'condition') {
        this.currentConditionArea = 'if';
        this.elementIndexActived =
          this.ruleForm.conditions[0].expr_if.expr.length - 1;
      }
      this.isShowAddOpinionBtn = true;
      this.isShowAddReasonBtn = true;
      this.$refs.form.clearValidate();
    },
    ruleTypeChange(type) {
      switch (type) {
        case 'expr':
          this.deleteOpinion();
          this.deleteIncorrectReason();
          this.elementIndexActived = this.ruleForm.formula.length - 1;
          break;
        case 'empty':
          this.deleteOpinion();
          this.deleteIncorrectReason();
          break;
        case 'regex':
          this.deleteOpinion();
          this.deleteIncorrectReason();
          break;
        case 'condition':
          if (
            !this.ruleForm.conditions ||
            this.ruleForm.conditions.length === 0
          ) {
            this.$set(this.ruleForm, 'conditions', [
              {
                expr_if: { expr: [] },
                expr_then: { expr: [] },
                unique_if: true,
                unique_then: true,
                reason: '',
                message: '',
                isShowAddOpinionBtn: true,
                isShowAddReasonBtn: true,
              },
            ]);
          }
          this.elementIndexActived =
            this.ruleForm.conditions[0].expr_if.expr.length - 1;
          break;
        default:
          break;
      }
    },
    selectSchema(schemaId) {
      this.$emit('select-schema', schemaId);
    },
    showOpinion(e, condition) {
      if (this.ruleForm.rule_type === 'condition') {
        const conditionFormula = condition.expr_if.expr;
        if (
          e &&
          conditionFormula.length > 0 &&
          conditionFormula[0].type === 'column'
        ) {
          condition.message = `合同[${conditionFormula[0].value}][position]，请将[${conditionFormula[0].value}][paragraph]修改为`;
        }
        condition.isShowAddOpinionBtn = false;
        return;
      }
      if (
        e &&
        this.ruleForm.formula.length > 0 &&
        this.ruleForm.formula[0].type === 'column'
      ) {
        const schemaField = this.ruleForm.formula[0].value;
        this.ruleForm.message =
          this.ruleForm.message ||
          `合同[${schemaField}][position]，请将[${schemaField}][paragraph]修改为`;
      }
      this.isShowAddOpinionBtn = false;
    },
    showIncorrectReasonInput(condition) {
      if (this.ruleForm.rule_type === 'condition') {
        condition.isShowAddReasonBtn = false;
        return;
      }
      this.isShowAddReasonBtn = false;
    },
    deleteOpinion(condition) {
      if (this.ruleForm.rule_type === 'condition') {
        condition.message = '';
        condition.isShowAddOpinionBtn = true;
        return;
      }
      this.ruleForm.message = '';
      this.isShowAddOpinionBtn = true;
    },
    deleteIncorrectReason(condition) {
      if (this.ruleForm.rule_type === 'condition') {
        condition.reason = '';
        condition.isShowAddReasonBtn = true;
        return;
      }
      this.ruleForm.reason = '';
      this.isShowAddReasonBtn = true;
    },
    addCondition() {
      this.ruleForm.conditions.push({
        expr_if: { expr: [] },
        expr_then: { expr: [] },
        unique_if: true,
        unique_then: true,
        reason: '',
        message: '',
        isShowAddOpinionBtn: true,
        isShowAddReasonBtn: true,
      });
    },
    deleteCondition(condIndex) {
      this.ruleForm.conditions.splice(condIndex, 1);
    },
    handleChangeEditArea(index, area) {
      this.currentConditionIndex = index;
      this.currentConditionArea = area;
      this.elementIndexActived =
        this.ruleForm.conditions[index][`expr_${area}`].expr.length - 1;
    },
    selectOperator(operator) {
      if (operator === 'NULL') {
        this.insertFormulaElement({
          type: 'keywords',
          value: operator,
        });
      } else {
        this.insertFormulaElement({
          type: 'operator',
          value: operator,
        });
      }
    },
    insertFormulaElement(element) {
      let formula = this.ruleForm.formula;
      if (this.ruleForm.rule_type === 'condition') {
        formula =
          this.ruleForm.conditions[this.currentConditionIndex][
            `expr_${this.currentConditionArea}`
          ].expr;
      }
      if (formula.length === 0) {
        if (element.type === 'column') {
          formula.push(element);
          this.elementIndexActived = 0;
        }
      } else {
        const insertPosition =
          this.elementIndexActived > -1
            ? this.elementIndexActived + 1
            : formula.length;

        const elementPreviousIndex =
          this.elementIndexActived > -1
            ? this.elementIndexActived
            : formula.length - 1;
        const elementPrevious = formula[elementPreviousIndex];
        const elementTwoPrevious = formula[elementPreviousIndex - 1];

        if (element.type === 'operator') {
          if (
            elementPrevious.type === 'column' ||
            elementPrevious.type === 'keywords'
          ) {
            const hasExistedEqual = formula.some((item) => item.value === '=');
            if (element.value !== '=' || !hasExistedEqual) {
              formula.splice(insertPosition, 0, element);
              this.elementIndexActived = this.elementIndexActived + 1;
            }
          }
        } else if (element.type === 'column') {
          if (elementPrevious.type === 'operator') {
            formula.splice(insertPosition, 0, element);
            this.elementIndexActived = this.elementIndexActived + 1;
          }
        } else if (element.type === 'keywords') {
          if (elementPrevious.type === 'operator') {
            const hasOrSymbol = element.value.includes('|');
            const hasAndSymbol = element.value.includes('&');
            if (
              elementPrevious.value === '=' &&
              (hasOrSymbol || hasAndSymbol)
            ) {
              return;
            }
            if (hasOrSymbol) {
              this.insertKeywordsAndPaddedColumn({
                keywords: element.value,
                symbol: '|',
                operator: '或',
                elementTwoPrevious,
                elementPrevious,
              });
            } else if (hasAndSymbol) {
              this.insertKeywordsAndPaddedColumn({
                keywords: element.value,
                symbol: '&',
                operator: '且',
                elementTwoPrevious,
                elementPrevious,
              });
            } else {
              formula.splice(insertPosition, 0, element);
              this.elementIndexActived = this.elementIndexActived + 1;
            }
          }
        }
      }
    },
    insertKeywordsAndPaddedColumn({
      keywords,
      symbol,
      operator,
      elementTwoPrevious,
      elementPrevious,
    }) {
      const keywordsList = keywords.split(symbol).filter((item) => {
        return item.trim();
      });
      let formulaElements = [];
      keywordsList.forEach((item, i) => {
        if (i !== 0) {
          formulaElements = formulaElements.concat([
            {
              type: 'operator',
              value: operator,
            },
            elementTwoPrevious,
            elementPrevious,
          ]);
        }
        formulaElements.push({
          type: 'keywords',
          value: item,
        });
      });
      formulaElements.forEach((item) => {
        this.insertFormulaElement(item);
      });
    },
    insertSchemaField() {
      if (!this.ruleForm.schemaField) {
        return;
      }
      this.insertFormulaElement({
        type: 'column',
        value: this.ruleForm.schemaField,
      });
    },
    insertKeywords() {
      if (!this.ruleForm.keywords) {
        return;
      }
      this.insertFormulaElement({
        type: 'keywords',
        value: this.ruleForm.keywords,
      });
    },
    selectElement(elementIndex, condIndex, area) {
      let formula = this.ruleForm.formula;
      if (this.ruleForm.rule_type === 'condition') {
        this.currentConditionIndex = condIndex;
        this.currentConditionArea = area;
        formula = this.ruleForm.conditions[condIndex][`expr_${area}`].expr;
      }
      if (elementIndex < 0) {
        elementIndex = 0;
      }
      if (elementIndex > formula.length - 1) {
        elementIndex = formula.length - 1;
      }

      this.elementIndexActived = elementIndex;
    },
    deleteFormulaElement() {
      if (this.elementIndexActived > -1) {
        let formula = this.ruleForm.formula;
        if (this.ruleForm.rule_type === 'condition') {
          formula =
            this.ruleForm.conditions[this.currentConditionIndex][
              `expr_${this.currentConditionArea}`
            ].expr;
        }
        formula.splice(this.elementIndexActived, 1);
        this.elementIndexActived = Math.max(this.elementIndexActived - 1, 0);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-new-audit-rule-config-form {
  ::v-deep .el-form {
    .el-form-item {
      .el-form-item__label {
        line-height: 30px;
      }

      .el-form-item__content {
        line-height: 30px;

        .el-input__inner {
          height: 30px !important;
          line-height: 30px;
        }

        .el-checkbox-group {
          display: flex;
          flex-direction: column;
        }

        .el-select {
          &:not(last-child) {
            margin-right: 5px;
          }
          .el-input__icon {
            line-height: 30px;
          }
        }

        .insert-btn {
          margin-left: 10px;
          height: 30px;
          line-height: 30px;
          padding: 0;
        }
      }
    }

    .rule-type-item,
    .schema-field-item,
    .keywords-item {
      .el-input__inner {
        width: 240px;
      }
    }

    .keywords-item {
      .el-input {
        width: auto;
      }
    }

    .operators-selection-item {
      .el-form-item__content {
        margin-left: 0 !important;
        .operators-selection {
          padding: 0 60px;
          .el-button {
            margin-right: 8px;
            margin-bottom: 10px;
            border-radius: 4px;
          }
        }
        .compliance-decide-formula {
          background: #eff2f5;
          padding: 8px 20px 10px;
          border-radius: 6px;
          .formula-header {
            display: flex;
            justify-content: space-between;

            .formula-header-right {
              .el-radio-group {
                margin-left: 40px;
                .el-radio__label {
                  padding-left: 5px;
                }
              }
            }
          }
          .editor-content {
            padding: 10px;
            width: calc(100% - 20px);
            min-height: 100px;
            border-radius: 6px;
            border: 1px solid #dcdfe6;
            background: #fff;
            outline: none;

            .formula-element {
              color: #fff;
              padding: 2px 8px;
              border-radius: 4px;
              cursor: default;

              &:not(:first-of-type) {
                margin-left: 7px;
              }

              &.column {
                background: #909399;
              }

              &.operator {
                background: #a0cfff;
              }
              &.keywords {
                background: #a0cfff;
              }
              &.active {
                background-color: #409eff;
                color: #fff;
              }
            }
          }
        }
      }
    }
    .regex-formula {
      .el-form-item__content {
        margin-left: 0 !important;
      }

      .regex-formula-container {
        background: #eff2f5;
        padding: 0 20px 10px;
        border-radius: 6px;
        .regex-formula-header::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4 px;
        }
      }
    }

    .conditions-list-container {
      max-height: 500px;
      overflow-y: auto;
    }
    .conditions-list {
      margin-left: 0 !important;
      background: #eff2f5;
      padding: 8px 20px 10px;
      border-radius: 6px;
      margin-bottom: 10px;

      .condition-operator-list {
        display: flex;
        justify-content: flex-end;
        .delete-condition-btn {
          color: #f56c6c;
          padding-top: 0;
        }
      }
      .condition-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        .condition-item-title::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4 px;
        }

        .condition-item-header-right {
          .el-radio-group {
            margin-left: 40px;
            .el-radio__label {
              padding-left: 5px;
            }
          }
        }
      }

      .condition-item-content {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        margin-bottom: 4px;
        width: calc(100% - 20px);
        min-height: 100px;
        border-radius: 6px;
        border: 1px solid #dcdfe6;
        background: #fff;
        outline: none;

        &.active-area {
          border: 1px solid #409eff;
        }

        .formula-element {
          height: fit-content;
          margin: 2px;
          padding: 2px 8px;
          color: #fff;
          border-radius: 4px;
          cursor: default;

          &.column {
            background: #909399;
          }

          &.operator {
            background: #a0cfff;
          }
          &.keywords {
            background: #a0cfff;
          }
          &.active {
            background-color: #409eff;
            color: #fff;
          }
        }
      }

      .el-form-item__content {
        margin-left: 0 !important;
        .add-incorrect-reason {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          .add-reason-btn {
            padding: 0;
          }
        }
        .reason-container {
          .reason-header {
            display: flex;
            justify-content: space-between;
            .delete-reason-btn {
              height: 30px;
              line-height: 30px;
              padding: 0;
              color: #f56c6c;
            }
          }
        }
      }
      .add-opinion {
        display: flex;
        justify-content: center;
        .add-opinion-btn {
          padding: 0;
        }
      }
      .modify-opinion-container {
        background: #eff2f5;
        border-radius: 6px;
        .modify-opinion-header {
          display: flex;
          justify-content: space-between;
          .delete-opinion-btn {
            height: 30px;
            line-height: 30px;
            padding: 0;
            color: #f56c6c;
          }
        }
      }
    }
    .add-condition-content {
      display: flex;
      justify-content: center;
      margin: 10px 0;

      .el-button {
        color: #409eff;
        border: 1px solid #409eff;
        width: 105px;
        height: 20px;
        line-height: 20px;
        padding: 0;
      }
    }
    .opinion-container {
      .el-form-item__content {
        margin-left: 0 !important;
      }
      .add-opinion {
        display: flex;
        justify-content: center;
        .add-opinion-btn {
          padding: 0;
        }
      }

      .modify-opinion-container {
        background: #eff2f5;
        padding: 0 20px 10px;
        border-radius: 6px;
        .modify-opinion-header {
          display: flex;
          justify-content: space-between;
          .delete-opinion-btn {
            height: 30px;
            line-height: 30px;
            padding: 0;
            color: #f56c6c;
          }
        }
      }
    }
    .incorrect-reason-container {
      .el-form-item__content {
        margin-left: 0 !important;
      }
      .add-incorrect-reason {
        display: flex;
        justify-content: center;
        .add-reason-btn {
          padding: 0;
        }
      }
      .incorrect-reason-input {
        background: #eff2f5;
        padding: 0 20px 10px;
        border-radius: 6px;
        .incorrect-reason-header {
          display: flex;
          justify-content: space-between;
          .delete-reason-btn {
            height: 30px;
            line-height: 30px;
            padding: 0;
            color: #f56c6c;
          }
        }
      }
    }

    &.preview-style {
      .delete-opinion-btn,
      .delete-reason-btn,
      .operator-delete-btn,
      .add-incorrect-reason,
      .add-opinion,
      .add-condition-content {
        display: none !important;
      }
    }
  }
}
</style>

<style lang="scss">
.rule-schema-select {
  max-width: 400px;
}
</style>
