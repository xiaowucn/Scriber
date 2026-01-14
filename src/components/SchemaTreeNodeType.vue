<template>
  <span>
    <template v-if="current">
      <el-tag
        v-if="current.type === 'enum'"
        type="info"
        size="mini"
        :disable-transitions="true"
        :title="enumTypeLabel">
        {{ enumTypeLabel }}
      </el-tag>
      <el-tag
        v-else-if="current.type === 'basic'"
        size="mini"
        :disable-transitions="true">
        {{ current.label }}
      </el-tag>
      <el-tag v-else size="mini" type="success" :disable-transitions="true">
        {{ groupTypeLabel }}
      </el-tag>
    </template>
    <template v-else-if="type">
      <el-tag size="mini" type="success" :disable-transitions="true">
        {{ type }}
      </el-tag>
    </template>
  </span>
</template>

<script>
import { getSchemaType } from '../utils';

export default {
  name: 'schema-tree-node-type',
  props: {
    type: {
      type: String,
      required: true,
    },
    showGroupType: {
      type: Boolean,
      default: false,
    },
    types: {
      type: Array,
      required: true,
    },
  },
  computed: {
    current() {
      return getSchemaType(this.types, this.type);
    },
    enumTypeLabel() {
      return `枚举类型：${this.current.label}（${this.current.values
        .map((v) => v.name)
        .join(', ')}）`;
    },
    groupTypeLabel() {
      if (this.showGroupType && this.current && this.current.type === 'group') {
        return `组合`;
      }
      return this.current.label;
    },
  },
};
</script>
