import { mapGetters } from 'vuex';
import {
  pdfParseStatus,
  AI_PREDICT_STATUS_MAP,
  AUDIT_STATUS_MAP,
  JUDGE_STATUS,
} from '@/store/constants';
import { getLlmParams } from '@/utils/llmParamsUtils';

// 文件预处理状态 - 需要禁用编辑的状态（解析中）
const FILE_PARSE_DISABLED_STATUSES = [
  pdfParseStatus.parsing, // 解析中
  pdfParseStatus.parsing_time, // 解析中
  pdfParseStatus.parsed, // 解析中
];

// 预测状态 - 需要禁用编辑的状态（预测中）
const PREDICT_DISABLED_STATUSES = [AI_PREDICT_STATUS_MAP.DOING];

// 审核状态 - 需要禁用编辑的状态（审核中）
const AUDIT_DISABLED_STATUSES = [AUDIT_STATUS_MAP.AUDITING];

// 大模型审核状态 - 需要禁用编辑的状态（待审核、审核中）
const JUDGE_DISABLED_STATUSES = [JUDGE_STATUS.INIT, JUDGE_STATUS.PARSING];

export default {
  props: {
    scenarioOptions: {
      type: Array,
      default: () => [],
    },
    fileData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      baseForm: {
        process_methods: [],
        audit_methods: [],
        scenario_id: '',
        molds: [],
      },
    };
  },

  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('schemaModule', ['schemas']),
    isAuditMethodDisabled() {
      return (
        this.form.process_methods.length === 0 ||
        (this.form.process_methods.length === 1 &&
          this.form.process_methods.includes('extract'))
      );
    },

    isRuleAuditDisabled() {
      return (
        this.form.process_methods.length === 1 &&
        this.form.process_methods.includes('intelligent')
      );
    },

    isScenarioDisabled() {
      return (
        this.form.process_methods.length === 0 || // 没有选择处理方式时禁用
        !this.form.audit_methods.includes('judge') // 没有勾选大模型审核时禁用
      );
    },

    // 检查文件是否处于需要禁用编辑的状态
    isFileInDisabledStatus() {
      if (!this.fileData) return false;

      // 检查解析状态
      const { pdf_parse_status } = this.fileData;

      if (FILE_PARSE_DISABLED_STATUSES.includes(pdf_parse_status)) {
        return true;
      }

      // 检查预测状态
      if (this.isPredicting) {
        return true;
      }

      // 检查审核状态
      if (this.isAuditing) {
        return true;
      }

      return false;
    },

    // 检查是否有预测中的状态
    isPredicting() {
      if (!this.fileData || !this.fileData.auditStatusQuestions) {
        return false;
      }

      return this.fileData.auditStatusQuestions.some((question) =>
        PREDICT_DISABLED_STATUSES.includes(question.ai_status),
      );
    },

    // 检查是否有审核中的状态
    isAuditing() {
      if (!this.fileData) {
        return false;
      }

      // 检查规则审核状态
      const { audit_status } = this.fileData;
      if (AUDIT_DISABLED_STATUSES.includes(audit_status)) {
        return true;
      }

      // 检查大模型审核状态
      const { judge_status } = this.fileData;
      if (judge_status) {
        // 支持两种数据格式：对象或直接状态值
        const judgeStatusValue =
          typeof judge_status === 'object' ? judge_status.status : judge_status;
        if (JUDGE_DISABLED_STATUSES.includes(judgeStatusValue)) {
          return true;
        }
      }

      return false;
    },

    // 处理方式选择器是否禁用
    isProcessMethodsDisabled() {
      return this.isFileInDisabledStatus;
    },

    // 审核方式选择器是否禁用
    isAuditMethodsDisabled() {
      return this.isFileInDisabledStatus || this.isAuditMethodDisabled;
    },

    // Schema配置是否禁用
    isSchemaConfigDisabled() {
      return this.isFileInDisabledStatus;
    },

    // 应用场景选择是否禁用
    isScenarioConfigDisabled() {
      return this.isFileInDisabledStatus || this.isScenarioDisabled;
    },

    baseFormRules() {
      const self = this;
      return {
        process_methods: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '请选择处理方式',
            trigger: ['change', 'blur'],
          },
        ],
        audit_methods: [
          {
            validator(rule, value, callback) {
              return self.validateAuditMethods(rule, value, callback);
            },
            trigger: ['change', 'blur'],
          },
        ],
        scenario_id: [
          {
            validator(rule, value, callback) {
              return self.validateScenarioId(rule, value, callback);
            },
            trigger: ['change', 'blur'],
          },
        ],
      };
    },

    // 可选的校验规则组 - 用于文件夹操作等场景
    optionalFormRules() {
      const self = this;
      return {
        audit_methods: [
          {
            validator(rule, value, callback) {
              if (self.form.process_methods.length === 0) {
                callback();
                return;
              }
              return self.validateAuditMethods(rule, value, callback);
            },
            trigger: ['change', 'blur'],
          },
        ],
        scenario_id: [
          {
            validator(rule, value, callback) {
              if (self.form.process_methods.length === 0) {
                callback();
                return;
              }
              return self.validateScenarioId(rule, value, callback);
            },
            trigger: ['change', 'blur'],
          },
        ],
      };
    },
  },

  methods: {
    validateAuditMethods(_rule, value, callback) {
      if (
        this.form.process_methods.length === 1 &&
        this.form.process_methods.includes('extract')
      ) {
        callback();
        return;
      }
      if (!value || value.length === 0) {
        callback(new Error('请选择审核方式'));
      } else {
        callback();
      }
    },

    validateScenarioId(_rule, value, callback) {
      if (
        this.form.process_methods.length === 1 &&
        this.form.process_methods.includes('extract')
      ) {
        callback();
        return;
      }
      if (
        this.form.audit_methods.length === 1 &&
        this.form.audit_methods.includes('rule')
      ) {
        callback();
        return;
      }
      if (!value || value.length === 0) {
        callback(new Error('请选择应用场景'));
      } else {
        callback();
      }
    },

    getSelectOptionLabel(option) {
      if (!option.marked) {
        return option.name;
      }
      return `${option.name} (已标注)`;
    },

    handleProcessMethodChange(value) {
      const previousScenarioId = this.form.scenario_id;

      if (!value.length) {
        // 没有选择处理方式时，清空所有相关字段
        this.form.audit_methods = [];
        this.form.scenario_id = '';
      } else if (value.length === 1 && value.includes('extract')) {
        this.form.audit_methods = [];
        this.form.scenario_id = '';
      } else if (value.length === 1 && value.includes('intelligent')) {
        this.form.audit_methods = ['judge'];
        this.form.molds = [];
      }

      // 如果没有勾选大模型审核，清空应用场景
      if (!this.form.audit_methods.includes('judge')) {
        this.form.scenario_id = '';
      }

      if (this.$refs.form) {
        this.$refs.form.clearValidate();
        this.$nextTick(() => {
          // 如果应用场景被清空了，只清除其校验错误，不重新验证
          if (this.form.scenario_id === '' && previousScenarioId !== '') {
            this.$refs.form.clearValidate('scenario_id');
          }
          // 只验证审核方式，不验证应用场景（应用场景由用户主动勾选大模型审核时验证）
          this.$refs.form.validateField('audit_methods');
        });
      }
    },

    handleAuditMethodChange(value) {
      // 如果没有勾选大模型审核，清空应用场景
      if (!value.includes('judge')) {
        this.form.scenario_id = '';
        // 清除应用场景的校验错误
        if (this.$refs.form) {
          this.$nextTick(() => {
            this.$refs.form.clearValidate('scenario_id');
          });
        }
      } else {
        // 如果勾选了大模型审核，重新验证应用场景
        if (this.$refs.form) {
          this.$nextTick(() => {
            this.$refs.form.validateField('scenario_id');
          });
        }
      }
    },

    getParams() {
      const { process_methods, audit_methods, scenario_id, molds } = this.form;

      const baseParams = {
        molds,
      };

      return getLlmParams(baseParams, {
        process_methods,
        audit_methods,
        scenario_id,
      });
    },

    resetBaseForm() {
      this.form = {
        ...this.form,
        process_methods: [],
        audit_methods: [],
        scenario_id: '',
        molds: [],
      };
    },
  },
};
