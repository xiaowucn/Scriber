<template>
  <div class="draw-widget-switch-container">
    <div class="draw-widget-switch">
      <el-tooltip
        v-for="item in drawWidgetTools"
        effect="dark"
        placement="left"
        :key="item.mode"
        :content="item.tooltip">
        <el-button
          :class="[item.icon, { active: isItemActive(item) }]"
          :loading="item.loading"
          @click="changeDrawWidgetMode(item.mode)"></el-button>
      </el-tooltip>
      <el-tooltip
        v-if="$features.supportToggleAnswerPanel()"
        effect="dark"
        :content="toggleAnswerPanelIconTips"
        placement="left">
        <el-button
          :class="[
            'toggle-answer-panel',
            `el-icon-d-arrow-${showAnswerPanel ? 'right' : 'left'}`,
          ]"
          @click="toggleAnswerPanel">
        </el-button>
      </el-tooltip>
    </div>

    <el-card
      v-if="
        multipleWidgetDrawed.schemaNode !== '' &&
        multipleWidgetDrawed.boxes.length > 0
      "
      class="multiple-widget-card">
      <ul>
        <draggable
          v-model="multipleWidgetDrawedBoxes"
          @change="updateMultipleWidgetDrawedBoxes">
          <li v-for="(item, index) in multipleWidgetDrawed.boxes" :key="index">
            <span
              class="text"
              @click="multipleDrawedItemClicked(item.page + 1)"
              >{{ item.text }}</span
            >
            <button
              class="fas fa-times-circle delete-button"
              @click="removeMultipleWidgetDrawedItem(index)"></button>
          </li>
        </draggable>
      </ul>
      <button class="combine-button" @click="combineMultipleDrawedItem">
        {{ $t(`message['合并结果']`) }}
      </button>
    </el-card>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  name: 'draw-widget-switch',
  components: { Draggable },
  props: {
    drawWidgetModeActived: {
      type: Number,
      required: false,
      default: 0,
    },
    multipleWidgetDrawed: {
      type: Object,
      required: true,
    },
    showPageBlocks: {
      type: Boolean,
      required: false,
      default: false,
    },
    showPageBlocksLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    drawWidgetMode: {
      type: Object,
      required: false,
      default: () => ({
        selectText: -1,
        single: 0,
        multiple: 1,
        blocks: 2,
      }),
    },
    showAnswerPanel: {
      type: Boolean,
      required: false,
      default: true,
    },
    buttonVisibilityConfig: {
      type: Object,
      required: false,
      default: () => ({
        showOnlyBlocksButton: false,
        showAllButtons: false,
      }),
    },
  },
  computed: {
    drawWidgetTools() {
      const { showOnlyBlocksButton, showAllButtons } =
        this.buttonVisibilityConfig;

      const options = [
        {
          mode: this.drawWidgetMode.selectText,
          tooltip: this.$t(`message['复制文字']`),
          icon: 'fas fa-text-width',
          visible: showOnlyBlocksButton
            ? showAllButtons &&
              this.$features.supportCopyTextInDrawWidgetSwitch()
            : this.$features.supportCopyTextInDrawWidgetSwitch(),
        },
        {
          mode: this.drawWidgetMode.single,
          tooltip: this.$t(`message['画框提取']`),
          icon: 'fas fa-expand',
          visible: showOnlyBlocksButton ? showAllButtons : true,
        },
        {
          mode: this.drawWidgetMode.multiple,
          tooltip: this.$t(`message['多框合并提取']`),
          icon: 'fas fa-th-large',
          visible: showOnlyBlocksButton ? showAllButtons : true,
        },
        {
          mode: this.drawWidgetMode.blocks,
          tooltip: this.$t(`message['元素块提取']`),
          icon: 'fas fa-table',
          visible:
            showOnlyBlocksButton || this.$features.showPredictedBlocksMenu(),
          loading: this.showPageBlocksLoading,
        },
      ];

      return options.filter((option) => option.visible !== false);
    },
    toggleAnswerPanelIconTips() {
      const actionType = this.showAnswerPanel ? '隐藏' : '展开';
      const panelType =
        this.$route.query.task_type === 'audit' ? '提取/审核内容' : '提取内容';
      return `${actionType}【${panelType}】`;
    },
  },
  data() {
    return {
      multipleWidgetDrawedBoxes: [...this.multipleWidgetDrawed.boxes],
    };
  },
  methods: {
    changeDrawWidgetMode(mode) {
      this.$emit('draw-widget-mode-change', mode);
    },
    multipleDrawedItemClicked(page) {
      this.$emit('multiple-drawed-item-clicked', page);
    },
    removeMultipleWidgetDrawedItem(index) {
      this.$emit('remove-multiple-drawed-item', index);
    },
    combineMultipleDrawedItem() {
      this.$emit('combine-multiple-drawed-item');
    },
    updateMultipleWidgetDrawedBoxes() {
      this.$emit('update:multipleWidgetDrawed', {
        ...this.multipleWidgetDrawed,
        boxes: this.multipleWidgetDrawedBoxes,
      });
    },
    toggleAnswerPanel() {
      this.$emit('toggle-answer-panel');
    },
    isItemActive(item) {
      if (item.mode === this.drawWidgetMode.blocks) {
        return this.showPageBlocks;
      }
      return this.drawWidgetModeActived === item.mode;
    },
  },
  watch: {
    multipleWidgetDrawed: {
      handler(val) {
        this.multipleWidgetDrawedBoxes = [...val.boxes];
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
$--color-primary: #409eff;

.draw-widget-switch-container {
  .draw-widget-switch {
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    z-index: 220;
    display: flex;
    flex-direction: column;

    button {
      margin: 0;
      padding: 8px;
      border: 1px solid #c1c2c5;
      border-radius: 0;
      background-color: #fff;
      font-weight: 900;
      opacity: 0.8;

      &::before {
        background-color: #fff;
        font-size: 24px;
        color: #9ea0a5;
        opacity: 0.8;
      }

      &:hover {
        opacity: 1;
      }

      &.active {
        background-color: $--color-primary;
        border: 1px solid $--color-primary;

        &:before {
          background-color: $--color-primary;
          color: #fff;
        }
      }

      &.fa-table {
        height: 42px;
        margin-top: 15px;
        ::v-deep i {
          font-size: 20px;
          color: #fff;
        }
      }
      &.toggle-answer-panel {
        margin-top: 15px;
      }
    }
  }

  .multiple-widget-card {
    position: absolute;
    top: 70px;
    right: 24px;
    z-index: 220;
    display: flex;
    flex-direction: column;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    ::v-deep .el-card__body {
      padding: 0;
    }

    ul {
      padding: 8px 0;
      max-height: 200px;
      overflow: auto;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        padding: 3px 20px;
        background-color: #fff;
        font-size: 12px;

        &:not(:last-of-type) {
          margin-bottom: 8px;
        }

        .text {
          flex: 1;
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        .delete-button {
          width: 20px;
          height: 20px;
          margin-left: 8px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;

          &::before {
            color: red;
            font-size: 16px;
          }
        }
      }
    }
    .combine-button {
      width: 100%;
      padding: 12px;
      background-color: #fff;
      border: none;
      border-top: 1px solid #eee;
      font-size: 14px;
      color: $--color-primary;
      cursor: pointer;
    }
  }
}
</style>
