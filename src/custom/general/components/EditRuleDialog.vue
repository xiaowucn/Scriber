<template>
  <div class="dialog-container">
    <el-dialog
      v-loading="loading"
      :title="getDialogTitle()"
      :visible="true"
      :width="textExtractorDialogVisible ? '1400px' : '700px'"
      class="edit-review-rule-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="closeDialog">
      <div
        class="dialog-content"
        :class="{ 'with-extractor': textExtractorDialogVisible }">
        <div class="form-section">
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
            label-position="left"
            :rules="rules">
            <el-form-item label="验证方式" prop="verification_method">
              <div
                :class="{
                  'change-verification-method': showIntelligentAnalysisButton,
                }">
                <el-radio-group
                  v-model="form.verification_type"
                  :disabled="isReadOnlyMode || isIntelligentProcessing"
                  @change="handleVerificationTypeChange">
                  <el-radio label="consistency">一致性检查</el-radio>
                  <el-radio label="non_consistency">非一致性检查</el-radio>
                </el-radio-group>
                <el-button
                  v-if="showIntelligentAnalysisButton"
                  type="primary"
                  size="small"
                  :disabled="isIntelligentProcessing"
                  @click="handleIntelligentAnalysis"
                  >智能分析</el-button
                >
              </div>
              <div class="tip" v-if="showIntelligentAnalysisButton">
                说明：切换到非一致检查性后，需优先补充法规内容，点击【智能分析】系统会根据法规内容自动获取核心要求、
                验证方式等内容。
              </div>
            </el-form-item>
            <el-form-item label="法规内容" prop="rule_content">
              <div class="form-field-container">
                <div class="form-container">
                  <el-input
                    type="textarea"
                    v-model.trim="form.rule_content"
                    :disabled="isIntelligentProcessing"
                    :readonly="!nowData.is_template"
                    :rows="4"
                    placeholder="请输入详细的法规内容"
                    :class="{
                      'modified-field': isFieldModified('rule_content'),
                    }"
                    style="width: 100%"></el-input>
                  <el-button
                    type="text"
                    @click="handleShowTextExtractorDialog"
                    v-if="!nowData.is_template">
                    原法规
                  </el-button>
                </div>
                <span
                  class="original-value"
                  v-if="isFieldModified('rule_content')">
                  <el-tooltip
                    :content="originalData.rule_content"
                    placement="right"
                    popper-class="original-value-tip">
                    <span class="original-text">修改前</span>
                  </el-tooltip>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="规则名称" prop="name">
              <div class="form-field-container">
                <el-input
                  v-if="isIntelligentProcessing"
                  :value="'系统处理中...'"
                  readonly
                  :class="{ 'modified-field': isFieldModified('name') }">
                </el-input>
                <el-input
                  v-else
                  v-model="form.name"
                  :readonly="isReadOnlyMode"
                  :class="{ 'modified-field': isFieldModified('name') }">
                </el-input>
                <span v-if="isFieldModified('name')" class="original-value">
                  <el-tooltip
                    :content="originalData.name"
                    placement="right"
                    popper-class="original-value-tip">
                    <span class="original-text">修改前</span>
                  </el-tooltip>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="应用场景" prop="scenario_ids">
              <div class="form-field-container">
                <el-input
                  v-if="isReadOnlyMode"
                  readonly
                  :class="{
                    'modified-field': isFieldModified('scenario_ids'),
                  }"
                  :value="
                    nowData.scenarios
                      .filter((item) => form.scenario_ids.includes(item.id))
                      .map((item) => item.name)
                      .join('、')
                  "></el-input>
                <el-select
                  v-else
                  v-model="form.scenario_ids"
                  multiple
                  filterable
                  :disabled="isIntelligentProcessing"
                  placeholder="请选择应用场景"
                  style="width: 100%">
                  <el-option
                    v-for="item in nowData.scenarios"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
                <span
                  v-if="isFieldModified('scenario_ids')"
                  class="original-value">
                  <el-tooltip
                    :content="getOriginalScenarioNames()"
                    placement="right"
                    popper-class="original-value-tip">
                    <span class="original-text">修改前</span>
                  </el-tooltip>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="行为主体" prop="subject">
              <div class="form-field-container">
                <el-input
                  v-if="isIntelligentProcessing"
                  :value="'系统处理中...'"
                  readonly
                  :class="{ 'modified-field': isFieldModified('subject') }">
                </el-input>
                <el-input
                  v-else
                  v-model="form.subject"
                  :readonly="isReadOnlyMode"
                  :class="{ 'modified-field': isFieldModified('subject') }">
                </el-input>
                <span v-if="isFieldModified('subject')" class="original-value">
                  <el-tooltip
                    :content="originalData.subject"
                    placement="right"
                    popper-class="original-value-tip">
                    <span class="original-text">修改前</span>
                  </el-tooltip>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="审核点类型" prop="check_type">
              <div class="form-field-container">
                <div class="form-container">
                  <el-select
                    v-if="
                      [
                        EDIT_RULE_DIALOG_MODE.EDIT,
                        EDIT_RULE_DIALOG_MODE.SAVE,
                      ].includes(mode) && !isIntelligentProcessing
                    "
                    v-model="form.check_type"
                    placeholder=""
                    style="width: 100%">
                    <el-option
                      v-for="item in CHECK_TYPE_MAP"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"></el-option>
                  </el-select>
                  <el-input
                    v-else
                    :value="
                      isIntelligentProcessing
                        ? '系统处理中...'
                        : getCheckTypeName(form.check_type)
                    "
                    :readonly="isReadOnlyMode || isIntelligentProcessing"
                    :class="{
                      'modified-field': isFieldModified('check_type'),
                    }">
                  </el-input>
                  <el-tooltip placement="right">
                    <div slot="content">
                      <ul style="list-style: disc; padding-left: 20px">
                        <li>
                          禁止性条款：包含“不得”“禁止”等否定词，要求主体不做某事；
                        </li>
                        <li>
                          义务性条款：包含“应当”“必须”等肯定词，要求主体做某事；
                        </li>
                        <li>
                          程序性条款：规定行为流程、时限或形式（如“需在...前完成”“应通过...方式”)
                        </li>
                      </ul>
                    </div>
                    <el-button type="text">说明</el-button>
                  </el-tooltip>
                  <span
                    v-if="isFieldModified('check_type')"
                    class="original-value">
                    <el-tooltip
                      :content="getCheckTypeName(originalData.check_type)"
                      placement="right"
                      popper-class="original-value-tip">
                      <span class="original-text">修改前</span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="核心要求" prop="core">
              <div class="form-field-container">
                <el-input
                  v-if="isIntelligentProcessing"
                  :value="'系统处理中...'"
                  type="textarea"
                  :rows="3"
                  readonly
                  :class="{ 'modified-field': isFieldModified('core') }"
                  placeholder="基金合同需约定投资者份额锁定期≥3个月，或设置与持有期限挂钩的短期赎回费用（赎回费用归入基金财产）。">
                </el-input>
                <el-input
                  v-else
                  v-model="form.core"
                  type="textarea"
                  :rows="3"
                  :readonly="isReadOnlyMode"
                  :class="{ 'modified-field': isFieldModified('core') }"
                  placeholder="基金合同需约定投资者份额锁定期≥3个月，或设置与持有期限挂钩的短期赎回费用（赎回费用归入基金财产）。">
                </el-input>
                <span v-if="isFieldModified('core')" class="original-value">
                  <el-tooltip
                    :content="originalData.core"
                    placement="right"
                    popper-class="original-value-tip">
                    <span class="original-text">修改前</span>
                  </el-tooltip>
                </span>
              </div>
            </el-form-item>

            <el-form-item label="验证内容" prop="verification_type">
              <div class="form-field-container">
                <div class="verification-method-container">
                  <!-- 非一致性检查内容 -->
                  <div
                    v-if="form.verification_type === 'non_consistency'"
                    class="verification-content non-consistency-content">
                    <el-input
                      v-if="isIntelligentProcessing"
                      :value="'系统处理中...'"
                      type="textarea"
                      :rows="3"
                      readonly
                      :class="{
                        'modified-field': isFieldModified('check_method'),
                      }"
                      placeholder="检查基金合同中是否包含锁定期或赎回费用的条款">
                    </el-input>
                    <el-input
                      v-else
                      v-model="form.check_method"
                      type="textarea"
                      :rows="3"
                      :readonly="isReadOnlyMode"
                      :class="{
                        'modified-field': isFieldModified('check_method'),
                      }"
                      placeholder="检查基金合同中是否包含锁定期或赎回费用的条款">
                    </el-input>
                    <span
                      v-if="isFieldModified('check_method')"
                      class="original-value">
                    </span>
                  </div>

                  <!-- 一致性检查内容 -->
                  <div
                    v-if="form.verification_type === 'consistency'"
                    class="verification-content consistency-content">
                    <div class="template-config-container">
                      <!-- 模板组列表 -->
                      <div
                        class="templates-container"
                        :class="{
                          'modified-verification-method':
                            isVerificationMethodModified,
                        }">
                        <div
                          v-for="(group, groupIndex) in allTemplateGroups"
                          :key="group.id || groupIndex"
                          class="template-group">
                          <div class="template-group-header">
                            <div class="group-header-container">
                              <el-select
                                v-model="group.label"
                                :disabled="
                                  isReadOnlyMode || isIntelligentProcessing
                                "
                                placeholder="请选择..."
                                size="small"
                                class="group-type-select">
                                <el-option
                                  label="范文"
                                  value="范文"></el-option>
                                <el-option
                                  label="法规"
                                  value="法规"></el-option>
                              </el-select>
                              <el-button
                                v-show="!shouldHideConsistencyButtons"
                                type="text"
                                size="mini"
                                :disabled="
                                  isReadOnlyMode || isIntelligentProcessing
                                "
                                @click="removeTemplateGroup(groupIndex)"
                                class="remove-group-btn">
                                <i class="el-icon-delete"></i>
                              </el-button>
                            </div>
                          </div>
                          <div class="template-contents">
                            <!-- 现有模板内容 -->
                            <div
                              v-for="(content, contentIndex) in group.contents"
                              :key="contentIndex"
                              class="template-content-item">
                              <div class="template-content-text">
                                <el-input
                                  v-if="isIntelligentProcessing"
                                  type="textarea"
                                  :value="'系统处理中...'"
                                  disabled
                                  placeholder="请输入内容"
                                  size="small"
                                  class="content-input">
                                </el-input>
                                <el-input
                                  v-else
                                  type="textarea"
                                  v-model="content.content"
                                  :disabled="isReadOnlyMode"
                                  placeholder="请输入内容"
                                  size="small"
                                  :rows="3"
                                  class="content-input">
                                </el-input>

                                <el-button
                                  type="text"
                                  size="mini"
                                  :disabled="isIntelligentProcessing"
                                  @click="
                                    openContentConfig(group, contentIndex)
                                  "
                                  class="config-btn">
                                  <i class="el-icon-setting"></i>
                                </el-button>
                                <el-button
                                  v-show="!shouldHideConsistencyButtons"
                                  type="text"
                                  size="mini"
                                  :disabled="
                                    isReadOnlyMode ||
                                    isIntelligentProcessing ||
                                    group.contents.length <= 1
                                  "
                                  @click="
                                    removeTemplateContent(group, contentIndex)
                                  "
                                  class="remove-content-btn">
                                  <i class="el-icon-circle-close"></i>
                                </el-button>
                              </div>
                            </div>

                            <!-- 添加内容按钮 -->
                            <div
                              v-show="!shouldHideConsistencyButtons"
                              class="add-content-container">
                              <el-button
                                type="text"
                                :disabled="
                                  isReadOnlyMode || isIntelligentProcessing
                                "
                                @click="addTemplateContent(group)"
                                class="add-content-btn">
                                <i class="el-icon-plus add-content-icon"></i>
                                添加
                              </el-button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 固定在底部的操作按钮和说明 -->
                      <div class="template-actions">
                        <el-button
                          v-show="!shouldHideConsistencyButtons"
                          type="text"
                          :disabled="isReadOnlyMode || isIntelligentProcessing"
                          @click="addTemplateGroup"
                          class="add-group-btn">
                          添加一组法规/范文
                        </el-button>
                        <span class="action-description">
                          说明：一组内多个内容的关系为且，每组内容的关系为或
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    v-if="isFieldModified('verification_type')"
                    class="original-value">
                    <el-tooltip
                      placement="right"
                      popper-class="original-value-tip">
                      <div
                        slot="content"
                        v-html="getOriginalVerificationTypeHtml()"></div>
                      <span class="original-text">修改前</span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </el-form-item>
          </el-form>

          <!-- 一致性检查配置弹窗 -->
          <el-dialog
            title="一致性检查配置"
            :visible.sync="contentConfigDialogVisible"
            width="600px"
            :close-on-click-modal="false"
            append-to-body>
            <el-form
              ref="contentConfigForm"
              :model="currentContentConfig"
              label-width="140px"
              class="content-config-form">
              <!-- 检查章节 -->
              <el-form-item>
                <span slot="label">
                  <el-tooltip placement="left" popper-class="chapter-tooltip">
                    <div slot="content">
                      <div style="line-height: 1.6">
                        <div>1.同一段内容可关联多个检查章节；</div>
                        <div>
                          2.目录章节可选择一级、二级或三级层级作为检查范围；
                        </div>
                        <div>
                          3.两个文本框输入的章节为逻辑「或」关系，即内容在任一指定<br />章节中出现即判定合规；
                        </div>
                        <div>
                          4.若需同时检查多个章节，可在单个文本框内使用「&」符号分<br />隔不同章节（示例：托管人义务&管理人义务）；
                        </div>
                      </div>
                    </div>
                    <i
                      class="el-icon-question"
                      style="
                        color: #909399;
                        cursor: pointer;
                        margin-left: 4px;
                      "></i>
                  </el-tooltip>
                  检查章节
                </span>
                <div class="chapters-config">
                  <div
                    v-for="(_, index) in currentContentConfig.chapters"
                    :key="index"
                    class="chapter-item">
                    <el-input
                      v-model.trim="currentContentConfig.chapters[index]"
                      placeholder="请输入章节名称"
                      size="small"
                      :disabled="isReadOnlyMode"
                      class="chapter-input">
                    </el-input>
                    <el-button
                      v-show="!shouldHideConsistencyButtons"
                      type="text"
                      size="mini"
                      @click="removeChapter(index)"
                      class="remove-chapter-btn">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </div>
                  <el-button
                    type="text"
                    v-show="!shouldHideConsistencyButtons"
                    @click="addChapter"
                    class="add-chapter-btn">
                    增加检查章节
                  </el-button>
                </div>
              </el-form-item>

              <!-- 是否检查上下文 -->
              <el-form-item>
                <span slot="label">
                  <el-tooltip placement="left" popper-class="context-tooltip">
                    <div slot="content">
                      <div style="line-height: 1.6">
                        <div>
                          是：在检查范文/法规一致内容的基础上，<br />系统继续检查对应章节内一致内容的上下文；
                        </div>
                        <div>否：系统仅检查与范文/法规一致的内容</div>
                      </div>
                    </div>
                    <i
                      class="el-icon-question"
                      style="
                        color: #909399;
                        cursor: pointer;
                        margin-left: 4px;
                      "></i>
                  </el-tooltip>
                  是否检查上下文
                </span>
                <el-radio-group
                  v-model="currentContentConfig.diff_context"
                  :disabled="disabeldContext || isReadOnlyMode">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelContentConfig" size="small"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="confirmContentConfig"
                size="small"
                >确认</el-button
              >
            </div>
          </el-dialog>
        </div>
        <div v-if="textExtractorDialogVisible" class="extractor-section">
          <text-extractor
            class="text-extractor"
            :readonly="isReadOnlyMode"
            :content="ruleContent"
            :loading="rullContentLoading"
            :old-content="form.rule_content"
            @close="textExtractorDialogVisible = false"
            @confirm="handleChangeRuleContent"></text-extractor>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取消</el-button>
        <template v-if="mode === EDIT_RULE_DIALOG_MODE.REVIEW">
          <el-button type="primary" @click="handleTest" size="small">
            开始测试
          </el-button>
          <el-button type="primary" @click="handleApprove" size="small">
            审核通过
          </el-button>
          <el-button type="primary" @click="handleReject" size="small">
            审核不通过
          </el-button>
        </template>
        <template v-else-if="mode === EDIT_RULE_DIALOG_MODE.EDIT">
          <el-button
            type="primary"
            @click="handleTest"
            size="small"
            :disabled="textExtractorDialogVisible || isIntelligentProcessing">
            开始测试
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            size="small"
            :disabled="
              textExtractorDialogVisible || notEdit || isIntelligentProcessing
            ">
            提交审核
          </el-button>
        </template>
        <template v-else-if="mode === EDIT_RULE_DIALOG_MODE.DELETE_REVIEW">
          <el-button type="primary" @click="handleTest" size="small">
            开始测试
          </el-button>
          <el-button type="danger" @click="handleDelete" size="small">
            确认删除
          </el-button>
          <el-button type="primary" @click="handleCancleDel" size="small">
            取消删除
          </el-button>
        </template>
        <template v-else-if="mode === EDIT_RULE_DIALOG_MODE.VIEW">
          <el-button
            type="primary"
            @click="handleTest"
            size="small"
            :disabled="isIntelligentProcessing">
            开始测试
          </el-button>
        </template>
        <template v-else-if="mode === EDIT_RULE_DIALOG_MODE.SAVE">
          <el-button
            type="primary"
            @click="handleCacheSave"
            size="small"
            :disabled="isIntelligentProcessing">
            保存
          </el-button>
        </template>
      </div>
    </el-dialog>

    <!-- 审核不通过原因弹窗 -->
    <el-dialog
      :visible.sync="rejectDialogVisible"
      width="500px"
      :close-on-click-modal="false">
      <el-input
        type="textarea"
        v-model="rejectReason"
        placeholder="请输入审核不通过的原因"
        style="width: 100%">
      </el-input>
      <div slot="title" class="reject-reason-title">
        <div>不通过原因<span class="required">（必填）</span></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelReject" size="small">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirmReject"
          :disabled="!rejectReason"
          size="small">
          提交
        </el-button>
      </div>
    </el-dialog>
    <test-model-rule-dialog
      v-if="testRuleDialogVisible"
      :document-list="documentList"
      :test-rule-info="form"
      :id="nowData.id"
      @close="handleTestDialogClose" />
  </div>
</template>
<script>
import TextExtractor from './TextExtractor.vue';
import TestModelRuleDialog from './TestModelRuleDialog.vue';
import { CHECK_TYPE_MAP, EDIT_RULE_DIALOG_MODE } from '@/store/constants.js';
import { laws as lawsApi } from '@/store/api';
import _ from 'lodash';

export default {
  name: 'edit-rule-dialog',
  props: {
    mode: {
      type: String,
      default: EDIT_RULE_DIALOG_MODE.EDIT,
    },
    originalData: {
      type: Object,
      default: () => ({}),
    },
    nowData: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TextExtractor,
    TestModelRuleDialog,
  },
  computed: {
    isLawInitialRule() {
      return this.nowData.is_template === false && !this.nowData.reviewer_id;
    },
    showIntelligentAnalysisButton() {
      const initVerificationType =
        this.nowData.check_method === null ? 'consistency' : 'non_consistency';
      return (
        initVerificationType === 'consistency' &&
        this.form.verification_type === 'non_consistency' &&
        [EDIT_RULE_DIALOG_MODE.EDIT, EDIT_RULE_DIALOG_MODE.SAVE].includes(
          this.mode,
        ) &&
        !this.isLawInitialRule
      );
    },
    isReviewMode() {
      return (
        this.mode === EDIT_RULE_DIALOG_MODE.REVIEW ||
        this.mode === EDIT_RULE_DIALOG_MODE.DELETE_REVIEW
      );
    },
    isReadOnlyMode() {
      return (
        this.mode === EDIT_RULE_DIALOG_MODE.REVIEW ||
        this.mode === EDIT_RULE_DIALOG_MODE.DELETE_REVIEW ||
        this.mode === EDIT_RULE_DIALOG_MODE.VIEW
      );
    },
    notEdit() {
      const keys = Object.keys(this.form);

      for (const k of keys) {
        const a = this.form[k];
        const b = this.nowData[k];
        if (Array.isArray(a) && Array.isArray(b)) {
          if (!_.isEqual(_.sortBy(a), _.sortBy(b))) {
            return false;
          }
        } else if (a !== b) {
          return false;
        }
      }
      return true;
    },
    allTemplateGroups() {
      return this.form.templates && this.form.templates.groups
        ? this.form.templates.groups
        : [];
    },
    shouldHideConsistencyButtons() {
      return (
        this.isReadOnlyMode && this.form.verification_type === 'consistency'
      );
    },
    isVerificationMethodModified() {
      if (this.mode !== EDIT_RULE_DIALOG_MODE.REVIEW || !this.originalData) {
        return false;
      }
      return (
        this.isFieldModified('check_method') ||
        this.isFieldModified('templates')
      );
    },
    disabeldContext() {
      return (
        this.currentContentConfig.chapters.filter((chapter) => chapter)
          .length === 0
      );
    },
    rules() {
      // 如果正在进行智能处理，禁用所有校验规则
      if (this.isIntelligentProcessing) {
        return {};
      }

      let rules = {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        scenario_ids: [
          {
            required: true,
            message: '请选择应用场景',
            trigger: 'change',
          },
        ],
        verification_type: [
          { required: true, message: '请选择验证类型', trigger: 'change' },
        ],
      };

      if (this.form.verification_type === 'non_consistency') {
        rules = {
          ...rules,
          rule_content: [
            {
              required: true,
              message: '请输入法规内容',
            },
          ],
          subject: [
            { required: true, message: '请输入行为主体', trigger: 'blur' },
          ],
          check_type: [
            { required: true, message: '请选择审核点类型', trigger: 'change' },
          ],
          core: [
            { required: true, message: '请输入核心要求', trigger: 'blur' },
          ],
          check_method: [
            {
              required: true,
              message: '请输入验证方式',
              trigger: 'blur',
              validator: (_, value, callback) => {
                if (
                  this.form.verification_type === 'non_consistency' &&
                  !value
                ) {
                  callback(new Error('请输入检查方法'));
                } else {
                  callback();
                }
              },
            },
          ],
        };
      }
      return rules;
    },
  },
  data() {
    return {
      CHECK_TYPE_MAP,
      EDIT_RULE_DIALOG_MODE,
      // 智能分析处理状态
      isIntelligentProcessing: false,
      intelligentProcessingCache: {},
      abortController: null,
      form: {
        name: '',
        scenario_ids: [],
        rule_content: '',
        subject: '',
        check_type: '',
        core: '',
        check_method: null,
        verification_type: 'consistency', // 默认为一致性检查
        templates: null, // 模板数据
      },
      dataCache: {
        consistency: null, // 一致性检查数据缓存
        nonConsistency: null, // 非一致性检查数据缓存
        originalData: null, // 原始数据缓存
      },
      textExtractorDialogVisible: false,
      rejectDialogVisible: false,
      rejectReason: '',
      testRuleDialogVisible: false,
      rullContentLoading: false,
      ruleContent: '',
      documentList: [],
      contentConfigDialogVisible: false,
      currentContentConfig: {
        chapters: [],
        diff_context: false,
      },
      currentEditingGroup: null,
      currentEditingContentIndex: -1,
    };
  },
  methods: {
    async handleIntelligentAnalysis() {
      if (!this.form.rule_content) {
        this.$message.error('请输入法规内容后再进行智能分析');
        return;
      }
      this.$refs.form.clearValidate();

      this.abortController = new AbortController();

      // 缓存当前表单数据
      this.intelligentProcessingCache = {
        name: this.form.name,
        subject: this.form.subject,
        check_type: this.form.check_type,
        core: this.form.core,
        templates: JSON.parse(JSON.stringify(this.form.templates)),
      };

      // 设置处理中状态
      this.isIntelligentProcessing = true;
      let data = this.intelligentProcessingCache;
      try {
        const resData = await lawsApi.getCheckPointByContent(
          this.nowData.rule_id,
          {
            content: this.form.rule_content,
          },
          {
            signal: this.abortController.signal,
          },
        );
        data = resData;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        if (data) {
          const { name, subject, check_type, core, check_method } = data;
          this.form.name = name;
          this.form.subject = subject;
          this.form.check_type = check_type;
          this.form.core = core;
          this.form.check_method = check_method;

          this.isIntelligentProcessing = false;
          this.intelligentProcessingCache = {};
        }
      }
    },
    getDialogTitle() {
      switch (this.mode) {
        case EDIT_RULE_DIALOG_MODE.REVIEW:
        case EDIT_RULE_DIALOG_MODE.DELETE_REVIEW:
          return '审核规则复核';
        case EDIT_RULE_DIALOG_MODE.VIEW:
          return '查看规则';
        case EDIT_RULE_DIALOG_MODE.EDIT:
        default:
          return '修改审核规则';
      }
    },
    init() {
      const {
        name,
        rule_content,
        scenario_ids,
        subject,
        check_type,
        core,
        check_method,
        templates,
      } = this.nowData;
      // 根据 check_method 判断验证类型
      const verification_type =
        check_method === null ? 'consistency' : 'non_consistency';

      // 处理模板数据
      let templatesValue = null;
      if (templates && templates.groups) {
        templatesValue = {
          groups: templates.groups.map((group) => ({
            ...group,
            contents: group.contents.map((content) => ({
              ...content,
            })),
          })),
        };
      } else if (verification_type === 'consistency') {
        // 如果是一致性检查但没有模板数据，初始化一个默认的模板组
        templatesValue = {
          groups: [
            {
              label: 'template', // 默认选择范文
              contents: [
                {
                  chapters: [],
                  diff_context: false,
                  content: '',
                },
              ],
            },
          ],
        };
      }

      this.form = {
        name,
        rule_content,
        scenario_ids,
        subject,
        check_type,
        core,
        check_method,
        verification_type,
        templates: templatesValue,
      };
    },
    getCheckTypeName(check_type) {
      const type = CHECK_TYPE_MAP.find((item) => item.value === check_type);
      return type ? type.label : '';
    },
    handleChangeRuleContent(contents) {
      this.form.rule_content = contents.join('');
      this.textExtractorDialogVisible = false;
    },
    async handleShowTextExtractorDialog() {
      this.textExtractorDialogVisible = true;
      if (this.ruleContent) {
        return;
      }
      this.rullContentLoading = true;
      try {
        const { content } = await lawsApi.getRuleContent(this.nowData.ruleId);
        this.ruleContent = content;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.rullContentLoading = false;
      }
    },
    closeDialog() {
      this.$emit('close');
    },

    async handleTest() {
      this.getDocumentList({
        scenario_ids: this.nowData.scenario_ids,
      });

      const validationResult = await this.validateFormWithVerificationData();
      if (!validationResult.valid) {
        return;
      }

      this.testRuleDialogVisible = true;
    },
    async getDocumentList(params) {
      try {
        const { files } = await lawsApi.getTestFileList(params);
        this.documentList = files;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleTestDialogClose() {
      this.testRuleDialogVisible = false;
    },
    async handleSubmit() {
      const validationResult = await this.validateFormWithVerificationData();
      if (!validationResult.valid) {
        return;
      }

      const submitData = { ...this.form };

      if (submitData.verification_type === 'consistency') {
        submitData.check_method = null;
      } else {
        submitData.templates = null;
      }
      delete submitData.verification_type;

      this.$emit('submit', submitData);
    },
    validateConsistencyCheck() {
      if (!this.form.templates || this.form.templates.groups.length === 0) {
        return { valid: false, message: '一致性检查需要填写内容' };
      }

      for (const group of this.form.templates.groups) {
        if (!group.label) {
          return {
            valid: false,
            message: '一致性检查中请选择需要比对的内容是法规还是范文',
          };
        }

        const hasEmptyContent = group.contents.some(
          (content) => !content.content.trim(),
        );
        if (hasEmptyContent) {
          return {
            valid: false,
            message: '一致性检查中所有内容都不能为空',
          };
        }
      }

      return { valid: true };
    },
    async validateFormWithVerificationData() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) {
        return { valid: false };
      }

      // 验证类型的额外校验
      if (this.form.verification_type === 'consistency') {
        const validationResult = this.validateConsistencyCheck();
        if (!validationResult.valid) {
          this.$message.error(validationResult.message);
          return { valid: false };
        }
      } else if (this.form.verification_type === 'non_consistency') {
        // 非一致性检查的校验
        if (!this.form.check_method || !this.form.check_method.trim()) {
          this.$message.error('请填写内容');
          return { valid: false };
        }
      }

      return { valid: true };
    },
    async handleCacheSave() {
      // 使用通用的表单验证方法
      const validationResult = await this.validateFormWithVerificationData();
      if (!validationResult.valid) {
        return;
      }
      this.$emit('cache', this.form);
    },
    handleApprove() {
      this.$emit('approve');
    },
    handleReject() {
      this.rejectDialogVisible = true;
    },
    handleDelete() {
      this.$emit('delete');
    },
    handleCancleDel() {
      this.$emit('cancleDel');
    },
    handleConfirmReject() {
      this.$emit('reject', this.rejectReason);
      this.rejectDialogVisible = false;
      this.rejectReason = '';
    },
    handleCancelReject() {
      this.rejectDialogVisible = false;
      this.rejectReason = '';
    },
    isFieldModified(fieldName) {
      if (this.mode !== EDIT_RULE_DIALOG_MODE.REVIEW || !this.originalData) {
        return false;
      }
      return (
        JSON.stringify(this.form[fieldName]) !==
        JSON.stringify(this.originalData[fieldName])
      );
    },
    getOriginalScenarioNames() {
      if (!this.originalData.scenario_ids) {
        return '';
      }
      const names = this.originalData.scenario_ids
        .map((id) => {
          const option = this.nowData.scenarios.find((opt) => opt.id === id);
          return option ? option.name : '';
        })
        .filter((name) => name);
      return names.join('、');
    },
    getOriginalVerificationType() {
      if (!this.originalData) return '';
      const originalType =
        this.originalData.check_method === null
          ? 'consistency'
          : 'non_consistency';

      if (originalType === 'consistency') {
        let content = '一致性检查\n';
        if (this.originalData.templates && this.originalData.templates.groups) {
          let faguiGroups = [];
          let fanwenGroups = [];

          // 先分类收集法规和范文组
          this.originalData.templates.groups.forEach((group) => {
            if (group.contents && group.contents.length > 0) {
              if (group.label === '法规') {
                faguiGroups.push(group);
              } else if (group.label === '范文') {
                fanwenGroups.push(group);
              }
            }
          });

          // 先显示所有法规组
          faguiGroups.forEach((group, groupIndex) => {
            const validContents = group.contents.filter((item) => item.content);
            if (validContents.length === 1) {
              // 只有一条数据时，显示第一级序号
              content += `法规${groupIndex + 1}：${validContents[0].content}\n`;
            } else {
              // 多条数据时，显示层级序号
              validContents.forEach((item, itemIndex) => {
                content += `法规${groupIndex + 1}-${itemIndex + 1}：${
                  item.content
                }\n`;
              });
            }
          });

          // 再显示所有范文组
          fanwenGroups.forEach((group, groupIndex) => {
            const validContents = group.contents.filter((item) => item.content);
            if (validContents.length === 1) {
              // 只有一条数据时，显示第一级序号
              content += `范文${groupIndex + 1}：${validContents[0].content}\n`;
            } else {
              // 多条数据时，显示层级序号
              validContents.forEach((item, itemIndex) => {
                content += `范文${groupIndex + 1}-${itemIndex + 1}：${
                  item.content
                }\n`;
              });
            }
          });
        }
        return content.trim();
      } else {
        const checkMethod = this.originalData.check_method;
        return `非一致性检查\n${checkMethod}`;
      }
    },
    getOriginalVerificationTypeHtml() {
      const textContent = this.getOriginalVerificationType();
      return textContent
        .replace(/\n/g, '<br/><br/>')
        .replace(/(<br\/><br\/>)+$/, '');
    },
    handleVerificationTypeChange(newType) {
      // 保存当前表单数据到对应的缓存中
      if (newType === 'consistency') {
        const formData = _.cloneDeep(this.form);
        formData.verification_type = 'non_consistency';
        this.dataCache.nonConsistency = formData;
      } else {
        const formData = _.cloneDeep(this.form);
        formData.verification_type = 'consistency';
        this.dataCache.consistency = formData;
      }

      if (newType === 'consistency') {
        // 切换到一致性检查
        if (this.dataCache.consistency) {
          // 如果有缓存的一致性检查数据，恢复它
          Object.assign(this.form, this.dataCache.consistency);
        } else {
          Object.assign(this.form, {
            templates: null,
          });
        }
      } else {
        // 切换到非一致性检查
        if (this.dataCache.nonConsistency) {
          // 如果有缓存的非一致性检查数据，恢复它
          Object.assign(this.form, this.dataCache.nonConsistency);
        } else {
          // 如果没有缓存数据，根据模式决定数据来源
          if (
            this.mode === EDIT_RULE_DIALOG_MODE.EDIT ||
            this.mode === EDIT_RULE_DIALOG_MODE.SAVE
          ) {
            // EDIT或SAVE模式：保留应用场景和法规内容，重置其他字段
            const preservedScenario = this.form.scenario_ids;
            const preservedContent = this.form.rule_content;

            Object.assign(this.form, {
              name: '',
              scenario_ids: preservedScenario,
              rule_content: preservedContent,
              verification_type: 'non_consistency',
              check_method: null,
              subject: '',
              core: '',
              check_type: '',
              templates: null,
            });
          }
        }
      }

      // 重新验证表单
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleTemplateContentChange() {
      // 模板选择变化时的处理逻辑
      // 可以在这里添加额外的业务逻辑
    },
    addTemplateGroup() {
      if (this.form.templates) {
        for (const group of this.form.templates.groups) {
          const hasEmptyContent = group.contents.some(
            (content) => !content.content || content.content.trim() === '',
          );
          if (hasEmptyContent) {
            this.$message.warning('请先填写完所有组的内容再添加新组');
            return;
          }
        }
      }

      // 添加新的模板组
      const newGroup = {
        label: '', // 默认选择范文
        contents: [
          {
            chapters: [],
            diff_context: false,
            content: '',
          },
        ],
      };

      // 确保 form.templates 和 groups 存在
      if (!this.form.templates) {
        this.form.templates = { groups: [] };
      }
      if (!this.form.templates.groups) {
        this.form.templates.groups = [];
      }

      this.form.templates.groups.push(newGroup);

      // 滚动到新添加的组
      this.$nextTick(() => {
        const dialogBody = this.$el.querySelector('.el-dialog__body');
        if (dialogBody) {
          dialogBody.scrollTop = dialogBody.scrollHeight;
        }
      });
    },
    removeTemplateGroup(groupIndex) {
      this.$confirm('是否确认删除这一组法规/范文？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (
            this.form.templates &&
            this.form.templates.groups &&
            this.form.templates.groups[groupIndex]
          ) {
            this.form.templates.groups.splice(groupIndex, 1);
          }
        })
        .catch(() => {});
    },

    addTemplateContent(group) {
      // 校验当前组的所有内容是否都不为空
      const hasEmptyContent = group.contents.some(
        (content) => !content.content.trim(),
      );
      if (hasEmptyContent) {
        this.$message.warning('请先填写完所有现有内容再添加新条目');
        return;
      }

      // 为组添加新的模板内容
      const newContent = {
        chapters: [],
        diff_context: false,
        content: '',
      };
      group.contents.push(newContent);
    },
    removeTemplateContent(group, contentIndex) {
      this.$confirm('是否确认删除该条法规/范文？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          group.contents.splice(contentIndex, 1);
        })
        .catch(() => {});
    },
    openContentConfig(group, contentIndex) {
      // 打开内容配置弹窗
      this.currentEditingGroup = group;
      this.currentEditingContentIndex = contentIndex;
      const content = group.contents[contentIndex];

      // 复制当前配置到编辑对象
      this.currentContentConfig = {
        chapters: [...(content.chapters || [])],
        diff_context: content.diff_context || false,
      };

      // 如果章节为空，添加一个空章节
      if (this.currentContentConfig.chapters.length === 0) {
        this.currentContentConfig.chapters.push('');
      }

      this.contentConfigDialogVisible = true;
    },
    cancelContentConfig() {
      // 取消配置
      this.contentConfigDialogVisible = false;
      this.currentEditingGroup = null;
      this.currentEditingContentIndex = -1;
      this.currentContentConfig = {
        chapters: [],
        diff_context: false,
      };
    },
    confirmContentConfig() {
      // 确认配置
      if (this.currentEditingGroup && this.currentEditingContentIndex >= 0) {
        const content =
          this.currentEditingGroup.contents[this.currentEditingContentIndex];
        if (
          this.currentContentConfig.chapters.length > 1 &&
          this.currentContentConfig.chapters.some((chapter) => !chapter)
        ) {
          this.$message.warning('请填写完所有章节');
          return;
        }

        // 更新内容配置
        content.chapters = this.currentContentConfig.chapters.filter(
          (chapter) => chapter,
        );
        content.diff_context = this.currentContentConfig.diff_context;

        this.contentConfigDialogVisible = false;
        this.currentEditingGroup = null;
        this.currentEditingContentIndex = -1;
        this.currentContentConfig = {
          chapters: [],
          diff_context: false,
        };
      }
    },
    addChapter() {
      // 添加章节
      if (this.currentContentConfig.chapters.every((chapter) => chapter)) {
        this.currentContentConfig.chapters.push('');
      } else {
        this.$message.warning('请先填写完所有章节再添加新章节');
      }
    },
    removeChapter(index) {
      // 删除章节
      if (this.currentContentConfig.chapters.length > 1) {
        this.currentContentConfig.chapters.splice(index, 1);
      } else {
        this.$message.warning('至少需要保留一个章节');
      }
    },
  },
  watch: {
    'currentContentConfig.chapters': {
      handler(newChapters) {
        // 检查是否只有一条且内容为空，自动设置为否
        const validChapters = newChapters.filter((chapter) => chapter);
        if (
          validChapters.length === 0 &&
          this.currentContentConfig.diff_context
        ) {
          this.currentContentConfig.diff_context = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  },
};
</script>
<style lang="scss" scoped>
.dialog-content {
  display: flex;
  gap: 20px;
  overflow: hidden;

  &.with-extractor {
    .form-section {
      min-width: 0;
      padding-right: 10px;
    }

    .extractor-section {
      flex: 1;
      min-width: 0;
      border-left: 1px solid #e4e7ed;
      padding-left: 20px;
    }
  }

  .form-section {
    flex: 1;
  }
  .tip {
    color: red;
    font-size: 12px;
    line-height: 24px;
  }
  .change-verification-method {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.form-container {
  display: flex;
  align-items: center;
  column-gap: 20px;
  width: 100%;
}

.form-field-container {
  display: flex;
  align-items: center;
  column-gap: 10px;
  .modified-field {
    color: red;
    ::v-deep .el-input__inner,
    ::v-deep .el-textarea__inner {
      border-color: #f56c6c !important;
    }

    ::v-deep .el-select .el-input__inner {
      border-color: #f56c6c !important;
    }
  }

  .original-value {
    display: block;
    flex-shrink: 0;
    font-size: 12px;
    color: #909399;

    .original-text {
      cursor: pointer;
    }
  }

  .editing-field {
    ::v-deep .el-textarea__inner {
      border-color: #409eff !important;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
    }
  }
}

.reject-reason-title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  .required {
    color: #ff6955;
  }
}

.verification-method-container {
  width: 100%;
  display: flex;
  column-gap: 10px;
  align-items: center;
  .verification-content {
    width: 100%;
    &.non-consistency-content {
      .editable-textarea {
        margin-bottom: 8px;
      }
    }
  }
  .modified-verification-method {
    border: 1px solid #f56c6c;
    ::v-deep .el-input.is-disabled .el-input__inner,
    ::v-deep .el-textarea.is-disabled .el-textarea__inner {
      background-color: #ffffff;
      border-color: rgb(220, 223, 230);
      color: rgb(96, 98, 102);
    }
  }
}

.template-config-container {
  width: 100%;
  display: flex;
  flex-direction: column;

  .templates-container {
    border-radius: 4px;
    margin-bottom: 12px;

    .template-group {
      background-color: #f5f7fa;
      padding: 0 12px;
      &:last-child {
        border-bottom: none;
      }

      .template-group-header {
        padding: 12px 0;

        .group-header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .group-type-select {
            flex: 1;
            margin-right: 8px;
          }

          .remove-group-btn {
            color: #f56c6c;
            font-size: 16px;
            padding: 0;

            &:hover {
              color: #f78989;
            }
          }
        }
      }

      .template-contents {
        .template-content-item {
          padding: 8px;
          border: 1px solid #ebeef5;
          border-radius: 4px;
          margin-bottom: 8px;
          background-color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          .template-content-text {
            display: flex;
            align-items: center;
            gap: 4px;
            .content-input {
              width: 100%;
            }
            .config-btn {
              color: #909399;
              font-size: 16px;
              margin-left: 0;

              &:hover {
                color: #409eff;
              }
            }

            .remove-content-btn {
              font-size: 16px;
              margin-left: 0;
            }
          }
        }
        .add-content-container {
          display: flex;
          justify-content: center;
          .add-content-btn {
            padding: 6px 0;
            font-size: 15px;
          }
          .add-content-icon {
            background-color: #225476;
            color: #fff;
          }
        }
      }
    }
  }

  .template-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
    margin-top: auto; // 推到底部

    .add-group-btn {
      color: #409eff;
      font-size: 14px;
      padding: 0;
      margin-right: 12px;

      &:hover {
        color: #66b1ff;
      }
    }

    .action-description {
      font-size: 12px;
      color: #909399;
      line-height: 1.4;
    }
  }
}

// 配置弹窗样式
.content-config-form {
  .chapters-config {
    .chapter-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .chapter-input {
        flex: 1;
        margin-right: 8px;
      }

      .remove-chapter-btn {
        color: #f56c6c;
        font-size: 16px;
        padding: 0;

        &:hover {
          color: #f78989;
        }
      }
    }

    .add-chapter-btn {
      color: #409eff;
      font-size: 14px;
      padding: 0;

      &:hover {
        color: #66b1ff;
      }
    }
  }
}
</style>
<style lang="scss">
.original-value-tip {
  &.el-tooltip__popper {
    max-width: 400px;
    max-height: 300px;
    overflow-y: auto;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-x: hidden;
  }
}
.edit-review-rule-dialog {
  .el-dialog {
    margin: 0 !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .el-dialog__body {
    flex: 1;
    max-height: 80vh;
    overflow-y: auto;
    padding: 20px;
  }
}
@media (max-width: 1200px) {
  .edit-review-rule-dialog {
    .el-dialog {
      width: 95vw !important;
      max-width: none !important;
    }
  }
}

@media (max-width: 768px) {
  .edit-review-rule-dialog {
    .el-dialog {
      width: 100vw !important;
      height: 100vh !important;
      max-height: none !important;
      border-radius: 0;
    }
  }

  .form-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}
</style>
