/**
 * 任务参数构建工具
 * 提供通用的任务参数构建方法，支持不同的处理方式和审核方式
 */

// 方法映射常量
const METHOD_MAPPINGS = {
  // 处理方式映射
  PROCESS_METHODS: {
    CODE_TO_DISPLAY: {
      extract: '要素提取',
      intelligent: '智能审核',
    },
    DISPLAY_TO_CODE: {
      要素提取: 'extract',
      智能审核: 'intelligent',
    },
  },
  // 审核方式映射
  AUDIT_METHODS: {
    CODE_TO_DISPLAY: {
      rule: '规则审核',
      judge: '大模型审核',
    },
    DISPLAY_TO_CODE: {
      规则审核: 'rule',
      大模型审核: 'judge',
    },
  },
};

// 内部任务类型定义（用于简化逻辑）
const INTERNAL_TASK_TYPES = {
  // 默认为空
  none: {
    process_methods: [],
    audit_methods: [],
    api_task_type: null,
    requires_scenario: false,
  },
  // 纯要素提取
  extract_simple: {
    process_methods: ['extract'],
    audit_methods: [],
    api_task_type: 'extract',
    requires_scenario: false,
  },
  // 要素提取 + 智能审核 + 大模型审核
  extract_enhanced: {
    process_methods: ['extract', 'intelligent'],
    audit_methods: ['judge'],
    api_task_type: 'extract',
    requires_scenario: true,
  },
  // 智能审核 + 大模型审核
  judge: {
    process_methods: ['intelligent'],
    audit_methods: ['judge'],
    api_task_type: 'judge',
    requires_scenario: true,
  },
  // 要素提取 + 智能审核 + 规则审核
  audit_rule: {
    process_methods: ['extract', 'intelligent'],
    audit_methods: ['rule'],
    api_task_type: 'audit',
    requires_scenario: false,
  },
  // 要素提取 + 智能审核 + 规则审核 + 大模型审核
  audit_full: {
    process_methods: ['extract', 'intelligent'],
    audit_methods: ['rule', 'judge'],
    api_task_type: 'audit',
    requires_scenario: true,
  },
};

/**
 * 检查 scenario_id 是否有效
 * @param {String|Array} scenarioId - 应用场景ID
 * @returns {Boolean} 是否有效
 */
function isValidScenarioId(scenarioId) {
  if (!scenarioId) return false;
  if (Array.isArray(scenarioId)) return scenarioId.length > 0;
  return true;
}

/**
 * 根据界面选项组合确定内部任务类型
 * @param {Array} processMethods - 处理方式数组
 * @param {Array} auditMethods - 审核方式数组
 * @param {String|Array} scenarioId - 应用场景ID
 * @returns {String} 内部任务类型
 */
function determineInternalTaskType(processMethods, auditMethods, scenarioId) {
  const hasExtract = processMethods.includes('extract');
  const hasIntelligent = processMethods.includes('intelligent');
  const hasRule = auditMethods.includes('rule');
  const hasJudge = auditMethods.includes('judge');
  const hasValidScenario = isValidScenarioId(scenarioId);

  // 只有要素提取
  if (hasExtract && !hasIntelligent) {
    return 'extract_simple';
  }

  // 只有智能审核
  if (!hasExtract && hasIntelligent) {
    return 'judge';
  }

  // 要素提取 + 智能审核
  if (hasExtract && hasIntelligent) {
    // 有大模型审核且有有效scenario_id → 增强版要素提取
    if (hasJudge && hasValidScenario && !hasRule) {
      return 'extract_enhanced';
    }
    // 有规则审核但无大模型审核 → 规则审核
    if (hasRule && !hasJudge) {
      return 'audit_rule';
    }
    // 有规则审核和大模型审核 → 完整审核
    if (hasRule && hasJudge) {
      return 'audit_full';
    }
    // 默认情况 → 规则审核
    return 'audit_rule';
  }

  // 默认情况
  return 'none';
}

/**
 * 根据API任务类型和场景ID确定内部任务类型
 * @param {String} apiTaskType - API任务类型 ('extract' | 'judge' | 'audit')
 * @param {String|Array} scenarioId - 应用场景ID
 * @returns {String} 内部任务类型
 */
function determineInternalTaskTypeFromApi(apiTaskType, scenarioId) {
  const hasValidScenario = isValidScenarioId(scenarioId);

  switch (apiTaskType) {
    case 'extract':
      return hasValidScenario ? 'extract_enhanced' : 'extract_simple';
    case 'judge':
      return 'judge';
    case 'audit':
      return hasValidScenario ? 'audit_full' : 'audit_rule';
    default:
      return 'none';
  }
}

/**
 * 根据任务类型和场景ID获取处理方式和审核方式（代码格式）
 * @param {String} taskType - 任务类型 ('extract' | 'judge' | 'audit')
 * @param {String|Array} scenarioId - 应用场景ID
 * @returns {Object} { process_methods: Array, audit_methods: Array }
 */
export function getMethodsByTaskTypeCode(taskType, scenarioId) {
  const internalType = determineInternalTaskTypeFromApi(taskType, scenarioId);
  const config = INTERNAL_TASK_TYPES[internalType];

  if (!config) {
    return {
      process_methods: [],
      audit_methods: [],
    };
  }

  return {
    process_methods: [...config.process_methods],
    audit_methods: [...config.audit_methods],
  };
}

/**
 * 根据任务类型和场景ID获取处理方式和审核方式（显示格式）
 * @param {String} taskType - 任务类型 ('extract' | 'judge' | 'audit')
 * @param {String|Array} scenarioId - 应用场景ID
 * @returns {Object} { process_methods: Array, audit_methods: Array }
 */
export function getMethodsByTaskTypeDisplay(taskType, scenarioId) {
  // 先获取代码格式的结果
  const codeResult = getMethodsByTaskTypeCode(taskType, scenarioId);

  // 转换为显示格式
  const processMethods = codeResult.process_methods.map(
    (method) =>
      METHOD_MAPPINGS.PROCESS_METHODS.CODE_TO_DISPLAY[method] || method,
  );
  const auditMethods = codeResult.audit_methods.map(
    (method) => METHOD_MAPPINGS.AUDIT_METHODS.CODE_TO_DISPLAY[method] || method,
  );

  return {
    process_methods: processMethods,
    audit_methods: auditMethods,
  };
}

/**
 * 根据处理方式和审核方式获取任务类型
 * @param {Array} processMethods - 处理方式数组
 * @param {Array} auditMethods - 审核方式数组
 * @param {String|Array} scenarioId - 应用场景ID
 * @param {Object} options - 可选配置
 * @param {String} options.format - 输入格式 ('code' | 'display')，默认 'code'
 * @returns {Object} { task_type: String, scenario_id?: String|Array }
 */
export function getTaskTypeByMethods(
  processMethods,
  auditMethods,
  scenarioId,
  options = {},
) {
  const { format = 'code' } = options;

  // 转换为代码格式进行处理
  let processMethodsCodes = [...processMethods];
  let auditMethodsCodes = [...auditMethods];

  if (format === 'display') {
    processMethodsCodes = processMethods.map(
      (method) =>
        METHOD_MAPPINGS.PROCESS_METHODS.DISPLAY_TO_CODE[method] || method,
    );
    auditMethodsCodes = auditMethods.map(
      (method) =>
        METHOD_MAPPINGS.AUDIT_METHODS.DISPLAY_TO_CODE[method] || method,
    );
  }

  // 使用统一的内部类型判断逻辑
  const internalType = determineInternalTaskType(
    processMethodsCodes,
    auditMethodsCodes,
    scenarioId,
  );
  const config = INTERNAL_TASK_TYPES[internalType];

  if (!config) {
    return { task_type: null };
  }

  // 构建返回结果
  const result = { task_type: config.api_task_type };
  if (config.requires_scenario && isValidScenarioId(scenarioId)) {
    result.scenario_id = scenarioId;
  }

  return result;
}

/**
 * 构建单个处理方式的参数
 * @param {String} method - 处理方式 ('extract' | 'intelligent')
 * @param {Object} baseParams - 基础参数对象
 * @param {String|Array} scenario_id - 应用场景ID
 * @returns {Object} 构建好的参数
 */
export function getSingleProcessParams(method, baseParams, scenario_id) {
  const methodMap = {
    extract: { ...baseParams, task_type: 'extract' },
    intelligent: {
      ...baseParams,
      scenario_id,
      task_type: 'judge',
    },
  };

  return methodMap[method];
}

/**
 * 构建审核参数
 * @param {Array} audit_methods - 审核方式数组
 * @param {Object} baseParams - 基础参数对象
 * @param {String|Array} scenario_id - 应用场景ID
 * @returns {Object} 构建好的参数
 */
export function getAuditParams(audit_methods, baseParams, scenario_id) {
  const auditParams = { ...baseParams, task_type: 'audit' };

  if (audit_methods.length === 1 && audit_methods[0] === 'rule') {
    return auditParams;
  }

  if (audit_methods.includes('judge')) {
    return { ...auditParams, scenario_id };
  }

  return auditParams;
}

/**
 * 构建任务参数的通用方法
 * @param {Object} baseParams - 基础参数对象
 * @param {Object} formData - 表单数据
 * @param {Array} formData.process_methods - 处理方式数组
 * @param {Array} formData.audit_methods - 审核方式数组
 * @param {String|Array} formData.scenario_id - 应用场景ID
 * @returns {Object} 构建好的任务参数
 */
export function getLlmParams(baseParams, formData) {
  const { process_methods, audit_methods, scenario_id } = formData;

  // 使用统一的转换逻辑
  const taskTypeResult = getTaskTypeByMethods(
    process_methods,
    audit_methods,
    scenario_id,
  );

  // 合并基础参数和任务类型结果
  return { ...baseParams, ...taskTypeResult };
}
