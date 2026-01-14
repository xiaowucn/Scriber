<template>
  <div
    class="value"
    :class="[
      isCurrentCellValueSelected ? 'active' : '',
      cellData.manual ? 'manual' : '',
    ]"
    @click="cellValueSelected(cellKey, cellKeyPath)">
    <template>
      <div
        v-if="editMode !== 'popover' && isEditing && isCurrentCellValueSelected"
        class="edit-input">
        <el-input
          v-model="editingText"
          size="mini"
          ref="editInput"
          @click.stop.native
          @keyup.enter.native="saveEditingAnswer"></el-input>
        <el-button size="mini" @click.stop="isEditing = false">取消</el-button>
        <el-button type="primary" size="mini" @click.stop="saveEditingAnswer">
          确定
        </el-button>
      </div>
      <span v-else>
        {{ cellDataText }}
        <el-tooltip
          v-if="shouldShowWarningTips(cellData.meta)"
          effect="dark"
          :content="cellData.meta.tips"
          placement="top">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </span>
    </template>
    <span class="operate-btns">
      <el-popover
        v-model="showEditPopover"
        :disabled="editMode !== 'popover'"
        placement="top"
        width="200"
        popper-class="data-sheet-cell-edit-popover"
        trigger="manual">
        <el-input
          v-model="editingText"
          ref="editInput"
          type="textarea"
          autosize
          size="mini"
          :autofocus="true"
          @keyup.enter.native="saveEditingAnswer"></el-input>
        <div class="btns">
          <el-button size="mini" @click.stop="showEditPopover = false"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click.stop="saveEditingAnswer">
            确定
          </el-button>
        </div>
        <i
          slot="reference"
          class="el-icon-edit"
          title="编辑"
          @click.stop="editAnswerText(cellKeyPath)"></i>
      </el-popover>
      <i
        class="el-icon-delete"
        title="删除"
        @click.stop="clearAnswerText(cellKeyPath)"></i>
    </span>
  </div>
</template>

<script>
import _ from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'data-sheet-value-cell',
  props: {
    cellKey: {
      type: String,
      required: true,
    },
    cellData: {
      type: [Object, Array],
      required: true,
    },
    cellKeyPath: {
      type: Array,
      required: true,
    },
    selectedCellKeyPath: {
      type: Array,
      required: true,
    },
    editMode: {
      type: String,
      required: false,
      default: 'cell-inline',
    },
  },
  data() {
    return {
      isEditing: false,
      editingText: '',
      showEditPopover: false,
    };
  },
  computed: {
    isCurrentCellValueSelected() {
      return _.isEqual(this.cellKeyPath, this.selectedCellKeyPath);
    },
    cellDataText() {
      return (
        this.cellData.text ||
        this.cellData?.data?.[0]?.boxes.map((box) => box.text).join('')
      );
    },
  },
  methods: {
    getAnswerItem(path) {
      return _.get(this.$parent.answer, path, {}) || {};
    },
    cellValueSelected(key, path) {
      this.isEditing = false;
      this.$emit('answer-item-selected', { key, path });
      EventBus.$emit('schema-node-selected', {
        model: {
          data: {
            label: key,
          },
          meta: {
            _deepIndex: [0],
            _deepLabels: [key],
          },
          children: [],
        },
      });
    },
    editAnswerText(path) {
      this.showEditPopover = true;
      this.cellValueSelected(this.cellKey, path);
      const text = this.cellDataText;
      this.$emit('edit-answer-text', { path, text });
      this.isEditing = true;
      this.editingText = text;
      this.$nextTick(() => {
        this.$refs.editInput.focus();
      });
    },
    saveEditingAnswer() {
      const editedAnswer = {
        ...this.cellData,
        data: [{ boxes: [] }],
        text: this.editingText,
        manual: true,
      };
      this.$emit('save-editing-answer', {
        editedAnswer,
        path: this.cellKeyPath,
      });
      this.isEditing = false;
      this.editingText = '';
      this.showEditPopover = false;
    },
    clearAnswerText(path) {
      this.$emit('clear-answer-text', { path });
    },
    shouldShowWarningTips(meta) {
      return meta && meta.tips;
    },
  },
};
</script>

<style lang="scss" scoped>
.value {
  &.active {
    background: #e1efff;
  }
  &.manual {
    color: #409eff;
  }
  .el-icon-warning {
    color: #ffa600;
  }
  .edit-input {
    display: flex;
    align-items: center;
    width: calc(100% - 50px);
    padding: 0 5px;
    .el-input {
      ::v-deep .el-input__inner {
        height: 24px;
        padding: 0 5px;
      }
    }
    .el-button {
      height: 22px;
      margin-left: 5px;
      padding: 4px 5px;
      &.el-button--primary {
        border: none;
      }
    }
  }
  > span {
    word-break: break-word;
  }
  .operate-btns {
    visibility: hidden;
    i {
      margin: 0 1px;
      cursor: pointer;
    }
  }
  &:hover {
    .operate-btns {
      visibility: visible;
      i {
        &.el-icon-edit {
          &:hover {
            color: #409eff;
          }
        }
        &.el-icon-delete {
          &:hover {
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.data-sheet-cell-edit-popover {
  .el-textarea {
    margin-bottom: 10px;
  }
  .btns {
    display: flex;
    justify-content: center;
    .el-button--mini {
      padding: 4px 8px;
    }
  }
}
</style>
