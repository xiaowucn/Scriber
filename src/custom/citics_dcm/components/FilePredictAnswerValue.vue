<template>
  <td
    class="file-predict-answer-value value"
    :class="{ 'edit-value': !isEditModel }">
    <div class="text">
      <div
        class="answer"
        v-if="!isEditModel"
        @click.stop="intoEditModel(answerValue || answerItem.value)">
        <span ref="userAnswer">{{ answerValue || answerItem.value }}</span>
      </div>
      <div v-else>
        <el-input
          type="textarea"
          size="mini"
          ref="answerInput"
          v-model="editAnswerValue" />
        <div class="btns">
          <el-button size="mini" @click="handleClose"> 取消 </el-button>
          <el-button type="primary" size="mini" @click="handleSave">
            确定
          </el-button>
        </div>
      </div>
    </div>
  </td>
</template>

<script>
import _ from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'filePredictAnswerValue',
  props: {
    answerItem: {
      type: Object,
      required: true,
    },
    detail: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      answerValue: '',
      editAnswerValue: '',
      isEditModel: false,
    };
  },
  watch: {
    answerItem: {
      handler() {
        this.resetAnswerValue();
        this.closeEditModel();
      },
      immediate: true,
    },
  },
  created() {
    EventBus.$on('close-all-answer-editor', this.closeEditModel);
  },
  beforeDestroy() {
    EventBus.$off('close-all-answer-editor', this.closeEditModel);
  },
  methods: {
    openEditModel() {
      this.setEditModel(true);
      const answerTextHeight = this.$refs.userAnswer.clientHeight + 'px';
      this.$nextTick(() => {
        this.$refs.answerInput.focus();
        this.$refs.answerInput.$el.children[0].style.height = answerTextHeight;
      });
    },
    closeEditModel() {
      this.setEditModel(false);
    },
    setEditModel(isEditModel) {
      this.isEditModel = isEditModel;
    },
    intoEditModel(value) {
      EventBus.$emit('close-all-answer-editor');
      this.editAnswerValue = value;
      this.openEditModel();
      this.answerItemClick();
    },
    emitSave(value) {
      this.$emit('save', this.answerItem.label, value);
    },
    handleClose() {
      this.closeEditModel();
    },
    handleSave() {
      if (!this.editAnswerValue) {
        this.closeEditModel();
        return;
      }
      if (this.editAnswerValue !== this.answerItem.value) {
        this.answerValue = this.editAnswerValue;
      } else {
        this.answerValue = this.answerItem.value;
      }
      this.emitSave(this.answerValue);
      this.closeEditModel();
    },
    resetAnswerValue() {
      this.answerValue = '';
      this.editAnswerValue = '';
    },
    answerItemClick() {
      const isCanClickAnswerItem = !_.isEmpty(this.answerItem.data);
      if (isCanClickAnswerItem) {
        EventBus.$emit('answer-item-selected', {
          index: 0,
          schemaNode: this.answerItem.key,
          schema: this.answerItem.schema,
          data: this.answerItem.data[0],
          detail: this.detail,
          target: this,
        });
      } else {
        EventBus.$emit('remove-all-frames');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-predict-answer-value {
  &.value {
    padding: 5px 3px;
    .text {
      padding: 3px 4px;
      width: calc(100% - 4px * 2);
      height: calc(100% - 3px * 2);
      border-radius: 2px;
      background-color: #f2f2f2;
    }
    .answer {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    ::v-deep .el-textarea__inner {
      padding: 0;
      border: none;
      resize: none;
    }
    .btns {
      margin-top: 3px;
      display: flex;
      .el-button {
        padding: 3px 8px;
        font-size: 10px;
        font-weight: normal;
        + .el-button {
          margin-left: 5px;
        }
      }
    }
  }
  &.edit-value {
    &:hover {
      background-color: #f2f2f2;
      .text {
        background-color: #fcfcfc;
      }
    }
  }
}
</style>
