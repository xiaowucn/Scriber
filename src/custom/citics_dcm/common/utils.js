import {
  FILL_STATUS,
  FILE_BROWSE_STATUS,
  FILE_MODIFY_STATUS,
  FILL_STATUS_STYLE,
  FILE_STATUS_STYLE,
} from './constant';

/**
 * 项目或文件填写状态
 * @param {number} status - 项目或文件填写状态值
 * @returns {string} - 项目或文件填写状态的文字描述
 */
export function getFillStatus(status) {
  return FILL_STATUS[status] || '';
}

/**
 * 项目或文件填写状态样式
 * @param {number} status - 项目或文件填写状态值
 * @returns {string} - 项目或文件填写状态的样式
 */
export function getFillStatusStyle(status) {
  return FILL_STATUS_STYLE[status] || '';
}

/**
 * 文件浏览状态
 * @param {number} status - 文件浏览状态值
 * @returns {string} - 文件浏览状态的文字描述
 */
export function getFileBrowseStatus(status) {
  return FILE_BROWSE_STATUS[status] || '';
}

/**
 * 文件修改状态
 * @param {number} status - 文件修改状态值
 * @returns {string} - 文件修改状态的文字描述
 */
export function getFileModifyStatus(status) {
  return FILE_MODIFY_STATUS[status] || '';
}

/**
 * 文件的状态样式
 * @param {number} status - 文件的状态值
 * @returns {string} - 文件的状态样式
 */
export function getFileStatusStyle(status) {
  return FILE_STATUS_STYLE[status] || '';
}
