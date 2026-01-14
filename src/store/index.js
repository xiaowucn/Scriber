import Vue from 'vue';
import Vuex from 'vuex';

import projectModule from './modules/project.store';
import summaryModule from './modules/summary.store';
import userModule from './modules/user.store';
import detailModule from './modules/detail.store';
import fileModule from './modules/file.store';
import remarkModule from './modules/remark.store';
import schemaModule from './modules/schema.store';
import scenariosModule from './modules/scenarios.store';
import ruleCheckModule from './modules/rule-check.store';
import ruleAuditModule from './modules/rule-audit.store';
import tagModule from './modules/tag.store';
import hkexModule from './custom/hkex.store';
import cscModule from './custom/csc.store';
import htModule from './custom/ht.store';
import citicsTgModule from './custom/citics-tg.store';
import citicsDcmModule from './custom/citics-dcm.store';
import ztsDisclosureModule from './custom/zts.disclosure.store';
import cmfchinaModule from './custom/cmfchina.store';
import nafmiiModule from './custom/nafmii.store';

import { user as userApi, configuration as configurationApi } from './api';
import platformPerimeter from '../perimeters/platform.perimeter';

Vue.use(Vuex);

const state = {
  count: 0,
  menu: {
    // 默认选中第一个“项目管理”页面
    activeIndex: 'project',
  },
  user: {},
  configuration: {},
  systemAuthExpired: false,
  needEncrypt: false,
  configHeader: {},
};

const getters = {
  menuActiveIndex: (state) => state.menu.activeIndex,
  projects: (state) => state.projectModule.projects,
  tags: (state) => state.tagModule.tags,
  loginUser: (state) => state.user,
  configuration: (state) =>
    Object.assign(state.configHeader, state.configuration),
  systemAuthExpired: (state) => state.systemAuthExpired,
  needEncrypt: (state) => state.needEncrypt,
};

const mutations = {
  CHANGE_MENUACTIVE: (state, activeIndex) => {
    state.menu.activeIndex = activeIndex;
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  SET_CONFIG_HEADER: (state, data) => {
    state.configHeader = data || {};
  },
  SET_CONFIGURATION: (state, configuration) => {
    Object.keys(configuration).forEach((key) => {
      Vue.set(state.configuration, key, configuration[key]);
    });
  },
  SET_SYSTEM_AUTH_EXPIRED: (state, isExpired) => {
    state.systemAuthExpired = isExpired;
  },
  SET_NEED_ENCRYPT: (state, needEncrypt) => {
    state.needEncrypt = needEncrypt;
  },
};

const actions = {
  async login({ commit, dispatch }, { name, password }) {
    commit('SET_SYSTEM_AUTH_EXPIRED', false);
    await userApi.login({ name, password });
    await dispatch('getUserInfo');
    await dispatch('getConfig');
  },
  async logout({ commit }) {
    const res = await userApi.logout();
    commit('SET_USER', {});
    return res;
  },
  async getConfig({ commit }) {
    const res = await configurationApi.fetchConfig();
    if (!res) {
      return;
    }
    commit('SET_CONFIGURATION', res.data || {});
  },
  async getUserInfo({ commit }) {
    const res = await userApi.fetchUserInfo();
    if (!res) {
      return;
    }
    const perms = res.data.perm.map((item) => item.perm);
    const userInfo = {
      ...res.data,
      perm: perms,
    };
    commit('SET_USER', userInfo);
  },
  async getAccessToken() {
    return await userApi.getAccessToken();
  },
};
const modules = {
  projectModule,
  summaryModule,
  userModule,
  detailModule,
  fileModule,
  remarkModule,
  schemaModule,
  scenariosModule,
  ruleCheckModule,
  ruleAuditModule,
  cscModule,
  tagModule,
  htModule,
  citicsTgModule,
  citicsDcmModule,
  ztsDisclosureModule,
  cmfchinaModule,
  nafmiiModule,
};

if (platformPerimeter.isHkexEnv()) {
  Object.assign(modules, {
    hkexModule,
  });
}
export default new Vuex.Store({
  strict: import.meta.env.DEV,
  modules,
  state,
  getters,
  mutations,
  actions,
});
