import { http, http_v2, uploadTimeout } from './http';
const uploadTimeoutMessage =
  '文件服务器异常，文件上传失败，请联系文件服务管理员处理';

// 新建识别文件集
export const saveProject = (data) =>
  http.post('/plugins/nafmii/projects', data);

// 编辑识别文件
export const updateProject = (id, data) =>
  http.put(`/plugins/nafmii/projects/${id}`, data);

// 获取识别文件集列表
export const fetchProjects = (params, isAuto = false) =>
  http.get('/plugins/nafmii/projects', {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 上传文件
export const uploadFile = ({ treeId, data, onUploadProgress }) => {
  return http.post(`/plugins/nafmii/trees/${treeId}/files`, data, {
    onUploadProgress,
    timeout: uploadTimeout,
    timeoutMessage: uploadTimeoutMessage,
  });
};

// 上传压缩文件
export const uploadZipFile = ({
  treeId,
  data,
  onUploadProgress,
  onDownloadProgress,
}) =>
  http.post(`/plugins/nafmii/trees/${treeId}/zips`, data, {
    responseType: 'text',
    onUploadProgress,
    onDownloadProgress,
    timeout: uploadTimeout,
  });

// 获取文件列表
export const fetchFiles = (treeId, params, isAuto = false) =>
  http.get(`/plugins/nafmii/trees/${treeId}/files`, {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 删除文件
export const deleteFiles = (data, from) => {
  const headers = from ? { 'X-Trigger-Source': from } : undefined;
  return http.delete('/plugins/nafmii/files', { data, headers });
};

// 下载批注文件
export const downloadReviseFile = (fileId, from) =>
  http.get(`/plugins/nafmii/files/${fileId}/revise-file`, {
    headers: from ? { 'X-Trigger-Source': from } : undefined,
  });

// 在项目中搜索文件
export const searchFiles = (projectId, params, isAuto = false) =>
  http_v2.get(`/nafmii/projects/${projectId}/files`, {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 获取文件信息
export const getFileInfo = (fileId, from) => {
  return http.get(`/plugins/nafmii/files/${fileId}`, {
    headers: from ? { 'X-Trigger-Source': from } : undefined,
  });
};

// 获取要素答案
export const fetchAnswers = (fileId, isAuto = false) =>
  http.get(`/plugins/nafmii/files/${fileId}/answer`, {
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 修改要素答案
export const updateAnswers = (fileId, data) =>
  http.put(`/plugins/nafmii/files/${fileId}/answer`, data);

// 获取敏感词
export const fetchSensitiveWords = (params, isAuto = false) =>
  http.get('/plugins/nafmii/sensitive-words', {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 新建敏感词
export const saveSensitiveWords = (data) =>
  http.post('/plugins/nafmii/sensitive-words', data);

// 更新敏感词
export const updateSensitiveWords = (id, data) =>
  http.put(`/plugins/nafmii/sensitive-words/${id}`, data);

// 删除敏感词
export const deleteSensitiveWords = (id) =>
  http.delete(`/plugins/nafmii/sensitive-words/${id}`);

// 下载敏感词模板
export const downloadSensitiveWordsTemplate = () =>
  http.get('/plugins/nafmii/sensitive-words/file');

// 上传敏感词文件
export const uploadSensitiveWords = ({ data, onUploadProgress, signal }) => {
  return http.post('/plugins/nafmii/sensitive-words/file', data, {
    onUploadProgress,
    timeout: uploadTimeout,
    signal,
  });
};

// 获取敏感词类型
export const fetchSensitiveWordsTypes = () =>
  http.get('/plugins/nafmii/word-types');

// 获取归属系统
export const fetchSystems = () => http.get('/plugins/nafmii/systems');

// 获取数据知识
export const fetchDataKnowledge = (params, isAuto = false) =>
  http.get('/plugins/nafmii/knowledges', {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 新建数据知识
export const saveDataKnowledge = (data) =>
  http.post('/plugins/nafmii/knowledges', data);

// 更新数据知识
export const updateDataKnowledge = (id, data) =>
  http.put(`/plugins/nafmii/knowledges/${id}`, data);

// 删除数据知识
export const deleteDataKnowledge = (id) =>
  http.delete(`/plugins/nafmii/knowledges/${id}`);

// 获取数据知识类型
export const fetchDataKnowledgeTypes = () =>
  http.get('/plugins/nafmii/knowledge-types');

// 获取详细数据知识
export const fetchDataKnowledgeDetail = (id, params) =>
  http.get(`/plugins/nafmii/knowledges/${id}`, { params });

// 新建知识
export const saveKnowledge = ({ id, data, signal }) =>
  http.post(`/plugins/nafmii/knowledges/${id}/details`, data, {
    signal,
    timeout: 3 * 60e3,
  });

// 更新知识
export const updateKnowledge = ({ id, data, signal }) =>
  http.put(`/plugins/nafmii/knowledge-details/${id}`, data, {
    signal,
    timeout: 3 * 60e3,
  });

// 删除知识
export const deleteKnowledge = (id) =>
  http.delete(`/plugins/nafmii/knowledge-details/${id}`);

// 获取知识文件
export const fetchKnowledgeFile = (id) =>
  http.get(`/plugins/nafmii/knowledge-details/${id}/file`);

// 获取系统日志
export const fetchSystemLog = (params) =>
  http.get('/plugins/nafmii/events', { params });

// 导出系统日志
export const exportSystemLog = (params) =>
  http.get('/plugins/nafmii/events/export', {
    params,
    responseType: 'blob',
  });

// 获取识别任务
export const fetchTasks = (params, isAuto = false) =>
  http_v2.get('/nafmii/tasks', {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

// 上传识别任务
export const uploadTasks = ({ data, onUploadProgress }) => {
  return http_v2.post(`/nafmii/tasks`, data, {
    onUploadProgress,
    timeout: uploadTimeout,
    timeoutMessage: uploadTimeoutMessage,
  });
};

// 获取识别任务统计
export const fetchSummary = (params) => {
  return http_v2.get(`/nafmii/summary`, { params });
};

// 获取可用的文件类型
export const fetchFileTypes = () => {
  return http_v2.get(`/nafmii/file-types`);
};

// 重新（批量）识别/审核: data.task 可选值: predict | inspect
export const predictFiles = (data, from) => {
  return http_v2.post('/nafmii/files/execute', data, {
    headers: from ? { 'X-Trigger-Source': from } : undefined,
  });
};
