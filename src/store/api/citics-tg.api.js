import { http } from './http';

export const fetchEciticSchema = (params) =>
  http.get('/plugins/ecitic/mold', { params });

export const fetchSchemaItems = (params) =>
  http.get('/plugins/ecitic/schema-items', { params });

export const fetchParaMappingList = (params) =>
  http.get('/plugins/ecitic/para/mappings', { params });

export const createParaMapping = (data) =>
  http.post('/plugins/ecitic/para/mappings', data);

export const editParaMapping = (id, data) =>
  http.put(`/plugins/ecitic/para/mappings/${id}`, data);

export const deleteParaMapping = (id) =>
  http.delete(`/plugins/ecitic/para/mappings/${id}`);

export const fetchTemplateList = (params) =>
  http.get('/plugins/ecitic/templates', { params });

export const createTemplate = (data) =>
  http.post('/plugins/ecitic/templates', data);

export const editTemplate = (id, data) =>
  http.put(`/plugins/ecitic/templates/${id}`, data);

export const deleteTemplate = (id) =>
  http.delete(`/plugins/ecitic/templates/${id}`);

export const fetchBusinessGroups = () =>
  http.get('/plugins/ecitic/business-groups');

export const fetchPushConfigs = (params) =>
  http.get('/plugins/ecitic/push/configs', { params });

export const createPushConfig = (data) =>
  http.post('/plugins/ecitic/push/configs', data);

export const editPushConfig = (id, data) =>
  http.put(`/plugins/ecitic/push/configs/${id}`, data);

export const deletePushConfig = (id) =>
  http.delete(`/plugins/ecitic/push/configs/${id}`);

export const fetchProductTypes = () =>
  http.get('/plugins/ecitic/product-types');

export const fetchProjects = (params) =>
  http.get('/plugins/ecitic/projects/search', { params });

export const uploadFileToProject = (treeId, data) =>
  http.post(`/plugins/ecitic/tree/${treeId}/file`, data);

export const fetchFileList = (treeId, params) =>
  http.get(`/plugins/ecitic/trees/${treeId}`, { params });

export const searchFile = (params) =>
  http.get(`/plugins/ecitic/files`, { params });

export const updateFile = (id, data) =>
  http.put(`/plugins/ecitic/files/${id}`, data);

export const getMappingConvert = (qid) =>
  http.get(`/plugins/ecitic/para/mappings/convert/${qid}`);

export const compareQuestion = (qid, params) =>
  http.post(`/plugins/ecitic/question/${qid}/diff`, {}, { params });

export const fetchCompareDataById = (compre_id) =>
  http.get(`/plugins/ecitic/compare_records/${compre_id}/results`);

export const parameterPush = (qid, params) =>
  http.post(`/plugins/ecitic/question/${qid}/push`, {}, { params });

export const fetchPushRecords = (params) =>
  http.get(`/plugins/ecitic/push/records`, { params });

export const deletePushRecord = (id) =>
  http.put(`/plugins/ecitic/push/records/${id}`);

export const rePushRecord = (id, data) =>
  http.post(`/plugins/ecitic/push/records/${id}`, data);

export const fetchModelStatistics = () =>
  http.get(`/plugins/ecitic/model_statistics`);

export const fetchAllFiles = (params) =>
  http.get(`/plugins/ecitic/projects/files`, { params });

export const fetchFileCompareRecords = (id, params) =>
  http.get(`/plugins/ecitic/files/${id}/compare_records`, { params });

export const fetchProjectPushedFields = (pid) =>
  http.get(`/plugins/ecitic/projects/${pid}/pushed/fields`);

export const fetchProjectAnswersByTemplatesFields = (pid, params) =>
  http.get(`/plugins/ecitic/projects/${pid}/templates/field`, { params });

export const fetchFilesbyId = (id) => http.get(`/plugins/ecitic/files/${id}`);

export const fetchFileAdditionalAnswer = (id) =>
  http.get(`/plugins/ecitic/files/${id}/additional_answer`);
