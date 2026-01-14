<template>
  <div class="historical-rules">
    <div class="date-effectived">
      <span class="label">{{ rules.review.title }}</span>
    </div>
    <el-popover
      v-if="rules.history.length > 0"
      placement="bottom-end"
      width="450"
      trigger="click"
      :append-to-body="false">
      <el-timeline>
        <el-timeline-item
          v-for="(rule, index) in rules.history"
          :key="index"
          :timestamp="rule.title"
          placement="top">
          {{ rule.description }}
        </el-timeline-item>
      </el-timeline>
      <el-button
        slot="reference"
        type="primary"
        size="mini"
        icon="el-icon-notebook-2"
        :disabled="rules.length === 0">
        Historical Rules
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'historical-rules',
  props: {
    rules: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.historical-rules {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .date-effectived {
    font-size: 13px;
    font-weight: bold;

    .label {
      color: $--color-primary;
    }

    .date {
      color: $--color-blue;
    }
  }

  .el-popover__reference-wrapper {
    .el-button {
      padding: 3px 7px;
      background-color: $--color-primary;
      border-radius: 0;
      &.is-disabled {
        opacity: 0.5;
      }
    }
  }

  .el-timeline {
    max-height: 300px;
    overflow-y: auto;
    padding: 5px;

    ::v-deep .el-timeline-item {
      &:last-child {
        padding-bottom: 0;
      }

      .el-timeline-item__node {
        width: 8px;
        height: 8px;
        border: 2px solid $--color-primary;
        background-color: #fff;
      }

      .el-timeline-item__timestamp {
        color: $--color-blue;
        font-weight: bold;
      }
      .el-timeline-item__content {
        word-break: break-word;
        text-align: initial;
      }
    }
  }
}
</style>
