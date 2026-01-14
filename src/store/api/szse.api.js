import { http } from './http';

export const fetchDefaultProject = () =>
  http.get('/plugins/fileapi/tree/default');

export const fetchFiles = (params) =>
  http.get('/plugins/szse/question/search', { params });

export const addProject = (treeId, data) =>
  http.post(`/plugins/fileapi/tree/${treeId}/file`, data);

export const deleteProject = (fileId) =>
  http.delete(`/plugins/fileapi/file/${fileId}`);

export const fetchAnswer = (qid) =>
  http.get(`/plugins/szse/json_answer/${qid}`);

export const submitAnswer = (qid, data) =>
  http.post(`/plugins/szse/json_answer/${qid}`, data);

export const saveAnswerStatus = (qid, data) =>
  http.post(`/plugins/szse/json_answer/status/${qid}`, data);

export const fetchComplianceFiles = (params) =>
  http.get('/plugins/szse/files', { params });

export const addComplianceProject = (data) =>
  http.post(`/plugins/szse/files`, data);

export const deleteComplianceProject = (id) =>
  http.delete(`/plugins/szse/files/${id}`);

export const updateFileRuleStatus = (ruleResultId, data) =>
  http.put(`/plugins/szse/rule_results/${ruleResultId}`, data);
