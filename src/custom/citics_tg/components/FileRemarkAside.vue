<template>
  <el-aside class="citics-tg-aside" width="100%">
    <div class="aside-top-switch">
      <file-switch-btn
        v-if="!diffEnabled"
        :qid="qid"
        customRemarkName="fileRemark">
      </file-switch-btn>
    </div>
    <el-tabs
      v-model="activeName"
      :stretch="true"
      :class="{
        'read-only': readOnly,
      }"
      @tab-click="tabClicked(activeName)">
      <el-tab-pane v-if="isAllowRemark" label="参数转化" name="remark">
        <file-remark-operate
          v-if="Object.keys(question).length > 0"
          ref="fileRemarkOperate"
          :qid="qid"
          :answerVersion="answerVersion"
          :answerItemMap="answerItemMap"
          :isEditAnswer="isEditAnswer"
          :isShowCiticsTgCustom="true"
          :is-inspect="true"
          :is-push-loading="pushLoading"
          :isOperatePerm="isOperatePerm"
          @before-send-question-answer="beforeSendQuestionAnswer"
          @reload-question="handleReloadQuestion"
          @open-mapping-check="openMappingCheck"
          @handle-param-push="handleParamPush"
          @handle-statis-status-change="handleStatisStatusChange"
          @submit-inspect-answer="
            $emit('submit-inspect-answer')
          "></file-remark-operate>
        <remark-validate-result
          v-if="errorTips.length > 0"></remark-validate-result>
        <div
          class="search-and-collpase-answer"
          v-if="Object.keys(this.currentSchema).length > 0">
          <file-remark-tree-nodes-searcher></file-remark-tree-nodes-searcher>

          <toggle-answer-collapse-state @toggle="toggleAllAnswerCollapseState">
          </toggle-answer-collapse-state>
        </div>
        <file-remark-answer-panel
          :qid="qid"
          :schemaId="schemaId"
          :answerItemMap="answerItemMap"
          :read-only="readOnly"
          ref="remarkAnswer"></file-remark-answer-panel>
      </el-tab-pane>
      <el-tab-pane
        v-if="isAllowRuleAudit"
        label="规则审核"
        name="ruleAudit"
        :disabled="ruleAuditTabDisabled">
        <rule-audit
          ref="ruleAudit"
          :isOperatePerm="isOperatePerm"
          :fileId="fileId"
          :schemaId="schemaId"
          @re-audit-file="handleReAudit"></rule-audit>
      </el-tab-pane>
    </el-tabs>
    <mapping-relation-check-dialog
      v-if="isCheckDialogVisible"
      :qid="qid"
      :dialog-loading="dialogLoading"
      :mapping-convert="mappingConvert"
      @close="isCheckDialogVisible = false"
      @get-mapping-convert="getMappingConvert"></mapping-relation-check-dialog>
  </el-aside>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';
import FileRemarkOperate from '@/components/remark/FileRemarkOperate';
import RemarkValidateResult from '@/components/remark/FileRemarkValidateResult';
import FileRemarkTreeNodesSearcher from '@/components/remark/FileRemarkTreeNodesSearcher';
import FileRemarkAnswerPanel from '@/components/remark/FileRemarkAnswerPanel';
import RuleAudit from '@/components/RuleAudit';
import MappingRelationCheckDialog from './MappingRelationCheckDialog.vue';
import ToggleAnswerCollapseState from '@/components/ToggleAnswerCollapseState.vue';

import FileSwitchBtn from '@/components/FileSwitchBtn.vue';
import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';

import {
  getMappingConvert,
  parameterPush,
  updateFile,
} from '@/store/api/citics-tg.api';
import { fetchFileAuditRuleResult } from '@/store/api/rule-audit.api';
import { rerunFile } from '@/store/api/file.api';
import { isCiticsTgAllow } from '../common/utils';

export default {
  name: 'file-remark-aside-citisc-tg',
  mixins: [FileMarkableMixin],
  components: {
    FileRemarkOperate,
    RemarkValidateResult,
    FileRemarkTreeNodesSearcher,
    FileRemarkAnswerPanel,
    RuleAudit,
    FileSwitchBtn,
    MappingRelationCheckDialog,
    ToggleAnswerCollapseState,
  },
  props: {
    qid: {
      type: Number,
      required: true,
    },
    fileId: {
      type: Number,
      required: true,
    },
    schemaId: {
      type: Number,
      required: true,
    },
    compareRecordId: {
      type: Number,
      default: 0,
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
    originalAnswerItemMap: {
      type: Object,
      default: () => {},
    },
    isShowRuleAudit: {
      type: Boolean,
      default: true,
    },
    isOperatePerm: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('remarkModule', [
      'errorTips',
      'question',
      'currentSchema',
      'diffEnabled',
    ]),
    isEditAnswer() {
      return !_.isEqual(this.originalAnswerItemMap, this.answerItemMap);
    },
    isAllowRuleAudit() {
      return this.isShowRuleAudit && isCiticsTgAllow('prj_detail_file_audit');
    },
    isAllowRemark() {
      if (this.compareRecordId) {
        return isCiticsTgAllow('prj_detail_compare');
      }
      return isCiticsTgAllow('prj_detail_file_para');
    },
  },
  data() {
    return {
      activeName: 'remark',
      ruleAuditTabDisabled: false,
      isCheckDialogVisible: false,
      dialogLoading: false,
      mappingConvert: [],
      pushLoading: false,
      readOnly: false,
    };
  },
  watch: {
    currentSchema: {
      handler() {
        if (
          Object.keys(this.currentSchema).length > 0 &&
          this.isAllowRuleAudit
        ) {
          this.getRuleAuditResult();
        }
      },
    },
    fileId() {
      this.activeName = 'remark';
      if (
        (this.compareRecordId && !isCiticsTgAllow('prj_detail_compare')) ||
        (!this.compareRecordId && !isCiticsTgAllow('prj_detail_file_para'))
      ) {
        this.activeName = 'ruleAudit';
      }
      this.tabClicked(this.activeName);
    },
  },
  mounted() {
    if (
      (this.compareRecordId && !isCiticsTgAllow('prj_detail_compare')) ||
      (!this.compareRecordId && !isCiticsTgAllow('prj_detail_file_para'))
    ) {
      this.activeName = 'ruleAudit';
    }
    this.tabClicked(this.activeName);
    EventBus.$on('handle-update-answer-type', this.handleUpdateAnswerType);
  },
  beforeDestroy() {
    EventBus.$off('handle-update-answer-type', this.handleUpdateAnswerType);
  },
  methods: {
    handleUpdateAnswerType(val) {
      if (this.diffEnabled) {
        return;
      }
      if (val === 1) {
        if (this.isAllowRuleAudit) {
          this.getRuleAuditResult();
        }
        this.readOnly = false;
      } else {
        this.readOnly = true;
      }
    },
    async getRuleAuditResult() {
      try {
        const { data } = await fetchFileAuditRuleResult(
          this.fileId,
          this.schemaId,
        );
        const notComplianceData = data.filter(
          (item) => item.is_compliance === false,
        );
        this.$nextTick(() => {
          const nameEls = document.querySelectorAll('.answer-name');
          if (nameEls.length > 0) {
            nameEls.forEach((el) => el.classList.remove('not-compliance'));
            notComplianceData.forEach((item) => {
              item.schema_results.forEach((result) => {
                const notComplianceEl = [...nameEls].find(
                  (el) =>
                    el.title === result.name.match(/(.+)-/)?.[1] ||
                    el.title === result.name,
                );
                notComplianceEl.classList.add('not-compliance');
              });
            });
          }
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    toggleAllAnswerCollapseState() {
      this.$refs.remarkAnswer.toggleAllAnswerCollapseState();
    },
    tabClicked(name) {
      if (name === 'ruleAudit') {
        this.$refs.ruleAudit.fetchFileAuditRuleResult();
      } else {
        if (this.isAllowRuleAudit && !this.readOnly) {
          this.getRuleAuditResult();
        }
      }
    },
    beforeSendQuestionAnswer() {
      this.ruleAuditTabDisabled = true;
    },
    openMappingCheck() {
      this.isCheckDialogVisible = true;
    },
    async getMappingConvert() {
      try {
        this.dialogLoading = true;
        const res = await getMappingConvert(this.qid);
        this.mappingConvert = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.dialogLoading = false;
      }
    },
    async handleParamPush() {
      this.pushLoading = true;
      // if (this.mappingConvert.length === 0) {
      //   await this.getMappingConvert();
      // }
      // const isCheck = this.isMappingCheckPass();
      // if (isCheck) {
      await this.setParameterPush();
      // } else {
      //   this.$message.error(
      //     this.$t(`message['映射关系中有缺失，请检查映射关系']`),
      //   );
      // }
      this.pushLoading = false;
    },
    async handleStatisStatusChange(fileInfo) {
      try {
        this.pushLoading = true;
        if (fileInfo) {
          const { name, molds, templates, version, group_name } = fileInfo;
          const data = {
            name: name,
            molds,
            templates,
            version,
            group_name,
            need_stat: false,
          };
          await updateFile(fileInfo.id, data);
          this.$notify({
            title: '成功',
            message: this.$t(`message['取消统计成功']`),
            type: 'success',
          });
        } else {
          let params = { to_count: true };
          await parameterPush(this.qid, params);
          this.$notify({
            title: '成功',
            message: this.$t(`message['加入统计成功']`),
            type: 'success',
          });
        }
        this.$refs.fileRemarkOperate.changePushCountStatus();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.pushLoading = false;
      }
    },
    async setParameterPush() {
      try {
        let params = {};
        if (this.compareRecordId) {
          params.compare_record_id = this.compareRecordId;
        }
        await parameterPush(this.qid, params);
        this.$notify({
          title: '成功',
          message: this.$t(`message['参数推送成功']`),
          type: 'success',
        });
        this.$refs.fileRemarkOperate.joinPushCountStatus();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    // isMappingCheckPass() {
    //   return !this.mappingConvert.some((convert) =>
    //     convert.data.some((data) => data.to_value_error),
    //   );
    // },
    async handleReloadQuestion() {
      this.ruleAuditTabDisabled = false;
      await this.reloadQuestion();
      this.getRuleAuditResult();
    },
    async handleReAudit() {
      await this.reAuditFile();
      this.$refs.ruleAudit.fetchFileAuditRuleResult();
    },
    async reAuditFile() {
      try {
        await rerunFile(this.fileId, 'inspect');
        this.$notify({
          title: '成功',
          message: '发起重新审核成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.citics-tg-aside {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep .node-sticky-2 {
    margin-left: 10px;
  }
  .el-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    ::v-deep .el-tabs__content {
      flex: 1;
      overflow: hidden;
      .el-tab-pane {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
.aside-top-switch {
  padding: 0 15px;
}
.read-only {
  ::v-deep .user-operate-content {
    display: none;
  }
}
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
