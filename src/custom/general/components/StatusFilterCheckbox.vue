<template>
  <div class="status-filter-checkbox">
    <span>{{ label }}</span>
    <el-checkbox-group v-model="internalValue" @change="handleChange">
      <el-checkbox
        v-for="option in options"
        :key="option.value"
        :label="option.value">
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'StatusFilterCheckbox',
  props: {
    label: {
      type: String,
      default: '启用状态：',
    },
    options: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(
          (item) =>
            item &&
            typeof item.label === 'string' &&
            typeof item.value === 'boolean',
        );
      },
    },
    value: {
      type: [Array, Boolean],
      default: undefined,
    },
  },
  data() {
    return {
      internalValue: this.getInitialValue(),
    };
  },
  methods: {
    getInitialValue() {
      return this.getValueFromProp(this.value);
    },

    getValueFromProp(propValue) {
      if (typeof propValue === 'boolean') {
        return [propValue];
      } else {
        return this.options.map((option) => option.value);
      }
    },

    handleChange(selectedValues) {
      if (
        selectedValues.length === this.options.length ||
        selectedValues.length === 0
      ) {
        this.$emit('input', null);
      } else {
        this.$emit('input', selectedValues[0]);
      }

      this.$emit('change');
    },
  },
};
</script>

<style lang="scss" scoped>
.status-filter-checkbox {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  font-size: 14px;
  color: #606266;
  span {
    margin-right: 8px;
    white-space: nowrap;
  }
  .el-checkbox {
    margin-right: 20px;
  }
}
</style>
