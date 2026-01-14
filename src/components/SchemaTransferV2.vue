<template>
  <el-dialog
    width="85%"
    class="transfer-dialog-wrapper"
    :modal-append-to-body="false"
    :visible="visible"
    :title="$t(`message['迁移Schema']`)"
    :close-on-click-modal="false"
    :before-close="closeTransfer">
    <div class="transfer-wrapper">
      <div>
        <tree-list
          v-if="oldTreeData !== null"
          :data="oldTreeData"
          :isOnlyOpenedRoot="false">
          <div v-if="node !== null" class="node-line" slot-scope="{ node }">
            <div
              :class="{
                'is-deleted': node.meta.state.type === '-',
                'is-equal': node.meta.state.type === '=',
                'is-changed': node.meta.state.type === '*',
              }">
              <span class="node-label">{{ node.data.label }}</span>
              <schema-tree-node-type
                :type="node.data.type"
                :types="oldTypes"></schema-tree-node-type>
              <span class="attr-flags">
                <el-tag
                  v-if="node.data.multi"
                  type="info"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['可多选']`) }}</el-tag
                >
                <el-tag
                  v-if="node.data.required"
                  type="info"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['必填']`) }}</el-tag
                >
              </span>
            </div>
          </div>
        </tree-list>
      </div>
      <div>
        <tree-list
          v-if="newTreeData !== null"
          :data="newTreeData"
          :isOnlyOpenedRoot="false">
          <div v-if="node !== null" class="node-line" slot-scope="{ node }">
            <div
              :class="{
                'is-added': node.meta.state.type === '+',
                'is-equal': node.meta.state.type === '=',
              }">
              <span class="node-label">{{ node.data.label }} </span>
              <schema-tree-node-type
                :type="node.data.type"
                :types="newTypes"></schema-tree-node-type>
              <span class="attr-flags">
                <el-tag
                  v-if="node.data.multi"
                  type="info"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['可多选']`) }}</el-tag
                >
                <el-tag
                  v-if="node.data.required"
                  type="info"
                  size="mini"
                  :disable-transitions="true"
                  >{{ $t(`message['必填']`) }}</el-tag
                >
              </span>
            </div>
          </div>
        </tree-list>
      </div>
    </div>
    <el-collapse accordion>
      <el-collapse-item name="detail">
        <template slot="title">{{ $t(`message['详细信息']`) }}</template>
        <code>
          {{ JSON.stringify(result) }}
        </code>
      </el-collapse-item>
    </el-collapse>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeTransfer">{{ $t(`message['取消']`) }}</el-button>
      <el-button type="primary" @click="handleTransfer">{{
        $t(`message['确定']`)
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import {
  fullSchemaToEntity,
  parseEntityToTree,
  getSchemaType,
  getAllTypesFromEntity,
  eachTreeNode,
  getNodeInTreeData,
  initTreeData,
  flattenSchemaData,
} from '../utils';
import TreeList from './tree/TreeList';
import SchemaTreeNodeType from './SchemaTreeNodeType';
import { answerKeyTools } from '../utils/remarkAnswerTools';
import { parseAnswerToV2_2 } from '../utils/answer-translateV2.2';

export default {
  name: 'schema-transfer-v2',
  components: {
    TreeList,
    SchemaTreeNodeType,
  },
  watch: {
    schemas(newVal) {
      if (newVal && newVal.length === 2) {
        const oldEntity = fullSchemaToEntity(newVal[0]);
        this.oldTypes = getAllTypesFromEntity(oldEntity);
        const oldTreeData = parseEntityToTree(oldEntity).relations.tree;
        initTreeData(oldTreeData);
        this.oldTreeData = oldTreeData;
        const newEntity = fullSchemaToEntity(newVal[1]);
        this.newTypes = getAllTypesFromEntity(newEntity);
        const newTreeData = parseEntityToTree(newEntity).relations.tree;
        initTreeData(newTreeData);
        this.newTreeData = newTreeData;
        this.result = this.calc(this.oldTreeData, this.newTreeData);
      }
    },
  },
  props: {
    schemas: {
      type: Array,
      required: true,
    },
    userAnswers: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      oldTreeData: null,
      newTreeData: null,
      oldTypes: null,
      newTypes: null,
      result: null,
      dragObject: {
        from: null,
        to: null,
      },
    };
  },
  computed: {
    visible() {
      return this.schemas.length === 2;
    },
  },
  methods: {
    setDragObject(key, value) {
      this.dragObject[key] = value;
    },
    closeTransfer() {
      this.$emit('close-transfer');
    },
    getSchemaType(type, types) {
      return getSchemaType(types, type);
    },
    /**
     * 计算迁移时需要做的改动
     * 示例：
     *      * 表示属性有变动（required/multi）
     *      + 表示该项为新增项目
     *      - 表示该项被删除
     *      > 表示该项的 children 有变动
     * */
    calc(oldTreeData, newTreeData) {
      // remove _index, _nodeIndex
      eachTreeNode(oldTreeData, (node) => {
        delete node.meta['_index'];
        delete node.meta['_nodeIndex'];
      });
      eachTreeNode(newTreeData, (node) => {
        delete node.meta['_index'];
        delete node.meta['_nodeIndex'];
      });
      const result = [];
      eachTreeNode(oldTreeData, (node) => {
        const newTreeNode = getNodeInTreeData(
          this.newTreeData,
          node.data.label,
          'data.label',
        );
        Object.assign(node.meta, {
          state: {},
        });
        let state = {};
        if (!newTreeNode) {
          // 删除
          state = {
            type: '-',
            label: node.data.label,
            position: 'old',
            node,
          };
          result.push(state);
          Object.assign(node.meta.state, {
            type: state.type,
          });
        } else {
          if (
            _.isEqual(node.data, newTreeNode.data) &&
            _.isEqual(node.children, newTreeNode.children)
          ) {
            Object.assign(node.meta.state, {
              type: '=',
            });
          } else {
            Object.assign(node.meta.state, {
              type: '*',
            });
          }
        }
      });
      eachTreeNode(newTreeData, (node) => {
        const oldTreeNode = getNodeInTreeData(
          this.oldTreeData,
          node.data.label,
          'data.label',
        );
        let state = {};
        Object.assign(node.meta, {
          state: {
            answer: {
              items: [],
            },
          },
        });
        if (!oldTreeNode) {
          // 新增
          state = {
            type: '+',
            label: node.data.label,
            position: 'new',
            node,
          };
          result.push(state);
          Object.assign(node.meta.state, {
            type: state.type,
          });
        } else {
          const isAttrEqual = _.isEqual(oldTreeNode.data, node.data);
          const isChildrenEqual = _.isEqual(
            oldTreeNode.children,
            node.children,
          );
          if (isAttrEqual && isChildrenEqual) {
            Object.assign(node.meta.state, {
              type: '=',
            });
          } else {
            if (!isAttrEqual) {
              Object.assign(node.meta.state, {
                type: '*',
              });
            }
            if (!isChildrenEqual) {
              Object.assign(node.meta.state, {
                type: '>',
              });
            }
            result.push({
              type: node.meta.state.type,
              position: 'new',
              node,
            });
          }
        }
      });
      result.forEach((item) => {
        item.label = item.node.data.label;
        item.key = JSON.stringify([...item.node.meta._parent, item.label]);
      });
      return result;
    },
    findNewSchemaNode(flattenSchema, answerKey) {
      return flattenSchema.find((item) => {
        let schemaPathKey = JSON.stringify([
          ...item.meta._parent,
          item.data.label,
        ]);
        if (schemaPathKey === answerKey) {
          return item;
        }
      });
    },
    applySchemaToAnswer(newSchema, answers) {
      for (let i = answers.length - 1; i >= 0; i--) {
        const index = i;
        const answer = answers[i];
        const key = JSON.stringify(
          answerKeyTools.select(answer.key).splitIndexKey()[0],
        );
        let schema = this.findNewSchemaNode(newSchema, key);
        if (!schema) {
          answers.splice(index, 1);
        } else {
          if (
            schema.data.multi !== answer.schema.data.multi ||
            schema.data.type !== answer.schema.data.type
          ) {
            answers.splice(index, 1);
          } else {
            answer.schema = schema;
          }
        }
      }
      return answers;
    },
    async handleTransfer() {
      let newSchema = this.schemas[1];
      let flattenSchema = flattenSchemaData(newSchema.data);
      let answers = _.cloneDeep(this.userAnswers);
      // v1答案，需要转换为v2.2（答案格式未升级V2.2前，仅做测试用）
      answers.forEach((answer) => {
        if (!answer.data.userAnswer.items) {
          answer.data.userAnswer = parseAnswerToV2_2(
            answer.data.userAnswer,
            answer.data.schema,
          );
          answer.data.userAnswer.items = answer.data.userAnswer.items.filter(
            (item) => {
              return (
                item.data.length > 0 &&
                (item.data[0].boxes.length > 0 || item.data[0].value)
              );
            },
          );
        }
      });
      let userAnswers = answers.map((item) => {
        item.data.userAnswer.items = this.applySchemaToAnswer(
          flattenSchema,
          item.data.userAnswer.items,
        );
        item.data.schema = newSchema.data;
        return {
          data: item.data,
          uid: item.uid,
        };
      });
      let data = {
        ans_data: userAnswers,
      };
      try {
        await this.$store.dispatch('remarkModule/updateAnswerSchema', {
          qid: this.$route.params.qid,
          data,
        });
        this.$store.commit('schemaModule/SET_TRANSFER', []);
        this.closeTransfer();
        this.$emit('transfer-schema');
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['迁移成功']`),
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
  },
};
</script>

<style lang="scss" scoped>
.transfer-dialog-wrapper {
  z-index: 10001 !important;
}

.transfer-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .node-line {
    display: flex;
  }
  & > div {
    width: 45%;
  }
  .is-deleted {
    width: 100%;
    text-decoration: line-through;
  }
  .is-added {
    width: 100%;
    font-weight: bold;
  }
  .is-equal {
    opacity: 0.8;
  }
  .node-label {
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  .attr-flags {
    margin-left: 0.5em;
    & > span + span {
      margin-left: 0.3em;
    }
  }
}
</style>
