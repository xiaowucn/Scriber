import _ from 'lodash';
import { Base64 } from 'js-base64';
import { schema, schemaDefaultType, schemaEnumType } from '../store/constants';
import { notify } from '@/utils/reset-elementui.js';
import i18n from '@/i18n';
import md5 from 'blueimp-md5';
import platformPerimeter from '../perimeters/platform.perimeter';
import { isENLang } from '@/store/constants';

const locale = isENLang ? 'en' : 'cn';
const t = i18n[locale];

export const getFileTypeByName = function (fileName = '') {
  if (typeof fileName !== 'string') {
    throw new TypeError('fileName must be a String.');
  }
  const index = fileName.lastIndexOf('.');
  if (index === -1) {
    // 没有后缀
    switch (fileName.toLowerCase()) {
      // intercept filename here...
      default: {
        return fileName;
      }
    }
  }
  const ext = fileName.substr(index + 1);
  return ext;
};

// 将秒数转换为时分秒
export const formatSecondToHms = (second) => {
  const h = parseInt((second / 60 / 60) % 24);
  const m = parseInt((second / 60) % 60);
  const s = Math.ceil(second % 60);
  if (second < 60) {
    return `${s}${t.message['秒']}`;
  } else if (second >= 60 && second < 60 * 60) {
    return `${m}${t.message['分']}${s}${t.message['秒']}`;
  } else {
    return `${h}${t.message['时']}${m}${t.message['分']}${s}${t.message['秒']}`;
  }
};

// 获取当前月份的第一天
export const getCurrentMonthFirst = () => {
  const date = new Date();
  date.setDate(1);
  let month = parseInt(date.getMonth() + 1);
  let day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
};

// 获取当前月份的最后一天
export const getCurrentMonthLast = () => {
  const date = new Date();
  let currentMonth = date.getMonth();
  const nextMonth = ++currentMonth;
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  const oneDay = 1000 * 60 * 60 * 24;
  const lastTime = new Date(nextMonthFirstDay - oneDay);
  let month = parseInt(lastTime.getMonth() + 1);
  let day = lastTime.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
};

export function getCounterGenerate(start = 0) {
  return function () {
    return ++start;
  };
}
const getCounter = getCounterGenerate();

export const convertFileTypeToIcon = function (fileType = '') {
  if (typeof fileType !== 'string') {
    throw new TypeError('fileType must be a String.');
  }
  const clazz = ['far'];
  switch (fileType.toLowerCase()) {
    case 'heic':
    case 'webp':
    case 'gif':
    case 'bmp':
    case 'png':
    case 'jpeg':
    case 'jpg': {
      clazz.push('file-image');
      break;
    }
    case 'acc':
    case 'wav':
    case 'wma':
    case 'mp3': {
      clazz.push('file-audio');
      break;
    }
    case 'mkv':
    case 'avi':
    case 'mp4': {
      clazz.push('file-video');
      break;
    }
    case '7z':
    case 'tar':
    case 'gz':
    case 'rar':
    case 'zip': {
      clazz.push('file-archive');
      break;
    }
    case 'md':
    case 'txt': {
      clazz.push('file-alt');
      break;
    }
    case 'js':
    case 'java':
    case 'py':
    case 'go':
    case 'c': {
      clazz.push('file-code');
      break;
    }
    case 'pdf': {
      clazz.push('file-pdf');
      break;
    }
    case 'docx':
    case 'doc': {
      clazz.push('file-word');
      break;
    }
    case 'xlsx':
    case 'xls': {
      clazz.push('file-excel');
      break;
    }
    case 'ppt':
    case 'pptx': {
      clazz.push('file-powerpoint');
      break;
    }
    case 'parent': {
      clazz.push('folder-open');
      break;
    }
    case 'folder': {
      clazz.push('folder');
      break;
    }
    case 'license': {
      clazz.push('info-circle');
      break;
    }
    default: {
      clazz.push('file');
    }
  }
  clazz[1] = 'fa-' + clazz[clazz.length - 1];
  clazz.push('fa-2x', 'fa-fw');
  return clazz.join(' ');
};

export { EventBus } from './eventBus';

/**
 * 使用Promise来包裹 Element UI 的表单校验
 */
export function validateToPromise($form) {
  return new Promise((resolve) => {
    $form.validate((valid) => resolve(valid));
  });
}

/**
 * 创建空的Schema对象
 * @param {String} name
 */
export function createEmptyFullSchema(params) {
  const { name, alias, moldType = 0, groupId, model_name } = params;
  const schema = {
    name,
    mold_type: moldType,
    data: {
      schemas: [
        {
          name,
          schema: {},
        },
      ],
      schema_types: [],
    },
  };
  if (groupId !== undefined) {
    Object.assign(schema, {
      group_id: Number(groupId),
    });
  }

  if (alias !== '') {
    schema.data.schemas[0].alias = alias;
  }

  if (model_name !== '') {
    Object.assign(schema, {
      model_name,
    });
  }

  return schema;
}

/**
 * 将 EntityData 转换为 SchemaData
 * @param {Object} entity
 * @param {String} rootSchemaWords
 */
export function fullEntityToSchema(entity, rootSchemaWords) {
  const schemaData = Object.assign(
    {
      id: entity.id,
      created_utc: entity.created_utc,
      name: entity.name,
      updated_utc: entity.updated_utc,
      checksum: entity.checksum,
      model_name: entity.model_name,
    },
    {
      data: entityToSchema(entity.data || {}, entity.words || rootSchemaWords),
    },
    {
      predictors: entity.predictors,
    },
    {
      mold_type: entity.mold_type,
    },
  );
  if (platformPerimeter.isCmfchinaEnv()) {
    schemaData.group_ids = entity.groups.map((group) => group.id);
  }
  return schemaData;
}

/**
 * 将 EntityData 转换为 SchemaData (转换data)
 * @param {Array} entity
 * @param {String} words
 */
export function entityToSchema(entity, words) {
  if (!entity.top) {
    throw new TypeError("the schema's part of Top can't be null.");
  }
  return {
    schemas: [
      trimEntityData(entity.top, words, true),
      ...entity.normals.map((normal) => trimEntityData(normal)),
    ],
    schema_types: entity.schemaTypes || [],
  };
}

// 定义数据结构
function trimEntityData(entityData, words, needAlias = false) {
  const orders = entityData.attrs.map((attr) => attr.name);
  const schema = (entityData.attrs || []).reduce((a, v) => {
    a[v.name] = {
      type: v.type,
      required: v.required,
      multi: v.multi,
      words: v.words,
      alias: v.alias,
      uuid: v.uuid,
      description: v.description,
      regex: v.regex,
      extract_type: v.extract_type,
    };
    return a;
  }, {});
  return {
    name: entityData.name,
    alias: needAlias ? entityData.alias : undefined,
    uuid: entityData.uuid,
    orders,
    schema,
    words: words || entityData.words,
    description: entityData.description,
  };
}

/**
 * 将 SchemaData 转换为 EntityData
 * @param {Object} schema
 */
export function fullSchemaToEntity(schema) {
  return Object.assign(
    {
      _index: getCounter(),
      id: schema.id,
      created_utc: schema.created_utc,
      name: schema.name,
      updated_utc: schema.updated_utc,
      checksum: schema.checksum,
      groups: schema.groups,
      ...schema,
    },
    {
      data: schemaToEntity(schema.data || {}),
    },
    {
      predictors: schema.predictors,
    },
    {
      mold_type: schema.mold_type,
    },
  );
}

/**
 * 将 SchemaData 转换为 EntityData (转换data)
 * @param {Array} schemaData
 */
export function schemaToEntity(schemaData) {
  const data = schemaData.schemas || schemaData;
  if (data.length === 0) {
    throw new TypeError("the schemas's length must more than 0.");
  }
  return {
    top: trimSchemaData(data[0]),
    normals: data.slice(1).map((schema) => trimSchemaData(schema)),
    schemaTypes: _.isArray(schemaData.schema_types)
      ? schemaData.schema_types.slice()
      : [],
  };
}
function trimSchemaData(schemaData) {
  const orders = _.isArray(schemaData.orders)
    ? schemaData.orders
    : Object.keys(schemaData.schema);
  let result = {
    _index: getCounter(),
    name: schemaData.name,
    alias: schemaData.alias,
    description: schemaData.description,
    uuid: schemaData.uuid,
    orders,
    attrs: orders.map((name) =>
      Object.assign(schemaData.schema[name], { name, _index: getCounter() }),
    ),
  };
  if (schemaData.words) {
    result.words = schemaData.words;
  }
  return result;
}

/**
 * 生成基本的空答案数据（针对自定义字段）
 */
export function generateBasicAnswerItemData({ key, data }) {
  return {
    custom: true,
    key: key,
    data: [],
    manual: true,
    schema: {
      data: data,
    },
    value: '',
  };
}

/**
 * 生成answerTree节点的基本数据结构
 * @param {Object} treeData 原答案树
 */
export function generateBasicTreeNodeData(treeData) {
  const label = treeData.data.label;
  const basicTreeNodeData = {
    data: {
      ...treeData.data,
      type: '文本',
    },
    meta: {
      ...treeData.meta,
      _deepIndex: [0],
      _deepLabels: [label],
      _parent: [label],
      _partType: 'top',
      _path: [label, '文本'],
      _type: {
        label: '文本',
        type: 'basic',
      },
    },
  };

  return basicTreeNodeData;
}

/**
 * 将自定义schema节点混入源schema
 * @param {Object} treeData 原答案树
 * @param {Object} customAnswer 自定义字段的answer
 */
export function mixinCustomSchemaNode(treeData, customAnswer) {
  function generateTreeNodeData(treeData, node, answerItem) {
    const lastChildNode =
      _.cloneDeep(_.last(treeData.children)) ||
      generateBasicTreeNodeData(treeData);

    const insertIndex = Number(
      _.nth(JSON.parse(answerItem.key), -2).split(':')[1],
    );
    treeData.children.push({
      children: [],
      data: {
        ...answerItem.schema.data,
      },
      meta: {
        ...lastChildNode.meta,
        _type: {
          label: answerItem.schema.data.label,
          type: 'basic',
        },
        _index: lastChildNode.meta._index + 1,
        _nodeIndex: lastChildNode.meta._nodeIndex + 1,
        _deepLabels: _.initial(lastChildNode.meta._deepLabels).concat(node),
        _insertIndex: insertIndex,
        custom: true,
      },
    });
  }

  if (!customAnswer.items) {
    return;
  }

  customAnswer.items.forEach((item) => {
    const parentNode = _.nth(JSON.parse(item.key), -2).split(':')[0];
    const node = item.schema.data.label;

    if (treeData.data.label === parentNode) {
      generateTreeNodeData(treeData, node, item);
    }

    treeData.children.forEach(function insertCustomNode(child) {
      if (child.data.label === parentNode) {
        generateTreeNodeData(child, node, item);
      } else {
        child.children.forEach(insertCustomNode);
      }
    });
  });
}

/**
 * 过滤 answerTree 中的group的node
 * 由于添加的自定义scheme字段在answerTree中的组（childrenGroup）位置可能不同，需要根据meta._insertIndex，将其插入到对应的childrenGroup组里
 * @param {Object} answerTree
 */
export function filterChildrenGroupNode(answerTree) {
  eachTreeNode(answerTree, (node, parent, indexes) => {
    if (parent && _.isArray(parent.childrenGroup)) {
      parent.childrenGroup[indexes[0]] = parent.childrenGroup[
        indexes[0]
      ].filter((child) => {
        return !child.meta.custom || (child.meta.custom && child.answer);
      });
    }
  });
}

/**
 * 将 schema 转换为 tree 对象
 * 需注意：
 * 由于schema.type 是引用类型，所以一个 tree item 可能会
 * 存在于多个tree node 中，一处 tree item 改变，会引发
 * 所有 tree item 改变
 * @param {Object} entity
 */
export function parseEntityToTree(entity) {
  const types = getAllTypesFromEntity(entity);
  entity = entity.data;
  const subSchemas = {};
  for (let i = 0; i < entity.normals.length; i++) {
    for (let j = 0; j < entity.normals[i].attrs.length; j++) {
      subSchemas[entity.normals[i].attrs[j].name] = Object.assign(
        {},
        entity.normals[i].attrs[j],
        {
          _parentSchema: {
            name: entity.normals[i].name,
          },
          _topSchema: {
            name: entity.top.name,
          },
        },
      );
    }
  }
  const result = {
    // entities: {
    //   attrs: subSchemas,
    //   normals: entity.normals
    // },
    relations: {
      tree: {
        meta: {
          _index: entity.top._index,
          _partType: 'root',
          _type: {
            label: entity.top.name,
            type: 'group',
          },
        },
        data: {
          label: entity.top.name,
          alias: entity.top.alias,
          type: entity.top.name,
          words: entity.top.words,
        },
        children: createTreeItem(entity.top, entity.normals, types),
      },
    },
  };
  return result;
}

function createTreeItem(top, normals, types = []) {
  let root = [];
  let queue = [];
  top.attrs.forEach((attr) => {
    root.push({
      data: {
        label: attr.name,
        type: attr.type,
        required: attr.required,
        multi: attr.multi,
        words: attr.words || '',
        alias: attr.alias,
        description: attr.description,
        regex: attr.regex,
        extract_type: attr.extract_type,
      },
      meta: {
        _path: [attr.name],
        _index: attr._index,
        _partType: 'top',
        _type: getSchemaType(types, attr.type),
      },
      children: [],
    });
  });
  queue = root.slice();
  let count = 0;
  while (queue.length > 0) {
    if (count++ > 1e5) {
      throw new Error(`${[...unit.meta._path, unit.data.type]} is too deep.`);
    }
    const unit = queue.shift();
    if (unit.data.type && unit.data.type !== 'text') {
      // 查找子
      const subSchema = getSubSchemas(unit.data.type, normals);
      if (!subSchema) {
        continue;
      }
      const children = subSchema.children;
      for (let i = 0; i < children.length; i++) {
        const child = {
          data: {
            // ...children[i],
            label: children[i].name,
            required: children[i].required,
            multi: children[i].multi,
            type: children[i].type,
            words: children[i].words || '',
            alias: children[i].alias,
            regex: children[i].regex,
            extract_type: children[i].extract_type,
            description: children[i].description,
          },
          meta: {
            _index: children[i]._index,
            _path: [...unit.meta._path, unit.data.type],
            _partType: 'normal.schema',
            _type: getSchemaType(types, children[i].type),
          },
          children: [],
        };
        unit.children.push(child);
        queue.push(child);
      }
    }
  }
  return root;
}
/**
 * 从top遍历每一个item
 * @param {Object} entity entity对象
 * @param {String} name 开始的名称，为null表示从top开始遍历
 * @param {Function} callback 回调
 * @param {number} count 计数
 */
export function eachEntityItem(entity, name, callback, count = 0) {
  if (name === null) {
    name = entity.data.top.name;
  }
  const allSchemas = entity.data.normals.concat([entity.data.top]);
  const schemaType = allSchemas.find((scm) => scm.name === name);
  if (count > 1000) {
    throw new Error('schemas type has a loop.');
  }
  if (!schemaType) {
    return null;
  }
  for (let i = 0; i < schemaType.attrs.length; i++) {
    const attr = schemaType.attrs[i];
    callback(attr, schemaType);
    count += 1;
    eachEntityItem(entity, attr.name, callback, count);
  }
}

function getSubSchemas(name, normals) {
  const schemaData = normals.find((normal) => normal.name === name);
  if (schemaData) {
    return {
      parent: schemaData,
      children: (schemaData.attrs && schemaData.attrs.slice()) || [],
    };
  } else {
    return null;
  }
}

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
 * 获取dom距离浏览器顶部和左侧的距离
 * @param {Dom} elem
 */
export function getDomOffset(elem) {
  if (!elem.getClientRects().length) {
    return { top: 0, left: 0 };
  }
  const rect = elem.getBoundingClientRect();
  const win = elem.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

/**
 * 通过 index 找到schemaPart，并返回这个对象的引用
 * @param {Number} index
 * @param {Object} full
 * @returns {{partType: String, items: Array<Object>}}
 */
export function getSchemaPartByIndex(index, full) {
  let inx = -1;
  // 顶级schema
  if (full.top._index === index) {
    return {
      partType: 'top',
      items: [full.top],
    };
  } else if (
    (inx = full.top.attrs.findIndex((attr) => attr._index === index)) !== -1
  ) {
    return {
      partType: 'top.schema',
      items: [full.top.attrs[inx], full.top],
    };
  } else if (
    (inx = full.normals.findIndex((normal) => normal._index === index)) !== -1
  ) {
    return {
      partType: 'normal',
      items: [full.normals[inx], full.normals],
    };
  } else {
    for (let i = 0; i < full.normals.length; i++) {
      for (let j = 0; j < full.normals[i].attrs.length; j++) {
        const attr = full.normals[i].attrs[j];
        if (attr._index === index) {
          return {
            partType: 'normal.schema',
            items: [attr, full.normals[i]],
          };
        }
      }
    }
    throw new Error(`not found children by index=${index}.`);
  }
}

/**
 * 删除 Schema 树节点
 * @param {Object} tree full tree data
 * @param {String} label 节点的label
 * @param {String} type 节点类型: enum | group
 */
export function removeSchemaTreeNode(tree, label, type) {
  const fields = _.flattenDeep([
    tree.data.top.orders,
    tree.data.normals.map((normal) => normal.orders),
  ]);
  const enumInUse = (label) => {
    return fields.filter((field) => field === label).length > 1;
  };

  if (type === 'enum') {
    const index = tree.data.schemaTypes.findIndex((t) => t.label === label);
    if (!enumInUse(label) && index !== -1) {
      tree.data.schemaTypes.splice(index, 1);
    }
  }
  if (type === 'group') {
    const groupNode = tree.data.normals.find((t) => t.name === label);
    const index = tree.data.normals.findIndex((t) => t.name === label);
    if (index !== -1) {
      groupNode.attrs.forEach((attr) => {
        const index = tree.data.schemaTypes.findIndex(
          (t) => t.label === attr.name,
        );
        if (!enumInUse(attr.name) && index !== -1) {
          tree.data.schemaTypes.splice(index, 1);
        }
      });
      tree.data.normals.splice(index, 1);
    }
  }
}

/**
 * 找到指定 key (默认是meta._index)的node，并返回引用；找不到时返回undefined
 * @param {Object} treeData
 * @param {Number} value
 */
export function getNodeInTreeData(treeData, value, key = 'meta._index') {
  if (!treeData) {
    return;
  }
  let [target] = _.at(treeData, key);
  if (target === value) {
    return treeData;
  } else if (treeData.children) {
    for (let i = 0; i < treeData.children.length; i++) {
      const result = getNodeInTreeData(treeData.children[i], value, key);
      if (result) {
        return result;
      }
    }
  }
}
/**
 * 找到指定 key 的node的父级node，并返回引用；找不到时返回undefined
 * @param {Object} treeData
 * @param {Number} key
 */
export function getNodeInTreeParent(treeData, key, result = {}) {
  if (!treeData) {
    return;
  } else {
    if (_.isArray(treeData.children)) {
      for (let i = 0; i < treeData.children.length; i++) {
        if (treeData.children[i].meta._nodeIndex === key) {
          Object.assign(result, {
            children: treeData.children,
          });
        } else {
          getNodeInTreeParent(treeData.children[i], key, result);
        }
      }
    }
    return result;
  }
}

/**
 * 深度遍历树节点
 * @param {Object} treeNode 树的根节点
 * @param {Function} callback 遍历节点时的回调函数，参数有 node, parent，根node没有parent
 * @param {Object} parent 内部调用传参，初始调用时不需要传值
 */
export function eachTreeNode(treeNode, callback, parent = null, indexes) {
  const result = callback(treeNode, parent, indexes);
  if (result === false) {
    return;
  }
  if (!treeNode) return null;
  if (_.isArray(treeNode.childrenGroup)) {
    for (let i = 0; i < treeNode.childrenGroup.length; i++) {
      const nodeGroup = treeNode.childrenGroup[i];
      for (let j = 0; j < nodeGroup.length; j++) {
        eachTreeNode(nodeGroup[j], callback, treeNode, [i, j]);
      }
    }
  } else {
    const children = treeNode.children || [];
    for (let i = 0; i < children.length; i++) {
      eachTreeNode(children[i], callback, treeNode, [i]);
    }
  }
}

/**
 * 创建一个空的树节点
 */
export function createEmptyTreeNode() {
  return {
    meta: {
      _mode: schema.TREENODE_CREATE, // create or update
      _index: -1,
      _nodeIndex: -1,
      _path: [],
    },
    data: {
      name: '',
      alias: '',
      type: schemaDefaultType,
      required: false,
      multi: true,
    },
  };
}

/**
 * @param {Array} arr
 * @param {Number} oldIndex
 * @param {Number} newIndex
 */
export function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex === oldIndex) {
    return arr;
  }
  var tmp = arr.splice(oldIndex, 1);
  arr.splice(newIndex, 0, tmp[0]);
  return arr;
}

/**
 * 获得枚举/基本类型，如果找不到返回null
 * @param {Array} types 类型数组
 * @param {String} type 类型名称
 */
export const getSchemaType = (types, type) => {
  const basicTypes = types.filter((t) => t.type === 'basic');
  const enumTypes = types.filter((t) => t.type === 'enum');
  const groupTypes = types.filter((t) => t.type === 'group');
  // 对于系统枚举类型需要进行大小写过滤
  for (let i = 0; i < basicTypes.length; i++) {
    if (basicTypes[i].label.toUpperCase() === type.toUpperCase()) {
      return basicTypes[i];
    }
  }
  // 对于用户创建的类型直接比较
  for (let i = 0; i < enumTypes.length; i++) {
    if (enumTypes[i].label === type) {
      return enumTypes[i];
    }
  }
  // 判断是否是组合类型
  for (let i = 0; i < groupTypes.length; i++) {
    if (groupTypes[i].label === type) {
      return groupTypes[i];
    }
  }
  return null;
};
/**
 * 从Entity中获取所有类型，包括basic/enum/group
 * @param {Entity} entity
 */
export const getAllTypesFromEntity = (entity) => {
  const basicTypes = _.map(schemaEnumType, (v) =>
    Object.assign(v, { type: 'basic' }),
  );
  const normalTypes = _.map(entity && entity.data.normals, (normal) => ({
    label: normal.name,
    type: 'group',
  }));
  return [
    ...basicTypes,
    ...entity.data.schemaTypes.map((t) => Object.assign(t, { type: 'enum' })),
    ...normalTypes,
  ];
};

/**
 * Scrolls specified element into view of its parent.
 * @param {Object} element - The element to be visible.
 * @param {Object} spot - An object with optional top and left properties,
 *   specifying the offset from the top left edge.
 * @param {boolean} skipOverflowHiddenElements - Ignore elements that have
 *   the CSS rule `overflow: hidden;` set. The default is false.
 */
export const scrollIntoView = function (
  element,
  spot,
  skipOverflowHiddenElements = false,
) {
  // Assuming offsetParent is available (it's not available when viewer is in
  // hidden iframe or object). We have to scroll: if the offsetParent is not set
  // producing the error. See also animationStarted.
  let parent = element.offsetParent;
  if (!parent) {
    console.error('offsetParent is not set -- cannot scroll');
    return;
  }
  let offsetY = element.offsetTop + element.clientTop;
  let offsetX = element.offsetLeft + element.clientLeft;
  while (
    parent.clientHeight === parent.scrollHeight ||
    (skipOverflowHiddenElements &&
      getComputedStyle(parent).overflow === 'hidden')
  ) {
    if (parent.dataset._scaleY) {
      offsetY /= parent.dataset._scaleY;
      offsetX /= parent.dataset._scaleX;
    }
    offsetY += parent.offsetTop;
    offsetX += parent.offsetLeft;
    parent = parent.offsetParent;
    if (!parent) {
      return; // no need to scroll
    }
  }
  if (spot) {
    if (spot.top !== undefined) {
      offsetY += spot.top;
    }
    if (spot.left !== undefined) {
      offsetX += spot.left;
      parent.scrollLeft = offsetX;
    }
  }
  parent.scrollTop = offsetY;
};

/**
 * 在treeData中增加_mate的parent等属性，修改tree本身
 * @param {Object} tree
 * @param {Object} predictors 训练模型配置列表
 */
export const initTreeData = (tree, predictors = []) => {
  let nodeIndex = 1e3;
  eachTreeNode(tree, (node, parent) => {
    nodeIndex += 1;
    Object.assign(node.meta, {
      _isHide: false,
      _nodeIndex: nodeIndex,
      _deepLabels: parent
        ? parent.meta._deepLabels.concat(node.data.label)
        : [node.data.label],
      _deepIndex: parent ? parent.meta._deepIndex.concat(0) : [],
    });
    // 在treeNode节点上添加_model属性(_model:表示已配置的schema字段训练模型)
    const clonedDeepLabels = _.clone(node.meta._deepLabels);
    clonedDeepLabels.shift();
    const predictorsList = predictors || [];
    const model = predictorsList.find((item) =>
      _.isEqual(item.path, clonedDeepLabels),
    );
    Object.assign(node.data, {
      _model: model,
    });
    if (parent) {
      Object.assign(node.meta, {
        _parent: parent.meta._parent.concat([parent.data.label]),
        _path: [...parent.meta._path, node.data.type],
      });
    } else {
      Object.assign(node.meta, {
        _parent: [],
        _path: [node.data.type],
      });
    }
  });
};

/* eslint-disable no-unused-vars */
/**
 * 检测组合权限是否有效
 * @param {string} permStr 权限组合的字符串，格式为 perm1 或 perm1||perm2
 * @param {Function} checkFn 判断单个权限的是否合法的函数
 */
export function checkPermission(permStr, checkFn) {
  const permissions = permStr.split('||');
  return permissions.some((perm) => checkFn(perm.trim()));
}

/**
 * 从数组对象创建对象(key/value相等)
 * @param {Array<string>} list
 * @param {Object} extraObject
 */
export function createObjectFromArray(list, extraObject) {
  return list.reduce((all, v) => {
    all[v] = v;
    return all;
  }, extraObject || {});
  // return _.reduce(list, );
}

/**
 * 扁平化schema的数据结构
 * @param {Object} schema
 */
export function flattenSchemaData(schema) {
  let flattenSchema = [];
  let originSchema = _.cloneDeep(schema);
  let entity = schemaToEntity(originSchema);
  let { relations } = parseEntityToTree({ data: entity });
  initTreeData(relations.tree);
  eachTreeNode(relations.tree, (node) => {
    flattenSchema.push(node);
  });
  return flattenSchema;
}

/**
 * 从JSON字符串的数组中找到 "key:n"中 n的最大值
 * @param {Array} keys "['a:1', 'b:2', ...]"
 */
export function getMaxIndexInKeys(keys) {
  let maxIndex = 0;
  const regex = /:(\d+)$/;
  for (let i = 0; i < keys.length; i++) {
    let key = null;
    if (_.isString(keys[i])) {
      key = JSON.parse(keys[i]);
    } else if (_.isArray(keys[i])) {
      key = keys[i];
    } else {
      throw new TypeError(`key(${keys[i]}) must be a JSON string or Array`);
    }
    if (key.every((k) => k.match(regex) !== null)) {
      maxIndex = _.chain(key)
        .map((k) => Number(k.match(regex)[1]))
        .push(maxIndex)
        .max()
        .value();
    } else {
      return 0;
    }
  }
  return maxIndex;
}

export function getAnswerIndexFromList(key, answers) {
  return answers.findIndex((answer) => answer.key === key);
}

/**
 * 返回以指定key开头的答案
 * @param {string} key
 * @param {array} answers
 */
export function getAnswersIndexWithStartKey(key, answers) {
  const result = [];
  const subKey = key.slice(0, -1);
  for (let i = answers.length - 1; i >= 0; i--) {
    const answer = answers[i];
    if (answer.key.startsWith(subKey)) {
      result.push(i);
    }
  }
  return result;
}

/**
 * 移除以指定key开头的答案
 * @param {string} key
 * @param {array} answers
 */
export function removeAnswersByStartKey(key, answers) {
  const sortedAnswersIndex = getAnswersIndexWithStartKey(key, answers);
  for (const index of sortedAnswersIndex) {
    answers.splice(index, 1);
  }
}

/**
 * 将 标签 和 索引 组合为key
 * @param {Array} labels
 * @param {Array} indexes
 */
export function mixDeepInfo(...args) {
  let labels = null;
  let indexes = null;
  if (args.length === 2) {
    [labels, indexes] = args;
  } else {
    labels = args[0]._deepLabels;
    indexes = args[0]._deepIndex;
  }
  return labels.map(
    (item, index) =>
      item + ':' + (typeof indexes[index] === 'number' ? indexes[index] : 0),
  );
}

/**
 * 更新树节点的deepIndex
 * @param {*} tree
 */
export function updateDeepIndex(tree) {
  eachTreeNode(tree, (node, parent, indexes) => {
    if (parent && _.isArray(parent.childrenGroup)) {
      Object.assign(node.meta, {
        _deepIndex: parent.meta._deepIndex.concat(indexes[0]),
      });
    }
  });
}

/**
 * 移除数组JSON格式中每项逗号后的空格并将unicode实体转为字符（用于后台预测答案所生成的key）
 * @param {*} jsonStr
 */
export function normalizeArrayJSON(jsonStr) {
  return JSON.stringify(JSON.parse(jsonStr));
}

/**
 * 将后台传递unicode编码过的key转为没有空格、没有unicode码的key
 */
export function parsePresetAnswerKey(presetAnswers) {
  return presetAnswers.map((answer) => {
    return Object.assign(answer, {
      key: normalizeArrayJSON(answer.key),
    });
  });
}

export function changeAnswerLastIndex(key, lastIndex) {
  if (typeof key === 'string') {
    key = JSON.parse(key);
  }
  key[key.length - 1] = key[key.length - 1].replace(/\d+$/, lastIndex);
  return JSON.stringify(key);
}

/**
 * 新增/更新schema时过滤多余属性，只保留name、data、predictors
 */
export function filterSchemaParams(schema) {
  const data = {
    name: schema.name,
    data: schema.data,
    predictors: schema.predictors || [],
  };
  if (platformPerimeter.isCmfchinaEnv()) {
    data.group_ids = schema.group_ids || [];
  }
  if (schema.model_name !== '') {
    data.model_name = schema.model_name;
  }
  return data;
}

export function getUrlQueryValue(queryName) {
  const reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
}

export function isValidBase64URL(str) {
  try {
    return Base64.encodeURL(Base64.decode(str)) === str;
  } catch (error) {
    return false;
  }
}

export function parseQueryFromBase64EncodedUrl(base64EncodedUrl) {
  const decodedBase64Url = Base64.decode(base64EncodedUrl);
  const urlObj = new URL(decodedBase64Url, window.location.origin);
  const params = new URLSearchParams(urlObj.search);
  const query = {};
  params.forEach((value, key) => {
    if (typeof value === 'string' && !isNaN(parseInt(value, 10))) {
      query[key] = Number(value);
    } else {
      query[key] = value;
    }
  });

  return query;
}

export function downloadFileByBlob(response) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([response.data]);
    if (response.headers['content-type'] === 'application/json') {
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.onload = (e) => {
        const result = JSON.parse(e.target.result);
        reject({ message: result.message || result.data });
      };
      reader.onerror = (err) => {
        reject({ message: err });
      };
    } else {
      const filename = decodeURI(
        response.headers['content-disposition'].split('filename=')[1],
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      resolve();
    }
  });
}

/**
 * 使用轮询请求的方式下载文件，http状态码为204时表示内容未生成，开始轮询，直到状态码为200时停止轮询并下载文件
 * @param {function} requestFunc - 轮询请求的函数，返回Promise对象
 * @param {number} [interval=5000] - 轮询间隔时间（毫秒），默认5秒
 * @param {number} [timeout=3600000] - 超时时间（毫秒），默认60分钟，超时后轮询终止
 */
export function downloadFileByPolling(
  requestFunc,
  { interval = 5000, timeout = 3600000 } = {},
) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const poll = async () => {
      try {
        const response = await requestFunc();
        if (!response) {
          resolve();
          return;
        }

        if (response.status === 204) {
          // do nothing, just wait for the next interval
        } else if (response.status === 200) {
          await downloadFileByBlob(response);
          resolve();
          return;
        } else {
          reject(response);
          return;
        }

        const nowTime = Date.now();
        if (nowTime - startTime > timeout) {
          reject(new Error('Polling request timeout.'));
          return;
        }

        // wait for the interval before the next poll
        await new Promise((resolve) => setTimeout(resolve, interval));
        poll();
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

export function tree2list(tree) {
  let list = [];
  tree.forEach((item) => {
    list.push(item);
    if (item.children && item.children.length) {
      list = list.concat(tree2list(item.children));
    }
  });
  return list;
}

export function getCookie(cookieName) {
  const strCookie = document.cookie;
  const cookieList = strCookie.split(';');
  for (let i = 0; i < cookieList.length; i++) {
    const arr = cookieList[i].split('=');
    if (cookieName === arr[0].trim()) {
      return arr[1];
    }
  }
  return '';
}

export function getSortParams(prop, order) {
  let sortParams = {};
  if (order) {
    const order_by = `${order === 'descending' ? '-' : ''}${prop}`;
    sortParams = { order_by };
  } else {
    sortParams = {};
  }
  return sortParams;
}

export function parseSortParams(sortParams, defaultSort) {
  if (_.isEmpty(sortParams)) {
    return defaultSort || { prop: null, order: null };
  }
  const orderBy = sortParams.order_by;
  if (orderBy.startsWith('-')) {
    return {
      prop: orderBy.substring(1),
      order: 'descending',
    };
  } else {
    return {
      prop: orderBy,
      order: 'ascending',
    };
  }
}

export function convertObjectValueToNumber(obj) {
  if (_.isObject(obj)) {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && !isNaN(obj[key])) {
        obj[key] = Number(obj[key]);
      }
    }
  }
  return obj;
}

export function checkUploadFileSize(size, maxSize, translate = false) {
  const fileSize = size / 1024 / 1024;
  if (fileSize > maxSize) {
    let message = `上传文件大小不能超过${maxSize}MB`;
    let title = '提示';
    if (translate) {
      message = t.message['文件大小不能超过{fileMaxSize}MB'].replace(
        '{fileMaxSize}',
        maxSize,
      );
      title = t.message['提示'];
    }
    notify({
      title,
      message,
      type: 'warning',
    });
    return false;
  }
  return true;
}

export function checkUploadFileType(name, acceptTypes) {
  const suffix = name.substring(name.lastIndexOf('.')).toLowerCase();
  if (!acceptTypes.split(',').includes(suffix)) {
    notify({
      title: t.message['提示'],
      message: t.message['文件类型不支持，请重新选择'],
      type: 'warning',
    });
    return;
  }
  return true;
}

export function checkUploadFile(file, acceptTypes, maxSize, translate = false) {
  const { size, name } = file;
  const isCheckedType = checkUploadFileType(name, acceptTypes);
  if (!isCheckedType) {
    return;
  }
  const isCheckedSize = checkUploadFileSize(size, maxSize, translate);
  if (!isCheckedSize) {
    return;
  }
  return true;
}

export function getAcceptFileTypes(supportedSuffixes) {
  const uppercaseSuffixes = supportedSuffixes
    .split(',')
    .map((suffix) => suffix.toUpperCase())
    .join(',');
  return `${supportedSuffixes},${uppercaseSuffixes}`;
}

export function isUploadZipFile(file) {
  const { name } = file;
  const fileSuffixes = ['.zip', '.tar', '.7z'];
  const fileType = name.substr(name.lastIndexOf('.')).toLowerCase();
  return fileSuffixes.includes(fileType);
}

export function getAnswerItemMd5(key, item) {
  if (!item) {
    return md5(key);
  }
  return md5(
    key +
      '-' +
      JSON.stringify({
        boxes: item.boxes,
      }),
  );
}

/**
 * 轮询
 * @param callback {() => Promise<any>}
 * @param time {number}
 * @param config {{ leading?: boolean, queue?: boolean }}
 * @returns {(function(): void)|*} 关闭轮询
 */
export const polling = (callback, time, config = {}) => {
  let closed = false;
  let timer = null;
  config = {
    leading: config.leading ?? true,
    queue: config.queue ?? true,
  };

  const tick = async () => {
    if (closed) {
      return;
    }
    try {
      if (config.leading || timer) {
        if (config.queue) {
          await callback();
        } else {
          callback().catch(console.error);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      timer = setTimeout(() => {
        tick();
      }, time);
    }
  };

  tick();

  return function close() {
    closed = true;
  };
};

export * from './answer-translate';
