import { http } from './http';

/**
 * 获取项目列表
 */
export const fetchProjects = (params) =>
  http.get(`/plugins/zts/projects`, { params });

/**
 * 获取文件列表
 */
export const fetchFiles = (params) =>
  http.get(`/plugins/zts/projects/files`, { params });

/**
 * 获取审核结果
 */
export const fetchResults = (pid) =>
  http.get(`/plugins/zts/projects/${pid}/results`);

/**
 * 获取规则信息
 */
export const fetchRuleInfo = (params) =>
  http.get(`/plugins/zts/rule_info`, { params });

/**
 * 保存修改后的答案
 */
export const saveAnswerData = (pid, answerData) =>
  http.post(`/plugins/zts/projects/${pid}/answer_data`, answerData);
