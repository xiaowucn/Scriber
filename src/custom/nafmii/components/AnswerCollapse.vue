<template>
  <div class="answer-collapse">
    <el-collapse accordion ref="collapse" @change="handleChangeCollapse">
      <el-collapse-item
        v-for="answer in answers"
        :key="answer.key"
        :disabled="answer.items.length === 0"
        :class="collapseItemClass(answer)">
        <template slot="title">
          <div class="title">
            <div class="left">
              <span class="key">{{ answer.key }}</span>
            </div>
            <div class="right">
              <span v-if="isShowNumber" class="number">
                {{ answer.items.length }}
              </span>
              <slot name="equal" :answer="answer"></slot>
            </div>
          </div>
        </template>
        <answer-collapse-content
          ref="answer"
          :answer="answer"
          :isShowComment="isShowComment"
          :getAnswerItemLabel="getAnswerItemLabel"
          :selectedType="selectedType"
          :selectedAnswerKey="selectedAnswerKey"
          :selectedItemIndex="selectedItemIndex"
          @selected="handleAnswerItemSelected"
          @answer-updated="handleUpdateAnswers">
          <template slot="notExtract" slot-scope="props">
            <slot name="notExtract" :item="props.item"></slot>
          </template>
        </answer-collapse-content>
      </el-collapse-item>
    </el-collapse>
    <el-empty v-if="answers.length === 0"></el-empty>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import AnswerCollapseContent from './AnswerCollapseContent.vue';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'answer-collapse',
  components: { AnswerCollapseContent },
  props: {
    answers: {
      type: Array,
      required: true,
    },
    isShowNumber: {
      type: Boolean,
      default: true,
    },
    isShowComment: {
      type: Boolean,
      default: true,
    },
    getAnswerItemLabel: {
      type: Function,
      required: false,
      default: () => '',
    },
    getCollapseItemClass: {
      type: Function,
      required: false,
      default: () => '',
    },
    selectedType: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      selectedAnswerKey: null,
      selectedItemIndex: null,
    };
  },
  watch: {
    remarkTab() {
      this.resetActiveCollapse();
      this.resetAnswerItemSelected();
    },
    '$route.query'() {
      this.resetActiveCollapse();
    },
  },
  computed: {
    ...mapGetters('remarkModule', ['remarkTab']),

    collapseItemClass() {
      return (answer) => this.getCollapseItemClass(answer);
    },
  },
  methods: {
    handleAnswerItemSelected({ key, index }) {
      this.selectedAnswerKey = key;
      this.selectedItemIndex = index;
    },
    resetAnswerItemSelected() {
      this.selectedAnswerKey = null;
      this.selectedItemIndex = null;
      EventBus.$emit('remove-all-frames');
    },
    resetActiveCollapse() {
      this.$refs.collapse.setActiveNames();
    },
    handleChangeCollapse() {
      this.$refs.answer?.forEach((ref) => {
        ref.resetPage();
      });
    },
    handleUpdateAnswers(updatedAnswer, type) {
      const newAnswers = _.clone(this.answers);
      const index = newAnswers.findIndex(
        (answer) => answer.key === updatedAnswer.key,
      );
      newAnswers[index] = updatedAnswer;
      this.$emit('update-answers', newAnswers, type);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.answer-collapse {
  overflow: auto;
  padding: 0 20px;
  ::v-deep .el-collapse {
    .el-collapse-item {
      &.is-active {
        .el-collapse-item__header {
          box-shadow: 0 1px 0 #ebeef5;
          &::before {
            background-color: $--color-primary;
          }
          .title {
            .key {
              -webkit-line-clamp: unset;
            }
          }
        }
      }
      &.is-disabled {
        .el-collapse-item__arrow {
          visibility: hidden;
        }
      }
    }
    .el-collapse-item__header {
      font-weight: 400;
      min-height: 52px;
      height: fit-content;
      line-height: 1.4;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background-color: transparent;
      }
    }
    .el-collapse-item__content {
      padding-bottom: 0px;
      .el-pagination {
        padding: 10px 25px;
        text-align: right;
      }
    }
  }
  .title {
    width: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .key {
      font-size: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
    }
    .number {
      padding: 0px 2px;
      min-width: 16px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $--color-primary;
      background: $--color-primary-light-2;
      border-radius: 4px;
    }
  }
}
</style>
