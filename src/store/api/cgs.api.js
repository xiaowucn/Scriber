import { http, baseURL } from './http';

/**
 * 获取目录下所有的文件（夹）
 */
export const fetchFileList = (treeId, params = { page: 1, size: 20 }) =>
  http.get(`/plugins/cgs/tree/${treeId}`, { params });

export const searchFile = (params) =>
  http.get('/plugins/cgs/project/0/file', { params });

/**
 * 获取文件列表
 */
export const fetchFilesByStatus = (projectId, params) => {
  return http.get(`/plugins/cgs/project/${projectId}/file`, { params });
};

/**
 * 导出批注文件
 */
export const exportAuditRuleComment = ({ fileId, schemaId, params }) => {
  return http.get(
    `/plugins/cgs/files/${fileId}/schemas/${schemaId}/export-comment`,
    {
      params,
      responseType: 'blob',
    },
  );
};

/**
 * 获取回收站的pid和tree_id
 * @param {Number} projectId 项目id
 */
export const getTrashProjectInfo = (projectId, params) => {
  return http.get(`/plugins/cgs/projects/${projectId}/trash`, params);
};

/**
 * 放入回收站/从回收站还原
 * @param {Number} projectId 项目id
 * @param {Number} file_id 文件id
 * @param {Number} tree_id 文件夹id
 * @param {Boolean} abandon 放入回收站
 * @param {Boolean} restore 从回收站还原
 * 传参规则: file_id 与 tree_id 二选一, abandon 与 restore 二选一
 */
export const trashOrRestoreFile = (projectId, params) => {
  return http.put(`/plugins/cgs/projects/${projectId}/trash`, params);
};

/**
 * 将勾选的文件发送到calliper系统进行比对
 */
export const diffFiles = (data) => {
  return http.post(`/plugins/diff/calliper/diff/upload`, data);
};

/**
 * 获取研发规则 (银河证券)
 */
export const fetchDevelopedRuleList = (params) => {
  return http.get(`/plugins/cgs/dev-rules`, { params });
};

export const getReviewFields = (fileId) =>
  http.get(`plugins/cgs/files/${fileId}/review_fields`);

export const fetchCleanFileInfo = (fileId) =>
  http.get(`plugins/cgs/clean-files/${fileId}/info`);

export const getCleanFileDownloadUrl = (fileId, docType) =>
  `${baseURL}/plugins/cgs/clean-files/${fileId}?doc_type=${docType}`;

export const downloadBidMatches = ({ fileId }) => {
  return http.get(`/plugins/cgs/files/${fileId}/bid-matches/download`, {
    responseType: 'blob',
  });
};
