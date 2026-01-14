import Vue from 'vue';
import _ from 'lodash';
import { v4 as uuid4 } from 'uuid';
import EventBus from '@/components/remark/remark-tree/EventBus';
import './FileRemarkCustomSchemaNode.scss';
import { generateBasicTreeNodeData } from '@/utils';

Vue.component('custom-node-schema-tree', {
  props: {
    schemaNode: {
      type: Object,
      required: true,
    },
  },
  render() {
    if (this.schemaNode) {
      return (
        <ul
          class="schema-node"
          data-level={this.schemaNode.meta._deepIndex.length}>
          {this.schemaNode.children.map((node) => (
            <li key={node.meta._nodeIndex}>
              <div class="schema-node-label">
                <label>{node.data.label}</label>
                {node.meta.custom ? <el-tag size="mini">自定义</el-tag> : null}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    return null;
  },
});

const RemarkCustomSchemaNode = Vue.component('remark-custom-schema-node', {
  created() {
    EventBus.$on('open-custom-schema-node', this.initData);
  },
  destroyed() {
    EventBus.$off('open-custom-schema-node', this.initData);
  },
  data() {
    return {
      schemaNodeAdded: [],
      schemaNode: null,
      schemaNodeKey: '',
      customFieldValue: '',
      validateRules: {
        empty: '自定义字段名不能为空',
        repeat: '自定义字段名不能重复',
      },
      validateMessage: '',
    };
  },
  methods: {
    initData({ model, modelKey }) {
      this.schemaNodeKey = modelKey;
      this.schemaNode = model;
      this.focusInput();
    },
    focusInput() {
      this.$nextTick(() => {
        this.$el.querySelector('#field-input').focus();
      });
    },
    input(value) {
      this.customFieldValue = value;
      this.validate();
    },
    validate() {
      if (this.customFieldValue === '') {
        this.validateMessage = this.validateRules.empty;
        return false;
      }
      if (
        this.schemaNode.children.some(
          (child) => child.data.label === this.customFieldValue,
        )
      ) {
        this.validateMessage = this.validateRules.repeat;
        return false;
      }
      this.validateMessage = '';
      return true;
    },
    generateSchemaNodeData() {
      const fieldName = this.customFieldValue;
      const lastChildNode =
        _.cloneDeep(_.last(this.schemaNode.children)) ||
        generateBasicTreeNodeData(this.schemaNode);

      const parentDeepLabels = lastChildNode.meta._deepLabels;
      const deepLabels =
        parentDeepLabels.length === 1
          ? parentDeepLabels
          : _.initial(parentDeepLabels);

      const node = {
        children: [],
        data: {
          ...lastChildNode.data,
          label: fieldName,
        },
        meta: {
          ...lastChildNode.meta,
          _index: lastChildNode.meta._index + 1,
          _type: {
            label: '文本',
            type: 'basic',
          },
          _nodeIndex: lastChildNode.meta._nodeIndex + 1,
          _deepLabels: deepLabels.concat(fieldName),
          _uuid: uuid4(),
          custom: true,
        },
      };

      return node;
    },
    add() {
      if (!this.validate()) {
        return;
      }
      const schemaNode = this.generateSchemaNodeData();
      this.schemaNode.children.push(schemaNode);
      if (!this.schemaNode.childrenGroup) {
        this.schemaNode.childrenGroup = [[]];
      }
      this.schemaNode.childrenGroup[0].push(schemaNode);
      this.schemaNodeAdded.push(schemaNode);
      this.customFieldValue = '';
      this.focusInput();
    },
    confirmAddCustomField() {
      EventBus.$emit('create-custom-schema-node', {
        key: this.schemaNodeKey,
        children: this.schemaNodeAdded,
      });
      this.schemaNodeAdded = [];
      this.close();
    },
    reset() {
      this.schemaNode = null;
      this.schemaNodeKey = '';
      this.customFieldValue = '';
      this.validateMessage = '';
    },
    close() {
      this.reset();
      this.$emit('close');
    },
  },
  render() {
    if (this.schemaNode) {
      return (
        <div class="remark-custom-schema-node">
          <div class="schema-node-title">
            <span>{this.schemaNode.data.label}</span>
            <i class="el-icon-close" on-click={this.close} />
          </div>
          <div class="schema-node-edit">
            <custom-node-schema-tree schemaNode={this.schemaNode} />
            <el-input
              size="mini"
              value={this.customFieldValue}
              placeholder="请输入自定义字段名"
              id="field-input"
              maxlength="30"
              on-input={this.input}></el-input>
            <el-button type="primary" size="mini" on-click={this.add}>
              添加
            </el-button>
            <p class="validate-message">{this.validateMessage}</p>
          </div>
          <div class="operation">
            <el-button size="mini" on-click={this.close}>
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              on-click={this.confirmAddCustomField}>
              确定添加
            </el-button>
          </div>
        </div>
      );
    }

    return null;
  },
});

export default RemarkCustomSchemaNode;
