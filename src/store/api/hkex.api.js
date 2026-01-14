import { http, http_v2 } from './http';

export const fetchProgressSummary = (params) => {
  return http.get('/plugins/hkex/progress_summary', { params });
};

export const fetchFlaggedData = (params) => {
  return http.get('/plugins/hkex/total_flagged', { params });
};

export const fetchDocumentData = (params) => {
  return http.get('/plugins/hkex/document_display', { params });
};

export const fetchDocumentFlows = (params) => {
  return http.get('/plugins/hkex/doc_flows', { params });
};

export const fetchDocumentSummary = (params) => {
  return http.get('/plugins/hkex/doc_disp_summary', { params });
};

export const uploadAnnualReport = (data) => {
  return http.post('/plugins/hkex/self_upload', data);
};

export const fetchLatestAnnualReport = (params) => {
  return http.get('/plugins/hkex/latest_ar', { params });
};

export const fetchReportYears = (params) => {
  return http.get('/plugins/hkex/dashboard_condition', { params });
};

export const fetchTeamIDs = (params) => {
  return http.get('/plugins/hkex/team_ids', { params });
};

// 上传Excel更新上市公司信息
export const updateCompanies = (data) => {
  return http.post('/plugins/hkex/companies', data);
};

export const fetchQuarterReports = (stockCode, reportYear, params) => {
  return http.get(
    `/plugins/hkex/stocks/${stockCode}/years/${reportYear}/quarter_reports`,
    { params },
  );
};

export const fetchQuestionRatioCheck = (qid, params) => {
  return http.get(`/plugins/hkex/questions/${qid}/ratio_check`, { params });
};

export const quoteRatioCheckAIData = (qid, ratio) => {
  return http.get(`/plugins/hkex/questions/${qid}/ratio_check_ai/${ratio}`);
};

export const removeQuestionRatioManualData = (qid, ratio) => {
  return http.delete(`/plugins/hkex/questions/${qid}/formulas`, {
    params: { ratio },
  });
};

export const generateRatioFormula = (qid, data) => {
  return http.put(`/plugins/hkex/questions/${qid}/ratio_check`, data);
};

export const fetchQuestionDisclosureCheck = (qid, params) => {
  return http.get(`/plugins/hkex/questions/${qid}/disclosure_check`, {
    params,
  });
};

export const updateQuestionDisclosureCheck = (qid, rule, data) => {
  return http.put(
    `/plugins/hkex/questions/${qid}/disclosure_check?rule=${rule}`,
    data,
  );
};

export const fetchRatioPredictPosition = (qid, key) => {
  return http.get(
    `/plugins/hkex/questions/${qid}/crude_answers?attr_key=${key}`,
  );
};

export const fetchUsers = (params) => {
  return http.get('/plugins/hkex/users', { params });
};

export const addUser = (data) => {
  return http.post('/plugins/hkex/users', data);
};

export const editUser = (id, data) => {
  return http.put(`/plugins/hkex/users/${id}`, data);
};

export const exportUsers = (params) => {
  return http.get('/plugins/hkex/user/export', {
    params,
  });
};

export const downloadActivityLog = (params) => {
  return http.get('/plugins/hkex/history', {
    params,
  });
};

export const fetchReportReviewHistoryLog = (params) => {
  return http.get('/plugins/hkex/review_history', { params });
};

export const predictPosition = (qid, key, params) => {
  return http.get(
    `/plugins/fileapi/file/${qid}/prompt/${encodeURIComponent(key)}`,
    {
      params,
    },
  );
};

export const fetchAuditTrailLogs = (params) => {
  return http_v2.get('/logs', { params });
};

export const fetchAuditTrailActiveUsers = (params) => {
  return http_v2.get('/logs/active-users', { params });
};

export const fetchAuditTrailStatistics = (params) => {
  return http_v2.get('/logs/statistics', { params });
};

export const fetchRatio4Info = (fileId, params) => {
  return http_v2.get(`/files/${fileId}/ratio4`, { params });
};

export const fetchFileAdditionData = (qid, rule, params) => {
  return http_v2.get(`/questions/${qid}/${rule}/fundraising-activity`, {
    params,
  });
};

export const fetchAgmMeta = (fid, params) => {
  return http_v2.get(`/agm/${fid}/meta`, { params });
};

export const fetchAgmDirectors = (params) => {
  return http_v2.get('/agm/directors', { params });
};

export const fetchAgmDocFlows = (params) => {
  return http_v2.get('/agm/doc_flows', { params });
};

export const fetchAgmDocs = (params) => {
  return http_v2.get('/agm/docs', { params });
};

export const fetchAgmRuleSummary = (params) => {
  return http_v2.get('/agm/stat_by_rule', { params });
};

export const fetchAgmIssuer = (params) => {
  return http_v2.get('/agm/stat_by_issuer', { params });
};

export const fetchPollDocFlows = (params) => {
  return http_v2.get('/poll/doc_flows', { params });
};

export const fetchPollMeta = (params) => {
  return http_v2.get('/poll/poll_meta', { params });
};

export const fetchPollDocs = (params) => {
  return http_v2.get('/poll/docs', { params });
};

export const fetchPollRuleSummary = (params) => {
  return http_v2.get('/poll/stat_by_rule', { params });
};

export const fetchPollIssuer = (params) => {
  return http_v2.get('/poll/stat_by_issuer', { params });
};

export const fetchEsgSpecialRuleAnswer = (qid, params) => {
  return http_v2.get(`/esg/${qid}/answers`, { params });
};

export const updateEsgSpecialRuleAnswer = (qid, data, params) => {
  return http_v2.put(`/esg/${qid}/answer`, data, { params });
};

export const fetchRuleQid = (fid, params) => {
  return http_v2.get(`/files/${fid}/rules`, { params });
};

export const fetchNDDRDataByMonth = (params) => {
  return http_v2.get('/nddr/by-month', { params });
};

export const fetchNDDRDataByDay = (params) => {
  return http_v2.get('/nddr/by-day', { params });
};

export const fetchPollGmlAnswer = (qid) => {
  return http_v2.get(`/poll/gml/${qid}/answer`);
};

export const submitPollGmlAnswer = (qid, data, params) => {
  return http_v2.put(`/poll/gml/${qid}/answer`, data, { params });
};

export const fetchPollGmlPrompt = (qid, params) => {
  return http_v2.get(`/poll/gml/${qid}/prompt`, { params });
};
