<template>
  <el-dialog
    title="详情"
    :visible="visible"
    width="70%"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="handleClose">
    <div v-if="diffTextTotal.length > 0" class="text-diff-header">
      <el-button
        v-if="diffTextTotal.length > 1"
        size="mini"
        plain
        :disabled="diffIndex === 0"
        @click="jumpDiffText('prev')">
        上一个
      </el-button>
      <div class="num">
        {{ diffTextTotal.length === 0 ? 0 : diffIndex + 1 }}
        /
        {{ diffTextTotal.length }}
      </div>
      <el-button
        v-if="diffTextTotal.length > 1"
        size="mini"
        plain
        :disabled="diffIndex >= diffTextTotal.length - 1"
        @click="jumpDiffText('next')">
        下一个
      </el-button>
    </div>
    <div class="text-diff-container" ref="textDiffContainer">
      <div class="base">
        <h4>{{ baseTitle }}</h4>
        <h5 v-if="lawSource" class="law-source">{{ lawSource }}</h5>
        <p
          v-for="(paragraph, paragraphIndex) in diffText"
          :key="paragraphIndex"
          v-html="paragraph.left"
          class="base-paragraph"
          :class="getParagraphClassNames(paragraph, paragraphIndex)"></p>
      </div>
      <div class="diff">
        <h4>{{ diffTitle }}</h4>
        <p
          v-for="(paragraph, paragraphIndex) in diffText"
          class="paragraph-item"
          :class="getParagraphClassNames(paragraph, paragraphIndex)"
          :key="paragraphIndex"
          v-html="formatParagraphHtml(paragraph.html)"></p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ShowDiffDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    diffText: {
      type: Array,
      default: () => [],
    },
    baseTitle: {
      type: String,
      default: '',
    },
    diffTitle: {
      type: String,
      default: '',
    },
    lawSource: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      diffIndex: 0,
    };
  },

  computed: {
    diffTextTotal() {
      return this.diffText.filter((t) => t.type !== 'equal');
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.diffIndex = 0;
        this.$nextTick(() => {
          this.alignContentHeight();
          this.scrollToDiffText(0);
        });
      }
    },
    diffText() {
      this.$nextTick(() => {
        this.alignContentHeight();
      });
    },
  },

  methods: {
    handleClose() {
      this.diffIndex = 0;
      this.$emit('close');
    },
    formatParagraphHtml(html) {
      // 将换行符\n替换为<br/>，以便在 v-html 中正确渲染换行
      if (!html) return '';
      return String(html).replace(/\n/g, '<br/>');
    },
    getParagraphClassNames(paragraph, paragraphIndex) {
      const classNames = [];
      if (paragraph.type !== 'equal') {
        classNames.push('has-diff');
      }

      if (paragraph.is_top && paragraphIndex !== 0) {
        classNames.push('top-paragraph');
      }

      return classNames;
    },

    jumpDiffText(direction) {
      if (direction === 'prev') {
        this.diffIndex--;
      } else {
        this.diffIndex++;
      }
      this.scrollToDiffText(this.diffIndex);
    },

    alignContentHeight() {
      const diffContainer = this.$refs.textDiffContainer;
      if (!diffContainer) {
        return;
      }

      // 获取所有段落
      const baseParagraphs = diffContainer.querySelectorAll('.base > p');
      const diffParagraphs = diffContainer.querySelectorAll('.diff > p');

      if (baseParagraphs.length === 0 || diffParagraphs.length === 0) {
        return;
      }

      // 重置所有段落的高度
      [...baseParagraphs, ...diffParagraphs].forEach((p) => {
        p.style.minHeight = 'auto';
      });

      // 等待DOM更新后计算每对段落的高度
      this.$nextTick(() => {
        for (
          let i = 0;
          i < Math.max(baseParagraphs.length, diffParagraphs.length);
          i++
        ) {
          const baseParagraph = baseParagraphs[i];
          const diffParagraph = diffParagraphs[i];

          if (baseParagraph && diffParagraph) {
            const baseHeight = baseParagraph.scrollHeight;
            const diffHeight = diffParagraph.scrollHeight;
            const maxHeight = Math.max(baseHeight, diffHeight);

            // 设置相同的最小高度
            baseParagraph.style.minHeight = `${maxHeight}px`;
            diffParagraph.style.minHeight = `${maxHeight}px`;
          }
        }
      });
    },

    scrollToDiffText(index) {
      const diffContainer = this.$refs.textDiffContainer;
      if (!diffContainer) {
        return;
      }

      const allBaseTextDoms =
        diffContainer.querySelectorAll('.base > p.has-diff');
      const allDiffTextDoms =
        diffContainer.querySelectorAll('.diff > p.has-diff');

      [...allBaseTextDoms, ...allDiffTextDoms].forEach((dom) => {
        dom.classList.remove('active');
      });

      if (allDiffTextDoms[index]) {
        // 滚动到容器顶部，确保目标元素在可视区域顶部
        const targetElement = allDiffTextDoms[index];
        const containerRect = diffContainer.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const scrollTop =
          diffContainer.scrollTop + targetRect.top - containerRect.top - 50; // 增加50px的顶部间距，避免滚动过多

        diffContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });

        allBaseTextDoms[index].classList.add('active');
        allDiffTextDoms[index].classList.add('active');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.text-diff-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .num {
    margin: 0 10px;
  }
}

.text-diff-container {
  display: flex;
  max-height: 60vh;
  overflow-y: auto;
  line-height: 26px;
  align-items: flex-start; /* 顶部对齐 */

  h4 {
    position: sticky;
    top: 0;
    margin-bottom: 10px;
    background: #fff;
    text-align: center;
  }

  .law-source {
    position: sticky;
    top: 25px;
    font-size: 13px;
    background-color: #fff;
  }

  .base {
    width: 50%;
    min-height: 100%; /* 确保最小高度 */
    display: flex;
    flex-direction: column;

    .base-paragraph {
      white-space: pre-line;
    }
  }

  ::v-deep .diff {
    width: 50%;
    min-height: 100%; /* 确保最小高度 */
    margin-left: 20px;
    padding-left: 20px;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;

    s {
      text-decoration: line-through;
      text-decoration-color: #ff4949;
    }

    u {
      color: #14b35b;
      text-decoration: underline;
      text-decoration-color: #14b35b;
    }
  }

  .top-paragraph {
    margin-top: 26px;
  }

  .has-diff {
    background: rgba(#557de6, 0.2);

    &.active {
      background: rgba(0, 191, 255, 0.4);
    }
  }
}
</style>
