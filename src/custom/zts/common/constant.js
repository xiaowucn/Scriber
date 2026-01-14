import { pdfParseStatus } from '@/store/constants';

export const PROJECT_STATUS_CODE = {
  waiting: 1,
  inspecting: 2,
  inspected: 3,
  failed: 4,
};

export const PROJECT_STATUS_STYLE = {
  [PROJECT_STATUS_CODE.waiting]: { backgroundColor: '#d9d9d9' },
  [PROJECT_STATUS_CODE.inspecting]: { backgroundColor: '#2686ff' },
  [PROJECT_STATUS_CODE.inspected]: { backgroundColor: '#28d12c' },
  [PROJECT_STATUS_CODE.failed]: { backgroundColor: '#ce1509' },
};

export const PROJECT_STATUS = {
  [PROJECT_STATUS_CODE.waiting]: '排队中',
  [PROJECT_STATUS_CODE.inspecting]: '分析中',
  [PROJECT_STATUS_CODE.inspected]: '分析完成',
  [PROJECT_STATUS_CODE.failed]: '分析失败',
};

export const PROJECT_STATUS_PROMPT = {
  [PROJECT_STATUS_CODE.waiting]: '当前项目处理中，请稍后',
  [PROJECT_STATUS_CODE.inspecting]: '当前项目处理中，请稍后',
  [PROJECT_STATUS_CODE.failed]: '当前项目预测异常',
};

export const FILE_STATUS_STYLE = {
  [pdfParseStatus.completed]: { color: '#28d12c' },
  [pdfParseStatus.failed]: { color: '#ce1509' },
  [pdfParseStatus.exception]: { color: '#ffa700' },
};

export const EXCHANGES = ['上交所', '深交所'];

export const DISCLOSURE_RULES = [
  { label: '资产受限', key: 'restricted_funds' },
  { label: '新增借款', key: 'borrowing' },
  { label: '对外担保', key: 'guarantee' },
  { label: '一致性比对', key: 'consistency' },
];

export const DOC_TYPE_ORDER = ['往期年报', '本期半年报', '本期年报'];
