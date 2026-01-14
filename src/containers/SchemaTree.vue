<template>
  <div class="schema-tree">
    <el-container>
      <el-header v-if="showSchemaTreeHeader">
        <el-breadcrumb class="schema-nav" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/schema' }">
            {{ $text.schema['Schema管理'] }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="tree.full">{{
            tree.full.data.top.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if="isLLMMode" class="search-bar">
          <span class="label">字段名称：</span>
          <el-input
            v-model="search.name"
            size="medium"
            placeholder="请输入字段名称"
            clearable
            @clear="searchField"
            @keyup.enter.native="searchField"></el-input>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="searchField"></el-button>
        </div>
      </el-header>
      <el-main>
        <el-tabs
          v-if="!isLLMMode"
          :value="panelType"
          type="card"
          @tab-click="changeTab">
          <el-tab-pane
            :label="$text.schema['Schema树']"
            name="tree"
            :lazy="true">
            <schema-tree-panel
              ref="schemaTreePanel"
              :tree="tree"
              :types="schemaTypes"
              :schemas="schemas"
              :schemaId="schemaId"
              :groups="groups"
              @open-row-editor="openRowEditor"
              @open-struct-editor="openStructEditor"
              @insert-empty-node="insertEmptyNode"
              @hide-row-editor="hideTreeNodeRowEditor"
              @persist-node="persistTreeNode"
              @persist-schema-part="persistSchemaPart"
              @modify-model-config="modifyModelConfig"
              @delete-node="deleteTreeNode"
              @close-part-info="handleClose"
              @mark-schema-words="markSchemaWords"
              @move-node="moveNode"
              @select-type-action="selectTypeAction"
              @cover-schema-success="initSchemaTree">
            </schema-tree-panel>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowMoldTypeManagePanel"
            :label="$text.schema['类型管理']"
            name="type"
            :lazy="true">
            <schema-type-panel
              ref="schemaTypePanel"
              :types="schemaTypes"
              :isLoading="tree.isLoading"
              @remove-schema-type="removeSchemaType"></schema-type-panel>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowExportLabelJson"
            :label="$t(`message['导出提取结果']`) + '(json)'"
            name="export-answer-json"
            :lazy="true">
            <schema-export-answer
              v-if="panelType === 'export-answer-json'"></schema-export-answer>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowExportAnswerCsv"
            :label="exportAnswerCsvText"
            name="export-answer-csv"
            :lazy="true">
            <schema-export-answer
              v-if="panelType === 'export-answer-csv'"></schema-export-answer>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowExportLabelTxt"
            :label="$t(`message['导出标注txt']`)"
            name="export-answer-txt"
            :lazy="true">
            <schema-export-answer
              v-if="panelType === 'export-answer-txt'"></schema-export-answer>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowExportInspectCsv"
            :label="$t(`message['导出审核结果']`)"
            name="export-inspect-csv"
            :lazy="true">
            <schema-export-answer
              v-if="panelType === 'export-inspect-csv'"></schema-export-answer>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowExportCatalogcsv"
            :label="$t(`message['导出目录结构']`)"
            name="export-catalog-csv"
            :lazy="true">
            <schema-export-answer
              v-if="panelType === 'export-catalog-csv'"></schema-export-answer>
          </el-tab-pane>
          <el-tab-pane
            v-if="isShowModelManagePanel"
            :label="
              configuration.client_name === 'gjzq'
                ? '模型管理'
                : $text.schema['模型管理']
            "
            name="model-management"
            :lazy="true">
            <component :is="modelComponent" :schema-id="schemaId"></component>
          </el-tab-pane>
          <el-tab-pane
            v-if="$features.showSchemaRule()"
            :label="$t(`message['规则判断']`)"
            name="rule"
            :lazy="true">
            <schema-rule :tree="tree" :schema-id="schemaId"></schema-rule>
          </el-tab-pane>
          <el-tab-pane
            v-if="$features.showDataProduction()"
            :label="$t(`message['数据生产']`)"
            name="data-production"
            :lazy="true">
            <schema-data-production></schema-data-production>
          </el-tab-pane>
          <el-tab-pane
            v-if="$platform.isCmfchinaEnv()"
            label="AB比对推送地址配置"
            name="ab-push-url-config">
            <cmfchina-ab-push-url-config
              :schema-id="schemaId"></cmfchina-ab-push-url-config>
          </el-tab-pane>
        </el-tabs>

        <el-tabs
          v-if="isLLMMode"
          :value="panelType"
          type="card"
          @tab-click="changeTab">
          <el-tab-pane label="Schema树" name="llm-tree">
            <schema-tree-panel-llm
              v-if="panelType === 'llm-tree'"
              ref="schemaTreePanelLLM"
              :tree="tree"
              :types="schemaTypes"
              :schemas="schemas"
              :schemaId="schemaId"
              @open-struct-editor="openStructEditor"
              @delete-node="deleteTreeNode"
              @move-node="moveNode"
              @cover-schema-success="initSchemaTree">
            </schema-tree-panel-llm>
          </el-tab-pane>
          <el-tab-pane
            label="模型管理"
            name="llm-model-management"
            :disabled="!showLLMModelManagement"
            :lazy="true">
            <schema-mold-management
              :schema-id="schemaId"
              :llm-mode="true"></schema-mold-management>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { schema, SCHEMA_TYPE_ACTION, SCHEMA_TYPE } from '../store/constants';
import { getSchemaType, EventBus } from '../utils';
import SchemaPartInfo from '../components/SchemaPartInfo';
import SchemaTreePanel from '../components/SchemaTreePanel';
import SchemaTreePanelLlm from '../components/SchemaTreePanelLLM';
import SchemaTypePanel from '../components/SchemaTypePanel';
import SchemaExportAnswer from '../components/SchemaExportAnswer';
import SchemaMoldTraining from '../components/SchemaMoldTraining';
import SchemaMoldManagement from '../components/SchemaMoldManagement';
import SchemaMoldTrainingTest from '../components/SchemaMoldTrainingTest';
import SchemaMoldTrainingDetails from '../components/SchemaMoldTrainingDetails';
import SchemaDataProduction from '../components/SchemaDataProduction';
import SchemaRule from '../custom/ht/components/SchemaRule';
import CmfchinaSceneModelRoute from '../custom/cmfchina/components/SceneModelRoute';
import CmfchinaAbPushUrlConfig from '../custom/cmfchina/components/AbPushUrlConfig';
import { fetchUserBusinessGroups } from '../store/api/cmfchina.api';

export default {
  name: 'schema-tree',
  components: {
    SchemaPartInfo,
    SchemaTreePanel,
    SchemaTreePanelLlm,
    SchemaTypePanel,
    SchemaExportAnswer,
    SchemaMoldTraining,
    SchemaMoldManagement,
    SchemaMoldTrainingTest,
    SchemaMoldTrainingDetails,
    SchemaDataProduction,
    SchemaRule,
    CmfchinaSceneModelRoute,
    CmfchinaAbPushUrlConfig,
  },
  props: {
    schemaId: {
      type: Number,
      required: true,
    },
    panelType: {
      type: String,
      default: 'tree',
    },
  },
  provide() {
    return {
      canEditSchema: () => this.canEditSchema,
    };
  },
  created() {
    this.initSchemaTree();
    this.setModelComponent();
  },
  beforeDestroy() {
    this.resetBreadcrumb();
  },
  data() {
    return {
      modelComponent: 'SchemaMoldManagement',
      groups: [],
      search: {
        name: '',
      },
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['tree', 'schemas', 'schemaTypes']),
    ...mapGetters(['configuration', 'loginUser']),
    schema() {
      return this.schemas.items.find((i) => i.id === this.schemaId) || {};
    },
    isShowMoldTypeManagePanel() {
      if (this.tree.full && this.tree.full.mold_type) {
        return this.tree.full.mold_type !== 1; // 0-复杂长文档信息抽取 1-固定版式文档KV抽取
      }
      return true;
    },
    isShowExportLabelJson() {
      return this.configuration.export_label_data;
    },
    isShowExportLabelTxt() {
      return this.configuration.export_label_txt;
    },
    isShowExportAnswerCsv() {
      if (this.$platform.isCmfchinaEnv()) {
        return false;
      }
      return this.configuration.export_answer_csv;
    },
    isShowExportInspectCsv() {
      return this.configuration.export_inspect_result;
    },
    isShowExportCatalogcsv() {
      const displayOtherTabs =
        this.configuration.schema_manager_display_other_tabs;
      const schemaName = this.schemas.current && this.schemas.current.name;

      return (
        displayOtherTabs &&
        displayOtherTabs[schemaName] &&
        displayOtherTabs[schemaName].includes('导出目录结构')
      );
    },
    isCanStatAccuracy() {
      return this.configuration.stat_accuracy;
    },
    isKVModel() {
      return (
        this.tree.full &&
        this.tree.full.mold_type &&
        this.tree.full.mold_type === 1
      );
    },
    isShowModelManagePanel() {
      return this.$isAllowed('manageModel');
    },
    canEditSchema() {
      if (
        !(
          this.$isAllowed('manageSchema') ||
          this.schema.uid === this.loginUser.id
        )
      ) {
        return false;
      }
      if (this.schemas && this.schemas.items) {
        const currentSchema = this.schemas.items.find(
          (schema) => this.schemaId === schema.id,
        );
        if (currentSchema) {
          return !currentSchema.readonly;
        }
        return true;
      }
      return true;
    },
    showSchemaTreeHeader() {
      return !this.$platform.isNafmiiEnv();
    },
    isCmfchinaEnv() {
      return this.$platform.isCmfchinaEnv();
    },
    exportAnswerCsvText() {
      if (this.$platform.isNafmiiEnv()) {
        return this.$t(`message['导出提取结果']`);
      }
      return this.$t(`message['导出提取结果']`) + '(csv)';
    },
    isLLMMode() {
      return ['llm-tree', 'llm-model-management'].includes(this.panelType);
    },
    showLLMModelManagement() {
      const schemas = this.tree.response?.schemas;
      if (_.isEmpty(schemas)) {
        return false;
      }
      for (let i = 0; i < schemas.length; i++) {
        const s = schemas[i];
        for (const key in s.schema) {
          if (s.schema[key].extract_type !== SCHEMA_TYPE.LLM.type) {
            return true;
          }
        }
      }
      return false;
    },
  },
  watch: {
    $route() {
      this.setModelComponent();
    },
    'tree.full': {
      handler() {
        this.getBreadCrumbData();
      },
      immediate: true,
    },
  },
  methods: {
    initSchemaTree() {
      try {
        this.$store.commit('schemaModule/SET_TREE_ID', this.schemaId);
        this.$store.commit('schemaModule/SET_SCHEMATREE_DATA', {
          data: {},
          meta: {},
        });
        this.$store.dispatch('schemaModule/fetchTreeData');
        this.$store.dispatch('schemaModule/fetchSchemas', { isAuto: true });
        if (this.isShowModelManagePanel) {
          this.$store.dispatch('schemaModule/fetchModelClass', {
            schemaId: this.schemaId,
          });
        }
        if (this.$features.supportBusinessGroup()) {
          this.getUserGroups();
        }
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    getBreadCrumbData() {
      if (this.$platform.isNafmiiEnv()) {
        const breadCrumbData = [{ name: this.tree.full?.data.top.name }];
        this.$store.commit('nafmiiModule/SET_BREAD_CRUMB_DATA', breadCrumbData);
      }
    },
    setModelComponent() {
      if (this.isCmfchinaEnv && this.configuration.client_name === 'cmfchina') {
        this.modelComponent = 'CmfchinaSceneModelRoute';
      } else {
        this.modelComponent = 'SchemaMoldManagement';
        if (this.$route.query.vid && !this.$route.query.testId) {
          this.modelComponent = 'SchemaMoldTrainingTest';
        }
        if (this.$route.query.testId) {
          this.modelComponent = 'SchemaMoldTrainingDetails';
        }
      }
    },

    /**
     * 打开自定义类型表单
     */
    openStructEditor({ node }) {
      this.$store.dispatch('schemaModule/openEditPopup', {
        index: node.meta._index,
      });
    },
    /**
     * 打开 tree node 表单
     */
    openRowEditor({ node }) {
      this.$store.commit('schemaModule/TOGGLE_EMPTY_NODE', {
        nodeIndex: node.meta._nodeIndex,
        isHide: true,
      });
    },
    markSchemaWords(wordsNode) {
      this.$store.dispatch('schemaModule/persistSchemaWords', {
        wordsNode,
      });
    },
    async persistSchemaPart({ current }) {
      try {
        this.$store.commit('schemaModule/SET_TREE_LOADING', true);
        await this.$store.dispatch('schemaModule/persistSchemaPart', {
          current,
        });
        this.handleClose();
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$text.schema['Schema 修改成功'],
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_TREE_LOADING', false);
      }
    },
    modifyModelConfig(data) {
      this.$store.dispatch('schemaModule/saveModelConfig', {
        data,
      });
    },
    handleClose() {
      this.$store.commit('schemaModule/SET_PART_DATA', null);
    },
    insertEmptyNode({ index }) {
      this.$store.commit('schemaModule/INSERT_EMPTY_NODE', index);
    },
    hideTreeNodeRowEditor({ node }) {
      if (node.meta._mode === schema.TREENODE_CREATE) {
        // 取消新建状态下的面板
        this.$store.commit('schemaModule/CLEAR_EMPTY_NODE', node.meta._index);
      } else {
        // 取消了修改状态下的面板
        this.$store.commit('schemaModule/TOGGLE_EMPTY_NODE', {
          nodeIndex: node.meta._nodeIndex,
          isHide: false,
        });
      }
    },
    async persistTreeNode({ node, callback }) {
      // 子组件负责校验
      try {
        await this.$store.dispatch('schemaModule/persistTreeNode', {
          index: node.meta._index,
          mode: node.meta._mode,
          treeNode: {
            name: node.data.name || node.data.label,
            alias: node.data.alias,
            type: node.data.type,
            required: node.data.required,
            multi: node.data.multi,
            description: node.data.description,
            attrs: node.attrs || [],
          },
          callback,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$text.schema['Schema 修改成功'],
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteTreeNode({ index, label = '', type, cb }) {
      const result = await this.$confirm(
        this.$t(`message['确定删除"{name}"吗？']`, { name: label }),
        this.$t(`message['提示']`),
        {
          confirmButtonText: this.$t(`message['确定']`),
          cancelButtonText: this.$t(`message['取消']`),
          type: 'warning',
        },
      ).catch(() => {});
      if (result === 'confirm') {
        this.$store.dispatch('schemaModule/deleteTreeNode', {
          index,
          label,
          type,
          callback: (err) => {
            if (!err) {
              this.$notify({
                title: this.$t(`message['成功']`),
                message: this.$t(`message['“{name}”删除成功']`, {
                  name: label ? label : '',
                }),
                type: 'success',
              });
            }
            cb?.();
          },
        });
      }
    },
    moveNode({ dataIndex, oldIndex, index }) {
      if (oldIndex !== index) {
        this.$store.dispatch('schemaModule/moveTreeNode', {
          dataIndex,
          oldIndex,
          index,
        });
      }
    },
    getEnumType(type) {
      return getSchemaType(this.schemaTypes, type);
    },
    changeTab(vNode) {
      const moldType = this.tree.full.mold_type;
      let path = '';
      if (vNode.name === 'moldLocation' && moldType === 1) {
        path = `/schema/${this.schemaId}/${vNode.name}?moldType=${moldType}`;
      } else {
        path = `/schema/${this.schemaId}/${vNode.name}`;
      }
      this.$router.push({
        path,
      });
    },
    async removeSchemaType({ type, label }) {
      try {
        await this.$store.dispatch('schemaModule/removeSchemaType', {
          type,
          label,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['类型删除成功']`),
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    selectTypeAction(action) {
      this.$router.push({ path: `/schema/${this.schemaId}/type?from=tree` });
      this.$nextTick(() => {
        if (action === SCHEMA_TYPE_ACTION.ADD_ENUM) {
          this.$refs.schemaTypePanel.openEnumTypePopup();
        } else if (action === SCHEMA_TYPE_ACTION.ADD_GROUP) {
          this.$refs.schemaTypePanel.openGroupTypePopup();
        }
      });
    },
    async getUserGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    resetBreadcrumb() {
      if (this.$platform.isNafmiiEnv()) {
        this.$store.commit('nafmiiModule/SET_BREAD_CRUMB_DATA', []);
      }
    },
    searchField() {
      EventBus.$emit('search-schema-field', this.search);
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-tree {
  height: calc(100vh - 61px);
  overflow-y: auto;
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    .search-bar {
      display: flex;
      align-items: center;
      .label {
        display: inline-block;
        font-size: 14px;
        color: #606266;
      }
      .el-input {
        width: 300px;
        ::v-deep .el-input__inner {
          border-radius: 0;
          border-right: none;
        }
      }
      .el-button {
        height: 36px;
        padding: 0 26px;
        font-size: 16px;
        border: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        > span {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .el-tabs {
    ::v-deep .el-tabs__item {
      &.is-disabled {
        cursor: not-allowed;
        &:hover {
          color: #c0c4cc !important;
        }
      }
    }
  }
}
</style>
