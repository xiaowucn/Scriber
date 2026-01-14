<template>
  <div
    class="editable-textarea-wrapper"
    @mouseenter="showIcon = !readonly && !editing"
    @mouseleave="showIcon = false">
    <div
      v-if="defaultDiv && !editing"
      @dblclick="handleEditing"
      class="output-text">
      {{ internalValue }}
    </div>
    <el-input
      v-else
      :ref="refName"
      type="textarea"
      v-model="internalValue"
      :readonly="readonly || !editing"
      :class="{
        'modified-field': isModified,
        'editing-field': editing,
      }"
      :placeholder="placeholder"
      style="width: 100%"
      @dblclick.native="handleEditing"
      @blur="handleBlur">
    </el-input>
    <theme-icon
      v-show="showIcon"
      name="edit-law"
      class="hover-icon"
      :class="{ 'input-icon': !defaultDiv }"
      @click.native="handleEditing"></theme-icon>
  </div>
</template>

<script>
export default {
  name: 'EditableTextarea',
  props: {
    value: {
      type: String,
      default: '',
    },
    defaultDiv: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isModified: {
      type: Boolean,
      default: false,
    },
    refName: {
      type: String,
      default: 'editableTextarea',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editing: false,
      originalEditValue: '',
      showIcon: false,
      isEditing: false,
    };
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  created() {
    if (this.readonly) {
      this.showIcon = false;
    }
  },
  methods: {
    handleEditing(event) {
      event.preventDefault();

      if (this.readonly || this.disabled) {
        return;
      }
      this.originalEditValue = this.value;
      this.editing = true;
      this.$nextTick(() => {
        if (this.$refs[this.refName]) {
          const textareaEl =
            this.$refs[this.refName].$el.querySelector('textarea');
          if (textareaEl) {
            textareaEl.focus();
            textareaEl.setSelectionRange(
              textareaEl.value.length,
              textareaEl.value.length,
            );
          }
        }
      });
    },

    handleBlur() {
      if (this.editing) {
        this.editing = false;
        this.$emit('blur');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editable-textarea-wrapper {
  position: relative;
  width: 100%;

  .hover-icon {
    position: absolute;
    bottom: 0px;
    right: 0px;
    cursor: pointer;
    &.input-icon {
      bottom: 4px;
      right: 8px;
    }
  }
}

.modified-field {
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    border-color: #f56c6c !important;
  }
}

.editing-field {
  ::v-deep .el-textarea__inner {
    border-color: #409eff !important;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
  }
}

.output-text {
  min-height: 54px;
  padding-bottom: 14px;
}
</style>
