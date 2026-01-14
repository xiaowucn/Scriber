import { http } from './http';

export const fetchTags = () => http.get('/plugins/ccxi/tags');

export const saveTag = (data) => http.post('/plugins/ccxi/tags', data);

export const updateTag = (id, data) =>
  http.put(`/plugins/ccxi/tag/${id}`, data);

export const deleteTag = (id) => http.delete(`/plugins/fileapi/tag/${id}`);
