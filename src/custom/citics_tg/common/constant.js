export const FileListTableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '文件' },
  { key: 'pdf_parse_status', label: '预处理' },
  {
    key: 'version',
    label: '版本号',
  },
  {
    key: 'templates',
    label: '模板',
  },
  {
    key: 'push_status',
    label: '推送状态',
  },
  {
    key: 'push_count',
    label: '统计状态',
  },
  {
    key: 'external_source',
    label: '外部参数来源',
  },
  { key: 'batch_number', label: '批次号' },
  {
    key: 'group_name',
    label: '所属业务组',
  },
  { key: 'user_name', label: '上传用户' },
  {
    key: 'created_utc',
    label: '上传时间',
  },
  {
    key: 'updated_utc',
    label: '修改时间',
  },
  {
    key: 'molds',
    label: '模型',
  },
  { key: 'ai_status', label: '参数预测' },
];

export const MENU_INFO = [
  {
    index: 'sysFullView',
    perm: 'sys',
  },
  {
    index: 'projectList',
    perm: 'prj',
  },
  {
    index: 'templateManage',
    perm: 'template',
  },
  {
    index: 'dataPushConfig',
    perm: 'push',
  },
  {
    index: 'paramMapConfig',
    perm: 'para',
  },
  {
    index: 'productResults',
    perm: 'record_product',
  },
  {
    index: 'accuracyStatistics',
    perm: 'record_rate',
  },
  {
    index: 'pushRecord',
    perm: 'record_push',
  },
];

export const TASK_TYPE_MAP = [
  {
    value: 1,
    label: '参数提取',
  },
  {
    value: 2,
    label: '文档比对',
  },
];

export const PUSH_TYPE_MAP = [
  {
    value: 1,
    label: '自动推送',
  },
  {
    value: 2,
    label: '业务确认',
  },
];

export const PUSH_STATUS_MAP = [
  {
    value: 1,
    label: '推送成功',
  },
  {
    value: 0,
    label: '推送失败',
  },
];
