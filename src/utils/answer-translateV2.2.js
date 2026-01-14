import _ from 'lodash';
import { flattenSchemaData } from '.';
import { SPLIT_SYMBOL } from '../store/constants';

/**
 * fn([ab,c], [x, y, z] )-> [[x, y], z]
 * 按照标签列表的每一项，生成text属性一致的组，详情见单元测试
 * @param {Array<string>} labels 标签列表
 * @param {Array<Object>} items 项目列表，text属性对应label
 */
export function splitLabels(labels, items) {
  const result = labels.map(() => []);
  let itemIndex = 0;
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    for (let j = itemIndex; j < items.length; j++) {
      const subItems = items.slice(itemIndex, j + 1);
      const subName = subItems.map((itm) => itm.text).join('');
      if (subName === label) {
        itemIndex = j + 1;
        result[i].push(...subItems);
        break;
      }
    }
  }
  return result;
}

/**
 * 判断schema节点是否具有答案
 * @param {Object} answer 用户答案
 */
export function hasNodeAnswer(answer) {
  let hasAnswer = false;
  if (!answer.label) {
    return hasAnswer;
  } else if (answer.items && answer.items.length > 0) {
    answer.items.forEach((item) => {
      if (item.enumLabel) {
        hasAnswer = true;
      } else {
        item.fields.forEach((field) => {
          if (
            (field.components && field.components.length > 0) ||
            field.enumLabel
          ) {
            hasAnswer = true;
          }
        });
      }
    });
  }
  return hasAnswer;
}

/**
 * 将用户答案v1扁平化并转换为v2.2
 * @param {Object} v1Answer 用户答案
 * @param {Object} schema Schema
 */
export function parseAnswerToV2_2(v1Answer, schema) {
  let flattenSchema = flattenSchemaData(schema);
  const v2Answers = [];
  _.forEach(v1Answer, function (answer) {
    if (!hasNodeAnswer(answer)) return;
    let rootLabel = flattenSchema[0].data.label;
    let pathKey = [rootLabel, answer.label];
    let schema = getSchemaByKey(pathKey, flattenSchema);
    if (schema === null) {
      throw new TypeError(`The '${pathKey}' answer without schema.`);
    }
    // answer分为单个节点和组合类型节点
    if (schema.children.length === 0) {
      let key = JSON.stringify(createNodeKey(pathKey));
      let answerItems = mergeAnswerItems(answer.items);
      let isJustEnumSelected = isOnlyEnumSelectedV1(answerItems);
      // 只勾选了枚举值
      let enumVal = answerItems.enumLabel || null;
      if (isJustEnumSelected) {
        let item = createAnswerItem(key, schema, enumVal);
        v2Answers.push(item);
      } else {
        let data = answerItems.fields.map((field) => {
          return createFieldItem(field.components);
        });
        let item = createAnswerItem(key, schema, enumVal, data);
        v2Answers.push(item);
      }
    } else {
      // 组合类型节点
      answer.items.forEach((group, index) => {
        group.fields.forEach((field) => {
          let childrenKey = pathKey.slice();
          childrenKey.push(`${field.name}`);
          let nodeSchema = getSchemaByKey(childrenKey, flattenSchema);
          let key = JSON.stringify(createNodeKey(childrenKey, index));
          if (field.components.length === 0 && !field.enumLabel) return;
          let enumVal = field.enumLabel || null;
          const isOnlyEnum = isJustEnumSelected(field);
          // 只勾选了枚举值
          if (isOnlyEnum) {
            let item = createAnswerItem(key, nodeSchema, enumVal);
            v2Answers.push(item);
          } else {
            // 当前叶子节点只有一条答案
            if (field.label.indexOf(SPLIT_SYMBOL) === -1) {
              let data = [createFieldItem(field.components)];
              let item = createAnswerItem(key, nodeSchema, enumVal, data);
              v2Answers.push(item);
            } else {
              // 当前叶子节点有多条答案
              let data = createFieldOfGroup(field);
              let item = createAnswerItem(key, nodeSchema, enumVal, data);
              v2Answers.push(item);
            }
          }
        });
      });
    }
  });
  return {
    items: v2Answers,
    version: '2.2',
  };
}

/**
 * 生成答案唯一key
 * @param {*} path 当前节点路径
 * @param {*} index 当前节点index
 */
function createNodeKey(path, index) {
  path.splice(0, 1, `${path[0]}:0`);
  if (typeof index !== 'undefined') {
    path.splice(1, 1, `${path[1]}:${index}`);
    path.splice(2, 1, `${path[2]}:0`);
  } else {
    path.splice(1, 1, `${path[1]}:0`);
  }
  return path;
}

/**
 * 生成答案个数（画框数据）
 * @param {*} components
 */
function createFieldItem(components) {
  const boxes = components.map((itm) => parseBoxToV2(itm));
  return {
    boxes,
    handleType: 'wireframe',
  };
}

/**
 * 组合类型的子节点是否只勾选了枚举值
 * @param {string} field
 */
function isJustEnumSelected(field) {
  return field.components.length === 0 && field.enumLabel;
}

/**
 * 生成V2答案项只有枚举值无画框答案
 * @param {string} key
 * @param {*} schema 和当前field相关的schemaItem
 * @param {*} data 当前节点答案画框数据
 * @param {*} enumLabel 枚举的值
 */
function createAnswerItem(key, schema, enumLabel, data = []) {
  let nodeSchema = {
    data: schema.data,
  };
  return { key, schema: nodeSchema, data, value: enumLabel };
}

/**
 * 组合类型节点包含多个答案
 * @param {*} field
 */
function createFieldOfGroup(field) {
  const labels = field.label.split(SPLIT_SYMBOL);
  const children = splitLabels(labels, field.components);
  return children.map((list) => {
    const boxes = list.map((itm) => parseBoxToV2(itm));
    return {
      boxes,
      handleType: 'wireframe',
    };
  });
}

function getSchemaByKey(pathKey, flattenSchema) {
  let currentLabel = _.last(pathKey);
  return flattenSchema.find((item) => {
    let itemKey = JSON.stringify([...item.meta._parent, item.data.label]);
    return (
      item.data.label === currentLabel && JSON.stringify(pathKey) === itemKey
    );
  });
}

/**
 * 检测某条答案是否只选择了选框，适用于v1
 * @param {Object} answerItem
 */
function isOnlyEnumSelectedV1(answerItem) {
  return answerItem.fields.length === 0 && answerItem.enumLabel;
}

function parseBoxToV2(v1Box) {
  const { top, left, width, height, page } = v1Box.frameData;
  return {
    box: {
      box_left: Number(left),
      box_top: Number(top),
      box_right: Number(left) + Number(width),
      box_bottom: Number(top) + Number(height),
    },
    page,
    text: v1Box.text,
  };
}

/**
 * 针对v1答案中，如果先画框，后选枚举值，items中会出现两条信息的问题，将这两条信息合并为一条信息
 * @param {Array} items
 */
function mergeAnswerItems(items) {
  if (items.length === 0) return items.slice();
  let fields = [];
  let enumLabel = '';
  for (let i = 0; i < items.length; i++) {
    if (items[i].fields.length !== 0) {
      fields.push(...items[i].fields);
    }
    if (typeof items[i].enumLabel === 'string') {
      enumLabel = items[i].enumLabel;
    }
  }
  return Object.assign({}, ...items, { fields, enumLabel });
}
