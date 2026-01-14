import store from '@/store';

export function convertObjectTreeToArray(data, parentKey = '') {
  return Object.entries(data).map(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}-${key}` : key;
    const node = {
      value: key,
      key: currentKey,
    };

    if (
      typeof value === 'object' &&
      Object.keys(value).length > 0 &&
      !('拆分' in value)
    ) {
      node.children = convertObjectTreeToArray(value, currentKey);
    }

    return node;
  });
}

export function removeLastLevelChildren(data) {
  return data
    .filter((node) => {
      if (node.children && node.children.length > 0) {
        // 递归处理子节点
        node.children = removeLastLevelChildren(node.children);
        return true; // 保留有子节点的节点
      } else {
        return false; // 移除最后一层子节点
      }
    })
    .map((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      }
      return node;
    });
}

export function getFirstChildNodePath(data) {
  if (Array.isArray(data) && data.length > 0) {
    const firstNode = data[0];
    if (firstNode.children && firstNode.children.length > 0) {
      return [firstNode.value, ...getFirstChildNodePath(firstNode.children)]; // 使用递归获取子节点的路径
    } else if (firstNode.value) {
      return [firstNode.value];
    }
  }
  return [];
}

export function isCiticsTgAllow(item) {
  const user = store.getters['loginUser'];
  const paramPerms = user.param_perms;
  return paramPerms.includes(item);
}

export function answerText(data) {
  return data.text || data.boxes.map((box) => box.text).join('');
}

export function getCollapseTitle(key) {
  const param = JSON.parse(key)[1];
  const text = param.split(':')[0];
  const matches = text.match(/(.+)(?=\()/);
  if (matches) {
    return matches[1];
  }
  return text;
}

export function getItemHasToValueError(data) {
  const hasError = data.find((item) => item.to_value_error);
  return hasError;
}
