<template>
  <div
    class="svg-icon-container"
    :class="[name]"
    :style="containerStyles"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <el-tooltip
      v-if="title"
      :disabled="!isMouseEnter"
      :content="title"
      :placement="placement">
      <svg
        aria-hidden="true"
        :fill="color"
        :style="styles"
        class="svg-font-icon"
        :class="svgClasses">
        <use :href="symbolId" />
      </svg>
    </el-tooltip>
    <svg
      v-else
      aria-hidden="true"
      :fill="color"
      :style="styles"
      class="svg-font-icon"
      :class="svgClasses">
      <use :href="symbolId" />
    </svg>
  </div>
</template>

<script>
import { isNumber } from 'lodash-es';

export default {
  name: 'svg-font-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      required: false,
      default: 'medium',
    },
    color: {
      type: String,
      required: false,
      default: 'inherit',
    },
    hoverColor: {
      type: String,
      required: false,
      default: null,
    },
    opacity: {
      type: [String, Number],
      required: false,
      default: 1,
    },
    // 新增的 props（来自 front_calliper）
    title: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    display: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // SVG sprite 的 symbol ID
    symbolId() {
      return `#pd-icon-${this.name}`;
    },

    // SVG 元素的 CSS 类名
    svgClasses() {
      const classes = {};

      // 原有的尺寸类名逻辑（保持兼容性）
      if (!isNumber(this.size)) {
        const sizeClass = `svg-font-icon-${this.size}`;
        classes[sizeClass] = true;
      }

      // 新增的显示模式类名
      if (this.display) {
        classes['only-display'] = true;
      }

      return classes;
    },

    // 保持原有的 classes 计算属性（向前兼容）
    classes() {
      return this.svgClasses;
    },

    // 容器样式计算（用于设置CSS变量）
    containerStyles() {
      const styles = {};

      // 设置hover颜色CSS变量
      if (this.hoverColor) {
        styles['--hover-color'] = this.hoverColor;
      } else {
        styles['--hover-color'] = this.color;
      }

      return styles;
    },

    // 样式计算（整合两个组件的逻辑）
    styles() {
      const baseStyles = {
        color: this.color,
        fill: 'currentColor',
        stroke: 'currentColor',
        cursor: 'pointer',
      };

      // 处理尺寸（支持数字和字符串）
      if (isNumber(this.size)) {
        // 数字尺寸：直接设置 width 和 height
        let sizeValue = `${this.size}`;
        sizeValue = `${sizeValue.replace('px', '')}px`;
        baseStyles.width = sizeValue;
        baseStyles.height = sizeValue;
      }

      // 处理透明度
      if (this.disabled) {
        baseStyles.opacity = 0.5;
        baseStyles.cursor = 'not-allowed';
      } else {
        baseStyles.opacity = this.opacity;
      }

      return baseStyles;
    },
  },

  data() {
    return {
      isMouseEnter: false,
    };
  },

  methods: {
    handleClick(event) {
      if (this.disabled) {
        return;
      }
      if (this.stopPropagation) {
        event.stopPropagation();
      }
      this.$emit('click', event);
    },

    handleMouseEnter(event) {
      this.$emit('mouseenter', event);
      this.isMouseEnter = true;
    },

    handleMouseLeave(event) {
      this.$emit('mouseleave', event);
      this.isMouseEnter = false;
    },
  },
};
</script>

<style scoped lang="scss">
// 容器样式（来自 front_calliper）
.svg-icon-container {
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

// SVG 图标样式（整合两个组件的样式）
.svg-font-icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  transition:
    color 0.3s ease,
    fill 0.3s ease;

  // 原有的预设尺寸样式（保持兼容性）
  &.svg-font-icon-large {
    width: 16px;
    height: 16px;
  }

  &.svg-font-icon-medium {
    width: 14px;
    height: 14px;
  }

  &.svg-font-icon-small {
    width: 12px;
    height: 12px;
  }

  // 新增的样式（来自 front_calliper）
  &:focus {
    outline: none;
  }

  // 仅显示模式（不可点击）
  &.only-display {
    cursor: default;
  }
}

// 动态hover颜色支持
.svg-icon-container:hover .svg-font-icon {
  // hover颜色通过CSS变量动态设置
  color: var(--hover-color, inherit) !important;
  fill: var(--hover-color, currentColor) !important;
  stroke: var(--hover-color, currentColor) !important;
}
</style>
