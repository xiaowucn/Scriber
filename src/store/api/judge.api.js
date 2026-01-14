import { http_v2 } from './http';

export const getJudgeResults = (file_id) =>
  http_v2.get(`/files/${file_id}/judge-results`);

export const updateJudgeResults = (file_id, data) =>
  http_v2.put(`/files/${file_id}/judge-results`, data);

export const refreshSingleJudgeResults = (file_id, result_id) =>
  http_v2.post(`/files/${file_id}/judge-results/${result_id}`, null, {
    timeout: 0,
  });

export const updateSingleJudgeResults = (file_id, result_id, data) =>
  http_v2.post(`/files/${file_id}/judge-results/${result_id}`, data, {
    timeout: 0,
  });

export const getAuditAndLLMStatus = (file_id) =>
  http_v2.get(`/files/${file_id}/audit-status`);

export const getResultRecords = (result_id) =>
  http_v2.get(`/judge-results/${result_id}/records`);
