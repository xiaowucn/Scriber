import { http_v2 } from './http';

export const getLaws = (params) => http_v2.get(`/laws`, { params });

export const createLaws = (data) => http_v2.post(`/laws`, data);

export const getLawInfo = (rank_id) => http_v2.get(`/laws/${rank_id}`);

export const updateLawData = (law_id, data) =>
  http_v2.put(`/laws/${law_id}`, data);

export const deleteLawData = (law_id) => http_v2.delete(`/laws/${law_id}`);

export const refreshLaw = (law_id, data) =>
  http_v2.post(`/laws/${law_id}/refresh`, data);

export const triggerRefreshLaw = (law_id) =>
  http_v2.put(`/laws/${law_id}/trigger`);

export const switchRule = (law_id, rule_id, params) =>
  http_v2.put(
    `/laws/${law_id}/rules/${rule_id}/switch?enable=${params.enable}`,
  );

export const createRule = (law_id, data) =>
  http_v2.post(`/laws/${law_id}/rules`, data);

export const updateRule = (law_id, rule_id, data) =>
  http_v2.put(`/laws/${law_id}/rules/${rule_id}`, data);

export const deleteRule = (law_id, rule_id) =>
  http_v2.delete(`/laws/${law_id}/rules/${rule_id}`);

export const getLawRules = (rank_id, params) =>
  http_v2.get(`/laws/${rank_id}/rules`, { params });

export const getScenarios = (params) =>
  http_v2.get(`/laws/scenarios`, { params });

export const createScenarios = (data) => http_v2.post(`/laws/scenarios`, data);

export const deleteScenarios = (id) => http_v2.delete(`/laws/scenarios/${id}`);

export const getDiffRules = (law_id) =>
  http_v2.get(`/laws/${law_id}/diff-rules`);
export const revertLawRules = (law_id) =>
  http_v2.put(`/laws/${law_id}/revert`, null, { timeout: 0 });

export const applyLawRules = (law_id, data) =>
  http_v2.post(`/laws/${law_id}/apply`, data);

export const convertLawRules = (law_id, data) =>
  http_v2.post(`/laws/${law_id}/rules/convert`, data);

export const getCheckPoints = (params) =>
  http_v2.get(`laws/check-points`, { params });

export const switchCheckPoints = (id, params) =>
  http_v2.get(`laws/check-points/${id}/switch`, { params });

export const getCheckPointsExistsByLaw = (law_id) =>
  http_v2.get(`laws/${law_id}/check-points/exists`);

export const getCheckPointsExistsIdsByRule = (rule_id) =>
  http_v2.get(`laws/rules/${rule_id}/check-points/exists-ids`);

export const ruleConvert = (rule_id) =>
  http_v2.put(`laws/rules/${rule_id}/convert`);

export const getRuleContent = (rule_id) =>
  http_v2.get(`laws/rules/${rule_id}/content`);

export const updateCheckPoint = (cp_id, data) =>
  http_v2.put(`laws/check-points/${cp_id}`, data);

export const deleteCheckPoint = (cp_id) =>
  http_v2.delete(`laws/check-points/${cp_id}`);

export const startDeleteCheckPoint = (cp_id) =>
  http_v2.put(`laws/check-points/${cp_id}/del`);

export const reviewCheckPoint = (cp_id, data) =>
  http_v2.put(`laws/check-points/${cp_id}/review`, data);

export const getLawsPublicList = () => http_v2.get(`laws/public-list`);

export const getTestFileList = (params) =>
  http_v2.get(`files/synced`, { params });

export const contractAnalysisByCheckPoint = (cp_id, data, config = {}) =>
  http_v2.post(`laws/check-points/${cp_id}/contract-analysis`, data, {
    ...config,
    timeout: 0,
  });

export const contractAnalysisByRule = (cp_id, params, config = {}) =>
  http_v2.get(`laws/rules/${cp_id}/contract`, {
    params,
    ...config,
    timeout: 0,
  });

export const getLawsOrders = () => http_v2.get(`laws/converted`);

export const updateCheckPoints = (data) =>
  http_v2.put(`laws/check-points/save-all`, data);

export const setCheckPointAlias = (data) =>
  http_v2.put(`laws/check-points/alias`, data);

export const getCheckPointInfo = (cp_id) =>
  http_v2.get(`laws/check-points/${cp_id}`);

export const getRuleKeywords = (data) =>
  http_v2.post(`/laws/rule/keywords`, data);

export const getCheckPointByContent = (rule_id, data, config = {}) =>
  http_v2.put(`/laws/rules/${rule_id}/checkpoint`, data, {
    ...config,
    timeout: 0,
  });
