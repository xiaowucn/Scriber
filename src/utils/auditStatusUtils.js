import {
  AUDIT_STATUS_MAP,
  JUDGE_STATUS,
  COMBINED_AUDIT_STATUS,
  COMBINED_AUDIT_STATUS_TEXT_MAP,
} from '@/store/constants';

/**
 * 获取综合审核状态枚举值（用于状态判断）
 * @param {Object} auditData - 审核数据对象
 * @param {number|null} auditData.audit_status - 规则审核状态
 * @param {Object|null} auditData.judge_status - 大模型审核状态对象
 * @returns {string} 审核状态枚举值
 */
export function getAuditStatus(auditData) {
  if (!auditData) {
    return COMBINED_AUDIT_STATUS.UNKNOWN;
  }

  const { audit_status, judge_status } = auditData;

  // 检查各状态的存在性和值
  const auditNotReviewed = audit_status === AUDIT_STATUS_MAP.NOT_REVIEWED;
  const judgeInit = judge_status === JUDGE_STATUS.INIT;
  const hasAuditStatus = audit_status != null;
  const hasJudgeStatus = judge_status != null;
  // 如果都没有启用，返回未知状态
  if (!hasAuditStatus && !hasJudgeStatus) {
    return COMBINED_AUDIT_STATUS.UNKNOWN;
  }
  // 待审核状态的判断逻辑：
  // 1. audit_status 不存在且 judge_status 为初始状态
  // 2. judge_status 不存在且 audit_status 为待审核状态
  // 3. 两者都存在且都为对应的初始状态
  if (
    (!hasAuditStatus && judgeInit) ||
    (!hasJudgeStatus && auditNotReviewed) ||
    (auditNotReviewed && judgeInit)
  ) {
    return COMBINED_AUDIT_STATUS.NOT_REVIEWED;
  }

  // 获取大模型审核的状态值
  const judgeStatusValue = judge_status;

  // 检查是否有审核中的状态
  const isRuleAuditing = audit_status === AUDIT_STATUS_MAP.AUDITING;
  const isJudgeAuditing =
    judgeStatusValue === JUDGE_STATUS.INIT ||
    judgeStatusValue === JUDGE_STATUS.PARSING;

  if (isRuleAuditing || isJudgeAuditing) {
    return COMBINED_AUDIT_STATUS.AUDITING;
  }

  // 检查各种完成状态的组合
  const ruleSuccess = audit_status === AUDIT_STATUS_MAP.AUDIT_SUCCESS;
  const ruleFailed = audit_status === AUDIT_STATUS_MAP.AUDIT_FAIL;
  const judgeSuccess = judgeStatusValue === JUDGE_STATUS.SUCCESS;
  const judgeFailed = judgeStatusValue === JUDGE_STATUS.FAILED;
  const judgePartialFailed = judgeStatusValue === JUDGE_STATUS.PARTIAL_FAILED;
  const judgeMissing = judgeStatusValue === JUDGE_STATUS.MISSING;

  if (judgeMissing) {
    if (!hasAuditStatus) {
      return COMBINED_AUDIT_STATUS.NO_RULE_MATCHED;
    }
    if (ruleSuccess) {
      return COMBINED_AUDIT_STATUS.AUDIT_SUCCESS;
    }
    if (ruleFailed) {
      return COMBINED_AUDIT_STATUS.AUDIT_FAILED;
    }
  }

  // 大模型审核部分失败
  if (judgePartialFailed) {
    return COMBINED_AUDIT_STATUS.AUDIT_PARTIAL_FAILED;
  }

  // 两个都启用的情况
  if (hasAuditStatus && hasJudgeStatus) {
    if (ruleSuccess && judgeSuccess) {
      return COMBINED_AUDIT_STATUS.AUDIT_SUCCESS;
    }
    if (ruleFailed && judgeFailed) {
      return COMBINED_AUDIT_STATUS.AUDIT_FAILED;
    }
    if ((ruleSuccess && judgeFailed) || (ruleFailed && judgeSuccess)) {
      return COMBINED_AUDIT_STATUS.AUDIT_PARTIAL_FAILED;
    }
  }

  // 只有一个启用的情况
  if (hasAuditStatus && !hasJudgeStatus) {
    if (ruleSuccess) {
      return COMBINED_AUDIT_STATUS.AUDIT_SUCCESS;
    }
    if (ruleFailed) {
      return COMBINED_AUDIT_STATUS.AUDIT_FAILED;
    }
  }

  if (hasJudgeStatus && !hasAuditStatus) {
    if (judgeSuccess) {
      return COMBINED_AUDIT_STATUS.AUDIT_SUCCESS;
    }
    if (judgeFailed) {
      return COMBINED_AUDIT_STATUS.AUDIT_FAILED;
    }
  }

  return COMBINED_AUDIT_STATUS.NOT_REVIEWED;
}

/**
 * 根据状态枚举值获取中文描述
 * @param {string} statusKey - 状态枚举值
 * @returns {string} 中文描述
 */
export function getAuditStatusTextByKey(statusKey) {
  return COMBINED_AUDIT_STATUS_TEXT_MAP[statusKey] || '-';
}

/**
 * 检查是否为审核中状态
 * @param {Object} auditData - 审核数据对象
 * @returns {boolean} 是否为审核中状态
 */
export function isAuditing(auditData) {
  return getAuditStatus(auditData) === COMBINED_AUDIT_STATUS.AUDITING;
}

/**
 * 检查是否为审核失败状态
 * @param {Object} auditData - 审核数据对象
 * @returns {boolean} 是否为审核失败状态
 */
export function isAuditFailed(auditData) {
  return getAuditStatus(auditData) === COMBINED_AUDIT_STATUS.AUDIT_FAILED;
}

/**
 * 检查是否为审核部分失败状态
 * @param {Object} auditData - 审核数据对象
 * @returns {boolean} 是否为审核部分失败状态
 */
export function isAuditPartialFailed(auditData) {
  return (
    getAuditStatus(auditData) === COMBINED_AUDIT_STATUS.AUDIT_PARTIAL_FAILED
  );
}

/**
 * 检查是否为审核成功状态
 * @param {Object} auditData - 审核数据对象
 * @returns {boolean} 是否为审核成功状态
 */
export function isAuditSuccess(auditData) {
  return getAuditStatus(auditData) === COMBINED_AUDIT_STATUS.AUDIT_SUCCESS;
}

/**
 * 检查是否为未匹配到规则状态
 * @param {Object} auditData - 审核数据对象
 * @returns {boolean} 是否为未匹配到规则状态
 */
export function isNoRuleMatched(auditData) {
  return getAuditStatus(auditData) === COMBINED_AUDIT_STATUS.NO_RULE_MATCHED;
}
