import _ from 'lodash';
import Vue from 'vue';
import {
  remark as remarkApi,
  ruleAudit as ruleAuditApi,
  detail as detailApi,
  hkex as hkexApi,
  nafmii as nafmiiApi,
  cmfchina as cmfchinaApi,
} from '../api';
import { fetchFilesbyId } from '../api/citics-tg.api';
import {
  eachTreeNode,
  getCounterGenerate,
  getAnswerIndexFromList,
  mixDeepInfo,
  updateDeepIndex,
  parsePresetAnswerKey,
  removeAnswersByStartKey,
  getAnswersIndexWithStartKey,
  changeAnswerLastIndex,
} from '../../utils';
import { parseAnswerToV2_2 } from '../../utils/answer-translateV2.2';
import {
  expand,
  createAnswerTreeMap,
  parseAnswerKeyToTreeNodeKey,
  quickRebuildAnswersIndex,
  fillChildrenGroup,
  updateAnswerItemKey,
  getOriginalTreeDatas,
  updateMergedTreeDatas,
  getOriginSchema,
  unescapeAnswerText,
} from '../../utils/remarkAnswerTools';
import { createConflictNumMap } from '../../utils/createConflictNumMap';
import platformPerimeter from '@/perimeters/platform.perimeter';
import { TASK_TYPES_MAP } from '../../custom/nafmii/common/constant';

const getCounter = getCounterGenerate(1e5);

const state = {
  remarkFile: null, // 标注文件
  remarkTab: null, // 标注操作tab
  remarkSchema: null,
  remarkTaskTypes: [],
  answers: [], // 所有人（包括推荐答案）的答案数据
  currentAnswerUserId: null, // 当前答案的用户ID
  answerTree: {
    question: {},
    originalTreeData: null,
    mergedTreeData: [], // 混合了schema结构和答案的树形结构
    diffEnabled: false,
    diffOriginalTreeData: [],
    diffMergedTreeData: [], // 混合了schema结构和对比答案的树形结构
    answer: {}, // 当前展示的用户答案（点击切换答案时会发生改变）
    customFieldAnswer: {}, // 自定义字段的答案
    diffCustomFieldAnswer: {}, // 对比的自定义字段的答案
    diffAnswer: {}, // 对比的答案（中诚信需求）
    data: {}, // 用户答案 组件数据
    schema: {}, // 当前用户答案所使用的schema
    answerItemSelect: {},
    nodeSelected: {},
    userAnswerType: '',
    filters: {},
    keywordMatches: [],
    answerGroupPageInfo: {}, // 当前答案组页码信息
  },
  predictAnswers: null,
  errorTips: [],
  conflictAnswerMaps: [],
  currentConflictMap: {},
  predictPosition: {
    label: '',
    result: [],
  },
  predictPrecisePosition: {},
  predictPrecisePositionSelected: [],
  predictList: [],
};
const getters = {
  remarkFile: (state) => state.remarkFile,
  remarkTab: (state) => state.remarkTab,
  remarkTaskTypes: (state) =>
    (state.remarkFile && state.remarkFile.task_types) || [],
  treeData: (state) => (state.remarkSchema && state.remarkSchema.tree) || null,
  entity: (state) => (state.remarkSchema && state.remarkSchema.entity) || null,
  originSchema: (state) => {
    const schema = getOriginSchema(state.remarkSchema);
    return schema;
  },
  question: (state) => state.answerTree.question,
  answer: (state) => state.answerTree.answer,
  diffAnswer: (state) => state.answerTree.diffAnswer,
  answerItemSelect: (state) => state.answerTree.answerItemSelect,
  customFieldAnswer: (state) => state.answerTree.customFieldAnswer,
  diffCustomFieldAnswer: (state) => state.answerTree.diffCustomFieldAnswer,
  nodeSelected: (state) => state.answerTree.nodeSelected,
  currentSchema: (state) => state.answerTree.schema,
  errorTips: (state) => state.errorTips,
  conflictAnswerMaps: (state) => state.conflictAnswerMaps,
  predictPosition: (state) => state.predictPosition,
  predictPrecisePosition: (state) => state.predictPrecisePosition,
  predictPrecisePositionSelected: (state) =>
    state.predictPrecisePositionSelected,
  userAnswerType: (state) => state.answerTree.userAnswerType,
  currentAnswerUserId: (state) => state.currentAnswerUserId,
  answerTreeData: (state) => state.answerTree.data,
  currentConflictMap: (state) => state.currentConflictMap,
  predictList: (state) => state.predictList,
  predictAnswers: (state) => state.predictAnswers,
  mergedTreeData: (state) => state.answerTree.mergedTreeData,
  diffEnabled: (state) => state.answerTree.diffEnabled,
  diffMergedTreeData: (state) => state.answerTree.diffMergedTreeData,
  diffOriginalTreeData: (state) => state.answerTree.diffOriginalTreeData,
  originalTreeData: (state) => state.answerTree.originalTreeData,
  answerTreeFilter: (state) => state.answerTree.filters,
  keywordMatches: (state) => state.answerTree.keywordMatches,
  answerGroupPageInfo: (state) => state.answerTree.answerGroupPageInfo,
};
const mutations = {
  SET_QUESTION: (state, data) => {
    state.answerTree.question = data;
  },
  SET_SCHEMA: (state, remarkSchema) => {
    state.remarkSchema = remarkSchema;
  },
  SET_CURRENT_ANSWER_USER_ID: (state, uid) => {
    state.currentAnswerUserId = uid;
  },
  SET_USER_ANSWER: (state, answer) => {
    const userAnswer = unescapeAnswerText(answer);
    state.answerTree.answer = userAnswer;
  },
  SET_CUSTOM_FIELD_ANSWER: (state, answer) => {
    state.answerTree.customFieldAnswer = answer;
  },
  SET_DIFF_CUSTOM_FIELD_ANSWER: (state, answer) => {
    state.answerTree.diffCustomFieldAnswer = answer;
  },
  SET_DIFF_ANSWER: (state, answer) => {
    state.answerTree.diffAnswer = answer;
  },
  SET_ORIGINAL_TREEDATA: (state, treeData) => {
    state.answerTree.originalTreeData = treeData;
  },
  SET_DIFF_ORIGINAL_TREEDATA: (state, treeData) => {
    state.answerTree.diffOriginalTreeData = treeData;
  },
  SET_MERGED_TREEDATA: (state, treeData) => {
    state.answerTree.mergedTreeData = treeData;
  },
  SET_DIFF_MERGED_TREEDATA: (state, treeData) => {
    state.answerTree.diffMergedTreeData = treeData;
  },
  SET_REMARK_DIFF_OPEN_STATUS: (state, status) => {
    state.answerTree.diffEnabled = status;
  },
  SET_USER_ANSWER_WITH_MANUAL: (state, { key, isManual = true }) => {
    const answers = state.answerTree.answer.items;
    const answerIndex = answers.findIndex((answer) => answer.key === key);
    answers[answerIndex].manual = isManual;
  },
  SET_USER_ANSWER_TYPE: (state, type) => {
    state.answerTree.userAnswerType = type;
  },
  SET_CURRENT_CONFLICT_MAP: (state, uid) => {
    if (uid === -1) {
      state.currentConflictMap = {};
    } else {
      state.currentConflictMap = state.conflictAnswerMaps.find(
        (item) => item.uid === uid,
      );
    }
  },
  SET_CONFLICT_MAPS: (state, answers) => {
    state.conflictAnswerMaps = createConflictNumMap(answers);
  },
  SET_ERROR_TIPS: (state, data) => {
    state.errorTips = data;
  },
  SET_ANSWER_ITEM_SELECTED: (state, data) => {
    state.answerTree.answerItemSelect = data;
  },
  SET_NODE_SELECTED: (state, { model }) => {
    state.answerTree.nodeSelected = model;
  },
  APPEND_ANSWER_ITEM: (state, { node, insertIndex }) => {
    const mergedItem = node;
    /**
     * Note: children 没有克隆信息，父节点的index下标不会被继承，
     * children中所有项的 meta._deepIndex 每一项都会是0
     */

    const clonedChildren = _.cloneDeep(mergedItem.children);
    const parentIndexPos = mergedItem.meta._deepIndex.length;
    const deepIndex = mergedItem.childrenGroup[0][0].meta._deepIndex;
    const insertPosition = insertIndex
      ? insertIndex
      : mergedItem.childrenGroup.length;
    _.forEach(clonedChildren, (child, key) => {
      eachTreeNode(child, (node, parent) => {
        let _deepIndex = [];
        if (!parent) {
          _deepIndex = deepIndex.slice();
        } else {
          _deepIndex = parent.meta._deepIndex.slice();
        }
        node.meta._deepIndex = _deepIndex;
        node.meta._nodeIndex = getCounter();
        node.meta._deepIndex[parentIndexPos] = insertPosition;
      });
      if (child.children.length > 0) {
        let _childrenGroup = [];
        _childrenGroup.push(_.cloneDeep(clonedChildren[key].children));
        clonedChildren[key].childrenGroup = _childrenGroup;
      }
    });
    fillChildrenGroup(
      clonedChildren,
      mergedItem.childrenGroup,
      mergedItem.childrenGroup.length,
      parentIndexPos,
      insertIndex,
    );

    if (insertIndex) {
      const answers = _.cloneDeep(state.answerTree.answer.items);
      const updateAnswer = updateAnswerItemKey(
        answers,
        parentIndexPos,
        insertIndex,
      );
      state.answerTree.answer.items = updateAnswer;
    }
  },
  /**
   * 增加答案
   */
  ADD_ANSWER_ITEM: (state, { item }) => {
    state.answerTree.answer.items.push(item);
  },

  REMOVE_NODE_ITEM: (state, { index, key }) => {
    let answers = state.answerTree.answer.items;
    const newKey = changeAnswerLastIndex(key, index);
    // 移除该组合类型上所有的答案
    removeAnswersByStartKey(newKey, answers);
  },
  REMOVE_ANSWER_ITEM: (state, key) => {
    const answers = state.answerTree.answer.items;
    const index = answers.findIndex((answer) => answer.key === key);
    answers.splice(index, 1);
  },
  REMOVE_ALL_ANSWER_ITEM: (state, { model }) => {
    model.answer.data = [];
  },
  SET_PREDICT_POSITION: (state, data) => {
    state.predictPosition.result = data || [];
  },
  SET_PREDICT_LABEL: (state, label) => {
    state.predictPosition.label = label;
  },
  SET_PREDICT_PRECISE_POSITION: (state, data) => {
    if (data.data) {
      state.predictPrecisePosition = data;
    } else {
      state.predictPrecisePosition = {};
    }
  },
  SET_PREDICT_PRECISE_POSITION_SELECTED_STATUS: (state, data) => {
    state.predictPrecisePositionSelected = data;
  },
  SET_PREDICT_PRECISE_POSITION_SELECTED: (state, { key, index, isTrue }) => {
    const selectedPredict = state.predictPrecisePositionSelected.find(
      (item) => item.key === key,
    );
    if (selectedPredict) {
      Vue.set(selectedPredict.selectedArr, index, isTrue);
    }
  },
  SET_ANSWER_TREE_DATA: (state, answerTreeData) => {
    state.answerTree.data = answerTreeData;
  },
  SET_ANSWER_SCHEMA: (state, schema) => {
    state.answerTree.schema = schema;
  },
  REMOVE_EMPTY_ANSWER: (state) => {
    state.answerTree.answer.items = state.answerTree.answer.items.filter(
      (answer) => answer.value || answer.data.length > 0,
    );
  },
  UPDATE_PREDICT_LIST: (state, { model, confirm }) => {
    const predictList = state.predictList;
    if (confirm) {
      predictList.push(model.answer.key);
    } else {
      let index = predictList.findIndex((item) => item === model.answer.key);
      if (index !== -1) predictList.splice(predictList, 1);
    }
    state.predictList = predictList;
  },
  RESET_PREDICT_LIST: (state) => {
    state.predictList = [];
  },
  REBUILD_ANSWER_TREE: (state) => {
    const answers = _.cloneDeep(state.answerTree.answer.items);
    const rebuildAnswers = quickRebuildAnswersIndex(answers);
    state.answerTree.answer.items = rebuildAnswers;
  },
  UPDATE_ANSWER: (state, { answerIndex, answer }) => {
    Object.assign(state.answerTree.answer.items[answerIndex], answer);
  },
  SET_PREDICT_ANSWERS: (state, answers) => {
    state.predictAnswers = answers;
  },
  SET_ANSWER_TREE_FILTER: (state, filter) => {
    state.answerTree.filters = filter;
  },
  SET_KEYWORD_MATCHES: (state, keywordMatches) => {
    state.answerTree.keywordMatches = keywordMatches;
  },
  SET_REMARK_FILE: (state, data) => {
    state.remarkFile = data;
  },
  SET_REMARK_TAB: (state, data) => {
    state.remarkTab = data;
  },
  SET_ANSWER_GROUP_PAGE_INFO(state, data) {
    state.answerTree.answerGroupPageInfo = data;
  },
};

function createEmptyAnswer(nodeSelected, value) {
  const key = JSON.stringify(mixDeepInfo(nodeSelected.meta));
  let defaultEnum = null;
  const enumList = nodeSelected.meta._type.values;
  if (enumList) {
    let value = enumList.find((item) => item.isDefault === true);
    defaultEnum = value ? value.name : null;
  }
  return {
    key,
    data: [],
    value: value || defaultEnum, // 保存用户对于schema(枚举类型)做的操作
    schema: {
      data: nodeSelected.data,
    },
  };
}

const actions = {
  async fetchRemarkFile({ commit }, { id, isCustom = false, from }) {
    let data;
    if (platformPerimeter.isCiticsTGEnv() && isCustom) {
      const res = await fetchFilesbyId(id);
      data = res.data;
    } else if (platformPerimeter.isNafmiiEnv()) {
      const res = await nafmiiApi.getFileInfo(id, from);
      data = res.data;
      data.task_types = data.task_types.map((type) => TASK_TYPES_MAP[type]);
    } else {
      const res = await detailApi.getFileInfo(id);
      data = res.data;
    }
    commit('SET_REMARK_FILE', data);
    return data;
  },
  async fetchQuestion({ commit }, { qid, fileId }) {
    let res = {};
    if (fileId) {
      if (platformPerimeter.isCmfchinaEnv()) {
        res = await cmfchinaApi.fetchInspectAnswerData(fileId);
      } else {
        res = await ruleAuditApi.fetchMergedAnswerData({ fileId });
      }
    } else {
      res = await remarkApi.fetchQuestion(qid);
    }
    const questionInfo = res.data || res;
    // NOTE: 后台返回的预测答案key为非标准的array json,key 中包含额外的空格和\uxxxx实体
    if (questionInfo.preset_answer && questionInfo.preset_answer.userAnswer) {
      questionInfo.preset_answer.userAnswer.items = parsePresetAnswerKey(
        questionInfo.preset_answer.userAnswer.items || [],
      );
    }

    Object.freeze(questionInfo);
    commit('SET_QUESTION', questionInfo);
    commit('RESET_PREDICT_LIST');

    return questionInfo;
  },
  async fetchSchema({ commit, dispatch }, { id, isAuto = false }) {
    const remarkSchema = await dispatch(
      'schemaModule/parseSchemaToTree',
      { id, isAuto },
      { root: true },
    );
    commit('SET_SCHEMA', remarkSchema);
  },
  changeAnswerText({ state, commit }, { key, textIndex, text }) {
    const answers = state.answerTree.answer.items;
    const answerIndex = getAnswerIndexFromList(key, answers);
    const clonedAnswer = _.cloneDeep(answers[answerIndex]);

    const textInBoxes = clonedAnswer.data[textIndex].boxes
      .map((box) => box.text)
      .join('');

    // 只记录改动过的文本，如果文本和各答案框中文本组合起来的一致，则取消记录文本（默认文本由框中的文本组合而成）
    // Step.1 判断文本是否有改动
    if (text === textInBoxes) {
      clonedAnswer.data[textIndex].text = null;
    } else {
      // Step.2 修改答案的指定文本块中的文本
      clonedAnswer.data[textIndex].text = text;
    }

    // Step.3 修改答案为手动
    commit('UPDATE_ANSWER', {
      answerIndex,
      answer: {
        data: clonedAnswer.data,
        manual: true,
      },
    });
  },
  changeAnswerEnum({ state, commit }, { key, value }) {
    const answers = state.answerTree.answer.items;
    const keyStr = JSON.stringify(key);
    const answerIndex = getAnswerIndexFromList(keyStr, answers);
    if (answerIndex === -1) {
      const answerTree = _.cloneDeep(state.answerTree.originalTreeData[0]);
      const answerTreeMap = createAnswerTreeMap(answerTree);
      const { key: nodeKey } = parseAnswerKeyToTreeNodeKey(key, answerTreeMap);
      const node = _.at(
        state.answerTree.originalTreeData[0],
        nodeKey.join(''),
      )[0];

      commit('ADD_ANSWER_ITEM', {
        item: {
          key: keyStr,
          data: [],
          value,
          schema: {
            data: node.data,
          },
        },
      });
    } else {
      commit('UPDATE_ANSWER', {
        answerIndex,
        answer: {
          value,
          manual: true,
        },
      });
    }
  },
  /**
   * 获取box的文本
   */
  async fetchBoxText(context, { fileId, data, isWithBox }) {
    if (!isWithBox) {
      return await remarkApi.fetchBoxText(fileId, data);
    } else {
      return await remarkApi.fetchBoxText(fileId, data, isWithBox);
    }
  },
  /**
   * 获取 box 的表格分析
   */
  async fetchBoxTable(context, { qid, key, data }) {
    return await remarkApi.fetchBoxContentForTable(qid, key, data);
  },
  /**
   * 获取标题内容分析
   */
  async fetchChapterAssistAnswer(context, { questionId, data }) {
    return await remarkApi.fetchRemarkAnswerByChapterAssist(questionId, data);
  },
  /**
   * 提交题目答案
   */
  async sendQuestionAnswer(context, { qid, data, type, isExportAnswer }) {
    await remarkApi.sendQuestionAnswer(qid, data, type, isExportAnswer);
  },
  /**
   * 冲突题目设置正确答案
   */
  async saveCorrectAnswer(context, query) {
    await remarkApi.saveCorrectAnswer(query);
  },
  /**
   * 更新答案的schema
   */
  async updateAnswerSchema(context, { qid, data }) {
    await remarkApi.updateAnswerSchema(qid, data);
  },
  /**
   * schema节点预测位置
   */
  async predictPosition(
    { commit, state },
    { qid, key, label, hasAccurateAnswer, subRule, ruleKey, isGml },
  ) {
    let params = {
      has_accurate_answer: hasAccurateAnswer,
    };

    if (
      state.remarkFile &&
      state.remarkFile.molds &&
      state.remarkFile.molds.length > 1
    ) {
      params.related_molds = true;
    }

    let predictPositionApi = remarkApi.predictPosition;
    if (platformPerimeter.isHkexEnv()) {
      if (isGml) {
        predictPositionApi = hkexApi.fetchPollGmlPrompt;
        params = {
          rule: subRule,
        };
        if (ruleKey) {
          params.sub_rule = ruleKey;
        }
      } else {
        predictPositionApi = hkexApi.predictPosition;
        params.question_id = qid;
        params.sub_rule = subRule;
      }
    }

    let data;
    if (isGml) {
      data = await predictPositionApi(qid, params);
    } else {
      const res = await predictPositionApi(qid, key, params);
      data = res.data;
    }
    commit('SET_PREDICT_POSITION', data);
    commit('SET_PREDICT_LABEL', label);
  },

  async expandAnswerTree({ commit, state }, isDiffMode) {
    let answers = _.cloneDeep(
      state.answerTree.answer.items.concat(
        state.answerTree.customFieldAnswer.items,
      ),
    );
    let answerTree = _.cloneDeep(state.answerTree.originalTreeData[0]);
    if (isDiffMode) {
      answers = _.cloneDeep(state.answerTree.diffAnswer.items).concat(
        state.answerTree.diffCustomFieldAnswer.items,
      );
      answerTree = _.cloneDeep(state.answerTree.diffOriginalTreeData[0]);
    }

    try {
      updateMergedTreeDatas(answers, answerTree);
      commit('SET_ANSWER_TREE_DATA', [answerTree]);
      if (isDiffMode) {
        commit('SET_DIFF_MERGED_TREEDATA', [answerTree]);
      } else {
        commit('SET_MERGED_TREEDATA', [answerTree]);
      }
    } catch (error) {
      commit('SET_MERGED_TREEDATA', {
        error: true,
      });
    }
  },

  /**
   * @deprecated
   */
  async expandAnswerTreeBySearch(
    { commit },
    { filteredAnswers, filteredTreeData },
  ) {
    let answers = filteredAnswers.items;
    const answerTree = filteredTreeData[0];
    const answerTreeMap = createAnswerTreeMap(answerTree);
    expand(answerTree, answers, answerTreeMap);

    for (let answerItem of answers) {
      const { key: treeNodeKey } = parseAnswerKeyToTreeNodeKey(
        JSON.parse(answerItem.key),
        answerTreeMap,
      );
      const treeNodeKeyStr = treeNodeKey.join('');
      let treeNode = _.at(answerTree, treeNodeKeyStr)[0];
      if (treeNode) {
        Object.assign(treeNode, {
          answer: answerItem,
        });
      }
    }
    updateDeepIndex(answerTree);
    // 冻结node
    eachTreeNode(answerTree, (node) => {
      Object.freeze(node);
    });
    commit('SET_ANSWER_TREE_DATA', [answerTree]);
    commit('SET_MERGED_TREEDATA', [answerTree]);
  },

  /**
   * 初始化答案树
   * @param {Boolean} isDiffMode 是否是对比模式
   */
  async initAnswerTree({ commit, dispatch, state, rootGetters }, isDiffMode) {
    if (!_.isArray(state.answerTree.answer.items)) {
      // v1答案，需要转换为v2.2
      const answerV2 = parseAnswerToV2_2(
        state.answerTree.answer,
        _.cloneDeep(state.answerTree.schema),
      );
      commit('SET_USER_ANSWER', answerV2);
    }
    const schema = _.cloneDeep(state.answerTree.schema);

    let customFieldAnswer = _.cloneDeep(state.answerTree.customFieldAnswer);
    if (isDiffMode) {
      customFieldAnswer = _.cloneDeep(state.answerTree.diffCustomFieldAnswer);
    }
    if (!schema.schemas) {
      return;
    }

    const schemaDescriptions = rootGetters['schemaModule/descriptions'];

    const treeDatas = getOriginalTreeDatas(
      schema,
      customFieldAnswer,
      schemaDescriptions,
    );

    commit('SET_ANSWER_TREE_DATA', treeDatas);
    commit('SET_ORIGINAL_TREEDATA', _.cloneDeep(treeDatas));
    commit('SET_DIFF_ORIGINAL_TREEDATA', _.cloneDeep(treeDatas));
    dispatch('expandAnswerTree', isDiffMode);
  },
  removeAnswerItem({ commit }, { key }) {
    commit('REMOVE_ANSWER_ITEM', key);
  },
  removeNodeItem({ commit }, { index, key }) {
    // 删除组合类型副本
    commit('REMOVE_NODE_ITEM', { index, key });
    commit('REBUILD_ANSWER_TREE', key);
  },

  /**
   * @deprecated
   */
  removeEmptyAnswer({ commit }) {
    commit('REMOVE_EMPTY_ANSWER');
    commit('REBUILD_ANSWER_TREE');
  },
  switchUserAnswer({ commit, dispatch }, answer) {
    commit('SET_USER_ANSWER', answer);
    dispatch('initAnswerTree');
  },
  addCloneNode({ commit }, { node, key, insertIndex }) {
    const answerTree = _.cloneDeep(state.answerTree.originalTreeData[0]);
    const answerTreeMap = createAnswerTreeMap(answerTree);
    const { key: nodeKey } = parseAnswerKeyToTreeNodeKey(
      JSON.parse(key),
      answerTreeMap,
    );
    // 给对应 key 的 item 中的childrenGroup追加一项
    commit('APPEND_ANSWER_ITEM', {
      node,
      key: nodeKey.join(''),
      insertIndex,
    });
  },
  async restartPredictAnswer(store, { qid, data }) {
    await remarkApi.RestartPredictAnswer(qid, data);
  },
  createAnswerItem({ commit }, { key, item, isManual = false, nodeSelected }) {
    let answerIndex = state.answerTree.answer.items.findIndex((answer) => {
      return answer.key === key;
    });
    let currentAnswer = null;

    if (answerIndex === -1) {
      currentAnswer = createEmptyAnswer(nodeSelected);
      Object.assign(currentAnswer, {
        manual: isManual,
      });
      currentAnswer.data.push(item);
      commit('ADD_ANSWER_ITEM', { item: currentAnswer });
    } else {
      currentAnswer = _.cloneDeep(state.answerTree.answer.items[answerIndex]);
      currentAnswer.data.push(item);
      commit('UPDATE_ANSWER', { answerIndex, answer: currentAnswer });
    }
  },
  removeNodeAnswers({ commit }, { key }) {
    const answers = state.answerTree.answer.items;
    const sortedAnswersIndex = getAnswersIndexWithStartKey(key, answers);
    for (const answerIndex of sortedAnswersIndex) {
      commit('REMOVE_ANSWER_ITEM', answers[answerIndex].key);
    }
  },
  setAnswerManual({ commit }, { key, isManual }) {
    commit('SET_USER_ANSWER_WITH_MANUAL', { key, isManual });
  },
  removeAnswerItemBox({ commit }, { key, boxIndex }) {
    // 删除答案中的某（几）个框以及文本块
    const answers = state.answerTree.answer.items;
    const answerIndex = answers.findIndex((answer) => answer.key === key);

    if (answerIndex !== -1) {
      const clonedAnswer = _.cloneDeep(answers[answerIndex]);
      clonedAnswer.data.splice(boxIndex, 1);
      commit('UPDATE_ANSWER', { answerIndex, answer: clonedAnswer });
    }
  },
  async downloadSpecialAnswer(store, qid) {
    const res = await remarkApi.downloadSpecialAnswer(qid);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
