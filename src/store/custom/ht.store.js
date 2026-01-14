import { ht as htApi } from '../api';
import _ from 'lodash';

const state = {
  statistics: {
    sum: [],
    items: [],
  },
  departments: [],
  template: {
    items: [],
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
  },
  isShowWrongOnly: false,
  fileRules: [],
  fileRuleResult: [],
  selectedRuleName: 'all',
  exportErrors: [],
};

const getters = {
  statistics: (state) => state.statistics,
  docStatisticsList: (state) => state.docStatisticsList,
  departments: (state) => state.departments,
  template: (state) => state.template,
  isShowWrongOnly: (state) => state.isShowWrongOnly,
  fileRules: (state) => state.fileRules,
  fileRuleResult: (state) => {
    const key = state.selectedRuleName;
    const fileRuleResultCloned = _.cloneDeep(state.fileRuleResult);
    if (state.isShowWrongOnly) {
      let fileRuleResultByWrong = null;
      if (key === 'all') {
        fileRuleResultByWrong = fileRuleResultCloned;
      } else {
        fileRuleResultByWrong = fileRuleResultCloned.filter(
          (rule) => rule.name === key,
        );
      }
      fileRuleResultByWrong.forEach((item) => {
        item.rules = item.rules.filter((rule) => rule.result === 1);
      });
      return fileRuleResultByWrong;
    } else {
      if (key === 'all') {
        return state.fileRuleResult;
      } else {
        return state.fileRuleResult.filter((rule) => rule.name === key);
      }
    }
  },
  exportErrors: (state) => state.exportErrors,
};

const mutations = {
  SET_FILE_RULES: (state, data) => {
    state.fileRules = data;
  },
  SET_SELECTED_RULE_NAME: (state, data) => {
    state.selectedRuleName = data;
  },
  SET_FILE_RULE_RESULT: (state, data) => {
    state.fileRuleResult = data;
  },
  SET_FILE_RULE_RESULT_FILTER_OPTIONS: (state, data) => {
    state.isShowWrongOnly = data;
  },
  SET_STATISTICS: (state, data) => {
    state.statistics = data;
  },
  SET_DEPARTMENTS: (state, data) => {
    state.departments = data;
  },
  SET_TEMPLATES: (state, items) => {
    state.template.items = items;
  },
  SET_TEMPLATE_PAGER: (state, pager) => {
    state.template.pager = pager;
  },
  SET_EXPORT_ERRORS: (state, data) => {
    state.exportErrors = data;
  },
};

const actions = {
  async fetchStatistics(
    { commit },
    { condition, startTime, endTime, departmentId, isExport },
  ) {
    const res = await htApi.fetchStatistics(
      condition,
      startTime,
      endTime,
      departmentId,
      isExport,
    );
    commit('SET_STATISTICS', res.data);
  },
  async fetchDepartments({ commit }) {
    const res = await htApi.fetchDepartments();
    commit('SET_DEPARTMENTS', res.data);
  },
  async fetchTemplates({ state, commit }) {
    const res = await htApi.fetchTemplates(state.template.pager);
    const pager = {
      page: res.data.page || 1,
      size: res.data.size || 20,
      total: res.data.total || 0,
    };
    commit('SET_TEMPLATES', res.data.items);
    commit('SET_TEMPLATE_PAGER', pager);
  },
  async uploadTemplate({ dispatch }, { data }) {
    await htApi.uploadTemplate(data);
    dispatch('fetchTemplates');
  },
  downloadTemplate(context, { id }) {
    return htApi.downloadTemplate(id);
  },
  async deleteTemplate({ dispatch }, { id }) {
    await htApi.deleteTemplate(id);
    dispatch('fetchTemplates');
  },
  async fetchFileRuleResult({ commit }, { fileId, schemaId }) {
    const res = await htApi.fetchFileRuleResult(fileId, schemaId);
    const rules = res.data.rules_order;
    const ruleRes = res.data.rule_res;
    const ruleResult = [];
    for (let i = 0; i < rules.length; i++) {
      const ruleItem = {};
      ruleItem.name = rules[i];
      ruleItem.rules = ruleRes[rules[i]] || [];
      ruleResult.push(ruleItem);
    }
    commit('SET_FILE_RULES', rules);
    commit('SET_FILE_RULE_RESULT', ruleResult);
  },
  async updateRuleStatus(context, { ruleResultId, data }) {
    const res = await htApi.updateRuleStatus(ruleResultId, data);
    return res;
  },
  async annotatedDocument(context, fileId) {
    const res = await htApi.annotatedDocument(fileId);
    return res;
  },
  async downloadAnnotatedDocument(context, fileId) {
    const res = await htApi.downloadAnnotatedDocument(fileId);
    return res;
  },
  async reportError(context, data) {
    const res = await htApi.reportError(data);
    return res;
  },
  async exportErrors({ commit }, { startTime, endTime }) {
    const res = await htApi.exportErrors(startTime, endTime);
    commit('SET_EXPORT_ERRORS', res);
    return res;
  },
  async recheckRules(context, { fileId, data }) {
    const res = await htApi.recheckRules(fileId, data);
    return res;
  },
  async convertAmountInCase(context, { amount, schemaCol, qid }) {
    const res = await htApi.convertAnswerAmount(amount, schemaCol, qid);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
