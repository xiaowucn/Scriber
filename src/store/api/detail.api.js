import { http, baseURL, uploadTimeout } from './http';
import platformPerimeter from '@/perimeters/platform.perimeter';

/**
 * 通过project_name和dir_version获取对应的pid和tree_id
 * 中诚信定制接口
 */
export const fetchProjectMeta = (projectName, dirVersion) =>
  http.get(`/plugins/ccxi/project/${projectName}/tree/${dirVersion}`);

/**
 * 获取项目默认信息
 */
export const fetchDefaultProject = (params) =>
  http.get('/plugins/fileapi/tree/default', { params });

/**
 * 获取目录下所有的文件（夹）
 */
export const fetchFileList = (treeId, params = { page: 1, size: 20 }) =>
  http.get(`/plugins/fileapi/tree/${treeId}`, { params });

/**
 * 创建文件夹
 * @param {Number} parentId 父文件夹id
 * @param {String} folderName 子文件夹名称
 */
export const createFolder = (parentId, data) =>
  http.post(`/plugins/fileapi/tree/${parentId}/tree`, data);

/**
 * 上传文件
 * @param {Number} treeId tree_id
 */
export const uploadFile = (treeId, data, onUploadProgress) => {
  let url = `/plugins/fileapi/tree/${treeId}/file`;
  if (platformPerimeter.isCcxiEnv()) {
    url = `/plugins/ccxi/tree/${treeId}/file`;
  }
  return http.request({
    url,
    method: 'post',
    data,
    onUploadProgress,
    timeout: uploadTimeout,
  });
};

/**
 * CGS上传文件
 * @param {Number} dirId dirId
 */
export const uploadFileWithTaskType = (dirId, data, onUploadProgress) =>
  http.request({
    url: `/plugins/fileapi/tree/${dirId}/file`,
    method: 'post',
    data: data,
    onUploadProgress: onUploadProgress,
    timeout: uploadTimeout,
  });

/**
 * 删除文件/目录
 * @param {Boolean} isDir 是否是目录
 * @param {String} fileId 文件id
 */
export const deleteFile = (isDir, fileId) => {
  let url;
  if (isDir) {
    url = `plugins/fileapi/tree`;
  } else {
    url = `plugins/fileapi/file`;
  }

  return http.delete(`/${url}/${fileId}`);
};
/**
 * 重命名文件夹
 * @param {Number} id 文件夹id
 * @param {String} name 文件夹名
 * @param {Array} molds Schema
 */
export const updateDir = (id, data) =>
  http.put(`/plugins/fileapi/tree/${id}`, data);

/**
 * 修改文件（文件名和标签）
 * @param {Number} id 文件ID
 * @param {String} name 文件名
 * @param {Array} molds mold类型
 */
export const updateFile = (id, data) => {
  let url = `/plugins/fileapi/file/${id}`;
  if (platformPerimeter.isCcxiEnv()) {
    url = `/plugins/ccxi/file/${id}`;
  }
  return http.put(url, data);
};

/**
 * 检查文件夹下是否有重名文件
 * @param {Number} dirId 文件夹id
 * @param {String} name 文件名
 */
export const checkFileName = (dirId, name) =>
  http.get(`/plugins/fileapi/tree/${dirId}/name/${name}`);

/**
 * 锁定文件
 * @param {Number} qid
 */
export const lockFile = (qid) => http.put(`/question/${qid}/lock`);

/**
 * 获取box的文本
 * @param {Number} fileId
 * @param {Object} data
 * @param {Boolean} isWithBox
 */
export const fetchBoxText = (fileId, data, isWithBox) => {
  let baseUrl = `/plugins/fileapi/file/${fileId}/text_in_box`;
  let url = !isWithBox ? baseUrl : `${baseUrl}?with_box=true`;
  return http.post(url, data);
};

/**
 * 获取table外框、内线
 * @param {Number} fileId
 * @param {Number} page
 */
export const fetchTables = (fileId, page) => {
  return http.get(`/plugins/fileapi/files/${fileId}/tables`, {
    params: {
      page,
    },
  });
};

/**
 * 获取所有元素块位置信息
 * @param {Number} fileId
 * @param {Number} page
 */
export const fetchOutlines = (fileId, page) => {
  return http.get(`/plugins/fileapi/files/${fileId}/outlines`, {
    params: {
      page,
    },
  });
};

/**
 * 提交题目答案
 * @param {Number} qid
 * @param {Object} data
 * @param {Number} type
 */
export const sendQuestionAnswer = (qid, data, type) =>
  http.post(`/question/${qid}/answer?save_data_only=${type}`, data);

/**
 * 获取指定目录下所有的文件
 * @param {Number} treeId
 * @param {Number} mold
 */
export const fetchTreeFiles = (treeId, mold) =>
  http.get(`/plugins/fileapi/tree/${treeId}/file`, {
    params: {
      mold,
    },
  });

/**
 * 获取文件信息
 * @param {Number} fileId
 * @returns
 */

export const getFileInfo = (fileId) =>
  http.get(`/plugins/fileapi/files/${fileId}`);

/**
 * 获取文件下载链接
 * @param {Number} fileId
 * @returns
 */
export const getFileDownloadUrl = (fileId) =>
  `${baseURL}/plugins/fileapi/file/${fileId}`;
