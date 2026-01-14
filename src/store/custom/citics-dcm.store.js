import _ from 'lodash';
import { remark as remarkApi, detail as detailApi } from '../api';
import {
  getOriginSchema,
  unescapeAnswerText,
  getOriginalTreeDatas,
  updateMergedTreeDatas,
} from '../../utils/remarkAnswerTools';

const state = {
  answerTree: {
    question: {},
    answer: {},
    schema: {},
    originalTreeData: null,
    mergedTreeData: [],
  },
};
const getters = {
  answer: (state) => state.answerTree.answer,
  schema: (state) => state.answerTree.schema,
  question: (state) => state.answerTree.question,
  mergedTreeData: (state) => state.answerTree.mergedTreeData,
  originalTreeData: (state) => state.answerTree.originalTreeData,
};
const mutations = {
  SET_QUESTION: (state, question) => {
    state.answerTree.question = question;
  },
  SET_SCHEMA: (state, schema) => {
    const currentSchema = getOriginSchema(schema);
    state.answerTree.schema = currentSchema;
  },
  SET_USER_ANSWER: (state, answer) => {
    const userAnswer = unescapeAnswerText(answer);
    state.answerTree.answer = userAnswer;
  },
  SET_ORIGINAL_TREEDATA: (state, treeData) => {
    state.answerTree.originalTreeData = treeData;
  },
  SET_MERGED_TREEDATA: (state, treeData) => {
    state.answerTree.mergedTreeData = treeData;
  },
};
const actions = {
  async fetchRemarkFile(context, { id }) {
    const { data } = await detailApi.getFileInfo(id);
    return data;
  },

  async fetchSchema({ commit, dispatch }, { id }) {
    const remarkSchema = await dispatch(
      'schemaModule/parseSchemaToTree',
      { id },
      { root: true },
    );
    commit('SET_SCHEMA', remarkSchema);
  },

  async fetchQuestion({ commit }, { qid }) {
    const { data } = await remarkApi.fetchQuestion(qid);
    commit('SET_QUESTION', data);
  },

  async sendQuestionAnswer(context, { qid, data, type }) {
    await remarkApi.sendQuestionAnswer(qid, data, type);
  },

  /**
   * 初始化答案树
   */
  async initAnswerTree({ commit, dispatch, state }) {
    const schema = _.cloneDeep(state.answerTree.schema);

    const treeDatas = getOriginalTreeDatas(schema);
    commit('SET_ORIGINAL_TREEDATA', _.cloneDeep(treeDatas));
    dispatch('expandAnswerTree');
  },

  /**
   * 合并答案树
   */
  async expandAnswerTree({ commit, state }) {
    let answers = _.cloneDeep(state.answerTree.answer.items);
    let answerTree = _.cloneDeep(state.answerTree.originalTreeData[0]);

    updateMergedTreeDatas(answers, answerTree);
    commit('SET_MERGED_TREEDATA', [answerTree]);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
