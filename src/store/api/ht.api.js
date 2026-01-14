import { http, baseURL } from './http';

export const fetchStatistics = (
  condition,
  startTime,
  endTime,
  departmentId,
) => {
  let url = `/plugins/ht/ht_stat?group_by=${condition}&s_time=${startTime}&e_time=${endTime}`;
  if (condition === 'user' && departmentId !== null) {
    url = `${url}&department_id=${departmentId}`;
  }
  return http.get(url);
};

export const fetchDepartments = () => {
  return http.get('/department');
};

export const fetchTemplates = (params) => {
  return http.get(`/plugins/ht/template`, {
    params,
  });
};

export const uploadTemplate = (data) => {
  return http.post(`/plugins/ht/template`, data);
};

export const downloadTemplate = (id) => {
  return `${baseURL}/plugins/ht/template/${id}`;
};

export const deleteTemplate = (id) => {
  return http.delete(`/plugins/ht/template/${id}`);
};

/**
 * 获取指定文件合规检查结果
 */
export const fetchFileRuleResult = (fileId, schemaId) => {
  return http.get(`/plugins/ht/rule_results?fid=${fileId}&mid=${schemaId}`);
};

/**
 * 生成批注文档
 */
export const annotatedDocument = (fileId) => {
  return http.get(`/plugins/ht/annotated_document?fid=${fileId}`);
};

/**
 * 下载批注文档
 */
export const downloadAnnotatedDocument = (fileId) => {
  return `${baseURL}/plugins/ht/file/${fileId}/annotated`;
};

/**
 * 更新审核状态
 */
export const updateRuleStatus = (ruleResultsId, data) => {
  return http.put(`/plugins/ht/rule_results/${ruleResultsId}`, data);
};

/**
 * 报错
 */
export const reportError = (data) => {
  return http.post(`/plugins/ht/errors`, data);
};

/**
 * 导出报错
 */
export const exportErrors = (startTime, endTime) => {
  return http.get(
    `/plugins/ht/export_error?s_time=${startTime}&e_time=${endTime}`,
  );
};

/**
 * 下载报错文件
 */
export const downloadExportErrors = (startTime, endTime) => {
  return `${baseURL}/plugins/ht/export_error?s_time=${startTime}&e_time=${endTime}`;
};

/**
 * 重新审核规则
 */
export const recheckRules = (fileId, data) => {
  return http.put(`/plugins/ht/file/${fileId}/recheck`, data);
};

/**
 * 转换金额大小写
 * @param {String} amount 金额
 * @param {String} schemaCol 字段名
 */
export const convertAnswerAmount = (amount, schemaCol, qid) => {
  return http.get(
    `/plugins/ht/convert-amount?amount=${amount}&schema_col=${schemaCol}&qid=${qid}`,
  );
};
