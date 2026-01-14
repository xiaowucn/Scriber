import { http, http_v2, uploadTimeout } from './http';

export const fetchAllFiles = (projectId, params) =>
  http.get(`/plugins/fileapi/project/${projectId}/file`, { params });

export const searchFile = (params) =>
  http.get('/plugins/fileapi/file/search', { params });

export const fetchFilesByStatus = (projectId, params) =>
  http.get(`/plugins/fileapi/project/${projectId}/file`, { params });

export const searchKeyword = (fileId, keyword) =>
  http.get(`/plugins/fileapi/file/${fileId}/search?keyword=${keyword}`);

export const fetchRecordHistory = (fileId) =>
  http.get(`/plugins/fileapi/file/${fileId}/history`);

export const fetchFilePageInfo = (fileId) =>
  http.get(`/plugins/fileapi/file/${fileId}/pageinfo`);

export const fetchFileOutline = (fileId) =>
  http.get(`/plugins/fileapi/file/${fileId}/chapter-info`);

export const downloadDocxFile = (fileId) =>
  http.get(`/plugins/fileapi/file/${fileId}/docx`, { responseType: 'blob' });

export const downloadOriginFile = (fileId, from) =>
  http.get(`/plugins/fileapi/file/${fileId}`, {
    responseType: 'blob',
    headers: from ? { 'X-Trigger-Source': from } : undefined,
  });

export const uploadFile = ({ treeId, data, onUploadProgress }) =>
  http.post(`/plugins/fileapi/tree/${treeId}/file`, data, {
    onUploadProgress,
    timeout: uploadTimeout,
  });

export const uploadZipBySSE = ({
  treeId,
  data,
  onUploadProgress,
  onDownloadProgress,
}) =>
  http.post(`/plugins/fileapi/trees/${treeId}/sse`, data, {
    responseType: 'text',
    onUploadProgress,
    onDownloadProgress,
    timeout: uploadTimeout,
  });

/**
 * 重跑文件解析/预测/审核
 * @param {Number} fileId 文件ID
 * @param {Number} task 可选值: pdfinsight/preset/inspect, 分别对应: 解析/预测/审核
 */
export const rerunFile = (fileId, task) =>
  http.get(`/plugins/fileapi/files/${fileId}/run`, {
    params: {
      task,
    },
  });

// 深交所自然语言处理平台 --标注任务列表
export const fetchSZSELabelFiles = (params) =>
  http.get('/szse_file', { params });

export const batchDeleteFiles = (data) =>
  http.post('/plugins/fileapi/files/delete', data);

// 重新（批量）预测/审核: data.task 可选值: predict | inspect
export const predictFiles = (data) => {
  return http.post('/plugins/fileapi/files/execute', data);
};

// 批量导出答案数据
export const batchExportAnswerData = (projectId, data) => {
  return http_v2.post(`/projects/${projectId}/export-answer-data`, data);
};

// 获取导出答案数据任务列表
export const fetchExportAnswerDataTasks = (projectId, params) => {
  return http_v2.get(`/projects/${projectId}/export-answer-data`, { params });
};

// 删除导出答案数据任务
export const deleteExportAnswerDataTask = (projectId, taskId) => {
  return http_v2.delete(`/projects/${projectId}/export-answer-data/${taskId}`);
};

// 下载导出答案
export const downloadExportAnswerData = (projectId, taskId) => {
  return http_v2.get(`/projects/${projectId}/download-answer-data/${taskId}`);
};
