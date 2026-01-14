<template>
  <div
    class="diff-control-bar"
    :class="{ 'disabled-scroll': loading || componentLoading }"
    v-loading="loading || componentLoading"
    element-loading-text="加载中..."
    element-loading-spinner="null">
    <diff-control-nav
      ref="diffControlNav"
      :diff-total="diffTotal"
      :current-diff-index="currentDiffIndex"
      @change-current-diff="gotoDiffItem"></diff-control-nav>
    <div ref="diffControlitems">
      <div
        v-for="(item, index) in diffControlList"
        :key="item.id"
        :class="item.classList"
        :style="item.style"
        :data-index="index"
        @click="selectDiffItem(index)"
        @mouseenter="hoverTooltip(index)"
        @mouseleave="hoverTooltip(null)">
        <template>
          <i class="el-icon-edit-outline"></i>
        </template>
      </div>
    </div>
    <div v-show="isShowScrollTips" class="scroll-tips">
      <i class="el-icon-d-arrow-right"></i>
      <span>双屏滚动</span>
      <i class="el-icon-d-arrow-left"></i>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import DiffControlNav from './DiffControlNav';
import { ptToPx } from 'pdf-document-viewer';

export default {
  name: 'DiffControlBar',
  components: {
    DiffControlNav,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    diffList: {
      type: Array,
      default: () => [],
    },
    diffTotal: {
      type: Number,
      default: 0,
    },
    currentDiffIndex: {
      type: Number,
      default: -1,
    },
    docSize: {
      type: Object,
      default: () => ({}),
    },
    isShowReviewBtn: {
      type: Boolean,
      default: false,
    },
    getDiffDom: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      diffControlList: [],
      isShowScrollTips: false,
      selectDiffIndex: null,
      componentLoading: true,
      hoverDiffIndex: null,
    };
  },
  computed: {
    currentHoverDiffItem() {
      return this.diffControlList[this.hoverDiffIndex];
    },
  },
  watch: {
    docSize() {
      if (!_.isEmpty(this.docSize)) {
        const height = this.docSize.docHeight + this.docSize.headerHeight;
        const navHeight = 79;

        this.$refs.diffControlitems.style.height = height + 'px';
        if (height + navHeight > window.innerHeight) {
          this.isShowScrollTips = true;
        }
        this.updateDiffControlList();
      }
    },
    diffList() {
      if (!_.isEmpty(this.docSize)) {
        this.updateDiffControlList();
      }
    },
    currentDiffIndex(val) {
      this.activeDiffControlItem(val);
      this.selectDiffIndex = val;
    },
  },
  mounted() {
    this.$el.addEventListener('scroll', (event) => {
      const scrollTop = event.target.scrollTop;
      if (scrollTop > 200) {
        this.isShowScrollTips = false;
      }
    });
  },
  methods: {
    updateDiffControlList() {
      this.componentLoading = true;

      this.updatePDFDiffControlList();

      this.componentLoading = false;
    },
    updatePDFDiffControlList() {
      const DIFF_ICON_HEIGHT = 24;
      const TOP_BUTTONS_HEIGHT = 76;
      const diffIconPositionTops = [];

      this.diffControlList = this.diffList
        .filter((item) => item.leftFirstBox || item.rightFirstBox)
        .map((item, index) => {
          const { id, leftFirstBox, rightFirstBox } = item;
          const page = leftFirstBox ? leftFirstBox.page : rightFirstBox.page;
          const boxTop = leftFirstBox
            ? leftFirstBox.outline[1]
            : rightFirstBox.outline[1];

          let iconTop =
            this.docSize.headerHeight +
            this.docSize.pagesHeight
              .slice(0, page)
              .reduce(
                (totalHeight, height) =>
                  totalHeight + height + this.docSize.pageMargin,
                0,
              ) +
            this.docSize.pageMargin +
            ptToPx(boxTop) * this.docSize.scale;

          const previousIconTop = diffIconPositionTops[index - 1];
          if (iconTop - previousIconTop < DIFF_ICON_HEIGHT) {
            iconTop = previousIconTop + DIFF_ICON_HEIGHT;
          }
          if (iconTop < TOP_BUTTONS_HEIGHT) {
            iconTop = TOP_BUTTONS_HEIGHT;
          }
          diffIconPositionTops.push(iconTop);

          const style = { top: iconTop + 'px' };

          const classList = ['diff-control-item'];
          classList.push('align-center');

          return {
            id,
            classList,
            style,
            leftPageNumber: leftFirstBox ? leftFirstBox.page + 1 : '-',
            rightPageNumber: rightFirstBox ? rightFirstBox.page + 1 : '-',
          };
        });
    },
    activeDiffControlItem(diffIndex) {
      const selectDiffDom = this.$el.querySelector(
        `.diff-control-item[data-index="${this.selectDiffIndex}"]`,
      );
      if (selectDiffDom) {
        selectDiffDom.classList.remove('active');
      }
      const diffControlItemActived = this.$el.querySelector(
        `.diff-control-item[data-index="${diffIndex}"]`,
      );
      if (diffControlItemActived) {
        diffControlItemActived.classList.add('active');
      }
    },
    selectDiffItem(diffIndex) {
      this.gotoDiffItem(diffIndex, { inCenter: true });
    },
    gotoDiffItem(diffIndex, options = {}) {
      this.$emit('change-current-diff', diffIndex, options);
    },
    hoverTooltip(index) {
      this.hoverDiffIndex = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.diff-control-bar {
  &::-webkit-scrollbar {
    width: 0;
  }
  &.disabled-scroll {
    overflow: unset;
  }
  position: relative;
  z-index: 2;
  width: 80px;
  overflow: auto;
  text-align: center;
  .diff-control-item {
    position: absolute;
    left: 0;
    padding: 0 4px;
    width: 100%;
    height: 18px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    .el-icon-edit-outline {
      color: #d22727;
    }
    .tool-checkbox {
      margin-left: 10px;
      ::v-deep .el-checkbox__label {
        font-size: 12px;
        padding-left: 5px;
      }
    }
    &.left {
      &:hover {
        background: rgb(210, 227, 254);
      }
    }
    &.right {
      &:hover {
        background: rgb(235, 241, 227);
      }
    }
    &.align-center {
      justify-content: center;
    }

    &.active {
      &.equal {
        background: rgba(63, 111, 178, 0.1);
      }

      background: #ffbaba;
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate(-50%, -100%);
    }

    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .scroll-tips {
    position: absolute;
    z-index: 2;
    top: calc(100vh - 100px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-flow: column;
    row-gap: 10px;
    width: 80px;
    animation: fadeInDown 2s 2s infinite;

    span {
      font-size: 8px;
      color: rgba(0, 0, 0, 0.65);
    }
    i {
      font-size: 18px;
      transform: rotate(-90deg);
      color: #1890ff;
    }
  }
}

.diff-item-tooltip {
  position: absolute;
  left: 25px;
  width: 1px;
  height: 1px;
  visibility: hidden;
  transform: translateY(9px);
}
</style>
<style lang="scss">
.pdf-diff-icon-tooltip {
  .tooltip-text-main {
    position: relative;
    margin-right: 14px;
    &:after {
      content: '';
      position: absolute;
      right: -7px;
      top: -2px;
      display: inline-block;
      width: 1px;
      height: 18px;
      background: rgba(#fff, 0.5);
    }
  }

  .tooltip-text-sub {
    margin-right: 6px;
    padding-right: 3px;
    border-right: 1px solid rgba(#fff, 0.5);
  }
}
</style>
