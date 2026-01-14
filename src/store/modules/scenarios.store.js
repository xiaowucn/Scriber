import { laws as lawsApi } from '../api';

const state = {
  scenarios: {
    items: [],
    isLoading: false,
    lastFetchTime: null,
  },
};

const getters = {
  scenarios: (state) => state.scenarios,
  scenarioItems: (state) => state.scenarios.items,
  isLoading: (state) => state.scenarios.isLoading,
};

const mutations = {
  SET_SCENARIOS(state, scenarios) {
    state.scenarios.items = scenarios.reverse();
    state.scenarios.lastFetchTime = Date.now();
  },

  SET_LOADING(state, loading) {
    state.scenarios.isLoading = loading;
  },

  ADD_SCENARIO(state, scenario) {
    state.scenarios.items.unshift(scenario);
    state.scenarios.lastFetchTime = Date.now();
  },

  REMOVE_SCENARIO(state, scenarioId) {
    const index = state.scenarios.items.findIndex(
      (item) => item.id === scenarioId,
    );
    if (index !== -1) {
      state.scenarios.items.splice(index, 1);
      state.scenarios.lastFetchTime = Date.now();
    }
  },

  UPDATE_SCENARIO(state, updatedScenario) {
    const index = state.scenarios.items.findIndex(
      (item) => item.id === updatedScenario.id,
    );
    if (index !== -1) {
      state.scenarios.items.splice(index, 1, updatedScenario);
      state.scenarios.lastFetchTime = Date.now();
    }
  },

  CLEAR_SCENARIOS(state) {
    state.scenarios.items = [];
    state.scenarios.lastFetchTime = null;
  },
};

const actions = {
  /**
   * 获取应用场景列表
   * @param {Object} context - Vuex context
   * @param {Object} options - 选项
   * @param {boolean} options.force - 是否强制重新获取
   * @param {boolean} options.silent - 是否静默获取（不显示 loading）
   */
  async fetchScenarios(
    { commit, state },
    { force = false, silent = false } = {},
  ) {
    // 如果不是强制获取且已有数据，直接返回
    if (!force && state.scenarios.items.length > 0) {
      return state.scenarios.items;
    }

    try {
      if (!silent) {
        commit('SET_LOADING', true);
      }

      const scenarios = await lawsApi.getScenarios();
      commit('SET_SCENARIOS', scenarios);

      return scenarios;
    } catch (error) {
      console.error('获取应用场景失败:', error);
      throw error;
    } finally {
      if (!silent) {
        commit('SET_LOADING', false);
      }
    }
  },

  /**
   * 创建新的应用场景
   * @param {Object} context - Vuex context
   * @param {Object} scenarioData - 场景数据
   */
  async createScenario({ commit }, scenarioData) {
    try {
      const newScenario = await lawsApi.createScenarios(scenarioData);
      commit('ADD_SCENARIO', newScenario);
      return newScenario;
    } catch (error) {
      console.error('创建应用场景失败:', error);
      throw error;
    }
  },

  /**
   * 删除应用场景
   * @param {Object} context - Vuex context
   * @param {number} scenarioId - 场景ID
   */
  async deleteScenario({ commit }, scenarioId) {
    try {
      await lawsApi.deleteScenarios(scenarioId);
      commit('REMOVE_SCENARIO', scenarioId);
    } catch (error) {
      console.error('删除应用场景失败:', error);
      throw error;
    }
  },

  /**
   * 清空应用场景缓存
   * @param {Object} context - Vuex context
   */
  clearScenarios({ commit }) {
    commit('CLEAR_SCENARIOS');
  },

  /**
   * 获取单个应用场景（从缓存中查找）
   * @param {Object} context - Vuex context
   * @param {number} scenarioId - 场景ID
   */
  getScenarioById({ state }, scenarioId) {
    return state.scenarios.items.find((item) => item.id === scenarioId);
  },

  /**
   * 检查缓存是否过期
   * @param {Object} context - Vuex context
   * @param {number} maxAge - 最大缓存时间（毫秒），默认 5 分钟
   */
  isCacheExpired({ state }, maxAge = 5 * 60 * 1000) {
    if (!state.scenarios.lastFetchTime) {
      return true;
    }
    return Date.now() - state.scenarios.lastFetchTime > maxAge;
  },

  /**
   * 智能获取应用场景（优先使用缓存）
   * @param {Object} context - Vuex context
   * @param {Object} options - 选项
   */
  async getScenarios({ dispatch, state }, options = {}) {
    const { maxAge = 5 * 60 * 1000, force = false } = options;

    // 检查是否需要重新获取
    const shouldFetch =
      force ||
      state.scenarios.items.length === 0 ||
      (await dispatch('isCacheExpired', maxAge));

    if (shouldFetch) {
      return await dispatch('fetchScenarios', { force: true, silent: !force });
    }

    return state.scenarios.items;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
