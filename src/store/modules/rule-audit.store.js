import { ruleAudit as ruleAuditApi, cmfchina as cmfchinaApi } from '../api';
import platformPerimeter from '@/perimeters/platform.perimeter';

const state = {
  auditRules: [],
  multiSchemaAuditRules: [],
};
const getters = {
  auditRules: (state) => state.auditRules,
  multiSchemaAuditRules: (state) => state.multiSchemaAuditRules,
};
const mutations = {
  SET_AUDIT_RULES: (state, data) => {
    state.auditRules = data;
  },
  SET_MILTI_SCHEMA_AUDIT_RULES: (state, data) => {
    state.multiSchemaAuditRules = data;
  },
};

const actions = {
  async fetchFileAuditRuleResult({ commit }, { fileId, schemaId }) {
    let data = [];
    if (platformPerimeter.isCmfchinaEnv()) {
      const res = await cmfchinaApi.fetchInspectRuleResults(fileId);
      data = res.data.find((item) => item.mold.id === schemaId)?.results || [];
      commit('SET_MILTI_SCHEMA_AUDIT_RULES', res.data);
    } else {
      const res = await ruleAuditApi.fetchFileAuditRuleResult(fileId, schemaId);
      data = res.data;
    }
    commit('SET_AUDIT_RULES', data);
  },
  async updateAuditRuleResult(context, { fileId, schemaId, data }) {
    const result = await ruleAuditApi.updateAuditRuleResult({
      fileId,
      schemaId,
      data,
    });
    return result;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
