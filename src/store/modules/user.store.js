import { cloneDeep } from 'lodash';
import { user as userApi } from '../api';

const USER_MODEL = {
  id: -1,
  name: '',
  password: '',
  note: '',
  expired_utc: null,
  permission: [],
};

const state = {
  users: {
    isLoading: false,
    items: [],
    current: null,
  },
  pager: {
    page: 1,
    size: 20,
    total: 0,
  },
  params: {},
};

const getters = {
  users: (state) => state.users,
  isLoading: (state) => state.users.isLoading,
  userPermissions: (state, getters, rootGetters) => {
    const { configuration } = rootGetters;

    const commonuserPermissions = configuration.common_permissions || {};
    const addtionaluserPermissions = configuration.additional_permissions || {};
    const basicPerms = configuration.basic_permissions || [];

    const allPerms = { ...commonuserPermissions, ...addtionaluserPermissions };

    return Object.keys(allPerms).map((key) => ({
      value: key,
      label: allPerms[key].name,
      desc: allPerms[key].definition,
      basic: basicPerms.includes(key),
    }));
  },
  pager: (state) => state.pager,
  params: (state) => state.params,
};

const mutations = {
  SET_LOADING: (state, isLoading) => {
    state.users.isLoading = isLoading;
  },
  SET_USERS: (state, users) => {
    state.users.items = users;
  },
  SET_USER_PAGER: (state, pager) => {
    state.pager = pager;
  },
  SET_USER_PARAMS: (state, params) => {
    state.params = params;
  },
  SET_CUR_USER: (state, user) => {
    state.users.current = cloneDeep(user);
  },
  SET_EMPTY_USER: (state) => {
    state.users.current = cloneDeep(USER_MODEL);
  },
};

const actions = {
  async fetchUsers({ state, commit }) {
    let params = {
      ...state.params,
      page: state.pager.page,
      size: state.pager.size,
    };
    const users = await userApi.fetchUsers(params);
    commit('SET_USERS', users.data.items);
    let pager = {
      page: users.data.page,
      size: users.data.size,
      total: users.data.total,
    };
    commit('SET_USER_PAGER', pager);
  },
  async persistUser({ rootGetters, dispatch }, { userData }) {
    const body = {
      name: userData.name,
      password: userData.password,
      note: userData.note,
      expired_utc: userData.expired_utc,
      permission:
        userData.permission && userData.permission.map((e) => ({ perm: e })),
    };
    if (userData.id === -1) {
      await userApi.saveUser(body);
    } else {
      await userApi.updateUser(userData.id, body);
      const userId = rootGetters['loginUser'].id;
      if (userData.id === userId) {
        await dispatch('getUserInfo');
      }
    }
    dispatch('fetchUsers');
  },
  async deleteUser({ dispatch }, { id }) {
    await userApi.deleteUser(id);
    dispatch('fetchUsers');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
