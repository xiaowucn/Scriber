<template>
  <div class="predicted-answer-wrapper" v-drag>
    <i
      class="el-icon-close close-predicted-answer"
      @click="closePredictPosition"></i>
    <el-card class="predict-position-container">
      <p class="predicted-answer-name">
        <span class="label">{{ predictPosition.label }}</span>
        <span
          >{{
            customTitle ? customTitle : $t(`message['推荐答案详情']`)
          }}:</span
        >
      </p>
      <div :class="cardContainerClass">
        <div>
          <p v-if="showGeneralPositionTitle" class="predicted-answer-type">
            {{ $t(`message['段落位置']`) }}
          </p>
          <template v-if="predictPosition.label === GML_SPECIAL_RULE">
            <div v-for="(result, key) in predictPosition.result" :key="key">
              <p class="group-title">{{ key }}</p>
              <div
                v-for="(position, index) in result"
                :key="`${key}_${index}`"
                :class="[
                  'position-item',
                  activePredict === `${key}_${index}` ? 'active-card' : '',
                ]"
                @click="showPredictedPosition(`${key}_${index}`, position)">
                <span class="describe-answer">
                  <el-tag size="mini">{{ position.score.toFixed(4) }}</el-tag>
                  {{ index + 1 }}.{{ position.text }}
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(position, index) in predictPosition.result"
              :key="index"
              :class="[
                'position-item',
                activePredict === index ? 'active-card' : '',
              ]"
              @click="showPredictedPosition(index, position)">
              <span class="describe-answer">
                <el-tag size="mini">{{ position.score.toFixed(4) }}</el-tag>
                {{ index + 1 }}.{{ position.text }}
              </span>
            </div>
          </template>
        </div>
        <div v-if="showPrecisePosition" class="precise-side">
          <p class="predicted-answer-type">{{ $t(`message['具体结果']`) }}</p>
          <ul
            v-if="
              predictPrecisePosition.data &&
              predictPrecisePosition.data.length > 0
            "
            class="precise-list">
            <li
              v-for="(position, index) in predictPrecisePosition.data"
              :key="index"
              @click="showPrecisePredictedPosition(index, position)"
              :class="[
                selectStatus[index] ? 'selected' : '',
                activePrecisePredict === index ? 'active' : '',
              ]">
              <span class="describe-answer"
                >{{ index + 1 }}.
                {{ position.boxes.map((box) => box.text).join('') }}</span
              >
              <i class="el-icon-check"></i>
              <el-button
                v-if="
                  userAnswerType === 'PRESET' && isShowAllPredictItems === false
                "
                type="primary"
                size="mini"
                @click="
                  selectPrecisePosition(predictPrecisePosition, position, index)
                "
                :disabled="index === 0 || selectStatus[index]"
                >{{ $t(`message['选择']`) }}</el-button
              >
            </li>
          </ul>
          <p v-else class="no-result">{{ $t(`message['暂无数据']`) }}</p>
        </div>
      </div>
      <button
        v-if="isShowMoreBtn"
        class="check-more"
        @click="isShowMoreAnswer = !isShowMoreAnswer">
        {{ $t(`message['查看${isShowMoreAnswer ? '更少' : '更多'}']`) }}
        <i
          :class="[
            isShowMoreAnswer ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
          ]"></i>
      </button>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EventBus from './remark-tree/EventBus';
import _ from 'lodash';
import { GML_SPECIAL_RULE } from '@/store/constants';

export default {
  name: 'file-remark-predict-position',
  props: {
    answerItemMap: {
      type: Object,
      required: true,
    },
    answerVersion: {
      type: String,
      required: true,
    },
    showGeneralPositionTitle: {
      type: Boolean,
      required: false,
      default: true,
    },
    customTitle: {
      type: String,
      required: false,
      default: '',
    },
    subRule: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      GML_SPECIAL_RULE,
      activePredict: null,
      activePrecisePredict: null,
      isShowMoreAnswer: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'predictPosition',
      'predictPrecisePosition',
      'predictPrecisePositionSelected',
      'userAnswerType',
    ]),
    ...mapGetters(['configuration']),
    isShowAllPredictItems() {
      if (typeof this.configuration.show_all_predict_items === 'undefined') {
        return false;
      }
      return this.configuration.show_all_predict_items;
    },
    selectStatus() {
      const selected = this.predictPrecisePositionSelected.find(
        (item) => item.key === this.predictPrecisePosition.key,
      );
      if (selected === undefined) return [];
      return selected.selectedArr;
    },
    cardContainerClass() {
      if (this.predictPosition.label === GML_SPECIAL_RULE) {
        return [
          'card-container',
          `${this.isShowMoreAnswer ? 'card-show-more' : ''}`,
          `${
            this.predictPosition.result &&
            Object.values(this.predictPosition.result).reduce(
              (acc, cur) => acc + cur.length,
              0,
            ) > 5 &&
            !this.isShowMoreAnswer
              ? 'card-container-height'
              : ''
          }`,
        ];
      }
      return [
        'card-container',
        `${this.isShowMoreAnswer ? 'card-show-more' : ''}`,
        `${
          this.predictPosition.result &&
          this.predictPosition.result.length > 5 &&
          !this.isShowMoreAnswer
            ? 'card-container-height'
            : ''
        }`,
      ];
    },
    showPrecisePosition() {
      return (
        this.predictPrecisePosition.data &&
        this.predictPrecisePosition.data.length > 0
      );
    },
    isShowMoreBtn() {
      if (
        this.predictPosition.label === GML_SPECIAL_RULE &&
        this.predictPosition.result
      ) {
        const totalLength = Object.values(this.predictPosition.result).reduce(
          (acc, cur) => acc + cur.length,
          0,
        );
        if (totalLength > 5) {
          return true;
        }
        return false;
      }
      return (
        this.predictPosition.result && this.predictPosition.result.length > 5
      );
    },
  },
  watch: {
    predictPrecisePosition(answer) {
      this.initPrecisePositionSelectedStatus(answer.key);
      this.activePrecisePredict = null;
    },
  },
  directives: {
    drag: {
      inserted: (target) => {
        target.onmousedown = (e) => {
          const disX = e.clientX - target.offsetLeft;
          const disY = e.clientY - target.offsetTop;

          document.onmousemove = (e) => {
            target.style.left = e.clientX - disX + 'px';
            target.style.top = e.clientY - disY + 'px';
          };

          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };

          return false;
        };
      },
    },
  },
  methods: {
    closePredictPosition() {
      this.activePredict = null;
      this.$store.commit('remarkModule/SET_PREDICT_POSITION', []);
      this.$store.commit('remarkModule/SET_PREDICT_LABEL', '');
    },
    async showPredictedPosition(index, position) {
      this.activePredict = index;
      let boxes = position.outlines.map((item) => {
        let box = {
          box_left: item[0],
          box_top: item[1],
          box_right: item[2],
          box_bottom: item[3],
        };
        return {
          box,
          page: position.page,
        };
      });
      const label = this.subRule || this.predictPosition.label;
      const tags = this.$features.showAnswerTypeOnAnnotation()
        ? ['AI Answers', label]
        : [label];
      let frame = {
        boxes,
        tags: tags,
        type: 'wireframe',
      };
      if (this.predictPosition.label === GML_SPECIAL_RULE) {
        this.$emit('view-gml-answer', { answer: position, data: frame });
        return;
      }
      EventBus.$emit('predict-position-item', frame);
    },
    async showPrecisePredictedPosition(index, position) {
      this.activePrecisePredict = index;
      let boxes = position.boxes.map((item) => {
        return {
          box: item.box,
          page: item.page,
        };
      });
      const label = this.subRule || this.predictPosition.label;
      const tags = this.$features.showAnswerTypeOnAnnotation()
        ? ['AI Answers', label]
        : [label];
      let frame = {
        boxes,
        tags: tags,
        type: 'wireframe',
      };
      if (this.predictPosition.label === GML_SPECIAL_RULE) {
        this.$emit('view-gml-answer', {
          answer: this.predictPrecisePosition,
          data: frame,
        });
        return;
      }
      EventBus.$emit('predict-position-item', frame);
    },
    selectPrecisePosition(predictPrecisePosition, position, index) {
      const answer = _.cloneDeep({
        version: this.answerVersion,
        items: Object.keys(this.answerItemMap).map(
          (key) => this.answerItemMap[key],
        ),
      });
      const answerKey = this.predictPrecisePosition.key;
      const answerItem = answer.items.find((item) => item.key === answerKey);
      if (answerItem !== undefined) {
        answerItem.data.push(position);
      }
      this.$store.commit('remarkModule/SET_USER_ANSWER', answer);
      this.$store.dispatch('remarkModule/initAnswerTree');
      this.$store.commit('remarkModule/SET_PREDICT_PRECISE_POSITION_SELECTED', {
        key: predictPrecisePosition.key,
        index,
        isTrue: true,
      });
    },
    initPrecisePositionSelectedStatus(key) {
      if (
        this.predictPrecisePositionSelected.find((item) => item.key === key)
      ) {
        return;
      } else {
        const selectedTemp = _.cloneDeep(this.predictPrecisePositionSelected);
        const positionItem = {
          key: key,
          selectedArr: [],
        };
        if (this.predictPrecisePosition.data) {
          for (let i = 0; i < this.predictPrecisePosition.data.length; i++) {
            positionItem.selectedArr.push(false);
          }
        }
        selectedTemp.push(positionItem);
        this.$store.commit(
          'remarkModule/SET_PREDICT_PRECISE_POSITION_SELECTED_STATUS',
          selectedTemp,
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.predicted-answer-wrapper {
  position: fixed !important;
  top: 50px;
  right: 10px;
  width: 500px;
  cursor: move;
  z-index: 999;
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
  ::v-deep .el-card__body {
    max-height: 80vh;
    overflow-y: auto;
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
.group-title {
  font-weight: bold;
  font-size: 13px;
  margin: 15px 0;
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
  .no-result {
    padding-top: 50%;
    text-align: center;
    color: #ccc;
  }
}
.card-container {
  display: flex;
  overflow: hidden;
  > div {
    flex: 1;
    width: 50%;
  }
}
.card-container-height {
  height: 175px;
  .no-result {
    padding-top: 60px;
  }
}
.card-show-more {
  height: auto;
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
    &.active-card {
      color: #409eff;
    }
  }
}
</style>
