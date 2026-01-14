import { http_v2 } from './http';

/**
 * 获取所有组
 * @param {String} params.rule_type rule类型，可选值：ar, qr, esg, cg
 * @param {String} params.q 查询条件，目前只支持根据name查询
 */
export const getGroups = (params) => {
  return http_v2.get('/groups', { params });
};

/**
 * 创建组
 * @param {Object} data
 */
export const createGroup = (data) => {
  return http_v2.post('/groups', data);
};

/**
 * 获取组
 * @param {Number} groupId
 */
export const getGroup = (groupId) => {
  return http_v2.get(`/groups/${groupId}`);
};

export const getGroupChildren = (groupId, params) => {
  return http_v2.get(`/groups/${groupId}/children`, { params });
};

/**
 * 更新组
 * @param {Number} groupId
 * @param {Object} data
 */
export const updateGroup = (groupId, data) => {
  return http_v2.put(`/groups/${groupId}`, data);
};

/**
 * 删除组
 * @param {Number} groupId
 */
export const deleteGroup = (groupId) => {
  return http_v2.delete(`/groups/${groupId}`);
};

export const getGroupRules = (groupId, params) => {
  return http_v2.get(`/groups/${groupId}/rules`, { params });
};

/**
 * 获取所有rules
 * @param {String} params.rule_type 必传参数 | rule类型，可选值：ar, qr, esg, cg
 * @param {String} params.by 查询条件，可选值：name, description
 * @param {String} params.q 查询条件输入值
 * @param {Number} params.page 页码
 * @param {Number} params.page_size 每页条数
 */
export const getRules = (params) => {
  return http_v2.get('/rules', { params });
};

/**
 * 获取rule
 * @param {Number} ruleId
 */
export const getRule = (ruleId) => {
  return http_v2.get(`/rules/${ruleId}`);
};

/**
 * 更新rule
 * @param {Number} ruleId
 * @param {Object} data
 */
export const updateRule = (ruleId, data) => {
  return http_v2.put(`/rules/${ruleId}`, data);
};

/**
 * 获取report
 * @param {Number} fileId
 * @param {Array|String} params.rule
 */
export const getReport = (fileId, params) => {
  return http_v2.get(`/reports/${fileId}`, { params });
};

/**
 * 获取 Rules Operation Record
 */
export const getRulesOperationRecord = (params) =>
  http_v2.get('/rules/history', { params });

/**
 * 获取 Rule 历史规则描述
 */
export const getRuleHistory = (rule, params) =>
  http_v2.get(`/rules/${rule}/history`, { params });

/**
 * 获取Rule Management界面Rule的变更记录
 */
export const getRuleOperationRecords = (rule, params) =>
  http_v2.get(`/rules/${rule}/records`, { params });

/**
 * 获取Rule Management界面Rule的变更记录
 */
export const updateRuleOperationRecord = (recordId, data) =>
  http_v2.put(`/rules/records/${recordId}`, data);

/**
 * 获取审核页面筛选历史记录
 */
export const getReviewSearchHistory = (params) =>
  http_v2.get('/history', { params });

/**
 * 创建审核页面筛选历史记录
 */
export const createReviewSearchHistory = (params) =>
  http_v2.post('/history', {}, { params });

/**
 * 删除审核页面筛选历史记录
 */
export const deleteReviewSearchHistory = (id) =>
  http_v2.delete(`/history/${id}`);

/**
 * 删除审核页面筛选所有的历史记录
 */
export const deleteReviewAllSearchHistories = (params) =>
  http_v2.delete(`/history/all`, { params });
