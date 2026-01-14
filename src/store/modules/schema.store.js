import _ from 'lodash';
import { schema as schemaApi, cmfchina as cmfchinaApi } from '../api';
import {
  entityToSchema,
  parseEntityToTree,
  fullSchemaToEntity,
  fullEntityToSchema,
  getNodeInTreeData,
  getSchemaPartByIndex,
  createEmptyTreeNode,
  arrayMove,
  createEmptyFullSchema,
  getSchemaType,
  getAllTypesFromEntity,
  schemaToEntity,
  initTreeData,
  filterSchemaParams,
  removeSchemaTreeNode,
} from '../../utils';
import { SCHEMA_TYPE } from '../../store/constants';
import platformPerimeter from '@/perimeters/platform.perimeter';

const state = {
  scrollTop: 0,
  schemas: {
    items: [],
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
    lastOpenedSchemaId: null,
    current: null,
    isLoading: false,
    predictedAnswer: [],
    allTypes: [],
    transfer: [], // schema 迁移
    model: {
      releaseList: [], // 训练模型版本列表
      testList: [], // 测试模型列表
      testHistoryList: [], // 历史测试样本
      fieldList: [], // 字段准确率列表
      historyPredictors: [], // 历史配置版本
      // 模型接入列表
      accessList: [
        {
          id: 1,
          type: 'Schema级别',
          created_utc: 1570625008,
          status: '已启用',
        },
        {
          id: 2,
          type: '字段级别',
          created_utc: 1570625008,
          status: '未启用',
        },
      ],
    },
    llm: {
      list: [],
    },
    descriptions: {}, // 最新的schema字段描述，无需迁移即可看到
    allPredictModelClass: [], //自定义模型配置，所有的可选配置模型
    auditRuleList: [], //审核规则配置
    auditRuleSearchForm: {},
    auditRulePager: {
      page: 1,
      size: 20,
      total: 0,
    },
  },
  tree: {
    id: -1,
    isLoading: false,
    /**
     * el-ui 树对象数据
     */
    data: null,
    /**
     * 编辑框中打开的数据对象
     */
    current: null,
    /**
     * popup中 完整的数据对象
     */
    full: null,
    response: null,
  },
  answerTree: {
    id: -1,
    isLoading: false,
    /**
     * el-ui 树对象数据
     */
    data: null,
    /**
     * 编辑框中打开的数据对象
     */
    current: null,
    /**
     * popup中 完整的数据对象
     */
    full: null,
  },
};

const getters = {
  schemas: (state) => state.schemas,
  tree: (state) => state.tree,
  schemaTypes: (state) => state.schemas.allTypes,
  transferData: (state) => state.schemas.transfer,
  curAnswers: (state) => state.schemas.curAnswers,
  isLoading: (state) => state.schemas.isLoading,
  predictedAnswerData: (state) => state.schemas.predictedAnswer,
  modelData: (state) => state.schemas.model,
  descriptions: (state) => state.schemas.descriptions,
  auditRuleList: (state) => state.schemas.auditRuleList,
  auditRuleSearchForm: (state) => state.schemas.auditRuleSearchForm,
  auditRulePager: (state) => state.schemas.auditRulePager,
  lastOpenedSchemaId: (state) => state.schemas.lastOpenedSchemaId,
  scrollTop: (state) => state.scrollTop,
  llm: (state) => state.schemas.llm,
};

const mutations = {
  // ----------- Schema ------------
  SET_SCHEMAS: (state, schemas) => {
    state.schemas.items = schemas;
  },
  SET_SCHEMAS_PAGER: (state, pager) => {
    state.schemas.pager = pager;
  },
  SET_CUR_SCHEMA: (state, schema) => {
    state.schemas.current = schema;
  },
  SET_CUR_ENTITY: (state, schema) => {
    state.schemas.current = schema;
  },
  SET_LOADING: (state, isLoading) => {
    state.schemas.isLoading = isLoading;
  },
  SET_TRANSFER: (state, schemas) => {
    // schemas: [oldSchema, newSchema]
    state.schemas.transfer = schemas;
  },
  SET_PREDICTED_ANSWER: (state, predictedAnswer) => {
    state.schemas.predictedAnswer = predictedAnswer;
  },
  SET_SCHEMA_DESCRIPTION: (state, descriptions) => {
    state.schemas.descriptions = descriptions;
  },
  SET_MODEL_CONFIG_CLASS: (state, data) => {
    state.schemas.allPredictModelClass = data;
  },

  // ----------- Schema Tree ------------
  SET_SCHEMATREE_ID: (state, id) => {
    state.tree.id = id;
    state.answerTree.id = id;
  },
  SET_SCHEMATREE_DATA: (state, treeData = {}) => {
    state.tree.data = Object.assign({}, treeData);
  },
  SET_SCHEMATREE_RESPONSE: (state, response) => {
    state.tree.response = response;
    if (!state.tree.response.version) {
      Object.assign(state.tree.response, {
        version: state.tree.full.checksum,
      });
    }
    state.answerTree.response = _.cloneDeep(state.tree.response);
  },
  SET_TREE_ID: (state, id) => {
    state.tree.id = id;
  },
  SET_TREE_LOADING: (state, isLoading) => {
    state.tree.isLoading = isLoading;
    state.answerTree.isLoading = isLoading;
  },
  SET_EMPTYPART_DATA: (state, { type = 'root', groupId, params = {} }) => {
    switch (type) {
      case 'root': {
        state.tree.current = {
          name: '',
          alias: '',
          moldType: 0,
          partType: 'root',
          ...params,
        };
        if (groupId !== undefined) {
          Object.assign(state.tree.current, {
            groupId,
          });
        }
        break;
      }
      case 'top': {
        state.tree.current = {
          required: true,
          multi: false,
          name: '',
          alias: '',
          type: '',
        };
        break;
      }
      case 'normal': {
        state.tree.current = {
          required: false,
          multi: false,
          name: '',
          alias: '',
          type: '',
        };
        break;
      }
      default: {
        throw new Error(
          'must specify the type when commit "schema.SET_SCHEMATREE_DATA".',
        );
      }
    }
    state.answerTree.response = _.cloneDeep(state.tree.current);
  },
  SET_PART_DATA: (state, current) => {
    state.tree.current = current;
  },
  SET_FULLSCHEMA_DATA: (state, fullSchema) => {
    state.tree.full = fullSchema;
    state.schemas.allTypes = getAllTypesFromEntity(state.tree.full);
  },
  INSERT_EMPTY_NODE: (state, index) => {
    const node = getNodeInTreeData(state.tree.data, index);
    if (node) {
      if (!node.children) {
        node.children = [];
      }
      const emptyNode = createEmptyTreeNode();
      emptyNode.meta._isHide = true;
      node.children.unshift(emptyNode);
    }
  },
  CLEAR_EMPTY_NODE: (state, index) => {
    const node = getNodeInTreeData(state.tree.data, index);
    if (node && node.children) {
      if (node.children[0] && node.children[0].meta._isHide) {
        node.children.splice(0, 1);
      }
    }
  },
  TOGGLE_EMPTY_NODE: (state, { nodeIndex, isHide }) => {
    const node = getNodeInTreeData(
      state.tree.data,
      nodeIndex,
      'meta._nodeIndex',
    );
    Object.assign(node.meta, {
      _isHide: isHide,
    });
  },
  // ------------------- model training -------------------
  SET_MODEL_RELEASE_LIST: (state, data) => {
    state.schemas.model.releaseList = data;
  },
  SET_MODEL_TEST_LIST: (state, data) => {
    state.schemas.model.testList = data;
  },
  SET_MODEL_TEST_HISTORY_LIST: (state, data) => {
    state.schemas.model.testHistoryList = data;
  },
  SET_MODEL_TEST_FIELD_LIST: (state, data) => {
    state.schemas.model.fieldList = data;
  },
  SET_MODEL_HISTORY_PREDICTORS: (state, data) => {
    state.schemas.model.historyPredictors = data;
  },

  // ------------------- 模型配置 -------------------
  SET_MODEL_CONFIG: (state, data) => {
    if (state.tree.full.predictors === null) {
      state.tree.full.predictors = [];
    }
    let schemaNodeIndex = state.tree.full.predictors.findIndex((item) =>
      _.isEqual(item.path, data.path),
    );
    if (schemaNodeIndex !== -1) {
      state.tree.full.predictors[schemaNodeIndex] = data;
    } else {
      state.tree.full.predictors.push(data);
    }
  },
  SET_LLM_LIST: (state, data) => {
    state.schemas.llm.list = data;
  },
  // ------------------- 审核规则配置 -------------------
  SET_AUDIT_RULE_LIST: (state, data) => {
    state.schemas.auditRuleList = data;
  },
  SET_AUDIT_RULE_PAGER: (state, data) => {
    state.schemas.auditRulePager = data;
  },
  UPDATE_AUDIT_RULE_SEARCH_FORM: (state, data) => {
    state.schemas.auditRuleSearchForm = data;
  },
  SET_LAST_OPENED_SCHEMA_ID: (state, data) => {
    state.schemas.lastOpenedSchemaId = data;
  },
  SET_SCROLL_TOP: (state, scrollTop) => {
    state.scrollTop = scrollTop;
  },
};

const actions = {
  async deleteSchema({ dispatch }, { id }) {
    await schemaApi.deleteSchema(id);
    await dispatch('fetchSchemas', { isAuto: true });
  },
  async saveSchema({ dispatch }, { entity, callback = () => {} }) {
    const schemaData = {
      name: entity.name,
      data: entityToSchema(entity.items),
    };
    await schemaApi.saveSchema(schemaData);
    callback(null);
    await dispatch('fetchSchemas', { isAuto: true });
  },
  async updateSchema({ dispatch }, { entity }) {
    const schemaData = {
      name: entity.name,
      data: entityToSchema(entity.items),
    };
    await schemaApi.updateSchema(entity.id, filterSchemaParams(schemaData));
    await dispatch('fetchSchemas', { isAuto: true });
  },
  async importSchema({ dispatch }, { data }) {
    await schemaApi.importSchema(data);
    await dispatch('fetchSchemas');
  },
  exportSchema(context, { id }) {
    return schemaApi.exportSchema(id);
  },
  async fetchAllSchemas({ commit }) {
    const { data } = await schemaApi.fetchAllSchema(
      {
        size: 9999,
        fields: 'id,name',
      },
      true,
    );
    commit('SET_SCHEMAS', data.items || data);
    return data;
  },
  async fetchSchemas({ state, commit }, { params = {}, isAuto = false } = {}) {
    const allParams = {
      page: state.schemas.pager.page,
      size: state.schemas.pager.size,
      ...params,
    };
    let res;
    if (platformPerimeter.isCmfchinaEnv()) {
      res = await cmfchinaApi.searchScene(allParams);
    } else {
      res = await schemaApi.fetchAllSchema(allParams, isAuto);
    }
    const { data } = res;
    const pager = {
      page: data.page,
      size: data.size,
      total: data.total,
    };
    commit('SET_SCHEMAS', data.items || data); // 兼容无分页的数据格式
    commit('SET_SCHEMAS_PAGER', pager);
  },
  async fetchModelClass({ commit }, { schemaId }) {
    const res = await schemaApi.fetchModelClass(schemaId);
    const modelClasses = [];
    for (let i in res.data) {
      const modelItem = {
        value: i,
        label: res.data[i].name,
        data: res.data[i],
      };
      modelClasses.push(modelItem);
    }
    commit('SET_MODEL_CONFIG_CLASS', modelClasses);
  },
  /**
   * 获取指定Schema
   */
  async fetchSchema({ commit }, { id, isAuto = false }) {
    let res = {};
    if (platformPerimeter.isCmfchinaEnv()) {
      res = await cmfchinaApi.fetchScene(id);
    } else {
      res = await schemaApi.fetchSchema(id, isAuto);
    }
    commit('SET_CUR_SCHEMA', res.data);
    return res.data;
  },
  // 获取指定Schema的最新描述信息
  async fetchSchemaDescription({ commit }, { id }) {
    const { data } = await schemaApi.fetchSchemaDescription(id);
    commit('SET_SCHEMA_DESCRIPTION', data);
  },
  /**
   * 获取树结构数据
   */
  async parseSchemaToTree({ dispatch }, { id, isAuto = false }) {
    const response = await dispatch('fetchSchema', { id, isAuto });
    const entity = fullSchemaToEntity(response);
    const schemaList = [entity.data.top, ...entity.data.normals];
    for (let i = 0; i < schemaList.length; i++) {
      const scm = schemaList[i];
      for (let j = 0; j < scm.attrs.length; j++) {
        const attr = scm.attrs[j];
        switch (attr.type.toUpperCase()) {
          case 'TEXT': {
            attr.type = '文本';
            break;
          }
          case 'NUMBER': {
            attr.type = '数字';
            break;
          }
          case 'DATE': {
            attr.type = '日期';
            break;
          }
        }
      }
    }
    let tree = {};
    if (response.data.length !== 0) {
      const data = parseEntityToTree(entity);
      // 从第二级schema开始显示
      tree = data.relations.tree;
    }
    // 对 tree 数据进行预处理
    initTreeData(tree);
    return { entity, tree, response };
  },
  async fetchTreeData({ commit, dispatch, state }) {
    commit('SET_TREE_LOADING', true);
    try {
      let { entity, tree, response } = await dispatch('parseSchemaToTree', {
        id: state.tree.id,
      });
      commit('SET_FULLSCHEMA_DATA', entity);
      initTreeData(tree, state.tree.full.predictors);
      commit('SET_SCHEMATREE_DATA', tree);
      commit('SET_SCHEMATREE_RESPONSE', response.data);
    } catch (err) {
      console.error('fetch tree data error.');
      throw err;
    } finally {
      commit('SET_TREE_LOADING', false);
    }
  },
  async updateTreeData({ commit }, response) {
    try {
      const res = { data: response };
      commit('SET_SCHEMATREE_RESPONSE', res.data);
      const entity = fullSchemaToEntity(res);
      const schemaList = [entity.data.top, ...entity.data.normals];
      for (let i = 0; i < schemaList.length; i++) {
        const scm = schemaList[i];
        for (let j = 0; j < scm.attrs.length; j++) {
          const attr = scm.attrs[j];
          switch (attr.type.toUpperCase()) {
            case 'TEXT': {
              attr.type = '文本';
              break;
            }
            case 'NUMBER': {
              attr.type = '数字';
              break;
            }
            case 'DATE': {
              attr.type = '日期';
              break;
            }
          }
        }
      }
      commit('SET_FULLSCHEMA_DATA', entity);
      let tree = {};
      if (res.data.length !== 0) {
        const data = parseEntityToTree(entity);
        // 从第二级schema开始显示
        tree = data.relations.tree;
      }
      // 对 tree 数据进行预处理
      initTreeData(tree);
      commit('SET_SCHEMATREE_DATA', tree);
    } catch (err) {
      console.error('update tree data error.');
      throw err;
    }
  },
  async getTreeData({ state }, response) {
    try {
      let treeData = _.cloneDeep(state.answerTree);
      const res = { data: response };
      treeData.response = res.data;
      const entity = fullSchemaToEntity(res);
      const schemaList = [entity.data.top, ...entity.data.normals];
      for (let i = 0; i < schemaList.length; i++) {
        const scm = schemaList[i];
        for (let j = 0; j < scm.attrs.length; j++) {
          const attr = scm.attrs[j];
          switch (attr.type.toUpperCase()) {
            case 'TEXT': {
              attr.type = '文本';
              break;
            }
            case 'NUMBER': {
              attr.type = '数字';
              break;
            }
            case 'DATE': {
              attr.type = '日期';
              break;
            }
          }
        }
      }
      treeData.full = entity;
      let tree = {};
      if (res.data.length !== 0) {
        const data = parseEntityToTree(entity);
        // 从第二级schema开始显示
        tree = data.relations.tree;
      }
      // 对 tree 数据进行预处理
      initTreeData(tree);
      treeData.data = tree;
      return treeData;
    } catch (err) {
      console.error('update tree data error.');
      throw err;
    }
  },
  async persistSchemaWords({ state, dispatch }, { wordsNode }) {
    const fullCloned = _.cloneDeep(state.tree.full);
    if (wordsNode._partType === 'root') {
      fullCloned.words = wordsNode.words;
    } else {
      // 获取对应的schema信息
      const schemaPart = getSchemaPartByIndex(
        wordsNode._index,
        fullCloned.data,
      );
      schemaPart.items[0].words = wordsNode.words;
    }
    const newSchema = fullEntityToSchema(fullCloned, wordsNode.rootSchemaWords);
    // Step.5 call save schema api
    await schemaApi.updateSchema(newSchema.id, filterSchemaParams(newSchema));
    await dispatch('fetchSchemas', { isAuto: true });
    await dispatch('fetchTreeData');
  },
  /**
   * 保存Schema part
   */
  async persistSchemaPart({ dispatch, state, getters }, { current }) {
    // current：修改的信息
    const types = getters['schemaTypes'];
    let res = null;
    switch (current.partType) {
      case 'root': {
        // 新增schema
        const data = createEmptyFullSchema(current);
        if (platformPerimeter.isCmfchinaEnv()) {
          data.group_ids = current.group_ids;
          res = await cmfchinaApi.createScene(data);
        } else {
          res = await schemaApi.saveSchema(data);
        }
        break;
      }
      case 'normal':
      case 'top': {
        // Step.0 获取state.full的副本，并通过_index找到schemaPart
        const fullCloned = _.cloneDeep(state.tree.full);
        // 获取对应的schema信息
        const schemaPart = getSchemaPartByIndex(
          current._index,
          fullCloned.data,
        );
        // Step.1 将变动信息写入到schema对象中
        _.assignIn(schemaPart.items[0], current);
        // Step.2 如果修改了top schema，需要将top schema 的name同步修改到schema.name中
        if (current.partType === 'top') {
          Object.assign(fullCloned, {
            name: current.name,
            alias: current.alias,
          });
        }
        // Step.3 检查type属性，如有需要，保存normal
        for (let i = 0; i < current.attrs.length; i++) {
          const normalSchemaName = current.attrs[i].type;
          // if (!schemaTypeEnum[normalSchemaName]) {
          if (!getSchemaType(types, normalSchemaName)) {
            // 枚举类型列表中的类型不需要存储
            const inx = fullCloned.data.normals.findIndex(
              (normal) => normal.name === normalSchemaName,
            );
            if (inx === -1) {
              // Step.3.1 保存normal schema (保存name)
              fullCloned.data.normals.push({
                name: normalSchemaName,
                attrs: [],
              });
            }
          }
        }
        // Step.4 entitypersistSchemaPart -> schema
        const newSchema = fullEntityToSchema(fullCloned);
        // Step.5 call save schema api

        if (platformPerimeter.isCmfchinaEnv()) {
          const data = filterSchemaParams(newSchema);
          data.group_ids = current.group_ids;
          res = await cmfchinaApi.updateScene(newSchema.id, data);
        } else {
          await schemaApi.updateSchema(
            newSchema.id,
            filterSchemaParams(newSchema),
          );
        }
        await dispatch('fetchSchemas', { isAuto: true });
        await dispatch('fetchTreeData');
        break;
      }
      case 'top.schema': {
        break;
      }
      default: {
        throw new TypeError(
          'must specify the type when persist a schema part.',
        );
      }
    }
    return res;
  },
  /**
   * 修改/新增 树节点
   */
  async persistTreeNode(
    { state, dispatch, getters },
    { mode, index, treeNode, callback },
  ) {
    const fullCloned = _.cloneDeep(state.tree.full);
    const types = getters['schemaTypes'];
    const schemaPart = getSchemaPartByIndex(index, fullCloned.data);
    if (mode === 'TREENODE_CREATE') {
      // 插入新节点
      // Step.1 找到type object
      const part = schemaPart.items[0];
      if (schemaPart.partType === 'top') {
        part.attrs.push({ ...treeNode });
      } else {
        const typeName = schemaPart.items[0].type;
        const typeObjectInx = fullCloned.data.normals.findIndex(
          (normal) => normal.name === typeName,
        );
        // typeObject 是父节点的typeObject
        // Step.2 保存（向 parent type object 中插入新节点）
        fullCloned.data.normals[typeObjectInx].attrs.push({ ...treeNode });
      }
    } else if (mode === 'TREENODE_UPDATE') {
      // Step.2 保存
      Object.assign(schemaPart.items[0], treeNode);
    } else {
      throw new Error('需要指定插入节点的目标index.');
    }
    // Step.3 处理节点的type
    // if (!schemaTypeEnum[treeNode.type]) {
    if (!getSchemaType(types, treeNode.type)) {
      const treeNodeTypeInx = fullCloned.data.normals.findIndex(
        (normal) => normal.name === treeNode.type,
      );
      if (treeNodeTypeInx === -1) {
        fullCloned.data.normals.push({
          ...treeNode,
          name: treeNode.type,
          attrs: treeNode.attrs || [],
        });
      }
    }
    // Step.4 entity -> schema
    const newSchema = fullEntityToSchema(fullCloned);
    // Step.5 call save schema api
    await schemaApi.updateSchema(newSchema.id, filterSchemaParams(newSchema));
    callback?.();
    await dispatch('fetchTreeData');
  },
  // 删除树节点
  async deleteTreeNode({ state, dispatch }, { index, label, type, callback }) {
    const fullCloned = _.cloneDeep(state.tree.full);
    const schemaPart = getSchemaPartByIndex(index, fullCloned.data);
    if (schemaPart.items.length === 2) {
      const inx = schemaPart.items[1].attrs.indexOf(schemaPart.items[0]);
      schemaPart.items[1].attrs.splice(inx, 1);
      if (fullCloned.mold_type === SCHEMA_TYPE.LLM.value) {
        removeSchemaTreeNode(fullCloned, label, type);
      }
    }
    // Step.4 entity -> schema
    const newSchema = fullEntityToSchema(fullCloned);
    // Step.5 call save schema api
    await schemaApi.updateSchema(newSchema.id, filterSchemaParams(newSchema));
    callback();
    await dispatch('fetchTreeData');
  },
  async openEditPopup({ commit, state, getters }, { index }) {
    // index: node.meta._index
    const fullCloned = _.cloneDeep(state.tree.full);
    const schemaPart = getSchemaPartByIndex(index, fullCloned.data);
    // 当前schema
    const current = schemaPart.items[0];
    current.mold_type = fullCloned.mold_type;
    // allNormals types
    let allNormals = state.tree.full.data.normals || [];
    // 当前树
    const currentTreeNode = getNodeInTreeData(state.tree.data, index);
    const types = getters['schemaTypes'];
    // 排除父节点/类型
    const path = currentTreeNode.meta._path || [];
    switch (schemaPart.partType) {
      case 'top': {
        // 点击top时，列出top和top的所有Schema
        const data = {
          ...current,
          partType: 'top',
          _path: path.slice(),
          types,
        };
        if (platformPerimeter.isCmfchinaEnv()) {
          data.group_ids = fullCloned.groups.map((group) => group.id);
        }
        commit('SET_PART_DATA', data);
        break;
      }
      case 'normal.schema':
      case 'top.schema': {
        const selectedNormalSchema = allNormals.find(
          (normal) => normal.name === current.type,
        );
        // 从top.schema 点击后，打开的是normal.schema
        const data = {
          ...selectedNormalSchema,
          partType: 'normal',
          alias: current.alias,
          _path: path.slice(),
          types: types.filter(
            (t) => t.type !== 'group' || !path.includes(t.label),
          ),
        };
        if (platformPerimeter.isCmfchinaEnv()) {
          data.group_ids = fullCloned.groups.map((group) => group.id);
        }
        commit('SET_PART_DATA', data);
        break;
      }
      default: {
        throw new Error(`not found the partType of "${schemaPart.partType}"`);
      }
    }
  },
  async moveTreeNode(
    { commit, state, dispatch },
    { dataIndex, oldIndex, index },
  ) {
    commit('SET_LOADING', true);
    commit('SET_TREE_LOADING', true);
    try {
      // Step.1 create tmp data
      const fullCloned = _.cloneDeep(state.tree.full);
      const schemaParts = getSchemaPartByIndex(dataIndex, fullCloned.data);
      // Step.2 find tree parent node
      const treeNode = schemaParts.items[1];
      let targetSchemaType = null;
      if (schemaParts.partType === 'top.schema') {
        // 修改的是top schema中的顺序
        targetSchemaType = fullCloned.data.top;
      } else {
        // 修改的是normal schema中的顺序
        const treeNodeTypeInx = fullCloned.data.normals.findIndex(
          (normal) => normal.name === treeNode.name,
        );
        if (treeNodeTypeInx !== -1) {
          targetSchemaType = fullCloned.data.normals[treeNodeTypeInx];
        }
      }
      if (targetSchemaType !== null) {
        // Step.3 find schema type's attrs list by schema name
        // console.log(oldIndex, '->', index, targetSchemaType.attrs)
        arrayMove(targetSchemaType.attrs, oldIndex, index);
        // Step.4 entity -> schema
        const newSchema = fullEntityToSchema(fullCloned);
        // Step.5 call save schema api
        await schemaApi.updateSchema(
          newSchema.id,
          filterSchemaParams(newSchema),
        );
        // Step. refresh tree
        await dispatch('fetchTreeData');
      }
    } catch (err) {
      console.error(err);
    } finally {
      commit('SET_LOADING', false);
      commit('SET_TREE_LOADING', false);
    }
  },
  /**
   * 保存/修改 SchemaType
   */
  async persistSchemaType(
    { state, commit, getters, dispatch },
    { label, oldLabel, callback = () => {} },
  ) {
    commit('SET_LOADING', true);
    try {
      label = label.trim();
      const fullCloned = _.cloneDeep(state.tree.full);
      const allSchemaTypes = getters['schemaTypes'];
      if (allSchemaTypes.map((t) => t.label).some((l) => l === label)) {
        return callback(new Error('名称不能重复'));
      }
      if (oldLabel) {
        // 更新
        await schemaApi.updateSchemaType(fullCloned, { label, oldLabel });
      } else {
        // 新增
        await schemaApi.addSchemaType(fullCloned, { label });
      }
      await dispatch('fetchTreeData');
      callback();
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async removeSchemaType({ state, commit, dispatch }, { type, label }) {
    commit('SET_LOADING', true);
    try {
      const fullCloned = _.cloneDeep(state.tree.full);
      await schemaApi.removeSchemaType(fullCloned, type, label);
      await dispatch('fetchTreeData');
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async persistSchemaEnum({ state, commit, dispatch }, { enumType, callback }) {
    commit('SET_LOADING', true);
    try {
      const fullCloned = _.cloneDeep(state.tree.full);
      if (enumType.oldName) {
        await schemaApi.updateSchemaEnumType(fullCloned, enumType);
      } else {
        await schemaApi.addSchemaEnumType(fullCloned, enumType);
      }
      await dispatch('fetchTreeData');
      callback();
    } catch (err) {
      callback(err);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async saveModelConfig({ state, commit, dispatch }, { data }) {
    commit('SET_LOADING', true);
    commit('SET_MODEL_CONFIG', data);
    try {
      const fullCloned = _.cloneDeep(state.tree.full);
      const newSchema = fullEntityToSchema(fullCloned);
      await schemaApi.updateSchema(newSchema.id, filterSchemaParams(newSchema));
      await dispatch('fetchTreeData');
    } catch (err) {
      console.log(err);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取schema迁移数据
   */
  async fetchTransferData({ state, commit }, { oldSchema }) {
    const newSchema = state.schemas.current;
    commit('SET_TRANSFER', [
      oldSchema,
      { ...newSchema.data, version: newSchema.checksum },
    ]);
  },
  /**
   * 迁移schema数据
   */
  async transferSchema(
    { commit },
    { questionId, diff, userAnswer, newSchema, saveDraft, callback },
  ) {
    try {
      const entity = schemaToEntity(newSchema.data);
      const types = getAllTypesFromEntity({ data: entity });
      const clonedAnswer = _.cloneDeep(userAnswer);
      applySchemaChange(clonedAnswer, diff, types);
      checkAnswerHandle(clonedAnswer);
      const newPDFData = {
        schema: newSchema.data,
        userAnswer: clonedAnswer,
      };
      await schemaApi.updatePresetAnswer(questionId, saveDraft, {
        data: newPDFData,
      });
      commit('SET_TRANSFER', [newSchema.data, newSchema.data]);
      callback(null, newPDFData);
    } catch (err) {
      callback(err);
      throw err;
    }
  },
  async fetchExportList(context, params) {
    return await schemaApi.fetchExportList(params);
  },
  async updateExportList(context, data) {
    return await schemaApi.updateExportList(data);
  },
  async fetchExportProjects(context, { schemaId, params }) {
    return await schemaApi.fetchExportProjects(schemaId, params);
  },
  // ----------------------- model training -----------------------
  async fetchModelReleaseList({ commit }, { schemaId, page }) {
    const res = await schemaApi.fetchModelReleaseList(schemaId, page);
    commit('SET_MODEL_RELEASE_LIST', res.data.items);
    return res.data;
  },
  async fetchModelTestList({ commit }, params) {
    const res = await schemaApi.fetchModelTestList(params);
    commit('SET_MODEL_TEST_LIST', res.data.items);
  },
  async fetchModelTestHistoryList({ commit }, { versionId }) {
    const res = await schemaApi.fetchModelTestHistoryList(versionId);
    const list = res.data.map((item) => {
      return {
        value: item.acid,
        label: item.text,
        dirs: item.dirs,
      };
    });
    commit('SET_MODEL_TEST_HISTORY_LIST', list);
  },
  async fetchModelHistoryPredictors({ commit }, { schemaId }) {
    const res = await schemaApi.fetchModelHistoryPredictors(schemaId);
    const list = res.data.map((item) => {
      return {
        value: item.id,
        label: item.text,
      };
    });
    commit('SET_MODEL_HISTORY_PREDICTORS', list);
  },
  async createModelVersion(context, { schemaId, name, predictors, copyId }) {
    return await schemaApi.createModelVersion(
      schemaId,
      name,
      predictors,
      copyId,
    );
  },
  async deleteModelVersion(context, { versionId }) {
    return await schemaApi.deleteModelVersion(versionId);
  },
  async trainModel(context, { id, data }) {
    return await schemaApi.trainModel(id, data);
  },
  async testModel(context, modelData) {
    return await schemaApi.testModel(modelData);
  },
  async enableModel(context, { versionId, update, enable }) {
    return await schemaApi.enableModel(versionId, update, enable);
  },
  async updateModelConfig(context, { versionId, data }) {
    return await schemaApi.updateModelConfig(versionId, data);
  },
  async fetchDatabaseConfig(context, { key, schemaId }) {
    return await schemaApi.fetchDatabaseConfig(key, schemaId);
  },
  async saveDatabaseConfig(context, { key, schemaId, data }) {
    return await schemaApi.saveDatabaseConfig(key, schemaId, data);
  },
  async enableDatabaseConfig(context, { key, schemaId, enable }) {
    return await schemaApi.enableDatabaseConfig(key, schemaId, enable);
  },
  async fetchAuditRuleList({ commit }) {
    const pager = {
      page: state.schemas.auditRulePager.page,
      size: state.schemas.auditRulePager.size,
    };
    const searchForm = state.schemas.auditRuleSearchForm;

    let fetchRulesAPI;
    if (platformPerimeter.isCmfchinaEnv()) {
      fetchRulesAPI = cmfchinaApi.fetchRules;
    } else {
      fetchRulesAPI = schemaApi.fetchAuditRuleList;
    }

    const { data } = await fetchRulesAPI(
      _.omitBy(
        {
          ...pager,
          ...searchForm,
        },
        (v) => v === '',
      ),
    );
    commit('SET_AUDIT_RULE_LIST', data.items);
    commit('SET_AUDIT_RULE_PAGER', {
      page: data.page,
      size: data.size,
      total: data.total,
    });
  },
  async createAuditRule({ commit, dispatch }, { data }) {
    let res = {};
    if (platformPerimeter.isCmfchinaEnv()) {
      res = await cmfchinaApi.createRule(data);
    } else {
      res = await schemaApi.createAuditRule(data);
    }
    commit('SET_AUDIT_RULE_PAGER', {
      ...state.schemas.auditRulePager,
      page: 1,
    });
    dispatch('fetchAuditRuleList');
    return res;
  },
  async deleteAuditRule({ commit, dispatch }, { ruleId }) {
    await schemaApi.deleteAuditRule(ruleId);
    commit('SET_AUDIT_RULE_PAGER', {
      ...state.schemas.auditRulePager,
      page: 1,
    });
    dispatch('fetchAuditRuleList');
  },
  async updateAuditRule({ dispatch }, { ruleId, data }) {
    let res = {};
    if (platformPerimeter.isCmfchinaEnv()) {
      res = await cmfchinaApi.updateRule(ruleId, data);
    } else {
      res = await schemaApi.updateAuditRule(ruleId, data);
    }
    dispatch('fetchAuditRuleList');
    return res;
  },
  async updateRuleReviewStatus({ dispatch }, { ruleId, data }) {
    const result = await schemaApi.updateRuleReviewStatus(ruleId, data);
    dispatch('fetchAuditRuleList');
    return result;
  },
  async fetchSchemaFieldList(context, schemaId) {
    return await schemaApi.fetchSchemaFieldList(schemaId);
  },
  async validateAuditRule(context, { ruleId, data }) {
    return await schemaApi.validateAuditRule(ruleId, data);
  },
  async reviewAuditRule(context, { ruleId, data }) {
    return await schemaApi.reviewAuditRule(ruleId, data);
  },
  async fetchLLMList({ commit }) {
    const res = await schemaApi.fetchLLMList();
    commit('SET_LLM_LIST', res);
    return res;
  },
};

/**
 * 处理schema变更，直接修改对象本身
 * @param {Object} answer
 * @param {Array} diffList
 */
function applySchemaChange(answer, diffList, types) {
  // console.log('看看数据的结构', diffList, types);
  // 保存 basic 和 enum 类型
  const pureTypeNodes = [];
  for (let i = 0; i < diffList.length; i++) {
    const diff = diffList[i];
    switch (diff.type) {
      case '-': {
        delete answer[diff.label];
        break;
      }
      case '>':
      case '+': {
        const attributes = [];
        const { data, children } = diff.node;
        const schemaType = getSchemaType(types, data.type);
        // root 跳过
        if (schemaType === null) continue;
        // 子项都是基本类型/枚举类型 跳过
        if (pureTypeNodes.includes(data.label)) continue;
        let addFlag = false;
        if (schemaType.type === 'basic' || schemaType.type === 'enum')
          addFlag = true;
        else {
          if (children.length === 0) addFlag = true;
          else {
            let state = children.every((child) => {
              const childType = getSchemaType(types, child.data.type);
              return childType.type === 'basic' || childType.type === 'enum';
            });
            if (state) {
              addFlag = true;
              pureTypeNodes.push(...children.map((c) => c.data.label));
            }
          }
        }
        // console.log(addFlag, children, answer);
        if (addFlag) {
          if (children.length > 0) {
            for (let j = 0; j < children.length; j++) {
              attributes.push({
                name: children[j].data.label,
                alias: children[j].data.alias,
                multiple: children[j].data.multi,
                required: children[j].data.required,
                type: children[j].data.type,
              });
            }
          } else {
            attributes.push({
              name: data.label,
              alias: data.alias,
              multiple: data.multi,
              required: data.required,
              type: data.type,
            });
          }
          let _answer = answer[diff.label] || {};
          Object.assign(answer, {
            [diff.label]: {
              attributes, // 从当前节点向下遍历，列出所有的后代节点
              items: _answer.items || [],
              multiple: data.multi,
              required: data.required,
              type: data.type,
              label: data.label,
              md5: diff.label,
            },
          });
        } else {
          // 以前的规则中有，修改了schema后，现在的规则中去掉它
          delete answer[data.label];
        }
        break;
      }
      case '*': {
        const { data } = diff.node;
        if (!answer[diff.label]) answer[diff.label] = {};
        Object.assign(answer[diff.label], {
          multiple: data.multi,
          required: data.required,
          type: data.type,
        });
        break;
      }
    }
  }
}

function checkAnswerHandle(answers) {
  _.forEach(answers, (answer) => {
    let attrs = answer.attributes || [];
    let items = answer.items || [];
    items.forEach((item) => {
      let fields = item.fields || [];
      let _fields = [];
      attrs.forEach((attr) => {
        let flag = _.find(fields, { name: attr.name });
        if (flag) _fields.push(flag);
        else {
          _fields.push({
            components: [],
            label: '',
            name: attr.name,
            type: attr.type,
          });
        }
      });
      item.fields = _fields;
    });
  });
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
