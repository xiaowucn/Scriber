import { tag as tagApi } from '../api';

const state = {
  tags: {
    items: [],
  },
  pager: {
    page: 1,
    size: 20,
    total: 0,
  },
};

const getters = {
  tags: (state) => state.tags.items,
};

const mutations = {
  SET_TAGS: (state, tags) => {
    state.tags.items = tags;
  },
};

const actions = {
  async fetchTags({ commit }) {
    const res = await tagApi.fetchTags();
    commit('SET_TAGS', res.data.items);
  },
  async persistTag({ dispatch }, { tagData }) {
    if (tagData.id === -1) {
      // create
      await tagApi.saveTag({
        name: tagData.name,
        molds: tagData.molds,
      });
    } else {
      // update
      await tagApi.updateTag(tagData.id, {
        name: tagData.name,
        molds: tagData.molds,
      });
    }
    dispatch('fetchTags');
  },
  async deleteTag({ dispatch }, { id }) {
    await tagApi.deleteTag(id);
    dispatch('fetchTags');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
