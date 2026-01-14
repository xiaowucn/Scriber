import { http } from './http';

/**
 * 获取指定文件合规检查结果
 */
export const fetchFileRuleResult = (fileId) =>
  http.get('/plugins/rule/rule_results', { params: { fid: fileId } });

/**
 * 更新审核状态
 */
export const updateFileRuleStatus = (ruleResultId, data) =>
  http.put(`/plugins/rule/rule_results/${ruleResultId}`, data);

/**
 * 人工审核统计
 */
export const fetchFileRuleSummary = (fileId) =>
  http.get('/plugins/rule/audit_summary', { params: { file_id: fileId } });

/**
 * 合规检查统计(按年份)
 */
export const fetchComplianceRuleSummary = (params) =>
  http.get('/plugins/rule/rule_summary', { params });
