import { nafmii as nafmiiApi, detail as detailApi } from '../api';
import _ from 'lodash';
import { convertObjectValueToNumber } from '@/utils';

const state = {
  menu: {
    activeItem: {
      key: 'project',
      label: '',
    },
  },
  breadCrumbData: [],
  dataKnowledges: {
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
    sortParams: {},
    searchParams: {},
  },
  tasks: {
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
    files: [],
    isLoading: false,
    sortParams: {},
    searchParams: {},
    current: null,
    selected: [],
  },
};

const getters = {
  menu: (state) => state.menu,
  breadCrumbData: (state) => state.breadCrumbData,
  dataKnowledges: (state) => state.dataKnowledges,
  tasks: (state) => state.tasks,
};

const mutations = {
  SET_ACTIVE_MENU_ITEM: (state, item) => {
    state.menu.activeItem = item;
  },
  SET_BREAD_CRUMB_DATA: (state, data) => {
    state.breadCrumbData = data;
  },
  SET_DATA_KNOWLEDGES_PAGER: (state, pager) => {
    state.dataKnowledges.pager = pager;
  },
  SET_DATA_KNOWLEDGES_SORT_PARAMS: (state, params) => {
    state.dataKnowledges.sortParams = params;
  },
  SET_DATA_KNOWLEDGES_SEARCH_PARAMS: (state, params) => {
    state.dataKnowledges.searchParams = params;
  },
  SET_TASKS: (state, files) => {
    state.tasks.files = files;
  },
  SET_TASKS_PAGER: (state, pager) => {
    state.tasks.pager = pager;
  },
  SET_TASKS_LOADING: (state, isLoading) => {
    state.tasks.isLoading = isLoading;
  },
  SET_TASKS_SORT_PARAMS: (state, params) => {
    state.tasks.sortParams = params;
  },
  SET_TASKS_SEARCH_PARAMS: (state, params) => {
    state.tasks.searchParams = convertObjectValueToNumber(params);
  },
  SET_CURRENT_TASKS: (state, file) => {
    state.tasks.current = file;
  },
  SET_SELECTED_TASKS: (state, rows) => {
    state.tasks.selected = rows;
  },
};

const actions = {
  async getTasks(
    { commit, state },
    { needLoading, isAuto } = { needLoading: true },
  ) {
    try {
      if (needLoading) {
        commit('SET_TASKS_LOADING', true);
      }
      const res = await nafmiiApi.fetchTasks(
        _.omit(
          {
            ...state.tasks.pager,
            ...state.tasks.sortParams,
            ...state.tasks.searchParams,
          },
          'total',
        ),
        isAuto,
      );
      let tasks = res.items;
      const pager = {
        ...state.tasks.pager,
        total: res.total,
      };
      tasks = tasks.map((file) => {
        file.fileType = file.name;
        file.isDir = false;
        file.download = detailApi.getFileDownloadUrl(file.id);
        return file;
      });
      commit('SET_TASKS', tasks);
      commit('SET_TASKS_PAGER', pager);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (needLoading) {
        commit('SET_TASKS_LOADING', false);
      }
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
