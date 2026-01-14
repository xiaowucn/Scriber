<template>
  <div class="manual-remark">
    <span class="title">人工标注:</span>
    <div v-if="list.length > 0" class="manual-remark-select">
      <i class="el-icon-arrow-left" @click.stop="goPreviousManualMark"></i>
      <el-select v-model="manualMarkSelected" size="mini">
        <el-option
          v-for="(label, index) in list"
          :key="index"
          :label="`第${index + 1}条`"
          :value="index"></el-option>
      </el-select>
      <i class="el-icon-arrow-right" @click.stop="goNextManualMark"></i>
      <span
        >{{ manualMarkSelected === '' ? 0 : manualMarkSelected + 1 }}/{{
          list.length
        }}</span
      >
      <i class="el-icon-delete" @click.stop="deleteLabel"></i>
    </div>
    <span v-else>无</span>
  </div>
</template>
<script>
import { EventBus } from '@/utils';

export default {
  name: 'szse-annual-report-manual-remark',
  props: {
    labels: {
      type: Array,
      require: true,
    },
    isActived: {
      type: Boolean,
      require: true,
    },
    createLabelFn: {
      type: Function,
      requires: true,
    },
  },
  data() {
    return {
      list: [],
      manualMarkSelected: '',
    };
  },
  watch: {
    labels(value) {
      this.list = value;
    },
  },
  created() {
    this.list = this.labels;
  },
  mounted() {
    EventBus.$on('create-manual-label', this.createLabel);
  },
  beforeDestroy() {
    EventBus.$off('create-manual-label', this.createLabel);
  },
  methods: {
    goPreviousManualMark() {
      if (!this.isActived) {
        return;
      }

      if (this.manualMarkSelected !== '') {
        const previousIndex = Number(this.manualMarkSelected) - 1;
        this.manualMarkSelected = previousIndex < 0 ? '' : previousIndex;
      }

      this.updateHighlightBlocks();
    },
    goNextManualMark() {
      if (!this.isActived) {
        return;
      }

      const nextIndex =
        this.manualMarkSelected !== ''
          ? Number(this.manualMarkSelected) + 1
          : 0;
      this.manualMarkSelected = Math.min(nextIndex, this.list.length - 1);

      this.updateHighlightBlocks();
    },
    goLatestManualMark() {
      if (!this.isActived) {
        return;
      }

      this.manualMarkSelected = this.list.length - 1;
      this.updateHighlightBlocks({ needJumpToFirstBlock: true });
    },
    async createLabel(label) {
      if (!this.isActived) {
        return;
      }

      this.list = this.list.concat(label);
      this.goLatestManualMark();
      this.$emit('update-labels', this.list);
    },
    async deleteLabel() {
      const index = this.manualMarkSelected;
      this.goPreviousManualMark();

      this.list.splice(index, 1);
      this.$emit('update-labels', this.list);
    },
    updateHighlightBlocks(options = { needJumpToFirstBlock: true }) {
      let blocks = [];

      const currentBlock = this.list[this.manualMarkSelected];
      if (currentBlock) {
        const { page, outline } = currentBlock;
        blocks = [
          {
            type: 'rect',
            page: Number(page),
            outline,
            needJump: options.needJumpToFirstBlock,
          },
        ];
      }

      EventBus.$emit('update-file-viewer-blocks', blocks);
    },
  },
};
</script>
<style lang="scss" scoped>
.manual-remark {
  display: flex;
  flex-flow: row;
  align-items: center;

  .title {
    margin-right: 10px;
    color: #666666;
  }
  .manual-remark-select {
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 5px;

    i {
      cursor: pointer;
    }

    ::v-deep .el-input {
      width: 80px;

      input {
        padding: 8px;
      }
    }
  }
}
</style>
