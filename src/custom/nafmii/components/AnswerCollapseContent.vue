<template>
  <div>
    <ul class="answer">
      <li
        v-for="(item, index) in currentPageItems"
        :key="index"
        :class="{
          'is-selected': isAnswerItemSelected(item),
        }">
        <slot name="notExtract" :item="item"></slot>
        <div v-if="item.data.length !== 0">
          <div class="answer-title">
            <span class="chapter">{{ answerItemChapter(item) }}</span>
            <span class="pager">页码: {{ answerItemPage(item.data[0]) }}</span>
            <div v-if="isShowCommentOperations" class="comment-operations">
              <el-tooltip
                v-if="isShowUndoCommentBtn(item)"
                content="撤销批注"
                placement="bottom">
                <el-button
                  type="text"
                  class="comment-btn"
                  @click="undoComment(index)">
                  <svg-font-icon name="undo" />
                </el-button>
              </el-tooltip>
              <el-tooltip v-else content="添加批注" placement="bottom">
                <el-button
                  type="text"
                  class="comment-btn"
                  @click="addComment(index)">
                  <svg-font-icon name="edit" />
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="answer-content" @click="selectAnswerItem(item, answer)">
            <span class="text">{{ answerItemText(item.data[0]) }}</span>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination
      v-if="pager.total > pager.size"
      small
      layout="total, prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage">
    </el-pagination>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { isFileSourceByLocalUpload } from '../common/utils';
import { COMMENT_OPERATION_MAP } from '../common/constant';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'answer-collapse-content',
  props: {
    answer: {
      type: Object,
      required: true,
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
    selectedAnswerKey: {
      type: String,
      default: null,
    },
    selectedItemIndex: {
      type: Number,
      default: null,
    },
    selectedType: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      pager: {
        page: 1,
        size: 6,
        total: 0,
      },
    };
  },
  watch: {
    answer: {
      handler() {
        this.pager.total = this.answer.items.length;
      },
      immediate: true,
    },
    '$route.query'() {
      this.pager.page = 1;
    },
  },
  computed: {
    ...mapGetters('remarkModule', ['remarkFile']),

    newAnswer() {
      return _.cloneDeep(this.answer);
    },
    currentPageItems() {
      const { page, size } = this.pager;
      const start = (page - 1) * size;
      const end = page * size;
      return this.newAnswer.items.slice(start, end).map((item, index) => ({
        ...item,
        originalIndex: start + index,
      }));
    },
    answerItemChapter() {
      return (item) => item.positions[0];
    },
    answerItemPage() {
      return (data) => data.boxes[0].page + 1;
    },
    answerItemText() {
      return (data) => data.text || data.boxes.map((box) => box.text).join('');
    },
    isShowCommentOperations() {
      return (
        this.isShowComment &&
        this.remarkFile &&
        isFileSourceByLocalUpload(this.remarkFile.source)
      );
    },
    isShowUndoCommentBtn() {
      return (item) => item.operation === COMMENT_OPERATION_MAP.add;
    },
    isAnswerItemSelected() {
      return (item) =>
        this.selectedAnswerKey === this.answer.key &&
        this.selectedItemIndex === item.originalIndex;
    },
  },
  methods: {
    handleChangePage(page) {
      this.pager.page = page;
    },
    resetPage() {
      this.handleChangePage(1);
    },
    selectAnswerItem(item, answer) {
      this.$emit('selected', {
        key: answer.key,
        index: item.originalIndex,
      });
      EventBus.$emit('answer-item-selected', {
        index: 0,
        schemaNode: null,
        schema: { data: { label: this.getAnswerItemLabel({ item, answer }) } },
        data: item.data[0],
        detail: [],
        isSelectAnswerWithoutSchemaNode: true,
        subType: this.selectedType,
      });
    },
    getItemIndex(index) {
      const { page, size } = this.pager;
      return (page - 1) * size + index;
    },
    undoComment(index) {
      const type = '撤销批注';
      const itemIndex = this.getItemIndex(index);
      this.newAnswer.items[itemIndex].operation = COMMENT_OPERATION_MAP.undo;
      this.$emit('answer-updated', this.newAnswer, type);
    },
    addComment(index) {
      const type = '添加批注';
      const itemIndex = this.getItemIndex(index);
      this.newAnswer.items[itemIndex].operation = COMMENT_OPERATION_MAP.add;
      this.$emit('answer-updated', this.newAnswer, type);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.answer {
  list-style: none;
  li {
    padding: 8px 10px;
    border-bottom: 1px solid #f0f0f2;
    background-color: #fafafa;
    &:hover {
      background-color: #f6f7fa;
    }
    .answer-title {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      margin-bottom: 5px;
      font-size: 12px;
      color: $--color-text-regular;
      .chapter {
        margin-right: 10px;
      }
      .pager {
        white-space: nowrap;
      }
      .comment-operations {
        display: flex;
        align-items: center;
        margin-left: 10px;
        .comment-btn {
          padding: 0px;
          &.el-button--text {
            color: $--color-text-regular;
            &:hover {
              color: $--color-primary;
            }
          }
        }
      }
    }
    .answer-content {
      font-size: 14px;
      .text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
    }
    &.is-selected {
      background-color: $--color-primary-light-2;
      .answer-content {
        .text {
          color: $--color-primary;
        }
      }
    }
  }
}
</style>
