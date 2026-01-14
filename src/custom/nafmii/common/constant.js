import {
  pdfParseStatus,
  AI_PREDICT_STATUS_MAP,
} from '../../../store/constants';
export const CONFIRM_STATUS_CODE = {
  unconfirmed: 2,
  confirmed: 3,
};

export const CONFIRM_STATUS = {
  [CONFIRM_STATUS_CODE.unconfirmed]: '未确认',
  [CONFIRM_STATUS_CODE.confirmed]: '已确认',
};

export const CONFIRM_STATUS_OPTIONS = [
  {
    label: CONFIRM_STATUS[CONFIRM_STATUS_CODE.unconfirmed],
    value: CONFIRM_STATUS_CODE.unconfirmed,
  },
  {
    label: CONFIRM_STATUS[CONFIRM_STATUS_CODE.confirmed],
    value: CONFIRM_STATUS_CODE.confirmed,
  },
];

export const TASK_TYPES = ['文本识别', '关键字识别', '敏感词识别'];

export const TASK_TYPES_OPTIONS = TASK_TYPES.map((task) => ({
  label: task,
  value: task,
}));

export const TASK_TYPES_MAP = {
  文本识别: 'remark',
  关键字识别: 'keywords',
  敏感词识别: 'sensitiveWords',
};

export const COMMENT_OPERATION_MAP = {
  add: 1,
  undo: 2,
};

export const UPDATE_ANSWERS_FIELD = {
  keywords: 'keyword',
  sensitiveWords: 'sensitive_word',
};

export const UPLOAD_SENSITIVE_WORDS_FILE_MAX_SIZE = 1; //上传敏感词文件大小限制最大1MB

export const SYSTEM_LOG_TYPE_OPTIONS = [
  { label: '查看', value: 2 },
  { label: '新增', value: 3 },
  { label: '修改', value: 4 },
  { label: '删除', value: 5 },
  { label: '导出', value: 6 },
  { label: '登录', value: 7 },
  { label: '退出登录', value: 8 },
];

export const SYSTEM_LOG_STATUS_CODE = {
  success: 2,
  failed: 3,
};

export const SYSTEM_LOG_STATUS_OPTIONS = [
  {
    label: '成功',
    value: SYSTEM_LOG_STATUS_CODE.success,
  },
  {
    label: '失败',
    value: SYSTEM_LOG_STATUS_CODE.failed,
  },
];

export const KNOWLEDGE_TYPE_OPTIONS = [
  { label: '文件', value: 1 },
  { label: '词条', value: 2 },
];

export const FILE_SROUCE_SEARCH_OPTION = {
  isSelect: true,
  autoSelectOption: false,
  key: 'sys_id',
  label: '文件来源',
  options: [
    {
      label: '全部',
      value: '',
    },
    {
      label: '本地上传',
      value: 0,
    },
    {
      label: '存续期服务',
      value: 1,
    },
  ],
};

export const PDF_PARSE_STATUS_SEARCH_OPTION = {
  isSelect: true,
  autoSelectOption: false,
  key: 'pdf_status',
  label: '预处理',
  options: [
    {
      label: '全部',
      value: '',
    },
    {
      label: '排队中',
      value: pdfParseStatus.waiting,
    },
    {
      label: '解析中',
      value: pdfParseStatus.parsing,
    },
    {
      label: '解析完成',
      value: pdfParseStatus.completed,
    },
    {
      label: '解析失败',
      value: pdfParseStatus.failed,
    },
  ],
};

export const AI_STATUS_SEARCH_OPTION = {
  isSelect: true,
  autoSelectOption: false,
  key: 'ai_status',
  label: 'AI预测',
  options: [
    {
      label: '全部',
      value: '',
    },
    {
      label: '模型未启用',
      value: AI_PREDICT_STATUS_MAP.DISABLED,
    },
    {
      label: '待预测',
      value: AI_PREDICT_STATUS_MAP.TODO,
    },
    {
      label: '预测中',
      value: AI_PREDICT_STATUS_MAP.DOING,
    },
    {
      label: '预测成功',
      value: AI_PREDICT_STATUS_MAP.FINISHED,
    },
    {
      label: '预测失败',
      value: AI_PREDICT_STATUS_MAP.FAILED,
    },
  ],
};

export const FILE_SEARCH_DATA = [
  {
    key: 'id',
    label: '任务ID',
  },
  {
    key: 'name',
    label: '文件名称',
  },
  {
    isSelect: true,
    key: 'task_types',
    label: '任务类型',
    options: [
      {
        value: '',
        label: '全部',
      },
      ...TASK_TYPES_OPTIONS,
    ],
  },
  {
    key: 'user_name',
    label: '上传人',
  },
  FILE_SROUCE_SEARCH_OPTION,
  PDF_PARSE_STATUS_SEARCH_OPTION,
  AI_STATUS_SEARCH_OPTION,
  {
    isSelect: true,
    key: 'confirm_status',
    label: '人工确认状态',
    options: [
      {
        value: '',
        label: '全部',
      },
      ...CONFIRM_STATUS_OPTIONS,
    ],
  },
  {
    isDatePicker: true,
    key: 'created_utc',
    label: '上传时间',
  },
];

export const FILE_SEARCH_DATA_KEYS = [
  ...FILE_SEARCH_DATA.map((item) => item.key),
  'start',
  'end',
];

export const TASK_SEARCH_DATA = [
  {
    key: 'id',
    label: '任务ID',
  },
  {
    key: 'name',
    label: '文件名称',
  },
  {
    isSelect: true,
    key: 'file_type',
    label: '文件类型',
    options: [],
  },
  {
    isSelect: true,
    key: 'task_types',
    label: '任务类型',
    options: [
      {
        value: '',
        label: '全部',
      },
      ...TASK_TYPES_OPTIONS,
    ],
  },
  FILE_SROUCE_SEARCH_OPTION,
  PDF_PARSE_STATUS_SEARCH_OPTION,
  AI_STATUS_SEARCH_OPTION,
  {
    isSelect: true,
    key: 'confirm_status',
    label: '人工确认状态',
    options: [
      {
        value: '',
        label: '全部',
      },
      ...CONFIRM_STATUS_OPTIONS,
    ],
  },
  {
    isDatePicker: true,
    key: 'created_utc',
    label: '上传时间',
  },
];

export const TASK_SEARCH_DATA_KEYS = [
  ...TASK_SEARCH_DATA.map((item) => item.key),
  'start',
  'end',
];

export const ROUTE_NAME_MAP = {
  projectDetail: 'file',
  remark: 'label',
  task: 'task',
};

// 详情页面需要展示【要素核查】的模型
export const SHOW_CONSISTENCY_COMPARISON_TAB_SCHEMA_NAMES = [
  '付息兑付安排公告',
  '行权公告',
  '行权结果公告',
];

export const PREDICT_TASK_MAP = {
  SKIP_PUSH: {
    value: 1,
    name: '重新识别',
    description: '根据文件预处理状态执行重新识别',
  },
  ONLY_PUSH: {
    value: 2,
    name: '推送识别结果',
    description: '将文件识别结果及批注文件路径推送业务系统',
  },
  DEFAULT: {
    value: 0,
    name: '重新识别并推送',
    description:
      '根据文件预处理状态执行重新识别后，将文件识别结果及批注文件路径推送业务系统',
  },
};
