<template>
  <el-aside width="100%">
    <el-tabs
      v-model="activeName"
      :stretch="true"
      @tab-click="tabClicked(activeName)">
      <el-tab-pane label="要素提取" name="remark">
        <file-remark-operate
          v-if="Object.keys(question).length > 0"
          :qid="qid"
          :answerVersion="answerVersion"
          :answerItemMap="answerItemMap"
          @reload-question="reloadQuestion"
          @reset-transfer-schema="resetTransferSchema"></file-remark-operate>
        <remark-validate-result
          v-if="errorTips.length > 0"></remark-validate-result>
        <file-remark-answer-panel
          :qid="qid"
          :answerItemMap="answerItemMap"
          ref="remarkAnswer"></file-remark-answer-panel>
      </el-tab-pane>
      <el-tab-pane label="规则判断" name="ruleCheck">
        <rule-check ref="ruleCheck"></rule-check>
      </el-tab-pane>
    </el-tabs>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';
import FileRemarkOperate from '@/components/remark/FileRemarkOperate';
import RemarkValidateResult from '@/components/remark/FileRemarkValidateResult';
import FileRemarkAnswerPanel from '@/components/remark/FileRemarkAnswerPanel';
import RuleCheck from './RuleCheck';

export default {
  name: 'ht-file-remark-aside',
  components: {
    FileRemarkOperate,
    RemarkValidateResult,
    FileRemarkAnswerPanel,
    RuleCheck,
  },
  props: {
    qid: {
      type: Number,
      required: true,
    },
    answerVersion: {
      type: String,
      required: true,
    },
    answerItemMap: {
      type: Object,
      required: true,
    },
    reloadQuestion: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters('remarkModule', ['errorTips', 'question']),
  },
  data() {
    return {
      activeName: 'remark',
    };
  },
  methods: {
    tabClicked(name) {
      if (name === 'ruleCheck') {
        this.$refs.ruleCheck.fetchFileRuleResult();
      }
    },
    resetTransferSchema() {
      this.$emit('reset-transfer-schema');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  position: sticky;
  top: 0;
  z-index: 4;
  background: #fff;
  .el-tabs__item {
    height: 34px;
    line-height: 34px;
  }
}
</style>
