<template>
  <div :class="['schema-tree-list', { 'schema-tree-draggable': draggable }]">
    <ul>
      <tree-item
        :depth="0"
        :model="data"
        :draggable="draggable"
        :is-only-opened-root="isOnlyOpenedRoot">
        <template slot-scope="{ node }">
          <slot :node="node"></slot>
        </template>
        <template slot="empty">
          <slot name="empty"></slot>
        </template>
      </tree-item>
    </ul>
  </div>
</template>

<script>
import TreeItem from './TreeItem.vue';
import './TreeList.scss';

export default {
  components: {
    TreeItem,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    isOnlyOpenedRoot: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
