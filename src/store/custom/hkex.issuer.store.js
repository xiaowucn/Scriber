import { hkexIssuer as issuerApi } from '../api';

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async fetchIssuerHeader(context, { stockCode, dt }) {
    const response = await issuerApi.fetchIssuerHeader(stockCode, dt);
    return response;
  },
  async fetchIssuerBody(context, { stockCode }) {
    const response = await issuerApi.fetchIssuerBody(stockCode);
    return response;
  },
  async fetchResultsAnnouncementAnalysisByIssuer(context, { stockCode }) {
    const response =
      await issuerApi.fetchResultsAnnouncementAnalysisByIssuer(stockCode);
    return response;
  },
  async exportIssuer(context, { stockCode, params }) {
    const res = await issuerApi.exportIssuer(stockCode, params);
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
