import { hkexRule as ruleApi } from '../api';

const state = {
  rules: [],
};

const getters = {
  rules: (state) => state.rules,
};

const mutations = {
  SET_RULES(state, rules) {
    state.rules = rules;
  },
};

const actions = {
  async fetchRules({ commit }, params) {
    const res = await ruleApi.fetchRules(params);
    commit('SET_RULES', res.data);
    return res;
  },
  async fetchRuleSummary(context, { ruleCode, newList }) {
    const res = await ruleApi.fetchRuleSummary(ruleCode, newList);
    return res;
  },
  async fetchAnnouncementRules(context, params) {
    const res = await ruleApi.fetchAnnouncementRules(params);
    return res;
  },
  async fetchAnnouncementRatioRules(context, params) {
    const res = await ruleApi.fetchAnnouncementRatioRules(params);
    return res;
  },
  async fetchAnnouncementRuleSummary(context, params) {
    const res = await ruleApi.fetchAnnouncementRuleSummary(params);
    return res;
  },
  async exportRule(context, { params, onDownloadProgress, signal }) {
    const res = await ruleApi.exportRule(params, onDownloadProgress, signal);
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
