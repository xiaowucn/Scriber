<template>
  <div v-if="schemaNode" class="remark-chapter-assist">
    <div class="schema-node-title">
      <span>{{ schemaNode.data.label }}</span>
      <i class="el-icon-close" @click="close" />
    </div>
    <div class="schema-node-setting">
      <div
        class="schema-node-setting-item"
        v-for="childNode in schemaNode.children"
        :key="childNode.data.label">
        <span class="label">{{ childNode.data.label }}</span>
        <div class="operation">
          <el-button
            v-if="
              chapterNode && chapterNode.data.label === childNode.data.label
            "
            type="danger"
            size="small"
            @click="setChapterNode(null)"
            >取消</el-button
          >
          <el-button
            v-else
            type="success"
            size="small"
            @click="setChapterNode(childNode)"
            >设为标题</el-button
          >
          <el-button
            v-if="
              contentNode && contentNode.data.label === childNode.data.label
            "
            type="danger"
            size="small"
            @click="setContentNode(null)"
            >取消</el-button
          >
          <el-button
            v-else
            type="success"
            size="small"
            @click="setContentNode(childNode)"
            >设为内容</el-button
          >
        </div>
      </div>
    </div>
    <div class="chapter-node-remark">
      <div v-if="chapterNode" class="label">
        标题：{{ chapterNode.data.label }}
      </div>
      <div
        v-for="(item, index) in chapterRemarkData"
        :key="index"
        class="schema-node-answer">
        <p
          :class="{ active: index === chapterRemarkItemSelectedIndex }"
          @click="selectChapterRemarkItem(index)">
          {{ item.text }}
        </p>
        <i
          class="far fa-times-circle"
          @click="removeChapterRemarkItem(index)" />
      </div>
    </div>
    <div class="chatper-assis-operation">
      <el-button size="mini" @click="close"> 取消 </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="submit"
        :disabled="
          !chapterNode ||
          !contentNode ||
          chapterRemarkData.length === 0 ||
          submitting
        "
        :loading="submitting">
        生成标注
      </el-button>
    </div>
  </div>
</template>
<script>
import EventBus from '@/components/remark/remark-tree/EventBus';
import { mixDeepInfo } from '@/utils';

export default {
  name: 'remark-chapter-assist',
  created() {
    EventBus.$on('open-chapter-assist-remark', this.initData);
    EventBus.$on('create-chapter-assist-answer-item', this.createAnswer);
  },
  destroyed() {
    EventBus.$off('open-chapter-assist-remark', this.initData);
    EventBus.$off('create-chapter-assist-answer-item', this.createAnswer);
  },
  data() {
    return {
      schemaNode: null,
      schemaNodeKey: '',
      paramsExtra: {},
      chapterNode: null,
      contentNode: null,
      chapterRemarkData: [],
      chapterRemarkItemSelectedIndex: -1,
      submitting: false,
    };
  },
  methods: {
    initData({ model, modelKey, ...paramsExtra }) {
      this.schemaNodeKey = modelKey;
      this.schemaNode = model;
      this.paramsExtra = paramsExtra;
    },
    setChapterNode(node) {
      this.chapterNode = node;
      this.chapterRemarkData = [];

      if (
        this.contentNode &&
        node &&
        this.contentNode.data.label === node.data.label
      ) {
        this.contentNode = null;
      }

      if (node) {
        EventBus.$emit('schema-node-selected', {
          key: JSON.stringify(mixDeepInfo(node.meta)),
          model: node,
          ignoreAnswer: true,
        });
      }
    },
    setContentNode(node) {
      this.contentNode = node;
      if (
        this.chapterNode &&
        node &&
        this.chapterNode.data.label === node.data.label
      ) {
        this.chapterNode = null;
      }
    },
    createAnswer({ boxes }) {
      const answer = {
        ...boxes[0],
        text: boxes.map((box) => box.text).join(''),
      };
      this.chapterRemarkData.push(answer);
    },
    selectChapterRemarkItem(index) {
      this.chapterRemarkItemSelectedIndex = index;

      const answer = this.chapterRemarkData[index];
      EventBus.$emit('answer-item-selected', {
        schemaNode: JSON.stringify(mixDeepInfo(this.chapterNode.meta)),
        schema: { data: { label: this.chapterNode.data.label } },
        data: { boxes: [answer] },
      });
    },
    removeChapterRemarkItem(index) {
      if (this.chapterRemarkItemSelectedIndex === index) {
        this.chapterRemarkItemSelectedIndex = -1;
      }
      this.chapterRemarkData.splice(index, 1);

      EventBus.$emit('remove-all-frames');
    },
    async submit() {
      const title = this.chapterNode.meta._deepLabels.join(':');
      const content = this.contentNode.meta._deepLabels.join(':');

      const data = {
        structure: {
          title,
          content,
        },
        labels: this.chapterRemarkData.map((item) => ({
          [title]: {
            box: {
              box: [
                item.box.box_left,
                item.box.box_top,
                item.box.box_right,
                item.box.box_bottom,
              ],
              page: item.page,
            },
            text: item.text,
          },
        })),
      };

      try {
        this.submitting = true;

        const res = await this.$store.dispatch(
          'remarkModule/fetchChapterAssistAnswer',
          { questionId: this.$route.params.qid, data },
        );

        const answerData = res.data;

        EventBus.$emit('create-chapter-content-answer', {
          schemaNode: this.schemaNodeKey,
          data: answerData,
          ...this.paramsExtra,
        });

        this.close();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message || '获取标题内容失败',
          type: 'error',
        });
        console.error(error);
      } finally {
        this.submitting = false;
      }
    },
    reset() {
      this.schemaNode = null;
      this.schemaNodeKey = '';
      this.paramsExtra = {};
      this.chapterNode = null;
      this.contentNode = null;
      this.chapterRemarkData = [];
      this.chapterRemarkItemSelectedIndex = -1;
    },
    close() {
      this.reset();
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
.remark-chapter-assist {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  background: #f6f6f6;

  .schema-node-title {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;

    span,
    i {
      font-size: 16px;
    }
    .el-icon-close {
      cursor: pointer;
      &:hover {
        color: #777;
      }
    }
  }

  .schema-node-setting {
    display: flex;
    flex-flow: column;
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;

    & > * + * {
      margin-top: 10px;
    }

    .schema-node-setting-item {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .label {
        flex: 1;
      }

      button {
        padding: 2px 5px;
        font-size: 12px;
        margin: 0 5px;
      }
    }
  }

  .chapter-node-remark {
    flex: 1;
    display: flex;
    flex-flow: column;
    padding: 10px;
    overflow: auto;
    & > * + * {
      margin-top: 10px;
    }

    .schema-node-answer {
      display: flex;
      align-items: center;
      width: 100%;

      p {
        flex: 1;
        padding: 4px 8px;
        border: 1px solid #a2cffc;
        border-radius: 4px;
        background: #fff;

        &.active {
          background: #bbdcfd;
        }
      }

      .far {
        padding: 8px;
        font-size: 16px;
        color: #f56c6c;
        cursor: pointer;
      }
    }
  }

  .chatper-assis-operation {
    display: flex;
    justify-content: flex-end;
    margin: 16px;
  }
}
</style>
