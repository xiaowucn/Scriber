<template>
  <div class="file-predict-answer">
    <file-predict-answer-table
      v-if="isShowOrderBasicDataTable"
      :tableData="orderBasicData"
      class="order-basic-table">
      <template slot="value" slot-scope="props">
        <file-predict-answer-value
          :answerItem="props.item"
          :detail="props.item.detail"
          @save="saveAnswerValues" />
      </template>
    </file-predict-answer-table>
    <template v-if="isShowOrderMatchResult">
      <div class="result-title">
        <div>
          <span class="label">匹配结果：</span>
          <span>
            订单人 {{ orderer }}，共关联
            {{ orderAutoRelatedData.length }} 个结果
          </span>
        </div>
        <div class="related-btn">
          <el-button
            type="primary"
            size="small"
            @click="modifyOrderRelatedData">
            修改关联
          </el-button>
        </div>
      </div>
      <div class="result-content">
        <div
          class="item"
          v-for="(item, index) in orderAutoRelatedData"
          :key="index">
          <blockquote class="label">结果 {{ index + 1 }}：</blockquote>
          <file-predict-answer-table :tableData="item.data" />
        </div>
      </div>
    </template>
    <order-related-data-popup
      v-if="orderRelatedDataPopupVisible"
      @close="closeOrderRelatedDataPopup"
      @update="fetchOrderRelatedData"
      :qid="qid" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { createEmptyAnswer, cloneModelAnswer } from '@/utils/remarkAnswerTools';
import FilePredictAnswerValue from './FilePredictAnswerValue.vue';
import FilePredictAnswerTable from './FilePredictAnswerTable.vue';
import OrderRelatedDataPopup from './OrderRelatedDataPopup.vue';
import { citicsDCM as citicsDCMApi } from '@/store/api';
import { ORDER_RELATED_LABEL_MAP } from '../common/constant';

export default {
  name: 'filePredictAnswer',
  components: {
    FilePredictAnswerValue,
    FilePredictAnswerTable,
    OrderRelatedDataPopup,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      orderKey: '机构名称',
      answerVersion: '',
      allAnswerItems: [],
      orderAutoRelatedData: [],
      orderRelatedDataPopupVisible: false,
      editedAnswer: {},
      basicDataLoading: true,
      relatedDataLoading: true,
    };
  },
  watch: {
    fileId() {
      this.init();
    },
    loading: {
      handler(val) {
        this.$emit('update-loading-status', val);
      },
      immediate: true,
    },
    answer(answerData) {
      if (answerData.items) {
        this.allAnswerItems = answerData.items;
      }
      if (answerData.version) {
        this.answerVersion = answerData.version;
      }
    },
  },
  created() {
    this.reset();
    this.init();
  },
  computed: {
    ...mapGetters('citicsDcmModule', [
      'schema',
      'question',
      'answer',
      'mergedTreeData',
    ]),
    qid() {
      return Number(this.$route.query.qid);
    },
    loading() {
      return this.basicDataLoading || this.relatedDataLoading;
    },
    isShowOrderBasicDataTable() {
      return !_.isEmpty(this.orderBasicData);
    },
    canSubmitAnswer() {
      return _.some(_.values(this.editedAnswer), (value) => !_.isEmpty(value));
    },
    answerValue() {
      return (answerItem) => {
        return (
          answerItem.text || answerItem.boxes.map((box) => box.text).join('')
        );
      };
    },
    isShowOrderMatchResult() {
      return !!this.orderer;
    },
    mergedAnswerGroup() {
      if (!_.isEmpty(this.mergedTreeData)) {
        return this.mergedTreeData[0].childrenGroup[0];
      }
      return [];
    },
    orderBasicData() {
      if (!_.isEmpty(this.mergedAnswerGroup)) {
        const currentOrderBasicData = this.mergedAnswerGroup.map((item) => {
          const answer = item.answer
            ? cloneModelAnswer(item)
            : createEmptyAnswer(item);

          return {
            ...answer,
            label: answer.label || answer.schema.data.label,
            value: !_.isEmpty(answer.data)
              ? this.answerValue(answer.data[0]).replace(/\n/g, '')
              : !_.isArray(answer.value)
                ? answer.value
                : '',
          };
        });
        return currentOrderBasicData;
      }
      return [];
    },
    orderer() {
      if (!_.isEmpty(this.orderBasicData)) {
        return (
          this.orderBasicData.find((item) => item.label === this.orderKey)
            ?.value || ''
        );
      }
      return '';
    },
    orderBasicResult() {
      return this.orderBasicData.filter((orderBasicItem) =>
        this.allAnswerItems.some(
          (item) => item.schema.data.label === orderBasicItem.label,
        ),
      );
    },
  },
  methods: {
    init() {
      this.fetchOrderBasicData();
      this.fetchOrderRelatedData();
    },
    initUserAnswer() {
      let userAnswer = {
        items: [],
        version: '2.2',
      };
      if (this.question && !_.isEmpty(this.question.answer)) {
        userAnswer = this.question.answer.userAnswer;
      }
      this.$store.commit('citicsDcmModule/SET_USER_ANSWER', userAnswer);
      this.initAnswerMap();
    },
    async fetchOrderBasicData() {
      try {
        this.basicDataLoading = true;
        const params = { qid: this.qid };
        await this.$store.dispatch('citicsDcmModule/fetchQuestion', params);
        this.initUserAnswer();
      } catch (e) {
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'error',
        });
      } finally {
        this.basicDataLoading = false;
      }
    },
    async fetchOrderRelatedData() {
      try {
        this.relatedDataLoading = true;
        const params = { only_has_ref: 1 };
        const { data } = await citicsDCMApi.fetchOrderRelatedData(
          this.qid,
          params,
        );
        this.orderAutoRelatedData = data.items.map((dataItem) => {
          return {
            data: ORDER_RELATED_LABEL_MAP.map((item) => ({
              ...item,
              value: dataItem[item.key],
            })),
          };
        });
      } catch (e) {
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'error',
        });
      } finally {
        this.relatedDataLoading = false;
      }
    },
    async initAnswerMap() {
      await this.$store.dispatch('citicsDcmModule/initAnswerTree');
    },
    openOrderRelatedDataPopup() {
      this.orderRelatedDataPopupVisible = true;
    },
    closeOrderRelatedDataPopup() {
      this.orderRelatedDataPopupVisible = false;
    },
    modifyOrderRelatedData() {
      this.openOrderRelatedDataPopup();
    },
    saveAnswerValues(label, value) {
      this.editedAnswer = { ...this.editedAnswer, [label]: value };
      this.$emit('update-submit-answer-status', this.canSubmitAnswer);
      const isHasAnswerItem = this.orderBasicResult.some(
        (item) => item.schema.data.label === label,
      );
      const currentAnswerItem = this.orderBasicData.find(
        (item) => item.schema.data.label === label,
      );
      if (!isHasAnswerItem) {
        this.orderBasicResult.push(currentAnswerItem);
      }
      this.orderBasicResult.forEach((item) => {
        if (item.schema.data.label === label) {
          //如item.data不为空，即在已标注的schema节点上进行修改，需更新data中的值；如item.data为空，则未标注，需要用户手动填写对应schema节点的value值。
          if (!_.isEmpty(item.data)) {
            item.data[0].text = value;
          }
          item.manual = true;
          item.value = value;
        }
      });
    },
    async submitAnswer() {
      try {
        const data = {
          data: {
            schema: this.schema,
            userAnswer: {
              version: this.answerVersion,
              items: this.orderBasicResult,
            },
          },
        };
        await this.$store.dispatch('citicsDcmModule/sendQuestionAnswer', {
          qid: this.qid,
          data,
          type: 0,
        });
        this.$notify({
          title: '成功',
          message: '保存答案成功！',
          type: 'success',
          offset: 30,
        });
        const answer = _.omitBy(this.editedAnswer, _.isEmpty);
        const hasOrderer = _.has(answer, this.orderKey);
        this.fetchOrderBasicData();
        if (hasOrderer) {
          this.fetchOrderRelatedData();
        }
        this.editedAnswer = {};
        this.$emit('update-submit-answer-status', this.canSubmitAnswer);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
          offset: 30,
        });
      }
    },
    reset() {
      this.$store.commit('citicsDcmModule/SET_MERGED_TREEDATA', []);
    },
  },
};
</script>

<style lang="scss" scoped>
.file-predict-answer {
  margin-top: 24px;
  .order-basic-table {
    margin-bottom: 30px;
  }
  .result-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 21px;
    font-size: 14px;
    color: #707070;
    .label {
      font-weight: 500;
    }
  }
  .related-btn {
    .el-button {
      font-size: 13px;
      width: 90px;
      height: 32px;
      color: $--color-primary;
      border: 1px solid $--color-primary;
      background: $--color-primary-hover;
    }
  }
  .result-content {
    .item {
      margin-bottom: 21px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
    .label {
      margin-bottom: 16px;
      color: #707070;
      font-size: 14px;
      line-height: 18px;
      padding-left: 4px;
      border-left: 2px solid $--color-primary;
    }
  }
}
</style>
