import { http } from './http';
export const fetchAuditAnswer = (fileId, params) => {
  return http.get(`/plugins/cmbchina/files/${fileId}/audit-answer`, { params });
};

export const submitAnswer = (qid, data) => {
  return http.post(`/plugins/cmbchina/questions/${qid}/submit`, data);
};
