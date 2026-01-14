import { hkexQuestion as hkexQuestionApi } from '../api';
const state = {
  fileMeta: {},
  ruleScore: {},
  ruleMergeData: {
    type: 0,
  },
  isLoading: false,
  ruleHistoryList: [],
};
const getters = {
  fileMeta: (state) => state.fileMeta,
  ruleScore: (state) => state.ruleScore,
  isLoading: (state) => state.isLoading,
  ruleMergeData: (state) => state.ruleMergeData,
  ruleHistoryList: (state) => state.ruleHistoryList,
};
const mutations = {
  SET_RULE_PROCESS: (state, data) => {
    state.ruleScore = data;
  },
  SET_QUESTION_META: (state, data) => {
    state.fileMeta = data;
  },
  SET_LOADING: (state, isLoading) => {
    state.isLoading = isLoading;
  },
  SET_RULEMERGEDATA: (state, ruleMergeData) => {
    state.ruleMergeData = ruleMergeData;
  },
  SET_RULE_HISTORY_LIST: (state, list) => {
    state.ruleHistoryList = list;
  },
};
const actions = {
  async fetchQuestionMeta({ commit }, { questionId, params }) {
    const response = await hkexQuestionApi.fetchQuestionMeta(
      questionId,
      params,
    );
    const metaData = {
      ...response.data[0],
      stock_code_type: response.data[0].stock_code.startsWith('08')
        ? 'GEM'
        : 'MB',
    };
    commit('SET_QUESTION_META', metaData);
  },
  async fetchScoreSummary({ commit }, { stockCode, reportYear }) {
    const response = await hkexQuestionApi.fetchScoreSummary(
      stockCode,
      reportYear,
    );
    commit('SET_RULE_PROCESS', response.data);
  },
  async getRuleMergeDetailData(
    { commit },
    { stockCode, reportYear, rule, yearEnd },
  ) {
    const response = await hkexQuestionApi.fetchRuleMergeDetail(
      stockCode,
      reportYear,
      rule,
      yearEnd,
    );
    if (!response.data.items) {
      response.data.items = [];
    }
    commit('SET_RULEMERGEDATA', response.data);
  },
  async fetchQuestionMetaByQuery(context, { reportYear, stockCode, dt }) {
    return await hkexQuestionApi.fetchQuestionMetaByQuery(
      reportYear,
      stockCode,
      dt,
    );
  },
  async getRuleHistoryList({ commit }, { stockCode, reportYear, delist }) {
    const response = await hkexQuestionApi.fetchRuleHistory(
      stockCode,
      reportYear,
      delist,
    );
    commit('SET_RULE_HISTORY_LIST', response.data);
  },
  async flagOrMarkAnnualReport(context, { markStatus, questionId }) {
    await hkexQuestionApi.flagOrMarkAnnualReport(markStatus, questionId);
  },
  async fetchAnnualReportMarkedStatus(context, { questionId }) {
    const res = await hkexQuestionApi.fetchAnnualReportMarkedStatus(questionId);
    return res.data;
  },
  async fetchExchangeVersionMeta(context, { stockCode, reportYear }) {
    const res = await hkexQuestionApi.fetchExchangeVersionMeta(
      stockCode,
      reportYear,
    );
    return res;
  },
  async fetchRuleDetails(context, { rule, qid, delist }) {
    const res = await hkexQuestionApi.fetchRuleDetails(rule, qid, delist);
    return res.data;
  },
  async saveRuleDetails(context, { rule, qid, data }) {
    const res = await hkexQuestionApi.saveRuleDetails(rule, qid, data);
    return res;
  },
  async fetchQuestionMetaData(context, params) {
    const res = await hkexQuestionApi.fetchQuestionMetaData(params);
    return res.data;
  },
  async fetchPDFDocument(context, { url, onDownloadProgress }) {
    return await hkexQuestionApi.fetchPDFDocument(url, onDownloadProgress);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
