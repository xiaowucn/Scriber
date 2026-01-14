<template>
  <el-container class="schema-tree-panel-container">
    <el-main>
      <tree-list
        ref="schema-tree"
        v-if="tree.data"
        :data="tree.data"
        :draggable="canEditSchema()">
        <div
          v-if="node !== null"
          class="node-line"
          :class="getSearchMatchedNodeClass(node)"
          slot-scope="{ node }">
          <div class="node-tags">
            <span class="node-name" :class="getNodeNameClassName(node)">
              <template v-if="searchKeyword === ''">
                {{ node.data.label }}
              </template>
              <span v-else v-html="getSearchMatchedNodeName(node.data.label)">
              </span>
            </span>
            <el-tag
              v-if="
                node.meta._partType !== 'root' && node.meta?._path?.length <= 2
              "
              :class="[
                EXTRACT_TYPE[node.data.extract_type]?.value ||
                  SCHEMA_TYPE.CUSTOM.type,
              ]">
              {{
                EXTRACT_TYPE[node.data.extract_type]?.label ||
                SCHEMA_TYPE.CUSTOM.label
              }}
            </el-tag>
            <schema-tree-node-type
              class="node-type"
              :type="
                node.meta._partType === 'root'
                  ? tree.full.model_name || ''
                  : node.data.type || ''
              "
              :types="types"
              :show-group-type="true">
            </schema-tree-node-type>
          </div>
          <div class="node-btns">
            <el-tooltip effect="dark" content="新增" placement="top">
              <el-button
                v-if="canAddFieldNode(node)"
                :ref="`add-${node.meta._nodeIndex}`"
                type="text"
                :disabled="!canEditSchema()"
                @click.stop="addFieldNode(node)">
                <svg-font-icon name="add" color="#333"></svg-font-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :open-delay="1000">
              <el-button
                :ref="`update-${node.meta._nodeIndex}`"
                type="text"
                :disabled="!canEditSchema()"
                @click.stop="editFieldNode(node)">
                <svg-font-icon name="edit" color="#333"></svg-font-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="测试"
              placement="top"
              :open-delay="1000">
              <el-button
                v-if="canTest(node)"
                type="text"
                :disabled="!canEditSchema()"
                @click.stop="openTestDialog(node)">
                <svg-font-icon name="test" color="#888"></svg-font-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip
              v-if="node.meta._partType !== 'root'"
              effect="dark"
              content="删除"
              placement="top"
              :open-delay="1000">
              <el-button
                type="text"
                :disabled="!canEditSchema()"
                @click.stop="deleteFieldNode(node.meta, node.data.label)">
                <svg-font-icon name="delete" color="#333"></svg-font-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip
              v-if="node.meta._partType === 'root'"
              effect="dark"
              content="导入json"
              placement="top">
              <el-upload
                ref="upload"
                accept=".json"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleUploadChange"
                action="">
                <el-button type="text">
                  <svg-font-icon
                    name="import-json"
                    color="#333"></svg-font-icon>
                </el-button>
              </el-upload>
            </el-tooltip>

            <el-tooltip
              v-if="node.meta._partType === 'root'"
              effect="dark"
              content="导出json"
              placement="top">
              <el-button type="text" @click.stop="exportSchema">
                <svg-font-icon name="upload" color="#333"></svg-font-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </tree-list>
    </el-main>

    <div ref="dragResizeLine" v-show="isEditing" class="drag-resize-line"></div>

    <transition name="slide">
      <el-aside v-show="isEditing" :style="{ width: sidebarWidth }">
        <h5 class="title">
          {{ getEditorTitle(newNode) }}
          <i class="el-icon-close" @click="closeEditor"></i>
        </h5>
        <el-form
          ref="fieldForm"
          :model="fieldForm"
          :rules="fieldFormRules"
          label-width="120px">
          <template
            v-if="
              newNode.meta._partType === 'root' &&
              newNode.meta._mode === 'TREENODE_UPDATE'
            ">
            <el-form-item label="Schema名称:" prop="name">
              <el-input
                v-model="fieldForm.name"
                size="small"
                placeholder="请输入Schema名称"></el-input>
            </el-form-item>
            <el-form-item label="大模型选择:" prop="model_name">
              <el-select
                v-model="fieldForm.model_name"
                size="small"
                clearable
                placeholder="请选择大模型">
                <el-option
                  v-for="(item, index) in schemas.llm.list"
                  :key="index"
                  :label="item.model"
                  :value="item.model">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="字段名称:" prop="data.label">
              <el-input
                v-model="fieldForm.data.label"
                size="small"
                placeholder="请输入字段名称"></el-input>
            </el-form-item>
            <el-form-item label="字段类型:" prop="type">
              <el-select
                v-model="fieldForm.type"
                size="small"
                clearable
                placeholder="请选择字段类型">
                <el-option
                  v-for="(type, index) in FIELD_TYPES"
                  :key="index"
                  :label="type.label"
                  :value="type.label">
                </el-option>
              </el-select>
              <div v-if="fieldForm.type === ENUM" class="enums">
                <el-form ref="enumForm" :model="fieldForm" label-width="65px">
                  <el-form-item
                    v-for="(item, index) in fieldForm.enum.values"
                    :key="index"
                    :prop="'enum.values.' + index + '.name'"
                    :rules="enumFieldRules"
                    label="枚举值:">
                    <div class="form-item-inline">
                      <el-input
                        v-model="item.name"
                        size="mini"
                        placeholder="请输入枚举值"></el-input>
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteEnumValue(index)"></el-button>
                    </div>
                  </el-form-item>
                </el-form>
                <div class="btns">
                  <el-button type="text" size="small" @click="addEnumValue">
                    + 新增枚举值
                  </el-button>
                </div>
              </div>
              <div v-if="fieldForm.type === GROUP" class="groups">
                <el-form
                  label-width="65px"
                  :model="fieldForm"
                  ref="subFieldForm">
                  <el-form-item
                    v-for="(item, index) in fieldForm.children"
                    :key="index"
                    label="子字段:"
                    :prop="'children.' + index + '.data.label'"
                    :rules="subfieldRules">
                    <div class="form-item-inline">
                      <el-input
                        v-model="item.data.label"
                        size="mini"
                        placeholder="请输入子字段"></el-input>
                      <span class="label">类型:</span>
                      <el-select
                        v-model="item.data.type"
                        size="mini"
                        placeholder="请选择类型">
                        <el-option
                          v-for="(type, index) in SUB_FIELD_TYPES"
                          :key="index"
                          :label="type.label"
                          :value="type.label">
                        </el-option>
                      </el-select>
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteSubfield(index)"></el-button>
                    </div>
                    <div
                      v-if="item.data.type === '枚举'"
                      class="subfield-enums">
                      <h5>枚举值:</h5>
                      <el-form
                        ref="subFieldEnumForm"
                        :model="fieldForm"
                        class="enum-list">
                        <el-form-item
                          v-for="(itm, idx) in item.meta._type.values"
                          :key="idx"
                          :prop="
                            'children.' +
                            index +
                            '.meta._type.values.' +
                            idx +
                            '.name'
                          "
                          :rules="[
                            {
                              validator: validateSubfieldEnumValues(
                                item.meta._type.values,
                              ),
                              trigger: ['blur', 'change'],
                            },
                          ]"
                          class="enum">
                          <div class="enum-input">
                            <el-input v-model="itm.name" size="mini"></el-input>
                            <i
                              class="el-icon-error"
                              @click="deleteSubfieldEnum(item, idx)"></i>
                          </div>
                        </el-form-item>
                        <div class="enum">
                          <el-button
                            type="primary"
                            size="mini"
                            @click="addSubfieldEnum(item)">
                            新增枚举值
                          </el-button>
                        </div>
                      </el-form>
                    </div>
                  </el-form-item>
                </el-form>
                <div class="btns">
                  <el-button type="text" size="small" @click="addSubfield">
                    + 新增子字段
                  </el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              v-if="fieldForm.meta?._path.length <= 2"
              label="提取模型:"
              prop="data.extract_type">
              <el-radio-group v-model="fieldForm.data.extract_type">
                <el-radio
                  v-for="(v, k) in EXTRACT_TYPE"
                  :key="k"
                  :label="v.value">
                  {{ v.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <template
              v-if="fieldForm.data.extract_type === EXTRACT_TYPE.llm.value">
              <el-form-item
                v-if="fieldForm.meta?._path.length <= 3"
                label="提取规则说明:">
                <el-input
                  type="textarea"
                  v-model="fieldForm.data.description"
                  size="small"
                  rows="5"
                  placeholder="请输入提取规则"></el-input>
              </el-form-item>
              <el-form-item
                v-if="fieldForm.type !== GROUP && fieldForm.type !== ENUM"
                label="后规则处理:">
                <el-input
                  type="textarea"
                  v-model="fieldForm.data.regex"
                  size="small"
                  rows="5"
                  placeholder="请输入正则表达式"></el-input>
              </el-form-item>
            </template>
            <schema-mold-extraction-config
              v-show="
                fieldForm.data.extract_type === EXTRACT_TYPE.exclusive.value
              "
              ref="model-extract-config"
              class="extraction-config"
              :key="fieldForm.meta?._path?.join('-')"
              :model="modelExtractionConfig"
              :predictors="predictors"
              :field-type="fieldForm.type === GROUP ? 'group' : ''"
              :version-id="currentModelExtractionConfig.id">
            </schema-mold-extraction-config>
          </template>
        </el-form>
        <div class="bottom-btns">
          <el-button size="small" @click="closeEditor">取消</el-button>
          <el-button
            v-if="canTest(newNode)"
            type="primary"
            size="small"
            @click="openTestDialog(newNode)">
            开始测试
          </el-button>
          <el-button
            type="primary"
            size="small"
            :loading="submitLoading"
            @click="updateFieldNode">
            确定
          </el-button>
        </div>
      </el-aside>
    </transition>

    <el-dialog
      v-if="testDialogVisible"
      :visible="true"
      title="测试"
      width="600px"
      class="test-dialog"
      @close="closeTestDialog">
      <el-form
        ref="testForm"
        v-loading="testLoading"
        :model="testForm"
        :rules="testFormRules"
        label-width="100px">
        <el-form-item label="测试文档:" prop="fid">
          <div class="form-item-inline">
            <el-select
              v-model="testForm.fid"
              size="small"
              placeholder="请选择系统已解析成功的文件">
              <el-option
                v-for="item in testFiles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type="text" size="small" @click="test">测试</el-button>
          </div>
        </el-form-item>
        <el-divider>测试结果</el-divider>
        <el-form-item label="提取结果:">
          <el-input
            type="textarea"
            rows="5"
            v-model="testForm.result"
            size="small"
            disabled></el-input>
        </el-form-item>
        <el-form-item label="枚举结果:">
          <el-input
            type="input"
            v-model="testForm.enum"
            size="small"
            disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="closeTestDialog">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import _ from 'lodash';
import { EventBus, getCounterGenerate, downloadFileByBlob } from '../utils';
import {
  schema,
  schemaDefaultType,
  schemaEnumType,
  SCHEMA_TYPE,
  LLM_SCHEMA_FIELD_TYPES,
  modelEnableStatus,
} from '../store/constants';
import SchemaTreeNodeType from './SchemaTreeNodeType';
import TreeList from './tree/TreeList';
import SchemaMoldExtractionConfig from './SchemaMoldExtractionConfig.vue';
import {
  fetchLLMTestFiles,
  testLLM,
  importMoldData,
  exportMoldData,
} from '../store/api/schema.api';

const ENUM = '枚举';
const GROUP = '组合';

const EXTRACT_TYPE = {
  llm: {
    value: 'llm',
    label: '大模型',
  },
  exclusive: {
    value: 'exclusive',
    label: '专有模型',
  },
};

export default {
  name: 'schema-tree-panel-llm',
  components: {
    SchemaTreeNodeType,
    TreeList,
    SchemaMoldExtractionConfig,
  },
  props: {
    tree: {
      type: Object,
      required: true,
    },
    types: {
      type: Array,
      default: () => [],
    },
    schemaId: {
      type: Number,
      required: true,
    },
    schemas: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: ['canEditSchema'],
  data() {
    return {
      ENUM,
      GROUP,
      EXTRACT_TYPE,
      SCHEMA_TYPE,
      schemaEnumType,
      newNode: {
        meta: {
          _mode: '',
          _index: -1,
          _nodeIndex: -1,
          _path: [],
          _parent: [],
        },
        data: {
          name: '',
          alias: '',
          type: schemaDefaultType,
          required: false,
          multi: false,
          description: '',
          regex: '',
          extract_type: 'llm',
        },
      },
      submitLoading: false,
      fieldFormCloned: null,
      fieldForm: {
        data: {
          label: '',
          type: schemaDefaultType,
          required: false,
          multi: false,
          description: '',
          regex: '',
          extract_type: 'llm',
        },
      },
      predictors: [],
      modelExtractionConfig: {
        name: '',
        path: [],
        models: [],
      },
      getCounter: getCounterGenerate(),
      fieldFormRules: {
        name: [
          {
            required: true,
            message: '请输入Schema名称',
            trigger: ['blur', 'change'],
          },
        ],
        'data.label': [
          {
            required: true,
            message: '请输入字段名称',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^(?!\s)(?!.*[.&/])(?!.*\s$).*$/,
            message:
              '字段不允许包含‘.’、‘&’、‘/’等特殊字符，且不能以空格开头或结尾',
            trigger: ['blur', 'change'],
          },
          {
            validator: (rule, value, cb) => {
              const topIndex = this.tree.full.data.top.attrs
                .filter((item) => item.name !== this.fieldForm.old_name)
                .findIndex((item) => item.name === value);
              if (['root', 'top'].includes(this.fieldForm.meta._partType)) {
                if (topIndex !== -1) {
                  return cb(`已有名称为“${value}”的字段`);
                }
              }

              const normalIndex = this.tree.full.data.normals
                .filter((item) => item.name !== this.fieldForm.old_name)
                .findIndex((item) => item.name === value);
              if (normalIndex !== -1) {
                return cb(`已有名称为“${value}”的字段`);
              }

              const parentNodeName = _.last(this.fieldForm.meta._parent);
              if (parentNodeName) {
                const parentNode = this.tree.full.data.normals.find(
                  (item) => item.name === parentNodeName,
                );
                if (parentNode) {
                  const index = parentNode.attrs
                    .filter((attr) => attr.name !== this.fieldForm.old_name)
                    .findIndex((item) => item.name === value);
                  if (index !== -1) {
                    return cb(`已有名称为“${value}”的字段`);
                  }
                }
              }
              return cb();
            },
          },
        ],
        model_name: [
          { required: true, message: '请选择大模型', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择字段类型', trigger: 'change' },
        ],
      },
      subfieldRules: [
        {
          required: true,
          message: '子字段名称不能为空',
          trigger: ['blur', 'change'],
        },
        {
          pattern: /^(?!\s)(?!.*[.&/])(?!.*\s$).*$/,
          message:
            '子字段不允许包含‘.’、‘&’、‘/’等特殊字符，且不能以空格开头或结尾',
          trigger: ['blur', 'change'],
        },
        {
          validator: (rule, value, cb) => {
            const count = this.fieldForm.children.filter(
              (child) => child.data.label === value,
            ).length;
            if (count > 1) {
              return cb(`子字段“${value}”已存在`);
            }
            return cb();
          },
          trigger: ['blur', 'change'],
        },
      ],
      enumFieldRules: [
        {
          required: true,
          message: '枚举值不能为空',
          trigger: ['blur', 'change'],
        },
        {
          validator: (rule, value, cb) => {
            const count = this.fieldForm.enum.values.filter(
              (enumItem) => enumItem.name === value,
            ).length;
            if (count > 1) {
              return cb(`枚举值“${value}”已存在`);
            }
            return cb();
          },
          trigger: ['blur', 'change'],
        },
      ],
      isEditing: false,
      sidebarWidth: '40%',
      lastSidebarWidth: '40%',
      testDialogVisible: false,
      testLoading: false,
      testForm: {
        fieldPath: '',
        fid: '',
        result: '',
        enum: '',
      },
      testFormRules: {
        fid: [{ required: true, message: '请选择测试文档', trigger: 'change' }],
      },
      testFiles: [],
      searchKeyword: '',
      searchIndex: 0,
      importJsonForm: {
        file: null,
      },
    };
  },
  computed: {
    canTest() {
      return () => {
        return false;
        // return (
        //   node.meta._partType !== 'root' && node.meta._type?.type === 'group'
        // );
      };
    },
    FIELD_TYPES() {
      if (
        this.fieldForm.meta?._partType === 'root' ||
        this.fieldForm.meta?._path.length <= 2
      ) {
        return LLM_SCHEMA_FIELD_TYPES;
      }
      return this.SUB_FIELD_TYPES;
    },
    SUB_FIELD_TYPES() {
      return LLM_SCHEMA_FIELD_TYPES.filter((item) => item.label !== GROUP);
    },
    currentModelExtractionConfig() {
      const enabledModelConfig = this.schemas.model.releaseList.find(
        (item) => item.enable === modelEnableStatus.enabled,
      );
      return (
        enabledModelConfig || this.schemas.model.releaseList[0] || { id: -1 }
      );
    },
  },
  watch: {
    fieldForm: {
      handler() {
        this.setFieldModelExtractionConfigPrimaryKey();
      },
      deep: true,
    },
    'fieldForm.data.extract_type'(type) {
      if (type === SCHEMA_TYPE.LLM.type) {
        this.$refs['model-extract-config']?.setCurrentExtractionMode(null);
      }
      if (type === SCHEMA_TYPE.CUSTOM.type) {
        this.$refs['model-extract-config']?.init();
      }
    },
  },
  created() {
    EventBus.$on('search-schema-field', this.searchFields);
    EventBus.$on('move-node', this.moveNode);
    this.init();
  },
  beforeDestroy() {
    EventBus.$off('search-schema-field', this.searchFields);
    EventBus.$off('move-node', this.moveNode);
  },
  mounted() {
    this.dragResize();
  },
  methods: {
    init() {
      this.getLLMList();
      this.getModelConfig();
    },
    getLLMList() {
      try {
        this.$store.dispatch('schemaModule/fetchLLMList');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
        });
      }
    },
    async getModelConfig() {
      try {
        await this.$store.dispatch('schemaModule/fetchModelReleaseList', {
          schemaId: this.schemaId,
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    dragResize() {
      const el = this.$refs.dragResizeLine;
      const container = el.parentNode;
      const aside = container.querySelector('.el-aside');
      const main = container.querySelector('.el-main');

      if (!aside || !main) {
        return;
      }

      let startX = 0;
      let startWidth = 0;
      let dragging = false;

      const onMouseDown = (e) => {
        dragging = true;
        startX = e.clientX;
        startWidth = aside.offsetWidth;
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (e) => {
        if (!dragging) return;
        const diff = e.clientX - startX;
        const draggingWidth = startWidth - diff;

        const vw = window.innerWidth || document.documentElement.clientWidth;
        const minWidth = Math.round(vw * 0.3);
        const maxWidth = Math.round(vw * 0.7);
        let newWidth = draggingWidth;
        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;
        this.sidebarWidth = newWidth + 'px';
        this.lastSidebarWidth = newWidth + 'px';
      };

      const onMouseUp = () => {
        dragging = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      el.addEventListener('mousedown', onMouseDown);
    },
    canAddFieldNode(node) {
      return node.meta._partType === 'root';
    },
    searchFields(params) {
      const newKeyword = params.name || '';
      const prevKeyword = this.searchKeyword;
      this.searchKeyword = newKeyword;

      this.$nextTick(() => {
        const treeEl =
          this.$refs['schema-tree'] && this.$refs['schema-tree'].$el;
        const allMatchedNodes = treeEl
          ? treeEl.querySelectorAll('.node-line.highlight')
          : [];

        const len = allMatchedNodes.length;
        if (len === 0) {
          this.searchIndex = 0;
          return;
        }

        if (prevKeyword === newKeyword) {
          this.searchIndex = (this.searchIndex + 1) % len;
        } else {
          this.searchIndex = 0;
        }

        allMatchedNodes.forEach((node) => node.classList.remove('active'));
        const el = allMatchedNodes[this.searchIndex];
        if (el) {
          el.classList.add('active');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    },
    getSearchMatchedNodeClass(node) {
      if (!this.searchKeyword) {
        return '';
      }
      return node.data.label.includes(this.searchKeyword) ? 'highlight' : '';
    },
    getSearchMatchedNodeName(text) {
      return text.replace(
        new RegExp(this.searchKeyword, 'g'),
        `<span class="keyword">${this.searchKeyword}</span>`,
      );
    },
    getNodeNameClassName(node) {
      return _.isEqual(node.meta?._deepLabels, this.fieldForm.meta?._deepLabels)
        ? 'active'
        : '';
    },
    getEditorTitle(node) {
      if (node.meta._partType === 'root') {
        if (node.meta._mode === schema.TREENODE_CREATE) {
          return '新增字段设置';
        }
        return 'Schema 设置';
      }
      if (node.meta._mode === schema.TREENODE_CREATE) {
        return '新增字段设置';
      }
      return `字段提取设置`;
    },
    async checkFieldFormIsModified() {
      if (
        (this.fieldFormCloned !== null &&
          !_.isEqual(this.fieldForm, this.fieldFormCloned)) ||
        this.$refs['model-extract-config']?.isModified
      ) {
        const confirm = await this.$confirm(
          '当前编辑内容未保存，是否保存？',
          '提示',
          {
            confirmButtonText: '保存',
            cancelButtonText: '放弃',
            showClose: false,
            closeOnClickModal: false,
            type: 'warning',
          },
        ).catch(() => {});

        if (confirm === 'confirm') {
          return true;
        }
      }
      return false;
    },
    validateSubfieldEnumValues(values) {
      return (rule, value, cb) => {
        if (!value) {
          return cb('枚举值不能为空');
        }
        const count = values.filter(
          (enumItem) => enumItem.name === value,
        ).length;
        if (count > 1) {
          return cb(`枚举值“${value}”已存在`);
        }
        return cb();
      };
    },
    moveNode({ dataIndex, oldIndex, index }) {
      this.$emit('move-node', { dataIndex, oldIndex, index });
      this.closeEditor();
    },
    async addFieldNode(node) {
      if (await this.checkFieldFormIsModified()) {
        await this.updateFieldNode();
      }
      this.openEidtor();
      this.$emit('open-struct-editor', { node });
      this.fieldForm = {
        ..._.cloneDeep(this.tree.current),
        ..._.cloneDeep(node),
        model_name: this.tree.full.model_name,
        data: {
          label: '',
          type: schemaDefaultType,
          required: false,
          multi: false,
          description: '',
          regex: '',
          extract_type: 'llm',
        },
        meta: {
          _index: node.meta._index,
          _nodeIndex: node.meta._nodeIndex,
          _mode: schema.TREENODE_CREATE,
          _path: node.meta._path,
          _parent: node.meta._parent.slice(),
          _type: node.meta._type,
          _partType: node.meta._partType,
        },
        enum: {
          values: [],
        },
        attrs: [],
        children: [],
      };

      this.fieldFormCloned = _.cloneDeep(this.fieldForm);

      Object.assign(this.newNode.meta, {
        _index: node.meta._index,
        _nodeIndex: node.meta._nodeIndex,
        _mode: schema.TREENODE_CREATE,
        _path: node.meta._path,
        _parent: node.meta._parent.slice(),
        _type: node.meta._type,
        _partType: node.meta._partType,
      });

      this.setFieldModelExtractionConfig(node);
    },
    async editFieldNode(node) {
      if (await this.checkFieldFormIsModified()) {
        await this.updateFieldNode();
      }
      this.openEidtor();
      const types = {
        enum: ENUM,
        group: GROUP,
      };

      this.$emit('open-struct-editor', { node });

      this.fieldForm = {
        ..._.cloneDeep(node),
        ..._.cloneDeep(this.tree.current),
        data: {
          ...node.data,
          description: this.tree.current.description || node.data.description,
          extract_type:
            node.data.extract_type || this.EXTRACT_TYPE.exclusive.value,
        },
        meta: {
          ..._.cloneDeep(node.meta),
          _mode: schema.TREENODE_UPDATE,
        },
        attrs: _.cloneDeep(node.attrs) || [],
        type: types[node.meta._type?.type] || node.data.type,
        enum: _.cloneDeep(
          this.tree.current.types.find(
            (item) => item.type === 'enum' && item.label === node.data.type,
          ) || { values: [] },
        ),
        model_name: this.tree.full.model_name,
        old_name: node.data.label,
      };

      this.fieldForm.children.forEach((child) => {
        if (child.meta?._type.type === 'enum') {
          this.$set(child.data, 'type', ENUM);
        }
      });

      this.fieldFormCloned = _.cloneDeep(this.fieldForm);

      this.newNode = _.cloneDeep({
        data: {
          name: node.data.label,
          alias: node.data.alias,
          multi: node.data.multi,
          required: node.data.required,
          type: node.data.type,
          description: node.data.description,
          regex: node.data.regex,
          extract_type: node.data.extract_type,
        },
        meta: {
          _index: node.meta._index,
          _nodeIndex: node.meta._nodeIndex,
          _mode: schema.TREENODE_UPDATE,
          _isHide: node.meta._isHide,
          _partType: node.meta._partType,
          _path: node.meta._path,
          _parent: node.meta._parent,
          _type: node.meta._type,
        },
      });

      this.setFieldModelExtractionConfig(node);
    },
    deleteFieldNode(meta, label) {
      this.$emit('delete-node', {
        index: meta._index,
        label,
        type: meta._type?.type,
        cb: () => {
          this.closeEditor();
        },
      });
    },
    async updateFieldNode() {
      const confirm = await this.$refs.fieldForm.validate().catch(() => {});
      if (!confirm) {
        return;
      }

      if (this.fieldForm.type === GROUP) {
        const subfieldForm = this.$refs.subFieldForm;
        if (subfieldForm) {
          const subFieldValid = await subfieldForm
            .validate()
            .catch(() => false);
          if (!subFieldValid) {
            return;
          }
        }

        const subFieldEnumForm = this.$refs.subFieldEnumForm || [];
        for (let i = 0; i < subFieldEnumForm.length; i++) {
          const subFieldEnumFormItem = subFieldEnumForm[i];
          const subFieldEnumValid = await subFieldEnumFormItem
            .validate()
            .catch(() => false);
          if (!subFieldEnumValid) {
            return;
          }
        }
      }

      if (this.fieldForm.type === ENUM) {
        if (this.fieldForm.enum.values.length === 0) {
          this.$notify({
            title: '提示',
            message: '枚举类型必须添加至少一个枚举值',
            type: 'info',
          });
          return;
        }

        const enumValid = await this.$refs.enumForm
          .validate()
          .catch(() => false);
        if (!enumValid) {
          return;
        }
      }

      try {
        const full = _.cloneDeep(this.tree.full);
        if (this.fieldForm.meta._partType === 'root') {
          full.name = this.fieldForm.name;
        }

        full.model_name = this.fieldForm.model_name;

        if (this.fieldForm.type === ENUM) {
          this.fieldForm.data.type = this.fieldForm.data.label;
          const enumType = full.data.schemaTypes.find(
            (type) => type.label === this.fieldForm.old_name,
          );
          if (enumType) {
            enumType.label = this.fieldForm.data.label;
            enumType.values = this.fieldForm.enum.values;
          } else {
            full.data.schemaTypes.push({
              label: this.fieldForm.data.label,
              values: this.fieldForm.enum.values,
              isMultiSelect: true,
            });
          }
          this.fieldForm.attrs = [];
        } else if (this.fieldForm.type === GROUP) {
          if (this.fieldForm.meta._partType === 'top') {
            this.fieldForm.name = this.fieldForm.data.label;
            this.fieldForm.description = this.fieldForm.data.description;
          }
          this.fieldForm.data.type = this.fieldForm.data.label;
          const attr = full.data.top.attrs.find(
            (attr) => attr.name === this.fieldForm.old_name,
          );
          if (attr) {
            attr.name = this.fieldForm.data.label;
            attr.type = this.fieldForm.data.type;
            attr.description = this.fieldForm.data.description;
            attr.extract_type = this.fieldForm.data.extract_type;
          }
          const groupType = full.data.normals.find(
            (type) => type.name === this.fieldForm.old_name,
          );
          if (groupType) {
            groupType.name = this.fieldForm.data.label;
            groupType.description = this.fieldForm.data.description;
          }
          const enumTypeIndex = full.data.schemaTypes.findIndex(
            (type) => type.label === this.fieldForm.old_name,
          );
          if (enumTypeIndex !== -1) {
            full.data.schemaTypes.splice(enumTypeIndex, 1);
          }

          for (let i = 0; i < this.fieldForm.children.length; i++) {
            const child = this.fieldForm.children[i];
            this.fieldForm.attrs[i] = {
              ...this.fieldForm.attrs[i],
              ...child.data,
              name: child.data.label,
              type:
                child.data.type === ENUM ? child.data.label : child.data.type,
              extract_type: this.fieldForm.data.extract_type,
            };
            if (child.data.type === ENUM) {
              if (child.meta._type.values.length === 0) {
                this.$notify({
                  title: '提示',
                  message: '枚举类型必须添加至少一个枚举值',
                  type: 'info',
                });
                return;
              }
              const enumType = full.data.schemaTypes.find(
                (type) => type.label === child.data.label,
              );
              if (enumType) {
                enumType.label = child.data.label;
                enumType.values = child.meta?._type.values;
              } else {
                full.data.schemaTypes.push({
                  label: child.data.label,
                  values: child.meta?._type.values,
                  isMultiSelect: true,
                });
              }
            }
          }
        } else {
          this.fieldForm.data.type = this.fieldForm.type;
          this.fieldForm.attrs = [];

          const enumTypeIndex = full.data.schemaTypes.findIndex(
            (type) => type.label === this.fieldForm.old_name,
          );
          const fields = _.flattenDeep([
            this.tree.full.data.top.orders,
            this.tree.full.data.normals.map((normal) => normal.orders),
          ]);
          const enumInUse = () => {
            return (
              fields.filter((field) => field === this.fieldForm.data.label)
                .length > 1
            );
          };
          if (!enumInUse() && enumTypeIndex !== -1) {
            full.data.schemaTypes.splice(enumTypeIndex, 1);
          }

          const groupTypeIndex = full.data.normals.findIndex(
            (type) => type.name === this.fieldForm.old_name,
          );
          if (groupTypeIndex !== -1) {
            full.data.normals.splice(groupTypeIndex, 1);
            this.fieldForm.name = this.fieldForm.data.label;
            this.fieldForm._index = this.fieldForm.meta._index;
            const attr = full.data.top.attrs.find(
              (attr) => attr.type === this.fieldForm.old_name,
            );
            if (attr) {
              attr.name = this.fieldForm.data.label;
              attr.type = this.fieldForm.data.type;
            }
          }
        }

        this.newNode.data = {
          ...this.newNode.data,
          ...this.fieldForm.data,
          name: this.fieldForm.data.label,
          type:
            this.fieldForm.type === ENUM || this.fieldForm.type === GROUP
              ? this.fieldForm.data.label
              : this.fieldForm.type,
        };

        this.$store.commit('schemaModule/SET_FULLSCHEMA_DATA', full);

        let configSaved = true;
        let needSaveConfig = true;
        if (
          (this.fieldForm.meta._partType === 'root' &&
            this.fieldForm.meta._mode === schema.TREENODE_UPDATE) ||
          (this.fieldForm.data.extract_type === SCHEMA_TYPE.LLM.type &&
            this.fieldForm.meta._mode === schema.TREENODE_CREATE)
        ) {
          needSaveConfig = false;
        }
        if (needSaveConfig) {
          configSaved = await this.saveModelConfig();
        }
        if (configSaved) {
          this.saveSchema();
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async saveSchema() {
      try {
        this.submitLoading = true;
        if (
          this.newNode.meta._type.type === 'group' &&
          this.newNode.meta._mode === schema.TREENODE_UPDATE
        ) {
          await this.$store.dispatch('schemaModule/persistSchemaPart', {
            current: this.fieldForm,
          });
        } else {
          const node = this.fieldForm;
          const nodeData = {
            index: node.meta._index,
            mode: node.meta._mode,
            treeNode: {
              name: node.data.name || node.data.label,
              alias: node.data.alias,
              type: node.data.type,
              required: node.data.required,
              multi: node.data.multi,
              description: node.data.description,
              regex: node.data.regex,
              extract_type: node.data.extract_type,
              attrs: node.attrs || [],
            },
          };
          await this.$store.dispatch('schemaModule/persistTreeNode', nodeData);
        }
        this.$notify({
          title: '成功',
          message: 'Schema 修改成功',
          type: 'success',
          duration: 1500,
        });

        const operationType =
          this.fieldForm.meta._mode === schema.TREENODE_CREATE
            ? 'add'
            : 'update';
        this.syncEditingNode(operationType);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitLoading = false;
      }
    },
    async saveModelConfig() {
      try {
        if (this.schemas.model.releaseList.length === 0) {
          await this.$store.dispatch('schemaModule/createModelVersion', {
            schemaId: this.schemaId,
            name: '混合模型',
          });
          await this.getModelConfig();
        }

        if (this.fieldForm.meta._mode === schema.TREENODE_CREATE) {
          this.modelExtractionConfig.path = [this.fieldForm.data.label];
        }
        const res = await this.$refs['model-extract-config']?.saveModelConfig({
          needNotify: false,
        });
        await this.getModelConfig();
        return res;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
        return false;
      }
    },
    setFieldModelExtractionConfig(node) {
      this.modelExtractionConfig = {
        name: '',
        path:
          node.meta._deepLabels.length > 1
            ? node.meta._deepLabels.slice(1)
            : [node.data.label],
        models: [{ name: '' }],
        meta: node.meta,
        children: node.children,
      };
      if (this.currentModelExtractionConfig) {
        const predictors = this.currentModelExtractionConfig.predictors || [];
        const currentField = predictors.find((v) =>
          _.isEqual(v.path, _.tail(node.meta._deepLabels)),
        );
        this.predictors = predictors;
        if (currentField) {
          this.modelExtractionConfig = {
            ...this.modelExtractionConfig,
            name:
              currentField.models.length > 0 ? currentField.models[0].name : '',
            models: currentField.models,
          };
        }
      }
    },
    setFieldModelExtractionConfigPrimaryKey() {
      if (this.fieldForm.type === GROUP && this.$refs['model-extract-config']) {
        this.modelExtractionConfig.meta._type.type === 'group';
        const primaryKeyConfig =
          this.$refs['model-extract-config']?.currentExtractionMode
            ?.primaryKeyConfig;
        if (primaryKeyConfig) {
          primaryKeyConfig.children = this.fieldForm.children;
        }
      }
    },
    syncEditingNode(type) {
      this.fieldFormCloned = null;
      this.$nextTick(() => {
        const editingNodeBtn =
          this.$refs[`${type}-${this.fieldForm.meta._nodeIndex}`];
        editingNodeBtn?.$el?.click();
      });
    },
    addEnumValue() {
      this.fieldForm.enum.values.push({
        name: '',
        isDefault: false,
      });
    },
    deleteEnumValue(index) {
      this.fieldForm.enum.values.splice(index, 1);
    },
    addSubfield() {
      this.fieldForm.attrs.push({
        _index: this.getCounter(),
        name: '',
        alias: '',
        required: false,
        multi: false,
        type: schemaDefaultType,
      });
      this.fieldForm.children.push({
        data: {
          label: '',
          alias: '',
          multi: false,
          required: false,
          type: schemaDefaultType,
        },
        meta: {
          _index: this.getCounter(),
          _nodeIndex: this.getCounter(),
          _mode: schema.TREENODE_CREATE,
          _type: {
            type: 'basic',
            values: [],
          },
        },
        type: schemaDefaultType,
      });
    },
    deleteSubfield(index) {
      this.fieldForm.children.splice(index, 1);
      this.fieldForm.attrs.splice(index, 1);
    },
    addSubfieldEnum(subfield) {
      if (!subfield.meta._type.values) {
        subfield.meta._type.values = [];
      }
      subfield.meta._type.values.push({
        name: '',
        isDefault: false,
      });
    },
    deleteSubfieldEnum(subfield, index) {
      subfield.meta._type.values.splice(index, 1);
    },
    resetFieldForm() {
      this.fieldForm = {
        data: {
          name: '',
          alias: '',
          multi: false,
          required: false,
          type: schemaDefaultType,
          description: '',
          regex: '',
          extract_type: 'llm',
        },
        attrs: [],
        children: [],
      };
    },
    openEidtor() {
      this.isEditing = true;
      this.sidebarWidth = this.lastSidebarWidth;
      setTimeout(() => {
        this.$refs.fieldForm.clearValidate();
      });
    },
    closeEditor() {
      this.isEditing = false;
      this.sidebarWidth = 0;
      this.resetFieldForm();
      this.fieldFormCloned = null;
      this.$refs.fieldForm.resetFields();
    },
    openTestDialog(node) {
      this.testForm.fieldPath = _.tail(node.meta._deepLabels);
      this.testDialogVisible = true;
      this.getTestFiles();
    },
    closeTestDialog() {
      this.testDialogVisible = false;
      this.testForm = {
        fid: '',
        fieldPath: '',
        result: '',
        enum: '',
      };
    },
    async getTestFiles() {
      try {
        const res = await fetchLLMTestFiles(this.schemaId, {
          page: 1,
          size: 500,
        });
        this.testFiles = res.items;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async test() {
      const confirm = await this.$refs.testForm.validate().catch(() => {});
      if (!confirm) {
        return;
      }
      try {
        this.testLoading = true;
        const res = await testLLM(this.schemaId, {
          fid: this.testForm.fid,
        });
        this.testForm.result = _.get(res.data, this.testForm.fieldPath);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.testLoading = false;
      }
    },
    async exportSchema() {
      try {
        const res = await exportMoldData(this.schemaId);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async importSchema() {
      try {
        const formData = new FormData();
        formData.append('file', this.importJsonForm.file);
        await importMoldData(this.schemaId, formData);
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
        });
        this.$emit('cover-schema-success');
        this.$refs.upload.clearFiles();
        this.closeEditor();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async handleUploadChange(file) {
      this.importJsonForm.file = file.raw;
      const fileName = file.name;
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

      if (fileType !== 'json') {
        this.$notify({
          title: '提示',
          message: '仅支持导入.json格式的文件',
          type: 'error',
        });
        return false;
      }

      const schemaEmpty = this.tree.data.children.length === 0;
      if (!schemaEmpty) {
        const confirm = await this.$confirm(
          '该Schema下已存在字段，继续导入将覆盖现有数据，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).catch(() => {
          this.$refs.upload.clearFiles();
        });
        if (confirm === 'confirm') {
          this.importSchema();
        }
      } else {
        this.importSchema();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-tree-panel-container {
  .el-main {
    max-height: calc(100vh - 220px);
    overflow-x: auto;
    overflow-y: auto;
    padding: 10px 0 10px 10px;
    border: 1px solid rgba($--color-primary, 0.5);
    .schema-tree-list {
      overflow: initial;
      min-width: max-content;
    }
  }
  .drag-resize-line {
    width: 3px;
    margin: 0 10px;
    background: $--color-primary;
    opacity: 0.5;
    cursor: col-resize;
    transition: all 0.3s;
    &:hover {
      opacity: 0.8;
      transform: scaleX(2);
    }
  }
  .el-aside {
    display: flex;
    flex-flow: column;
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    border: 1px solid rgba($--color-primary, 0.5);
    &.slide-enter-active,
    &.slide-leave-active {
      transition: width 0.3s;
    }

    &.slide-enter,
    &.slide-leave-to {
      width: 0 !important;
      opacity: 0;
    }
    .title {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #dcdfe6;
      color: $--color-primary;
      background: #f9fafc;
      z-index: 2;
      .el-icon-close {
        cursor: pointer;
        padding: 3px;
        &:hover {
          background-color: #f56c6c;
          color: #fff;
        }
      }
    }
    .el-form {
      flex: 1;
      padding: 10px;
      .el-select {
        width: 100%;
      }
      .el-radio-group {
        ::v-deep .el-radio__label {
          padding-left: 5px;
          vertical-align: -1px;
        }
      }
      .extraction-config {
        padding-left: 40px;
        ::v-deep .el-form {
          padding-right: 0;
          .el-select {
            width: 100%;
          }
          .el-form-item__label {
            text-align: right;
          }
        }
      }
      ::v-deep .el-form-item__label {
        font-weight: 500;
      }
      .enums,
      .groups {
        padding: 0 10px;
        background-color: #f0f4fa;
        .el-form {
          padding: 5px 0;
          .el-form-item {
            margin-top: 5px;
            background-color: #fff;
            border-radius: 4px;
            ::v-deep .el-form-item__label {
              font-size: 12px;
            }
            ::v-deep .el-form-item__content {
              display: flex;
              flex-direction: column;
              .el-form-item__label {
                font-size: 12px;
              }
              .el-form-item__error {
                position: inherit;
                padding: 0 0 5px 0;
              }
            }
            .label {
              font-size: 12px;
              font-weight: 500;
            }
            .el-button {
              margin-right: 10px;
            }
          }
        }
        .btns {
          display: flex;
          justify-content: center;
          padding-bottom: 5px;
        }
      }
    }
    .bottom-btns {
      position: sticky;
      bottom: 0;
      display: flex;
      justify-content: center;
      padding: 10px 0;
      background: #f9fafc;
      border-top: 1px solid #dcdfe6;
      z-index: 1;
    }
  }
  .form-item-inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      margin: 0 10px;
      font-size: 12px;
      color: #606266;
    }
    .el-input,
    .el-select {
      flex: 1;
    }
    .el-button {
      margin-left: 10px;
      ::v-deep .el-icon-delete {
        color: #f56c6c;
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
  .subfield-enums {
    display: flex;
    padding-right: 10px;
    order: 3;
    h5 {
      width: 50px;
      padding-top: 5px;
      font-weight: 500;
      color: #606266;
    }
    .enum-list {
      flex: 1;
      .enum {
        margin-top: 0 !important;
        ::v-deep .el-form-item__content {
          .enum-input {
            display: flex;
            align-items: center;
            flex: 1;
            i {
              margin-left: 12px;
              cursor: pointer;
              color: #f56c6c;
              &:hover {
                opacity: 0.8;
              }
            }
          }
          .el-button {
            padding: 4px 7px;
          }
        }
      }
    }
  }
  .test-dialog {
    .el-divider__text {
      color: $--color-primary;
    }
    .el-dialog__footer {
      > div {
        display: flex;
        justify-content: center;
      }
    }
  }
  .node-line {
    display: flex;
    flex-direction: row;
    > :first-child {
      flex: 1;
    }
    &.highlight {
      background-color: rgba($--color-primary, 0.1);
      &.active {
        .node-name {
          font-weight: bold;
        }
      }
      .node-name {
        ::v-deep .keyword {
          color: $--color-primary;
        }
      }
    }
    .node-tags {
      display: flex;
      align-items: center;
      position: relative;
      .node-name {
        display: inline-block;
        max-width: 497px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &.active {
          color: $--color-primary;
          font-weight: bold;
        }
      }
      .el-tag {
        margin: 0 5px;
        &.llm {
          color: #fff;
          background-color: #8803ff;
          border-color: #8803ff;
        }
        &.exclusive {
          color: #fff;
          background-color: #ff8f00;
          border-color: #ff8f00;
        }
      }
      .node-type {
        display: flex;
        align-items: center;
        .el-tag {
          max-width: 390px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .node-btns {
      position: sticky;
      right: 0;
      display: flex;
      align-items: center;
      background-color: #fff;
      box-shadow: -20px 0px 20px #fff;

      .el-button {
        margin: 0 5px;
        padding: 0;
        ::v-deep .svg-icon-container {
          .svg-font-icon {
            width: 18px;
            height: 18px;
            transition: all 0.2s ease-in-out;
            &:hover {
              fill: $--color-primary !important;
              transform: scale(1.15);
            }
          }
          &.delete {
            .svg-font-icon {
              &:hover {
                fill: #ff0000 !important;
              }
            }
          }
        }
        + .el-button {
          margin-left: 5px;
        }

        &[disabled='disabled'] {
          opacity: 0.7;
        }
      }
      ::v-deep .el-upload {
        vertical-align: -webkit-baseline-middle;
      }
    }
  }
}
</style>
