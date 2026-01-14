<template>
  <div class="custom-rules" v-loading="loading">
    <div class="page-header operater-list">
      <div class="operater-list-left">
        <slot name="operater"></slot>
        <el-button
          v-if="canCreateRule"
          size="medium"
          type="primary"
          @click="openAuditRuleDialog">
          <i class="fa fa-plus fa-fw"></i>
          新建规则
        </el-button>
      </div>
      <el-form
        v-if="$isAllowed('customerRuleParticipate')"
        :inline="true"
        :model="searchForm">
        <el-form-item
          v-if="$platform.isCmfchinaEnv()"
          label="关联场景"
          class="search-field">
          <el-select
            v-model="searchForm.mold_id"
            size="medium"
            filterable
            clearable
            @clear="clearSearchMold"
            @change="changeSearchMode">
            <el-option
              v-for="(item, index) in schemaItems"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.type"
            size="medium"
            class="search-field"
            @change="handleSearchTypeChange">
            <el-option
              v-for="(item, index) in searchOptions.filter(
                (item) => item.visible !== false,
              )"
              :key="index"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-select
            v-if="currentSearchOption.options"
            ref="inputRef"
            v-model="searchForm.keyword"
            :placeholder="currentSearchOption.placeholder"
            size="medium"
            clearable
            filterable
            class="search-select"
            popper-class="custom-rule-filter-select"
            @change="handleSearchClick">
            <el-option
              v-for="(item, index) in currentSearchOption.options"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-input
            v-else
            ref="inputRef"
            v-model.trim="searchForm.keyword"
            :placeholder="currentSearchOption.placeholder"
            size="medium"
            clearable
            class="search-input"
            @clear="handleSearchClick"
            @keydown.enter.native="handleSearchClick">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            class="search-btn"
            @click="handleSearchClick">
            <svg-font-icon name="search" :size="14"></svg-font-icon>
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="auditRuleList"
      ref="table"
      class="rule-list-table has-border"
      v-bind="
        $style.rule.tableHeight ? { height: $style.rule.tableHeight } : {}
      ">
      <el-table-column width="100" prop="id" label="ID"></el-table-column>
      <el-table-column
        prop="name"
        label="规则名称"
        align="center"></el-table-column>
      <el-table-column prop="user" label="创建人" align="center">
        <template slot-scope="scope">
          {{ scope.row.user || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Schema"
        :label="$text.schema['关联Schema']"
        align="center">
        <template slot-scope="scope">
          {{ getSchemaName(scope.row.schema_id) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showSchemaFieldColumnsInRulesTable()"
        prop="fields"
        label="关联字段"
        align="center">
        <template slot-scope="scope">
          <p
            v-for="(field, index) in scope.row.fields"
            :key="index"
            :title="field"
            class="field">
            {{ field }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="rule_type" label="规则类型" align="center">
        <template slot-scope="scope">
          {{ getRuleTypeName(scope.row.rule_type) }}
        </template>
      </el-table-column>
      <el-table-column prop="rule_content" label="规则内容"></el-table-column>

      <template v-if="$features.supportRuleReview()">
        <el-table-column prop="review_user" label="复核用户" align="center">
          <template slot-scope="scope">
            {{ getReviewUsers(scope.row.review_users) }}
          </template>
        </el-table-column>
        <el-table-column prop="review_status" align="center">
          <template slot="header" slot-scope="{}">
            <el-dropdown szie="mini" @command="changeReviewStatus">
              <span class="el-dropdown-link">
                复核状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="rules-filter-dropdown">
                <el-dropdown-item command="">全部</el-dropdown-item>
                <el-dropdown-item
                  v-for="(item, index) in reviewStatusDropdownItems"
                  :key="index"
                  :command="item.value"
                  :class="[item.value === filterReviewStatus ? 'active' : '']">
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div
              :class="
                RULE_REVIEW_STATUS_MAP[scope.row.review_status]
                  ? RULE_REVIEW_STATUS_MAP[scope.row.review_status].classname
                  : ''
              ">
              <el-tooltip
                v-if="scope.row.review_status === RULE_REVIEW_STATUS.NOT_PASS"
                :content="scope.row.not_pass_reason"
                placement="left">
                <i class="el-icon-warning"></i>
              </el-tooltip>
              {{
                RULE_REVIEW_STATUS_MAP[scope.row.review_status]
                  ? RULE_REVIEW_STATUS_MAP[scope.row.review_status].label
                  : '-'
              }}
            </div>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        :label="$t(`message['操作']`)"
        width="250"
        align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="复制" placement="top">
            <el-button
              v-if="canCopyRule"
              @click="copyRule(scope.row)"
              type="text">
              复制
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看" placement="top">
            <el-button
              v-if="canViewRule"
              @click="viewRule(scope.row)"
              type="text">
              查看
            </el-button>
          </el-tooltip>
          <el-tooltip
            v-if="canReviewRule"
            effect="dark"
            content="复核"
            placement="top">
            <el-button
              :disabled="
                [scope.row.uid, scope.row.handle_uid].includes(loginUser.id) ||
                ![
                  RULE_REVIEW_STATUS.NOT_REVIEWED,
                  RULE_REVIEW_STATUS.DEL_NOT_REVIEWED,
                ].includes(scope.row.review_status)
              "
              @click="reviewRule(scope.row)"
              type="text">
              复核
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="修改" placement="top">
            <el-button
              v-if="canEditRule"
              :disabled="checkEditRuleDisabled(scope.row)"
              @click="editRule(scope.row)"
              type="text">
              修改
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="测试" placement="top">
            <el-button
              v-if="canTestRule"
              @click="testRule(scope.row)"
              type="text">
              测试
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              v-if="canDeleteRule"
              :disabled="
                scope.row.review_status === RULE_REVIEW_STATUS.DEL_NOT_REVIEWED
              "
              class="button-del"
              @click="deleteRule(scope.row)"
              type="text">
              删除
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="auditRulePager.page"
      :page-size="auditRulePager.size"
      :total="auditRulePager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <schema-new-audit-rule-config
      ref="ruleConfig"
      v-if="isShowNewRule"
      :schemaList="schemas.items"
      :schemaId="schemaId"
      :isNewRule="isNewRule"
      :isPreview="isPreview"
      :isReview="isReview"
      :is-copy="isCopy"
      @close="closeNewRule"></schema-new-audit-rule-config>
    <schema-audit-rule-config-test
      ref="testRule"
      :visible="isShowTestRule"
      :ruleId="testRuleId"
      @close="closeTestRule"></schema-audit-rule-config-test>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { RULE_REVIEW_STATUS } from '@/store/constants';
import SchemaNewAuditRuleConfig from '../components/SchemaNewAuditRuleConfig';
import SchemaAuditRuleConfigTest from '../components/SchemaAuditRuleConfigTest';
import { cmfchinaPermAllowed } from '../custom/cmfchina/common/utils';

export default {
  name: 'custom-rules',
  components: { SchemaNewAuditRuleConfig, SchemaAuditRuleConfigTest },
  data() {
    return {
      loading: false,
      isShowNewRule: false,
      isShowTestRule: false,
      isNewRule: true,
      isPreview: false,
      isReview: false,
      isCopy: false,
      testRuleId: 0,
      schemaId: null,
      schemaFields: [],
      searchForm: {
        type: 'name',
        keyword: '',
        mold_id: '',
        review_status: '',
      },
      filterReviewStatus: null,
      RULE_REVIEW_STATUS,
      RULE_REVIEW_STATUS_MAP: {
        1: {
          value: RULE_REVIEW_STATUS.NOT_REVIEWED,
          label: '待复核',
          classname: 'not-reviewed',
          order: 1,
        },
        2: {
          value: RULE_REVIEW_STATUS.NOT_PASS,
          label: '复核不通过',
          classname: 'not-pass',
          order: 2,
        },
        3: {
          value: RULE_REVIEW_STATUS.PASS,
          label: '复核通过',
          classname: 'pass',
          order: 5,
        },
        4: {
          value: RULE_REVIEW_STATUS.DEL_NOT_REVIEWED,
          label: '删除后待复核',
          classname: 'del-not-reviewed',
          order: 3,
        },
        5: {
          value: RULE_REVIEW_STATUS.DEL_NOT_PASS,
          label: '删除后复核不通过',
          classname: 'del-not-pass',
          order: 4,
        },
      },
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('schemaModule', [
      'schemas',
      'auditRuleList',
      'auditRulePager',
    ]),
    canCreateRule() {
      if (this.$platform.isCmfchinaEnv()) {
        return cmfchinaPermAllowed('rule_settings');
      }
      return this.$isAllowed('customerRuleParticipate');
    },
    canCopyRule() {
      return (
        this.$features.supportCopyCustomRule() &&
        cmfchinaPermAllowed('rule_settings')
      );
    },
    canViewRule() {
      if (this.$platform.isCmfchinaEnv()) {
        return (
          cmfchinaPermAllowed('rule_view') ||
          cmfchinaPermAllowed('rule_settings')
        );
      }
      return this.$isAllowed('customerRuleParticipate');
    },
    canReviewRule() {
      if (this.$features.supportRuleReview()) {
        if (this.$platform.isCmfchinaEnv()) {
          return cmfchinaPermAllowed('rule_settings');
        }
        return this.$isAllowed('customerRuleReview');
      }
      return false;
    },
    canEditRule() {
      if (this.$platform.isCmfchinaEnv()) {
        return cmfchinaPermAllowed('rule_settings');
      }
      return this.$isAllowed('customerRuleParticipate');
    },
    canTestRule() {
      if (this.$platform.isCmfchinaEnv()) {
        return cmfchinaPermAllowed('rule_settings');
      }
      return this.$isAllowed('customerRuleParticipate');
    },
    canDeleteRule() {
      if (this.$platform.isCmfchinaEnv()) {
        return cmfchinaPermAllowed('rule_settings');
      }
      return this.$isAllowed('customerRuleParticipate');
    },
    showOperationButtons() {
      if (this.$platform.isCmfchinaEnv()) {
        return cmfchinaPermAllowed('rule_settings');
      }
      return true;
    },
    reviewStatusDropdownItems() {
      return Object.values(this.RULE_REVIEW_STATUS_MAP).sort(
        (a, b) => a.order - b.order,
      );
    },
    schemaItems() {
      return this.schemas.items.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    },
    searchOptions() {
      return [
        {
          value: 'name',
          label: '规则名称',
          placeholder: '请输入规则名称',
        },
        {
          value: 'rule_type',
          label: '规则类型',
          placeholder: '请选择规则类型',
          options: [
            {
              value: 'expr',
              label: '逻辑校验',
            },
            {
              value: 'empty',
              label: '为空校验',
            },
            {
              value: 'regex',
              label: '正则校验',
            },
            {
              value: 'condition',
              label: '条件校验',
            },
          ],
        },
        {
          value: 'mold_id',
          label: this.$text.schema['关联Schema'],
          placeholder: `请选择${this.$text.schema['关联Schema']}`,
          options: this.schemaItems,
          visible: !this.$platform.isCmfchinaEnv(),
        },
        {
          value: 'id',
          label: '规则ID',
          placeholder: '请输入规则ID',
          visible: this.$platform.isCmfchinaEnv(),
        },
        {
          value: 'user',
          label: '创建用户',
          placeholder: '请输入创建用户',
          visible: this.$platform.isCmfchinaEnv(),
        },
        {
          value: 'field',
          label: '关联字段',
          placeholder: '请选择关联字段',
          options: this.schemaFields,
          disabled: !this.searchForm.mold_id,
          visible: this.$platform.isCmfchinaEnv(),
        },
      ];
    },
    currentSearchOption() {
      return (
        this.searchOptions.find(
          (item) => item.value === this.searchForm.type,
        ) || {}
      );
    },
  },
  created() {
    this.initAuditRuleConfig();
  },
  beforeDestroy() {
    this.$store.commit('schemaModule/UPDATE_AUDIT_RULE_SEARCH_FORM', {});
  },
  methods: {
    initSearchParams() {
      let query = this.$route.query;
      if (_.isEmpty(query)) {
        return;
      }
      const searchParams = query;
      if (query.mold_id) {
        const mold_id = Number(query.mold_id);
        this.getSchemaFields(mold_id);
        this.searchForm.mold_id = mold_id;
        query = _.omit(query, 'mold_id');
      }
      if (!_.isEmpty(query)) {
        const [key, value] = Object.entries(query)[0];
        this.searchForm.type = key;
        this.searchForm.keyword = value;
      }
      this.$store.commit(
        'schemaModule/UPDATE_AUDIT_RULE_SEARCH_FORM',
        searchParams,
      );
    },
    handleSearchTypeChange() {
      this.searchForm.keyword = '';
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    handleSearchClick() {
      const searchParams = {
        [this.searchForm.type]: this.searchForm.keyword,
      };
      if (this.searchForm.mold_id) {
        searchParams.mold_id = this.searchForm.mold_id;
      }
      if (this.searchForm.review_status) {
        searchParams.review_status = this.searchForm.review_status;
      }
      this.$store.commit(
        'schemaModule/UPDATE_AUDIT_RULE_SEARCH_FORM',
        _.omitBy(searchParams, (v) => v === ''),
      );
      this.$store.commit('schemaModule/SET_AUDIT_RULE_PAGER', {
        ...this.auditRulePager,
        page: 1,
      });
      this.$router.replace({
        name: this.$route.name,
        query: _.omitBy(searchParams, (v) => v === ''),
      });
      this.getRuleConfigList();
    },
    async initAuditRuleConfig() {
      this.$store.commit('schemaModule/SET_SCHEMAS_PAGER', {
        ...this.auditRulePager,
        page: 1,
      });
      this.loading = true;
      await this.getSchemaList();
      this.initSearchParams();
      this.getRuleConfigList();
    },
    async getRuleConfigList() {
      try {
        this.loading = true;
        await this.$store.dispatch('schemaModule/fetchAuditRuleList');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async getSchemaList() {
      try {
        await this.$store.dispatch('schemaModule/fetchSchemas', {
          params: {
            is_master: true,
            size: 9999,
          },
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    clearSearchMold() {
      this.searchForm.mold_id = '';
      if (this.searchForm.type === 'field') {
        this.searchForm.type = 'name';
        this.searchForm.keyword = '';
      }
      this.schemaFields = [];
      this.handleSearchClick();
    },
    changeSearchMode() {
      if (this.searchForm.type === 'field') {
        this.searchForm.keyword = '';
      }
      this.getSchemaFields(this.searchForm.mold_id);
    },
    async getSchemaFields(schemaId) {
      if (!schemaId) {
        return;
      }
      try {
        const { data } = await this.$store.dispatch(
          'schemaModule/fetchSchemaFieldList',
          schemaId,
        );
        const schemaFields = Object.keys(data)
          .map((item) => {
            return Object.assign(data[item], { name: item });
          })
          .map((item) => {
            return {
              value: item.name,
              label: item.name,
            };
          });
        this.schemaFields = schemaFields;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    getSchemaName(id) {
      const schema = this.schemas.items.find((i) => i.id === id);
      if (!schema) {
        return '-';
      }
      return schema.name;
    },
    getReviewUsers(users) {
      if (users && users.length > 0) {
        return users.join();
      }
      return '-';
    },
    getRuleTypeName(rule_type) {
      const typeMap = {
        expr: '逻辑校验',
        empty: '为空校验',
        regex: '正则校验',
        condition: '条件校验',
      };
      return typeMap[rule_type];
    },
    openAuditRuleDialog() {
      this.isNewRule = true;
      this.isPreview = false;
      this.isReview = false;
      this.isShowNewRule = true;
    },
    closeNewRule() {
      this.isShowNewRule = false;
      this.isCopy = false;
    },
    viewRule(row) {
      this.editRule(row);
      this.isPreview = true;
    },
    async editRule(row) {
      const {
        schema_id,
        rule_type,
        detail,
        validate_bond_info,
        validate_company_info,
        is_compliance_tip,
        is_noncompliance_tip,
      } = row;
      const associationCheck = [];
      const complianceCheckList = [];
      if (validate_bond_info) {
        associationCheck.push('validate_bond_info');
      }
      if (validate_company_info) {
        associationCheck.push('validate_company_info');
      }
      if (is_compliance_tip) {
        complianceCheckList.push('is_compliance_tip');
      }
      if (is_noncompliance_tip) {
        complianceCheckList.push('is_noncompliance_tip');
      }
      let formula = [];
      let schemaField = '';
      const conditions = [];
      if (rule_type === 'expr') {
        const result = this.getFormulaAndSchemaField(detail.expr);
        formula = result.formula;
        schemaField = result.schemaField;
      } else if (rule_type === 'empty') {
        schemaField = detail.field.name;
      } else if (rule_type === 'regex') {
        schemaField = detail.field.name;
      } else if (rule_type === 'condition') {
        detail.conditions.forEach((item) => {
          const { formula: formula_if } = this.getFormulaAndSchemaField(
            item.expr_if.expr,
          );
          const { formula: formula_then, schemaField: schemaField_then } =
            this.getFormulaAndSchemaField(item.expr_then.expr);
          schemaField = schemaField_then;
          conditions.push({
            expr_if: {
              expr: formula_if,
            },
            expr_then: {
              expr: formula_then,
            },
            unique_if: item.expr_if.unique,
            unique_then: item.expr_then.unique,
            reason: item.reason,
            message: item.message,
            isShowAddOpinionBtn: !item.message,
            isShowAddReasonBtn: !item.reason,
          });
        });
      }
      const ruleItem = {
        ..._.cloneDeep(row),
        associationCheck,
        complianceCheckList,
        formula,
        regex: detail.regex,
        schemaId: schema_id,
        schemaField,
        conditions,
        unique: detail.unique,
        message: detail.message,
        reason: detail.reason,
      };
      this.schemaId = schema_id;
      this.isNewRule = false;
      this.isPreview = false;
      this.isReview = false;
      this.isCopy = false;
      this.isShowNewRule = true;
      await this.$nextTick();
      this.$refs.ruleConfig.setRuleList([ruleItem]);
      this.$nextTick(() => {
        if (detail.message) {
          this.$refs.ruleConfig.showOpinion();
        }
        if (detail.reason) {
          this.$refs.ruleConfig.showReason();
        }
      });
    },
    copyRule(row) {
      this.editRule(row);
      this.isNewRule = true;
      this.isCopy = true;
    },
    reviewRule(row) {
      this.editRule(row);
      this.isPreview = false;
      this.isReview = true;
    },
    getFormulaAndSchemaField(expr) {
      const formula = [];
      let schemaField = '';
      expr.forEach((element) => {
        if (_.isString(element)) {
          formula.push({
            type: 'operator',
            value: element,
          });
        } else if (_.isObject(element) && element.name) {
          formula.push({
            type: 'column',
            value: element.name,
          });
          schemaField = element.name;
        } else {
          formula.push({
            type: 'keywords',
            value: element.value,
          });
        }
      });
      return { formula, schemaField };
    },
    testRule(row) {
      this.$refs.testRule.resetFields();
      this.testRuleId = row.id;
      let testForm = {};
      if (row.rule_type === 'expr') {
        const fieldList = [];
        row.detail.expr.forEach((item) => {
          if (_.isObject(item) && item.name) {
            const isExist = fieldList.find((fied) => {
              return fied.name === item.name;
            });
            if (!isExist) {
              fieldList.push({
                ...item,
                value: '',
              });
            }
          }
        });
        testForm = {
          rule_type: row.rule_type,
          rule_content: row.rule_content,
          fieldList,
        };
      } else if (row.rule_type === 'empty') {
        const fieldList = [_.cloneDeep(row.detail.field)];
        testForm = {
          rule_type: row.rule_type,
          rule_content: row.rule_content,
          fieldList,
        };
      } else if (row.rule_type === 'regex') {
        const fieldList = [_.cloneDeep(row.detail.field)];
        testForm = {
          rule_type: row.rule_type,
          rule_content: row.rule_content,
          fieldList,
        };
      } else if (row.rule_type === 'condition') {
        const ruleContentList = [];
        const fieldListMap = {};
        row.detail.conditions.forEach((cond, index) => {
          const fieldList = [];
          let rule_content = '';
          const expr = [...cond.expr_if.expr, '则', ...cond.expr_then.expr];
          expr.forEach((item) => {
            if (_.isObject(item) && item.name) {
              rule_content += `${item.name} `;
              const isExist = fieldList.find((fied) => {
                return fied.name === item.name;
              });
              if (!isExist) {
                fieldList.push({
                  ...item,
                  value: '',
                });
              }
            } else if (_.isString(item)) {
              rule_content += `${item} `;
            } else {
              rule_content += `${item.value} `;
            }
          });
          ruleContentList.push(rule_content);
          fieldListMap[index] = fieldList;
        });
        testForm = {
          rule_type: row.rule_type,
          rule_content: ruleContentList[0],
          ruleContentList,
          condition: 0,
          fieldList: fieldListMap[0],
          fieldListMap,
        };
      }
      this.$refs.testRule.setTestForm(testForm);
      this.isShowTestRule = true;
    },
    closeTestRule() {
      this.isShowTestRule = false;
    },
    async deleteRule(rule) {
      try {
        const { id } = rule;
        const shouldUpdateReviewStatus = this.$platform.isCgsEnv();
        const message = shouldUpdateReviewStatus
          ? '是否删除该规则（将进入复核）'
          : '是否删除该规则';
        const successMessage = shouldUpdateReviewStatus
          ? '进入删除待复核'
          : '删除成功';
        await this.$confirm(message, this.$t(`message['提示']`), {
          confirmButtonText: this.$t(`message['确定']`),
          cancelButtonText: this.$t(`message['取消']`),
          type: 'warning',
        });
        if (shouldUpdateReviewStatus) {
          await this.$store.dispatch('schemaModule/updateRuleReviewStatus', {
            ruleId: id,
            data: {
              review_status: RULE_REVIEW_STATUS.DEL_NOT_REVIEWED,
            },
          });
        } else {
          await this.$store.dispatch('schemaModule/deleteAuditRule', {
            ruleId: id,
          });
        }
        this.$notify({
          title: this.$t(`message['成功']`),
          message: successMessage,
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    handleChangePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$store.commit('schemaModule/SET_AUDIT_RULE_PAGER', {
        ...this.auditRulePager,
        page,
      });
      this.getRuleConfigList();
    },
    handleChangeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$store.commit('schemaModule/SET_AUDIT_RULE_PAGER', {
        ...this.auditRulePager,
        page: 1,
        size,
      });
      this.getRuleConfigList();
    },
    changeReviewStatus(status) {
      this.filterReviewStatus = status;
      this.searchForm.review_status = status;
      this.handleSearchClick();
    },
    checkEditRuleDisabled(row) {
      if (this.$features.supportRuleReview()) {
        return [
          RULE_REVIEW_STATUS.NOT_REVIEWED,
          RULE_REVIEW_STATUS.DEL_NOT_REVIEWED,
        ].includes(row.review_status);
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-rules {
  padding: 0 20px;
  .operater-list {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep .el-form {
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
        &:last-child {
          margin-left: 10px;
        }
        .el-form-item__content {
          line-height: initial;
        }
        .search-field {
          width: 140px;
          margin-left: 20px;
          .el-input__inner {
            border-right: none;
            border-radius: 4px 0 0 4px;
          }
        }
        .search-input,
        .search-select {
          width: 300px;
          .el-input__inner {
            border-radius: 0 4px 4px 0;
          }
        }
        .search-btn {
          height: 36px;
          font-size: 14px;
          padding: 7px 20px;
          vertical-align: middle;
          > span {
            display: flex;
            align-items: center;
            .svg-icon-container {
              margin-right: 5px;
            }
          }
        }
      }
    }
    .operater-list-left {
      display: flex;
      align-items: center;
    }
  }
  ::v-deep .rule-list-table {
    .cell {
      .el-dropdown {
        cursor: pointer;
      }
      .not-reviewed {
        color: #666;
      }
      .pass {
        color: $--color-primary;
      }
      .not-pass,
      .del-not-pass {
        color: #f56c6c;
      }
      .field {
        margin: 8px 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .button-del {
      color: #f56c6c;
      &.is-disabled {
        color: #c0c4cc;
      }
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>

<style lang="scss">
.rules-filter-dropdown {
  .el-dropdown-menu__item {
    &.active {
      color: #225476;
      background-color: #f5f7fa;
    }
  }
}
.custom-rule-filter-select {
  width: 300px;
}
</style>
