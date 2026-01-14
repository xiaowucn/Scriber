import _ from 'lodash';
import md5 from 'blueimp-md5';
import {
  eachTreeNode,
  fullSchemaToEntity,
  initTreeData,
  parseEntityToTree,
} from '.';
import { SPLIT_SYMBOL } from '../store/constants';
import { hasNodeAnswer } from './answer-translateV2.2';

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
 * 将用户答案v1扁平化并转换为v2（使用另一个转v2.2答案的函数来替代）
 * @deprecated
 * @param {Object} v1Answer 用户答案
 * @param {Object} schema Schema类型
 */
export function parseAnswerToV2(v1Answer, schema) {
  const entity = fullSchemaToEntity(schema);
  const { relations } = parseEntityToTree(entity);
  const v2Items = [];
  let filterAnswer = _.filter(v1Answer, (answer) => {
    return answer.attributes;
  });
  // 增加schema_item的额外属性（meta._parents）
  initTreeData(relations.tree);
  _.forEach(v1Answer, function (answer) {
    if (!hasNodeAnswer(answer)) return;
    if (!answer.schemaPath) {
      answer.schemaPath = [filterAnswer[0].type, answer.label];
    }
    const parents = answer.schemaPath.slice();
    const key = JSON.stringify(parents);
    let schema = getSchemaByKey(key, relations.tree);
    if (schema === null) {
      throw new TypeError(`The '${key}' answer without schema.`);
    }
    let schemaAttrs = {};
    if (parents.length !== 1) {
      // root schema item
      schemaAttrs = {
        multiple: schema.data.multi, // schema attribute name is multi
        required: schema.data.required,
      };
    }
    schema = {
      data: {
        label: schema.data.label,
        type: schema.data.type,
        multiple: schema.data.multi,
        required: schema.data.required,
        words: schema.data.words || '',
      },
      meta: removeSchemaIdentity(schema.meta),
      children: schema.children,
    };
    Object.assign(schema.data, schemaAttrs);
    const item = {
      key,
      schema,
      data: [],
    };
    v2Items.push(item);
    const answerItem = mergeAnswerItems(answer.items);
    // 为每个子项生成schema_item
    if (answerItem && answerItem.fields) {
      const isJustEnumSelected = isOnlyEnumSelectedV1(answerItem);
      if (schema.meta._type.type !== 'group') {
        // 如果子项是基本、枚举类型，将子项作为标记内容
        if (isJustEnumSelected) {
          // 如果用户只勾选枚举值，不画框
          item.data.push({
            boxes: [],
            handleType: 'wireframe',
            value: answerItem.enumLabel,
          });
        } else {
          for (let i = 0; i < answerItem.fields.length; i++) {
            const field = answerItem.fields[i];
            const enumLabel = answerItem.enumLabel;
            // const key = JSON.stringify(parents.concat(field.name));
            const fieldItem = createFieldItem(key, field, schema, enumLabel);
            item.data.push(...fieldItem.data);
          }
        }
        return;
      }
      // 如果子项是组合类型，将子项提到外层，子项具有独立的key，可作为规则索引
      if (isJustEnumSelected) {
        v2Items.push({
          key,
          schema,
          data: [
            {
              boxes: [],
              handleType: 'wireframe',
              value: answerItem.enumLabel,
            },
          ],
        });
      } else {
        for (let i = 0; i < answerItem.fields.length; i++) {
          const field = answerItem.fields[i];
          const enumLabel = answerItem.enumLabel;
          const key = JSON.stringify(parents.concat(field.name));
          let schema = getSchemaByKey(key, relations.tree);
          if (!schema) continue;
          const fieldItem = createFieldItem(key, field, schema, enumLabel);
          v2Items.push(fieldItem);
        }
      }
    }
  });
  return { items: v2Items };
}
/**
 * 生成V2答案项
 * @param {string} key
 * @param {*} field
 * @param {*} schema 和当前field相关的schemaItem
 * @param {*} enumLabel 枚举的值
 */
function createFieldItem(key, field, schema, enumLabel) {
  const labels = field.label.split(SPLIT_SYMBOL);
  const children = splitLabels(labels, field.components);
  const data = children.map((list) => {
    const boxes = list.map((itm) => parseBoxToV2(itm));
    return {
      boxes,
      value: enumLabel || field.enumLabel || '',
      handleType: 'wireframe',
    };
  });
  return {
    key,
    schema: {
      data: {
        label: schema.data.label,
        multiple: schema.data.multi,
        required: schema.data.required,
        type: schema.data.type,
        words: schema.data.words || '',
      },
      meta: removeSchemaIdentity(schema.meta),
      children: schema.children.map((child) => ({
        data: child.data,
        meta: removeSchemaIdentity(child.meta),
      })),
    },
    data,
  };
}

function collectOtherItems(listedItems, otherItems) {
  for (let i = 0; i < listedItems.length; i++) {
    const listedItem = listedItems[i];
    let children = getChildren(listedItem.key, otherItems);
    Object.assign(listedItem, {
      otherItems: children,
    });
  }
  function getChildren(key, otherItems) {
    let children = [];
    for (let i = 0; i < otherItems.length; i++) {
      const item = otherItems[i];
      if (item.key.startsWith(key.slice(0, -1))) {
        children.push(item);
      }
    }
    return children;
  }
}
function createBaseItem(items, tree) {
  const baseItems = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isGrp = item.schema.meta._type.type === 'group';
    const level = JSON.parse(item.key).length;
    if (level <= 2 || isGrp) {
      baseItems.push(item);
    } else {
      const keys = JSON.parse(item.key);
      const parentKey = keys.slice(0, 2);
      if (!hasInBaseItem(parentKey, baseItems)) {
        baseItems.push(createAnswerItemV1(parentKey, tree));
      }
    }
  }
  return baseItems;
}
function createAnswerItemV1(key, tree) {
  return {
    key: JSON.stringify(key),
    schema: getSchemaByKey(key, tree),
    data: [],
  };
}
function getSchemaByKey(key, tree) {
  if (_.isArray(key)) {
    key = JSON.stringify(key);
  }
  let schema = null;
  eachTreeNode(tree, function (node) {
    const nodePath = JSON.stringify(node.meta._parent.concat(node.data.label));
    if (nodePath === key) {
      schema = node;
      return false;
    }
  });
  return schema;
}
function hasInBaseItem(key, items) {
  if (_.isArray(key)) {
    key = JSON.stringify(key);
  }
  return !_.isNil(_.find(items, (itm) => itm.key === key));
}
/**
 * 部分规则:
 * 0. 根节点没有 items 和 attributes
 * 1. schema树在展示时，只显示 层级小于等于2的类型 和 组合类型
 * 2. 答案的attribute中只存储type !== 'group'的schema类型
 */
export function parseAnswerToV1(v2Answer, fullSchema) {
  fullSchema = _.cloneDeep(fullSchema);
  const entity = fullSchemaToEntity(fullSchema);
  const { relations } = parseEntityToTree(entity);
  // 增加schema_item的额外属性（meta._parents）
  initTreeData(relations.tree);
  const items = _.cloneDeep(v2Answer.items);
  const listedItems = createBaseItem(items, relations.tree);
  const otherItems = _.xor(listedItems, items);
  collectOtherItems(listedItems, otherItems);
  const result = {};
  for (let i = 0; i < listedItems.length; i++) {
    const answer = listedItems[i];
    const md5str = md5(answer.key);

    const children = fillChildrenWithSchemaTree(
      answer.otherItems,
      relations.tree,
    );
    const schemaType = answer.schema.meta._type.type;
    const attributes = [];
    const items = [];
    const isJustEnumSelected = isOnlyEnumSelectedV2(answer);
    if (schemaType !== 'group') {
      attributes.push(trimSchemaItem(answer.schema.data));
      if (isJustEnumSelected) {
        // 用户只选了枚举
        items.push({
          enumLabel: answer.data[0].value,
          schemaMD5: md5str,
          fields: [],
        });
      } else {
        // 枚举和画框数量一致
        for (let j = 0; j < answer.data.length; j++) {
          const answerData = answer.data[j];
          const item = {
            fields: [
              {
                components: answerData.boxes.map((box) => {
                  const result = {
                    frameData: parseBoxToV1(box, answer.schema.data),
                    text: box.text,
                  };
                  return result;
                }),
                name: answer.schema.data.label,
                label: answerData.boxes
                  .map((component) => component.text)
                  .join(''),
              },
            ],
            schemaMD5: md5str,
          };
          if (typeof answerData.value === 'string') {
            Object.assign(item, {
              enumLabel: answerData.value,
            });
          }
          items.push(item);
        }
      }
    } else {
      // root schema item items 为 []
      if (answer.schema.meta._partType !== 'root') {
        const isJustEnumSelected = isOnlyEnumSelectedV2(answer);
        if (isJustEnumSelected) {
          // 用户只选了枚举
          items.push({
            enumLabel: answer.data[0].value,
            schemaMD5: md5str,
            fields: [],
          });
        } else {
          let fields = children.map((child) => {
            const components = [];
            for (let k = 0; k < child.data.length; k++) {
              const answerItem = child.data[k];
              for (let j = 0; j < answerItem.boxes.length; j++) {
                const box = answerItem.boxes[j];
                const component = {
                  frameData: parseBoxToV1(box, child.schema.data),
                  text: box.text,
                };
                components.push(component);
              }
            }
            return {
              components,
              label: child.data
                .map((answerItem) =>
                  answerItem.boxes.map((box) => box.text).join(''),
                )
                .join(SPLIT_SYMBOL),
              enumLabel: child.data.length !== 0 && child.data[0].value,
              name: child.schema.data.label,
              type: child.schema.data.type,
            };
          });
          if (fields.length > 0) {
            items.push({
              fields,
              schemaMD5: md5str,
            });
          }
        }
        attributes.push(
          ...answer.schema.children
            .filter((childSchema) => childSchema.meta._type.type !== 'group')
            .map((child) => ({
              multiple: child.data.multi,
              name: child.data.label,
              required: child.data.required,
              type: child.data.type,
            })),
        );
      }
    }
    result[md5str] = Object.assign({}, answer.schema.data, {
      attributes,
      items,
      label: answer.schema.data.label,
      md5: md5str,
      schemaPath: JSON.parse(answer.key),
      type: answer.schema.data.type,
    });
  }
  return result;
}
/**
 * 检测某条答案是否只选择了选框，适用于v1
 * @param {Object} answerItem
 */
function isOnlyEnumSelectedV1(answerItem) {
  return answerItem.fields.length === 0 && answerItem.enumLabel !== '';
}
/**
 * 检测.data某条答案是否只选择了选框，适用于v2
 * @param {Object} answerItem
 */
function isOnlyEnumSelectedV2(answerItem) {
  return (
    (answerItem.data[0] &&
      answerItem.data[0].boxes.length === 0 &&
      _.isString(answerItem.data[0].value) &&
      answerItem.data[0].value !== '') ||
    false
  );
}
/**
 * 使用schema将answer中的缺失项填满（v1展示时需要）
 * @param {Array} children
 * @param {Object} schemaTree
 */
function fillChildrenWithSchemaTree(children, schemaTree) {
  const parent = children.find(
    (child) => _.isArray(child.otherItems) && child.otherItems.length !== 0,
  );
  let schema = null;
  if (!_.isNil(parent)) {
    schema = getSchemaByKey(parent.key, schemaTree);
  } else {
    return children;
  }
  children = children.filter(
    (child) => parent === null || parent.key !== child.key,
  );
  for (let i = 0; i < schema.children.length; i++) {
    const schemaItem = schema.children[i];
    const schemaKey = JSON.stringify(
      schemaItem.meta._parent.concat(schemaItem.data.label),
    );
    const answerItemIndex = children.findIndex(
      (answer) => answer.key === schemaKey,
    );
    if (answerItemIndex === -1) {
      // push empty answer.
      children.push(createEmptyAnswerFromSchemaItem(schemaItem));
    }
  }

  return children;
}
/**
 * 从schemaItem中创建一条空答案
 * @param {Object} schemaItem
 */
function createEmptyAnswerFromSchemaItem(schemaItem) {
  const key = JSON.stringify(
    schemaItem.meta._parent.concat(schemaItem.data.label),
  );
  return {
    key,
    schema: schemaItem,
    data: [],
  };
}
function trimSchemaItem(item) {
  return {
    multiple: item.multiple,
    name: item.label,
    required: item.required,
    type: item.type,
  };
}
function removeSchemaIdentity(item) {
  delete item['_index'];
  delete item['_nodeIndex'];
  return item;
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

function parseBoxToV1(v2Box, schemaItem) {
  const { box_left, box_top, box_right, box_bottom } = v2Box.box;
  const page = v2Box.page;
  return {
    height: box_bottom - box_top + '',
    id: `page${page + 1}:${Date.now()}`,
    left: box_left + '',
    page: page,
    top: box_top + '',
    topleft: [box_top + '', box_left + ''],
    type: schemaItem.label,
    width: box_right - box_left + '',
  };
}

/**
 * 获取已经答过的题目
 * @param {Array} answers
 */
export function getAnsweredList(answers) {
  const headersMap = getHeadersMap(answers);
  const answeredList = [];
  for (let headerItem of headersMap.keys()) {
    const children = headersMap.get(headerItem);
    if (children.length > 0) {
      if (children.some((child) => isAnswered(child))) {
        answeredList.push(headerItem);
      }
    } else {
      if (isAnswered(headerItem)) {
        answeredList.push(headerItem);
      }
    }
  }
  return answeredList.map((item) => item.key);
}
/**
 * 是否是已答过的题目
 * @param {Object} answer
 */
function isAnswered(answer) {
  return answer.data.length !== 0;
}
/**
 * 获取需要标记的答案数组
 * @param {Array} items
 */
function getHeadersMap(items) {
  const headerMap = new Map();
  items = items.slice();
  const rootIndex = items.findIndex(
    (item) => JSON.parse(item.key).length === 1,
  );
  if (rootIndex !== -1) {
    items.splice(rootIndex, 1);
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const keys = JSON.parse(item.key);
    if (keys.length <= 2) {
      continue;
    }
    const parentKey = JSON.stringify(keys.slice(0, 2));
    const parentAnswer = findAnswersWithKey(parentKey, items);
    if (parentAnswer.length === 0) {
      items.push({
        key: parentKey,
        data: [],
      });
    }
  }
  const headers = items.filter((item) => {
    const key = JSON.parse(item.key);
    return key.length === 2;
  });
  const children = _.xor(items, headers);
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const headerChildren = findAnswersWithKey(
      header.key.slice(0, -1),
      children,
    );
    headerMap.set(header, headerChildren);
  }
  // return Array.from(headerMap.keys()).map(header => header.key);
  return headerMap;
}
/**
 * 寻找以指定key开头的答案
 * @param {string} parentKey
 * @param {Array} answers 答案列表
 */
function findAnswersWithKey(parentKey, answers) {
  let children = [];
  for (let i = answers.length - 1; i >= 0; i--) {
    if (isAnswerStartWithKey(parentKey, answers[i])) {
      children.push(answers[i]);
    }
  }
  return children;
}
/**
 * 判断某个答案的key是否以startKey开始
 * @param {string} parentKey 父节点的key
 * @param {Object} answer 答案
 */
function isAnswerStartWithKey(parentKey, answer) {
  return answer.key.startsWith(parentKey);
}
/**
 * 收集答案中的克隆节点以及克隆的个数
 * @param {Array} answers 答案
 */
function collectCloneAnswer(answers) {
  let answerLabels = answers.reduce(function (obj, item) {
    obj[item.key] = obj[item.key] ? ++obj[item.key] : 1;
    return obj;
  }, {});
  let cloneParent = {};
  for (let key in answerLabels) {
    if (answerLabels[key] === 1) {
      delete answerLabels[key];
    } else {
      let keyArr = JSON.parse(key);
      let parentKey = keyArr[keyArr.length - 2];
      if (!cloneParent[parentKey]) {
        cloneParent[parentKey] = answerLabels[key];
      } else if (
        cloneParent[parentKey] &&
        answerLabels[key] > cloneParent[parentKey]
      ) {
        cloneParent[parentKey] = answerLabels[key];
      }
    }
  }
  return cloneParent;
}
/**
 * 根据答案生成包含克隆节点的树结构
 * @deprecated
 * @param {Object} tree 初始树结构
 * @param {Object} cloneLabels 需要克隆的节点
 */
function createAnswerTree(tree, cloneLabels) {
  eachTreeNode(tree, function (node) {
    if (_.isArray(node)) {
      return;
    }
    let currentLabel = node.data.label;
    if (cloneLabels[currentLabel] && node.children.length > 0) {
      const isComposite = node.children.every((child) => _.isArray(child));
      if (!isComposite) {
        node.children = [node.children];
      }
      const last = _.last(node.children);
      const cloneItem = _.cloneDeep(last);
      const cloneCount = cloneLabels[currentLabel];
      let nodeItem = [];
      for (let i = 0; i < cloneCount; i++) {
        nodeItem.push(_.cloneDeep(cloneItem));
      }
      nodeItem.forEach((item, index) => {
        item.forEach((itm) => {
          itm.meta.index = index;
        });
      });
      node.children = nodeItem;
    }
  });
  return tree;
}

/**
 * @deprecated
 */
export function mergeAnswerToTreeData(tree, answer) {
  const items = answer.items.slice();
  let cloneLabels = collectCloneAnswer(items);
  let answerTree = createAnswerTree(tree, cloneLabels);
  eachTreeNode(answerTree, function (node) {
    const key = JSON.stringify(node.meta._parent.concat(node.data.label));
    const schemaItem = items.find(
      (itm) => itm.key === key && itm.index === node.meta.index,
    );
    if (schemaItem) {
      Object.assign(node, {
        answer: schemaItem,
      });
    }
  });
}
