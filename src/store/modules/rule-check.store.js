import { ruleCheck as ruleCheckApi } from '../api';

const state = {
  fileRules: [],
  fileRuleResult: {},
  selectedRuleName: 'all',
};

const getters = {
  fileRules: (state) => state.fileRules,
  fileRuleResult: (state) => {
    const key = state.selectedRuleName;
    if (key === 'all') {
      return state.fileRuleResult;
    } else {
      return state.fileRuleResult.filter((rule) => rule.name === key);
    }
  },
};

const mutations = {
  SET_SELECTED_RULE_NAME: (state, data) => {
    state.selectedRuleName = data;
  },
  SET_FILE_RULES: (state, data) => {
    state.fileRules = data;
  },
  SET_FILE_RULE_RESULT: (state, data) => {
    state.fileRuleResult = data;
  },
};

const actions = {
  async fetchFileRuleResult({ commit }, fileId) {
    const res = await ruleCheckApi.fetchFileRuleResult(fileId);
    const rules = res.data.rules_order;
    const ruleRes = res.data.rule_res;
    const ruleResult = [];
    for (let i = 0; i < rules.length; i++) {
      const ruleItem = {};
      ruleItem.name = rules[i];
      ruleItem.rules = ruleRes[rules[i]];
      ruleResult.push(ruleItem);
    }
    commit('SET_FILE_RULES', rules);
    commit('SET_FILE_RULE_RESULT', ruleResult);
  },
  async updateRuleStatus(context, { ruleResultId, data }) {
    const res = await ruleCheckApi.updateFileRuleStatus(ruleResultId, data);
    return res;
  },
  async fetchFileRuleSummary(context, fileId) {
    const res = await ruleCheckApi.fetchFileRuleSummary(fileId);
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
