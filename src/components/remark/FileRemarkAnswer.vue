<template>
  <div class="file-remark-answer">
    <remark-tree-list
      ref="remarkList"
      :children="mergedTreeData"
      :allAnswerCollapsed="allAnswerCollapsed"
      :updateAllAnswerCollapsed="updateAllAnswerCollapsed"
      :showDiffMarks="showDiffMarks">
    </remark-tree-list>
    <div v-if="$features.showFieldAuditStatusInAnswer()" class="audit-helper">
      <field-status-helper></field-status-helper>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import RemarkTreeList from './remark-tree/RemarkTreeList.jsx';
import FieldStatusHelper from '../../custom/cmfchina/components/FieldStatusHelper';
import EventBus from './remark-tree/EventBus';
import { mixDeepInfo } from '@/utils';

export default {
  name: 'file-remark-answer',
  components: {
    RemarkTreeList,
    FieldStatusHelper,
  },
  props: {
    schema: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    schemaId: {
      type: Number,
      required: false,
    },
    answerItemMap: {
      type: Object,
      required: true,
    },
    mergedTreeData: {
      type: Array,
      required: true,
    },
    showDiffMarks: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      allAnswerCollapsed: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'predictPosition',
      'question',
      'predictPrecisePosition',
    ]),
  },
  methods: {
    async answerItemBoxRemove({ schemaNode: key, data }) {
      if (this.predictPrecisePosition.data) {
        const removeIndex = this.predictPrecisePosition.data.findIndex(
          (position) => {
            return _.isEqual(data.boxes, position.boxes);
          },
        );
        this.$store.commit(
          'remarkModule/SET_PREDICT_PRECISE_POSITION_SELECTED',
          {
            key,
            index: removeIndex,
            isTrue: false,
          },
        );
      }
    },
    async predictNodePosition(model) {
      const key = [...model.meta._parent, model.data.label].join('|');
      const label = model.data.label;
      const qid = this.$route.params.qid;
      let data = {
        key,
        label,
        qid,
      };
      let answerKey = '';
      if (model.answer) {
        answerKey = model.answer.key;
      } else {
        answerKey = JSON.stringify(mixDeepInfo(model.meta));
      }
      answerKey = answerKey.replace(/\s+/g, '');
      let predictPrecisePosition;
      if (this.question.preset_answer && answerKey) {
        const userAnswer = _.cloneDeep(this.question.preset_answer.userAnswer);
        predictPrecisePosition = userAnswer.items.find((item) => {
          let itemKey = item.key.replace(/\s+/g, '');
          return _.isEqual(JSON.parse(itemKey), JSON.parse(answerKey));
        });
      }
      if (predictPrecisePosition) {
        predictPrecisePosition.key = answerKey;
        data.hasAccurateAnswer = true;
      } else {
        predictPrecisePosition = {};
      }
      try {
        await this.$store.dispatch('remarkModule/predictPosition', data);
        await this.$store.commit(
          'remarkModule/SET_PREDICT_PRECISE_POSITION',
          predictPrecisePosition,
        );
        if (this.predictPosition.result.length === 0) {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: this.$t(`message['暂无预测结果']`),
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    updatePredictList(payload) {
      this.$store.commit('remarkModule/UPDATE_PREDICT_LIST', payload);
    },
    // 获取最新的schema字段描述信息(无需迁移即可看到)
    async getSchemaDescription() {
      await this.$store.dispatch('schemaModule/fetchSchemaDescription', {
        id: this.$route.query.schemaId || this.schemaId,
      });
    },
    updateAllAnswerCollapsed(status) {
      this.allAnswerCollapsed = status;
    },
    toggleAllAnswerCollapseState() {
      this.allAnswerCollapsed = !this.allAnswerCollapsed;
    },
  },
  async created() {
    if (Object.keys(this.schema.schemas[0].schema).length === 0) {
      this.$notify({
        title: this.$t(`message['提示']`),
        message: this.$text.schema['Schema暂无具体字段'],
        type: 'error',
      });
    }
    try {
      await this.getSchemaDescription();
    } catch (error) {
      this.$notify({
        title: this.$t(`message['错误']`),
        message: error.message,
        type: 'error',
      });
    }

    if (this.showDiffMarks) {
      EventBus.$on('remove-answer-item', this.answerItemBoxRemove);
      EventBus.$on('predict-node-position', this.predictNodePosition);
      EventBus.$on('update-predict-data', this.updatePredictList);
    }
  },
  beforeDestroy() {
    EventBus.$off('remove-answer-item', this.answerItemBoxRemove);
    EventBus.$off('predict-node-position', this.predictNodePosition);
    EventBus.$off('update-predict-data', this.updatePredictList);
  },
};
</script>

<style lang="scss" scoped>
.file-remark-answer {
  position: relative;
  height: 100%;

  &.loading {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: hsla(0, 0%, 100%, 0.9);
      transition: opacity 0.3s;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 101;
      transform: translate(-50%, -50%);
      font-size: 18px;
      color: #409eff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #fff;
      border-top-color: #07d;
      border-right-color: #07d;
      border-bottom-color: #07d;
      animation: spinner 1s linear infinite;
      opacity: 0.6;
    }

    @keyframes spinner {
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
  }
  .audit-helper {
    position: absolute;
    top: 0;
    right: 25px;
    .el-button {
      ::v-deep i {
        font-size: 18px;
      }
    }
  }
}

.item-label {
  display: flex;
  width: 100%;
  max-width: 360px;
  h4 {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & > span {
    width: 20px;
    margin-left: 5px;
  }
  .schema-item-add:hover {
    color: #999;
  }
}
.file-pdf-wrapper .toolbar {
  z-index: 1999 !important;
}
</style>
