import Vue from 'vue';
import { isEmpty } from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';
import './FileRemarkBatchEdit.scss';
import { mixDeepInfo } from '@/utils';

const EditMode = {
  group: 'group',
  node: 'node',
};

Vue.component('batch-edit-schema-tree', {
  props: {
    schemaNode: {
      type: Object,
      required: true,
    },
    nodeSelected: {
      type: String,
      required: false,
    },
    selectNode: {
      type: Function,
      required: false,
    },
    nodeAnswer: {
      type: Object,
      required: true,
    },
    nodeAnswerSelected: {
      type: String,
      required: false,
    },
    nodeAnswerSelectedBoxIndex: {
      type: Number,
      required: false,
    },
    selectNodeAnswer: {
      type: Function,
      required: false,
    },
    updateNodeAnswer: {
      type: Function,
      required: true,
    },
    removeNodeAnswer: {
      type: Function,
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
              <div
                class={[
                  'schema-node-label',
                  node.meta._deepLabels.join(':') === this.nodeSelected
                    ? 'active'
                    : '',
                ].join(' ')}>
                <label on-click={() => this.selectNode(node)}>
                  {node.data.label}
                </label>
              </div>
              {node.meta._type.type === 'enum' ? (
                <el-checkbox-group class="schema-enum-answer">
                  {node.meta._type.values.map((item, index) => (
                    <el-checkbox
                      key={index}
                      border={true}
                      size="mini"
                      label={item.name}
                      on-change={(value) =>
                        this.updateNodeAnswer({
                          type: 'enum',
                          node,
                          value,
                          name: item.name,
                        })
                      }
                    />
                  ))}
                </el-checkbox-group>
              ) : null}
              {this.nodeAnswer[node.meta._deepLabels.join(':')] ? (
                <ul class="schema-node-answer">
                  {this.nodeAnswer[node.meta._deepLabels.join(':')].boxes.map(
                    (box, boxIndex) => (
                      <li>
                        <p
                          class={[
                            node.meta._deepLabels.join(':') ===
                              this.nodeAnswerSelected &&
                            this.nodeAnswerSelectedBoxIndex === boxIndex
                              ? 'active'
                              : '',
                          ].join(' ')}
                          on-click={() =>
                            this.selectNodeAnswer(node, boxIndex)
                          }>
                          {box.text}
                        </p>
                        <i
                          class="far fa-times-circle"
                          on-click={() => this.removeNodeAnswer(node, boxIndex)}
                        />
                      </li>
                    ),
                  )}
                </ul>
              ) : null}
              {node.children.length > 0 ? (
                <batch-edit-schema-tree
                  schemaNode={node}
                  nodeSelected={this.nodeSelected}
                  selectNode={this.selectNode}
                  nodeAnswer={this.nodeAnswer}
                  nodeAnswerSelected={this.nodeAnswerSelected}
                  nodeAnswerSelectedBoxIndex={this.nodeAnswerSelectedBoxIndex}
                  selectNodeAnswer={this.selectNodeAnswer}
                  updateNodeAnswer={this.updateNodeAnswer}
                  removeNodeAnswer={this.removeNodeAnswer}
                />
              ) : null}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  },
});

const RemarkBatchEdit = Vue.component('remark-batch-edit', {
  created() {
    EventBus.$on('open-batch-edit', this.initData);
    EventBus.$on('create-batch-edit-answer-item', this.createAnswer);
  },
  destroyed() {
    EventBus.$off('open-batch-edit', this.initData);
    EventBus.$off('create-batch-edit-answer-item', this.createAnswer);
  },
  data() {
    return {
      schemaNode: null,
      schemaNodeKey: '',
      editMode: EditMode.group,
      nodeSelected: null,
      nodeAnswer: {},
      nodeAnswerSelected: null,
      nodeAnswerSelectedBoxIndex: null,
      schemaNodeList: [],
      schemaNodeListSelected: [],
    };
  },
  methods: {
    initData({ model, modelKey }) {
      this.schemaNodeKey = modelKey;
      this.schemaNode = model;

      const schemaNodeList = [];
      if (Array.isArray(model.children) && model.children.length > 0) {
        model.children.forEach(function getNodeLabel(node) {
          if (Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach(getNodeLabel);
          } else {
            schemaNodeList.push({
              label: node.meta._deepLabels.slice(2).join(' : '),
              value: node.meta._deepLabels.join(':'),
              node,
            });
          }
        });
      }

      this.schemaNodeList = schemaNodeList;
    },
    createAnswer({ boxes }) {
      const answer = {
        boxes: boxes,
      };

      if (this.editMode === EditMode.group) {
        if (this.nodeAnswer[this.nodeSelected]) {
          answer.boxes = this.nodeAnswer[this.nodeSelected].boxes.concat(
            boxes[0],
          );
        }

        this.nodeAnswer = {
          ...this.nodeAnswer,
          [this.nodeSelected]: answer,
        };
      }

      if (this.editMode === EditMode.node) {
        if (this.nodeAnswer[this.schemaNodeListSelected[0]]) {
          answer.boxes = this.nodeAnswer[
            this.schemaNodeListSelected[0]
          ].boxes.concat(boxes[0]);
        }

        this.nodeAnswer = this.schemaNodeListSelected.reduce(
          (nodeAnswer, nodeLabel) => {
            nodeAnswer[nodeLabel] = answer;
            return nodeAnswer;
          },
          {},
        );
      }
    },
    switchEditMode(mode) {
      this.editMode = mode;
    },
    selectNode(node) {
      this.resetSelected();

      this.nodeSelected = node.meta._deepLabels.join(':');

      EventBus.$emit('schema-node-selected', {
        key: JSON.stringify(mixDeepInfo(node.meta)),
        model: node,
        ignoreAnswer: true,
      });
    },
    selectNodeAnswer(node, boxIndex) {
      this.resetSelected();

      const nodePath = node.meta._deepLabels.join(':');
      this.nodeAnswerSelected = nodePath;
      this.nodeAnswerSelectedBoxIndex = boxIndex;

      const answer = this.nodeAnswer[nodePath];
      if (answer) {
        const boxes = answer.boxes[boxIndex];
        EventBus.$emit('answer-item-selected', {
          schemaNode: JSON.stringify(mixDeepInfo(node.meta)),
          schema: { data: { label: node.data.label } },
          data: { boxes: [boxes] },
        });
      }
    },
    updateNodeAnswer({ type, node, value, name }) {
      const nodePath = node.meta._deepLabels.join(':');

      if (type === 'enum') {
        if (!this.nodeAnswer[nodePath]) {
          this.nodeAnswer[nodePath] = { value: [] };
        }

        const nodeValueOlder = this.nodeEnumAnswer[nodePath].value;
        if (value) {
          if (node.meta._type.isMultiSelect) {
            this.nodeAnswer[nodePath].value = nodeValueOlder.value.concat(name);
          } else {
            this.nodeAnswer[nodePath].value = [name];
          }
        } else {
          const nameIndex = nodeValueOlder.indexOf(name);

          if (nameIndex > -1) {
            this.nodeAnswer[nodePath].value = nodeValueOlder
              .slice(0, nameIndex)
              .concat(
                nodeValueOlder.slice(nameIndex + 1, nodeValueOlder.length),
              );
          }
        }
      }
    },
    removeNodeAnswer(node, boxIndex) {
      if (this.editMode === EditMode.group) {
        const nodePath = node.meta._deepLabels.join(':');
        this.nodeAnswer[nodePath].boxes.splice(boxIndex, 1);
      }

      if (this.editMode === EditMode.node) {
        this.nodeAnswer[this.schemaNodeListSelected[0]].boxes.splice(
          boxIndex,
          1,
        );
        this.schemaNodeListSelected.forEach((node) => {
          this.nodeAnswer[node] =
            this.nodeAnswer[this.schemaNodeListSelected[0]];
        });
      }

      this.resetSelected();
      EventBus.$emit('remove-all-frames');
    },
    selectSchemaNodes(nodes) {
      this.schemaNodeListSelected = nodes;

      if (nodes.length > 0) {
        const firstNode = this.schemaNodeList.find(
          (item) => item.value === nodes[0],
        );
        this.selectNode(firstNode.node);
      }
    },
    submit() {
      if (!isEmpty(this.nodeAnswer)) {
        EventBus.$emit('update-group-answer-batch', {
          schemaNode: this.schemaNodeKey,
          data: this.nodeAnswer,
        });
      }

      this.close();
    },
    resetSelected() {
      this.nodeSelected = null;
      this.nodeAnswerSelected = null;
    },
    reset() {
      this.schemaNode = null;
      this.schemaNodeKey = '';
      this.schemaNodeList = [];
      this.editMode = EditMode.group;
      this.nodeSelected = null;
      this.nodeAnswer = {};
      this.nodeAnswerSelected = null;
      this.schemaNodeList = [];
      this.schemaNodeListSelected = [];
    },
    close() {
      this.reset();
      this.$emit('close');
    },
  },
  render() {
    if (this.schemaNode) {
      return (
        <div class="remark-batch-edit">
          <div class="schema-node-title">
            <span>{this.schemaNode.data.label}</span>
            <i class="el-icon-close" on-click={this.close} />
          </div>
          <div class="batch-edit-mode">
            <el-button-group>
              <el-button
                type={this.editMode === EditMode.group ? 'primary' : 'default'}
                size="mini"
                on-click={() => this.switchEditMode(EditMode.group)}>
                答案组
              </el-button>
              <el-button
                type={this.editMode === EditMode.node ? 'primary' : 'default'}
                size="mini"
                on-click={() => this.switchEditMode(EditMode.node)}>
                指定字段
              </el-button>
            </el-button-group>
          </div>
          {this.editMode === EditMode.group ? (
            <div class="group-edit">
              <batch-edit-schema-tree
                schemaNode={this.schemaNode}
                nodeSelected={this.nodeSelected}
                selectNode={this.selectNode}
                nodeAnswer={this.nodeAnswer}
                nodeAnswerSelected={this.nodeAnswerSelected}
                nodeAnswerSelectedBoxIndex={this.nodeAnswerSelectedBoxIndex}
                selectNodeAnswer={this.selectNodeAnswer}
                updateNodeAnswer={this.updateNodeAnswer}
                removeNodeAnswer={this.removeNodeAnswer}
              />
            </div>
          ) : (
            <div class="node-edit">
              <p class="node-edit-tip">* 选择字段后直接框选文档内容</p>
              <el-select
                size="small"
                value={this.schemaNodeListSelected}
                filterable={true}
                multiple={true}
                reserve-keyword={true}
                popper-class="batch-edit-select"
                on-change={this.selectSchemaNodes}>
                {this.schemaNodeList.map((node, index) => (
                  <el-option
                    key={index}
                    label={node.label}
                    value={node.value}
                  />
                ))}
              </el-select>
              {this.schemaNodeListSelected.length > 0 &&
              this.nodeAnswer[this.schemaNodeListSelected[0]] ? (
                <ul class="schema-node-answer">
                  {this.nodeAnswer[this.schemaNodeListSelected[0]].boxes.map(
                    (box, boxIndex) => (
                      <li>
                        <p>{box.text}</p>
                        <i
                          class="far fa-times-circle"
                          on-click={() => this.removeNodeAnswer(box, boxIndex)}
                        />
                      </li>
                    ),
                  )}
                </ul>
              ) : null}
            </div>
          )}
          <div class="remark-table-operation">
            <el-button size="mini" on-click={this.close}>
              取消
            </el-button>
            <el-button type="primary" size="mini" on-click={this.submit}>
              生成标注
            </el-button>
          </div>
        </div>
      );
    }

    return null;
  },
});

export default RemarkBatchEdit;
