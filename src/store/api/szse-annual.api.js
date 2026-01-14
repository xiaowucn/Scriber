import { http, baseURL } from './http';

export const fetchCompany = (params) =>
  http.get('/plugins/szse/annual_report/company', { params });

export const fetchProjectInfo = (projectID) =>
  http.get(`/plugins/szse/annual_report/project/${projectID}`);

export const updateProjectInfo = (projectID, data) =>
  http.post(`/plugins/szse/annual_report/project/${projectID}`, data);

export const fetchProjectAuditDetails = (projectID) =>
  http.get(`/plugins/szse/annual_report/project/${projectID}/result`);

export const updateProjectAuditItemInfo = (id, data) =>
  http.post(`/plugins/szse/annual_report/result/${id}`, data);

export const submitPreviewProject = (projectID, data) =>
  http.post(`/plugins/szse/annual_report/project/${projectID}/pre`, data);

export const submitReviewProject = (projectID, data) =>
  http.post(`/plugins/szse/annual_report/project/${projectID}/review`, data);

export const fetchProjectAllQuiry = (projectID) =>
  http.get(`/plugins/szse/annual_report/project/${projectID}/question`);

export const fetchProjectAuditItemQuiry = (chapterID) =>
  http.get(`/plugins/szse/annual_report/result/${chapterID}/question`);

export const createProjectAuditItemQuiry = (chapterID, data) =>
  http.post(`/plugins/szse/annual_report/result/${chapterID}/question`, data);

export const updateProjectAuditItemQuiry = (quiryID, data) =>
  http.post(`/plugins/szse/annual_report/question/${quiryID}`, data);

export const deleteProjectAuditItemQuiry = (quiryID) =>
  http.delete(`/plugins/szse/annual_report/question/${quiryID}`);

export const getExportAllQuiry = (projectID) =>
  `${baseURL}/plugins/szse/annual_report/project/${projectID}/question/blob`;

export const fetchProjectAuditSubItemQuiry = (chapterID) =>
  http.get(`/plugins/szse/annual_report/sub_result/${chapterID}/question`);

export const createProjectAuditSubItemQuiry = (chapterID, data) =>
  http.post(
    `/plugins/szse/annual_report/sub_result/${chapterID}/question`,
    data,
  );

export const updateProjectAuditSubItemInfo = (id, data) =>
  http.post(`/plugins/szse/annual_report/sub_result/${id}`, data);
