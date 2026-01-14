<template>
  <el-tooltip
    :disabled="!showTooltip"
    :placement="placement"
    :enterable="enterable"
    popper-class="tooltip-over-popper">
    <div
      slot="content"
      ref="tooltipWrapper"
      class="tooltip-content-wrapper"
      :class="{ 'overflow-auto': isOverflowing }"
      :style="{ maxHeight: maxContentHeight + 'px' }">
      <div class="tooltip-text">{{ actualTooltipContent }}</div>
    </div>
    <div
      class="tooltip-content"
      ref="container"
      :style="{ justifyContent: justifyContent }">
      <slot name="before"></slot>
      <p
        ref="parent"
        :class="contentClass"
        :style="[
          parentStyle,
          isMultiLineMode ? { '-webkit-line-clamp': maxLines } : {},
        ]"
        @mouseover="onMouseOver">
        <span ref="content">
          {{ showSuffixEllipsis ? `${content}${suffix}` : content }}
        </span>
      </p>
      <slot></slot>
      <span
        v-if="(showSuffixEllipsis && isContentEllipsis) || !showSuffixEllipsis">
        {{ suffix }}
      </span>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'tooltipOver',
  props: {
    /**
     * 主要显示内容
     * @type {String}
     * @default ''
     */
    content: {
      type: String,
      default: '',
    },
    /**
     * 后缀内容，显示在主内容后面
     * @type {String}
     * @default ''
     */
    suffix: {
      type: String,
      default: '',
    },
    /**
     * 容器宽度（像素）
     * 未传入时会自动读取父DOM宽度，注意父元素不能有padding样式
     * @type {Number}
     * @default 0
     */
    width: {
      type: Number,
      default: 0,
    },
    /**
     * 容器最大宽度（像素）
     * @type {Number}
     * @default 0
     */
    maxWidth: {
      type: Number,
      default: 0,
    },
    /**
     * tooltip显示位置
     * 可选值：'top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'
     * @type {String}
     * @default 'top'
     */
    placement: {
      type: String,
      default: 'top',
    },
    /**
     * 内容对齐方式
     * 可选值：'normal', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
     * @type {String}
     * @default 'normal'
     */
    justifyContent: {
      type: String,
      default: 'normal',
    },
    /**
     * 鼠标是否可进入tooltip
     * @type {Boolean}
     * @default true
     */
    enterable: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否在内容溢出隐藏时，将suffix内容显示在省略号前面
     * true: 内容溢出时显示 "内容...suffix"
     * false: 内容溢出时显示 "内容..." 然后在外部显示suffix
     * @type {Boolean}
     * @default false
     */
    showSuffixEllipsis: {
      type: Boolean,
      default: false,
    },
    /**
     * 最大显示行数限制
     * 1: 单行模式，超出显示省略号
     * >1: 多行模式，超出指定行数显示省略号
     * @type {Number}
     * @default 1
     */
    maxLines: {
      type: Number,
      default: 1,
    },
    /**
     * 自定义tooltip显示内容
     * 为空时使用原content内容，不为空时优先显示此内容
     * @type {String}
     * @default ''
     */
    tooltipContent: {
      type: String,
      default: '',
    },
    /**
     * 是否始终显示tooltip
     * true: 无论内容是否溢出都显示tooltip
     * false: 只有内容溢出时才显示tooltip
     * @type {Boolean}
     * @default false
     */
    alwaysShowTooltip: {
      type: Boolean,
      default: false,
    },
    /**
     * tooltip 内容最大高度（像素）
     * 超过该高度时开启纵向滚动
     * @type {Number}
     * @default 400
     */
    maxContentHeight: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      isShowTooltip: false,
      containerWidth: 0,
      contentWidth: 0,
      isContentEllipsis: false,
      // tooltip 内容是否需要滚动
      isOverflowing: false,
    };
  },
  computed: {
    showTooltip() {
      return this.alwaysShowTooltip || this.isShowTooltip;
    },
    parentStyle() {
      const style = {};
      if (this.width) {
        style.width = `${this.width}px`;
      }
      if (this.maxWidth) {
        style.maxWidth = `${this.maxWidth}px`;
      }
      return style;
    },
    // 判断是否为多行模式
    isMultiLineMode() {
      return this.maxLines > 1;
    },
    // 获取实际的tooltip显示内容
    actualTooltipContent() {
      if (this.tooltipContent) {
        return this.tooltipContent;
      }
      return this.showSuffixEllipsis
        ? `${this.content}${this.suffix}`
        : this.content;
    },
    // 根据模式返回对应的CSS类名
    contentClass() {
      return this.isMultiLineMode ? 'multi-line-overflow' : 'over-flow';
    },
  },
  async mounted() {
    // 等待获取 ContentWidth
    await this.$nextTick();
    this.getContainerWidth();
    this.getContentWidth();
    this.updateEllipsisStatus();
    // 初始时计算一次 tooltip 内容是否需要滚动
    this.updateTooltipOverflow();
  },
  methods: {
    updateTooltipOverflow() {
      // 动态创建隐藏测量容器，计算真实内容高度后立即移除
      const tempWrapper = document.createElement('div');
      tempWrapper.className = 'tooltip-content-wrapper-temp';
      // 放到可布局但不可见的位置
      Object.assign(tempWrapper.style, {
        maxHeight: `${this.maxContentHeight}px`,
      });

      const tempText = document.createElement('div');
      tempText.className = 'tooltip-text';
      tempText.textContent = this.actualTooltipContent;
      tempWrapper.appendChild(tempText);

      document.body.appendChild(tempWrapper);
      try {
        this.isOverflowing = tempWrapper.scrollHeight > this.maxContentHeight;
      } finally {
        // 计算完成立即删除临时节点
        document.body.removeChild(tempWrapper);
      }
    },
    updateEllipsisStatus() {
      if (this.contentWidth > this.containerWidth) {
        this.isContentEllipsis = true;
      } else {
        this.isContentEllipsis = false;
      }
      this.$emit('is-ellipsis', this.isContentEllipsis);
    },
    getContainerWidth() {
      if (this.width) {
        this.containerWidth = this.width;
      } else {
        const parentWidth = this.$refs.container.parentNode.offsetWidth;
        const parentChildrenNodes = this.$refs.container.parentNode.children;
        let otherChildrenWidth = 0;
        let slotDomWidth = 0;
        if (parentChildrenNodes.length > 1) {
          Array.from(parentChildrenNodes).forEach((node) => {
            if (node !== this.$refs.container) {
              const nodeWidth =
                node.offsetWidth + this.getNodeMarginWidth(node);
              otherChildrenWidth += nodeWidth;
            }
          });
        }

        if (Object.keys(this.$slots).length > 0) {
          Object.keys(this.$slots).forEach((key) => {
            if (this.$slots[key]) {
              const slotInstance = Array.isArray(this.$slots[key])
                ? this.$slots[key][0]
                : this.$slots[key];
              const slotNode = slotInstance.elm;
              if (slotNode) {
                slotDomWidth +=
                  slotNode.offsetWidth + this.getNodeMarginWidth(slotNode);
              }
            }
          });
        }

        const tipContainerMargin = this.getNodeMarginWidth(
          this.$refs.container,
        );
        this.containerWidth =
          parentWidth - otherChildrenWidth - slotDomWidth - tipContainerMargin;
      }
    },
    getNodeMarginWidth(node) {
      const style = window.getComputedStyle(node);
      const margin =
        parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      return margin;
    },
    getContentWidth() {
      this.contentWidth = this.$refs.content.offsetWidth;
    },
    onMouseOver() {
      this.getContainerWidth();
      this.getContentWidth();
      if (this.isMultiLineMode) {
        // 多行模式：比较 scrollHeight 和 offsetHeight
        const parentElement = this.$refs.parent;
        if (parentElement.scrollHeight > parentElement.offsetHeight) {
          this.isShowTooltip = true;
        } else {
          this.isShowTooltip = false;
        }
      } else {
        // 单行模式：继续使用原有逻辑
        if (this.contentWidth > this.containerWidth) {
          this.isShowTooltip = true;
        } else {
          this.isShowTooltip = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: fit-content;
  margin: 0;
}

.multi-line-overflow {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-width: fit-content;
  margin: 0;
  word-break: break-word;
  white-space: pre-line;
}

.tooltip-content {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
}

.tooltip-content-wrapper {
  max-width: 600px;
  // 默认不滚动，仅当内容超过最大高度时在运行时添加 overflow-auto 类
  overflow-y: hidden;
  overflow-x: hidden;
}

.overflow-auto {
  overflow-y: auto;
}

.tooltip-text {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
}
</style>
<style lang="scss">
.tooltip-content-wrapper-temp {
  position: absolute;
  visibility: hidden;
  left: -9999px;
  top: -9999px;
  overflow-x: hidden;
  overflow-y: hidden;
  width: 600px;
  .tooltip-text {
    margin: 0;
    padding: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.4;
    font-size: 12px;
  }
}
.el-tooltip__popper {
  max-width: 1000px;
}
.tooltip-over-popper {
  max-width: 600px;
}

.tooltip-over-popper .tooltip-content-wrapper.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.35) rgba(255, 255, 255, 0.08);
}

.tooltip-over-popper .tooltip-content-wrapper.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.tooltip-over-popper
  .tooltip-content-wrapper.overflow-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
}

.tooltip-over-popper
  .tooltip-content-wrapper.overflow-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.35);
  border-radius: 3px;
}

.tooltip-over-popper
  .tooltip-content-wrapper.overflow-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
