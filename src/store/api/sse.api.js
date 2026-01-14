import { http } from './http';

export const fetchPocFiles = (params) =>
  http.get('/plugins/sse/files', { params });

export const addPocProject = (data) => http.post(`/plugins/sse/files`, data);

export const deletePocProject = (id) => http.delete(`/plugins/sse/files/${id}`);

export const fetchPocRuleSummary = (params) =>
  http.get('/plugins/sse/rule_summary', { params });

export const fetchPocRuleSummaryDetails = (params) =>
  http.get('/plugins/sse/rule_detail', { params });

export const updatePocRuleResults = (id, data) =>
  http.post(`/plugins/sse/rule_results/${id}/put`, data);

export const fetchPocAuditStatusMap = () =>
  http.get(`/plugins/sse/audit_status_map`);
