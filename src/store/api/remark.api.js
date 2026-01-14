import pako from 'pako';
import { http, http_v2 } from './http';
import store from '@/store';

/**
 * 获取题目
 * @param {Number} qid
 */
export const fetchQuestion = (qid) => http.get(`/question/id/${qid}`);

/**
 * 获取对比题目
 * @param {Number} qid
 * @param {Number} standardQid
 */
export const fetchDiffQuestion = (qid, standardQid) => {
  return http.get(`/plugins/diff/question/${qid}/diff`, {
    params: {
      standard_qid: standardQid,
    },
  });
};

/**
 * 获取box的文本
 * @param {Number} fileId
 * @param {Object} data
 * @param {Boolean} isWithBox
 */
export const fetchBoxText = (fileId, data, isWithBox) => {
  let baseUrl = `/plugins/fileapi/file/${fileId}/text_in_box`;
  let url = !isWithBox ? baseUrl : `${baseUrl}?with_box=true`;
  return http.post(url, data);
};

/**
 * 获取表格标注数据
 * @param {Number} qid
 * @param {Number} key
 * @param {Object} data
 */
export const fetchBoxContentForTable = (qid, key, data) =>
  http.post(`/question/${qid}/association?key=${key}`, data, {
    timeout: 10 * 60e3,
  });

/**
 * 提交题目答案
 * @param {Number} qid
 * @param {Object} data
 * @param {Number} type
 * @param {Boolean} isExportAnswer 是否为 导出的答案
 */
export const sendQuestionAnswer = (qid, data, type, isExportAnswer) => {
  const url = isExportAnswer
    ? `/question/${qid}/answer?save_data_only=${type}&is_export_answer=${isExportAnswer}`
    : `/question/${qid}/answer?save_data_only=${type}`;

  // 对过长的请求正文做gzip压缩
  // 当编码后字符串内容长度<1000时不启用压缩（内容过小，压缩后内容反而会增大）
  let headers = {};
  let answerData = data;
  if (store.getters.configuration.encoding_gzip) {
    answerData = JSON.stringify(answerData);
    if (encodeURIComponent(answerData).length > 1000) {
      headers = { 'Content-Encoding': 'gzip' };
      answerData = pako.gzip(answerData);
    }
  }
  return http.post(url, answerData, { headers });
};

export const RestartPredictAnswer = (qid, data) =>
  http.post(`/question/${qid}/confirm`, data);

/**
 * 设置正确答案
 */
export const saveCorrectAnswer = ({ uid, qid }) =>
  http.post(`/question/${qid}/markcorrect/${uid}`);

/**
 * 更新答案的schema
 */
export const updateAnswerSchema = (qid, data) =>
  http.put(`/question/${qid}/answer_schema`, data);

/**
 * 预测节点位置
 */
export const predictPosition = (qid, key, params) => {
  return http.get(
    `/plugins/fileapi/question/${qid}/prompt/${encodeURIComponent(key)}`,
    {
      params,
    },
  );
};

/**
 * 推送到AutoDoc
 */
export const pushToAutodoc = (fileId) =>
  http.post(`/plugins/rule/doc/${fileId}/recheck`);

/**
 * 导出用户答案或预测答案
 */
export const exportAnswers = (qid, answerType) =>
  http.get(`/question/${qid}/answer/json`, { params: { which: answerType } });

/**
 * 补充一级字段答案
 */
export const supplementSchemaAnswers = async (qid, data) => {
  let headers = {};
  let answerData = data;
  if (store.getters.configuration.encoding_gzip) {
    // 对过长的请求正文做gzip压缩
    answerData = JSON.stringify(answerData);
    if (encodeURIComponent(answerData).length > 1000) {
      headers = { 'Content-Encoding': 'gzip' };
      answerData = pako.gzip(answerData);
    }
  }
  return http.post(`/question/${qid}/answer_assist`, answerData, { headers });
};

/**
 * 标题内容辅助功能
 */
export const fetchRemarkAnswerByChapterAssist = (question, data) =>
  http.post(`/question/${question}/chapter_assist`, data);

/**
 * 删除自定义字段
 */
export const deleteCustomField = (qid, md5) =>
  http.delete(`/questions/${qid}/custom_fields/${md5}`);

/**
 * 批量删除自定义字段
 */
export const batchDeleteCustomFields = (qid, md5List) =>
  http.delete(`/questions/${qid}/custom_fields`, {
    data: {
      md5_list: md5List,
    },
  });

/**
 * 保存答案（中信建投-八爪鱼）
 */
export const saveCscOctopusAnswer = (data) => {
  return http.post(`/plugins/csc_octopus/files/confirm`, data);
};

/**
 * 下载转义结果
 */
export const downloadSpecialAnswer = (qid) => {
  return http.get(`/question/${qid}/special_answer`, { responseType: 'blob' });
};

/**
 * 获取归档/历史答案
 */
export const getArchivedAnswers = (qid, params) => {
  return http_v2.get(`/questions/${qid}/answers/archived`, { params });
};

/**
 * 导出文档提取答案结果
 */ export const exportAnswerResult = (fileId) => {
  return http_v2.get(`/files/${fileId}/answer-result`);
};
