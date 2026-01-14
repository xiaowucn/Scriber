import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import {
  eachTreeNode,
  mixDeepInfo,
  schemaToEntity,
  parseEntityToTree,
  initTreeData,
  mixinCustomSchemaNode,
  updateDeepIndex,
  filterChildrenGroupNode,
} from '.';
import { AnswerTracker } from './answerTracker';

const AnswerKeyTools = {
  init() {
    this.key = null;
    this.keys = [];
    this.answer = null;
    this.answers = [];
  },
  select(key) {
    this.init();
    this.key = key;
    this.parseKey();
    return {
      removeLastIndex: (pos) => {
        return removeLastIndexOfKey(this.key, pos);
      },
      isContains: (partKeys) => {
        return isKeyContains(this.key, partKeys);
      },
      isStartsWith: (headKeys, isIgnoreLastIndex) => {
        return keyStartWith(this.key, headKeys, isIgnoreLastIndex);
      },
      getLastIndex: (pos) => {
        return getLastIndexOfKey(this.key, pos);
      },
      resetLastIndex: (indexValue, pos) => {
        return resetKeyLastIndex(this.key, indexValue, pos);
      },
      removeLastIndexOfKey: (pos) => {
        return removeLastIndexOfKey(this.key, pos);
      },
      getAnswerTreeNode: (answerTree) => {
        return getAnswerTreeNodeByKey(answerTree, this.key);
      },
      splitIndexKey: () => {
        return splitIndexKeys(this.key);
      },
    };
  },
  selectAnswer(answer) {
    return this.select(answer.key);
  },
  mergeIndexKey: (key, index) => {
    return mergeIndexKeys(key, index);
  },
  selectAllAnswer(answers) {
    this.init();
    this.answers = answers;
    return {
      rebuildAnswersIndex: () => {
        return rebuildAnswersIndex(this.answers);
      },
      allKeyIsIndexKey: () => {
        return isValidAllIndexKeys(this.answers.map((answer) => answer.key));
      },
      parseIndexKeys: () => {
        return parseToAnswersWithIndex(this.answers);
      },
      expandAnswerTree: (answerTree) => {
        // const result = expandTreeNodeByAnswers(answerTree, this.answers);
        const result = expand(answerTree, this.answers);
        return result;
      },
    };
  },
  getAnswerTreeKeyByNode,
  parseKey() {
    this.key = caseArray(this.key);
  },
  /**
   * key是否是合法的key:index
   */
  isClonedKey,
  rawKeyToArray,
};

export const remarkTools = {
  getAnswerItem() {},
  getTreeNode(key, treeNode, treeMap = null) {
    if (!treeMap) {
      treeMap = createAnswerTreeMap(treeNode);
    }
    if (typeof key === 'string') {
      key = JSON.parse(key);
    }
    const { key: keyInTreeNode } = parseAnswerKeyToTreeNodeKey(key, treeMap);
    const nodes = _.at(treeNode, keyInTreeNode);
    return nodes[0] || null;
  },
};

/**
 * 如果用户答案不是每一项都追加了:index的答案，那么为每一项答案的key都加上:0
 * @param {Array} answers 用户答案
 */
export function parseToAnswersWithIndex(answers) {
  if (!isValidAllIndexKeys(answers.map((answer) => answer.key))) {
    for (let i = 0; i < answers.length; i++) {
      const keys = JSON.parse(answers[i].key);
      for (let j = 0; j < keys.length; j++) {
        keys[j] = keys[j] + ':0';
      }
      answers[i].key = JSON.stringify(keys);
    }
  }
  return answers;
}
/**
 * 是否所有的key都是indexKey（每一行答案中的key，转换为数组后，每一项的末尾都有:index）
 * @param {Array} allKeys
 */
export function isValidAllIndexKeys(allKeys) {
  return allKeys.every((rawKey) => {
    const key = rawKeyToArray(rawKey);
    return key.every((keyPart) => /:\d+$/.test(keyPart));
  });
}
/**
 * 测试key是否由指定key开始
 * @param {String|Array} fullKey 需要验证的完整key
 * @param {String|Array} key 以此开头的key
 * @param {Boolean} isIgnoreLastIndex 是否忽略匹配key的末尾Index
 */
export function keyStartWith(fullKey, key, isIgnoreLastIndex = true) {
  fullKey = caseArray(fullKey);
  key = caseArray(key);
  fullKey = fullKey.slice(0, key.length);
  if (isIgnoreLastIndex) {
    removeLastIndexOfKey(key);
    // 将fullkey裁切为key相同长度
    removeLastIndexOfKey(fullKey);
  }
  return isKeyContains(fullKey, key);
}

/**
 * 判断两个key是否是被克隆出来的
 * @param {*} key1
 * @param {*} key2
 */
export function isClonedKey(key1, key2) {
  key1 = caseArray(key1);
  key2 = caseArray(key2);
  removeLastIndexOfKey(key1);
  removeLastIndexOfKey(key2);
  if (key1.length !== key2.length) {
    return false;
  } else if (isKeyContains(key1, key2)) {
    return true;
  }
  return false;
}
/**
 * 移除key数组中最后一项的index
 * @param {Array} key
 */
export function removeLastIndexOfKey(key, index = key.length - 1) {
  const regex = /:\d+$/;
  key[index] = _.last(key).replace(regex, '');
}

/**
 * 获取key的最后（指定）项的index
 * @param {Array} key
 * @param {Number} index
 */
export function getLastIndexOfKey(key, index) {
  key = caseArray(key);
  if (!_.isNumber(index)) {
    index = key.length - 1;
  }
  const regex = /:(\d+)$/;
  return Number(key[index].match(regex)[1]);
}
/**
 * 无论传递进来的参数是否是数组还是JSON字符串数组，并返回数组
 * @param {Array|String} list
 */
function caseArray(list) {
  if (_.isString(list)) {
    return JSON.parse(list);
  } else if (_.isArray(list)) {
    return list.slice();
  }
  throw new TypeError(`无效类型 ${list}`);
}
/**
 * key1是否从头开始包含在key2中
 * @param {Array} key1
 * @param {Array} key2
 */
export function isKeyContains(key1, key2) {
  for (let i = 0; i < key1.length; i++) {
    if (key1[i] !== key2[i]) {
      return false;
    }
  }
  return true;
}

/**
 *  重设key的最后一项Index
 * @param {String|Array} key
 * @param {Number} indexValue
 */
export function resetKeyLastIndex(key, indexValue, pos) {
  if (!_.isNumber(indexValue)) {
    throw new TypeError(`lastIndex应该为数字，${indexValue}`);
  }
  key = caseArray(key);
  if (!_.isNumber(pos)) {
    pos = key.length - 1;
  }
  key[pos] = key[pos].replace(/:\d+$/, ':' + indexValue);
  return JSON.stringify(key);
}

export function quickRebuildAnswersIndex(answers) {
  // Step.1 生成唯一的key
  const answerKey = Symbol('origin-answer');
  // Step.2 创建缓存（对象映射表）
  const keyMap = new Map();
  const map = getAnswerMap(answerKey, answers);
  // Step.3 将平级结构的答案按照级联关系转换为多维数组
  const groups = parseKeyToArray(map, answerKey, keyMap);
  // Step.4 按照级联关系遍历每一级answer，并排序，重建index
  eachGroup(groups, (group, list, depth) => {
    const answers = group.map((item) => ({
      key: keyMap.get(item).key,
      answers: item,
    }));
    rebuildAnswerIndex(answers, depth + 1);
  });
  // Step.5 对答案的key进行排序（冒号前面按字典排序，后面按照数字排序）
  sortAnswers(answers);
  return answers;
}

export function eachGroup(groups = [], callback, depth = 0) {
  for (let i = 0; i < groups.length; i++) {
    if (Array.isArray(groups[i])) {
      if (callback(groups[i], groups, depth) !== false) {
        eachGroup(groups[i], callback, depth + 1);
      }
    }
  }
}

/**
 * 找出两个key左侧相同点的下标
 * @param {array} key1
 * @param {array} key2
 */
export function getForkIndex(prevKeys, nextKeys) {
  // 同一项目下不能有重名的项目，所以只需要遍历下一个标记元素的key，不会出现数组越界
  for (let i = 0; i < nextKeys.length; i++) {
    if (prevKeys[i] !== nextKeys[i]) {
      return i - 1;
    }
  }
}

export function updateKey(keys, indexes) {
  if (keys.length !== indexes.length) {
    throw new Error('下标和Key的长度不一致');
  }
  for (let i = indexes.length - 1; i >= 0; i--) {
    keys[i] = updateKeyIndex(keys[i], indexes[i]);
  }
  return keys;
}

function updateKeyIndex(key, index) {
  const indexPos = key.lastIndexOf(':') + 1;
  return key.slice(0, indexPos) + index;
}

export function getAnswerMap(answerKey, answers) {
  const map = {};
  // Step.0 对标记数据进行递归分组
  for (const answer of answers) {
    const key = JSON.parse(answer.key);
    _.set(map, key, {
      [answerKey]: answer,
    });
  }
  return map;
}

export function sortAnswers(answers) {
  const answerKey = Symbol('origin-answer');
  // Step.0 对标记数据进行递归分组
  const map = getAnswerMap(answerKey, answers);
  const keyMap = new Map();
  const groups = parseKeyToArray(map, answerKey, keyMap);
  const flattenedAnswers = _.flattenDeep(groups);
  return flattenedAnswers;
}

export function parseKeyToArray(map, answerKey, keyMap) {
  const result = [];
  if (map[answerKey]) {
    result.push(map[answerKey]);
    keyMap.set(map[answerKey], {
      key: map[answerKey].key,
    });
  } else {
    const orderedKeys = sortKeys(Object.keys(map));
    for (const key of orderedKeys) {
      const items = parseKeyToArray(map[key], answerKey, keyMap);
      keyMap.set(items, {
        key,
      });
      result.push(items);
    }
  }
  return result;
}

/**
 * 向数组的末尾追加value值使得数组长度和len一致
 */
export function changeItemAfterIndex(arr, value, index) {
  if (index > arr.length - 1) {
    return arr;
  }
  for (let i = arr.length - 1; i > index - 1; i--) {
    arr[i] = value;
  }
  return arr;
}

// 需要对答案组下的数据进行排序
function sortKeys(keys) {
  const temporaryMap = Object.create(null);
  const sortedKeys = [];
  for (let key of keys) {
    const pos = key.lastIndexOf(':');
    const label = key.slice(0, pos);
    if (!temporaryMap[label]) {
      temporaryMap[label] = [];
    }
    temporaryMap[label].push(key);
  }
  for (const k of Object.keys(temporaryMap)) {
    const keyGroup = temporaryMap[k];
    sortedKeys.push(...keyGroup.sort(compareIndex));
  }
  return sortedKeys;
}

function compareIndex(a, b) {
  const aIndexPos = a.lastIndexOf(':') + 1;
  const bIndexPos = b.lastIndexOf(':') + 1;
  return Number(a.slice(aIndexPos)) - Number(b.slice(bIndexPos));
}

/**
 * 将答案key中的下标修改为从0开始连续的下标
 * @param {*} answers
 */
export function rebuildAnswersIndex(answers) {
  const cache = Object.create(null);
  console.log(`rebuild ${answers.length} answers.`);
  for (let i = 0; i < answers.length; i++) {
    const keyParts = caseArray(answers[i].key);
    // LRs不需要build index
    for (let j = 1; j < keyParts.length; j++) {
      const key = keyParts.slice(0, j + 1);
      removeLastIndexOfKey(key);
      if (typeof cache[key] === 'undefined') {
        cache[key] = JSON.stringify(key);
        const groupAnswers = answers.filter((answer) =>
          keyStartWith(answer.key, key),
        );
        rebuildAnswers(groupAnswers, j);
      }
    }
  }
  return answers;
}
export function rebuildAnswers(answers, level) {
  const lastIndexList = _.union(
    answers.map((answer) => getLastIndexOfKey(answer.key, level)),
  );
  for (let i = 0; i < lastIndexList.length; i++) {
    const lastIndex = lastIndexList[i];
    const sameIndexGroup = answers.filter(
      (answer) => getLastIndexOfKey(answer.key, level) === lastIndex,
    );
    for (let j = 0; j < sameIndexGroup.length; j++) {
      sameIndexGroup[j].key = resetKeyLastIndex(
        sameIndexGroup[j].key,
        i,
        level,
      );
    }
  }
}

/**
 * @deprecated
 * @param {*} answerTree
 * @param {*} answers
 */
export function expandTreeNodeByAnswers(answerTree, answers) {
  const tracker = Object.create(AnswerTracker);
  tracker.init();
  const cache = Object.create(null);
  for (let i = 0; i < answers.length; i++) {
    expandTreeNode(answerTree, answers[i], cache, tracker);
  }
  return tracker;
}

/**
 * 根据treeNode生成key的映射关系
 */
export function createAnswerTreeMap(answerTree) {
  const treeMap = Object.create(null);
  eachTreeNode(answerTree, (node) => {
    const keys = node.meta._parent.slice();
    keys.push(node.data.label);
    _.set(treeMap, keys, { node });
  });
  return treeMap;
}

// 展开树结构
export function expand(answerTree, answers, treeMap = null) {
  if (!treeMap) {
    treeMap = createAnswerTreeMap(answerTree);
  }
  for (const answerItem of answers) {
    expandAnswer(answerItem, answerTree, treeMap);
  }
}

/**
 * 通过在schema中获取某条答案的路径
 */
export function parseAnswerKeyToTreeNodeKey(keys, treeMap) {
  const labelInChildrenIndexes = [];
  const childrenInGroupIndexes = [0];
  // 初始化label下标
  for (let i = 1; i < keys.length; i++) {
    const subKey = keys.slice(0, i);
    const curKey = keys[i];
    const [label, groupIndex] = splitIndex(curKey);
    // ["A", "B", "C", "D"]
    // [0, 1, 3, 0]
    // ["A","B:1","C:3","D:0"]
    // childrenGroup[0][Bindex].childrenGroup[1][Cindex].childrenGroup[3][Dindex]
    const key = subKey
      .map((k) => {
        const [pureLabel] = splitIndex(k);
        return `["${pureLabel}"]`;
      })
      .join('');
    const item = _.at(treeMap, key)[0].node;
    let labelIndex = item.children.findIndex(
      (child) => child.data.label === label,
    );
    labelInChildrenIndexes.push(labelIndex);
    childrenInGroupIndexes.push(groupIndex);
  }

  const position = _.zip(childrenInGroupIndexes, labelInChildrenIndexes).slice(
    0,
    -1,
  );
  return {
    key: position.map((pos) => `[childrenGroup[${pos[0]}][${pos[1]}]]`),
    labelInChildrenIndexes,
    childrenInGroupIndexes,
  };
}

function splitIndex(keyWithIndex) {
  const lastIndex = keyWithIndex.lastIndexOf(':');
  return [
    keyWithIndex.slice(0, lastIndex),
    Number(keyWithIndex.slice(lastIndex + 1)),
  ];
}

function expandAnswer(answerItem, tree, treeMap) {
  const keys = getAnswerItemKey(answerItem);
  const { key: fullKey, childrenInGroupIndexes } = parseAnswerKeyToTreeNodeKey(
    keys,
    treeMap,
  );
  let node = tree;
  for (let i = 0; i < fullKey.length; i++) {
    const subKey = fullKey.slice(0, i + 1);
    if (_.isArray(node.children) && node.children.length > 0) {
      if (!_.isArray(node.childrenGroup)) {
        Object.assign(node, {
          childrenGroup: [],
        });
      }
      fillChildrenGroup(
        node.children,
        node.childrenGroup,
        childrenInGroupIndexes[i],
      );
    }
    const key = subKey.join('');
    node = _.at(tree, key)[0];
    if (!node) {
      console.error(
        `The answer key (${answerItem.key}) is not defined in the schema`,
      );
    }
    Object.assign(node.meta, {
      _nodeKey: key,
    });
  }
  // tracker.link(answerItem, node);
}

function expandTreeNode(answerTree, answer, cache, tracker) {
  const key = rawKeyToArray(answer.key);
  for (let i = 0; i < key.length; i++) {
    const keyPart = key.slice(0, i + 1);
    const keyPartJSON = JSON.stringify(keyPart);
    if (!_.isNil(cache[keyPartJSON])) {
      continue;
    }
    cache[keyPartJSON] = keyPart;
    let parent = getAnswerTreeNodeByKey(answerTree, keyPart);
    if (!parent) {
      const lastIndex = getLastIndexOfKey(keyPart);
      const endWithZeroKeyPart = resetKeyLastIndex(keyPart, 0);
      parent = getAnswerTreeNodeByKey(answerTree, endWithZeroKeyPart);
      if (!parent) {
        throw new Error(`数据异常，生成${answer.key}时出错`);
      }
      if (_.isArray(parent.childrenGroup)) {
        fillChildrenGroup(parent.children, parent.childrenGroup, lastIndex);
      }
    }
    tracker.link(answer, parent);
  }
}

/**
 * 根据答案拓展treeNode并且关联数据
 * @param {*} answerTree
 * @param {*} answer
 */
export function expandSchemaWithAnswers(
  answerTree,
  answer,
  callback = () => {},
) {
  const tracker = Object.create(AnswerTracker);
  tracker.init();
  for (let i = 0; i < answer.length; i++) {
    const item = answer[i];
    expandSchema(item, answerTree, tracker, callback);
  }
  return tracker;
}
function expandSchema(answer, answerTree, tracker, callback) {
  const keys = JSON.parse(answer.key),
    keyParts = [];
  let parent = null;
  while (keys.length > 0) {
    keyParts.push(keys.shift());
    parent = getAnswerTreeNodeByKey(answerTree, keyParts);
    if (!parent) {
      const lastPart = _.last(keyParts);
      resetKeyLastIndex(keyParts, 0);
      parent = getAnswerTreeNodeByKey(answerTree, keyParts);
      const matched = lastPart.match(/:(\d+)$/);
      if (matched.length < 2) {
        throw new Error(`key(${answer.key})格式异常.`);
      }
      const lastIndex = Number(matched[1]);
      fillChildrenGroup(parent.children, parent.childrenGroup, lastIndex);
    }
  }
  // 为 最终答案 和 answerTreeNode 建立链接
  tracker.link(answer, parent);
  callback(answer, parent);
  return tracker;
}

/**
 * 使用item填充childrenGroup直到index项有效，并返回第index项；每次填充都是深拷贝，如果数组中的index项已经存在则直接返回
 * @param {Object} item
 * @param {Array} childrenGroup
 * @param {Number} index
 */
export function fillChildrenGroup(
  item,
  childrenGroup,
  index,
  parentIndexPos,
  insertIndex,
) {
  for (let i = childrenGroup.length; i <= index; i++) {
    const clonedItem = _.cloneDeep(item);
    eachNode(clonedItem, (children) => {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        if (_.isArray(child.children) && child.children.length > 0) {
          if (!_.isArray(child.childrenGroup)) {
            child.childrenGroup = [_.cloneDeep(child.children)];
          }
        }
      }
    });

    if (insertIndex) {
      childrenGroup.splice(insertIndex, 0, clonedItem);
      childrenGroup.forEach((child, childIndex) => {
        if (childIndex > insertIndex) {
          child.forEach((item) => {
            item.meta._deepIndex[parentIndexPos] =
              item.meta._deepIndex[parentIndexPos] + 1;
          });
        }
      });
    } else {
      childrenGroup.push(clonedItem);
    }
  }
  return childrenGroup[index];
}
/**
 * 通过 answerKey 获取 treeNode 上的节点，如果找不到返回null
 * @param {*} answerTree
 * @param {*} answerTreeNodeKey
 */
export function getAnswerTreeNodeByKey(answerTree, answerTreeNodeKey) {
  let result = null;
  answerTreeNodeKey = caseArray(answerTreeNodeKey);
  eachTreeNode(answerTree, (node) => {
    const nodeKey = mixDeepInfo(node.meta);
    if (_.isEqual(answerTreeNodeKey, nodeKey)) {
      result = node;
      return false;
    }
  });
  return result;
}

/**
 * 通过引用（指针）查找树形结构中指定节点的key
 * @param {Object} answerTree
 * @param {Object} node
 */
export function getAnswerTreeKeyByNode(answerTree, node) {
  const keys = eachNode(
    answerTree,
    (treeNode) => {
      return treeNode === node;
    },
    [answerTree.data.label],
  );
  keys[keys.length - 1] = _.last(keys) + ':0';
  return keys;
}
function eachNode(treeNode, callback, keys = []) {
  if (callback(treeNode) === true) {
    return keys;
  }
  if (!_.isArray(treeNode.childrenGroup)) return;
  for (let i = 0; i < treeNode.childrenGroup.length; i++) {
    const children = treeNode.childrenGroup[i];
    for (let j = 0; j < children.length; j++) {
      const node = children[j];
      const clonedKeys = keys.slice();
      clonedKeys[keys.length - 1] = _.last(keys) + ':' + i;
      clonedKeys.push(node.data.label);
      const result = eachNode(node, callback, clonedKeys);
      if (result) return result;
    }
  }
}

/**
 * 将字符串、数组格式的key都转换为数组
 */
function rawKeyToArray(rawKey) {
  if (_.isString(rawKey)) {
    return JSON.parse(rawKey);
  } else if (_.isArray(rawKey)) {
    return rawKey;
  }
  throw new TypeError(`不支持的key格式（${rawKey}）`);
}
/**
 * 将包含key:index的数组拆分为keys和index数组
 * @param {Array} indexKeys ["LRs:0", "A10:0"]格式数组
 */
export function splitIndexKeys(indexKeys) {
  if (!isValidAllIndexKeys([indexKeys])) {
    throw new TypeError(`indexKeys格式不正确(${indexKeys})`);
  }
  const keys = rawKeyToArray(indexKeys);
  return _.unzip(
    keys.map((key) => {
      const pos = key.lastIndexOf(':'),
        firstKey = key.slice(0, pos),
        lastIndex = key.slice(pos + 1);
      return [firstKey, Number(lastIndex)];
    }),
  );
}

export function mergeIndexKeys(keys, indexKeys) {
  return _.zip(keys, indexKeys).map((key) => key.join(':'));
}

export const answerKeyTools = Object.create(AnswerKeyTools);

/**
 * keys中是否有指定的关键词
 */
export function hasKeywordInKey(keys, keyword, index = -1) {
  const indexRegex = /:\d+$/;
  if (index !== -1) {
    keys = [keys[index]];
  }
  return keys.some((key) => {
    const withoutIndexKey = key.replace(indexRegex, '');
    return withoutIndexKey.indexOf(keyword) !== -1;
  });
}

export function filterTreeData(treeData, keyword) {
  collectionChildren(treeData);
  filterVisible(treeData, keyword);
}
function filterVisible(treeNode, keyword) {
  const flattenDeepItems = _.flattenDeep(treeNode.subChildren || []).concat(
    treeNode,
  );
  const hasKeyword = flattenDeepItems.some((item) =>
    hasKeyInSchemaItem(item, keyword),
  );
  const childrenGroup = treeNode.childrenGroup || [];
  if (hasKeyword) {
    for (let i = 0; i < childrenGroup.length; i++) {
      const children = childrenGroup[i];
      for (const child of children) {
        filterVisible(child, keyword);
      }
      const visibleItems = [];
      if (children.every((child) => !child.isVisible)) {
        children.forEach((child, index) => {
          visibleItems.push(index);
        });
      } else {
        childrenGroup[i] = children.filter((child, index) => {
          if (child.isVisible) {
            visibleItems.push(index);
          }
          return child.isVisible;
        });
      }
      if (treeNode.children) {
        treeNode.children = treeNode.children.filter(
          (child, index) => visibleItems.indexOf(index) !== -1,
        );
      }
    }
  } else {
    treeNode.isVisible = false;
    treeNode.childrenGroup = [];
  }
}

export function filterAnswers(treeNode, originalAnswers, answers, keyword) {
  const childrenGroup = treeNode.childrenGroup || [];
  for (let i = 0; i < childrenGroup.length; i++) {
    const children = childrenGroup[i];
    for (const child of children) {
      filterAnswers(child, originalAnswers, answers, keyword);
    }
    if (children.every((child) => !child.isVisible)) {
      children.forEach((child) => {
        const answerItem = originalAnswers.find((answer) => {
          const keys = JSON.parse(answer.key);
          return (
            hasKeywordInKey(keys, child.data.label, keys.length - 1) &&
            hasKeywordInKey(keys, keyword)
          );
        });
        if (answerItem) {
          answers.push(answerItem);
        }
      });
    }
  }
}

/**
 * 将每个节点的后代项都放入subChildren中
 */
function collectionChildren(treeNode, depth = 0, allChildren = []) {
  const childrenGroup = treeNode.childrenGroup || [];
  if (!treeNode.subChildren) {
    Object.assign(treeNode, {
      subChildren: [],
      isVisible: true,
    });
  }
  for (let i = 0; i < childrenGroup.length; i++) {
    for (const child of childrenGroup[i]) {
      treeNode.subChildren.push(child);
      if (allChildren.indexOf(treeNode.subChildren) === -1) {
        allChildren.push(treeNode.subChildren);
      }
      collectionChildren(child, depth + 1, treeNode.subChildren);
    }
  }
}

function hasKeyInSchemaItem(item, keyword) {
  return item.data.label.indexOf(keyword) !== -1;
}

function rebuildAnswerIndex(answers, keyIndex) {
  const groups = Object.create(null);
  for (const answer of answers) {
    const [pureKey] = splitIndex(answer.key);
    if (!groups[pureKey]) {
      groups[pureKey] = [];
    }
    groups[pureKey].push(answer);
  }
  const pureKeys = Object.keys(groups);
  for (const pureKey of pureKeys) {
    for (let i = 0; i < groups[pureKey].length; i++) {
      changeAnswerKeyIndex(groups[pureKey][i].answers, keyIndex, i);
    }
  }
  return groups;
}

function changeAnswerKeyIndex(answers, index, value) {
  const flattened = _.flattenDeep(answers);
  for (const answer of flattened) {
    const keys = JSON.parse(answer.key);
    keys[index] = updateKeyIndex(keys[index], value);
    answer.key = JSON.stringify(keys);
  }
}

/**
 * 执行 remark.APPEND_ANSWER_ITEM 后
 * 如果是插入到已有列表中间，需要更新 state.answerTree.answer.items 中从插入位置开始 data 的 key 值
 */
export function updateAnswerItemKey(answerItems, parentIndex, insertIndex) {
  return answerItems.map((item) => {
    const keyList = JSON.parse(item.key);
    const parentKey = keyList[parentIndex];

    if (parentKey) {
      const parentKeyList = parentKey.split(':');

      if (parentKeyList[1] >= insertIndex) {
        keyList[parentIndex] = `${parentKeyList[0]}:${
          Number(parentKeyList[1]) + 1
        }`;

        item.key = JSON.stringify(keyList);
      }
    }

    return item;
  });
}

/**
 * 转换原始table数据为pdf-viewer组件需要的boxes类型数据
 * @param {Object} tables 原始table数据
 * @param {Number} page 页码
 */
export function formatTablesToBoxes(tables, page) {
  const tableBoxes = [];
  for (let i = 0; i < tables.length; i++) {
    let element = tables[i];
    const type = element.cells ? 'table' : 'wireframe';
    element.page = page;
    element.id = uuid();
    element.cells = element.cells || {};
    element.merged = element.merged || [];
    element.grid = element.grid || { rows: [], columns: [] };
    tableBoxes.push({
      mergeToTableId: element.id,
      boxes: [
        {
          box: {
            box_left: element.outline[0],
            box_top: element.outline[1],
            box_right: element.outline[2],
            box_bottom: element.outline[3],
          },
          page: Number(page),
          id: element.id,
        },
      ],
      type: type,
      customType: element.type,
      tags: [element.type],
      tableDatas: [element],
      index: element.index,
    });
  }
  return tableBoxes;
}

export function createEmptyAnswer(model, originModel) {
  const currentModel = originModel || model;
  const key = JSON.stringify(mixDeepInfo(model.meta));
  const enumList = currentModel.meta._type.values;
  let values = [];
  if (enumList) {
    const defaultEnums = enumList.filter((item) => item.isDefault === true);
    values = defaultEnums.map((item) => item.name);
  }
  const answerData = {
    key,
    data: [],
    value: values,
    schema: {
      data: model.data,
    },
    manual: true,
  };
  if (model.meta.custom) {
    answerData.custom = true;
  }
  return answerData;
}

export function cloneModelAnswer(model, answer) {
  const currentAnswer = answer || model.answer;
  const cloneAnswer = _.cloneDeep(currentAnswer);
  const modelAnswer = cloneAnswer;
  if (!currentAnswer.schema) {
    modelAnswer.schema = { data: model.data };
  }
  if (currentAnswer.manual === undefined) {
    modelAnswer.manual = false;
  }

  return modelAnswer;
}

export function getOriginSchema(remarkSchema) {
  let schema = null;
  if (remarkSchema && remarkSchema.response) {
    const { data, checksum, mold_type } = remarkSchema.response;
    schema = Object.assign({}, data, {
      version: checksum,
      mold_type,
    });
  }
  return schema;
}

export function unescapeAnswerText(answer) {
  if (answer && answer.items) {
    answer.items.forEach((item) => {
      item.data.forEach((box) => {
        box.text = _.unescape(box.text);
      });
    });
  }
  return answer;
}

export function getOriginalTreeDatas(
  schema,
  customFieldAnswer,
  schemaDescriptions,
) {
  const entity = schemaToEntity(schema);
  Object.freeze(schema);
  Object.freeze(entity);

  const treeData = parseEntityToTree({ data: entity }).relations.tree;

  if (customFieldAnswer) {
    mixinCustomSchemaNode(treeData, customFieldAnswer);
  }

  initTreeData(treeData);
  // Step.0 将 children 转换为二维数组，以便子节点可被克隆

  eachTreeNode(treeData, (node) => {
    // 添加最新的schema字段描述信息，从`intro_words`接口单独获取后合入node.data中
    if (schemaDescriptions) {
      const fullSchemaName = node.meta._deepLabels.join('_');
      Object.assign(node.data, {
        description: schemaDescriptions[fullSchemaName],
      });
    }
    if (_.isArray(node.children) && node.children.length > 0) {
      // 需要保持children中的数据不被answer污染
      const pureChildren = _.cloneDeep(node.children);
      Object.assign(node, {
        childrenGroup: [pureChildren],
      });
    }
  });
  const treeDatas = Object.freeze([treeData]);
  return treeDatas;
}

function getAnswerItemKey(answerItem) {
  const key = answerItem.master_key || answerItem.key;
  return JSON.parse(key);
}

export function getDeepLabelsFromAnswerKey(item) {
  return JSON.parse(item.answer.key).map((item) => item.split(':')[0]);
}

export function updateMergedTreeDatas(answers, answerTree) {
  const answerTreeMap = createAnswerTreeMap(answerTree);
  expand(answerTree, answers, answerTreeMap);
  for (let answerItem of answers) {
    const { key: treeNodeKey } = parseAnswerKeyToTreeNodeKey(
      getAnswerItemKey(answerItem),
      answerTreeMap,
    );

    const treeNodeKeyStr = treeNodeKey.join('');
    let treeNode = _.at(answerTree, treeNodeKeyStr)[0];
    Object.assign(treeNode, {
      answer: answerItem,
    });
  }
  updateDeepIndex(answerTree);
  // 冻结node
  // eachTreeNode(answerTree, node => {
  //   Object.freeze(node);
  // });
  filterChildrenGroupNode(answerTree);
}
