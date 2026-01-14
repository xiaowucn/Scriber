<template>
  <div class="annotation-tags">
    <span v-for="tag in tags" :key="tag" :style="tagStyle">
      {{ tag }}<template v-if="showIndex">({{ index }})</template>
    </span>
  </div>
</template>
<script>
export default {
  name: 'annotation-tag',
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    tagStyle: {
      type: Object,
      default: () => ({}),
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: null,
    },
  },
};
</script>
<style scoped lang="scss">
.annotation-tags {
  background-color: #000;
  span {
    display: block;
    padding: 2px 4px;
    background-color: inherit;
    text-align: center;
    font-size: 12px;
    color: #fff;

    &:not(:last-of-type) {
      border-bottom: 1px solid #fff;
    }
  }
}
</style>
