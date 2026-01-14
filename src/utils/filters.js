import platformPerimeter from '@/perimeters/platform.perimeter';
import {
  PDF_PARSE_STATUS,
  NAFMII_PDF_PARSE_STATUS,
  PDF_PARSE_STATUS_STYLE,
  AI_PREDICT_STATUS_TEXT_MAP,
} from '../store/constants';

/**
 * 将时间戳转换为日期字符串
 * @param {number} ts - 时间戳
 * @returns {string} - 日期字符串
 */
export function date(ts) {
  if (typeof ts !== 'number') {
    return '';
  }
  if (ts.toString().length <= 10) {
    ts = ts * 1000;
  }
  const dt = new Date(ts);
  const date = [];
  date.push(dt.getFullYear());
  date.push(dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1);
  date.push(dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate());
  return date.join('-');
}

/**
 * 将时间戳转换为日期时间格式的字符串
 * @param {number} ts - 时间戳
 * @returns {string} - 日期时间格式的字符串
 */
export function datetime(ts) {
  if (typeof ts !== 'number' || ts === 0) {
    return '';
  }
  if (ts.toString().length <= 10) {
    ts = ts * 1000;
  }
  const dt = new Date(ts);
  const date = [];
  date.push(dt.getFullYear());
  date.push(dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1);
  date.push(dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate());
  const time = [];
  time.push(dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours());
  time.push(dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes());
  time.push(dt.getSeconds() < 10 ? '0' + dt.getSeconds() : dt.getSeconds());
  return date.join('-') + ' ' + time.join(':');
}

/**
 * 根据布尔值返回对应的“是”或“否”
 * @param {boolean} bool - 布尔值
 * @returns {string} - 返回“是”或“否”
 */
export function yesOrNo(bool) {
  return bool ? '是' : '否';
}

/**
 * 将数字转换为百分比格式
 * @param {number} num - 要转换的数字
 * @returns {string} - 转换后的百分比格式字符串
 */
export function conversionPercet(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '-';
  } else {
    return Math.round(num * 100) + '%';
  }
}

/**
 * 将字节数转换为可读的文件大小
 * @param {number} bytes - 字节数
 * @returns {string} - 可读的文件大小
 */
export function fileSize(bytes) {
  if (typeof bytes !== 'number') {
    return '';
  }
  const MB = Math.pow(1024, 2);
  if (bytes > MB) {
    return (bytes / MB).toFixed(2) + ' MB';
  }
  return (bytes / 1024).toFixed(2) + ' KB';
}

/**
 * PDF文件解析状态
 * @param {number} status - PDF文件的解析状态值
 * @returns {string} - 解析状态的文字描述
 */
export function pdfParseStatus(status) {
  if (platformPerimeter.isNafmiiEnv()) {
    return NAFMII_PDF_PARSE_STATUS[status] || '';
  }
  return PDF_PARSE_STATUS[status] || '';
}

/**
 * PDF文件解析状态样式
 * @param {number} status - PDF文件的解析状态值
 * @returns {string} - 解析状态的样式
 */
export function pdfParseStatusStyle(status) {
  return PDF_PARSE_STATUS_STYLE[status] || '';
}

/**
 * AI预测状态
 * @param {number} status - AI预测状态值
 * @returns {string} - 预测状态的文字描述
 */
export function presetAnswerStatus(status) {
  return AI_PREDICT_STATUS_TEXT_MAP[status] || '';
}
