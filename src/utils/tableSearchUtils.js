import { isEmpty, isEqual } from 'lodash';

// ========== 通用工具方法 ==========

/**
 * 解析字符串值，尝试 JSON 解析，失败则返回原字符串
 * @param {string} str - 要解析的字符串
 * @returns {any} 解析后的值
 */
function parseValue(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

/**
 * 序列化参数对象，将对象类型的值转换为 JSON 字符串
 * @param {Object} params - 要序列化的参数对象
 * @returns {Object} 序列化后的参数对象
 */
function serializeParams(params) {
  const serializedParams = {};
  for (const key in params) {
    if (typeof params[key] === 'object') {
      serializedParams[key] = JSON.stringify(params[key]);
    } else {
      serializedParams[key] = params[key];
    }
  }
  return serializedParams;
}

/**
 * 格式化查询参数，解析所有值
 * @param {Object} query - 查询参数对象
 * @returns {Object} 格式化后的查询参数
 */
function formatQueryParams(query) {
  const formattedQuery = { ...query };
  for (const key in formattedQuery) {
    formattedQuery[key] = parseValue(formattedQuery[key]);
  }
  return formattedQuery;
}

// ========== URL 参数相关方法 ==========

/**
 * 更新 URL 参数
 * @param {Object} ctx - Vue 组件上下文
 * @param {Object} searchParams - 搜索参数
 */
export function updateSearchParams(ctx, searchParams) {
  const oldSearchParams = formatQueryParams(ctx.$router.currentRoute.query);
  if (isEqual(searchParams, oldSearchParams)) {
    return;
  }
  if (!isEmpty(searchParams)) {
    const replaceParams = serializeParams(searchParams);
    ctx.$router.replace({ query: replaceParams });
  } else if (!isEmpty(oldSearchParams)) {
    ctx.$router.replace({ query: {} });
  }
}

/**
 * 回填 URL 参数到搜索条件
 * 分页数据回填，必须给分页组件加v-if="total > 0"判断，避免数据回填不生效
 * @param {Object} ctx - Vue 组件上下文
 * @param {Object} searchParams - 搜索参数对象
 * @param {Object} currentQuery - 当前查询参数（可选）
 */
export function fillSearchParamsFromURL(ctx, searchParams, currentQuery) {
  currentQuery = currentQuery || ctx.$router.currentRoute.query;
  Object.assign(searchParams, formatQueryParams(currentQuery));
}

// ===== sessionStorage 方法 =====

// 固定的存储键名
const DEFAULT_STORAGE_KEY = 'SCRIBER_SEARCH_PARAMS';

/**
 * 将搜索参数对象存储到 sessionStorage
 * @param {Object} searchParamsObject - 要存储的搜索参数对象
 * @returns {boolean} 存储是否成功
 */
export function storeSearchParamsToSession(searchParamsObject) {
  try {
    if (!searchParamsObject || typeof searchParamsObject !== 'object') {
      console.warn(
        'storeSearchParamsToSession: searchParamsObject must be an object',
      );
      return false;
    }

    const serializedData = JSON.stringify(searchParamsObject);
    sessionStorage.setItem(DEFAULT_STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Failed to store search params to sessionStorage:', error);
    return false;
  }
}

/**
 * 从 sessionStorage 获取搜索参数对象
 * @param {Object} [defaultValue={}] - 默认返回值
 * @returns {Object} 搜索参数对象
 */
export function getSearchParamsFromSession(searchParams) {
  try {
    const storedData = sessionStorage.getItem(DEFAULT_STORAGE_KEY);

    if (!storedData) {
      return {};
    }

    const parsedData = JSON.parse(storedData);
    if (parsedData && typeof parsedData === 'object') {
      Object.assign(searchParams, parsedData);
    }
  } catch (error) {
    console.error('Failed to get search params from sessionStorage:', error);
    return {};
  }
}

/**
 * 删除 sessionStorage 中的搜索参数对象
 * @returns {boolean} 删除是否成功
 */
export function removeSearchParamsFromSession() {
  try {
    sessionStorage.removeItem(DEFAULT_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to remove search params from sessionStorage:', error);
    return false;
  }
}
