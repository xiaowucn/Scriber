const state = {
  selectedModels: [],
  fieldProbabilities: [],
};
const getters = {
  selectedModels: (state) => state.selectedModels,
  fieldProbabilities: (state) => state.fieldProbabilities,
};
const mutations = {
  SET_SELECTED_MODELS(state, models) {
    state.selectedModels = models;
  },
  SET_FIELD_PROBABILITIES(state, probabilities) {
    state.fieldProbabilities = probabilities;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
