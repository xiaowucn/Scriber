export const FILL_STATUS_CODE = {
  waiting: 1,
  fillable: 2,
  filling: 3,
  completed: 4,
  failed: 5,
};

export const FILL_STATUS_STYLE = {
  [FILL_STATUS_CODE.waiting]: { color: '#606266' },
  [FILL_STATUS_CODE.fillable]: { color: '#606266' },
  [FILL_STATUS_CODE.filling]: { color: '#606266' },
  [FILL_STATUS_CODE.completed]: { color: '#1DA57A' },
  [FILL_STATUS_CODE.failed]: { color: '#CE1509' },
};

export const FILL_STATUS = {
  [FILL_STATUS_CODE.waiting]: '待填写',
  [FILL_STATUS_CODE.fillable]: '填写中',
  [FILL_STATUS_CODE.filling]: '填写中',
  [FILL_STATUS_CODE.completed]: '填写完成',
  [FILL_STATUS_CODE.failed]: '错误',
};

export const FILE_STATUS_CODE = {
  uncompleted: 1,
  completed: 4,
};

export const FILE_STATUS_STYLE = {
  [FILE_STATUS_CODE.uncompleted]: { color: '#CE1509' },
  [FILE_STATUS_CODE.completed]: { color: '#606266' },
};

export const FILE_BROWSE_STATUS = {
  [FILE_STATUS_CODE.uncompleted]: '未浏览',
  [FILE_STATUS_CODE.completed]: '已浏览',
};

export const FILE_MODIFY_STATUS = {
  [FILE_STATUS_CODE.uncompleted]: '未修改',
  [FILE_STATUS_CODE.completed]: '已修改',
};

const ORDER_RELATED_DATA_LABELS = {
  project_name: '项目名称',
  bond_shortname: '产品名称',
  order_no: '订单编号',
  investor_name: '订单人',
  interest_rate: '利率',
  base_money: '金额限制',
  scale: '规模限制',
  apply_scale: '按发行规模比例申购',
  base_limit: '申购限额',
  scale_limit: '申购发行规模%限额',
  limit_id: '组合限制',
  total_amt: '实际申购金额',
  apply_money: '有效申购金额',
};

const ORDER_RELATED_TABLE_COLUMN = [
  'project_name',
  'bond_shortname',
  'order_no',
  'investor_name',
  'interest_rate',
  'base_money',
  'apply_scale',
];

export const ORDER_RELATED_LABEL_MAP = Object.entries(
  ORDER_RELATED_DATA_LABELS,
).map(([key, label]) => ({ key, label }));

export const ORDER_RELATED_TABLE_COLUMN_MAP = ORDER_RELATED_TABLE_COLUMN.map(
  (key) => ({
    key,
    label: ORDER_RELATED_DATA_LABELS[key],
  }),
);
