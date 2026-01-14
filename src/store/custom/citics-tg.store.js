import _ from 'lodash';
import {
  fetchSchemaItems,
  fetchBusinessGroups,
  fetchTemplateList,
  fetchEciticSchema,
  fetchProductTypes,
} from '../api/citics-tg.api';
import { convertObjectTreeToArray } from '@/custom/citics_tg/common/utils';
const state = {
  schemas: null,
  schemaItems: {},
  schemaItemsArray: [],
  businessGroups: [],
  templates: [],
  productTypes: [],
};

const getters = {
  schemas: (state) => state.schemas,
  schemaItems: (state) => state.schemaItems,
  schemaItemsArray: (state) => state.schemaItemsArray,
  businessGroups: (state) => state.businessGroups,
  templates: (state) => state.templates,
  productTypes: (state) => state.productTypes,
};

const mutations = {
  SET_SCHEMAS: (state, schemas) => {
    state.schemas = schemas;
  },
  SET_SCHEMA_ITEMS: (state, schemaItems) => {
    state.schemaItems = schemaItems;
  },
  SET_SCHEMA_ITEMS_ARRAY: (state, schemaItemsArray) => {
    state.schemaItemsArray = schemaItemsArray;
  },
  SET_BUSINESS_GROUPS: (state, businessGroups) => {
    state.businessGroups = businessGroups;
  },
  SET_TEMPLATES: (state, templates) => {
    state.templates = templates;
  },
  SET_PRODUCT_TYPES: (state, productTypes) => {
    state.productTypes = productTypes;
  },
};

const actions = {
  async fetchSchemas({ state, commit, dispatch }, page = 1) {
    if (page === 1) {
      commit('SET_SCHEMAS', []);
    }
    const size = 100;
    const params = {
      page,
      size,
    };
    const schemas = _.cloneDeep(state.schemas);
    const res = await fetchEciticSchema(params);
    schemas.push(...res.data.items);
    commit('SET_SCHEMAS', schemas);
    if (res.data.total > schemas.length) {
      dispatch('fetchSchemas', page + 1);
    }
  },
  async fetchSchemaItems({ commit }, params = {}) {
    const res = await fetchSchemaItems(params);
    commit('SET_SCHEMA_ITEMS', res.data);
    commit('SET_SCHEMA_ITEMS_ARRAY', convertObjectTreeToArray(res.data));
    return res;
  },
  async fetchBusinessGroups({ commit }) {
    const res = await fetchBusinessGroups();
    commit('SET_BUSINESS_GROUPS', res.data);
  },
  async fetchAllTemplates({ state, commit, dispatch }, mold, page = 1) {
    if (page === 1) {
      commit('SET_TEMPLATES', []);
    }
    const size = 100;
    const params = {
      page,
      size,
    };
    if (mold) {
      params.mold = mold;
    }
    const templates = _.cloneDeep(state.templates);
    const res = await fetchTemplateList(params);
    templates.push(...res.data.items);
    commit('SET_TEMPLATES', templates);
    if (res.data.total > templates.length) {
      dispatch('fetchAllTemplates', mold, page + 1);
    }
  },
  async fetchProductTypes({ commit }) {
    const res = await fetchProductTypes();
    commit('SET_PRODUCT_TYPES', res.data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
