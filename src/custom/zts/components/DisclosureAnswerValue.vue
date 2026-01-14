<template>
  <div class="answer-value-wrapper" @click.stop="handleClickAnswerValue">
    <div
      class="answer-value-box"
      :class="{
        'is-edit': isEditModel,
        'is-selected': isSelected,
        'is-extract-failed': isExtractFailed,
      }">
      <div v-if="!isEditModel" ref="answerValue" class="answer-value">
        <span class="answer-text">
          {{ !isExtractFailed ? answerValue || answerText : '未提取' }}
        </span>
      </div>
      <div v-else class="edit-value">
        <el-input
          size="mini"
          type="textarea"
          ref="answerInput"
          v-model="editAnswerValue" />
        <div class="btns">
          <el-button size="mini" @click.stop="handleClose">取消</el-button>
          <el-button size="mini" type="primary" @click.stop="handleSave">
            确定
          </el-button>
        </div>
      </div>
    </div>
    <i
      v-if="!isEditModel"
      @click.stop="intoEditModel(answerValue || answerText)"
      class="far fa-edit fa-fw edit-icon">
    </i>
    <i
      v-if="!isExtractFailed"
      class="far fa-trash-alt delete-icon"
      @click.stop="handleDelete"></i>
  </div>
</template>

<script>
import _ from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'disclosure-answer-value',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    answerData: {
      type: Object,
      default: () => {},
    },
    answerKey: {
      type: String,
      default: '',
    },
    answerSchema: {
      type: Object,
      default: () => {},
    },
    answerDocType: {
      type: String,
      default: '',
    },
    answerLabel: {
      type: String,
      default: '',
    },
    isExtractFailed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEditModel: false,
      isSelected: false,
      answerValue: '',
      editAnswerValue: '',
    };
  },
  watch: {
    answerData: {
      handler() {
        this.reset();
      },
      immediate: true,
    },
  },
  created() {
    EventBus.$on('close-all-answer-editor', this.closeEditModel);
    EventBus.$on('close-all-answer-value-select', this.closeAnswerValueSelect);
  },
  beforeDestroy() {
    EventBus.$off('close-all-answer-editor', this.closeEditModel);
    EventBus.$off('close-all-answer-value-select', this.closeAnswerValueSelect);
  },
  computed: {
    answerText() {
      if (!_.isEmpty(this.answerData)) {
        return (
          this.answerData.text ||
          this.answerData.boxes.map((box) => box.text).join('')
        );
      } else {
        return '';
      }
    },
  },
  methods: {
    setEditModel(isEditModel) {
      this.isEditModel = isEditModel;
    },
    openEditModel() {
      this.setEditModel(true);
      const answerTextHeight = this.$refs.answerValue.clientHeight + 'px';
      this.$nextTick(() => {
        this.$refs.answerInput.focus();
        this.$refs.answerInput.$el.children[0].style.height = answerTextHeight;
      });
    },
    closeEditModel() {
      this.setEditModel(false);
    },
    intoEditModel(value) {
      EventBus.$emit('close-all-answer-editor');
      if (this.isExtractFailed) {
        this.$emit('answer-item-click');
        EventBus.$emit('close-all-answer-value-select');
        this.$notify({
          title: '提示',
          message: '请先对该字段进行标注',
          type: 'warning',
        });
        return;
      }
      this.editAnswerValue = value;
      this.openEditModel();
    },
    handleClose() {
      this.closeEditModel();
    },
    handleSave() {
      if (!this.editAnswerValue) {
        this.closeEditModel();
        return;
      }
      this.answerValue = this.editAnswerValue;
      this.$emit('edit-answer', { index: this.index, text: this.answerValue });
      this.closeEditModel();
    },
    closeAnswerValueSelect() {
      this.isSelected = false;
    },
    handleClickAnswerValue() {
      this.$emit('answer-item-click');
      EventBus.$emit('close-all-answer-value-select');
      if (this.isExtractFailed) {
        this.$notify({
          title: '提示',
          message: '请先对该字段进行标注',
          type: 'warning',
        });
        return;
      }
      this.isSelected = true;
      const selectedAnswerItem = {
        data: this.answerData,
        schemaNode: this.answerKey,
        schema: this.answerSchema,
        docType: this.answerDocType,
        schemaLabel: this.answerLabel,
      };
      this.$nextTick(() => {
        EventBus.$emit('pdf-viewer-answer-item-selected', selectedAnswerItem);
      });
    },
    async handleDelete() {
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
        this.$emit('remove-answer', { index: this.index });
      }
    },
    reset() {
      this.answerValue = '';
      this.editAnswerValue = '';
      this.isSelected = false;
      this.isEditModel = false;
    },
  },
};
</script>

<style scoped lang="scss">
.answer-value-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  + .answer-value-wrapper {
    margin-top: 10px;
  }
  .answer-value-box {
    width: 100%;
    padding: 6px 10px;
    border-radius: 2px;
    border: 1px solid $--color-primary;
    &.is-edit {
      width: 100%;
    }
    &.is-selected {
      background-color: $--color-primary-hover;
    }
    &.is-extract-failed {
      border-color: #ff3030;
      .answer-value {
        color: #ff3030;
      }
    }
  }
  .answer-value {
    height: auto;
    min-height: 20px;
    .answer-text {
      word-wrap: break-word;
      white-space: pre-line;
    }
  }
  .edit-value {
    ::v-deep textarea {
      padding: 0;
      border: none;
      resize: none;
      background: transparent;
      font-size: 14px;
    }
    .btns {
      padding-top: 6px;
      ::v-deep .el-button {
        padding: 3px 8px;
        font-weight: 400;
      }
    }
  }
  .edit-icon,
  .delete-icon {
    cursor: pointer;
    margin-left: 8px;
    font-size: 16px;
  }
  .edit-icon {
    color: $--color-primary;
  }
  .delete-icon {
    color: #7d8598;
  }
}
</style>
