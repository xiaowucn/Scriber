<template>
  <div @click.stop="handleClickAnswerItem" class="disclosure-answer-item">
    <div
      class="answer-header"
      :class="{
        'is-selected': isSelected,
        'is-sticky': isRootAnswerItem,
      }">
      <div>
        <label class="label">
          <span>{{ answerName }}：</span>
          <span v-if="isShowAnswerUnit">{{ answerUnit }}</span>
        </label>
        <i
          v-if="isCanCreateAnswer"
          @click.stop="handleCreateAnswer"
          class="fas fa-fw fa-plus-circle add-icon"></i>
      </div>
      <i
        v-if="isCanCreateAnswer"
        @click.stop="toggleCollapseAnswerGroup"
        :class="collapseIconClass"
        class="fas fa-fw collapse-icon"></i>
    </div>
    <div class="answer-content">
      <div class="answer-wrapper" v-if="!isShowAnswerGroup">
        <template v-if="answer.data.length !== 0">
          <disclosure-answer-value
            v-for="(answerData, index) in answer.data"
            :key="index"
            :index="index"
            :answerData="answerData"
            :answerKey="answer.key"
            :answerSchema="answer.schema"
            :answerDocType="answerDocType"
            :answerLabel="answerLabel"
            @edit-answer="editAnswer"
            @remove-answer="removeAnswer"
            @answer-item-click="handleClickAnswerItem" />
        </template>
        <disclosure-answer-value
          v-else
          :isExtractFailed="true"
          @answer-item-click="handleClickAnswerItem" />
      </div>
      <div
        class="answer-group"
        v-if="isShowAnswerGroup && !isCollapseAnswerGroup">
        <template v-for="(group, index) in answerGroup">
          <div class="group-item" :key="index">
            <div class="group-index">{{ index + 1 }}.</div>
            <div class="group-content">
              <template v-for="(node, nodeIndex) in group">
                <disclosure-answer-item
                  v-if="!node.hide"
                  :depth="depth + 1"
                  :answerItem="node"
                  :answerName="node.data.label"
                  :answerLabel="node.data.label"
                  :answerDocType="answerDocType"
                  :answerUpdatedName="`${answerLabel}${node.data.label}`"
                  :fileId="fileId"
                  :key="nodeIndex" />
              </template>
            </div>
            <i
              class="far fa-trash-alt delete-icon"
              @click.stop="handleRemoveAnswerGroup(index)"></i>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { mixDeepInfo } from '@/utils';
import { createEmptyAnswer, cloneModelAnswer } from '@/utils/remarkAnswerTools';
import DisclosureAnswerValue from './DisclosureAnswerValue';

export default {
  name: 'disclosure-answer-item',
  components: { DisclosureAnswerValue },
  props: {
    answerItem: {
      type: Object,
      required: true,
    },
    answerName: {
      type: String,
      required: true,
    },
    answerLabel: {
      type: String,
      required: true,
    },
    answerDocType: {
      type: String,
      required: true,
    },
    answerUpdatedName: {
      type: String,
      required: true,
    },
    fileId: {
      type: Number,
      required: true,
    },
    depth: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      isSelected: false,
      isCollapseAnswerGroup: false,
      answerGroup: [],
      answer: {},
    };
  },
  watch: {
    answerItem() {
      this.init();
    },
    'detail.selectedRule'() {
      this.reset();
    },
  },
  created() {
    this.reset();
    this.init();
    EventBus.$on('create-answer-item', this.createAnswerItem);
    EventBus.$on('close-all-answer-item-select', this.closeAnswerItemSelect);
  },
  beforeDestroy() {
    EventBus.$off('create-answer-item', this.createAnswerItem);
    EventBus.$off('close-all-answer-item-select', this.closeAnswerItemSelect);
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    answerUnit() {
      const unit = this.answerItem?.unit;
      return unit ? `（${unit}）` : '';
    },
    isShowAnswerUnit() {
      return !!this.answerUnit;
    },
    isShowAnswerGroup() {
      return this.answerGroup;
    },
    isCanCreateAnswer() {
      return (
        this.answerItem.meta &&
        this.answerItem.meta._type.type === 'group' &&
        this.answerItem.meta._partType !== 'root'
      );
    },
    isRootAnswerItem() {
      return this.depth === 0;
    },
    collapseIconClass() {
      return this.isCollapseAnswerGroup ? 'fa-angle-up' : 'fa-angle-down';
    },
    answerMeta() {
      const answerKey = JSON.parse(this.answer.key);
      const deepLabels = answerKey.map((item) => item.split(':')[0]);
      const deepIndex = answerKey.map((item) => Number(item.split(':')[1]));
      return {
        _deepIndex: deepIndex,
        _deepLabels: deepLabels,
      };
    },
  },
  methods: {
    init() {
      this.initAnswer();
      this.initAnswerGroup();
    },
    initAnswerGroup() {
      this.answerGroup = this.answerItem.childrenGroup;
    },
    initAnswer() {
      this.answer = !_.isEmpty(this.answerItem.answer)
        ? cloneModelAnswer(this.answerItem)
        : createEmptyAnswer(this.answerItem);
    },
    closeAnswerItemSelect() {
      this.isSelected = false;
    },
    handleClickAnswerItem() {
      EventBus.$emit('close-all-answer-item-select');
      this.isSelected = true;
      const selectedSchemaNode = {
        model: {
          data: { label: this.answerLabel },
          meta: this.answerMeta,
          children: this.answerItem.children || [],
        },
        docType: this.answerDocType,
      };
      EventBus.$emit('diff-file-popup-viewed', this.answerDocType);
      this.$nextTick(() => {
        EventBus.$emit('pdf-viewer-schema-node-selected', selectedSchemaNode);
      });
    },
    toggleCollapseAnswerGroup() {
      this.isCollapseAnswerGroup = !this.isCollapseAnswerGroup;
    },
    handleCreateAnswer() {
      const fieldGroup = this.answerGroup[0];
      if (_.isEmpty(fieldGroup)) {
        return;
      }
      const insertPosition = this.answerGroup.length;
      const parentPosition = fieldGroup[0].meta._deepIndex.length - 1;
      const fieldGroupCloned = _.cloneDeep(fieldGroup);
      fieldGroupCloned.forEach((item) => {
        item.meta._deepIndex[parentPosition] = insertPosition;
        item.answer = createEmptyAnswer(item);
      });
      this.answerGroup = _.concat(this.answerGroup, [fieldGroupCloned]);
      if (this.isCollapseAnswerGroup) {
        this.toggleCollapseAnswerGroup();
      }
    },
    async handleRemoveAnswerGroup(index) {
      const confirm = await this.$confirm(
        this.$t(`message['确认要删除已标注项目？']`),
        this.$t(`message['提示']`),
        {
          confirmButtonText: this.$t(`message['确定']`),
          cancelButtonText: this.$t(`message['取消']`),
          type: 'warning',
        },
      ).catch(() => {});
      if (confirm) {
        const { fileId, answerUpdatedName } = this;
        const answerGroupRemoved = this.answerGroup[index];
        const parentPosition = answerGroupRemoved[0].meta._deepIndex.length - 1;
        const answerGroupAfterRemoved = this.answerGroup.slice(
          index + 1,
          this.answerGroup.length,
        );

        const answerObsoleted = [];
        const answerUpdated = [];
        const currentAnswerGroupAfterRemoved = answerGroupAfterRemoved.map(
          (group) => {
            const newGroup = [];
            group.forEach((item) => {
              if (item.meta) {
                item.meta._deepIndex[parentPosition] =
                  item.meta._deepIndex[parentPosition] - 1;
              }
              if (item.answer) {
                answerObsoleted.push({ key: item.answer.key, fid: fileId });
                const answer = {
                  ...item.answer,
                  key: JSON.stringify(mixDeepInfo(item.meta)),
                };
                newGroup.push({ ...item, answer });
                if (item.answer.data.length > 0) {
                  answerUpdated.push({
                    ...answer,
                    fid: fileId,
                    name: answerUpdatedName,
                  });
                }
              } else {
                newGroup.push({ ...item, answer: createEmptyAnswer(item) });
              }
            });
            return newGroup;
          },
        );
        const answerGroupUpdated = [].concat(
          this.answerGroup.slice(0, index),
          currentAnswerGroupAfterRemoved,
        );
        if (!_.isEmpty(answerGroupUpdated)) {
          this.answerGroup = answerGroupUpdated;
        } else {
          const newAnswerGroupRemoved = [];
          answerGroupRemoved.forEach((item) => {
            if (item.answer) {
              const answer = { ...item.answer, data: [] };
              newAnswerGroupRemoved.push({ ...item, answer });
            } else {
              newAnswerGroupRemoved.push({
                ...item,
                answer: createEmptyAnswer(item),
              });
            }
          });
          this.answerGroup = [newAnswerGroupRemoved];
        }
        const answerRemoved = [];
        answerGroupRemoved.forEach((item) => {
          if (item.answer) {
            answerRemoved.push({ key: item.answer.key, fid: fileId });
          }
        });

        EventBus.$emit('answer-item-removed', {
          docType: this.answerDocType,
          answers: answerRemoved.concat(answerObsoleted),
        });
        EventBus.$emit('answer-item-updated', {
          docType: this.answerDocType,
          answers: answerUpdated,
        });
      }
    },
    updateParentAnswerGroup() {
      if (this.$parent.answerGroup) {
        const newAnswerGroup = this.$parent.answerGroup.map((group) => {
          return group.map((node) => {
            const currentAnswer = node.answer
              ? cloneModelAnswer(node)
              : createEmptyAnswer(node);
            if (currentAnswer.key === this.answer.key) {
              return { ...node, answer: this.answer };
            }
            return node;
          });
        });
        this.$parent.answerGroup = newAnswerGroup;
      }
    },
    updateAnswerItem() {
      EventBus.$emit('answer-item-updated', {
        docType: this.answerDocType,
        answers: [
          { ...this.answer, fid: this.fileId, name: this.answerUpdatedName },
        ],
      });
    },
    removeAnswerItem() {
      EventBus.$emit('answer-item-removed', {
        docType: this.answerDocType,
        answers: [{ key: this.answer.key, fid: this.fileId }],
      });
    },
    createAnswerItem({ schemaNode, boxes, nodeSelected }) {
      if (
        schemaNode === this.answer.key &&
        nodeSelected.docType === this.answerDocType
      ) {
        const text = boxes.map((box) => box.text).join('');
        this.answer.data.push({ boxes, text, handleType: 'wireframe' });
        this.updateParentAnswerGroup();
        this.updateAnswerItem();
      }
    },
    editAnswer({ index, text }) {
      this.answer.data[index].text = text;
      this.updateParentAnswerGroup();
      this.updateAnswerItem();
    },
    removeAnswer({ index }) {
      this.answer.data.splice(index, 1);
      this.updateParentAnswerGroup();

      if (this.answer.data.length === 0) {
        this.removeAnswerItem();
      } else {
        this.updateAnswerItem();
      }
      EventBus.$emit('remove-all-frames');
    },
    reset() {
      this.isSelected = false;
      EventBus.$emit('reset-node-selected');
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-answer-item {
  .answer-header {
    padding: 7px 0;
    background: #f8fafc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 0;
    &.is-sticky {
      position: sticky;
      top: 0;
      right: 0;
      z-index: 1;
    }
    &.is-selected {
      &::after {
        content: '';
        z-index: -1;
        position: absolute;
        left: -20px;
        height: 80%;
        width: calc(100% + 40px);
        background-color: $--color-primary-hover;
      }
    }
    .label {
      cursor: pointer;
      color: $--color-primary;
    }
    .add-icon,
    .collapse-icon {
      color: $--color-primary;
    }
    .collapse-icon {
      font-size: 18px;
    }
  }
  .answer-group {
    .answer-group {
      max-height: unset;
    }
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
    .group-item {
      display: flex;
      flex-direction: row;
      position: relative;
    }
    .group-index {
      padding: 7px 6px 7px 0;
      color: $--color-primary;
    }
    .group-content {
      flex: 1;
      .answer-header {
        position: relative;
        &.is-selected {
          &::after {
            left: 0;
            width: 100%;
          }
        }
      }
    }
    .delete-icon {
      position: absolute;
      right: 0;
      padding: 7px 6px 7px 0;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      font-size: 18px;
      color: #7d8598;
    }
  }
}
</style>
