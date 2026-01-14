import platformPerimeter from '@/perimeters/platform.perimeter';

export const schema = {
  TREENODE_CREATE: 'TREENODE_CREATE',
  TREENODE_UPDATE: 'TREENODE_UPDATE',
};

// schame type 枚举值
/**
 * 系统级枚举类型常量
 * schame (type)类型分三种：
 * - fixed, 系统级枚举，用户无法新增和修改；
 * - user，用户级枚举，用户可以增删改；
 * - normal，用户只能新增或者弃用，可以有子节点；
 */
export const schemaDefaultType = '文本';
export const schemaEnumType = [
  {
    label: '文本',
  },
  {
    label: '日期',
  },
  {
    label: '数字',
  },
];

export const SCHEMA_TYPE_ACTION = {
  ADD_ENUM: 'ADD_ENUM',
  ADD_GROUP: 'ADD_GROUP',
};

export const questionStatusNames = {
  prepare: 0,
  answering: 1,
  completed: 2,
  feedback: 3,
  conflict: 4,
  identical: 5,
  confirmed: 6,
  conflictConfirmed: 10,
};

/**
 * question_status 状态
 */
export const questionStatus = {
  [questionStatusNames.prepare]: '待做',
  [questionStatusNames.answering]: '答题中',
  [questionStatusNames.completed]: '答题完毕',
  [questionStatusNames.feedback]: '已反馈',
  [questionStatusNames.conflict]: '答案不一致',
  [questionStatusNames.identical]: '答案一致',
  [questionStatusNames.confirmed]: '反馈已确认',
  [questionStatusNames.conflictConfirmed]: '冲突已处理',
};

export const pdfParseStatus = {
  waiting: 1,
  parsing: 2,
  parsing_time: 10,
  parsed: 21,
  canceled: 3,
  completed: 4,
  failed: 5,
  cache_generating: 6,
  caching: 7,
  ocr_expired: 8,
  exception: 51,
  clean_file_doing: 200,
};

export const PDF_PARSE_STATUS = {
  [pdfParseStatus.waiting]: '排队中',
  [pdfParseStatus.parsing]: '解析中',
  [pdfParseStatus.parsing_time]: '解析中',
  [pdfParseStatus.parsed]: '解析中',
  [pdfParseStatus.canceled]: '已取消',
  [pdfParseStatus.completed]: '解析成功',
  [pdfParseStatus.failed]: '解析失败',
  [pdfParseStatus.cache_generating]: platformPerimeter.isNafmiiEnv()
    ? '解析中'
    : '缓存中',
  [pdfParseStatus.caching]: platformPerimeter.isNafmiiEnv()
    ? '解析中'
    : '缓存中',
  [pdfParseStatus.ocr_expired]: 'OCR过期',
  [pdfParseStatus.exception]: '解析异常',
  [pdfParseStatus.clean_file_doing]: '清稿文件处理中',
};

export const LLM_PARSE_STATUS = {
  INIT: 0,
  PARSING: 5,
  SUCCESS: 10,
  FAILED: -10,
};

export const LLM_PARSE_STATUS_MAP = {
  [LLM_PARSE_STATUS.INIT]: '初始化',
  [LLM_PARSE_STATUS.PARSING]: '解析中',
  [LLM_PARSE_STATUS.SUCCESS]: '解析成功',
  [LLM_PARSE_STATUS.FAILED]: '解析失败',
};

export const NAFMII_PDF_PARSE_STATUS = {
  ...PDF_PARSE_STATUS,
  [pdfParseStatus.parsing]: '排队中',
};

export const PDF_PARSE_STATUS_STYLE = {
  [pdfParseStatus.exception]: { color: '#ffa700' },
  [pdfParseStatus.failed]: { color: '#ea0e0e' },
};

export const SPLIT_SYMBOL = '|_|_|';

// 答案状态
export const answerStatus = {
  answer: 1,
  draft: 2,
};

export const userRole = {
  isAdmin: 1,
};

export const ruleMergeTypeInfo = {
  notSupport: -1,
  noInfomation: 0,
  foundDocument: 1,
  foundComplian: 2,
  foundComplianInfo: 3,
};

export const permissionsForPageList = [
  {
    permission: 'browse',
    path: '/project',
  },
  {
    permission: 'manage_mold',
    path: '/schema',
  },
  {
    permission: 'table_identification',
    path: '/extraction',
  },
];

export const scriberPublicPoc = 'scriber_public_poc';

export const projectType = {
  public: '公共',
  private: '私密',
};

export const hkexReportType = {
  qr: {
    value: 'qr',
    modulePath: 'result-announcement',
    moduleName: 'resultAnnouncement',
    moduleMenuName: 'Result Announcement',
    homeRouterName: 'announcementHome',
    reportReviewRouterName: 'resultAnnouncementChecking',
    byRuleRouterName: 'resultAnnouncementAnalysisByRule',
    byIssuerRouterName: 'resultAnnouncementAnalysisByIssuer',
    reportReviewMenuName: 'Report Review',
    summaryTitleDesc: 'Total Reports',
  },
  ar: {
    value: 'ar',
    modulePath: 'annual-report-checking',
    moduleName: 'annualReportChecking',
    moduleMenuName: 'Annual Report Checking',
    homeRouterName: 'annualReportHome',
    reportReviewRouterName: 'annualReportReview',
    byRuleRouterName: 'annualReportCheckingAnalysisByRule',
    byIssuerRouterName: 'annualReportCheckingAnalysisByIssuer',
    reportReviewMenuName: 'Annual Report Review',
    summaryTitleDesc: 'Total Annual Reports',
  },
  esg: {
    value: 'esg',
    modulePath: 'esg-report-checking',
    moduleName: 'esgReportChecking',
    moduleMenuName: 'ESG Report Checking',
    homeRouterName: 'esgReportHome',
    reportReviewRouterName: 'esgReportReview',
    byRuleRouterName: 'esgReportCheckingAnalysisByRule',
    byIssuerRouterName: 'esgReportCheckingAnalysisByIssuer',
    reportReviewMenuName: 'Report Review',
    summaryTitleDesc: 'Total ESG Reports',
  },
  cg: {
    value: 'cg',
    modulePath: 'cg-report-checking',
    moduleName: 'cgReportChecking',
    moduleMenuName: 'CG Report Checking',
    homeRouterName: 'cgReportHome',
    reportReviewRouterName: 'cgReportReview',
    byRuleRouterName: 'cgReportCheckingAnalysisByRule',
    byIssuerRouterName: 'cgReportCheckingAnalysisByIssuer',
    reportReviewMenuName: 'CG Report Review',
    summaryTitleDesc: 'Total CG Reports',
  },
  agm: {
    value: 'agm',
    modulePath: 'agm-circular-checking',
    moduleName: 'agmCircularChecking',
    moduleMenuName: 'AGM Circular Checking',
    homeRouterName: 'agmCircularReportHome',
    reportReviewRouterName: 'agmCircularReportReview',
    byRuleRouterName: 'agmCircularCheckingAnalysisByRule',
    byIssuerRouterName: 'agmCircularCheckingAnalysisByIssuer',
    reportReviewMenuName: 'AGM Circular Review',
    summaryTitleDesc: 'Total AGM Circular Reports',
  },
  poll: {
    value: 'poll',
    modulePath: 'agm-poll-results',
    moduleName: 'agmPollResults',
    moduleMenuName: 'AGM Poll Results',
    homeRouterName: 'agmPollResultsHome',
    reportReviewRouterName: 'agmPollResultsReportReview',
    byRuleRouterName: 'agmPollResultsAnalysisByRule',
    byIssuerRouterName: 'agmPollResultsAnalysisByIssuer',
    reportReviewMenuName: 'AGM Poll Results Review',
    summaryTitleDesc: 'Total AGM Poll Results',
  },
};

export const AI_PREDICT_STATUS_MAP = {
  NOPREDICT: -1, // 不预测
  TODO: 0, // 待预测
  DOING: 1, // 预测中
  FAILED: 2, // 预测失败
  FINISHED: 3, // 预测完成
  DISABLED: 4, // 模型未启用
  UNCORRELATED: 5, // 模型未关联
};

export const AI_PREDICT_STATUS_TEXT_MAP = {
  [AI_PREDICT_STATUS_MAP.NOPREDICT]: '不预测',
  [AI_PREDICT_STATUS_MAP.TODO]: '待预测',
  [AI_PREDICT_STATUS_MAP.DOING]: '预测中',
  [AI_PREDICT_STATUS_MAP.FAILED]: '预测失败',
  [AI_PREDICT_STATUS_MAP.FINISHED]: '预测成功',
  [AI_PREDICT_STATUS_MAP.DISABLED]: '模型未启用',
  [AI_PREDICT_STATUS_MAP.UNCORRELATED]: '待预测',
};

export const AI_PREDICT_STATUS_ICON_NAME_MAP = {
  [AI_PREDICT_STATUS_MAP.NOPREDICT]: 'predict-disabled',
  [AI_PREDICT_STATUS_MAP.TODO]: 'predict-todo',
  [AI_PREDICT_STATUS_MAP.DOING]: 'predict-doing',
  [AI_PREDICT_STATUS_MAP.FAILED]: 'predict-failed',
  [AI_PREDICT_STATUS_MAP.FINISHED]: 'predict-finished',
  [AI_PREDICT_STATUS_MAP.DISABLED]: 'predict-disabled',
  [AI_PREDICT_STATUS_MAP.UNCORRELATED]: 'predict-todo',
};

export const AI_PREDICT_STATUS_TAG_TYPE = {
  [AI_PREDICT_STATUS_MAP.NOPREDICT]: 'info',
  [AI_PREDICT_STATUS_MAP.TODO]: 'info',
  [AI_PREDICT_STATUS_MAP.DOING]: 'default',
  [AI_PREDICT_STATUS_MAP.FAILED]: 'danger',
  [AI_PREDICT_STATUS_MAP.FINISHED]: 'success',
  [AI_PREDICT_STATUS_MAP.DISABLED]: 'warning',
  [AI_PREDICT_STATUS_MAP.UNCORRELATED]: 'warning',
};

export const RULE_REVIEW_STATUS = {
  NOT_REVIEWED: 1, // 待复核
  NOT_PASS: 2, // 复核不通过
  PASS: 3, // 复核通过
  DEL_NOT_REVIEWED: 4, // 删除后待复核
  DEL_NOT_PASS: 5, // 删除后复核不通过
};

export const modelTrainingStatusMap = {
  trainingNotStarted: 0,
  trainingInitialize: 1,
  training: 2,
  trainingFinished: 3,
  trainingReTrain: 4,
  trainingAbnormal: -1,
};

export const modelTrainingStatus = {
  [modelTrainingStatusMap.trainingNotStarted]: '待训练',
  [modelTrainingStatusMap.trainingInitialize]: '初始化',
  [modelTrainingStatusMap.training]: '训练中',
  [modelTrainingStatusMap.trainingFinished]: '训练完毕',
  [modelTrainingStatusMap.trainingReTrain]: '需重新训练',
  [modelTrainingStatusMap.trainingAbnormal]: '训练异常',
};

export const exportTypeMap = {
  json: 'json',
  txt: 'txt',
  csv: 'csv',
  excel: 'excel',
  files: 'files',
};

export const exportActionMap = {
  createTrainingData: 25, // 新建导出训练数据任务
  trainingModel: 28, // 训练模型
  getTrainingData: 30, // 获取模型版本
  createCatalogData: 36, //新建导出目录结构任务
  downloadTrainingData: 26, // 下载导出训练数据任务
  downloadCatalogData: 37, //下载导出目录结构任务
  deleteTrainingData: 27, // 删除导出训练数据任务
  deleteCatalogData: 38, //删除导出目录结构任务
  createInspectResult: 39, // 新建 导出审核结果
  downloadInspectResult: 40, // 下载 导出审核结果
  deleteInspectResult: 41, // 删除 导出审核结果
  diffModel: 42, // 获取 差异化版本
  originalFile: 43, // 导出原文件
};

export const modelEnableStatus = {
  enabled: 1,
  disabled: 0,
};

export const HKEX_USER_ROLE = {
  BUSINESS_ADMIN: 1,
  GENERAL_USER: 2,
};

export const hkexUserRole = {
  1: 'Business Admin',
  2: 'General User',
};

export const hkexUserStatus = {
  1: 'Active',
  2: 'Inactive',
};

// 23:59:59 对应的毫秒数
export const endTimestampOffset = (24 * 60 * 60 - 1) * 1000;

export const BasicSchemaTypes = ['文本', '数字', '日期'];

export const fileMaxSize = 2048; // 最大上传文件大小，以MB为单位

export const dayTime = 24 * 60 * 60 - 1;

export const FileListTableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '文件' },
  {
    key: 'pdf_parse_status',
    label: '预处理',
  },
  {
    key: 'schema_and_ai_status',
    label: 'Schema&AI预测',
  },
  {
    key: 'updated_utc',
    label: '修改时间',
  },
  {
    key: 'created_utc',
    label: '上传时间',
  },
  {
    key: 'user_name',
    label: '上传用户',
  },
  {
    key: 'scene_and_ai_status',
    label: '场景&AI预测',
  },
  {
    key: 'file_type',
    label: '文件类型',
  },
  {
    key: 'review_status',
    label: '审核状态',
  },
  {
    key: 'product_name',
    label: '产品名称',
  },
  {
    key: 'manager_name',
    label: '基金管理人名称',
  },
  { key: 'sysfrom', label: '文件来源' },
  { key: 'source', label: '详细来源' },
  {
    key: 'task_type',
    label: '处理方式',
  },
  {
    key: 'review_methods',
    label: '审核方式',
  },
  {
    key: 'insight_queue_stamp',
    label: '解析开始时间',
  },
  {
    key: 'insight_parse_stamp',
    label: '解析完成时间',
  },
  {
    key: 'nafmii_mold_names',
    label: '文件类型',
  },
  {
    key: 'nafmii_task_types',
    label: '任务类型',
  },
  {
    key: 'nafmii_file_source',
    label: '文件来源',
  },
  {
    key: 'nafmii_ai_status',
    label: 'AI预测',
  },
  {
    key: 'nafmii_confirm_status',
    label: '人工确认状态',
  },
  {
    key: 'nafmii_execute_push_stamp',
    label: '识别结果推送时间',
  },
];

export const ECITIC_ENV_SYSTEM = {
  POC: {
    name: 'poc',
    title: '循环购买报告信息抽取',
  },
  SHARES: {
    name: 'shares',
    title: '股东股份变更明细提取',
  },
};

export const AUDIT_STATUS_MAP = {
  NOT_REVIEWED: 0, // 待审核
  AUDITING: 1, // 审核中
  AUDIT_FAIL: 2, // 审核失败
  AUDIT_SUCCESS: 3, // 审核成功
};

export const SEARCH_TYPE = {
  field: 'field',
  answer: 'answer',
};

export const USER_PLATFORM = {
  BUILD_IN: 0,
  AZURE: 20,
};

export const TIME_TYPE = {
  created_utc: 1,
  updated_utc: 2,
};

export const INVALID_SCHEMA_IDS = [-1, 0];

export const LAW_SESSION_KEY = 'SCRIBER_LAW_SESSION_KEY';

export const LAW_STATUS = {
  INIT: 0,
  PENDING: 5,
  PARSING: 15,
  PARSE_FAIL: -15,
  FETCHING: 25,
  FETCH_FAIL: -25,
  PARSED: 30,
  SPLITTING: 35,
  SPLIT_FAIL: -35,
  SPLIT: 50,
};

export const LAW_STATUS_MAP = {
  [LAW_STATUS.INIT]: '初始化',
  [LAW_STATUS.PENDING]: '排队中',
  [LAW_STATUS.PARSING]: '解析中',
  [LAW_STATUS.PARSE_FAIL]: '解析失败',
  [LAW_STATUS.FETCHING]: '获取中',
  [LAW_STATUS.FETCH_FAIL]: '获取失败',
  [LAW_STATUS.PARSED]: '解析完成',
  [LAW_STATUS.SPLITTING]: '文档自动拆分中',
  [LAW_STATUS.SPLIT_FAIL]: '拆分失败',
  [LAW_STATUS.SPLIT]: '已完成',
};

export const LAW_ERROR_STATUS = [
  LAW_STATUS.PARSE_FAIL,
  LAW_STATUS.FETCH_FAIL,
  LAW_STATUS.SPLIT_FAIL,
];

export const LAW_REFRESH_STATUS = {
  INIT: 0,
  REFRESHING: 5,
  SUCCESS: 10,
  FAILED: -10,
};

export const LAW_REFRESH_STATUS_MAP = {
  [LAW_REFRESH_STATUS.INIT]: '初始化',
  [LAW_REFRESH_STATUS.REFRESHING]: '更新中',
  [LAW_REFRESH_STATUS.SUCCESS]: '有更新',
  [LAW_REFRESH_STATUS.FAILED]: '更新失败',
};

export const LAW_RULE_STATUS = {
  DISABLED: 0,
  INIT: 1,
  WAITING: 3,
  CONVERTING: 5,
  CONVERTED: 10,
  CONVERT_FAILED: -10,
};

export const LAW_RULE_STATUS_MAP = {
  [LAW_RULE_STATUS.DISABLED]: '不适用',
  [LAW_RULE_STATUS.INIT]: '未转换',
  [LAW_RULE_STATUS.WAITING]: '排队中',
  [LAW_RULE_STATUS.CONVERTING]: '转换中',
  [LAW_RULE_STATUS.CONVERTED]: '转换成功',
  [LAW_RULE_STATUS.CONVERT_FAILED]: '转换失败',
};

export const REVIEW_STATUS = {
  NOT_REVIEWED: 1,
  NOT_PASS: 2,
  PASS: 3,
  DEL_NOT_REVIEWED: 4,
  DEL_NOT_PASS: 5,
};

export const REVIEW_STATUS_MAP = {
  [REVIEW_STATUS.NOT_REVIEWED]: '待审核',
  [REVIEW_STATUS.NOT_PASS]: '审核不通过',
  [REVIEW_STATUS.PASS]: '审核通过',
  [REVIEW_STATUS.DEL_NOT_REVIEWED]: '待审核',
  [REVIEW_STATUS.DEL_NOT_PASS]: '审核不通过',
};

export const REVIEW_STATUS_FILTER = {
  NOT_REVIEWED: 1,
  NOT_PASS: 2,
  PASS: 3,
};

export const REVIEW_STATUS_FILTER_MAP = {
  [REVIEW_STATUS.NOT_REVIEWED]: '待审核',
  [REVIEW_STATUS.NOT_PASS]: '审核不通过',
  [REVIEW_STATUS.PASS]: '审核通过',
};

export const CHECK_TYPE = {
  FORBIDDEN: -1,
  PROGRAM: 0,
  DUTY: 1,
};

export const CHECK_TYPE_MAP = [
  {
    label: '禁止性',
    value: CHECK_TYPE.FORBIDDEN,
  },
  {
    label: '程序性',
    value: CHECK_TYPE.PROGRAM,
  },
  {
    label: '义务性',
    value: CHECK_TYPE.DUTY,
  },
];

// 编辑规则对话框模式
export const EDIT_RULE_DIALOG_MODE = {
  EDIT: 'edit',
  REVIEW: 'review',
  DELETE_REVIEW: 'deleteReview',
  VIEW: 'view',
  SAVE: 'save',
};

export const GML_SPECIAL_RULE = 'General Mandate Limit';

// 文件审核状态以及审核结果页单条状态
export const JUDGE_STATUS = {
  INIT: 0,
  PARSING: 5,
  SUCCESS: 10,
  PARTIAL_FAILED: -5,
  FAILED: -10,
  MISSING: -20, // 大模型未匹配到规则
};

export const JUDGE_STATUS_MAP = {
  [JUDGE_STATUS.INIT]: '分析中',
  [JUDGE_STATUS.PARSING]: '分析中',
  [JUDGE_STATUS.SUCCESS]: '分析成功',
  [JUDGE_STATUS.FAILED]: '分析失败',
};

export const isENLang = import.meta.env.VITE_LANG === 'EN';

// 综合审核状态枚举 - 用于统一状态判断
export const COMBINED_AUDIT_STATUS = {
  AUDITING: 'AUDITING', // 审核中
  AUDIT_FAILED: 'AUDIT_FAILED', // 审核失败
  AUDIT_PARTIAL_FAILED: 'AUDIT_PARTIAL_FAILED', // 审核部分失败
  AUDIT_SUCCESS: 'AUDIT_SUCCESS', // 审核成功
  NO_RULE_MATCHED: 'NO_RULE_MATCHED', // 未匹配到规则
  UNKNOWN: 'UNKNOWN', // 未知状态
  NOT_REVIEWED: 'NOT_REVIEWED', // 待审核
};

// 综合审核状态描述映射
export const COMBINED_AUDIT_STATUS_TEXT_MAP = {
  [COMBINED_AUDIT_STATUS.AUDITING]: '审核中',
  [COMBINED_AUDIT_STATUS.AUDIT_FAILED]: '审核失败',
  [COMBINED_AUDIT_STATUS.AUDIT_PARTIAL_FAILED]: '审核部分失败',
  [COMBINED_AUDIT_STATUS.AUDIT_SUCCESS]: '审核成功',
  [COMBINED_AUDIT_STATUS.NO_RULE_MATCHED]: '未匹配到规则',
  [COMBINED_AUDIT_STATUS.UNKNOWN]: '-',
  [COMBINED_AUDIT_STATUS.NOT_REVIEWED]: '待审核',
};

export const SCHEMA_TYPE = {
  CUSTOM: {
    value: 0,
    label: '专有模型',
    type: 'exclusive',
  },
  LLM: {
    value: 10,
    label: '大模型',
    type: 'llm',
  },
  HYBRID: {
    value: 11,
    label: '大模型、专有模型',
    type: 'hybrid',
  },
};

export const LLM_SCHEMA_FIELD_TYPES = [
  {
    label: '文本',
  },
  {
    label: '数字',
  },
  {
    label: '枚举',
  },
  {
    label: '组合',
  },
];
