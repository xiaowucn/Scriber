<template>
  <div class="text-extractor-container" v-loading="loading" v-if="!readonly">
    <span>说明：请在下面划取原法规后点击【变更】即可</span>
    <div
      ref="textContainer"
      class="text-content"
      contenteditable="false"
      @mouseup="handleMouseUp">
      <div v-html="content"></div>
    </div>
    <h3 class="result-title">划取结果：</h3>
    <div class="result-box">
      <ol
        v-if="extractedResult && extractedResult.length > 0"
        class="result-list">
        <li
          v-for="(item, index) in extractedResult"
          :key="index"
          class="result-item">
          <span class="result-text">{{ item }}</span>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="removeResultItem(index)"
            class="delete-btn">
          </el-button>
        </li>
      </ol>
      <p v-else class="empty-text">暂无划取片段</p>
    </div>
    <div class="dialog-footer">
      <el-button @click="close" size="small">取消</el-button>
      <el-button
        type="primary"
        :disabled="extractedResult.length === 0"
        @click="handleConfirm"
        size="small">
        变更
      </el-button>
    </div>
  </div>
  <div class="text-extractor-container" v-loading="loading" v-else>
    <div class="text-content readonly" contenteditable="false">
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    oldContent: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      extractedResult: [],
    };
  },
  methods: {
    unwrapElement(element) {
      if (!element || !element.parentNode) {
        return;
      }
      const parent = element.parentNode;

      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }

      parent.removeChild(element);
    },

    handleMouseUp() {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }

      const range = selection.getRangeAt(0);

      const textContainerEl = this.$refs.textContainer;

      if (
        !textContainerEl ||
        !textContainerEl.contains(range.commonAncestorContainer)
      ) {
        return;
      }

      if (selection.toString().trim() === '') {
        return;
      }

      const existingSpans = textContainerEl.querySelectorAll('.bordered-text');

      for (let i = 0; i < existingSpans.length; i++) {
        const span = existingSpans[i];
        const spanRange = document.createRange();
        spanRange.selectNodeContents(span);
        if (selection.containsNode(span)) {
          this.unwrapElement(span);
        }
        if (range.intersectsNode(span)) {
          selection.removeAllRanges();
          return;
        }
      }
      const newSpan = document.createElement('span');
      newSpan.className = 'bordered-text';

      try {
        range.surroundContents(newSpan);
      } catch (e) {
        console.warn(
          '无法直接包裹内容 (选择可能跨越复杂节点或不连续)。请尝试重新选择。',
          e,
        );
      } finally {
        selection.removeAllRanges();
        this.extractAllBorderedText();
      }
    },
    extractAllBorderedText() {
      const textContainerEl = this.$refs.textContainer;
      const borderedElements =
        textContainerEl.querySelectorAll('.bordered-text');
      let collectedTexts = [];

      borderedElements.forEach((el) => {
        collectedTexts.push(el.textContent);
      });

      if (collectedTexts.length > 0) {
        this.extractedResult = collectedTexts;
      } else {
        this.extractedResult = [];
      }
    },
    clearAllBorders() {
      const textContainerEl = this.$refs.textContainer;
      const borderedElements =
        textContainerEl.querySelectorAll('.bordered-text');
      borderedElements.forEach((span) => {
        this.unwrapElement(span);
      });
      this.extractedResult = [];
      window.getSelection().removeAllRanges();
    },
    close() {
      this.$emit('close');
    },
    handleConfirm() {
      if (this.extractedResult.join('') === this.oldContent) {
        this.$notify({
          title: '提示',
          message: '法规内容无变更，无须更新',
          type: 'warning',
        });
        return;
      }
      this.$emit('confirm', this.extractedResult);
    },
    removeResultItem(index) {
      const textContainerEl = this.$refs.textContainer;
      const existingSpans = textContainerEl.querySelectorAll('.bordered-text');

      // 删除对应的 bordered-text 元素
      if (existingSpans[index]) {
        this.unwrapElement(existingSpans[index]);
      }

      // 从结果数组中删除对应项
      this.extractedResult.splice(index, 1);
    },
  },
  watch: {
    content(newContent, oldContent) {
      if (newContent !== oldContent && !this.readonly) {
        this.clearAllBorders();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.text-extractor-container {
  padding: 0 10px 10px;
  max-width: 800px;
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.text-content {
  border: 1px solid #ddd;
  padding: 20px;
  line-height: 26px;
  user-select: text;
  -moz-user-select: text;
  -webkit-user-select: text;
  white-space: pre-wrap;
  position: relative;
  height: 140px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.readonly {
  height: 100%;
}

::v-deep .bordered-text {
  position: relative;
  border: 2px dashed #007bff;
  padding: 2px 0;
  margin: -2px 0;
  background-color: rgba(0, 123, 255, 0.1);
  box-sizing: border-box;
}

.result-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.result-box {
  border: 1px dashed #bbb;
  padding: 15px;
  background-color: #f0f0f0;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: 165px;
  overflow-y: auto;
  margin-bottom: 20px;

  .empty-text {
    margin: 0;
    color: #999;
    text-align: center;
    line-height: 110px;
  }

  .result-list {
    margin: 0;

    .result-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 8px 12px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #e4e7ed;

      &:last-child {
        margin-bottom: 0;
      }

      .result-text {
        flex: 1;
        margin-right: 10px;
        word-break: break-all;
        line-height: 1.4;
      }

      .delete-btn {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        padding: 0;

        ::v-deep .el-icon-delete {
          font-size: 12px;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
}
</style>
