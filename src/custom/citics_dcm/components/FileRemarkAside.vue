<template>
  <el-aside width="40%" class="file-remark-aside">
    <div class="aside-top-switch">
      <el-button
        type="primary"
        size="small"
        :disabled="!canSubmitAnswer"
        @click="handleSubmitAnswer">
        提交答案
      </el-button>
      <file-switch-btn />
    </div>
    <el-tabs class="aside-tabs" v-loading="isLoading">
      <el-tab-pane label="预测答案">
        <file-predict-answer
          v-if="isShowPredictAnswer"
          ref="filePredictAnswerRef"
          :fileId="fileId"
          @update-loading-status="updateLoadingStatus"
          @update-submit-answer-status="updateSubmitAnswerStatus" />
      </el-tab-pane>
    </el-tabs>
  </el-aside>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import FileSwitchBtn from './FileSwitchBtn.vue';
import FilePredictAnswer from './FilePredictAnswer.vue';

export default {
  name: 'file-remark-aside-citics-dcm',
  components: { FileSwitchBtn, FilePredictAnswer },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      canSubmitAnswer: false,
    };
  },
  watch: {
    fileId() {
      this.resetSubmitAnswerStatus();
    },
  },
  computed: {
    ...mapGetters('citicsDcmModule', ['schema']),
    isShowPredictAnswer() {
      return !_.isEmpty(this.schema);
    },
  },
  methods: {
    resetSubmitAnswerStatus() {
      this.canSubmitAnswer = false;
    },
    updateLoadingStatus(status) {
      this.isLoading = status;
    },
    updateSubmitAnswerStatus(status) {
      this.canSubmitAnswer = status;
    },
    handleSubmitAnswer() {
      this.$refs.filePredictAnswerRef.submitAnswer();
    },
  },
};
</script>

<style lang="scss" scoped>
.file-remark-aside {
  min-width: 420px;
  border-left: 1px solid #d5d5d5;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .aside-top-switch {
    margin: 0px 20px;
    padding: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    position: sticky;
    top: 0;
    z-index: 9;
    background-color: #fff;
    .navigate-btns {
      padding: 0px;
      border-bottom: unset;
    }
  }
  .aside-tabs {
    padding: 0px 20px 20px 20px;
    flex: 1;
    &.el-tabs {
      ::v-deep .el-tabs__nav-wrap {
        width: fit-content;
        padding: 0px;
      }
    }
  }
}
</style>
