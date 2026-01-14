<template>
  <div class="predicted-answer-wrapper">
    <i
      class="el-icon-close close-predicted-answer"
      @click="closePredictPosition"></i>
    <el-card class="predict-position-container">
      <p class="predicted-answer-name">
        <span>AI位置定位:</span>
      </p>
      <div
        :class="[
          'card-container',
          `${this.isShowMoreAnswer ? 'card-show-more' : ''}`,
        ]">
        <div>
          <p class="predicted-answer-type">段落位置</p>
          <div
            v-for="(position, index) in predictionList"
            :key="index"
            :class="[
              'position-item',
              predictionActived === index ? 'active-card' : '',
            ]"
            @click="showPredictedPosition(index, position)">
            <span class="describe-answer">
              <el-tag size="mini">{{ position.score.toFixed(4) }}</el-tag>
              {{ index + 1 }}.{{ position.text }}
            </span>
          </div>
        </div>
        <div class="precise-side">
          <p class="predicted-answer-type">具体结果</p>
          <p class="prediction-content" @click="checkPredictionContent">
            {{ auditItem.content }}
          </p>
        </div>
      </div>
      <button
        v-if="predictionList && predictionList.length > 5"
        class="check-more"
        @click="isShowMoreAnswer = !isShowMoreAnswer">
        查看更多
        <i
          :class="[
            'el-icon-arrow-down',
            { 'el-icon-arrow-up': isShowMoreAnswer },
          ]"></i>
      </button>
    </el-card>
  </div>
</template>

<script>
import { EventBus } from '@/utils';
import { predictPosition as fetchPredictionPosition } from '@/store/api/remark.api.js';

export default {
  name: 'szse-annual-report-prediction-position',
  props: {
    auditItem: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      predictionList: [],
      predictionActived: null,
      isShowMoreAnswer: false,
    };
  },
  watch: {
    async auditItem() {
      await this.getPredictionData();
    },
  },
  async created() {
    await this.getPredictionData();
  },
  methods: {
    async getPredictionData() {
      try {
        const { qid, schema_path } = this.auditItem;
        const { data } = await fetchPredictionPosition(qid, schema_path);
        this.predictionList = data;
      } catch (error) {
        console.error(error);
      }
    },
    async showPredictedPosition(index, position) {
      this.predictionActived = index;
      const blocks = position.outlines.map((outline) => ({
        type: 'rect',
        page: Number(position.page),
        outline,
        needJump: true,
      }));
      EventBus.$emit('update-file-viewer-blocks', blocks);
    },
    checkPredictionContent() {
      const blocks = [];

      Object.keys(this.auditItem.outlines).forEach((page) => {
        this.auditItem.outlines[page].forEach((outline) => {
          blocks.push({
            type: 'rect',
            page: Number(page),
            outline,
            needJump: true,
          });
        });
      });

      EventBus.$emit('update-file-viewer-blocks', blocks);
    },
    closePredictPosition() {
      this.predictionActived = null;
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.predicted-answer-wrapper {
  .check-more {
    width: 100%;
    margin: 10px 0 0 0;
    background: #fff;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
  }
}
.close-predicted-answer {
  cursor: pointer;
  color: #909399;
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 18px;
  font-weight: 600;
  z-index: 1;
  &:hover {
    color: #666;
  }
}
.predicted-answer-name {
  font-weight: bold;
  font-size: 15px;
  position: relative;
  top: -5px;
  padding-right: 10px;
  .label {
    margin-right: 5px;
    color: #409eff;
  }
}
.predicted-answer-type {
  margin: 10px 0;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
}
.precise-side {
  padding-left: 15px;
  border-left: 1px solid #ccc;
  box-sizing: border-box;
  .precise-list {
    li {
      display: flex;
      justify-content: space-between;
      margin: 9px 0;
      font-size: 14px;
      cursor: pointer;
      .describe-answer {
        width: 80%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .el-button--mini {
        visibility: hidden;
        margin-left: 5px;
        padding: 3px 10px;
      }
      .el-icon-check {
        visibility: hidden;
        margin-top: 4px;
        color: #409eff;
        font-weight: bold;
      }
      &.selected {
        color: rgba(#409eff, 0.6);
        .el-icon-check {
          visibility: initial;
        }
      }
      &.active {
        color: #409eff;
      }
      &:hover {
        .el-button--mini {
          visibility: initial;
        }
      }
    }
  }
  .prediction-content {
    cursor: pointer;
  }
}
.card-container {
  display: flex;
  overflow: hidden;
  max-height: 175px;
  > div {
    flex: 1;
    width: 50%;
  }
}
.card-show-more {
  max-height: unset;
}
.el-card {
  height: 100%;
  border-radius: 9px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  .position-item {
    font-size: 14px;
    line-height: 25px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 95%;
    margin-top: 4px;
    color: #9e9e9e;
    &.active-card {
      color: #409eff !important;
    }
    .el-tag {
      line-height: 22px;
      height: 22px;
      margin-right: 2px;
    }
    .describe-answer {
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &:nth-of-type(1) {
      color: #000;
      font-weight: 500;
    }
    &:nth-of-type(2) {
      color: #252525;
    }
    &:nth-of-type(3) {
      color: #676767;
    }
  }
}
</style>
