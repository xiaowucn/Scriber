import { http, http_v2 } from './http';
import featuresPerimeter from '@/perimeters/features.perimeter';

/**
 * 获取指定文件规则审核结果
 */
export const fetchFileAuditRuleResult = (fileId, schemaId) => {
  return http.get(
    `/plugins/inspector/files/${fileId}/schemas/${schemaId}/results`,
  );
};

/**
 * 获取文件审核状态
 */
export const fetchFileAuditStatus = (fileId) => {
  return http.get(`/plugins/fileapi/files/${fileId}/audit-status`);
};

/**
 * 修改规则审核结果
 */
export const updateAuditRuleResult = ({ fileId, schemaId, data }) => {
  return http.put(
    `/plugins/inspector/files/${fileId}/schemas/${schemaId}/results`,
    data,
  );
};

/**
 * 导出规则审核结果
 */
export const exportAuditRuleResult = ({ fileId, schemaId }) => {
  return http.get(
    `/plugins/inspector/files/${fileId}/schemas/${schemaId}/export-result`,
    {
      responseType: 'blob',
    },
  );
};

/**
 * 导出批注文件
 */
export const exportAuditRuleComment = ({ fileId, schemaId, params }) => {
  return http.get(
    `/plugins/inspector/files/${fileId}/schemas/${schemaId}/export-comment`,
    {
      params,
      responseType: 'blob',
    },
  );
};

/**
 * 获取规则审核变更记录
 */
export const fetchAuditRuleResultRecords = ({ resultId }) => {
  return http.get(`/plugins/cgs/result/${resultId}/records`);
};

/**
 * 获取合并schema后的答案
 */
export const fetchMergedAnswerData = ({ fileId }) => {
  if (featuresPerimeter.supportLLMExtract()) {
    return http_v2.get(`/files/${fileId}/answer-data`);
  }
  return http.get(`/plugins/inspector/files/${fileId}/answer_data`);
};

/**
 * 保存schema字段的答案
 */
export const saveMergedAnswerData = ({ fileId, answerData }) => {
  if (featuresPerimeter.supportLLMExtract()) {
    return http_v2.post(`/files/${fileId}/answer-data`, answerData);
  }
  return http.post(
    `/plugins/inspector/files/${fileId}/answer_data`,
    answerData,
  );
};
