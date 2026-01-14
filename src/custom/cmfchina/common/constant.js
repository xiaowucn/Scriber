import { pdfParseStatus, AI_PREDICT_STATUS_MAP } from '@/store/constants';

export const FILE_FILED_STATUS_CODE = {
  waiting: 0,
  filing: 1,
  completed: 2,
  failed: 3,
};

export const FILE_FILED_STATUS = {
  [FILE_FILED_STATUS_CODE.waiting]: '待分类',
  [FILE_FILED_STATUS_CODE.filing]: '分类中',
  [FILE_FILED_STATUS_CODE.completed]: '分类完成',
  [FILE_FILED_STATUS_CODE.failed]: '分类失败',
};

export const FILE_FILED_STATUS_ICON_NAME_MAP = {
  [FILE_FILED_STATUS_CODE.failed]: 'status-warning',
};

export const FILE_FILED_STATUS_STYLE = {
  [FILE_FILED_STATUS_CODE.failed]: { fontWeight: '500' },
};

export const PDF_PARSE_STATUS_STYLE = {
  [pdfParseStatus.exception]: { color: '#ffa700' },
  [pdfParseStatus.failed]: { color: '#ea0e0e' },
};

export const INTERFACE_STATUS = {
  WAITING: 0, // 待预测
  DOING: 1, // 预测中
  FINISHED: 2, // 预测完成
  FAILED: 3, // 预测失败
};

export const FIELD_STATUS_MAP = {
  ALL: 0,
  AUDIT: 1,
  FAIL_AUDIT: 2,
  UN_AUDIT: 3,
  MODIFIED: 4,
  NA: 5,
  PROBABILITY: 6,
};

export const FIELD_STATUS = {
  [FIELD_STATUS_MAP.ALL]: {
    label: '全部',
    colorLabel: '',
    colorValue: '',
  },
  [FIELD_STATUS_MAP.AUDIT]: {
    label: '审核通过',
    colorLabel: '蓝色',
    colorValue: 'blue',
  },
  [FIELD_STATUS_MAP.FAIL_AUDIT]: {
    label: '审核不通过',
    colorLabel: '红色',
    colorValue: 'red',
  },
  [FIELD_STATUS_MAP.UN_AUDIT]: {
    label: '未审核',
    colorLabel: '黑色',
    colorValue: 'black',
  },
  [FIELD_STATUS_MAP.MODIFIED]: {
    label: '用户修改过',
    colorLabel: '橙黄色',
    colorValue: 'orange',
  },
  [FIELD_STATUS_MAP.NA]: {
    label: '不适用',
    colorLabel: '黑色',
    colorValue: 'black',
  },
  [FIELD_STATUS_MAP.PROBABILITY]: {
    label: '低置信度',
    colorLabel: '绿色',
    colorValue: 'green',
    editable: true,
  },
};

export const REVIEW_STATUS = {
  0: '全部',
  1: '已复核',
  2: '未复核',
};

export const EXPORT_STATUS = {
  DOING: 1,
  FAILED: 2,
  FINISH: 3,
};

export const EXPORT_STATUS_TYPES = [
  {
    label: '导出中',
    value: EXPORT_STATUS.DOING,
  },
  {
    label: '导出成功',
    value: EXPORT_STATUS.FINISH,
  },
  {
    label: '导出失败',
    value: EXPORT_STATUS.FAILED,
  },
];

export const PDF_PARSE_STATUS_SEARCH_OPTION = {
  value: 'pdf_parse_status',
  label: '预处理',
  options: [
    {
      value: 'all',
      label: '全部',
    },
    {
      value: pdfParseStatus.waiting,
      label: '排队中',
    },
    {
      value: pdfParseStatus.parsing,
      label: '解析中',
    },
    {
      value: pdfParseStatus.completed,
      label: '解析成功',
    },
    {
      value: pdfParseStatus.failed,
      label: '解析失败',
    },
    {
      value: pdfParseStatus.exception,
      label: '解析异常',
    },
  ],
};

export const AI_STATUS_SEARCH_OPTION = {
  value: 'ai_status',
  label: 'AI预测',
  options: [
    {
      value: 'all',
      label: '全部',
    },
    {
      value: AI_PREDICT_STATUS_MAP.TODO,
      label: '待预测',
    },
    {
      value: AI_PREDICT_STATUS_MAP.DOING,
      label: '预测中',
    },
    {
      value: AI_PREDICT_STATUS_MAP.FAILED,
      label: '预测失败',
    },
    {
      value: AI_PREDICT_STATUS_MAP.FINISHED,
      label: '预测成功',
    },
    {
      value: AI_PREDICT_STATUS_MAP.DISABLED,
      label: '模型未启用',
    },
  ],
};

export const FIVE_MONTHS_MILLISECONDS = 5 * 30 * 24 * 60 * 60 * 1000;

export const SIX_DAYS_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;

export const ONE_DAY_OFFSET_MILLISECONDS = (24 * 60 * 60 - 1) * 1000;

export const MENU_ROUTES = [
  {
    name: 'panorama',
    perm: 'para',
  },
  {
    name: 'project',
    perm: 'prj',
  },
  {
    name: 'schema',
    perm: 'scene',
  },
  {
    name: 'custom-rules',
    perm: 'rule',
  },
  {
    name: 'filed',
    perm: 'classification',
  },
  {
    name: 'model',
    perm: 'model',
  },
  {
    name: 'statisticalEvaluation',
    perm: 'stat',
  },
  {
    name: 'permissionManagement',
    perm: 'super_admin',
  },
  {
    name: 'businessGroupManagement',
    perm: 'group',
  },
];

export const FILE_SOURCE = {
  LOCAL: '手工上传',
  API: 'API上传',
  EMAIL: '邮箱',
  DISK: '共享盘',
};

export const CMFCHINA_WIDGET_TYPES = [
  {
    type: 'rect',
    subType: 'red',
    classNames: ['red'],
    operations: [],
  },
  {
    type: 'rect',
    subType: 'active',
    classNames: ['active'],
    operations: [],
  },
  {
    type: 'rect',
    subType: 'red-active',
    classNames: ['red', 'active'],
    operations: [],
  },
];
