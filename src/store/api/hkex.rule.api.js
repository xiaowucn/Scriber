import { http, http_v2 } from './http';

export const fetchRules = (params) => {
  return http.get(`/plugins/hkex/rules`, { params });
};

export const fetchRuleSummary = (ruleCode, newList) => {
  return http.get(`/plugins/hkex/rule_summary_v2`, {
    params: {
      rule: ruleCode,
      new_list: newList,
    },
  });
};

export const fetchAnnouncementRules = (params) => {
  return http.get(`/plugins/hkex/disclosure_rule_name`, { params });
};

export const fetchAnnouncementRatioRules = (params) => {
  return http.get(`/plugins/hkex/ratio_rules`, { params });
};

export const fetchAnnouncementRuleSummary = (params) => {
  return http.get(`/plugins/hkex/rule_summary_v3`, { params });
};

export const fetchEsgRuleSummary = (params) => {
  return http.get(`/plugins/hkex/esg_rule_summary`, { params });
};

export const fetchEsgSubcategories = (params) => {
  return http_v2.get(`/esg/subcategories`, { params });
};

export const fetchCgRuleSummary = (params) => {
  return http_v2.get(`/cg/rule-summary`, { params });
};

export const exportRule = (params, onDownloadProgress, signal) => {
  const mergedParams = { ...params, v: new Date().getTime() };
  return http.get(`/plugins/hkex/export_rule`, {
    params: mergedParams,
    timeout: 10 * 60e3,
    onDownloadProgress,
    signal,
  });
};
