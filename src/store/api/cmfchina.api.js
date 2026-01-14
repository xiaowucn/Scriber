import { http, http_v2, uploadTimeout } from './http';

export const fetchProjects = (params) =>
  http.get('/plugins/cmfchina/projects', { params });

export const fetchSummary = (projectId, params) => {
  return http.get(`/plugins/cmfchina/project/${projectId}/summary`, {
    params,
  });
};

// 上传文件
export const uploadFile = ({ treeId, data, onUploadProgress }) =>
  http.post(`/plugins/cmfchina/trees/${treeId}/file`, data, {
    onUploadProgress,
    timeout: uploadTimeout,
  });

// 上传压缩文件
export const uploadZipBySSE = ({
  treeId,
  data,
  onUploadProgress,
  onDownloadProgress,
}) =>
  http.post(`/plugins/cmfchina/trees/${treeId}/sse`, data, {
    responseType: 'text',
    onUploadProgress,
    onDownloadProgress,
    timeout: uploadTimeout,
  });

export const fetchFiles = (treeId, params) =>
  http.get(`/plugins/cmfchina/trees/${treeId}`, { params });

export const searchFiles = (projectId, params) =>
  http.get(`/plugins/cmfchina/projects/${projectId}/files`, { params });

export const searchScene = (params) =>
  http.get('/plugins/cmfchina/schemas', { params });

export const fetchSceneRelationModels = (id, params) =>
  http.get(`/plugins/cmfchina/schemas/${id}/models`, { params });

export const fetchModels = (params) =>
  http.get('/plugins/cmfchina/models', { params });

export const sceneRelationModels = ({ schemaId, modelId }, data) =>
  http.put(`/plugins/cmfchina/schemas/${schemaId}/models/${modelId}`, data);

export const enableModels = (moldId, modelId, params) =>
  http.post(
    `/plugins/cmfchina/schemas/${moldId}/models/${modelId}`,
    {},
    { params },
  );

export const createdModels = (data) =>
  http.post(`/plugins/cmfchina/models`, data);

export const updateModels = (id, data) =>
  http.put(`/plugins/cmfchina/models/${id}`, data);

export const deleteModels = (id) =>
  http.delete(`/plugins/cmfchina/models/${id}`);

export const fetchModelsFiles = (id, params) =>
  http.get(`/plugins/cmfchina/models/${id}/files`, { params });

export const uploadModelsFiles = (id, data) =>
  http.post(`/plugins/cmfchina/models/${id}/files`, data);

export const deleteModelsFiles = (model_id, fid) =>
  http.delete(`/plugins/cmfchina/models/${model_id}/files/${fid}`);

// 获取 inspect 页面的答案
export const fetchInspectAnswerData = (id) => {
  return http_v2.get(`/cmfchina/files/${id}/answer_data`);
};

// 保存 inspect 页面的答案
export const saveInspectAnswerData = (id, answerData) => {
  return http_v2.post(`/cmfchina/files/${id}/answer_data`, answerData);
};

// 获取 inspect 页面的审核规则
export const fetchInspectRuleResults = (id) => {
  return http.get(`/plugins/cmfchina/files/${id}/results`);
};

// 获取规则
export const fetchRules = (params) => {
  return http.get('/plugins/cmfchina/rules', { params });
};

// 新建规则
export const createRule = (data) => {
  return http.post('/plugins/cmfchina/rules', data);
};

// 修改规则
export const updateRule = (id, data) => {
  return http.post(`/plugins/cmfchina/rules/${id}`, data);
};

// 获取分类文件
export const fetchFiledFile = (params) =>
  http.get('/plugins/cmfchina/filed-files', { params });

// 上传分类文件
export const uploadFiledFile = ({ data, onUploadProgress }) =>
  http.post('/plugins/cmfchina/filed-files', data, {
    onUploadProgress,
    timeout: uploadTimeout,
  });

// 上传分类压缩文件
export const uploadFiledZipFile = ({
  data,
  onUploadProgress,
  onDownloadProgress,
}) =>
  http.post('/plugins/cmfchina/filed-files/sse', data, {
    responseType: 'text',
    onUploadProgress,
    onDownloadProgress,
    timeout: uploadTimeout,
  });

// 删除分类文件
export const deleteFiledFile = (data) =>
  http.delete('/plugins/cmfchina/filed-files', { data });

// 重跑分类
export const reFiledFile = (data) =>
  http.post('/plugins/cmfchina/filed-files/execute', data);

// 获取分类代码
export const fetchFiledCode = (params) =>
  http.get('/plugins/cmfchina/filed-code', { params });

// 上传分类代码
export const uploadFiledCode = (data) =>
  http.post('/plugins/cmfchina/filed-code', data);

// 获取验证文件
export const fetchVerifyFile = (fid) =>
  http.get(`plugins/cmfchina/files/${fid}/status`);

// 上传验证文件
export const uploadVerifyFile = (data) =>
  http.post('/plugins/cmfchina/verify-filed', data);

// 获取已关联场景的文件
export const fetchSenceFiles = (params) =>
  http.get('/plugins/cmfchina/files', { params });

// 现有文件验证分类
export const verifyFile = (fid) =>
  http.get(`/plugins/cmfchina/files/${fid}/verify-filed`);

// 上传文件验证分类
export const verifyUploadFile = (params) =>
  http.get('/plugins/cmfchina/verify-filed', { params });

export const fetchPanorama = (data) =>
  http.post(`/plugins/cmfchina/panorama`, data);

export const exportPanoramaData = (data) =>
  http.post('/plugins/cmfchina/training_data', data);

export const fetchPanoramaVisibleFields = (moldId, params) =>
  http.get(`/plugins/cmfchina/molds/${moldId}/check-fields`, { params });

export const updatePanoramaVisibleFields = (moldId, data) =>
  http.post(`/plugins/cmfchina/molds/${moldId}/check-fields`, data);

export const review = (data) => http.post(`/plugins/cmfchina/review`, data);

// 调用统计
export const fetchCallStatistics = (params) =>
  http.get('/plugins/cmfchina/model-usage', { params });

// 业务统计
export const fetchBusinessStatistics = (params) =>
  http.get('/plugins/cmfchina/review', { params });

// 准确率统计
export const fetchAccuracyStatistics = (params) => {
  return http.get('/plugins/cmfchina/model-accuracy', { params });
};

// 获取业务组
export const fetchBusinessGroups = (params) => {
  return http.get('/plugins/cmfchina/groups', { params });
};

// 获取用户的业务组
export const fetchUserBusinessGroups = (params) => {
  return http.get(`/plugins/cmfchina/user/groups`, { params });
};

// 创建业务组
export const createBusinessGroup = (data) => {
  return http.post('/plugins/cmfchina/groups', data);
};

// 修改业务组
export const updateBusinessGroup = (id, data) => {
  return http.put(`/plugins/cmfchina/groups/${id}`, data);
};

// 删除业务组
export const deleteBusinessGroup = (id) => {
  return http.delete(`/plugins/cmfchina/groups/${id}`);
};

// 获取项目树
export const fetchProjectsTree = (params) => {
  return http.get('/plugins/cmfchina/catalog', { params });
};

// 新建项目
export const createProject = (data) => {
  return http.post('/plugins/cmfchina/projects', data);
};

// 修改项目
export const updateProject = (id, data) => {
  return http.put(`/plugins/cmfchina/projects/${id}`, data);
};

// 新建文件夹
export const createCatalog = (id, data) => {
  return http.post(`/plugins/cmfchina/trees/${id}/tree`, data);
};

// 修改文件夹
export const updateCatalog = (id, data) => {
  return http.put(`/plugins/cmfchina/trees/${id}`, data);
};

// 获取场景
export const fetchScene = (id, params) => {
  return http.get(`/plugins/cmfchina/molds/${id}`, { params });
};

// 新建场景
export const createScene = (data) => {
  return http.post('/plugins/cmfchina/molds', data);
};

// 修改场景
export const updateScene = (id, data) => {
  return http.put(`/plugins/cmfchina/molds/${id}`, data);
};

// 获取项目关联的业务组
export const fetchProjectBusinessGroups = (id, params) => {
  return http.get(`/plugins/cmfchina/projects/${id}`, { params });
};

// 获取文件夹关联的业务组
export const fetchCatalogBusinessGroups = (id, params) => {
  return http.get(`/plugins/cmfchina/trees/${id}/info`, { params });
};

// 获取场景关联的业务组
export const fetchSceneBusinessGroups = (id, params) => {
  return http.get(`/plugins/cmfchina/molds/${id}`, { params });
};

// 导入场景
export const importSchema = (data) => {
  return http.post(`/plugins/cmfchina/molds/import`, data);
};

// 覆盖场景
export const coverSchema = (id, data) => {
  return http.post(`/plugins/cmfchina/molds/${id}`, data);
};

// 导出场景
export const exportSchema = (id, params) => {
  return http.get(`/plugins/cmfchina/molds/${id}/export`, { params });
};

// 获取邮箱配置列表
export const fetchEmailConfigList = (params) => {
  return http.get('/plugins/cmfchina/emails', { params });
};

// 新增邮箱配置
export const createEmailConfig = (data) => {
  return http.post('/plugins/cmfchina/emails', data);
};

// 修改邮箱配置
export const updateEmailConfig = (id, data) => {
  return http.put(`/plugins/cmfchina/emails/${id}`, data);
};

// 删除邮箱配置
export const deleteEmailConfig = (id) => {
  return http.delete(`/plugins/cmfchina/emails/${id}`);
};

// 获取AB比对推送地址
export const fetchAbPushUrl = (id) => {
  return http_v2.get(`/cmfchina/molds/${id}/ab-compare`);
};

// 保存AB比对推送地址
export const saveAbPushUrl = (id, data) => {
  return http_v2.post(`/cmfchina/molds/${id}/ab-compare`, data);
};

// 获取置信度
export const fetchProbabilities = (moldId, params) => {
  return http_v2.get(`/cmfchina/molds/${moldId}/probabilities`, { params });
};

// 修改置信度阈值
export const updateFieldProbability = (id, data) => {
  return http_v2.post(`/cmfchina/fields/${id}/probability`, data);
};
