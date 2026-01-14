import Vue from 'vue';
import { mapGetters } from 'vuex';
import _ from 'lodash';
import './FileRemarkTableAnswer.scss';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { mixDeepInfo } from '@/utils';

const linkOperators = [
  '•',
  '_',
  '——',
  '：',
  ':',
  '~',
  '! ',
  '@',
  '%',
  '^',
  '&',
  '=',
  '到',
  '至',
];

Vue.component('table-remark-schema-tree', {
  props: {
    commonFieldSupport: {
      type: Boolean,
      required: true,
    },
    isShowPostfix: {
      type: Boolean,
      required: true,
    },
    schemaNode: {
      type: Object,
      required: true,
    },
    nodeSelected: {
      type: [Number, null],
      required: true,
    },
    nodeAnswer: {
      type: Object,
      required: true,
    },
    nodeAnswerSelected: {
      type: [Number, null],
      required: true,
    },
    nodeEnumAnswer: {
      type: Object,
      required: true,
    },
    selectNode: {
      type: Function,
      required: true,
    },
    selectNodeAnswer: {
      type: Function,
      required: true,
    },
    updateNodeEnumValue: {
      type: Function,
      required: true,
    },
    nodesWithLinkEnable: {
      type: Array,
      required: true,
    },
    nodeLinkSelected: {
      type: [Number, null],
      required: true,
    },
    nodeLinkAnswer: {
      type: Object,
      required: true,
    },
    nodeLinkAnswerSelected: {
      type: [Number, null],
      required: true,
    },
    nodeLinkAnswerSymbol: {
      type: Object,
      required: true,
    },
    setLinkMark: {
      type: Function,
      required: true,
    },
    setNodeLinkAnswerSymbol: {
      type: Function,
      required: true,
    },
    nodesWithPostfixEnable: {
      type: Array,
      required: true,
    },
    nodePostfixSelected: {
      type: [Number, null],
      required: true,
    },
    nodePostfixAnswer: {
      type: Object,
      required: true,
    },
    nodePostfixAnswerSelected: {
      type: [Number, null],
      required: true,
    },
    setPostfixMark: {
      type: Function,
      required: true,
    },
    nodesIsCommon: {
      type: Array,
      required: true,
    },
    setCommonMark: {
      type: Function,
      required: true,
    },
    removeNodeAnswer: {
      type: Function,
      required: true,
    },
  },
  render() {
    return (
      <ul
        class="schema-node"
        data-level={this.schemaNode.meta._deepIndex.length}>
        {this.schemaNode.children.map((node) => (
          <li key={node.meta._nodeIndex}>
            <div
              class={
                this.nodeAnswer[node.meta._nodeIndex] ||
                this.nodeEnumAnswer[node.meta._nodeIndex]
                  ? 'has-answer'
                  : ''
              }>
              <div
                class={
                  'schema-node-label' +
                  (node.meta._nodeIndex === this.nodeSelected ? ' active' : '')
                }>
                <label onClick={() => this.selectNode({ node })}>
                  {node.data.label}
                </label>
                {this.nodesWithLinkEnable.includes(node.meta._nodeIndex) ? (
                  <el-button
                    type="danger"
                    size="mini"
                    class="common-operation-button"
                    onClick={() => this.setLinkMark({ node, isOpen: false })}>
                    取消拼接
                  </el-button>
                ) : (
                  <el-button
                    type="success"
                    size="mini"
                    class="common-operation-button"
                    onClick={() => this.setLinkMark({ node, isOpen: true })}>
                    拼接列
                  </el-button>
                )}
                {this.isShowPostfix ? (
                  this.nodesWithPostfixEnable.includes(node.meta._nodeIndex) ? (
                    <el-button
                      type="danger"
                      size="mini"
                      class="common-operation-button"
                      onClick={() =>
                        this.setPostfixMark({ node, isOpen: false })
                      }>
                      删除后缀
                    </el-button>
                  ) : (
                    <el-button
                      type="success"
                      size="mini"
                      class="common-operation-button"
                      onClick={() =>
                        this.setPostfixMark({ node, isOpen: true })
                      }>
                      标注后缀
                    </el-button>
                  )
                ) : null}

                {this.commonFieldSupport ? (
                  this.nodesIsCommon.includes(node.meta._nodeIndex) ? (
                    <el-button
                      type="warning"
                      size="mini"
                      class="common-operation-button"
                      onClick={() =>
                        this.setCommonMark({ node, isCommon: false })
                      }>
                      取消公共字段
                    </el-button>
                  ) : (
                    <el-button
                      type="success"
                      size="mini"
                      class="common-operation-button"
                      onClick={() =>
                        this.setCommonMark({ node, isCommon: true })
                      }>
                      公共字段
                    </el-button>
                  )
                ) : null}
              </div>

              {node.meta._type.type === 'enum' ? (
                <el-checkbox-group
                  class="schema-enum-answer"
                  value={
                    this.nodeEnumAnswer[node.meta._nodeIndex]
                      ? this.nodeEnumAnswer[node.meta._nodeIndex].value
                      : ''
                  }>
                  {node.meta._type.values.map((enumItem) => (
                    <el-checkbox
                      key={enumItem.name}
                      border={true}
                      size="mini"
                      label={enumItem.name}
                      onChange={(value) =>
                        this.updateNodeEnumValue({
                          index: node.meta._nodeIndex,
                          name: enumItem.name,
                          value,
                          isMultiSelect: node.meta._type.isMultiSelect,
                        })
                      }
                    />
                  ))}
                </el-checkbox-group>
              ) : null}

              {this.nodeAnswer[node.meta._nodeIndex] ? (
                <div class="schema-node-answer">
                  <p
                    class={
                      node.meta._nodeIndex === this.nodeAnswerSelected
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      this.selectNodeAnswer({
                        node,
                        answer: this.nodeAnswer[node.meta._nodeIndex],
                      })
                    }>
                    {this.nodeAnswer[node.meta._nodeIndex].text}
                  </p>
                  <i
                    class="far fa-times-circle"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.removeNodeAnswer({ node });
                    }}
                  />
                </div>
              ) : null}
            </div>

            {this.nodesWithPostfixEnable.includes(node.meta._nodeIndex) ? (
              <div>
                <div
                  class={
                    'schema-node-label sub' +
                    (node.meta._nodeIndex === this.nodePostfixSelected
                      ? ' active'
                      : '')
                  }>
                  <label
                    onClick={() => this.selectNode({ node, isPostfix: true })}>
                    {node.data.label}
                    后缀
                  </label>
                </div>

                {this.nodePostfixAnswer[node.meta._nodeIndex] ? (
                  <div class="schema-node-answer">
                    <p
                      class={
                        node.meta._nodeIndex === this.nodePostfixAnswerSelected
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        this.selectNodeAnswer({
                          node,
                          answer: this.nodePostfixAnswer[node.meta._nodeIndex],
                          isPostfix: true,
                        })
                      }>
                      {this.nodePostfixAnswer[node.meta._nodeIndex].text}
                    </p>
                    <i
                      class="far fa-times-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.removeNodeAnswer({ node, isPostfix: true });
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {this.nodesWithLinkEnable.includes(node.meta._nodeIndex) ? (
              <div>
                <div
                  class={
                    'schema-node-label sub' +
                    (node.meta._nodeIndex === this.nodePostfixSelected
                      ? 'active'
                      : '')
                  }>
                  <label>连接符</label>
                </div>
                <div class="schema-node-answer">
                  <el-select
                    size="small"
                    value={this.nodeLinkAnswerSymbol[node.meta._nodeIndex]}
                    onChange={(symbol) =>
                      this.setNodeLinkAnswerSymbol({ node, symbol })
                    }>
                    {linkOperators.map((symbol) => (
                      <el-option key={symbol} label={symbol} value={symbol} />
                    ))}
                  </el-select>
                </div>
                <div
                  class={
                    'schema-node-label sub' +
                    (node.meta._nodeIndex === this.nodeLinkSelected
                      ? ' active'
                      : '')
                  }>
                  <label
                    onClick={() => this.selectNode({ node, isLink: true })}>
                    拼接列
                  </label>
                </div>

                {this.nodeLinkAnswer[String(node.meta._nodeIndex)] ? (
                  <div class="schema-node-answer">
                    <p
                      class={
                        node.meta._nodeIndex === this.nodeLinkAnswerSelected
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        this.selectNodeAnswer({
                          node,
                          answer: this.nodeLinkAnswer[node.meta._nodeIndex],
                          isLink: true,
                        })
                      }>
                      {this.nodeLinkAnswer[node.meta._nodeIndex].text}
                    </p>
                    <i
                      class="far fa-times-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.removeNodeAnswer({ node, isLink: true });
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {node.children.length > 0 ? (
              <table-remark-schema-tree
                commonFieldSupport={this.commonFieldSupport}
                isShowPostfix={this.isShowPostfix}
                schemaNode={node}
                nodeSelected={this.nodeSelected}
                nodeAnswer={this.nodeAnswer}
                nodeAnswerSelected={this.nodeAnswerSelected}
                nodeEnumAnswer={this.nodeEnumAnswer}
                selectNode={this.selectNode}
                selectNodeAnswer={this.selectNodeAnswer}
                updateNodeEnumValue={this.updateNodeEnumValue}
                nodesWithLinkEnable={this.nodesWithLinkEnable}
                nodeLinkSelected={this.nodeLinkSelected}
                nodeLinkAnswer={this.nodeLinkAnswer}
                nodeLinkAnswerSelected={this.nodeLinkAnswerSelected}
                nodeLinkAnswerSymbol={this.nodeLinkAnswerSymbol}
                setLinkMark={this.setLinkMark}
                setNodeLinkAnswerSymbol={this.setNodeLinkAnswerSymbol}
                nodesWithPostfixEnable={this.nodesWithPostfixEnable}
                nodePostfixSelected={this.nodePostfixSelected}
                nodePostfixAnswer={this.nodePostfixAnswer}
                nodePostfixAnswerSelected={this.nodePostfixAnswerSelected}
                setPostfixMark={this.setPostfixMark}
                nodesIsCommon={this.nodesIsCommon}
                setCommonMark={this.setCommonMark}
                removeNodeAnswer={this.removeNodeAnswer}
              />
            ) : null}
          </li>
        ))}
      </ul>
    );
  },
});

const FileRemarkTableAnswer = Vue.component('file-remark-table-answer', {
  props: {
    qid: {
      type: Number,
      required: true,
    },
  },
  created() {
    EventBus.$on('open-table-remark', this.initData);
    EventBus.$on('create-table-answer-item', this.createAnswer);
  },
  destroyed() {
    EventBus.$off('open-table-remark', this.initData);
    EventBus.$off('create-table-answer-item', this.createAnswer);
  },
  data() {
    return {
      schemaNode: null,
      nodesData: {},
      schemaNodeKey: '',
      nodeSelected: null,
      nodeAnswer: {},
      nodeAnswerSelected: null,
      nodeEnumAnswer: {},
      nodesWithPostfixEnable: [],
      nodePostfixSelected: null,
      nodePostfixAnswer: {},
      nodePostfixAnswerSelected: null,
      nodesWithLinkEnable: [],
      nodeLinkSelected: null,
      nodeLinkAnswer: {},
      nodeLinkAnswerSelected: null,
      nodeLinkAnswerSymbol: {},
      nodesIsCommon: [],
      postfixSupport: true,
      commonFieldSupport: true,
      paramsExtra: {},
      submitting: false,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    submitDisabled() {
      return (
        (Object.keys(this.nodeAnswer).every((key) => !this.nodeAnswer[key]) &&
          Object.keys(this.nodeEnumAnswer).every(
            (key) => this.nodeEnumAnswer[key].value.length === 0,
          )) ||
        this.submitting
      );
    },
    isShowPostfix() {
      return (
        this.configuration.table_association_postfix && this.postfixSupport
      );
    },
  },
  methods: {
    initData({
      model,
      modelKey,
      postfixSupport,
      commonFieldSupport,
      ...paramsExtra
    }) {
      this.schemaNode = _.cloneDeep(model);

      const nodesDataIntial = {};
      const nodeAnswerIntial = {};
      const nodeEnumAnswerInitial = {};

      this.schemaNode.children.forEach(function checkNode(node) {
        const nodeKey = node.meta._nodeIndex;
        nodesDataIntial[nodeKey] = node;
        nodeAnswerIntial[nodeKey] = null;
        if (node.meta._type.type === 'enum') {
          nodeEnumAnswerInitial[nodeKey] = {
            label: node.data.label,
            value: [],
          };
        }

        if (Array.isArray(node.children) && node.children.length > 0) {
          node.children.forEach(checkNode);
        }
      });

      this.schemaNodeKey = modelKey;
      this.nodesData = nodesDataIntial;
      this.nodeAnswer = nodeAnswerIntial;
      this.nodeEnumAnswer = nodeEnumAnswerInitial;
      this.postfixSupport = postfixSupport;
      this.commonFieldSupport = commonFieldSupport;
      this.paramsExtra = paramsExtra;
    },
    selectNode({ node, isPostfix = false, isLink = false }) {
      this.resetSelected();
      const nodeKey = node.meta._nodeIndex;

      if (isPostfix) {
        this.nodePostfixSelected = nodeKey;
      } else if (isLink) {
        this.nodeLinkSelected = nodeKey;
      } else {
        this.nodeSelected = nodeKey;
      }

      EventBus.$emit('schema-node-selected', {
        key: JSON.stringify(mixDeepInfo(node.meta)),
        model: node,
        ignoreAnswer: true,
      });
    },
    selectNodeAnswer({ node, answer, isPostfix = false, isLink = false }) {
      this.resetSelected();
      const nodeKey = node.meta._nodeIndex;

      if (isPostfix) {
        this.nodePostfixAnswerSelected = nodeKey;
      } else if (isLink) {
        this.nodeLinkAnswerSelected = nodeKey;
      } else {
        this.nodeAnswerSelected = nodeKey;
      }

      EventBus.$emit('answer-item-selected', {
        schemaNode: this.schemaNodeKey,
        schema: { data: { label: answer.label } },
        data: { boxes: [answer] },
      });
    },
    createAnswer({ boxes }) {
      if (this.submitting) {
        return;
      }

      if (this.nodeSelected) {
        const node = this.nodesData[this.nodeSelected];

        this.nodeAnswer = {
          ...this.nodeAnswer,
          [this.nodeSelected]: {
            ...boxes[0],
            text: boxes.map((box) => box.text).join(''),
            label: node.data.label,
          },
        };
      } else if (this.nodePostfixSelected) {
        const node = this.nodesData[this.nodePostfixSelected];

        this.nodePostfixAnswer = {
          ...this.nodePostfixAnswer,
          [this.nodePostfixSelected]: {
            ...boxes[0],
            text: boxes.map((box) => box.text).join(''),
            label: node.data.label,
          },
        };
      } else if (this.nodeLinkSelected) {
        const node = this.nodesData[this.nodeLinkSelected];

        this.nodeLinkAnswer = {
          ...this.nodeLinkAnswer,
          [this.nodeLinkSelected]: {
            ...boxes[0],
            text: boxes.map((box) => box.text).join(''),
            label: node.data.label,
          },
        };
      }
    },
    removeNodeAnswer({ node, isPostfix = false, isLink = false }) {
      const nodeKey = String(node.meta._nodeIndex);

      if (isPostfix) {
        this.nodePostfixAnswer[nodeKey] = null;
      } else if (isLink) {
        this.nodeLinkAnswer[nodeKey] = null;
      } else {
        this.nodeAnswer[nodeKey] = null;
      }

      this.resetSelected();
      EventBus.$emit('remove-all-frames');
    },
    setCommonMark({ node, isCommon = false }) {
      const nodeKey = node.meta._nodeIndex;
      if (isCommon) {
        this.nodesIsCommon = [...this.nodesIsCommon, nodeKey];
      } else {
        const nodeIndex = this.nodesIsCommon.indexOf(nodeKey);
        if (nodeIndex > -1) {
          this.nodesIsCommon.splice(nodeIndex, 1);
        }
      }
    },
    setPostfixMark({ node, isOpen = true }) {
      this.resetSelected();
      const nodeKey = node.meta._nodeIndex;

      if (isOpen) {
        this.nodesWithPostfixEnable = [...this.nodesWithPostfixEnable, nodeKey];
      } else {
        const nodeIndex = this.nodesWithPostfixEnable.indexOf(nodeKey);
        if (nodeIndex > -1) {
          this.nodesWithPostfixEnable.splice(nodeIndex, 1);
        }

        if (this.nodePostfixAnswer[nodeKey]) {
          this.nodePostfixAnswer[nodeKey] = null;
        }
      }
    },
    setLinkMark({ node, isOpen = true }) {
      this.resetSelected();
      const nodeKey = node.meta._nodeIndex;

      if (isOpen) {
        this.nodesWithLinkEnable = [...this.nodesWithLinkEnable, nodeKey];
      } else {
        const nodeIndex = this.nodesWithLinkEnable.indexOf(nodeKey);
        if (nodeIndex > -1) {
          this.nodesWithLinkEnable.splice(nodeIndex, 1);
        }

        if (this.nodeLinkAnswer[nodeKey]) {
          this.nodeLinkAnswer[nodeKey] = null;
        }

        if (this.nodeLinkAnswerSymbol[nodeKey]) {
          this.nodeLinkAnswerSymbol[nodeKey] = null;
        }
      }
    },
    setNodeLinkAnswerSymbol({ node, symbol }) {
      this.nodeLinkAnswerSymbol = {
        ...this.nodeLinkAnswerSymbol,
        [node.meta._nodeIndex]: symbol,
      };
    },
    updateNodeEnumValue({ index, name, value, isMultiSelect }) {
      const enumValue = this.nodeEnumAnswer[index].value;
      const nodeEnumAnswerUpdated = _.cloneDeep(this.nodeEnumAnswer);

      if (value) {
        if (isMultiSelect) {
          nodeEnumAnswerUpdated[index].value = enumValue.concat(name);
        } else {
          nodeEnumAnswerUpdated[index].value = [name];
        }
      } else {
        const nameIndex = enumValue.indexOf(name);

        if (nameIndex > -1) {
          nodeEnumAnswerUpdated[index].value = enumValue
            .slice(0, nameIndex)
            .concat(enumValue.slice(nameIndex + 1, enumValue.length));
        }
      }

      this.nodeEnumAnswer = nodeEnumAnswerUpdated;
    },
    async generateTableRemark() {
      const data = {};
      Object.keys(this.nodeAnswer).forEach((key) => {
        const nodeData = this.nodesData[key];
        const answerData = {};
        if (this.nodeAnswer[key]) {
          const nodeAnswer = this.nodeAnswer[key];

          if (nodeAnswer.box) {
            const boxOriginal = nodeAnswer.box;

            answerData.box = {
              page: nodeAnswer.page,
              box: Object.keys(boxOriginal).map(
                (boxKey) => boxOriginal[boxKey],
              ),
            };
            answerData.text = nodeAnswer.text;
          }
        }

        if (this.nodeEnumAnswer[key]) {
          if (this.nodeEnumAnswer[key].value.length === 1) {
            answerData.value = this.nodeEnumAnswer[key].value[0];
          } else {
            answerData.value = this.nodeEnumAnswer[key].value;
          }
        }

        if (this.nodesIsCommon.includes(Number(key))) {
          answerData.common = true;
        }

        if (this.nodePostfixAnswer[key]) {
          answerData.postfix = {
            box: {
              page: this.nodePostfixAnswer[key].page,
              box: Object.keys(this.nodePostfixAnswer[key]['box']).map(
                (boxKey) => this.nodePostfixAnswer[key]['box'][boxKey],
              ),
            },
            text: this.nodePostfixAnswer[key].text,
          };
        }

        if (this.nodeLinkAnswer[key] && this.nodeLinkAnswerSymbol[key]) {
          answerData.link = {
            box: {
              page: this.nodeLinkAnswer[key].page,
              box: Object.keys(this.nodeLinkAnswer[key]['box']).map(
                (boxKey) => this.nodeLinkAnswer[key]['box'][boxKey],
              ),
            },
            text: this.nodeLinkAnswer[key].text,
            symbol: this.nodeLinkAnswerSymbol[key],
          };
        }

        if (!_.isEmpty(answerData) && nodeData) {
          const label = nodeData.meta._deepLabels.join(':');
          data[label] = answerData;
        }
      });

      try {
        this.submitting = true;

        const res = await this.$store.dispatch('remarkModule/fetchBoxTable', {
          qid: this.qid,
          key: this.schemaNode.data.label,
          data,
        });

        const answerData = res.data;

        if (Array.isArray(answerData) && answerData.length > 0) {
          EventBus.$emit('create-table-answer-batch', {
            schemaNode: this.schemaNodeKey,
            data: answerData,
            ...this.paramsExtra,
          });
        }

        this.submitting = false;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: '生成表格标注失败',
          type: 'error',
        });

        console.error(error);
      } finally {
        this.submitting = false;
      }

      EventBus.$emit('close-table-remark');
      this.close();
    },
    close() {
      if (this.submitting) {
        return;
      }

      this.reset();
      this.$emit('close');
    },
    resetSelected() {
      this.nodeSelected = null;
      this.nodePostfixSelected = null;
      this.nodeLinkSelected = null;

      this.nodeAnswerSelected = null;
      this.nodePostfixAnswerSelected = null;
      this.nodeLinkAnswerSelected = null;
    },
    reset() {
      this.schemaNode = null;
      this.nodesData = {};
      this.schemaNodeKey = '';
      this.nodeSelected = null;
      this.nodeAnswer = {};
      this.nodeAnswerSelected = null;
      this.nodeEnumAnswer = {};
      this.nodesWithPostfixEnable = [];
      this.nodePostfixSelected = null;
      this.nodePostfixAnswer = {};
      this.nodePostfixAnswerSelected = null;
      this.nodesWithLinkEnable = [];
      this.nodeLinkSelected = null;
      this.nodeLinkAnswer = {};
      this.nodeLinkAnswerSelected = null;
      this.nodeLinkAnswerSymbol = {};
      this.nodesIsCommon = [];
      this.postfixSupport = true;
      this.commonFieldSupport = true;
      this.paramsExtra = {};
      this.submitting = false;
    },
  },
  render() {
    if (this.schemaNode) {
      return (
        <div class="remark-table-container">
          <header class="remark-table-header">
            <span>{this.schemaNode.data.label}</span>
            <i class="el-icon-close" onClick={this.close} />
          </header>
          <div class="schema-tree">
            <table-remark-schema-tree
              commonFieldSupport={this.commonFieldSupport}
              isShowPostfix={this.isShowPostfix}
              schemaNode={this.schemaNode}
              nodeSelected={this.nodeSelected}
              nodeAnswer={this.nodeAnswer}
              nodeAnswerSelected={this.nodeAnswerSelected}
              nodeEnumAnswer={this.nodeEnumAnswer}
              selectNode={this.selectNode}
              selectNodeAnswer={this.selectNodeAnswer}
              updateNodeEnumValue={this.updateNodeEnumValue}
              nodesWithLinkEnable={this.nodesWithLinkEnable}
              nodeLinkSelected={this.nodeLinkSelected}
              nodeLinkAnswer={this.nodeLinkAnswer}
              nodeLinkAnswerSelected={this.nodeLinkAnswerSelected}
              setLinkMark={this.setLinkMark}
              setNodeLinkAnswerSymbol={this.setNodeLinkAnswerSymbol}
              nodesWithPostfixEnable={this.nodesWithPostfixEnable}
              nodePostfixSelected={this.nodePostfixSelected}
              nodePostfixAnswer={this.nodePostfixAnswer}
              nodePostfixAnswerSelected={this.nodePostfixAnswerSelected}
              nodeLinkAnswerSymbol={this.nodeLinkAnswerSymbol}
              setPostfixMark={this.setPostfixMark}
              nodesIsCommon={this.nodesIsCommon}
              setCommonMark={this.setCommonMark}
              removeNodeAnswer={this.removeNodeAnswer}
            />
          </div>
          <div class="remark-table-operation">
            <el-button size="mini" onClick={this.close}>
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              onClick={this.generateTableRemark}
              loading={this.submitting}
              disabled={this.submitDisabled}>
              生成标注
            </el-button>
          </div>
        </div>
      );
    }

    return null;
  },
});

export default FileRemarkTableAnswer;
