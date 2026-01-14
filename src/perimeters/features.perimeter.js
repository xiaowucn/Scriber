import { createPerimeter } from 'vue-kindergarten';
import store from '@/store';
import { scriberPublicPoc, FileListTableColumns } from '@/store/constants';
import platformPerimeter from './platform.perimeter';
import userPerimeter from './user.perimeter';

export default createPerimeter({
  purpose: 'features',

  // 是否开启接口加密（登录、用户相关接口）
  enableEncryptData() {
    return this.child.config.encrypted_handshake;
  },

  // 是否支持自定义schema字段
  supportCustomField() {
    return platformPerimeter.isCcxiEnv();
  },

  // 是否展示AI相关模块
  showAIModules() {
    return !!this.child.config.show_ai_modules || platformPerimeter.isHkexEnv();
  },

  // 是否支持多schema模式
  supportMultipleMolds() {
    return !!this.child.config.support_multiple_molds;
  },

  // 是否支持批量修改功能
  supportBatchEdit() {
    return !platformPerimeter.isCcxiEnv();
  },

  // 是否开启文档（答案）对比功能
  supportRemarkAnswerDiff() {
    return platformPerimeter.isCcxiEnv();
  },

  // 是否支持上传zip文件压缩包
  supportUploadZipFile() {
    if (userPerimeter.isCcxiNormalUser()) {
      return false;
    }
    return this.child.config.zip_upload;
  },

  // 是否通过 SSE 方式上传zip文件
  supportUploadZipFileBySSE() {
    return !platformPerimeter.isHkexEnv();
  },

  // 上传文件时打开Popup弹窗
  showUploadFilePopup() {
    return platformPerimeter.isCcxiEnv() || platformPerimeter.isHtEnv();
  },

  // 上传文件弹窗是否需要选择Schema
  showSchemaOptionsInUploadFilePopup() {
    return platformPerimeter.isHtEnv();
  },

  // 是否展示文件类型标签
  showFileTag() {
    return platformPerimeter.isCcxiEnv();
  },

  getFileListTableColumns() {
    let columns = FileListTableColumns;

    const isShowSchema =
      !platformPerimeter.isCmfchinaEnv() && !platformPerimeter.isNafmiiEnv();
    if (!isShowSchema) {
      columns = columns.filter((item) => item.key !== 'schema');
    }

    const isShowAIStatus =
      this.showAIModules() &&
      !platformPerimeter.isCmfchinaEnv() &&
      !platformPerimeter.isNafmiiEnv();
    if (!isShowAIStatus) {
      columns = columns.filter((item) => item.key !== 'ai_status');
    }

    const isShowSceneAndAIStatus = platformPerimeter.isCmfchinaEnv();
    if (!isShowSceneAndAIStatus) {
      columns = columns.filter((item) => item.key !== 'scene_and_ai_status');
    }

    const isShowTaskType =
      !platformPerimeter.isCmfchinaEnv() && !platformPerimeter.isNafmiiEnv();
    if (!isShowTaskType) {
      columns = columns.filter((item) => item.key !== 'task_type');
    }

    if (!this.showFileTag()) {
      columns = columns.filter((item) => item.key !== 'file_type');
    }

    const isShowProjectName = platformPerimeter.isCgsEnv();
    if (!isShowProjectName) {
      columns = columns.filter((item) => item.key !== 'product_name');
    }

    const isShowManageName = platformPerimeter.isCgsEnv();
    if (!isShowManageName) {
      columns = columns.filter((item) => item.key !== 'manager_name');
    }

    const isShowSysFrom = platformPerimeter.isCgsEnv();
    if (!isShowSysFrom) {
      columns = columns.filter((item) => item.key !== 'sysfrom');
    }

    const isShowReviewMethods = platformPerimeter.isCgsEnv();
    if (!isShowReviewMethods) {
      columns = columns.filter((item) => item.key !== 'source');
    }

    const isShowInsightQueueStamp = platformPerimeter.isNafmiiEnv();
    if (!isShowInsightQueueStamp) {
      columns = columns.filter((item) => item.key !== 'insight_queue_stamp');
    }

    const isShowInsightParseStamp = platformPerimeter.isNafmiiEnv();
    if (!isShowInsightParseStamp) {
      columns = columns.filter((item) => item.key !== 'insight_parse_stamp');
    }

    if (!platformPerimeter.isNafmiiEnv()) {
      const nafmiiEnvSpecificColumns = [
        'nafmii_mold_names',
        'nafmii_task_types',
        'nafmii_file_source',
        'nafmii_ai_status',
        'nafmii_confirm_status',
        'nafmii_execute_push_stamp',
      ];
      columns = columns.filter(
        (item) => !nafmiiEnvSpecificColumns.includes(item.key),
      );
    }

    const isReviewColumn = this.child.config?.show_file_scenario;
    if (!isReviewColumn) {
      columns = columns.filter(
        (item) => item.key !== 'review_status' && item.key !== 'review_methods',
      );
    }

    return columns;
  },

  getFileListDefaultHiddenTableColumns() {
    if (platformPerimeter.isCgsEnv()) {
      return ['mark_user_total', 'mark_users', 'question_status', 'progress'];
    }

    return [];
  },

  // 是否支持自定义过滤文件列表columns
  supportFilterTableColumnsInFileList() {
    return (
      platformPerimeter.isCgsEnv() ||
      platformPerimeter.isGffundEnv() ||
      platformPerimeter.isCmsEnv()
    );
  },

  // 是否支持收回/展开项目统计数据
  supportFoldProjectSummary() {
    return (
      platformPerimeter.isCgsEnv() ||
      platformPerimeter.isGffundEnv() ||
      platformPerimeter.isCmsEnv()
    );
  },

  // 是否支持隐藏/展开标注界面右侧答案面板
  supportToggleAnswerPanel() {
    return platformPerimeter.isGffundEnv();
  },

  // 是否支持「通过框选的方式复制文字」
  supportCopyTextByRect() {
    return platformPerimeter.isGffundEnv();
  },

  // 项目名和目录名展示 mete.name
  showMetaName() {
    return platformPerimeter.isCcxiEnv();
  },

  // 不可以连续进行画框提取
  canNotContinuousDrawWidget() {
    return platformPerimeter.isZtsEnv();
  },

  // 不可以在「别人的答案」基础上提交答案（不包括「预测答案」）
  canNotSubmitOtherUserAnswer() {
    return platformPerimeter.isCcxiEnv();
  },

  // 支持设置项目权限：公开/私密
  supportProjectPermission() {
    const { app_id } = store.getters['configuration'];
    if (app_id === scriberPublicPoc) {
      return false;
    }
    return (
      !platformPerimeter.isHkexEnv() &&
      !platformPerimeter.isCiticsDCMEnv() &&
      !platformPerimeter.isCmfchinaEnv()
    );
  },

  // 新建项目时支持选择业务组
  supportBusinessGroup() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 支持添加项目备注
  supportProjectComment() {
    return platformPerimeter.isNafmiiEnv();
  },

  // 项目列表是否展示Schema名称
  showSchemaNameInProjectList() {
    return platformPerimeter.isNafmiiEnv();
  },

  // 项目列表是否展示文件数
  showFileCountInProjectList() {
    return platformPerimeter.isNafmiiEnv();
  },

  // 项目列表是否展示备注
  showCommentInProjectList() {
    return platformPerimeter.isNafmiiEnv();
  },

  // 项目列表是否展示创建人
  showFounderInProjectList() {
    return !platformPerimeter.isHkexEnv();
  },

  // 项目列表是否展示创建时间
  showCreatedDateInProjectList() {
    return platformPerimeter.isCmfchinaEnv() || platformPerimeter.isNafmiiEnv();
  },

  showTotalQuestionsInSummary() {
    return (
      !platformPerimeter.isCiticsDCMEnv() && !platformPerimeter.isNafmiiEnv()
    );
  },

  // Schema管理是否展示「规则判断」tab
  showSchemaRule() {
    return platformPerimeter.isHtEnv();
  },

  //「规则判断」是否可以 新增/编辑/删除大类
  canEditSchemaRule() {
    return this.child.config.show_formula_check;
  },

  // 标注页面右侧答案区（海通）
  showHtRemarkAside() {
    return platformPerimeter.isHtEnv();
  },
  // 标注页面右侧答案区（中信托管部）
  showCiticsTgRemarkAside() {
    return platformPerimeter.isCiticsTGEnv();
  },

  // 是否支持：自定义Schema字段正则提取
  supportSchemaRegex() {
    return platformPerimeter.isHtEnv();
  },

  // 是否显示schema管理中的数据生产tab
  showDataProduction() {
    return this.child.config.data_abroad;
  },

  // 项目下是否显示「文件回收站」tab
  supportFileRecycle() {
    return platformPerimeter.isCgsEnv();
  },

  // 支持解析PDF
  supportParsePdf() {
    return this.child.config.parse_pdf;
  },

  // 标注工具栏：是否显示「元素块提取」
  showPredictedBlocksMenu() {
    return this.child.config.parse_pdf || platformPerimeter.isHkexEnv();
  },

  // Annotation标注框是否展示AI/人工答案类型标记
  showAnswerTypeOnAnnotation() {
    return platformPerimeter.isHkexEnv();
  },

  // 列表页选择文件创建 calliper 对比任务
  canCreateCalliperDiffTask() {
    const { calliper_diff } = store.getters['configuration'];
    return Boolean(calliper_diff);
  },

  // 项目页是否显示标注相关 Tab
  showProjectRemarkTab() {
    return !platformPerimeter.isCgsEnv();
  },

  // 项目页是否显示所有文件 Tab
  showProjectAllFiles() {
    return !platformPerimeter.isNafmiiEnv();
  },

  // 答案树是否展示预测分数
  showPredictScore() {
    const { show_ai_score } = store.getters['configuration'];
    return show_ai_score;
  },

  // 是否支持 ReviewFieldsSelect 组件
  showReviewStatusSelect() {
    return platformPerimeter.isCgsEnv();
  },

  // 显示审核状态
  showExternalAudit() {
    return (
      platformPerimeter.isGffundEnv() ||
      platformPerimeter.isCmsEnv() ||
      platformPerimeter.isCiticsTGEnv() ||
      platformPerimeter.isCmfchinaEnv()
    );
  },

  // 页面显示审核状态
  showAuditStatus() {
    return platformPerimeter.isCiticsTGEnv();
  },

  // 港交所: 快速切换文档（Schema A、B、C 互相切换）
  supportSchemaQuickSwitching() {
    return this.child.config.quick_schema_switching;
  },

  // 港交所: 支持以 Miscrosoft 账号登录
  supportLoginWithMicrosoftAD() {
    return platformPerimeter.isHkexEnv() && this.child.config.sso;
  },

  // 是否展示定制模型的'查看准确率'按钮
  showDevelopModelTest() {
    return this.child.config.show_develop_model_test;
  },

  // 是否展示定制模型的'查看版本差异'按钮
  showDevelopModelDiff() {
    return this.child.config.show_develop_model_diff;
  },

  // 是否支持批量预测
  supportBatchPredict() {
    return !platformPerimeter.isHkexEnv();
  },

  // 是否支持批量审核
  supportBatchInspect() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 是否支持批量删除
  supportBatchDelete() {
    return this.child.config.batch_delete;
  },

  // 规则是否需要复核
  supportRuleReview() {
    return this.child.config.rule_need_review;
  },

  // 是否开启「无限答题模式」，开启后答题人数不受限制
  enableUnlimitAnswerMode() {
    return this.child.config.unlimit_answer_mode;
  },

  // 是否支持「查看/还原历史提交记录」
  supportRestoreUserAnswer() {
    return this.child.config.restore_user_answer;
  },

  // 是否支持设置 Scheme 及字段别名
  supportSchemaAlias() {
    return (
      platformPerimeter.isCmbchinaEnv() || platformPerimeter.isCmfchinaEnv()
    );
  },

  // Schema 字段别名是否必填
  schemaAliasRequired() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 是否支持「前端版本更新检测」
  supportCheckVersion() {
    return import.meta.env.PROD && platformPerimeter.isHkexEnv();
  },

  // 是否禁用在「pdf-viewer中渲染源文件自带的 Annotation 数据」，比如 Link 类型
  disablePdfViewerDocAnnotation() {
    return !platformPerimeter.isHkexEnv();
  },

  // 操作栏是否展示icon
  isShowOperationIcon() {
    return !platformPerimeter.isNafmiiEnv();
  },

  // 操作栏是否固定
  operationColumnFixed() {
    if (platformPerimeter.isNafmiiEnv()) {
      return 'right';
    }
    return false;
  },

  // 是否支持复制文字
  supportCopyTextInDrawWidgetSwitch() {
    return !platformPerimeter.isNafmiiEnv();
  },

  // 是否存在左侧边栏
  hasLeftSidebar() {
    return platformPerimeter.isNafmiiEnv();
  },

  // 是否在「标注页面」显示元素块提取标签的index
  supportShowElementIndex() {
    return this.child.config.label_show_element_index;
  },

  // 是否在「review页面」显示元素块提取标签的index（港交所）
  supportShowElementIndexOnReviewPage() {
    return this.child.config.review_show_element_index;
  },

  // 对于多个box合并的定位框, 是否只显示第一个box右上角的标签
  showFirstBoxLabelOnly() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 是否在「要素提取」页面显示字段审核状态
  showFieldAuditStatusInAnswer() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 是否支持折叠答案组
  supportFoldAnswerGroup() {
    return true;
  },

  // 在「规则管理」中是否支持复制规则
  supportCopyCustomRule() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 在规则管理列表中是否显示「关联字段」列
  showSchemaFieldColumnsInRulesTable() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // Schema tree 页面字段后面是否显示「规则审核」按钮
  showRuleReviewBtnInSchemaTree() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 支持导入场景（Schema）
  supportImportSchema() {
    return platformPerimeter.isCmfchinaEnv();
  },

  // 是否在溢出时显示popover
  showOverflowPopover() {
    return platformPerimeter.isNafmiiEnv();
  },

  // 是否支持「大语言模型提取」
  supportLLMExtract() {
    return this.child.config.enable_llm_extract;
  },

  expose: [
    'enableEncryptData',
    'showAIModules',
    'supportMultipleMolds',
    'supportBatchEdit',
    'supportRemarkAnswerDiff',
    'supportUploadZipFileBySSE',
    'supportUploadZipFile',
    'supportCustomField',
    'showUploadFilePopup',
    'showSchemaOptionsInUploadFilePopup',
    'showFileTag',
    'supportFilterTableColumnsInFileList',
    'supportFoldProjectSummary',
    'supportToggleAnswerPanel',
    'supportCopyTextByRect',
    'showMetaName',
    'canNotSubmitOtherUserAnswer',
    'canNotContinuousDrawWidget',
    'supportProjectPermission',
    'supportBusinessGroup',
    'supportProjectComment',
    'showSchemaNameInProjectList',
    'showFileCountInProjectList',
    'showCommentInProjectList',
    'showFounderInProjectList',
    'showCreatedDateInProjectList',
    'showTotalQuestionsInSummary',
    'showSchemaRule',
    'canEditSchemaRule',
    'showHtRemarkAside',
    'supportSchemaRegex',
    'showDataProduction',
    'supportFileRecycle',
    'supportParsePdf',
    'showPredictedBlocksMenu',
    'showAnswerTypeOnAnnotation',
    'canCreateCalliperDiffTask',
    'showProjectRemarkTab',
    'showProjectAllFiles',
    'showPredictScore',
    'getFileListTableColumns',
    'getFileListDefaultHiddenTableColumns',
    'showReviewStatusSelect',
    'showExternalAudit',
    'showAuditStatus',
    'supportSchemaQuickSwitching',
    'supportLoginWithMicrosoftAD',
    'showDevelopModelTest',
    'showDevelopModelDiff',
    'supportBatchPredict',
    'supportBatchInspect',
    'supportBatchDelete',
    'supportRuleReview',
    'enableUnlimitAnswerMode',
    'supportRestoreUserAnswer',
    'showCiticsTgRemarkAside',
    'supportSchemaAlias',
    'schemaAliasRequired',
    'supportCheckVersion',
    'disablePdfViewerDocAnnotation',
    'isShowOperationIcon',
    'operationColumnFixed',
    'supportCopyTextInDrawWidgetSwitch',
    'hasLeftSidebar',
    'supportShowElementIndex',
    'supportShowElementIndexOnReviewPage',
    'showFirstBoxLabelOnly',
    'showFieldAuditStatusInAnswer',
    'supportFoldAnswerGroup',
    'supportCopyCustomRule',
    'showSchemaFieldColumnsInRulesTable',
    'showRuleReviewBtnInSchemaTree',
    'supportImportSchema',
    'showOverflowPopover',
    'supportLLMExtract',
  ],
});
