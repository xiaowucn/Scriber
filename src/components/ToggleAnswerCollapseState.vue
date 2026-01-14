<template>
  <el-tooltip
    placement="top"
    :content="allAnswerCollapsed ? '一键展开答案' : '一键收起答案'">
    <svg-font-icon
      v-if="$platform.isDefaultEnv()"
      name="expand"
      color="#606266"
      :size="12"
      :class="allAnswerCollapsed ? 'collapsed' : ''"
      @click.native="toggleAllAnswerCollapseState"></svg-font-icon>
    <i
      v-else
      class="fas"
      :class="
        allAnswerCollapsed ? 'fa-angle-double-down' : 'fa-angle-double-up'
      "
      @click="toggleAllAnswerCollapseState"></i
  ></el-tooltip>
</template>

<script>
export default {
  name: 'ToggleAnswerCollapseState',
  data() {
    return {
      allAnswerCollapsed: false,
    };
  },
  methods: {
    toggleAllAnswerCollapseState() {
      this.allAnswerCollapsed = !this.allAnswerCollapsed;
      this.$emit('toggle');
    },
  },
};
</script>

<style lang="scss" scoped>
.expand {
  margin-left: 15px;
}
.collapsed {
  transform: rotate(180deg);
}
</style>
