<template>
  <li v-if="showEmptyNode && isOpened" ref="emptyNode" :data-depth="depth + 1">
    <div class="tree-node-wrapper">
      <div class="node">
        <span class="node-icon"></span>
        <div class="node-label">
          <slot name="empty"></slot>
        </div>
      </div>
    </div>
  </li>
  <li
    v-else
    :data-depth="depth"
    :data-index="model.meta._index"
    :class="[
      (model.children && model.children.length) > 0 ? 'has-children' : '',
    ]">
    <div
      :data-depth="depth"
      :class="[
        'tree-node-wrapper',
        model.children && model.children.length > 0 ? 'has-children' : '',
        isOpened ? 'is-opened' : '',
      ]">
      <div class="node" :data-depth="depth" @click="toggleOpen">
        <div
          class="draggable-wrapper"
          :draggable="depth !== 0 && draggable ? 'true' : 'false'">
          <span class="node-icon">
            <i
              v-if="model.children && model.children.length > 0 && isOpened"
              class="fa fa-minus-square"></i>
            <i
              v-else-if="model.children && model.children.length > 0"
              class="fa fa-plus-square"></i>
          </span>
          <div class="node-label">
            <slot :node="model"></slot>
          </div>
        </div>
      </div>
      <el-collapse-transition>
        <ul
          v-if="model.children && model.children.length > 0"
          class="node-children"
          v-show="isOpened">
          <draggable
            class="node-draggable"
            :disabled="!draggable"
            :list="nodeList"
            @start="handleDragStart"
            @change="handleDragChange">
            <tree-item
              v-for="(itm, inx) in nodeList"
              :key="inx"
              :depth="depth + 1"
              :model="itm"
              :draggable="draggable"
              :is-only-opened-root="isOnlyOpenedRoot">
              <template slot-scope="{ node }">
                <slot :node="node"></slot>
              </template>
              <template slot="empty">
                <slot name="empty"></slot>
              </template>
            </tree-item>
          </draggable>
        </ul>
      </el-collapse-transition>
    </div>
  </li>
</template>

<script>
import Draggable from 'vuedraggable';
import { EventBus, getDomOffset } from '../../utils';

export default {
  name: 'TreeItem',
  components: { Draggable },
  props: {
    model: {
      type: Object,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    isOnlyOpenedRoot: {
      type: Boolean,
      default: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isOpened: false, // 是否展开子节点
      nodeList: [],
    };
  },
  created() {
    // 使用 children 的浅拷贝，避免直接修改来自 Vuex 的引用
    this.nodeList =
      this.model && this.model.children ? this.model.children.slice() : [];
    this.isOpened = this.isOnlyOpenedRoot
      ? this.depth === 0
      : this.model.children
        ? this.model.children.length <= 15 // 当子节点数量超过15后，渲染schema树会出现卡顿现象，故将子节点数量>15的父节点默认收起，可手动展开
        : true;
  },
  computed: {
    showEmptyNode() {
      return !this.model || this.model.meta._isHide;
    },
  },
  watch: {
    showEmptyNode: {
      handler(newVal) {
        if (newVal && this.$parent.$parent.isOpened) {
          if (!this.$slots.empty) {
            return null;
          }
          this.$nextTick(() => {
            const offset = getDomOffset(this.$el);
            EventBus.$emit('empty-node-added', offset);
          });
        }
      },
      immediate: true,
    },
    'model.children': {
      handler(newVal) {
        this.nodeList = newVal ? newVal.slice() : [];
      },
      immediate: true,
    },
  },
  methods: {
    toggleAllChildNodes(isOpen) {
      const setIsOpened = (children) => {
        children.forEach(($child) => {
          $child.$children.forEach(($el) => {
            if ($el.model) {
              $el.isOpened = isOpen;
              if ($el.$children && $el.$children.length) {
                setIsOpened($el.$children);
              }
            }
          });
        });
      };
      setIsOpened(this.$children);
    },
    closeAllChildNodes() {
      this.toggleAllChildNodes(false);
    },
    openAllChildNodes() {
      this.toggleAllChildNodes(true);
    },
    toggleOpen() {
      this.isOpened = !this.isOpened;
      if (!this.isOpened && this.isOnlyOpenedRoot) {
        this.closeAllChildNodes();
      }
      if (this.isOpened && !this.isOnlyOpenedRoot) {
        this.openAllChildNodes();
      }
    },
    handleDragStart() {
      this.closeAllChildNodes();
    },
    handleDragChange(value) {
      EventBus.$emit('move-node', {
        dataIndex: value.moved.element.meta._index,
        oldIndex: value.moved.oldIndex,
        index: value.moved.newIndex,
      });
    },
  },
};
</script>
