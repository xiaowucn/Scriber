import { http } from './http';

/**
 * 获取项目列表
 */
export const fetchProjects = (params) =>
  http.get('/plugins/ecitic_dcm/projects', { params });

/**
 * 修改项目
 */
export const updateProject = (pid, params) =>
  http.put(`/plugins/ecitic_dcm/projects/${pid}`, params);

/**
 * 获取文件列表
 */
export const fetchFileList = (fileid, params = { page: 1, size: 20 }) =>
  http.get(`/plugins/ecitic_dcm/trees/${fileid}`, { params });

/**
 * 搜索文件
 */
export const searchFile = (fileid, params) =>
  http.get(`/plugins/ecitic_dcm/trees/${fileid}`, { params });

/**
 * 修改文件
 */
export const updateFile = (fileid, params) =>
  http.put(`/plugins/ecitic_dcm/files/${fileid}`, params);

/**
 * 获取簿记数据关联关系
 */
export const fetchOrderRelatedData = (qid, params) =>
  http.get(`/plugins/ecitic_dcm/questions/${qid}/orders`, { params });

/**
 * 更新簿记数据关联关系
 */
export const updateOrderRelatedData = (qid, params) =>
  http.put(`/plugins/ecitic_dcm/questions/${qid}/orders`, params);
