<template>
  <li
    v-if="answerItem"
    class="user-answer-wrapper"
    :class="{
      'is-selected': isSelected,
      'is-diff': isItemDiff,
      'is-add': isItemAdd,
    }"
    :data-md5="answerItemMd5"
    @click.stop="answerItemClick()">
    <div
      @dblclick="intoEditModel"
      v-if="!isEditModel"
      class="user-answer"
      ref="userAnswer">
      <p>
        <span class="answer-text" :data-uuid="uuid" :data-index="index">
          <span v-if="isLatexFormula" v-katex>{{ answerTextWithLatex }}</span>
          <template v-else>{{ answerText }}</template>
        </span>
        <template v-if="showDiffMarks">
          <svg-font-icon
            v-if="$platform.isDefaultEnv()"
            name="edit"
            :size="16"
            @click.native.stop="intoEditModel"></svg-font-icon>
          <i
            v-else
            class="far fa-edit fa-fw edit-icon"
            @click.stop="intoEditModel"></i>
        </template>
        <amount-converter
          :answer-data="{ answerItem, schema }"></amount-converter>
      </p>
      <div class="answer-item-close" v-if="showDiffMarks">
        <svg-font-icon
          v-if="$platform.isDefaultEnv()"
          name="delete"
          color="#606266"
          hover-color="#f56c6c"
          :size="16"
          @click.native.stop="removeAnswerBox()"></svg-font-icon>
        <i
          v-else
          class="far fa-times-circle"
          @click.stop="removeAnswerBox()"></i>
      </div>
    </div>
    <div v-else class="edit-answer">
      <el-input
        type="textarea"
        v-model="tempAnswerText"
        size="mini"
        ref="answerInput"
        @keydown.native.esc="setEditModel(false)"></el-input>
      <div class="btns">
        <el-button size="mini" @click="setEditModel(false)">{{
          $t(`message['取消']`)
        }}</el-button>
        <el-button type="primary" size="mini" @click="saveAnswerText">{{
          $t(`message['确定']`)
        }}</el-button>
      </div>
    </div>
  </li>
</template>

<script>
import EventBus from './remark-tree/EventBus';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import AmountConverter from '../../custom/ht/components/AmountConverter';
import { FIELD_STATUS_MAP } from '../../custom/cmfchina/common/constant.js';
import { getWidgetClassNames } from '../../custom/cmfchina/common/utils.js';
import { getAnswerItemMd5 } from '../../utils';
import VueKatex, {
  hasMathDelimiter,
  isLatexLike,
} from '@/utils/katexAutoRender';

export default {
  name: 'answer-item',
  components: { AmountConverter },
  directives: { katex: VueKatex },
  props: {
    index: {
      type: Number,
      required: true,
    },
    dataIndex: {
      type: Number,
      required: true,
    },
    schemaNode: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
    },
    schema: {
      type: Object,
      required: true,
    },
    answerItem: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
    removeAnswerFn: {
      type: Function,
      required: false,
    },
    editAnswerFn: {
      type: Function,
      required: false,
    },
    selectAnswerItemFn: {
      type: Function,
      required: false,
    },
    modelAnswer: {
      type: String,
      required: false,
    },
    diffResult: {
      type: Boolean,
      required: false,
    },
    showDiffMarks: {
      type: Boolean,
      default: true,
    },
    detail: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    similarity: {
      type: Number,
      default: 1,
      required: false,
    },
    cls: {
      type: Array,
      default: () => [],
      required: false,
    },
    fieldStatus: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      isEditModel: false,
      tempAnswerText: '',
      SIMILARITY_THRESHOLD: 0.75,
      SIMILARITY_SAME: 1,
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['schemas']),
    answerText() {
      return (
        this.modelAnswer ||
        this.answerItem.text ||
        this.answerItem.boxes?.map((box) => box.text).join('')
      );
    },
    answerTextWithLatex() {
      if (hasMathDelimiter(this.answerText)) {
        return this.answerText;
      }
      return `$$${this.answerText}$$`;
    },
    isLatexFormula() {
      return isLatexLike(this.answerText);
    },
    pairIndex() {
      return this.answerItem.pair_index;
    },
    answerSimilarity() {
      return this.answerItem.similarity;
    },
    isItemDiff() {
      return (
        this.showDiffMarks &&
        (this.diffResult === false ||
          (this.similarity > this.SIMILARITY_THRESHOLD &&
            this.similarity < this.SIMILARITY_SAME &&
            _.isNil(this.pairIndex)) ||
          (this.answerSimilarity > this.SIMILARITY_THRESHOLD &&
            this.answerSimilarity < this.SIMILARITY_SAME))
      );
    },
    isItemAdd() {
      return (
        (this.similarity < this.SIMILARITY_THRESHOLD &&
          _.isNil(this.pairIndex)) ||
        this.answerSimilarity < this.SIMILARITY_THRESHOLD ||
        this.pairIndex === null
      );
    },
    answerItemMd5() {
      return getAnswerItemMd5(this.schemaNode, this.answerItem);
    },
  },
  watch: {
    cls: {
      handler() {
        this.setDiffStyle();
      },
      immediate: true,
    },
  },
  created() {
    // 如果有改动的答案，则显示改动的答案，否则显示每一个box中的文本
    EventBus.$on('close-all-answer-editor', this.exitEditModel);
    EventBus.$on('page-rendered', this.onPageRendered);
    EventBus.$on('after-widget-clicked', this.handleWidgetClicked);
    EventBus.$on('after-cell-selected', this.handleExcelCellSelected);
    EventBus.$on('viewer-ready', this.onVierwerReady);
    document.addEventListener('click', this.blankClick);
  },
  beforeDestroy() {
    EventBus.$off('close-all-answer-editor', this.exitEditModel);
    EventBus.$off('page-rendered', this.onPageRendered);
    EventBus.$off('after-widget-clicked', this.handleWidgetClicked);
    EventBus.$off('after-cell-selected', this.handleExcelCellSelected);
    EventBus.$off('viewer-ready', this.onVierwerReady);
    document.removeEventListener('click', this.blankClick);
  },
  mounted() {
    this.onVierwerReady();
  },
  methods: {
    blankClick: _.debounce(() => {
      EventBus.$emit('close-all-answer-editor');
    }, 100),
    removeAnswerBox() {
      if (this.removeAnswerFn) {
        this.removeAnswerFn(this.index, this.answerItemMd5);
      }
    },
    answerItemClick(jumpToPage = true) {
      const subType = this.$platform.isCmfchinaEnv()
        ? this.fieldStatus === FIELD_STATUS_MAP.FAIL_AUDIT
          ? 'red'
          : 'active'
        : '';

      let data = this.answerItem;
      if (this.answerItem.items) {
        data = {
          text: this.answerItem.items[this.dataIndex].text,
          boxes: this.answerItem.items[this.dataIndex].boxes,
        };
      }

      EventBus.$emit('answer-item-selected', {
        index: this.index,
        schemaNode: this.schemaNode,
        schema: this.schema,
        data: data,
        detail: this.detail,
        target: this,
        jumpToPage,
        subType,
        meta: {
          key: this.schemaNode,
          md5: this.answerItemMd5,
          fieldStatus: this.fieldStatus,
          classNames: getWidgetClassNames(
            this.fieldStatus === FIELD_STATUS_MAP.FAIL_AUDIT,
          ),
        },
      });

      if (this.$platform.isCmfchinaEnv()) {
        if (!this.isSelected) {
          const answerItemSelected = document.querySelector(
            `.user-answer-wrapper.is-selected`,
          );
          if (answerItemSelected) {
            answerItemSelected.classList.remove('is-selected');
            answerItemSelected
              .closest('.answer-item')
              .classList.remove('schema-node-selected');
          }
        }
      }

      // 点击答案条目时需要将当前schema字段选中，以便在当前schema字段下画框标注
      if (this.selectAnswerItemFn) {
        this.selectAnswerItemFn(this.answerItem);
      }

      this.$nextTick(() => {
        const diffClass = '.file-remark-diff-wrapper';
        const baseClass = '.file-remark-base';
        let remarkWrapperSelector;
        if (this.showDiffMarks) {
          if (document.querySelector(baseClass)) {
            remarkWrapperSelector = diffClass;
          }
        } else {
          if (document.querySelector(diffClass)) {
            remarkWrapperSelector = baseClass;
          }
        }
        const answerItemSelected = document.querySelector(
          `${remarkWrapperSelector} .user-answer-wrapper.is-selected`,
        );
        if (answerItemSelected) {
          answerItemSelected.scrollIntoView({ block: 'end' });
        }
      });
    },
    exitEditModel() {
      this.setEditModel(false);
    },
    async intoEditModel() {
      // 对比文档时基准文档的answer-item不允许双击进入编辑模式
      if (!this.showDiffMarks) {
        return;
      }

      const answerTextHeight = this.$refs.userAnswer.clientHeight + 'px';
      EventBus.$emit('close-all-answer-editor');
      this.tempAnswerText =
        this.answerItem.text ||
        this.answerItem.boxes.map((box) => box.text).join('');
      this.setEditModel(true);
      await this.$nextTick();
      this.$refs.answerInput.$el.children[0].style.height = answerTextHeight;
      this.$refs.answerInput.focus();
    },
    setEditModel(isEditModel) {
      this.isEditModel = isEditModel;
    },
    saveAnswerText() {
      if (this.editAnswerFn) {
        this.editAnswerFn({ index: this.index, text: this.tempAnswerText });
      }
      this.exitEditModel();
    },
    setDiffStyle() {
      this.$nextTick(() => {
        const allItems = document.querySelectorAll('.answer-item');
        if (allItems.length > 0) {
          allItems.forEach((el) => {
            if (!el.querySelector('.node-title')) {
              if (el.querySelector('.is-add')) {
                el.classList.add('add-answer');
              }
              if (el.querySelector('.is-diff')) {
                el.classList.add('diff-answer');
              }
              if (el.querySelector('.node-sticky')) {
                el.classList.add('first-node');
              }
              if (el.querySelector('.node-sticky-2')) {
                el.classList.add('second-node');
              }
            }
          });
        }
      });
    },
    onPageRendered(page) {
      if (this.$platform.isCmfchinaEnv()) {
        setTimeout(() => {
          this.autoClickAnswerItem(page);
        });
      }
    },
    autoClickAnswerItem(page) {
      if (page !== this.answerItem.boxes[0].page) {
        return;
      }
      if (this.schemaNode === this.$route.query.key) {
        this.answerItemClick();
        this.$el.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    },
    handleWidgetClicked(widget) {
      const { md5 } = widget.data.meta || {};
      if (this.answerItemMd5 === md5) {
        this.answerItemClick(false);
        this.$el.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    },
    handleExcelCellSelected(
      { key, sheet_name, cell },
      selectedAnswerKey,
      isEditMode,
    ) {
      if (isEditMode) {
        if (this.schemaNode === selectedAnswerKey) {
          this.answerItemClick(false);
        }
        return;
      }

      const sheetName = this.answerItem.sheet_name;
      const { row, col } = this.answerItem.cell;
      if (
        this.schemaNode === key &&
        sheetName === sheet_name &&
        row === cell.row &&
        col === cell.col
      ) {
        this.answerItemClick(false);
        this.$el.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    },
    onVierwerReady() {
      if (this.$platform.isCmfchinaEnv()) {
        if (this.schemaNode === this.$route.query.key) {
          this.$nextTick(() => {
            this.answerItemClick();
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import './remark-tree/RemarkTree.scss';

@mixin like-btn($color: teal) {
  color: $color;
  cursor: pointer;

  &:hover {
    color: mix(#fff, $color, 50%);
  }
}

.user-answer-wrapper {
  display: block;
  width: 88%;
  border: 1px solid $itemBorderColor;
  border-radius: 4px;
  position: relative;
  padding: 0.3em 0.8em;
  min-height: 29px;
  box-sizing: border-box;
  cursor: default;
  margin: 4px 0 4px 17px;
  transition: all 0.15s;
  background: #fff;

  &.is-selected {
    background-color: #7addff !important;
  }
  &.is-diff {
    border: 2px solid #f56c6c !important;
  }
  &.is-add {
    border: 2px solid rgb(0, 255, 0) !important;
  }

  &:hover {
    background: $itemHoverBGColor !important;
  }

  .user-answer {
    .answer-text {
      word-wrap: break-word;
      white-space: pre-line;
      ::v-deep .highlight {
        background: #feff00;
        &.active {
          background: #fe9633;
        }
      }
      ::v-deep .katex-display {
        margin: 0;
        .katex {
          padding: 10px 0;
          font-size: 12px;
          overflow-x: auto;
          overflow-y: hidden;
          &::-webkit-scrollbar {
            height: 5px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            &:hover {
              background-color: rgba(0, 0, 0, 0.3);
            }
          }
          &::-webkit-scrollbar-track {
            display: none;
          }
        }
      }
    }
    .edit {
      display: inline-block;
      vertical-align: 1px;
      ::v-deep .svg-font-icon {
        fill: $--color-primary !important;
      }
    }
    .edit-icon {
      @include like-btn(#409eff);
    }
    .pd-icon-edit {
      color: $--color-primary !important;
      vertical-align: -2px;
    }
  }
  .edit-answer {
    padding: 0;
    ::v-deep textarea {
      padding: 0;
      border: none;
      resize: none;
      font-size: 16px;
      line-height: 1.4;
    }
    .btns {
      margin-top: 5px;
      .el-button {
        padding: 3px 8px;
        font-weight: normal;
      }
    }
  }
  .answer-item-close {
    position: absolute;
    top: 9px;
    right: -25px;
  }
}
</style>
