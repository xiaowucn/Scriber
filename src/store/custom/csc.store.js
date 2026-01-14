import { mockFileList } from '../../../test/mock/fileList.issue287.mock.js';
const state = {
  fileList: [],
  pager: {
    page: 1,
    size: 10,
    total: 0,
  },
};
const getters = {
  fileList: (state) => state.fileList,
  pager: (state) => state.pager,
};
const mutations = {
  SET_FILE_LIST(state, fileList) {
    state.fileList = fileList;
  },
  SET_PAGER(state, pager) {
    Object.assign(state.pager, pager);
  },
};
const actions = {
  async fetchFileList({ commit }) {
    commit('SET_FILE_LIST', mockFileList);
    commit('SET_PAGER', { total: 10 });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
