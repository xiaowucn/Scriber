import { cloneDeep } from 'lodash';
import {
  summary as summaryApi,
  cmfchina as cmfchinaApi,
  nafmii as nafmiiApi,
} from '../api';
import platformPerimeter from '@/perimeters/platform.perimeter';

const state = {
  summary: {
    data: {},
  },
};

const getters = {
  summary: (state) => state.summary,
  totalFiles: (state) => state.summary.data.total_file,
  totalPages: (state) => state.summary.data.total_page,
  totalQuestions: (state) => state.summary.data.total_question,
  tagCompleted: (state) => state.summary.data.marked,
  conflicts: (state) => state.summary.data.conflicted,
  finishedQuestions: (state) => state.summary.data.finished,
  predicting: (state) => state.summary.data.predicting,
  predicted: (state) => state.summary.data.predicted,
  users: (state) => state.summary.data.users,
};

const mutations = {
  SET_SUMMARY: (state, summary) => {
    state.summary.data = cloneDeep(summary);
  },
};

const actions = {
  async fetchSummary({ commit }, { projectId, params }) {
    let fetchSummaryAPI = summaryApi.fetchSummary;
    if (platformPerimeter.isCmfchinaEnv()) {
      fetchSummaryAPI = cmfchinaApi.fetchSummary;
    }
    if (platformPerimeter.isNafmiiEnv() && params.isTask) {
      fetchSummaryAPI = nafmiiApi.fetchSummary;
    }
    delete params.isTask;
    const res = await fetchSummaryAPI(projectId, params);

    if (res.data) {
      commit('SET_SUMMARY', res.data);
    } else {
      commit('SET_SUMMARY', res);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
