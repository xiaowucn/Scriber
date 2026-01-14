import _ from 'lodash';
import {
  PROJECT_STATUS,
  PROJECT_STATUS_PROMPT,
  PROJECT_STATUS_STYLE,
  FILE_STATUS_STYLE,
} from './constant';

/**
 * 项目状态
 * @param {number} status - 项目状态值
 * @returns {string} - 项目状态的文字描述
 */
export function getProjectStatus(status) {
  return PROJECT_STATUS[status] || '';
}

/**
 * 项目状态提示
 * @param {number} status - 项目状态值
 * @returns {string} - 项目状态的提示描述
 */
export function getProjectStatusPrompt(status) {
  return PROJECT_STATUS_PROMPT[status] || '';
}

/**
 * 项目状态样式
 * @param {number} status - 项目状态值
 * @returns {string} - 项目状态的样式
 */
export function getProjectStatusStyle(status) {
  return PROJECT_STATUS_STYLE[status] || '';
}

/**
 * 文件状态样式
 * @param {number} status - 文件状态值
 * @returns {string} - 文件状态的样式
 */
export function getFileStatusStyle(status) {
  return FILE_STATUS_STYLE[status] || '';
}

export function getAllSchemaResults(data) {
  return _.mapValues(data, (items) => {
    const flattenedItems = _.flatMap(items, (item) => item.schema_results);
    const uniqueItemsWithAnswer = _.uniqBy(
      flattenedItems.filter((item) => item.answer),
      'answer.id',
    );
    const uniqueItemsWithoutAnswer = _.uniqWith(
      flattenedItems.filter((item) => !item.answer),
      (a, b) => {
        return a.doc_type === b.doc_type && a.name === b.name;
      },
    );
    return uniqueItemsWithAnswer.concat(uniqueItemsWithoutAnswer);
  });
}

export function getSchemaResultsGroupByDocType(data) {
  return _.mapValues(getAllSchemaResults(data), (items) => {
    return _.groupBy(items, 'doc_type');
  });
}

export function createSchemaOrders(keys) {
  return keys.reduce((orders, key) => {
    key.forEach((label, index) => {
      if (index < key.length - 1) {
        const nextLabel = key[index + 1];
        if (!orders[label]) {
          orders[label] = [];
        }
        if (!orders[label].includes(nextLabel)) {
          orders[label].push(nextLabel);
        }
      }
    });
    return orders;
  }, {});
}

export function getResultSchemaOrders(data) {
  const keys = data.map((item) => item.full_key_path);
  return createSchemaOrders(keys);
}

export function getResultSchema(schema, data) {
  const orders = getResultSchemaOrders(data);
  const currentSchema = schema.schemas.map((item) => {
    const newOrders = _.sortBy(orders[item.name], (orderItem) =>
      _.indexOf(item.orders, orderItem),
    );
    return { ...item, orders: newOrders };
  });
  return currentSchema;
}
