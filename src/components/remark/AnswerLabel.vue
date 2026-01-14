<template>
  <div class="answer-label" :class="[shouldShowDiffMarks ? 'is-diff' : '']">
    <div class="answer-flex">
      <el-tooltip
        :disabled="!isShowTooltip"
        effect="dark"
        content="该字段推荐结果仅做参考"
        placement="left">
        <div class="answer-item-content">
          <template>
            <span
              :data-uuid="uuid"
              :data-index="0"
              :class="[
                'answer-name',
                model.meta._partType === 'root' ? 'root-name' : '',
                hasNodeAnswer() ? 'has-answer' : '',
                isShowTooltip ? 'has-predict-answer' : '',
                getFieldAuditStatusClassName(),
              ]"
              :title="model.data.label">
              {{ answerName }}:
              <em>{{ shouldShowDiffMarks ? '（缺少）' : '' }}</em>
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              content="字段异常，请检查审核结果"
              placement="top-start">
              <i class="el-icon-warning"></i>
            </el-tooltip>
            <el-popover
              placement="top"
              width="150"
              popper-class="edit-answer-label-popover"
              v-model="isEditingAnswerLabel">
              <el-input
                v-model="tempAnswerLabelText"
                ref="answerLabelInput"
                size="mini"
                maxlength="30"
                @input="validateEditCustomSchemaNode"></el-input>
              <p class="validate-message">
                {{ customSchemaNodeValidateMessage }}
              </p>
              <div>
                <el-button size="mini" @click="cancelEditAnswerLabel"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="tempAnswerLabelText === model.data.label"
                  @click="confirmEditAnswerLabel"
                  >确定</el-button
                >
              </div>
              <i
                v-if="model.meta.custom"
                slot="reference"
                class="far fa-edit fa-fw edit-icon"
                @click.stop="editAnswerLabel(model.data.label)"></i>
            </el-popover>
            <el-popover
              v-if="showChangeRecord"
              placement="bottom"
              width="200"
              trigger="hover"
              :disabled="!$platform.isNafmiiEnv()"
              :close-delay="1000"
              ref="answerChangeRecordsPopover"
              @show="getAnswerChangeRecords"
              popper-class="answer-change-record-popover">
              <el-button
                type="primary"
                size="mini"
                plain
                class="btn-record"
                slot="reference"
                @click.stop="openAnswerChangeRecordDialog">
                变更记录
              </el-button>
              <nafmii-answer-change-record
                v-if="$platform.isNafmiiEnv()"
                :records="answerChangeRecords"
                @update-popover-position="updatePopoverPosition" />
            </el-popover>
            <el-tooltip
              v-if="showReviseSuggestion"
              placement="top"
              content="已被标记为修改意见，点击可取消该设定">
              <el-button
                type="danger"
                size="mini"
                class="btn-record"
                plain
                @click.stop="cancelReviseSuggestion">
                修改意见
              </el-button>
            </el-tooltip>
          </template>
          <template v-if="hasNodeAnswer() || hasEnumValue()">
            <el-tag v-if="isShowScore()" size="mini">{{
              schemaAnswer.score
            }}</el-tag>
            <el-tag v-if="isShowMarker()" size="mini">{{
              schemaAnswer.marker.name
            }}</el-tag>
            <el-tooltip
              v-if="isShowMarkerOthers()"
              placement="bottom"
              effect="light">
              <ul slot="content" class="marker-others-list">
                <li
                  v-for="(item, index) in schemaAnswer.marker.others"
                  :key="index">
                  {{ item }}
                </li>
              </ul>
              <el-button
                size="mini"
                icon="el-icon-more"
                circle
                class="marker-others"></el-button>
            </el-tooltip>
            <div
              v-if="
                schemaNodeSelected &&
                answerItem.items &&
                answerItem.items.length > 1
              "
              class="answer-data-index">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-arrow-left"
                :disabled="dataIndex === 0"
                @click.stop="switchDataIndex('prev')">
              </el-button>
              {{ dataIndex + 1 }}/{{ answerItem.items.length }}
              <el-button
                type="text"
                size="mini"
                icon="el-icon-arrow-right"
                :disabled="dataIndex === answerItem.items.length - 1"
                @click.stop="switchDataIndex('next')">
              </el-button>
            </div>
          </template>
          <i
            v-if="isShowAnswerCreate"
            @click.stop="createSchemaNode"
            class="fas fa-fw fa-plus-circle answer-create"></i>
        </div>
      </el-tooltip>
      <div class="node-item-buttons" v-if="!isHideClone">
        <el-tag
          v-if="isShowCustomSchemaNodeTag"
          type="warning"
          size="mini"
          class="custom-tag"
          >自定义</el-tag
        >
        <el-button
          v-if="isShowConfirmBtn()"
          :type="confirmState ? 'info' : 'success'"
          size="mini"
          class="predict-position-button"
          @click="setConfirmState()">
          {{ confirmState ? '删除' : '确认' }}答案
        </el-button>
        <el-button
          v-if="isShowSetManualAnswerBtn"
          class="manual-button"
          @click.stop="setManualAnswer()">
          {{ schemaAnswer.manual ? '不采用答案' : '采用答案' }}
        </el-button>
        <el-button
          v-if="isShowClearAnswerTextBtn"
          class="manual-button"
          @click.stop="clearAnswers()">
          清空
        </el-button>
        <el-button
          v-if="isShowCopyAnswerTextBtn"
          class="fas fa-copy copy-text-button"
          title="复制字段答案"
          @click="copyAnswerText">
        </el-button>
        <el-button
          v-if="isShowPredictPosition()"
          class="predict-position-button"
          round
          @click="predictNodePosition">
          AI
        </el-button>
        <el-button
          v-if="assistLabel"
          class="manual-button"
          type="info"
          @click.stop="supplementSchemaAnswer">
          {{ assistLabel }}
        </el-button>
        <el-button-group v-if="isShowBatchEdit">
          <el-button
            class="manual-button group"
            :type="$platform.isDefaultEnv() ? 'primary' : 'success'"
            @click="checkAllSchemaGroupFn">
            全选
          </el-button>
          <el-button
            :disabled="batchEditDisabled"
            class="manual-button group"
            :type="$platform.isDefaultEnv() ? 'primary' : 'success'"
            @click="switchBatchEditFn">
            批量修改
          </el-button>
        </el-button-group>
        <el-button
          v-if="isShowCustomSchemaNodeBtn"
          :disabled="customSchemaNodeBtnDisabled"
          class="manual-button group"
          type="primary"
          @click="addCustomSchemaNodeFn">
          添加自定义字段
        </el-button>
        <template v-if="isShowRemoveAllAnswer">
          <svg-font-icon
            v-if="$platform.isDefaultEnv()"
            name="delete"
            color="#606266"
            :size="18"
            @click.native.stop="removeAllAnswer"></svg-font-icon>
          <i
            v-else
            class="far fa-times-circle remove-all-answer"
            @click.stop="removeAllAnswer">
          </i>
        </template>
        <span v-if="isShowConflictNum" class="conflict-num">
          {{ conflictNum }}
        </span>
        <el-tooltip
          placement="left"
          v-if="model.data.words"
          popper-class="answer-description-tooltip">
          <div slot="content">
            <h4>Description:</h4>
            {{ model.data.words }}
          </div>
          <i class="fa fa-info-circle comments-btn answer-description"></i>
        </el-tooltip>
        <i
          v-if="isShowCustomSchemaNodeTag"
          class="far fa-times-circle remove-all-answer"
          @click.stop="removeCustomSchemaNode"></i>
      </div>
    </div>
    <el-checkbox-group
      v-if="isOpened && model.meta._type.type === 'enum'"
      :value="enumValue">
      <el-checkbox
        v-for="(item, index) in model.meta._type.values"
        :key="index"
        :border="true"
        size="mini"
        :label="item.name"
        @change="
          enumChange(item.name, model.meta._type.isMultiSelect)
        "></el-checkbox>
    </el-checkbox-group>

    <template v-if="!$platform.isNafmiiEnv()">
      <answer-change-record
        v-if="showAnswerChangeRecordDialog"
        :needUniqueText="needUniqueText"
        :records="answerChangeRecords" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import EventBus from './remark-tree/EventBus';
import { FIELD_STATUS } from '../../custom/cmfchina/common/constant.js';
import FileMarkableMixin from '../mixins/FileMarkableMixin';
import { copyTextToClipboard } from '../../utils/clipboard';
import AnswerChangeRecord from '../../custom/general/components/AnswerChangeRecord';
import NafmiiAnswerChangeRecord from '@/custom/nafmii/components/AnswerChangeRecord';

export default {
  name: 'answer-label',
  components: { AnswerChangeRecord, NafmiiAnswerChangeRecord },
  mixins: [FileMarkableMixin],
  props: {
    uuid: {
      type: String,
    },
    model: {
      type: Object,
      required: true,
    },
    modelKey: {
      type: String,
      required: true,
    },
    schemaAnswer: {
      type: Object,
      required: true,
    },
    cloneSchemaNodeFn: {
      type: Function,
      required: false,
    },
    changeSchemaTypeFn: {
      type: Function,
      required: false,
    },
    changeSchemaManualFn: {
      type: Function,
      required: false,
    },
    removeSchemaNodeAnswerFn: {
      type: Function,
      required: false,
    },
    removeSchemaAllAnswerFn: {
      type: Function,
      required: false,
    },
    depth: {
      type: Number,
      required: true,
    },
    schemaGroupChecked: {
      type: Array,
      required: true,
    },
    switchBatchEditFn: {
      type: Function,
      required: false,
    },
    checkAllSchemaGroupFn: {
      type: Function,
      required: false,
    },
    addCustomSchemaNodeFn: {
      type: Function,
      required: false,
    },
    editCustomSchemaNodeFn: {
      type: Function,
      required: false,
    },
    removeCustomSchemaNodeFn: {
      type: Function,
      required: false,
    },
    cancelReviseSuggestionFn: {
      type: Function,
      required: false,
    },
    showDiffMarks: {
      type: Boolean,
      default: true,
    },
    diffResult: {
      type: Boolean,
      required: false,
    },
    isOpened: {
      type: Boolean,
      required: true,
    },
    fieldStatus: {
      type: Number,
      required: false,
      default: null,
    },
    isInspect: {
      type: Boolean,
      required: false,
      default: false,
    },
    needUniqueText: {
      type: Boolean,
      required: false,
      default: false,
    },
    dataIndex: {
      type: Number,
      required: true,
    },
    switchDataIndexFn: {
      type: Function,
      required: false,
    },
    schemaNodeSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
    answerItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      confirmState: false,
      enableCustomSchemaNode: false,
      isEditingAnswerLabel: false,
      tempAnswerLabelText: '',
      customSchemaNodeValidateRules: {
        empty: '自定义字段名不能为空',
        repeat: '自定义字段名不能重复',
      },
      customSchemaNodeValidateMessage: '',
      showAnswerChangeRecordDialog: false,
      answerChangeRecords: null,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('remarkModule', [
      'currentConflictMap',
      'userAnswerType',
      'originSchema',
      'question',
    ]),
    answerName() {
      if (this.model.meta._partType === 'root') {
        if (
          this.question &&
          !(this.question.answers && this.question.answers.length > 0) &&
          this.question.mold
        ) {
          return this.question.mold.name;
        }
      }

      return this.model.data.label;
    },
    enumValue() {
      const enumValue = this.schemaAnswer.value;
      if (this.schemaAnswer && enumValue) {
        if (_.isArray(enumValue)) {
          return enumValue;
        }
        return [enumValue];
      }
      return [];
    },
    canCreate() {
      // 非根节点的 组合类型 可以新增（注：这里和 isMulti 字段没有关系）
      return (
        this.model.meta._type.type === 'group' &&
        this.model.meta._partType !== 'root'
      );
    },
    isShowConflictNum() {
      return this.schemaAnswer && this.conflictNum;
    },
    conflictNum() {
      if (!_.isEmpty(this.currentConflictMap)) {
        return this.currentConflictMap.result[this.schemaAnswer.key];
      }

      return null;
    },
    isShowTooltip() {
      if (
        this.model.meta._type.type !== 'enum' &&
        this.schemaAnswer &&
        typeof this.schemaAnswer.score !== 'undefined'
      ) {
        // score 为 null 或 -1 时不显示tooltip
        if (
          this.schemaAnswer.score === null ||
          Number(this.schemaAnswer.score) === -1
        ) {
          return false;
        }
        if (
          this.schemaAnswer.score < this.configuration.unsure_warnning_score &&
          this.schemaAnswer.score !== -1 &&
          this.schemaAnswer.data.length > 0
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    assistLabel() {
      try {
        const schemaName = JSON.parse(this.modelKey)[0].split(':')[0];
        const assistItem = this.configuration.answer_assist[schemaName];

        if (assistItem) {
          return assistItem[this.model.data.label];
        } else {
          return undefined;
        }
      } catch (error) {
        return undefined;
      }
    },
    isShowBatchEdit() {
      if (this.$platform.isNafmiiEnv() && !this.showDiffMarks) {
        return false;
      }
      if (this.$platform.isCmfchinaEnv()) {
        return false;
      }
      if (this.isInspect) {
        return false;
      }
      return (
        this.depth === 1 &&
        this.model.children.length > 0 &&
        !this.enableCustomSchemaNode
      );
    },
    batchEditDisabled() {
      return this.schemaGroupChecked.length === 0;
    },
    customSchemaNodeBtnDisabled() {
      return this.depth > 0 && this.schemaGroupChecked.length === 0;
    },
    isShowCustomSchemaNodeBtn() {
      return (
        (this.depth === 0 && this.enableCustomSchemaNode) ||
        (this.model.children.length > 0 && this.enableCustomSchemaNode)
      );
    },
    isShowCustomSchemaNodeTag() {
      return this.model.meta.custom || this.schemaAnswer.custom;
    },
    shouldShowDiffMarks() {
      return (
        this.showDiffMarks && this.diffResult === false && !this.hasNodeAnswer()
      );
    },
    showChangeRecord() {
      if (
        !this.$platform.isCgsEnv() &&
        !this.$platform.isNafmiiEnv() &&
        !this.$features.supportLLMExtract()
      ) {
        return false;
      }
      return (
        !this.canCreate &&
        this.schemaAnswer.record &&
        this.schemaAnswer.record.length > 0
      );
    },
    showReviseSuggestion() {
      if (!this.$platform.isCgsEnv()) {
        return false;
      }
      return this.schemaAnswer.revise_suggestion;
    },
    isHideClone() {
      return (
        this.$features.showCiticsTgRemarkAside() && this.$route.meta.isCustom
      );
    },
    isShowSetManualAnswerBtn() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      if (this.isInspect) {
        return false;
      }
      return this.isShowManualAnswerButton() && this.hasNodeAnswer();
    },
    isShowClearAnswerTextBtn() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      if (this.isInspect) {
        return false;
      }
      return this.isShowManualAnswerButton() && this.hasNodeAnswer();
    },
    isShowCopyAnswerTextBtn() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return this.schemaAnswer.data.length > 0;
    },
    isShowRemoveAllAnswer() {
      if (this.$platform.isNafmiiEnv() && !this.showDiffMarks) {
        return false;
      }
      return (
        this.model.meta._deepIndex.length > 0 && this.model.children.length > 0
      );
    },
    isShowAnswerCreate() {
      if (this.$platform.isNafmiiEnv() && !this.showDiffMarks) {
        return false;
      }
      return this.canCreate && !this.isHideClone;
    },
  },
  created() {
    this.enableCustomSchemaNode = !this.$features.supportBatchEdit();
    EventBus.$on(
      'switch-custom-schema-node-enable',
      this.switchCustomSchemaNode,
    );
    EventBus.$on(
      'close-answer-change-record-dialog',
      this.closeAnswerChangeRecordDialog,
    );
    EventBus.$on('sync-remark-answer', this.syncRemarkAnswer);
  },
  beforeDestroy() {
    EventBus.$off(
      'switch-custom-schema-node-enable',
      this.switchCustomSchemaNode,
    );
    EventBus.$off(
      'close-answer-change-record-dialog',
      this.closeAnswerChangeRecordDialog,
    );
    EventBus.$off('sync-remark-answer', this.syncRemarkAnswer);
  },
  methods: {
    createSchemaNode() {
      if (this.cloneSchemaNodeFn) {
        this.cloneSchemaNodeFn(this.model.childrenGroup[0]);
      }
    },
    enumChange(valueUpdated, isEnumMultiSelect) {
      if (!this.checkCanModifyAnswer()) {
        return false;
      }
      let value = null;
      if (isEnumMultiSelect) {
        value = _.clone(this.enumValue);
        if (value.includes(valueUpdated)) {
          const index = this.enumValue.findIndex(
            (item) => item === valueUpdated,
          );
          value.splice(index, 1);
        } else {
          value.push(valueUpdated);
        }
      } else {
        value = valueUpdated === this.enumValue[0] ? [] : [valueUpdated];
      }
      if (this.changeSchemaTypeFn) {
        this.changeSchemaTypeFn(value);
      }
    },
    setAnswerEnumVal() {
      if (this.schemaAnswer) {
        this.enumValue = this.schemaAnswer.value;
      } else {
        const values = this.model.meta._type.values;
        if (values) {
          let value = values.find((item) => item.isDefault === true);
          this.enumValue = value ? value.name : '';
        }
      }
    },
    isShowPredictPosition() {
      if (this.$platform.isCmfchinaEnv()) {
        return false;
      }
      if (this.isInspect) {
        return false;
      }
      if (this.originSchema.mold_type && this.originSchema.mold_type === 1) {
        return false;
      }
      return (
        this.$features.showAIModules() &&
        this.configuration.show_prompt_element_button &&
        this.model.meta._type.type !== 'group' &&
        !this.model.meta.custom
      );
    },
    isShowManualAnswerButton() {
      return (
        this.configuration.show_prompt_element_button &&
        this.configuration.record_manual &&
        this.model.meta._type.type !== 'group' &&
        !this.model.meta.custom
      );
    },
    async copyAnswerText() {
      try {
        const answerText = this.schemaAnswer.data
          .map((d) => d.text || d.boxes.map((b) => b.text))
          .join('\n');
        await copyTextToClipboard(answerText);
        this.$notify({
          title: '提示',
          message: '复制成功',
          type: 'success',
          duration: 1000,
        });
      } catch (error) {
        console.error(error);
      }
    },
    predictNodePosition() {
      EventBus.$emit('predict-node-position', this.model);
    },
    hasNodeAnswer() {
      // NOTE: 只判断答案是否有框。如果答案只选择了枚举类型，不会认为它有答案
      return this.schemaAnswer && this.schemaAnswer.data.length > 0;
    },
    hasEnumValue() {
      return (
        this.schemaAnswer &&
        this.schemaAnswer.value &&
        this.schemaAnswer.value !== ''
      );
    },
    isShowMarker() {
      return (
        this.configuration.show_marker &&
        this.schemaAnswer.marker &&
        !!this.schemaAnswer.marker.name
      );
    },
    isShowMarkerOthers() {
      return (
        this.configuration.show_marker &&
        this.schemaAnswer.marker &&
        this.schemaAnswer.marker.others &&
        this.schemaAnswer.marker.others.length > 0
      );
    },
    isShowScore() {
      return (
        this.$features.showPredictScore() &&
        this.schemaAnswer.score !== undefined &&
        this.schemaAnswer.score !== null &&
        this.schemaAnswer.score >= 0
      );
    },
    isMatch(payload) {
      try {
        let list = this.configuration.confirm_needed_cols || [];
        const flag = list.find((item) => {
          item = item.split('|');
          if (item.length !== payload.length) return false;
          item = item.map((flag, index) => {
            if (flag === '*') return payload[index];
            return flag;
          });
          return _.isEqual(item, payload);
        });
        return flag ? true : false;
      } catch (e) {
        return false;
      }
    },
    isShowConfirmBtn() {
      let list = [...this.model.meta._parent, this.model.data.label];
      if (
        this.$platform.isSzseEnv() &&
        this.model.meta._type.type !== 'enum' &&
        !this.model.meta.custom &&
        this.isMatch(list)
      ) {
        return true;
      }
      return false;
    },
    setConfirmState() {
      this.confirmState = !this.confirmState;
      EventBus.$emit('update-predict-data', {
        confirm: this.confirmState,
        model: this.model,
      });
    },
    setManualAnswer() {
      if (this.changeSchemaManualFn) {
        this.changeSchemaManualFn(!this.schemaAnswer.manual);
      }
    },
    async clearAnswers() {
      try {
        await this.$confirm('是否清空该项下的所有答案？');

        if (this.removeSchemaNodeAnswerFn) {
          this.removeSchemaNodeAnswerFn();
        }
      } catch (error) {
        console.error(error);
      }
    },
    supplementSchemaAnswer() {
      EventBus.$emit('supplement-schema-answers', {
        key: this.model.data.label,
      });
    },
    switchTableRemark() {
      EventBus.$emit('remove-all-frames');
      EventBus.$emit('open-table-remark', {
        model: this.model,
        modelKey: this.modelKey,
      });
    },
    removeAllAnswer() {
      EventBus.$emit('remove-all-frames');
      this.removeSchemaAllAnswerFn();
    },
    removeCustomSchemaNode() {
      this.removeCustomSchemaNodeFn({
        key: this.modelKey,
        md5: this.schemaAnswer.md5,
      });
    },
    switchCustomSchemaNode(enable) {
      this.enableCustomSchemaNode = enable;
    },
    editAnswerLabel(name) {
      this.isEditingAnswerLabel = true;
      this.tempAnswerLabelText = name;
      this.$nextTick(() => {
        this.$refs.answerLabelInput.focus();
      });
    },
    cancelEditAnswerLabel() {
      this.isEditingAnswerLabel = false;
      this.customSchemaNodeValidateMessage = '';
    },
    confirmEditAnswerLabel() {
      if (!this.validateEditCustomSchemaNode()) {
        return;
      }
      this.editCustomSchemaNodeFn({
        key: this.modelKey,
        model: this.model,
        newAnswerLabel: this.tempAnswerLabelText,
      });
      this.isEditingAnswerLabel = false;
    },
    validateEditCustomSchemaNode() {
      if (this.tempAnswerLabelText === '') {
        this.customSchemaNodeValidateMessage =
          this.customSchemaNodeValidateRules.empty;
        return false;
      }
      const groupIndex = _.last(this.model.meta._deepIndex);
      const ansewrGroup = this.$parent.$parent.schemaGroupAnswer[groupIndex];
      if (
        ansewrGroup.some(
          (group) => group.data.label === this.tempAnswerLabelText,
        )
      ) {
        this.customSchemaNodeValidateMessage =
          this.customSchemaNodeValidateRules.repeat;
        return false;
      }
      this.customSchemaNodeValidateMessage = '';
      return true;
    },
    openAnswerChangeRecordDialog() {
      this.showAnswerChangeRecordDialog = true;
      this.getAnswerChangeRecords();
    },
    closeAnswerChangeRecordDialog() {
      this.showAnswerChangeRecordDialog = false;
    },
    getAnswerChangeRecords() {
      if (!this.answerChangeRecords) {
        this.updateAnswerChangeRecords(this.model.answer);
      }
    },
    updateAnswerChangeRecords(answer) {
      const currentAnswer = _.cloneDeep(answer);
      const currentAnswerRecord = currentAnswer.record;

      this.answerChangeRecords = [
        currentAnswer,
        ...currentAnswerRecord.reverse(),
      ];
    },
    syncRemarkAnswer({ schemaNode, answer }) {
      if (schemaNode === this.modelKey && !_.isNil(answer.record)) {
        this.updateAnswerChangeRecords(answer);
      }
    },
    async cancelReviseSuggestion() {
      try {
        const schemaKeyPath = _.tail(this.model.meta._deepLabels).join('-');
        const message = `<div>
          <strong>是否取消对字段 <span style="color: #225476;">${schemaKeyPath}</span> 修改意见的设定？</strong>
          <p style="margin-top: 15px;color: #999;">提示：取消后将影响导出变更记录的范围</p>
          </div>`;
        const confirm = await this.$confirm(message, '提示', {
          dangerouslyUseHTMLString: true,
        }).catch(() => {});

        if (confirm === 'confirm') {
          if (this.cancelReviseSuggestionFn) {
            this.cancelReviseSuggestionFn();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    updatePopoverPosition() {
      this.$nextTick(() => {
        this.$refs.answerChangeRecordsPopover.updatePopper();
      });
    },
    getFieldAuditStatusClassName() {
      return FIELD_STATUS[this.fieldStatus]?.colorValue;
    },
    switchDataIndex(direction) {
      if (this.switchDataIndexFn) {
        this.switchDataIndexFn(direction);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.answer-label {
  width: calc(100% - 17px);
  position: relative;
  .el-icon-warning {
    color: red;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    display: none;
  }
  ::v-deep .not-compliance {
    color: red !important;
    & + .el-icon-warning {
      display: block;
    }
  }
  &.is-diff {
    margin: 1px 0;
    border: 2px solid #f56c6c;
  }

  .conflict-num {
    line-height: 14px;
    background: #f56c6c;
    color: white;
    font-size: 12px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    text-align: center;
  }

  .node-item-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .copy-text-button {
      margin: 0 0 0 5px;
      padding: 2px 5px;
      font-size: 12px;
    }
    .predict-position-button {
      padding: 2px 5px;
      font-size: 12px;
      margin: 0 10px;
    }
    .manual-button {
      padding: 2px 5px;
      font-size: 12px;
      margin: 0 5px;

      &.group {
        margin: 0;

        &:last-of-type {
          margin-right: 5px;
        }
      }
    }
    .el-button-group {
      width: max-content;
    }
    .custom-tag {
      height: 18px;
      line-height: 18px;
      margin-right: 5px;
      color: #ff9e02;
      border: 1px solid #ff9e02;
      background: #fff;
    }
  }

  .answer-create {
    color: #4d5358;
    cursor: pointer;

    &:hover {
      color: #849db9;
    }
  }
  .answer-flex {
    display: flex;
    justify-content: space-between;
    .answer-item-content {
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .answer-name {
        flex: 1;
        height: 1.8em;
        line-height: 1.8em;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
        &.root-name {
          font-weight: bold;
        }
        &.has-answer {
          color: $--color-primary;
          font-weight: bold;
        }
        &.has-predict-answer {
          color: red;
        }
        ::v-deep .highlight {
          background: #feff00;
          &.active {
            background: #fe9633;
          }
        }
        &.black {
          color: #333 !important;
        }
        &.blue {
          color: #409eff !important;
        }
        &.red {
          color: #fc3c38 !important;
        }
        &.orange {
          color: #fdd34e !important;
        }
        &.green {
          color: #3db005 !important;
        }
        em {
          font-style: normal;
          font-size: 13px;
          color: #f56c6c;
        }
      }
      .btn-record {
        margin-left: 10px;
        padding: 4px 6px;
      }
      .el-tag {
        height: 20px;
        line-height: 20px;
        margin-left: 10px;
      }
      .marker-others {
        margin-left: 5px;
        padding: 3px;
      }
      & > i {
        width: 2em;
        line-height: 1.8em;
      }
      .edit-icon {
        margin-left: 5px;
        font-size: 14px;
        color: #409eff;
        cursor: pointer;
      }
      .answer-data-index {
        margin-left: 5px;
        font-size: 12px;
        .el-button {
          margin: 0;
          padding: 0;
        }
      }
    }
    .answer-description {
      margin-top: 3px;
      margin-left: 10px;
      color: #409eff;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
  }
  .el-checkbox-group {
    margin: 3px 0;
    .el-checkbox {
      margin: 2px 10px 2px 0;
      & + .el-checkbox {
        margin-left: 0;
      }
    }
  }
}
.el-radio + .el-radio {
  margin-left: 10px;
}
::v-deep .el-radio__label {
  padding-left: 0;
}
.marker-others-list {
  li {
    margin: 3px 0;
    list-style: none;
  }
}

.collapse-answer {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}

.remove-all-answer {
  color: red;
  cursor: pointer;
}
</style>

<style lang="scss">
.answer-description-tooltip {
  max-width: 378px;
  line-height: 20px;
  h4 {
    margin-bottom: 5px;
  }
}
.edit-answer-label-popover {
  .el-input {
    margin-bottom: 5px;
  }
  .validate-message {
    height: 16px;
    margin-bottom: 5px;
    font-size: 12px;
    color: #f56c6c;
  }
}
.answer-change-record-popover {
  padding: 5px 10px;
  .answer-change-record {
    max-height: 400px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #606060;
      border-radius: 5px;
      &:hover {
        background-color: #6f6f6f;
      }
    }
    &::-webkit-scrollbar-track {
      display: none;
    }
  }
}
</style>
