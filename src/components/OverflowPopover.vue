<template>
  <el-popover
    trigger="hover"
    :content="content"
    :placement="placement"
    :disabled="disabledPopover"
    popper-class="overflow-content-popover">
    <div
      v-if="!isButton"
      slot="reference"
      ref="overflowContentRef"
      class="overflow-content"
      :style="{ '-webkit-line-clamp': overflowLines }">
      {{ content }}
    </div>
    <el-button
      v-else
      slot="reference"
      :type="buttonType"
      @click.stop="handleClick"
      class="overflow-content-button">
      <span
        ref="overflowContentRef"
        class="overflow-content"
        :style="{ '-webkit-line-clamp': overflowLines }">
        {{ content }}
      </span>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
    lines: {
      type: Number,
      default: 2,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    isButton: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String,
      default: 'text',
    },
  },
  data() {
    return {
      isShowPopover: false,
    };
  },
  watch: {
    content() {
      this.checkOverflow();
    },
  },
  mounted() {
    this.checkOverflow();
  },
  computed: {
    disabledPopover() {
      if (this.$features.showOverflowPopover()) {
        return !this.isShowPopover;
      }
      return true;
    },
    overflowLines() {
      if (this.$features.showOverflowPopover()) {
        return this.lines;
      }
      return 'unset';
    },
  },
  methods: {
    checkOverflow() {
      this.$nextTick(() => {
        const el = this.$refs.overflowContentRef;
        this.isShowPopover = el.scrollHeight > el.clientHeight;
      });
    },
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.overflow-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.overflow-content-button {
  white-space: normal;
  line-height: 1.2;
}
</style>

<style lang="scss">
.overflow-content-popover {
  max-width: 360px;
}
</style>
