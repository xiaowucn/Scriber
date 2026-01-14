import { cloneDeep } from 'lodash';
import {
  project as projectApi,
  citicsDCM as citicsDCMApi,
  cmfchina as cmfchinaApi,
  nafmii as nafmiiApi,
} from '../api';
import platformPerimeter from '@/perimeters/platform.perimeter';

const PROJECT_MODEL = {
  id: -1,
  name: '',
  isPublic: 1, // 0-私密 1-公共
  group_ids: [],
};

const state = {
  projects: {
    isLoading: false,
    items: [],
    current: null,
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
  },
  projectSortParams: {},
  projectSearchParams: {},
};

const getters = {
  projects: (state) => state.projects,
  projectSortParams: (state) => state.projectSortParams,
  projectSearchParams: (state) => state.projectSearchParams,
};

const mutations = {
  SET_LOADING: (state, isLoading) => {
    state.projects.isLoading = isLoading;
  },
  SET_PROJECTS: (state, projects) => {
    state.projects.items = projects.slice();
  },
  SET_PROJECTS_PAGER: (state, pager) => {
    state.projects.pager = pager;
  },
  SET_CUR_PROJECT: (state, projects) => {
    state.projects.current = cloneDeep(projects);
  },
  SET_EMPTY_PROJECT: (state) => {
    state.projects.current = cloneDeep(PROJECT_MODEL);
  },
  SET_PROJECTS_SORT_PARAMS: (state, params) => {
    state.projectSortParams = params;
  },
  SET_PROJECTS_SEARCH_PARAMS: (state, params) => {
    state.projectSearchParams = params;
  },
};

const actions = {
  async fetchProjects({ commit, state }, { canSearch = false } = {}) {
    let params = {
      page: state.projects.pager.page,
      size: state.projects.pager.size,
    };
    if (canSearch) {
      params = {
        ...params,
        ...state.projectSortParams,
        ...state.projectSearchParams,
      };
    }
    let projects = {};
    if (platformPerimeter.isCiticsDCMEnv()) {
      projects = await citicsDCMApi.fetchProjects(params);
    } else if (platformPerimeter.isCmfchinaEnv()) {
      projects = await cmfchinaApi.fetchProjects(params);
    } else if (platformPerimeter.isNafmiiEnv()) {
      projects = await nafmiiApi.fetchProjects(params);
    } else {
      projects = await projectApi.fetchProjects(params);
    }
    const pager = {
      page: projects.data.page,
      size: projects.data.size,
      total: projects.data.total,
    };
    // 兼容无分页的数据格式
    const data = projects.data.items || projects.data;
    let items = {};
    if (platformPerimeter.isCmfchinaEnv() || platformPerimeter.isNafmiiEnv()) {
      items = data;
    } else {
      items = data.sort((file1, file2) => {
        return file1.id < file2.id ? 1 : -1;
      });
    }
    commit('SET_PROJECTS', items);
    commit('SET_PROJECTS_PAGER', pager);
  },
  async persistProject({ dispatch }, { projectData, isPublic, defaultMolds }) {
    const body = {
      name: projectData.name,
      default_molds: defaultMolds,
    };
    if (projectData.comment) {
      body.comment = projectData.comment;
    }
    if (platformPerimeter.isCmfchinaEnv()) {
      body.group_ids = projectData.group_ids;
    }
    if (projectData.id === -1) {
      body.is_public = isPublic;
      if (platformPerimeter.isNafmiiEnv()) {
        await nafmiiApi.saveProject(body);
      } else if (platformPerimeter.isCmfchinaEnv()) {
        await cmfchinaApi.createProject(body);
      } else {
        await projectApi.saveProject(body);
      }
    } else {
      if (platformPerimeter.isNafmiiEnv()) {
        body.is_public = isPublic;
        await nafmiiApi.updateProject(projectData.id, body);
      } else if (platformPerimeter.isCmfchinaEnv()) {
        await cmfchinaApi.updateProject(projectData.id, body);
      } else {
        body.permission = isPublic === 0 ? 'private' : 'public';
        await projectApi.updateProject(projectData.id, body);
      }
    }
    dispatch('fetchProjects', { canSearch: true });
  },
  async deleteProject({ dispatch }, { id }) {
    await projectApi.deleteProject(id);
    dispatch('fetchProjects', { canSearch: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
