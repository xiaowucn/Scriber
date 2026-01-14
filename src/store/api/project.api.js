import { http } from './http';

export const fetchProjects = (params) =>
  http.get('/plugins/fileapi/project', { params });

export const fetchProject = (id) => http.get(`/plugins/fileapi/project/${id}`);

export const saveProject = (data) =>
  http.post('/plugins/fileapi/project', data);

export const updateProject = (id, data) =>
  http.put(`/plugins/fileapi/project/${id}`, data);

export const deleteProject = (id) =>
  http.delete(`/plugins/fileapi/project/${id}`);
