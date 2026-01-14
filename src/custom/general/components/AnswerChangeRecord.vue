<template>
  <el-dialog
    title="变更记录"
    width="600px"
    :visible="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="close">
    <div class="answer-change-record">
      <ul class="navs">
        <li
          v-for="(record, index) in records"
          :key="index"
          :class="{ active: index === recordIndex }"
          @click="recordItemClicked(index)">
          <template v-if="index === 0 && records.length > 1">
            当前答案
          </template>
          <template v-if="index === records.length - 1">预测答案</template>
          <template v-if="index > 0 && index < records.length - 1">
            {{ record.updated_utc | datetime }}
          </template>
        </li>
      </ul>
      <div class="content">
        <p v-if="recordIndex < records.length - 1" class="name">
          <span>
            <template>
              变更用户：<span :title="records[recordIndex].username">
                {{ records[recordIndex].username }}
              </span>
            </template>
          </span>
          <span>{{ records[recordIndex].updated_utc | datetime }}</span>
        </p>
        <p v-html="recordText"></p>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" size="small" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import EventBus from '../../../components/remark/remark-tree/EventBus';

export default {
  name: 'answer-change-record',
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    needUniqueText: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      recordIndex: 0,
    };
  },
  computed: {
    recordText() {
      const record = this.records[this.recordIndex];

      if (record) {
        const recordData = record.data;

        if (Array.isArray(recordData) && recordData.length > 0) {
          if (this.needUniqueText) {
            const seenTexts = new Set();
            recordData.forEach((item) => {
              const tempText =
                item.text !== undefined ? item.text : item.boxes[0].text;
              if (tempText && !seenTexts.has(tempText)) {
                seenTexts.add(tempText);
              }
            });
            return [...seenTexts].join('\n');
          }
          return recordData
            .map((item) => {
              if (item.text) {
                return item.text;
              }

              if (Array.isArray(item.boxes) && item.boxes.length > 0) {
                return item.boxes.map((box) => box.text).join('');
              }

              return '';
            })
            .filter((item) => item !== '')
            .join('\n');
        }
      }

      if (this.recordIndex === this.records.length - 1) {
        return '无预测答案';
      }
      return '当前无答案';
    },
  },
  methods: {
    close() {
      EventBus.$emit('close-answer-change-record-dialog');
    },
    recordItemClicked(index) {
      this.recordIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    padding-bottom: 15px;
  }
  .el-dialog__body {
    padding: 0;
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    padding: 15px 20px;
  }
  .answer-change-record {
    display: flex;
    .navs {
      width: 35%;
      max-height: 40vh;
      overflow-y: auto;
      padding: 10px 0;
      border-right: 1px solid #ececec;
      li {
        padding: 10px 20px;
        list-style: none;
        cursor: pointer;
        &.active,
        &:hover {
          background: #eef8ff;
        }
      }
    }
    .content {
      flex: 1;
      padding: 10px 20px;
      > p {
        display: flex;
        align-items: baseline;
        max-height: 52px;
        overflow-y: auto;
        margin: 5px 0;
        padding: 5px;
        background: #f8f8f8;
        border: 1px solid #ececec;
        border-radius: 4px;
        color: #8c8c8c;
        white-space: pre-line;

        &.name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          color: #333;
          > span {
            &:first-child {
              max-width: 200px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
