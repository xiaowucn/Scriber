<template>
  <div v-loading="tree.isLoading">
    <div
      @click="hideTreeNodeRowEditor"
      :class="{ mask: true, hide: !isShowEmptyNode }"
      ref="mask"></div>
    <div ref="hello"></div>
    <el-card
      v-if="isShowEmptyNode"
      shadow="hover"
      :body-style="{ padding: 0, paddingBottom: '15px' }"
      ref="node-card"
      class="node-card">
      <schema-part-info-column
        ref="inline-form"
        class="card-form-wrapper"
        @part-enter="persistTreeNode"
        @part-esc="hideTreeNodeRowEditor"
        :types="schemaTypes"
        :mold-type="tree.full.mold_type"
        :autofocus="true"
        :isShowInPopup="false"
        :validators="rowFormValidators"
        :alias-required="aliasRequired"
        :params="{ meta: newNode.meta }"
        :partColumn.sync="newNode.data"
        @select-type-action="selectTypeAction">
        <div slot="node-right" class="card-form-btn-group">
          <el-button @click="persistTreeNode" type="text" size="mini">{{
            $t(`message['保存']`)
          }}</el-button>
          <el-button
            @click="hideTreeNodeRowEditor"
            class="btn-cancel"
            type="text"
            size="mini"
            >{{ $t(`message['取消']`) }}</el-button
          >
        </div>
      </schema-part-info-column>
    </el-card>
    <el-container class="schema-tree-list-container">
      <el-main>
        <tree-list
          ref="schema-tree"
          v-if="tree.data"
          :data="tree.data"
          :draggable="canEditSchema()">
          <div v-if="node !== null" class="node-line" slot-scope="{ node }">
            <div class="node-tags">
              <span class="node-name">{{ node.data.label }} </span>
              <el-tag v-if="node.data.alias" type="info" size="mini">
                {{ node.data.alias }}
              </el-tag>
              <schema-tree-node-type
                class="schema-tree-title-node"
                :type="node.data.type || ''"
                :types="types"></schema-tree-node-type>
              <template>
                <el-tag
                  v-if="node.data.required"
                  type="info"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['必须标注']`) }}</el-tag
                >
                <el-tag
                  v-if="node.data.multi"
                  type="info"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['可标注多项']`) }}</el-tag
                >
                <el-tag
                  v-if="node.meta._type && node.meta._type.isMultiSelect"
                  type="warning"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['可多选']`) }}</el-tag
                >
              </template>
            </div>
            <div class="node-btn-group">
              <el-tooltip
                effect="dark"
                :content="$t(`message['提取模式设置']`)"
                placement="top">
                <el-button
                  v-if="isShowMoldConfig"
                  type="text"
                  :disabled="!canEditSchema()"
                  @click.stop="openMoldConfigDialog(node)">
                  <theme-icon
                    name="cubes"
                    icon-class="fa fa-cubes"></theme-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                :content="$t(`message['规则审核']`)"
                placement="top">
                <el-button
                  v-if="isShowRuleReivewBtn(node)"
                  type="text"
                  @click.stop="jumpToCustomRulesPage(node)">
                  <svg-font-icon name="menu-rule-cmf" :size="24" color="#666" />
                </el-button>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                :content="$t(`message['添加描述']`)"
                placement="top">
                <el-button
                  v-if="isShowInfoBtn(node)"
                  type="text"
                  :disabled="!canEditSchema()"
                  @click.stop="openInfo(node)">
                  <theme-icon
                    name="add-remark"
                    icon-class="fa fa-info-circle comments-btn"></theme-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                :content="$t(`message['新增']`)"
                placement="top">
                <el-button
                  v-if="
                    !getSchemaType(node.data.type) ||
                    getSchemaType(node.data.type).type === 'group'
                  "
                  type="text"
                  :disabled="!canEditSchema()"
                  @click.stop="insertEmptyNode(node)">
                  <theme-icon
                    name="add"
                    icon-class="fa fa-plus fa-fw like-btn"></theme-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                :content="$t(`message['自定义提取正则']`)"
                placement="top">
                <el-button
                  v-if="$features.supportSchemaRegex()"
                  type="text"
                  :disabled="!canEditSchema()"
                  @click.stop="() => (nodeToEditRegex = node)">
                  <i class="el-icon-set-up"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                :content="$t(`message['编辑']`)"
                placement="top">
                <el-button
                  type="text"
                  :disabled="!canEditSchema()"
                  @click.stop="openEditor(node)">
                  <theme-icon
                    name="edit"
                    icon-class="fa fa-edit fa-fw like-btn"></theme-icon>
                </el-button>
              </el-tooltip>

              <!-- <el-tooltip
                v-if="isShowCoverSchemaBtn(node)"
                effect="dark"
                content="覆盖场景"
                placement="top">
                <el-button type="text" @click.stop="coverSchema(node)">
                  <svg-font-icon
                    name="schema-replace"
                    :size="21"
                    color="#666" />
                </el-button>
              </el-tooltip> -->

              <el-tooltip
                v-if="node.meta._partType !== 'root'"
                effect="dark"
                :content="$t(`message['删除']`)"
                placement="top">
                <el-button
                  type="text"
                  :disabled="!canEditSchema()"
                  @click.stop="
                    deleteTreeNode(node.meta._index, node.data.label)
                  ">
                  <theme-icon
                    name="delete"
                    icon-class="fa fa-times-circle fa-fw remove-btn"></theme-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div slot="empty" class="node-line">
            <div>
              <span></span>
              <span></span>
            </div>
            <div></div>
          </div>
        </tree-list>
      </el-main>
    </el-container>
    <schema-mold-config
      v-if="schemaMoldConfig.visible"
      ref="schemaMoldConfig"
      :model="schemaMoldConfig"
      @close="schemaMoldConfig.visible = false"
      @modify-model-config="$emit('modify-model-config', $event)">
    </schema-mold-config>
    <schema-part-info
      :validators="validators"
      :schemaPart="tree.current"
      :groups="groups"
      :isLoading="tree.isLoading"
      :alias-required="aliasRequired"
      @persist-schema-part="$emit('persist-schema-part', $event)"
      @close-part-info="$emit('close-part-info', $event)"
      @update-part-column="updatePartColumn"
      @select-type-action="selectTypeAction">
    </schema-part-info>
    <schema-remarked-info
      :title="$t(`message['添加描述']`)"
      :remarkedInfo.sync="remarkedInfo"
      :schemaPart="tree.current"
      @close-info-visible="toggleInfoVisible"
      @persist-schema-info="persistSchemaInfo">
    </schema-remarked-info>
    <schema-regex-dialog
      v-if="nodeToEditRegex"
      :schemaNode="nodeToEditRegex"
      :schemaId="schemaId"
      @close="() => (nodeToEditRegex = null)"></schema-regex-dialog>
    <schema-enum-type-popup
      ref="enumType"
      :opened-from-tree="true"
      :enum-type-name="newNode.data.name">
    </schema-enum-type-popup>
    <schema-group-type-popup
      ref="groupType"
      :opened-from-tree="true"
      :group-type-name="newNode.data.name">
    </schema-group-type-popup>
    <schema-import-popup
      v-if="showImportSchemaPopup"
      action="cover"
      :schema-id="schemaId"
      @import-success="$emit('cover-schema-success')"
      @close="showImportSchemaPopup = false">
    </schema-import-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import TreeList from './tree/TreeList';
import SchemaPartInfoColumn from './SchemaPartInfoColumn';
import SchemaPartInfo from './SchemaPartInfo';
import SchemaTreeNodeType from './SchemaTreeNodeType';
import SchemaRemarkedInfo from './SchemaRemarkedInfo';
import SchemaMoldConfig from './SchemaMoldConfig';
import SchemaRegexDialog from '@/custom/ht/components/SchemaRegexDialog';
import SchemaEnumTypePopup from './SchemaEnumTypePopup';
import SchemaGroupTypePopup from './SchemaGroupTypePopup';
import SchemaImportPopup from './SchemaImportPopup';
import {
  schema,
  schemaDefaultType,
  SCHEMA_TYPE_ACTION,
} from '../store/constants';
import {
  getDomOffset,
  createEmptyTreeNode,
  EventBus,
  getNodeInTreeData,
  getSchemaType,
  getNodeInTreeParent,
} from '../utils';

export default {
  name: 'schema-tree-panel',
  components: {
    TreeList,
    SchemaPartInfoColumn,
    SchemaPartInfo,
    SchemaTreeNodeType,
    SchemaRemarkedInfo,
    SchemaMoldConfig,
    SchemaRegexDialog,
    SchemaEnumTypePopup,
    SchemaGroupTypePopup,
    SchemaImportPopup,
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
    schemas: {
      type: Object,
      default: () => ({}),
    },
    schemaId: {
      type: Number,
      required: true,
    },
    groups: {
      type: Array,
      default: () => [],
    },
  },
  inject: ['canEditSchema'],
  data() {
    // popup 中的校验
    const validateNameGen = (ctx) => {
      return (rule, name, callback) => {
        const oldName = ctx.oldState.name.trim();
        const value = name.trim();
        if (value === '') {
          return callback(new Error(this.$t(`message['名称不能为空']`)));
        } else {
          if (value === oldName) {
            return callback();
          } else {
            return callback();
          }
        }
      };
    };
    // 行内表单中的校验
    const schemaAttrNameValidator = (ctx) => {
      return (rule, name, callback) => {
        const oldName = ctx.oldState.name.trim();
        const value = name.trim();
        if (value === '') {
          return callback(new Error(this.$t(`message['名称不能为空']`)));
        } else {
          if (value === oldName) {
            return callback();
          } else {
            let parent;
            if (oldName) {
              parent = getNodeInTreeParent(
                this.tree.data,
                ctx.params.meta._nodeIndex,
              );
            } else {
              parent = getNodeInTreeData(
                this.tree.data,
                ctx.params.meta._nodeIndex,
                'meta._nodeIndex',
              );
            }
            const hasSameNameNode = parent.children
              .map((child) => child.data.label)
              .some((label) => label === value);
            if (hasSameNameNode) {
              return callback(
                new Error(
                  this.$t(`message['名称“{name}”已被占用']`, { name: value }),
                ),
              );
            } else {
              callback();
            }
          }
        }
      };
    };
    const schemaAttrTypeValidator = (ctx) => {
      return (rule, type, callback) => {
        if (!type) {
          return;
        }
        type = type.trim();
        if (type === '') {
          return callback(new Error(this.$t(`message['类型不能为空']`)));
        } else {
          let parentNodePath;
          if (ctx.params.meta._mode === 'TREENODE_CREATE') {
            parentNodePath = ctx.params.meta._path;
          } else {
            parentNodePath = ctx.params.meta._path.slice(0, -1);
          }
          const typeIndexInPath = parentNodePath.findIndex(
            (itm) => itm === type,
          );
          if (typeIndexInPath !== -1) {
            return callback(
              new Error(this.$t(`message['类型不能和上级节点相同']`)),
            );
          }
        }
        callback();
      };
    };
    const schemaAttrAliasValidator = (ctx) => {
      return (rule, value, callback) => {
        const oldAlias = ctx.oldState.alias.trim();
        const alias = value.trim();
        if (alias === '') {
          if (this.aliasRequired) {
            return callback(new Error(this.$t(`message['别名不能为空']`)));
          }
          return callback();
        }
        if (alias === oldAlias) {
          return callback();
        } else {
          let parent;
          if (oldAlias) {
            parent = getNodeInTreeParent(
              this.tree.data,
              ctx.params?.meta._nodeIndex,
            );
          } else {
            parent = getNodeInTreeData(
              this.tree.data,
              ctx.params?.meta._nodeIndex,
              'meta._nodeIndex',
            );
          }
          const hasSameAliasNode = parent.children?.some(
            (child) => child.data.alias === alias,
          );
          if (hasSameAliasNode) {
            return callback(
              new Error(this.$t(`message['别名“{alias}”已被占用']`, { alias })),
            );
          } else {
            callback();
          }
        }
      };
    };
    return {
      newNode: {
        meta: {
          _mode: schema.TREENODE_CREATE, // create or update
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
          multi: true,
        },
      },
      rowFormValidators: {
        name: schemaAttrNameValidator,
        type: schemaAttrTypeValidator,
        alias: schemaAttrAliasValidator,
      },
      validators: {
        name: validateNameGen,
        type: schemaAttrTypeValidator,
        alias: schemaAttrAliasValidator,
      },
      scrollInfo: {},
      remarkedInfo: {
        visible: false,
        words: '',
        currentRemarkedNode: {},
      },

      // 提取模型配置
      schemaMoldConfig: {
        visible: false,
        name: '',
        fullPath: [],
      },
      nodeToEditRegex: null,
      showImportSchemaPopup: false,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    isShowEmptyNode() {
      return this.newNode.meta._index !== -1;
    },
    schemaTypes() {
      return this.types.filter(
        (t) => t.type !== 'group' || !this.newNode.meta._path.includes(t.label),
      );
    },
    isShowMoldConfig() {
      const isKVMold = this.tree.full && this.tree.full.mold_type === 1;
      return (
        this.$isAllowed('manageModel') &&
        this.$features.canEditSchemaRule() &&
        !isKVMold
      );
    },
    isShowRuleReivewBtn() {
      return (node) => {
        return (
          this.$features.showRuleReviewBtnInSchemaTree() &&
          node.meta._partType !== 'root' &&
          node.meta._partType !== 'top' &&
          node.meta._type?.type !== 'group' &&
          node.children?.length === 0
        );
      };
    },
    isShowCoverSchemaBtn() {
      return (node) => {
        return (
          this.$features.supportImportSchema() && node.meta._partType === 'root'
        );
      };
    },
    aliasRequired() {
      return this.$features.schemaAliasRequired();
    },
  },
  created() {
    EventBus.$on('empty-node-added', this.addedEmptyNodeInTree);
    EventBus.$on('move-node', this.moveNode);
  },
  beforeDestroy() {
    EventBus.$off('empty-node-added', this.addedEmptyNodeInTree);
    EventBus.$off('move-node', this.moveNode);
  },
  methods: {
    async persistTreeNode() {
      try {
        const isValid = await this.$refs['inline-form'].validate();
        if (isValid) {
          this.$emit('persist-node', {
            node: this.newNode,
            callback: (err) => {
              if (!err) {
                this.hideTreeNodeRowEditor();
                this.newNode = createEmptyTreeNode();
              }
            },
          });
        }
      } catch (error) {
        return;
      }
    },
    hideTreeNodeRowEditor() {
      this.$emit('hide-row-editor', {
        node: this.newNode,
      });
      this.newNode = createEmptyTreeNode();
    },
    getSchemaType(type = '') {
      if (this.types) {
        return getSchemaType(this.types, type);
      }
      return null;
    },
    insertEmptyNode(node) {
      Object.assign(this.newNode.data, {
        name: '',
        alias: '',
        type: schemaDefaultType,
      });
      Object.assign(this.newNode.meta, {
        _index: node.meta._index,
        _nodeIndex: node.meta._nodeIndex,
        _mode: schema.TREENODE_CREATE,
        _path: node.meta._path,
        _parent: node.meta._parent.slice(),
      });
      this.$emit('insert-empty-node', {
        index: node.meta._index,
        path: node.meta._path,
      });
      const containerEl = this.$el.closest('.schema-tree');
      this.scrollInfo = {
        top: containerEl.scrollTop,
        left: containerEl.scrollLeft,
      };
    },
    openMoldConfigDialog(node) {
      this.schemaMoldConfig.visible = true;
      this.schemaMoldConfig.name = node.data._model;
      this.schemaMoldConfig.fullPath = node.meta._deepLabels;
    },
    openInfo(node) {
      let words = '';
      let { _partType } = node.meta;
      if (_partType === 'root') {
        words = this.tree.response.schemas[0].words;
      } else {
        words = node.data.words;
      }
      this.remarkedInfo.currentRemarkedNode = node;
      this.toggleInfoVisible(words);
    },
    toggleInfoVisible(words) {
      this.remarkedInfo.visible = !this.remarkedInfo.visible;
      this.remarkedInfo.words = words;
    },
    persistSchemaInfo() {
      let { _index, _partType } = this.remarkedInfo.currentRemarkedNode.meta;
      let rootSchemaWords = this.tree.response.schemas[0].words;
      let hasWordsNode = {
        _index,
        words: this.remarkedInfo.words,
        _partType,
        rootSchemaWords,
      };
      this.$emit('mark-schema-words', hasWordsNode);
      this.toggleInfoVisible('');
    },
    isShowInfoBtn(node) {
      let notHasChildrenAttrWords = [
        '数字',
        '文本',
        '日期',
        'NUMBER',
        'TEXT',
        'DATE',
      ];
      if (
        node.meta._partType !== 'top' &&
        notHasChildrenAttrWords.includes(node.data.type)
      ) {
        return false;
      } else {
        return true;
      }
    },
    openEditor(node) {
      // type: basic / enum / group
      const schemaType = this.getSchemaType(node.data.type);
      // 组合类
      if (schemaType === null || schemaType.type === 'group') {
        this.$emit('open-struct-editor', { node });
      } else {
        // tree row editor
        // 基础类
        this.newNode = _.cloneDeep({
          data: {
            name: node.data.label,
            alias: node.data.alias,
            multi: node.data.multi,
            required: node.data.required,
            type: node.data.type, // 节点统一渲染，在v-model时会用到
          },
          meta: {
            _index: node.meta._index, // tree node.data data id
            _nodeIndex: node.meta._nodeIndex, // tree node.data id
            _isHide: node.meta._isHide,
            _partType: node.meta._partType,
            _path: node.meta._path,
            _parent: node.meta._parent,
          },
        });
        this.newNode.meta._mode = schema.TREENODE_UPDATE;
        const containerEl = this.$el.closest('.schema-tree');
        this.scrollInfo = {
          top: containerEl.scrollTop,
          left: containerEl.scrollLeft,
        };
        this.$emit('open-row-editor', { node });
      }
    },
    deleteTreeNode(index, label) {
      this.$emit('delete-node', { index, label });
    },
    /**
     * 在树中插入空节点后，获得的空节点位置偏移
     */
    addedEmptyNodeInTree(offset) {
      if (this.$features.hasLeftSidebar()) {
        const leftSidebarWidth =
          document.querySelector('.left-menu').offsetWidth;
        offset.left -= leftSidebarWidth;
      }
      const el = this.$refs['node-card'].$el;
      const parent = this.$refs['schema-tree'].$el;
      const parentOffset = getDomOffset(parent);
      const main = document.querySelector(
        '.schema-tree-list-container .el-main',
      );
      const mainPaddingTop = window
        .getComputedStyle(main)
        .paddingTop.replace('px', '');

      el.style.transform = `translate(${offset.left - 20}px, ${
        offset.top - parentOffset.top + parseInt(mainPaddingTop)
      }px)`;
      el.style.width = `calc(100% - ${offset.left}px`;
      const containerEl = this.$el.closest('.schema-tree');
      containerEl.scrollTo(this.scrollInfo);
    },
    moveNode({ dataIndex, oldIndex, index }) {
      this.$emit('move-node', { dataIndex, oldIndex, index });
    },
    updatePartColumn(data) {
      this.newNode.data = data;
    },
    async selectTypeAction(action, data) {
      this.newNode.data.name = data.name;
      await this.$nextTick();
      if (action === SCHEMA_TYPE_ACTION.ADD_ENUM) {
        this.$refs['enumType'].openDialog();
      } else if (action === SCHEMA_TYPE_ACTION.ADD_GROUP) {
        this.$refs['groupType'].openDialog();
      }
    },
    createSchemaType(type) {
      this.newNode.data.type = type;
    },
    jumpToCustomRulesPage(node) {
      this.$router.push({
        name: 'custom-rules',
        query: {
          mold_id: this.schemaId,
          field: _.tail(node.meta._deepLabels).join('-'),
        },
      });
    },
    coverSchema() {
      this.showImportSchemaPopup = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
.mask {
  background-color: rgba(0, 0, 0, 0.1);
}
.delete-btn {
  color: #f78989;
}
.mask {
  position: fixed;
  width: 200vw;
  height: 200vh;
  top: -100%;
  left: -100%;
  z-index: 10;
}
.node-card {
  position: absolute;
  width: 96%;
  z-index: 11;
  transition: none;
  margin-top: -0.15em;
  ::v-deep .el-card__body {
    padding-top: 5px !important;
    padding-bottom: 3px !important;
  }
}
.btn-cancel {
  color: red;
}
.card-form-btn-group {
  margin: 0.5em 1.5em 0 0;
}
.node-model {
  margin-left: 20px;
}
</style>
<style lang="scss" scoped>
.schema-tree {
  min-width: 1210px;
  .card-form-wrapper form {
    height: 2.7em;
    padding-top: 0.3em;
  }
  .empty-btn {
    display: inline-block;
  }
  .el-header {
    min-height: 60px;
    height: auto !important;
    .schema-nav {
      height: auto;
      display: flex;
      align-items: centers;
      line-height: 2;
      min-height: 60px;
      .el-breadcrumb__item {
        padding: 7px 0;
        &:last-child {
          flex: 1;
        }
      }
    }
  }
  .el-main {
    padding: 10px;
  }
  .node-line {
    display: flex;
    flex-direction: row;
  }
  .node-line > :first-child {
    flex: 1;
  }
  .node-tags {
    display: flex;
    align-items: center;
    .node-name {
      display: inline-block;
      max-width: 497px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .schema-tree-title-node {
      display: flex;
      align-items: center;
      .el-tag {
        max-width: 390px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .el-tag {
      margin: 0 5px;
    }
  }
  .node-btn-group {
    display: flex;
    align-items: center;

    i {
      font-size: 20px;
      color: #333;
    }

    .el-button {
      + .el-button {
        margin-left: 5px;
      }

      &[disabled='disabled'] {
        opacity: 0.7;
      }
    }

    .like-btn {
      color: #409eff;
    }
    .like-btn:hover {
      color: #80ceff;
    }
    .comments-btn {
      color: #409eff;
    }
    .comments-btn:hover {
      color: #80ceff;
    }
    .remove-btn {
      color: #f56c6c;
    }
    .remove-btn:hover {
      color: #ff8c8c;
    }
  }
}
</style>
