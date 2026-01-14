<template>
  <div class="answer-change-record">
    <div class="record-date">
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="prevRecordDate"
        :disabled="prevRecordDateDisabled" />
      <span>{{ currentRecordData.date }}</span>
      <el-button
        type="text"
        icon="el-icon-arrow-right"
        @click="nextRecordDate"
        :disabled="nextRecordDateDisabled" />
    </div>
    <div class="record-text">
      <div class="text-item" v-if="!currentRecordData.isPredictAnswer">
        <span class="label">修改用户：</span>
        <span>{{ currentRecordData.username }}</span>
      </div>
      <div class="text-item">
        <span class="label">
          {{ currentRecordData.isPredictAnswer ? '预测答案' : '答案' }}：
        </span>
        <span class="answer" v-html="currentRecordData.answer"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'answer-change-record',
  props: {
    records: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentRecords: [],
      currentRecordIndex: 0,
      currentRecordData: {},
    };
  },
  watch: {
    records: {
      handler() {
        this.getRecordData();
      },
      immediate: true,
    },
  },
  computed: {
    prevRecordDateDisabled() {
      return this.currentRecordIndex === 0;
    },
    nextRecordDateDisabled() {
      return this.currentRecordIndex === this.currentRecords?.length - 1;
    },
  },
  methods: {
    getRecordData() {
      if (this.records) {
        const lastRecord = this.records[this.records.length - 1];
        if (!lastRecord.data) {
          this.currentRecords = this.records.slice(0, -1);
        } else {
          const updatedLastRecord = {
            ...lastRecord,
            isPredictAnswer: true,
          };
          this.currentRecords = [
            ...this.records.slice(0, -1),
            updatedLastRecord,
          ];
        }

        const record = this.currentRecords[this.currentRecordIndex];
        this.currentRecordData = {
          ...record,
          date: this.$options.filters.datetime(record.updated_utc),
          answer: this.getRecordAnswer(record.data),
        };
      }
    },
    getRecordAnswer(recordData) {
      if (Array.isArray(recordData) && recordData.length > 0) {
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
      return '--';
    },
    prevRecordDate() {
      if (this.currentRecordIndex > 0) {
        this.currentRecordIndex--;
        this.getRecordData();
        this.$emit('update-popover-position');
      }
    },
    nextRecordDate() {
      if (this.currentRecordIndex < this.currentRecords?.length - 1) {
        this.currentRecordIndex++;
        this.getRecordData();
        this.$emit('update-popover-position');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.answer-change-record {
  .record-date {
    margin-bottom: 5px;
    .el-button {
      padding: 0;
    }
  }
  .record-text {
    .text-item {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-weight: bold;
      padding: 5px 0;
    }
    .answer {
      white-space: pre-line;
    }
  }
}
</style>
