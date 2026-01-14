import _ from 'lodash';
import { zts as ztsApi } from '../api';
import {
  getOriginSchema,
  getOriginalTreeDatas,
  updateMergedTreeDatas,
} from '../../utils/remarkAnswerTools';
import {
  getResultSchema,
  getSchemaResultsGroupByDocType,
} from '@/custom/zts/common/utils';
import { DOC_TYPE_ORDER } from '@/custom/zts/common/constant';

const state = {
  projects: {
    isLoading: false,
    items: [],
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
  },
  files: {
    isLoading: false,
    items: [],
  },
  detail: {
    project: {},
    files: [],
    results: {},
    selectedRule: {},
    mergedTreeData: {},
    disclosures: {},
  },
  rules: [],
  schema: {},
};

const getters = {
  projects: (state) => state.projects,
  files: (state) => state.files,
  detail: (state) => state.detail,
  rules: (state) => state.rules,
  schema: (state) => state.schema,
};

const mutations = {
  SET_PROJECTS: (state, projects) => {
    state.projects.items = _.cloneDeep(projects);
  },
  SET_PROJECTS_PAGER: (state, pager) => {
    state.projects.pager = pager;
  },
  SET_PROJECTS_LOADING: (state, isLoading) => {
    state.projects.isLoading = isLoading;
  },
  SET_FILES: (state, files) => {
    state.files.items = _.cloneDeep(files);
  },
  SET_FILES_LOADING: (state, isLoading) => {
    state.files.isLoading = isLoading;
  },
  SET_RULES: (state, rules) => {
    state.rules = rules;
  },
  SET_SCHEMA: (state, schema) => {
    const currentSchema = getOriginSchema(schema);
    state.schema = currentSchema;
  },
  SET_DETAIL_PROJECT: (state, project) => {
    state.detail.project = project;
  },
  SET_DETAIL_FILES: (state, files) => {
    state.detail.files = files;
  },
  SET_DETAIL_RESULTS: (state, results) => {
    state.detail.results = results;
  },
  SET_DETAIL_SELECTED_RULE: (state, rule) => {
    state.detail.selectedRule = rule;
  },
  SET_DETAIL_MERGED_TREEDATA: (state, treeData) => {
    state.detail.mergedTreeData = treeData;
  },
  SET_DETAIL_DISCLOSURES_DATA: (state, disclosures) => {
    state.detail.disclosures = disclosures;
  },
};

const actions = {
  async fetchProjects(
    { commit },
    { needLoading, searchParams } = { needLoading: true },
  ) {
    try {
      if (needLoading) {
        commit('SET_PROJECTS_LOADING', true);
      }
      const params = {
        page: state.projects.pager.page,
        size: state.projects.pager.size,
        ...searchParams,
      };
      const { data } = await ztsApi.fetchProjects(params);
      const projects = data.items;
      const pager = {
        page: data.page,
        size: data.size,
        total: data.total,
      };
      commit('SET_PROJECTS', projects);
      commit('SET_PROJECTS_PAGER', pager);
      return projects;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (needLoading) {
        commit('SET_PROJECTS_LOADING', false);
      }
    }
  },
  async fetchFiles(
    { commit },
    { needLoading, params } = { needLoading: true },
  ) {
    try {
      if (needLoading) {
        commit('SET_FILES_LOADING', true);
      }
      const { data } = await ztsApi.fetchFiles(params);
      const files = data.items;
      commit('SET_FILES', files);
      return files;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (needLoading) {
        commit('SET_FILES_LOADING', false);
      }
    }
  },
  async fetchResults({ commit }, { projectId }) {
    try {
      const { data } = await ztsApi.fetchResults(projectId);
      commit('SET_DETAIL_RESULTS', data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async fetchSchema({ commit, dispatch }, { id }) {
    const schema = await dispatch(
      'schemaModule/parseSchemaToTree',
      { id },
      { root: true },
    );
    commit('SET_SCHEMA', schema);
  },
  async fetchRuleInfo({ commit }, params) {
    try {
      const { data } = await ztsApi.fetchRuleInfo(params);
      const rules = _.map(data, (value, key) => ({ ...value, label: key }));
      commit('SET_RULES', rules);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async sendResults(context, { projectId, answerData }) {
    try {
      await ztsApi.saveAnswerData(projectId, answerData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async initResultsTree({ commit, state }) {
    const schema = state.schema;
    const results = state.detail.results;
    const schemaResultsGroupByDocType = getSchemaResultsGroupByDocType(results);

    const resultsTree = _.mapValues(schemaResultsGroupByDocType, (group) => {
      return _.mapValues(group, (result) => {
        const resultAnswers = result.map((item) => item.answer).filter(Boolean);
        const resultSchema = getResultSchema(schema, result);
        const originalTreeData = getOriginalTreeDatas(resultSchema);
        let resultTree = _.cloneDeep(originalTreeData[0]);
        updateMergedTreeDatas(resultAnswers, resultTree);
        return resultTree;
      });
    });

    const mergedTreeData = _.mapValues(resultsTree, (item) => {
      return _.chain(item)
        .map((value, key) => ({
          doc_type: key,
          data: value,
        }))
        .orderBy(['doc_type'], [DOC_TYPE_ORDER])
        .value();
    });

    commit('SET_DETAIL_MERGED_TREEDATA', mergedTreeData);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
