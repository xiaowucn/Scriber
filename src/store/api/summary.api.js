import { http } from './http';

export const fetchSummary = (projectId, params) => {
  return http.get(`/plugins/fileapi/project/${projectId}/summary`, { params });
};
