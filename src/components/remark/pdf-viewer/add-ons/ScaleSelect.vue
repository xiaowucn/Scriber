<template>
  <div class="scale-operation">
    <template v-if="isShowZoomButton">
      <el-button
        type="text"
        icon="el-icon-remove-outline"
        @click="zoomOut"></el-button>
    </template>

    <el-select
      v-model="scale"
      class="scale-operation-select"
      popper-class="scale-operation-options"
      size="mini"
      @change="changeScale">
      <el-option
        v-for="option in scaleOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"></el-option>
    </el-select>

    <template v-if="isShowZoomButton">
      <el-button
        type="text"
        icon="el-icon-circle-plus-outline"
        @click="zoomIn"></el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'scale-select',

  props: {
    defaultScale: {
      type: Number,
      default: -1,
    },
    isShowZoomButton: {
      type: Boolean,
      default: true,
    },
    getScale: {
      type: Function,
      requires: true,
    },
  },

  data() {
    return {
      scale: -1,
      scaleOptionsTemp: [],
      scaleOptionsDefault: [
        { label: '适合页面', value: -2 },
        { label: '适合宽度', value: -1 },
        { label: '50%', value: 0.5 },
        { label: '100%', value: 1 },
        { label: '130%', value: 1.3 },
        { label: '200%', value: 2 },
        { label: '300%', value: 3 },
        { label: '400%', value: 4 },
      ],
    };
  },

  computed: {
    scaleOptions() {
      return []
        .concat(this.scaleOptionsDefault)
        .concat(
          this.scaleOptionsTemp.filter(
            (tem) =>
              !this.scaleOptionsDefault.some((op) => tem.value === op.value),
          ),
        );
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.scale = this.defaultScale;
      this.setTempScaleOptions(this.scale);
    },
    setScale(scale) {
      this.scale = scale;
    },
    changeScale(scale) {
      this.$emit('scale-change', scale);
    },
    setTempScaleOptions(value) {
      const label = (value * 100).toFixed(0) + '%';
      this.scaleOptionsTemp = [{ label, value }];
    },
    changeScaleByZoom(value) {
      this.scale = value;
      this.setTempScaleOptions(value);
      this.changeScale(value);
    },
    zoomOut() {
      const scaleCurrent = this.getScale().toFixed(1);
      const scalePercent = scaleCurrent * 100;

      const scalePrevious = scalePercent > 50 ? scalePercent - 10 : 50;
      this.changeScaleByZoom(scalePrevious / 100);
    },
    zoomIn() {
      const scaleCurrent = this.getScale().toFixed(1);
      const scalePercent = scaleCurrent * 100;

      const scaleNext =
        scalePercent > 0 ? (scalePercent < 400 ? scalePercent + 10 : 400) : 50;
      this.changeScaleByZoom(scaleNext / 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.scale-operation {
  display: flex;
  align-items: center;
  height: 40px;
  .el-button {
    margin: 0;
    color: #3e3f43;
    ::v-deep i {
      padding: 0 5px;
      width: 24px;
      &:hover {
        color: #409eff;
      }
    }
  }
  .scale-operation-select {
    width: 100px;
    margin: 0 5px;
  }

  &.llm-review-layout {
    .scale-operation-select {
      margin: 0 5px;
    }
  }
}
</style>
<style lang="scss">
.scale-operation-options {
  .el-select-dropdown__wrap {
    max-height: 600px !important;
  }

  .el-select-dropdown__list {
    li:last-of-type {
      display: none;
    }
  }
}
</style>
