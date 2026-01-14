import { fullEntityToSchema, filterSchemaParams } from '../../utils';
import { baseURL, http, http_v2 } from './http';
import platformPerimeter from '../../perimeters/platform.perimeter';
import { cmfchina as cmfchinaApi } from './';

/**
 * 获取所有 mold
 */
export const fetchAllSchema = (params, isAuto = false) =>
  http.get('/mold', {
    params,
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

/**
 * 获取指定id的 Schema
 * @param {Number} id
 */
export const fetchSchema = (id, isAuto = false) =>
  http.get(`/mold/${id}`, {
    headers: isAuto ? { 'X-Trigger-Source': 'auto' } : undefined,
  });

/**
 * 保存Schema
 * @param {Object} schema
 */
export const saveSchema = (data) => http.post('/mold', data);

/**
 * 更新 Schema
 * @param {Object} schema
 */
export const updateSchema = (id, data) => {
  // 当前schema下data数据全为自定义
  if (typeof id !== 'number') {
    return Promise.reject(new Error("can't update a schema without id."));
  }
  if (platformPerimeter.isCmfchinaEnv()) {
    return cmfchinaApi.updateScene(id, data);
  }
  return http.put(`/mold/${id}`, data);
};

/**
 * 删除Schema
 * @param {Number} id
 */
export const deleteSchema = (id) => http.delete(`/mold/${id}`);

/**
 * 提取模型配置，获取预测模型模板
 */
export const fetchModelClass = (schemaId) => {
  return http.get(`/model_class/${schemaId}`);
};

/**
 * 获取指定id的 Schema 的字段描述
 * @param {Number} id
 */
export const fetchSchemaDescription = (id) =>
  http.get(`/mold/${id}/intro_words`);

/**
 * 导入Schema（海通）
 * @param {Object} data
 */
export const importSchema = (data) => {
  return http.post(`/plugins/ht/schema/sync`, data);
};

/**
 * 导出Schema（海通）
 * @param {Number} id
 */
export const exportSchema = (id) => {
  return `${baseURL}/plugins/ht/schema/sync?mold=${id}`;
};

/**
 * 获取导出任务列表
 * @param {Number} params.schema_id
 * @param {Number} params.export_action  可选值：25, 26, 27, 28, 30, 36, 37, 38, 39, 40, 41, 42
 * @param {String} params.export_type  可取值：json、txt、csv
 * @param {Number} params.status  可取值：1-导出中、2-导出失败、3-导出成功
 */
export const fetchExportList = (params) =>
  http.get('/training_data', { params });

/**
 * 更新导出列表结果
 * @param {Number} schemaId
 * @param {Array} list
 * @param {String} exportType 可取值：json、txt、csv
 */
export const updateExportList = (data) => http.post(`/training_data`, data);

/**
 * 依据schemaId来获取需要导出的项目
 * @param {Number} schemaId
 * @param {String} params: 参数有：export_type 可取值：json、txt、csv
 */
export const fetchExportProjects = (schemaId, params) =>
  http.get(`/mold_cata/${schemaId}`, { params });

/**
 * 导出标注数据 -下载
 */
export const exportTrainingData = (id, exportAction) =>
  `${baseURL}/training_data/${id}?export_action=${exportAction}`;

/**
 * 批量导出标注数据（广发基金）
 */
export const batchExportTrainingData = (projectId, schemaId) =>
  `external_api/v1/gffund/export?project_id=${projectId}&schema_id=${schemaId}`;

/**
 * 导出标注数据 -删除
 */
export const deleteTrainingData = (id, exportAction) => {
  return http.delete(`/training_data/${id}`, {
    params: {
      export_action: exportAction,
    },
  });
};

/**
 * 获取模型版本列表
 * @param {Number} schemaId
 */
export const fetchModelReleaseList = (schemaId, page) =>
  http.get('/model_training', {
    params: {
      schema_id: schemaId,
      page,
    },
  });

/**
 * 获取模型测试记录列表
 * @param {Number} versionId 模型版本ID
 */
export const fetchModelTestList = (params) =>
  http.get('/model_statistics', { params });

/**
 * 获取模型历史测试样本
 * @param {Number} versionId
 */
export const fetchModelTestHistoryList = (versionId) =>
  http.get(`/history_dirs/${versionId}`);

/**
 * 获取模型历史配置版本
 * @param {Number} versionId
 */
export const fetchModelHistoryPredictors = (schemaId) =>
  http.get(`/history_predictors/${schemaId}`);

/**
 * 新建模型版本
 * @param {Number} schemaId
 * @param {String} name 模型版本名称
 * @param {Array} predictors schema字段的配置
 * @param {Number} copyId 复制版本的id
 */
export const createModelVersion = (schemaId, name, predictors, copyId) =>
  http.post(`/model_training`, {
    schema_id: schemaId,
    name,
    predictors,
    copy_from: copyId,
  });

/**
 * 删除模型版本
 * @param {Number} versionId 模型版本id
 */
export const deleteModelVersion = (versionId) =>
  http.delete(`/model_training/${versionId}`);

/**
 * 训练模型
 * @param {Number} id 模型版本id
 * @param {Object} modelData 模型数据
 */
export const trainModel = (id, modelData) =>
  http.post(`/model_training/${id}`, modelData);

/**
 * 更新模型配置信息
 * @param {Number} id 模型版本id
 * @param {Array} data 模型配置信息（predictors）
 */
export const updateModelConfig = (id, data) =>
  http.put(`/model_training/${id}`, data);

/**
 * 启用模型
 * @param {Number} versionId 模型版本id
 * @param {Number} update 是否重新预测当前schema的所有文件 0:否 1:是
 * @param {Number} enable 停用/启用模型 0:停用 1:启用
 */
export const enableModel = (versionId, update, enable) =>
  http.post('/model_manage', {
    vid: versionId,
    update: update,
    enable,
  });

/**
 * 测试模型
 * @param {Object} modelData 模型数据
 */
export const testModel = (modelData) => http.post(`/model_testing`, modelData);

export const addSchemaType = (fullData, schemaType) => {
  // fullData.data.schemaTypes.push(schemaType);
  fullData.data.normals.push({
    name: schemaType.label,
    attrs: [],
    orders: [],
    schema: {},
  });
  const schema = fullEntityToSchema(fullData);
  return updateSchema(fullData.id, schema);
};

export const updateSchemaType = (fullData, { label, oldLabel }) => {
  const index = fullData.data.schemaTypes.findIndex(
    (t) => t.label === oldLabel,
  );
  // Step.1 更新fullEntity中所有引用该type的项目
  let parentSchema = null;
  const schemaList = [fullData.data.top, ...fullData.data.normals];
  for (let i = 0; i < schemaList.length; i++) {
    const scm = schemaList[i];
    if (scm.name === oldLabel) {
      parentSchema = scm;
    }
    for (let j = 0; j < scm.attrs.length; j++) {
      const attr = scm.attrs[j];
      if (attr.type === oldLabel) {
        attr.type = label;
      }
    }
  }
  // Step.2 更新schema_type
  if (index !== -1) {
    // user enum
    fullData.data.schemaTypes[index].label = label;
  } else {
    // normal type
    if (parentSchema === null) {
      return Promise.reject();
    } else {
      parentSchema.name = label;
    }
  }
  const schema = fullEntityToSchema(fullData);
  return updateSchema(fullData.id, schema);
};

export const removeSchemaType = (fullData, type, label) => {
  if (type === 'enum') {
    const index = fullData.data.schemaTypes.findIndex((t) => t.label === label);
    if (index !== -1) {
      fullData.data.schemaTypes.splice(index, 1);
    }
  }
  if (type === 'group') {
    const index = fullData.data.normals.findIndex((t) => t.name === label);
    if (index !== -1) {
      fullData.data.normals.splice(index, 1);
    }
  }
  const schema = fullEntityToSchema(fullData);
  return updateSchema(fullData.id, filterSchemaParams(schema));
};

/**
 * 新增枚举类型
 * @param {Object} fullData fullEntity
 * @param {EnumType} param1 枚举类型
 */
export const addSchemaEnumType = (fullData, { name, attrs, isMultiSelect }) => {
  fullData.data.schemaTypes.push({
    label: name,
    values: attrs,
    isMultiSelect,
  });
  const schema = fullEntityToSchema(fullData);
  return updateSchema(fullData.id, filterSchemaParams(schema));
};
/**
 * 重命名fullData中的Schema type和所有指向这个type的attr，返回改名字的 schema type
 * @param {Object} fullData fullEntity
 * @param {String} oldName 旧名称
 * @param {String} newName 新名称
 */
function renameSchemaType(fullData, oldName, newName) {
  let parentSchema = null;
  const schemaList = [fullData.data.top, ...fullData.data.normals];
  for (let i = 0; i < schemaList.length; i++) {
    const scm = schemaList[i];
    if (scm.name === oldName) {
      parentSchema = scm;
    }
    for (let j = 0; j < scm.attrs.length; j++) {
      const attr = scm.attrs[j];
      if (attr.type === oldName) {
        attr.type = newName;
      }
    }
  }
  return parentSchema;
}
export const updateSchemaEnumType = (
  fullData,
  { name, oldName, attrs, isMultiSelect },
) => {
  const index = fullData.data.schemaTypes.findIndex((t) => t.label === oldName);
  // Step.1 更新fullEntity中所有引用该type的项目
  renameSchemaType(fullData, oldName, name);
  // Step.2 更新schema_type
  // user enum
  fullData.data.schemaTypes[index].label = name;
  fullData.data.schemaTypes[index].values = attrs;
  fullData.data.schemaTypes[index].isMultiSelect = isMultiSelect;
  const schema = fullEntityToSchema(fullData);
  return updateSchema(fullData.id, filterSchemaParams(schema));
};

/**
 * 更新预测答案的schema(迁移scheme后重新预测答案)
 */
export const updatePresetAnswer = (questionId, saveDraft, answerData) => {
  const number = saveDraft ? 0 : 1;
  return http.post(
    `/question/${questionId}/answer?save_data_only=${number}&migrate=1`,
    answerData,
  );
};

/**
 * 数据生产(上下游对接)-获取单条配置
 * @param {String} key 可选值: answer_sync_db(答案定时推送至数据库)、sync_external_file(上游文件系统同步)
 * @param {String} schemaId schema_id
 */
export const fetchDatabaseConfig = (key, schemaId) =>
  http.get('/config/${key}', { params: { schema: schemaId } });

/**
 * 数据生产(上下游对接)-写入单条配置
 * @param {String} key 可选值: answer_sync_db(答案定时推送至数据库)、sync_external_file(上游文件系统同步)
 * @param {String} schemaId schema_id
 * @param {String} data 提交的表单数据
 */
export const saveDatabaseConfig = (key, schemaId, data) =>
  http.post(`/config/${key}?schema=${schemaId}`, data);

/**
 * 数据生产(上下游对接)-启用/停用任务
 * @param {String} key 可选值: answer_sync_db(答案定时推送至数据库)、sync_external_file(上游文件系统同步)
 * @param {String} schemaId schema_id
 * @param {String} enable 启用/停用 可选值: 0/1
 */
export const enableDatabaseConfig = (key, schemaId, enable) =>
  http.post(`/enable_config/${key}/${enable}?schema=${schemaId}`);

// 深交所自然语言处理平台 --模型信息列表
export const fetchSZSEModels = (params) => http.get('/szse_model', { params });

/**
 * 获取指定字段的提取规则（海通）
 */
export const fetchExtractMethod = ({ mold, path }) => {
  return http.get(`/plugins/ht/extract_method?mold=${mold}&path=${path}`);
};

/**
 * 创建指定字段的提取规则（海通）
 */
export const updateExtractMethod = (data) => {
  return http.post(`/plugins/ht/extract_method`, data);
};

/**
 * 获取合规分类列表（海通）
 */
export const fetchRuleCategories = (mold) => {
  return http.get(`/plugins/ht/class/mold/${mold}`);
};

/**
 * 创建合规分类（海通）
 */
export const createRuleCategory = (mold, data) => {
  return http.post(`/plugins/ht/class/mold/${mold}`, data);
};

/**
 * 修改合规分类（海通）
 */
export const updateRuleCategory = (classId, data) => {
  return http.put(`/plugins/ht/class/${classId}`, data);
};

/**
 * 删除合规分类（海通）
 */
export const deleteRuleCategory = (classId) => {
  return http.delete(`/plugins/ht/class/${classId}`);
};

/**
 * 获取合规规则列表（海通）
 */
export const fetchRuleItems = (classId, params) => {
  return http.get(`/plugins/ht/item/class/${classId}`, { params });
};

/**
 * 创建合规规则（海通）
 */
export const createRuleItem = (classId, data) => {
  return http.post(`/plugins/ht/item/class/${classId}`, data);
};

/**
 * 修改合规规则（海通）
 */
export const updateRuleItem = (ruleId, data) => {
  return http.put(`/plugins/ht/item/${ruleId}`, data);
};

/**
 * 删除合规规则（海通）
 */
export const deleteRuleItem = (ruleId) => {
  return http.delete(`/plugins/ht/item/${ruleId}`);
};

/**
 * 获取审核规则
 */
export const fetchAuditRuleList = (params) => {
  return http.get(`/plugins/inspector/rules`, { params });
};

/**
 * 新增审核规则
 */
export const createAuditRule = (data) => {
  return http.post(`/plugins/inspector/rules`, data);
};

/**
 * 删除审核规则
 */
export const deleteAuditRule = (ruleId) => {
  return http.delete(`/plugins/inspector/rules/${ruleId}`);
};

/**
 * 修改审核规则
 */
export const updateAuditRule = (ruleId, data) => {
  return http.post(`/plugins/inspector/rules/${ruleId}`, data);
};

/**
 * 更新复核状态
 */
export const updateRuleReviewStatus = (ruleId, data) => {
  return http.put(`/plugins/inspector/rules/${ruleId}`, data);
};

/**
 * 获取schema字段
 */
export const fetchSchemaFieldList = (schemaId) => {
  return http.get(`/plugins/inspector/schemas/${schemaId}/schema-items`);
};

/**
 * 复核规则
 */
export const reviewAuditRule = (ruleId, data) => {
  return http.put(`/plugins/inspector/rules/${ruleId}/review`, data);
};

/**
 * 测试规则
 */
export const validateAuditRule = (ruleId, data) => {
  return http.post(`/plugins/inspector/rules/${ruleId}/validate`, data);
};

/**
 * 获取大模型列表
 */
export const fetchLLMList = (params) => {
  return http_v2.get(`/llm-list`, { params });
};

/**
 * 获取大模型可测试文件列表
 */
export const fetchLLMTestFiles = (mold, params) => {
  return http_v2.get(`/molds/${mold}/usable-files`, { params });
};

/**
 * 大模型测试
 */
export const testLLM = (mold, data) => {
  return http_v2.post(`/molds/${mold}/llm-test`, data);
};

export const importMoldData = (mold, data) => {
  return http_v2.post(`/molds/${mold}/import-mold-data`, data);
};

export const exportMoldData = (mold, params) => {
  return http_v2.get(`/molds/${mold}/export-mold-data`, { params });
};
