import _ from 'lodash';
import {
  detail as detailApi,
  cgs as cgsApi,
  citicsDCM as citicsDCMApi,
  cmfchina as cmfchinaApi,
  nafmii as nafmiiApi,
} from '../api';
import platformPerimeter from '@/perimeters/platform.perimeter';
import { fetchFileList } from '../api/citics-tg.api';
import { setDownloadUrl } from '@/custom/cgs/utils';

const state = {
  fileViewer: {
    isLoading: false,
    filePath: [], // 文件路径    [{name: 'IPO', id: 1}]
    curDirId: -1, // 当前显示文件列表的id，-1显示所有项目
    files: [], // 文件列表
    current: null,
    uploadMap: {},
    pager: {
      page: 1,
      size: 20,
      total: 0,
    },
    currentFileIsReadonly: false, // 当前批注的文件是否是只读状态（海通）
    // LLM 配置默认选项
    defaultOptions: {
      default_scenario_id: null,
      default_task_type: null,
      default_molds: [],
    },
  },
};

const getters = {
  fileViewer: (state) => state.fileViewer,
};

const mutations = {
  SET_FILES: (state, files = []) => {
    if (
      platformPerimeter.isCmfchinaEnv() ||
      platformPerimeter.isNafmiiEnv() ||
      platformPerimeter.isCgsEnv()
    ) {
      state.fileViewer.files = files;
    } else {
      state.fileViewer.files = files.slice().sort((file1, file2) => {
        return file1.id < file2.id ? 1 : -1;
      });
    }
    state.fileViewer.files.forEach((file) => {
      if (file.questions) {
        file.questions.sort((a, b) => b.mold - a.mold);
      }
    });
  },
  SET_FILES_PAGER: (state, pager) => {
    state.fileViewer.pager = pager;
  },
  SET_DEFAULT_OPTIONS: (state, options) => {
    state.fileViewer.defaultOptions = options;
  },
  SET_DIR_ID: (state, dirId) => {
    if (dirId === -1) {
      resetFileViewer(state);
      return;
    }
    state.fileViewer.curDirId = dirId;
  },
  SET_LOADING: (state, isLoading) => {
    state.fileViewer.isLoading = isLoading;
  },
  SET_FILEPATH: (state, filePath) => {
    state.fileViewer.filePath = filePath.slice();
  },
  SET_MOLDS: (state, molds) => {
    state.fileViewer.molds = molds;
  },
  SET_CUR_FILE: (state, file) => {
    state.fileViewer.current = _.cloneDeep(file);
  },
  SET_CURRENT_FILE_READONLY: (state, status) => {
    state.fileViewer.currentFileIsReadonly = status;
  },
};

const actions = {
  /**
   * 获取目录下所有的文件（夹）
   */
  async fetchFileList(
    { commit, state, rootState },
    { needLoading, isAuto, isCustom, projectId, search_fid } = {
      needLoading: true,
      isAuto: false,
      isCustom: false,
      search_fid: -1,
    },
  ) {
    try {
      if (needLoading) {
        commit('SET_LOADING', true);
      }

      let fetchFileListApi = detailApi.fetchFileList;
      const hasSearchParams =
        Object.values(rootState.fileModule.fileSearchParams).length > 0;

      if (platformPerimeter.isCgsEnv()) {
        if (hasSearchParams) {
          fetchFileListApi = cgsApi.fetchFilesByStatus;
        } else {
          fetchFileListApi = cgsApi.fetchFileList;
        }
      }
      if (platformPerimeter.isCiticsTGEnv() && isCustom) {
        fetchFileListApi = fetchFileList;
      }
      if (platformPerimeter.isCiticsDCMEnv()) {
        fetchFileListApi = citicsDCMApi.fetchFileList;
      }
      if (platformPerimeter.isCmfchinaEnv()) {
        fetchFileListApi = cmfchinaApi.fetchFiles;
      }
      if (platformPerimeter.isNafmiiEnv()) {
        if (hasSearchParams) {
          fetchFileListApi = nafmiiApi.searchFiles;
        } else {
          fetchFileListApi = nafmiiApi.fetchFiles;
        }
      }

      let res = null;

      if (hasSearchParams) {
        res = await fetchFileListApi(
          projectId,
          _.omit(
            {
              ...state.fileViewer.pager,
              ...rootState.fileModule.fileSearchParams,
              ...rootState.fileModule.fileSortParams,
              search_fid: search_fid === -1 ? undefined : search_fid,
            },
            'total',
          ),
          isAuto,
        );
      } else {
        res = await fetchFileListApi(
          state.fileViewer.curDirId,
          _.omit(
            {
              ...state.fileViewer.pager,
              ...rootState.projectModule.projectSearchParams,
              ...rootState.fileModule.fileSortParams,
              search_fid: search_fid === -1 ? undefined : search_fid,
            },
            'total',
          ),
          isAuto,
        );
      }
      const data = res.data || res;
      const files = data.files || data.items;
      data.files = files.map((file) => {
        file.fileType = file.name;
        file.isDir = false;
        file.public = data.project_public;
        file.download = detailApi.getFileDownloadUrl(file.id);
        return file;
      });
      if (platformPerimeter.isCgsEnv()) {
        setDownloadUrl(data.files);
      }
      data.trees = data.trees || [];
      data.files = data.files || [];
      data.trees = data.trees.map((folder) => {
        folder.fileType = 'folder';
        folder.isDir = true;
        return folder;
      });
      if (
        !platformPerimeter.isCmfchinaEnv() &&
        !platformPerimeter.isNafmiiEnv() &&
        !platformPerimeter.isCgsEnv()
      ) {
        data.trees.sort(sortFileList);
        data.files.sort(sortFileList);
      }
      const allList = [...data.trees, ...data.files];
      const crumbs = data.crumbs || [];
      const molds = data.default_molds || [];
      const pager = {
        page: data.page || state.fileViewer.pager.page,
        size: state.fileViewer.pager.size,
        total: data.total,
      };
      commit('SET_FILES', allList);
      commit('SET_MOLDS', molds);
      if (crumbs.length > 0) {
        commit('SET_FILEPATH', crumbs);
      }
      commit('SET_FILES_PAGER', pager);
      const { default_scenario_id, default_task_type, default_molds } = data;

      // 使用递归查找逻辑获取默认配置
      const defaultOptions = findDefaultOptionsFromPath(crumbs, {
        default_scenario_id,
        default_task_type,
        default_molds: default_molds || [],
      });

      commit('SET_DEFAULT_OPTIONS', defaultOptions);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (needLoading) {
        commit('SET_LOADING', false);
      }
    }
  },
  /**
   * 锁定文件
   */
  async lockFile(context, { fileId }) {
    await detailApi.lockFile(fileId);
  },
  /**
   * 获取box的文本
   */
  fetchBoxText(context, { fileId, data, isWithBox }) {
    if (!isWithBox) {
      return detailApi.fetchBoxText(fileId, data);
    } else {
      return detailApi.fetchBoxText(fileId, data, isWithBox);
    }
  },
  /**
   * 提交题目答案
   */
  async sendQuestionAnswer(context, { qid, data, type }) {
    await detailApi.sendQuestionAnswer(qid, data, type);
  },
  /**
   * 创建子目录
   */
  async createFolder({ dispatch, state }, { folderName, params }) {
    const res = await detailApi.checkFileName(
      state.fileViewer.curDirId,
      folderName,
    );
    if (res.data.exists) {
      if (platformPerimeter.isNafmiiEnv()) {
        throw new Error('文件夹已存在，请勿重复创建');
      } else {
        throw new Error(
          this._vm.i18n.t(`message['文件名重复，已有']`) + `"${folderName}"`,
        );
      }
    }
    if (platformPerimeter.isCmfchinaEnv()) {
      await cmfchinaApi.createCatalog(state.fileViewer.curDirId, params);
    } else {
      await detailApi.createFolder(state.fileViewer.curDirId, params);
    }
    await dispatch('fetchFileList');
  },

  // 上传文件
  async uploadFile({ dispatch }, { treeId, data, onUploadProgress }) {
    await detailApi.uploadFile(treeId, data, onUploadProgress);
    await dispatch('fetchFileList');
  },
  // 上传文件
  async uploadFileWithTaskType(
    { dispatch },
    { dirId, data, onUploadProgress },
  ) {
    await detailApi.uploadFileWithTaskType(dirId, data, onUploadProgress);
    await dispatch('fetchFileList');
  },

  /**
   * 删除文件（夹）
   */
  async deleteFile(context, { fileId, isDir, from }) {
    if (!_.isNumber(fileId)) {
      throw new TypeError(`文件id=${fileId}不是一个有效的数字`);
    }
    if (platformPerimeter.isNafmiiEnv()) {
      let data = { tree_ids: [], file_ids: [] };
      if (isDir) {
        data.tree_ids.push(fileId);
      } else {
        data.file_ids.push(fileId);
      }
      await nafmiiApi.deleteFiles(data, from);
    } else {
      await detailApi.deleteFile(isDir, fileId);
    }
    // await dispatch('fetchFileList');
  },
  /**
   * 更新文件夹信息
   */
  async updateFolder(context, data) {
    const {
      id,
      name,
      oldName,
      default_molds,
      default_task_type,
      default_scenario_id,
      group_ids,
    } = data;
    if (oldName && name.trim() === oldName.trim()) {
      return;
    }

    if (platformPerimeter.isCmfchinaEnv()) {
      const updateData = {
        name,
        default_molds,
      };
      if (group_ids) {
        updateData.group_ids = group_ids;
      }
      await cmfchinaApi.updateCatalog(id, updateData);
    } else {
      const updateData = {
        name,
        default_molds,
      };
      if (default_task_type !== undefined) {
        updateData.default_task_type = default_task_type;
      }
      if (default_scenario_id !== undefined) {
        updateData.default_scenario_id = default_scenario_id;
      }
      await detailApi.updateDir(id, updateData);
    }
  },

  /**
   * 更新文件信息
   */
  async updateFileInfo(context, data) {
    const { id, name, molds, tags, scenario_id, task_type } = data;

    const updateData = {
      name,
      molds,
      tags,
    };

    if (scenario_id !== undefined) {
      updateData.scenario_id = scenario_id;
    }

    if (task_type !== undefined) {
      updateData.task_type = task_type;
    }

    await detailApi.updateFile(id, updateData);
  },
  /**
   * 获取当前文件路径
   */
  async fetchFilePath({ commit }, { treeId }) {
    let fetchFileListApi = detailApi.fetchFileList;
    if (platformPerimeter.isCgsEnv()) {
      fetchFileListApi = cgsApi.fetchFileList;
    }

    const { data } = await fetchFileListApi(treeId);

    commit('SET_FILEPATH', data.crumbs);

    return data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

/**
 * 从文件路径向上级目录递归查找默认配置
 * @param {Array} filePath - 文件路径数组，格式为 [{name: 'IPO', id: 1, default_molds: [], default_scenario_id: '', default_task_type: ''}]
 * @param {Object} currentData - 当前目录的配置数据
 * @returns {Object} 找到的默认配置
 */
function findDefaultOptionsFromPath(filePath, currentData) {
  // 检查当前目录的配置是否满足条件
  const hasValidConfig = (config) => {
    return (
      (config.default_molds && config.default_molds.length > 0) ||
      (config.default_scenario_id &&
        config.default_scenario_id !== null &&
        config.default_scenario_id !== '') ||
      (config.default_task_type &&
        config.default_task_type !== null &&
        config.default_task_type !== '')
    );
  };

  // 首先检查当前目录的配置
  if (hasValidConfig(currentData)) {
    return {
      default_scenario_id: currentData.default_scenario_id || null,
      default_task_type: currentData.default_task_type || null,
      default_molds: currentData.default_molds || [],
    };
  }

  // 从文件路径的最后一级开始向上查找
  for (let i = filePath.length - 1; i >= 0; i--) {
    const pathItem = filePath[i];
    if (hasValidConfig(pathItem)) {
      return {
        default_scenario_id: pathItem.default_scenario_id || null,
        default_task_type: pathItem.default_task_type || null,
        default_molds: pathItem.default_molds || [],
      };
    }
  }

  // 如果都没有找到，返回默认的空值
  return {
    default_scenario_id: null,
    default_task_type: null,
    default_molds: [],
  };
}

function resetFileViewer(state) {
  state.fileViewer.isLoading = false;
  state.fileViewer.filePath = [];
  state.fileViewer.curDirId = -1;
  state.fileViewer.files = [];
  state.fileViewer.current = null;
}

/**
 * 文件列表排序
 */
function sortFileList(a, b) {
  if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  }
  return 0;
}
