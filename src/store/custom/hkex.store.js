import reportReviewStore from './hkex.question.store';
import ruleStore from './hkex.rule.store';
import issuerStore from './hkex.issuer.store';

import {
  fetchProgressSummary,
  fetchDocumentData,
  fetchDocumentSummary,
  uploadAnnualReport,
  fetchFlaggedData,
  fetchLatestAnnualReport,
  fetchReportYears,
  fetchTeamIDs,
  fetchDocumentFlows,
  fetchQuarterReports,
  fetchQuestionRatioCheck,
  quoteRatioCheckAIData,
  removeQuestionRatioManualData,
  generateRatioFormula,
  fetchQuestionDisclosureCheck,
  updateQuestionDisclosureCheck,
  fetchRatioPredictPosition,
  fetchUsers,
  addUser,
  editUser,
  exportUsers,
  downloadActivityLog,
  fetchReportReviewHistoryLog,
} from '@/store/api/hkex.api';

const state = {
  reportYear: '',
  auditType: 'qr',
  hasUnsubmitChange: false,
  isDelisted: false,
};

const getters = {
  reportYear: (state) => state.reportYear,
  auditType: (state) => state.auditType,
  hasUnsubmitChange: (state) => state.hasUnsubmitChange,
  isDelisted: (state) => state.isDelisted,
};

const mutations = {
  SET_REPORT_YEAR: (state, year) => {
    state.reportYear = year;
  },
  SET_AUDIT_TYPE: (state, type) => {
    state.auditType = type;
  },
  SET_HAS_UNSUBMIT_CHANGE: (state, data) => {
    state.hasUnsubmitChange = data;
  },
  SET_IS_DELISTED: (state, isDelisted) => {
    state.isDelisted = isDelisted;
  },
};

const actions = {
  async fetchProgressSummary(context, params) {
    const res = await fetchProgressSummary(params);
    return res.data;
  },
  async uploadAnnualReport(context, data) {
    const res = await uploadAnnualReport(data);
    return res.data;
  },
  async fetchDocumentData(context, params) {
    const res = await fetchDocumentData(params);
    return res.data;
  },
  async fetchDocumentSummary(context, params) {
    const res = await fetchDocumentSummary(params);
    return res.data;
  },
  async fetchFlaggedData(context, params) {
    const res = await fetchFlaggedData(params);
    return res.data;
  },
  async fetchLatestAnnualReport(context, params) {
    const res = await fetchLatestAnnualReport(params);
    return res.data;
  },
  async fetchReportYears(context, params) {
    const res = await fetchReportYears(params);
    return res.data;
  },
  async fetchTeamIDs(context, params) {
    const res = await fetchTeamIDs(params);
    return res.data;
  },
  async fetchDocumentFlows(context, params) {
    const res = await fetchDocumentFlows(params);
    return res.data;
  },
  async fetchQuarterReports(context, { stockCode, reportYear, params }) {
    const res = await fetchQuarterReports(stockCode, reportYear, params);
    return res.data;
  },
  async fetchQuestionRatioCheck(context, { qid, params }) {
    const res = await fetchQuestionRatioCheck(qid, params);
    return res.data;
  },
  async quoteRatioCheckAIData(context, { qid, ratio }) {
    const res = await quoteRatioCheckAIData(qid, ratio);
    return res.data;
  },
  async removeQuestionRatioManualData(context, { qid, ratio }) {
    const res = await removeQuestionRatioManualData(qid, ratio);
    return res.data;
  },
  async generateRatioFormula(context, { qid, data }) {
    const res = await generateRatioFormula(qid, data);
    return res.data;
  },
  async fetchQuestionDisclosureCheck(context, { qid, params }) {
    const res = await fetchQuestionDisclosureCheck(qid, params);
    return res.data;
  },
  async updateQuestionDisclosureCheck(context, { qid, rule, data }) {
    const res = await updateQuestionDisclosureCheck(qid, rule, data);
    return res.data;
  },
  async fetchRatioPredictPosition({ commit }, { qid, key, label }) {
    let resp = await fetchRatioPredictPosition(qid, key);
    commit('remarkModule/SET_PREDICT_POSITION', resp.data, {
      root: true,
    });
    commit('remarkModule/SET_PREDICT_LABEL', label, {
      root: true,
    });
  },

  // User Management
  async fetchUsers(context, params) {
    const res = await fetchUsers(params);
    return res.data;
  },
  async addUser(context, data) {
    const res = await addUser(data);
    return res.data;
  },
  async editUser(context, { id, data }) {
    const res = await editUser(id, data);
    return res.data;
  },
  async exportUsers(context, params) {
    const res = await exportUsers(params);
    return res;
  },
  async downloadActivityLog(context, params) {
    const res = await downloadActivityLog(params);
    return res;
  },
  async fetchReportReviewHistoryLog(context, params) {
    const res = await fetchReportReviewHistoryLog(params);
    return res;
  },
};

export default {
  namespaced: true,
  modules: {
    reportReviewModule: reportReviewStore,
    ruleModule: ruleStore,
    issuerModule: issuerStore,
  },
  state,
  getters,
  mutations,
  actions,
};
