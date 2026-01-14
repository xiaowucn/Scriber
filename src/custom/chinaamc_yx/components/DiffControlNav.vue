<template>
  <div class="diff-control-nav">
    <div class="nums">
      <el-input
        v-model="inputDiffNumber"
        @keydown.native.enter="changeInputDiffNumber"></el-input>
      <span class="separator">/</span>
      <span>{{ diffTotal }}</span>
    </div>
    <div class="arrows">
      <el-button
        plain
        class="el-icon-caret-left"
        :disabled="inputDiffNumber <= 1"
        @click="prevDiff"></el-button>
      <el-button
        plain
        class="el-icon-caret-right"
        :disabled="inputDiffNumber >= diffTotal"
        @click="nextDiff"></el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DiffControlNav',
  props: {
    diffTotal: {
      type: Number,
      default: 0,
    },
    currentDiffIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      isShowTip: false,
      inputDiffNumber: 0,
    };
  },
  watch: {
    currentDiffIndex() {
      this.inputDiffNumber = this.currentDiffIndex + 1;
    },
  },
  methods: {
    async prevDiff() {
      this.isShowTip = false;
      this.$emit('change-current-diff', this.currentDiffIndex - 1);
    },
    async nextDiff() {
      this.isShowTip = false;
      this.$emit('change-current-diff', this.currentDiffIndex + 1);
    },
    async changeInputDiffNumber() {
      const value = Number(this.inputDiffNumber);

      if (isNaN(value)) {
        return;
      }

      if (value < 1 || value > this.diffTotal) {
        return;
      }

      this.inputDiffNumber = value;
      this.$emit('change-current-diff', this.inputDiffNumber - 1, {
        inCenter: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.diff-control-nav {
  position: fixed;
  background: #f7fbfe;
  z-index: 3;
  top: 0;
  width: 80px;
  .nums {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 13px 5px;
    font-size: 13px;
    ::v-deep .el-input__inner {
      width: 30px;
      height: 16px;
      padding: 0;
      text-align: center;
      font-size: 13px;
      border-radius: 2px;
    }
    span {
      width: 30px;
      color: #4a4a4a;
      &.separator {
        margin: 0 3px;
      }
    }
  }
  .arrows {
    display: flex;
    flex-flow: row;
    justify-content: space-evenly;
    margin-top: 10px;

    .el-button {
      margin: 0;
      padding: 2px;
      &.is-disabled {
        background-color: #fff;
        border-color: #ebeef5;
        color: #c0c4cc;
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(0, 50%);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.tip {
  position: fixed;
  top: 90px;
  left: calc((100% - 40px) / 2);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  animation: fadeInUp 2s 2s infinite;

  i {
    display: block;
    width: 20px;
    height: 20px;
    // background: url('~@/assets/icon-cursor-pointer.svg') no-repeat;
    background-size: contain;
  }

  span {
    line-height: 24px;
    font-size: 14px;
    color: #6b6c6f;
  }
}
</style>
