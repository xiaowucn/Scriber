import { http } from './http';

export const fetchProjects = (params) =>
  http.get('/plugins/ecitic/projects', { params });

export const addProject = (data) => http.post('/plugins/ecitic/projects', data);

export const deleteProject = (id) =>
  http.delete(`/plugins/ecitic/projects/${id}`);

export const fetchSupportedReportTypes = () =>
  http.get('/plugins/ecitic/supported_report_types');

export const fetchProjectDetails = (id, params) =>
  http.get(`/plugins/ecitic/questions/${id}/answer`, { params });

export const exportProjectDetails = (id, params) =>
  http.get(`/plugins/ecitic/questions/${id}/answer`, {
    params,
    responseType: 'blob',
  });

export const saveProjectDetails = (id, data) =>
  http.post(`/plugins/ecitic/questions/${id}/answer`, data);

export const fetchFilePageInfo = (fileId) =>
  http.get(`/plugins/ecitic/files/${fileId}/pageinfo`);

export const fetchFileOutline = (fileId) =>
  http.get(`/plugins/ecitic/files/${fileId}/chapter-info`);
